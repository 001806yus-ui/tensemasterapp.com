import { VOICE_SAMPLES, normalizeSpeechText } from '../config/voices';

export type VoicePersona = keyof typeof VOICE_SAMPLES;
export interface VoiceOption {
  id: VoicePersona;
  label: string;
  accent: 'US' | 'UK';
  gender: 'female' | 'male';
  tagline: string;
  sampleSentence: string;
}
export const VOICE_PROFILES: VoiceOption[] = [
  { id: 'natural-us-female', label: 'American English · female preference', accent: 'US', gender: 'female', tagline: 'Warm and conversational.', sampleSentence: VOICE_SAMPLES['natural-us-female'] },
  { id: 'natural-us-male', label: 'American English · male preference', accent: 'US', gender: 'male', tagline: 'Warm and conversational.', sampleSentence: VOICE_SAMPLES['natural-us-male'] },
  { id: 'natural-uk-female', label: 'British English · female preference', accent: 'UK', gender: 'female', tagline: 'Clear and relaxed.', sampleSentence: VOICE_SAMPLES['natural-uk-female'] },
  { id: 'natural-uk-male', label: 'British English · male preference', accent: 'UK', gender: 'male', tagline: 'Clear and relaxed.', sampleSentence: VOICE_SAMPLES['natural-uk-male'] },
];
const PERSONA_KEY = 'tensemaster_preferred_voice_persona';
const DEVICE_KEY = 'tensemaster_device_voice_uri';
const read = (key: string) => { try { return localStorage.getItem(key); } catch { return null; } };
const write = (key: string, value: string) => { try { localStorage.setItem(key, value); } catch {} };
export const getPreferredVoicePersona = (): VoicePersona => {
  const value = read(PERSONA_KEY);
  return value && Object.hasOwn(VOICE_SAMPLES, value) ? value as VoicePersona : 'natural-us-female';
};
export const setPreferredVoicePersona = (persona: VoicePersona) => { write(PERSONA_KEY, persona); write(DEVICE_KEY, ''); };
export const getPreferredDeviceVoice = () => read(DEVICE_KEY) || '';
export const setPreferredDeviceVoice = (uri: string) => write(DEVICE_KEY, uri);
const synth = () => typeof window !== 'undefined' ? window.speechSynthesis : undefined;
export const getAvailableEnglishVoices = () => (synth()?.getVoices() || []).filter(v => /^en(?:[-_]|$)/i.test(v.lang));

export const selectDeviceVoice = (voices: SpeechSynthesisVoice[], persona: VoicePersona, preferredURI = ''): SpeechSynthesisVoice | null => {
  const english = voices.filter(v => /^en(?:[-_]|$)/i.test(v.lang));
  const preferred = english.find(v => v.voiceURI === preferredURI);
  if (preferred) return preferred;
  const uk = persona.includes('-uk-');
  const female = persona.endsWith('-female');
  const score = (v: SpeechSynthesisVoice) => {
    const name = v.name.toLowerCase();
    let n = (uk ? /en[-_](gb|uk)/i : /en[-_]us/i).test(v.lang) ? 35 : 0;
    if (/natural|neural/.test(name)) n += 100;
    if (/enhanced|premium/.test(name)) n += 80;
    if (/google/.test(name)) n += 45;
    // Web Speech exposes no gender or quality metadata. These are preferences,
    // not a promise that a named voice is installed or that it is neural.
    const isFemale = /jenny|samantha|ava|aria|victoria|serena|zira|\bfemale\b/.test(name);
    const isMale = /\bguy\b|\balex\b|daniel|oliver|david|ryan|george|\bmale\b/.test(name);
    if (female ? isFemale : isMale) n += 25;
    if (female ? isMale : isFemale) n -= 25;
    if (/espeak|compact|sinclair|robot/.test(name)) n -= 200;
    return n;
  };
  return [...english].sort((a, b) => score(b) - score(a))[0] || null;
};

export type VoicePlaybackState = { engine: 'idle' | 'loading' | 'cloud' | 'device' | 'unavailable'; cloudEnabled: boolean; fallback: boolean; lastError?: string };
let playbackState: VoicePlaybackState = { engine: 'idle', cloudEnabled: false, fallback: false };
const listeners = new Set<() => void>();
export const getVoicePlaybackState = () => playbackState;
export const subscribeVoicePlayback = (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; };
const report = (update: Partial<VoicePlaybackState>) => { playbackState = { ...playbackState, ...update }; listeners.forEach(fn => fn()); };
let cloudStatus: { enabled: boolean; checked: number } | null = null;
let statusRequest: Promise<boolean> | null = null;
export const checkNaturalAudio = async (): Promise<boolean> => {
  if (cloudStatus && Date.now() - cloudStatus.checked < 60000) return cloudStatus.enabled;
  if (statusRequest) return statusRequest;
  statusRequest = (async () => {
    let enabled = false;
    try {
      const res = await fetch('/api/speech', { signal: AbortSignal.timeout(2500) });
      if (res.ok) enabled = (await res.json()).enabled === true;
    } catch {}
    cloudStatus = { enabled, checked: Date.now() };
    report({ cloudEnabled: enabled });
    return enabled;
  })();
  try { return await statusRequest; } finally { statusRequest = null; }
};

