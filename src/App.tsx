import { FirstWeekPath } from './components/FirstWeekPath';
import { TranslationStatus } from './i18n/LocalizationContext';
import { useLocalization } from "./i18n/LocalizationContext"; /**
* @license
* SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useMemo, useEffect } from 'react';
import { UserProvider } from './context/UserContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { TenseCard } from './components/TenseCard';
import { TenseDetailModal } from './components/TenseDetailModal';
import { TenseMatrix } from './components/TenseMatrix';
import { TenseComparator } from './components/TenseComparator';
import { ProgressDashboard } from './components/ProgressDashboard';
import { SubscriptionModal } from './components/SubscriptionModal';
import { CertificateModal } from './components/CertificateModal';
import { QuickCheatSheet } from './components/QuickCheatSheet';
import { FlashcardsView } from './components/FlashcardsView';
import { QuickGlossaryDrawer } from './components/InteractiveGlossary';
import { LeaderboardView } from './components/LeaderboardView';
import { PushRemindersModal } from './components/PushRemindersModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { AntiBurnoutCompanion } from './components/AntiBurnoutCompanion';
import { DiagnosticTestModal } from './components/DiagnosticTestModal';
import { ForumView } from './components/ForumView';
import { DuelModeView } from './components/DuelModeView';
import { TextAnalyzerView } from './components/TextAnalyzerView';
import { ChatbotView } from './components/ChatbotView';
import { VerbsPatternView } from './components/VerbsPatternView';
import { VoiceSettingsModal } from './components/VoiceSettingsModal';
import { WelcomeTutorial, TUTORIAL_STORAGE_KEY } from './components/WelcomeTutorial';
import { NavigationTab } from './components/Navbar';
import { useUser } from './context/UserContext';
import { ALL_12_TENSES } from './data/tensesData';
import { TENSE_LOCALIZED_NAMES, SUPPORTED_LANGUAGES } from './i18n/translations';
import { TenseData, TenseGroup, TenseAspect } from './types';
import { Sparkles, CheckCircle2, Lock, ShieldCheck, Heart, BookOpen, Trophy, Target, FileDown, Sun, Moon, Swords, Search, MessageSquare, BookMarked, HelpCircle, Bot, X } from 'lucide-react';

function MainApp() {const { l } = useLocalization();
  const {
    reminderSettings,
    updateReminderSettings,
    isSimulatedOffline,
    toggleSimulatedOffline,
    progressState,
    isDarkMode,
    toggleDarkMode,
    exportProgressPDF,
    diagnosticResult,
    t,
    nativeLanguage,
    ownerConfig,
    justSubscribedNotice,
    clearSubscribedNotice
  } = useUser();
  const [currentTab, setCurrentTab] = useState<NavigationTab>('roadmap');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<'all' | TenseGroup>('all');
  const [selectedAspect, setSelectedAspect] = useState<'all' | TenseAspect>('all');

  const [activeTenseModal, setActiveTenseModal] = useState<TenseData | null>(null);
  const [activeTenseInitialTab, setActiveTenseInitialTab] = useState<'formulas' | 'examples' | 'pronunciation' | 'video' | 'practice' | 'mistakes'>('formulas');
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isGlossaryDrawerOpen, setIsGlossaryDrawerOpen] = useState(false);
  const [isRemindersModalOpen, setIsRemindersModalOpen] = useState(false);
  const [isOfflineCenterOpen, setIsOfflineCenterOpen] = useState(false);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState(false);
  const [isWelcomeTutorialOpen, setIsWelcomeTutorialOpen] = useState(false);
  const [tutorStarterPrompt, setTutorStarterPrompt] = useState<string | undefined>(undefined);

  // Open the welcome guide automatically on first visit if the user has not seen it yet
  useEffect(() => {
    try {
      const hasSeen = localStorage.getItem(TUTORIAL_STORAGE_KEY);
      if (!hasSeen) {
        setIsWelcomeTutorialOpen(true);
      }
    } catch {
      // Safe fallback
    }
  }, []); // Filter tenses according to search, group, and aspect
  const filteredTenses = useMemo(() => {
    return ALL_12_TENSES.filter((tense) => {
      // Group filter
      if (selectedGroup !== 'all' && tense.group !== selectedGroup) {
        return false;
      }
      // Aspect filter
      if (selectedAspect !== 'all' && tense.aspect !== selectedAspect) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = tense.name.toLowerCase().includes(query);
        const matchesSpanish = tense.spanishName.toLowerCase().includes(query);
        const loc = TENSE_LOCALIZED_NAMES[tense.id]?.[nativeLanguage];
        const matchesLocalized = loc && (loc.name.toLowerCase().includes(query) || loc.tagline.toLowerCase().includes(query));
        const matchesFormula = tense.formula.affirmative.toLowerCase().includes(query);
        const matchesSignal = tense.signalWords.some((w) => w.toLowerCase().includes(query));
        const matchesExample = tense.examples.some(
          (ex) => ex.english.toLowerCase().includes(query) || ex.spanish.toLowerCase().includes(query)
        );
        return Boolean(matchesName || matchesSpanish || matchesLocalized || matchesFormula || matchesSignal || matchesExample);
      }
      return true;
    });
  }, [searchQuery, selectedGroup, selectedAspect, nativeLanguage]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-900 dark:text-slate-100 transition-colors w-full overflow-x-hidden">
      {justSubscribedNotice && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white px-4 py-3 shadow-md sticky top-0 z-50">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl shrink-0">🎉</span>
              <div>
                <p className="font-bold text-sm sm:text-base leading-tight">
                  {l("Welcome to TenseMaster All-Access!")}
                </p>
                <p className="text-xs text-emerald-100 mt-0.5">
                  {l("Your subscription is active. All 12 tenses, exercises, native audio, and 24/7 AI tutor are fully unlocked.")}
                </p>
              </div>
            </div>
            <button
              onClick={clearSubscribedNotice}
              className="p-1.5 hover:bg-white/20 rounded-lg text-white cursor-pointer transition-colors shrink-0"
              aria-label={l("Close")}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      {/* 
          Focus Mode Condition:
          When a user enters a detailed lesson (activeTenseModal !== null),
          hide the top Navbar, footer, side elements and floating buttons for 100% concentration!
         */}
      {l(!activeTenseModal &&
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenSubscription={() => setIsSubscriptionOpen(true)}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onOpenReminders={() => setIsRemindersModalOpen(true)}
        onOpenOfflineCenter={() => setIsOfflineCenterOpen(true)}
        onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
        onOpenVoiceSettings={() => setIsVoiceSettingsOpen(true)}
        onOpenWelcomeTutorial={() => setIsWelcomeTutorialOpen(true)} />)

      }

      {/* Main View Router */}
      {l(!activeTenseModal &&
      <main className={`flex-1 ${currentTab === 'chatbot' ? 'flex flex-col min-h-0' : ''}`}>
          {l(currentTab === 'roadmap' &&
        <div>
              <FirstWeekPath onLesson={(id, tab) => {
                const tense = ALL_12_TENSES.find(item => item.id === id);
                if (tense) { setActiveTenseInitialTab(tab); setActiveTenseModal(tense); }
              }} onTutor={prompt => { setTutorStarterPrompt(prompt); setCurrentTab('chatbot'); }} />
              {/* Hero Banner with Search, Filter tools & Adaptive Learning Path */}
              <HeroBanner
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            selectedAspect={selectedAspect}
            setSelectedAspect={setSelectedAspect}
            onOpenSubscription={() => setIsSubscriptionOpen(true)}
            onOpenTenseDetail={(tense) => setActiveTenseModal(tense)}
            onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
            onOpenWelcomeTutorial={() => setIsWelcomeTutorialOpen(true)}
            onOpenTutor={(prompt) => {
              setTutorStarterPrompt(prompt);
              setCurrentTab('chatbot');
            }} />
          

              {/* Anti-Burnout Companion Hub: Micro-learning dose, pace mode, streak protection & PDF */}
              <AntiBurnoutCompanion
            onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
            onOpenTenseDetail={(id) => {
              const t = ALL_12_TENSES.find((x) => x.id === id);
              if (t) setActiveTenseModal(t);
            }}
            onOpenFlashcards={() => setCurrentTab('flashcards')} />
          

              {/* Grid of 12 Tenses */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white">
                      {l(t.catalogTitle || 'Catálogo de los 12 Tiempos del Inglés')}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">{l("Mostrando ")}
                  {l(filteredTenses.length)}{l(" de 12 tiempos verbales estructurados. ")}
                </p>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> {l(t.unlockedPreview || '2 tiempos de prueba gratis')}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-slate-400" /> {l(t.proPlanPrice || 'Plan completo por $5.99/mes')}
                    </span>
                  </div>
                </div>

                {l(filteredTenses.length === 0 ?
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
                    <p className="text-slate-600 dark:text-slate-300 text-sm">{l("No encontramos tiempos verbales que coincidan con \"")}
                <strong>{l(searchQuery)}</strong>".
                    </p>
                    <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGroup('all');
                  setSelectedAspect('all');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold cursor-pointer">{l("Restablecer filtros ")}


              </button>
                  </div> :

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {l(filteredTenses.map((tense) =>
              <TenseCard
                key={tense.id}
                tense={tense}
                onSelect={(t, tab) => {
                  setActiveTenseModal(t);
                  setActiveTenseInitialTab(tab || 'formulas');
                }}
                onOpenSubscription={() => setIsSubscriptionOpen(true)} />

              ))}
                  </div>)
            }

                {/* Quick Pocket Cheat Sheet */}
                <QuickCheatSheet onSelectTense={(t) => setActiveTenseModal(t)} />
              </section>
            </div>)
        }

          {l(currentTab === 'matrix' &&
        <TenseMatrix
          onSelectTense={(t) => setActiveTenseModal(t)}
          onOpenSubscription={() => setIsSubscriptionOpen(true)} />)

        }

          {l(currentTab === 'comparator' &&
        <TenseComparator />)
        }

          {l(currentTab === 'flashcards' &&
        <FlashcardsView
          onOpenTenseLesson={(t) => setActiveTenseModal(t)}
          onOpenSubscription={() => setIsSubscriptionOpen(true)} />)

        }

          {l(currentTab === 'verbs' &&
        <VerbsPatternView />)
        }

          {l(currentTab === 'duel' &&
        <DuelModeView />)
        }

          {l(currentTab === 'analyzer' &&
        <TextAnalyzerView
          onOpenTenseDetail={(id) => {
            const t = ALL_12_TENSES.find((x) => x.id === id);
            if (t) setActiveTenseModal(t);
          }} />)

        }

          {l(currentTab === 'chatbot' &&
        <ChatbotView
          initialPrompt={tutorStarterPrompt}
          onOpenTenseDetail={(id) => {
            const t = ALL_12_TENSES.find((x) => x.id === id);
            if (t) setActiveTenseModal(t);
          }} />)

        }

          {l(currentTab === 'forum' &&
        <ForumView
          onOpenTenseDetail={(id) => {
            const t = ALL_12_TENSES.find((x) => x.id === id);
            if (t) setActiveTenseModal(t);
          }} />)

        }

          {l(currentTab === 'rankings' &&
        <LeaderboardView
          onOpenFlashcards={() => setCurrentTab('flashcards')}
          onOpenTenseDetail={(id) => {
            const t = ALL_12_TENSES.find((x) => x.id === id);
            if (t) setActiveTenseModal(t);
          }} />)

        }

          {l(currentTab === 'progress' &&
        <ProgressDashboard
          onSelectTense={(t) => setActiveTenseModal(t)}
          onOpenCertificate={() => setIsCertificateOpen(true)}
          onOpenSubscription={() => setIsSubscriptionOpen(true)} />)

        }
        </main>)
      }

      {/* Footer - hidden during Focus Mode in detailed lesson */}
      {l(!activeTenseModal &&
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-16 py-8 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-slate-800 dark:text-white text-sm">{l("TenseMaster")}</span>
              <span>·</span>
              <span>{l('Master all 12 English tenses with zero confusion')}</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <button
              onClick={() => setIsSubscriptionOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer font-medium"
              title={l(nativeLanguage === 'en' ? "View membership and all-access pass" : "Ver membresía accesible y precio en moneda local")}>
              
                {l(
                'All-Access Membership')
              }
              </button>
              <button
              onClick={() => setIsWelcomeTutorialOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold text-indigo-600 dark:text-indigo-400 transition-colors cursor-pointer flex items-center gap-1"
              title={l(nativeLanguage === 'en' ? "Open interactive guide tutorial" : "Abrir la guía visual y tutorial interactivo")}>
              
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{l('Guide Tutorial')}</span>
              </button>
              <button
              onClick={() => setIsDiagnosticOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer flex items-center gap-1">
              
                <Target className="w-3.5 h-3.5" />
                <span>{l('Placement Test')}</span>
              </button>
              <button
              onClick={exportProgressPDF}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer flex items-center gap-1">
              
                <FileDown className="w-3.5 h-3.5 text-indigo-500" />
                <span>{l('Export PDF')}</span>
              </button>
              <button
              onClick={() => setCurrentTab('duel')}
              className="hover:text-rose-600 dark:hover:text-rose-400 font-semibold text-rose-600 dark:text-rose-400 transition-colors cursor-pointer flex items-center gap-1">
              
                <Swords className="w-3.5 h-3.5" />
                <span>{l(t.navDuel || l('1v1 Arena'))}</span>
              </button>
              <button
              onClick={() => setCurrentTab('analyzer')}
              className="hover:text-teal-600 dark:hover:text-teal-400 font-semibold text-teal-600 dark:text-teal-400 transition-colors cursor-pointer flex items-center gap-1">
              
                <Search className="w-3.5 h-3.5" />
                <span>{l(t.navAnalyzer || l('Analyzer'))}</span>
              </button>
              <button
              onClick={() => setCurrentTab('chatbot')}
              className="hover:text-purple-600 dark:hover:text-purple-400 font-semibold text-purple-600 dark:text-purple-400 transition-colors cursor-pointer flex items-center gap-1">
              
                <Bot className="w-3.5 h-3.5" />
                <span>{l(t.navChatbot || l('AI Tutor'))}</span>
              </button>
              <button
              onClick={() => setCurrentTab('forum')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold text-indigo-600 dark:text-indigo-400 transition-colors cursor-pointer flex items-center gap-1">
              
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{l(t.navForum || l('Community'))}</span>
              </button>
              <button
              onClick={() => setCurrentTab('matrix')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
              
                {l(t.navMatrix || l('3×4 Matrix'))}
              </button>
              <button
              onClick={() => setCurrentTab('flashcards')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
              
                {l(t.navFlashcards || l('Flashcards'))}
              </button>
              <button
              onClick={() => setCurrentTab('verbs')}
              className="hover:text-amber-600 dark:hover:text-amber-400 font-semibold text-amber-600 dark:text-amber-400 transition-colors cursor-pointer flex items-center gap-1">
              
                <BookMarked className="w-3.5 h-3.5" />
                <span>{l(t.navVerbs || l('Verb Patterns'))}</span>
              </button>
              <button
              onClick={() => setCurrentTab('rankings')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors cursor-pointer text-indigo-700 dark:text-indigo-300">
              
                🏆 {l(t.navRankings || l('Leaderboards'))}
              </button>
              <button
              onClick={() => setIsRemindersModalOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
              
                🔔 {l(t.reminders || l('Reminders'))}
              </button>
              <button
              onClick={() => setIsCertificateOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
              
                {l('Certificate')}
              </button>
              <button
              onClick={toggleDarkMode}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer flex items-center gap-1">
              
                {l(isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />)}
                <span>{l(isDarkMode ? l('Light Mode') : l('Dark Mode'))}</span>
              </button>
            </div>

            <div className="text-slate-400 dark:text-slate-500">
              © {l(new Date().getFullYear())} TenseMaster · {l('Saved lessons available offline; AI features require internet.')}<br /><span data-testid="release-version">v2026.10.15.2</span>
          </div>
          </div>
        </footer>)
      }

      {/* Floating Quick Glossary Button - hidden during Focus Mode and Chatbot view so it does not block tutor controls */}
      {l(!activeTenseModal && currentTab !== 'chatbot' &&
      <button
        onClick={() => setIsGlossaryDrawerOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 px-3 py-2 sm:px-3.5 sm:py-2.5 bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-xs hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-full shadow-lg border border-slate-700 dark:border-slate-600 flex items-center gap-1.5 sm:gap-2 text-xs font-bold transition-transform hover:scale-105 cursor-pointer"
        title={l(nativeLanguage === 'en' ? "Open quick glossary and verb dictionary" : "Abrir glosario y diccionario rápido de verbos")}>
        
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <span className="hidden sm:inline">{l('Quick Glossary')}</span>
          <span className="sm:hidden text-[11px]">{l('Glossary')}</span>
        </button>)
      }

      {/* Offline Indicator & Diagnostic Tool - hidden during Focus Mode */}
      {l(!activeTenseModal &&
      <OfflineIndicator
        isSimulatedOffline={isSimulatedOffline}
        onToggleSimulatedOffline={toggleSimulatedOffline} />)

      }

      {/* Push Reminders Modal */}
      {l(isRemindersModalOpen &&
      <PushRemindersModal
        settings={reminderSettings}
        onUpdateSettings={updateReminderSettings}
        onClose={() => setIsRemindersModalOpen(false)}
        streakDays={progressState.streakDays} />)

      }

      {/* Diagnostic Level Test Modal */}
      <DiagnosticTestModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
        onSelectTense={(id) => {
          const t = ALL_12_TENSES.find((x) => x.id === id);
          if (t) setActiveTenseModal(t);
        }} />
      

      {/* Modals */}
      {l(activeTenseModal &&
      <TenseDetailModal
        tense={activeTenseModal}
        initialTab={activeTenseInitialTab}
        onClose={() => setActiveTenseModal(null)}
        onOpenSubscription={() => {
          setActiveTenseModal(null);
          setIsSubscriptionOpen(true);
        }} />)

      }

      {l(isSubscriptionOpen &&
      <SubscriptionModal
        onClose={() => setIsSubscriptionOpen(false)} />)

      }

      {l(isCertificateOpen &&
      <CertificateModal onClose={() => setIsCertificateOpen(false)} />)
      }

      {l(isVoiceSettingsOpen &&
      <VoiceSettingsModal onClose={() => setIsVoiceSettingsOpen(false)} />)
      }

      <QuickGlossaryDrawer
        isOpen={isGlossaryDrawerOpen}
        onClose={() => setIsGlossaryDrawerOpen(false)} />
      

      {/* Welcome Onboarding Tutorial Modal */}
      <WelcomeTutorial
        isOpen={isWelcomeTutorialOpen}
        onClose={() => setIsWelcomeTutorialOpen(false)}
        onStartDiagnostic={() => {
          setIsWelcomeTutorialOpen(false);
          setIsDiagnosticOpen(true);
        }}
        onExploreCatalog={() => {
          setIsWelcomeTutorialOpen(false);
          setCurrentTab('roadmap');
        }}
        onOpenTutor={(prompt) => {
          setIsWelcomeTutorialOpen(false);
          setTutorStarterPrompt(prompt);
          setCurrentTab('chatbot');
        }}
        onOpenSubscription={() => {
          setIsWelcomeTutorialOpen(false);
          setIsSubscriptionOpen(true);
        }}
        onOpenTense={(id) => {
          const found = ALL_12_TENSES.find((x) => x.id === id);
          if (found) {
            setIsWelcomeTutorialOpen(false);
            setActiveTenseModal(found);
          }
        }} />
      

    </div>);

}

export default function App() {
  return (
    <UserProvider>
      <MainApp /><TranslationStatus />
    </UserProvider>);

}
