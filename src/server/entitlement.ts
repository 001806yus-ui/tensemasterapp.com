// Who may use the membership: emails the owner invites for free
// (FREE_ACCESS_EMAILS) and emails with an active Stripe subscription.
const STRIPE_API = 'https://api.stripe.com/v1';
const ACTIVE = new Set(['active', 'trialing']);
export const EMAIL = /^[^\s@"'\\<>]+@[^\s@"'\\<>]+\.[^\s@"'\\<>]+$/;

export type Entitlement = 'active' | 'none';

export class BillingUnavailable extends Error {
  constructor(message: string) { super(message); this.name = 'BillingUnavailable'; }
}

export const normalizeEmail = (value: unknown) => typeof value === 'string' ? value.trim().toLowerCase() : '';
export const isValidEmail = (email: string) => !!email && email.length <= 254 && EMAIL.test(email);

export function isInvited(email: string): boolean {
  const invited = (process.env.FREE_ACCESS_EMAILS || '').split(/[\s,;]+/).map((item) => item.toLowerCase()).filter(Boolean);
  return invited.includes(email.toLowerCase());
}

async function stripeGet(path: string, params: Record<string, string>, key: string) {
  const response = await fetch(`${STRIPE_API}${path}?${new URLSearchParams(params)}`, {
    headers: { Authorization: `Bearer ${key}` },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new BillingUnavailable(`Stripe responded ${response.status} for ${path}`);
  return response.json();
}

// Throws BillingUnavailable when Stripe cannot be asked (not configured or down).
export async function checkEntitlement(typed: string): Promise<Entitlement> {
  const email = typed.trim();
  if (isInvited(email)) return 'active';
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) throw new BillingUnavailable('STRIPE_SECRET_KEY is not configured');

  const lower = email.toLowerCase();
  const checked = new Set<string>();
  const hasActiveSubscription = async (customers: any[]) => {
    for (const customer of customers) {
      if (!customer?.id || checked.has(customer.id)) continue;
      checked.add(customer.id);
      const subscriptions = await stripeGet('/subscriptions', { customer: customer.id, status: 'all', limit: '20' }, secretKey);
      if ((subscriptions.data || []).some((subscription: any) => ACTIVE.has(subscription.status))) return true;
    }
    return false;
  };

  try {
    // The list filter is immediate but matches the email exactly as it was typed at checkout.
    for (const candidate of new Set([email, lower])) {
      const customers = await stripeGet('/customers', { email: candidate, limit: '20' }, secretKey);
      if (await hasActiveSubscription(customers.data || [])) return 'active';
    }
  } catch (error) {
    if (error instanceof BillingUnavailable) throw error;
    throw new BillingUnavailable(String((error as Error)?.message ?? error));
  }

  // Search ignores upper/lower case (a new payment can take about a minute to appear).
  try {
    const found = await stripeGet('/customers/search', { query: `email:"${lower}"`, limit: '20' }, secretKey);
    const sameEmail = (found.data || []).filter((customer: any) => typeof customer.email === 'string' && customer.email.toLowerCase() === lower);
    if (await hasActiveSubscription(sameEmail)) return 'active';
  } catch (error) {
    console.error('entitlement search fallback failed:', error);
  }
  return 'none';
}

// Simple per-visitor limit kept in this server instance.
export function rateLimiter(perMinute: number) {
  const windows = new Map<string, { start: number; count: number }>();
  return (req: any): boolean => {
    const now = Date.now();
    for (const [key, value] of windows) if (now - value.start > 60000) windows.delete(key);
    const forwarded = req.headers?.['x-forwarded-for'];
    const ip = req.headers?.['x-real-ip'] || (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : '') || req.ip || req.socket?.remoteAddress || 'unknown';
    if (!windows.has(ip) && windows.size >= 1000) return false;
    const bucket = windows.get(ip) || { start: now, count: 0 };
    if (bucket.count >= perMinute) return false;
    bucket.count++; windows.set(ip, bucket);
    return true;
  };
}
