// Step 1 of sign-in: checks that the email has access (invited or active Stripe
// subscription) and emails it a 6-digit code. Returns a signed challenge that
// step 2 (/api/login-verify) needs together with the code.
import { BillingUnavailable, checkEntitlement, isValidEmail, normalizeEmail, rateLimiter } from '../src/server/entitlement.js';
import { CODE_MINUTES, createCodeChallenge, newCode, signingKey } from '../src/server/session.js';
import { EmailUnavailable, emailConfigured, sendSignInCode } from '../src/server/email.js';

const allow = rateLimiter(6);

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });
  if (!allow(req)) return res.status(429).json({ error: 'too-many-attempts' });

  const email = normalizeEmail(req.body?.email);
  if (!isValidEmail(email)) return res.status(400).json({ error: 'invalid-email' });

  const key = signingKey();
  if (!key || !emailConfigured()) return res.status(503).json({ error: 'not-configured' });

  try {
    const entitlement = await checkEntitlement(email);
    if (entitlement !== 'active') return res.status(200).json({ status: 'no-subscription' });
    const code = newCode();
    await sendSignInCode(email, code, CODE_MINUTES);
    return res.status(200).json({ status: 'code-sent', challenge: createCodeChallenge(email, code, key) });
  } catch (error) {
    console.error('login-code error:', String((error as Error)?.message ?? error).slice(0, 300));
    if (error instanceof BillingUnavailable && !process.env.STRIPE_SECRET_KEY?.trim()) return res.status(503).json({ error: 'not-configured' });
    if (error instanceof BillingUnavailable || error instanceof EmailUnavailable) return res.status(502).json({ error: 'unavailable' });
    return res.status(502).json({ error: 'unavailable' });
  }
}
