// Comprehensive Multilingual translations dictionary for TenseMaster
export type SupportedLanguage =
  | 'en'
  | 'es'
  | 'fr'
  | 'de'
  | 'it'
  | 'pt'
  | 'zh'
  | 'hi'
  | 'id'
  | 'vi'
  | 'tr'
  | 'ar'
  | 'ru'
  | 'ja';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
  demandTag: string;
  currencyEquiv: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', region: 'Global / International', demandTag: 'Default', currencyEquiv: '$5.99 USD' },
  { code: 'es', name: 'Español', nativeName: 'Español', flag: '🇪🇸', region: 'España & Latinoamérica', demandTag: 'Principal', currencyEquiv: '$5.99 USD' },
  { code: 'fr', name: 'Francés', nativeName: 'Français', flag: '🇫🇷', region: 'France & Francophonie', demandTag: 'Europe', currencyEquiv: '5.99 €' },
  { code: 'de', name: 'Alemán', nativeName: 'Deutsch', flag: '🇩🇪', region: 'Deutschland & DACH', demandTag: 'Europe', currencyEquiv: '5.99 €' },
  { code: 'it', name: 'Italiano', nativeName: 'Italiano', flag: '🇮🇹', region: 'Italia & Svizzera', demandTag: 'Europe', currencyEquiv: '5.99 €' },
  { code: 'pt', name: 'Português', nativeName: 'Português', flag: '🇧🇷', region: 'Brasil & Portugal', demandTag: 'Alta Demanda', currencyEquiv: 'R$ 29,90' },
  { code: 'zh', name: 'Chino', nativeName: '中文 (Chinese)', flag: '🇨🇳', region: '中国 (1.4B+)', demandTag: 'Alta Demanda Global', currencyEquiv: '¥39 / 月' },
  { code: 'hi', name: 'Indian (Hindi)', nativeName: 'हिन्दी (Indian)', flag: '🇮🇳', region: 'India (1.4B+)', demandTag: 'Alta Demanda Global', currencyEquiv: '₹499 / माह' },
  { code: 'id', name: 'Indonesio', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', region: 'Indonesia (280M+)', demandTag: 'Alta Demanda SE Asia', currencyEquiv: 'Rp 89.000 / bln' },
  { code: 'vi', name: 'Vietnamita', nativeName: 'Tiếng Việt', flag: '🇻🇳', region: 'Việt Nam (100M+)', demandTag: 'Alta Demanda Học Tiếng Anh', currencyEquiv: '149.000₫ / tháng' },
  { code: 'tr', name: 'Turco', nativeName: 'Türkçe', flag: '🇹🇷', region: 'Türkiye (85M+)', demandTag: 'Alta Demanda', currencyEquiv: '189₺ / ay' },
  { code: 'ar', name: 'Árabe', nativeName: 'العربية', flag: '🇸🇦', region: 'MENA (400M+)', demandTag: 'Alta Demanda Global', currencyEquiv: '5.99$ شهرياً' },
  { code: 'ru', name: 'Ruso', nativeName: 'Русский', flag: '🌐', region: 'Eurasia & CA (250M+)', demandTag: 'Alta Demanda', currencyEquiv: '$5.99 / мес' },
  { code: 'ja', name: 'Japonés', nativeName: '日本語', flag: '🇯🇵', region: '日本', demandTag: 'TOEIC & Gramática', currencyEquiv: '890円 / 月' }
];

export interface LocaleTranslations {
  navTenses: string;
  navMatrix: string;
  navComparator: string;
  navFlashcards: string;
  navVerbs: string;
  navDuel: string;
  navAnalyzer: string;
  navChatbot: string;
  navForum: string;
  navRankings: string;
  navProgress: string;
  navAdmin: string;
  navTools: string;
  btnPro: string;
  btnProActive: string;
  heroKicker: string;
  heroTitle: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  heroAudioCheck: string;
  heroVideoCheck: string;
  heroCertCheck: string;
  heroSubOffer: string;
  heroSubDesc: string;
  heroSubBtn: string;
  searchPlaceholder: string;
  filterAll: string;
  filterPresent: string;
  filterPast: string;
  filterFuture: string;
  catalogTitle: string;
  unlockedPreview: string;
  proPlanPrice: string;
  enterTense: string;
  unlockTense: string;
  mastered: string;
  inProgress: string;
  notStarted: string;
  formulaLabel: string;
  nativeLanguageLabel: string;
  chooseLanguage: string;

  // Matrix specific
  matrixTitle: string;
  matrixSubtitle: string;
  matrixMapTag: string;
  matrixColAspect: string;
  aspectSimple: string;
  aspectSimpleSub: string;
  aspectContinuous: string;
  aspectContinuousSub: string;
  aspectPerfect: string;
  aspectPerfectSub: string;
  aspectPerfectContinuous: string;
  aspectPerfectContinuousSub: string;
  groupPast: string;
  groupPresent: string;
  groupFuture: string;
  matrixOpenLesson: string;
  matrixUnlock: string;
  matrixListen: string;

  // Tutor / Chatbot specific
  tutorTitle: string;
  tutorSubtitle: string;
  tutorBadge: string;
  tutorScenariosTitle: string;
  tutorScenariosSubtitle: string;
  tutorVoiceOn: string;
  tutorVoiceOff: string;
  tutorTestAudio: string;
  tutorTestMic: string;
  tutorShowTrans: string;
  tutorHideTrans: string;
  tutorReset: string;
  tutorEvaluating: string;
  tutorInputPlaceholder: string;
  tutorSendHint: string;
  tutorListening: string;
  tutorLevelLabel: string;
  tutorLevelBasic: string;
  tutorLevelIntermediate: string;
  tutorLevelAdvanced: string;
  tutorActiveScenario: string;
  tutorKeyTenses: string;
  tutorVisualMemory: string;
  tutorSuggestions: string;

  // Side Menu & Common Labels
  menuTitle: string;
  menuSubtitle: string;
  menuLearningPractice: string;
  menuToolsChallenges: string;
  menuRoadmapSub: string;
  menuTutorSub: string;
  menuFlashcardsSub: string;
  menuMatrixSub: string;
  testLevel: string;
  situationalScenarios: string;
  irregularVerbs: string;
  quickPractice: string;
  offlineCenter: string;
  reminders: string;
  listenAudio: string;
  practicePronunciation: string;
  recordVoice: string;
  viewVideo: string;
  exercisesCount: string;

  // HeroBanner & Extra UI
  heroFastMethod: string;
  hero12Langs: string;
  heroGuide: string;
  heroTotalPass: string;
  heroDiscount: string;
  heroNoTricks: string;
  heroOwnerAccess: string;
  heroRecommended: string;
  heroRecommendedReason: string;
  heroDailyStreak: string;
  heroExercisesToday: string;
  heroGoal: string;

  // Modals & General Actions
  modalClose: string;
  modalContinue: string;
  modalStart: string;
  modalCancel: string;
  modalConfirm: string;
  modalBack: string;

  // Tooltips
  tooltipDarkMode: string;
  tooltipLightMode: string;
  tooltipBookmark: string;
  tooltipCopied: string;
}


