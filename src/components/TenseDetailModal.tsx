import React, { useState, useEffect } from 'react';
import { TenseData } from '../types';
import { useUser } from '../context/UserContext';
import { playEnglishAudio } from '../utils/speech';
import { sounds } from '../utils/soundEffects';
import { InteractiveExercise } from './InteractiveExercise';
import { InteractiveSentence } from './InteractiveGlossary';
import { PronunciationCoach } from './PronunciationCoach';
import {
  X,
  BookOpen,
  Volume2,
  VolumeX,
  Video,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Trophy,
  ArrowRight,
  Clock,
  RotateCcw,
  Mic,
  ChevronRight,
  ChevronLeft,
  Timer,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Zap,
  ExternalLink,
  Eye,
  Type,
  Minus,
  Plus,
  Layers,
  Check
} from 'lucide-react';

interface TenseDetailModalProps {
  tense: TenseData;
  onClose: () => void;
  onOpenSubscription: () => void;
  isFocusMode?: boolean;
  initialTab?: 'formulas' | 'examples' | 'pronunciation' | 'video' | 'practice' | 'mistakes';
}

type FontScale = 'normal' | 'large' | 'xlarge';
type ReadingTheme = 'dark' | 'sepia' | 'light';

const FONT_STYLES: Record<FontScale, {
  label: string;
  body: string;
  heading: string;
  subheading: string;
  formula: string;
  example: string;
  badge: string;
  leading: string;
}> = {
  normal: {
    label: 'Normal',
    body: 'text-base sm:text-lg',
    heading: 'text-2xl sm:text-3xl',
    subheading: 'text-lg sm:text-xl',
    formula: 'text-base sm:text-lg',
    example: 'text-base sm:text-lg',
    badge: 'text-xs',
    leading: 'leading-relaxed',
  },
  large: {
    label: 'Grande',
    body: 'text-lg sm:text-xl',
    heading: 'text-3xl sm:text-4xl',
    subheading: 'text-xl sm:text-2xl',
    formula: 'text-lg sm:text-xl',
    example: 'text-lg sm:text-xl',
    badge: 'text-sm',
    leading: 'leading-relaxed',
  },
  xlarge: {
    label: 'Extra Grande',
    body: 'text-xl sm:text-2xl',
    heading: 'text-4xl sm:text-5xl',
    subheading: 'text-2xl sm:text-3xl',
    formula: 'text-xl sm:text-2xl',
    example: 'text-xl sm:text-2xl',
    badge: 'text-base',
    leading: 'leading-loose',
  },
};

const THEME_STYLES: Record<ReadingTheme, {
  bg: string;
  cardBg: string;
  cardBorder: string;
  text: string;
  headingText: string;
  mutedText: string;
  highlightText: string;
  accentBox: string;
  formulaBox: string;
  codeBg: string;
}> = {
  dark: {
    bg: 'bg-slate-950',
    cardBg: 'bg-slate-900/90',
    cardBorder: 'border-slate-800',
    text: 'text-slate-200',
    headingText: 'text-white',
    mutedText: 'text-slate-400',
    highlightText: 'text-indigo-400',
    accentBox: 'bg-indigo-950/40 border-indigo-800/60 text-indigo-200',
    formulaBox: 'bg-slate-900 border-slate-700/80 text-white',
    codeBg: 'bg-slate-800 text-indigo-300',
  },
  sepia: {
    bg: 'bg-[#faf6ee]',
    cardBg: 'bg-[#f4ebe1]',
    cardBorder: 'border-[#dfd0be]',
    text: 'text-[#382b1c]',
    headingText: 'text-[#20150b]',
    mutedText: 'text-[#6e5d48]',
    highlightText: 'text-[#8b4d1b]',
    accentBox: 'bg-[#f0e3d2] border-[#dac3a5] text-[#4d3215]',
    formulaBox: 'bg-[#ece0cf] border-[#cfb89a] text-[#24170c]',
    codeBg: 'bg-[#e7d8c5] text-[#5c3716]',
  },
  light: {
    bg: 'bg-slate-50',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-200',
    text: 'text-slate-800',
    headingText: 'text-slate-900',
    mutedText: 'text-slate-600',
    highlightText: 'text-indigo-600',
    accentBox: 'bg-indigo-50 border-indigo-200 text-indigo-900',
    formulaBox: 'bg-slate-100 border-slate-300 text-slate-900',
    codeBg: 'bg-slate-100 text-indigo-700',
  },
};

