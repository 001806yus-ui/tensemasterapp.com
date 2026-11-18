import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';
import React, { act } from 'react';
import loginCode from '../api/login-code';
import loginVerify from '../api/login-verify';
import lessons from '../api/lessons';
import translate from '../api/translate';
import premiumCatalog from '../src/server/premiumCatalog.json';
import catalog from '../src/i18n/catalog.json';
import { PREMIUM_TENSES } from '../src/server/premiumTenses';
import { createSession, signingKey } from '../src/server/session';

// ---- Mock Stripe and Resend (no network, no real keys) ----
type Customer = { id: string; email: string; statuses: string[] };
let stripe: Customer[] = [];
let stripeDown = false;
let emailDown = false;
const sentCodes = new Map<string, string>();
let stripeCalls = 0;
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
const providers = async (input: any, init?: any) => {
  const url = new URL(String(input));
  if (url.origin === 'https://api.resend.com') {
    assert.equal(init?.headers?.Authorization, 'Bearer re_test_only');
    if (emailDown) return json({ message: 'domain not verified' }, 403);
    const body = JSON.parse(init.body);
    sentCodes.set(body.to[0], /\b(\d{6})\b/.exec(body.text)![1]);
    return json({ id: 'email_1' });
  }
  assert.equal(url.origin, 'https://api.stripe.com');
  stripeCalls++;
  if (stripeDown) return json({ error: {} }, 500);
  if (url.pathname === '/v1/customers') return json({ data: stripe.filter((c) => c.email === url.searchParams.get('email')) });
  if (url.pathname === '/v1/customers/search') {
    const wanted = /^email:"(.+)"$/.exec(url.searchParams.get('query') || '')?.[1];
    return json({ data: stripe.filter((c) => c.email.toLowerCase() === wanted) });
  }
  if (url.pathname === '/v1/subscriptions') return json({ data: (stripe.find((c) => c.id === url.searchParams.get('customer'))?.statuses || []).map((status) => ({ status })) });
  return json({}, 404);
};
globalThis.fetch = providers as any;

let ip = 0;
const call = async (handler: any, { method = 'POST', body, token }: { method?: string; body?: any; token?: string } = {}) => {
  const result: any = { status: 200 };
  const headers: any = { 'x-forwarded-for': `10.1.0.${++ip}` };
  if (token) headers.authorization = `Bearer ${token}`;
  await handler({ method, body, headers }, { setHeader() {}, status(n: number) { result.status = n; return this; }, json(data: any) { result.body = data; return this; } });
  return result;
};

for (const name of ['SESSION_SECRET', 'STRIPE_SECRET_KEY', 'RESEND_API_KEY', 'FREE_ACCESS_EMAILS']) delete process.env[name];
assert.equal((await call(loginCode, { body: { email: 'a@b.co' } })).status, 503, 'Nothing configured');
process.env.RESEND_API_KEY = 're_test_only';
assert.equal((await call(loginCode, { body: { email: 'a@b.co' } })).status, 503, 'No way to check payments yet');

process.env.SESSION_SECRET = 'test-only-secret';
process.env.STRIPE_SECRET_KEY = 'sk_test_only';
process.env.FREE_ACCESS_EMAILS = 'Sobrino@Example.com, prima@example.com';
stripe = [
  { id: 'cus_paid', email: 'Patty40774@Gmail.com', statuses: ['canceled', 'active'] },
  { id: 'cus_gone', email: 'gone@example.com', statuses: ['canceled'] },
];
for (const email of [undefined, 5, 'no-at', 'a@b', 'a"b@c.co']) assert.equal((await call(loginCode, { body: { email } })).status, 400);
assert.equal((await call(loginCode, { method: 'GET' })).status, 405);

// Not paying: no code is sent.
let r = await call(loginCode, { body: { email: 'gone@example.com' } });
assert.deepEqual(r.body, { status: 'no-subscription' });
assert.equal(sentCodes.size, 0);

// Paying (email typed differently from checkout) and invited emails get a code.
r = await call(loginCode, { body: { email: ' patty40774@gmail.com ' } });
assert.equal(r.body.status, 'code-sent');
const pattyChallenge = r.body.challenge;
assert(!JSON.stringify(r.body).includes(sentCodes.get('patty40774@gmail.com')!), 'The code is only in the email');
const invitedCalls = stripeCalls;
r = await call(loginCode, { body: { email: 'SOBRINO@example.com' } });
assert.equal(r.body.status, 'code-sent');
assert.equal(stripeCalls, invitedCalls, 'Invited emails do not need Stripe');

