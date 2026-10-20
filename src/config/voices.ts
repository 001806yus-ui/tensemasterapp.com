export const CLOUD_VOICES = {
  'natural-us-female': { voice: 'Aoede', style: 'Warm, relaxed female English teacher with a General American accent. Conversational delivery, natural intonation and clear pronunciation. Normal pace. Read only the transcript.' },
  'natural-us-male': { voice: 'Algieba', style: 'Warm, relaxed male English teacher with a General American accent. Conversational delivery, natural intonation and clear pronunciation. Normal pace. Read only the transcript.' },
  'natural-uk-female': { voice: 'Aoede', style: 'Warm, relaxed female English teacher with a British English accent. Conversational delivery, natural intonation and clear pronunciation. Normal pace. Read only the transcript.' },
  'natural-uk-male': { voice: 'Algieba', style: 'Warm, relaxed male English teacher with a British English accent. Conversational delivery, natural intonation and clear pronunciation. Normal pace. Read only the transcript.' },
} as const;

export const VOICE_SAMPLES = {
  'natural-us-female': 'Hello! Welcome to your English lesson. Let’s practice together.',
  'natural-us-male': 'Hey there! Practicing every day helps you feel more confident in English.',
  'natural-uk-female': 'Good morning! Let’s listen to the rhythm of this English sentence.',
  'natural-uk-male': 'Well done! Keep practising, one sentence at a time.',
} as const;

export const normalizeSpeechText = (text: string) => text.trim().replace(/\s+/g, ' ');
