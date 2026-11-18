// Signed tokens for email sign-in. No database: the server signs what it
// issues and checks the signature when it comes back.
//   code challenge: proves a 6-digit code was emailed to this address (10 minutes)
//   session:        proves the person entered that code (30 days)
import { createHash, createHmac, randomInt, timingSafeEqual } from 'node:crypto';

export const CODE_MINUTES = 10;
export const SESSION_DAYS = 30;

type Payload = { t: 'code' | 'session'; e: string; x: number; h?: string };

// SESSION_SECRET is used when set; otherwise a key derived from the server's other secrets.
export function signingKey(): Buffer | null {
  const explicit = process.env.SESSION_SECRET?.trim();
  if (explicit) return createHash('sha256').update('tensemaster-session:' + explicit).digest();
  const derived = [process.env.STRIPE_SECRET_KEY, process.env.RESEND_API_KEY].map((value) => value?.trim() || '').join('|');
  if (derived === '|') return null;
  return createHash('sha256').update('tensemaster-session-derived:' + derived).digest();
}

const b64 = (data: Buffer | string) => Buffer.from(data).toString('base64url');
const mac = (key: Buffer, text: string) => createHmac('sha256', key).update(text).digest();
const same = (a: Buffer, b: Buffer) => a.length === b.length && timingSafeEqual(a, b);
const now = () => Math.floor(Date.now() / 1000);

function sign(payload: Payload, key: Buffer) {
  const body = b64(JSON.stringify(payload));
  return `${body}.${b64(mac(key, body))}`;
}

function read(token: unknown, key: Buffer): Payload | null {
  if (typeof token !== 'string' || token.length > 1000) return null;
  const [body, signature, extra] = token.split('.');
  if (!body || !signature || extra !== undefined) return null;
  if (!same(Buffer.from(signature, 'base64url'), mac(key, body))) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (typeof payload?.e !== 'string' || typeof payload?.x !== 'number' || payload.x < now()) return null;
    return payload;
  } catch {
    return null;
  }
}

const codeHash = (key: Buffer, email: string, code: string) => b64(mac(key, `code:${email}:${code}`));

export function newCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, '0');
}

export function createCodeChallenge(email: string, code: string, key: Buffer): string {
  return sign({ t: 'code', e: email, x: now() + CODE_MINUTES * 60, h: codeHash(key, email, code) }, key);
}

// Returns the email when the code matches the challenge and has not expired.
export function checkCode(challenge: unknown, code: unknown, key: Buffer): string | null {
  if (typeof code !== 'string' || !/^\d{6}$/.test(code.trim())) return null;
  const payload = read(challenge, key);
  if (!payload || payload.t !== 'code' || typeof payload.h !== 'string') return null;
  return same(Buffer.from(payload.h), Buffer.from(codeHash(key, payload.e, code.trim()))) ? payload.e : null;
}

export function createSession(email: string, key: Buffer): string {
  return sign({ t: 'session', e: email, x: now() + SESSION_DAYS * 24 * 3600 }, key);
}

export function readSession(token: unknown, key: Buffer): string | null {
  const payload = read(token, key);
  return payload?.t === 'session' ? payload.e : null;
}

// Reads "Authorization: Bearer <token>" from a request.
export function sessionEmail(req: any): string | null {
  const key = signingKey();
  const header = req?.headers?.authorization ?? req?.headers?.Authorization;
  if (!key || typeof header !== 'string' || !header.startsWith('Bearer ')) return null;
  return readSession(header.slice(7).trim(), key);
}