// Wrong, malformed and tampered codes fail; the right one returns a session.
const realCode = sentCodes.get('patty40774@gmail.com')!;
const wrongCode = String((Number(realCode) + 1) % 1_000_000).padStart(6, '0');
assert.equal((await call(loginVerify, { body: { challenge: pattyChallenge, code: wrongCode } })).status, 400);
assert.equal((await call(loginVerify, { body: { challenge: pattyChallenge, code: 'abc' } })).status, 400);
const [body, sig] = pattyChallenge.split('.');
const forged = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(body, 'base64url').toString()), e: 'attacker@example.com' })).toString('base64url') + '.' + sig;
assert.equal((await call(loginVerify, { body: { challenge: forged, code: realCode } })).status, 400, 'A challenge cannot be edited');
r = await call(loginVerify, { body: { challenge: pattyChallenge, code: realCode } });
assert.equal(r.status, 200);
assert.equal(r.body.email, 'patty40774@gmail.com');
const session = r.body.token;
assert.equal((await call(loginVerify, { body: { challenge: session, code: realCode } })).status, 400, 'A session is not a code challenge');

// Lessons: only for a valid session with access.
assert.equal((await call(lessons, { method: 'GET' })).status, 401);
assert.equal((await call(lessons, { method: 'GET', token: pattyChallenge })).status, 401, 'A code challenge is not a session');
assert.equal((await call(lessons, { method: 'GET', token: session.slice(0, -2) + 'xx' })).status, 401);
r = await call(lessons, { method: 'GET', token: session });
assert.equal(r.status, 200);
assert.equal(r.body.lessons.length, 10);
assert(r.body.lessons.every((lesson: any) => lesson.exercises.length === 11 && lesson.exercises[0].prompt));
stripeDown = true;
assert.equal((await call(lessons, { method: 'GET', token: session })).status, 200, 'A Stripe outage does not lock out a signed-in member');
stripeDown = false;
stripe[0].statuses = ['canceled'];
assert.equal((await call(lessons, { method: 'GET', token: session })).status, 403, 'Canceled: the lessons stop');
stripe[0].statuses = ['active'];
const otherKey = (() => { process.env.SESSION_SECRET = 'another-secret'; const t = createSession('patty40774@gmail.com', signingKey()!); process.env.SESSION_SECRET = 'test-only-secret'; return t; })();
assert.equal((await call(lessons, { method: 'GET', token: otherKey })).status, 401, 'Sessions signed with another key are rejected');

// Email failures are reported, not hidden.
emailDown = true;
assert.equal((await call(loginCode, { body: { email: 'prima@example.com' } })).status, 502);
emailDown = false;

// Rate limit per visitor.
const limited = async () => { const res: any = {}; await loginVerify({ method: 'POST', body: {}, headers: { 'x-forwarded-for': '203.0.113.50' } }, { setHeader() {}, status(n: number) { res.status = n; return this; }, json() { return this; } }); return res.status; };
for (let i = 0; i < 10; i++) assert.equal(await limited(), 400);
assert.equal(await limited(), 429);

// Members-only lesson text is translated only for members.
const premiumKey = Object.keys(premiumCatalog)[0];
assert.equal((await call(translate, { body: { language: 'en', keys: [premiumKey] } })).status, 401);
assert.equal((await call(translate, { body: { language: 'en', keys: [premiumKey] }, token: session })).status, 200);

// ---- The browser never ships the members' lessons ----
const files: string[] = [];
const walk = (dir: string) => { for (const name of readdirSync(dir)) { const path = join(dir, name); if (statSync(path).isDirectory()) { if (name !== 'server') walk(path); } else if (/\.(tsx?|json)$/.test(name)) files.push(path); } };
walk(join(process.cwd(), 'src'));
for (const file of files) assert(!/from ['"][^'"]*\/server\//.test(readFileSync(file, 'utf8')), `Browser code must not import server files: ${file}`);
const sample = PREMIUM_TENSES[0].exercises[3].explanation;
assert(files.every((file) => !readFileSync(file, 'utf8').includes(sample)), 'Paid exercise text is not in browser files');
assert(Object.values(catalog).every((text) => !Object.values(premiumCatalog).includes(text)));

// ---- The app: sign in with a code, then the paid lessons unlock ----
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'https://example.test/?payment_success=true' });
for (const name of ['window', 'document', 'localStorage', 'HTMLElement', 'Element', 'Node', 'MutationObserver', 'getComputedStyle']) Object.defineProperty(globalThis, name, { value: (dom.window as any)[name], configurable: true });
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, requestAnimationFrame: (f: any) => setTimeout(f, 0), cancelAnimationFrame: clearTimeout });
dom.window.matchMedia = () => ({ matches: false, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; }, media: '' });

// The app talks to the real handlers above through this fetch.
const routes: Record<string, any> = { '/api/login-code': loginCode, '/api/login-verify': loginVerify, '/api/lessons': lessons, '/api/translate': translate };
const appCalls: string[] = [];
globalThis.fetch = (async (input: any, init?: any) => {
  const path = String(input);
  if (!routes[path]) return providers(input, init);
  appCalls.push(path);
  const headers = Object.fromEntries(Object.entries(init?.headers || {}).map(([k, v]) => [k.toLowerCase(), v]));
  headers['x-forwarded-for'] = `10.2.0.${++ip}`;
  let status = 200; let payload: any = null;
  await routes[path]({ method: init?.method || 'GET', body: init?.body ? JSON.parse(init.body) : undefined, headers }, { setHeader() {}, status(n: number) { status = n; return this; }, json(data: any) { payload = data; return this; } });
  return json(payload, status);
}) as any;

