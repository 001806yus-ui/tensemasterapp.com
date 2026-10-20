import { useLocalization } from "../i18n/LocalizationContext";
import React, { useState } from 'react';
import { ALL_12_TENSES } from '../data/tensesData';
import { TenseData, TenseAspect, TenseGroup } from '../types';
import { useUser } from '../context/UserContext';
import { playEnglishAudio, stopAudio } from '../utils/speech';
import { Volume2, Lock, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';
import { SUPPORTED_LANGUAGES, TENSE_LOCALIZED_NAMES } from '../i18n/translations';

interface TenseMatrixProps {
  onSelectTense: (tense: TenseData) => void;
  onOpenSubscription: () => void;
}

export const TenseMatrix: React.FC<TenseMatrixProps> = ({
  onSelectTense,
  onOpenSubscription
}) => {const { l } = useLocalization();
  const { canAccessTense, progressState, nativeLanguage, t } = useUser();
  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === nativeLanguage) || SUPPORTED_LANGUAGES[0];
  const [playingCellId, setPlayingCellId] = useState<string | null>(null);

  const aspects: {key: TenseAspect;title: string;subtitle: string;}[] = [
  { key: 'simple', title: t.aspectSimple || 'Simple', subtitle: t.aspectSimpleSub || '' },
  { key: 'continuous', title: t.aspectContinuous || 'Continuo', subtitle: t.aspectContinuousSub || '' },
  { key: 'perfect', title: t.aspectPerfect || 'Perfecto', subtitle: t.aspectPerfectSub || '' },
  { key: 'perfect-continuous', title: t.aspectPerfectContinuous || 'Perfecto Continuo', subtitle: t.aspectPerfectContinuousSub || '' }];


  const groups: {key: TenseGroup;title: string;color: string;}[] = [
  { key: 'past', title: t.groupPast || 'Pasado (Past)', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { key: 'present', title: t.groupPresent || 'Presente (Present)', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  { key: 'future', title: t.groupFuture || 'Futuro (Future)', color: 'text-blue-700 bg-blue-50 border-blue-200' }];


  const getTenseByCoord = (group: TenseGroup, aspect: TenseAspect) => {
    return ALL_12_TENSES.find((t) => t.group === group && t.aspect === aspect);
  };

  const handlePlay = async (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    if (playingCellId === id) {
      stopAudio();
      setPlayingCellId(null);
      return;
    }
    setPlayingCellId(id);
    await playEnglishAudio(text);
    setPlayingCellId(null);
  };

  return (
    <div className="py-6 sm:py-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 w-full overflow-hidden">
      {/* Intro Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 rounded-full text-xs font-semibold text-indigo-700 dark:text-indigo-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{l(t.matrixMapTag)}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-white">
          {l(t.matrixTitle)}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          {l(t.matrixSubtitle)}
        </p>
      </div>

      {/* The 3x4 Matrix Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden w-full">
        <div className="sm:hidden px-3 pt-2.5 pb-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1 font-medium text-indigo-600 dark:text-indigo-400">👉 {l('Swipe to see more')}</span>
          <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">3 × 4</span>
        </div>
        <div className="overflow-x-auto w-full overscroll-x-contain">
          <table className="w-full border-collapse min-w-[700px] lg:min-w-0 lg:w-full table-fixed text-left">
            {/* Header Columns */}
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <th className="p-3 sm:p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-1/4">
                  {l(t.matrixColAspect)}
                </th>
                {l(groups.map((g) =>
                <th key={g.key} className="p-3 sm:p-4 text-left w-1/4">
                    <span className={`inline-block px-3 py-1 text-xs font-bold rounded-md border ${g.color}`}>
                      {l(g.title)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Matrix Body Rows */}
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {l(aspects.map((aspect) =>
              <tr key={aspect.key} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  {/* Left Label */}
                  <td className="p-3 sm:p-4 bg-slate-50/50 dark:bg-slate-850/50 border-r border-slate-100 dark:border-slate-800 align-top">
                    <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {l(aspect.title)}
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {l(aspect.subtitle)}
                    </div>
                  </td>

                  {/* 3 Cells for Past, Present, Future */}
                  {l(groups.map((group) => {
                  const tense = getTenseByCoord(group.key, aspect.key);
                  if (!tense) return <td key={group.key} className="p-4" />;

                  const hasAccess = canAccessTense(tense.id);
                  const progress = progressState.tenseProgress[tense.id];
                  const firstEx = tense.examples[0];

                  return (
                    <td
                      key={group.key}
                      onClick={() => hasAccess ? onSelectTense(tense) : onOpenSubscription()}
                      className={`p-3 sm:p-3.5 border-r border-slate-100 dark:border-slate-800 last:border-r-0 align-top transition-all cursor-pointer relative group ${
                      hasAccess ? 'hover:bg-indigo-50/30 dark:hover:bg-indigo-950/30' : 'bg-slate-50/40 dark:bg-slate-850/40 opacity-80'}`
                      }>
                      
                        <div className="space-y-1.5">
                          {/* Title & Badge */}
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                              {l(TENSE_LOCALIZED_NAMES[tense.id]?.[nativeLanguage]?.name || tense.name)}
                            </span>
                            {l(!hasAccess ?
                          <span className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800 font-semibold flex items-center gap-0.5">
                                <Lock className="w-2.5 h-2.5" /> <span>{l("PRO")}</span>
                              </span> :
                          progress?.status === 'mastered' ?
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" /> :

                          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                                {l(tense.cefrLevel)}
                              </span>)
                          }
                          </div>

                          {/* Quick Formula Snippet */}
                          <div className="text-[11px] font-mono text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-1.5 rounded border border-slate-200/60 dark:border-slate-700 truncate">
                            {l(tense.formula.affirmative)}
                          </div>

                          {/* Example with quick Audio */}
                          {l(firstEx &&
                        <div className="flex items-center justify-between gap-1 text-[11px] text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-850 p-1.5 rounded border border-slate-200/50 dark:border-slate-750">
                              <span className="truncate italic">
                                "{firstEx.english}"
                              </span>
                              <button
                            type="button"
                            onClick={(e) => handlePlay(e, firstEx.audioText, tense.id)}
                            className={`p-1 rounded-md text-slate-500 hover:text-white hover:bg-indigo-600 shrink-0 transition-colors cursor-pointer ${
                            playingCellId === tense.id ? 'bg-indigo-600 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800'}`
                            }
                            title={l(t.matrixListen || 'Escuchar pronunciación')}>
                            
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>)
                        }

                          {/* Action hint */}
                          <div className="pt-1 flex justify-end text-[10px] font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="flex items-center gap-0.5">
                              {l(hasAccess ? t.matrixOpenLesson || 'Abrir lección' : t.matrixUnlock || 'Desbloquear')} <ExternalLink className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      </td>);

                }))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

};
