import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { RecordedDictation } from '../src/components/RecordedDictation';
import { UserProvider } from '../src/context/UserContext';
const dom = new JSDOM('<div id="root"></div>', { url: 'https://example.test' });
for (const name of ['window', 'document', 'localStorage', 'navigator']) Object.defineProperty(globalThis, name, { configurable: true, value: (dom.window as any)[name] });
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
let stopped = 0, posts = 0, transcript = '', busy = false;
Object.defineProperty(navigator, 'mediaDevices', { value: { getUserMedia: async () => ({ getTracks: () => [{ stop: () => stopped++ }] }) } });
class Recorder {
  static isTypeSupported() { return true; }
  state = 'inactive'; ondataavailable: any; onstop: any; onerror: any;
  start() { this.state = 'recording'; }
  stop() { this.state = 'inactive'; this.ondataavailable({ data: new Blob(['a'.repeat(100)]) }); queueMicrotask(() => this.onstop()); }
}
Object.assign(globalThis, { MediaRecorder: Recorder });
globalThis.fetch = async (_url, init) => {
  if (init?.method === 'POST') { posts++; return Response.json({ transcript: 'I work from home on Fridays.' }); }
  return Response.json({ enabled: true });
};
const root = createRoot(document.getElementById('root')!);
await act(async () => root.render(<UserProvider><RecordedDictation disabled={false} onBusy={b => busy = b} onTranscript={t => transcript = t} /></UserProvider>));
async function click(label: string) { await act(async () => { const button = Array.from(document.querySelectorAll('button')).find(b => b.textContent === label); assert(button, label); button.click(); await new Promise(r => setTimeout(r, 10)); }); }
await click('Speak'); assert(busy);
await click('Stop');
assert.equal(transcript, 'I work from home on Fridays.'); assert.equal(posts, 1); assert.equal(busy, false); assert.equal(stopped, 1);
await click('Speak'); await click('Cancel');
assert.equal(posts, 1); assert.equal(busy, false); assert.equal(stopped, 2);
globalThis.fetch = async (_url, init) => init?.method === 'POST' ? new Response('<!doctype html><title>Unavailable</title>', { status: 502 }) : Response.json({ enabled: true });
await click('Speak'); await click('Stop');
assert.match(document.querySelector('[role="alert"]')!.textContent!, /connection was interrupted/);
assert.equal(transcript, 'I work from home on Fridays.');
assert.equal(busy, false);
await act(async () => root.unmount());
console.log('PASS: Recorded dictation delivers a draft, stops microphone tracks and cancels without uploading (mock audio).');
