import { useLocalization } from "../i18n/LocalizationContext";
import React from 'react';
import { TenseData } from '../types';
import { useUser } from '../context/UserContext';
import { TENSE_LOCALIZED_NAMES } from '../i18n/translations';
import { playEnglishAudio } from '../utils/speech';
import { sounds } from '../utils/soundEffects';
import {
  ChevronRight,
  Volume2,
  Bookmark,
  CheckCircle2,
  Lock,
  Sparkles } from
'lucide-react';

interface CleanTensesListViewProps {
  tenses: TenseData[];
  onSelectTense: (tense: TenseData) => void;
  onOpenSubscription: () => void;
}

export const CleanTensesListView: React.FC<CleanTensesListViewProps> = ({
  tenses,
  onSelectTense,
  onOpenSubscription
}) => {const { l } = useLocalization();
  const { progressState, toggleBookmark, canAccessTense, nativeLanguage, isPro } = useUser();

  // Helper to get letter badge like in the screenshot
  const getInitialBadge = (tense: TenseData): {letter: string;color: string;} => {
    const aspect = tense.aspect;
    if (aspect === 'simple') {
      return { letter: 'S', color: 'bg-[#FF5A36] text-white' };
    }
    if (aspect === 'continuous') {
      return { letter: 'P', color: 'bg-[#FF5A36] text-white' };
    }
    if (aspect === 'perfect') {
      return { letter: 'P', color: 'bg-[#FF5A36] text-white' };
    }
    return { letter: 'P', color: 'bg-[#FF5A36] text-white' };
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
      {l(tenses.map((tense) => {
        const hasAccess = canAccessTense(tense.id);
        const isBookmarked = progressState.bookmarkedTenses.includes(tense.id);
        const progress = progressState.tenseProgress[tense.id];
        const isMastered = progress && (progress.status === 'mastered' || progress.score >= 80);
        const badge = getInitialBadge(tense);
        const localizedName = nativeLanguage === 'en' ?
        tense.tagline :
        TENSE_LOCALIZED_NAMES[tense.id]?.[nativeLanguage]?.name || tense.spanishName;

        const handleRowClick = () => {
          sounds.playClick();
          if (hasAccess) {
            onSelectTense(tense);
          } else {
            onOpenSubscription();
          }
        };

        const handlePlayAudio = (e: React.MouseEvent) => {
          e.stopPropagation();
          sounds.playClick();
          const firstEx = tense.examples[0]?.english || tense.name;
          playEnglishAudio(firstEx);
        };

        const handleToggleBookmark = (e: React.MouseEvent) => {
          e.stopPropagation();
          sounds.playClick();
          toggleBookmark(tense.id);
        };

        return (
          <div
            key={tense.id}
            onClick={handleRowClick}
            className="flex items-center justify-between p-4 sm:p-5 hover:bg-slate-50/80 dark:hover:bg-slate-850/80 transition-colors cursor-pointer group select-none">
            
            {/* Left Column: Badge + Title + Subtitle */}
            <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
              {/* Vibrant Badge like screenshot */}
              <div
                className={`w-10 h-10 rounded-xl ${badge.color} flex items-center justify-center font-bold text-lg shrink-0 shadow-xs`}>
                
                {l(badge.letter)}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {l(tense.name)}
                  </h3>

                  {l(isMastered &&
                  <span title={l(nativeLanguage === 'en' ? 'Mastered' : 'Dominado')}>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    </span>)
                  }

                  {l(!hasAccess &&
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center gap-1 shrink-0">
                      <Lock className="w-3 h-3" />
                      <span>{l("PRO")}</span>
                    </span>)
                  }
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {l(localizedName)} · <span className="font-mono text-[11px] text-slate-400">{l(tense.formula.affirmative).split('(+')[0].trim()}</span>
                </p>
              </div>
            </div>

            {/* Right Column: Actions & Chevron */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 ml-3">
              {/* Audio Listen */}
              <button
                type="button"
                onClick={handlePlayAudio}
                title={l(nativeLanguage === 'en' ? 'Listen to pronunciation' : 'Escuchar ejemplo de pronunciación')}
                className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/40 rounded-xl transition-colors cursor-pointer">
                
                <Volume2 className="w-4 h-4" />
              </button>

              {/* Bookmark */}
              <button
                type="button"
                onClick={handleToggleBookmark}
                title={l(isBookmarked ? nativeLanguage === 'en' ? 'Remove from Bookmarks' : 'Quitar de Favoritos' : nativeLanguage === 'en' ? 'Save to Bookmarks' : 'Guardar en Favoritos')}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isBookmarked ?
                'text-amber-500 bg-amber-50 dark:bg-amber-950/40' :
                'text-slate-300 dark:text-slate-600 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`
                }>
                
                <Bookmark className="w-4 h-4 fill-current" />
              </button>

              {/* Chevron Arrow (as seen in IMG_5591.png) */}
              <div className="p-1 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </div>);

      }))}
    </div>);

};
