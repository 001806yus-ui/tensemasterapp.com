import React, { useState, useMemo } from 'react';
import { analyzeEnglishText, SAMPLE_TEXTS } from '../utils/textAnalyzer';
import { AnalyzedTenseToken, TextAnalysisResult, TenseGroup, TenseAspect } from '../types';
import { playEnglishAudio } from '../utils/speech';
import { sounds } from '../utils/soundEffects';
import { ALL_12_TENSES } from '../data/tensesData';
import {
  Sparkles,
  FileText,
  Volume2,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Info,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  Eye,
  Maximize2,
  Minimize2,
  Type,
  Sliders,
  Filter,
  Tag,
  Share2,
  Bookmark
} from 'lucide-react';

interface TextAnalyzerViewProps {
  onOpenTenseDetail?: (tenseId: string) => void;
}

type ReaderTheme = 'sepia' | 'dark' | 'light' | 'mint';
type ReaderFontSize = 'sm' | 'base' | 'lg' | 'xl';
type ReaderFontFamily = 'serif' | 'sans' | 'mono';
type ReaderHighlightFilter = 'all' | TenseGroup | TenseAspect;
type ReaderAnnotationStyle = 'pill' | 'badge' | 'underline';

export const TextAnalyzerView: React.FC<TextAnalyzerViewProps> = ({ onOpenTenseDetail }) => {
  const [inputText, setInputText] = useState(SAMPLE_TEXTS[0].text);
  const [selectedToken, setSelectedToken] = useState<AnalyzedTenseToken | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);

  // Reading Mode State
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [readerTheme, setReaderTheme] = useState<ReaderTheme>('sepia');
  const [readerFontSize, setReaderFontSize] = useState<ReaderFontSize>('lg');
  const [readerFontFamily, setReaderFontFamily] = useState<ReaderFontFamily>('serif');
  const [readerFilter, setReaderFilter] = useState<ReaderHighlightFilter>('all');
  const [readerAnnotationStyle, setReaderAnnotationStyle] = useState<ReaderAnnotationStyle>('badge');
  const [showInspectorPopover, setShowInspectorPopover] = useState(true);

  // Analyze text
  const analysisResult: TextAnalysisResult = useMemo(() => {
    return analyzeEnglishText(inputText);
  }, [inputText]);

  // Estimated reading time (average 180 words per minute for English learners)
  const readingTimeMinutes = Math.max(1, Math.ceil(analysisResult.totalWords / 180));

  const handleCopy = () => {
    sounds.playClick();
    navigator.clipboard.writeText(inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlayAudio = async (textToPlay?: string) => {
    const target = textToPlay || inputText;
    if (!target.trim()) return;
    sounds.playClick();
    setIsPlayingAudio(true);
    await playEnglishAudio(target, audioSpeed);
    setIsPlayingAudio(false);
  };

  const getTenseColor = (tenseId: string, group?: TenseGroup) => {
    if (tenseId.includes('present') || group === 'present') {
      return {
        pill: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
        badge: 'bg-emerald-600 text-white',
        border: 'border-b-2 border-emerald-500 text-emerald-900 dark:text-emerald-200'
      };
    }
    if (tenseId.includes('past') || group === 'past') {
      return {
        pill: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700',
        badge: 'bg-indigo-600 text-white',
        border: 'border-b-2 border-indigo-500 text-indigo-900 dark:text-indigo-200'
      };
    }
    return {
      pill: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700',
      badge: 'bg-amber-600 text-white',
      border: 'border-b-2 border-amber-500 text-amber-900 dark:text-amber-200'
    };
  };

  const isTokenMatchingFilter = (token: AnalyzedTenseToken) => {
    if (readerFilter === 'all') return true;
    if (readerFilter === 'present' || readerFilter === 'past' || readerFilter === 'future') {
      return token.group === readerFilter;
    }
    return token.aspect === readerFilter;
  };

  // Render reading mode text with active tense highlights & inline badges
  const renderReadingText = () => {
    if (!analysisResult.analyzedTokens.length) {
      return (
        <p className="whitespace-pre-line leading-relaxed font-serif text-lg opacity-80">
          {inputText || 'No hay texto pegado aún. Pega un texto arriba para comenzar.'}
        </p>
      );
    }

    const segments: React.ReactNode[] = [];
    let lastIndex = 0;

    analysisResult.analyzedTokens.forEach((token) => {
      // Normal plain text before this token
      if (token.startIndex > lastIndex) {
        segments.push(
          <span key={`text-${lastIndex}`}>
            {inputText.slice(lastIndex, token.startIndex)}
          </span>
        );
      }

      const isFilteredIn = isTokenMatchingFilter(token);
      const isSelected = selectedToken?.id === token.id;
      const colors = getTenseColor(token.tenseId, token.group);

      if (isFilteredIn) {
        segments.push(
          <span
            key={token.id}
            className="relative inline-block my-0.5 mx-0.5 group align-baseline"
          >
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setSelectedToken(token);
              }}
              className={`inline-flex items-center gap-1 transition-all rounded-md px-1 py-0.5 font-bold cursor-pointer ${
                readerAnnotationStyle === 'pill'
                  ? `${colors.pill} shadow-2xs hover:scale-105`
                  : readerAnnotationStyle === 'badge'
                  ? `${colors.pill} border shadow-2xs hover:scale-105`
                  : `${colors.border} hover:bg-slate-200/40 dark:hover:bg-slate-800/60`
              } ${isSelected ? 'ring-2 ring-indigo-500 shadow-md scale-105' : ''}`}
            >
              <span>{token.matchedText}</span>
              {readerAnnotationStyle === 'badge' && (
                <span
                  className={`text-[9px] font-sans font-extrabold uppercase px-1 py-0.2 rounded-xs tracking-tighter ${colors.badge}`}
                >
                  {token.tenseName.split(' ')[0]}
                </span>
              )}
            </button>
          </span>
        );
      } else {
        // Render without heavy highlight if filtered out
        segments.push(
          <span key={`fout-${token.id}`} className="opacity-80">
            {token.matchedText}
          </span>
        );
      }

      lastIndex = token.endIndex;
    });

    if (lastIndex < inputText.length) {
      segments.push(
        <span key={`tail-${lastIndex}`}>{inputText.slice(lastIndex)}</span>
      );
    }

    return (
      <div className="whitespace-pre-line leading-loose transition-all selection:bg-amber-200 selection:text-slate-900">
        {segments}
      </div>
    );
  };

  // Render normal editor interactive text
  const renderInteractiveText = () => {
    if (!analysisResult.analyzedTokens.length) {
      return <p className="whitespace-pre-line leading-relaxed">{inputText}</p>;
    }

    const segments: React.ReactNode[] = [];
    let lastIndex = 0;

    analysisResult.analyzedTokens.forEach((token) => {
      if (token.startIndex > lastIndex) {
        segments.push(
          <span key={`text-${lastIndex}`}>
            {inputText.slice(lastIndex, token.startIndex)}
          </span>
        );
      }

      const colors = getTenseColor(token.tenseId);
      const isSelected = selectedToken?.id === token.id;

      segments.push(
        <button
          key={token.id}
          type="button"
          onClick={() => {
            sounds.playClick();
            setSelectedToken(token);
          }}
          className={`inline-block px-1.5 py-0.5 mx-0.5 rounded-md border font-bold text-xs sm:text-sm cursor-pointer transition-all hover:scale-105 ${colors.pill} ${
            isSelected ? 'ring-2 ring-indigo-500 shadow-md scale-105' : ''
          }`}
          title={`${token.tenseName} · Haz clic para ver detalles`}
        >
          {token.matchedText}
        </button>
      );

      lastIndex = token.endIndex;
    });

    if (lastIndex < inputText.length) {
      segments.push(
        <span key={`text-${lastIndex}`}>{inputText.slice(lastIndex)}</span>
      );
    }

    return <div className="whitespace-pre-line leading-relaxed text-sm sm:text-base">{segments}</div>;
  };

  // Theme styling for reading mode
  const getThemeClasses = () => {
    switch (readerTheme) {
      case 'sepia':
        return 'bg-[#fcf8ed] text-[#2c2214] border-[#eedeb8] selection:bg-amber-200';
      case 'dark':
        return 'bg-[#0f172a] text-[#f1f5f9] border-[#1e293b] selection:bg-indigo-600';
      case 'mint':
        return 'bg-[#f0fdf4] text-[#052e16] border-[#bbf7d0] selection:bg-emerald-200';
      case 'light':
      default:
        return 'bg-white text-slate-900 border-slate-200 selection:bg-indigo-100';
    }
  };

  const getFontSizeClasses = () => {
    switch (readerFontSize) {
      case 'sm':
        return 'text-sm sm:text-base';
      case 'lg':
        return 'text-lg sm:text-xl';
      case 'xl':
        return 'text-xl sm:text-2xl';
      case 'base':
      default:
        return 'text-base sm:text-lg';
    }
  };

  const getFontFamilyClasses = () => {
    switch (readerFontFamily) {
      case 'serif':
        return 'font-serif';
      case 'mono':
        return 'font-mono';
      case 'sans':
      default:
        return 'font-sans';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden border border-teal-800/50">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                Detector & Desglose Gramatical Instantáneo
              </span>
              <span className="text-xs text-teal-200">
                Identifica los 12 tiempos en cualquier texto
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-serif tracking-tight text-white">
              Analizador de Textos & Modo de Lectura
            </h1>
            <p className="text-sm sm:text-base text-teal-100/90 mt-2 max-w-2xl">
              Pega cualquier email, artículo o historia. El motor sintáctico detecta automáticamente cada uno de los 12 tiempos verbales y te permite leer con resaltado interactivo y análisis pedagógico.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                setIsReadingMode(!isReadingMode);
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all shadow-lg ${
                isReadingMode
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 ring-2 ring-amber-300'
                  : 'bg-teal-500 hover:bg-teal-400 text-slate-950'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{isReadingMode ? 'Salir de Modo Lectura' : '📖 Abrir Modo de Lectura'}</span>
            </button>

            <button
              onClick={() => handlePlayAudio()}
              disabled={isPlayingAudio || !inputText.trim()}
              className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-teal-200 border border-teal-600/40 font-semibold text-xs sm:text-sm rounded-xl transition-transform active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-40"
            >
              <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce text-teal-300' : ''}`} />
              <span>{isPlayingAudio ? 'Reproduciendo...' : 'Escuchar Audio'}</span>
            </button>
          </div>
        </div>

        {/* Quick Summary Pill Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-teal-800/60 text-xs">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-300" />
            <span className="text-teal-100 font-semibold">{analysisResult.totalWords} palabras</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-300" />
            <span className="text-teal-100 font-semibold">{analysisResult.analyzedTokens.length} estructuras verbales</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-300" />
            <span className="text-teal-100 font-semibold">Nivel CEFR {analysisResult.estimatedCEFR}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-300" />
            <span className="text-teal-100 font-semibold">{readingTimeMinutes} min de lectura</span>
          </div>
        </div>
      </div>

      {/* Preset Sample Loaders */}
      {!isReadingMode && (
        <div className="mb-6">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">
            Cargar textos de muestra para analizar:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {SAMPLE_TEXTS.map((sample) => (
              <button
                key={sample.id}
                onClick={() => {
                  sounds.playClick();
                  setInputText(sample.text);
                  setSelectedToken(null);
                }}
                className="px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>{sample.title}</span>
              </button>
            ))}
            <button
              onClick={() => {
                sounds.playClick();
                setInputText('');
                setSelectedToken(null);
              }}
              className="px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpiar</span>
            </button>
          </div>
        </div>
      )}

      {/* 
        ========================================================================
        MODO DE LECTURA INMERSIVO (READING MODE VIEW)
        ========================================================================
      */}
      {isReadingMode ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Reader Control Toolbar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
            {/* Filter by Tense Family */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Resaltar:
              </span>
              {[
                { id: 'all', label: 'Todos los 12' },
                { id: 'present', label: 'Presentes (4)' },
                { id: 'past', label: 'Pasados (4)' },
                { id: 'future', label: 'Futuros (4)' },
                { id: 'simple', label: 'Simples' },
                { id: 'continuous', label: 'Continuos' },
                { id: 'perfect', label: 'Perfectos' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    sounds.playClick();
                    setReaderFilter(f.id as ReaderHighlightFilter);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    readerFilter === f.id
                      ? 'bg-indigo-600 text-white shadow-xs font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Customization Controls: Font size, style, theme */}
            <div className="flex items-center gap-3 flex-wrap text-xs">
              {/* Highlight Style */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setReaderAnnotationStyle('badge')}
                  className={`px-2 py-1 rounded-lg cursor-pointer ${
                    readerAnnotationStyle === 'badge' ? 'bg-white dark:bg-slate-700 font-bold shadow-xs' : 'text-slate-500'
                  }`}
                  title="Resaltado con etiqueta de tiempo"
                >
                  🏷️ Etiquetas
                </button>
                <button
                  onClick={() => setReaderAnnotationStyle('pill')}
                  className={`px-2 py-1 rounded-lg cursor-pointer ${
                    readerAnnotationStyle === 'pill' ? 'bg-white dark:bg-slate-700 font-bold shadow-xs' : 'text-slate-500'
                  }`}
                  title="Resaltador suave"
                >
                  🎨 Color
                </button>
                <button
                  onClick={() => setReaderAnnotationStyle('underline')}
                  className={`px-2 py-1 rounded-lg cursor-pointer ${
                    readerAnnotationStyle === 'underline' ? 'bg-white dark:bg-slate-700 font-bold shadow-xs' : 'text-slate-500'
                  }`}
                  title="Subrayado sutil"
                >
                  ✏️ Subrayado
                </button>
              </div>

              {/* Font Size */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setReaderFontSize('sm')}
                  className={`px-2 py-1 rounded-lg text-xs cursor-pointer ${readerFontSize === 'sm' ? 'bg-white dark:bg-slate-700 font-bold shadow-xs' : 'text-slate-500'}`}
                >
                  A-
                </button>
                <button
                  onClick={() => setReaderFontSize('base')}
                  className={`px-2 py-1 rounded-lg text-xs cursor-pointer ${readerFontSize === 'base' ? 'bg-white dark:bg-slate-700 font-bold shadow-xs' : 'text-slate-500'}`}
                >
                  A
                </button>
                <button
                  onClick={() => setReaderFontSize('lg')}
                  className={`px-2 py-1 rounded-lg text-xs cursor-pointer ${readerFontSize === 'lg' ? 'bg-white dark:bg-slate-700 font-bold shadow-xs' : 'text-slate-500'}`}
                >
                  A+
                </button>
                <button
                  onClick={() => setReaderFontSize('xl')}
                  className={`px-2 py-1 rounded-lg text-xs cursor-pointer ${readerFontSize === 'xl' ? 'bg-white dark:bg-slate-700 font-bold shadow-xs' : 'text-slate-500'}`}
                >
                  A++
                </button>
              </div>

              {/* Theme Selector */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setReaderTheme('sepia')}
                  className={`w-6 h-6 rounded-lg bg-[#fcf8ed] border border-amber-300 cursor-pointer ${readerTheme === 'sepia' ? 'ring-2 ring-indigo-500' : ''}`}
                  title="Papel Sepia Cálido"
                />
                <button
                  onClick={() => setReaderTheme('light')}
                  className={`w-6 h-6 rounded-lg bg-white border border-slate-300 cursor-pointer ${readerTheme === 'light' ? 'ring-2 ring-indigo-500' : ''}`}
                  title="Blanco Puro"
                />
                <button
                  onClick={() => setReaderTheme('dark')}
                  className={`w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 cursor-pointer ${readerTheme === 'dark' ? 'ring-2 ring-indigo-500' : ''}`}
                  title="Noche Zen"
                />
                <button
                  onClick={() => setReaderTheme('mint')}
                  className={`w-6 h-6 rounded-lg bg-[#f0fdf4] border border-emerald-300 cursor-pointer ${readerTheme === 'mint' ? 'ring-2 ring-indigo-500' : ''}`}
                  title="Menta Relajante"
                />
              </div>

              {/* Close reading mode */}
              <button
                onClick={() => setIsReadingMode(false)}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-semibold rounded-xl cursor-pointer"
              >
                Volver al Editor
              </button>
            </div>
          </div>

          {/* Reader Document Container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Main Reading Sheet */}
            <div
              className={`lg:col-span-8 rounded-3xl border p-8 sm:p-14 shadow-lg transition-colors ${getThemeClasses()}`}
            >
              {/* Document Header info */}
              <div className="pb-6 mb-8 border-b border-current/15 flex items-center justify-between text-xs opacity-75">
                <div className="flex items-center gap-3">
                  <span>📖 Modo de Lectura Activo</span>
                  <span>·</span>
                  <span>{analysisResult.analyzedTokens.length} estructuras resaltadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePlayAudio()}
                    disabled={isPlayingAudio}
                    className="flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isPlayingAudio ? 'Escuchando' : 'Escuchar todo'}</span>
                  </button>
                </div>
              </div>

              {/* Reader Body */}
              <article
                className={`${getFontSizeClasses()} ${getFontFamilyClasses()} tracking-normal text-justify max-w-none`}
              >
                {renderReadingText()}
              </article>
            </div>

            {/* Right Inspector Popover during Reading Mode */}
            <div className="lg:col-span-4 space-y-4 sticky top-6">
              {selectedToken ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-indigo-500 dark:border-indigo-500 p-6 shadow-xl relative animate-in fade-in duration-150">
                  <button
                    onClick={() => setSelectedToken(null)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-mono">
                      Nivel {selectedToken.cefrLevel}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {selectedToken.aspect}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
                    {selectedToken.tenseName}
                  </h4>
                  <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    {selectedToken.spanishName}
                  </p>

                  <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] font-bold text-slate-500 block mb-1">
                      Verbo / Estructura en el Texto:
                    </span>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-sm font-bold text-indigo-700 dark:text-indigo-300">
                        "{selectedToken.matchedText}"
                      </span>
                      <button
                        onClick={() => handlePlayAudio(selectedToken.matchedText)}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-600 hover:text-white dark:bg-indigo-950 dark:hover:bg-indigo-800 rounded-lg text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                        title="Escuchar pronunciación"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Escuchar</span>
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-2">
                      Fórmula: <code className="text-indigo-600 dark:text-indigo-400 font-bold">{selectedToken.formula}</code>
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                    {selectedToken.explanation}
                  </p>

                  {onOpenTenseDetail && (
                    <button
                      onClick={() => onOpenTenseDetail(selectedToken.tenseId)}
                      className="mt-4 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Abrir lección completa de este tiempo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 text-center text-slate-500 space-y-3">
                  <BookOpen className="w-8 h-8 text-indigo-500 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Inspector en Lectura
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Toca o haz clic sobre cualquier verbo o estructura resaltada en el texto para ver su función gramatical, fórmula y pronunciación.
                  </p>
                </div>
              )}

              {/* Distribution in reading mode */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                  Estructuras detectadas ({analysisResult.analyzedTokens.length})
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {Object.entries(analysisResult.tensesFoundCounts).map(([name, count]) => (
                    <div key={name} className="flex justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800/60">
                      <span className="text-slate-700 dark:text-slate-300 font-medium truncate">{name}</span>
                      <span className="font-mono font-bold text-teal-600 dark:text-teal-400">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 
          ========================================================================
          MODO EDITOR Y ANALIZADOR (STANDARD GRID VIEW)
          ========================================================================
        */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Text Input & Live Interactive Highlight */}
          <div className="lg:col-span-7 space-y-6">
            {/* Textarea Input Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Tu texto en inglés:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setIsReadingMode(true);
                    }}
                    className="text-amber-600 dark:text-amber-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Pasar a Modo Lectura</span>
                  </button>
                  <span>·</span>
                  <button
                    onClick={handleCopy}
                    className="hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              <textarea
                rows={6}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setSelectedToken(null);
                }}
                placeholder="Escribe o pega aquí cualquier texto en inglés para analizar..."
                className="w-full p-3.5 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-sans leading-relaxed"
              />
            </div>

            {/* Interactive Colored Markup Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    Texto con Tiempos Verbales Interactivos
                  </h3>
                  <p className="text-xs text-slate-500">
                    Haz clic en cualquier estructura resaltada para ver su fórmula y explicación
                  </p>
                </div>

                {/* Legend */}
                <div className="hidden sm:flex items-center gap-2 text-[11px] font-semibold">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Presente
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Pasado
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Futuro
                  </span>
                </div>
              </div>

              {/* Formatted body */}
              <div className="p-4 bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 min-h-[160px] text-slate-800 dark:text-slate-200">
                {renderInteractiveText()}
              </div>
            </div>
          </div>

          {/* Right Column: Inspector Details & Pedagogical Metrics */}
          <div className="lg:col-span-5 space-y-6">
            {/* Active Token Inspector Card */}
            {selectedToken ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-indigo-500 dark:border-indigo-500 p-6 shadow-xl relative animate-in fade-in zoom-in duration-150">
                <button
                  onClick={() => setSelectedToken(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-mono">
                    Nivel CEFR {selectedToken.cefrLevel}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500">
                    {selectedToken.aspect}
                  </span>
                </div>

                <h4 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
                  {selectedToken.tenseName}
                </h4>
                <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                  {selectedToken.spanishName}
                </p>

                <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-slate-500 block mb-1">
                    Estructura Detectada:
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 inline-block">
                    "{selectedToken.matchedText}"
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-2">
                    Fórmula: <code className="text-indigo-600 dark:text-indigo-400 font-bold">{selectedToken.formula}</code>
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                  {selectedToken.explanation}
                </p>

                {onOpenTenseDetail && (
                  <button
                    onClick={() => onOpenTenseDetail(selectedToken.tenseId)}
                    className="mt-4 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Abrir lección completa de {selectedToken.spanishName}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-6 text-center text-slate-500 space-y-2">
                <Info className="w-8 h-8 text-teal-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Inspector Gramatical
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Haz clic en cualquier verbo resaltado a la izquierda para inspeccionar su fórmula, nivel CEFR y función oracional.
                </p>
              </div>
            )}

            {/* Breakdown Stats & Pedagogical Feedback */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                Desglose de Tiempos en este Texto
              </h4>

              {/* Distribution bars */}
              <div className="space-y-2.5">
                {Object.keys(analysisResult.tensesFoundCounts).length === 0 ? (
                  <p className="text-xs text-slate-400">No se detectaron tiempos verbales en el texto actual.</p>
                ) : (
                  Object.entries(analysisResult.tensesFoundCounts).map(([tenseName, count]) => {
                    const percent = Math.round(
                      (count / analysisResult.analyzedTokens.length) * 100
                    );
                    return (
                      <div key={tenseName} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {tenseName}
                          </span>
                          <span className="font-mono text-slate-500">
                            {count} ({percent}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-teal-500 h-full rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Pedagogical Tips Box */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  💡 Diagnóstico & Consejos del Profesor:
                </span>
                <div className="space-y-1.5">
                  {analysisResult.feedbackTips.map((tip, idx) => (
                    <p key={idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {tip}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
