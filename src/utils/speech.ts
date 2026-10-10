/**
 * Speech synthesis & Speech recognition utilities
 * High-Fidelity Natural Voice Engine (No-Robot Voice Synthesis)
 */

let synth: SpeechSynthesis | null = null;
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  synth = window.speechSynthesis;
}

export type VoicePersona =
  | 'natural-us-female'
  | 'natural-us-male'
  | 'natural-uk-female'
  | 'natural-uk-male';

export interface VoiceOption {
  id: VoicePersona;
  label: string;
  accent: 'US' | 'UK';
  gender: 'female' | 'male';
  tagline: string;
  sampleSentence: string;
}

export const VOICE_PROFILES: VoiceOption[] = [
  {
    id: 'natural-us-female',
    label: 'Jenny / Samantha (Voz Femenina Natural - US)',
    accent: 'US',
    gender: 'female',
    tagline: 'Cálida, clara y perfecta para aprender entonación americana moderna.',
    sampleSentence: "Hello! Welcome to your English lesson. Notice how natural and clear this sounds."
  },
  {
    id: 'natural-us-male',
    label: 'Guy / Alex (Voz Masculina Natural - US)',
    accent: 'US',
    gender: 'male',
    tagline: 'Voz profunda, segura y con pronunciación nativa conversacional.',
    sampleSentence: "Hey there! Practicing every day is the fastest way to master English tenses."
  },
  {
    id: 'natural-uk-female',
    label: 'Aria / Serena (Voz Británica Natural - UK)',
    accent: 'UK',
    gender: 'female',
    tagline: 'Elegante dicción británica RP con articulación suave y refinada.',
    sampleSentence: "Good morning! English grammar becomes simple once you hear the natural flow."
  },
  {
    id: 'natural-uk-male',
    label: 'Daniel / Oliver (Voz Británica Masculina - UK)',
    accent: 'UK',
    gender: 'male',
    tagline: 'Acento clásico de la BBC británica, impecable y académico.',
    sampleSentence: "Brilliant work! With this pronunciation, you'll sound completely fluent."
  }
];

const VOICE_PREF_KEY = 'tensemaster_preferred_voice_persona';

export const getPreferredVoicePersona = (): VoicePersona => {
  if (typeof window === 'undefined') return 'natural-us-female';
  try {
    const saved = localStorage.getItem(VOICE_PREF_KEY);
    if (saved && (saved === 'natural-us-female' || saved === 'natural-us-male' || saved === 'natural-uk-female' || saved === 'natural-uk-male')) {
      return saved as VoicePersona;
    }
  } catch (e) {
    // ignore
  }
  return 'natural-us-female';
};

export const setPreferredVoicePersona = (persona: VoicePersona) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(VOICE_PREF_KEY, persona);
    } catch (e) {
      // ignore
    }
  }
};

// Cached voices list
let cachedVoices: SpeechSynthesisVoice[] = [];

const refreshVoices = (): SpeechSynthesisVoice[] => {
  if (!synth) return [];
  const list = synth.getVoices();
  if (list && list.length > 0) {
    cachedVoices = list;
  }
  return cachedVoices;
};

// Initialize voice listener
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  refreshVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      refreshVoices();
    };
  }
}

/**
 * Intelligent voice selector that picks high-definition neural voices over mechanical robot voices
 */
