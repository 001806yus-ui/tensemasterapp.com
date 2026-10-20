import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { UserProvider } from '../src/context/UserContext';
import { VoiceSettingsModal } from '../src/components/VoiceSettingsModal';
import { selectDeviceVoice, playEnglishAudio, stopAudio, setPreferredDeviceVoice, getVoicePlaybackState } from '../src/utils/speech';
import handler from '../api/speech';
import { VOICE_SAMPLES } from '../src/config/voices';

const dom = new JSDOM('<div id="root"></div>', { url: 'https://example.test' });
for (const key of ['window', 'document', 'localStorage']) Object.defineProperty(globalThis, key, { value: (dom.window as any)[key], configurable: true });
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
const voice = (name: string, lang = 'en-US') => ({ name, lang, voiceURI: name, default: false, localService: true }) as SpeechSynthesisVoice;
const voices = [voice('Old compact'), voice('Microsoft Jenny Natural'), voice('Female voice'), voice('Male voice'), voice('Samantha', 'en-GB'), voice('Español', 'es-ES')];
assert.equal(selectDeviceVoice(voices, 'natural-us-female')?.name, 'Microsoft Jenny Natural');
assert.equal(selectDeviceVoice([voices[2], voices[3]], 'natural-us-female')?.name, 'Female voice', 'Female must not also match the word male');
assert.equal(selectDeviceVoice(voices, 'natural-uk-female', 'Samantha')?.name, 'Samantha');
assert.equal(selectDeviceVoice([voices[5]], 'natural-us-female'), null, 'Never choose a Spanish voice for an English lesson');

let spoken: any[] = [];
let cancelCount = 0;
const synth = Object.assign(new dom.window.EventTarget(), { getVoices: () => voices, paused: false, speaking: false, pending: false, resume() {}, cancel() { cancelCount++; }, speak(u: any) { spoken.push(u); } });
Object.defineProperty(dom.window, 'speechSynthesis', { value: synth });
class Utterance { constructor(public text: string) {} lang = ''; rate = 1; pitch = 1; volume = 1; voice: any; onend: any; onerror: any; }
Object.assign(globalThis, { SpeechSynthesisUtterance: Utterance });
const tick = () => new Promise(r => setTimeout(r, 0));
const bytes = Buffer.alloc(48); bytes.write('RIFF'); bytes.write('WAVE', 8);
let statusCalls = 0, clientCalls = 0;
let cloudFailure = true;
globalThis.fetch = async (_url: any, options: any) => {
  if (options?.method === 'POST') { clientCalls++; return cloudFailure ? new Response('{}', { status: 503 }) : new Response(bytes, { headers: { 'Content-Type': 'audio/wav' } }); }
  statusCalls++; return new Response(JSON.stringify({ enabled: true }));
};
setPreferredDeviceVoice('Samantha');
let pending = playEnglishAudio('I work from home.', 0.8);
assert.equal(spoken.length, 1, 'Loaded manual voice starts synchronously in the click handler');
assert.equal(cancelCount, 0, 'Do not cancel an idle engine before starting');
await tick();
assert.equal(spoken.at(-1).rate, 0.8, 'Keep the requested rate without applying a second slowdown');
assert.equal(spoken.at(-1).pitch, 1);
assert.equal(spoken.at(-1).lang, 'en-GB');
assert.equal(clientCalls, 0, 'A manually selected device voice must not trigger cloud generation');
spoken.at(-1).onstart(); spoken.at(-1).onend(); assert.equal(await pending, true);
const longText = 'I practise English every morning. '.repeat(12);
pending = playEnglishAudio(longText); await tick(); assert.equal(spoken.at(-1).text, longText.trim());
stopAudio(); assert.equal(await pending, false);
assert.equal(spoken.at(-1).onend, null);
assert(cancelCount > 0);

setPreferredDeviceVoice('');
pending = playEnglishAudio('I work from home.'); await tick();
assert.equal(statusCalls, 1); assert.equal(clientCalls, 1);
spoken.at(-1).onstart(); assert.equal(getVoicePlaybackState().fallback, true);
spoken.at(-1).onstart(); spoken.at(-1).onend(); assert.equal(await pending, true);
let release: any;
globalThis.fetch = (_url: any, options: any) => new Promise(resolve => { release = resolve; });
const countBefore = spoken.length;
pending = playEnglishAudio('Another sentence.'); await tick(); stopAudio();
assert.equal(await pending, false);
release(new Response('{}', { status: 503 })); await tick();
assert.equal(spoken.length, countBefore, 'A canceled cloud request must not restart device audio');