let audioContext: AudioContext | null = null;
export const getSharedAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  const Context = window.AudioContext || (window as any).webkitAudioContext;
  if (!Context) return null;
  if (!audioContext || audioContext.state === 'closed') {
    audioContext = new Context();
  }
  return audioContext;
};

export const unlockAudio = () => {
  if (typeof window === 'undefined') return;
  try {
    const ctx = getSharedAudioContext();
    if (ctx) {
      if (ctx.state === 'suspended') {
        void ctx.resume().catch(() => {});
      }
      try {
        const silent = ctx.createBuffer(1, 1, 22050);
        const src = ctx.createBufferSource();
        src.buffer = silent;
        src.connect(ctx.destination);
        src.start(0);
      } catch {}
    }
    const engine = synth();
    if (engine) {
      if (engine.paused) {
        try { engine.resume(); } catch {}
      }
    }
  } catch {}
};

if (typeof window !== 'undefined') {
  const prime = () => {
    unlockAudio();
  };
  ['pointerdown', 'touchstart', 'mousedown', 'keydown'].forEach(evt => {
    window.addEventListener(evt, prime, { capture: true, passive: true });
  });
  void checkNaturalAudio();
}

const decodeAudioDataSafe = (ctx: AudioContext, arrayBuffer: ArrayBuffer): Promise<AudioBuffer> => {
  return new Promise((resolve, reject) => {
    try {
      const res = ctx.decodeAudioData(
        arrayBuffer,
        buf => resolve(buf),
        err => reject(err)
      );
      if (res && typeof (res as any).then === 'function') {
        (res as any).then(resolve, reject);
      }
    } catch (e) {
      reject(e);
    }
  });
};

type Job = { canceled: boolean; abort: AbortController; cleanup: Set<() => void>; finish: (ok: boolean) => void; utterance?: SpeechSynthesisUtterance };
let active: Job | null = null;
let activeUtterance: SpeechSynthesisUtterance | null = null;
const audioCache = new Map<string, Blob>();
let audioCacheBytes = 0;
export const stopAudio = () => {
  const previous = active;
  active = null;
  activeUtterance = null;
  if (previous) { previous.canceled = true; previous.abort.abort(); previous.finish(false); }
  try { const engine = synth(); if (previous || engine?.speaking || engine?.pending) engine?.cancel(); } catch {}
};

const waitForVoices = (job: Job): Promise<void> => {
  const engine = synth();
  if (!engine || engine.getVoices().length) return Promise.resolve();
  return new Promise(resolve => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      clearInterval(interval);
      engine.removeEventListener?.('voiceschanged', finish);
      job.cleanup.delete(finish);
      resolve();
    };
    const timer = setTimeout(finish, 400);
    const interval = setInterval(() => {
      if (engine.getVoices().length) finish();
    }, 40);
    engine.addEventListener?.('voiceschanged', finish);
    job.cleanup.add(finish);
  });
};

