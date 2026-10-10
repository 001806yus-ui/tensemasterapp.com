import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProgressState, TenseProgress, UserSubscription, PushReminderSettings, DiagnosticResult, OwnerBusinessConfig } from '../types';
import { ALL_12_TENSES } from '../data/tensesData';
import { SupportedLanguage, TRANSLATIONS, LocaleTranslations } from '../i18n/translations';
import { DEFAULT_REMINDER_SETTINGS, sendPushNotification } from '../utils/notifications';
import { generateProgressPDF } from '../utils/pdfExport';

interface UserContextType {
  progressState: UserProgressState;
  isPro: boolean;
  nativeLanguage: SupportedLanguage;
  setNativeLanguage: (lang: SupportedLanguage) => void;
  t: LocaleTranslations;
  reminderSettings: PushReminderSettings;
  updateReminderSettings: (newSettings: PushReminderSettings) => void;
  isSimulatedOffline: boolean;
  toggleSimulatedOffline: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  diagnosticResult: DiagnosticResult | null;
  saveDiagnosticResult: (result: DiagnosticResult) => void;
  clearDiagnosticResult: () => void;
  dailyPaceMode: 'relax' | 'regular' | 'intensive';
  setDailyPaceMode: (mode: 'relax' | 'regular' | 'intensive') => void;
  exportProgressPDF: () => void;
  canAccessTense: (tenseId: string) => boolean;
  completeExerciseForTense: (tenseId: string, isCorrect: boolean, totalQuestions: number) => void;
  markTenseComplete: (tenseId: string) => void;
  subscribePro: (method: string) => void;
  cancelSubscription: () => void;
  setUserName: (name: string) => void;
  toggleBookmark: (tenseId: string) => void;
  resetProgress: () => void;
  logDailyPractice: (xpBonus?: number) => void;
  useStreakFreeze: () => void;
  setDailyGoal: (goal: number) => void;
  overallMasteryPercentage: number;
  weakTenses: string[];
  ownerConfig: OwnerBusinessConfig;
  updateOwnerConfig: (partial: Partial<OwnerBusinessConfig>) => void;
  unlockOwnerAccess: () => void;
}

const STORAGE_KEY = 'tensemaster_user_progress_v2';
const LANG_STORAGE_KEY = 'tensemaster_native_language';
const REMINDERS_STORAGE_KEY = 'tensemaster_push_reminders';
const DARK_STORAGE_KEY = 'tensemaster_dark_mode';
const OWNER_STORAGE_KEY = 'tensemaster_owner_config';

const DEFAULT_OWNER_CONFIG: OwnerBusinessConfig = {
  stripePaymentLink: 'https://buy.stripe.com/test_123tuingles',
  mercadoPagoLink: '',
  customDomain: 'www.tensemasterapp.com',
  supportEmail: 'contacto@tensemasterapp.com',
  currencyCode: 'USD',
  priceMonthly: 1.99,
  promoCodeActive: 'PRIMERMES',
  allTensesFreeMode: false
};