const audios: any[] = [];
let revoked = 0;
Object.assign(URL, { createObjectURL: () => 'blob:test', revokeObjectURL: () => revoked++ });
class FakeAudio {
  onended: any; onerror: any; playbackRate = 1; preservesPitch = false; paused = false;
  constructor(public src: string) { audios.push(this); }
  play() { return Promise.resolve(); }
  pause() { this.paused = true; }
}
Object.assign(globalThis, { Audio: FakeAudio });
let generated = 0;
globalThis.fetch = async () => { generated++; return new Response(bytes, { headers: { 'Content-Type': 'audio/wav' } }); };
pending = playEnglishAudio(VOICE_SAMPLES['natural-us-female'], 0.8); await tick(); await tick();
assert.equal(audios.at(-1).playbackRate, 0.8); assert.equal(audios.at(-1).preservesPitch, true);
assert.equal(getVoicePlaybackState().engine, 'cloud');
audios.at(-1).onended(); assert.equal(await pending, true); assert.equal(revoked, 1);
pending = playEnglishAudio(VOICE_SAMPLES['natural-us-female']); await tick();
assert.equal(generated, 1, 'Replay cached audio without generating again');
stopAudio(); assert.equal(await pending, false); assert(audios.at(-1).paused); assert.equal(revoked, 2);

// The device test must bypass cloud even when automatic selection is active.
const beforeDevice = generated;
pending = playEnglishAudio('Device test.', 1, undefined, true);
assert.equal(spoken.at(-1).text, 'Device test.');
assert.equal(generated, beforeDevice);
assert.equal(getVoicePlaybackState().engine, 'loading');
const brokenVoice = spoken.at(-1);
brokenVoice.onerror({ error: 'voice-unavailable' });
assert.notEqual(spoken.at(-1), brokenVoice);
assert.match(spoken.at(-1).lang, /^en-/);
assert.equal(brokenVoice.onend, null);
spoken.at(-1).onstart();
spoken.at(-1).onend();
assert.equal(await pending, true);
pending = playEnglishAudio('Blocked test.', 1, undefined, true);
spoken.at(-1).onerror({ error: 'not-allowed' });
assert.equal(await pending, false);
assert.equal(getVoicePlaybackState().lastError, 'not-allowed');
pending = playEnglishAudio('Silent end test.', 1, undefined, true);
spoken.at(-1).onend();
assert.equal(await pending, false, 'An end event without a start must not claim playback');

const root = createRoot(document.getElementById('root')!);
await act(async () => root.render(<UserProvider><VoiceSettingsModal onClose={() => {}} /></UserProvider>));
assert.equal(document.querySelectorAll('#device-voice option').length, 6);
assert(document.body.textContent!.includes('Microsoft Jenny Natural'));
assert(!document.body.textContent!.includes('Sin Sonido Robótico'));
await act(async () => root.unmount());

const old = { enabled: process.env.TTS_ENABLED, key: process.env.GEMINI_API_KEY, budget: process.env.TTS_MAX_GENERATIONS };
let providerCalls = 0;
globalThis.fetch = async (_url: any, options: any) => {
  providerCalls++;
  const payload = JSON.parse(options.body);
  assert.equal(payload.store, false);
  assert.equal(payload.input[0].content[0].text, VOICE_SAMPLES['natural-us-female']);
  assert(payload.input[0].content[0].annotations[0].style.includes('General American'));
  return new Response(JSON.stringify({ steps: [{ type: 'model_output', content: [{ type: 'audio', data: bytes.toString('base64') }] }] }));
};
async function request(method: string, body?: any) {
  const response: any = { code: 200, headers: {}, status(code: number) { this.code = code; return this; }, setHeader(k: string, v: string) { this.headers[k] = v; }, json(data: any) { this.data = data; return this; }, send(data: any) { this.data = data; return this; } };
  await handler({ method, body, ip: '127.0.0.1' }, response); return response;
}
try {
  process.env.TTS_ENABLED = 'false'; process.env.GEMINI_API_KEY = 'test-not-real';
  assert.equal((await request('GET')).data.enabled, false);
  assert.equal((await request('POST', { text: 'Hello', persona: 'natural-us-female' })).code, 503);
  process.env.TTS_ENABLED = 'true';
  assert.equal((await request('DELETE')).code, 405);
  assert.equal((await request('POST', { text: 'Hello', persona: '__proto__' })).code, 400);
  assert.equal((await request('POST', { text: 'x'.repeat(1201), persona: 'natural-us-female' })).code, 400);
  assert.equal((await request('POST', { text: 'An arbitrary paid generation.', persona: 'natural-us-female' })).code, 403);
  assert.equal(providerCalls, 0);
  process.env.TTS_MAX_GENERATIONS = 'invalid';
  const body = { text: VOICE_SAMPLES['natural-us-female'], persona: 'natural-us-female' };
  assert.equal((await request('POST', body)).code, 429, 'Invalid quotas fail closed');
  process.env.TTS_MAX_GENERATIONS = '1';
  const response = await request('POST', body);
  assert.equal(response.code, 200); assert.equal(response.headers['Content-Type'], 'audio/wav'); assert(Buffer.isBuffer(response.data));
  assert.equal((await request('POST', body)).code, 200); assert.equal(providerCalls, 1, 'Server cache avoids a second provider call');
  assert.equal((await request('POST', { text: VOICE_SAMPLES['natural-us-male'], persona: 'natural-us-male' })).code, 429);
} finally {
  for (const [key, value] of Object.entries({ TTS_ENABLED: old.enabled, GEMINI_API_KEY: old.key, TTS_MAX_GENERATIONS: old.budget })) {
    if (value === undefined) delete process.env[key]; else process.env[key] = value;
  }
}
console.log('Speech selection, playback, cancellation, caching, quota and request validation checks passed. No live generation.');
