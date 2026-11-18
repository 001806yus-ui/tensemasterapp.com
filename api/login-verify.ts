// Step 2 of sign-in: checks the emailed code and returns a 30-day session.
import { rateLimiter } from '../src/server/entitlement.js';
import { checkCode, createSession, signingKey } from '../src/server/session.js';

const allow = rateLimiter(10);

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });
  if (!allow(req)) return res.status(429).json({ error: 'too-many-attempts' });
  const key = signingKey();
  if (!key) return res.status(503).json({ error: 'not-configured' });
  const email = checkCode(req.body?.challenge, req.body?.code, key);
  if (!email) return res.status(400).json({ error: 'wrong-code' });
  return res.status(200).json({ token: createSession(email, key), email });
}
