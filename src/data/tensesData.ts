import { TenseData } from '../types/index.js';
import { TENSE_PREVIEWS } from './tensePreviews.js';

// The two free lessons, in full.
const FREE_TENSES: TenseData[] = [
  // 1. PRESENT SIMPLE
  {
    id: 'present-simple',
    name: 'Present Simple',
    spanishName: 'Presente Simple',
    group: 'present',
    aspect: 'simple',
    cefrLevel: 'A1',
    isFreePreview: true,
    tagline: 'Rutinas diarias, hábitos permanentes y verdades universales.',
    timelineGraphic: {
      start: 'Pasado continuo',
      focus: 'Repetido en el presente (hábito)',
      end: 'Futuro proyectado'
    },
    formula: {
      affirmative: 'Sujeto + Verbo en infinitivo (+ s/es para he/she/it)',
      negative: 'Sujeto + do not / does not (don\'t / doesn\'t) + Verbo base',
      question: 'Do / Does + Sujeto + Verbo base + ?',
      auxiliary: 'Do / Does',
      verbForm: 'Verbo base (infinitivo sin "to")'
    },
    whenToUse: [
      {
        title: 'Hábitos y rutinas',
        description: 'Actividades que haces con regularidad o frecuencia.',
        example: 'I drink coffee every morning at 7:00 AM.'
      },
      {
        title: 'Verdades generales o científicas',
        description: 'Hechos inmutables que no cambian con el tiempo.',
        example: 'The sun rises in the east and water boils at 100°C.'
      },
      {
        title: 'Horarios fijos y transporte público',
        description: 'Eventos programados por un calendario o itinerario.',
        example: 'The train to London leaves at 8:45 tonight.'
      }
    ],
    signalWords: ['always', 'usually', 'often', 'sometimes', 'never', 'every day', 'on Mondays', 'hardly ever'],
    commonMistakes: [
      {
        wrong: 'He live in Madrid.',
        correct: 'He lives in Madrid.',
        why: 'En la tercera persona singular (he, she, it) siempre se añade "-s" o "-es" al verbo en afirmativo.'
      },
      {
        wrong: 'She doesn\'t likes apples.',
        correct: 'She doesn\'t like apples.',
        why: 'Cuando usas el auxiliar "does/doesn\'t", el verbo principal vuelve a su forma base sin la "s".'
      },
      {
        wrong: 'I have 25 years old.',
        correct: 'I am 25 years old.',
        why: 'En inglés la edad se describe con el verbo "to be", nunca con "have".'
      }
    ],
    examples: [
      {
        id: 'ps-1',
        english: 'I work from home on Fridays.',
        spanish: 'Trabajo desde casa los viernes.',
        contextNote: 'Rutina semanal recurrente.',
        audioText: 'I work from home on Fridays.'
      },
      {
        id: 'ps-2',
        english: 'She speaks three languages fluently.',
        spanish: 'Ella habla tres idiomas con fluidez.',
        contextNote: 'Habilidad permanente (agrega -s por "she").',
        audioText: 'She speaks three languages fluently.'
      },
      {
        id: 'ps-3',
        english: 'Do you live near the city center?',
        spanish: '¿Vives cerca del centro de la ciudad?',
        contextNote: 'Pregunta en presente con auxiliar "Do".',
        audioText: 'Do you live near the city center?'
      },
      {
        id: 'ps-4',
        english: 'Water boils at one hundred degrees Celsius.',
        spanish: 'El agua hierve a cien grados Celsius.',
        contextNote: 'Verdad científica universal.',
        audioText: 'Water boils at one hundred degrees Celsius.'
      },
      {
        id: 'ps-5',
        english: 'We don\'t watch television during dinner.',
        spanish: 'Nosotros no vemos televisión durante la cena.',
        contextNote: 'Negación con "don\'t".',
        audioText: 'We do not watch television during dinner.'
      }
    ],
    videoLesson: {
      title: 'Presente Simple en Inglés: Domínalo de una vez por todas',
      instructor: 'BBC Learning English',
      youtubeId: 'Ybddd5uZKlU',
      duration: '11 min',
      summary: 'Aprende cuándo usar Do y Does, la regla de la -s en tercera persona y cómo hacer preguntas sin dudar.',
      keyTakeaways: [
        'Usa DO para I, you, we, they y DOES para he, she, it.',
        'La tercera persona lleva "s/es" únicamente en afirmaciones.',
        'En preguntas y negaciones, el auxiliar ya absorbe la conjugación.'
      ]
    },
    exercises: [
      {
        id: 'ps-ex1',
        type: 'multiple-choice',
        difficulty: 'basic',
        prompt: 'Completa la oración: "Carlos ___ english every evening."',
        options: ['study', 'studies', 'is studying', 'studied'],
        correctAnswer: 'studies',
        explanation: 'Para la 3ra persona (Carlos = He), los verbos terminados en consonante + y cambian a "-ies" (study -> studies).'
      },
      {
        id: 'ps-ex2',
        type: 'fill-blank',
        difficulty: 'basic',
        prompt: 'Completa con el auxiliar negativo correcto (forma corta): "We _____ (not eat) meat."',
        hint: 'Usa don\'t o doesn\'t',
        correctAnswer: "don't",
        explanation: 'Para el pronombre "we" el auxiliar negativo es "don\'t" (do not).'
      },
      {
        id: 'ps-ex3',
        type: 'sentence-order',
        difficulty: 'intermediate',
        prompt: 'Ordena las palabras para formar una pregunta correcta en presente simple:',
        scrambledWords: ['your', 'brother', 'Does', 'play', 'football', '?'],
        correctAnswer: ['Does', 'your', 'brother', 'play', 'football', '?'],
        explanation: 'Estructura interrogativa: Auxiliar (Does) + Sujeto (your brother) + Verbo base (play) + Complemento + ?'
      },
      {
        id: 'ps-ex4',
        type: 'multiple-choice',
        difficulty: 'intermediate',
        prompt: '¿Cuál oración es 100% correcta?',
        options: [
          'She doesn\'t wants to go home.',
          'She doesn\'t want to go home.',
          'She not want to go home.',
          'She don\'t want to go home.'
        ],
        correctAnswer: 'She doesn\'t want to go home.',
        explanation: 'Con "doesn\'t", el verbo principal no lleva "s" (want, no wants).'
      },
      {
        id: 'ps-ex5',
        type: 'multiple-choice',
        difficulty: 'advanced',
        prompt: 'Posición del adverbio de frecuencia: ¿Cuál oración está redactada correctamente?',
        options: [
          'She arrives always on time for morning meetings.',
          'She always arrives on time for morning meetings.',
          'Always she arrives on time for morning meetings.',
          'She arrives on time always for morning meetings.'
        ],
        correctAnswer: 'She always arrives on time for morning meetings.',
        explanation: 'Los adverbios de frecuencia (always, usually, never) van antes del verbo principal, pero después del verbo To Be.'
      },
      {
        id: 'ps-ex6',
        type: 'fill-blank',
        difficulty: 'advanced',
        prompt: 'Completa con el verbo en presente simple para indicar horario programado: "The international flight _____ (depart) at 06:30 AM tomorrow."',
        hint: 'Agrega -s por ser tercera persona singular (it)',
        correctAnswer: 'departs',
        explanation: 'En horarios fijos de transporte o eventos públicos se utiliza Presente Simple, incluso con referencia temporal a mañana.'
      },
      {
        id: 'ps-ex7',
        type: 'multiple-choice',
        difficulty: 'basic',
        prompt: 'Selecciona la forma correcta para "they": "My cousins _____ in Canada."',
        options: ['live', 'lives', 'living', 'are live'],
        correctAnswer: 'live',
        explanation: 'Con pronombres o sujetos en plural (they / my cousins), el verbo en presente simple no lleva la "s" final.'
      },
      {
        id: 'ps-ex8',
        type: 'fill-blank',
        difficulty: 'intermediate',
        prompt: 'Pregunta en presente simple: "What time _____ your father wake up on Saturdays?"',
        hint: 'Auxiliar does para he',
        correctAnswer: 'does',
        explanation: 'Para la tercera persona singular (your father = he), el auxiliar de pregunta es "does".'
      },
      {
        id: 'ps-ex9',
        type: 'sentence-order',
        difficulty: 'advanced',
        prompt: 'Ordena la oración con adverbio de frecuencia y complemento de tiempo:',
        scrambledWords: ['We', 'rarely', 'eat', 'out', 'during', 'the', 'workweek'],
        correctAnswer: ['We', 'rarely', 'eat', 'out', 'during', 'the', 'workweek'],
        explanation: 'El adverbio "rarely" se ubica inmediatamente antes del verbo principal "eat".'
      },
      {
        id: 'ps-ex10',
        type: 'multiple-choice',
        difficulty: 'expert',
        prompt: 'Voz Pasiva en Present Simple: "In sustainable agriculture, solar energy _____ (use) to power all automated irrigation pumps."',
        options: ['is used', 'uses', 'is using', 'are used'],
        correctAnswer: 'is used',
        explanation: 'La voz pasiva en Presente Simple se forma con [am/is/are + participio pasado]. Al ser "solar energy" un sustantivo singular incontable, requiere "is used".'
      },
      {
        id: 'ps-ex11',
        type: 'fill-blank',
        difficulty: 'expert',
        prompt: 'Estructura Condicional Cero científica: "If atmospheric pressure drops abruptly, water _____ (boil) at a lower temperature."',
        hint: 'Presente simple para leyes naturales (tercera persona singular)',
        correctAnswer: 'boils',
        explanation: 'En el Zero Conditional empleado para leyes científicas, ambas cláusulas utilizan el Presente Simple: If + Present Simple, Present Simple.'
      }
    ]
  },

  // 2. PRESENT CONTINUOUS
  {
    id: 'present-continuous',
    name: 'Present Continuous',
    spanishName: 'Presente Continuo',
    group: 'present',
    aspect: 'continuous',
    cefrLevel: 'A1',
    isFreePreview: true,
    tagline: 'Acciones que ocurren exactamente ahora o planes futuros confirmados.',
    timelineGraphic: {
      start: 'Comenzó hace poco',
      focus: 'En progreso en este instante',
      end: 'Terminará pronto'
    },
    formula: {
      affirmative: 'Sujeto + am / is / are + Verbo con -ing',
      negative: 'Sujeto + am not / isn\'t / aren\'t + Verbo con -ing',
      question: 'Am / Is / Are + Sujeto + Verbo con -ing + ?',
      auxiliary: 'Verbo To Be (am, is, are)',
      verbForm: 'Gerundio (Verbo + ing)'
    },
    whenToUse: [
      {
        title: 'Acciones en el momento de hablar',
        description: 'Cosas que están pasando justo en este segundo frente a ti.',
        example: 'Look! It is raining outside right now.'
      },
      {
        title: 'Situaciones temporales',
        description: 'Acciones que duran unos días o semanas, no permanentes.',
        example: 'I am staying with my cousin while my apartment is painted.'
      },
      {
        title: 'Planes futuros confirmados (Arrangements)',
        description: 'Citas o viajes ya agendados con hora o boleto.',
        example: 'We are meeting the marketing team tomorrow at 10 AM.'
      }
    ],
    signalWords: ['now', 'right now', 'at the moment', 'currently', 'these days', 'Look!', 'Listen!'],
    commonMistakes: [
      {
        wrong: 'I am want a coffee.',
        correct: 'I want a coffee.',
        why: 'Los "stative verbs" (querer, necesitar, saber, amar) generalmente no se usan en tiempos continuos.'
      },
      {
        wrong: 'He is study right now.',
        correct: 'He is studying right now.',
        why: 'El presente continuo SIEMPRE exige la terminación "-ing" en el verbo de acción.'
      }
    ],
    examples: [
      {
        id: 'pc-1',
        english: 'Listen! The baby is crying in the next room.',
        spanish: '¡Escucha! El bebé está llorando en la otra habitación.',
        contextNote: 'Acción que ocurre en este instante exacto.',
        audioText: 'Listen! The baby is crying in the next room.'
      },
      {
        id: 'pc-2',
        english: 'They are developing a revolutionary mobile app.',
        spanish: 'Ellos están desarrollando una aplicación móvil revolucionaria.',
        contextNote: 'Proyecto temporal en proceso durante este periodo.',
        audioText: 'They are developing a revolutionary mobile app.'
      },
      {
        id: 'pc-3',
        english: 'Are you working on the monthly report?',
        spanish: '¿Estás trabajando en el informe mensual?',
        contextNote: 'Pregunta sobre actividad actual.',
        audioText: 'Are you working on the monthly report?'
      },
      {
        id: 'pc-4',
        english: 'I am flying to New York next Thursday.',
        spanish: 'Vuelo a Nueva York el próximo jueves.',
        contextNote: 'Futuro fijado con billete comprado.',
        audioText: 'I am flying to New York next Thursday.'
      }
    ],
    videoLesson: {
      title: 'Present Continuous en Inglés: Uso, Estructura y Ejemplos Reales',
      instructor: 'BBC Learning English',
      youtubeId: 'xFsYrTIndhI',
      duration: '10 min',
      summary: 'Diferencia el presente simple del presente continuo y domina el uso de am/is/are + ing.',
      keyTakeaways: [
        'No olvides conjugar el verbo to be según el sujeto.',
        'Regla de duplicación de consonante: run -> running, swim -> swimming.',
        'Úsalo para hablar de tu agenda de mañana cuando ya esté confirmada.'
      ]
    },
    exercises: [
      {
        id: 'pc-ex1',
        type: 'multiple-choice',
        difficulty: 'basic',
        prompt: 'Completa: "Quiet please! The students _____ an important exam right now."',
        options: ['take', 'are taking', 'is taking', 'took'],
        correctAnswer: 'are taking',
        explanation: 'Sujeto plural (The students = they) requiere el auxiliar "are" + verbo con ing "taking".'
      },
      {
        id: 'pc-ex2',
        type: 'fill-blank',
        difficulty: 'basic',
        prompt: 'Escribe la forma continua del verbo run: "The dog is ______ in the park."',
        hint: 'Duplica la consonante final',
        correctAnswer: 'running',
        explanation: 'Los verbos monosílabos con estructura Consonante-Vocal-Consonante duplican la última letra: run -> running.'
      },
      {
        id: 'pc-ex3',
        type: 'sentence-order',
        difficulty: 'intermediate',
        prompt: 'Ordena la oración afirmativa en presente continuo:',
        scrambledWords: ['is', 'dinner', 'cooking', 'Mom', 'in', 'the', 'kitchen'],
        correctAnswer: ['Mom', 'is', 'cooking', 'dinner', 'in', 'the', 'kitchen'],
        explanation: 'Estructura: Sujeto (Mom) + is + Verbo-ing (cooking) + Objeto (dinner) + Lugar (in the kitchen).'
      },
      {
        id: 'pc-ex4',
        type: 'multiple-choice',
        difficulty: 'intermediate',
        prompt: '¿Cuál opción expresa un plan futuro confirmado (arrangement)?',
        options: [
          'I am visiting my dentist tomorrow at 3:00 PM.',
          'I visit my dentist tomorrow at 3:00 PM.',
          'I was visiting my dentist tomorrow.',
          'I am visit my dentist.'
        ],
        correctAnswer: 'I am visiting my dentist tomorrow at 3:00 PM.',
        explanation: 'El Present Continuous se utiliza habitualmente para citas personales y compromisos previamente agendados.'
      },
      {
        id: 'pc-ex5',
        type: 'multiple-choice',
        difficulty: 'advanced',
        prompt: 'Uso de verbos de estado: ¿Cuál oración es gramaticalmente correcta?',
        options: [
          'I am understanding the lesson now.',
          'I understand the lesson now.',
          'I am knowing the answer.',
          'I am believing you.'
        ],
        correctAnswer: 'I understand the lesson now.',
        explanation: '"Understand", "know" y "believe" son verbos estáticos (stative verbs) que no suelen usarse en forma continua.'
      },
      {
        id: 'pc-ex6',
        type: 'fill-blank',
        difficulty: 'advanced',
        prompt: 'Uso con "always" para queja o irritación: "He is always _____ (lose) his car keys!"',
        hint: 'Termina en -ing',
        correctAnswer: 'losing',
        explanation: 'El Present Continuous con "always" expresa fastidio recurrente ante una conducta molesta.'
      },
      {
        id: 'pc-ex7',
        type: 'multiple-choice',
        difficulty: 'basic',
        prompt: 'Completa la acción del momento: "Listen! The baby _____ right now."',
        options: ['is crying', 'cries', 'crying', 'cry'],
        correctAnswer: 'is crying',
        explanation: '"Listen!" y "right now" son marcadores claros de que la acción ocurre en el instante de hablar.'
      },
      {
        id: 'pc-ex8',
        type: 'fill-blank',
        difficulty: 'intermediate',
        prompt: 'Completa la negación: "They _____ (not / watch) TV, they are studying for finals."',
        hint: 'Usa aren\'t watching',
        correctAnswer: "aren't watching",
        explanation: 'Para "they" se utiliza el auxiliar negativo "aren\'t" + watching.'
      },
      {
        id: 'pc-ex9',
        type: 'sentence-order',
        difficulty: 'advanced',
        prompt: 'Ordena la pregunta sobre planes acordados para el fin de semana:',
        scrambledWords: ['Are', 'you', 'meeting', 'David', 'for', 'lunch', 'tomorrow', '?'],
        correctAnswer: ['Are', 'you', 'meeting', 'David', 'for', 'lunch', 'tomorrow', '?'],
        explanation: 'Estructura de cita programada (arrangement): Are + you + meeting + persona + complemento temporal + ?'
      },
      {
        id: 'pc-ex10',
        type: 'fill-blank',
        difficulty: 'expert',
        prompt: 'Voz Pasiva en Present Continuous: "The historic city cathedral _____ (restore) by international conservators this semester."',
        hint: 'Estructura pasiva continua: is being + past participle',
        correctAnswer: 'is being restored',
        explanation: 'La voz pasiva en Present Continuous se forma con [am/is/are + being + participio pasado]. Al ser singular el sujeto paciente ("cathedral"), es "is being restored".'
      },
      {
        id: 'pc-ex11',
        type: 'multiple-choice',
        difficulty: 'expert',
        prompt: 'Estructura Condicional con Present Continuous: "If the regulatory team _____ the factory right now, we must suspend all chemical handling operations immediately."',
        options: ['is inspecting', 'inspects', 'are inspecting', 'has inspected'],
        correctAnswer: 'is inspecting',
        explanation: 'En cláusulas condicionales con "if", se emplea Present Continuous para una acción que se sospecha o se plantea en desarrollo simultáneo en este preciso instante ("right now"). "Regulatory team" actúa como sujeto singular ("is inspecting").'
      }
    ]
  }
];