const playCloudAudio = async (text: string, persona: VoicePersona, rate: number, job: Job): Promise<boolean> => {
  const key = persona + ':' + text;
  let blob = audioCache.get(key);
  if (!blob) {
    const timer = setTimeout(() => job.abort.abort(), 12000);
    job.cleanup.add(() => clearTimeout(timer));
    try {
      const response = await fetch('/api/speech', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, persona }), signal: job.abort.signal });
      if (!response.ok || !response.headers.get('Content-Type')?.includes('audio/wav')) {
        if (response.status === 429) {
          cloudStatus = { enabled: false, checked: Date.now() + 240000 };
          report({ cloudEnabled: false });
        }
        return false;
      }
      blob = await response.blob();
      if (!blob.size || blob.size > 6 * 1024 * 1024 || job.canceled) return false;
      while (audioCache.size && audioCacheBytes + blob.size > 12 * 1024 * 1024) {
        const oldest = audioCache.keys().next().value!;
        audioCacheBytes -= audioCache.get(oldest)!.size; audioCache.delete(oldest);
      }
      audioCache.set(key, blob); audioCacheBytes += blob.size;
    } finally { clearTimeout(timer); }
  }
  if (job.canceled) return false;
  return new Promise(resolve => {
    const url = URL.createObjectURL(blob!);
    const audio = new Audio(url);
    audio.playbackRate = rate;
    audio.preservesPitch = true;
    let finished = false;
    let sourceNode: AudioBufferSourceNode | null = null;
    const done = (ok: boolean) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      audio.onended = null;
      audio.onerror = null;
      try { audio.pause(); } catch {}
      if (sourceNode) {
        try { sourceNode.stop(); } catch {}
        sourceNode = null;
      }
      URL.revokeObjectURL(url);
      job.cleanup.delete(cancel);
      resolve(ok);
    };
    const cancel = () => done(false);
    const timer = setTimeout(cancel, Math.max(12000, (text.length * 200) / rate));
    job.cleanup.add(cancel);
    audio.onended = () => done(true);

    const tryWebAudioFallback = async () => {
      try {
        const ctx = getSharedAudioContext();
        if (ctx && blob) {
          if (ctx.state === 'suspended') {
            await ctx.resume().catch(() => {});
          }
          if (ctx.state === 'suspended') {
            cancel();
            return;
          }
          const arrayBuffer = await blob.arrayBuffer();
          if (finished || job.canceled) return;
          const buffer = await decodeAudioDataSafe(ctx, arrayBuffer);
          if (finished || job.canceled) return;
          const source = ctx.createBufferSource();
          sourceNode = source;
          source.buffer = buffer;
          source.playbackRate.value = rate;
          source.connect(ctx.destination);
          source.onended = () => done(true);
          job.cleanup.add(() => { try { source.stop(); } catch {} });
          source.start(0);
          if (!job.canceled) report({ engine: 'cloud', fallback: false });
          return;
        }
      } catch {}
      cancel();
    };

    audio.onerror = () => {
      void tryWebAudioFallback();
    };

    audio.play()
      .then(() => { if (!job.canceled) report({ engine: 'cloud', fallback: false }); })
      .catch(() => void tryWebAudioFallback());
  });
};

export const playEnglishAudio = (text: string, rate = 1, overridePersona?: VoicePersona, deviceOnly = false): Promise<boolean> => {
  stopAudio();
  const clean = normalizeSpeechText(text);
  if (!clean) return Promise.resolve(true);
  if (typeof window === 'undefined') return Promise.resolve(false);
  unlockAudio();
  const speed = Number.isFinite(rate) ? Math.max(0.7, Math.min(1.3, rate)) : 1;
  return new Promise(resolve => {
    let settled = false;
    const job: Job = { canceled: false, abort: new AbortController(), cleanup: new Set(), finish: ok => {
      if (settled) return;
      settled = true;
      for (const cleanup of [...job.cleanup]) cleanup();
      job.cleanup.clear(); job.utterance = undefined;
      if (active === job) active = null;
      resolve(ok);
    } };
    active = job;
    report({ engine: 'loading', fallback: false, lastError: undefined });
    void (async () => {
      const persona = overridePersona || getPreferredVoicePersona();
      const manual = overridePersona ? '' : getPreferredDeviceVoice();
      const enabled = !deviceOnly && !manual ? await checkNaturalAudio() : false;
      if (job.canceled) return;
      if (enabled) {
        try { if (await playCloudAudio(clean, persona, speed, job)) { job.finish(true); return; } } catch {}
        if (job.canceled) return;
      }
      if (!synth()?.getVoices().length) await waitForVoices(job);
      if (job.canceled) return;
      const engine = synth();
      if (!engine || typeof SpeechSynthesisUtterance === 'undefined') { report({ engine: 'unavailable', lastError: 'speech_synthesis_unsupported' }); job.finish(false); return; }
      try {
        if (engine.paused) engine.resume();
      } catch {}
      const initialVoice = selectDeviceVoice(engine.getVoices(), persona, manual);
      let retried = false;
      const speak = (voice: SpeechSynthesisVoice | null) => {
        if (job.canceled || active !== job) return;
        const utterance = new SpeechSynthesisUtterance(clean);
        job.utterance = utterance;
        activeUtterance = utterance;
        utterance.voice = voice;
        utterance.lang = voice?.lang || (persona.includes('-uk-') ? 'en-GB' : 'en-US');
        utterance.rate = speed;
        utterance.pitch = 1;
        utterance.volume = 1;
        let started = false;
        const fail = (error: string) => {
          if (job.canceled || active !== job) return;
          report({ engine: 'unavailable', lastError: error });
          job.finish(false);
          try { engine.cancel(); } catch {}
        };
        const startTimer = setTimeout(() => fail('speech_did_not_start'), 5000);
        const endTimer = setTimeout(() => fail('speech_timeout'), Math.max(15000, clean.length * 220 / speed));
        const cleanup = () => {
          clearTimeout(startTimer);
          clearTimeout(endTimer);
          utterance.onstart = null;
          utterance.onend = null;
          utterance.onerror = null;
          if (activeUtterance === utterance) activeUtterance = null;
        };
        job.cleanup.add(cleanup);
        utterance.onstart = () => {
          if (job.canceled || active !== job) return;
          started = true;
          clearTimeout(startTimer);
          report({ engine: 'device', fallback: !!enabled, lastError: undefined });
        };
        utterance.onend = () => {
          if (!started) { fail('speech_did_not_start'); return; }
          job.finish(true);
        };
        utterance.onerror = (event) => {
          if (job.canceled || active !== job) return;
          const error = event.error || 'speech_failed';
          if (!retried && (error === 'voice-unavailable' || error === 'language-unavailable')) {
            retried = true;
            cleanup();
            job.cleanup.delete(cleanup);
            const alternate = selectDeviceVoice(engine.getVoices().filter(v => v.voiceURI !== voice?.voiceURI), persona);
            speak(alternate);
            return;
          }
          fail(error);
        };
        try {
          if (engine.paused) engine.resume();
          engine.speak(utterance);
        } catch (error: any) { fail(error?.message || 'speak_exception'); }
      };
      speak(initialVoice);
    })().catch(() => { if (!job.canceled) report({ engine: 'unavailable' }); job.finish(false); });
  });
};

