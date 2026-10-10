import { DuelQuestion, DuelOpponent } from '../types';

export const DUEL_OPPONENTS: DuelOpponent[] = [
  {
    id: 'opp-1',
    name: 'Elena Gómez',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    country: 'México',
    flag: '🇲🇽',
    level: 'B1',
    lp: 1240,
    winRate: 68,
    accuracy: 0.78
  },
  {
    id: 'opp-2',
    name: 'Lucas Silva',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    country: 'Brasil',
    flag: '🇧🇷',
    level: 'A2',
    lp: 920,
    winRate: 59,
    accuracy: 0.65
  },
  {
    id: 'opp-3',
    name: 'Camila Rojas',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    country: 'Colombia',
    flag: '🇨🇴',
    level: 'B2',
    lp: 1780,
    winRate: 74,
    accuracy: 0.85
  },
  {
    id: 'opp-4',
    name: 'David Fernández',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    country: 'España',
    flag: '🇪🇸',
    level: 'C1',
    lp: 2210,
    winRate: 83,
    accuracy: 0.92
  },
  {
    id: 'opp-bot',
    name: 'TenseBot IA 🤖',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    country: 'Global',
    flag: '⚡',
    level: 'Entrenador B2',
    lp: 1500,
    winRate: 70,
    accuracy: 0.75,
    isBot: true
  }
];

export const DUEL_QUESTIONS: DuelQuestion[] = [
  {
    id: 'dq-1',
    prompt: 'Completa con la forma verbal correcta:',
    sentenceWithBlank: 'Right now, they ______ for tomorrow’s English exam.',
    tenseFocus: 'Present Continuous',
    options: ['are studying', 'study', 'have studied', 'were studying'],
    correctIndex: 0,
    explanation: '"Right now" indica una acción en progreso en este preciso momento (am/is/are + V-ing).',
    difficulty: 'easy'
  },
  {
    id: 'dq-2',
    prompt: 'Elige la opción que expresa un hábito o rutina:',
    sentenceWithBlank: 'She ______ coffee before leaving for work every morning.',
    tenseFocus: 'Present Simple',
    options: ['is drinking', 'drinks', 'has drunk', 'drank'],
    correctIndex: 1,
    explanation: 'Las rutinas habituales ("every morning") se expresan con Present Simple en 3ra persona con -s.',
    difficulty: 'easy'
  },
  {
    id: 'dq-3',
    prompt: '¿Cuál completa correctamente con Past Continuous?',
    sentenceWithBlank: 'While I ______ a shower, the doorbell rang.',
    tenseFocus: 'Past Continuous',
    options: ['had taken', 'was taking', 'took', 'am taking'],
    correctIndex: 1,
    explanation: 'La acción de fondo que estaba en progreso cuando otra interrumpe requiere Past Continuous ("was taking").',
    difficulty: 'medium'
  },
  {
    id: 'dq-4',
    prompt: 'Identifica la estructura correcta para experiencia de vida:',
    sentenceWithBlank: 'I ______ to Japan three times in my life.',
    tenseFocus: 'Present Perfect',
    options: ['went', 'have been', 'had been', 'am being'],
    correctIndex: 1,
    explanation: 'Experiencias de vida sin especificar fecha exacta se construyen con Present Perfect ("have been").',
    difficulty: 'medium'
  },
  {
    id: 'dq-5',
    prompt: '¿Cuál acción ocurrió ANTES en el pasado?',
    sentenceWithBlank: 'When we got to the airport, the plane ______ already.',
    tenseFocus: 'Past Perfect',
    options: ['left', 'had left', 'has left', 'was leaving'],
    correctIndex: 1,
    explanation: 'El avión despegó antes de la llegada al aeropuerto: Pasado del pasado = Past Perfect ("had left").',
    difficulty: 'medium'
  },
  {
    id: 'dq-6',
    prompt: 'Completa la promesa o decisión espontánea:',
    sentenceWithBlank: 'The phone is ringing. Don’t worry, I ______ it!',
    tenseFocus: 'Future Simple',
    options: ['will answer', 'am answering', 'answer', 'have answered'],
    correctIndex: 0,
    explanation: 'Decisiones tomadas en el momento inmediato se formulan con "will + verbo base".',
    difficulty: 'easy'
  },
  {
    id: 'dq-7',
    prompt: 'Enfasis en la duración hasta este instante:',
    sentenceWithBlank: 'They are exhausted because they ______ since 6:00 AM.',
    tenseFocus: 'Present Perfect Continuous',
    options: ['run', 'have been running', 'were running', 'are running'],
    correctIndex: 1,
    explanation: '"Since 6:00 AM" con resultado visible en el presente requiere Present Perfect Continuous ("have been running").',
    difficulty: 'hard'
  },
  {
    id: 'dq-8',
    prompt: 'Acción que estará en progreso a una hora futura:',
    sentenceWithBlank: 'Tomorrow at 3:00 PM, we ______ over the Atlantic.',
    tenseFocus: 'Future Continuous',
    options: ['will fly', 'will be flying', 'fly', 'are flying'],
    correctIndex: 1,
    explanation: 'Una acción que estará ocurriendo en un punto exacto del futuro usa Future Continuous ("will be flying").',
    difficulty: 'hard'
  },
  {
    id: 'dq-9',
    prompt: 'Acción que habrá terminado antes de una fecha límite futura:',
    sentenceWithBlank: 'By December, she ______ her master’s thesis.',
    tenseFocus: 'Future Perfect',
    options: ['will finish', 'will have finished', 'has finished', 'finished'],
    correctIndex: 1,
    explanation: '"By + fecha futura" es la señal por excelencia de Future Perfect ("will have + V3").',
    difficulty: 'hard'
  },
  {
    id: 'dq-10',
    prompt: '¿Cuál señal temporal exige Past Simple puntual?',
    sentenceWithBlank: 'We signed the contract ______, not today.',
    tenseFocus: 'Past Simple',
    options: ['yesterday', 'already', 'since Monday', 'for three hours'],
    correctIndex: 0,
    explanation: '"Yesterday" fija un tiempo cerrado y terminado en el pasado, exigiendo Past Simple.',
    difficulty: 'easy'
  },
  {
    id: 'dq-11',
    prompt: 'Corrige el error de concordancia:',
    sentenceWithBlank: 'He ______ in this company for 10 years before he retired.',
    tenseFocus: 'Past Perfect Continuous / Past Perfect',
    options: ['had worked', 'has worked', 'is working', 'works'],
    correctIndex: 0,
    explanation: 'Antes de su jubilación en el pasado ("before he retired"), se requiere Past Perfect ("had worked").',
    difficulty: 'hard'
  },
  {
    id: 'dq-12',
    prompt: '¿Cuál opción utiliza la forma correcta de Future con "Going to"?',
    sentenceWithBlank: 'Look at those dark clouds! It ______ rain.',
    tenseFocus: 'Be Going To',
    options: ['will', 'is going to', 'goes to', 'has gone to'],
    correctIndex: 1,
    explanation: 'Predicciones basadas en evidencia visual presente utilizan "is going to rain".',
    difficulty: 'easy'
  }
];
