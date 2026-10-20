import { SUPPORTED_LANGUAGES } from '../i18n/translations';
import { useLocalization } from "../i18n/LocalizationContext";
import React, { useState, useEffect, useRef } from 'react';
import { TenseData } from '../types';
import { useUser } from '../context/UserContext';
import { playEnglishAudio, stopAudio } from '../utils/speech';
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
  Check,
  Play,
  Square } from
'lucide-react';

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
    leading: 'leading-relaxed'
  },
  large: {
    label: 'Grande',
    body: 'text-lg sm:text-xl',
    heading: 'text-3xl sm:text-4xl',
    subheading: 'text-xl sm:text-2xl',
    formula: 'text-lg sm:text-xl',
    example: 'text-lg sm:text-xl',
    badge: 'text-sm',
    leading: 'leading-relaxed'
  },
  xlarge: {
    label: 'Extra Grande',
    body: 'text-xl sm:text-2xl',
    heading: 'text-4xl sm:text-5xl',
    subheading: 'text-2xl sm:text-3xl',
    formula: 'text-xl sm:text-2xl',
    example: 'text-xl sm:text-2xl',
    badge: 'text-base',
    leading: 'leading-loose'
  }
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
    codeBg: 'bg-slate-800 text-indigo-300'
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
    codeBg: 'bg-[#e7d8c5] text-[#5c3716]'
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
    codeBg: 'bg-slate-100 text-indigo-700'
  }
};