export const TRANSLATIONS: Record<SupportedLanguage, LocaleTranslations> = {
  "en": {
    "navTenses": "All 12 Tenses",
    "navMatrix": "3×4 Matrix",
    "navComparator": "Comparator",
    "navFlashcards": "Flashcards",
    "navVerbs": "📖 Verb Patterns (V1/V2/V3)",
    "navDuel": "⚔️ 1v1 Arena",
    "navAnalyzer": "🔍 Analyzer",
    "navChatbot": "Guided Practice",
    "navForum": "💬 Community",
    "navRankings": "🏆 Leaderboards",
    "navProgress": "My Progress",
    "navAdmin": "Admin",
    "navTools": "Tools",
    "btnPro": "All-Access Pass",
    "btnProActive": "Pro Active",
    "heroKicker": "Direct method with zero grammar confusion",
    "heroTitle": "Master the",
    "heroTitleHighlight": "12 English Tenses",
    "heroSubtitle": "Clear formulas, real-life situational cards, native pronunciation audio, step-by-step videos, and 24/7 AI Tutor with instant feedback.",
    "heroAudioCheck": "Interactive native audio",
    "heroVideoCheck": "Step-by-step video lessons",
    "heroCertCheck": "Official certificate included",
    "heroSubOffer": "All-Access Pass (Full Course & 24/7 AI Tutor)",
    "heroSubDesc": "Unlimited access to all 12 tenses, practice exams, audio drills, and 24/7 AI Tutor. Cancel anytime in 1 click.",
    "heroSubBtn": "Get All-Access Pass",
    "searchPlaceholder": "Search by tense, formula, or example (e.g., \"Present Perfect\", \"Did\", \"Will\")...",
    "filterAll": "All (12)",
    "filterPresent": "Present (4)",
    "filterPast": "Past (4)",
    "filterFuture": "Future (4)",
    "catalogTitle": "Master Catalog of the 12 English Tenses",
    "unlockedPreview": "2 trial tenses free",
    "proPlanPrice": "Complete access for $5.99/mo",
    "enterTense": "Enter Lesson",
    "unlockTense": "Unlock",
    "mastered": "Mastered",
    "inProgress": "In Progress",
    "notStarted": "Not Started",
    "formulaLabel": "Formula:",
    "nativeLanguageLabel": "Native Language:",
    "chooseLanguage": "Choose your native language for learning support:",
    "matrixTitle": "Master 3 × 4 Grammar Matrix",
    "matrixSubtitle": "The entire English verbal system organized in an intuitive grid. Compare how verbs evolve across timelines.",
    "matrixMapTag": "The Complete Mental Map of English",
    "matrixColAspect": "Aspect / Timeline",
    "aspectSimple": "Simple",
    "aspectSimpleSub": "Point-in-time or habitual action",
    "aspectContinuous": "Continuous / Progressive",
    "aspectContinuousSub": "Ongoing action in progress",
    "aspectPerfect": "Perfect",
    "aspectPerfectSub": "Prior action with present impact",
    "aspectPerfectContinuous": "Perfect Continuous",
    "aspectPerfectContinuousSub": "Accumulated ongoing duration",
    "groupPast": "Past",
    "groupPresent": "Present",
    "groupFuture": "Future",
    "matrixOpenLesson": "Open lesson",
    "matrixUnlock": "Unlock",
    "matrixListen": "Listen to audio",
    "tutorTitle": "Your 24/7 Personal English AI Tutor",
    "tutorSubtitle": "Speak, practice, and resolve any grammar or pronunciation doubts at any time. Infinite patience, zero embarrassment, and real-time correction.",
    "tutorBadge": "24/7 AI Smart Tutor · Online Live",
    "tutorScenariosTitle": "Real-Life Practice Scenarios",
    "tutorScenariosSubtitle": "Choose the real-world setting you want to practice today:",
    "tutorVoiceOn": "Tutor Voice: Enabled (Speaks aloud)",
    "tutorVoiceOff": "Tutor Voice: Muted",
    "tutorTestAudio": "Test Speaker Audio",
    "tutorTestMic": "Test Microphone",
    "tutorShowTrans": "Show Translations",
    "tutorHideTrans": "Hide Translations",
    "tutorReset": "Reset Conversation",
    "tutorEvaluating": "Analyzing your sentence...",
    "tutorInputPlaceholder": "Type your message or response in English...",
    "tutorSendHint": "Press Enter to send, Shift+Enter for new line",
    "tutorListening": "Listening... speak now",
    "tutorLevelLabel": "Difficulty Level:",
    "tutorLevelBasic": "Beginner (A1 - A2)",
    "tutorLevelIntermediate": "Intermediate (B1 - B2)",
    "tutorLevelAdvanced": "Advanced (C1)",
    "tutorActiveScenario": "Active Scenario",
    "tutorKeyTenses": "Key Tenses",
    "tutorVisualMemory": "Visual Anchor",
    "tutorSuggestions": "Suggested responses:",
    "menuTitle": "Navigation Menu",
    "menuSubtitle": "English Grammar Master",
    "menuLearningPractice": "Learning & Practice",
    "menuToolsChallenges": "Tools & Challenges",
    "menuRoadmapSub": "12 tenses with formulas and audio",
    "menuTutorSub": "24/7 conversational coaching",
    "menuFlashcardsSub": "Spaced repetition drills",
    "menuMatrixSub": "3×4 visual comparison grid",
    "testLevel": "Placement Diagnostic",
    "situationalScenarios": "Real-Life Situations",
    "irregularVerbs": "Irregular Verb Patterns",
    "quickPractice": "Quick Drills",
    "offlineCenter": "Offline Study Center",
    "reminders": "Study Reminders",
    "listenAudio": "Listen to pronunciation",
    "practicePronunciation": "Practice pronunciation",
    "recordVoice": "Record your voice",
    "viewVideo": "Watch video lesson",
    "exercisesCount": "exercises",
    "heroFastMethod": "Accelerated fluency method",
    "hero12Langs": "Supports 13+ languages",
    "heroGuide": "Quick Guide",
    "heroTotalPass": "All-Access Pass",
    "heroDiscount": "25% OFF",
    "heroNoTricks": "Transparent pricing",
    "heroOwnerAccess": "Pro Access",
    "heroRecommended": "Recommended Learning Path",
    "heroRecommendedReason": "AI personalized next step",
    "heroDailyStreak": "Day Streak",
    "heroExercisesToday": "Exercises Today",
    "heroGoal": "Daily Goal",
    "modalClose": "Close",
    "modalContinue": "Continue",
    "modalStart": "Start",
    "modalCancel": "Cancel",
    "modalConfirm": "Confirm",
    "modalBack": "Back",
    "tooltipDarkMode": "Switch to dark mode",
    "tooltipLightMode": "Switch to light mode",
    "tooltipBookmark": "Save to bookmarks",
    "tooltipCopied": "Copied to clipboard"
  },
  "es": {
    "navTenses": "Los 12 Tiempos",
    "navMatrix": "Matriz 3×4",
    "navComparator": "Comparador",
    "navFlashcards": "Tarjetas Flash",
    "navVerbs": "📖 Verbos 3 Tiempos",
    "navDuel": "⚔️ Duelo 1v1",
    "navAnalyzer": "🔍 Analizador",
    "navChatbot": "Práctica Guiada",
    "navForum": "💬 Foro",
    "navRankings": "🏆 Rankings",
    "navProgress": "Mi Progreso",
    "navAdmin": "Administración",
    "navTools": "Herramientas",
    "btnPro": "Acceso Total",
    "btnProActive": "Pase Pro Activo",
    "heroKicker": "Método directo sin complicaciones gramaticales",
    "heroTitle": "Aprende los",
    "heroTitleHighlight": "12 Tiempos del Inglés",
    "heroSubtitle": "Fórmulas claras, situaciones de la vida diaria, audio nativo, videoclases y Tutor IA 24/7 con corrección inmediata.",
    "heroAudioCheck": "Audio nativo interactivo",
    "heroVideoCheck": "Clases en video paso a paso",
    "heroCertCheck": "Certificado oficial incluido",
    "heroSubOffer": "Pase Total por solo $5.99 USD / mes (25% OFF)",
    "heroSubDesc": "Acceso ilimitado a los 12 tiempos, exámenes, audios y Tutor IA 24/7. Cancela cuando quieras en 1 clic.",
    "heroSubBtn": "Pase Total $5.99 USD",
    "searchPlaceholder": "Buscar por tiempo, fórmula o ejemplo (ej. \"Present Perfect\", \"Did\", \"Will\")...",
    "filterAll": "Todos (12)",
    "filterPresent": "Presente (4)",
    "filterPast": "Pasado (4)",
    "filterFuture": "Futuro (4)",
    "catalogTitle": "Catálogo de los 12 Tiempos del Inglés",
    "unlockedPreview": "2 tiempos de prueba gratis",
    "proPlanPrice": "Plan completo por $5.99/mes",
    "enterTense": "Entrar",
    "unlockTense": "Desbloquear",
    "mastered": "Dominado",
    "inProgress": "En curso",
    "notStarted": "Por iniciar",
    "formulaLabel": "Fórmula:",
    "nativeLanguageLabel": "Idioma natal:",
    "chooseLanguage": "Escoge tu idioma nativo para estudiar inglés:",
    "matrixTitle": "Matriz Maestra 3 × 4 Sin Complicaciones",
    "matrixSubtitle": "Todo el sistema verbal del inglés resumido en una cuadrícula coordinada. Compara cómo cambia el mismo verbo a través del tiempo.",
    "matrixMapTag": "El Mapa Mental Completo del Inglés",
    "matrixColAspect": "Aspecto / Tiempo",
    "aspectSimple": "Simple",
    "aspectSimpleSub": "Acción puntual o habitual",
    "aspectContinuous": "Continuo / Progresivo",
    "aspectContinuousSub": "Acción en progreso duradero",
    "aspectPerfect": "Perfecto",
    "aspectPerfectSub": "Acción previa con impacto",
    "aspectPerfectContinuous": "Perfecto Continuo",
    "aspectPerfectContinuousSub": "Duración acumulada continua",
    "groupPast": "Pasado (Past)",
    "groupPresent": "Presente (Present)",
    "groupFuture": "Futuro (Future)",
    "matrixOpenLesson": "Abrir lección",
    "matrixUnlock": "Desbloquear",
    "matrixListen": "Escuchar pronunciación",
    "tutorTitle": "Tu Tutor Personal de Inglés 24/7",
    "tutorSubtitle": "Habla, practica y resuelve cualquier duda de gramática o pronunciación a cualquier hora del día o de la noche. Paciencia infinita, sin vergüenza y con corrección pedagógica en vivo.",
    "tutorBadge": "Tutor IA Asistente 24/7 · En Línea las 24 Horas",
    "tutorScenariosTitle": "Escenarios y Temas de Práctica",
    "tutorScenariosSubtitle": "Elige el contexto en el que deseas entrenar hoy:",
    "tutorVoiceOn": "Voz del Tutor: Activada (Habla en voz alta)",
    "tutorVoiceOff": "Voz del Tutor: Silenciada",
    "tutorTestAudio": "Probar Sonido",
    "tutorTestMic": "Probar Micrófono",
    "tutorShowTrans": "Ver traducciones",
    "tutorHideTrans": "Ocultar traducciones",
    "tutorReset": "Reiniciar diálogo",
    "tutorEvaluating": "El tutor está evaluando tu gramática...",
    "tutorInputPlaceholder": "Escribe tu respuesta en inglés (ej: \"I went to Spain last year\")...",
    "tutorSendHint": "Presiona Enter para enviar · Retroalimentación gramatical en tiempo real",
    "tutorListening": "🎙️ Escuchando... Habla ahora en inglés...",
    "tutorLevelLabel": "Nivel:",
    "tutorLevelBasic": "Básico",
    "tutorLevelIntermediate": "Intermedio",
    "tutorLevelAdvanced": "Avanzado",
    "tutorActiveScenario": "Escenario Activo",
    "tutorKeyTenses": "Tiempos clave:",
    "tutorVisualMemory": "Memoria Visual Activa",
    "tutorSuggestions": "Sugerencias:",
    "menuTitle": "TENSEMASTER",
    "menuSubtitle": "12 Tiempos · Método Visual Cotidiano",
    "menuLearningPractice": "Aprendizaje & Práctica",
    "menuToolsChallenges": "Herramientas & Retos",
    "menuRoadmapSub": "Ruta visual paso a paso",
    "menuTutorSub": "Práctica conversacional y corrección",
    "menuFlashcardsSub": "Repaso rápido y mnemotecnia",
    "menuMatrixSub": "Mapa comparativo integral 3×4",
    "testLevel": "Test Diagnóstico de Nivel",
    "situationalScenarios": "Situaciones de la Vida Real",
    "irregularVerbs": "Verbos Irregulares (3 formas)",
    "quickPractice": "Tarjetas Flash de Memoria",
    "offlineCenter": "Centro de Modo Offline",
    "reminders": "Recordatorios de Estudio",
    "listenAudio": "Escuchar",
    "practicePronunciation": "Practicar voz",
    "recordVoice": "Grabar Voz",
    "viewVideo": "Ver video",
    "exercisesCount": "ejercicios",
    "heroFastMethod": "Método acelerado anti-bloqueo",
    "hero12Langs": "12 Idiomas",
    "heroGuide": "Guía de Inicio",
    "heroTotalPass": "Pase Total: $5.99 USD / mes",
    "heroDiscount": "25% OFF (antes $7.99)",
    "heroNoTricks": "Tarifa fija sin trucos de 7 días · Cancela cuando quieras en 1 clic",
    "heroOwnerAccess": "👑 Acceso Dueña",
    "heroRecommended": "Ruta recomendada para ti",
    "heroRecommendedReason": "Según tu nivel y práctica diaria",
    "heroDailyStreak": "Racha de estudio",
    "heroExercisesToday": "ejercicios hoy",
    "heroGoal": "meta diaria",
    "modalClose": "Cerrar",
    "modalContinue": "Continuar",
    "modalStart": "Comenzar",
    "modalCancel": "Cancelar",
    "modalConfirm": "Confirmar",
    "modalBack": "Volver",
    "tooltipDarkMode": "Cambiar a modo oscuro",
    "tooltipLightMode": "Cambiar a modo claro",
    "tooltipBookmark": "Guardar como favorito",
    "tooltipCopied": "Copiado al portapapeles"
  },
  "it": {
    "navTenses": "I 12 Tempi",
    "navMatrix": "Matrice 3×4",
    "navComparator": "Confronto",
    "navFlashcards": "Flashcard",
    "navVerbs": "📖 Verbi 3 Tempi",
    "navDuel": "⚔️ Duello 1v1",
    "navAnalyzer": "🔍 Analizzatore",
    "navChatbot": "Pratica Guidata",
    "navForum": "💬 Forum",
    "navRankings": "🏆 Classifica",
    "navProgress": "Miei Progressi",
    "navAdmin": "Pannello Titolare",
    "navTools": "Strumenti",
    "btnPro": "Accesso Totale $5.99/mese",
    "btnProActive": "Pass Pro Attivo",
    "heroKicker": "Metodo diretto senza complicazioni grammaticali",
    "heroTitle": "Impara i",
    "heroTitleHighlight": "12 Tempi in Inglese",
    "heroSubtitle": "Formule chiare, audio nativo per ogni frase, videolezioni e Tutor IA 24/7 con correzione istantanea.",
    "heroAudioCheck": "Audio nativo interattivo",
    "heroVideoCheck": "Lezioni video passo dopo passo",
    "heroCertCheck": "Certificato ufficiale incluso",
    "heroSubOffer": "Abbonamento Totale a solo $5.99 USD / mese (25% OFF)",
    "heroSubDesc": "Accesso illimitato ai 12 tempi, quiz, audio e Tutor IA 24/7. Cancella in qualsiasi momento con 1 clic.",
    "heroSubBtn": "Pass Totale $5.99 USD",
    "searchPlaceholder": "Cerca per tempo verbale, formula o esempio (es. \"Present Perfect\", \"Did\", \"Will\")...",
    "filterAll": "Tutti (12)",
    "filterPresent": "Presente (4)",
    "filterPast": "Passato (4)",
    "filterFuture": "Futuro (4)",
    "catalogTitle": "Catalogo dei 12 Tempi Verbali Inglesi",
    "unlockedPreview": "2 tempi di prova gratuiti",
    "proPlanPrice": "Piano completo per $5.99/mese",
    "enterTense": "Entra",
    "unlockTense": "Sblocca",
    "mastered": "Padroneggiato",
    "inProgress": "In corso",
    "notStarted": "Da iniziare",
    "formulaLabel": "Formula:",
    "nativeLanguageLabel": "Lingua madre:",
    "chooseLanguage": "Scegli la tua lingua madre per imparare l’inglese:",
    "matrixTitle": "Matrice Maestra 3 × 4 Senza Complicazioni",
    "matrixSubtitle": "L'intero sistema verbale inglese riassunto in una griglia coordinata. Confronta come cambia lo stesso verbo nel tempo.",
    "matrixMapTag": "La Mappa Mentale Completa dell'Inglese",
    "matrixColAspect": "Aspetto / Tempo",
    "aspectSimple": "Semplice (Simple)",
    "aspectSimpleSub": "Azione puntuale o abituale",
    "aspectContinuous": "Continuo / Progressivo",
    "aspectContinuousSub": "Azione in corso duraturo",
    "aspectPerfect": "Perfetto (Perfect)",
    "aspectPerfectSub": "Azione precedente con impatto sul presente",
    "aspectPerfectContinuous": "Perfetto Continuo",
    "aspectPerfectContinuousSub": "Durata accumulata continua",
    "groupPast": "Passato (Past)",
    "groupPresent": "Presente (Present)",
    "groupFuture": "Futuro (Future)",
    "matrixOpenLesson": "Apri lezione",
    "matrixUnlock": "Sblocca",
    "matrixListen": "Ascolta pronuncia",
    "tutorTitle": "Il Tuo Tutor Personale d'Inglese 24/7",
    "tutorSubtitle": "Parla, fai pratica e risolvi qualsiasi dubbio di grammatica o pronuncia a qualunque ora del giorno o della notte. Pazienza infinita e correzione dal vivo.",
    "tutorBadge": "Tutor IA Assistente 24/7 · Online 24 Ore",
    "tutorScenariosTitle": "Scenari e Argomenti di Pratica",
    "tutorScenariosSubtitle": "Scegli il contesto in cui desideri allenarti oggi:",
    "tutorVoiceOn": "Voce del Tutor: Attiva (Parla ad alta voce)",
    "tutorVoiceOff": "Voce del Tutor: Disattivata",
    "tutorTestAudio": "Prova Audio",
    "tutorTestMic": "Prova Microfono",
    "tutorShowTrans": "Mostra traduzioni",
    "tutorHideTrans": "Nascondi traduzioni",
    "tutorReset": "Riavvia conversazione",
    "tutorEvaluating": "Il tutor sta valutando la tua grammatica...",
    "tutorInputPlaceholder": "Scrivi la tua risposta in inglese (es: \"I went to Spain last year\")...",
    "tutorSendHint": "Premi Invio per inviare · Correzione grammaticale in tempo reale",
    "tutorListening": "🎙️ In ascolto... Parla ora in inglese...",
    "tutorLevelLabel": "Livello:",
    "tutorLevelBasic": "Base",
    "tutorLevelIntermediate": "Intermedio",
    "tutorLevelAdvanced": "Avanzato",
    "tutorActiveScenario": "Scenario Attivo",
    "tutorKeyTenses": "Tempi chiave:",
    "tutorVisualMemory": "Memoria Visiva Attiva",
    "tutorSuggestions": "Suggerimenti:",
    "menuTitle": "TENSEMASTER",
    "menuSubtitle": "12 Tempi · Metodo Visivo Quotidiano",
    "menuLearningPractice": "Apprendimento & Pratica",
    "menuToolsChallenges": "Strumenti & Sfide",
    "menuRoadmapSub": "Percorso visivo passo dopo passo",
    "menuTutorSub": "Pratica di conversazione e correzione",
    "menuFlashcardsSub": "Ripasso rapido e mnemonica",
    "menuMatrixSub": "Mappa comparativa completa 3×4",
    "testLevel": "Test Diagnostico di Livello",
    "situationalScenarios": "Situazioni di Vita Reale",
    "irregularVerbs": "Verbi Irregolari (3 forme)",
    "quickPractice": "Flashcard di Memoria",
    "offlineCenter": "Centro Modalità Offline",
    "reminders": "Promemoria di Studio",
    "listenAudio": "Ascolta",
    "practicePronunciation": "Esercitati con la voce",
    "recordVoice": "Registra Voce",
    "viewVideo": "Guarda video",
    "exercisesCount": "esercizi",
    "heroFastMethod": "Metodo rapido anti-blocco",
    "hero12Langs": "12 Lingue",
    "heroGuide": "Guida Rapida",
    "heroTotalPass": "Pass Totale: $5.99 USD / mese",
    "heroDiscount": "25% SCONTO (era $7.99)",
    "heroNoTricks": "Tariffa fissa e trasparente · Disdici quando vuoi con 1 clic",
    "heroOwnerAccess": "👑 Accesso Proprietario",
    "heroRecommended": "Percorso consigliato per te",
    "heroRecommendedReason": "In base al tuo livello e pratica",
    "heroDailyStreak": "Serie di studio",
    "heroExercisesToday": "esercizi oggi",
    "heroGoal": "obiettivo giornaliero",
    "modalClose": "Chiudi",
    "modalContinue": "Continua",
    "modalStart": "Inizia",
    "modalCancel": "Annulla",
    "modalConfirm": "Conferma",
    "modalBack": "Indietro",
    "tooltipDarkMode": "Passa alla modalità scura",
    "tooltipLightMode": "Passa alla modalità chiara",
    "tooltipBookmark": "Salva come preferito",
    "tooltipCopied": "Copiato negli appunti"
  },
  "fr": {
    "navTenses": "Les 12 Temps",
    "navMatrix": "Matrice 3×4",
    "navComparator": "Comparateur",
    "navFlashcards": "Cartes Mémoire",
    "navVerbs": "📖 Verbes 3 Temps",
    "navDuel": "⚔️ Duel 1v1",
    "navAnalyzer": "🔍 Analyseur",
    "navChatbot": "Pratique Guidée",
    "navForum": "💬 Forum",
    "navRankings": "🏆 Classement",
    "navProgress": "Mes Progrès",
    "navAdmin": "Panneau Propriétaire",
    "navTools": "Outils",
    "btnPro": "Accès Total $5.99/mois",
    "btnProActive": "Pass Pro Actif",
    "heroKicker": "Méthode directe sans complications grammaticales",
    "heroTitle": "Maîtrisez les",
    "heroTitleHighlight": "12 Temps en Anglais",
    "heroSubtitle": "Formules limpides, audio natif sur chaque exemple, cours vidéo et Tuteur IA 24h/24 avec correction immédiate.",
    "heroAudioCheck": "Audio natif interactif",
    "heroVideoCheck": "Cours vidéo pas à pas",
    "heroCertCheck": "Certificat officiel inclus",
    "heroSubOffer": "Abonnement Total pour seulement $5.99 USD / mois (25% OFF)",
    "heroSubDesc": "Accès illimité aux 12 temps, quiz, fichiers audio et Tuteur IA 24h/24. Résiliez à tout moment en 1 clic.",
    "heroSubBtn": "Pass Total $5.99 USD",
    "searchPlaceholder": "Rechercher par temps, formule ou exemple (ex : \"Present Perfect\", \"Did\", \"Will\")...",
    "filterAll": "Tous (12)",
    "filterPresent": "Présent (4)",
    "filterPast": "Passé (4)",
    "filterFuture": "Futur (4)",
    "catalogTitle": "Catalogue des 12 Temps de l’Anglais",
    "unlockedPreview": "2 temps gratuits à l’essai",
    "proPlanPrice": "Plan complet pour $5.99/mois",
    "enterTense": "Ouvrir",
    "unlockTense": "Débloquer",
    "mastered": "Maîtrisé",
    "inProgress": "En cours",
    "notStarted": "Non commencé",
    "formulaLabel": "Formule :",
    "nativeLanguageLabel": "Langue maternelle :",
    "chooseLanguage": "Choisissez votre langue maternelle pour apprendre l’anglais :",
    "matrixTitle": "Matrice Maîtresse 3 × 4 Sans Complications",
    "matrixSubtitle": "Tout le système verbal anglais résumé dans une grille coordonnée. Comparez comment le même verbe évolue à travers le temps.",
    "matrixMapTag": "La Carte Mentale Complète de l’Anglais",
    "matrixColAspect": "Aspect / Temps",
    "aspectSimple": "Simple",
    "aspectSimpleSub": "Action ponctuelle ou habituelle",
    "aspectContinuous": "Continu / Progressif",
    "aspectContinuousSub": "Action en cours de déroulement",
    "aspectPerfect": "Parfait / Perfect",
    "aspectPerfectSub": "Action antérieure ayant un impact sur le présent",
    "aspectPerfectContinuous": "Parfait Continu",
    "aspectPerfectContinuousSub": "Durée continue accumulée",
    "groupPast": "Passé (Past)",
    "groupPresent": "Présent (Present)",
    "groupFuture": "Futur (Future)",
    "matrixOpenLesson": "Ouvrir la leçon",
    "matrixUnlock": "Débloquer",
    "matrixListen": "Écouter la prononciation",
    "tutorTitle": "Votre Tuteur d’Anglais Personnel 24h/24",
    "tutorSubtitle": "Parlez, pratiquez et posez toutes vos questions de grammaire ou de prononciation à toute heure du jour et de la nuit. Patience infinie et correction pédagogique en direct.",
    "tutorBadge": "Tuteur IA Assistant 24h/24 · En ligne 24h/24",
    "tutorScenariosTitle": "Scénarios et Thèmes de Pratique",
    "tutorScenariosSubtitle": "Choisissez le contexte dans lequel vous souhaitez vous entraîner aujourd’hui :",
    "tutorVoiceOn": "Voix du Tuteur : Activée (Parle à voix haute)",
    "tutorVoiceOff": "Voix du Tuteur : Coupée",
    "tutorTestAudio": "Tester le Son",
    "tutorTestMic": "Tester le Micro",
    "tutorShowTrans": "Voir les traductions",
    "tutorHideTrans": "Masquer les traductions",
    "tutorReset": "Réinitialiser le dialogue",
    "tutorEvaluating": "Le tuteur analyse votre grammaire...",
    "tutorInputPlaceholder": "Écrivez votre réponse en anglais (ex : \"I went to Spain last year\")...",
    "tutorSendHint": "Appuyez sur Entrée pour envoyer · Correction grammaticale en temps réel",
    "tutorListening": "🎙️ Écoute en cours... Parlez maintenant en anglais...",
    "tutorLevelLabel": "Niveau :",
    "tutorLevelBasic": "Débutant",
    "tutorLevelIntermediate": "Intermédiaire",
    "tutorLevelAdvanced": "Avancé",
    "tutorActiveScenario": "Scénario Actif",
    "tutorKeyTenses": "Temps clés :",
    "tutorVisualMemory": "Mémoire Visuelle Active",
    "tutorSuggestions": "Suggestions :",
    "menuTitle": "TENSEMASTER",
    "menuSubtitle": "12 Temps · Méthode Visuelle Quotidienne",
    "menuLearningPractice": "Apprentissage & Pratique",
    "menuToolsChallenges": "Outils & Défis",
    "menuRoadmapSub": "Parcours visuel pas à pas",
    "menuTutorSub": "Pratique de conversation et correction",
    "menuFlashcardsSub": "Révision rapide et mnémotechnique",
    "menuMatrixSub": "Carte comparative complète 3×4",
    "testLevel": "Test Diagnostique de Niveau",
    "situationalScenarios": "Situations de la Vie Réelle",
    "irregularVerbs": "Verbes Irréguliers (3 formes)",
    "quickPractice": "Cartes Mémoire Flash",
    "offlineCenter": "Centre Mode Hors-Ligne",
    "reminders": "Rappels d’Étude",
    "listenAudio": "Écouter",
    "practicePronunciation": "Pratiquer la voix",
    "recordVoice": "Enregistrer la voix",
    "viewVideo": "Voir la vidéo",
    "exercisesCount": "exercices",
    "heroFastMethod": "Méthode accélérée anti-blocage",
    "hero12Langs": "12 Langues",
    "heroGuide": "Guide de Démarrage",
    "heroTotalPass": "Pass Total: $5.99 USD / mois",
    "heroDiscount": "25% DE RÉDUCTION (au lieu de 7,99$)",
    "heroNoTricks": "Tarif fixe sans piège · Résiliez quand vous voulez en 1 clic",
    "heroOwnerAccess": "👑 Accès Propriétaire",
    "heroRecommended": "Parcours recommandé pour vous",
    "heroRecommendedReason": "Selon votre niveau et votre pratique",
    "heroDailyStreak": "Série d’études",
    "heroExercisesToday": "exercices aujourd’hui",
    "heroGoal": "objectif quotidien",
    "modalClose": "Fermer",
    "modalContinue": "Continuer",
    "modalStart": "Commencer",
    "modalCancel": "Annuler",
    "modalConfirm": "Confirmer",
    "modalBack": "Retour",
    "tooltipDarkMode": "Passer au mode sombre",
    "tooltipLightMode": "Passer au mode clair",
    "tooltipBookmark": "Enregistrer dans les favoris",
    "tooltipCopied": "Copié dans le presse-papier"
  },
  "de": {
    "navTenses": "Die 12 Zeiten",
    "navMatrix": "Matrix 3×4",
    "navComparator": "Vergleich",
    "navFlashcards": "Karteikarten",
    "navVerbs": "📖 Verben 3 Formen",
    "navDuel": "⚔️ Duell 1v1",
    "navAnalyzer": "🔍 Textanalyse",
    "navChatbot": "Geführte Übung",
    "navForum": "💬 Forum",
    "navRankings": "🏆 Bestenliste",
    "navProgress": "Mein Fortschritt",
    "navAdmin": "Inhaber-Dashboard",
    "navTools": "Werkzeuge",
    "btnPro": "Gesamtzugang $5.99/Monat",
    "btnProActive": "Pro-Pass Aktiv",
    "heroKicker": "Direkte Methode ohne Grammatik-Frust",
    "heroTitle": "Lerne die",
    "heroTitleHighlight": "12 Englischen Zeitformen",
    "heroSubtitle": "Klare Formeln, muttersprachliches Audio bei jedem Beispielsatz, Videolektionen und 24/7 KI-Tutor mit Sofort-Feedback.",
    "heroAudioCheck": "Interaktives Audio",
    "heroVideoCheck": "Schritt-für-Schritt Videos",
    "heroCertCheck": "Offizielles Zertifikat inklusive",
    "heroSubOffer": "Vollzugang für nur $5.99 USD / Monat (25% Rabatt)",
    "heroSubDesc": "Unbegrenzter Zugang zu allen 12 Zeiten, Tests, Audios und 24/7 KI-Tutor. Jederzeit mit 1 Klick kündbar.",
    "heroSubBtn": "Gesamtpass $5.99 USD",
    "searchPlaceholder": "Suche nach Zeitform, Formel oder Beispiel (z. B. \"Present Perfect\", \"Did\", \"Will\")...",
    "filterAll": "Alle (12)",
    "filterPresent": "Gegenwart (4)",
    "filterPast": "Vergangenheit (4)",
    "filterFuture": "Zukunft (4)",
    "catalogTitle": "Katalog der 12 Englischen Zeiten",
    "unlockedPreview": "2 Zeiten kostenlos testen",
    "proPlanPrice": "Komplettpaket für $5.99/Monat",
    "enterTense": "Öffnen",
    "unlockTense": "Freischalten",
    "mastered": "Gemeistert",
    "inProgress": "In Bearbeitung",
    "notStarted": "Nicht begonnen",
    "formulaLabel": "Formel:",
    "nativeLanguageLabel": "Muttersprache:",
    "chooseLanguage": "Wähle deine Muttersprache zum Englischlernen:",
    "matrixTitle": "Meister-Matrix 3 × 4 Ohne Komplikationen",
    "matrixSubtitle": "Das gesamte englische Verbensystem in einem koordinierten Raster. Vergleiche, wie sich dasselbe Verb über die Zeit verändert.",
    "matrixMapTag": "Die Vollständige Mindmap des Englischen",
    "matrixColAspect": "Aspekt / Zeit",
    "aspectSimple": "Einfach (Simple)",
    "aspectSimpleSub": "Punktuelle oder regelmäßige Handlung",
    "aspectContinuous": "Verlauf (Continuous)",
    "aspectContinuousSub": "Handlung im dauerhaften Verlauf",
    "aspectPerfect": "Perfekt (Perfect)",
    "aspectPerfectSub": "Vorzeitige Handlung mit Auswirkung auf das Jetzt",
    "aspectPerfectContinuous": "Perfekt Verlauf (Perfect Continuous)",
    "aspectPerfectContinuousSub": "Laufende akkumulierte Dauer",
    "groupPast": "Vergangenheit (Past)",
    "groupPresent": "Gegenwart (Present)",
    "groupFuture": "Zukunft (Future)",
    "matrixOpenLesson": "Lektion öffnen",
    "matrixUnlock": "Freischalten",
    "matrixListen": "Aussprache anhören",
    "tutorTitle": "Dein Persönlicher 24/7 Englisch-Tutor",
    "tutorSubtitle": "Sprich, übe und kläre jede Grammatik- oder Aussprachefrage zu jeder Tages- und Nachtzeit. Unendliche Geduld und Live-Korrektur.",
    "tutorBadge": "KI-Assistent Tutor 24/7 · Rund um die Uhr online",
    "tutorScenariosTitle": "Szenarien & Übungsthemen",
    "tutorScenariosSubtitle": "Wähle den Kontext, in dem du heute trainieren möchtest:",
    "tutorVoiceOn": "Tutor-Stimme: Aktiviert (Liest laut vor)",
    "tutorVoiceOff": "Tutor-Stimme: Stummgeschaltet",
    "tutorTestAudio": "Ton testen",
    "tutorTestMic": "Mikrofon testen",
    "tutorShowTrans": "Übersetzungen anzeigen",
    "tutorHideTrans": "Übersetzungen ausblenden",
    "tutorReset": "Gespräch neu starten",
    "tutorEvaluating": "Der Tutor überprüft deine Grammatik...",
    "tutorInputPlaceholder": "Schreibe deine Antwort auf Englisch (z. B. \"I went to Spain last year\")...",
    "tutorSendHint": "Drücke Enter zum Senden · Grammatik-Feedback in Echtzeit",
    "tutorListening": "🎙️ Hört zu... Sprich jetzt auf Englisch...",
    "tutorLevelLabel": "Niveau:",
    "tutorLevelBasic": "Grundstufe",
    "tutorLevelIntermediate": "Mittelstufe",
    "tutorLevelAdvanced": "Fortgeschritten",
    "tutorActiveScenario": "Aktives Szenario",
    "tutorKeyTenses": "Schlüsselzeiten:",
    "tutorVisualMemory": "Visuelles Gedächtnis Aktiv",
    "tutorSuggestions": "Vorschläge:",
    "menuTitle": "TENSEMASTER",
    "menuSubtitle": "12 Zeiten · Visuelle Methode",
    "menuLearningPractice": "Lernen & Üben",
    "menuToolsChallenges": "Werkzeuge & Herausforderungen",
    "menuRoadmapSub": "Schritt-für-Schritt visueller Pfad",
    "menuTutorSub": "Konversationspraxis und Korrektur",
    "menuFlashcardsSub": "Schnellwiederholung und Gedächtnisstützen",
    "menuMatrixSub": "Umfassende 3×4 Vergleichskarte",
    "testLevel": "Einstufungstest",
    "situationalScenarios": "Echte Alltagssituationen",
    "irregularVerbs": "Unregelmäßige Verben (3 Formen)",
    "quickPractice": "Karteikarten",
    "offlineCenter": "Offline-Modus",
    "reminders": "Lern-Erinnerungen",
    "listenAudio": "Anhören",
    "practicePronunciation": "Aussprache üben",
    "recordVoice": "Stimme aufnehmen",
    "viewVideo": "Video ansehen",
    "exercisesCount": "Übungen",
    "heroFastMethod": "Beschleunigte Methode ohne Blockaden",
    "hero12Langs": "12 Sprachen",
    "heroGuide": "Startanleitung",
    "heroTotalPass": "Gesamtpass: $5.99 USD / Monat",
    "heroDiscount": "25% Rabatt (vorher $7.99)",
    "heroNoTricks": "Fester transparenter Tarif · Jederzeit mit 1 Klick kündbar",
    "heroOwnerAccess": "👑 Inhaber-Zugang",
    "heroRecommended": "Empfohlener Lernpfad für dich",
    "heroRecommendedReason": "Basierend auf deinem Niveau und deiner täglichen Übung",
    "heroDailyStreak": "Lernserie",
    "heroExercisesToday": "Übungen heute",
    "heroGoal": "Tagesziel",
    "modalClose": "Schließen",
    "modalContinue": "Fortfahren",
    "modalStart": "Starten",
    "modalCancel": "Abbrechen",
    "modalConfirm": "Bestätigen",
    "modalBack": "Zurück",
    "tooltipDarkMode": "In den Dunkelmodus wechseln",
    "tooltipLightMode": "In den Hellmodus wechseln",
    "tooltipBookmark": "Als Lesezeichen speichern",
    "tooltipCopied": "In die Zwischenablage kopiert"
  },
  "pt": {
    "navTenses": "Os 12 Tempos",
    "navMatrix": "Matriz 3×4",
    "navComparator": "Comparador",
    "navFlashcards": "Flashcards",
    "navVerbs": "📖 Verbos 3 Tempos",
    "navDuel": "⚔️ Duelo 1v1",
    "navAnalyzer": "🔍 Analisador",
    "navChatbot": "Prática Guiada",
    "navForum": "💬 Fórum",
    "navRankings": "🏆 Rankings",
    "navProgress": "Meu Progresso",
    "navAdmin": "Painel da Dona",
    "navTools": "Ferramentas",
    "btnPro": "Acesso Total $5.99/mês",
    "btnProActive": "Passe Pro Ativo",
    "heroKicker": "Método direto sem complicações gramaticais",
    "heroTitle": "Aprenda os",
    "heroTitleHighlight": "12 Tempos do Inglês",
    "heroSubtitle": "Fórmulas claras, situações da vida diária, áudio nativo em cada exemplo, videoaulas e Tutor IA 24/7 com correção imediata.",
    "heroAudioCheck": "Áudio nativo interativo",
    "heroVideoCheck": "Aulas em vídeo passo a passo",
    "heroCertCheck": "Certificado oficial incluso",
    "heroSubOffer": "Assinatura Total por apenas $5.99 USD / mês (25% OFF)",
    "heroSubDesc": "Acesso ilimitado aos 12 tempos, testes, áudios e Tutor IA 24/7. Cancele quando quiser em 1 clique.",
    "heroSubBtn": "Passe Total $5.99 USD",
    "searchPlaceholder": "Buscar por tempo verbal, fórmula ou exemplo (ex: \"Present Perfect\", \"Did\", \"Will\")...",
    "filterAll": "Todos (12)",
    "filterPresent": "Presente (4)",
    "filterPast": "Passado (4)",
    "filterFuture": "Futuro (4)",
    "catalogTitle": "Catálogo dos 12 Tempos Verbais em Inglês",
    "unlockedPreview": "2 tempos grátis para testar",
    "proPlanPrice": "Plano completo por $5.99/mês",
    "enterTense": "Entrar",
    "unlockTense": "Desbloquear",
    "mastered": "Dominado",
    "inProgress": "Em andamento",
    "notStarted": "Não iniciado",
    "formulaLabel": "Fórmula:",
    "nativeLanguageLabel": "Idioma nativo:",
    "chooseLanguage": "Escolha seu idioma nativo para aprender inglês:",
    "matrixTitle": "Matriz Mestra 3 × 4 Sem Complicações",
    "matrixSubtitle": "Todo o sistema verbal do inglês resumido em uma grade coordenada. Compare como o mesmo verbo muda ao longo do tempo.",
    "matrixMapTag": "O Mapa Mental Completo do Inglês",
    "matrixColAspect": "Aspecto / Tempo",
    "aspectSimple": "Simples",
    "aspectSimpleSub": "Ação pontual ou habitual",
    "aspectContinuous": "Contínuo / Progressivo",
    "aspectContinuousSub": "Ação em progresso contínuo",
    "aspectPerfect": "Perfeito",
    "aspectPerfectSub": "Ação prévia com impacto no agora",
    "aspectPerfectContinuous": "Perfeito Contínuo",
    "aspectPerfectContinuousSub": "Duração contínua acumulada",
    "groupPast": "Passado (Past)",
    "groupPresent": "Presente (Present)",
    "groupFuture": "Futuro (Future)",
    "matrixOpenLesson": "Abrir lição",
    "matrixUnlock": "Desbloquear",
    "matrixListen": "Ouvir pronúncia",
    "tutorTitle": "Seu Tutor Pessoal de Inglês 24/7",
    "tutorSubtitle": "Fale, pratique e tire dúvidas de gramática ou pronúncia a qualquer hora do dia ou da noite. Paciência infinita e correção pedagógica ao vivo.",
    "tutorBadge": "Tutor IA Assistente 24/7 · Online 24 Horas",
    "tutorScenariosTitle": "Cenários e Temas de Prática",
    "tutorScenariosSubtitle": "Escolha o contexto em que deseja treinar hoje:",
    "tutorVoiceOn": "Voz do Tutor: Ativada (Fala em voz alta)",
    "tutorVoiceOff": "Voz do Tutor: Silenciada",
    "tutorTestAudio": "Testar Som",
    "tutorTestMic": "Testar Microfone",
    "tutorShowTrans": "Ver traduções",
    "tutorHideTrans": "Ocultar traduções",
    "tutorReset": "Reiniciar diálogo",
    "tutorEvaluating": "O tutor está avaliando sua gramática...",
    "tutorInputPlaceholder": "Escreva sua resposta em inglês (ex: \"I went to Spain last year\")...",
    "tutorSendHint": "Pressione Enter para enviar · Feedback gramatical em tempo real",
    "tutorListening": "🎙️ Ouvindo... Fale agora em inglês...",
    "tutorLevelLabel": "Nível:",
    "tutorLevelBasic": "Básico",
    "tutorLevelIntermediate": "Intermediário",
    "tutorLevelAdvanced": "Avançado",
    "tutorActiveScenario": "Cenário Ativo",
    "tutorKeyTenses": "Tempos-chave:",
    "tutorVisualMemory": "Memória Visual Ativa",
    "tutorSuggestions": "Sugestões:",
    "menuTitle": "TENSEMASTER",
    "menuSubtitle": "12 Tempos · Método Visual Cotidiano",
    "menuLearningPractice": "Aprendizado & Prática",
    "menuToolsChallenges": "Ferramentas & Desafios",
    "menuRoadmapSub": "Trilha visual passo a passo",
    "menuTutorSub": "Prática de conversação e correção",
    "menuFlashcardsSub": "Revisão rápida e mnemônica",
    "menuMatrixSub": "Mapa comparativo completo 3×4",
    "testLevel": "Teste de Nível",
    "situationalScenarios": "Situações da Vida Real",
    "irregularVerbs": "Verbos Irregulares (3 formas)",
    "quickPractice": "Flashcards de Memória",
    "offlineCenter": "Centro Modo Offline",
    "reminders": "Lembretes de Estudo",
    "listenAudio": "Ouvir",
    "practicePronunciation": "Praticar pronúncia",
    "recordVoice": "Gravar Voz",
    "viewVideo": "Ver vídeo",
    "exercisesCount": "exercícios",
    "heroFastMethod": "Método acelerado anti-bloqueio",
    "hero12Langs": "12 Idiomas",
    "heroGuide": "Guia de Início",
    "heroTotalPass": "Passe Total: $5.99 USD / mês",
    "heroDiscount": "25% OFF (antes $7.99)",
    "heroNoTricks": "Tarifa fixa sem pegadinhas · Cancele quando quiser com 1 clique",
    "heroOwnerAccess": "👑 Acesso Dona",
    "heroRecommended": "Trilha recomendada para você",
    "heroRecommendedReason": "De acordo com seu nível e prática",
    "heroDailyStreak": "Sequência de estudos",
    "heroExercisesToday": "exercícios hoje",
    "heroGoal": "meta diária",
    "modalClose": "Fechar",
    "modalContinue": "Continuar",
    "modalStart": "Começar",
    "modalCancel": "Cancelar",
    "modalConfirm": "Confirmar",
    "modalBack": "Voltar",
    "tooltipDarkMode": "Mudar para modo escuro",
    "tooltipLightMode": "Mudar para modo claro",
    "tooltipBookmark": "Salvar como favorito",
    "tooltipCopied": "Copiado para a área de transferência"
  },
  "zh": {
    "navTenses": "12个英语时态",
    "navMatrix": "3×4时态矩阵",
    "navComparator": "时态对比",
    "navFlashcards": "记忆抽认卡",
    "navVerbs": "📖 不规则动词3态",
    "navDuel": "⚔️ 1v1答题对决",
    "navAnalyzer": "🔍 句子时态分析",
    "navChatbot": "引导练习",
    "navForum": "💬 学习论坛",
    "navRankings": "🏆 排行榜",
    "navProgress": "我的学习进度",
    "navAdmin": "管理后台",
    "navTools": "学习工具",
    "btnPro": "全功能仅需$5.99/月",
    "btnProActive": "Pro会员生效中",
    "heroKicker": "简单直观的教学法，告别死记硬背",
    "heroTitle": "轻松掌握",
    "heroTitleHighlight": "英语全部12种时态",
    "heroSubtitle": "清晰公式、纯正母语发音音频、精选视频讲解与实时互动纠错练习。",
    "heroAudioCheck": "母语级互动发音",
    "heroVideoCheck": "循序渐进视频课程",
    "heroCertCheck": "含官方结业证书",
    "heroSubOffer": "每月仅需 $5.99 美元，畅享全部内容",
    "heroSubDesc": "无限制学习全部12时态、测试、音频和证书。随时1键取消。",
    "heroSubBtn": "全权限通行证 $5.99 USD",
    "searchPlaceholder": "搜索时态、公式或例句（例如 \"Present Perfect\", \"Did\", \"Will\"）...",
    "filterAll": "全部 (12)",
    "filterPresent": "现在时态 (4)",
    "filterPast": "过去时态 (4)",
    "filterFuture": "将来时态 (4)",
    "catalogTitle": "英语全部12时态学习大纲",
    "unlockedPreview": "免费体验2个时态",
    "proPlanPrice": "完整课程仅需 $5.99/月",
    "enterTense": "进入学习",
    "unlockTense": "解锁时态",
    "mastered": "已掌握",
    "inProgress": "学习中",
    "notStarted": "未开始",
    "formulaLabel": "语法公式:",
    "nativeLanguageLabel": "母语语言:",
    "chooseLanguage": "选择您的母语以更高效学习英语:",
    "matrixTitle": "3 × 4 简明时态全景矩阵",
    "matrixSubtitle": "一览无余的英语动词系统坐标网格。直观横向与纵向对比同一动词随时态的精准演变。",
    "matrixMapTag": "英语完整思维导图",
    "matrixColAspect": "时态特征 / 维度",
    "aspectSimple": "一般时态 (Simple)",
    "aspectSimpleSub": "日常惯常或特定动作",
    "aspectContinuous": "进行时态 (Continuous)",
    "aspectContinuousSub": "处于持续进程中的动作",
    "aspectPerfect": "完成时态 (Perfect)",
    "aspectPerfectSub": "对当下产生影响的先前动作",
    "aspectPerfectContinuous": "完成进行时 (Perfect Continuous)",
    "aspectPerfectContinuousSub": "持续累积的时长动作",
    "groupPast": "过去时 (Past)",
    "groupPresent": "现在时 (Present)",
    "groupFuture": "将来时 (Future)",
    "matrixOpenLesson": "进入课程",
    "matrixUnlock": "立即解锁",
    "matrixListen": "播放纯正发音",
    "tutorTitle": "您的24/7专属英语私教",
    "tutorSubtitle": "随时随地对话练习，解答任何语法与发音难点。无限耐心、零尴尬负担、全天候即时语法诊断。",
    "tutorBadge": "AI专属私教 · 24小时在线",
    "tutorScenariosTitle": "情景对话演练场景",
    "tutorScenariosSubtitle": "选择您今天想沉浸式练习的主题：",
    "tutorVoiceOn": "外教发音：已开启（大声朗读）",
    "tutorVoiceOff": "外教发音：已静音",
    "tutorTestAudio": "测试扬声器",
    "tutorTestMic": "测试麦克风",
    "tutorShowTrans": "显示中文翻译",
    "tutorHideTrans": "隐藏翻译",
    "tutorReset": "重新开始对话",
    "tutorEvaluating": "导师正在分析您的语法...",
    "tutorInputPlaceholder": "用英语输入您的回答（例如：\"I went to Spain last year\"）...",
    "tutorSendHint": "按回车发送 · 毫秒级语法与时态智能反馈",
    "tutorListening": "🎙️ 倾听中... 请现在开始用英语说话...",
    "tutorLevelLabel": "难度级别：",
    "tutorLevelBasic": "初级",
    "tutorLevelIntermediate": "中级",
    "tutorLevelAdvanced": "高级",
    "tutorActiveScenario": "当前实训场景",
    "tutorKeyTenses": "核心训练时态：",
    "tutorVisualMemory": "视觉记忆强化",
    "tutorSuggestions": "参考表达：",
    "menuTitle": "TENSEMASTER",
    "menuSubtitle": "12大时态 · 视觉实景记忆法",
    "menuLearningPractice": "系统教学与练习",
    "menuToolsChallenges": "强化工具与对决",
    "menuRoadmapSub": "图解循序渐进路径",
    "menuTutorSub": "外教对话纠错训练",
    "menuFlashcardsSub": "闪卡强化与速记",
    "menuMatrixSub": "3×4立体全景对比",
    "testLevel": "水平摸底测试",
    "situationalScenarios": "生活真景例句库",
    "irregularVerbs": "不规则动词表 (V1, V2, V3)",
    "quickPractice": "抽认记忆卡",
    "offlineCenter": "离线学习中心",
    "reminders": "每日学习提醒",
    "listenAudio": "听发音",
    "practicePronunciation": "口语跟读",
    "recordVoice": "录音跟读",
    "viewVideo": "观看视频",
    "exercisesCount": "道练习题",
    "heroFastMethod": "高效防遗忘速成法",
    "hero12Langs": "支持12种语言",
    "heroGuide": "快速入门指南",
    "heroTotalPass": "全通畅学卡: $5.99 USD / 月",
    "heroDiscount": "限时 75 折 (原价 $7.99)",
    "heroNoTricks": "固定透明资费 · 随时可一键取消",
    "heroOwnerAccess": "👑 创作者权限",
    "heroRecommended": "智能推荐学习路径",
    "heroRecommendedReason": "基于您的当前水平和薄弱环节",
    "heroDailyStreak": "连续打卡",
    "heroExercisesToday": "今日已练题数",
    "heroGoal": "每日目标",
    "modalClose": "关闭",
    "modalContinue": "继续",
    "modalStart": "开始学习",
    "modalCancel": "取消",
    "modalConfirm": "确认",
    "modalBack": "返回",
    "tooltipDarkMode": "切换为深色模式",
    "tooltipLightMode": "切换为浅色模式",
    "tooltipBookmark": "收藏此内容",
    "tooltipCopied": "已成功复制到剪贴板"
  },
  "hi": {
    "navTenses": "सभी 12 काल (Tenses)",
    "navMatrix": "3×4 मैट्रिक्स",
    "navComparator": "तुलना (Compare)",
    "navFlashcards": "फ्लैशकार्ड्स",
    "navVerbs": "📖 क्रिया के 3 रूप",
    "navDuel": "⚔️ 1v1 मुकाबला",
    "navAnalyzer": "🔍 वाक्य विश्लेषक",
    "navChatbot": "निर्देशित अभ्यास",
    "navForum": "💬 चर्चा मंच",
    "navRankings": "🏆 लीडरबोर्ड",
    "navProgress": "मेरी प्रगति",
    "navAdmin": "व्यवस्थापक पैनल",
    "navTools": "उपकरण",
    "btnPro": "पूर्ण पहुंच $5.99/माह",
    "btnProActive": "प्रो पास सक्रिय",
    "heroKicker": "सरल और सीधा तरीका बिना किसी व्याकरण के तनाव के",
    "heroTitle": "आसानी से सीखें",
    "heroTitleHighlight": "अंग्रेजी के सभी 12 काल (Tenses)",
    "heroSubtitle": "स्पष्ट सूत्र, हर उदाहरण पर मूल उच्चारण ऑडियो, वीडियो कक्षाएं और 24/7 AI ट्यूटर के साथ तुरंत सुधार।",
    "heroAudioCheck": "नेचुरल ऑडियो उच्चारण",
    "heroVideoCheck": "स्टेप-बाय-स्टेप वीडियो",
    "heroCertCheck": "सत्यापित प्रमाणपत्र शामिल",
    "heroSubOffer": "केवल $5.99 USD / माह में असीमित पहुंच",
    "heroSubDesc": "सभी 12 काल, अभ्यास, ऑडियो और प्रमाणपत्र तक पूर्ण पहुंच। 1 क्लिक में कभी भी रद्द करें।",
    "heroSubBtn": "टोटल पास $5.99 USD",
    "searchPlaceholder": "काल, सूत्र या उदाहरण से खोजें (जैसे \"Present Perfect\", \"Did\", \"Will\")...",
    "filterAll": "सभी (12)",
    "filterPresent": "वर्तमान (4)",
    "filterPast": "भूतकाल (4)",
    "filterFuture": "भविष्य (4)",
    "catalogTitle": "अंग्रेजी के 12 कालों की संपूर्ण सूची",
    "unlockedPreview": "2 काल मुफ्त ट्रायल में",
    "proPlanPrice": "पूरा कोर्स केवल $5.99/माह",
    "enterTense": "सीखें",
    "unlockTense": "अनलॉक करें",
    "mastered": "सिख लिया",
    "inProgress": "जारी है",
    "notStarted": "शुरू नहीं हुआ",
    "formulaLabel": "सूत्र (Formula):",
    "nativeLanguageLabel": "मातृभाषा:",
    "chooseLanguage": "अंग्रेजी सीखने के लिए अपनी मूल भाषा चुनें:",
    "matrixTitle": "3 × 4 मास्टर टेंस मैट्रिक्स",
    "matrixSubtitle": "एक सुव्यवस्थित ग्रिड में अंग्रेजी काल प्रणाली। देखें कि एक ही क्रिया समय के साथ कैसे बदलती है।",
    "matrixMapTag": "अंग्रेजी का संपूर्ण माइंड मैप",
    "matrixColAspect": "पहलू / समय",
    "aspectSimple": "सरल (Simple)",
    "aspectSimpleSub": "नियमित या तात्कालिक कार्य",
    "aspectContinuous": "जारी (Continuous)",
    "aspectContinuousSub": "लगातार चल रहा कार्य",
    "aspectPerfect": "पूर्ण (Perfect)",
    "aspectPerfectSub": "वर्तमान पर प्रभाव वाला पुराना कार्य",
    "aspectPerfectContinuous": "पूर्ण निरंतर (Perfect Continuous)",
    "aspectPerfectContinuousSub": "लंबे समय से लगातार चल रहा कार्य",
    "groupPast": "भूतकाल (Past)",
    "groupPresent": "वर्तमान (Present)",
    "groupFuture": "भविष्य (Future)",
    "matrixOpenLesson": "पाठ खोलें",
    "matrixUnlock": "अनलॉक करें",
    "matrixListen": "उच्चारण सुनें",
    "tutorTitle": "आपका व्यक्तिगत 24/7 इंग्लिश ट्यूटर",
    "tutorSubtitle": "बिना किसी झिझक के कभी भी अंग्रेजी में बात करें, सवाल पूछें और लाइव व्याकरण सुधार पाएं।",
    "tutorBadge": "AI ट्यूटर सहायक 24/7 · हर समय ऑनलाइन",
    "tutorScenariosTitle": "अभ्यास परिदृश्य और विषय",
    "tutorScenariosSubtitle": "वह संदर्भ चुनें जिसमें आप आज अभ्यास करना चाहते हैं:",
    "tutorVoiceOn": "आवाज: चालू (जोर से पढ़ें)",
    "tutorVoiceOff": "आवाज: बंद",
    "tutorTestAudio": "ऑडियो टेस्ट करें",
    "tutorTestMic": "माइक टेस्ट करें",
    "tutorShowTrans": "अनुवाद देखें",
    "tutorHideTrans": "अनुवाद छुपाएं",
    "tutorReset": "संवाद रीसेट करें",
    "tutorEvaluating": "ट्यूटर व्याकरण की जांच कर रहा है...",
    "tutorInputPlaceholder": "अंग्रेजी में अपना उत्तर लिखें...",
    "tutorSendHint": "भेजने के लिए Enter दबाएं · लाइव फीडबैक",
    "tutorListening": "🎙️ सुन रहा हूँ... अब अंग्रेजी में बोलें...",
    "tutorLevelLabel": "स्तर:",
    "tutorLevelBasic": "शुरुआती",
    "tutorLevelIntermediate": "मध्यम",
    "tutorLevelAdvanced": "उन्नत",
    "tutorActiveScenario": "सक्रिय परिदृश्य",
    "tutorKeyTenses": "प्रमुख काल:",
    "tutorVisualMemory": "दृश्य स्मृति सक्रिय",
    "tutorSuggestions": "सुझाव:",
    "menuTitle": "TENSEMASTER",
    "menuSubtitle": "12 काल · दृश्य विधि",
    "menuLearningPractice": "सीखना और अभ्यास",
    "menuToolsChallenges": "उपकरण और चुनौतियाँ",
    "menuRoadmapSub": "कदम-दर-कदम दृश्य मार्ग",
    "menuTutorSub": "बातचीत अभ्यास और सुधार",
    "menuFlashcardsSub": "तेज़ पुनरावृत्ति",
    "menuMatrixSub": "3×4 तुलनात्मक नक्शा",
    "testLevel": "स्तर परीक्षण",
    "situationalScenarios": "दैनिक जीवन की स्थितियां",
    "irregularVerbs": "अनियमित क्रियाएं (3 रूप)",
    "quickPractice": "फ्लैशकार्ड",
    "offlineCenter": "ऑफलाइन मोड",
    "reminders": "अध्ययन रिमाइंडर",
    "listenAudio": "सुनें",
    "practicePronunciation": "उच्चारण अभ्यास",
    "recordVoice": "आवाज रिकॉर्ड करें",
    "viewVideo": "वीडियो देखें",
    "exercisesCount": "अभ्यास",
    "heroFastMethod": "आसान और त्वरित पद्धति",
    "hero12Langs": "12 भाषाएँ",
    "heroGuide": "शुरुआती गाइड",
    "heroTotalPass": "टोटल पास: $5.99 USD / माह",
    "heroDiscount": "25% छूट (पहले $7.99)",
    "heroNoTricks": "पारदर्शी दर · 1 क्लिक में कभी भी रद्द करें",
    "heroOwnerAccess": "👑 स्वामी पहुंच",
    "heroRecommended": "आपके लिए अनुशंसित मार्ग",
    "heroRecommendedReason": "आपके स्तर और अभ्यास के आधार पर",
    "heroDailyStreak": "दैनिक स्ट्रीक",
    "heroExercisesToday": "आज के अभ्यास",
    "heroGoal": "दैनिक लक्ष्य",
    "modalClose": "बंद करें",
    "modalContinue": "जारी रखें",
    "modalStart": "शुरू करें",
    "modalCancel": "रद्द करें",
    "modalConfirm": "पुष्टि करें",
    "modalBack": "पीछे",
    "tooltipDarkMode": "डार्क मोड चालू करें",
    "tooltipLightMode": "लाइट मोड चालू करें",
    "tooltipBookmark": "बुकमार्क करें",
    "tooltipCopied": "क्लिपबोर्ड पर कॉपी किया गया"
  },
  "id": {
    "navTenses": "12 Tenses Lengkap",
    "navMatrix": "Matriks 3×4",
    "navComparator": "Komparator",
    "navFlashcards": "Kartu Flash",
    "navVerbs": "📖 3 Bentuk Kata Kerja",
    "navDuel": "⚔️ Duel 1v1",
    "navAnalyzer": "🔍 Analisis Kalimat",
    "navChatbot": "Latihan Terpandu",
    "navForum": "💬 Forum Belajar",
    "navRankings": "🏆 Peringkat",
    "navProgress": "Progres Saya",
    "navAdmin": "Panel Admin",
    "navTools": "Alat Belajar",
    "btnPro": "Akses Penuh $5.99/bln",
    "btnProActive": "Akses Pro Aktif",
    "heroKicker": "Metode langsung tanpa pusing aturan tata bahasa rumit",
    "heroTitle": "Kuasai Semua",
    "heroTitleHighlight": "12 Tenses Bahasa Inggris",
    "heroSubtitle": "Rumus praktis, audio penutur asli di setiap contoh, video pembelajaran dan Tutor AI 24/7 dengan koreksi langsung.",
    "heroAudioCheck": "Audio asli interaktif",
    "heroVideoCheck": "Video langkah demi langkah",
    "heroCertCheck": "Sertifikat resmi termasuk",
    "heroSubOffer": "Berlangganan Penuh Hanya $5.99 USD / bulan",
    "heroSubDesc": "Akses tanpa batas ke 12 tenses, kuis, audio dan Tutor AI 24/7. Batalkan kapan saja dalam 1 klik.",
    "heroSubBtn": "Pass Penuh $5.99 USD",
    "searchPlaceholder": "Cari berdasarkan tense, rumus atau contoh (mis. \"Present Perfect\", \"Did\", \"Will\")...",
    "filterAll": "Semua (12)",
    "filterPresent": "Present (4)",
    "filterPast": "Past (4)",
    "filterFuture": "Future (4)",
    "catalogTitle": "Katalog 12 Tenses Bahasa Inggris",
    "unlockedPreview": "2 tenses gratis dicoba",
    "proPlanPrice": "Paket lengkap hanya $5.99/bln",
    "enterTense": "Buka",
    "unlockTense": "Buka Kunci",
    "mastered": "Dikuasai",
    "inProgress": "Dipelajari",
    "notStarted": "Belum Mulai",
    "formulaLabel": "Rumus:",
    "nativeLanguageLabel": "Bahasa Asal:",
    "chooseLanguage": "Pilih bahasa ibu Anda untuk belajar bahasa Inggris:",
    "matrixTitle": "Matriks Utama 3 × 4 Tanpa Rumit",
    "matrixSubtitle": "Seluruh sistem kata kerja bahasa Inggris dirangkum dalam kisi koordinat. Bandingkan bagaimana kata kerja yang sama berubah.",
    "matrixMapTag": "Peta Pikiran Lengkap Bahasa Inggris",
    "matrixColAspect": "Aspek / Waktu",
    "aspectSimple": "Simple",
    "aspectSimpleSub": "Aksi rutin atau faktual",
    "aspectContinuous": "Continuous / Sedang Berlangsung",
    "aspectContinuousSub": "Aksi dalam proses berkelanjutan",
    "aspectPerfect": "Perfect / Telah Selesai",
    "aspectPerfectSub": "Aksi lampau dengan dampak ke saat ini",
    "aspectPerfectContinuous": "Perfect Continuous",
    "aspectPerfectContinuousSub": "Durasi aksi berkesinambungan",
    "groupPast": "Lampau (Past)",
    "groupPresent": "Sekarang (Present)",
    "groupFuture": "Masa Depan (Future)",
    "matrixOpenLesson": "Buka materi",
    "matrixUnlock": "Buka kunci",
    "matrixListen": "Dengar pelafalan",
    "tutorTitle": "Tutor Bahasa Inggris Pribadi 24/7 Anda",
    "tutorSubtitle": "Bicara, berlatih, dan tanyakan tata bahasa atau pelafalan kapan saja. Sabar tanpa batas dan koreksi langsung.",
    "tutorBadge": "Tutor AI Asisten 24/7 · Online 24 Jam",
    "tutorScenariosTitle": "Skenario & Topik Latihan",
    "tutorScenariosSubtitle": "Pilih konteks yang ingin Anda latih hari ini:",
    "tutorVoiceOn": "Suara Tutor: Aktif",
    "tutorVoiceOff": "Suara Tutor: Hening",
    "tutorTestAudio": "Tes Audio",
    "tutorTestMic": "Tes Mikrofon",
    "tutorShowTrans": "Tampilkan terjemahan",
    "tutorHideTrans": "Sembunyikan terjemahan",
    "tutorReset": "Reset percakapan",
    "tutorEvaluating": "Tutor sedang memeriksa tata bahasa Anda...",
    "tutorInputPlaceholder": "Tulis jawaban Anda dalam bahasa Inggris...",
    "tutorSendHint": "Tekan Enter untuk kirim · Koreksi langsung",
    "tutorListening": "🎙️ Mendengarkan... Bicara sekarang dalam bahasa Inggris...",
    "tutorLevelLabel": "Tingkat:",
    "tutorLevelBasic": "Dasar",
    "tutorLevelIntermediate": "Menengah",
    "tutorLevelAdvanced": "Lanjutan",
    "tutorActiveScenario": "Skenario Aktif",
    "tutorKeyTenses": "Tenses kunci:",
    "tutorVisualMemory": "Memori Visual Aktif",
    "tutorSuggestions": "Saran:",
    "menuTitle": "TENSEMASTER",
    "menuSubtitle": "12 Tenses · Metode Visual Sehari-hari",
    "menuLearningPractice": "Pembelajaran & Latihan",
    "menuToolsChallenges": "Alat & Tantangan",
    "menuRoadmapSub": "Panduan visual langkah demi langkah",
    "menuTutorSub": "Latihan percakapan & koreksi langsung",
    "menuFlashcardsSub": "Ulasan cepat & mnemonik",
    "menuMatrixSub": "Peta perbandingan 3×4",
    "testLevel": "Tes Tingkat Kemampuan",
    "situationalScenarios": "Situasi Kehidupan Nyata",
    "irregularVerbs": "Kata Kerja Tak Beraturan (3 bentuk)",
    "quickPractice": "Kartu Memori Flashcard",
    "offlineCenter": "Pusat Mode Offline",
    "reminders": "Pengingat Belajar",
    "listenAudio": "Dengarkan",
    "practicePronunciation": "Latih pelafalan",
    "recordVoice": "Rekam Suara",
    "viewVideo": "Tonton video",
    "exercisesCount": "latihan",
    "heroFastMethod": "Metode kilat anti-bingung",
    "hero12Langs": "12 Bahasa",
    "heroGuide": "Panduan Memulai",
    "heroTotalPass": "Pass Total: $5.99 USD / bln",
    "heroDiscount": "Diskon 25% (sebelumnya $7.99)",
    "heroNoTricks": "Tarif pasti tanpa jebakan · Batalkan kapan saja",
    "heroOwnerAccess": "👑 Akses Pemilik",
    "heroRecommended": "Jalur belajar rekomendasi Anda",
    "heroRecommendedReason": "Berdasarkan tingkat dan latihan harian Anda",
    "heroDailyStreak": "Hari Beruntun",
    "heroExercisesToday": "latihan hari ini",
    "heroGoal": "target harian",
    "modalClose": "Tutup",
    "modalContinue": "Lanjutkan",
    "modalStart": "Mulai",
    "modalCancel": "Batal",
    "modalConfirm": "Konfirmasi",
    "modalBack": "Kembali",
    "tooltipDarkMode": "Beralih ke mode gelap",
    "tooltipLightMode": "Beralih ke mode terang",
    "tooltipBookmark": "Simpan ke favorit",
    "tooltipCopied": "Disalin ke papan klip"
  },
  "vi": {
    "navTenses": "12 Thì Tiếng Anh",
    "navMatrix": "Ma trận 3×4",
    "navComparator": "So sánh thì",
    "navFlashcards": "Flashcard",
    "navVerbs": "📖 Động từ 3 cột",
    "navDuel": "⚔️ Đấu trí 1v1",
    "navAnalyzer": "🔍 Phân tích câu",
    "navChatbot": "Luyện tập có hướng dẫn",
    "navForum": "💬 Diễn đàn",
    "navRankings": "🏆 Bảng xếp hạng",
    "navProgress": "Tiến độ của tôi",
    "navAdmin": "Bảng quản trị",
    "navTools": "Công cụ học tập",
    "btnPro": "Truy cập trọn gói $5.99/tháng",
    "btnProActive": "Gói Pro đang bật",
    "heroKicker": "Phương pháp trực diện, hiểu sâu bản chất ngữ pháp",
    "heroTitle": "Chinh phục toàn diện",
    "heroTitleHighlight": "12 Thì Trong Tiếng Anh",
    "heroSubtitle": "Công thức rõ ràng, phát âm bản xứ từng câu, bài giảng video và Gia sư AI 24/7 sửa lỗi tức thì.",
    "heroAudioCheck": "Phát âm giọng bản xứ",
    "heroVideoCheck": "Video hướng dẫn chi tiết",
    "heroCertCheck": "Bao gồm chứng chỉ hoàn thành",
    "heroSubOffer": "Gói trọn gói chỉ $5.99 USD / tháng",
    "heroSubDesc": "Học không giới hạn 12 thì, bài tập luyện tập, phát âm và Gia sư AI 24/7. Hủy bất cứ lúc nào.",
    "heroSubBtn": "Gói Trọn Gói $5.99 USD",
    "searchPlaceholder": "Tìm kiếm thì, công thức hoặc ví dụ (VD: \"Present Perfect\", \"Did\", \"Will\")...",
    "filterAll": "Tất cả (12)",
    "filterPresent": "Hiện tại (4)",
    "filterPast": "Quá khứ (4)",
    "filterFuture": "Tương lai (4)",
    "catalogTitle": "Danh mục 12 Thì Tiếng Anh Chuẩn",
    "unlockedPreview": "Học thử 2 thì miễn phí",
    "proPlanPrice": "Trọn gói chỉ $5.99/tháng",
    "enterTense": "Vào học",
    "unlockTense": "Mở khóa",
    "mastered": "Đã thành thạo",
    "inProgress": "Đang học",
    "notStarted": "Chưa học",
    "formulaLabel": "Công thức:",
    "nativeLanguageLabel": "Ngôn ngữ mẹ đẻ:",
    "chooseLanguage": "Chọn tiếng mẹ đẻ để học tiếng Anh dễ dàng hơn:",
    "matrixTitle": "Ma Trận Tổng Quan 3 × 4 Tối Giản",
    "matrixSubtitle": "Toàn bộ hệ thống động từ tiếng Anh được hệ thống hóa trong lưới tọa độ. So sánh cách biến đổi thì.",
    "matrixMapTag": "Bản Đồ Tư Duy Tiếng Anh Hoàn Chỉnh",
    "matrixColAspect": "Thể / Thời gian",
    "aspectSimple": "Đơn (Simple)",
    "aspectSimpleSub": "Hành động tức thời hoặc thường nhật",
    "aspectContinuous": "Tiếp diễn (Continuous)",
    "aspectContinuousSub": "Hành động đang trong quá trình diễn ra",
    "aspectPerfect": "Hoàn thành (Perfect)",
    "aspectPerfectSub": "Hành động đã qua có kết quả tới hiện tại",
    "aspectPerfectContinuous": "Hoàn thành Tiếp diễn",
    "aspectPerfectContinuousSub": "Quá trình kéo dài liên tục tích lũy",
    "groupPast": "Quá khứ (Past)",
    "groupPresent": "Hiện tại (Present)",
    "groupFuture": "Tương lai (Future)",
    "matrixOpenLesson": "Mở bài học",
    "matrixUnlock": "Mở khóa",
    "matrixListen": "Nghe phát âm",
    "tutorTitle": "Gia Sư Tiếng Anh AI Riêng 24/7",
    "tutorSubtitle": "Luyện giao tiếp, giải đáp ngữ pháp và chỉnh phát âm bất kể ngày đêm. Kiên nhẫn tuyệt đối và sửa lỗi trực tiếp.",
    "tutorBadge": "Gia sư AI 24/7 · Trực tuyến 24 giờ",
    "tutorScenariosTitle": "Tình Huống & Chủ Đề Luyện Tập",
    "tutorScenariosSubtitle": "Chọn ngữ cảnh bạn muốn nhập vai luyện tập hôm nay:",
    "tutorVoiceOn": "Giọng gia sư: Đang bật",
    "tutorVoiceOff": "Giọng gia sư: Đã tắt",
    "tutorTestAudio": "Kiểm tra loa",
    "tutorTestMic": "Kiểm tra mic",
    "tutorShowTrans": "Hiện bản dịch",
    "tutorHideTrans": "Ẩn bản dịch",
    "tutorReset": "Làm mới đoạn chat",
    "tutorEvaluating": "Gia sư đang phân tích ngữ pháp của bạn...",
    "tutorInputPlaceholder": "Nhập câu trả lời bằng tiếng Anh...",
    "tutorSendHint": "Nhấn Enter để gửi · Phản hồi ngữ pháp tức thì",
    "tutorListening": "🎙️ Đang lắng nghe... Hãy nói tiếng Anh ngay...",
    "tutorLevelLabel": "Cấp độ:",
    "tutorLevelBasic": "Cơ bản",
    "tutorLevelIntermediate": "Trung cấp",
    "tutorLevelAdvanced": "Nâng cao",
    "tutorActiveScenario": "Tình huống hiện tại",
    "tutorKeyTenses": "Thì trọng tâm:",
    "tutorVisualMemory": "Bộ nhớ hình ảnh kích hoạt",
    "tutorSuggestions": "Gợi ý:",
    "menuTitle": "TENSEMASTER",
    "menuSubtitle": "12 Thì · Phương Pháp Trực Quan Đời Sống",
    "menuLearningPractice": "Học tập & Thực hành",
    "menuToolsChallenges": "Công cụ & Thử thách",
    "menuRoadmapSub": "Lộ trình trực quan từng bước",
    "menuTutorSub": "Luyện giao tiếp & sửa lỗi trực tiếp",
    "menuFlashcardsSub": "Ôn tập nhanh với thẻ ghi nhớ",
    "menuMatrixSub": "Ma trận đối chiếu 3×4",
    "testLevel": "Kiểm tra trình độ",
    "situationalScenarios": "Tình huống thực tế",
    "irregularVerbs": "Động từ bất quy tắc (3 dạng)",
    "quickPractice": "Thẻ ghi nhớ Flashcard",
    "offlineCenter": "Trung tâm ngoại tuyến",
    "reminders": "Nhắc nhở học tập",
    "listenAudio": "Nghe",
    "practicePronunciation": "Luyện phát âm",
    "recordVoice": "Thu âm",
    "viewVideo": "Xem video",
    "exercisesCount": "bài tập",
    "heroFastMethod": "Phương pháp siêu tốc không quên",
    "hero12Langs": "Hỗ trợ 12 ngôn ngữ",
    "heroGuide": "Hướng dẫn bắt đầu",
    "heroTotalPass": "Vé Trọn Gói: $5.99 USD / tháng",
    "heroDiscount": "Giảm 25% (giá cũ $7.99)",
    "heroNoTricks": "Mức giá minh bạch · Hủy bất cứ lúc nào",
    "heroOwnerAccess": "👑 Quyền Tác Giả",
    "heroRecommended": "Lộ trình gợi ý cho bạn",
    "heroRecommendedReason": "Dựa trên trình độ và kết quả luyện tập",
    "heroDailyStreak": "Chuỗi ngày học liên tục",
    "heroExercisesToday": "bài tập hôm nay",
    "heroGoal": "mục tiêu ngày",
    "modalClose": "Đóng",
    "modalContinue": "Tiếp tục",
    "modalStart": "Bắt đầu",
    "modalCancel": "Hủy",
    "modalConfirm": "Xác nhận",
    "modalBack": "Quay lại",
    "tooltipDarkMode": "Chuyển sang chế độ tối",
    "tooltipLightMode": "Chuyển sang chế độ sáng",
    "tooltipBookmark": "Lưu vào mục yêu thích",
    "tooltipCopied": "Đã sao chép vào bộ nhớ tạm"
  },
  "tr": {
    "navTenses": "12 İngilizce Zaman",
    "navMatrix": "3×4 Zaman Matrisi",
    "navComparator": "Zaman Kıyaslayıcı",
    "navFlashcards": "Bilgi Kartları",
    "navVerbs": "📖 Düzensiz Fiiller (V1-V2-V3)",
    "navDuel": "⚔️ 1v1 Düello",
    "navAnalyzer": "🔍 Cümle Analizi",
    "navChatbot": "Rehberli Alıştırma",
    "navForum": "💬 Topluluk Forumu",
    "navRankings": "🏆 Liderlik Tablosu",
    "navProgress": "İlerlemem",
    "navAdmin": "Yönetici Paneli",
    "navTools": "Araçlar",
    "btnPro": "Tam Erişim $5.99/ay",
    "btnProActive": "Pro Aktif",
    "heroKicker": "Gereksiz kafa karışıklığı olmadan doğrudan pratik yöntem",
    "heroTitle": "Kolayca Öğrenin:",
    "heroTitleHighlight": "12 İngilizce Zaman Kipi",
    "heroSubtitle": "Net formüller, her örnekte ana dili seslendirmesi, video dersler ve 24/7 AI Eğitmen desteği.",
    "heroAudioCheck": "Doğal telaffuz sesi",
    "heroVideoCheck": "Adım adım video dersler",
    "heroCertCheck": "Resmi sertifika dahil",
    "heroSubOffer": "Aylık Sadece $5.99 USD ile Tam Erişim",
    "heroSubDesc": "Tüm 12 zamana, testlere, seslere ve 24/7 AI eğitmene sınırsız erişim. İstediğin an iptal et.",
    "heroSubBtn": "Tam Erişim $5.99 USD",
    "searchPlaceholder": "Zaman, formül veya örnek ara (örn. \"Present Perfect\", \"Did\", \"Will\")...",
    "filterAll": "Tümü (12)",
    "filterPresent": "Şimdiki/Geniş (4)",
    "filterPast": "Geçmiş (4)",
    "filterFuture": "Gelecek (4)",
    "catalogTitle": "12 İngilizce Zaman Kılavuzu",
    "unlockedPreview": "2 zaman ücretsiz deneme",
    "proPlanPrice": "Tam paket $5.99/ay",
    "enterTense": "İncele",
    "unlockTense": "Kilidi Aç",
    "mastered": "Tamamlandı",
    "inProgress": "Devam Ediyor",
    "notStarted": "Başlanmadı",
    "formulaLabel": "Formül:",
    "nativeLanguageLabel": "Ana dil:",
    "chooseLanguage": "İngilizce öğrenmek için ana dilinizi seçin:",
    "matrixTitle": "Zahmetsiz 3 × 4 Zaman Matrisi",
    "matrixSubtitle": "Tüm İngilizce zaman yapısı koordineli bir tabloda. Aynı fiilin zamanla değişimini kıyaslayın.",
    "matrixMapTag": "İngilizcenin Tam Zihin Haritası",
    "matrixColAspect": "Görünüş / Zaman",
    "aspectSimple": "Basit (Simple)",
    "aspectSimpleSub": "Düzenli veya anlık eylem",
    "aspectContinuous": "Sürekli (Continuous)",
    "aspectContinuousSub": "Süreç halindeki eylem",
    "aspectPerfect": "Tamamlanmış (Perfect)",
    "aspectPerfectSub": "Şimdiki zamana etkisi süren geçmiş eylem",
    "aspectPerfectContinuous": "Sürekli Tamamlanmış",
    "aspectPerfectContinuousSub": "Kesintisiz birikimli süre",
    "groupPast": "Geçmiş (Past)",
    "groupPresent": "Şimdiki/Geniş (Present)",
    "groupFuture": "Gelecek (Future)",
    "matrixOpenLesson": "Dersi aç",
    "matrixUnlock": "Kilidi aç",
    "matrixListen": "Telaffuzu dinle",
    "tutorTitle": "7/24 Kişisel İngilizce Eğitmeniniz",
    "tutorSubtitle": "İstediğiniz an çekinmeden konuşun, pratik yapın ve anında pedagojik düzeltme alın.",
    "tutorBadge": "Yapay Zeka Eğitmen 7/24 · Her An Çevrim İçi",
    "tutorScenariosTitle": "Pratik Senaryoları & Konular",
    "tutorScenariosSubtitle": "Bugün pratik yapmak istediğiniz ortamı seçin:",
    "tutorVoiceOn": "Ses: Açık",
    "tutorVoiceOff": "Ses: Kapalı",
    "tutorTestAudio": "Sesi Test Et",
    "tutorTestMic": "Mikrofonu Test Et",
    "tutorShowTrans": "Çevirileri göster",
    "tutorHideTrans": "Çevirileri gizle",
    "tutorReset": "Diyaloğu sıfırla",
    "tutorEvaluating": "Eğitmen dilbilginizi değerlendiriyor...",
    "tutorInputPlaceholder": "Cevabınızı İngilizce yazın...",
    "tutorSendHint": "Göndermek için Enter'a basın · Anında geri bildirim",
    "tutorListening": "🎙️ Dinliyor... Şimdi İngilizce konuşun...",
    "tutorLevelLabel": "Seviye:",
    "tutorLevelBasic": "Temel",
    "tutorLevelIntermediate": "Orta",
    "tutorLevelAdvanced": "İleri",
    "tutorActiveScenario": "Aktif Senaryo",
    "tutorKeyTenses": "Anahtar zamanlar:",
    "tutorVisualMemory": "Görsel Hafıza Aktif",
    "tutorSuggestions": "Öneriler:",
    "menuTitle": "TENSEMASTER",
    "menuSubtitle": "12 Zaman · Görsel Günlük Metot",
    "menuLearningPractice": "Öğrenme & Pratik",
    "menuToolsChallenges": "Araçlar & Meydan Okumalar",
    "menuRoadmapSub": "Adım adım görsel rota",
    "menuTutorSub": "Konuşma pratiği ve canlı düzeltme",
    "menuFlashcardsSub": "Hızlı tekrar kartları",
    "menuMatrixSub": "3×4 kıyaslama haritası",
    "testLevel": "Seviye Belirleme Sınavı",
    "situationalScenarios": "Gerçek Hayat Durumları",
    "irregularVerbs": "Düzensiz Fiiller (3 Hal)",
    "quickPractice": "Hafıza Kartları",
    "offlineCenter": "Çevrim Dışı Mod",
    "reminders": "Çalışma Hatırlatıcıları",
    "listenAudio": "Dinle",
    "practicePronunciation": "Telaffuz çalış",
    "recordVoice": "Ses Kaydet",
    "viewVideo": "Videoyu izle",
    "exercisesCount": "alıştırma",
    "heroFastMethod": "Zihinsel Blokajları Kıran Hızlı Yöntem",
    "hero12Langs": "12 Dil Desteği",
    "heroGuide": "Başlangıç Rehberi",
    "heroTotalPass": "Tam Erişim: $5.99 USD / ay",
    "heroDiscount": "%25 İndirim (Eski fiyat $7.99)",
    "heroNoTricks": "Net sabit tarife · İstediğin an 1 tıkla iptal et",
    "heroOwnerAccess": "👑 Kurucu Erişimi",
    "heroRecommended": "Sizin İçin Önerilen Öğrenme Rotası",
    "heroRecommendedReason": "Seviyenize ve günlük çalışmanıza göre",
    "heroDailyStreak": "Çalışma Serisi",
    "heroExercisesToday": "bugün yapılan alıştırma",
    "heroGoal": "günlük hedef",
    "modalClose": "Kapat",
    "modalContinue": "Devam Et",
    "modalStart": "Başla",
    "modalCancel": "İptal",
    "modalConfirm": "Onayla",
    "modalBack": "Geri",
    "tooltipDarkMode": "Karanlık moda geç",
    "tooltipLightMode": "Aydınlık moda geç",
    "tooltipBookmark": "Favorilere ekle",
    "tooltipCopied": "Panoya kopyalandı"
  },
  "ar": {
    "navTenses": "الأزمنة الـ 12",
    "navMatrix": "مصفوفة 3×4",
    "navComparator": "مقارنة الأزمنة",
    "navFlashcards": "البطاقات التعليمية",
    "navVerbs": "📖 تصريف الأفعال الثلاثي",
    "navDuel": "⚔️ مبارزة 1 ضد 1",
    "navAnalyzer": "🔍 محلل الجمل",
    "navChatbot": "ممارسة موجهة",
    "navForum": "💬 المنتدى",
    "navRankings": "🏆 لوحة الشرف",
    "navProgress": "تقدمي التعليمي",
    "navAdmin": "لوحة الإدارة",
    "navTools": "أدوات التعلم",
    "btnPro": "وصول كامل بـ 5.99$/شهرياً",
    "btnProActive": "اشتراك برو مفعل",
    "heroKicker": "طريقة مباشرة وبسيطة لاحتراف قواعد الإنجليزية",
    "heroTitle": "أتقن جميع",
    "heroTitleHighlight": "أزمنة اللغة الإنجليزية الـ 12",
    "heroSubtitle": "قواعد وصيغ واضحة، نطق صوتي أصلي لكل مثال، شروحات فيديو ومعلم ذكاء اصطناعي 24/7 مع تصحيح فوري.",
    "heroAudioCheck": "نطق صوتي طبيعي واحترافي",
    "heroVideoCheck": "فيديوهات شرح خطوة بخطوة",
    "heroCertCheck": "شهادة إتمام معتمدة",
    "heroSubOffer": "اشتراك شامل بـ 5.99 دولار أمريكي فقط شهرياً",
    "heroSubDesc": "وصول غير محدود لكافة الأزمنة والاختبارات والأصوات والمعلم الذكي. إلغاء بنقرة واحدة في أي وقت.",
    "heroSubBtn": "تصريح الوصول الكامل 5.99$ USD",
    "searchPlaceholder": "ابحث بالزمن أو الصيغة أو المثال (مثل \"Present Perfect\", \"Did\", \"Will\")...",
    "filterAll": "الكل (12)",
    "filterPresent": "الحاضر (4)",
    "filterPast": "الماضي (4)",
    "filterFuture": "المستقبل (4)",
    "catalogTitle": "دليل أزمنة اللغة الإنجليزية الـ 12",
    "unlockedPreview": "زمنان مجاناً للتجربة",
    "proPlanPrice": "الخطة الكاملة بـ 5.99$/شهر",
    "enterTense": "دخول",
    "unlockTense": "فتح القفل",
    "mastered": "متقن",
    "inProgress": "قيد التعلم",
    "notStarted": "لم يبدأ",
    "formulaLabel": "القاعدة / الصيغة:",
    "nativeLanguageLabel": "اللغة الأم:",
    "chooseLanguage": "اختر لغتك الأم لتعلم اللغة الإنجليزية بسهولة:",
    "matrixTitle": "مصفوفة الأزمنة الشاملة 3 × 4",
    "matrixSubtitle": "نظام أفعال اللغة الإنجليزية بالكامل ملخص في جدول منسق. قارن تصريف الفعل الواحد عبر الزمن.",
    "matrixMapTag": "الخريطة الذهنية الكاملة للإنجليزية",
    "matrixColAspect": "المظهر / الزمن",
    "aspectSimple": "بسيط (Simple)",
    "aspectSimpleSub": "فعل معتاد أو فوري",
    "aspectContinuous": "مستمر (Continuous)",
    "aspectContinuousSub": "فعل مستمر في الحدوث",
    "aspectPerfect": "تام (Perfect)",
    "aspectPerfectSub": "فعل ماضٍ مرتبط بالحاضر",
    "aspectPerfectContinuous": "تام مستمر (Perfect Continuous)",
    "aspectPerfectContinuousSub": "فترة زمنية مستمرة متراكمة",
    "groupPast": "الماضي (Past)",
    "groupPresent": "الحاضر (Present)",
    "groupFuture": "المستقبل (Future)",
    "matrixOpenLesson": "فتح الدرس",
    "matrixUnlock": "فتح القفل",
    "matrixListen": "استمع للنطق",
    "tutorTitle": "معلمك الإنجليزي الشخصي على مدار الساعة",
    "tutorSubtitle": "تحدث وتدرب واطرح أي استفسار في أي وقت دون حرج، مع صبر لا ينفد وتصحيح لغوي فوري.",
    "tutorBadge": "معلم ذكاء اصطناعي 24/7 · متاح على مدار الساعة",
    "tutorScenariosTitle": "سيناريوهات ومواضيع المحادثة",
    "tutorScenariosSubtitle": "اختر السياق الذي ترغب في التدرب عليه اليوم:",
    "tutorVoiceOn": "صوت المعلم: مفعل",
    "tutorVoiceOff": "صوت المعلم: مكتوم",
    "tutorTestAudio": "اختبار الصوت",
    "tutorTestMic": "اختبار الميكروفون",
    "tutorShowTrans": "عرض الترجمة",
    "tutorHideTrans": "إخفاء الترجمة",
    "tutorReset": "إعادة ضبط المحادثة",
    "tutorEvaluating": "المعلم يقوم بتقييم القواعد اللغوية...",
    "tutorInputPlaceholder": "اكتب إجابتك بالإنجليزية هنا...",
    "tutorSendHint": "اضغط Enter للإرسال · تصحيح فوري",
    "tutorListening": "🎙️ جاري الاستماع... تحدث الآن بالإنجليزية...",
    "tutorLevelLabel": "المستوى:",
    "tutorLevelBasic": "مبتدئ",
    "tutorLevelIntermediate": "متوسط",
    "tutorLevelAdvanced": "متقدم",
    "tutorActiveScenario": "السيناريو النشط",
    "tutorKeyTenses": "الأزمنة المستهدفة:",
    "tutorVisualMemory": "الذاكرة البصرية نشطة",
    "tutorSuggestions": "اقتراحات:",
    "menuTitle": "TENSEMASTER",
    "menuSubtitle": "12 زمناً · طريقة بصرية يومية",
    "menuLearningPractice": "التعلم والممارسة",
    "menuToolsChallenges": "الأدوات والتحديات",
    "menuRoadmapSub": "مسار بصري خطوة بخطوة",
    "menuTutorSub": "محادثة وتصحيح مباشر",
    "menuFlashcardsSub": "مراجعة سريعة بالبطاقات",
    "menuMatrixSub": "مصفوفة مقارنة 3×4",
    "testLevel": "اختبار تحديد المستوى",
    "situationalScenarios": "مواقف من الحياة الواقعية",
    "irregularVerbs": "الأفعال الشاذة (3 تصاريف)",
    "quickPractice": "البطاقات التعليمية",
    "offlineCenter": "الوضع دون إنترنت",
    "reminders": "تذكيرات الدراسة",
    "listenAudio": "استمع",
    "practicePronunciation": "تدرب على النطق",
    "recordVoice": "سجل صوتك",
    "viewVideo": "شاهد الفيديو",
    "exercisesCount": "تمارين",
    "heroFastMethod": "طريقة سريعة تمنع التردد اللغوي",
    "hero12Langs": "12 لغة مدعومة",
    "heroGuide": "دليل البدء",
    "heroTotalPass": "اشتراك شامل: 5.99$ شهرياً",
    "heroDiscount": "خصم 25% (السابق 7.99$)",
    "heroNoTricks": "سعر ثابت وواضح · إلغاء بنقرة واحدة",
    "heroOwnerAccess": "👑 دخول المالك",
    "heroRecommended": "المسار التعليمي الموصى به لك",
    "heroRecommendedReason": "بناءً على مستواك وممارستك اليومية",
    "heroDailyStreak": "سلسلة الأيام المتتالية",
    "heroExercisesToday": "تمارين مكتملة اليوم",
    "heroGoal": "الهدف اليومي",
    "modalClose": "إغلاق",
    "modalContinue": "متابعة",
    "modalStart": "ابدأ الآن",
    "modalCancel": "إلغاء",
    "modalConfirm": "تأكيد",
    "modalBack": "رجوع",
    "tooltipDarkMode": "التحويل للوضع الليلي",
    "tooltipLightMode": "التحويل للوضع النهاري",
    "tooltipBookmark": "حفظ في المفضلة",
    "tooltipCopied": "تم النسخ إلى الحافظة"
  },
  "ru": {
    "navTenses": "Все 12 времен",
    "navMatrix": "Матрица 3×4",
    "navComparator": "Сравнение времен",
    "navFlashcards": "Флеш-карточки",
    "navVerbs": "📖 3 формы глаголов",
    "navDuel": "⚔️ Дуэль 1 на 1",
    "navAnalyzer": "🔍 Анализатор",
    "navChatbot": "Практика с подсказками",
    "navForum": "💬 Форум",
    "navRankings": "🏆 Рейтинг",
    "navProgress": "Мой прогресс",
    "navAdmin": "Панель владельца",
    "navTools": "Инструменты",
    "btnPro": "Полный доступ $5.99/мес",
    "btnProActive": "Про-доступ активен",
    "heroKicker": "Прямая методика без лишней грамматической теории",
    "heroTitle": "Освойте все",
    "heroTitleHighlight": "12 Времен Английского Языка",
    "heroSubtitle": "Понятные формулы, озвучка каждого примера носителями языка, видеоуроки и 24/7 AI-репетитор с мгновенным исправлением ошибок.",
    "heroAudioCheck": "Озвучка носителями языка",
    "heroVideoCheck": "Пошаговые видеоуроки",
    "heroCertCheck": "Сертификат включен",
    "heroSubOffer": "Полный доступ всего за $5.99 USD в месяц (скидка 25%)",
    "heroSubDesc": "Неограниченный доступ ко всем 12 временам, тестам, аудио и 24/7 AI-репетитору. Отмена в 1 клик.",
    "heroSubBtn": "Полный доступ $5.99 USD",
    "searchPlaceholder": "Поиск по времени, формуле или примеру (напр. \"Present Perfect\", \"Did\", \"Will\")...",
    "filterAll": "Все (12)",
    "filterPresent": "Настоящее (4)",
    "filterPast": "Прошедшее (4)",
    "filterFuture": "Будущее (4)",
    "catalogTitle": "Каталог 12 времен английского языка",
    "unlockedPreview": "2 времени бесплатно",
    "proPlanPrice": "Полный курс за $5.99/мес",
    "enterTense": "Открыть",
    "unlockTense": "Разблокировать",
    "mastered": "Освоено",
    "inProgress": "В процессе",
    "notStarted": "Не начато",
    "formulaLabel": "Формула:",
    "nativeLanguageLabel": "Родной язык:",
    "chooseLanguage": "Выберите ваш родной язык для изучения английского:",
    "matrixTitle": "Наглядная Матрица 3 × 4 Без Сложностей",
    "matrixSubtitle": "Вся глагольная система английского языка в одной таблице. Сравните, как меняется глагол во времени.",
    "matrixMapTag": "Полная Интеллект-карта Английского",
    "matrixColAspect": "Аспект / Время",
    "aspectSimple": "Простое (Simple)",
    "aspectSimpleSub": "Регулярное или разовое действие",
    "aspectContinuous": "Длительное (Continuous)",
    "aspectContinuousSub": "Действие в процессе развития",
    "aspectPerfect": "Совершенное (Perfect)",
    "aspectPerfectSub": "Действие с результатом в настоящем",
    "aspectPerfectContinuous": "Длительное совершенное",
    "aspectPerfectContinuousSub": "Накопленная продолжительность",
    "groupPast": "Прошедшее (Past)",
    "groupPresent": "Настоящее (Present)",
    "groupFuture": "Будущее (Future)",
    "matrixOpenLesson": "Открыть урок",
    "matrixUnlock": "Разблокировать",
    "matrixListen": "Слушать произношение",
    "tutorTitle": "Ваш Персональный 24/7 Английский AI-Репетитор",
    "tutorSubtitle": "Общайтесь, практикуйтесь и разбирайте любые вопросы грамматики и произношения в любое время суток без стеснения.",
    "tutorBadge": "AI Репетитор 24/7 · На связи 24 часа в сутки",
    "tutorScenariosTitle": "Сценарии и темы для практики",
    "tutorScenariosSubtitle": "Выберите контекст, в котором хотите потренироваться сегодня:",
    "tutorVoiceOn": "Голос репетитора: Включен",
    "tutorVoiceOff": "Голос репетитора: Отключен",
    "tutorTestAudio": "Проверить звук",
    "tutorTestMic": "Проверить микрофон",
    "tutorShowTrans": "Показать перевод",
    "tutorHideTrans": "Скрыть перевод",
    "tutorReset": "Начать заново",
    "tutorEvaluating": "Репетитор анализирует грамматику...",
    "tutorInputPlaceholder": "Напишите ваш ответ на английском...",
    "tutorSendHint": "Нажмите Enter для отправки · Мгновенный разбор ошибок",
    "tutorListening": "🎙️ Слушаю... Говорите сейчас на английском...",
    "tutorLevelLabel": "Уровень:",
    "tutorLevelBasic": "Базовый",
    "tutorLevelIntermediate": "Средний",
    "tutorLevelAdvanced": "Продвинутый",
    "tutorActiveScenario": "Текущий сценарий",
    "tutorKeyTenses": "Ключевые времена:",
    "tutorVisualMemory": "Визуальная память активна",
    "tutorSuggestions": "Подсказки:",
    "menuTitle": "TENSEMASTER",
    "menuSubtitle": "12 Времен · Наглядный жизненный метод",
    "menuLearningPractice": "Обучение и практика",
    "menuToolsChallenges": "Инструменты и дуэли",
    "menuRoadmapSub": "Пошаговый визуальный путь",
    "menuTutorSub": "Разговорная практика и живое исправление",
    "menuFlashcardsSub": "Быстрое повторение карточками",
    "menuMatrixSub": "Матрица сравнения 3×4",
    "testLevel": "Тест на уровень",
    "situationalScenarios": "Ситуации из реальной жизни",
    "irregularVerbs": "Неправильные глаголы (3 формы)",
    "quickPractice": "Карточки памяти",
    "offlineCenter": "Офлайн режим",
    "reminders": "Напоминания об учебе",
    "listenAudio": "Слушать",
    "practicePronunciation": "Тренировать голос",
    "recordVoice": "Записать голос",
    "viewVideo": "Смотреть видео",
    "exercisesCount": "упражнений",
    "heroFastMethod": "Ускоренная методика без барьеров",
    "hero12Langs": "12 языков",
    "heroGuide": "Краткое руководство",
    "heroTotalPass": "Полный абонемент: $5.99 USD / мес",
    "heroDiscount": "Скидка 25% (было $7.99)",
    "heroNoTricks": "Фиксированная прозрачная цена · Отмена в 1 клик",
    "heroOwnerAccess": "👑 Режим Создателя",
    "heroRecommended": "Рекомендуемый план обучения",
    "heroRecommendedReason": "На основе вашего уровня и практики",
    "heroDailyStreak": "Серия дней учебы",
    "heroExercisesToday": "упражнений сегодня",
    "heroGoal": "цель на день",
    "modalClose": "Закрыть",
    "modalContinue": "Продолжить",
    "modalStart": "Начать",
    "modalCancel": "Отмена",
    "modalConfirm": "Подтвердить",
    "modalBack": "Назад",
    "tooltipDarkMode": "Переключить на темную тему",
    "tooltipLightMode": "Переключить на светлую тему",
    "tooltipBookmark": "Добавить в закладки",
    "tooltipCopied": "Скопировано в буфер обмена"
  },
  "ja": {
    "navTenses": "英語の12時制",
    "navMatrix": "3×4時制マトリクス",
    "navComparator": "時制比較",
    "navFlashcards": "フラッシュカード",
    "navVerbs": "📖 不規則動詞3変化",
    "navDuel": "⚔️ 1v1対戦",
    "navAnalyzer": "🔍 英文解析",
    "navChatbot": "ガイド付き練習",
    "navForum": "💬 フォーラム",
    "navRankings": "🏆 ランキング",
    "navProgress": "学習進捗",
    "navAdmin": "管理者画面",
    "navTools": "学習ツール",
    "btnPro": "月額$5.99で全機能解放",
    "btnProActive": "Proプラン有効",
    "heroKicker": "無駄な暗記を省いた最短マスター法",
    "heroTitle": "迷わず身につく",
    "heroTitleHighlight": "英語の全12時制マスター",
    "heroSubtitle": "分かりやすい公式、ネイティブ音声付き例文、動画解説、24時間AI講師による即時添削。",
    "heroAudioCheck": "ネイティブ音声再生",
    "heroVideoCheck": "丁寧な解説動画",
    "heroCertCheck": "修了証書付き",
    "heroSubOffer": "月額わずか $5.99 USD で学び放題（25% OFF）",
    "heroSubDesc": "全12時制、テスト、音声、24時間AI講師に無制限アクセス。いつでも1クリックで解約可能。",
    "heroSubBtn": "全機能パス $5.99 USD",
    "searchPlaceholder": "時制名・公式・例文で検索（例: \"Present Perfect\", \"Did\", \"Will\"）...",
    "filterAll": "すべて (12)",
    "filterPresent": "現在形 (4)",
    "filterPast": "過去形 (4)",
    "filterFuture": "未来形 (4)",
    "catalogTitle": "英語の12時制カタログ",
    "unlockedPreview": "2つの時制を無料体験",
    "proPlanPrice": "全時制月額$5.99",
    "enterTense": "学習する",
    "unlockTense": "ロック解除",
    "mastered": "習得済み",
    "inProgress": "学習中",
    "notStarted": "未開始",
    "formulaLabel": "公式:",
    "nativeLanguageLabel": "母国語:",
    "chooseLanguage": "英語学習の母国語を選択してください:",
    "matrixTitle": "一目でわかる 3 × 4 時制マトリクス",
    "matrixSubtitle": "英語の全動詞システムを座標グリッドに凝縮。同じ動詞が時制によってどう変化するかを徹底比較。",
    "matrixMapTag": "英語の全体マインドマップ",
    "matrixColAspect": "アスペクト / 時制",
    "aspectSimple": "基本形 (Simple)",
    "aspectSimpleSub": "習慣的・確定的な単発動作",
    "aspectContinuous": "進行形 (Continuous)",
    "aspectContinuousSub": "その時まさに進行中の動作",
    "aspectPerfect": "完了形 (Perfect)",
    "aspectPerfectSub": "過去の出来事が現在に影響",
    "aspectPerfectContinuous": "完了進行形 (Perfect Continuous)",
    "aspectPerfectContinuousSub": "過去から今も続く動作の継続",
    "groupPast": "過去 (Past)",
    "groupPresent": "現在 (Present)",
    "groupFuture": "未来 (Future)",
    "matrixOpenLesson": "レッスンを開く",
    "matrixUnlock": "ロック解除",
    "matrixListen": "音声を再生",
    "tutorTitle": "24時間いつでも寄り添うAI英語講師",
    "tutorSubtitle": "深夜でも早朝でも恥ずかしがらずに英会話練習。無限の忍耐力でリアルタイムに文法と発音を添削。",
    "tutorBadge": "AI専属講師 24/7 · 24時間オンライン",
    "tutorScenariosTitle": "実践シチュエーション＆トピック",
    "tutorScenariosSubtitle": "今日トレーニングしたい会話シーンを選択してください：",
    "tutorVoiceOn": "講師の音声：オン（読み上げ）",
    "tutorVoiceOff": "講師の音声：ミュート",
    "tutorTestAudio": "スピーカーをテスト",
    "tutorTestMic": "マイクをテスト",
    "tutorShowTrans": "日本語訳を表示",
    "tutorHideTrans": "日本語訳を非表示",
    "tutorReset": "会話をやり直す",
    "tutorEvaluating": "講師が英文法をチェック中...",
    "tutorInputPlaceholder": "英語で返答を入力してください...",
    "tutorSendHint": "Enterで送信 · リアルタイム文法添削",
    "tutorListening": "🎙️ 音声認識中... 英語でお話しください...",
    "tutorLevelLabel": "レベル：",
    "tutorLevelBasic": "初級",
    "tutorLevelIntermediate": "中級",
    "tutorLevelAdvanced": "上級",
    "tutorActiveScenario": "現在選択中のシーン",
    "tutorKeyTenses": "重要時制：",
    "tutorVisualMemory": "ビジュアル記憶連動",
    "tutorSuggestions": "表現のヒント：",
    "menuTitle": "TENSEMASTER",
    "menuSubtitle": "12時制 · 日常視覚マスターメソッド",
    "menuLearningPractice": "レッスン＆練習",
    "menuToolsChallenges": "ツール＆対戦",
    "menuRoadmapSub": "ステップ別ビジュアル学習マップ",
    "menuTutorSub": "英会話実践＆即時添削",
    "menuFlashcardsSub": "フラッシュ暗記カード",
    "menuMatrixSub": "3×4時制比較マトリクス",
    "testLevel": "レベル診断テスト",
    "situationalScenarios": "リアルな日常シチュエーション",
    "irregularVerbs": "不規則動詞一覧 (3変化)",
    "quickPractice": "暗記フラッシュカード",
    "offlineCenter": "オフライン学習",
    "reminders": "学習リマインダー",
    "listenAudio": "音声を聞く",
    "practicePronunciation": "発音練習",
    "recordVoice": "音声を録音",
    "viewVideo": "動画を見る",
    "exercisesCount": "問の演習",
    "heroFastMethod": "挫折を防ぐ直感的メソッド",
    "hero12Langs": "12言語対応",
    "heroGuide": "スタートガイド",
    "heroTotalPass": "全機能パス: $5.99 USD / 月",
    "heroDiscount": "25% OFF (通常 $7.99)",
    "heroNoTricks": "固定透明料金 · いつでも1クリックで解約可能",
    "heroOwnerAccess": "👑 オーナー権限",
    "heroRecommended": "あなたにおすすめの学習ルート",
    "heroRecommendedReason": "現在のレベルと学習履歴に基づく分析",
    "heroDailyStreak": "連続学習記録",
    "heroExercisesToday": "本日の演習数",
    "heroGoal": "1日の目標",
    "modalClose": "閉じる",
    "modalContinue": "続ける",
    "modalStart": "学習を開始",
    "modalCancel": "キャンセル",
    "modalConfirm": "確認",
    "modalBack": "戻る",
    "tooltipDarkMode": "ダークモードに切り替え",
    "tooltipLightMode": "ライトモードに切り替え",
    "tooltipBookmark": "お気に入りに追加",
    "tooltipCopied": "クリップボードにコピーしました"
  }
};

