import { useLocalization } from "../i18n/LocalizationContext";
import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import {
  Flame,
  Sparkles,
  CreditCard,
  ShieldCheck,
  Trophy,
  Bell,
  Wifi,
  WifiOff,
  Sun,
  Moon,
  Target,
  FileDown,
  Swords,
  Search,
  MessageSquare,
  BookMarked,
  Volume2,
  GitCompare,
  ChevronDown,
  Check,
  HelpCircle,
  Bot,
  Menu,
  Settings as SettingsIcon,
  BookOpen,
  PlayCircle,
  Brain } from
'lucide-react';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';
import { PWAInstallButton } from './PWAInstallButton';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { SideMenuDrawer } from './SideMenuDrawer';

export type NavigationTab =
'roadmap' |
'matrix' |
'comparator' |
'flashcards' |
'verbs' |
'duel' |
'analyzer' |
'chatbot' |
'forum' |
'rankings' |
'progress';

interface NavbarProps {
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  onOpenSubscription: () => void;
  onOpenCertificate: () => void;
  onOpenReminders: () => void;
  onOpenOfflineCenter: () => void;
  onOpenDiagnostic: () => void;
  onOpenVoiceSettings: () => void;
  onOpenWelcomeTutorial?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenSubscription,
  onOpenCertificate,
  onOpenReminders,
  onOpenOfflineCenter,
  onOpenDiagnostic,
  onOpenVoiceSettings,
  onOpenWelcomeTutorial
}) => {const { l } = useLocalization();
  const {
    isPro,
    progressState,
    overallMasteryPercentage,
    nativeLanguage,
    setNativeLanguage,
    t,
    reminderSettings,
    isSimulatedOffline,
    isDarkMode,
    toggleDarkMode,
    exportProgressPDF,
    diagnosticResult,
    ownerConfig
  } = useUser();

  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const { isOnline } = useOnlineStatus(isSimulatedOffline);

  const toolsRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const isMoreToolsActive = ['comparator', 'verbs', 'duel', 'analyzer', 'chatbot', 'forum', 'rankings'].includes(currentTab);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setIsToolsOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang =
  SUPPORTED_LANGUAGES.find((l) => l.code === nativeLanguage) || SUPPORTED_LANGUAGES[0];

  const secondaryTools = [
  {
    id: 'comparator' as NavigationTab,
    label: t.navComparator || 'Comparador',
    desc: 'Compara 2 tiempos lado a lado',
    icon: GitCompare,
    color: 'text-indigo-500'
  },
  {
    id: 'verbs' as NavigationTab,
    label: t.navVerbs || 'Verbos Irregulares',
    desc: 'Patrones V1, V2, V3 y reglas fonéticas',
    icon: BookMarked,
    color: 'text-amber-500'
  },
  {
    id: 'duel' as NavigationTab,
    label: t.navDuel || 'Modo Duelo',
    desc: 'Desafíos rápidos contra reloj',
    icon: Swords,
    color: 'text-rose-500'
  },
  {
    id: 'analyzer' as NavigationTab,
    label: t.navAnalyzer || 'Analizador',
    desc: 'Detecta tiempos en cualquier texto',
    icon: Search,
    color: 'text-teal-500'
  },
  {
    id: 'chatbot' as NavigationTab,
    label: t.navChatbot || 'Chatbot Tutor IA',
    desc: 'Conversación en inglés con corrección en vivo',
    icon: Bot,
    color: 'text-purple-500'
  },
  {
    id: 'forum' as NavigationTab,
    label: t.navForum || 'Comunidad',
    desc: 'Dudas y preguntas frecuentes',
    icon: MessageSquare,
    color: 'text-blue-500'
  },
  {
    id: 'rankings' as NavigationTab,
    label: t.navRankings || 'Ranking',
    desc: 'Tabla de posiciones de estudiantes',
    icon: Trophy,
    color: 'text-yellow-500'
  }];


  const monthlyPrice = ownerConfig?.priceMonthly ?? 5.99;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Tier 1: Brand & Key Utility Cluster */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 min-h-[54px] sm:h-16 flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 py-1.5 sm:py-0">
        
        {/* Brand & Menu Trigger */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          {/* Prominent MENÚ Button - Super visible, 1-tap access to all 12 tenses, tutor, tools & settings */}
          <button
            onClick={() => setIsSideMenuOpen(true)}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-95 shrink-0 group border border-orange-400/40"
            title={l("Abrir Menú Completo de Tiempos y Herramientas")}
            aria-label={l("Abrir Menú")}>
            <Menu className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white group-hover:scale-110 transition-transform" />
            <span className="tracking-wide uppercase text-[11px] sm:text-xs font-black">{l("MENÚ")}</span>
          </button>

          <button
            onClick={() => setCurrentTab('roadmap')}
            className="text-left group cursor-pointer focus-visible:outline-hidden flex items-baseline gap-1.5 shrink-0">
            <span className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {l("TenseMaster")}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden md:inline font-sans">
              {l("· 12 Tiempos")}
            </span>
          </button>
        </div>

        {/* Right Actions: Keep Quick Guide, Language selector, and Plan Price accessible on all screens */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          
          {/* Daily Streak Indicator */}
          <div
            title={l("Racha: {{0}} días seguidos", [progressState.streakDays])}
            className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400 shrink-0">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="font-mono text-xs">{l(progressState.streakDays)}{l("d")}</span>
          </div>

          {/* Diagnostic Test Button */}
          <button
            onClick={onOpenDiagnostic}
            title={l(diagnosticResult ? `${t.testLevel || 'Nivel'} ${diagnosticResult.cefrLevel}` : t.testLevel || 'Test de Nivel Inicial')}
            className="hidden md:flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0">
            <Target className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{l(diagnosticResult ? `${t.testLevel?.split(' ')[0] || 'Nivel'} ${diagnosticResult.levelCode}` : t.testLevel || 'Test Nivel')}</span>
          </button>

          {/* Quick Guide / Welcome Tutorial Button - ALWAYS ACCESSIBLE */}
          {l(onOpenWelcomeTutorial &&
            <button
              onClick={onOpenWelcomeTutorial}
              title={l(t.heroGuide || 'Quick Guide')}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-semibold rounded-lg text-indigo-700 dark:text-indigo-300 bg-indigo-50/90 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/80 dark:border-indigo-800/60 transition-colors cursor-pointer shadow-2xs shrink-0">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="text-[11px] sm:text-xs">{l(t.heroGuide || 'Quick Guide')}</span>
            </button>)
          }

          {/* Quick Language Selector - ALWAYS ACCESSIBLE */}
          <div className="relative shrink-0" ref={langMenuRef}>
            <button
              onClick={() => {
                setIsLangMenuOpen(!isLangMenuOpen);
                setIsToolsOpen(false);
              }}
              aria-haspopup="true"
              aria-expanded={isLangMenuOpen}
              aria-label={l('Language')}
              title={l('Language')}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50/80 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-slate-700 text-indigo-900 dark:text-slate-100 transition-colors cursor-pointer border border-indigo-200/80 dark:border-slate-700 shadow-2xs">
              <span className="text-base shrink-0 leading-none">{l(currentLang.flag)}</span>
              <span className="hidden md:inline font-semibold">{currentLang.nativeName}</span>
              <span className="md:hidden font-mono font-bold text-[11px]">{l(currentLang.code.toUpperCase())}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {l(isLangMenuOpen &&
              <div className="absolute right-0 top-10 sm:top-11 z-50 w-76 sm:w-88 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 rounded-2xl shadow-2xl p-2.5 space-y-1 text-xs animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2 py-1.5 border-b border-slate-100 dark:border-slate-750 space-y-1.5">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span>🌐</span>
                      <span>{l(t.nativeLanguageLabel || 'Idioma natal:')}</span>
                    </span>
                    <span className="text-[10px] font-mono uppercase bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded-sm">
                      {l(SUPPORTED_LANGUAGES.length)}{l(" Idiomas ")}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {l(t.chooseLanguage || 'Escoge tu idioma nativo para estudiar inglés:')}
                  </p>

                  {/* 1-Tap Quick Bar */}
                  <div className="flex items-center gap-1 pt-1 pb-0.5 overflow-x-auto no-scrollbar">
                    {l((['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'hi'] as const).map((code) => {
                      const languageOption = SUPPORTED_LANGUAGES.find((x) => x.code === code);
                      if (!languageOption) return null;
                      const isAct = nativeLanguage === code;
                      return (
                        <button
                          key={code}
                          onClick={() => {
                            setNativeLanguage(languageOption.code);
                            setIsLangMenuOpen(false);
                          }}
                          className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 shrink-0 transition-colors cursor-pointer ${
                            isAct ?
                            'bg-indigo-600 text-white font-bold shadow-xs' :
                            'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`
                          }
                          title={l("{{0}} ({{1}})", [languageOption.name, languageOption.nativeName])}>
                          <span>{languageOption.flag}</span>
                          <span className="truncate max-w-[55px]">{languageOption.code.toUpperCase()}</span>
                        </button>
                      );
                    }))}
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto space-y-1 pt-1 pr-0.5">
                  {l(SUPPORTED_LANGUAGES.map((lang) => {
                    const isSelected = nativeLanguage === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setNativeLanguage(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                          isSelected ?
                          'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200/60 dark:border-indigo-800/60' :
                          'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`
                        }>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-base shrink-0">{l(lang.flag)}</span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold truncate">{l(lang.nativeName)}</span>
                              <span className="text-[10px] text-slate-400 truncate">
                                ({lang.nativeName})
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <span>{l(lang.name)}</span>
                              <span>·</span>
                              <span className="text-indigo-600 dark:text-indigo-400 font-medium">{l(lang.currencyEquiv)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 flex items-center gap-1.5 pl-2">
                          {l(lang.demandTag.includes('Alta Demanda') &&
                            <span className="text-[9px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-800/50">
                              🔥
                            </span>)
                          }
                          {l(isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />)}
                        </div>
                      </button>
                    );
                  }))}
                </div>
              </div>)
            }
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            title={l(isDarkMode ? t.tooltipLightMode || 'Cambiar a modo claro' : t.tooltipDarkMode || 'Cambiar a modo oscuro')}
            className="p-1.5 sm:p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
            aria-label={l("Toggle dark mode")}>
            {l(isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />)}
          </button>

          {/* Plan Price / Subscription Action Button - ALWAYS ACCESSIBLE WITH CLEAR PRICE */}
          {l(isPro ?
            <button
              onClick={onOpenSubscription}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-800 transition-colors cursor-pointer shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{l(t.btnProActive)}</span>
            </button> :
            <button
              onClick={onOpenSubscription}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-xs border border-indigo-500/40 shrink-0">
              <CreditCard className="w-3.5 h-3.5 shrink-0" />
              <span>{l(`$${monthlyPrice.toFixed(2)}/mo`)}</span>
            </button>)
          }
        </div>
      </div>

      {/* Tier 2: Dedicated Navigation Row - Multiline wrapping, no horizontal scroll, high-contrast tabs */}
      <nav className="border-t border-slate-200/70 dark:border-slate-800 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-1.5 sm:py-2 flex flex-wrap items-center justify-start gap-1 sm:gap-1.5 text-xs sm:text-sm">
          
          {/* Tab 1: All 12 Tenses (Blue) */}
          <button
            onClick={() => setCurrentTab('roadmap')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold shrink-0 ${
              currentTab === 'roadmap' ?
              'bg-blue-600 text-white font-bold shadow-xs' :
              'text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 hover:bg-blue-50 dark:hover:bg-blue-950/50'}`
            }>
            {l(t.navTenses)}
          </button>

          {/* Tab 2: 3x4 Matrix (Violet) */}
          <button
            onClick={() => setCurrentTab('matrix')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold shrink-0 ${
              currentTab === 'matrix' ?
              'bg-violet-600 text-white font-bold shadow-xs' :
              'text-violet-700 dark:text-violet-300 hover:text-violet-900 dark:hover:text-violet-100 hover:bg-violet-50 dark:hover:bg-violet-950/50'}`
            }>
            {l(t.navMatrix)}
          </button>

          {/* Tab 3: Flashcards (Teal) */}
          <button
            onClick={() => setCurrentTab('flashcards')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold shrink-0 ${
              currentTab === 'flashcards' ?
              'bg-teal-600 text-white font-bold shadow-xs' :
              'text-teal-700 dark:text-teal-300 hover:text-teal-900 dark:hover:text-teal-100 hover:bg-teal-50 dark:hover:bg-teal-950/50'}`
            }>
            {l(t.navFlashcards)}
          </button>

          {/* Tab 4: My Progress (Cyan) */}
          <button
            onClick={() => setCurrentTab('progress')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 font-semibold shrink-0 ${
              currentTab === 'progress' ?
              'bg-cyan-700 dark:bg-cyan-600 text-white font-bold shadow-xs' :
              'text-cyan-800 dark:text-cyan-300 hover:text-cyan-950 dark:hover:text-cyan-100 hover:bg-cyan-50 dark:hover:bg-cyan-950/50'}`
            }>
            <span>{l(t.navProgress)}</span>
            <span className={`text-[10px] sm:text-[11px] font-mono px-1.5 py-0.5 rounded font-bold ${
              currentTab === 'progress' ? 'bg-cyan-900/80 text-white' : 'bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-200'
            }`}>
              {l(overallMasteryPercentage)}%
            </span>
          </button>

          {/* Tab 5: Tutor IA 24/7 (Purple) */}
          <button
            onClick={() => setCurrentTab('chatbot')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 font-semibold shrink-0 ${
              currentTab === 'chatbot' ?
              'bg-purple-600 text-white font-bold shadow-xs' :
              'text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/50'}`
            }>
            <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>{l("Practice with your tutor")}</span>
          </button>

          {/* Tools Dropdown */}
          <div className="relative shrink-0" ref={toolsRef}>
            <button
              onClick={() => setIsToolsOpen(!isToolsOpen)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-semibold ${
                isMoreToolsActive ?
                'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300' :
                'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`
              }>
              <span>{l(t.navTools || 'Herramientas')}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
            </button>

            {l(isToolsOpen &&
              <div className="absolute left-0 sm:left-auto sm:right-0 top-10 z-50 w-72 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 rounded-2xl shadow-xl p-2 space-y-1 text-xs">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                  {l(t.navTools || 'Herramientas')}
                </div>
                {l(secondaryTools.map((tool) => {
                  const Icon = tool.icon;
                  const isActive = currentTab === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => {
                        setCurrentTab(tool.id);
                        setIsToolsOpen(false);
                      }}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                        isActive ?
                        'bg-indigo-50 dark:bg-indigo-950/60 text-slate-900 dark:text-white font-semibold' :
                        'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'}`
                      }>
                      <div className={`p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 ${tool.color} shrink-0 mt-0.5`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {l(tool.label)}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {l(tool.desc)}
                        </p>
                      </div>
                    </button>
                  );
                }))}
              </div>)
            }
          </div>

        </div>
      </nav>

      {/* Complete Side Menu Drawer */}
      <SideMenuDrawer
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenSettings={onOpenVoiceSettings}
        onOpenSubscription={onOpenSubscription}
        onOpenDiagnostic={onOpenDiagnostic}
        onOpenWelcomeTutorial={onOpenWelcomeTutorial || (() => {})}
        onOpenCertificate={onOpenCertificate}
        onOpenReminders={onOpenReminders}
        onOpenOfflineCenter={onOpenOfflineCenter}
      />
    </header>
  );

};
