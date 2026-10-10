import React, { useState } from 'react';
import { ALL_12_TENSES } from '../data/tensesData';
import { TenseData, TenseAspect, TenseGroup } from '../types';
import { useUser } from '../context/UserContext';
import { playEnglishAudio } from '../utils/speech';
import { Volume2, Lock, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';
import { SUPPORTED_LANGUAGES, TENSE_LOCALIZED_NAMES } from '../i18n/translations';

interface TenseMatrixProps {
  onSelectTense: (tense: TenseData) => void;
  onOpenSubscription: () => void;
}

export const TenseMatrix: React.FC<TenseMatrixProps> = ({
  onSelectTense,
  onOpenSubscription
}) => {
  const { canAccessTense, progressState, nativeLanguage } = useUser();
  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === nativeLanguage) || SUPPORTED_LANGUAGES[0];
  const [playingCellId, setPlayingCellId] = useState<string | null>(null);

  const aspects: { key: TenseAspect; title: string; subtitle: string }[] = [
    { key: 'simple', title: 'Simple', subtitle: 'Acción puntual o habitual' },
    { key: 'continuous', title: 'Continuo / Progressive', subtitle: 'Acción en progreso duradero' },
    { key: 'perfect', title: 'Perfecto', subtitle: 'Acción previa con impacto' },
    { key: 'perfect-continuous', title: 'Perfecto Continuo', subtitle: 'Duración acumulada continua' }
  ];

  const groups: { key: TenseGroup; title: string; color: string }[] = [
    { key: 'past', title: 'Pasado (Past)', color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { key: 'present', title: 'Presente (Present)', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
    { key: 'future', title: 'Futuro (Future)', color: 'text-blue-700 bg-blue-50 border-blue-200' }
  ];

  const getTenseByCoord = (group: TenseGroup, aspect: TenseAspect) => {
    return ALL_12_TENSES.find((t) => t.group === group && t.aspect === aspect);
  };

  const handlePlay = async (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    setPlayingCellId(id);
    await playEnglishAudio(text);
    setPlayingCellId(null);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-xs font-semibold text-indigo-700">
          <Sparkles className="w-3.5 h-3.5" />
          <span>El Mapa Mental Completo del Inglés</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
          Matriz Maestra 3 × 4 Sin Complicaciones
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Todo el sistema verbal del inglés resumido en una cuadrícula coordinada. Compara cómo cambia el mismo verbo a través del tiempo.
        </p>
      </div>

      {/* The 3x4 Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[760px]">
            {/* Header Columns */}
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 w-1/4">
                  Aspecto / Tiempo
                </th>
                {groups.map((g) => (
                  <th key={g.key} className="p-4 text-left w-1/4">
                    <span className={`inline-block px-3 py-1 text-xs font-bold rounded-md border ${g.color}`}>
                      {g.title}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Matrix Body Rows */}
            <tbody className="divide-y divide-slate-100">
              {aspects.map((aspect) => (
                <tr key={aspect.key} className="hover:bg-slate-50/50 transition-colors">
                  {/* Left Label */}
                  <td className="p-4 bg-slate-50/30 border-r border-slate-100 align-top">
                    <div className="font-bold text-sm text-slate-900">
                      {aspect.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {aspect.subtitle}
                    </div>
                  </td>

                  {/* 3 Cells for Past, Present, Future */}
                  {groups.map((group) => {
                    const tense = getTenseByCoord(group.key, aspect.key);
                    if (!tense) return <td key={group.key} className="p-4" />;

                    const hasAccess = canAccessTense(tense.id);
                    const progress = progressState.tenseProgress[tense.id];
                    const firstEx = tense.examples[0];

                    return (
                      <td
                        key={group.key}
                        onClick={() => (hasAccess ? onSelectTense(tense) : onOpenSubscription())}
                        className={`p-3.5 border-r border-slate-100 last:border-r-0 align-top transition-all cursor-pointer relative group ${
                          hasAccess ? 'hover:bg-indigo-50/30' : 'bg-slate-50/40 opacity-80'
                        }`}
                      >
                        <div className="space-y-1.5">
                          {/* Title & Badge */}
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                              {(TENSE_LOCALIZED_NAMES[tense.id]?.[nativeLanguage]?.name || tense.name)}
                            </span>
                            {!hasAccess ? (
                              <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 font-semibold flex items-center gap-0.5">
                                <Lock className="w-2.5 h-2.5" /> {currentLang.currencyEquiv.split(' ')[0]}
                              </span>
                            ) : progress?.status === 'mastered' ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <span className="text-[10px] font-mono text-slate-400">
                                {tense.cefrLevel}
                              </span>
                            )}
                          </div>

                          {/* Quick Formula Snippet */}
                          <div className="text-[11px] font-mono text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-200/60 truncate">
                            {tense.formula.affirmative}
                          </div>

                          {/* Example with quick Audio */}
                          {firstEx && (
                            <div className="flex items-center justify-between gap-1 text-[11px] text-slate-700 bg-white p-1.5 rounded border border-slate-200/50">
                              <span className="truncate italic">
                                "{firstEx.english}"
                              </span>
                              <button
                                type="button"
                                onClick={(e) => handlePlay(e, firstEx.audioText, tense.id)}
                                className={`p-1 rounded-md text-slate-500 hover:text-white hover:bg-indigo-600 shrink-0 transition-colors cursor-pointer ${
                                  playingCellId === tense.id ? 'bg-indigo-600 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800'
                                }`}
                                title="Escuchar pronunciación"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}

                          {/* Action hint */}
                          <div className="pt-1 flex justify-end text-[10px] font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="flex items-center gap-0.5">
                              {hasAccess ? 'Abrir lección' : 'Desbloquear'} <ExternalLink className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