export const TenseDetailModal: React.FC<TenseDetailModalProps> = ({
  tense,
  onClose,
  onOpenSubscription,
  initialTab = 'formulas'
}) => {const { l } = useLocalization();
  const {
    canAccessTense,
    completeExerciseForTense,
    progressState,
    isDarkMode,
    toggleDarkMode,
    unlockOwnerAccess,
    ownerConfig,
    t,
    nativeLanguage,
    setNativeLanguage,
    getTenseName,
    getTenseTagline,
    getExampleTranslation
  } = useUser();

  const localizedTenseName = getTenseName(tense.id) || tense.spanishName;
  const localizedTenseTagline = getTenseTagline(tense.id) || tense.tagline;

  const [activeTab, setActiveTab] = useState<'formulas' | 'examples' | 'pronunciation' | 'video' | 'practice' | 'mistakes'>(initialTab);
  const [audioSpeed, setAudioSpeed] = useState<number>(0.95);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState<boolean>(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(null);
  const cancelPlayAllRef = useRef<boolean>(false);
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
    return saved as FontScale || 'large';
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

  // Cleanup ambient sound and speech audio on unmount
  useEffect(() => {
    return () => {
      cancelPlayAllRef.current = true;
      stopAudio();
      sounds.toggleFocusAmbient(false);
    };
  }, []);

  // Stop playing all if user navigates to another tab or tense changes
  useEffect(() => {
    if (activeTab !== 'examples' && isPlayingAll) {
      cancelPlayAllRef.current = true;
      stopAudio();
      setIsPlayingAll(false);
      setCurrentPlayingIndex(null);
      setPlayingAudioId(null);
    }
  }, [activeTab, isPlayingAll]);

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

  const handleStopAll = () => {
    cancelPlayAllRef.current = true;
    stopAudio();
    setIsPlayingAll(false);
    setCurrentPlayingIndex(null);
    setPlayingAudioId(null);
  };

  const handlePlayAudio = async (text: string, id: string) => {
    if (isPlayingAll) {
      handleStopAll();
    }
    setPlayingAudioId(id);
    await playEnglishAudio(text, audioSpeed);
    setPlayingAudioId(null);
  };

  const handlePlayAllExamples = async () => {
    if (isPlayingAll) {
      handleStopAll();
      return;
    }

    if (!tense.examples || tense.examples.length === 0) return;

    cancelPlayAllRef.current = false;
    setIsPlayingAll(true);

    for (let i = 0; i < tense.examples.length; i++) {
      if (cancelPlayAllRef.current) break;
      const example = tense.examples[i];
      setCurrentPlayingIndex(i);
      setPlayingAudioId(example.id);

      const textToRead = example.audioText || example.english;
      await playEnglishAudio(textToRead, audioSpeed);

      if (cancelPlayAllRef.current) break;

      // Pausa agradable de 800ms entre ejemplos sucesivos
      if (i < tense.examples.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
      if (cancelPlayAllRef.current) break;
    }

    setIsPlayingAll(false);
    setCurrentPlayingIndex(null);
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
            {l(t.unlockTense || 'Desbloquear')} {l(tense.name)}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            {l(t.heroSubDesc || 'Accede a todos los 12 tiempos del inglés, videoclases, audios nativos y al Tutor IA inteligente 24/7.')}
          </p>

          <div className="mt-5 flex flex-col gap-2.5">
            <button
              onClick={onOpenSubscription}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2">
              
              <span>{l(t.btnPro || `Pase Total ($${(ownerConfig?.priceMonthly || 5.99).toFixed(2)} USD/mes)`)}</span>
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-xs font-semibold transition-colors cursor-pointer">
              
              {l(t.modalBack || 'Volver')}
            </button>
          </div>
        </div>
      </div>);

  }

  const currentTheme = THEME_STYLES[focusTheme];
  const currentFont = FONT_STYLES[fontScale];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col font-sans overflow-hidden text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Top Header Bar with Mode Toggle & Focus Controls */}
      <header className="min-h-14 py-2 flex-wrap bg-slate-900 border-b border-slate-800 px-3 sm:px-6 flex items-center justify-between text-white shrink-0 gap-2">
        {/* Left: Exit & Breadcrumb */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer">
            
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{l("Salir de la Lección")}</span>
            <span className="sm:hidden">{l("Salir")}</span>
          </button>
          <span className="hidden lg:inline text-xs text-slate-400">{l("Catálogo > ")}
            <strong className="text-white">{l(tense.name)}</strong>
          </span>
        </div>

        {/* Center: Prominent Segmented Switch: [ Modo Focus (Lectura) ] vs [ Vista Interactiva ] */}
        <div className="flex items-center p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => handleToggleFocusReading(true)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
            focusReadingMode ?
            'bg-indigo-600 text-white font-bold shadow-xs' :
            'text-slate-400 hover:text-white'}`
            }
            title={l("Lectura simplificada con texto grande y sin distracciones")}>
            
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{l("Modo Focus (Lectura)")}</span>
            <span className="sm:hidden font-bold">{l("Focus")}</span>
            {l(focusReadingMode &&
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />)
            }
          </button>

          <button
            onClick={() => handleToggleFocusReading(false)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
            !focusReadingMode ?
            'bg-indigo-600 text-white font-bold shadow-xs' :
            'text-slate-400 hover:text-white'}`
            }
            title={l("Accede a los talleres interactivos, videos, micrófono y pestañas completas")}>
            
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{l("Vista Completa (Tabs)")}</span>
            <span className="sm:hidden">{l("Completa")}</span>
          </button>
        </div>

        <label className="flex items-center gap-1 text-xs text-white"><span className="hidden sm:inline">{l('Language')}</span><select aria-label={l('Lesson language')} value={nativeLanguage} onChange={(event) => setNativeLanguage(event.target.value as typeof nativeLanguage)} className="max-w-28 rounded-lg border border-slate-600 bg-slate-900 px-2 py-1 text-white">{SUPPORTED_LANGUAGES.map((option) => <option key={option.code} value={option.code}>{option.nativeName}</option>)}</select></label>
          {/* Right Controls: Focus tools (Font size, Reading theme, Ambient zen, Timer, Fullscreen, Close) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          
          {/* Controls specific to Focus Reading Mode */}
          {l(focusReadingMode &&
          <>
              {/* Font Scale Adjuster: [ A- ] [ Grande ] [ A+ ] */}
              <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5 text-xs text-slate-300">
                <button
                onClick={() => handleCycleFontScale('prev')}
                disabled={fontScale === 'normal'}
                title={l("Disminuir tamaño de letra")}
                className="p-1 px-1.5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-1.5 font-semibold text-[11px] text-indigo-300 hidden md:inline">
                  <Type className="w-3 h-3 inline mr-1" />
                  {l(currentFont.label)}
                </span>
                <button
                onClick={() => handleCycleFontScale('next')}
                disabled={fontScale === 'xlarge'}
                title={l("Aumentar tamaño de letra")}
                className="p-1 px-1.5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Reading Theme Selector (Noche, Sepia, Día) */}
              <div className="hidden sm:flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5 text-xs">
                <button
                onClick={() => handleThemeChange('dark')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                focusTheme === 'dark' ? 'bg-slate-900 text-white font-bold shadow-2xs' : 'text-slate-400 hover:text-white'}`
                }
                title={l("Tema Noche (OLED Oscuro)")}>{l("🌙 Noche ")}


              </button>
                <button
                onClick={() => handleThemeChange('sepia')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                focusTheme === 'sepia' ? 'bg-[#f4ebe1] text-[#2c2217] font-bold shadow-2xs' : 'text-slate-400 hover:text-white'}`
                }
                title={l("Tema Sepia (Cálido y relajante para la vista)")}>{l("📜 Sepia ")}


              </button>
                <button
                onClick={() => handleThemeChange('light')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                focusTheme === 'light' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-400 hover:text-white'}`
                }
                title={l("Tema Claro")}>{l("☀️ Claro ")}


              </button>
              </div>
            </>)
          }

          {/* Ambient Rain Sound */}
          <button
            onClick={handleToggleAmbient}
            title={l(isAmbientPlaying ? 'Desactivar lluvia zen de concentración' : 'Activar sonido de lluvia relajante para concentrarte')}
            className={`px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors cursor-pointer ${
            isAmbientPlaying ?
            'bg-teal-950 text-teal-300 border-teal-700' :
            'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'}`
            }>
            
            {l(isAmbientPlaying ? <Volume2 className="w-3.5 h-3.5 text-teal-400" /> : <VolumeX className="w-3.5 h-3.5" />)}
            <span className="hidden xl:inline">{l(isAmbientPlaying ? 'Lluvia Zen: ON' : 'Lluvia Zen')}</span>
          </button>

          {/* Reading Timer */}
          <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
            <Timer className="w-3.5 h-3.5 text-indigo-400" />
            <span>{l(formatTimer(elapsedSeconds))}</span>
          </div>

          {/* Fullscreen */}
          <button
            onClick={handleToggleFullscreen}
            className="hidden sm:flex p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
            title={l("Pantalla Completa")}>
            
            {l(isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />)}
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
            title={l("Cerrar lección")}>
            
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Viewport: Either Focus Reading Mode OR Interactive Tab Mode */}
      {l(focusReadingMode ? (
      /* ========================================================================= */
      /* MODO FOCUS: LECTURA CENTRADA, TEXTO GRANDE Y CERO DISTRACCIONES           */
      /* ========================================================================= */
      <main className={`flex-1 overflow-y-auto transition-colors duration-300 ${currentTheme.bg}`}>
          <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-10 sm:space-y-12">
            
            {/* 1. Header Editorial Limpio */}
            <header className="space-y-4 border-b pb-8 border-slate-200/40 dark:border-slate-800/60">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-md font-mono font-bold ${currentFont.badge} ${currentTheme.codeBg}`}>{l("Nivel CEFR ")}
                  {l(tense.cefrLevel)}
                  </span>
                  <span className={`font-semibold ${currentFont.badge} ${currentTheme.mutedText}`}>
                    · {l(localizedTenseName)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium">
                  {l(progress?.status === 'mastered' ?
                <span className="flex items-center gap-1 text-emerald-500">
                      <CheckCircle2 className="w-4 h-4" /> {l(t.mastered)} ({l(progress.score)}%)
                    </span> :

                <span className={`${currentTheme.mutedText} flex items-center gap-1`}>
                      <Clock className="w-3.5 h-3.5" />{l(" 4 min ")}
                </span>)
                }
                </div>
              </div>

              <h1 className={`font-bold font-serif tracking-tight ${currentFont.heading} ${currentTheme.headingText}`}>
                {l(tense.name)}
              </h1>

              <p className={`${currentFont.body} ${currentFont.leading} ${currentTheme.mutedText}`}>
                {l(localizedTenseTagline)}
              </p>

              {/* Focus Mode helper banner */}
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${currentTheme.accentBox}`}>
                <div className="flex items-start gap-2.5">
                  <Eye className="w-4 h-4 mt-0.5 shrink-0" />
                  <p className="text-xs sm:text-sm leading-relaxed">
                    <strong>{l("Modo Focus activado:")}</strong>{l(" La interfaz ha sido simplificada y el tamaño de texto aumentado para que comprendas la lógica de este tiempo verbal con máxima calma. ")}
                </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                  onClick={() => handleToggleFocusReading(false)}
                  className="text-xs underline font-semibold cursor-pointer hover:opacity-80">{l("Ver pestañas interactivas ")}


                </button>
                </div>
              </div>
            </header>

            {/* 2. La Idea Central (The Big Picture Concept) */}
            <section className="space-y-4">
              <h2 className={`font-bold font-serif ${currentFont.subheading} ${currentTheme.headingText}`}>{l("1. La Idea Central ")}

            </h2>
              
              <div className={`p-6 rounded-2xl border space-y-4 shadow-xs ${currentTheme.cardBg} ${currentTheme.cardBorder}`}>
                <p className={`${currentFont.body} ${currentFont.leading} ${currentTheme.text}`}>{l("En inglés, ")}
                <strong>{l(tense.name)}</strong>{l(" se utiliza para comunicar acciones que se sitúan en un punto específico del tiempo. A diferencia del español, la intención principal de este tiempo verbal es dar claridad inmediata sobre si el hecho es un hábito repetitivo, una acción que está sucediendo ahora mismo, un resultado completado o un proceso que perdura. ")}
              </p>

                {/* Timeline visual representation */}
                <div className={`p-4 rounded-xl border ${currentTheme.formulaBox}`}>
                  <span className="text-xs uppercase tracking-wider font-bold block mb-2 opacity-75 font-mono">{l("Línea Temporal de la Acción: ")}

                </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm font-medium">
                    <div className="p-2.5 rounded-lg bg-black/10 dark:bg-white/5">
                      <span className="block opacity-60 text-[11px]">{l("Punto de Partida:")}</span>
                      <strong>{l(tense.timelineGraphic.start)}</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-indigo-500/20 text-indigo-400 dark:text-indigo-300 font-bold border border-indigo-500/30">
                      <span className="block opacity-80 text-[11px]">{l("Enfoque Principal:")}</span>
                      <span>{l(tense.timelineGraphic.focus)}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/10 dark:bg-white/5">
                      <span className="block opacity-60 text-[11px]">{l("Efecto / Final:")}</span>
                      <strong>{l(tense.timelineGraphic.end)}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Fórmulas Gramaticales Sin Rodeos (Large, readable formula cards) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className={`font-bold font-serif ${currentFont.subheading} ${currentTheme.headingText}`}>{l("2. Estructura Gramatical (Fórmulas Clave) ")}

              </h2>
                <span className={`text-xs font-mono ${currentTheme.mutedText}`}>{l("Auxiliar: ")}
                <strong className={currentTheme.highlightText}>{l(tense.formula.auxiliary)}</strong>
                </span>
              </div>

              <div className="space-y-3">
                {/* (+) Affirmative */}
                <div className={`p-5 rounded-xl border ${currentTheme.cardBg} ${currentTheme.cardBorder} transition-all`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">{l("(+) Forma Afirmativa ")}

                  </span>
                  </div>
                  <div className={`font-mono font-bold tracking-wide ${currentFont.formula} ${currentTheme.headingText}`}>
                    {l(tense.formula.affirmative)}
                  </div>
                </div>

                {/* (-) Negative */}
                <div className={`p-5 rounded-xl border ${currentTheme.cardBg} ${currentTheme.cardBorder} transition-all`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-500">{l("(-) Forma Negativa ")}

                  </span>
                  </div>
                  <div className={`font-mono font-bold tracking-wide ${currentFont.formula} ${currentTheme.headingText}`}>
                    {l(tense.formula.negative)}
                  </div>
                </div>

                {/* (?) Question */}
                <div className={`p-5 rounded-xl border ${currentTheme.cardBg} ${currentTheme.cardBorder} transition-all`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-500">{l("(?) Forma Interrogativa (Pregunta) ")}

                  </span>
                  </div>
                  <div className={`font-mono font-bold tracking-wide ${currentFont.formula} ${currentTheme.headingText}`}>
                    {l(tense.formula.question)}
                  </div>
                </div>
              </div>

              {/* Auxiliary and Verb form callout */}
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm ${currentTheme.accentBox}`}>
                <div>
                  <span className="opacity-75 block text-xs">{l("Auxiliar que gobierna este tiempo:")}</span>
                  <strong className="font-mono text-base">{l(tense.formula.auxiliary)}</strong>
                </div>
                <div>
                  <span className="opacity-75 block text-xs">{l("Forma en que se conjuga el verbo principal:")}</span>
                  <strong className="font-mono text-base">{l(tense.formula.verbForm)}</strong>
                </div>
              </div>
            </section>

            {/* 4. ¿Cuándo se usa en la vida real? (Clean editorial layout) */}
            <section className="space-y-4">
              <h2 className={`font-bold font-serif ${currentFont.subheading} ${currentTheme.headingText}`}>{l("3. ¿Cuándo se usa en la vida real? ")}

            </h2>

              <div className="space-y-4">
                {l(tense.whenToUse.map((useCase, idx) =>
              <div
                key={idx}
                className={`p-6 rounded-2xl border space-y-3 ${currentTheme.cardBg} ${currentTheme.cardBorder}`}>
                
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${currentTheme.codeBg}`}>
                        {l(idx + 1)}
                      </span>
                      <h3 className={`font-bold ${currentFont.body} ${currentTheme.headingText}`}>
                        {l(useCase.title)}
                      </h3>
                    </div>

                    <p className={`${currentFont.body} ${currentFont.leading} ${currentTheme.text} pl-10`}>
                      {l(useCase.description)}
                    </p>

                    <div className={`ml-10 p-4 rounded-xl border flex items-center justify-between gap-3 ${currentTheme.formulaBox}`}>
                      <div className="space-y-0.5">
                        <span className="text-[11px] uppercase tracking-wider opacity-60 block font-mono">{l("Ejemplo real ilustrativo: ")}

                    </span>
                        <div className={`font-medium ${currentFont.example}`}>
                          "{l(useCase.example)}"
                        </div>
                      </div>
                      <button
                    onClick={() => handlePlayAudio(useCase.example, `when-${idx}`)}
                    className={`p-2 rounded-lg cursor-pointer transition-colors ${
                    playingAudioId === `when-${idx}` ?
                    'bg-indigo-600 text-white animate-pulse' :
                    'bg-black/10 dark:bg-white/10 hover:bg-black/20 text-current'}`
                    }
                    title={l("Escuchar pronunciación")}>
                    
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
              ))}
              </div>
            </section>

            {/* 5. Frases Reales en Contexto con Audio (Clear reading list) */}
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <h2 className={`font-bold font-serif ${currentFont.subheading} ${currentTheme.headingText}`}>{l("4. Frases Clave en Contexto (")}
                  {l(tense.examples.length)})
                  </h2>

                  <button
                  onClick={handlePlayAllExamples}
                  className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1.5 text-xs shadow-xs ${
                  isPlayingAll ?
                  'bg-rose-600 hover:bg-rose-700 text-white animate-pulse ring-2 ring-rose-400' :
                  'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'}`
                  }
                  title={l(isPlayingAll ? 'Detener lectura continua' : 'Escuchar todos los ejemplos en voz alta consecutivamente')}>
                  
                    {l(isPlayingAll ?
                  <>
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>{l("Detener (")}{l(currentPlayingIndex !== null ? `${currentPlayingIndex + 1}/${tense.examples.length}` : '')})</span>
                      </> :

                  <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{l("Escuchar todo")}</span>
                      </>)
                  }
                  </button>

                  {l(isPlayingAll &&
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 animate-pulse">
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{l("Leyendo frase ")}{l(currentPlayingIndex !== null ? currentPlayingIndex + 1 : 1)}...</span>
                    </span>)
                }
                </div>

                <div className="flex items-center gap-1.5 text-xs ml-auto">
                  <span className={currentTheme.mutedText}>{l("Velocidad:")}</span>
                  <button
                  onClick={() => setAudioSpeed(0.8)}
                  className={`px-2 py-0.5 rounded text-xs font-semibold cursor-pointer ${
                  audioSpeed === 0.8 ? 'bg-indigo-600 text-white' : 'bg-black/10 dark:bg-white/10'}`
                  }>{l("0.8x ")}


                </button>
                  <button
                  onClick={() => setAudioSpeed(0.95)}
                  className={`px-2 py-0.5 rounded text-xs font-semibold cursor-pointer ${
                  audioSpeed === 0.95 ? 'bg-indigo-600 text-white' : 'bg-black/10 dark:bg-white/10'}`
                  }>{l("1.0x ")}


                </button>
                </div>
              </div>

              <div className="space-y-3">
                {l(tense.examples.map((example, idx) => {
                const isPlaying = playingAudioId === example.id;
                return (
                  <div
                    key={example.id}
                    className={`p-5 rounded-2xl border transition-all ${
                    isPlayingAll && currentPlayingIndex === idx ?
                    'border-indigo-500 ring-2 ring-indigo-400 bg-indigo-500/15 shadow-sm scale-[1.01]' :
                    `${currentTheme.cardBg} ${currentTheme.cardBorder}`}`
                    }>
                    
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 opacity-70">
                              #{l(idx + 1)}
                            </span>
                            <div className={`font-semibold ${currentFont.example} ${currentTheme.headingText}`}>
                              {example.english}
                            </div>
                          </div>

                          <div className={`${currentFont.body} ${currentTheme.mutedText} pl-7`}>
                            {l(getExampleTranslation(tense.id, example.spanish))}
                          </div>

                          <div className={`text-xs pt-1 pl-7 font-medium ${currentTheme.highlightText}`}>{l("💡 Contexto: ")}
                          {l(example.contextNote)}
                          </div>
                        </div>

                        {/* Audio speaker button */}
                        <button
                        onClick={() => handlePlayAudio(example.audioText, example.id)}
                        disabled={isPlaying}
                        className={`p-2.5 rounded-xl cursor-pointer transition-all shrink-0 ${
                        isPlaying ?
                        'bg-indigo-600 text-white ring-2 ring-indigo-400 animate-pulse' :
                        'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 hover:scale-105'}`
                        }
                        title={l("Escuchar pronunciación nativa")}>
                        
                          <Volume2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>);

              }))}
              </div>
            </section>

            {/* 6. Palabras Señal (Signal Words) */}
            <section className="space-y-4">
              <h2 className={`font-bold font-serif ${currentFont.subheading} ${currentTheme.headingText}`}>{l("5. Palabras Señal (Time Markers) ")}

            </h2>
              <div className={`p-6 rounded-2xl border space-y-3 ${currentTheme.cardBg} ${currentTheme.cardBorder}`}>
                <p className={`${currentFont.body} ${currentTheme.mutedText}`}>{l("Cuando leas o escuches estas palabras en una conversación, sabrás de inmediato que debes emplear ")}
                <strong>{l(tense.name)}</strong>:
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {l(tense.signalWords.map((word, idx) =>
                <span
                  key={idx}
                  className={`px-3 py-1.5 rounded-lg font-mono font-medium ${currentFont.body} ${currentTheme.codeBg}`}>
                  
                      {word}
                    </span>
                ))}
                </div>
              </div>
            </section>

            {/* 7. Trampas y Errores Habituales (Common Mistakes) */}
            <section className="space-y-4">
              <h2 className={`font-bold font-serif ${currentFont.subheading} ${currentTheme.headingText}`}>{l("6. Trampas Comunes y Cómo Evitarlas ")}

            </h2>

              <div className="space-y-3">
                {l(tense.commonMistakes.map((mistake, idx) =>
              <div
                key={idx}
                className={`p-5 rounded-2xl border space-y-3 ${currentTheme.cardBg} ${currentTheme.cardBorder}`}>
                
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300">
                        <span className="font-bold text-xs uppercase tracking-wider block mb-1">{l("❌ Error común en hispanohablantes: ")}

                    </span>
                        <span className="font-mono font-semibold text-base block">
                          {mistake.wrong}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                        <span className="font-bold text-xs uppercase tracking-wider block mb-1">{l("✅ Forma correcta en inglés: ")}

                    </span>
                        <span className="font-mono font-semibold text-base block">
                          {mistake.correct}
                        </span>
                      </div>
                    </div>

                    <p className={`${currentFont.body} ${currentTheme.mutedText} pt-1`}>
                      <strong>{l("¿Por qué?:")}</strong> {l(mistake.why)}
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
                <h3 className={`font-bold font-serif ${currentFont.heading} ${currentTheme.headingText}`}>{l("¡Has completado la lectura de ")}
                {l(tense.name)}!
                </h3>
                <p className={`${currentFont.body} ${currentTheme.mutedText} max-w-lg mx-auto`}>{l("Ahora que comprendes las reglas gramaticales y los contextos, es el momento perfecto para fijar el conocimiento con ejercicios activos o práctica oral. ")}

              </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                onClick={() => {
                  handleToggleFocusReading(false);
                  setActiveTab('practice');
                }}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 hover:scale-[1.02]">
                
                  <Sparkles className="w-4 h-4" />
                  <span>{l("🚀 Ir al Taller Interactivo (")}{l(tense.exercises.length)}{l(" Ejercicios)")}</span>
                </button>

                <button
                onClick={() => {
                  handleToggleFocusReading(false);
                  setActiveTab('pronunciation');
                }}
                className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 hover:scale-[1.02]">
                
                  <Mic className="w-4 h-4" />
                  <span>{l("🎤 Grabar Mi Pronunciación")}</span>
                </button>

                <button
                onClick={() => {
                  handleToggleFocusReading(false);
                  setActiveTab('video');
                }}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-colors cursor-pointer flex items-center gap-2">
                
                  <Video className="w-4 h-4" />
                  <span>{l("🎬 Ver Videoclase")}</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                onClick={onClose}
                className={`text-xs ${currentTheme.mutedText} hover:underline cursor-pointer`}>{l("Volver al mapa de los 12 tiempos verbales ")}


              </button>
              </div>
            </footer>

          </div>
        </main>) : (

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
                    {l(tense.spanishName)}
                  </span>
                  <span className="text-slate-400 font-mono">{l("Nivel CEFR ")}
                  {l(tense.cefrLevel)}
                  </span>
                  {l(progress?.status === 'mastered' &&
                <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-sm border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />{l(" Dominado (")}{l(progress.score)}%)
                    </span>)
                }
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-white">
                  {l(tense.name)}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {l(tense.tagline)}
                </p>
              </div>

              {/* Quick switch to Focus Mode */}
              <button
              onClick={() => handleToggleFocusReading(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold hover:bg-indigo-100 cursor-pointer transition-colors"
              title={l("Cambiar al Modo Focus con texto grande y sin distracciones")}>
              
                <BookOpen className="w-3.5 h-3.5" />
                <span>{l("Modo Focus (Lectura)")}</span>
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center px-5 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 gap-2 overflow-x-auto text-xs sm:text-sm font-medium">
              <button
              onClick={() => setActiveTab('formulas')}
              className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'formulas' ?
              'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold' :
              'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`
              }>
              
                <BookOpen className="w-4 h-4" />
                <span>{l("Fórmulas y Uso")}</span>
              </button>

              <button
              onClick={() => setActiveTab('examples')}
              className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'examples' ?
              'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold' :
              'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`
              }>
              
                <Volume2 className="w-4 h-4" />
                <span>{l("Ejemplos con Audio (")}{l(tense.examples.length)})</span>
              </button>

              <button
              onClick={() => setActiveTab('pronunciation')}
              className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pronunciation' ?
              'border-rose-600 text-rose-600 dark:text-rose-400 font-semibold' :
              'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`
              }>
              
                <Mic className="w-4 h-4 text-rose-500" />
                <span>{l("Pronunciación (Micrófono)")}</span>
                <span className="bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{l("En Vivo ")}

              </span>
              </button>

              <button
              onClick={() => setActiveTab('video')}
              className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'video' ?
              'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold' :
              'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`
              }>
              
                <Video className="w-4 h-4" />
                <span>{l("Clase en Video")}</span>
              </button>

              <button
              onClick={() => setActiveTab('practice')}
              className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'practice' ?
              'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold' :
              'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`
              }>
              
                <Sparkles className="w-4 h-4" />
                <span>{l("Taller Interactivo (")}{l(tense.exercises.length)})</span>
              </button>

              <button
              onClick={() => setActiveTab('mistakes')}
              className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'mistakes' ?
              'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold' :
              'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`
              }>
              
                <AlertTriangle className="w-4 h-4" />
                <span>{l("Errores Típicos")}</span>
              </button>
            </div>

            {/* Tab Content Container */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* 1. Formulas & When to Use Tab */}
              {l(activeTab === 'formulas' &&
            <div className="space-y-6">
                  {/* Quick Jump Action Bar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-rose-50 via-indigo-50 to-purple-50 dark:from-rose-950/40 dark:via-indigo-950/40 dark:to-purple-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl shadow-2xs">
                    <div>
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">{l("¿Quieres practicar hablando o ver la clase guiada? ")}

                  </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">{l("Accede directamente al estudio de voz o a la videoclase con un solo clic: ")}

                  </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                    type="button"
                    onClick={() => setActiveTab('pronunciation')}
                    className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-transform hover:scale-[1.02] cursor-pointer">
                    
                        <Mic className="w-3.5 h-3.5" />
                        <span>{l("🎤 Grabar Mi Pronunciación")}</span>
                      </button>
                      <button
                    type="button"
                    onClick={() => setActiveTab('video')}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-transform hover:scale-[1.02] cursor-pointer">
                    
                        <Video className="w-3.5 h-3.5" />
                        <span>{l("🎬 Ver Clase en Video (")}{l(tense.videoLesson.duration)})</span>
                      </button>
                    </div>
                  </div>

                  {/* Formula Blueprint Card */}
                  <div className="bg-slate-900 text-slate-100 rounded-xl p-5 shadow-md">
                    <div className="text-xs font-mono uppercase tracking-wider text-indigo-400 mb-3">{l("Estructura Gramatical Sin Complicaciones ")}

                </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-sm">
                      <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700/60">
                        <span className="text-emerald-400 font-bold block mb-1">{l("(+) Afirmativa ")}

                    </span>
                        <span className="font-mono text-slate-200">
                          {l(tense.formula.affirmative)}
                        </span>
                      </div>

                      <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700/60">
                        <span className="text-red-400 font-bold block mb-1">{l("(-) Negativa ")}

                    </span>
                        <span className="font-mono text-slate-200">
                          {l(tense.formula.negative)}
                        </span>
                      </div>

                      <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700/60">
                        <span className="text-blue-400 font-bold block mb-1">{l("(?) Pregunta ")}

                    </span>
                        <span className="font-mono text-slate-200">
                          {l(tense.formula.question)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap gap-4 text-xs text-slate-400">
                      <div>
                        <span className="text-slate-500">{l("Auxiliar clave:")}</span>{l(' ')}
                        <strong className="text-indigo-300 font-mono">{l(tense.formula.auxiliary)}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">{l("Forma verbal:")}</span>{l(' ')}
                        <strong className="text-indigo-300 font-mono">{l(tense.formula.verbForm)}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Real life contexts */}
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-3">{l("¿Cuándo se usa en la vida real? ")}

                </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {l(tense.whenToUse.map((useCase, idx) =>
                  <div
                    key={idx}
                    className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                    
                          <div>
                            <h5 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">
                              {l(idx + 1)}. {l(useCase.title)}
                            </h5>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                              {l(useCase.description)}
                            </p>
                          </div>
                          <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-750 text-xs text-indigo-900 dark:text-indigo-300 font-medium">
                            "{l(useCase.example)}"
                          </div>
                        </div>
                  ))}
                    </div>
                  </div>

                  {/* Signal Words / Time Markers */}
                  <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-xl">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 mb-2">{l("Palabras Pista (Signal Words) que indican este tiempo: ")}

                </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {l(tense.signalWords.map((word, idx) =>
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 text-xs font-mono font-medium rounded-md shadow-2xs">
                    
                          {word}
                        </span>
                  ))}
                    </div>
                  </div>
                </div>)
            }

              {/* 2. Examples with Audio Tab */}
              {l(activeTab === 'examples' &&
            <div className="space-y-4">
                  {/* Audio playback speed toolbar & Escuchar todo */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                    onClick={handlePlayAllExamples}
                    className={`px-3.5 py-2 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-2 shadow-xs ${
                    isPlayingAll ?
                    'bg-rose-600 hover:bg-rose-700 text-white ring-2 ring-rose-400 animate-pulse' :
                    'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'}`
                    }
                    title={l(isPlayingAll ? 'Detener lectura continua' : 'Escuchar todos los ejemplos de este tiempo verbal en voz alta')}>
                    
                        {l(isPlayingAll ?
                    <>
                            <Square className="w-3.5 h-3.5 fill-current" />
                            <span>{l("Detener (")}
                        {l(currentPlayingIndex !== null ? `${currentPlayingIndex + 1}/${tense.examples.length}` : '')})
                            </span>
                          </> :

                    <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>{l("Escuchar todo (")}{l(tense.examples.length)})</span>
                          </>)
                    }
                      </button>

                      {l(isPlayingAll &&
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 animate-pulse">
                          <Volume2 className="w-4 h-4" />
                          <span>{l("Leyendo frase ")}{l(currentPlayingIndex !== null ? currentPlayingIndex + 1 : 1)}...</span>
                        </span>)
                  }

                      {l(!isPlayingAll &&
                  <span className="hidden sm:inline text-slate-500 dark:text-slate-400 text-[11px]">{l("Lee en voz alta todas las frases consecutivamente. ")}

                  </span>)
                  }
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 ml-auto">
                      <span>{l("Velocidad:")}</span>
                      <button
                    onClick={() => setAudioSpeed(0.8)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    audioSpeed === 0.8 ?
                    'bg-indigo-600 text-white' :
                    'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`
                    }>{l("0.8x Lento ")}


                  </button>
                      <button
                    onClick={() => setAudioSpeed(0.95)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    audioSpeed === 0.95 ?
                    'bg-indigo-600 text-white' :
                    'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`
                    }>{l("1.0x Normal ")}


                  </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {l(tense.examples.map((example, idx) => {
                  const isPlaying = playingAudioId === example.id;
                  const isPracticing = practicingExampleId === example.id;
                  const isBeingReadInSequence = isPlayingAll && currentPlayingIndex === idx;
                  return (
                    <div
                      key={example.id}
                      className={`p-4 rounded-xl border transition-all shadow-2xs space-y-3 ${
                      isBeingReadInSequence ?
                      'border-indigo-500 ring-2 ring-indigo-400 bg-indigo-50/60 dark:bg-indigo-950/40 scale-[1.01]' :
                      isPracticing ?
                      'border-rose-300 bg-rose-50/20 dark:bg-rose-950/20 ring-1 ring-rose-200 dark:ring-rose-800' :
                      'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300'}`
                      }>
                      
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                                  #{l(idx + 1)}
                                </span>
                                <div
                              onClick={() => handlePlayAudio(example.audioText, example.id)}
                              className="text-base font-semibold text-slate-900 dark:text-white cursor-pointer hover:text-indigo-600 transition-colors"
                              title={l("Haz clic para escuchar la pronunciación")}>
                              
                                  <InteractiveSentence sentence={example.english} />
                                </div>
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 pl-6">
                                {l(getExampleTranslation(tense.id, example.spanish))}
                              </div>
                              <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium pt-1 pl-6">{l("Contexto: ")}
                            {l(example.contextNote)}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                            onClick={() => handlePlayAudio(example.audioText, example.id)}
                            disabled={isPlaying}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                            isPlaying ?
                            'bg-indigo-700 text-white ring-2 ring-indigo-400 animate-pulse' :
                            'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'}`
                            }
                            title={l("Escuchar pronunciación nativa de la frase")}>
                            
                                <Volume2 className="w-4 h-4" />
                                <span>{l(isPlaying ? 'Reproduciendo...' : 'Escuchar')}</span>
                              </button>

                              <button
                            onClick={() => setPracticingExampleId(isPracticing ? null : example.id)}
                            className={`px-3 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                            isPracticing ?
                            'bg-rose-600 text-white border-rose-600 shadow-xs' :
                            'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100'}`
                            }
                            title={l("Practicar pronunciación con micrófono en tiempo real")}>
                            
                                <Mic className="w-4 h-4" />
                                <span>
                                  {l(isPracticing ? 'Ocultar' : 'Grabar Voz')}
                                </span>
                              </button>
                            </div>
                          </div>

                          {l(isPracticing &&
                      <div className="pt-3 border-t border-rose-100 dark:border-rose-900 animate-fadeIn">
                              <PronunciationCoach
                          targetSentence={example.english}
                          translation={nativeLanguage === 'en' ? '' : l(example.spanish)}
                          audioText={example.audioText} />
                        
                            </div>)
                      }
                        </div>);

                }))}
                  </div>
                </div>)
            }

              {/* 3. Dedicated Pronunciation Studio Tab */}
              {l(activeTab === 'pronunciation' &&
            <div className="space-y-6">
                  <div className="bg-gradient-to-r from-rose-900 to-indigo-900 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/30 border border-rose-400/40 text-xs font-semibold text-rose-200">
                          <Mic className="w-3.5 h-3.5 text-rose-300 animate-pulse" />
                          <span>{l("Reconocimiento Vocal Web Speech API")}</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">{l("Entrenador Oral: ")}
                      {l(tense.name)}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-200 max-w-xl">{l("Compara tu pronunciación en tiempo real contra hablantes nativos. Recibe porcentaje de precisión exacto y retroalimentación palabra por palabra. ")}

                    </p>
                      </div>

                      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-white/20 text-xs">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>{l("Gana ")}<strong>{l("+15 XP")}</strong>{l(" al lograr más del 70% de precisión")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sentence Carousel Selector */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{l("Selecciona una frase de ")}
                    {l(tense.name)}{l(" para practicar (")}{l(pronunciationIndex + 1)}{l(" de ")}{l(tense.examples.length)}):
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                      type="button"
                      disabled={pronunciationIndex === 0}
                      onClick={() => setPronunciationIndex((prev) => Math.max(0, prev - 1))}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      title={l("Frase anterior")}>
                      
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                      type="button"
                      disabled={pronunciationIndex === tense.examples.length - 1}
                      onClick={() => setPronunciationIndex((prev) => Math.min(tense.examples.length - 1, prev + 1))}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      title={l("Frase siguiente")}>
                      
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {l(tense.examples.map((ex, idx) =>
                  <button
                    key={ex.id}
                    onClick={() => setPronunciationIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all cursor-pointer border ${
                    pronunciationIndex === idx ?
                    'bg-rose-600 text-white border-rose-600 shadow-2xs font-semibold' :
                    'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-rose-300 hover:bg-rose-50/50'}`
                    }>{l("Frase ")}

                    {l(idx + 1)}
                        </button>
                  ))}
                    </div>
                  </div>

                  {l(tense.examples[pronunciationIndex] &&
              <PronunciationCoach
                targetSentence={tense.examples[pronunciationIndex].english}
                translation={nativeLanguage === 'en' ? '' : l(tense.examples[pronunciationIndex].spanish)}
                audioText={tense.examples[pronunciationIndex].audioText} />)

              }
                </div>)
            }

              {/* 4. Video Lesson Tab */}
              {l(activeTab === 'video' &&
            <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-950 dark:text-amber-200">
                    <div className="flex items-start gap-2.5">
                      <div className="p-1 rounded bg-red-600 text-white font-bold text-[10px] shrink-0 mt-0.5">{l("YouTube ")}

                  </div>
                      <div>
                        <span className="font-bold block">{l("¿El video dice \"No disponible\" en el recuadro?")}</span>
                        <span className="text-[11px] text-amber-800 dark:text-amber-300">{l("Si tu navegador bloquea la reproducción embebida, pulsa ")}
                      <strong>{l("\"▶️ Abrir Video en YouTube\"")}</strong>{l(" para verlo directamente. ")}
                    </span>
                      </div>
                    </div>
                    <a
                  href={`https://www.youtube.com/watch?v=${tense.videoLesson.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-transform hover:scale-[1.02] cursor-pointer shrink-0">
                  
                      <span>{l("▶️ Abrir Video en YouTube")}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Video Player */}
                  <div className="aspect-16/9 w-full rounded-2xl overflow-hidden shadow-lg border-2 border-slate-200 dark:border-slate-800 bg-black relative">
                    <iframe
                  src={`https://www.youtube.com/embed/${tense.videoLesson.youtubeId}?rel=0&modestbranding=1&enablejsapi=1`}
                  title={l(tense.videoLesson.title)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full border-0" />
                
                  </div>

                  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{l("Instructor: ")}
                    {l(tense.videoLesson.instructor)}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        {l(tense.videoLesson.duration)}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">
                      {l(tense.videoLesson.title)}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {l(tense.videoLesson.summary)}
                    </p>
                  </div>
                </div>)
            }

              {/* 5. Interactive Practice Tab */}
              {l(activeTab === 'practice' &&
            <div className="space-y-4">
                  {/* Level Selector Toolbar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{l("Nivel de Dificultad: ")}

                  </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        ({l(activeExercises.length)}{l(" ejercicios activos) ")}
                  </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                    onClick={() => handleSelectDifficultyFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    exerciseDifficultyFilter === 'all' ?
                    'bg-indigo-600 text-white shadow-xs font-bold' :
                    'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-300'}`
                    }>{l("🎯 Todos (")}

                    {l(tense.exercises.length)})
                      </button>

                      {l(basicCount > 0 &&
                  <button
                    onClick={() => handleSelectDifficultyFilter('basic')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    exerciseDifficultyFilter === 'basic' ?
                    'bg-emerald-600 text-white shadow-xs font-bold' :
                    'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 hover:border-emerald-300'}`
                    }>{l("🟢 Básico (")}

                    {l(basicCount)})
                        </button>)
                  }

                      {l(intermediateCount > 0 &&
                  <button
                    onClick={() => handleSelectDifficultyFilter('intermediate')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    exerciseDifficultyFilter === 'intermediate' ?
                    'bg-blue-600 text-white shadow-xs font-bold' :
                    'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-blue-700 dark:text-blue-400 hover:border-blue-300'}`
                    }>{l("🔵 Intermedio (")}

                    {l(intermediateCount)})
                        </button>)
                  }

                      {l(advancedCount > 0 &&
                  <button
                    onClick={() => handleSelectDifficultyFilter('advanced')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    exerciseDifficultyFilter === 'advanced' ?
                    'bg-purple-600 text-white shadow-xs font-bold' :
                    'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-purple-700 dark:text-purple-400 hover:border-purple-300'}`
                    }>{l("🟣 Avanzado (")}

                    {l(advancedCount)})
                        </button>)
                  }

                      {l(expertCount > 0 &&
                  <button
                    onClick={() => handleSelectDifficultyFilter('expert')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    exerciseDifficultyFilter === 'expert' ?
                    'bg-rose-600 text-white shadow-xs font-bold ring-2 ring-rose-400/30' :
                    'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-rose-700 dark:text-rose-400 hover:border-rose-300'}`
                    }>
                    
                          <span>{l("🔥 Experto")}</span>
                          <span className="opacity-80">({l(expertCount)})</span>
                        </button>)
                  }
                    </div>
                  </div>

                  {l(exerciseDifficultyFilter === 'expert' && !isPracticeComplete &&
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-800 dark:text-rose-200">
                      <Sparkles className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                      <span>
                        <strong>{l("Nivel Experto C1/C2:")}</strong>{l(" Oraciones complejas con estructuras condicionales (Zero, First, Second, Third, Mixed) y construcciones en voz pasiva. ")}
                </span>
                    </div>)
              }

                  {l(!isPracticeComplete && activeExercises[currentExerciseIndex] ?
              <InteractiveExercise
                exercise={activeExercises[currentExerciseIndex]}
                exerciseIndex={currentExerciseIndex}
                totalExercises={activeExercises.length}
                onAnswerSubmit={handleAnswerSubmit}
                onNext={handleNextExercise}
                isLast={currentExerciseIndex === activeExercises.length - 1} /> :

              !isPracticeComplete ?
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm text-slate-500">{l("No hay ejercicios disponibles en este nivel específico. Prueba con \"Todos\". ")}

              </div> :

              <div className="text-center py-8 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs space-y-4">
                      <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                        <Trophy className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">{l("¡Taller completado con éxito! ")}

                </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">{l("Has respondido correctamente a ")}
                  <strong>{l(correctCount)}{l(" de ")}{l(activeExercises.length)}</strong>{l(" ejercicios ")}{l(exerciseDifficultyFilter !== 'all' ? `en nivel ${exerciseDifficultyFilter === 'basic' ? 'Básico' : exerciseDifficultyFilter === 'intermediate' ? 'Intermedio' : exerciseDifficultyFilter === 'advanced' ? 'Avanzado' : 'Experto'}` : 'en este tiempo verbal')}{l(". Tu progreso se ha guardado en tu panel personal. ")}
                </p>
                      <div className="pt-4 flex items-center justify-center gap-3">
                        <button
                    onClick={handleRestartPractice}
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer">
                    
                          <RotateCcw className="w-4 h-4" />
                          <span>{l("Repetir taller")}</span>
                        </button>
                        <button
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer">
                    
                          <span>{l("Volver al menú de tiempos")}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>)
              }
                </div>)
            }

              {/* 6. Common Mistakes Tab */}
              {l(activeTab === 'mistakes' &&
            <div className="space-y-4">
                  <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-900 dark:text-amber-200">{l("Evita estos tropiezos habituales provocados por la traducción literal del español al inglés: ")}

              </div>

                  <div className="space-y-3">
                    {l(tense.commonMistakes.map((mistake, idx) =>
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 shadow-2xs">
                  
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 rounded-lg border border-red-200 dark:border-red-900">
                            <span className="font-bold block text-red-700 dark:text-red-400 mb-0.5">{l("❌ Error común: ")}

                      </span>
                            <span className="font-mono">{mistake.wrong}</span>
                          </div>
                          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 rounded-lg border border-emerald-200 dark:border-emerald-900">
                            <span className="font-bold block text-emerald-700 dark:text-emerald-400 mb-0.5">{l("✅ Forma correcta: ")}

                      </span>
                            <span className="font-mono">{mistake.correct}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 pt-1">
                          <strong>{l("¿Por qué?:")}</strong> {l(mistake.why)}
                        </p>
                      </div>
                ))}
                  </div>
                </div>)
            }

            </div>
          </div>
        </div>))
      }

    </div>);

};