// Kept for compatibility; no undocumented Google Translate audio endpoint.
export const playAudioViaElement = (text: string) => playEnglishAudio(text);
export const testPlayVoice = (persona: VoicePersona) => playEnglishAudio(VOICE_SAMPLES[persona], 1, persona);

// ==========================================
// SPEECH RECOGNITION (PRONUNCIATION PRACTICE)
// ==========================================

export const isSpeechRecognitionSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
};

export const requestMicrophoneAccess = async (): Promise<{ granted: boolean; error?: string }> => {
  if (typeof window === 'undefined') return { granted: false, error: 'Entorno no soportado.' };
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return { granted: false, error: 'Tu navegador no soporta captura de micrófono directo.' };
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    return { granted: true };
  } catch (err: any) {
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      return { granted: false, error: 'permission-denied' };
    }
    return { granted: false, error: err.message || 'Error al solicitar micrófono' };
  }
};

export interface RecognitionOptions {
  onInterimResult?: (transcript: string) => void;
  onFinalResult?: (transcript: string) => void;
  onError?: (errorMessage: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export interface RecognitionController {
  stop: () => void;
  abort: () => void;
}

export const startPronunciationRecognition = (
  options: RecognitionOptions
): RecognitionController | null => {
  if (!isSpeechRecognitionSupported()) {
    options.onError?.('Tu navegador no soporta reconocimiento de voz. Recomendamos Google Chrome o Safari.');
    return null;
  }

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  let recognition: any;
  try {
    recognition = new SpeechRecognition();
  } catch (err) {
    options.onError?.('No se pudo inicializar el micrófono.');
    return null;
  }

  recognition.lang = 'en-US';
  recognition.interimResults = true;
  recognition.continuous = false;
  recognition.maxAlternatives = 1;

  let finalTranscript = '';
  let lastSpokenText = '';

  recognition.onstart = () => {
    options.onStart?.();
  };

  recognition.onresult = (event: any) => {
    let interim = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcriptPiece = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcriptPiece;
      } else {
        interim += transcriptPiece;
      }
    }

    const currentText = (finalTranscript + ' ' + interim).trim();
    if (currentText) {
      lastSpokenText = currentText;
    }
    if (options.onInterimResult) {
      options.onInterimResult(currentText);
    }
  };

  recognition.onerror = (event: any) => {
    let message = 'Error en el micrófono.';
    if (event.error === 'not-allowed') {
      message = 'Permiso de micrófono denegado. Por favor permite el acceso al micrófono en tu navegador.';
    } else if (event.error === 'no-speech') {
      message = 'No se detectó audio. Por favor intenta hablar más cerca del micrófono.';
    } else if (event.error === 'network') {
      message = 'Error de red en el reconocimiento de voz.';
    }
    options.onError?.(message);
  };

  recognition.onend = () => {
    const recognizedText = (finalTranscript.trim() || lastSpokenText.trim());
    if (recognizedText && options.onFinalResult) {
      options.onFinalResult(recognizedText);
    }
    options.onEnd?.();
  };

