import { TenseData, DiagnosticResult, TenseProgress } from '../types';
import { ALL_12_TENSES } from '../data/tensesData';

export type RecommendationReasonType =
  | 'weakness-reinforcement'
  | 'diagnostic-priority'
  | 'continue-session'
  | 'next-pedagogical-step'
  | 'foundation-start'
  | 'spaced-repetition';

export interface AdaptivePathRecommendation {
  recommendedTense: TenseData;
  reasonType: RecommendationReasonType;
  reasonTitle: string;
  reasonDescription: string;
  badgeLabel: string;
  badgeColorClasses: string;
  progress: TenseProgress | null;
  completionRate: number;
  upcomingQueue: TenseData[];
  hasDiagnostic: boolean;
  diagnosticCEFR: string | null;
  weakCount: number;
}

// Recommended natural scaffolding sequence for language acquisition
export const PEDAGOGICAL_ORDER: string[] = [
  'present-simple',
  'present-continuous',
  'past-simple',
  'past-continuous',
  'future-simple',
  'present-perfect',
  'present-perfect-continuous',
  'past-perfect',
  'future-continuous',
  'future-perfect',
  'past-perfect-continuous',
  'future-perfect-continuous'
];

// Helper to normalize any legacy or variant IDs
const normalizeTenseId = (id: string): string => {
  if (id === 'present-perfect-simple') return 'present-perfect';
  if (id === 'past-perfect-simple') return 'past-perfect';
  if (id === 'future-perfect-simple') return 'future-perfect';
  return id;
};

