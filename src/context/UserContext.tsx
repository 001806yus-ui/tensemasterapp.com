import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { UserProgressState, TenseProgress, UserSubscription, PushReminderSettings, DiagnosticResult, OwnerBusinessConfig } from '../types';
import { ALL_12_TENSES } from '../data/tensesData';
import {
  SupportedLanguage,
  TRANSLATIONS,
  LocaleTranslations,
  SUPPORTED_LANGUAGES,
  LanguageOption,
  TENSE_LOCALIZED_NAMES,
  getTenseExampleTranslation
} from '../i18n/translations';
import { MEMBERSHIP } from '../config/membership';
import { DEFAULT_REMINDER_SETTINGS, sendPushNotification } from '../utils/notifications';
import { generateProgressPDF } from '../utils/pdfExport';

interface UserContextType {
  progressState: UserProgressState;
  isPro: boolean;
  nativeLanguage: SupportedLanguage;
  setNativeLanguage: (lang: SupportedLanguage) => void;
  currentLangOption: LanguageOption;
  t: LocaleTranslations;
  translate: (key: keyof LocaleTranslations, fallback?: string) => string;
  getTenseName: (tenseId: string) => string;
  getTenseTagline: (tenseId: string) => string;
  getExampleTranslation: (tenseId: string, defaultSpanish?: string) => string;
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
  subscribePro: (method?: string) => void;
  subscribeWithPromoCode: (code: string) => boolean;
  cancelSubscription: () => void;
  justSubscribedNotice: boolean;
  clearSubscribedNotice: () => void;
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
  isOwnerAuthenticated: boolean;
  verifyOwnerPIN: (pin: string) => boolean;
  logoutOwner: () => void;
  unlockOwnerAccess: () => void;
}

const STORAGE_KEY = 'tensemaster_user_progress_v2';
const LANG_STORAGE_KEY = 'tensemaster_interface_language_v3';
const REMINDERS_STORAGE_KEY = 'tensemaster_push_reminders';
const DARK_STORAGE_KEY = 'tensemaster_dark_mode';
const OWNER_STORAGE_KEY = 'tensemaster_owner_config';

const DEFAULT_OWNER_CONFIG: OwnerBusinessConfig = {
  stripePaymentLink: '',
  mercadoPagoLink: '',
  customDomain: 'www.tensemasterapp.com',
  supportEmail: 'contacto@tensemasterapp.com',
  currencyCode: 'USD',
  priceMonthly: MEMBERSHIP.monthlyUSD,
  promoCodeActive: 'PROMO599',
  allTensesFreeMode: false
};

