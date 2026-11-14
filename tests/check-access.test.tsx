import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import React, { act } from 'react';
import handler from '../api/check-access';
import { UserProvider, useUser } from '../src/context/UserContext';
import { SubscriptionModal } from '../src/components/SubscriptionModal';

// ---- Server: /api/check-access against a mock Stripe (no network, no real key) ----
type Customer = { id: string; email: string; statuses: string[] };
let stripe: Customer[] = [];
let stripeDown = false;
let searchDown = false;
const stripeCalls: string[] = [];
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
const mockStripe = async (input: any, init?: any) => {
  const url = new URL(String(input));
  assert.equal(url.origin, 'https://api.stripe.com');
  assert.equal(init?.headers?.Authorization, 'Bearer sk_test_only');
  stripeCalls.push(url.pathname);
  if (stripeDown) return json({ error: {} }, 500);
  if (url.pathname === '/v1/customers') return json({ data: stripe.filter((c) => c.email === url.searchParams.get('email')) });
  if (url.pathname === '/v1/customers/search') {
    if (searchDown) return json({ error: {} }, 403);
    const wanted = /^email:"(.+)"$/.exec(url.searchParams.get('query') || '')?.[1];
    return json({ data: stripe.filter((c) => c.email.toLowerCase().includes(String(wanted))) });
  }
  if (url.pathname === '/v1/subscriptions') {
    const customer = stripe.find((c) => c.id === url.searchParams.get('customer'));
    return json({ data: (customer?.statuses || []).map((status) => ({ status })) });
  }
  return json({}, 404);
};
let ipCounter = 0;
const call = async (body: any, method = 'POST', ip = `10.0.0.${++ipCounter}`) => {
  const result: any = { status: 200 };
  await handler({ method, body, headers: { 'x-forwarded-for': `${ip}, 172.16.0.1` } }, { setHeader() {}, status(n: number) { result.status = n; return this; }, json(data: any) { result.body = data; return this; } });
  return result;
};

globalThis.fetch = mockStripe as any;
delete process.env.STRIPE_SECRET_KEY;
assert.equal((await call({ email: 'a@b.co' }, 'GET')).status, 405);
assert.equal((await call({ email: 'a@b.co' })).status, 503, 'No key configured');
process.env.FREE_ACCESS_EMAILS = ' Sobrino1@Example.com, sobrino2@example.com;\nsobrino3@example.com ';
for (const email of ['sobrino1@example.com', 'SOBRINO2@example.com', 'sobrino3@example.com']) assert.deepEqual((await call({ email })).body, { active: true }, 'Invited emails need no payment');
assert.equal((await call({ email: 'sobrino4@example.com' })).status, 503, 'Not invited, and Stripe is not configured');
process.env.STRIPE_SECRET_KEY = ' sk_test_only ';
for (const body of [undefined, {}, { email: 5 }, { email: 'no-at-sign' }, { email: 'a@b' }, { email: 'a b@c.co' }, { email: 'a"b@c.co' }, { email: `${'a'.repeat(250)}@b.co` }]) {
  assert.equal((await call(body)).status, 400);
}
assert.equal(stripeCalls.length, 0, 'Invalid requests never reach Stripe');
assert.deepEqual((await call({ email: 'sobrino1@example.com' })).body, { active: true });
assert.equal(stripeCalls.length, 0, 'Invited emails are answered without asking Stripe');
delete process.env.FREE_ACCESS_EMAILS;

stripe = [
  { id: 'cus_paid', email: 'paid@example.com', statuses: ['canceled', 'active'] },
  { id: 'cus_trial', email: 'trial@example.com', statuses: ['trialing'] },
  { id: 'cus_gone', email: 'gone@example.com', statuses: ['canceled'] },
  { id: 'cus_due', email: 'due@example.com', statuses: ['past_due', 'incomplete'] },
  { id: 'cus_none', email: 'none@example.com', statuses: [] },
  { id: 'cus_caps', email: 'Patty40774@Gmail.com', statuses: ['active'] },
  { id: 'cus_other', email: 'xpaid2@example.com', statuses: ['active'] },
];
assert.deepEqual((await call({ email: 'paid@example.com' })).body, { active: true });
assert.deepEqual((await call({ email: '  PAID@Example.com ' })).body, { active: true }, 'Typed with capitals');
assert.deepEqual((await call({ email: 'trial@example.com' })).body, { active: true });
assert.deepEqual((await call({ email: 'patty40774@gmail.com' })).body, { active: true }, 'Checkout email had capitals');
for (const email of ['gone@example.com', 'due@example.com', 'none@example.com', 'stranger@example.com', 'paid2@example.com']) {
  const result = await call({ email });
  assert.equal(result.status, 200);
  assert.deepEqual(result.body, { active: false }, email);
}
searchDown = true;
assert.deepEqual((await call({ email: 'paid@example.com' })).body, { active: true }, 'Search is only a fallback');
assert.deepEqual((await call({ email: 'stranger@example.com' })).body, { active: false });
searchDown = false;
stripeDown = true;
assert.equal((await call({ email: 'paid@example.com' })).status, 502, 'A Stripe outage is not reported as "no subscription"');
stripeDown = false;
for (let attempt = 0; attempt < 10; attempt++) assert.equal((await call({ email: 'paid@example.com' }, 'POST', '203.0.113.9')).status, 200);
assert.equal((await call({ email: 'paid@example.com' }, 'POST', '203.0.113.9')).status, 429);
assert.equal((await call({ email: 'paid@example.com' }, 'POST', '203.0.113.10')).status, 200, 'Limits are per visitor');

