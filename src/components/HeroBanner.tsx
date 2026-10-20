import { useLocalization } from "../i18n/LocalizationContext";
import React, { useMemo, useState } from 'react';
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
  ChevronDown,
  ChevronUp,
  RotateCcw,
  HelpCircle,
  Brain,
  Bot } from
'lucide-react';
import { TenseGroup, TenseAspect, TenseData } from '../types';
import { ALL_12_TENSES } from '../data/tensesData';
import { getAdaptiveLearningRecommendation } from '../utils/adaptiveLearningPath';
import { TENSE_LOCALIZED_NAMES, SUPPORTED_LANGUAGES } from '../i18n/translations';
import { InteractiveSituationalCard } from './InteractiveSituationalCard';

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
  onOpenTutor?: (prompt?: string) => void;
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
  onOpenWelcomeTutorial,
  onOpenTutor
}) => {const { l } = useLocalization();
  const { isPro, t, progressState, diagnosticResult, weakTenses, ownerConfig, nativeLanguage } = useUser();
  const [showSituationalDemo, setShowSituationalDemo] = useState(true);

  // Compute the Adaptive Learning Recommendation based on diagnostic test & past practice
  const adaptivePath = useMemo(() => {
    return getAdaptiveLearningRecommendation(
      progressState.tenseProgress,
      diagnosticResult,
      weakTenses,
      nativeLanguage
    );
  }, [progressState.tenseProgress, diagnosticResult, weakTenses, nativeLanguage]);

  const recommended = adaptivePath.recommendedTense;

  const isEn = nativeLanguage === 'en';

  return (
    <div className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Heading, Value Proposition & Subscription Info */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{l(t.heroKicker)}</span>
                <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">·</span>
                <span className="text-slate-500 dark:text-slate-400 normal-case font-normal">{l(t.heroFastMethod || 'Método acelerado anti-bloqueo')}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                {l(t.heroTitle)} <span className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-200 dark:decoration-indigo-800 decoration-4 underline-offset-4">{l(t.heroTitleHighlight)}</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                {l(t.heroSubtitle)}
              </p>

              {/* Feature checklist */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{l(t.heroAudioCheck)}</span>
                </div>
                <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">·</span>
                <div className="flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>{l(t.heroVideoCheck)}</span>
                </div>
                <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">·</span>
                <div className="flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{l(t.heroCertCheck)}</span>
                </div>
                <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">·</span>
                <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
                  <span>🌐</span>
                  <span>{l(t.hero12Langs || '12 Idiomas')}</span>
                </div>
                {l(onOpenWelcomeTutorial &&
                <>
                    <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">·</span>
                    <button
                    onClick={onOpenWelcomeTutorial}
                    className="inline-flex items-center gap-1 text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-white font-semibold underline underline-offset-2 transition-colors cursor-pointer"
                    title={l(t.heroGuide || 'Guía de Inicio')}>
                    
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{l(t.heroGuide || 'Guía de Inicio')}</span>
                    </button>
                  </>)
                }
              </div>
            </div>

            {/* Subscription banner highlight */}
            <div className="pt-1">
              {l(!isPro ?
              <div className="p-4 bg-slate-50 dark:bg-slate-850/80 border border-slate-200/80 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-slate-900 dark:text-white font-semibold text-sm">
                      <span>{l(t.heroTotalPass || l('All-Access Pass'))}</span>
                      <span className="text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                        {l("US$5.99/mo")}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {l("All 12 tenses included in one subscription — US$5.99/month. No separate charge per lesson.")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                    onClick={onOpenSubscription}
                    className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl whitespace-nowrap cursor-pointer transition-all shadow-sm active:scale-95">
                    
                      {l(t.heroSubBtn || l('Get All-Access Pass'))}
                    </button>
                  </div>
                </div> :

              <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{l('You have active')} <strong>{l(t.btnProActive || l('Pro Pass'))}</strong>. {l('All 12 tenses and learning resources are unlocked.')}</span>
                </div>)
              }
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
                      <span>{l('Recommended Learning Path')}</span>
                    </h2>
                    <span className="text-[11px] text-slate-400 block">
                      {l(adaptivePath.hasDiagnostic ? l("Calibrated with Diagnostic ({{0}})", [

                      diagnosticResult?.cefrLevel?.split(' - ')[0] || 'Active Level']) : l(

                        'Smart suggestion for your level'))}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-mono font-medium text-indigo-300">
                  {l(adaptivePath.badgeLabel)}
                </span>
              </div>

              {/* Spotlight Center: Recommended Tense Overview */}
              <div className="space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block">
                      {l('Next Lesson')}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight flex items-center gap-2 mt-0.5">
                      <span>{l(recommended.name)}</span>
                      <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {l(recommended.cefrLevel)}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {l(isEn ? recommended.tagline : TENSE_LOCALIZED_NAMES[recommended.id]?.[nativeLanguage]?.name || recommended.spanishName)} · {l(recommended.aspect)}
                    </p>
                  </div>

                  {/* Formula Preview Box */}
                  <div className="bg-slate-850 border border-slate-800 rounded-lg p-2.5 text-right shrink-0">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">
                      {l('Affirmative Formula')}
                    </span>
                    <code className="text-xs font-mono font-semibold text-amber-300 block truncate max-w-[200px]">
                      {l(recommended.formula.affirmative).split('(+')[0]}
                    </code>
                  </div>
                </div>

                {/* Explainable Pedagogical Reason Box */}
                <div className="p-3 bg-slate-850/80 border border-slate-800 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                    <Target className="w-3.5 h-3.5" />
                    <span>{l(adaptivePath.reasonTitle)}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {l(adaptivePath.reasonDescription)}
                  </p>
                </div>

                {/* Progress bar if user has already started */}
                {l(adaptivePath.progress && adaptivePath.progress.exercisesDone > 0 &&
                <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>{l('Lesson Progress:')}</span>
                      <span className="font-mono text-white">
                        {l(adaptivePath.progress.exercisesDone)}/{l(adaptivePath.progress.totalExercises)} {l('exercises')} ({l(adaptivePath.completionRate)}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${adaptivePath.completionRate}%` }} />
                    
                    </div>
                  </div>)
                }
              </div>

              {/* Action Button */}
              <div>
                <button
                  onClick={() => {
                    if (onOpenTenseDetail) {
                      onOpenTenseDetail(recommended);
                    }
                  }}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  
                  <BookOpen className="w-4 h-4" />
                  <span>{l(t.enterTense)}: {l(isEn ? recommended.name : TENSE_LOCALIZED_NAMES[recommended.id]?.[nativeLanguage]?.name || recommended.spanishName)}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              {/* Bottom Footer: Upcoming in Queue & Diagnostic Test Calibrator */}
              <div className="border-t border-slate-800 pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                {/* Upcoming Sequence */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {l('Upcoming:')}
                  </span>
                  {l(adaptivePath.upcomingQueue.map((nextTense, idx) =>
                  <button
                    key={nextTense.id}
                    onClick={() => onOpenTenseDetail && onOpenTenseDetail(nextTense)}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                    title={l(isEn ? `View ${nextTense.name}` : `Ver ${nextTense.spanishName}`)}>
                    
                      <span className="font-mono text-indigo-400 text-[10px]">{l(idx + 1)}.</span>
                      <span>{l(nextTense.name)}</span>
                    </button>
                  ))}
                </div>

                {/* Diagnostic Test calibration shortcut */}
                {l(onOpenDiagnostic &&
                <div>
                    {l(!adaptivePath.hasDiagnostic ?
                  <button
                    onClick={onOpenDiagnostic}
                    className="text-amber-300 hover:text-amber-200 text-xs font-semibold flex items-center gap-1 cursor-pointer">
                    
                        <Zap className="w-3.5 h-3.5" />
                        <span>{l('Calibrate with Test (3 min)')}</span>
                      </button> :

                  <button
                    onClick={onOpenDiagnostic}
                    className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer text-[11px]">
                    
                        <RotateCcw className="w-3 h-3" />
                        <span>{l('Re-evaluate Level')}</span>
                      </button>)
                  }
                  </div>)
                }
              </div>

            </div>
          </div>
        </div>

        {/* INTERACTIVE SITUATIONAL DEMONSTRATION SECTION */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{l('Visual Method: Real-Life Daily Situations')}</span>
                  <span className="text-[10px] font-mono uppercase bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-bold">
                    {l('Interactive Demo')}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {l('The brain associates and anchors everyday situations to grammar in seconds.')}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowSituationalDemo(!showSituationalDemo)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer transition-colors">
              
              <span>{l(showSituationalDemo ? l('Hide Demo Card') : l('Try Demo Card'))}</span>
              {l(showSituationalDemo ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
            </button>
          </div>

          {l(showSituationalDemo &&
          <div className="animate-in fade-in duration-300">
              <InteractiveSituationalCard
              onStartTutorScenario={(prompt) => {
                if (onOpenTutor) onOpenTutor(prompt);
              }}
              onOpenTense={(id) => {
                if (onOpenTenseDetail) {
                  const found = ALL_12_TENSES.find((t) => t.id === id);
                  if (found) onOpenTenseDetail(found);
                }
              }}
              showTutorButton={Boolean(onOpenTutor)} />
            
            </div>)
          }
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={l(t.searchPlaceholder)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-750 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
            
            {l(searchQuery &&
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              
                {l(t.modalCancel || 'Limpiar')}
              </button>)
            }
          </div>

          {/* Group Segmented Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto">
            <button
              onClick={() => setSelectedGroup('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              selectedGroup === 'all' ?
              'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold' :
              'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`
              }>
              
              {l(t.filterAll)}
            </button>
            <button
              onClick={() => setSelectedGroup('present')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              selectedGroup === 'present' ?
              'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs font-semibold' :
              'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`
              }>
              
              {l(t.filterPresent)}
            </button>
            <button
              onClick={() => setSelectedGroup('past')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              selectedGroup === 'past' ?
              'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 shadow-xs font-semibold' :
              'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`
              }>
              
              {l(t.filterPast)}
            </button>
            <button
              onClick={() => setSelectedGroup('future')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              selectedGroup === 'future' ?
              'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs font-semibold' :
              'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`
              }>
              
              {l(t.filterFuture)}
            </button>
          </div>
        </div>
      </div>
    </div>);

};