export const TENSE_LOCALIZED_NAMES: Record<string, Partial<Record<SupportedLanguage, { name: string; tagline: string }>>> = {
  "present-simple": {
    "zh": {
      "name": "一般现在时 (Simple Present)",
      "tagline": "日常习惯、经常性动作与普遍真理。"
    },
    "es": {
      "name": "Presente Simple",
      "tagline": "Rutinas diarias, hábitos permanentes y verdades universales."
    },
    "pt": {
      "name": "Presente Simples",
      "tagline": "Rotinas diárias, hábitos permanentes e verdades universais."
    },
    "hi": {
      "name": "Present Simple",
      "tagline": "दैनिक दिनचर्या, स्थायी आदतें और सार्वभौमिक सत्य।"
    },
    "id": {
      "name": "Present Simple",
      "tagline": "Rutinitas sehari-hari, kebiasaan tetap, dan kebenaran umum."
    },
    "vi": {
      "name": "Hiện tại Đơn",
      "tagline": "Thói quen thường nhật, sự thật hiển nhiên và lịch trình cố định."
    },
    "tr": {
      "name": "Geniş Zaman",
      "tagline": "Günlük rutinler, kalıcı alışkanlıklar ve genel gerçekler."
    },
    "ar": {
      "name": "المضارع البسيط",
      "tagline": "العادات اليومية، الروتين المنتظم والحقائق العلمية الثابتة."
    },
    "ru": {
      "name": "Present Simple",
      "tagline": "Регулярные действия, повседневные привычки и факты."
    },
    "ja": {
      "name": "現在形",
      "tagline": "日々の習慣、現在の状態、普遍の真理。"
    },
    "fr": {
      "name": "Présent Simple",
      "tagline": "Routines quotidiennes, habitudes régulières et vérités générales."
    },
    "it": {
      "name": "Presente Semplice",
      "tagline": "Abitudini quotidiane, fatti permanenti e verità generali."
    },
    "de": {
      "name": "Simple Present",
      "tagline": "Tägliche Routinen, regelmäßige Gewohnheiten und Naturgesetze."
    }
  },
  "present-continuous": {
    "zh": {
      "name": "现在进行时 (Present Continuous)",
      "tagline": "此时此刻正在进行的动作或已确定的近期安排。"
    },
    "es": {
      "name": "Presente Continuo",
      "tagline": "Acciones que ocurren exactamente ahora o planes futuros confirmados."
    },
    "pt": {
      "name": "Presente Contínuo",
      "tagline": "Ações que acontecem exatamente agora ou planos futuros confirmados."
    },
    "hi": {
      "name": "Present Continuous",
      "tagline": "वर्तमान में हो रहे कार्य या पहले से तय भविष्य की योजनाएं।"
    },
    "id": {
      "name": "Present Continuous",
      "tagline": "Aksi yang sedang berlangsung sekarang atau rencana masa depan pasti."
    },
    "vi": {
      "name": "Hiện tại Tiếp diễn",
      "tagline": "Hành động đang diễn ra ngay lúc này hoặc kế hoạch tương lai chắc chắn."
    },
    "tr": {
      "name": "Şimdiki Zaman",
      "tagline": "Şu anda süren eylemler veya kesinleşmiş gelecek planları."
    },
    "ar": {
      "name": "المضارع المستمر",
      "tagline": "أفعال تجري في هذه اللحظة بالذات أو خطط مستقبلية مؤكدة."
    },
    "ru": {
      "name": "Present Continuous",
      "tagline": "Действия в момент речи или запланированные события."
    },
    "ja": {
      "name": "現在進行形",
      "tagline": "今まさに進行中の動作や、確定している近い未来の予定。"
    },
    "fr": {
      "name": "Présent Continu",
      "tagline": "Actions en cours en ce moment précis ou projets futurs fixés."
    },
    "it": {
      "name": "Presente Continuo",
      "tagline": "Azioni in corso in questo momento o piani futuri già fissati."
    },
    "de": {
      "name": "Present Progressive",
      "tagline": "Handlungen im Moment des Sprechens oder feste Zukunftspläne."
    }
  },
  "present-perfect": {
    "zh": {
      "name": "现在完成时 (Present Perfect)",
      "tagline": "人生经历及过去发生但对现在产生影响的动作。"
    },
    "es": {
      "name": "Presente Perfecto",
      "tagline": "Experiencias de vida y acciones pasadas con conexión directa al ahora."
    },
    "pt": {
      "name": "Presente Perfeito",
      "tagline": "Experiências de vida e ações passadas com conexão direta ao agora."
    },
    "hi": {
      "name": "Present Perfect",
      "tagline": "जीवन के अनुभव और भूतकाल के कार्य जिनका प्रभाव वर्तमान पर है।"
    },
    "id": {
      "name": "Present Perfect",
      "tagline": "Pengalaman hidup dan aksi lampau yang masih relevan dengan saat ini."
    },
    "vi": {
      "name": "Hiện tại Hoàn thành",
      "tagline": "Kinh nghiệm sống và hành động quá khứ có kết quả ở hiện tại."
    },
    "tr": {
      "name": "Present Perfect",
      "tagline": "Geçmişte yapılmış ama etkisi şimdiye uzanan deneyimler."
    },
    "ar": {
      "name": "المضارع التام",
      "tagline": "تجارب الحياة وأحداث ماضية ذات صلة وثيقة باللحظة الحالية."
    },
    "ru": {
      "name": "Present Perfect",
      "tagline": "Жизненный опыт и действия в прошлом с результатом в настоящем."
    },
    "ja": {
      "name": "現在完了形",
      "tagline": "経験・完了・継続・結果（過去の行動と現在のつながり）。"
    },
    "fr": {
      "name": "Present Perfect",
      "tagline": "Expériences de vie et actions passées ayant un impact sur le présent."
    },
    "it": {
      "name": "Present Perfect",
      "tagline": "Esperienze di vita e azioni passate collegate al momento presente."
    },
    "de": {
      "name": "Present Perfect",
      "tagline": "Lebenserfahrungen und vergangene Handlungen mit Gegenwartsbezug."
    }
  },
  "present-perfect-continuous": {
    "zh": {
      "name": "现在完成进行时 (Present Perfect Continuous)",
      "tagline": "从过去某一时刻开始一直延续到现在的动作。"
    },
    "es": {
      "name": "Presente Perfecto Continuo",
      "tagline": "Acciones prolongadas iniciadas en el pasado que continúan hasta el presente."
    },
    "pt": {
      "name": "Presente Perfeito Contínuo",
      "tagline": "Ações prolongadas iniciadas no passado que continuam até o presente."
    },
    "hi": {
      "name": "Present Perfect Continuous",
      "tagline": "लंबे समय से शुरू होकर वर्तमान में लगातार जारी कार्य।"
    },
    "id": {
      "name": "Present Perfect Continuous",
      "tagline": "Aksi berdurasi yang dimulai di masa lalu dan masih berlangsung."
    },
    "vi": {
      "name": "Hiện tại Hoàn thành Tiếp diễn",
      "tagline": "Hành động kéo dài từ quá khứ và vẫn tiếp diễn ở hiện tại."
    },
    "tr": {
      "name": "Present Perfect Continuous",
      "tagline": "Geçmişte başlayıp kesintisiz olarak günümüze dek süren eylemler."
    },
    "ar": {
      "name": "المضارع التام المستمر",
      "tagline": "أفعال مستمرة بدأت في الماضي وتتواصل حتى هذه اللحظة."
    },
    "ru": {
      "name": "Present Perfect Continuous",
      "tagline": "Длительные действия, начавшиеся в прошлом и длящиеся сейчас."
    },
    "ja": {
      "name": "現在完了進行形",
      "tagline": "過去に始まり、現在まで休みなく続いている動作の継続。"
    },
    "fr": {
      "name": "Present Perfect Continu",
      "tagline": "Actions prolongées commencées dans le passé et toujours en cours."
    },
    "it": {
      "name": "Present Perfect Continuous",
      "tagline": "Azioni prolungate iniziate nel passato che continuano ancora oggi."
    },
    "de": {
      "name": "Present Perfect Progressive",
      "tagline": "Länger andauernde Handlungen von der Vergangenheit bis heute."
    }
  },
  "past-simple": {
    "zh": {
      "name": "一般过去时 (Simple Past)",
      "tagline": "过去某个特定时间已经开始并完全结束的动作。"
    },
    "es": {
      "name": "Pasado Simple",
      "tagline": "Acciones puntuales que comenzaron y terminaron completamente en el pasado."
    },
    "pt": {
      "name": "Passado Simples",
      "tagline": "Ações pontuais que começaram e terminaram completamente no passado."
    },
    "hi": {
      "name": "Past Simple",
      "tagline": "भूतकाल में किसी निश्चित समय पर पूरी तरह समाप्त कार्य।"
    },
    "id": {
      "name": "Past Simple",
      "tagline": "Aksi yang dimulai dan telah tuntas sepenuhnya di masa lampau."
    },
    "vi": {
      "name": "Quá khứ Đơn",
      "tagline": "Hành động đã xảy ra và chấm dứt hoàn toàn trong quá khứ."
    },
    "tr": {
      "name": "Geçmiş Zaman",
      "tagline": "Geçmişte belirli bir zamanda gerçekleşip bitmiş eylemler."
    },
    "ar": {
      "name": "الماضي البسيط",
      "tagline": "أحداث بدأت وانتهت بالكامل في وقت محدد من الماضي."
    },
    "ru": {
      "name": "Past Simple",
      "tagline": "Завершенные действия в конкретный момент в прошлом."
    },
    "ja": {
      "name": "過去形",
      "tagline": "過去の特定時点で完全に終わった出来事や状態。"
    },
    "fr": {
      "name": "Passé Simple",
      "tagline": "Actions terminées et délimitées dans le passé."
    },
    "it": {
      "name": "Passato Semplice",
      "tagline": "Azioni concluse e terminate completamente nel passato."
    },
    "de": {
      "name": "Simple Past",
      "tagline": "Abgeschlossene Handlungen zu einem bestimmten Zeitpunkt in der Vergangenheit."
    }
  },
  "past-continuous": {
    "zh": {
      "name": "过去进行时 (Past Continuous)",
      "tagline": "过去某一特定时刻正在持续进行的动作。"
    },
    "es": {
      "name": "Pasado Continuo",
      "tagline": "Acciones que estaban en pleno desarrollo en un momento del pasado."
    },
    "pt": {
      "name": "Passado Contínuo",
      "tagline": "Ações que estavam em andamento em um momento específico do passado."
    },
    "hi": {
      "name": "Past Continuous",
      "tagline": "भूतकाल में किसी विशिष्ट क्षण जारी रहने वाले कार्य।"
    },
    "id": {
      "name": "Past Continuous",
      "tagline": "Aksi yang sedang berlangsung pada titik waktu tertentu di masa lalu."
    },
    "vi": {
      "name": "Quá khứ Tiếp diễn",
      "tagline": "Hành động đang diễn ra tại một thời điểm xác định trong quá khứ."
    },
    "tr": {
      "name": "Geçmişte Sürekli Zaman",
      "tagline": "Geçmişte belirli bir anda devam etmekte olan eylemler."
    },
    "ar": {
      "name": "الماضي المستمر",
      "tagline": "أفعال كانت مستمرة الحدوث في نقطة زمنية معينة من الماضي."
    },
    "ru": {
      "name": "Past Continuous",
      "tagline": "Действия, протекавшие в определенный момент в прошлом."
    },
    "ja": {
      "name": "過去進行形",
      "tagline": "過去のある特定の瞬間に進行中だった動作。"
    },
    "fr": {
      "name": "Passé Continu",
      "tagline": "Actions en cours de déroulement à un moment précis du passé."
    },
    "it": {
      "name": "Passato Continuo",
      "tagline": "Azioni che erano in corso in un momento specifico nel passato."
    },
    "de": {
      "name": "Past Progressive",
      "tagline": "Handlungen, die zu einem bestimmten Zeitpunkt in der Vergangenheit abliefen."
    }
  },
  "past-perfect": {
    "zh": {
      "name": "过去完成时 (Past Perfect)",
      "tagline": "过去的过去：在另一个过去动作之前已发生的事。"
    },
    "es": {
      "name": "Pasado Perfecto",
      "tagline": "El pasado del pasado: acción ocurrida antes de otro evento pasado."
    },
    "pt": {
      "name": "Passado Perfeito",
      "tagline": "O passado do passado: ação que ocorreu antes de outro evento passado."
    },
    "hi": {
      "name": "Past Perfect",
      "tagline": "भूतकाल से पहले का भूतकाल: किसी अन्य पुरानी घटना से पहले पूरा हुआ कार्य।"
    },
    "id": {
      "name": "Past Perfect",
      "tagline": "Aksi lampau yang telah selesai sebelum kejadian lampau lainnya."
    },
    "vi": {
      "name": "Quá khứ Hoàn thành",
      "tagline": "Quá khứ của quá khứ: hành động xảy ra trước một sự kiện quá khứ khác."
    },
    "tr": {
      "name": "Past Perfect",
      "tagline": "Geçmişteki başka bir olaydan daha önce tamamlanmış olan eylem."
    },
    "ar": {
      "name": "الماضي التام",
      "tagline": "ماضي الماضي: حدث وقع واكتمل قبل وقوع حدث ماضٍ آخر."
    },
    "ru": {
      "name": "Past Perfect",
      "tagline": "Действие, совершившееся ранее другого действия в прошлом."
    },
    "ja": {
      "name": "過去完了形",
      "tagline": "大過去：過去のある時点より前にすでに完了していた出来事。"
    },
    "fr": {
      "name": "Plus-que-parfait",
      "tagline": "Action antérieure à un autre événement passé."
    },
    "it": {
      "name": "Trapassato",
      "tagline": "Azione accaduta prima di un altro evento nel passato."
    },
    "de": {
      "name": "Past Perfect",
      "tagline": "Handlung, die vor einem anderen Zeitpunkt in der Vergangenheit stattfand."
    }
  },
  "past-perfect-continuous": {
    "zh": {
      "name": "过去完成进行时 (Past Perfect Continuous)",
      "tagline": "在过去某一特定时刻前持续进行了较长时间的动作。"
    },
    "es": {
      "name": "Pasado Perfecto Continuo",
      "tagline": "Acción prolongada que estuvo en curso antes de otro momento pasado."
    },
    "pt": {
      "name": "Passado Perfeito Contínuo",
      "tagline": "Ação contínua que esteve em progresso antes de outro momento passado."
    },
    "hi": {
      "name": "Past Perfect Continuous",
      "tagline": "भूतकाल के किसी पड़ाव से पहले लगातार चल रहा कार्य।"
    },
    "id": {
      "name": "Past Perfect Continuous",
      "tagline": "Aksi berdurasi yang berlangsung sebelum peristiwa lampau lain."
    },
    "vi": {
      "name": "Quá khứ Hoàn thành Tiếp diễn",
      "tagline": "Hành động diễn ra liên tục kéo dài trước một mốc quá khứ khác."
    },
    "tr": {
      "name": "Past Perfect Continuous",
      "tagline": "Geçmişteki bir andan önce uzun süre devam etmiş olan eylem."
    },
    "ar": {
      "name": "الماضي التام المستمر",
      "tagline": "حدث استمر لفترة زمنية طويلة في الماضي قبل حدث ماضٍ آخر."
    },
    "ru": {
      "name": "Past Perfect Continuous",
      "tagline": "Длительное действие, происходившее до другого момента в прошлом."
    },
    "ja": {
      "name": "過去完了進行形",
      "tagline": "過去のある時点まで一定期間継続して行われていた動作。"
    },
    "fr": {
      "name": "Passé Parfait Continu",
      "tagline": "Action continue qui s’est déroulée avant un autre événement passé."
    },
    "it": {
      "name": "Trapassato Continuo",
      "tagline": "Azione continuata nel passato prima di un altro evento."
    },
    "de": {
      "name": "Past Perfect Progressive",
      "tagline": "Laufende Handlung in der Vergangenheit vor einem anderen Ereignis."
    }
  },
  "future-simple": {
    "zh": {
      "name": "一般将来时 (Simple Future)",
      "tagline": "临时决定、承诺、对未来的预测与打算。"
    },
    "es": {
      "name": "Futuro Simple",
      "tagline": "Decisiones espontáneas, promesas, predicciones y planes."
    },
    "pt": {
      "name": "Futuro Simples",
      "tagline": "Decisões espontâneas, promessas, previsões e planos."
    },
    "hi": {
      "name": "Future Simple",
      "tagline": "तात्कालिक निर्णय, वादे, भविष्यवाणियां और भविष्य की योजनाएं।"
    },
    "id": {
      "name": "Future Simple",
      "tagline": "Keputusan spontan, janji, prediksi, dan rencana masa depan."
    },
    "vi": {
      "name": "Tương lai Đơn",
      "tagline": "Quyết định tức thời, lời hứa, dự đoán và kế hoạch tương lai."
    },
    "tr": {
      "name": "Gelecek Zaman",
      "tagline": "Anlık kararlar, sözler, tahminler ve gelecek niyetleri."
    },
    "ar": {
      "name": "المستقبل البسيط",
      "tagline": "قرارات عفوية وليدة اللحظة، وعود وتوقعات مستقبلية."
    },
    "ru": {
      "name": "Future Simple",
      "tagline": "Спонтанные решения, обещания, прогнозы и планы."
    },
    "ja": {
      "name": "未来形",
      "tagline": "その場の思いつき・意志、約束、未来の予測。"
    },
    "fr": {
      "name": "Futur Simple",
      "tagline": "Décisions spontanées, prédictions, promesses et projets."
    },
    "it": {
      "name": "Futuro Semplice",
      "tagline": "Decisioni istantanee, promesse, previsioni e piani futuri."
    },
    "de": {
      "name": "Future Simple",
      "tagline": "Spontane Entschlüsse, Vorhersagen, Versprechen und Absichten."
    }
  },
  "future-continuous": {
    "zh": {
      "name": "将来进行时 (Future Continuous)",
      "tagline": "未来某一特定时刻将正在持续进行的动作。"
    },
    "es": {
      "name": "Futuro Continuo",
      "tagline": "Acciones que estarán en pleno desarrollo en un momento del futuro."
    },
    "pt": {
      "name": "Futuro Contínuo",
      "tagline": "Ações que estarão em andamento em um ponto exato do futuro."
    },
    "hi": {
      "name": "Future Continuous",
      "tagline": "भविष्य में किसी खास समय जारी रहने वाले कार्य।"
    },
    "id": {
      "name": "Future Continuous",
      "tagline": "Aksi yang akan sedang berlangsung pada saat tertentu di masa depan."
    },
    "vi": {
      "name": "Tương lai Tiếp diễn",
      "tagline": "Hành động sẽ đang diễn ra tại một thời điểm nhất định trong tương lai."
    },
    "tr": {
      "name": "Gelecekte Sürekli Zaman",
      "tagline": "Gelecekte belirli bir anda gerçekleşiyor olacak eylemler."
    },
    "ar": {
      "name": "المستقبل المستمر",
      "tagline": "أفعال ستكون جارية ومستمرة في وقت محدد من المستقبل."
    },
    "ru": {
      "name": "Future Continuous",
      "tagline": "Действия, которые будут происходить в определенный момент будущего."
    },
    "ja": {
      "name": "未来進行形",
      "tagline": "未来の特定の瞬間に進行中であろう動作。"
    },
    "fr": {
      "name": "Futur Continu",
      "tagline": "Actions qui seront en cours à un moment précis dans le futur."
    },
    "it": {
      "name": "Futuro Continuo",
      "tagline": "Azioni che saranno in svolgimento in un momento futuro."
    },
    "de": {
      "name": "Future Progressive",
      "tagline": "Handlungen, die zu einem bestimmten Zukunftszeitpunkt im Gange sein werden."
    }
  },
  "future-perfect": {
    "zh": {
      "name": "将来完成时 (Future Perfect)",
      "tagline": "在未来某一截止时间点之前将会已经完成的动作。"
    },
    "es": {
      "name": "Futuro Perfecto",
      "tagline": "Metas o acciones que ya habrán concluido antes de una fecha futura límite."
    },
    "pt": {
      "name": "Futuro Perfeito",
      "tagline": "Metas que já terão sido concluídas antes de um prazo futuro."
    },
    "hi": {
      "name": "Future Perfect",
      "tagline": "भविष्य में किसी समय-सीमा से पहले पूरे हो चुके लक्ष्य या कार्य।"
    },
    "id": {
      "name": "Future Perfect",
      "tagline": "Target atau aksi yang sudah selesai sebelum batas waktu masa depan."
    },
    "vi": {
      "name": "Tương lai Hoàn thành",
      "tagline": "Mục tiêu hoặc hành động sẽ hoàn thành trước một thời điểm tương lai."
    },
    "tr": {
      "name": "Future Perfect",
      "tagline": "Gelecekteki belirli bir zamandan önce bitmiş olacak hedefler."
    },
    "ar": {
      "name": "المستقبل التام",
      "tagline": "أهداف أو أفعال ستكون قد اكتملت قبل موعد نهائي محدد في المستقبل."
    },
    "ru": {
      "name": "Future Perfect",
      "tagline": "Действия, которые завершатся к определенному моменту в будущем."
    },
    "ja": {
      "name": "未来完了形",
      "tagline": "未来の特定期日までに完了しているはずの目標や動作。"
    },
    "fr": {
      "name": "Futur Antérieur",
      "tagline": "Actions qui seront déjà achevées avant une échéance future."
    },
    "it": {
      "name": "Futuro Anteriore",
      "tagline": "Azioni che saranno già completate prima di una scadenza futura."
    },
    "de": {
      "name": "Future Perfect",
      "tagline": "Handlungen, die zu einem zukünftigen Zeitpunkt abgeschlossen sein werden."
    }
  },
  "future-perfect-continuous": {
    "zh": {
      "name": "将来完成进行时 (Future Perfect Continuous)",
      "tagline": "持续进行直到未来某一时间节点的累计动作时长。"
    },
    "es": {
      "name": "Futuro Perfecto Continuo",
      "tagline": "Duración acumulada continua hasta un hito temporal futuro."
    },
    "pt": {
      "name": "Futuro Perfeito Contínuo",
      "tagline": "Duração contínua acumulada até uma data futura."
    },
    "hi": {
      "name": "Future Perfect Continuous",
      "tagline": "भविष्य के किसी पड़ाव तक लगातार जारी कार्य की कुल समय अवधि।"
    },
    "id": {
      "name": "Future Perfect Continuous",
      "tagline": "Durasi berkesinambungan yang terakumulasi hingga waktu masa depan."
    },
    "vi": {
      "name": "Tương lai Hoàn thành Tiếp diễn",
      "tagline": "Khoảng thời gian tích lũy liên tục cho đến một mốc tương lai."
    },
    "tr": {
      "name": "Future Perfect Continuous",
      "tagline": "Gelecekteki bir noktaya dek biriken kesintisiz eylem süresi."
    },
    "ar": {
      "name": "المستقبل التام المستمر",
      "tagline": "مدة زمنية مستمرة متراكمة حتى نقطة معينة في المستقبل."
    },
    "ru": {
      "name": "Future Perfect Continuous",
      "tagline": "Продолжительность действия, накопленная к моменту в будущем."
    },
    "ja": {
      "name": "未来完了進行形",
      "tagline": "未来の特定時点まで継続して続いている期間の蓄積。"
    },
    "fr": {
      "name": "Futur Parfait Continu",
      "tagline": "Durée continue accumulée jusqu’à une échéance future."
    },
    "it": {
      "name": "Futuro Anteriore Continuo",
      "tagline": "Durata continua accumulata fino a una scadenza futura."
    },
    "de": {
      "name": "Future Perfect Progressive",
      "tagline": "Dauer einer Handlung bis zu einem bestimmten Zeitpunkt in der Zukunft."
    }
  }
};