// ---- Browser: membership unlocks only after the server confirms the email ----
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'https://example.test/?payment_success=true' });
for (const name of ['window', 'document', 'localStorage', 'HTMLElement', 'Element', 'Node', 'MutationObserver', 'getComputedStyle']) Object.defineProperty(globalThis, name, { value: (dom.window as any)[name], configurable: true });
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, requestAnimationFrame: (f: any) => setTimeout(f, 0), cancelAnimationFrame: clearTimeout });
dom.window.matchMedia = () => ({ matches: false, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; }, media: '' });

let answer: () => Response = () => json({ active: false });
const asked: string[] = [];
globalThis.fetch = (async (input: any, init?: any) => {
  assert.equal(String(input), '/api/check-access');
  asked.push(JSON.parse(init.body).email);
  return answer();
}) as any;

let user: ReturnType<typeof useUser>;
function Probe() { user = useUser(); return null; }
// Loaded after the DOM exists so React handles typing the way a browser does.
const { createRoot } = await import('react-dom/client');
let root = createRoot(document.getElementById('root')!);
const render = async () => { await act(async () => { root.render(<UserProvider><Probe /><SubscriptionModal onClose={() => {}} /></UserProvider>); }); };
const reset = async () => { await act(async () => root.unmount()); document.getElementById('root')!.innerHTML = ''; root = createRoot(document.getElementById('root')!); };
const text = () => document.body.textContent || '';
const settle = async () => { await act(async () => { await new Promise((resolve) => setTimeout(resolve, 0)); }); };
const submit = async (email: string) => {
  const input = document.querySelector<HTMLInputElement>('#membership-verify-email')!;
  await act(async () => {
    Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, 'value')!.set!.call(input, email);
    input.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  });
  await act(async () => { input.form!.querySelector<HTMLButtonElement>('button[type="submit"]')!.click(); });
  await settle();
};

// Returning from checkout asks for the email; the URL alone unlocks nothing.
await render();
assert.equal(user!.isPro, false, 'A URL parameter is not proof of payment');
assert.equal(user!.pendingEmailVerification, true);
assert.equal(dom.window.location.search, '', 'The parameter is removed from the address');
assert(text().includes('Thanks for your payment!'));
assert(document.querySelector('#membership-verify-email'), 'Email box is open after checkout');
assert.equal(asked.length, 0);

await submit('learner@localhost');
assert.equal(asked.length, 0, 'Invalid emails are not sent');
assert(text().includes('Please enter a valid email address.'));
assert.equal(user!.isPro, false);

await submit('stranger@example.com');
assert(text().includes("We couldn't find an active subscription for that email."));
assert.equal(user!.isPro, false);

answer = () => json({ error: 'down' }, 502);
await submit('paid@example.com');
assert(text().includes("We couldn't verify your subscription right now."));
answer = () => json({ error: 'slow down' }, 429);
await submit('paid@example.com');
assert(text().includes('Too many attempts.'));
answer = () => new Response('<html>sign in</html>', { status: 200, headers: { 'content-type': 'text/html' } });
await submit('paid@example.com');
assert.equal(user!.isPro, false, 'A non-JSON page is never treated as confirmation');

answer = () => json({ active: true });
await submit('  Paid@Example.com ');
assert.equal(asked.at(-1), 'paid@example.com');
assert.equal(user!.isPro, true, 'Confirmed by the server');
assert.equal(user!.verifiedEmail, 'paid@example.com');
assert.equal(user!.pendingEmailVerification, false);
assert(text().includes('Your All-Access Pass is Active!'));
assert.equal(localStorage.getItem('tensemaster_verified_email'), 'paid@example.com');

// Next visit: still unlocked, and re-checked with Stripe. A connection problem keeps access.
await reset();
asked.length = 0;
answer = () => json({ error: 'down' }, 502);
await render();
await settle();
assert.deepEqual(asked, ['paid@example.com']);
assert.equal(user!.isPro, true, 'An outage does not lock a paying learner out');

// Canceled in Stripe: access is removed on the next visit.
await reset();
answer = () => json({ active: false });
await render();
await settle();
assert.equal(user!.isPro, false, 'Canceled subscription loses access');
assert.equal(localStorage.getItem('tensemaster_verified_email'), null);

// Saved "Stripe" membership without a verified email (old URL shortcut or edited browser data) is not accepted.
await reset();
const saved = JSON.parse(localStorage.getItem('tensemaster_user_progress_v2')!);
saved.subscription = { ...saved.subscription, isPro: true, paymentMethod: 'Stripe', priceUSD: 5.99 };
localStorage.setItem('tensemaster_user_progress_v2', JSON.stringify(saved));
asked.length = 0;
await render();
await settle();
assert.equal(user!.isPro, false);
assert.equal(asked.length, 0);
assert(!text().toLowerCase().includes('promo'), 'No code box: codes cannot unlock the course');
assert.equal('subscribeWithPromoCode' in user!, false);
assert(!document.querySelector('input'), 'Email box stays closed until the learner asks for it');
await act(async () => { [...document.querySelectorAll('button')].find((button) => button.textContent!.includes('Already paid?'))!.click(); });
assert(document.querySelector('#membership-verify-email'));
await reset();

// A membership saved earlier from a promo code no longer counts.
saved.subscription = { ...saved.subscription, isPro: true, paymentMethod: 'Promo Code', priceUSD: 5.99 };
localStorage.setItem('tensemaster_user_progress_v2', JSON.stringify(saved));
localStorage.setItem('tensemaster_verified_email', 'someone@example.com');
answer = () => json({ active: false });
await render();
await settle();
assert.equal(user!.isPro, false, 'Promo-code memberships are not accepted');
await reset();

console.log('PASS: Paid access is confirmed with Stripe by email (active, trial, canceled, capital letters, outages, limits, invited emails); the checkout URL, promo codes and saved browser data unlock nothing.');
