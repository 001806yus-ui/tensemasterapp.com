import React, { useState } from 'react';
import { TenseData } from '../types';
import { useUser } from '../context/UserContext';
import { playEnglishAudio } from '../utils/speech';
import { Volume2, Lock, CheckCircle2, PlayCircle, BookOpen, ChevronRight, Bookmark, Mic } from 'lucide-react';
import { TENSE_LOCALIZED_NAMES } from '../i18n/translations';
import { CircularProgress } from './CircularProgress';

interface TenseCardProps {
  tense: TenseData;
  onSelect: (tense: TenseData, initialTab?: 'formulas' | 'examples' | 'pronunciation' | 'video' | 'practice' | 'mistakes') => void;
  onOpenSubscription: () => void;
}

export const TenseCard: React.FC<TenseCardProps> = ({
  tense,
  onSelect,
  onOpenSubscription
}) => {
  const { canAccessTense, progressState, toggleBookmark, nativeLanguage, t, ownerConfig } = useUser();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const localized = TENSE_LOCALIZED_NAMES[tense.id]?.[nativeLanguage] || {
    name: tense.spanishName,
    tagline: tense.tagline
  };

  const hasAccess = canAccessTense(tense.id);
  const progress = progressState.tenseProgress[tense.id] || {
    score: 0,
    status: 'not-started',
    exercisesDone: 0,
    totalExercises: tense.exercises.length
  };
  const isBookmarked = progressState.bookmarkedTenses.includes(tense.id);

  const totalExercises = progress.totalExercises || tense.exercises.length || 5;
  const exercisesDone = progress.exercisesDone || 0;

  // Calculate completion percentage reliably
  const completionPercentage = Math.min(
    100,
    Math.max(
      0,
      progress.status === 'mastered' || progress.status === 'completed'
        ? 100
        : exercisesDone > 0 && totalExercises > 0
        ? Math.round((exercisesDone / totalExercises) * 100)
        : progress.score > 0
        ? progress.score
        : 0
    )
  );

  const firstExample = tense.examples[0];

  const handleAudioClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!firstExample) return;
    setIsPlayingAudio(true);
    await playEnglishAudio(firstExample.audioText);
    setIsPlayingAudio(false);
  };

  const handleCardClick = () => {
    if (!hasAccess) {
      onOpenSubscription();
    } else {
      onSelect(tense);
    }
  };

  // Group colors for subtle accents
  const groupBadgeClass = {
    present: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    past: 'text-amber-700 bg-amber-50 border-amber-200',
    future: 'text-blue-600 bg-blue-50 border-blue-100'
  }[tense.group];

  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-white dark:bg-slate-900 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden ${
        hasAccess
          ? 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md'
          : 'border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 hover:border-slate-300'
      }`}
    >
      {/* Top Banner & Status */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          {/* Metadata: Level + Group (Clean unboxed text) */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {localized.name}
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="font-mono text-slate-500 dark:text-slate-400">
              {tense.cefrLevel}
            </span>
          </div>

          {/* Bookmark & Access / Status indicator */}
          <div className="flex items-center gap-2">
            {hasAccess && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBookmark(tense.id);
                }}
                className={`p-1 rounded text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer ${
                  isBookmarked ? 'text-indigo-600 fill-indigo-600' : ''
                }`}
                title="Guardar como favorito"
              >
                <Bookmark className="w-3.5 h-3.5" />
              </button>
            )}

            {!hasAccess ? (
              <span className="flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-400">
                <Lock className="w-3 h-3" />
                <span>Pase ${(ownerConfig?.priceMonthly || 1.99).toFixed(2)}</span>
              </span>
            ) : progress.status === 'mastered' ? (
              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>{t.mastered}</span>
              </span>
            ) : progress.status === 'in-progress' ? (
              <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                {t.inProgress}
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                {t.notStarted}
              </span>
            )}
          </div>
        </div>

        {/* Title and Circular Progress Indicator */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">
              {tense.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {localized.tagline}
            </p>
          </div>

          {/* Animated Circular Progress Meter */}
          {hasAccess && (
            <div
              className="flex flex-col items-center justify-center shrink-0 pt-0.5"
              title={`Progreso de lección: ${completionPercentage}% (${exercisesDone} de ${totalExercises} ejercicios completados)`}
            >
              <CircularProgress
                percentage={completionPercentage}
                size={40}
                strokeWidth={3.5}
                status={progress.status}
              />
              <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-wider">
                Lección
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Middle: Formula & Audio Example */}
      <div className="px-5 py-3 space-y-3 bg-slate-50/70 dark:bg-slate-850/60 border-y border-slate-100 dark:border-slate-800">
        {/* Formula summary */}
        <div className="text-[11px] font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2 rounded-md border border-slate-200/80 dark:border-slate-700 truncate">
          <span className="text-slate-400 dark:text-slate-500 font-sans mr-1">{t.formulaLabel}</span>
          {tense.formula.affirmative}
        </div>

        {/* Audio Sample Box */}
        {firstExample && (
          <div className="flex items-center justify-between gap-2 p-2 bg-white dark:bg-slate-900 rounded-md border border-slate-200/60 dark:border-slate-750 text-xs">
            <div className="truncate">
              <span className="font-medium text-slate-800 dark:text-slate-200 block truncate">
                "{firstExample.english}"
              </span>
              <span className="text-slate-400 dark:text-slate-500 text-[11px] block truncate">
                {firstExample.spanish}
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleAudioClick}
                disabled={isPlayingAudio}
                className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-indigo-600 text-white animate-pulse'
                    : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white'
                }`}
                title="Escuchar pronunciación nativa del profesor"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isPlayingAudio ? '...' : 'Escuchar'}</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasAccess) {
                    onSelect(tense, 'pronunciation');
                  } else {
                    onOpenSubscription();
                  }
                }}
                className="px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-600 hover:text-white"
                title="Grabar y practicar tu pronunciación con micrófono"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Grabar Voz</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer: Progress and CTA */}
      <div className="p-4 pt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (hasAccess) {
                onSelect(tense, 'video');
              } else {
                onOpenSubscription();
              }
            }}
            className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            title="Ver videoclase completa"
          >
            <PlayCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>{tense.videoLesson.duration}</span>
          </button>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>{tense.exercises.length} ejercicios</span>
          </span>
        </div>

        <div className="flex items-center gap-1 font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          <span>{hasAccess ? t.enterTense : t.unlockTense}</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* Micro progress bar at bottom */}
      {hasAccess && (
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1">
          <div
            className={`h-1 transition-all duration-700 ease-out ${
              completionPercentage >= 100
                ? 'bg-emerald-500'
                : 'bg-indigo-600'
            }`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      )}
    </div>
  );
};