const getInitialState = (): UserProgressState => {
  const today = new Date().toISOString().split('T')[0];
  
  // Create past dates for the 4-day streak demonstration
  const d1 = new Date();
  d1.setDate(d1.getDate() - 1);
  const d2 = new Date();
  d2.setDate(d2.getDate() - 2);
  const d3 = new Date();
  d3.setDate(d3.getDate() - 3);

  const initialTenseProgress: Record<string, TenseProgress> = {};

  ALL_12_TENSES.forEach((t, index) => {
    // Seed slight progress for first tense to demonstrate progress tracker immediately
    if (index === 0) {
      initialTenseProgress[t.id] = {
        tenseId: t.id,
        status: 'in-progress',
        score: 85,
        exercisesDone: 3,
        totalExercises: t.exercises.length,
        lastStudiedAt: today,
        practiceCount: 3
      };
    } else {
      initialTenseProgress[t.id] = {
        tenseId: t.id,
        status: 'not-started',
        score: 0,
        exercisesDone: 0,
        totalExercises: t.exercises.length,
        lastStudiedAt: null,
        practiceCount: 0
      };
    }
  });

  return {
    userName: 'Estudiante de Inglés',
    userEmail: 'estudiante@ejemplo.com',
    streakDays: 4,
    lastActiveDate: today,
    activeDates: [
      d3.toISOString().split('T')[0],
      d2.toISOString().split('T')[0],
      d1.toISOString().split('T')[0],
      today
    ],
    dailyGoalExercises: 3,
    todayExercisesCount: 2,
    streakFreezeAvailable: true,
    streakFreezeUsed: false,
    totalXP: 360,
    totalMinutesSpent: 42,
    totalExercisesCompleted: 3,
    subscription: {
      isPro: false,
      planName: 'Prueba Gratuita (2 Tiempos)',
      priceUSD: 1.0,
      startDate: null,
      renewalDate: null,
      paymentMethod: null,
      transactionId: null
    },
    tenseProgress: initialTenseProgress,
    bookmarkedTenses: ['present-simple', 'past-simple']
  };
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nativeLanguage, setNativeLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const savedLang = localStorage.getItem(LANG_STORAGE_KEY) as SupportedLanguage;
      if (savedLang && TRANSLATIONS[savedLang]) {
        return savedLang;
      }
    } catch (e) {
      // fallback
    }
    return 'es';
  });

  const setNativeLanguage = (lang: SupportedLanguage) => {
    setNativeLanguageState(lang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch (e) {
      // ignore
    }
  };

  const t = TRANSLATIONS[nativeLanguage] || TRANSLATIONS.es;

  const [progressState, setProgressState] = useState<UserProgressState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure all tenses exist in tenseProgress
        ALL_12_TENSES.forEach((t) => {
          if (!parsed.tenseProgress[t.id]) {
            parsed.tenseProgress[t.id] = {
              tenseId: t.id,
              status: 'not-started',
              score: 0,
              exercisesDone: 0,
              totalExercises: t.exercises.length,
              lastStudiedAt: null,
              practiceCount: 0
            };
          }
        });
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load user state from localStorage', e);
    }
    return getInitialState();
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressState));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [progressState]);

  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);

  // Dark mode state with persistent localStorage and html class sync
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(DARK_STORAGE_KEY);
      if (saved !== null) {
        return saved === 'true';
      }
      return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(DARK_STORAGE_KEY, String(isDarkMode));
    } catch (e) {
      // ignore
    }
    if (typeof document !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const [reminderSettings, setReminderSettings] = useState<PushReminderSettings>(() => {
    try {
      const saved = localStorage.getItem(REMINDERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return DEFAULT_REMINDER_SETTINGS;
  });

  const updateReminderSettings = (newSettings: PushReminderSettings) => {
    setReminderSettings(newSettings);
    try {
      localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(newSettings));
    } catch (e) {
      // ignore
    }
  };

  const toggleSimulatedOffline = () => {
    setIsSimulatedOffline((prev) => !prev);
  };

  // Track study time (ticks every minute)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgressState((prev) => ({
        ...prev,
        totalMinutesSpent: prev.totalMinutesSpent + 1
      }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const isPro = progressState.subscription.isPro;

  const canAccessTense = (tenseId: string): boolean => {
    if (isPro || ownerConfig.allTensesFreeMode) return true;
    const tense = ALL_12_TENSES.find((t) => t.id === tenseId);
    return tense ? tense.isFreePreview : false;
  };

  const completeExerciseForTense = (tenseId: string, isCorrect: boolean, totalQuestions: number) => {
    const today = new Date().toISOString().split('T')[0];

    setProgressState((prev) => {
      const current = prev.tenseProgress[tenseId] || {
        tenseId,
        status: 'not-started',
        score: 0,
        exercisesDone: 0,
        totalExercises: totalQuestions,
        lastStudiedAt: null,
        practiceCount: 0
      };

      const newExercisesDone = current.exercisesDone + 1;
      const scoreIncrement = isCorrect ? Math.round(100 / Math.max(1, totalQuestions)) : 0;
      const newScore = Math.min(100, current.score + scoreIncrement);

      let newStatus: TenseProgress['status'] = 'in-progress';
      if (newExercisesDone >= totalQuestions) {
        newStatus = newScore >= 75 ? 'mastered' : 'completed';
      }

      // Check active dates for streak
      const activeDates = prev.activeDates.includes(today)
        ? prev.activeDates
        : [...prev.activeDates, today];

      const newTodayCount = (prev.todayExercisesCount || 0) + 1;
      const xpEarned = isCorrect ? 25 : 10;

      return {
        ...prev,
        lastActiveDate: today,
        activeDates,
        todayExercisesCount: newTodayCount,
        totalXP: (prev.totalXP || 0) + xpEarned,
        totalExercisesCompleted: prev.totalExercisesCompleted + 1,
        tenseProgress: {
          ...prev.tenseProgress,
          [tenseId]: {
            ...current,
            exercisesDone: newExercisesDone,
            score: newScore,
            status: newStatus,
            lastStudiedAt: today,
            practiceCount: current.practiceCount + 1
          }
        }
      };
    });
  };

  const logDailyPractice = (xpBonus: number = 20) => {
    const today = new Date().toISOString().split('T')[0];
    setProgressState((prev) => {
      const activeDates = prev.activeDates.includes(today)
        ? prev.activeDates
        : [...prev.activeDates, today];

      const newTodayCount = (prev.todayExercisesCount || 0) + 1;
      const wasStreakExtended = !prev.activeDates.includes(today);

      return {
        ...prev,
        lastActiveDate: today,
        activeDates,
        todayExercisesCount: newTodayCount,
        streakDays: wasStreakExtended ? prev.streakDays + 1 : prev.streakDays,
        totalXP: (prev.totalXP || 0) + xpBonus,
        totalMinutesSpent: prev.totalMinutesSpent + 5
      };
    });
  };

  const useStreakFreeze = () => {
    setProgressState((prev) => ({
      ...prev,
      streakFreezeUsed: !prev.streakFreezeUsed
    }));
  };

  const setDailyGoal = (goal: number) => {
    setProgressState((prev) => ({
      ...prev,
      dailyGoalExercises: Math.max(1, Math.min(10, goal))
    }));
  };

  const markTenseComplete = (tenseId: string) => {
    const today = new Date().toISOString().split('T')[0];
    setProgressState((prev) => {
      const current = prev.tenseProgress[tenseId];
      if (!current) return prev;

      return {
        ...prev,
        tenseProgress: {
          ...prev.tenseProgress,
          [tenseId]: {
            ...current,
            status: 'mastered',
            score: 100,
            lastStudiedAt: today
          }
        }
      };
    });
  };

  const subscribePro = (paymentMethod: string) => {
    const today = new Date();
    const renewal = new Date();
    renewal.setMonth(today.getMonth() + 1);

    const price = ownerConfig?.priceMonthly || 1.99;
    const subscription: UserSubscription = {
      isPro: true,
      planName: `Pase Total Ilimitado ($${price.toFixed(2)} USD/mes)`,
      priceUSD: price,
      startDate: today.toISOString(),
      renewalDate: renewal.toISOString(),
      paymentMethod,
      transactionId: 'TXN-' + Math.random().toString(36).substring(2, 9).toUpperCase()
    };

    setProgressState((prev) => ({
      ...prev,
      subscription
    }));
  };

  const cancelSubscription = () => {
    setProgressState((prev) => ({
      ...prev,
      subscription: {
        isPro: false,
        planName: 'Prueba Gratuita (2 Tiempos)',
        priceUSD: 1.0,
        startDate: null,
        renewalDate: null,
        paymentMethod: null,
        transactionId: null
      }
    }));
  };

  const unlockOwnerAccess = () => {
    subscribePro('👑 Acceso Total Dueña (Gratuito y Vitalicio)');
  };

  const setUserName = (name: string) => {
    setProgressState((prev) => ({
      ...prev,
      userName: name.trim() || 'Estudiante'
    }));
  };

  const toggleBookmark = (tenseId: string) => {
    setProgressState((prev) => {
      const exists = prev.bookmarkedTenses.includes(tenseId);
      return {
        ...prev,
        bookmarkedTenses: exists
          ? prev.bookmarkedTenses.filter((id) => id !== tenseId)
          : [...prev.bookmarkedTenses, tenseId]
      };
    });
  };

  const resetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProgressState(getInitialState());
  };

  // Calculate overall mastery percentage
  const totalTenses = ALL_12_TENSES.length;
  const masteredCount = Object.values(progressState.tenseProgress).filter(
    (tp) => tp.status === 'mastered' || tp.score >= 80
  ).length;
  const inProgressCount = Object.values(progressState.tenseProgress).filter(
    (tp) => tp.status === 'in-progress' || tp.status === 'completed'
  ).length;

  const overallMasteryPercentage = Math.round(
    ((masteredCount * 1.0 + inProgressCount * 0.4) / totalTenses) * 100
  );

  // Identify weak tenses for personalized recommendations
  const weakTenses = Object.entries(progressState.tenseProgress)
    .filter(([_, p]) => p.status === 'in-progress' && p.score < 60)
    .map(([id]) => id);

  const saveDiagnosticResult = (result: DiagnosticResult) => {
    setProgressState((prev) => ({
      ...prev,
      diagnosticResult: result,
      totalXP: (prev.totalXP || 0) + 100 // XP bonus for completing diagnostic
    }));
  };

  const clearDiagnosticResult = () => {
    setProgressState((prev) => ({
      ...prev,
      diagnosticResult: null
    }));
  };

  const setDailyPaceMode = (mode: 'relax' | 'regular' | 'intensive') => {
    const goalExercises = mode === 'relax' ? 1 : mode === 'regular' ? 3 : 5;
    setProgressState((prev) => ({
      ...prev,
      dailyPaceMode: mode,
      dailyGoalExercises: goalExercises
    }));
  };

  const exportProgressPDF = () => {
    generateProgressPDF(progressState, overallMasteryPercentage);
  };

  const [ownerConfig, setOwnerConfig] = useState<OwnerBusinessConfig>(() => {
    try {
      const saved = localStorage.getItem(OWNER_STORAGE_KEY);
      if (saved) return { ...DEFAULT_OWNER_CONFIG, ...JSON.parse(saved) };
    } catch (e) {
      console.error('Failed to load ownerConfig', e);
    }
    return DEFAULT_OWNER_CONFIG;
  });

  const updateOwnerConfig = (partial: Partial<OwnerBusinessConfig>) => {
    setOwnerConfig((prev) => {
      const updated = { ...prev, ...partial };
      try {
        localStorage.setItem(OWNER_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save ownerConfig', e);
      }
      return updated;
    });
  };

  return (
    <UserContext.Provider
      value={{
        progressState,
        isPro,
        nativeLanguage,
        setNativeLanguage,
        t,
        reminderSettings,
        updateReminderSettings,
        isSimulatedOffline,
        toggleSimulatedOffline,
        isDarkMode,
        toggleDarkMode,
        diagnosticResult: progressState.diagnosticResult || null,
        saveDiagnosticResult,
        clearDiagnosticResult,
        dailyPaceMode: progressState.dailyPaceMode || 'regular',
        setDailyPaceMode,
        exportProgressPDF,
        canAccessTense,
        completeExerciseForTense,
        markTenseComplete,
        subscribePro,
        cancelSubscription,
        setUserName,
        toggleBookmark,
        resetProgress,
        logDailyPractice,
        useStreakFreeze,
        setDailyGoal,
        overallMasteryPercentage,
        weakTenses,
        ownerConfig,
        updateOwnerConfig,
        unlockOwnerAccess
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
