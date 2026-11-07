import { createHash } from 'node:crypto';
import { ALL_12_TENSES } from '../src/data/tensesData.js';
import { CLOUD_VOICES, VOICE_SAMPLES, normalizeSpeechText } from '../src/config/voices.js';

// Until real accounts and durable quotas exist, generate only shipped lesson
// examples and voice samples. Never expose arbitrary paid speech generation.
const allowed = new Set([
  ...Object.values(VOICE_SAMPLES),
  ...ALL_12_TENSES.flatMap(t => [...t.examples.map(e => e.audioText), ...t.whenToUse.map(u => u.example)]),
].map(normalizeSpeechText));

const cache = new Map<string, Buffer>();
const inFlight = new Map<string, Promise<Buffer>>();
const windows = new Map<string, { start: number; count: number }>();
let generations = 0;
let cacheBytes = 0;
const configured = () => process.env.TTS_ENABLED === 'true' && !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY';
const budget = () => {
  const number = Number(process.env.TTS_MAX_GENERATIONS || 10);
  return Number.isInteger(number) && number >= 0 && number <= 100 ? number : 0;
};

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET') return res.json({ enabled: configured(), scope: 'lesson-preview' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use GET or POST.' });
  const { text, persona } = req.body || {};
  if (typeof text !== 'string' || text.length > 1200 || !text.trim() || typeof persona !== 'string' || !Object.hasOwn(CLOUD_VOICES, persona)) return res.status(400).json({ error: 'Invalid speech request.' });
  if (!configured()) return res.status(503).json({ error: 'Natural audio is not enabled.' });
  const transcript = normalizeSpeechText(text);
  if (!allowed.has(transcript)) return res.status(403).json({ error: 'Only built-in lesson audio is enabled until account quotas are connected.' });
  const now = Date.now();
  for (const [ip, value] of windows) if (now - value.start > 60000) windows.delete(ip);
  const ip = req.ip || req.socket?.remoteAddress || 'unknown';
  if (!windows.has(ip) && windows.size >= 1000) return res.status(429).json({ error: 'Audio service is busy.' });
  const bucket = windows.get(ip) || { start: now, count: 0 };
  if (bucket.count >= 12) return res.status(429).json({ error: 'Please wait before requesting more audio.' });
  bucket.count++; windows.set(ip, bucket);
  const model = process.env.GEMINI_TTS_MODEL || 'gemini-3.8-flash-tts';
  const key = createHash('sha256').update(model + persona + transcript).digest('hex');
  const respond = (audio: Buffer) => {
    res.setHeader('Content-Type', 'audio/wav');
    return res.send(audio);
  };
  if (cache.has(key)) return respond(cache.get(key)!);
  try {
    let generation = inFlight.get(key);
    if (!generation) {
      if (generations >= budget() || inFlight.size >= 2) return res.status(429).json({ error: 'Audio preview limit reached.' });
      generations++;
      generation = (async () => {
        const voice = CLOUD_VOICES[persona as keyof typeof CLOUD_VOICES];
        // Official Interactions REST API; older bundled SDK does not implement it.
        // https://ai.google.dev/gemini-api/docs/speech-generation
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY! },
          signal: AbortSignal.timeout(35000),
          body: JSON.stringify({
            model,
            input: [{ type: 'user_input', content: [{ type: 'text', text: transcript, annotations: [{ type: 'speech_metadata', style: voice.style }] }] }],
            response_format: { type: 'audio', mime_type: 'audio/wav' },
            generation_config: { speech_config: [{ voice: voice.voice }] },
            store: false,
          }),
        });
        if (!response.ok) throw new Error('Audio provider unavailable');
        const result = await response.json();
        const blocks = (result.steps || []).filter((s: any) => s.type === 'model_output').flatMap((s: any) => s.content || []).filter((c: any) => c.type === 'audio');
        const data = blocks.at(-1)?.data;
        if (typeof data !== 'string' || data.length > 8 * 1024 * 1024) throw new Error('Invalid audio output');
        const audio = Buffer.from(data, 'base64');
        if (audio.length < 44 || audio.toString('ascii', 0, 4) !== 'RIFF' || audio.toString('ascii', 8, 12) !== 'WAVE') throw new Error('Expected WAV audio');
        while (cache.size && cacheBytes + audio.length > 12 * 1024 * 1024) {
          const oldest = cache.keys().next().value!;
          cacheBytes -= cache.get(oldest)!.length; cache.delete(oldest);
        }
        cache.set(key, audio); cacheBytes += audio.length;
        return audio;
      })();
      inFlight.set(key, generation);
      void generation.finally(() => inFlight.delete(key)).catch(() => {});
    }
    return respond(await generation);
  } catch {
    return res.status(502).json({ error: 'Natural audio is temporarily unavailable.' });
  }
}
