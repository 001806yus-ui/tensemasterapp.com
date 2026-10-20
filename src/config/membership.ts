// One published price, independent of stale browser or preview subscription data.
export const MEMBERSHIP = Object.freeze({ monthlyUSD: 5.99, currency: 'USD' });
export function getCheckoutURL(): string | null {
  // Enable only after server-verified billing and account access are implemented.
  if (import.meta.env.VITE_BILLING_READY !== 'true') return null;
  const configured = import.meta.env.VITE_STRIPE_PAYMENT_LINK;
  if (!configured) return null;
  try {
    const url = new URL(configured);
    if (url.protocol !== 'https:' || url.hostname !== 'buy.stripe.com' || url.pathname.startsWith('/test_')) return null;
    return url.href;
  } catch { return null; }
}
