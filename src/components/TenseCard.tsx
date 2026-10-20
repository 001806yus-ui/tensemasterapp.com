import { useLocalization } from "../i18n/LocalizationContext";
import React, { useState } from 'react';
import { TenseData } from '../types';
import { useUser } from '../context/UserContext';
import { playEnglishAudio, stopAudio } from '../utils/speech';
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
}) => {const { l } = useLocalization();
  const { canAccessTense, progressState, toggleBookmark, nativeLanguage, t, ownerConfig, getExampleTranslation } = useUser();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const isEn = nativeLanguage === 'en';
  const localized = isEn ?
  {
    name: tense.aspect.charAt(0).toUpperCase() + tense.aspect.slice(1),
    tagline: tense.tagline
  } :
  TENSE_LOCALIZED_NAMES[tense.id]?.[nativeLanguage] || {
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
      progress.status === 'mastered' || progress.status === 'completed' ?
      100 :
      exercisesDone > 0 && totalExercises > 0 ?
      Math.round(exercisesDone / totalExercises * 100) :
      progress.score > 0 ?
      progress.score :
      0
    )
  );

  const firstExample = tense.examples[0];

  const handleAudioClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!firstExample) return;
    if (isPlayingAudio) {
      stopAudio();
      setIsPlayingAudio(false);
      return;
    }
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
      hasAccess ?
      'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md' :
      'border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 hover:border-slate-300'}`
      }>
      
      {/* Top Banner & Status */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          {/* Metadata: Level + Group (Clean unboxed text) */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {l(localized.name)}
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="font-mono text-slate-500 dark:text-slate-400">
              {l(tense.cefrLevel)}
            </span>
          </div>

          {/* Bookmark & Access / Status indicator */}
          <div className="flex items-center gap-2">
            {l(hasAccess &&
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleBookmark(tense.id);
              }}
              className={`p-1 rounded text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer ${
              isBookmarked ? 'text-indigo-600 fill-indigo-600' : ''}`
              }
              title={l(t.tooltipBookmark || 'Favorito')}>
              
                <Bookmark className="w-3.5 h-3.5" />
              </button>)
            }

            {l(!hasAccess ?
            <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200/80 dark:border-amber-800/80">
                <Lock className="w-3 h-3" />
                <span>{l("PRO")}</span>
              </span> :
            progress.status === 'mastered' ?
            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>{l(t.mastered)}</span>
              </span> :
            progress.status === 'in-progress' ?
            <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                {l(t.inProgress)}
              </span> :

            <span className="text-[11px] text-slate-400 dark:text-slate-500">
                {l(t.notStarted)}
              </span>)
            }
          </div>
        </div>

        {/* Title and Circular Progress Indicator */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">
              {l(tense.name)}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {l(localized.tagline)}
            </p>
          </div>

          {/* Animated Circular Progress Meter */}
          {l(hasAccess &&
          <div
            className="flex flex-col items-center justify-center shrink-0 pt-0.5"
            title={l("{{0}}: {{1}}% ({{2}}/{{3}})", [t.navProgress || 'Progreso', completionPercentage, exercisesDone, totalExercises])}>
            
              <CircularProgress
              percentage={completionPercentage}
              size={40}
              strokeWidth={3.5}
              status={progress.status} />
            
              <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-wider">
                {l(t.catalogTitle?.split(' ')[0] || 'Lesson')}
              </span>
            </div>)
          }
        </div>
      </div>

      {/* Middle: Formula & Audio Example */}
      <div className="px-5 py-3 space-y-3 bg-slate-50/70 dark:bg-slate-850/60 border-y border-slate-100 dark:border-slate-800">
        {/* Formula summary */}
        <div className="text-[11px] font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2 rounded-md border border-slate-200/80 dark:border-slate-700 truncate">
          <span className="text-slate-400 dark:text-slate-500 font-sans mr-1">{l(t.formulaLabel)}</span>
          {l(tense.formula.affirmative)}
        </div>

        {/* Audio Sample Box */}
        {l(firstExample &&
        <div className="flex items-center justify-between gap-2 p-2 bg-white dark:bg-slate-900 rounded-md border border-slate-200/60 dark:border-slate-750 text-xs">
            <div className="truncate">
              <span className="font-medium text-slate-800 dark:text-slate-200 block truncate">
                "{firstExample.english}"
              </span>
              <span className="text-slate-400 dark:text-slate-500 text-[11px] block truncate">
                {l(getExampleTranslation(tense.id, firstExample.spanish))}
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
              type="button"
              onClick={handleAudioClick}
              disabled={isPlayingAudio}
              className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              isPlayingAudio ?
              'bg-indigo-600 text-white animate-pulse' :
              'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white'}`
              }
              title={l(t.listenAudio || 'Escuchar')}>
              
                <Volume2 className="w-3.5 h-3.5" />
                <span>{l(isPlayingAudio ? '...' : t.listenAudio || 'Escuchar')}</span>
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
              title={l(t.recordVoice || 'Grabar Voz')}>
              
                <Mic className="w-3.5 h-3.5" />
                <span>{l(t.recordVoice || 'Grabar Voz')}</span>
              </button>
            </div>
          </div>)
        }
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
            title={l(t.viewVideo || 'Ver videoclase')}>
            
            <PlayCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>{l(tense.videoLesson.duration)}</span>
          </button>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>{l(tense.exercises.length)} {l(t.exercisesCount || 'ejercicios')}</span>
          </span>
        </div>

        <div className="flex items-center gap-1 font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          <span>{l(hasAccess ? t.enterTense : t.unlockTense)}</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* Micro progress bar at bottom */}
      {l(hasAccess &&
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1">
          <div
          className={`h-1 transition-all duration-700 ease-out ${
          completionPercentage >= 100 ?
          'bg-emerald-500' :
          'bg-indigo-600'}`
          }
          style={{ width: `${completionPercentage}%` }} />
        
        </div>)
      }
    </div>);

};
