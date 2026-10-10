import React, { useState, useMemo } from 'react';
import {
  VERBS_PATTERN_DATA,
  VERB_PATTERN_CATEGORIES,
  VerbPatternCategoryMeta
} from '../data/verbsPatternData';
import { VerbPatternItem, VerbPatternGroupId, CEFRLevel } from '../types';
import { playEnglishAudio } from '../utils/speech';
import { sounds } from '../utils/soundEffects';
import {
  Search,
  Volume2,
  Bookmark,
  Sparkles,
  Eye,
  EyeOff,
  Filter,
  Lightbulb,
  Check,
  Star,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Layers,
  HelpCircle
} from 'lucide-react';

const SAVED_VERBS_KEY = 'tensemaster_saved_pattern_verbs_v1';

export const VerbsPatternView: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<VerbPatternGroupId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'all' | CEFRLevel>('all');
  const [hideMode, setHideMode] = useState<'none' | 'v2' | 'v3'>('none');
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Saved / Bookmarked verbs for focused practice
  const [savedVerbIds, setSavedVerbIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(SAVED_VERBS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ['v-cut', 'v-buy', 'v-sing', 'v-write'];
  });

  const [onlySaved, setOnlySaved] = useState(false);

  const toggleSaveVerb = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    const updated = savedVerbIds.includes(id)
      ? savedVerbIds.filter((vId) => vId !== id)
      : [...savedVerbIds, id];
    setSavedVerbIds(updated);
    try {
      localStorage.setItem(SAVED_VERBS_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  // Play all 3 forms in sequence: "drink ... drank ... drunk"
  const handlePlayTrioAudio = async (verb: VerbPatternItem, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    setPlayingAudioId(verb.id);
    const fullPhrase = `${verb.base}... ${verb.past}... ${verb.participle}`;
    await playEnglishAudio(fullPhrase, 0.9);
    setPlayingAudioId(null);
  };

  const handlePlaySingleAudio = async (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    await playEnglishAudio(text, 0.95);
  };

  const toggleReveal = (verbId: string) => {
    sounds.playClick();
    setRevealedIds((prev) => ({
      ...prev,
      [verbId]: !prev[verbId]
    }));
  };

  // Filter verbs
  const filteredVerbs = useMemo(() => {
    return VERBS_PATTERN_DATA.filter((verb) => {
      if (onlySaved && !savedVerbIds.includes(verb.id)) return false;
      if (selectedGroup !== 'all' && verb.patternGroup !== selectedGroup) return false;
      if (selectedLevel !== 'all' && verb.level !== selectedLevel) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          verb.base.toLowerCase().includes(q) ||
          verb.past.toLowerCase().includes(q) ||
          verb.participle.toLowerCase().includes(q) ||
          verb.spanish.toLowerCase().includes(q) ||
          verb.patternName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedGroup, selectedLevel, searchQuery, onlySaved, savedVerbIds]);

  const activeCategoryMeta: VerbPatternCategoryMeta | undefined = useMemo(() => {
    if (selectedGroup === 'all') return undefined;
    return VERB_PATTERN_CATEGORIES.find((c) => c.id === selectedGroup);
  }, [selectedGroup]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero Explainer Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden border border-indigo-800/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Método Mnemotécnico por Familias
              </span>
              <span className="text-xs text-indigo-300">
                ¡Olvida la lista en orden alfabético!
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-serif tracking-tight text-white">
              Los Verbos en sus 3 Tiempos (V1, V2, V3)
            </h1>
            <p className="text-sm sm:text-base text-indigo-200/90 mt-2 max-w-3xl leading-relaxed">
              Memorizar verbos por orden alfabético aburre y confunde al cerebro. Agrupándolos por <strong>patrones de sonido y familias fonéticas</strong> (los que no cambian, los de vocal idéntica, los musicales), recordarás el 90% en una fracción del tiempo.
            </p>
          </div>

          {/* Quick Memory Mode Toolbar */}
          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-700/80 flex flex-col gap-2 shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <EyeOff className="w-3.5 h-3.5 text-indigo-400" />
              Modo Auto-Evaluación:
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setHideMode('none')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  hideMode === 'none'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                👁️ Ver Todo
              </button>
              <button
                onClick={() => setHideMode('v2')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  hideMode === 'v2'
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Oculta el Pasado Simple (V2) para probarte"
              >
                🙈 Tapar V2 (Pasado)
              </button>
              <button
                onClick={() => setHideMode('v3')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  hideMode === 'v3'
                    ? 'bg-rose-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Oculta el Participio (V3) para probarte"
              >
                🙈 Tapar V3 (Participio)
              </button>
            </div>
          </div>
        </div>

        {/* 7 Patterns Navigation Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mt-8 pt-6 border-t border-indigo-800/60 text-xs">
          {VERB_PATTERN_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sounds.playClick();
                setSelectedGroup(cat.id);
              }}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedGroup === cat.id
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md font-bold'
                  : 'bg-indigo-950/40 text-indigo-200 border-indigo-800/50 hover:bg-indigo-900/50'
              }`}
            >
              <span className="text-base block mb-0.5">{cat.icon}</span>
              <span className="font-semibold text-[11px] block truncate">{cat.shortTitle}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Group Pedagogical Rule Banner (if a category is active) */}
      {activeCategoryMeta && (
        <div className="mb-6 p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-500/40 dark:border-indigo-500/30 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{activeCategoryMeta.icon}</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {activeCategoryMeta.title}
              </h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold">
                {activeCategoryMeta.formula}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {activeCategoryMeta.summary}
            </p>
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Regla rápida: {activeCategoryMeta.mnemonicRule}</span>
            </p>
          </div>

          <button
            onClick={() => setSelectedGroup('all')}
            className="px-3 py-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer whitespace-nowrap"
          >
            Ver todas las familias (60+ verbos)
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar verbo en inglés o español (ej: 'drink', 'beber', 'bought', 'escribir')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as 'all' | CEFRLevel)}
              className="px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-hidden"
            >
              <option value="all">Todos los niveles (A1-B2)</option>
              <option value="A1">Nivel A1 (Básicos)</option>
              <option value="A2">Nivel A2 (Cotidianos)</option>
              <option value="B1">Nivel B1 (Intermedios)</option>
            </select>

            <button
              onClick={() => {
                sounds.playClick();
                setOnlySaved(!onlySaved);
              }}
              className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                onlySaved
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 font-bold'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${onlySaved ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>Mis Guardados ({savedVerbIds.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Verbs Table / Cards Grid */}
      <div className="space-y-4">
        {filteredVerbs.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              No se encontraron verbos que coincidan
            </h3>
            <p className="text-xs text-slate-500">
              Prueba restablecer los filtros de búsqueda o familia.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGroup('all');
                setSelectedLevel('all');
                setOnlySaved(false);
              }}
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVerbs.map((verb) => {
              const isSaved = savedVerbIds.includes(verb.id);
              const isRevealed = revealedIds[verb.id];
              const isPlaying = playingAudioId === verb.id;

              return (
                <div
                  key={verb.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-600 transition-all flex flex-col justify-between gap-3 relative"
                >
                  {/* Top Bar: Family tag + Bookmark */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                      {verb.patternName} · {verb.level}
                    </span>

                    <button
                      onClick={(e) => toggleSaveVerb(verb.id, e)}
                      title={isSaved ? 'Quitar de guardados' : 'Guardar para repasar después'}
                      className="text-slate-400 hover:text-amber-500 p-1 cursor-pointer transition-colors"
                    >
                      <Star className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>

                  {/* 3 Forms Display Columns */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60 text-center">
                    {/* V1 - Base */}
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                        V1 · Presente
                      </span>
                      <button
                        onClick={(e) => handlePlaySingleAudio(verb.base, e)}
                        className="font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                        title="Escuchar pronunciación"
                      >
                        {verb.base}
                      </button>
                    </div>

                    {/* V2 - Past Simple */}
                    <div>
                      <span className="text-[10px] uppercase font-bold text-indigo-500 dark:text-indigo-400 block mb-0.5">
                        V2 · Pasado
                      </span>
                      {hideMode === 'v2' && !isRevealed ? (
                        <button
                          onClick={() => toggleReveal(verb.id)}
                          className="text-xs bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 font-bold px-2 py-1 rounded-md cursor-pointer hover:bg-amber-200"
                        >
                          ❓ Tapado
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handlePlaySingleAudio(verb.past, e)}
                          className="font-bold text-sm sm:text-base text-indigo-600 dark:text-indigo-300 hover:underline cursor-pointer"
                          title="Escuchar pronunciación"
                        >
                          {verb.past}
                        </button>
                      )}
                    </div>

                    {/* V3 - Past Participle */}
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block mb-0.5">
                        V3 · Participio
                      </span>
                      {hideMode === 'v3' && !isRevealed ? (
                        <button
                          onClick={() => toggleReveal(verb.id)}
                          className="text-xs bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 font-bold px-2 py-1 rounded-md cursor-pointer hover:bg-rose-200"
                        >
                          ❓ Tapado
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handlePlaySingleAudio(verb.participle, e)}
                          className="font-bold text-sm sm:text-base text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                          title="Escuchar pronunciación"
                        >
                          {verb.participle}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Spanish Translation & Phonetics */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {verb.spanish}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono block">
                        {verb.phonetic}
                      </span>
                    </div>

                    {/* Audio Player for all 3 forms */}
                    <button
                      onClick={(e) => handlePlayTrioAudio(verb, e)}
                      disabled={isPlaying}
                      className="px-2.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Escuchar los 3 tiempos seguidos"
                    >
                      <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'animate-bounce text-indigo-600' : ''}`} />
                      <span className="text-[11px] font-bold">Escuchar 3</span>
                    </button>
                  </div>

                  {/* Mnemonic Trick Tip */}
                  <div className="p-2.5 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-200/60 dark:border-amber-800/40 text-[11px] text-amber-900 dark:text-amber-200">
                    <span className="font-bold block mb-0.5">💡 Truco de memoria:</span>
                    <span>{verb.trickTip}</span>
                  </div>

                  {/* Context Example */}
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 pt-2">
                    <p className="italic text-slate-700 dark:text-slate-300">
                      "{verb.example.sentence}"
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {verb.example.translation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
