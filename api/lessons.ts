// Delivers the ten membership lessons (and their translation text) to a
// signed-in member. Access is re-checked with Stripe on every load, so a
// canceled subscription stops working the next time the app opens.
import { PREMIUM_TENSES } from '../src/server/premiumTenses.js';
import premiumSource from '../src/server/premiumSource.json' with { type: 'json' };
import premiumCatalog from '../src/server/premiumCatalog.json' with { type: 'json' };
import { BillingUnavailable, checkEntitlement, rateLimiter } from '../src/server/entitlement.js';
import { sessionEmail } from '../src/server/session.js';

const allow = rateLimiter(30);

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Use GET.' });
  if (!allow(req)) return res.status(429).json({ error: 'too-many-attempts' });
  const email = sessionEmail(req);
  if (!email) return res.status(401).json({ error: 'signed-out' });
  try {
    if (await checkEntitlement(email) !== 'active') return res.status(403).json({ error: 'no-subscription' });
  } catch (error) {
    // Stripe could not be asked: a valid signed session is enough until it can.
    if (!(error instanceof BillingUnavailable)) throw error;
    console.error('lessons: billing check unavailable, trusting the session:', error.message.slice(0, 200));
  }
  return res.status(200).json({ email, lessons: PREMIUM_TENSES, source: premiumSource, catalog: premiumCatalog });
}
