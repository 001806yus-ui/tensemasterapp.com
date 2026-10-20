import { useLocalization } from "../i18n/LocalizationContext";
import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { InteractiveSituationalCard } from './InteractiveSituationalCard';
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Bot,
  Brain,
  Target,
  BookOpen,
  Volume2,
  Video,
  Award,
  HelpCircle,
  ShieldCheck } from
'lucide-react';

export const TUTORIAL_STORAGE_KEY = 'tensemaster_has_seen_welcome_tutorial_v2';

interface WelcomeTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onStartDiagnostic: () => void;
  onExploreCatalog: () => void;
  onOpenTutor?: (starterPrompt?: string) => void;
  onOpenSubscription?: () => void;
  onOpenTense?: (tenseId: string) => void;
}

export const WelcomeTutorial: React.FC<WelcomeTutorialProps> = ({
  isOpen,
  onClose,
  onStartDiagnostic,
  onExploreCatalog,
  onOpenTutor,
  onOpenSubscription,
  onOpenTense
}) => {const { l } = useLocalization();
  const { nativeLanguage } = useUser();
  const isEn = nativeLanguage === 'en';
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState<'beginner' | 'intermediate'>('beginner');
  const [dontShowAgain, setDontShowAgain] = useState(true);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss();
      } else if (e.key === 'ArrowRight' && currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentStep > 0) {
        setCurrentStep((prev) => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep]);

  if (!isOpen) return null;

  const handleDismiss = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
      } catch (e) {


        // Safe fallback
      }}onClose();
  };

  const handleGoToTutor = (prompt?: string) => {
    try {
      localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
    } catch (e) {}
    onClose();
    if (onOpenTutor) {
      onOpenTutor(prompt);
    }
  };

  const handleFinishWithDiagnostic = () => {
    try {
      localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
    } catch (e) {}
    onClose();
    onStartDiagnostic();
  };

  const handleFinishWithCatalog = () => {
    try {
      localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
    } catch (e) {}
    onClose();
    onExploreCatalog();
  };

  const steps = [
  // Step 0: Visual Method
  {
    id: 'neuroscience_method',
    badge: l('Cognitive Visual Method'),
    badgeColor: 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300',
    title: l(
      'Learn with Real-Life Situations Your Brain Actually Remembers'),

    subtitle: l(
      'Cognitive science shows 90% of students forget abstract rules within 48 hours. Real-life situations and visual anchors stick in long-term memory.'),

    renderContent: () =>
    <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-center space-y-2">
              <span className="text-3xl block">🧠</span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {l('Instant Visual Anchoring')}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {l(
              'Connecting a real scene (a coffee shop, airport, or job interview) activates your visual cortex and boosts retention by 65%.')
            }
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60 text-center space-y-2">
              <span className="text-3xl block">🧭</span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {l('Guided Step-by-Step Practice')}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {l(
              'Practice conversational scenarios with prepared questions, suggested replies, hints, and clear grammar explanations.')
            }
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 text-center space-y-2">
              <span className="text-3xl block">🛡️</span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {l('All 12 Tenses Demystified')}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {l(
              'Crystal-clear mathematical formulas: Subject + Auxiliary + Verb. Multi-language translation support when you need it.')
            }
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              {l('What is your primary learning goal?')}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
            type="button"
            onClick={() => setSelectedGoal('beginner')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            selectedGoal === 'beginner' ?
            'border-emerald-500 bg-white dark:bg-slate-900 shadow-sm ring-2 ring-emerald-400/30' :
            'border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-850'}`
            }>
            
                <div className="flex items-center gap-2 mb-1">
                  <span>🌱</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {l('Build foundations from scratch')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {l(
                'Master basic tenses step-by-step with intuitive visual formulas and native audio.')
              }
                </p>
              </button>

              <button
            type="button"
            onClick={() => setSelectedGoal('intermediate')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            selectedGoal === 'intermediate' ?
            'border-indigo-500 bg-white dark:bg-slate-900 shadow-sm ring-2 ring-indigo-400/30' :
            'border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-850'}`
            }>
            
                <div className="flex items-center gap-2 mb-1">
                  <span>⚡</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {l('Unlock real speaking fluency')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {l(
                'Master past vs. present perfect nuances and speak with professional confidence.')
              }
                </p>
              </button>
            </div>
          </div>
        </div>

  },

  // Step 1: Demo card
  {
    id: 'interactive_demo_card',
    badge: l('Interactive Demonstration'),
    badgeColor: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950/70 dark:text-indigo-300',
    title: l('Try It Right Now: Situational Card'),
    subtitle: l(
      'Select everyday situations, listen to native high-definition audio, and test yourself with the interactive micro-quiz.'),

    renderContent: () =>
    <div className="space-y-3">
          <InteractiveSituationalCard
        onStartTutorScenario={(prompt) => handleGoToTutor(prompt)}
        onOpenTense={onOpenTense}
        showTutorButton={true} />
      
        </div>

  },

  // Step 2: Guided Practice
  {
    id: 'guided_practice_showcase',
    badge: l('Guided Practice'),
    badgeColor: 'bg-purple-100 text-purple-900 dark:bg-purple-950/70 dark:text-purple-300',
    title: l('Structured Practice for All 12 Tenses'),
    subtitle: l(
      'Practice prepared conversations, choose from suggested replies, and receive clear grammatical explanations step by step.'),

    renderContent: () =>
    <div className="space-y-4">
          <div className="p-4 sm:p-5 bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-950 text-white rounded-2xl border border-purple-800/60 shadow-lg space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/30 border border-purple-400/40 flex items-center justify-center text-amber-300 text-2xl shadow-inner">
                🧭
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold font-serif text-white flex items-center gap-2">
                  <span>{l('Guided English Practice')}</span>
                  <span className="text-[10px] font-mono bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-bold uppercase">
                    {l('All 12 Tenses')}
                  </span>
                </h4>
                <p className="text-xs text-purple-200">
                  {l(
                'Practice realistic dialogues with suggested replies and grammar hints for every tense.')
              }
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 bg-white/10 rounded-xl border border-white/10 space-y-1">
                <span className="font-bold text-amber-300 block">
                  {l('✓ Clear Explanations')}
                </span>
                <p className="text-slate-300 text-[11px]">
                  {l(
                'Step-by-step guidance explains why each tense form is used with practical examples.')
              }
                </p>
              </div>

              <div className="p-3 bg-white/10 rounded-xl border border-white/10 space-y-1">
                <span className="font-bold text-emerald-300 block">
                  {l('✓ Suggested Responses')}
                </span>
                <p className="text-slate-300 text-[11px]">
                  {l(
                'Choose from natural suggested replies or write your own answer.')
              }
                </p>
              </div>
            </div>

            <div className="pt-1 flex justify-end">
              <button
            type="button"
            onClick={() => handleGoToTutor()}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-2">
            
                <Bot className="w-4 h-4" />
                <span>{l('Start Guided Practice')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

  },

  // Step 3: Complete Curriculum & Features
  {
    id: 'platform_features',
    badge: l('Complete Curriculum'),
    badgeColor: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300',
    title: l('All 12 Tenses, Native Audio & Certification'),
    subtitle: l(
      'A unified platform designed for true mastery: formulas, comparative matrix, verb patterns, and real-time audio drills.'),

    renderContent: () =>
    <div className="space-y-4">
          <div className="p-5 bg-gradient-to-br from-indigo-50 to-emerald-50/60 dark:from-slate-900 dark:to-slate-850 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                  <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>{l('12 Verb Tenses')}</span>
                </span>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                  {l('Simple, Continuous, Perfect, and Perfect Continuous across Past, Present, and Future.')}
                </p>
              </div>

              <div className="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                  <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{l('Native Pronunciation Lab')}</span>
                </span>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                  {l('Listen to authentic accents, slow down playback, and record your voice for comparison.')}
                </p>
              </div>

              <div className="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>{l('Official Certificate')}</span>
                </span>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                  {l('Receive a verified completion certificate with your name upon finishing all 12 tenses.')}
                </p>
              </div>
            </div>

            <div className="p-3 bg-white/90 dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{l("All 12 tenses included in one subscription — US$5.99/month. No separate charge per lesson.")}</span>
              </span>
              {l(onOpenSubscription &&
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSubscription();
            }}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shrink-0 cursor-pointer transition-colors shadow-xs">
            
                  {l('View Pro Pass')}
                </button>)
          }
            </div>

          </div>
        </div>

  },

  // Step 4: Ready to Start
  {
    id: 'get_started',
    badge: l('All Ready!'),
    badgeColor: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950/70 dark:text-indigo-300',
    title: l('Where would you like to start today?'),
    subtitle: l(
      'Choose your favorite starting path to begin transforming your English confidence.'),

    renderContent: () =>
    <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Option 1: AI Tutor */}
            <button
          type="button"
          onClick={() => handleGoToTutor()}
          className="p-4 rounded-2xl border-2 border-purple-500 bg-purple-50/60 dark:bg-purple-950/40 hover:bg-purple-100/60 dark:hover:bg-purple-900/50 text-left transition-all group cursor-pointer flex flex-col justify-between">
          
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform shadow-sm">
                  <Bot className="w-5 h-5 text-amber-300" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  {l('1. Talk to 24/7 AI Tutor')}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {l('Try a quick conversation or ask a grammar question right now.')}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-300">
                <span>{l('Open AI Tutor')}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Option 2: Diagnostic Test */}
            <button
          type="button"
          onClick={handleFinishWithDiagnostic}
          className="p-4 rounded-2xl border-2 border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 hover:bg-indigo-100/60 dark:hover:bg-indigo-900/50 text-left transition-all group cursor-pointer flex flex-col justify-between">
          
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform shadow-sm">
                  <Target className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  {l('2. Placement Diagnostic (3 min)')}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {l('Discover which tenses you master and get your tailored roadmap.')}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                <span>{l('Start Test')}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Option 3: Explore Catalog */}
            <button
          type="button"
          onClick={handleFinishWithCatalog}
          className="p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-all group cursor-pointer flex flex-col justify-between">
          
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform shadow-sm">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  {l('3. Explore All 12 Tenses')}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {l('Jump straight to Present Simple or the 3x4 Grammar Matrix.')}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <span>{l('View Catalog')}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

          </div>
        </div>

  }];


  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full my-auto shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white border-b border-indigo-900/60 relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 font-bold font-serif">{l("T ")}

            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-300 block font-bold">
                {l('TenseMaster · Interactive Guide')}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                {l('The Real-Life Situations Method & 24/7 AI Tutor')}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2.5 py-1 bg-white/10 rounded-full text-indigo-200">
              {l("Step {{0}} of {{1}}", [currentStep + 1, steps.length])}
            </span>
            <button
              onClick={handleDismiss}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title={l(isEn ? 'Close guide' : 'Cerrar presentación')}>
              
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Tracker bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1">
          <div
            className="bg-gradient-to-r from-amber-400 to-indigo-500 h-full transition-all duration-300"
            style={{ width: `${(currentStep + 1) / steps.length * 100}%` }} />
          
        </div>

        {/* Step Content (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <div className="space-y-1.5">
            <div className="inline-block">
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${currentStepData.badgeColor}`}>
                {l(currentStepData.badge)}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white">
              {l(currentStepData.title)}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              {l(currentStepData.subtitle)}
            </p>
          </div>

          <div className="pt-2">
            {l(currentStepData.renderContent())}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          
          <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500" />
            
            <span>{l('Do not show automatically on startup')}</span>
          </label>

          <div className="flex items-center gap-2 ml-auto">
            {l(currentStep > 0 &&
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
              
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{l('Previous')}</span>
              </button>)
            }

            {l(currentStep < steps.length - 1 ?
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm">
              
                <span>{l('Next')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button> :

            <button
              type="button"
              onClick={handleDismiss}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm">
              
                <span>{l('Got it, Let\'s Start!')}</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>)
            }
          </div>

        </div>

      </div>
    </div>);

};