const pickBestNaturalVoice = (persona: VoicePersona): { voice: SpeechSynthesisVoice | null; pitch: number; rateMultiplier: number } => {
  const voices = refreshVoices();
  if (!voices || voices.length === 0) {
    return { voice: null, pitch: 1.02, rateMultiplier: 1.0 };
  }

  // Filter strictly to English voices
  const englishVoices = voices.filter(
    (v) => v.lang && (v.lang.toLowerCase().startsWith('en-') || v.lang.toLowerCase() === 'en')
  );

  const pool = englishVoices.length > 0 ? englishVoices : voices;

  const isUK = persona.includes('-uk-');
  const isFemale = persona.includes('-female');

  // Score candidate voices
  const scored = pool.map((v) => {
    let score = 0;
    const name = v.name.toLowerCase();
    const lang = v.lang.toLowerCase();

    // Accent match
    if (isUK && (lang.includes('gb') || lang.includes('uk'))) score += 30;
    if (!isUK && (lang.includes('us') || lang.includes('en-us'))) score += 30;

    // Neural / Natural Quality Signals (Microsoft Online Natural, Google Neural, Apple Enhanced)
    if (name.includes('natural') || name.includes('online (natural)')) score += 60;
    if (name.includes('neural')) score += 55;
    if (name.includes('enhanced') || name.includes('premium')) score += 50;
    if (name.includes('google')) score += 40; // Google's US/UK Web voices are highly natural
    if (v.localService === false) score += 20; // Network-streamed neural voices

    // Gender preferences
    if (isFemale) {
      if (name.includes('jenny') || name.includes('samantha') || name.includes('ava') || name.includes('aria') || name.includes('victoria') || name.includes('serena') || name.includes('zira') || name.includes('female')) {
        score += 35;
      }
      if (name.includes('guy') || name.includes('david') || name.includes('alex') || name.includes('male') || name.includes('daniel')) {
        score -= 20;
      }
    } else {
      if (name.includes('guy') || name.includes('alex') || name.includes('daniel') || name.includes('oliver') || name.includes('david') || name.includes('ryan') || name.includes('male') || name.includes('george')) {
        score += 35;
      }
      if (name.includes('jenny') || name.includes('samantha') || name.includes('aria') || name.includes('female') || name.includes('zira')) {
        score -= 20;
      }
    }

    // Heavy penalty for old robotic fallbacks
    if (name.includes('espeak') || name.includes('compact') || name.includes('sinclair') || name.includes('bad') || name.includes('robot')) {
      score -= 100;
    }

    return { voice: v, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0]?.voice || null;

  // Human warmth pitch modulation:
  // Flat 1.0 sounds mechanical. 1.04 gives warm natural brightness for female, 0.97 gives resonant natural tone for male.
  const pitch = isFemale ? 1.05 : 0.97;
  const rateMultiplier = isFemale ? 0.96 : 0.94;

  return { voice: best, pitch, rateMultiplier };
};

export const playEnglishAudio = (
  text: string,
  rate: number = 0.94,
  overridePersona?: VoicePersona
): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!synth) {
      console.warn('Speech synthesis not supported in this browser.');
      resolve(false);
      return;
    }

    try {
      synth.cancel(); // Stop any pending speech cleanly

      // Slightly smooth pauses by inserting subtle punctuation spacing
      const smoothedText = text
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/([,;])\s*/g, '$1 ')
        .replace(/([.!?])\s*/g, '$1 ');

      const utterance = new SpeechSynthesisUtterance(smoothedText);
      const persona = overridePersona || getPreferredVoicePersona();
      const { voice, pitch, rateMultiplier } = pickBestNaturalVoice(persona);

      utterance.lang = persona.includes('-uk-') ? 'en-GB' : 'en-US';
      utterance.rate = Math.max(0.7, Math.min(1.2, rate * rateMultiplier));
      utterance.pitch = pitch;
      utterance.volume = 1.0;

      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => resolve(true);
      utterance.onerror = (e) => {
        // If canceled explicitly, don't throw error
        if (e.error === 'canceled' || e.error === 'interrupted') {
          resolve(true);
        } else {
          console.warn('Audio synthesis warning:', e);
          resolve(false);
        }
      };

      synth.speak(utterance);
    } catch (err) {
      console.error('Error speaking text:', err);
      resolve(false);
    }
  });
};

export const testPlayVoice = (persona: VoicePersona): Promise<boolean> => {
  const profile = VOICE_PROFILES.find((p) => p.id === persona) || VOICE_PROFILES[0];
  return playEnglishAudio(profile.sampleSentence, 0.94, persona);
};

export const stopAudio = () => {
  if (synth) {
    try {
      synth.cancel();
    } catch (e) {
      // ignore
    }
  }
};

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
