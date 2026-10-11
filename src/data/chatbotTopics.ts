import { ChatTopicId, ChatDifficultyLevel } from '../types';

export interface ChatTopicConfig {
  id: ChatTopicId;
  title: string;
  subtitle: string;
  icon: string;
  difficulty: ChatDifficultyLevel;
  targetTenses: string[];
  initialBotMessage: string;
  initialBotTranslation: string;
  starterUserPrompts: string[];
}

export const CHAT_TOPICS: ChatTopicConfig[] = [
  {
    id: 'daily_routine',
    title: 'Daily Routine & Habits',
    subtitle: 'Hábitos diarios y rutinas (Nivel Básico A1-A2)',
    icon: '☀️',
    difficulty: 'beginner',
    targetTenses: ['Present Simple', 'Adverbs of Frequency'],
    initialBotMessage: "Hello! It's so nice to meet you. Tell me, what time do you usually wake up, and what is the very first thing you do in the morning?",
    initialBotTranslation: "¡Hola! Qué gusto saludarte. Cuéntame, ¿a qué hora sueles despertarte y qué es lo primero que haces por la mañana?",
    starterUserPrompts: [
      "I wake up at 7:00 AM every day and I drink coffee.",
      "I usually get up late on weekends, around 9:00 AM.",
      "I always exercise before breakfast."
    ]
  },
  {
    id: 'travel_airport',
    title: 'Airport & Vacation Stories',
    subtitle: 'Viajes, anécdotas y vuelos (Nivel Intermedio B1)',
    icon: '✈️',
    difficulty: 'intermediate',
    targetTenses: ['Past Simple', 'Past Continuous', 'Present Perfect'],
    initialBotMessage: "Welcome to our travel lounge! Have you ever traveled to another country, or is there a special place you visited recently that you loved?",
    initialBotTranslation: "¿Alguna vez has viajado a otro país o hay algún lugar especial que hayas visitado recientemente y te haya encantado?",
    starterUserPrompts: [
      "I have visited New York once, and it was amazing.",
      "Last summer I went to the beach with my family.",
      "I have never flown on a plane before, but I want to."
    ]
  },
  {
    id: 'job_interview',
    title: 'Job Interview Simulation',
    subtitle: 'Entrevista de trabajo profesional (Nivel B2-C1)',
    icon: '💼',
    difficulty: 'advanced',
    targetTenses: ['Present Perfect Continuous', 'Past Simple', 'Conditionals'],
    initialBotMessage: "Welcome! Thank you for coming today. Could you tell me a little bit about your professional background and what you have been working on recently?",
    initialBotTranslation: "¡Bienvenido/a! Gracias por venir hoy. ¿Podrías contarme un poco sobre tu trayectoria y en qué has estado trabajando recientemente?",
    starterUserPrompts: [
      "I have been working in software and management for over three years.",
      "In my previous job, I solved complex customer problems every day.",
      "I am looking for a new challenge where I can grow."
    ]
  },
  {
    id: 'restaurant_food',
    title: 'At the Restaurant',
    subtitle: 'Pedir comida, preferencias y quejas (Nivel A2-B1)',
    icon: '🍽️',
    difficulty: 'beginner',
    targetTenses: ['Would like', 'Present Simple', 'Future with Will'],
    initialBotMessage: "Good evening! Welcome to The Bistro. Table for one or two? Are you ready to order, or would you like to hear today's chef specials first?",
    initialBotTranslation: "¡Buenas noches! Bienvenido/a a The Bistro. ¿Mesa para uno o para dos? ¿Listo/a para ordenar o le gustaría escuchar primero los especiales del chef?",
    starterUserPrompts: [
      "I would like a table for two by the window, please.",
      "Could you recommend a good vegetarian dish?",
      "Can I see the dessert menu, please?"
    ]
  },
  {
    id: 'storytelling',
    title: 'Spooky or Funny Anecdotes',
    subtitle: 'Narrar historias y suspenso (Nivel B2)',
    icon: '🎭',
    difficulty: 'intermediate',
    targetTenses: ['Past Simple', 'Past Continuous', 'Past Perfect'],
    initialBotMessage: "I love great stories! Tell me about a strange, funny, or surprising coincidence that happened to you in the past.",
    initialBotTranslation: "¡Me encantan las buenas historias! Cuéntame una coincidencia extraña, divertida o sorprendente que te haya ocurrido en el pasado.",
    starterUserPrompts: [
      "While I was walking to work, I suddenly saw my old childhood best friend.",
      "One night, the power went out while I was cooking dinner.",
      "I had already bought the tickets when I realized the concert was cancelled."
    ]
  },
  {
    id: 'weekend_plans',
    title: 'Future Dreams & Weekend Plans',
    subtitle: 'Planes futuros y metas a largo plazo (Nivel B1)',
    icon: '🔮',
    difficulty: 'intermediate',
    targetTenses: ['Going to', 'Will', 'Future Continuous', 'Future Perfect'],
    initialBotMessage: "Let's talk about the future! What are you planning to do this coming weekend, and where do you see yourself in five years?",
    initialBotTranslation: "¡Hablemos del futuro! ¿Qué tienes pensado hacer este fin de semana y dónde te ves dentro de cinco años?",
    starterUserPrompts: [
      "This weekend, I am going to relax and watch a movie with friends.",
      "By 2030, I will have finished my master's degree and mastered English.",
      "Next Sunday I think it will rain, so I will stay home."
    ]
  },
  {
    id: 'business_meeting',
    title: 'Executive Business Meeting',
    subtitle: 'Debate corporativo y negociaciones (Nivel C1)',
    icon: '📊',
    difficulty: 'advanced',
    targetTenses: ['Conditionals (2nd & 3rd)', 'Modal Verbs', 'Future Perfect'],
    initialBotMessage: "Good morning team. We need to evaluate the quarterly performance indicators before pitching to the board. In your opinion, what strategy should we adopt if market volatility increases?",
    initialBotTranslation: "Buenos días equipo. Necesitamos evaluar los indicadores trimestrales antes de presentarlos a la junta. En su opinión, ¿qué estrategia deberíamos adoptar si aumenta la volatilidad del mercado?",
    starterUserPrompts: [
      "If we invested more resources in client retention, our churn rate would decrease significantly.",
      "Had we anticipated the supply chain delay, we would have reached our quarterly target.",
      "I propose that we diversify our digital channels to mitigate risk."
    ]
  }
];

export const GENERAL_FALLBACK_CORRECTIONS: Record<string, { corrected: string; explanation: string; rule: string }> = {
  "i have went": {
    corrected: "I have gone",
    explanation: "Con 'have' (Present Perfect) debes usar el participio pasado V3 ('gone'), no el pasado simple V2 ('went').",
    rule: "Present Perfect (have + V3)"
  },
  "she play tennis": {
    corrected: "She plays tennis",
    explanation: "En Present Simple con la 3ra persona singular (he/she/it), el verbo lleva la terminación '-s' o '-es'.",
    rule: "Third person singular -s"
  },
  "i am agree": {
    corrected: "I agree",
    explanation: "'Agree' es un verbo en inglés, no un adjetivo. Se dice 'I agree', no 'I am agree'.",
    rule: "Stative verb 'agree'"
  },
  "yesterday i have seen": {
    corrected: "Yesterday I saw",
    explanation: "Cuando mencionas un momento específico en el pasado como 'yesterday', 'in 2020' o 'last night', se usa Past Simple ('saw'), no Present Perfect.",
    rule: "Past Simple vs Present Perfect"
  }
};