const { UserProvider, useUser } = await import('../src/context/UserContext');
const { SubscriptionModal } = await import('../src/components/SubscriptionModal');
const { ChatbotView } = await import('../src/components/ChatbotView');
const { ALL_12_TENSES } = await import('../src/data/tensesData');
const { createRoot } = await import('react-dom/client');

let user: any;
function Probe() { user = useUser(); return null; }
let root = createRoot(document.getElementById('root')!);
const render = async (extra: React.ReactNode = null) => { await act(async () => { root.render(<UserProvider><Probe /><SubscriptionModal onClose={() => {}} />{extra}</UserProvider>); }); };
const reset = async () => { await act(async () => root.unmount()); document.getElementById('root')!.innerHTML = ''; root = createRoot(document.getElementById('root')!); };
const text = () => document.body.textContent || '';
const settle = async () => { for (let i = 0; i < 5; i++) await act(async () => { await new Promise((resolve) => setTimeout(resolve, 0)); }); };
const type = async (selector: string, value: string) => {
  const input = document.querySelector<HTMLInputElement>(selector)!;
  await act(async () => {
    Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, 'value')!.set!.call(input, value);
    input.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  });
  await act(async () => { input.form!.querySelector<HTMLButtonElement>('button[type="submit"]')!.click(); });
  await settle();
};
const locked = ALL_12_TENSES.find((tense: any) => tense.id === 'present-perfect')!;

await render(<ChatbotView locked={true} onOpenSubscription={() => {}} />);
assert.equal(user.isPro, false, 'The checkout URL alone unlocks nothing');
assert.equal(dom.window.location.search, '');
assert(text().includes('Thanks for your payment!'));
assert(text().includes('The AI tutor is part of the All-Access membership.'));
assert.equal(locked.exercises[0].prompt, '', 'Paid lessons start as previews');
assert.equal(locked.exercises.length, 11, 'Previews keep the exercise count');

await type('#membership-verify-email', 'gone@example.com');
assert(text().includes("We couldn't find an active subscription"));
await type('#membership-verify-email', 'Patty40774@gmail.com');
assert(text().includes('We sent a 6-digit code to patty40774@gmail.com'));
await type('#membership-code', '000000' === sentCodes.get('patty40774@gmail.com') ? '111111' : '000000');
assert(text().includes('That code is not correct'));
assert.equal(user.isPro, false);
await type('#membership-code', sentCodes.get('patty40774@gmail.com')!);
assert.equal(user.isPro, true, 'Right code: unlocked');
assert.equal(user.memberEmail, 'patty40774@gmail.com');
assert(text().includes('Your All-Access Pass is Active!'));
assert(text().includes('Signed in as patty40774@gmail.com'));
assert(locked.exercises[0].prompt.length > 0, 'The full lesson was installed');
assert.equal(locked.exercises[0].prompt, PREMIUM_TENSES.find((t) => t.id === 'present-perfect')!.exercises[0].prompt);

// Next visit: the session is remembered and the lessons load again.
await reset();
appCalls.length = 0;
await render();
await settle();
assert.equal(user.isPro, true);
assert.deepEqual(appCalls, ['/api/lessons']);

// Canceled in Stripe: locked again on the next visit, and the session is removed.
await reset();
stripe[0].statuses = ['canceled'];
await render();
await settle();
assert.equal(user.isPro, false);
assert.equal(locked.exercises[0].prompt, '', 'Lessons go back to previews');
assert.equal(localStorage.getItem('tensemaster_session_v1'), null);
stripe[0].statuses = ['active'];

// Saved browser data cannot unlock anything.
await reset();
const saved = JSON.parse(localStorage.getItem('tensemaster_user_progress_v2')!);
saved.subscription = { ...saved.subscription, isPro: true, paymentMethod: 'Stripe', priceUSD: 5.99 };
localStorage.setItem('tensemaster_user_progress_v2', JSON.stringify(saved));
localStorage.setItem('tensemaster_verified_email', 'patty40774@gmail.com');
localStorage.setItem('tensemaster_session_v1', 'forged.token');
await render();
await settle();
assert.equal(user.isPro, false);
assert.equal(localStorage.getItem('tensemaster_session_v1'), null, 'A forged session is discarded');
assert.equal(localStorage.getItem('tensemaster_verified_email'), null, 'Old-version data is cleaned up');

// Sign out.
await reset();
localStorage.setItem('tensemaster_session_v1', session);
await render();
await settle();
assert.equal(user.isPro, true);
await act(async () => { [...document.querySelectorAll('button')].find((b) => b.textContent!.includes('Sign out'))!.click(); });
assert.equal(user.isPro, false);
assert.equal(locked.exercises[0].prompt, '');
await reset();

console.log('PASS: Members sign in with an emailed code; paid lessons and the tutor are served only to active members; checkout URLs, saved browser data and forged sessions unlock nothing.');
