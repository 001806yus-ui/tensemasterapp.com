import { TenseData } from '../types/index.js';

// The public part of a membership lesson. Exercises keep their count (progress
// and the lesson cards show it) but none of their content.
export function toPreview(tense: TenseData): TenseData {
  return {
    id: tense.id,
    name: tense.name,
    spanishName: tense.spanishName,
    group: tense.group,
    aspect: tense.aspect,
    cefrLevel: tense.cefrLevel,
    isFreePreview: false,
    tagline: tense.tagline,
    timelineGraphic: { ...tense.timelineGraphic },
    formula: { ...tense.formula },
    whenToUse: tense.whenToUse.slice(0, 2).map((use) => ({ ...use })),
    signalWords: [...tense.signalWords],
    commonMistakes: [],
    examples: tense.examples.slice(0, 1).map((example) => ({ ...example })),
    videoLesson: { title: tense.videoLesson.title, instructor: '', youtubeId: '', duration: tense.videoLesson.duration, summary: '', keyTakeaways: [] },
    exercises: tense.exercises.map((exercise) => ({ id: exercise.id, type: exercise.type, prompt: '', correctAnswer: '', explanation: '' })),
  };
}
