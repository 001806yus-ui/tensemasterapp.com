import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { ALL_12_TENSES } from '../data/tensesData';
import confetti from 'canvas-confetti';
import {
  Flame,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Coffee,
  Heart,
  FileDown,
  Target,
  ArrowRight,
  TrendingUp,
  Clock,
  Compass,
  Smile
} from 'lucide-react';

interface AntiBurnoutCompanionProps {
  onOpenDiagnostic: () => void;
  onOpenTenseDetail: (tenseId: string) => void;
  onOpenFlashcards: () => void;
}

export const AntiBurnoutCompanion: React.FC<AntiBurnoutCompanionProps> = ({
  onOpenDiagnostic,
  onOpenTenseDetail,
  onOpenFlashcards
}) => {
  const {
    progressState,
    dailyPaceMode,
    setDailyPaceMode,
    exportProgressPDF,
    useStreakFreeze,
    logDailyPractice,
    overallMasteryPercentage
  } = useUser();

  const [microCompleted, setMicroCompleted] = useState<boolean>(false);
  const [selectedMicroAnswer, setSelectedMicroAnswer] = useState<number | null>(null);
  const [showMicroFeedback, setShowMicroFeedback] = useState<boolean>(false);

  // Micro daily bite question (rotates based on day)
  const microQuestion = {
    prompt: 'Elige la opción correcta para tu dosis rápida de 1 minuto:',
    sentence: 'I ________ in this city since 2018.',
    options: ['have lived', 'live', 'am living'],
    correct: 0,
    explanation: '¡Excelente! "Since 2018" indica un punto de inicio en el pasado que sigue vigente hoy, exigiendo Present Perfect ("have lived").'
  };

  const handleMicroAnswer = (idx: number) => {
    if (showMicroFeedback) return;
    setSelectedMicroAnswer(idx);
    setShowMicroFeedback(true);

    if (idx === microQuestion.correct) {
      setMicroCompleted(true);
      logDailyPractice(25);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 }
        });
      } catch (e) {
        // ignore
      }
    }
  };

  // Find the next recommended tense: one that is in-progress or not-started
  const nextRecommendedTense = ALL_12_TENSES.find((t) => {
    const prog = progressState.tenseProgress[t.id];
    return !prog || prog.status === 'in-progress' || prog.status === 'not-started';
  }) || ALL_12_TENSES[0];

  const currentTenseProg = progressState.tenseProgress[nextRecommendedTense.id];
  const exercisesLeft = Math.max(0, (nextRecommendedTense.exercises.length) - (currentTenseProg?.exercisesDone || 0));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Module 1: Daily Micro-Learning Bite (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 text-xs">
              <div className="flex items-center gap-2 font-semibold text-indigo-600 dark:text-indigo-400">
                <Coffee className="w-4 h-4" />
                <span>Dosis diaria rápida</span>
                <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>
                <span className="text-slate-500 dark:text-slate-400 font-normal">1 minuto sin agobios</span>
              </div>
              <span className="text-slate-400 text-[11px] font-mono">+25 XP</span>
            </div>

            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              {microQuestion.prompt}
            </h4>
            <div className="mt-2 p-2.5 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-200/60 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 font-medium">
              {microQuestion.sentence}
            </div>

            <div className="mt-3 space-y-1.5">
              {microQuestion.options.map((opt, idx) => {
                const isCorrect = idx === microQuestion.correct;
                const isSelected = selectedMicroAnswer === idx;

                let btnClass = 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-300';
                if (showMicroFeedback) {
                  if (isCorrect) {
                    btnClass = 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 text-emerald-800 dark:text-emerald-200 font-medium';
                  } else if (isSelected) {
                    btnClass = 'bg-rose-50 dark:bg-rose-950/50 border-rose-400 text-rose-800 dark:text-rose-200';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleMicroAnswer(idx)}
                    disabled={showMicroFeedback}
                    className={`w-full py-2 px-3 text-xs rounded-lg border text-left flex items-center justify-between transition-colors cursor-pointer ${btnClass}`}
                  >
                    <span>{opt}</span>
                    {showMicroFeedback && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </button>
                );
              })}
            </div>

            {showMicroFeedback && (
              <div className="mt-2.5 p-2.5 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-lg text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed border border-emerald-200/70 dark:border-emerald-800/40">
                {microQuestion.explanation}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Práctica constante para no oxidar tu inglés</span>
            {microCompleted && (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Cumplido hoy
              </span>
            )}
          </div>
        </div>

        {/* Module 2: Micro-Learning Pace & Streak Protection (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                <span>Ritmo de estudio</span>
              </div>
              <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{progressState.streakDays} días</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ajusta los minutos que tienes disponibles hoy:
            </p>

            <div className="grid grid-cols-3 gap-2 mt-3">
              <button
                onClick={() => setDailyPaceMode('relax')}
                className={`p-2.5 rounded-lg border text-center transition-colors cursor-pointer ${
                  dailyPaceMode === 'relax'
                    ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="text-xs font-semibold">Relajado</div>
                <div className="text-[10px] text-slate-400 mt-0.5">3 min</div>
              </button>

              <button
                onClick={() => setDailyPaceMode('regular')}
                className={`p-2.5 rounded-lg border text-center transition-colors cursor-pointer ${
                  dailyPaceMode === 'regular'
                    ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="text-xs font-semibold">Equilibrado</div>
                <div className="text-[10px] text-slate-400 mt-0.5">8 min</div>
              </button>

              <button
                onClick={() => setDailyPaceMode('intensive')}
                className={`p-2.5 rounded-lg border text-center transition-colors cursor-pointer ${
                  dailyPaceMode === 'intensive'
                    ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="text-xs font-semibold">Intenso</div>
                <div className="text-[10px] text-slate-400 mt-0.5">15 min</div>
              </button>
            </div>

            {/* Streak Freeze Toggle */}
            <div className="mt-3.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">Escudo de racha</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Protege tu racha si descansas hoy</div>
              </div>
              <button
                onClick={useStreakFreeze}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  progressState.streakFreezeUsed
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                }`}
              >
                {progressState.streakFreezeUsed ? 'Protegido' : 'Disponible'}
              </button>
            </div>
          </div>

          <div className="mt-3 pt-2 text-[11px] text-slate-400 dark:text-slate-500">
            Avanza a tu propio paso sin saturarte.
          </div>
        </div>

      </div>
    </div>
  );
};
