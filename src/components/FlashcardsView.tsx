import React, { useState, useEffect } from 'react';
import { ALL_12_TENSES } from '../data/tensesData';
import { TenseData, TenseGroup } from '../types';
import { useUser } from '../context/UserContext';
import { playEnglishAudio } from '../utils/speech';
import {
  RotateCw,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Trophy,
  ExternalLink,
  Flame,
  ArrowRight
} from 'lucide-react';
import { TENSE_LOCALIZED_NAMES } from '../i18n/translations';

interface FlashcardsViewProps {
  onOpenTenseLesson: (tense: TenseData) => void;
  onOpenSubscription: () => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  onOpenTenseLesson,
  onOpenSubscription
}) => {
  const {
    canAccessTense,
    logDailyPractice,
    nativeLanguage,
    t
  } = useUser();

  const [selectedGroup, setSelectedGroup] = useState<'all' | TenseGroup>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(false);
  
  // Track mastery status within this session
  const [knownTenseIds, setKnownTenseIds] = useState<string[]>([]);
  const [reviewLaterIds, setReviewLaterIds] = useState<string[]>([]);

  // Filter and shuffle deck
  const [deck, setDeck] = useState<TenseData[]>(() => [...ALL_12_TENSES]);

  useEffect(() => {
    let filtered = ALL_12_TENSES;
    if (selectedGroup !== 'all') {
      filtered = ALL_12_TENSES.filter((t) => t.group === selectedGroup);
    }
    setDeck(filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedGroup]);

  const currentTense = deck[currentIndex] || deck[0];
  const hasAccess = canAccessTense(currentTense.id);
  const localized = TENSE_LOCALIZED_NAMES[currentTense.id]?.[nativeLanguage] || {
    name: currentTense.spanishName,
    tagline: currentTense.tagline
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < deck.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(deck.length - 1);
    }
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
  };

  const handlePlayAudio = async (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    setPlayingAudio(true);
    await playEnglishAudio(text);
    setPlayingAudio(false);
  };

  const handleMarkMastered = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!knownTenseIds.includes(currentTense.id)) {
      setKnownTenseIds([...knownTenseIds, currentTense.id]);
      setReviewLaterIds(reviewLaterIds.filter((id) => id !== currentTense.id));
      logDailyPractice(15);
    }
    handleNext();
  };

  const handleMarkReviewLater = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!reviewLaterIds.includes(currentTense.id)) {
      setReviewLaterIds([...reviewLaterIds, currentTense.id]);
      setKnownTenseIds(knownTenseIds.filter((id) => id !== currentTense.id));
    }
    handleNext();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, deck.length]);

  const firstEx = currentTense.examples[0];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold text-amber-800">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Repaso Espaciado Rápido</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
          Tarjetas de Memoria (Flashcards)
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Pon a prueba tu mente. Intenta recordar la fórmula y el uso clave antes de voltear la tarjeta.
        </p>
      </div>

      {/* Toolbar & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        {/* Group Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setSelectedGroup('all')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              selectedGroup === 'all' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos (12)
          </button>
          <button
            onClick={() => setSelectedGroup('present')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              selectedGroup === 'present' ? 'bg-white text-indigo-700 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Presente
          </button>
          <button
            onClick={() => setSelectedGroup('past')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              selectedGroup === 'past' ? 'bg-white text-amber-700 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pasado
          </button>
          <button
            onClick={() => setSelectedGroup('future')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              selectedGroup === 'future' ? 'bg-white text-blue-700 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Futuro
          </button>
        </div>

        {/* Status Tracker & Shuffle button */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end text-xs">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
              ✓ {knownTenseIds.length} Dominadas
            </span>
            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
              ⏳ {reviewLaterIds.length} Por repasar
            </span>
          </div>

          <button
            onClick={handleShuffle}
            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Mezclar tarjetas aleatoriamente"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* The 3D Interactive Flashcard */}
      <div className="perspective-1000 w-full min-h-[380px] sm:min-h-[420px]">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`w-full h-full min-h-[380px] sm:min-h-[420px] rounded-2xl border transition-all duration-500 cursor-pointer p-6 sm:p-8 flex flex-col justify-between relative shadow-md select-none ${
            isFlipped
              ? 'bg-slate-900 text-white border-slate-800'
              : 'bg-white text-slate-900 border-slate-200 hover:border-indigo-300'
          }`}
        >
          {/* Card Top Metadata */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span
                className={`px-2.5 py-0.5 rounded-md border ${
                  isFlipped
                    ? 'bg-slate-800 border-slate-700 text-indigo-300'
                    : 'bg-indigo-50 border-indigo-100 text-indigo-700'
                }`}
              >
                {localized.name}
              </span>
              <span className={`font-mono ${isFlipped ? 'text-slate-400' : 'text-slate-500'}`}>
                CEFR {currentTense.cefrLevel}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className={isFlipped ? 'text-slate-400' : 'text-slate-500'}>
                {currentIndex + 1} de {deck.length}
              </span>
              <span className={`p-1 rounded-md ${isFlipped ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                <RotateCw className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* FRONT OF THE CARD */}
          {!isFlipped ? (
            <div className="my-auto text-center space-y-4 py-4">
              <div className="text-xs uppercase tracking-widest text-indigo-600 font-bold">
                ¿Recuerdas la fórmula y el uso?
              </div>

              <h3 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-slate-900">
                {currentTense.name}
              </h3>

              <p className="text-sm text-slate-600 max-w-md mx-auto italic">
                "{localized.tagline}"
              </p>

              {/* Challenge question */}
              {firstEx && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl max-w-lg mx-auto text-sm text-slate-800 font-mono">
                  <span className="text-slate-400 text-xs block mb-1 font-sans">Pon a prueba tu mente:</span>
                  ¿Cómo dirías en {currentTense.name}?:
                  <span className="block mt-1 text-indigo-900 font-bold font-sans text-sm">
                    "{firstEx.spanish}"
                  </span>
                </div>
              )}

              <p className="text-xs text-slate-400 pt-2 flex items-center justify-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Haz clic o presiona <strong>Espacio</strong> para ver la respuesta</span>
              </p>
            </div>
          ) : (
            /* BACK OF THE CARD (REVERSO) */
            <div className="my-auto space-y-4 py-2">
              <div className="text-xs uppercase tracking-widest text-emerald-400 font-bold text-center">
                Estructura y Respuesta Correcta
              </div>

              {/* Formula card */}
              <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 space-y-2">
                <div className="text-xs text-slate-400 font-mono">Fórmula Afirmativa (+):</div>
                <div className="text-base sm:text-lg font-mono text-indigo-300 font-bold">
                  {currentTense.formula.affirmative}
                </div>
                <div className="text-xs text-slate-400 font-mono pt-1 border-t border-slate-700/60 flex gap-4">
                  <span>Neg: <strong className="text-slate-200 font-sans">{currentTense.formula.negative}</strong></span>
                </div>
              </div>

              {/* When to use */}
              <div className="space-y-1.5 text-xs text-slate-300">
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[11px]">
                  Cuándo se usa principalmente:
                </span>
                <ul className="space-y-1 list-disc list-inside">
                  {currentTense.whenToUse.slice(0, 2).map((u, idx) => (
                    <li key={idx}>
                      <strong className="text-white">{u.title}:</strong> {u.description}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Audio example */}
              {firstEx && (
                <div className="p-3 bg-slate-800/70 border border-slate-700 rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-white text-sm block">
                      "{firstEx.english}"
                    </span>
                    <span className="text-slate-400 text-xs">
                      {firstEx.spanish}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handlePlayAudio(e, firstEx.audioText)}
                    disabled={playingAudio}
                    className={`px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 shadow-xs ${
                      playingAudio ? 'bg-indigo-500 animate-pulse' : ''
                    }`}
                    title="Escuchar audio nativo"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{playingAudio ? 'Escuchando...' : 'Escuchar'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Card Bottom: Assessment Buttons (on back) or Hint (on front) */}
          <div className="pt-4 border-t border-slate-100/10 flex items-center justify-between gap-2">
            {!isFlipped ? (
              <div className="text-xs text-slate-400">
                Usa las flechas ← → para cambiar de tarjeta
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full justify-between">
                <button
                  onClick={handleMarkReviewLater}
                  className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  ⏳ Aún con dudas
                </button>

                <button
                  onClick={handleMarkMastered}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>¡Me lo sé! (+15 XP)</span>
                </button>
              </div>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (hasAccess) {
                  onOpenTenseLesson(currentTense);
                } else {
                  onOpenSubscription();
                }
              }}
              className={`text-xs font-semibold flex items-center gap-1 hover:underline cursor-pointer ${
                isFlipped ? 'text-indigo-400' : 'text-indigo-600'
              }`}
            >
              <span>Ver videoclase completa</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrow Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>

        <span className="text-xs font-mono text-slate-500">
          Tarjeta {currentIndex + 1} de {deck.length}
        </span>

        <button
          onClick={handleNext}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-2xs"
        >
          <span>Siguiente</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