export const TenseDetailModal: React.FC<TenseDetailModalProps> = ({
  tense,
  onClose,
  onOpenSubscription,
  initialTab = 'formulas'
}) => {
  const { canAccessTense, completeExerciseForTense, progressState, isDarkMode, toggleDarkMode, unlockOwnerAccess, ownerConfig } = useUser();
  const [activeTab, setActiveTab] = useState<'formulas' | 'examples' | 'pronunciation' | 'video' | 'practice' | 'mistakes'>(initialTab);
  const [audioSpeed, setAudioSpeed] = useState<number>(0.95);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [practicingExampleId, setPracticingExampleId] = useState<string | null>(null);
  const [pronunciationIndex, setPronunciationIndex] = useState<number>(0);

  // Focus Reading Mode states
  const [focusReadingMode, setFocusReadingMode] = useState<boolean>(() => {
    // If opening explicitly into practice or video, start in interactive tab mode
    if (initialTab === 'practice' || initialTab === 'video' || initialTab === 'pronunciation') {
      return false;
    }
    const saved = localStorage.getItem('tensemaster_focus_mode_pref');
    return saved !== null ? saved === 'true' : true;
  });

  const [fontScale, setFontScale] = useState<FontScale>(() => {
    const saved = localStorage.getItem('tensemaster_font_scale_pref');
    return (saved as FontScale) || 'large';
  });

  const [focusTheme, setFocusTheme] = useState<ReadingTheme>(() => {
    const saved = localStorage.getItem('tensemaster_reading_theme_pref');
    if (saved) return saved as ReadingTheme;
    return isDarkMode ? 'dark' : 'sepia';
  });

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Practice session state
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [isPracticeComplete, setIsPracticeComplete] = useState<boolean>(false);
  const [exerciseDifficultyFilter, setExerciseDifficultyFilter] = useState<'all' | 'basic' | 'intermediate' | 'advanced' | 'expert'>('all');

  const activeExercises = tense.exercises.filter((ex) => {
    if (exerciseDifficultyFilter === 'all') return true;
    return ex.difficulty === exerciseDifficultyFilter;
  });

  const basicCount = tense.exercises.filter((e) => e.difficulty === 'basic').length;
  const intermediateCount = tense.exercises.filter((e) => e.difficulty === 'intermediate').length;
  const advancedCount = tense.exercises.filter((e) => e.difficulty === 'advanced').length;
  const expertCount = tense.exercises.filter((e) => e.difficulty === 'expert').length;

  const handleSelectDifficultyFilter = (filter: 'all' | 'basic' | 'intermediate' | 'advanced' | 'expert') => {
    setExerciseDifficultyFilter(filter);
    setCurrentExerciseIndex(0);
    setCorrectCount(0);
    setIsPracticeComplete(false);
  };

  const hasAccess = canAccessTense(tense.id);
  const progress = progressState.tenseProgress[tense.id];

  // Concentration timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cleanup ambient sound on unmount
  useEffect(() => {
    return () => {
      sounds.toggleFocusAmbient(false);
    };
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleAmbient = () => {
    const nextState = !isAmbientPlaying;
    sounds.toggleFocusAmbient(nextState);
    setIsAmbientPlaying(nextState);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleToggleFocusReading = (enabled: boolean) => {
    setFocusReadingMode(enabled);
    localStorage.setItem('tensemaster_focus_mode_pref', String(enabled));
  };

  const handleFontScaleChange = (scale: FontScale) => {
    setFontScale(scale);
    localStorage.setItem('tensemaster_font_scale_pref', scale);
  };

  const handleCycleFontScale = (direction: 'next' | 'prev') => {
    const order: FontScale[] = ['normal', 'large', 'xlarge'];
    const currentIndex = order.indexOf(fontScale);
    if (direction === 'next' && currentIndex < order.length - 1) {
      handleFontScaleChange(order[currentIndex + 1]);
    } else if (direction === 'prev' && currentIndex > 0) {
      handleFontScaleChange(order[currentIndex - 1]);
    }
  };

  const handleThemeChange = (theme: ReadingTheme) => {
    setFocusTheme(theme);
    localStorage.setItem('tensemaster_reading_theme_pref', theme);
  };

  const handlePlayAudio = async (text: string, id: string) => {
    setPlayingAudioId(id);
    await playEnglishAudio(text, audioSpeed);
    setPlayingAudioId(null);
  };

  const handleAnswerSubmit = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    }
    completeExerciseForTense(tense.id, isCorrect, activeExercises.length);
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < activeExercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
    } else {
      setIsPracticeComplete(true);
    }
  };

  const handleRestartPractice = () => {
    setCurrentExerciseIndex(0);
    setCorrectCount(0);
    setIsPracticeComplete(false);
  };

  if (!hasAccess) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 text-center shadow-xl border border-slate-200 dark:border-slate-800">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
            Desbloquea {tense.name}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2">
            Este tiempo verbal forma parte del plan completo. Tus alumnos pagan <strong>${(ownerConfig?.priceMonthly || 1.99).toFixed(2)} USD al mes</strong> para acceder a todos los 12 tiempos del inglés, videos, audios y certificado.
          </p>

          {/* Owner Quick Unlock Box */}
          <div className="mt-4 p-3.5 bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 rounded-xl text-left space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-200">
              <span>👑 ¿Eres la creadora / dueña probando la app?</span>
            </div>
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-snug">
              <strong>¡Tú no tienes que pagar nada!</strong> Desbloquea todas las 12 lecciones gratis para probar con un solo clic:
            </p>
            <button
              onClick={() => {
                unlockOwnerAccess();
              }}
              className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 transform active:scale-98"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>👑 Desbloquear Todo Gratis (Modo Dueña)</span>
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={onOpenSubscription}
              className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Ver pantalla de cobro para alumnos (${(ownerConfig?.priceMonthly || 1.99).toFixed(2)} USD/mes)
            </button>
            <button
              onClick={onClose}
              className="w-full py-1.5 text-slate-500 hover:text-slate-700 text-xs font-medium transition-colors cursor-pointer"
            >
              Volver al mapa
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentTheme = THEME_STYLES[focusTheme];
  const currentFont = FONT_STYLES[fontScale];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col font-sans overflow-hidden text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Top Header Bar with Mode Toggle & Focus Controls */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-3 sm:px-6 flex items-center justify-between text-white shrink-0 gap-2">
        {/* Left: Exit & Breadcrumb */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Salir de la Lección</span>
            <span className="sm:hidden">Salir</span>
          </button>
          <span className="hidden lg:inline text-xs text-slate-400">
            Catálogo &gt; <strong className="text-white">{tense.name}</strong>
          </span>
        </div>

        {/* Center: Prominent Segmented Switch: [ Modo Focus (Lectura) ] vs [ Vista Interactiva ] */}
        <div className="flex items-center p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => handleToggleFocusReading(true)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
              focusReadingMode
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Lectura simplificada con texto grande y sin distracciones"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Modo Focus (Lectura)</span>
            <span className="sm:hidden font-bold">Focus</span>
            {focusReadingMode && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            )}
          </button>

          <button
            onClick={() => handleToggleFocusReading(false)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
              !focusReadingMode
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Accede a los talleres interactivos, videos, micrófono y pestañas completas"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Vista Completa (Tabs)</span>
            <span className="sm:hidden">Completa</span>
          </button>
        </div>

        {/* Right Controls: Focus tools (Font size, Reading theme, Ambient zen, Timer, Fullscreen, Close) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          
          {/* Controls specific to Focus Reading Mode */}
          {focusReadingMode && (
            <>
              {/* Font Scale Adjuster: [ A- ] [ Grande ] [ A+ ] */}
              <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5 text-xs text-slate-300">
                <button
                  onClick={() => handleCycleFontScale('prev')}
                  disabled={fontScale === 'normal'}
                  title="Disminuir tamaño de letra"
                  className="p-1 px-1.5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-1.5 font-semibold text-[11px] text-indigo-300 hidden md:inline">
                  <Type className="w-3 h-3 inline mr-1" />
                  {currentFont.label}
                </span>
                <button
                  onClick={() => handleCycleFontScale('next')}
                  disabled={fontScale === 'xlarge'}
                  title="Aumentar tamaño de letra"
                  className="p-1 px-1.5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Reading Theme Selector (Noche, Sepia, Día) */}
              <div className="hidden sm:flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5 text-xs">
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    focusTheme === 'dark' ? 'bg-slate-900 text-white font-bold shadow-2xs' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Tema Noche (OLED Oscuro)"
                >
                  🌙 Noche
                </button>
                <button
                  onClick={() => handleThemeChange('sepia')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    focusTheme === 'sepia' ? 'bg-[#f4ebe1] text-[#2c2217] font-bold shadow-2xs' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Tema Sepia (Cálido y relajante para la vista)"
                >
                  📜 Sepia
                </button>
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    focusTheme === 'light' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Tema Claro"
                >
                  ☀️ Claro
                </button>
              </div>
            </>
          )}

          {/* Ambient Rain Sound */}
          <button
            onClick={handleToggleAmbient}
            title={isAmbientPlaying ? 'Desactivar lluvia zen de concentración' : 'Activar sonido de lluvia relajante para concentrarte'}
            className={`px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors cursor-pointer ${
              isAmbientPlaying
                ? 'bg-teal-950 text-teal-300 border-teal-700'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            {isAmbientPlaying ? <Volume2 className="w-3.5 h-3.5 text-teal-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden xl:inline">{isAmbientPlaying ? 'Lluvia Zen: ON' : 'Lluvia Zen'}</span>
          </button>

          {/* Reading Timer */}
          <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
            <Timer className="w-3.5 h-3.5 text-indigo-400" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </div>

          {/* Fullscreen */}
          <button
            onClick={handleToggleFullscreen}
            className="hidden sm:flex p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
            title="Pantalla Completa"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
            title="Cerrar lección"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Viewport: Either Focus Reading Mode OR Interactive Tab Mode */}
      {focusReadingMode ? (
        /* ========================================================================= */
        /* MODO FOCUS: LECTURA CENTRADA, TEXTO GRANDE Y CERO DISTRACCIONES           */
        /* ========================================================================= */
        <main className={`flex-1 overflow-y-auto transition-colors duration-300 ${currentTheme.bg}`}>
          <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-10 sm:space-y-12">
            
            {/* 1. Header Editorial Limpio */}
            <header className="space-y-4 border-b pb-8 border-slate-200/40 dark:border-slate-800/60">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-md font-mono font-bold ${currentFont.badge} ${currentTheme.codeBg}`}>
                    Nivel CEFR {tense.cefrLevel}
                  </span>
                  <span className={`font-semibold ${currentFont.badge} ${currentTheme.mutedText}`}>
                    · {tense.spanishName}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium">
                  {progress?.status === 'mastered' ? (
                    <span className="flex items-center gap-1 text-emerald-500">
                      <CheckCircle2 className="w-4 h-4" /> Lección Dominada ({progress.score}%)
                    </span>
                  ) : (
                    <span className={`${currentTheme.mutedText} flex items-center gap-1`}>
                      <Clock className="w-3.5 h-3.5" /> Lectura estimada: 4 min
                    </span>
                  )}
                </div>
              </div>

              <h1 className={`font-bold font-serif tracking-tight ${currentFont.heading} ${currentTheme.headingText}`}>
                {tense.name}
              </h1>

              <p className={`${currentFont.body} ${currentFont.leading} ${currentTheme.mutedText}`}>
                {tense.tagline}
              </p>

              {/* Focus Mode helper banner */}
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${currentTheme.accentBox}`}>
                <div className="flex items-start gap-2.5">
                  <Eye className="w-4 h-4 mt-0.5 shrink-0" />
                  <p className="text-xs sm:text-sm leading-relaxed">
                    <strong>Modo Focus activado:</strong> La interfaz ha sido simplificada y el tamaño de texto aumentado para que comprendas la lógica de este tiempo verbal con máxima calma.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleFocusReading(false)}
                    className="text-xs underline font-semibold cursor-pointer hover:opacity-80"
                  >
                    Ver pestañas interactivas
                  </button>
                </div>
              </div>
            </header>

            {/* 2. La Idea Central (The Big Picture Concept) */}
            <section className="space-y-4">
              <h2 className={`font-bold font-serif ${currentFont.subheading} ${currentTheme.headingText}`}>
                1. La Idea Central
              </h2>
              
              <div className={`p-6 rounded-2xl border space-y-4 shadow-xs ${currentTheme.cardBg} ${currentTheme.cardBorder}`}>
                <p className={`${currentFont.body} ${currentFont.leading} ${currentTheme.text}`}>
                  En inglés, <strong>{tense.name}</strong> se utiliza para comunicar acciones que se sitúan en un punto específico del tiempo. A diferencia del español, la intención principal de este tiempo verbal es dar claridad inmediata sobre si el hecho es un hábito repetitivo, una acción que está sucediendo ahora mismo, un resultado completado o un proceso que perdura.
                </p>

                {/* Timeline visual representation */}
                <div className={`p-4 rounded-xl border ${currentTheme.formulaBox}`}>
                  <span className="text-xs uppercase tracking-wider font-bold block mb-2 opacity-75 font-mono">
                    Línea Temporal de la Acción:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm font-medium">
                    <div className="p-2.5 rounded-lg bg-black/10 dark:bg-white/5">
                      <span className="block opacity-60 text-[11px]">Punto de Partida:</span>
                      <strong>{tense.timelineGraphic.start}</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-indigo-500/20 text-indigo-400 dark:text-indigo-300 font-bold border border-indigo-500/30">
                      <span className="block opacity-80 text-[11px]">Enfoque Principal:</span>
                      <span>{tense.timelineGraphic.focus}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/10 dark:bg-white/5">
                      <span className="block opacity-60 text-[11px]">Efecto / Final:</span>
                      <strong>{tense.timelineGraphic.end}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Fórmulas Gramaticales Sin Rodeos (Large, readable formula cards) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className={`font-bold font-serif ${currentFont.subheading} ${currentTheme.headingText}`}>
                  2. Estructura Gramatical (Fórmulas Clave)
                </h2>
                <span className={`text-xs font-mono ${currentTheme.mutedText}`}>
                  Auxiliar: <strong className={currentTheme.highlightText}>{tense.formula.auxiliary}</strong>
                </span>
              </div>

              <div className="space-y-3">
                {/* (+) Affirmative */}
                <div className={`p-5 rounded-xl border ${currentTheme.cardBg} ${currentTheme.cardBorder} transition-all`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                      (+) Forma Afirmativa
                    </span>
                  </div>
                  <div className={`font-mono font-bold tracking-wide ${currentFont.formula} ${currentTheme.headingText}`}>
                    {tense.formula.affirmative}
                  </div>
                </div>

                {/* (-) Negative */}
                <div className={`p-5 rounded-xl border ${currentTheme.cardBg} ${currentTheme.cardBorder} transition-all`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
                      (-) Forma Negativa
                    </span>
                  </div>
                  <div className={`font-mono font-bold tracking-wide ${currentFont.formula} ${currentTheme.headingText}`}>
                    {tense.formula.negative}
                  </div>
                </div>

                {/* (?) Question */}
                <div className={`p-5 rounded-xl border ${currentTheme.cardBg} ${currentTheme.cardBorder} transition-all`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-500">
                      (?) Forma Interrogativa (Pregunta)
                    </span>
                  </div>
                  <div className={`font-mono font-bold tracking-wide ${currentFont.formula} ${currentTheme.headingText}`}>
                    {tense.formula.question}
                  </div>
                </div>
              </div>

              {/* Auxiliary and Verb form callout */}
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm ${currentTheme.accentBox}`}>
                <div>
                  <span className="opacity-75 block text-xs">Auxiliar que gobierna este tiempo:</span>
                  <strong className="font-mono text-base">{tense.formula.auxiliary}</strong>
                </div>
                <div>
                  <span className="opacity-75 block text-xs">Forma en que se conjuga el verbo principal:</span>
                  <strong className="font-mono text-base">{tense.formula.verbForm}</strong>
                </div>
              </div>
            </section>

            {/* 4. ¿Cuándo se usa en la vida real? (Clean editorial layout) */}
            <section className="space-y-4">
              <h2 className={`font-bold font-serif ${currentFont.subheading} ${currentTheme.headingText}`}>
                3. ¿Cuándo se usa en la vida real?
              </h2>

              <div className="space-y-4">
                {tense.whenToUse.map((useCase, idx) => (
                  <div
                    key={idx}
                    className={`p-6 rounded-2xl border space-y-3 ${currentTheme.cardBg} ${currentTheme.cardBorder}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${currentTheme.codeBg}`}>
                        {idx + 1}
                      </span>
                      <h3 className={`font-bold ${currentFont.body} ${currentTheme.headingText}`}>
                        {useCase.title}
                      </h3>
                    </div>

                    <p className={`${currentFont.body} ${currentFont.leading} ${currentTheme.text} pl-10`}>
                      {useCase.description}
                    </p>

                    <div className={`ml-10 p-4 rounded-xl border flex items-center justify-between gap-3 ${currentTheme.formulaBox}`}>
                      <div className="space-y-0.5">
                        <span className="text-[11px] uppercase tracking-wider opacity-60 block font-mono">
                          Ejemplo real ilustrativo:
                        </span>
                        <div className={`font-medium ${currentFont.example}`}>
                          "{useCase.example}"
                        </div>
                      </div>
                      <button
                        onClick={() => handlePlayAudio(useCase.example, `when-${idx}`)}
                        className={`p-2 rounded-lg cursor-pointer transition-colors ${
                          playingAudioId === `when-${idx}`
                            ? 'bg-indigo-600 text-white animate-pulse'
                            : 'bg-black/10 dark:bg-white/10 hover:bg-black/20 text-current'
                        }`}
                        title="Escuchar pronunciación"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Frases Reales en Contexto con Audio (Clear reading list) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className={`font-bold font-serif ${currentFont.subheading} ${currentTheme.headingText}`}>
                  4. Frases Clave en Contexto ({tense.examples.length})
                </h2>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className={currentTheme.mutedText}>Velocidad:</span>
                  <button
                    onClick={() => setAudioSpeed(0.8)}
                    className={`px-2 py-0.5 rounded text-xs font-semibold cursor-pointer ${
                      audioSpeed === 0.8 ? 'bg-indigo-600 text-white' : 'bg-black/10 dark:bg-white/10'
                    }`}
                  >
                    0.8x
                  </button>
                  <button
                    onClick={() => setAudioSpeed(0.95)}
                    className={`px-2 py-0.5 rounded text-xs font-semibold cursor-pointer ${
                      audioSpeed === 0.95 ? 'bg-indigo-600 text-white' : 'bg-black/10 dark:bg-white/10'
                    }`}
                  >
                    1.0x
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {tense.examples.map((example, idx) => {
                  const isPlaying = playingAudioId === example.id;
                  return (
                    <div
                      key={example.id}
                      className={`p-5 rounded-2xl border transition-all ${currentTheme.cardBg} ${currentTheme.cardBorder}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 opacity-70">
                              #{idx + 1}
                            </span>
                            <div className={`font-semibold ${currentFont.example} ${currentTheme.headingText}`}>
                              {example.english}
                            </div>
                          </div>

                          <div className={`${currentFont.body} ${currentTheme.mutedText} pl-7`}>
                            {example.spanish}
                          </div>

                          <div className={`text-xs pt-1 pl-7 font-medium ${currentTheme.highlightText}`}>
                            💡 Contexto: {example.contextNote}
                          </div>
                        </div>

                        {/* Audio speaker button */}
                        <button
                          onClick={() => handlePlayAudio(example.audioText, example.id)}
                          disabled={isPlaying}
                          className={`p-2.5 rounded-xl cursor-pointer transition-all shrink-0 ${
                            isPlaying
                              ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 animate-pulse'
                              : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 hover:scale-105'
                          }`}
                          title="Escuchar pronunciación nativa"
                        >
                          <Volume2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 6. Palabras Señal (Signal Words) */}
            <section className="space-y-4">
              <h2 className={`font-bold font-serif ${currentFont.subheading} ${currentTheme.headingText}`}>
                5. Palabras Señal (Time Markers)
              </h2>
              <div className={`p-6 rounded-2xl border space-y-3 ${currentTheme.cardBg} ${currentTheme.cardBorder}`}>
                <p className={`${currentFont.body} ${currentTheme.mutedText}`}>
                  Cuando leas o escuches estas palabras en una conversación, sabrás de inmediato que debes emplear <strong>{tense.name}</strong>:
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {tense.signalWords.map((word, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1.5 rounded-lg font-mono font-medium ${currentFont.body} ${currentTheme.codeBg}`}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* 7. Trampas y Errores Habituales (Common Mistakes) */}
            <section className="space-y-4">
              <h2 className={`font-bold font-serif ${currentFont.subheading} ${currentTheme.headingText}`}>
                6. Trampas Comunes y Cómo Evitarlas
              </h2>

              <div className="space-y-3">
                {tense.commonMistakes.map((mistake, idx) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl border space-y-3 ${currentTheme.cardBg} ${currentTheme.cardBorder}`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300">
                        <span className="font-bold text-xs uppercase tracking-wider block mb-1">
                          ❌ Error común en hispanohablantes:
                        </span>
                        <span className="font-mono font-semibold text-base block">
                          {mistake.wrong}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                        <span className="font-bold text-xs uppercase tracking-wider block mb-1">
                          ✅ Forma correcta en inglés:
                        </span>
                        <span className="font-mono font-semibold text-base block">
                          {mistake.correct}
                        </span>
                      </div>
                    </div>

                    <p className={`${currentFont.body} ${currentTheme.mutedText} pt-1`}>
                      <strong>¿Por qué?:</strong> {mistake.why}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 8. Cierre de Lectura y Puente a la Práctica Activa */}
            <footer className={`p-8 rounded-3xl border text-center space-y-4 shadow-lg ${currentTheme.cardBg} ${currentTheme.cardBorder}`}>
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h3 className={`font-bold font-serif ${currentFont.heading} ${currentTheme.headingText}`}>
                  ¡Has completado la lectura de {tense.name}!
                </h3>
                <p className={`${currentFont.body} ${currentTheme.mutedText} max-w-lg mx-auto`}>
                  Ahora que comprendes las reglas gramaticales y los contextos, es el momento perfecto para fijar el conocimiento con ejercicios activos o práctica oral.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => {
                    handleToggleFocusReading(false);
                    setActiveTab('practice');
                  }}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>🚀 Ir al Taller Interactivo ({tense.exercises.length} Ejercicios)</span>
                </button>

                <button
                  onClick={() => {
                    handleToggleFocusReading(false);
                    setActiveTab('pronunciation');
                  }}
                  className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 hover:scale-[1.02]"
                >
                  <Mic className="w-4 h-4" />
                  <span>🎤 Grabar Mi Pronunciación</span>
                </button>

                <button
                  onClick={() => {
                    handleToggleFocusReading(false);
                    setActiveTab('video');
                  }}
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  <span>🎬 Ver Videoclase</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className={`text-xs ${currentTheme.mutedText} hover:underline cursor-pointer`}
                >
                  Volver al mapa de los 12 tiempos verbales
                </button>
              </div>
            </footer>

          </div>
        </main>
      ) : (
        /* ========================================================================= */
        /* MODO INTERACTIVO COMPLETO: TABS, PRÁCTICA, VIDEO, MICRÓFONO, ERRORES     */
        /* ========================================================================= */
        <div className="flex-1 max-w-5xl mx-auto w-full p-2 sm:p-4 md:p-6 overflow-hidden flex flex-col">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex-1 flex flex-col overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-900">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold mb-1">
                  <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-900 px-2 py-0.5 rounded-sm">
                    {tense.spanishName}
                  </span>
                  <span className="text-slate-400 font-mono">
                    Nivel CEFR {tense.cefrLevel}
                  </span>
                  {progress?.status === 'mastered' && (
                    <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-sm border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" /> Dominado ({progress.score}%)
                    </span>
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-white">
                  {tense.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {tense.tagline}
                </p>
              </div>

              {/* Quick switch to Focus Mode */}
              <button
                onClick={() => handleToggleFocusReading(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold hover:bg-indigo-100 cursor-pointer transition-colors"
                title="Cambiar al Modo Focus con texto grande y sin distracciones"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Modo Focus (Lectura)</span>
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center px-5 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 gap-2 overflow-x-auto text-xs sm:text-sm font-medium">
              <button
                onClick={() => setActiveTab('formulas')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'formulas'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Fórmulas y Uso</span>
              </button>

              <button
                onClick={() => setActiveTab('examples')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'examples'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>Ejemplos con Audio ({tense.examples.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('pronunciation')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'pronunciation'
                    ? 'border-rose-600 text-rose-600 dark:text-rose-400 font-semibold'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <Mic className="w-4 h-4 text-rose-500" />
                <span>Pronunciación (Micrófono)</span>
                <span className="bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  En Vivo
                </span>
              </button>

              <button
                onClick={() => setActiveTab('video')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'video'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Clase en Video</span>
              </button>

              <button
                onClick={() => setActiveTab('practice')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'practice'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Taller Interactivo ({tense.exercises.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('mistakes')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'mistakes'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Errores Típicos</span>
              </button>
            </div>

            {/* Tab Content Container */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* 1. Formulas & When to Use Tab */}
              {activeTab === 'formulas' && (
                <div className="space-y-6">
                  {/* Quick Jump Action Bar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-rose-50 via-indigo-50 to-purple-50 dark:from-rose-950/40 dark:via-indigo-950/40 dark:to-purple-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl shadow-2xs">
                    <div>
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">
                        ¿Quieres practicar hablando o ver la clase guiada?
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Accede directamente al estudio de voz o a la videoclase con un solo clic:
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab('pronunciation')}
                        className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-transform hover:scale-[1.02] cursor-pointer"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>🎤 Grabar Mi Pronunciación</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('video')}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-transform hover:scale-[1.02] cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>🎬 Ver Clase en Video ({tense.videoLesson.duration})</span>
                      </button>
                    </div>
                  </div>

                  {/* Formula Blueprint Card */}
                  <div className="bg-slate-900 text-slate-100 rounded-xl p-5 shadow-md">
                    <div className="text-xs font-mono uppercase tracking-wider text-indigo-400 mb-3">
                      Estructura Gramatical Sin Complicaciones
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-sm">
                      <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700/60">
                        <span className="text-emerald-400 font-bold block mb-1">
                          (+) Afirmativa
                        </span>
                        <span className="font-mono text-slate-200">
                          {tense.formula.affirmative}
                        </span>
                      </div>

                      <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700/60">
                        <span className="text-red-400 font-bold block mb-1">
                          (-) Negativa
                        </span>
                        <span className="font-mono text-slate-200">
                          {tense.formula.negative}
                        </span>
                      </div>

                      <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700/60">
                        <span className="text-blue-400 font-bold block mb-1">
                          (?) Pregunta
                        </span>
                        <span className="font-mono text-slate-200">
                          {tense.formula.question}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap gap-4 text-xs text-slate-400">
                      <div>
                        <span className="text-slate-500">Auxiliar clave:</span>{' '}
                        <strong className="text-indigo-300 font-mono">{tense.formula.auxiliary}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Forma verbal:</span>{' '}
                        <strong className="text-indigo-300 font-mono">{tense.formula.verbForm}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Real life contexts */}
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                      ¿Cuándo se usa en la vida real?
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {tense.whenToUse.map((useCase, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between"
                        >
                          <div>
                            <h5 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">
                              {idx + 1}. {useCase.title}
                            </h5>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                              {useCase.description}
                            </p>
                          </div>
                          <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-750 text-xs text-indigo-900 dark:text-indigo-300 font-medium">
                            "{useCase.example}"
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Signal Words / Time Markers */}
                  <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-xl">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 mb-2">
                      Palabras Pista (Signal Words) que indican este tiempo:
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {tense.signalWords.map((word, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 text-xs font-mono font-medium rounded-md shadow-2xs"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Examples with Audio Tab */}
              {activeTab === 'examples' && (
                <div className="space-y-4">
                  {/* Audio playback speed toolbar */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <span>Haz clic en el altavoz o toca las palabras subrayadas para traducir.</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span>Velocidad:</span>
                      <button
                        onClick={() => setAudioSpeed(0.8)}
                        className={`px-2 py-0.5 rounded text-xs font-medium cursor-pointer ${
                          audioSpeed === 0.8 ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        0.8x Lento
                      </button>
                      <button
                        onClick={() => setAudioSpeed(0.95)}
                        className={`px-2 py-0.5 rounded text-xs font-medium cursor-pointer ${
                          audioSpeed === 0.95 ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        1.0x Normal
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {tense.examples.map((example, idx) => {
                      const isPlaying = playingAudioId === example.id;
                      const isPracticing = practicingExampleId === example.id;
                      return (
                        <div
                          key={example.id}
                          className={`p-4 rounded-xl border transition-all shadow-2xs space-y-3 ${
                            isPracticing
                              ? 'border-rose-300 bg-rose-50/20 dark:bg-rose-950/20 ring-1 ring-rose-200 dark:ring-rose-800'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                                  #{idx + 1}
                                </span>
                                <div
                                  onClick={() => handlePlayAudio(example.audioText, example.id)}
                                  className="text-base font-semibold text-slate-900 dark:text-white cursor-pointer hover:text-indigo-600 transition-colors"
                                  title="Haz clic para escuchar la pronunciación"
                                >
                                  <InteractiveSentence sentence={example.english} />
                                </div>
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 pl-6">
                                {example.spanish}
                              </div>
                              <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium pt-1 pl-6">
                                Contexto: {example.contextNote}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => handlePlayAudio(example.audioText, example.id)}
                                disabled={isPlaying}
                                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                                  isPlaying
                                    ? 'bg-indigo-700 text-white ring-2 ring-indigo-400 animate-pulse'
                                    : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'
                                }`}
                                title="Escuchar pronunciación nativa de la frase"
                              >
                                <Volume2 className="w-4 h-4" />
                                <span>{isPlaying ? 'Reproduciendo...' : 'Escuchar'}</span>
                              </button>

                              <button
                                onClick={() => setPracticingExampleId(isPracticing ? null : example.id)}
                                className={`px-3 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                                  isPracticing
                                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
                                }`}
                                title="Practicar pronunciación con micrófono en tiempo real"
                              >
                                <Mic className="w-4 h-4" />
                                <span>
                                  {isPracticing ? 'Ocultar' : 'Grabar Voz'}
                                </span>
                              </button>
                            </div>
                          </div>

                          {isPracticing && (
                            <div className="pt-3 border-t border-rose-100 dark:border-rose-900 animate-fadeIn">
                              <PronunciationCoach
                                targetSentence={example.english}
                                translation={example.spanish}
                                audioText={example.audioText}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Dedicated Pronunciation Studio Tab */}
              {activeTab === 'pronunciation' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-rose-900 to-indigo-900 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/30 border border-rose-400/40 text-xs font-semibold text-rose-200">
                          <Mic className="w-3.5 h-3.5 text-rose-300 animate-pulse" />
                          <span>Reconocimiento Vocal Web Speech API</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
                          Entrenador Oral: {tense.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
                          Compara tu pronunciación en tiempo real contra hablantes nativos. Recibe porcentaje de precisión exacto y retroalimentación palabra por palabra.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-white/20 text-xs">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Gana <strong>+15 XP</strong> al lograr más del 70% de precisión</span>
                      </div>
                    </div>
                  </div>

                  {/* Sentence Carousel Selector */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Selecciona una frase de {tense.name} para practicar ({pronunciationIndex + 1} de {tense.examples.length}):
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={pronunciationIndex === 0}
                          onClick={() => setPronunciationIndex((prev) => Math.max(0, prev - 1))}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                          title="Frase anterior"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={pronunciationIndex === tense.examples.length - 1}
                          onClick={() => setPronunciationIndex((prev) => Math.min(tense.examples.length - 1, prev + 1))}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                          title="Frase siguiente"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {tense.examples.map((ex, idx) => (
                        <button
                          key={ex.id}
                          onClick={() => setPronunciationIndex(idx)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all cursor-pointer border ${
                            pronunciationIndex === idx
                              ? 'bg-rose-600 text-white border-rose-600 shadow-2xs font-semibold'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-rose-300 hover:bg-rose-50/50'
                          }`}
                        >
                          Frase {idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  {tense.examples[pronunciationIndex] && (
                    <PronunciationCoach
                      targetSentence={tense.examples[pronunciationIndex].english}
                      translation={tense.examples[pronunciationIndex].spanish}
                      audioText={tense.examples[pronunciationIndex].audioText}
                    />
                  )}
                </div>
              )}

              {/* 4. Video Lesson Tab */}
              {activeTab === 'video' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-950 dark:text-amber-200">
                    <div className="flex items-start gap-2.5">
                      <div className="p-1 rounded bg-red-600 text-white font-bold text-[10px] shrink-0 mt-0.5">
                        YouTube
                      </div>
                      <div>
                        <span className="font-bold block">¿El video dice "No disponible" en el recuadro?</span>
                        <span className="text-[11px] text-amber-800 dark:text-amber-300">
                          Si tu navegador bloquea la reproducción embebida, pulsa <strong>"▶️ Abrir Video en YouTube"</strong> para verlo directamente.
                        </span>
                      </div>
                    </div>
                    <a
                      href={`https://www.youtube.com/watch?v=${tense.videoLesson.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-transform hover:scale-[1.02] cursor-pointer shrink-0"
                    >
                      <span>▶️ Abrir Video en YouTube</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Video Player */}
                  <div className="aspect-16/9 w-full rounded-2xl overflow-hidden shadow-lg border-2 border-slate-200 dark:border-slate-800 bg-black relative">
                    <iframe
                      src={`https://www.youtube.com/embed/${tense.videoLesson.youtubeId}?rel=0&modestbranding=1&enablejsapi=1`}
                      title={tense.videoLesson.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  </div>

                  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Instructor: {tense.videoLesson.instructor}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        {tense.videoLesson.duration}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">
                      {tense.videoLesson.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {tense.videoLesson.summary}
                    </p>
                  </div>
                </div>
              )}

              {/* 5. Interactive Practice Tab */}
              {activeTab === 'practice' && (
                <div className="space-y-4">
                  {/* Level Selector Toolbar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Nivel de Dificultad:
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        ({activeExercises.length} ejercicios activos)
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        onClick={() => handleSelectDifficultyFilter('all')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          exerciseDifficultyFilter === 'all'
                            ? 'bg-indigo-600 text-white shadow-xs font-bold'
                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-300'
                        }`}
                      >
                        🎯 Todos ({tense.exercises.length})
                      </button>

                      {basicCount > 0 && (
                        <button
                          onClick={() => handleSelectDifficultyFilter('basic')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            exerciseDifficultyFilter === 'basic'
                              ? 'bg-emerald-600 text-white shadow-xs font-bold'
                              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 hover:border-emerald-300'
                          }`}
                        >
                          🟢 Básico ({basicCount})
                        </button>
                      )}

                      {intermediateCount > 0 && (
                        <button
                          onClick={() => handleSelectDifficultyFilter('intermediate')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            exerciseDifficultyFilter === 'intermediate'
                              ? 'bg-blue-600 text-white shadow-xs font-bold'
                              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-blue-700 dark:text-blue-400 hover:border-blue-300'
                          }`}
                        >
                          🔵 Intermedio ({intermediateCount})
                        </button>
                      )}

                      {advancedCount > 0 && (
                        <button
                          onClick={() => handleSelectDifficultyFilter('advanced')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            exerciseDifficultyFilter === 'advanced'
                              ? 'bg-purple-600 text-white shadow-xs font-bold'
                              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-purple-700 dark:text-purple-400 hover:border-purple-300'
                          }`}
                        >
                          🟣 Avanzado ({advancedCount})
                        </button>
                      )}

                      {expertCount > 0 && (
                        <button
                          onClick={() => handleSelectDifficultyFilter('expert')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                            exerciseDifficultyFilter === 'expert'
                              ? 'bg-rose-600 text-white shadow-xs font-bold ring-2 ring-rose-400/30'
                              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-rose-700 dark:text-rose-400 hover:border-rose-300'
                          }`}
                        >
                          <span>🔥 Experto</span>
                          <span className="opacity-80">({expertCount})</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {exerciseDifficultyFilter === 'expert' && !isPracticeComplete && (
                    <div className="flex items-center gap-2.5 px-4 py-2.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-800 dark:text-rose-200">
                      <Sparkles className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                      <span>
                        <strong>Nivel Experto C1/C2:</strong> Oraciones complejas con estructuras condicionales (Zero, First, Second, Third, Mixed) y construcciones en voz pasiva.
                      </span>
                    </div>
                  )}

                  {!isPracticeComplete && activeExercises[currentExerciseIndex] ? (
                    <InteractiveExercise
                      exercise={activeExercises[currentExerciseIndex]}
                      exerciseIndex={currentExerciseIndex}
                      totalExercises={activeExercises.length}
                      onAnswerSubmit={handleAnswerSubmit}
                      onNext={handleNextExercise}
                      isLast={currentExerciseIndex === activeExercises.length - 1}
                    />
                  ) : !isPracticeComplete ? (
                    <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm text-slate-500">
                      No hay ejercicios disponibles en este nivel específico. Prueba con "Todos".
                    </div>
                  ) : (
                    <div className="text-center py-8 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs space-y-4">
                      <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                        <Trophy className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
                        ¡Taller completado con éxito!
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                        Has respondido correctamente a <strong>{correctCount} de {activeExercises.length}</strong> ejercicios {exerciseDifficultyFilter !== 'all' ? `en nivel ${exerciseDifficultyFilter === 'basic' ? 'Básico' : exerciseDifficultyFilter === 'intermediate' ? 'Intermedio' : exerciseDifficultyFilter === 'advanced' ? 'Avanzado' : 'Experto'}` : 'en este tiempo verbal'}. Tu progreso se ha guardado en tu panel personal.
                      </p>
                      <div className="pt-4 flex items-center justify-center gap-3">
                        <button
                          onClick={handleRestartPractice}
                          className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Repetir taller</span>
                        </button>
                        <button
                          onClick={onClose}
                          className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                        >
                          <span>Volver al menú de tiempos</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 6. Common Mistakes Tab */}
              {activeTab === 'mistakes' && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-900 dark:text-amber-200">
                    Evita estos tropiezos habituales provocados por la traducción literal del español al inglés:
                  </div>

                  <div className="space-y-3">
                    {tense.commonMistakes.map((mistake, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 shadow-2xs"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 rounded-lg border border-red-200 dark:border-red-900">
                            <span className="font-bold block text-red-700 dark:text-red-400 mb-0.5">
                              ❌ Error común:
                            </span>
                            <span className="font-mono">{mistake.wrong}</span>
                          </div>
                          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 rounded-lg border border-emerald-200 dark:border-emerald-900">
                            <span className="font-bold block text-emerald-700 dark:text-emerald-400 mb-0.5">
                              ✅ Forma correcta:
                            </span>
                            <span className="font-mono">{mistake.correct}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 pt-1">
                          <strong>¿Por qué?:</strong> {mistake.why}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
