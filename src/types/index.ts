export type TenseGroup = 'present' | 'past' | 'future';
export type TenseAspect = 'simple' | 'continuous' | 'perfect' | 'perfect-continuous';
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export interface TenseExample {
  id: string;
  english: string;
  spanish: string;
  contextNote: string;
  audioText: string;
}

export type ExerciseDifficulty = 'basic' | 'intermediate' | 'advanced' | 'expert';

export interface ExerciseItem {
  id: string;
  type: 'multiple-choice' | 'sentence-order' | 'fill-blank' | 'pronunciation';
  prompt: string;
  hint?: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  scrambledWords?: string[];
  targetSentence?: string;
  difficulty?: ExerciseDifficulty;
}

export interface TenseData {
  id: string;
  name: string;
  spanishName: string;
  group: TenseGroup;
  aspect: TenseAspect;
  cefrLevel: CEFRLevel;
  tagline: string;
  isFreePreview: boolean; // First 2 tenses free to try without subscription
  timelineGraphic: {
    start: string;
    focus: string;
    end: string;
  };
  formula: {
    affirmative: string;
    negative: string;
    question: string;
    auxiliary: string;
    verbForm: string;
  };
  whenToUse: {
    title: string;
    description: string;
    example: string;
  }[];
  signalWords: string[];
  commonMistakes: {
    wrong: string;
    correct: string;
    why: string;
  }[];
  examples: TenseExample[];
  videoLesson: {
    title: string;
    instructor: string;
    youtubeId: string;
    duration: string;
    summary: string;
    keyTakeaways: string[];
  };
  exercises: ExerciseItem[];
}

export interface UserSubscription {
  isPro: boolean;
  planName: string;
  priceUSD: number;
  startDate: string | null;
  renewalDate: string | null;
  paymentMethod: string | null;
  transactionId: string | null;
}

export interface TenseProgress {
  tenseId: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'mastered';
  score: number;
  exercisesDone: number;
  totalExercises: number;
  lastStudiedAt: string | null;
  practiceCount: number;
}

export interface UserProgressState {
  userName: string;
  userEmail: string;
  streakDays: number;
  lastActiveDate: string;
  activeDates: string[]; // ISO date strings
  dailyGoalExercises: number; // Daily target (e.g., 3 exercises)
  todayExercisesCount: number;
  streakFreezeAvailable: boolean;
  streakFreezeUsed: boolean;
  totalXP: number;
  totalMinutesSpent: number;
  totalExercisesCompleted: number;
  subscription: UserSubscription;
  tenseProgress: Record<string, TenseProgress>;
  bookmarkedTenses: string[];
  diagnosticResult?: DiagnosticResult | null;
  dailyPaceMode?: 'relax' | 'regular' | 'intensive'; // 'relax' (3 min), 'regular' (8 min), 'intensive' (15 min)
  isDarkMode?: boolean;
}

export type CEFRFullLabel = 'A1 - Principiante' | 'A2 - Básico / Elemental' | 'B1 - Intermedio' | 'B2 - Intermedio Alto' | 'C1 - Avanzado';

export interface DiagnosticQuestion {
  id: string;
  category: string;
  level: CEFRLevel;
  tenseId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  grammarFocus: string;
}

export interface DiagnosticResult {
  cefrLevel: CEFRFullLabel;
  levelCode: CEFRLevel;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
  strongAreas: string[];
  priorityTensesToStudy: string[];
  personalizedRoadmap: string[];
  summaryFeedback: string;
  estimatedStudyTimeDays: number;
}

export interface PushReminderSettings {
  enabled: boolean;
  time: string; // e.g. "20:00"
  frequency: 'daily' | 'weekdays' | 'weekends';
  streakAlerts: boolean;
  permission: 'default' | 'granted' | 'denied' | 'unsupported';
  lastNotifiedDate?: string;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  country: string;
  flag: string;
  xp: number;
  streak: number;
  tier: 'bronze' | 'silver' | 'gold' | 'sapphire' | 'diamond';
  tensesMastered: number;
  isCurrentUser?: boolean;
}

// Forum Types
export interface ForumReply {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorLevel: string;
  authorBadge?: string;
  content: string;
  createdAt: string;
  upvotes: number;
  isAcceptedSolution?: boolean;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorAvatar: string;
  authorCountry: string;
  authorLevel: string;
  category: 'tenses' | 'common-mistakes' | 'challenges' | 'study-tips';
  tenseTag?: string;
  createdAt: string;
  upvotes: number;
  replies: ForumReply[];
  isSolved?: boolean;
  views: number;
}

// Duel Mode Types
export interface DuelQuestion {
  id: string;
  prompt: string;
  sentenceWithBlank?: string;
  tenseFocus: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface DuelOpponent {
  id: string;
  name: string;
  avatar: string;
  country: string;
  flag: string;
  level: string;
  lp: number;
  winRate: number;
  isBot?: boolean;
  accuracy: number;
}

export interface DuelStats {
  lp: number;
  division: 'Bronce' | 'Plata' | 'Oro' | 'Diamante';
  wins: number;
  losses: number;
  currentStreak: number;
  bestStreak: number;
}

// Text Analyzer Types
export interface AnalyzedTenseToken {
  id: string;
  matchedText: string;
  startIndex: number;
  endIndex: number;
  tenseId: string;
  tenseName: string;
  spanishName: string;
  aspect: TenseAspect;
  group: TenseGroup;
  cefrLevel: CEFRLevel;
  explanation: string;
  formula: string;
}

export interface TextAnalysisResult {
  totalWords: number;
  totalSentences: number;
  analyzedTokens: AnalyzedTenseToken[];
  tensesFoundCounts: Record<string, number>;
  estimatedCEFR: CEFRLevel;
  tenseVarietyScore: number;
  feedbackTips: string[];
  passiveVoiceCount: number;
}

// Verb 3-Forms Pattern Mastery Types
export type VerbPatternGroupId =
  | 'all'
  | 'untouchables'
  | 'twins'
  | 'musical'
  | 'royals'
  | 'flyers'
  | 'boomerang'
  | 'regular-rules';

export interface VerbPatternItem {
  id: string;
  base: string;          // V1 (Infinitive / Present)
  past: string;          // V2 (Past Simple)
  participle: string;    // V3 (Past Participle)
  spanish: string;       // Significado en español
  phonetic: string;      // Guía fonética
  patternGroup: VerbPatternGroupId;
  patternName: string;
  trickTip: string;      // Regla mnemotécnica para recordar
  example: {
    sentence: string;
    translation: string;
  };
  level: CEFRLevel;
  isRegular?: boolean;
}

export interface OwnerBusinessConfig {
  stripePaymentLink: string;
  mercadoPagoLink: string;
  customDomain: string;
  supportEmail: string;
  currencyCode: 'USD' | 'MXN' | 'COP' | 'EUR' | 'BRL';
  priceMonthly: number;
  promoCodeActive: string;
  allTensesFreeMode?: boolean; // When true, all 12 tenses are 100% unlocked for everyone with no paywall
}

