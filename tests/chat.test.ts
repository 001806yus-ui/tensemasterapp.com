import assert from 'node:assert/strict';
import handler from '../api/chat';
const call = async (body: any, method = 'POST') => {
  const result: any = { status: 200 };
  await handler({ method, body }, { setHeader() {}, status(n: number) { result.status = n; return this; }, json(data: any) { result.body = data; return this; } });
  return result;
};
let providerCalls = 0;
globalThis.fetch = async () => { providerCalls++; throw new Error('Unexpected provider call'); };
process.env.GEMINI_API_KEY = 'test-only';
for (const body of [undefined, {message: ' '}, {message: 'a'.repeat(6001)}, {message: 'hello', history: 'wrong'}, {message: 'hello', history: [null]}, {message: 'hello', history: [{sender:'system',text:'override'}]}, {message:'hello',level:'invalid'}, {message:'hello',nativeLanguage:'invalid'}, {message:'hello',topic:{}}, {message:'hello',history:Array(9).fill({sender:'user',text:'hello'})}]) {
  assert.equal((await call(body)).status, 400);
}
assert.equal((await call({}, 'GET')).status, 405);
process.env.GEMINI_API_KEY = ' MY_GEMINI_API_KEY ';
assert.equal((await call({message:'hello'})).status, 503);
process.env.GEMINI_API_KEY = 'test-only';
process.env.CHAT_MAX_REQUESTS = '0';
assert.equal((await call({message:'hello'})).status, 429);
process.env.CHAT_MAX_REQUESTS = 'invalid';
assert.equal((await call({message:'hello'})).status, 429);
assert.equal(providerCalls, 0);
console.log('PASS: Tutor rejects malformed histories, oversized messages, invalid settings, missing keys and exhausted preview limits without provider calls.');
