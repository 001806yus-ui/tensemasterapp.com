import assert from 'node:assert/strict';
import handler from '../api/chat';
import { createSession, signingKey } from '../src/server/session';

// The tutor tries backup models when one is busy, retired or out of quota,
// stops at once on a bad key, and logs the reason without the student's text.
type Step = (model: string) => any;
let script: Step = () => { throw new Error('unset'); };
const calls: string[] = [];
// Answers like the Gemini REST API, so the real library turns failures into its own errors.
globalThis.fetch = (async (input: any) => {
  const model = /models\/([^:/?]+):generateContent/.exec(String(input?.url ?? input))?.[1] ?? 'unknown';
  calls.push(model);
  try {
    const result = await script(model);
    return new Response(JSON.stringify({ candidates: [{ content: { role: 'model', parts: [{ text: result.text }] }, finishReason: 'STOP' }] }), { status: 200, headers: { 'content-type': 'application/json' } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: { code: error.status, message: error.message, status: error.status === 429 ? 'RESOURCE_EXHAUSTED' : 'ERROR' } }), { status: error.status, headers: { 'content-type': 'application/json' } });
  }
}) as any;
const logs: string[] = [];
console.error = (...args: any[]) => { logs.push(args.join(' ')); };
const good = { text: JSON.stringify({ replyEnglish: 'Nice! What did you do there?', replyTranslation: '¡Bien!', hasErrors: false, feedbackSummary: 'Correct.', detectedTenses: ['Past Simple'], suggestedReplies: ['I played.'] }) };
const fail = (status: number, message = 'provider failure') => Object.assign(new Error(message), { name: 'ApiError', status });
const call = async (message = 'Yesterday I went to the secret-park-123.') => {
  const result: any = { status: 200 };
  await handler({ method: 'POST', body: { message }, headers: { authorization: `Bearer ${createSession('member@example.com', signingKey()!)}` } }, { setHeader() {}, status(n: number) { result.status = n; return this; }, json(data: any) { result.body = data; return this; } });
  return result;
};
process.env.GEMINI_API_KEY = 'test-only';
process.env.SESSION_SECRET = 'test-only-secret';
delete process.env.GEMINI_MODEL;
delete process.env.CHAT_MAX_REQUESTS;

script = () => good;
let r = await call();
assert.equal(r.status, 200); assert.deepEqual(calls, ['gemini-3.8-flash']);

calls.length = 0; script = (m) => m === 'gemini-3.8-flash' ? Promise.reject(fail(503, 'The model is overloaded')) : good;
r = await call();
assert.equal(r.status, 200, 'Busy model falls back'); assert.deepEqual(calls, ['gemini-3.8-flash', 'gemini-3.6-flash']);

calls.length = 0; script = (m) => m !== 'gemini-3.5-flash-lite' ? Promise.reject(fail(429, 'RESOURCE_EXHAUSTED quota')) : good;
r = await call();
assert.equal(r.status, 200, 'Per-model quota falls back'); assert.equal(calls.length, 3);

calls.length = 0; script = () => Promise.reject(fail(429, 'RESOURCE_EXHAUSTED'));
r = await call();
assert.equal(r.status, 429, 'All out of quota is reported as quota');

calls.length = 0; script = () => Promise.reject(fail(400, 'API key not valid. Please pass a valid API key.'));
r = await call();
assert.equal(r.status, 502); assert.deepEqual(calls, ['gemini-3.8-flash'], 'A bad key stops at the first model');
assert(logs.at(-1)!.includes('status=400') && logs.at(-1)!.includes('API key not valid'));

calls.length = 0; script = (m) => m === 'gemini-3.8-flash' ? { text: 'Sorry, here is plain text' } : { text: '```json\n' + good.text + '\n```' };
r = await call();
assert.equal(r.status, 200, 'Unreadable reply falls back; fenced JSON is accepted');

calls.length = 0; process.env.GEMINI_MODEL = 'gemini-retired'; script = (m) => m === 'gemini-retired' ? Promise.reject(fail(404, 'models/gemini-retired is not found')) : good;
r = await call();
assert.equal(r.status, 200); assert.deepEqual(calls, ['gemini-retired', 'gemini-3.8-flash'], 'A retired configured model falls back');
delete process.env.GEMINI_MODEL;

assert(logs.length > 0 && logs.every((line) => !line.includes('secret-park-123')), 'Logs never include the student message');
console.log('PASS: Tutor falls back across busy, retired or out-of-quota models, stops on a bad key and logs safe reasons.');
