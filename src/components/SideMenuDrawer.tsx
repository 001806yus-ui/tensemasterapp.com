import { useLocalization } from "../i18n/LocalizationContext";
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  PlayCircle,
  BookOpen,
  Settings,
  ThumbsUp,
  Info,
  Sparkles,
  Bot,
  Brain,
  Swords,
  Globe,
  CheckCircle2,
  Lock,
  Zap,
  Volume2,
  Target,
  FileDown,
  GitCompare,
  BookMarked,
  Search,
  MessageSquare,
  Trophy,
  Bell,
  Wifi,
  ShieldCheck,
  CreditCard,
  Flame,
  Camera } from
'lucide-react';
import { NavigationTab } from './Navbar';
import { useUser } from '../context/UserContext';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';

interface SideMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenSettings: () => void;
  onOpenSubscription: () => void;
  onOpenDiagnostic: () => void;
  onOpenWelcomeTutorial: () => void;
  onOpenCertificate?: () => void;
  onOpenReminders?: () => void;
  onOpenOfflineCenter?: () => void;
}

export const SideMenuDrawer: React.FC<SideMenuDrawerProps> = ({
  isOpen,
  onClose,
  currentTab,
  onSelectTab,
  onOpenSettings,
  onOpenSubscription,
  onOpenDiagnostic,
  onOpenWelcomeTutorial,
  onOpenCertificate,
  onOpenReminders,
  onOpenOfflineCenter
}) => {const { l } = useLocalization();
  const { nativeLanguage, setNativeLanguage, isPro, ownerConfig, exportProgressPDF, progressState, overallMasteryPercentage, t } = useUser();
  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === nativeLanguage) || SUPPORTED_LANGUAGES[0];
  const monthlyPrice = ownerConfig?.priceMonthly ?? 5.99;

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleTabClick = (tab: NavigationTab) => {
    onSelectTab(tab);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-hidden flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity cursor-pointer z-[9999]"
        aria-label={l("Cerrar menú")} />
      

      {/* Drawer Panel (slides from left) */}
      <div className="relative w-full max-w-sm sm:max-w-md h-full bg-[#FFFDF9] dark:bg-slate-900 shadow-2xl flex flex-col z-[10000] border-r border-slate-200 dark:border-slate-800 animate-in slide-in-from-left duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">{l("TM ")}

            </div>
            <div>
              <h2 className="font-serif text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{l(t.menuTitle)}</span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {l(t.menuSubtitle)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={l(t.modalClose || 'Cerrar menú')}
            aria-label={l(t.modalClose || 'Cerrar menú')}>
            
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pro Membership Banner */}
        <div className="p-4 bg-gradient-to-r from-orange-500 via-amber-500 to-amber-600 text-white m-3 rounded-2xl shadow-md space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase bg-white/20 px-2 py-0.5 rounded-md font-bold tracking-wider">
              {l(isPro ? `👑 ${t.btnProActive}` : `🔥 ${t.btnPro || 'Pro'}`)}
            </span>
            <span className="text-[11px] font-bold text-amber-100">
              {l(isPro ? t.mastered || 'Acceso Ilimitado' : 'US$5.99/mes')}
            </span>
          </div>
          <p className="text-xs font-medium text-white/95 leading-snug">
            {l(isPro ?
            'Tienes desbloqueados los 12 tiempos verbales y todas las funciones.' :
            l('All 12 tenses included in one subscription — US$5.99/month. No separate charge per lesson.'))}
          </p>
          {l(!isPro ?
          <button
            onClick={() => {
              onClose();
              onOpenSubscription();
            }}
            className="w-full py-2 bg-white text-orange-600 rounded-xl text-xs font-bold hover:bg-orange-50 transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5">
            
              <CreditCard className="w-3.5 h-3.5" />
              <span>{l(t.btnPro || 'Ver Suscripción')}</span>
            </button> :

          <div className="flex items-center justify-between pt-1 text-[11px] text-amber-100">
              <span>{l(t.heroDailyStreak || 'Racha')}: {l(progressState.streakDays)}{l("d")}</span>
              <span className="font-bold">{l(t.mastered || 'Dominio')}: {l(overallMasteryPercentage)}%</span>
            </div>)
          }
        </div>

        {/* Menu Items List - Categorized for instant scanning */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 text-sm font-medium">
          
          {/* CATEGORY 1: APRENDIZAJE Y TUTOR */}
          <div>
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {l(t.menuLearningPractice || 'Aprendizaje & Práctica')}
            </div>
            <div className="space-y-1 mt-1">
              {/* 12 Tiempos (Roadmap) - Blue */}
              <button
                onClick={() => handleTabClick('roadmap')}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                currentTab === 'roadmap' ?
                'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold border border-blue-200/80 dark:border-blue-800/80' :
                'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}`
                }>
                
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{l(t.navTenses)}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{l(t.menuRoadmapSub || 'Ruta visual paso a paso')}</div>
                </div>
              </button>

              {/* Tutor IA 24/7 */}
              <button
                onClick={() => handleTabClick('chatbot')}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                currentTab === 'chatbot' ?
                'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 font-bold border border-purple-200/60 dark:border-purple-900/60' :
                'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}`
                }>
                
                <Bot className="w-5 h-5 text-purple-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{l(t.navChatbot)}</span>
                    <span className="text-[9px] font-mono bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 px-1.5 py-0.2 rounded font-bold">
                      24/7
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{l(t.menuTutorSub || 'Práctica guiada y explicaciones')}</div>
                </div>
              </button>

              {/* Situaciones Cotidianas */}
              <button
                onClick={() => {
                  onClose();
                  onOpenWelcomeTutorial();
                }}
                className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                
                <Camera className="w-5 h-5 text-amber-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold flex items-center justify-between">
                    <span>{l(t.situationalScenarios || 'Situaciones de la Vida Real')}</span>
                    <span className="text-[9px] font-mono bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 px-1.5 py-0.2 rounded font-bold">{l("DEMO ")}

                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{l(t.heroGuide || 'Demostración interactiva')}</div>
                </div>
              </button>

              {/* Quick Practice / Flashcards - Teal */}
              <button
                onClick={() => handleTabClick('flashcards')}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                currentTab === 'flashcards' ?
                'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 font-bold border border-teal-200/80 dark:border-teal-800/80' :
                'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}`
                }>
                
                <PlayCircle className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{l(t.navFlashcards)}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{l(t.menuFlashcardsSub || 'Repaso rápido y mnemotecnia')}</div>
                </div>
              </button>

              {/* Matriz 3x4 - Violet */}
              <button
                onClick={() => handleTabClick('matrix')}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                currentTab === 'matrix' ?
                'bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 font-bold border border-violet-200/80 dark:border-violet-800/80' :
                'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}`
                }>
                
                <Zap className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{l(t.navMatrix)}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{l(t.menuMatrixSub || 'Mapa comparativo integral 3×4')}</div>
                </div>
              </button>
            </div>
          </div>

          {/* CATEGORY 2: HERRAMIENTAS Y RETOS */}
          <div>
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {l(t.menuToolsChallenges || 'Herramientas & Retos')}
            </div>
            <div className="space-y-1 mt-1">
              {/* Duelo 1v1 */}
              <button
                onClick={() => handleTabClick('duel')}
                className={`w-full flex items-center gap-3.5 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                currentTab === 'duel' ?
                'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold' :
                'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}`
                }>
                
                <Swords className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="text-xs sm:text-sm">{l(t.navDuel)}</span>
              </button>

              {/* Verbos Irregulares */}
              <button
                onClick={() => handleTabClick('verbs')}
                className={`w-full flex items-center gap-3.5 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                currentTab === 'verbs' ?
                'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-bold' :
                'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}`
                }>
                
                <BookMarked className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-xs sm:text-sm">{l(t.irregularVerbs || t.navVerbs)}</span>
              </button>

              {/* Comparador */}
              <button
                onClick={() => handleTabClick('comparator')}
                className={`w-full flex items-center gap-3.5 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                currentTab === 'comparator' ?
                'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-bold' :
                'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}`
                }>
                
                <GitCompare className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="text-xs sm:text-sm">{l(t.navComparator)}</span>
              </button>

              {/* Analizador */}
              <button
                onClick={() => handleTabClick('analyzer')}
                className={`w-full flex items-center gap-3.5 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                currentTab === 'analyzer' ?
                'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 font-bold' :
                'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}`
                }>
                
                <Search className="w-4 h-4 text-teal-500 shrink-0" />
                <span className="text-xs sm:text-sm">{l(t.navAnalyzer)}</span>
              </button>

              {/* Foro / Comunidad */}
              <button
                onClick={() => handleTabClick('forum')}
                className={`w-full flex items-center gap-3.5 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                currentTab === 'forum' ?
                'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-bold' :
                'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}`
                }>
                
                <MessageSquare className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="text-xs sm:text-sm">{l(t.navForum)}</span>
              </button>

              {/* Rankings */}
              <button
                onClick={() => handleTabClick('rankings')}
                className={`w-full flex items-center gap-3.5 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                currentTab === 'rankings' ?
                'bg-yellow-50 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400 font-bold' :
                'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}`
                }>
                
                <Trophy className="w-4 h-4 text-yellow-500 shrink-0" />
                <span className="text-xs sm:text-sm">{l(t.navRankings)}</span>
              </button>
            </div>
          </div>

          {/* CATEGORY 3: EVALUACIÓN Y PROGRESO */}
          <div>
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {l(t.navProgress || 'Progreso')}
            </div>
            <div className="space-y-1 mt-1">
              {/* Test de Nivel */}
              <button
                onClick={() => {
                  onClose();
                  onOpenDiagnostic();
                }}
                className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                
                <Target className="w-5 h-5 text-indigo-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{l(t.testLevel || 'Test Diagnóstico de Nivel')}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{l("CEFR (A1-C2)")}</div>
                </div>
              </button>

              {/* Mi Progreso - Cyan / Teal */}
              <button
                onClick={() => handleTabClick('progress')}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                currentTab === 'progress' ?
                'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-800 dark:text-cyan-300 font-bold border border-cyan-200/80 dark:border-cyan-800/80' :
                'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}`
                }>
                
                <Flame className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold flex items-center justify-between">
                    <span>{l(t.navProgress)}</span>
                    <span className="text-[11px] font-mono text-cyan-800 dark:text-cyan-300 font-bold">
                      {l(overallMasteryPercentage)}%
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{l(progressState.streakDays)} {l(t.heroDailyStreak || 'días')}</div>
                </div>
              </button>

              {/* Certificado */}
              {l(onOpenCertificate &&
              <button
                onClick={() => {
                  onClose();
                  onOpenCertificate();
                }}
                className="w-full flex items-center gap-3.5 px-3 py-2 rounded-xl text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                
                  <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-xs sm:text-sm">{l(t.heroCertCheck || 'Certificado')}</span>
                </button>)
              }

              {/* Export PDF */}
              <button
                onClick={() => {
                  exportProgressPDF();
                  onClose();
                }}
                className="w-full flex items-center gap-3.5 px-3 py-2 rounded-xl text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                
                <FileDown className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-xs sm:text-sm">{l("PDF Report")}</span>
              </button>
            </div>
          </div>

          {/* CATEGORY 4: AJUSTES Y CONFIGURACIÓN */}
          <div>
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {l(t.navTools || 'Ajustes')}
            </div>
            <div className="space-y-1 mt-1">
              {/* Settings Audio/Voices */}
              <button
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                className="w-full flex items-center gap-3.5 px-3 py-2 rounded-xl text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                
                <Volume2 className="w-4 h-4 text-teal-500 shrink-0" />
                <span className="text-xs sm:text-sm">{l(t.listenAudio || 'Voces')}{l(" HD")}</span>
              </button>

              {/* Reminders */}
              {l(onOpenReminders &&
              <button
                onClick={() => {
                  onClose();
                  onOpenReminders();
                }}
                className="w-full flex items-center gap-3.5 px-3 py-2 rounded-xl text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                
                  <Bell className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="text-xs sm:text-sm">{l(t.reminders || 'Recordatorios')}</span>
                </button>)
              }

              {/* Offline Center */}
              {l(onOpenOfflineCenter &&
              <button
                onClick={() => {
                  onClose();
                  onOpenOfflineCenter();
                }}
                className="w-full flex items-center gap-3.5 px-3 py-2 rounded-xl text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                
                  <Wifi className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-xs sm:text-sm">{l(t.offlineCenter || 'Modo Offline')}</span>
                </button>)
              }

              {/* Rate App */}
              <button
                onClick={() => {
                  onClose();
                }}
                className="w-full flex items-center gap-3.5 px-3 py-2 rounded-xl text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                
                <ThumbsUp className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="text-xs sm:text-sm">{l('Rate 5 Stars')}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Drawer Footer: Language & Pro status */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-base">{l(currentLang.flag)}</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{l(currentLang.name)}</span>
          </div>
          <div>
            {l(!isPro ?
            <button
              onClick={() => {
                onClose();
                onOpenSubscription();
              }}
              className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold text-xs cursor-pointer transition-colors shadow-2xs">
              
                {l('Get Pro Pass')}
              </button> :

            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{l('Pro Member')}</span>
              </span>)
            }
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};
