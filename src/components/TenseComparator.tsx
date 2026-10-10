import React, { useState } from 'react';
import { COMPARISONS_DATA } from '../data/tensesData';
import { playEnglishAudio } from '../utils/speech';
import { Volume2, ArrowRightLeft, Sparkles, CheckCircle2 } from 'lucide-react';

export const TenseComparator: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(COMPARISONS_DATA[0].id);
  const [playingText, setPlayingText] = useState<string | null>(null);

  const currentComparison =
    COMPARISONS_DATA.find((c) => c.id === selectedId) || COMPARISONS_DATA[0];

  const handlePlay = async (text: string) => {
    setPlayingText(text);
    // Extract English portion inside quotes or sentence
    await playEnglishAudio(text);
    setPlayingText(null);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-xs font-semibold text-indigo-700">
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Duelo de Tiempos Verbales</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
          Comparador Visual Cara a Cara
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Descubre exactamente cuándo usar cada tiempo verbal y despídete para siempre de la confusión habitual entre tiempos similares.
        </p>
      </div>

      {/* Selector Tabs */}
      <div className="flex justify-center flex-wrap gap-2">
        {COMPARISONS_DATA.map((comp) => (
          <button
            key={comp.id}
            onClick={() => setSelectedId(comp.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              selectedId === comp.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {comp.title}
          </button>
        ))}
      </div>

      {/* Comparison Duel Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white text-center">
          <h3 className="text-xl sm:text-2xl font-serif font-bold">
            {currentComparison.title}
          </h3>
          <p className="text-xs sm:text-sm text-indigo-200 mt-1">
            {currentComparison.subtitle}
          </p>
        </div>

        {/* Two-Column Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {/* Left Tense Column */}
          <div className="p-5 sm:p-6 space-y-4 bg-indigo-50/20">
            <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-md font-bold text-sm">
              {currentComparison.leftTense}
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Reglas de oro:
              </span>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                {currentComparison.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{rule.left}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Tense Column */}
          <div className="p-5 sm:p-6 space-y-4 bg-amber-50/20">
            <div className="inline-block px-3 py-1 bg-amber-100 text-amber-900 rounded-md font-bold text-sm">
              {currentComparison.rightTense}
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Reglas de oro:
              </span>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                {currentComparison.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{rule.right}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Real Situations Examples */}
        <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50/50">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
            Situaciones de la vida real lado a lado:
          </h4>

          <div className="space-y-3">
            {currentComparison.examplePairs.map((pair, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs"
              >
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Escenario: {pair.situation}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
                  {/* Left example */}
                  <div className="p-3 bg-indigo-50/40 rounded-lg border border-indigo-100 flex items-center justify-between gap-2">
                    <span className="text-indigo-950 font-medium">
                      {pair.left}
                    </span>
                    <button
                      onClick={() => handlePlay(pair.left)}
                      className={`p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-md shrink-0 cursor-pointer ${
                        playingText === pair.left ? 'bg-indigo-200 animate-pulse' : ''
                      }`}
                      title="Escuchar"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Right example */}
                  <div className="p-3 bg-amber-50/40 rounded-lg border border-amber-100 flex items-center justify-between gap-2">
                    <span className="text-amber-950 font-medium">
                      {pair.right}
                    </span>
                    <button
                      onClick={() => handlePlay(pair.right)}
                      className={`p-1.5 text-amber-600 hover:bg-amber-100 rounded-md shrink-0 cursor-pointer ${
                        playingText === pair.right ? 'bg-amber-200 animate-pulse' : ''
                      }`}
                      title="Escuchar"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
