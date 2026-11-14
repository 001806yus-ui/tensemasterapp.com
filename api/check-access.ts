// Server-side check of a paid membership: looks the email up in Stripe and
// reports whether it has an active subscription. The browser never decides
// this on its own (a URL parameter or saved browser data is not proof of payment).
// Uses Stripe's REST API directly, so no extra package is needed.
//
// FREE_ACCESS_EMAILS (optional, server setting): emails the owner invites for
// free, separated by commas. They are never sent to the browser or stored in code.
const STRIPE_API = 'https://api.stripe.com/v1';
const EMAIL = /^[^\s@"'\\<>]+@[^\s@"'\\<>]+\.[^\s@"'\\<>]+$/;
const ACTIVE = new Set(['active', 'trialing']);
const windows = new Map<string, { start: number; count: number }>();

async function stripeGet(path: string, params: Record<string, string>, key: string) {
  const response = await fetch(`${STRIPE_API}${path}?${new URLSearchParams(params)}`, {
    headers: { Authorization: `Bearer ${key}` },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`Stripe responded ${response.status} for ${path}`);
  return response.json();
}

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });

  const now = Date.now();
  for (const [key, value] of windows) if (now - value.start > 60000) windows.delete(key);
  const forwarded = req.headers?.['x-forwarded-for'];
  const ip = req.headers?.['x-real-ip'] || (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : '') || req.ip || req.socket?.remoteAddress || 'unknown';
  if (!windows.has(ip) && windows.size >= 1000) return res.status(429).json({ error: 'The service is busy. Please try again shortly.' });
  const bucket = windows.get(ip) || { start: now, count: 0 };
  if (bucket.count >= 10) return res.status(429).json({ error: 'Too many attempts. Please wait a minute and try again.' });
  bucket.count++; windows.set(ip, bucket);

  const typed = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
  if (!typed || typed.length > 254 || !EMAIL.test(typed)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const invited = (process.env.FREE_ACCESS_EMAILS || '').split(/[\s,;]+/).map((email) => email.toLowerCase()).filter(Boolean);
  if (invited.includes(typed.toLowerCase())) return res.status(200).json({ active: true });

  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) {
    return res.status(503).json({ error: 'Payment verification is not configured on the server.' });
  }

  try {
    const lower = typed.toLowerCase();
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

    // The list filter is immediate but matches the email exactly as it was
    // typed at checkout, so try it as typed and in lowercase.
    for (const email of new Set([typed, lower])) {
      const customers = await stripeGet('/customers', { email, limit: '20' }, secretKey);
      if (await hasActiveSubscription(customers.data || [])) return res.status(200).json({ active: true });
    }

    // Search ignores upper/lower case (a new payment can take about a minute to appear).
    try {
      const found = await stripeGet('/customers/search', { query: `email:"${lower}"`, limit: '20' }, secretKey);
      const sameEmail = (found.data || []).filter((customer: any) => typeof customer.email === 'string' && customer.email.toLowerCase() === lower);
      if (await hasActiveSubscription(sameEmail)) return res.status(200).json({ active: true });
    } catch (error) {
      console.error('check-access search fallback failed:', error);
    }

    return res.status(200).json({ active: false });
  } catch (error) {
    console.error('check-access error:', error);
    return res.status(502).json({ error: 'The subscription could not be verified right now. Please try again later.' });
  }
}