export function getAdaptiveLearningRecommendation(
  tenseProgress: Record<string, TenseProgress>,
  diagnosticResult: DiagnosticResult | null | undefined,
  weakTenses: string[] = []
): AdaptivePathRecommendation {
  const tensesMap = new Map<string, TenseData>();
  ALL_12_TENSES.forEach((t) => tensesMap.set(t.id, t));

  const hasDiagnostic = Boolean(diagnosticResult && diagnosticResult.score !== undefined);
  const normalizedWeakTenses = weakTenses.map(normalizeTenseId);
  const normalizedDiagnosticPriorities = (diagnosticResult?.priorityTensesToStudy || []).map(normalizeTenseId);

  // 1. Check for Weak Tenses needing urgent reinforcement (score < 70% with practice attempts)
  for (const weakId of normalizedWeakTenses) {
    const tense = tensesMap.get(weakId);
    const prog = tenseProgress[weakId];
    if (tense && prog && prog.practiceCount > 0 && prog.status !== 'mastered') {
      const remainingQueue = getSubsequentQueue(tense.id, tensesMap, tenseProgress, normalizedDiagnosticPriorities);
      return {
        recommendedTense: tense,
        reasonType: 'weakness-reinforcement',
        reasonTitle: 'Refuerzo de Precisión Prioritario',
        reasonDescription: `Tu precisión reciente fue del ${prog.score}%. Practicar este tiempo ahora consolidará tus cimientos antes de avanzar.`,
        badgeLabel: '⚡ Refuerzo Urgente',
        badgeColorClasses: 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700',
        progress: prog,
        completionRate: Math.round((prog.exercisesDone / (prog.totalExercises || 1)) * 100),
        upcomingQueue: remainingQueue,
        hasDiagnostic,
        diagnosticCEFR: diagnosticResult?.levelCode || null,
        weakCount: normalizedWeakTenses.length
      };
    }
  }

  // 2. Check for Diagnostic Test recommendations (prioritized tenses tailored to user's CEFR level)
  if (hasDiagnostic && normalizedDiagnosticPriorities.length > 0) {
    for (const diagId of normalizedDiagnosticPriorities) {
      const tense = tensesMap.get(diagId);
      const prog = tenseProgress[diagId];
      const isMastered = prog && prog.status === 'mastered' && prog.score >= 85;

      if (tense && !isMastered) {
        const remainingQueue = getSubsequentQueue(tense.id, tensesMap, tenseProgress, normalizedDiagnosticPriorities);
        return {
          recommendedTense: tense,
          reasonType: 'diagnostic-priority',
          reasonTitle: `Recomendado por Test de Nivel (${diagnosticResult?.levelCode || 'CEFR'})`,
          reasonDescription: `Identificado como tu objetivo clave de aprendizaje para alcanzar fluidez según tus resultados en la evaluación inicial.`,
          badgeLabel: '🎯 Prioridad del Diagnóstico',
          badgeColorClasses: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700',
          progress: prog || null,
          completionRate: prog ? Math.round((prog.exercisesDone / (prog.totalExercises || 1)) * 100) : 0,
          upcomingQueue: remainingQueue,
          hasDiagnostic,
          diagnosticCEFR: diagnosticResult?.levelCode || null,
          weakCount: normalizedWeakTenses.length
        };
      }
    }
  }

  // 3. Check for In-Progress session (user started but hasn't finished the exercises)
  for (const tenseId of PEDAGOGICAL_ORDER) {
    const prog = tenseProgress[tenseId];
    const tense = tensesMap.get(tenseId);
    if (tense && prog && prog.exercisesDone > 0 && prog.exercisesDone < prog.totalExercises) {
      const remainingQueue = getSubsequentQueue(tense.id, tensesMap, tenseProgress, normalizedDiagnosticPriorities);
      return {
        recommendedTense: tense,
        reasonType: 'continue-session',
        reasonTitle: 'Continúa Tu Lección Abierta',
        reasonDescription: `Tienes ${prog.exercisesDone} de ${prog.totalExercises} ejercicios completados. ¡Termina este bloque para sumar XP y mantener tu racha!`,
        badgeLabel: '📌 En Progreso',
        badgeColorClasses: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700',
        progress: prog,
        completionRate: Math.round((prog.exercisesDone / (prog.totalExercises || 1)) * 100),
        upcomingQueue: remainingQueue,
        hasDiagnostic,
        diagnosticCEFR: diagnosticResult?.levelCode || null,
        weakCount: normalizedWeakTenses.length
      };
    }
  }

  // 4. Natural Pedagogical Step: Find first uncompleted tense in standard order
  for (const tenseId of PEDAGOGICAL_ORDER) {
    const prog = tenseProgress[tenseId];
    const tense = tensesMap.get(tenseId);
    const isCompleted = prog && (prog.status === 'completed' || prog.status === 'mastered');

    if (tense && !isCompleted) {
      const isFirst = tenseId === PEDAGOGICAL_ORDER[0];
      const remainingQueue = getSubsequentQueue(tense.id, tensesMap, tenseProgress, normalizedDiagnosticPriorities);
      return {
        recommendedTense: tense,
        reasonType: isFirst ? 'foundation-start' : 'next-pedagogical-step',
        reasonTitle: isFirst ? 'Punto de Partida Fundamental (A1)' : 'Siguiente Escalón en tu Ruta',
        reasonDescription: isFirst
          ? 'El cimiento absoluto del inglés conversacional y rutinas diarias. Perfecto para dominar antes de avanzar.'
          : 'Has superado los tiempos anteriores. Este es el siguiente paso lógico en la jerarquía pedagógica.',
        badgeLabel: isFirst ? '🌱 Base Recomendada' : '🚀 Siguiente Nivel',
        badgeColorClasses: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
        progress: prog || null,
        completionRate: prog ? Math.round((prog.exercisesDone / (prog.totalExercises || 1)) * 100) : 0,
        upcomingQueue: remainingQueue,
        hasDiagnostic,
        diagnosticCEFR: diagnosticResult?.levelCode || null,
        weakCount: normalizedWeakTenses.length
      };
    }
  }

  // 5. Spaced Repetition / Retention Mode: If all 12 are done, suggest the one with lowest score or oldest study
  let lowestTense = ALL_12_TENSES[0];
  let lowestScore = 100;
  ALL_12_TENSES.forEach((t) => {
    const prog = tenseProgress[t.id];
    const score = prog?.score ?? 100;
    if (score < lowestScore) {
      lowestScore = score;
      lowestTense = t;
    }
  });

  const prog = tenseProgress[lowestTense.id];
  const remainingQueue = getSubsequentQueue(lowestTense.id, tensesMap, tenseProgress, normalizedDiagnosticPriorities);

  return {
    recommendedTense: lowestTense,
    reasonType: 'spaced-repetition',
    reasonTitle: 'Repetición Espaciada para Retención (SRS)',
    reasonDescription: `¡Has explorado todos los 12 tiempos! Repasar ${lowestTense.spanishName} fortalecerá tus conexiones neuronales a largo plazo.`,
    badgeLabel: '🧠 Repaso de Maestría',
    badgeColorClasses: 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700',
    progress: prog || null,
    completionRate: 100,
    upcomingQueue: remainingQueue,
    hasDiagnostic,
    diagnosticCEFR: diagnosticResult?.levelCode || null,
    weakCount: normalizedWeakTenses.length
  };
}

// Generate the next 2-3 upcoming tenses in the user's personal adaptive roadmap queue
function getSubsequentQueue(
  currentTenseId: string,
  tensesMap: Map<string, TenseData>,
  tenseProgress: Record<string, TenseProgress>,
  diagnosticPriorities: string[]
): TenseData[] {
  const queue: TenseData[] = [];

  // If there are other unmastered diagnostic priorities, include them first
  for (const diagId of diagnosticPriorities) {
    if (diagId !== currentTenseId && queue.length < 3) {
      const t = tensesMap.get(diagId);
      const prog = tenseProgress[diagId];
      if (t && (!prog || prog.status !== 'mastered') && !queue.some((q) => q.id === t.id)) {
        queue.push(t);
      }
    }
  }

  // Fill remainder from pedagogical sequence
  const currentIndex = PEDAGOGICAL_ORDER.indexOf(currentTenseId);
  const searchStart = currentIndex >= 0 ? currentIndex + 1 : 0;

  for (let i = 0; i < PEDAGOGICAL_ORDER.length && queue.length < 3; i++) {
    const idx = (searchStart + i) % PEDAGOGICAL_ORDER.length;
    const tId = PEDAGOGICAL_ORDER[idx];
    if (tId !== currentTenseId) {
      const t = tensesMap.get(tId);
      if (t && !queue.some((q) => q.id === t.id)) {
        queue.push(t);
      }
    }
  }

  return queue;
}