export const TENSE_EXAMPLE_TRANSLATIONS: Record<string, Partial<Record<SupportedLanguage, string>>> = {
  "present-simple": {
    "es": "Bebo café todas las mañanas.",
    "it": "Bevo caffè ogni mattina.",
    "fr": "Je bois du café tous les matins.",
    "de": "Ich trinke jeden Morgen Kaffee.",
    "pt": "Eu bebo café todas as manhãs.",
    "zh": "我每天早晨都喝咖啡。",
    "hi": "मैं रोज सुबह कॉफी पीता हूँ।",
    "id": "Saya minum kopi setiap pagi.",
    "vi": "Tôi uống cà phê mỗi sáng.",
    "tr": "Her sabah kahve içerim.",
    "ar": "أشرب القهوة كل صباح.",
    "ru": "Я пью кофе каждое утро.",
    "ja": "私は毎朝コーヒーを飲みます。"
  },
  "present-continuous": {
    "es": "Ella está preparando la cena justo ahora.",
    "it": "Lei sta preparando la cena proprio adesso.",
    "fr": "Elle prépare le dîner en ce moment même.",
    "de": "Sie bereitet gerade das Abendessen zu.",
    "pt": "Ela está preparando o jantar agora mesmo.",
    "zh": "她现在正在做晚饭。",
    "hi": "वह इस समय रात का खाना बना रही है।",
    "id": "Dia sedang menyiapkan makan malam sekarang.",
    "vi": "Cô ấy đang chuẩn bị bữa tối ngay bây giờ.",
    "tr": "Şu anda akşam yemeğini hazırlıyor.",
    "ar": "هي تحضر العشاء الآن.",
    "ru": "Она готовит ужин прямо сейчас.",
    "ja": "彼女は今まさに夕食を準備しています。"
  },
  "present-perfect": {
    "es": "Ya hemos terminado el informe.",
    "it": "Abbiamo già completato la relazione.",
    "fr": "Nous avons déjà terminé le rapport.",
    "de": "Wir haben den Bericht bereits fertiggestellt.",
    "pt": "Nós já terminamos o relatório.",
    "zh": "我们已经完成了报告。",
    "hi": "हम पहले ही रिपोर्ट समाप्त कर चुके हैं।",
    "id": "Kami sudah menyelesaikan laporan itu.",
    "vi": "Chúng tôi đã hoàn thành báo cáo rồi.",
    "tr": "Raporu şimdiden bitirdik.",
    "ar": "لقد أنهينا التقرير بالفعل.",
    "ru": "Мы уже закончили отчет.",
    "ja": "私たちはすでにレポートを終えました。"
  },
  "present-perfect-continuous": {
    "es": "He estado viviendo en esta ciudad durante 5 años.",
    "it": "Vivo in questa città da 5 anni.",
    "fr": "J'habite dans cette ville depuis 5 ans.",
    "de": "Ich lebe seit 5 Jahren in dieser Stadt.",
    "pt": "Eu venho morando nesta cidade há 5 anos.",
    "zh": "我在这座城市已经居住了5年。",
    "hi": "मैं इस शहर में 5 साल से रह रहा हूँ।",
    "id": "Saya sudah tinggal di kota ini selama 5 tahun.",
    "vi": "Tôi đã sống ở thành phố này được 5 năm.",
    "tr": "5 yıldır bu şehirde yaşıyorum.",
    "ar": "أنا أعيش في هذه المدينة منذ 5 سنوات.",
    "ru": "Я живу в этом городе уже 5 лет.",
    "ja": "私はこの街に5年間住み続けています。"
  },
  "past-simple": {
    "es": "Visitamos París el verano pasado.",
    "it": "Abbiamo visitato Parigi l'estate scorsa.",
    "fr": "Nous avons visité Paris l'été dernier.",
    "de": "Wir haben letzten Sommer Paris besucht.",
    "pt": "Nós visitamos Paris no verão passado.",
    "zh": "去年夏天我们参观了巴黎。",
    "hi": "हमने पिछली गर्मियों में पेरिस का दौरा किया था।",
    "id": "Kami mengunjungi Paris musim panas lalu.",
    "vi": "Chúng tôi đã đến thăm Paris vào mùa hè năm ngoái.",
    "tr": "Geçen yaz Paris'i ziyaret ettik.",
    "ar": "زرنا باريس الصيف الماضي.",
    "ru": "Прошлым летом мы посетили Париж.",
    "ja": "去年の夏、私たちはパリを訪れました。"
  },
  "past-continuous": {
    "es": "Estaba estudiando cuando sonó el teléfono.",
    "it": "Stavo studiando quando è squillato il telefono.",
    "fr": "J'étudiais quand le téléphone a sonné.",
    "de": "Ich habe gelernt, als das Telefon klingelte.",
    "pt": "Eu estava estudando quando o telefone tocou.",
    "zh": "电话响的时候我正在学习。",
    "hi": "जब फोन बजा तब मैं पढ़ रहा था।",
    "id": "Saya sedang belajar ketika telepon berdering.",
    "vi": "Tôi đang học bài thì điện thoại reo.",
    "tr": "Telefon çaldığında ders çalışıyordum.",
    "ar": "كنت أدرس عندما رن الهاتف.",
    "ru": "Я занимался, когда зазвонил телефон.",
    "ja": "電話が鳴ったとき、私は勉強していました。"
  },
  "past-perfect": {
    "es": "El tren ya había salido cuando llegamos.",
    "it": "Il treno era già partito quando siamo arrivati.",
    "fr": "Le train était déjà parti quand nous sommes arrivés.",
    "de": "Der Zug war bereits abgefahren, als wir ankamen.",
    "pt": "O trem já havia partido quando chegamos.",
    "zh": "我们到达时火车已经开走了。",
    "hi": "जब हम पहुंचे तो ट्रेन पहले ही छूट चुकी थी।",
    "id": "Kereta sudah berangkat saat kami tiba.",
    "vi": "Tàu đã khởi hành khi chúng tôi đến.",
    "tr": "Biz vardığımızda tren çoktan gitmişti.",
    "ar": "كان القطار قد غادر بالفعل عندما وصلنا.",
    "ru": "Поезд уже ушел, когда мы прибыли.",
    "ja": "私たちが到着したとき、電車はすでに出発していました。"
  },
  "past-perfect-continuous": {
    "es": "Había estado trabajando durante 8 horas antes de tomar un descanso.",
    "it": "Lavorava da 8 ore prima di fare una pausa.",
    "fr": "Il travaillait depuis 8 heures avant de faire une pause.",
    "de": "Er hatte 8 Stunden gearbeitet, bevor er eine Pause machte.",
    "pt": "Ele estivera trabalhando por 8 horas antes de fazer uma pausa.",
    "zh": "休息前他已经连续工作了8个小时。",
    "hi": "विश्राम लेने से पहले वह 8 घंटे से काम कर रहा था।",
    "id": "Dia sudah bekerja selama 8 jam sebelum beristirahat.",
    "vi": "Anh ấy đã làm việc suốt 8 tiếng trước khi nghỉ ngơi.",
    "tr": "Mola vermeden önce 8 saattir çalışıyordu.",
    "ar": "كان يعمل لمدة 8 ساعات قبل أخذ استراحة.",
    "ru": "Он работал 8 часов, прежде чем сделать перерыв.",
    "ja": "休憩を取る前に、彼は8時間働き続けていました。"
  },
  "future-simple": {
    "es": "Te llamaré mañana por la mañana.",
    "it": "Ti chiamerò domani mattina.",
    "fr": "Je t'appellerai demain matin.",
    "de": "Ich rufe dich morgen früh an.",
    "pt": "Eu te ligarei amanhã de manhã.",
    "zh": "我明天早上会给你打电话。",
    "hi": "मैं कल सुबह आपको फोन करूंगा।",
    "id": "Saya akan meneleponmu besok pagi.",
    "vi": "Tôi sẽ gọi cho bạn vào sáng mai.",
    "tr": "Yarın sabah seni arayacağım.",
    "ar": "سأتصل بك غداً صباحاً.",
    "ru": "Я позвоню тебе завтра утром.",
    "ja": "明日の朝、あなたに電話します。"
  },
  "future-continuous": {
    "es": "A las 8 PM esta noche, estaré viendo el partido.",
    "it": "Stasera alle 20 guarderò la partita.",
    "fr": "Ce soir à 20h, je serai en train de regarder le match.",
    "de": "Heute Abend um 20 Uhr werde ich das Spiel schauen.",
    "pt": "Às 20h desta noite, estarei assistindo ao jogo.",
    "zh": "今晚8点我将正在看比赛。",
    "hi": "आज रात 8 बजे मैं मैच देख रहा हूँगा।",
    "id": "Malam ini pukul 20.00, saya akan sedang menonton pertandingan.",
    "vi": "Lúc 8 giờ tối nay, tôi sẽ đang xem trận đấu.",
    "tr": "Bu akşam saat 20:00'de maçı izliyor olacağım.",
    "ar": "الليلة في الساعة 8 مساءً، سأكون أشاهد المباراة.",
    "ru": "Сегодня в 20:00 я буду смотреть матч.",
    "ja": "今夜8時には、私は試合を見ている最中です。"
  },
  "future-perfect": {
    "es": "Para diciembre, habré terminado mi maestría.",
    "it": "Entro dicembre avrò completato il mio master.",
    "fr": "D'ici décembre, j'aurai terminé mon master.",
    "de": "Bis Dezember werde ich meinen Master abgeschlossen haben.",
    "pt": "Até dezembro, terei terminado meu mestrado.",
    "zh": "到12月，我将已经完成我的硕士学位。",
    "hi": "दिसंबर तक मैं अपनी मास्टर डिग्री पूरी कर चुका हूँगा।",
    "id": "Menjelang Desember, saya akan telah menyelesaikan gelar master saya.",
    "vi": "Trước tháng 12, tôi sẽ hoàn thành bằng thạc sĩ của mình.",
    "tr": "Aralık ayına kadar yüksek lisansımı tamamlamış olacağım.",
    "ar": "بحلول شهر ديسمبر، سأكون قد أنهيت درجة الماجستير.",
    "ru": "К декабрю я закончу магистратуру.",
    "ja": "12月までに、私は修士課程を修了しているでしょう。"
  },
  "future-perfect-continuous": {
    "es": "Para el próximo año, habrán estado trabajando aquí durante una década.",
    "it": "L'anno prossimo lavoreranno qui da un decennio.",
    "fr": "L'année prochaine, cela fera dix ans qu'ils travaillent ici.",
    "de": "Nächstes Jahr werden sie hier seit einem Jahrzehnt arbeiten.",
    "pt": "No próximo ano, eles estarão trabalhando aqui há uma década.",
    "zh": "到明年，他们在这里工作就满十年了。",
    "hi": "अगले साल तक, वे यहाँ एक दशक से काम कर रहे होंगे।",
    "id": "Menjelang tahun depan, mereka akan telah bekerja di sini selama satu dekade.",
    "vi": "Đến năm tới, họ sẽ làm việc ở đây được tròn một thập kỷ.",
    "tr": "Gelecek yıl itibarıyla burada on yıldır çalışıyor olacaklar.",
    "ar": "بحلول العام المقبل، سيكونون قد عملوا هنا لمدة عقد من الزمان.",
    "ru": "К следующему году они будут работать здесь уже десять лет.",
    "ja": "来年までに、彼らはここで10年間働き続けていることになります。"
  }
};

/**
 * Get localized sentence translation for a tense example in the learner's chosen language.
 */
export const getTenseExampleTranslation = (
  tenseId: string,
  lang: SupportedLanguage,
  defaultSpanish?: string
): string => {
  if (lang === 'en') {
    return '';
  }
  // Each sentence uses its own translation source. Do not reuse the first example.
  return defaultSpanish || '';
};