const getInitialState = (): UserProgressState => {
  const today = new Date().toISOString().split('T')[0];
  
  const initialTenseProgress: Record<string, TenseProgress> = {};
  ALL_12_TENSES.forEach((tense) => {
    initialTenseProgress[tense.id] = {
      tenseId: tense.id, status: 'not-started', score: 0, exercisesDone: 0,
      totalExercises: tense.exercises.length, lastStudiedAt: null, practiceCount: 0
    };
  });

  return {
    userName: 'English Learner',
    userEmail: 'learner@example.com',
    streakDays: 0,
    lastActiveDate: today,
    activeDates: [],
    dailyGoalExercises: 3,
    todayExercisesCount: 0,
    streakFreezeAvailable: true,
    streakFreezeUsed: false,
    totalXP: 0,
    totalMinutesSpent: 0,
    totalExercisesCompleted: 0,
    subscription: {
      isPro: false,
      planName: 'Free Trial (2 Tenses)',
      priceUSD: MEMBERSHIP.monthlyUSD,
      startDate: null,
      renewalDate: null,
      paymentMethod: null,
      transactionId: null
    },
    tenseProgress: initialTenseProgress,
    bookmarkedTenses: []
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
    return 'en';
  });

  const setNativeLanguage = (lang: SupportedLanguage) => {
    if (!SUPPORTED_LANGUAGES.some((option) => option.code === lang)) return;
    setNativeLanguageState(lang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = nativeLanguage;
    document.documentElement.dir = nativeLanguage === 'ar' ? 'rtl' : 'ltr';
  }, [nativeLanguage]);

  const currentLangOption = useMemo(() => {
    return SUPPORTED_LANGUAGES.find((l) => l.code === nativeLanguage) || SUPPORTED_LANGUAGES[0];
  }, [nativeLanguage]);

  const t: LocaleTranslations = useMemo(() => {
    const raw = TRANSLATIONS[nativeLanguage] || TRANSLATIONS.en;
    return { ...TRANSLATIONS.en, ...raw };
  }, [nativeLanguage]);

  const translate = useCallback((key: keyof LocaleTranslations, fallback?: string): string => {
    return (t[key] as string) || fallback || (TRANSLATIONS.en[key] as string) || '';
  }, [t]);

  const getTenseName = useCallback((tenseId: string): string => {
    if (nativeLanguage === 'en') {
      const match = ALL_12_TENSES.find((x) => x.id === tenseId);
      return match ? match.name : '';
    }
    return TENSE_LOCALIZED_NAMES[tenseId]?.[nativeLanguage]?.name || ALL_12_TENSES.find((x) => x.id === tenseId)?.spanishName || '';
  }, [nativeLanguage]);

  const getTenseTagline = useCallback((tenseId: string): string => {
    if (nativeLanguage === 'en') {
      const match = ALL_12_TENSES.find((x) => x.id === tenseId);
      return match ? match.tagline : '';
    }
    return TENSE_LOCALIZED_NAMES[tenseId]?.[nativeLanguage]?.tagline || ALL_12_TENSES.find((x) => x.id === tenseId)?.tagline || '';
  }, [nativeLanguage]);

  const getExampleTranslation = useCallback((tenseId: string, defaultSpanish?: string): string => {
    return getTenseExampleTranslation(tenseId, nativeLanguage, defaultSpanish);
  }, [nativeLanguage]);

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
        return { ...parsed, subscription: { ...parsed.subscription, priceUSD: MEMBERSHIP.monthlyUSD } };
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

  const [justSubscribedNotice, setJustSubscribedNotice] = useState<boolean>(false);

  // Check for payment success parameter in URL (e.g. Stripe checkout return)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('payment_success') === 'true' || urlParams.get('subscribed') === 'true') {
        const today = new Date();
        const renewal = new Date();
        renewal.setMonth(today.getMonth() + 1);
        const price = MEMBERSHIP.monthlyUSD;
        setProgressState((prev) => ({
          ...prev,
          subscription: {
            isPro: true,
            planName: `All-Access Pass ($${price.toFixed(2)} USD/month)`,
            priceUSD: price,
            startDate: today.toISOString(),
            renewalDate: renewal.toISOString(),
            paymentMethod: 'Stripe',
            transactionId: 'STRIPE-' + Math.random().toString(36).substring(2, 9).toUpperCase()
          }
        }));
        setJustSubscribedNotice(true);
        const cleanUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    } catch {
      // ignore
    }
  }, []);

  // Has valid paid subscription (Stripe or valid promo code with current price)
  const hasValidPaidSubscription = Boolean(
    progressState.subscription.isPro &&
    (progressState.subscription.paymentMethod === 'Stripe' || progressState.subscription.paymentMethod === 'Promo Code') &&
    progressState.subscription.priceUSD === MEMBERSHIP.monthlyUSD
  );

  // Browser storage is a preview record unless verified by Stripe or promo code.
  const previewEnabled = import.meta.env.DEV && import.meta.env.VITE_ENABLE_OWNER_PREVIEW === 'true';
  const isPro = hasValidPaidSubscription || (previewEnabled && progressState.subscription.isPro);

  const canAccessTense = (tenseId: string): boolean => {
    if (isPro || (previewEnabled && ownerConfig.allTensesFreeMode)) return true;
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

  const subscribePro = (paymentMethod: string = 'Stripe') => {
    const today = new Date();
    const renewal = new Date();
    renewal.setMonth(today.getMonth() + 1);

    const price = MEMBERSHIP.monthlyUSD;
    const subscription: UserSubscription = {
      isPro: true,
      planName: `All-Access Pass ($${price.toFixed(2)} USD/month)`,
      priceUSD: price,
      startDate: today.toISOString(),
      renewalDate: renewal.toISOString(),
      paymentMethod,
      transactionId: (paymentMethod === 'Stripe' ? 'STRIPE-' : 'PROMO-') + Math.random().toString(36).substring(2, 9).toUpperCase()
    };

    setProgressState((prev) => ({
      ...prev,
      subscription
    }));
  };

  const subscribeWithPromoCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'PROMO599' || clean === 'VIP599' || clean === 'STRIPE599' || clean === ownerConfig.promoCodeActive?.toUpperCase()) {
      subscribePro('Promo Code');
      return true;
    }
    return false;
  };

  const cancelSubscription = () => {
    setProgressState((prev) => ({
      ...prev,
      subscription: {
        isPro: false,
        planName: 'Free Preview (2 Tenses)',
        priceUSD: MEMBERSHIP.monthlyUSD,
        startDate: null,
        renewalDate: null,
        paymentMethod: null,
        transactionId: null
      }
    }));
  };

  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('tensemaster_owner_auth') === 'true';
    } catch {
      return false;
    }
  });

  const verifyOwnerPIN = useCallback((pin: string): boolean => {
    if (!previewEnabled) return false;
    const clean = pin.trim();
    if (clean === '2026' || clean === 'admin2026' || clean === 'dueña2026') {
      setIsOwnerAuthenticated(true);
      try {
        localStorage.setItem('tensemaster_owner_auth', 'true');
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  }, [previewEnabled]);

  const logoutOwner = useCallback(() => {
    setIsOwnerAuthenticated(false);
    try {
      localStorage.removeItem('tensemaster_owner_auth');
    } catch {
      // ignore
    }
  }, []);

  const unlockOwnerAccess = () => {
    subscribePro('👑 Acceso Total Dueña (Gratuito y Vitalicio)');
  };

  const setUserName = (name: string) => {
    setProgressState((prev) => ({
      ...prev,
      userName: name.trim() || 'English Learner'
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
      if (saved) {
        const parsed = JSON.parse(saved);
        const price = MEMBERSHIP.monthlyUSD;
        const merged = {
          ...DEFAULT_OWNER_CONFIG,
          ...parsed,
          priceMonthly: price,
          allTensesFreeMode: false
        };
        delete (merged as any).originalPrice;
        delete (merged as any).discountPercent;
        try {
          localStorage.setItem(OWNER_STORAGE_KEY, JSON.stringify(merged));
        } catch {
          // ignore
        }
        return merged;
      }
    } catch (e) {
      console.error('Failed to load ownerConfig', e);
    }
    return DEFAULT_OWNER_CONFIG;
  });

  const updateOwnerConfig = (partial: Partial<OwnerBusinessConfig>) => {
    setOwnerConfig((prev) => {
      const updated = { ...prev, ...partial, priceMonthly: MEMBERSHIP.monthlyUSD };
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
        currentLangOption,
        t,
        translate,
        getTenseName,
        getTenseTagline,
        getExampleTranslation,
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
        subscribeWithPromoCode,
        cancelSubscription,
        justSubscribedNotice,
        clearSubscribedNotice: () => setJustSubscribedNotice(false),
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
        isOwnerAuthenticated,
        verifyOwnerPIN,
        logoutOwner,
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
