import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { lookupWordInGlossary, GlossaryEntry, VOCABULARY_GLOSSARY } from '../data/glossaryData';
import { playEnglishAudio } from '../utils/speech';
import {
  Volume2,
  X,
  Bookmark,
  Check,
  Search,
  BookOpen,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface InteractiveSentenceProps {
  sentence: string;
  className?: string;
  onSelectWord?: (entry: GlossaryEntry) => void;
}

export const InteractiveSentence: React.FC<InteractiveSentenceProps> = ({
  sentence,
  className = '',
  onSelectWord
}) => {
  const [activeEntry, setActiveEntry] = useState<GlossaryEntry | null>(null);
  const [popoverPos, setPopoverPos] = useState<{ x: number; y: number } | null>(null);
  const { nativeLanguage } = useUser();
  const [playingAudio, setPlayingAudio] = useState(false);
  const [savedWords, setSavedWords] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('tensemaster_saved_words') || '[]');
    } catch {
      return [];
    }
  });

  const handleWordClick = (e: React.MouseEvent, rawWord: string) => {
    e.stopPropagation();
    const entry = lookupWordInGlossary(rawWord);
    if (entry) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setPopoverPos({ x: rect.left, y: rect.bottom + 8 });
      setActiveEntry(entry);
      if (onSelectWord) onSelectWord(entry);
    }
  };

  const handlePlayWordAudio = async (text: string) => {
    setPlayingAudio(true);
    await playEnglishAudio(text);
    setPlayingAudio(false);
  };

  const toggleSaveWord = (word: string) => {
    const next = savedWords.includes(word)
      ? savedWords.filter((w) => w !== word)
      : [...savedWords, word];
    setSavedWords(next);
    localStorage.setItem('tensemaster_saved_words', JSON.stringify(next));
  };

  // Split sentence into words and punctuation
  const tokens = sentence.split(/(\s+)/);

  return (
    <div className={`relative inline-block ${className}`}>
      <span className="leading-relaxed">
        {tokens.map((token, idx) => {
          const isWhitespace = /^\s+$/.test(token);
          if (isWhitespace) return <span key={idx}>{token}</span>;

          const hasGlossary = lookupWordInGlossary(token) !== null;

          if (hasGlossary) {
            return (
              <span
                key={idx}
                onClick={(e) => handleWordClick(e, token)}
                className="cursor-pointer border-b border-dotted border-indigo-400 hover:border-solid hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50/60 rounded-xs px-0.5 transition-all font-medium"
                title="Haz clic para ver traducción y gramática"
              >
                {token}
              </span>
            );
          }

          return <span key={idx}>{token}</span>;
        })}
      </span>

      {/* Floating Glossary Popover */}
      {activeEntry && popoverPos && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed z-50 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 text-xs space-y-3 animate-in fade-in zoom-in-95 duration-150"
          style={{
            top: Math.min(window.innerHeight - 280, popoverPos.y),
            left: Math.max(16, Math.min(window.innerWidth - 330, popoverPos.x - 40))
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold font-serif text-slate-900">
                  {activeEntry.word}
                </span>
                <span className="font-mono text-slate-400 text-[11px]">
                  {activeEntry.phonetic}
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-600 font-semibold">
                {activeEntry.category === 'auxiliary' && 'Auxiliar Gramatical'}
                {activeEntry.category === 'time-marker' && 'Marcador de Tiempo'}
                {activeEntry.category === 'verb' && 'Verbo'}
                {activeEntry.category === 'noun' && 'Sustantivo'}
                {activeEntry.category === 'adjective' && 'Adjetivo'}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handlePlayWordAudio(activeEntry.word)}
                disabled={playingAudio}
                className={`p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors ${
                  playingAudio ? 'bg-indigo-100 text-indigo-600 animate-pulse' : ''
                }`}
                title="Escuchar pronunciación"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => toggleSaveWord(activeEntry.word)}
                className={`p-1.5 rounded-lg transition-colors ${
                  savedWords.includes(activeEntry.word)
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-400 hover:text-indigo-600'
                }`}
                title="Guardar en mis palabras favoritas"
              >
                <Bookmark className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setActiveEntry(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Translation in current native language */}
          <div className="p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-0.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Traducción al idioma natal:
            </span>
            <div className="text-sm font-bold text-indigo-950 capitalize">
              {activeEntry.translations[nativeLanguage] || activeEntry.translations.es}
            </div>
          </div>

          {/* Grammar Role & Tip */}
          <div className="text-slate-600 leading-relaxed text-[11px]">
            <strong className="text-slate-800">Nota de uso: </strong>
            {activeEntry.grammarNote[nativeLanguage] || activeEntry.grammarNote.es}
          </div>

          {/* Conjugation triad if verb */}
          {activeEntry.conjugations && (
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Tríada de conjugación:
              </span>
              <div className="grid grid-cols-3 gap-1 font-mono text-[11px] text-center">
                <div className="p-1 bg-slate-50 rounded border border-slate-200/80">
                  <span className="text-[9px] text-slate-400 block">Base</span>
                  <span className="font-bold text-slate-800">{activeEntry.conjugations.base}</span>
                </div>
                <div className="p-1 bg-slate-50 rounded border border-slate-200/80">
                  <span className="text-[9px] text-slate-400 block">Past</span>
                  <span className="font-bold text-amber-700">{activeEntry.conjugations.past}</span>
                </div>
                <div className="p-1 bg-slate-50 rounded border border-slate-200/80">
                  <span className="text-[9px] text-slate-400 block">Participle</span>
                  <span className="font-bold text-indigo-700">{activeEntry.conjugations.participle}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Global Searchable Glossary Drawer/Modal
export const QuickGlossaryDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const [search, setSearch] = useState('');
  const { nativeLanguage } = useUser();
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  if (!isOpen) return null;

  const entries = Object.values(VOCABULARY_GLOSSARY).filter((e) => {
    const q = search.toLowerCase();
    const trans = (e.translations[nativeLanguage] || e.translations.es).toLowerCase();
    return (
      e.word.toLowerCase().includes(q) ||
      trans.includes(q) ||
      e.category.includes(q)
    );
  });

  const handleAudio = async (text: string) => {
    setPlayingWord(text);
    await playEnglishAudio(text);
    setPlayingWord(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h3 className="font-serif font-bold text-lg">
              Glosario y Diccionario de los 12 Tiempos
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar verbo, auxiliar o palabra clave (ej. 'since', 'eat', 'had')..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>
        </div>

        {/* Entries List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 divide-y divide-slate-100">
          {entries.map((item) => (
            <div key={item.word} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{item.word}</span>
                  <span className="font-mono text-slate-400 text-xs">{item.phonetic}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                    {item.category}
                  </span>
                </div>

                <div className="text-xs font-semibold text-indigo-700">
                  {item.translations[nativeLanguage] || item.translations.es}
                </div>

                <p className="text-xs text-slate-500 leading-relaxed max-w-lg">
                  {item.grammarNote[nativeLanguage] || item.grammarNote.es}
                </p>

                {item.conjugations && (
                  <div className="flex gap-2 text-[11px] font-mono text-slate-600 pt-1">
                    <span>Base: <strong>{item.conjugations.base}</strong></span>
                    <span>·</span>
                    <span>Past: <strong className="text-amber-700">{item.conjugations.past}</strong></span>
                    <span>·</span>
                    <span>Participle: <strong className="text-indigo-700">{item.conjugations.participle}</strong></span>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleAudio(item.word)}
                disabled={playingWord === item.word}
                className={`px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
                  playingWord === item.word ? 'bg-indigo-600 text-white animate-pulse' : ''
                }`}
                title="Escuchar pronunciación"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{playingWord === item.word ? '...' : 'Escuchar'}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
          💡 Puedes hacer clic sobre las palabras subrayadas con puntos en cualquier ejemplo para ver esta información al instante.
        </div>
      </div>
    </div>
  );
};
