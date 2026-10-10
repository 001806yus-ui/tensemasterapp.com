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
  MoreHorizontal,
  Check,
  HelpCircle
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';
import { PWAInstallButton } from './PWAInstallButton';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export type NavigationTab =
  | 'roadmap'
  | 'matrix'
  | 'comparator'
  | 'flashcards'
  | 'verbs'
  | 'duel'
  | 'analyzer'
  | 'forum'
  | 'rankings'
  | 'progress';

interface NavbarProps {
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  onOpenSubscription: () => void;
  onOpenCertificate: () => void;
  onOpenAdmin: () => void;
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
  onOpenAdmin,
  onOpenReminders,
  onOpenOfflineCenter,
  onOpenDiagnostic,
  onOpenVoiceSettings,
  onOpenWelcomeTutorial
}) => {
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const { isOnline } = useOnlineStatus(isSimulatedOffline);

  const toolsRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const isMoreToolsActive = ['comparator', 'verbs', 'duel', 'analyzer', 'forum', 'rankings'].includes(currentTab);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setIsToolsOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setIsSettingsOpen(false);
        setIsLangOpen(false);
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
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Primary Navigation */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setCurrentTab('roadmap')}
            className="text-left group cursor-pointer focus-visible:outline-hidden flex items-baseline gap-2"
          >
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              TenseMaster
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline font-sans">
              · 12 Tiempos
            </span>
          </button>

          {/* Minimalist Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => setCurrentTab('roadmap')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentTab === 'roadmap'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              {t.navTenses}
            </button>

            <button
              onClick={() => setCurrentTab('matrix')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentTab === 'matrix'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              {t.navMatrix}
            </button>

            <button
              onClick={() => setCurrentTab('flashcards')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentTab === 'flashcards'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              {t.navFlashcards}
            </button>

            <button
              onClick={() => setCurrentTab('progress')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'progress'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <span>{t.navProgress}</span>
              <span className="text-[11px] font-mono px-1.5 py-0.2 bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded">
                {overallMasteryPercentage}%
              </span>
            </button>

            {/* Tools Dropdown */}
            <div className="relative" ref={toolsRef}>
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  isMoreToolsActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>Herramientas</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
              </button>

              {isToolsOpen && (
                <div className="absolute left-0 top-11 z-50 w-72 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 rounded-2xl shadow-xl p-2 space-y-1 text-xs">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                    Herramientas de Estudio
                  </div>
                  {secondaryTools.map((tool) => {
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
                          isActive
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-slate-900 dark:text-white font-semibold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 ${tool.color} shrink-0 mt-0.5`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {tool.label}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {tool.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Clean Right Actions */}
        <div className="flex items-center gap-2">
          
          {/* Daily Streak Indicator */}
          <div
            title={`Racha: ${progressState.streakDays} días seguidos`}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400"
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="font-mono text-xs">{progressState.streakDays}d</span>
          </div>

          {/* Diagnostic Test Button */}
          <button
            onClick={onOpenDiagnostic}
            title={diagnosticResult ? `Nivel ${diagnosticResult.cefrLevel}` : 'Test de Nivel Inicial'}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Target className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{diagnosticResult ? `Nivel ${diagnosticResult.levelCode}` : 'Test Nivel'}</span>
          </button>

          {/* Welcome Tutorial / Guide Button */}
          {onOpenWelcomeTutorial && (
            <button
              onClick={onOpenWelcomeTutorial}
              title="Ver Tutorial de Bienvenida y Guía de Uso"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg text-indigo-700 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/80 dark:border-indigo-800/60 transition-colors cursor-pointer shadow-2xs"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">Guía</span>
            </button>
          )}

          {/* Quick Language Selector (Global Learning Language) */}
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => {
                setIsLangMenuOpen(!isLangMenuOpen);
                setIsSettingsOpen(false);
                setIsToolsOpen(false);
              }}
              title="Cambiar idioma global de aprendizaje / Switch language"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50/80 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-slate-700 text-indigo-900 dark:text-slate-100 transition-colors cursor-pointer border border-indigo-200/80 dark:border-slate-700 shadow-2xs"
            >
              <span className="text-base shrink-0">{currentLang.flag}</span>
              <span className="hidden md:inline font-semibold">{currentLang.name}</span>
              <span className="md:hidden font-mono font-bold">{currentLang.code.toUpperCase()}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 top-11 z-50 w-80 sm:w-88 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 rounded-2xl shadow-2xl p-2.5 space-y-1 text-xs animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2 py-1.5 border-b border-slate-100 dark:border-slate-750 space-y-1.5">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span>🌐</span>
                      <span>{t.nativeLanguageLabel || 'Idioma natal:'}</span>
                    </span>
                    <span className="text-[10px] font-mono uppercase bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded-sm">
                      {SUPPORTED_LANGUAGES.length} Idiomas
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {t.chooseLanguage || 'Escoge tu idioma nativo para estudiar inglés:'}
                  </p>

                  {/* 1-Tap Quick Bar for primary requested languages */}
                  <div className="flex items-center gap-1 pt-1 pb-0.5 overflow-x-auto no-scrollbar">
                    {(['es', 'fr', 'de', 'it', 'pt', 'zh', 'hi'] as const).map((code) => {
                      const l = SUPPORTED_LANGUAGES.find((x) => x.code === code);
                      if (!l) return null;
                      const isAct = nativeLanguage === code;
                      return (
                        <button
                          key={code}
                          onClick={() => {
                            setNativeLanguage(l.code);
                            setIsLangMenuOpen(false);
                          }}
                          className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 shrink-0 transition-colors cursor-pointer ${
                            isAct
                              ? 'bg-indigo-600 text-white font-bold shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                          title={`${l.name} (${l.nativeName})`}
                        >
                          <span>{l.flag}</span>
                          <span className="truncate max-w-[55px]">{l.code.toUpperCase()}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto space-y-1 pt-1 pr-0.5">
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const isSelected = nativeLanguage === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setNativeLanguage(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200/60 dark:border-indigo-800/60'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-base shrink-0">{lang.flag}</span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold truncate">{lang.nativeName}</span>
                              <span className="text-[10px] text-slate-400 truncate">
                                ({lang.name})
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <span>{lang.region}</span>
                              <span>·</span>
                              <span className="text-indigo-600 dark:text-indigo-400 font-medium">{lang.currencyEquiv}</span>
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 flex items-center gap-1.5 pl-2">
                          {lang.demandTag.includes('Alta Demanda') && (
                            <span className="text-[9px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-800/50">
                              🔥
                            </span>
                          )}
                          {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Minimalist More Settings Dropdown */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => {
                setIsSettingsOpen(!isSettingsOpen);
                setIsLangOpen(false);
              }}
              title="Más opciones (idioma, audio, PDF, recordatorios)"
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {isSettingsOpen && (
              <div className="absolute right-0 top-11 z-50 w-64 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 rounded-2xl shadow-xl p-2 space-y-1 text-xs">
                {/* Language Switcher */}
                <div className="p-1">
                  <button
                    onClick={() => setIsLangOpen(!isLangOpen)}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span>{currentLang.flag}</span>
                      <span>Idioma: {currentLang.nativeName}</span>
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isLangOpen && (
                    <div className="mt-1 space-y-0.5 pl-2 max-h-56 overflow-y-auto border-l-2 border-slate-100 dark:border-slate-700 my-1">
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setNativeLanguage(lang.code);
                            setIsLangOpen(false);
                          }}
                          className={`w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-left cursor-pointer ${
                            nativeLanguage === lang.code
                              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <span className="truncate">{lang.flag} {lang.nativeName}</span>
                          {nativeLanguage === lang.code && <Check className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                {/* Voice Engine */}
                <button
                  onClick={() => {
                    setIsSettingsOpen(false);
                    onOpenVoiceSettings();
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Voces HD Naturales</span>
                </button>

                {/* Tutorial Guía */}
                {onOpenWelcomeTutorial && (
                  <button
                    onClick={() => {
                      setIsSettingsOpen(false);
                      onOpenWelcomeTutorial();
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 text-indigo-700 dark:text-indigo-300 font-medium cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Guía y Tutorial de Bienvenida</span>
                  </button>
                )}

                {/* PDF Export */}
                <button
                  onClick={() => {
                    setIsSettingsOpen(false);
                    exportProgressPDF();
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <FileDown className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Descargar Informe en PDF</span>
                </button>

                {/* Reminders */}
                <button
                  onClick={() => {
                    setIsSettingsOpen(false);
                    onOpenReminders();
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <Bell className="w-4 h-4 text-slate-500" />
                  <span>Recordatorios de Estudio</span>
                </button>

                {/* Offline Center */}
                <button
                  onClick={() => {
                    setIsSettingsOpen(false);
                    onOpenOfflineCenter();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    {isOnline ? (
                      <Wifi className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-amber-600" />
                    )}
                    <span>Modo Offline</span>
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </button>

                {/* PWA Install */}
                <div className="p-1">
                  <PWAInstallButton variant="nav" />
                </div>

                {/* Admin */}
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                <button
                  onClick={() => {
                    setIsSettingsOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-500" />
                  <span>Panel de Dueña / Admin</span>
                </button>
              </div>
            )}
          </div>

          {/* Subscription Action Button */}
          {isPro ? (
            <button
              onClick={onOpenSubscription}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{t.btnProActive}</span>
            </button>
          ) : (
            <button
              onClick={onOpenSubscription}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>{t.btnPro || `Pase ${currentLang.currencyEquiv}`}</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Subnav - Clean Segmented Bar */}
      <div className="lg:hidden flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-4 py-2 bg-slate-50/80 dark:bg-slate-900 text-xs overflow-x-auto gap-2">
        <button
          onClick={() => setCurrentTab('roadmap')}
          className={`py-1 px-2.5 rounded-md whitespace-nowrap cursor-pointer transition-colors ${
            currentTab === 'roadmap'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {t.navTenses}
        </button>
        <button
          onClick={() => setCurrentTab('matrix')}
          className={`py-1 px-2.5 rounded-md whitespace-nowrap cursor-pointer transition-colors ${
            currentTab === 'matrix'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {t.navMatrix}
        </button>
        <button
          onClick={() => setCurrentTab('flashcards')}
          className={`py-1 px-2.5 rounded-md whitespace-nowrap cursor-pointer transition-colors ${
            currentTab === 'flashcards'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {t.navFlashcards}
        </button>
        <button
          onClick={() => setCurrentTab('progress')}
          className={`py-1 px-2.5 rounded-md whitespace-nowrap cursor-pointer transition-colors ${
            currentTab === 'progress'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {t.navProgress}
        </button>
        <button
          onClick={() => setIsToolsOpen(!isToolsOpen)}
          className={`py-1 px-2.5 rounded-md whitespace-nowrap cursor-pointer flex items-center gap-1 ${
            isMoreToolsActive
              ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <span>Más</span>
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>
    </header>
  );
};