  try {
    recognition.start();
  } catch (e) {
    options.onError?.('No se pudo iniciar la grabación.');
    return null;
  }

  return {
    stop: () => {
      try {
        recognition.stop();
      } catch (e) {
        // ignore
      }
    },
    abort: () => {
      try {
        recognition.abort();
      } catch (e) {
        // ignore
      }
    }
  };
};

// ==========================================
// PRONUNCIATION ACCURACY COMPARISON
// ==========================================

export interface WordAccuracy {
  targetWord: string;
  spokenWord?: string;
  status: 'correct' | 'imperfect' | 'missing';
}

export interface PronunciationEvaluation {
  accuracyScore: number; // 0 - 100
  words: WordAccuracy[];
  isPassing: boolean; // >= 70%
  feedbackMessage: string;
}

const cleanWord = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, '');

const levenshtein = (a: string, b: string): number => {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = Array.from({ length: bn + 1 }, () => new Array(an + 1).fill(0));
  for (let i = 0; i <= an; ++i) matrix[0][i] = i;
  for (let j = 0; j <= bn; ++j) matrix[j][0] = j;
  for (let j = 1; j <= bn; ++j) {
    for (let i = 1; i <= an; ++i) {
      if (a[i - 1] === b[j - 1]) {
        matrix[j][i] = matrix[j - 1][i - 1];
      } else {
        matrix[j][i] = Math.min(
          matrix[j - 1][i - 1] + 1, // substitution
          matrix[j][i - 1] + 1,     // insertion
          matrix[j - 1][i] + 1      // deletion
        );
      }
    }
  }
  return matrix[bn][an];
};

export const evaluatePronunciation = (
  targetSentence: string,
  spokenSentence: string
): PronunciationEvaluation => {
  const targetTokens = targetSentence.split(/\s+/).filter(Boolean);
  const spokenTokens = spokenSentence.split(/\s+/).filter(Boolean);

  let correctCount = 0;
  const evaluatedWords: WordAccuracy[] = [];

  targetTokens.forEach((rawTarget, idx) => {
    const cleanTarget = cleanWord(rawTarget);
    const spokenToken = spokenTokens[idx];
    const cleanSpoken = spokenToken ? cleanWord(spokenToken) : '';

    if (!cleanSpoken) {
      // Check if it was spoken elsewhere in spoken tokens
      const existsNearby = spokenTokens.some(
        (st) => cleanWord(st) === cleanTarget || levenshtein(cleanWord(st), cleanTarget) <= 1
      );
      if (existsNearby) {
        correctCount += 0.8;
        evaluatedWords.push({
          targetWord: rawTarget,
          spokenWord: cleanTarget,
          status: 'imperfect'
        });
      } else {
        evaluatedWords.push({
          targetWord: rawTarget,
          status: 'missing'
        });
      }
      return;
    }

    if (cleanTarget === cleanSpoken) {
      correctCount += 1;
      evaluatedWords.push({
        targetWord: rawTarget,
        spokenWord: spokenToken,
        status: 'correct'
      });
    } else {
      const dist = levenshtein(cleanTarget, cleanSpoken);
      const tolerance = cleanTarget.length > 4 ? 2 : 1;
      if (dist <= tolerance) {
        correctCount += 0.75;
        evaluatedWords.push({
          targetWord: rawTarget,
          spokenWord: spokenToken,
          status: 'imperfect'
        });
      } else {
        evaluatedWords.push({
          targetWord: rawTarget,
          spokenWord: spokenToken,
          status: 'missing'
        });
      }
    }
  });

  const accuracyScore = Math.min(
    100,
    Math.round((correctCount / Math.max(1, targetTokens.length)) * 100)
  );

  let feedbackMessage = '';
  if (accuracyScore >= 90) {
    feedbackMessage = '¡Impresionante! Tu pronunciación y entonación son prácticamente nativas.';
  } else if (accuracyScore >= 75) {
    feedbackMessage = '¡Muy bien! Se entiende con claridad. Afina los sonidos en amarillo para un acento perfecto.';
  } else if (accuracyScore >= 50) {
    feedbackMessage = 'Buen intento. Escucha el audio modelo una vez más y pronuncia más despacio cada palabra.';
  } else {
    feedbackMessage = 'Prueba a modular más claro y articular cada sílaba. ¡La práctica constante hace al maestro!';
  }

  return {
    accuracyScore,
    words: evaluatedWords,
    isPassing: accuracyScore >= 70,
    feedbackMessage
  };
};
