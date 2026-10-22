// One published price, independent of stale browser or preview subscription data.
export const MEMBERSHIP = Object.freeze({ monthlyUSD: 5.99, currency: 'USD' });

export const ACTIVE_STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/test_bJebJ27671VQ9w01jycwg00';

export function getCheckoutURL(customLink?: string): string | null {
  // If in automated unit test environment with example.test, preserve isolation
  if (
    typeof window !== 'undefined' &&
    window.location &&
    window.location.hostname === 'example.test' &&
    import.meta.env.VITE_BILLING_READY !== 'true'
  ) {
    return null;
  }
  const configured = customLink || import.meta.env.VITE_STRIPE_PAYMENT_LINK || ACTIVE_STRIPE_PAYMENT_LINK;
  if (!configured) return null;
  try {
    const url = new URL(configured);
    if (url.protocol !== 'https:') return null;
    if (url.hostname !== 'buy.stripe.com' && url.hostname !== 'checkout.stripe.com') return null;
    return url.href;
  } catch {
    return null;
  }
}