// All 12 tenses in course order. The ten membership lessons start as public
// previews (name, formula, first example); their full content is delivered by
// the server after sign-in and installed here with installPremiumLessons().
export const ALL_12_TENSES: TenseData[] = [...FREE_TENSES, ...TENSE_PREVIEWS.map((preview) => structuredClone(preview))];

const replaceContent = (target: TenseData, source: TenseData) => {
  for (const key of Object.keys(target)) delete (target as any)[key];
  Object.assign(target, structuredClone(source));
};

// Replaces previews in place so every screen that already holds a tense sees the full lesson.
export function installPremiumLessons(lessons: TenseData[]): boolean {
  const byId = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  const locked = ALL_12_TENSES.filter((tense) => !tense.isFreePreview);
  if (locked.some((tense) => !byId.get(tense.id)?.exercises?.length)) return false;
  for (const tense of locked) replaceContent(tense, { ...byId.get(tense.id)!, isFreePreview: false });
  return true;
}

export function removePremiumLessons(): void {
  for (const preview of TENSE_PREVIEWS) {
    const tense = ALL_12_TENSES.find((item) => item.id === preview.id);
    if (tense) replaceContent(tense, preview);
  }
}

export const COMPARISONS_DATA = [
  {
    id: 'present-perfect-vs-past-simple',
    title: 'Present Perfect vs. Past Simple',
    subtitle: 'El dilema #1 de todo hispanohablante',
    leftTense: 'Present Perfect (Have worked)',
    rightTense: 'Past Simple (Worked)',
    rules: [
      {
        left: 'Tiempo INDEFINIDO o no concluido (today, this week).',
        right: 'Tiempo DEFINIDO y totalmente terminado (yesterday, in 2020).'
      },
      {
        left: 'El resultado está conectado directamente con el AHORA.',
        right: 'El evento pertenece al pasado y ya no afecta el presente.'
      },
      {
        left: 'Experiencias de vida ("I have traveled to Rome").',
        right: 'Detalles específicos ("I traveled there last summer").'
      }
    ],
    examplePairs: [
      {
        situation: 'Perder las llaves',
        left: 'I have lost my keys. (No puedo entrar a casa ahora mismo)',
        right: 'I lost my keys yesterday, but I found them this morning.'
      },
      {
        situation: 'Tomar café en el día',
        left: 'I have drunk two coffees today. (El día aún continúa)',
        right: 'I drank two coffees this morning. (Ya es de tarde/noche)'
      }
    ]
  },
  {
    id: 'present-simple-vs-present-continuous',
    title: 'Present Simple vs. Present Continuous',
    subtitle: '¿Lo haces siempre o lo estás haciendo justo ahora?',
    leftTense: 'Present Simple (I work)',
    rightTense: 'Present Continuous (I am working)',
    rules: [
      {
        left: 'Rutinas, hábitos permanentes y leyes universales.',
        right: 'Acciones en progreso en este instante o temporales.'
      },
      {
        left: 'Palabras clave: always, usually, every day, often.',
        right: 'Palabras clave: now, right now, currently, at the moment.'
      }
    ],
    examplePairs: [
      {
        situation: 'Lugar de residencia y vacaciones',
        left: 'I live in Mexico City. (Mi hogar permanente)',
        right: 'I am living with my friends this week. (Solo unos días)'
      }
    ]
  },
  {
    id: 'will-vs-be-going-to',
    title: 'Future: Will vs. Be Going To',
    subtitle: '¿Decisión del momento o plan premeditado?',
    leftTense: 'Will (I will go)',
    rightTense: 'Be Going To (I am going to go)',
    rules: [
      {
        left: 'Decisiones espontáneas tomadas al hablar ("I\'ll help you!").',
        right: 'Planes previos ya pensados ("I am going to visit my mom").'
      },
      {
        left: 'Promesas, predicciones basadas en opinión ("I think it will rain").',
        right: 'Predicciones basadas en evidencia visual ("Look at the clouds!").'
      }
    ],
    examplePairs: [
      {
        situation: 'Alguien toca a la puerta',
        left: 'Don\'t get up, I will open it! (Decisión espontánea)',
        right: 'I am going to open a business next year. (Proyecto meditado)'
      }
    ]
  }
];
