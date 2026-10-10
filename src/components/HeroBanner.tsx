import React, { useMemo } from 'react';
import { useUser } from '../context/UserContext';
import {
  Search,
  Sparkles,
  CheckCircle2,
  Volume2,
  Video,
  Trophy,
  Compass,
  ArrowRight,
  Target,
  Zap,
  BookOpen,
  Award,
  ChevronRight,
  RotateCcw,
  HelpCircle
} from 'lucide-react';
import { TenseGroup, TenseAspect, TenseData } from '../types';
import { getAdaptiveLearningRecommendation } from '../utils/adaptiveLearningPath';
import { TENSE_LOCALIZED_NAMES, SUPPORTED_LANGUAGES } from '../i18n/translations';

interface HeroBannerProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedGroup: 'all' | TenseGroup;
  setSelectedGroup: (g: 'all' | TenseGroup) => void;
  selectedAspect: 'all' | TenseAspect;
  setSelectedAspect: (a: 'all' | TenseAspect) => void;
  onOpenSubscription: () => void;
  onOpenTenseDetail?: (tense: TenseData) => void;
  onOpenDiagnostic?: () => void;
  onOpenWelcomeTutorial?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  setSearchQuery,
  selectedGroup,
  setSelectedGroup,
  selectedAspect,
  setSelectedAspect,
  onOpenSubscription,
  onOpenTenseDetail,
  onOpenDiagnostic,
  onOpenWelcomeTutorial
}) => {
  const { isPro, t, progressState, diagnosticResult, weakTenses, unlockOwnerAccess, ownerConfig, nativeLanguage } = useUser();

  // Compute the Adaptive Learning Recommendation based on diagnostic test & past practice
  const adaptivePath = useMemo(() => {
    return getAdaptiveLearningRecommendation(
      progressState.tenseProgress,
      diagnosticResult,
      weakTenses
    );
  }, [progressState.tenseProgress, diagnosticResult, weakTenses]);

  const recommended = adaptivePath.recommendedTense;

  return (
    <div className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Heading, Value Proposition & Subscription Info */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.heroKicker}</span>
                <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">·</span>
                <span className="text-slate-500 dark:text-slate-400 normal-case font-normal">Método acelerado anti-bloqueo</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                {t.heroTitle} <span className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-200 dark:decoration-indigo-800 decoration-4 underline-offset-4">{t.heroTitleHighlight}</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                {t.heroSubtitle}
              </p>

              {/* Feature checklist */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{t.heroAudioCheck}</span>
                </div>
                <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">·</span>
                <div className="flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>{t.heroVideoCheck}</span>
                </div>
                <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">·</span>
                <div className="flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{t.heroCertCheck}</span>
                </div>
                <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">·</span>
                <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
                  <span>🌐</span>
                  <span>12 Idiomas</span>
                </div>
                {onOpenWelcomeTutorial && (
                  <>
                    <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">·</span>
                    <button
                      onClick={onOpenWelcomeTutorial}
                      className="inline-flex items-center gap-1 text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-white font-semibold underline underline-offset-2 transition-colors cursor-pointer"
                      title="Abrir la guía visual rápida sobre cómo usar la plataforma"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Guía de Inicio</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Subscription banner highlight */}
            <div className="pt-1">
              {!isPro ? (
                <div className="p-4 bg-slate-50 dark:bg-slate-850/80 border border-slate-200/80 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-sm">
                      <span>{t.heroSubOffer ? t.heroSubOffer.split(' por ')[0] : 'Acceso total ilimitado'}</span>
                      <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200/60 dark:border-indigo-800/60">
                        {(SUPPORTED_LANGUAGES.find((l) => l.code === nativeLanguage) || SUPPORTED_LANGUAGES[0]).currencyEquiv}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {t.unlockedPreview} · Cancela en cualquier momento
                    </p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={unlockOwnerAccess}
                      title="Activar acceso total inmediato sin pagar (Modo Dueña / Creadora)"
                      className="px-3 py-2 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>👑 Acceso Dueña</span>
                    </button>
                    <button
                      onClick={onOpenSubscription}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer transition-colors shadow-xs"
                    >
                      {t.heroSubBtn || `Obtener Pase (${(SUPPORTED_LANGUAGES.find((l) => l.code === nativeLanguage) || SUPPORTED_LANGUAGES[0]).currencyEquiv})`}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Tienes activo el <strong>{t.btnProActive || 'Pase Total'}</strong>. Todos los 12 tiempos y recursos están desbloqueados.</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: ADAPTIVE LEARNING PATH SPOTLIGHT CARD */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="h-full bg-slate-900 dark:bg-slate-950 rounded-2xl p-6 text-white border border-slate-800 shadow-sm flex flex-col justify-between gap-5 relative overflow-hidden">
              
              {/* Card Header: Adaptive Engine Brand & Badge */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/20 flex items-center justify-center text-amber-300">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs sm:text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
                      <span>Ruta de Aprendizaje Recomendada</span>
                    </h2>
                    <span className="text-[11px] text-slate-400 block">
                      {adaptivePath.hasDiagnostic
                        ? `Calibrado con Test Inicial (${diagnosticResult?.cefrLevel?.split(' - ')[0] || 'Nivel Activo'})`
                        : 'Sugerencia inteligente para tu nivel'}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-mono font-medium text-indigo-300">
                  {adaptivePath.badgeLabel}
                </span>
              </div>

              {/* Spotlight Center: Recommended Tense Overview */}
              <div className="space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block">
                      Siguiente Lección
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight flex items-center gap-2 mt-0.5">
                      <span>{recommended.name}</span>
                      <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {recommended.cefrLevel}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {(TENSE_LOCALIZED_NAMES[recommended.id]?.[nativeLanguage]?.name || recommended.spanishName)} · {recommended.aspect}
                    </p>
                  </div>

                  {/* Formula Preview Box */}
                  <div className="bg-slate-850 border border-slate-800 rounded-lg p-2.5 text-right shrink-0">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Fórmula Afirmativa</span>
                    <code className="text-xs font-mono font-semibold text-amber-300 block truncate max-w-[200px]">
                      {recommended.formula.affirmative.split('(+')[0]}
                    </code>
                  </div>
                </div>

                {/* Explainable Pedagogical Reason Box */}
                <div className="p-3 bg-slate-850/80 border border-slate-800 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                    <Target className="w-3.5 h-3.5" />
                    <span>{adaptivePath.reasonTitle}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {adaptivePath.reasonDescription}
                  </p>
                </div>

                {/* Progress bar if user has already started */}
                {adaptivePath.progress && adaptivePath.progress.exercisesDone > 0 && (
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Progreso en esta lección:</span>
                      <span className="font-mono text-white">
                        {adaptivePath.progress.exercisesDone}/{adaptivePath.progress.totalExercises} ejercicios ({adaptivePath.completionRate}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${adaptivePath.completionRate}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div>
                <button
                  onClick={() => {
                    if (onOpenTenseDetail) {
                      onOpenTenseDetail(recommended);
                    }
                  }}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{t.enterTense}: {(TENSE_LOCALIZED_NAMES[recommended.id]?.[nativeLanguage]?.name || recommended.spanishName)}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              {/* Bottom Footer: Upcoming in Queue & Diagnostic Test Calibrator */}
              <div className="border-t border-slate-800 pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                {/* Upcoming Sequence */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Siguientes:
                  </span>
                  {adaptivePath.upcomingQueue.map((nextTense, idx) => (
                    <button
                      key={nextTense.id}
                      onClick={() => onOpenTenseDetail && onOpenTenseDetail(nextTense)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                      title={`Ver ${nextTense.spanishName}`}
                    >
                      <span className="font-mono text-indigo-400 text-[10px]">{idx + 1}.</span>
                      <span>{nextTense.name}</span>
                    </button>
                  ))}
                </div>

                {/* Diagnostic Test calibration shortcut */}
                {onOpenDiagnostic && (
                  <div>
                    {!adaptivePath.hasDiagnostic ? (
                      <button
                        onClick={onOpenDiagnostic}
                        className="text-amber-300 hover:text-amber-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Calibrar con Test (3 min)</span>
                      </button>
                    ) : (
                      <button
                        onClick={onOpenDiagnostic}
                        className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer text-[11px]"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Re-evaluar Nivel</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por tiempo, fórmula o ejemplo (ej. 'Present Perfect', 'Did', 'Will')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-750 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Group Segmented Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto">
            <button
              onClick={() => setSelectedGroup('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                selectedGroup === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Todos (12)
            </button>
            <button
              onClick={() => setSelectedGroup('present')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                selectedGroup === 'present'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Presente (4)
            </button>
            <button
              onClick={() => setSelectedGroup('past')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                selectedGroup === 'past'
                  ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Pasado (4)
            </button>
            <button
              onClick={() => setSelectedGroup('future')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                selectedGroup === 'future'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Futuro (4)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
