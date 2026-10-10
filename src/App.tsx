/**
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
import { AdminDashboardModal } from './components/AdminDashboardModal';
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
import { VerbsPatternView } from './components/VerbsPatternView';
import { VoiceSettingsModal } from './components/VoiceSettingsModal';
import { WelcomeTutorial, TUTORIAL_STORAGE_KEY } from './components/WelcomeTutorial';
import { NavigationTab } from './components/Navbar';
import { useUser } from './context/UserContext';
import { ALL_12_TENSES } from './data/tensesData';
import { TENSE_LOCALIZED_NAMES, SUPPORTED_LANGUAGES } from './i18n/translations';
import { TenseData, TenseGroup, TenseAspect } from './types';
import { Sparkles, CheckCircle2, Lock, ShieldCheck, Heart, BookOpen, Trophy, Target, FileDown, Sun, Moon, Swords, Search, MessageSquare, BookMarked, HelpCircle } from 'lucide-react';

function MainApp() {
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
    ownerConfig
  } = useUser();
  const [currentTab, setCurrentTab] = useState<NavigationTab>('roadmap');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<'all' | TenseGroup>('all');
  const [selectedAspect, setSelectedAspect] = useState<'all' | TenseAspect>('all');

  const [activeTenseModal, setActiveTenseModal] = useState<TenseData | null>(null);
  const [activeTenseInitialTab, setActiveTenseInitialTab] = useState<'formulas' | 'examples' | 'pronunciation' | 'video' | 'practice' | 'mistakes'>('formulas');
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isGlossaryDrawerOpen, setIsGlossaryDrawerOpen] = useState(false);
  const [isRemindersModalOpen, setIsRemindersModalOpen] = useState(false);
  const [isOfflineCenterOpen, setIsOfflineCenterOpen] = useState(false);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState(false);
  const [isWelcomeTutorialOpen, setIsWelcomeTutorialOpen] = useState(false);

  // Check if it's the user's first time entering TenseMaster
  useEffect(() => {
    try {
      const seen = localStorage.getItem(TUTORIAL_STORAGE_KEY);
      if (!seen) {
        // Small delay so page mounts gracefully before showing the welcoming guide
        const timer = setTimeout(() => {
          setIsWelcomeTutorialOpen(true);
        }, 400);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // Storage unavailable or disabled
    }
  }, []);

  // Filter tenses according to search, group, and aspect
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
  }, [searchQuery, selectedGroup, selectedAspect]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-900 dark:text-slate-100 transition-colors">
      {/* 
        Focus Mode Condition:
        When a user enters a detailed lesson (activeTenseModal !== null),
        hide the top Navbar, footer, side elements and floating buttons for 100% concentration!
      */}
      {!activeTenseModal && (
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          onOpenSubscription={() => setIsSubscriptionOpen(true)}
          onOpenCertificate={() => setIsCertificateOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenReminders={() => setIsRemindersModalOpen(true)}
          onOpenOfflineCenter={() => setIsOfflineCenterOpen(true)}
          onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
          onOpenVoiceSettings={() => setIsVoiceSettingsOpen(true)}
          onOpenWelcomeTutorial={() => setIsWelcomeTutorialOpen(true)}
        />
      )}

      {/* Main View Router */}
      {!activeTenseModal && (
        <main className="flex-1">
          {currentTab === 'roadmap' && (
            <div>
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
              />

              {/* Anti-Burnout Companion Hub: Micro-learning dose, pace mode, streak protection & PDF */}
              <AntiBurnoutCompanion
                onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
                onOpenTenseDetail={(id) => {
                  const t = ALL_12_TENSES.find((x) => x.id === id);
                  if (t) setActiveTenseModal(t);
                }}
                onOpenFlashcards={() => setCurrentTab('flashcards')}
              />

              {/* Grid of 12 Tenses */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white">
                      {t.catalogTitle || 'Catálogo de los 12 Tiempos del Inglés'}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      Mostrando {filteredTenses.length} de 12 tiempos verbales estructurados.
                    </p>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> {t.unlockedPreview || '2 tiempos de prueba gratis'}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-slate-400" /> {t.proPlanPrice || 'Plan completo por $1/mes'}
                    </span>
                  </div>
                </div>

                {filteredTenses.length === 0 ? (
                  <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      No encontramos tiempos verbales que coincidan con "<strong>{searchQuery}</strong>".
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedGroup('all');
                        setSelectedAspect('all');
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Restablecer filtros
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTenses.map((tense) => (
                      <TenseCard
                        key={tense.id}
                        tense={tense}
                        onSelect={(t, tab) => {
                          setActiveTenseModal(t);
                          setActiveTenseInitialTab(tab || 'formulas');
                        }}
                        onOpenSubscription={() => setIsSubscriptionOpen(true)}
                      />
                    ))}
                  </div>
                )}

                {/* Quick Pocket Cheat Sheet */}
                <QuickCheatSheet onSelectTense={(t) => setActiveTenseModal(t)} />
              </section>
            </div>
          )}

          {currentTab === 'matrix' && (
            <TenseMatrix
              onSelectTense={(t) => setActiveTenseModal(t)}
              onOpenSubscription={() => setIsSubscriptionOpen(true)}
            />
          )}

          {currentTab === 'comparator' && (
            <TenseComparator />
          )}

          {currentTab === 'flashcards' && (
            <FlashcardsView
              onOpenTenseLesson={(t) => setActiveTenseModal(t)}
              onOpenSubscription={() => setIsSubscriptionOpen(true)}
            />
          )}

          {currentTab === 'verbs' && (
            <VerbsPatternView />
          )}

          {currentTab === 'duel' && (
            <DuelModeView />
          )}

          {currentTab === 'analyzer' && (
            <TextAnalyzerView
              onOpenTenseDetail={(id) => {
                const t = ALL_12_TENSES.find((x) => x.id === id);
                if (t) setActiveTenseModal(t);
              }}
            />
          )}

          {currentTab === 'forum' && (
            <ForumView
              onOpenTenseDetail={(id) => {
                const t = ALL_12_TENSES.find((x) => x.id === id);
                if (t) setActiveTenseModal(t);
              }}
            />
          )}

          {currentTab === 'rankings' && (
            <LeaderboardView
              onOpenFlashcards={() => setCurrentTab('flashcards')}
              onOpenTenseDetail={(id) => {
                const t = ALL_12_TENSES.find((x) => x.id === id);
                if (t) setActiveTenseModal(t);
              }}
            />
          )}

          {currentTab === 'progress' && (
            <ProgressDashboard
              onSelectTense={(t) => setActiveTenseModal(t)}
              onOpenCertificate={() => setIsCertificateOpen(true)}
              onOpenSubscription={() => setIsSubscriptionOpen(true)}
            />
          )}
        </main>
      )}

      {/* Footer - hidden during Focus Mode in detailed lesson */}
      {!activeTenseModal && (
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-16 py-8 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-slate-800 dark:text-white text-sm">TenseMaster</span>
              <span>·</span>
              <span>Aprende los 12 tiempos del inglés sin complicaciones</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => setIsSubscriptionOpen(true)}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer font-medium"
                title="Ver membresía accesible y precio en moneda local"
              >
                Membresía ${(ownerConfig?.priceMonthly || 1.99).toFixed(2)} USD/mes {nativeLanguage !== 'es' ? `(~${(SUPPORTED_LANGUAGES.find((l) => l.code === nativeLanguage) || SUPPORTED_LANGUAGES[0]).currencyEquiv})` : ''}
              </button>
              <button
                onClick={() => setIsWelcomeTutorialOpen(true)}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold text-indigo-600 dark:text-indigo-400 transition-colors cursor-pointer flex items-center gap-1"
                title="Abrir la guía visual y tutorial interactivo"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Tutorial Guía</span>
              </button>
              <button
                onClick={() => setIsDiagnosticOpen(true)}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Target className="w-3.5 h-3.5" />
                <span>Test de Nivel</span>
              </button>
              <button
                onClick={exportProgressPDF}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer flex items-center gap-1"
              >
                <FileDown className="w-3.5 h-3.5 text-indigo-500" />
                <span>Exportar PDF</span>
              </button>
              <button
                onClick={() => setCurrentTab('duel')}
                className="hover:text-rose-600 dark:hover:text-rose-400 font-semibold text-rose-600 dark:text-rose-400 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Duelo 1v1</span>
              </button>
              <button
                onClick={() => setCurrentTab('analyzer')}
                className="hover:text-teal-600 dark:hover:text-teal-400 font-semibold text-teal-600 dark:text-teal-400 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Analizador</span>
              </button>
              <button
                onClick={() => setCurrentTab('forum')}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold text-indigo-600 dark:text-indigo-400 transition-colors cursor-pointer flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Foro</span>
              </button>
              <button
                onClick={() => setCurrentTab('matrix')}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
              >
                Matriz 3×4
              </button>
              <button
                onClick={() => setCurrentTab('flashcards')}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
              >
                Tarjetas Flash
              </button>
              <button
                onClick={() => setCurrentTab('verbs')}
                className="hover:text-amber-600 dark:hover:text-amber-400 font-semibold text-amber-600 dark:text-amber-400 transition-colors cursor-pointer flex items-center gap-1"
              >
                <BookMarked className="w-3.5 h-3.5" />
                <span>Verbos 3 Tiempos</span>
              </button>
              <button
                onClick={() => setCurrentTab('rankings')}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors cursor-pointer text-indigo-700 dark:text-indigo-300"
              >
                🏆 Rankings
              </button>
              <button
                onClick={() => setIsRemindersModalOpen(true)}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
              >
                🔔 Recordatorios
              </button>
              <button
                onClick={() => setIsCertificateOpen(true)}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
              >
                Certificación
              </button>
              <button
                onClick={() => setIsAdminOpen(true)}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors cursor-pointer text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-sm"
              >
                Panel de Dueña
              </button>
              <button
                onClick={toggleDarkMode}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer flex items-center gap-1"
              >
                {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
                <span>{isDarkMode ? 'Modo Claro' : 'Modo Noche'}</span>
              </button>
            </div>

            <div className="text-slate-400 dark:text-slate-500">
              © {new Date().getFullYear()} TenseMaster · 100% PWA Offline
            </div>
          </div>
        </footer>
      )}

      {/* Floating Quick Glossary Button - hidden during Focus Mode */}
      {!activeTenseModal && (
        <button
          onClick={() => setIsGlossaryDrawerOpen(true)}
          className="fixed bottom-6 right-6 z-30 px-3.5 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-full shadow-lg border border-slate-700 dark:border-slate-600 flex items-center gap-2 text-xs font-bold transition-transform hover:scale-105 cursor-pointer"
          title="Abrir glosario y diccionario rápido de verbos"
        >
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <span>Glosario Rápido</span>
        </button>
      )}

      {/* Offline Indicator & Diagnostic Tool - hidden during Focus Mode */}
      {!activeTenseModal && (
        <OfflineIndicator
          isSimulatedOffline={isSimulatedOffline}
          onToggleSimulatedOffline={toggleSimulatedOffline}
        />
      )}

      {/* Push Reminders Modal */}
      {isRemindersModalOpen && (
        <PushRemindersModal
          settings={reminderSettings}
          onUpdateSettings={updateReminderSettings}
          onClose={() => setIsRemindersModalOpen(false)}
          streakDays={progressState.streakDays}
        />
      )}

      {/* Diagnostic Level Test Modal */}
      <DiagnosticTestModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
        onSelectTense={(id) => {
          const t = ALL_12_TENSES.find((x) => x.id === id);
          if (t) setActiveTenseModal(t);
        }}
      />

      {/* Modals */}
      {activeTenseModal && (
        <TenseDetailModal
          tense={activeTenseModal}
          initialTab={activeTenseInitialTab}
          onClose={() => setActiveTenseModal(null)}
          onOpenSubscription={() => {
            setActiveTenseModal(null);
            setIsSubscriptionOpen(true);
          }}
        />
      )}

      {isSubscriptionOpen && (
        <SubscriptionModal onClose={() => setIsSubscriptionOpen(false)} />
      )}

      {isCertificateOpen && (
        <CertificateModal onClose={() => setIsCertificateOpen(false)} />
      )}

      {isAdminOpen && (
        <AdminDashboardModal onClose={() => setIsAdminOpen(false)} />
      )}

      {isVoiceSettingsOpen && (
        <VoiceSettingsModal onClose={() => setIsVoiceSettingsOpen(false)} />
      )}

      <QuickGlossaryDrawer
        isOpen={isGlossaryDrawerOpen}
        onClose={() => setIsGlossaryDrawerOpen(false)}
      />

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
      />
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <MainApp />
    </UserProvider>
  );
}
