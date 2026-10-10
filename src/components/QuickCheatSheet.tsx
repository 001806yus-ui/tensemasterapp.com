import React from 'react';
import { ALL_12_TENSES } from '../data/tensesData';
import { TenseData } from '../types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface QuickCheatSheetProps {
  onSelectTense: (tense: TenseData) => void;
}

export const QuickCheatSheet: React.FC<QuickCheatSheetProps> = ({ onSelectTense }) => {
  return (
    <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 mt-12 border border-slate-800 shadow-xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Guía Rápida de Bolsillo</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif">
            Fórmulas de los 12 Tiempos en 1 Segundo
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Revisa de un vistazo cómo se conjugan las afirmaciones en cada tiempo.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {ALL_12_TENSES.map((t) => (
          <div
            key={t.id}
            onClick={() => onSelectTense(t)}
            className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 hover:border-indigo-500/60 hover:bg-slate-800 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="font-bold text-xs text-white group-hover:text-indigo-400 transition-colors">
                  {t.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-700/60 px-1.5 py-0.2 rounded">
                  {t.cefrLevel}
                </span>
              </div>
              <div className="text-[11px] font-mono text-indigo-300 line-clamp-1">
                {t.formula.affirmative}
              </div>
            </div>

            <div className="pt-2 mt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
              <span className="truncate italic">"{t.examples[0]?.english}"</span>
              <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 transition-colors shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
