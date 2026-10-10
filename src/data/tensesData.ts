import { TenseData } from '../types';

export const ALL_12_TENSES: TenseData[] = [
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
  },

  // 3. PRESENT PERFECT
  {
    id: 'present-perfect',
    name: 'Present Perfect',
    spanishName: 'Presente Perfecto',
    group: 'present',
    aspect: 'perfect',
    cefrLevel: 'A2',
    isFreePreview: false,
    tagline: 'Experiencias de vida y acciones pasadas que tienen conexión directa con el ahora.',
    timelineGraphic: {
      start: 'Ocurrió en tiempo indefinido',
      focus: 'El resultado importa en el presente',
      end: 'Ahora mismo'
    },
    formula: {
      affirmative: 'Sujeto + have / has + Verbo en Participio Pasado (3ra columna)',
      negative: 'Sujeto + haven\'t / hasn\'t + Verbo en Participio Pasado',
      question: 'Have / Has + Sujeto + Verbo en Participio Pasado + ?',
      auxiliary: 'Have / Has',
      verbForm: 'Participio Pasado (Past Participle - ej: eaten, seen, worked)'
    },
    whenToUse: [
      {
        title: 'Experiencias de vida sin fecha exacta',
        description: 'Cosas que has hecho (o no has hecho) en toda tu vida.',
        example: 'I have visited Japan twice.'
      },
      {
        title: 'Acciones pasadas con resultado visible hoy',
        description: 'La acción terminó, pero su efecto se siente en este momento.',
        example: 'I have lost my keys (resultado: no puedo entrar a mi casa ahora).'
      },
      {
        title: 'Periodos de tiempo aún no terminados',
        description: 'Con expresiones como "today", "this week", "this year".',
        example: 'I have drunk three cups of coffee today (el día no ha terminado).'
      }
    ],
    signalWords: ['already', 'yet', 'just', 'ever', 'never', 'since', 'for', 'recently', 'so far'],
    commonMistakes: [
      {
        wrong: 'I have seen him yesterday.',
        correct: 'I saw him yesterday.',
        why: 'Si mencionas una fecha o momento exacto del pasado (yesterday, last year, in 2020), DEBES usar Past Simple, nunca Present Perfect.'
      },
      {
        wrong: 'She has lived here since five years.',
        correct: 'She has lived here for five years.',
        why: '"Since" se usa para puntos de partida (since 2018), y "for" para periodos de duración (for 5 years).'
      }
    ],
    examples: [
      {
        id: 'pp-1',
        english: 'Have you ever eaten sushi?',
        spanish: '¿Alguna vez has comido sushi?',
        contextNote: 'Pregunta sobre experiencia de vida con "ever".',
        audioText: 'Have you ever eaten sushi?'
      },
      {
        id: 'pp-2',
        english: 'She has just finished her presentation.',
        spanish: 'Ella acaba de terminar su presentación.',
        contextNote: '"Just" indica que ocurrió hace escasos minutos.',
        audioText: 'She has just finished her presentation.'
      },
      {
        id: 'pp-3',
        english: 'We have lived in this neighborhood since 2015.',
        spanish: 'Hemos vivido en este vecindario desde el 2015.',
        contextNote: 'Acción que empezó en 2015 y continúa hoy.',
        audioText: 'We have lived in this neighborhood since 2015.'
      },
      {
        id: 'pp-4',
        english: 'I haven\'t received the confirmation email yet.',
        spanish: 'Aún no he recibido el correo de confirmación.',
        contextNote: '"Yet" va al final en oraciones negativas o preguntas.',
        audioText: 'I have not received the confirmation email yet.'
      }
    ],
    videoLesson: {
      title: 'El Presente Perfecto en Inglés Explicado Fácil y Rápido',
      instructor: 'BBC Learning English',
      youtubeId: 'mzu9uCSIjes',
      duration: '12 min',
      summary: 'Domina la diferencia crucial entre "Since" vs "For", cuándo usar "Ever" y la regla de oro del resultado en el presente.',
      keyTakeaways: [
        'Usa have para I/You/We/They y has para He/She/It.',
        'Participio pasado: regulares terminan en -ed, irregulares cambian (go -> gone).',
        'Nunca menciones una hora o fecha específica del pasado con este tiempo.'
      ]
    },
    exercises: [
      {
        id: 'pp-ex1',
        type: 'multiple-choice',
        difficulty: 'basic',
        prompt: 'Elige la opción correcta: "Mark _____ his passport, so he can\'t travel today."',
        options: ['has lost', 'have lost', 'lost yesterday', 'is losing'],
        correctAnswer: 'has lost',
        explanation: 'Sujeto singular (Mark = he) lleva "has" + participio "lost". El resultado afecta el día de hoy.'
      },
      {
        id: 'pp-ex2',
        type: 'fill-blank',
        difficulty: 'basic',
        prompt: 'Completa con SINCE o FOR: "They have been married _____ 20 years."',
        correctAnswer: 'for',
        explanation: 'Usamos "for" para medir duración de tiempo acumulado (20 years).'
      },
      {
        id: 'pp-ex3',
        type: 'sentence-order',
        difficulty: 'intermediate',
        prompt: 'Ordena la pregunta clásica de experiencia:',
        scrambledWords: ['you', 'Have', 'ever', 'been', 'to', 'London', '?'],
        correctAnswer: ['Have', 'you', 'ever', 'been', 'to', 'London', '?'],
        explanation: 'Estructura: Have + Sujeto (you) + ever + been + to London + ?'
      },
      {
        id: 'pp-ex4',
        type: 'multiple-choice',
        difficulty: 'intermediate',
        prompt: 'Uso de ALREADY vs YET: ¿Cuál oración está bien construida?',
        options: [
          'I haven\'t finished my homework yet.',
          'I haven\'t finished my homework already.',
          'Have you yet seen that movie?',
          'She already has not called.'
        ],
        correctAnswer: 'I haven\'t finished my homework yet.',
        explanation: '"Yet" se coloca al final de oraciones negativas ("aún no") y en preguntas ("¿ya?").'
      },
      {
        id: 'pp-ex5',
        type: 'multiple-choice',
        difficulty: 'advanced',
        prompt: 'Diferencia crucial: "Present Perfect vs Past Simple". ¿Cuál es correcta?',
        options: [
          'I have seen John ten minutes ago.',
          'I saw John ten minutes ago.',
          'I have saw John ten minutes ago.',
          'I saw John already.'
        ],
        correctAnswer: 'I saw John ten minutes ago.',
        explanation: 'Con marcadores temporales concluidos y precisos como "ten minutes ago", se debe emplear Past Simple.'
      },
      {
        id: 'pp-ex6',
        type: 'fill-blank',
        difficulty: 'advanced',
        prompt: 'Diferencia entre BEEN y GONE: Si María viajó a París y aún no regresa a casa, decimos "She has _____ (go) to Paris."',
        hint: 'Usa gone para ida sin regreso y been para ida y vuelta',
        correctAnswer: 'gone',
        explanation: '"Gone" significa que fue y sigue allí. "Been" significa que fue y ya volvió.'
      },
      {
        id: 'pp-ex7',
        type: 'multiple-choice',
        difficulty: 'basic',
        prompt: 'Completa con la tercera persona: "She _____ three emails this morning."',
        options: ['has sent', 'have sent', 'has send', 'is sending'],
        correctAnswer: 'has sent',
        explanation: 'Con "she" se usa "has" + el participio pasado irregular de send ("sent").'
      },
      {
        id: 'pp-ex8',
        type: 'fill-blank',
        difficulty: 'intermediate',
        prompt: 'Uso de SINCE vs FOR: "I haven\'t seen Marco _____ last Tuesday."',
        hint: 'Usa since para punto de partida temporal',
        correctAnswer: 'since',
        explanation: '"Since" se emplea para indicar el momento exacto en que comenzó el periodo ("last Tuesday").'
      },
      {
        id: 'pp-ex9',
        type: 'sentence-order',
        difficulty: 'advanced',
        prompt: 'Ordena la oración que expresa una acción culminada justo hace unos instantes:',
        scrambledWords: ['The', 'plane', 'has', 'just', 'landed', 'safely', 'at', 'the', 'gate'],
        correctAnswer: ['The', 'plane', 'has', 'just', 'landed', 'safely', 'at', 'the', 'gate'],
        explanation: '"Just" se coloca entre el auxiliar "has" y el participio "landed" para denotar que ocurrió hace escasos segundos.'
      },
      {
        id: 'pp-ex10',
        type: 'fill-blank',
        difficulty: 'expert',
        prompt: 'Voz Pasiva en Present Perfect: "All confidential financial documents _____ (submit) to the international oversight board."',
        hint: 'Fórmula pasiva: have been + participio pasado',
        correctAnswer: 'have been submitted',
        explanation: 'La voz pasiva del Present Perfect se forma con [have/has been + participio pasado]. Al ser "documents" un sustantivo plural, se utiliza "have been submitted".'
      },
      {
        id: 'pp-ex11',
        type: 'multiple-choice',
        difficulty: 'expert',
        prompt: 'First Conditional con cláusula de culminación previa en Present Perfect: "If the lead scientist _____ all trial audits by noon, the committee will approve the rollout."',
        options: ['has completed', 'will complete', 'had completed', 'would complete'],
        correctAnswer: 'has completed',
        explanation: 'En las oraciones condicionales de primer tipo, se emplea el Present Perfect en la cláusula subordinada introducida por "if" para enfatizar que una acción debe quedar consumada antes de que se produzca la consecuencia futura.'
      }
    ]
  },

  // 4. PRESENT PERFECT CONTINUOUS
  {
    id: 'present-perfect-continuous',
    name: 'Present Perfect Continuous',
    spanishName: 'Presente Perfecto Continuo',
    group: 'present',
    aspect: 'perfect-continuous',
    cefrLevel: 'B1',
    isFreePreview: false,
    tagline: 'Acciones prolongadas iniciadas en el pasado que aún continúan o acaban de detenerse.',
    timelineGraphic: {
      start: 'Inició en el pasado',
      focus: 'Duración continua ininterrumpida',
      end: 'Llega hasta el presente'
    },
    formula: {
      affirmative: 'Sujeto + have / has been + Verbo con -ing',
      negative: 'Sujeto + haven\'t / hasn\'t been + Verbo con -ing',
      question: 'Have / Has + Sujeto + been + Verbo con -ing + ?',
      auxiliary: 'Have / Has + been',
      verbForm: 'Verbo con -ing'
    },
    whenToUse: [
      {
        title: 'Énfasis en la duración de la actividad',
        description: 'Importa cuánto tiempo llevas haciendo algo, no si ya está terminado.',
        example: 'I have been studying English for three hours non-stop.'
      },
      {
        title: 'Evidencia física reciente',
        description: 'La acción acaba de parar pero se ve el esfuerzo o cansancio.',
        example: 'He is sweating because he has been running.'
      }
    ],
    signalWords: ['for hours', 'since 8 AM', 'all day', 'all week', 'lately', 'recently', 'How long...?'],
    commonMistakes: [
      {
        wrong: 'I am waiting for you since 2 hours.',
        correct: 'I have been waiting for you for two hours.',
        why: 'En español decimos "estoy esperando desde...", pero en inglés si comenzó en el pasado y sigue vigente se usa Present Perfect Continuous.'
      }
    ],
    examples: [
      {
        id: 'ppc-1',
        english: 'It has been raining all morning and the streets are flooded.',
        spanish: 'Ha estado lloviendo toda la mañana y las calles están inundadas.',
        contextNote: 'Proceso continuo desde la mañana hasta ahora.',
        audioText: 'It has been raining all morning and the streets are flooded.'
      },
      {
        id: 'ppc-2',
        english: 'How long have you been learning English?',
        spanish: '¿Cuánto tiempo llevas aprendiendo inglés?',
        contextNote: 'La pregunta más común para medir trayectoria.',
        audioText: 'How long have you been learning English?'
      },
      {
        id: 'ppc-3',
        english: 'She has been working on that project since January.',
        spanish: 'Ella ha estado trabajando en ese proyecto desde enero.',
        contextNote: 'Punto de partida con "since" + duración continua.',
        audioText: 'She has been working on that project since January.'
      }
    ],
    videoLesson: {
      title: 'Present Perfect Continuous: Cómo Pensar en Duración',
      instructor: 'BBC Learning English',
      youtubeId: 'pvoqkQHb3lo',
      duration: '9 min',
      summary: 'Descubre por qué a los nativos les encanta este tiempo para sonar naturales y fluidos.',
      keyTakeaways: [
        'Estructura fija: HAVE/HAS + BEEN + VERBO-ING.',
        'Se enfoca en el esfuerzo continuo más que en la meta lograda.',
        'La pregunta "How long have you been...?" te abrirá conversaciones en cualquier país.'
      ]
    },
    exercises: [
      {
        id: 'ppc-ex1',
        type: 'multiple-choice',
        difficulty: 'basic',
        prompt: 'Completa: "My eyes hurt because I _____ computer screens all day."',
        options: ['have been watching', 'am watching', 'watched', 'has been watching'],
        correctAnswer: 'have been watching',
        explanation: 'Sujeto "I" usa "have been" + watching para denotar la causa y duración del cansancio visual.'
      },
      {
        id: 'ppc-ex2',
        type: 'fill-blank',
        difficulty: 'basic',
        prompt: 'Escribe la palabra faltante en la estructura: "She has _____ working here since 2022."',
        hint: 'Participio de to be',
        correctAnswer: 'been',
        explanation: 'La fórmula requiere siempre "been" entre has/have y el verbo con -ing.'
      },
      {
        id: 'ppc-ex3',
        type: 'sentence-order',
        difficulty: 'intermediate',
        prompt: 'Ordena la pregunta para indagar duración:',
        scrambledWords: ['How', 'long', 'have', 'been', 'waiting', 'you', '?'],
        correctAnswer: ['How', 'long', 'have', 'you', 'been', 'waiting', '?'],
        explanation: 'Estructura: How long + have + Sujeto (you) + been + waiting + ?'
      },
      {
        id: 'ppc-ex4',
        type: 'multiple-choice',
        difficulty: 'intermediate',
        prompt: 'Elige la opción que explica una evidencia física en el presente:',
        options: [
          'His clothes are dirty because he has been painting the garage.',
          'His clothes are dirty because he paints the garage.',
          'His clothes are dirty because he will paint the garage.',
          'His clothes are dirty because he had paint the garage.'
        ],
        correctAnswer: 'His clothes are dirty because he has been painting the garage.',
        explanation: 'El resultado visible actual (ropa sucia) se explica con la actividad continua reciente.'
      },
      {
        id: 'ppc-ex5',
        type: 'multiple-choice',
        difficulty: 'advanced',
        prompt: 'Present Perfect Simple vs Continuous: ¿Qué opción enfatiza que el libro YA está terminado?',
        options: [
          'I have read the book you recommended. (Terminado)',
          'I have been reading the book you recommended. (Aún leyendo)',
          'I am read the book.',
          'I was reading the book.'
        ],
        correctAnswer: 'I have read the book you recommended. (Terminado)',
        explanation: 'Present Perfect Simple resalta que la tarea se completó ("he terminado el libro"), mientras que el Continuous destaca el proceso en marcha.'
      },
      {
        id: 'ppc-ex6',
        type: 'fill-blank',
        difficulty: 'advanced',
        prompt: 'Completa con la forma negativa: "We _____ (not have / wait) for very long, just five minutes."',
        hint: 'Usa haven\'t been',
        correctAnswer: "haven't been waiting",
        explanation: 'Forma negativa en Present Perfect Continuous: haven\'t been + waiting.'
      },
      {
        id: 'ppc-ex7',
        type: 'multiple-choice',
        difficulty: 'basic',
        prompt: 'Completa: "It _____ all afternoon and the streets are flooded."',
        options: ['has been raining', 'have been raining', 'is raining', 'rained'],
        correctAnswer: 'has been raining',
        explanation: 'Para "it" el auxiliar es "has been" + raining, enfatizando la lluvia prolongada.'
      },
      {
        id: 'ppc-ex8',
        type: 'fill-blank',
        difficulty: 'intermediate',
        prompt: 'Completa la pregunta de duración: "How long has he _____ (work) on this project?"',
        hint: 'Fórmula: been + working',
        correctAnswer: 'been working',
        explanation: 'La pregunta en Present Perfect Continuous requiere "been" + verbo con -ing.'
      },
      {
        id: 'ppc-ex9',
        type: 'sentence-order',
        difficulty: 'advanced',
        prompt: 'Ordena la oración que explica el cansancio acumulado:',
        scrambledWords: ['I', 'am', 'tired', 'because', 'I', 'have', 'been', 'running', 'in', 'the', 'heat'],
        correctAnswer: ['I', 'am', 'tired', 'because', 'I', 'have', 'been', 'running', 'in', 'the', 'heat'],
        explanation: 'Conexión causa-efecto en el presente: cansancio presente (am tired) provocado por proceso continuo (have been running).'
      },
      {
        id: 'ppc-ex10',
        type: 'multiple-choice',
        difficulty: 'expert',
        prompt: 'Estructura Condicional con causa continua prolongada: "If the cooling system _____ continuously for over twelve hours, safety sensors will trigger an immediate shutdown."',
        options: ['has been overheating', 'will overheat', 'is overheat', 'had been overheat'],
        correctAnswer: 'has been overheating',
        explanation: 'En una estructura condicional de tipo 1, la cláusula "if" puede emplear el Present Perfect Continuous ("has been overheating") para indicar que un proceso que ha venido sucediendo durante un periodo extendido provocará una consecuencia.'
      },
      {
        id: 'ppc-ex11',
        type: 'multiple-choice',
        difficulty: 'expert',
        prompt: 'Voz Pasiva formal de Present Perfect Continuous: ¿Cuál es la estructura gramatical pasiva exacta para expresar un proceso continuo prolongado que sigue en marcha?',
        options: [
          'The ancient manuscripts have been being restored by specialists for six months.',
          'The ancient manuscripts have been restoring by specialists for six months.',
          'The ancient manuscripts have being restored by specialists for six months.',
          'The ancient manuscripts are been being restored by specialists for six months.'
        ],
        correctAnswer: 'The ancient manuscripts have been being restored by specialists for six months.',
        explanation: 'La voz pasiva de Present Perfect Continuous sigue la fórmula [have/has + been + being + participio pasado]. Aunque poco frecuente en el habla coloquial, es la construcción gramaticalmente precisa en inglés formal de nivel C1/C2.'
      }
    ]
  },

  // 5. PAST SIMPLE
  {
    id: 'past-simple',
    name: 'Past Simple',
    spanishName: 'Pasado Simple',
    group: 'past',
    aspect: 'simple',
    cefrLevel: 'A1',
    isFreePreview: false,
    tagline: 'Acciones puntuales que comenzaron y terminaron completamente en el pasado.',
    timelineGraphic: {
      start: 'Inició en el pasado',
      focus: 'Punto exacto terminado (X)',
      end: 'Sin efecto en el presente'
    },
    formula: {
      affirmative: 'Sujeto + Verbo en pasado (regulares: -ed / irregulares: 2da columna)',
      negative: 'Sujeto + did not (didn\'t) + Verbo en forma base',
      question: 'Did + Sujeto + Verbo en forma base + ?',
      auxiliary: 'Did / Didn\'t',
      verbForm: 'Verbo en pasado en afirmaciones; Verbo base en negación/pregunta'
    },
    whenToUse: [
      {
        title: 'Acciones finalizadas con tiempo específico',
        description: 'Cuando se sabe o se dice cuándo ocurrió con exactitud.',
        example: 'We visited Rome in July 2021.'
      },
      {
        title: 'Secuencia de eventos pasados (Narración)',
        description: 'Una serie de acciones consecutivas una tras otra.',
        example: 'He woke up, brushed his teeth, and left the house.'
      }
    ],
    signalWords: ['yesterday', 'last night', 'last week', 'two days ago', 'in 1999', 'when I was a child'],
    commonMistakes: [
      {
        wrong: 'I didn\'t went to work yesterday.',
        correct: 'I didn\'t go to work yesterday.',
        why: '¡Error clásico! El auxiliar "didn\'t" ya está en pasado; el verbo principal vuelve a su forma base (go, no went).'
      },
      {
        wrong: 'Did you liked the movie?',
        correct: 'Did you like the movie?',
        why: 'Con el auxiliar "Did", el verbo principal no lleva terminación "-ed".'
      }
    ],
    examples: [
      {
        id: 'pst-1',
        english: 'I bought a new laptop last weekend.',
        spanish: 'Compré una computadora portátil el fin de semana pasado.',
        contextNote: 'Verbo irregular: buy -> bought. Tiempo específico.',
        audioText: 'I bought a new laptop last weekend.'
      },
      {
        id: 'pst-2',
        english: 'Did you watch the football match yesterday?',
        spanish: '¿Viste el partido de fútbol ayer?',
        contextNote: 'Pregunta con Did + verbo base watch.',
        audioText: 'Did you watch the football match yesterday?'
      },
      {
        id: 'pst-3',
        english: 'She didn\'t understand the instructions at first.',
        spanish: 'Ella no entendió las instrucciones al principio.',
        contextNote: 'Negativo con didn\'t + understand.',
        audioText: 'She did not understand the instructions at first.'
      }
    ],
    videoLesson: {
      title: 'Pasado Simple en Inglés: Trucos con Verbos Regulares e Irregulares',
      instructor: 'engVid Emma',
      youtubeId: 'Fk5XGzTVI0s',
      duration: '14 min',
      summary: 'Aprende la pronunciación correcta de la terminación -ed (/t/, /d/, /id/) y el uso infalible de Did.',
      keyTakeaways: [
        'DID es el único auxiliar de pasado para todas las personas (I, you, he, she, we, they).',
        'En preguntas y negaciones el verbo NO se conjuga en pasado.',
        'Aprende los 30 verbos irregulares más frecuentes por grupos de sonido.'
      ]
    },
    exercises: [
      {
        id: 'pst-ex1',
        type: 'multiple-choice',
        difficulty: 'basic',
        prompt: '¿Cuál opción completa correctamente la frase?: "Last night we _____ at a wonderful Italian restaurant."',
        options: ['ate', 'eated', 'eat', 'did eat'],
        correctAnswer: 'ate',
        explanation: 'El verbo "eat" es irregular y su pasado afirmativo es "ate".'
      },
      {
        id: 'pst-ex2',
        type: 'fill-blank',
        difficulty: 'basic',
        prompt: 'Completa la negación en pasado simple: "I _____ (not see) you at the party yesterday."',
        hint: 'Usa didn\'t + verbo base',
        correctAnswer: "didn't see",
        explanation: 'En oraciones negativas de pasado simple se usa "didn\'t" + la forma base del verbo (see).'
      },
      {
        id: 'pst-ex3',
        type: 'sentence-order',
        difficulty: 'intermediate',
        prompt: 'Ordena la pregunta en pasado simple:',
        scrambledWords: ['Where', 'did', 'go', 'you', 'on', 'vacation', '?'],
        correctAnswer: ['Where', 'did', 'you', 'go', 'on', 'vacation', '?'],
        explanation: 'Estructura con Wh-: Wh-word (Where) + Did + Sujeto (you) + Verbo base (go) + Complemento + ?'
      },
      {
        id: 'pst-ex4',
        type: 'multiple-choice',
        difficulty: 'intermediate',
        prompt: 'Encuentra el error gramatical: "¿Cuál oración es INCORRECTA?"',
        options: [
          'Did they arrive on time?',
          'She didn\'t call me yesterday.',
          'He didn\'t saw the accident.',
          'We visited our grandparents last month.'
        ],
        correctAnswer: 'He didn\'t saw the accident.',
        explanation: 'Es incorrecta porque tras "didn\'t" se debe usar la forma base "see", no "saw".'
      },
      {
        id: 'pst-ex5',
        type: 'multiple-choice',
        difficulty: 'advanced',
        prompt: 'Pronunciación de terminación regular "-ed": ¿En cuál verbo la terminación suena como una sílaba extra /ɪd/?',
        options: ['decided', 'worked', 'played', 'lived'],
        correctAnswer: 'decided',
        explanation: 'La terminación "-ed" solo se pronuncia como sílaba separada /ɪd/ cuando el verbo base termina en sonido "t" o "d" (decide -> decided, start -> started).'
      },
      {
        id: 'pst-ex6',
        type: 'fill-blank',
        difficulty: 'advanced',
        prompt: 'Secuencia narrativa de acciones consecutivas: "He opened the door, turned on the light, and _____ (find) his missing dog."',
        hint: 'Pasado irregular de find',
        correctAnswer: 'found',
        explanation: 'En una narración de eventos consecutivos rápidos en el pasado, todos los verbos van en Past Simple.'
      },
      {
        id: 'pst-ex7',
        type: 'multiple-choice',
        difficulty: 'basic',
        prompt: 'Verbo irregular en pasado: "Yesterday, she _____ a letter to her grandmother."',
        options: ['wrote', 'writed', 'write', 'written'],
        correctAnswer: 'wrote',
        explanation: 'El pasado simple del verbo irregular "write" es "wrote" (no existe "writed").'
      },
      {
        id: 'pst-ex8',
        type: 'fill-blank',
        difficulty: 'intermediate',
        prompt: 'Completa la pregunta en pasado: "_____ you enjoy the concert on Friday?"',
        hint: 'Auxiliar invariable de pasado',
        correctAnswer: 'Did',
        explanation: '"Did" es el único auxiliar de pasado simple para oraciones interrogativas.'
      },
      {
        id: 'pst-ex9',
        type: 'sentence-order',
        difficulty: 'advanced',
        prompt: 'Ordena la oración que describe una acción pasada con marcador temporal final:',
        scrambledWords: ['They', 'sold', 'their', 'old', 'apartment', 'three', 'years', 'ago'],
        correctAnswer: ['They', 'sold', 'their', 'old', 'apartment', 'three', 'years', 'ago'],
        explanation: 'Estructura: Sujeto + Past Simple (sold) + objeto + periodo + "ago".'
      },
      {
        id: 'pst-ex10',
        type: 'fill-blank',
        difficulty: 'expert',
        prompt: 'Voz Pasiva en Past Simple con fecha histórica fija: "The historic peace treaty _____ (ratify) by twenty-four sovereign nations in 1945."',
        hint: 'Fórmula pasiva: was/were + participio pasado',
        correctAnswer: 'was ratified',
        explanation: 'La voz pasiva del Pasado Simple se forma con [was/were + participio pasado]. Al tratarse de "the treaty" (singular) y un punto temporal cerrado en el pasado (1945), corresponde "was ratified".'
      },
      {
        id: 'pst-ex11',
        type: 'multiple-choice',
        difficulty: 'expert',
        prompt: 'Second Conditional (situación hipotética del presente/futuro): "If the central bank _____ benchmark interest rates tomorrow, consumer borrowing would surge dramatically."',
        options: ['slashed', 'would slash', 'had slashed', 'slashes'],
        correctAnswer: 'slashed',
        explanation: 'En el Second Conditional, la condición hipotética con "if" utiliza el Past Simple ("slashed"), mientras que la consecuencia usa "would + verbo base" ("would surge").'
      }
    ]
  },

  // 6. PAST CONTINUOUS
  {
    id: 'past-continuous',
    name: 'Past Continuous',
    spanishName: 'Pasado Continuo',
    group: 'past',
    aspect: 'continuous',
    cefrLevel: 'A2',
    isFreePreview: false,
    tagline: 'Acciones que estaban en pleno desarrollo en un momento concreto del pasado.',
    timelineGraphic: {
      start: 'En curso en el pasado',
      focus: 'Interrumpida o simultánea',
      end: 'Finalizada'
    },
    formula: {
      affirmative: 'Sujeto + was / were + Verbo con -ing',
      negative: 'Sujeto + wasn\'t / weren\'t + Verbo con -ing',
      question: 'Was / Were + Sujeto + Verbo con -ing + ?',
      auxiliary: 'Was / Were',
      verbForm: 'Verbo con -ing'
    },
    whenToUse: [
      {
        title: 'Acción en progreso interrumpida por otra',
        description: 'Una acción larga que estaba pasando cuando otra más corta la cortó.',
        example: 'I was taking a shower when the telephone rang.'
      },
      {
        title: 'Dos acciones paralelas en el pasado',
        description: 'Dos personas haciendo cosas al mismo tiempo.',
        example: 'While my brother was cooking, I was setting the table.'
      }
    ],
    signalWords: ['while', 'when', 'as', 'at 8 PM yesterday', 'all evening'],
    commonMistakes: [
      {
        wrong: 'When I was walking, I was seeing a deer.',
        correct: 'When I was walking, I saw a deer.',
        why: 'La acción que interrumpe o el hecho puntual va en Pasado Simple (saw), no continuo.'
      }
    ],
    examples: [
      {
        id: 'pcnt-1',
        english: 'What were you doing at 9:00 PM last night?',
        spanish: '¿Qué estabas haciendo a las 9:00 de anoche?',
        contextNote: 'Momento específico del pasado en curso.',
        audioText: 'What were you doing at 9:00 PM last night?'
      },
      {
        id: 'pcnt-2',
        english: 'She was driving home when the storm started.',
        spanish: 'Ella estaba conduciendo a casa cuando comenzó la tormenta.',
        contextNote: 'Acción larga (was driving) interrumpida por acción puntual (started).',
        audioText: 'She was driving home when the storm started.'
      }
    ],
    videoLesson: {
      title: 'Past Continuous: La combinación perfecta con When y While',
      instructor: 'BBC Learning English',
      youtubeId: 'bQ_WfLPK32Y',
      duration: '8 min',
      summary: 'Regla de oro: usa WHILE para la acción continua y WHEN para la acción repentina que interrumpe.',
      keyTakeaways: [
        'WAS para I, he, she, it. WERE para you, we, they.',
        'While + Pasado Continuo (While I was sleeping...).',
        'When + Pasado Simple (...when you knocked on the door).'
      ]
    },
    exercises: [
      {
        id: 'pcnt-ex1',
        type: 'multiple-choice',
        difficulty: 'basic',
        prompt: 'Completa: "They _____ video games when the power went out."',
        options: ['were playing', 'was playing', 'are playing', 'played'],
        correctAnswer: 'were playing',
        explanation: 'Sujeto plural "They" requiere "were" + verbo con ing "playing".'
      },
      {
        id: 'pcnt-ex2',
        type: 'fill-blank',
        difficulty: 'basic',
        prompt: 'Completa con WAS o WERE: "What _____ you doing at midnight last night?"',
        correctAnswer: 'were',
        explanation: 'Con el pronombre "you" siempre se emplea el auxiliar "were".'
      },
      {
        id: 'pcnt-ex3',
        type: 'sentence-order',
        difficulty: 'intermediate',
        prompt: 'Ordena la oración que describe dos acciones paralelas simultáneas:',
        scrambledWords: ['While', 'I', 'was', 'studying', 'my', 'brother', 'was', 'sleeping'],
        correctAnswer: ['While', 'I', 'was', 'studying', 'my', 'brother', 'was', 'sleeping'],
        explanation: 'Dos acciones en paralelo en el pasado se conectan habitualmente con "While" en Past Continuous.'
      },
      {
        id: 'pcnt-ex4',
        type: 'multiple-choice',
        difficulty: 'intermediate',
        prompt: 'Diferencia WHEN vs WHILE: ¿Cuál oración está correctamente construida?',
        options: [
          'I was sleeping when the alarm went off.',
          'I slept while the alarm was going off.',
          'When I was sleeping when the alarm rang.',
          'While the alarm rang, I slept.'
        ],
        correctAnswer: 'I was sleeping when the alarm went off.',
        explanation: 'La acción en progreso lleva Past Continuous (was sleeping) y la acción que interrumpe lleva "when" + Past Simple (went off).'
      },
      {
        id: 'pcnt-ex5',
        type: 'multiple-choice',
        difficulty: 'advanced',
        prompt: 'Ambientación en historias (Background description): ¿Cuál opción crea el ambiente previo al evento?',
        options: [
          'The wind was blowing and birds were singing as she stepped outside.',
          'The wind blew and birds sang as she was stepping outside.',
          'The wind is blowing and birds are singing.',
          'The wind had blown as she stepped.'
        ],
        correctAnswer: 'The wind was blowing and birds were singing as she stepped outside.',
        explanation: 'El Past Continuous se usa en literatura y narraciones para describir la atmósfera del escenario.'
      },
      {
        id: 'pcnt-ex6',
        type: 'fill-blank',
        difficulty: 'advanced',
        prompt: 'Completa con la forma negativa: "Luckily, it _____ (not rain) when we arrived at the outdoor venue."',
        hint: 'Usa wasn\'t + raining',
        correctAnswer: "wasn't raining",
        explanation: 'Sujeto "it" lleva "wasn\'t" + raining.'
      },
      {
        id: 'pcnt-ex7',
        type: 'multiple-choice',
        difficulty: 'basic',
        prompt: 'Completa con la forma plural: "We _____ dinner when the lights went out."',
        options: ['were having', 'was having', 'had', 'are having'],
        correctAnswer: 'were having',
        explanation: 'Con el pronombre "we" se utiliza "were" + having en Past Continuous.'
      },
      {
        id: 'pcnt-ex8',
        type: 'fill-blank',
        difficulty: 'intermediate',
        prompt: 'Completa con WHILE para dos acciones simultáneas: "While my brother was cooking, I _____ (clean) the living room."',
        hint: 'Usa was cleaning',
        correctAnswer: 'was cleaning',
        explanation: 'Dos acciones prolongadas paralelas en el pasado llevan Past Continuous (was cooking / was cleaning).'
      },
      {
        id: 'pcnt-ex9',
        type: 'sentence-order',
        difficulty: 'advanced',
        prompt: 'Ordena la pregunta sobre qué hacía alguien a una hora determinada en el pasado:',
        scrambledWords: ['What', 'were', 'you', 'doing', 'at', 'nine', 'o\'clock', 'yesterday', '?'],
        correctAnswer: ['What', 'were', 'you', 'doing', 'at', 'nine', 'o\'clock', 'yesterday', '?'],
        explanation: 'Pregunta en Past Continuous: Wh-word + were + sujeto + doing + hora exacta + ?'
      },
      {
        id: 'pcnt-ex10',
        type: 'fill-blank',
        difficulty: 'expert',
        prompt: 'Voz Pasiva en Past Continuous: "While the critical server databases _____ (migrate) to the new cloud cluster, user logins were temporarily disabled."',
        hint: 'Fórmula: were being + participio pasado',
        correctAnswer: 'were being migrated',
        explanation: 'La voz pasiva del Past Continuous se construye con [was/were being + participio pasado]. Al ser el sujeto plural ("databases"), se emplea "were being migrated".'
      },
      {
        id: 'pcnt-ex11',
        type: 'multiple-choice',
        difficulty: 'expert',
        prompt: 'Estructura Condicional con acción en progreso en el pasado: "If you _____ attention when the flight crew gave the emergency briefing, you would know where the life vest is."',
        options: ['were paying', 'paid', 'had been paid', 'are paying'],
        correctAnswer: 'were paying',
        explanation: 'En condicionales mixtos (condición en el pasado continuo con consecuencia en el presente), se usa Past Continuous en la cláusula con "if" ("were paying") para destacar la acción que estaba en desarrollo durante la explicación.'
      }
    ]
  },

  // 7. PAST PERFECT
  {
    id: 'past-perfect',
    name: 'Past Perfect',
    spanishName: 'Pasado Perfecto',
    group: 'past',
    aspect: 'perfect',
    cefrLevel: 'B1',
    isFreePreview: false,
    tagline: 'El pasado del pasado: una acción que ocurrió antes de otra acción pasada.',
    timelineGraphic: {
      start: 'Acción 1: Past Perfect (Ocurrió primero)',
      focus: 'Acción 2: Past Simple (Ocurrió después)',
      end: 'Presente'
    },
    formula: {
      affirmative: 'Sujeto + had + Verbo en Participio Pasado',
      negative: 'Sujeto + hadn\'t + Verbo en Participio Pasado',
      question: 'Had + Sujeto + Verbo en Participio Pasado + ?',
      auxiliary: 'Had (idéntico para todos los sujetos)',
      verbForm: 'Participio Pasado'
    },
    whenToUse: [
      {
        title: 'Establecer orden cronológico entre dos eventos pasados',
        description: 'La acción que sucedió ANTES de la otra siempre va en Past Perfect.',
        example: 'When we arrived at the cinema, the movie had already started.'
      }
    ],
    signalWords: ['already', 'before', 'after', 'by the time', 'never... before', 'until then'],
    commonMistakes: [
      {
        wrong: 'When the police arrived, the thief escaped.',
        correct: 'When the police arrived, the thief had escaped.',
        why: 'Si el ladrón escapó antes de que llegara la policía, debe ir en Past Perfect para que se entienda la cronología.'
      }
    ],
    examples: [
      {
        id: 'ppf-1',
        english: 'By the time I woke up, my parents had already left for work.',
        spanish: 'Para cuando me desperté, mis padres ya se habían ido al trabajo.',
        contextNote: 'Ellos se fueron primero (had left), luego yo desperté (woke up).',
        audioText: 'By the time I woke up, my parents had already left for work.'
      },
      {
        id: 'ppf-2',
        english: 'She had never flown in an airplane before that trip.',
        spanish: 'Ella nunca había volado en avión antes de ese viaje.',
        contextNote: 'Experiencia anterior a un momento pasado.',
        audioText: 'She had never flown in an airplane before that trip.'
      }
    ],
    videoLesson: {
      title: 'Past Perfect: El Pasado del Pasado sin Miedo',
      instructor: 'BBC Learning English',
      youtubeId: 'vyvGJrB7WNM',
      duration: '11 min',
      summary: 'Visualiza la línea de tiempo y olvídate de enredarte con dos eventos pasados.',
      keyTakeaways: [
        'HAD no cambia: se usa con I, you, he, she, it, we, they.',
        'La expresión "By the time..." es su mejor compañera.',
        'Si no hay dos momentos pasados comparados, probablemente solo necesites Past Simple.'
      ]
    },
    exercises: [
      {
        id: 'ppf-ex1',
        type: 'multiple-choice',
        difficulty: 'basic',
        prompt: 'Completa: "The train _____ when we reached the platform."',
        options: ['had already departed', 'has already departed', 'is departing', 'departs'],
        correctAnswer: 'had already departed',
        explanation: 'El tren partió antes de que llegáramos a la plataforma (acción previa).'
      },
      {
        id: 'ppf-ex2',
        type: 'fill-blank',
        difficulty: 'basic',
        prompt: 'Escribe el auxiliar para Past Perfect: "She _____ never eaten caviar before that dinner."',
        hint: 'Auxiliar invariable de pasado perfecto',
        correctAnswer: 'had',
        explanation: 'En Past Perfect el auxiliar es siempre "had" para todas las personas gramaticales.'
      },
      {
        id: 'ppf-ex3',
        type: 'sentence-order',
        difficulty: 'intermediate',
        prompt: 'Ordena la oración con la expresión temporal clave "By the time":',
        scrambledWords: ['By', 'the', 'time', 'arrived', 'we', 'the', 'had', 'movie', 'started'],
        correctAnswer: ['By', 'the', 'time', 'we', 'arrived', 'the', 'movie', 'had', 'started'],
        explanation: 'Estructura: By the time + Sujeto + Past Simple, Sujeto + had + Past Participle.'
      },
      {
        id: 'ppf-ex4',
        type: 'multiple-choice',
        difficulty: 'intermediate',
        prompt: 'Identifica la secuencia cronológica: "When he opened his wallet, he realized he had lost his credit card." ¿Qué ocurrió primero?',
        options: [
          'Perdió su tarjeta de crédito.',
          'Abrió su billetera.',
          'Se dio cuenta de la situación.',
          'Ambas cosas al mismo instante exacto.'
        ],
        correctAnswer: 'Perdió su tarjeta de crédito.',
        explanation: 'La acción en Past Perfect (had lost) siempre ocurrió ANTES que las acciones en Past Simple (opened, realized).'
      },
      {
        id: 'ppf-ex5',
        type: 'multiple-choice',
        difficulty: 'advanced',
        prompt: 'Uso en Tercer Condicional (hipótesis sobre el pasado irreal): ¿Cuál opción es correcta?',
        options: [
          'If I had studied more, I would have passed the exam.',
          'If I studied more, I would passed the exam.',
          'If I have studied more, I would have passed.',
          'If I had study more, I passed.'
        ],
        correctAnswer: 'If I had studied more, I would have passed the exam.',
        explanation: 'La condición irreal del pasado (Third Conditional) requiere "If" + Past Perfect (had studied).'
      },
      {
        id: 'ppf-ex6',
        type: 'fill-blank',
        difficulty: 'advanced',
        prompt: 'Completa con la forma negativa: "I couldn\'t enter the building because I _____ (not remember) the access code."',
        hint: 'Usa hadn\'t + remembered',
        correctAnswer: "hadn't remembered",
        explanation: 'Forma negativa en Past Perfect: hadn\'t + participio (remembered).'
      },
      {
        id: 'ppf-ex7',
        type: 'multiple-choice',
        difficulty: 'basic',
        prompt: 'Completa la frase afirmativa: "When the teacher asked, we _____ the exercise."',
        options: ['had already finished', 'have already finished', 'were finished', 'finish'],
        correctAnswer: 'had already finished',
        explanation: 'El ejercicio ya estaba listo antes de que el profesor preguntara (acción anterior al pasado).'
      },
      {
        id: 'ppf-ex8',
        type: 'fill-blank',
        difficulty: 'intermediate',
        prompt: 'Completa con el participio irregular: "She couldn\'t buy the ticket because she had _____ (lose) her credit card."',
        hint: 'Participio de lose',
        correctAnswer: 'lost',
        explanation: 'El participio de lose es lost (had lost).'
      },
      {
        id: 'ppf-ex9',
        type: 'sentence-order',
        difficulty: 'advanced',
        prompt: 'Ordena la cláusula con "until" en pasado perfecto:',
        scrambledWords: ['He', 'had', 'not', 'realized', 'the', 'truth', 'until', 'she', 'explained', 'it'],
        correctAnswer: ['He', 'had', 'not', 'realized', 'the', 'truth', 'until', 'she', 'explained', 'it'],
        explanation: 'Estructura: Sujeto + had not realized + complemento + until + cláusula en pasado.'
      },
      {
        id: 'ppf-ex10',
        type: 'fill-blank',
        difficulty: 'expert',
        prompt: 'Voz Pasiva en Past Perfect: "Before the external audit commenced, all electronic financial records _____ (transfer) to an off-site backup vault."',
        hint: 'Fórmula: had been + participio pasado',
        correctAnswer: 'had been transferred',
        explanation: 'La voz pasiva del Past Perfect sigue la estructura [had been + participio pasado] para indicar una acción paciente completada antes de otro momento en el pasado.'
      },
      {
        id: 'ppf-ex11',
        type: 'multiple-choice',
        difficulty: 'expert',
        prompt: 'Third Conditional (hipótesis contrafactual del pasado): "If the geological sensors _____ the subterranean tremor twelve hours earlier, the structural catastrophe would have been averted."',
        options: ['had identified', 'identified', 'would have identified', 'has identified'],
        correctAnswer: 'had identified',
        explanation: 'En el Third Conditional (situación irreal pasada con consecuencia irreal en el pasado), la cláusula subordinada introducida por "if" exige Past Perfect ("had identified").'
      }
    ]
  },

  // 8. PAST PERFECT CONTINUOUS
  {
    id: 'past-perfect-continuous',
    name: 'Past Perfect Continuous',
    spanishName: 'Pasado Perfecto Continuo',
    group: 'past',
    aspect: 'perfect-continuous',
    cefrLevel: 'B2',
    isFreePreview: false,
    tagline: 'Una acción prolongada en progreso en el pasado que culminó antes de otro evento pasado.',
    timelineGraphic: {
      start: 'Acción continua durante horas/días',
      focus: 'Causa o resultado evidente en el pasado',
      end: 'Finalizó en el pasado'
    },
    formula: {
      affirmative: 'Sujeto + had been + Verbo con -ing',
      negative: 'Sujeto + hadn\'t been + Verbo con -ing',
      question: 'Had + Sujeto + been + Verbo con -ing + ?',
      auxiliary: 'Had been',
      verbForm: 'Verbo con -ing'
    },
    whenToUse: [
      {
        title: 'Causa de un estado físico o emocional en el pasado',
        description: 'Explicar por qué alguien o algo estaba en cierta condición en el pasado.',
        example: 'He was exhausted because he had been driving all night.'
      }
    ],
    signalWords: ['for hours before', 'since morning until', 'all day before'],
    commonMistakes: [
      {
        wrong: 'He had been living there for 10 years before he has moved.',
        correct: 'He had been living there for 10 years before he moved.',
        why: 'La segunda acción debe estar en Past Simple (moved), no en Present Perfect.'
      }
    ],
    examples: [
      {
        id: 'ppfc-1',
        english: 'The ground was wet because it had been raining for three hours.',
        spanish: 'El suelo estaba mojado porque había estado lloviendo durante tres horas.',
        contextNote: 'Causa y duración explicada.',
        audioText: 'The ground was wet because it had been raining for three hours.'
      }
    ],
    videoLesson: {
      title: 'Past Perfect Continuous en Acción Real',
      instructor: 'BBC Learning English',
      youtubeId: 'YXXtNR7JCzY',
      duration: '7 min',
      summary: 'Entiende cómo este tiempo conecta duración pasada y resultado pasado.',
      keyTakeaways: [
        'Estructura: HAD + BEEN + VERBO-ING para todos los sujetos.',
        'Ideal para justificar estados de cansancio, retrasos o condiciones del clima.'
      ]
    },
    exercises: [
      {
        id: 'ppfc-ex1',
        type: 'multiple-choice',
        difficulty: 'basic',
        prompt: 'Completa: "Her eyes were red because she _____ for hours."',
        options: ['had been crying', 'has been crying', 'is crying', 'cried'],
        correctAnswer: 'had been crying',
        explanation: 'Acción continua previa en el pasado que causó la condición física observada.'
      },
      {
        id: 'ppfc-ex2',
        type: 'fill-blank',
        difficulty: 'basic',
        prompt: 'Completa con la fórmula de Past Perfect Continuous: "The pilots were fatigued because they had _____ (be) flying across continents."',
        hint: 'Escribe been',
        correctAnswer: 'been',
        explanation: 'La fórmula requiere had + been + verbo con -ing.'
      },
      {
        id: 'ppfc-ex3',
        type: 'sentence-order',
        difficulty: 'intermediate',
        prompt: 'Ordena la oración para explicar la duración antes de un suceso:',
        scrambledWords: ['They', 'had', 'been', 'waiting', 'two', 'hours', 'for', 'before', 'help', 'arrived'],
        correctAnswer: ['They', 'had', 'been', 'waiting', 'for', 'two', 'hours', 'before', 'help', 'arrived'],
        explanation: 'Estructura: Sujeto + had been + verbo-ing + for [duración] + before + Past Simple.'
      },
      {
        id: 'ppfc-ex4',
        type: 'multiple-choice',
        difficulty: 'intermediate',
        prompt: '¿Por qué la carretera estaba resbaladiza? Elige la explicación gramatical correcta:',
        options: [
          'The roads were dangerous because it had been snowing all morning.',
          'The roads were dangerous because it has been snow all morning.',
          'The roads were dangerous because it is snowing.',
          'The roads were dangerous because it will snow.'
        ],
        correctAnswer: 'The roads were dangerous because it had been snowing all morning.',
        explanation: 'El estado en el pasado (were dangerous) fue provocado por el proceso continuo previo (had been snowing).'
      },
      {
        id: 'ppfc-ex5',
        type: 'multiple-choice',
        difficulty: 'advanced',
        prompt: 'Past Perfect Simple vs Continuous: ¿Qué opción destaca la DURACIÓN continua antes de mudarse?',
        options: [
          'We had been living in Madrid for ten years before we moved to Barcelona.',
          'We had lived in Madrid once.',
          'We have lived in Madrid.',
          'We were living in Madrid yesterday.'
        ],
        correctAnswer: 'We had been living in Madrid for ten years before we moved to Barcelona.',
        explanation: '"Had been living" destaca la trayectoria prolongada acumulada de 10 años previa a la mudanza.'
      },
      {
        id: 'ppfc-ex6',
        type: 'fill-blank',
        difficulty: 'advanced',
        prompt: 'Completa con la forma negativa: "He _____ (not have / work) there very long when the company closed."',
        hint: 'Usa hadn\'t been working',
        correctAnswer: "hadn't been working",
        explanation: 'Negativo en Past Perfect Continuous: hadn\'t been + working.'
      },
      {
        id: 'ppfc-ex7',
        type: 'multiple-choice',
        difficulty: 'basic',
        prompt: 'Completa: "The musician was tired because he _____ the piano for five straight hours."',
        options: ['had been practicing', 'has been practicing', 'was practice', 'had practice'],
        correctAnswer: 'had been practicing',
        explanation: 'Mide la actividad continua que precedió al cansancio en el pasado (had been practicing).'
      },
      {
        id: 'ppfc-ex8',
        type: 'fill-blank',
        difficulty: 'intermediate',
        prompt: 'Escribe el auxiliar negativo: "They _____ (not / be) waiting long when the bus finally arrived."',
        hint: 'Usa hadn\'t been',
        correctAnswer: "hadn't been",
        explanation: 'Forma negativa en Past Perfect Continuous: hadn\'t been + waiting.'
      },
      {
        id: 'ppfc-ex9',
        type: 'sentence-order',
        difficulty: 'advanced',
        prompt: 'Ordena la oración para expresar duración antes del cambio de carrera:',
        scrambledWords: ['She', 'had', 'been', 'studying', 'law', 'for', 'three', 'years', 'before', 'switching', 'careers'],
        correctAnswer: ['She', 'had', 'been', 'studying', 'law', 'for', 'three', 'years', 'before', 'switching', 'careers'],
        explanation: 'Estructura: Sujeto + had been + verbo-ing + for [tiempo] + before + evento posterior.'
      },
      {
        id: 'ppfc-ex10',
        type: 'fill-blank',
        difficulty: 'expert',
        prompt: 'Third Conditional con duración continua ininterrumpida previa al fallo: "If the cooling turbine _____ (vibrate) abnormally for hours before the shutdown, the automated alarms would have alerted the engineering crew."',
        hint: 'Fórmula: had been + verbo en -ing',
        correctAnswer: 'had been vibrating',
        explanation: 'En el Third Conditional con énfasis en la duración continua e ininterrumpida de una acción previa al evento, se emplea Past Perfect Continuous ("had been vibrating").'
      },
      {
        id: 'ppfc-ex11',
        type: 'multiple-choice',
        difficulty: 'expert',
        prompt: 'Contraste de Voz Pasiva y Past Perfect Continuous: "¿Cuál oración combina con precisión una acción pasiva culminada con una acción activa continua prolongada previa?"',
        options: [
          'The facility was shut down after dangerous fumes had been leaking for days.',
          'The facility was shut down after dangerous fumes were leaked for days.',
          'The facility shut down after dangerous fumes had been being leaked for days.',
          'The facility had shut down after dangerous fumes leak for days.'
        ],
        correctAnswer: 'The facility was shut down after dangerous fumes had been leaking for days.',
        explanation: 'Combina la voz pasiva en pasado simple para el hecho puntual ("was shut down") con el Past Perfect Continuous ("had been leaking") para el proceso continuo prolongado que originó la clausura.'
      }
    ]
  },

  // 9. FUTURE SIMPLE
  {
    id: 'future-simple',
    name: 'Future Simple',
    spanishName: 'Futuro Simple',
    group: 'future',
    aspect: 'simple',
    cefrLevel: 'A1',
    isFreePreview: false,
    tagline: 'Decisiones espontáneas, promesas, predicciones y planes estructurados.',
    timelineGraphic: {
      start: 'Presente (Decisión)',
      focus: 'Ocurrirá en un punto del futuro',
      end: 'Futuro'
    },
    formula: {
      affirmative: 'Sujeto + will + Verbo base // Sujeto + am/is/are going to + Verbo base',
      negative: 'Sujeto + won\'t + Verbo base // Sujeto + not going to + Verbo base',
      question: 'Will + Sujeto + Verbo base + ? // Am/Is/Are + Sujeto + going to + Verbo base + ?',
      auxiliary: 'Will / Won\'t o Verbo To Be (para going to)',
      verbForm: 'Verbo en su forma base'
    },
    whenToUse: [
      {
        title: 'Will: Decisiones tomadas en el momento',
        description: 'Cuando decides hacer algo justo en el instante en que hablas.',
        example: 'The phone is ringing. I will answer it!'
      },
      {
        title: 'Be Going To: Planes previos e intenciones',
        description: 'Algo que ya habías planeado hacer antes de este momento.',
        example: 'I am going to study medicine next year.'
      },
      {
        title: 'Predicciones basadas en evidencia visual',
        description: 'Ves algo claro que va a suceder.',
        example: 'Look at those dark clouds! It is going to rain.'
      }
    ],
    signalWords: ['tomorrow', 'next week', 'soon', 'in the future', 'probably', 'I think', 'I promise'],
    commonMistakes: [
      {
        wrong: 'I will going to call you.',
        correct: 'I will call you / I am going to call you.',
        why: '¡No mezcles ambos! O usas "will" o usas "be going to".'
      },
      {
        wrong: 'She wills be happy.',
        correct: 'She will be happy.',
        why: '"Will" es un modal: nunca cambia ni lleva "s" con he/she/it.'
      }
    ],
    examples: [
      {
        id: 'fs-1',
        english: 'Don\'t worry, I will help you with your luggage.',
        spanish: 'No te preocupes, yo te ayudaré con tu equipaje.',
        contextNote: 'Ofrecimiento espontáneo con "will".',
        audioText: 'Don\'t worry, I will help you with your luggage.'
      },
      {
        id: 'fs-2',
        english: 'We are going to buy a new house this summer.',
        spanish: 'Vamos a comprar una nueva casa este verano.',
        contextNote: 'Plan e intención meditada con "going to".',
        audioText: 'We are going to buy a new house this summer.'
      }
    ],
    videoLesson: {
      title: 'Will vs Going To: La Diferencia Explicada Para Siempre',
      instructor: 'BBC Learning English',
      youtubeId: 'axw6D-TWMiQ',
      duration: '9 min',
      summary: 'Aprende cuándo usar will para decisiones espontáneas y going to para planes y evidencias.',
      keyTakeaways: [
        'Will = espontáneo, promesas, ofertas ("I\'ll have a soda").',
        'Going to = planes calculados y evidencias inmediatas ("Watch out! You\'re going to fall").',
        'Contracción común hablada: "gonna" (informal).'
      ]
    },
    exercises: [
      {
        id: 'fs-ex1',
        type: 'multiple-choice',
        difficulty: 'basic',
        prompt: 'El camarero te pregunta qué quieres beber. ¿Qué respondes de forma natural?:',
        options: ['I will have an orange juice, please.', 'I am going to having an orange juice.', 'I have an orange juice.', 'I did have an orange juice.'],
        correctAnswer: 'I will have an orange juice, please.',
        explanation: 'Para decisiones tomadas al instante en un restaurante, siempre se usa "will" (I\'ll have...).'
      },
      {
        id: 'fs-ex2',
        type: 'fill-blank',
        difficulty: 'basic',
        prompt: 'Completa con la forma negativa de will: "Don\'t worry, I _____ (not forget) our meeting tomorrow."',
        hint: 'Usa won\'t',
        correctAnswer: "won't forget",
        explanation: 'La contracción de "will not" es "won\'t" + verbo en forma base.'
      },
      {
        id: 'fs-ex3',
        type: 'sentence-order',
        difficulty: 'intermediate',
        prompt: 'Ordena la pregunta para ofrecer ayuda espontánea:',
        scrambledWords: ['Will', 'you', 'help', 'me', 'with', 'these', 'bags', '?'],
        correctAnswer: ['Will', 'you', 'help', 'me', 'with', 'these', 'bags', '?'],
        explanation: 'Estructura interrogativa: Will + Sujeto (you) + Verbo base (help) + Complemento + ?'
      },
      {
        id: 'fs-ex4',
        type: 'multiple-choice',
        difficulty: 'intermediate',
        prompt: 'WILL vs GOING TO: Ves nubes completamente oscuras y truenos. ¿Cuál es la forma correcta?',
        options: [
          'Look at those dark clouds! It is going to rain.',
          'Look at those dark clouds! It will rain.',
          'Look at those dark clouds! It rains.',
          'Look at those dark clouds! It has rained.'
        ],
        correctAnswer: 'Look at those dark clouds! It is going to rain.',
        explanation: 'Para predicciones basadas en evidencia visual inmediata presente, se utiliza "be going to".'
      },
      {
        id: 'fs-ex5',
        type: 'multiple-choice',
        difficulty: 'advanced',
        prompt: 'Primer Condicional (First Conditional): ¿Cuál opción completa la frase correctamente? "If it rains tomorrow, we _____ at home."',
        options: [
          'will stay',
          'stay',
          'would stay',
          'stayed'
        ],
        correctAnswer: 'will stay',
        explanation: 'En el First Conditional la cláusula con "If" va en presente, y la consecuencia futura va con "will" + verbo base.'
      },
      {
        id: 'fs-ex6',
        type: 'fill-blank',
        difficulty: 'advanced',
        prompt: 'Completa el plan premeditado con "be going to": "She _____ (go / buy) a new car next month."',
        hint: 'Usa is going to buy',
        correctAnswer: 'is going to buy',
        explanation: 'Para intenciones y planes acordados con anticipación se usa "is going to" + verbo base.'
      },
      {
        id: 'fs-ex7',
        type: 'multiple-choice',
        difficulty: 'basic',
        prompt: 'Decisión espontánea: "Someone is knocking at the front door." ¿Qué respondes?:',
        options: ['I will check who it is.', 'I am checking who it was.', 'I checked yesterday.', 'I am going check.'],
        correctAnswer: 'I will check who it is.',
        explanation: 'Para reaccionar en el instante se usa "will" (I\'ll check).'
      },
      {
        id: 'fs-ex8',
        type: 'fill-blank',
        difficulty: 'intermediate',
        prompt: 'Completa con la forma negativa de going to: "They _____ (not / go / sell) their company."',
        hint: 'Usa are not going to sell o aren\'t going to sell',
        correctAnswer: "aren't going to sell",
        explanation: 'Negación de planes con going to: aren\'t going to + verbo base.'
      },
      {
        id: 'fs-ex9',
        type: 'sentence-order',
        difficulty: 'advanced',
        prompt: 'Ordena la predicción con adverbio modal:',
        scrambledWords: ['Technology', 'will', 'definitely', 'transform', 'education', 'in', 'the', 'next', 'decade'],
        correctAnswer: ['Technology', 'will', 'definitely', 'transform', 'education', 'in', 'the', 'next', 'decade'],
        explanation: 'Adverbios como "definitely" o "probably" se colocan entre "will" y el verbo base.'
      },
      {
        id: 'fs-ex10',
        type: 'fill-blank',
        difficulty: 'expert',
        prompt: 'Voz Pasiva en Future Simple: "The next-generation space observatory _____ (launch) by the aerospace consortium in late 2028."',
        hint: 'Fórmula pasiva: will be + participio pasado',
        correctAnswer: 'will be launched',
        explanation: 'La voz pasiva del Future Simple se forma con [will be + participio pasado].'
      },
      {
        id: 'fs-ex11',
        type: 'multiple-choice',
        difficulty: 'expert',
        prompt: 'First Conditional formal con Voz Pasiva en la consecuencia: "If the climate treaty is ratified by the general assembly, mandatory emissions caps _____ upon all maritime fleets."',
        options: ['will be imposed', 'will impose', 'is imposed', 'would be imposed'],
        correctAnswer: 'will be imposed',
        explanation: 'En el First Conditional de registro formal, la condición con "if" lleva presente pasivo ("is ratified") y la cláusula principal de resultado lleva futuro simple pasivo ("will be imposed").'
      }
    ]
  },

  // 10. FUTURE CONTINUOUS
  {
    id: 'future-continuous',
    name: 'Future Continuous',
    spanishName: 'Futuro Continuo',
    group: 'future',
    aspect: 'continuous',
    cefrLevel: 'B1',
    isFreePreview: false,
    tagline: 'Acciones que estarán en pleno desarrollo en un momento exacto del futuro.',
    timelineGraphic: {
      start: 'Comenzará antes',
      focus: 'En curso en ese momento futuro',
      end: 'Terminará después'
    },
    formula: {
      affirmative: 'Sujeto + will be + Verbo con -ing',
      negative: 'Sujeto + won\'t be + Verbo con -ing',
      question: 'Will + Sujeto + be + Verbo con -ing + ?',
      auxiliary: 'Will be',
      verbForm: 'Verbo con -ing'
    },
    whenToUse: [
      {
        title: 'Acción en progreso en un momento futuro definido',
        description: 'Imagina una foto mental de lo que estarás haciendo a esa hora.',
        example: 'This time tomorrow, I will be flying over the Atlantic.'
      }
    ],
    signalWords: ['at 10 AM tomorrow', 'this time next year', 'in five years\' time'],
    commonMistakes: [
      {
        wrong: 'I will being sleeping.',
        correct: 'I will be sleeping.',
        why: 'Tras "will" siempre va el infinitivo base "be", no "being".'
      }
    ],
    examples: [
      {
        id: 'fc-1',
        english: 'Don\'t call me at 8:00 PM; I will be having dinner with my family.',
        spanish: 'No me llames a las 8:00 PM; estaré cenando con mi familia.',
        contextNote: 'Acción en progreso a una hora futura.',
        audioText: 'Don\'t call me at eight PM; I will be having dinner with my family.'
      }
    ],
    videoLesson: {
      title: 'Future Continuous: Proyecta Tu Futuro en Movimiento',
      instructor: 'BBC Learning English',
      youtubeId: '2bFhZXEOiVk',
      duration: '8 min',
      summary: 'Cómo usar will be + -ing para sonar educado y describir actividades futuras proyectadas.',
      keyTakeaways: [
        'Estructura: WILL BE + VERBO-ING.',
        'Se usa para no molestar a alguien ("Will you be using the car tonight?").'
      ]
    },
    exercises: [
      {
        id: 'fc-ex1',
        type: 'multiple-choice',
        difficulty: 'basic',
        prompt: 'Completa: "At midnight on New Year\'s Eve, people _____ everywhere."',
        options: ['will be celebrating', 'will celebrate', 'are celebrating', 'were celebrating'],
        correctAnswer: 'will be celebrating',
        explanation: 'A esa hora exacta la acción estará en curso.'
      },
      {
        id: 'fc-ex2',
        type: 'fill-blank',
        difficulty: 'basic',
        prompt: 'Escribe la estructura base de Future Continuous: "This time tomorrow, I will _____ (be) flying to London."',
        hint: 'Escribe be',
        correctAnswer: 'be',
        explanation: 'La fórmula requiere will + be + verbo con -ing.'
      },
      {
        id: 'fc-ex3',
        type: 'sentence-order',
        difficulty: 'intermediate',
        prompt: 'Ordena la oración para pedir que no llamen a cierta hora:',
        scrambledWords: ['I', 'will', 'be', 'sleeping', 'at', '7', 'AM', 'tomorrow'],
        correctAnswer: ['I', 'will', 'be', 'sleeping', 'at', '7', 'AM', 'tomorrow'],
        explanation: 'Estructura: Sujeto + will be + sleeping + at [hora] + referencia temporal.'
      },
      {
        id: 'fc-ex4',
        type: 'multiple-choice',
        difficulty: 'intermediate',
        prompt: 'Pregunta de cortesía: ¿Cuál es la forma más cortés para preguntar si alguien usará el auto?',
        options: [
          'Will you be using the car tonight?',
          'Will you use the car tonight?',
          'Do you use the car tonight?',
          'Are you use the car?'
        ],
        correctAnswer: 'Will you be using the car tonight?',
        explanation: 'En inglés formal, el Future Continuous se emplea para preguntar por planes ajenos sin presionar ni sonar intrusivo.'
      },
      {
        id: 'fc-ex5',
        type: 'multiple-choice',
        difficulty: 'advanced',
        prompt: 'Acciones como parte de una rutina proyectada: ¿Cuál oración es correcta?',
        options: [
          'I will be seeing the manager tomorrow as usual.',
          'I will being see the manager.',
          'I am will seeing the manager.',
          'I will see be the manager.'
        ],
        correctAnswer: 'I will be seeing the manager tomorrow as usual.',
        explanation: 'El Future Continuous describe eventos que sucederán en el curso natural de las cosas.'
      },
      {
        id: 'fc-ex6',
        type: 'fill-blank',
        difficulty: 'advanced',
        prompt: 'Completa la negación: "Don\'t worry, we _____ (not / stay) at their house for long."',
        hint: 'Usa won\'t be staying',
        correctAnswer: "won't be staying",
        explanation: 'Negación en Future Continuous: won\'t be + staying.'
      },
      {
        id: 'fc-ex7',
        type: 'multiple-choice',
        difficulty: 'basic',
        prompt: 'Completa: "Tomorrow at 3:00 PM, we _____ in the conference hall."',
        options: ['will be presenting', 'will present', 'present', 'are present'],
        correctAnswer: 'will be presenting',
        explanation: 'A esa hora exacta estaremos en pleno desarrollo de la presentación.'
      },
      {
        id: 'fc-ex8',
        type: 'fill-blank',
        difficulty: 'intermediate',
        prompt: 'Pregunta educada sobre planes: "Will you _____ (be) taking the highway tomorrow morning?"',
        hint: 'Escribe be',
        correctAnswer: 'be',
        explanation: 'La estructura de Future Continuous requiere "be" tras el sujeto en preguntas.'
      },
      {
        id: 'fc-ex9',
        type: 'sentence-order',
        difficulty: 'advanced',
        prompt: 'Ordena la oración para anticipar una actividad en curso el fin de semana:',
        scrambledWords: ['This', 'weekend', 'I', 'will', 'be', 'relaxing', 'on', 'the', 'beach'],
        correctAnswer: ['This', 'weekend', 'I', 'will', 'be', 'relaxing', 'on', 'the', 'beach'],
        explanation: 'Estructura temporal inicial: This weekend + Sujeto + will be + relaxing + lugar.'
      },
      {
        id: 'fc-ex10',
        type: 'fill-blank',
        difficulty: 'expert',
        prompt: 'First Conditional con acción en pleno desarrollo en hora fijada: "If you call her office at three o\'clock tomorrow, she _____ (lead) the international executive briefing."',
        hint: 'Fórmula: will be + verbo en -ing',
        correctAnswer: 'will be leading',
        explanation: 'En una estructura condicional de primer grado con referencia a una hora específica futura ("at three o\'clock"), se utiliza el Future Continuous ("will be leading") para indicar que la acción estará en pleno progreso en ese momento.'
      },
      {
        id: 'fc-ex11',
        type: 'multiple-choice',
        difficulty: 'expert',
        prompt: 'Condicional formal con Future Continuous y condición pasiva: "Provided that official flight clearances are approved, our surveillance drone _____ over the nature reserve throughout the night."',
        options: ['will be patrolling', 'will patrol', 'is patrolling', 'would patrol'],
        correctAnswer: 'will be patrolling',
        explanation: '"Provided that" introduce una condición formal ("are approved"); la consecuencia prolongada ininterrumpida a lo largo de un periodo futuro ("throughout the night") se formula con Future Continuous ("will be patrolling").'
      }
    ]
  },

  // 11. FUTURE PERFECT
  {
    id: 'future-perfect',
    name: 'Future Perfect',
    spanishName: 'Futuro Perfecto',
    group: 'future',
    aspect: 'perfect',
    cefrLevel: 'B2',
    isFreePreview: false,
    tagline: 'Acciones que ya habrán concluido antes de una fecha límite en el futuro.',
    timelineGraphic: {
      start: 'Empieza antes',
      focus: 'Habrá terminado con éxito',
      end: 'Punto límite en el futuro (BY...)'
    },
    formula: {
      affirmative: 'Sujeto + will have + Verbo en Participio Pasado',
      negative: 'Sujeto + won\'t have + Verbo en Participio Pasado',
      question: 'Will + Sujeto + have + Verbo en Participio Pasado + ?',
      auxiliary: 'Will have',
      verbForm: 'Participio Pasado (3ra columna)'
    },
    whenToUse: [
      {
        title: 'Metas completadas antes de un plazo',
        description: 'Mirar desde el futuro hacia atrás para ver qué ya estará listo.',
        example: 'By December, I will have finished my master\'s degree.'
      }
    ],
    signalWords: ['by then', 'by next month', 'by the year 2030', 'in two years'],
    commonMistakes: [
      {
        wrong: 'She will has finished.',
        correct: 'She will have finished.',
        why: 'Tras el modal "will" siempre va "have", jamás "has", incluso con he/she/it.'
      }
    ],
    examples: [
      {
        id: 'fp-1',
        english: 'By next Friday, our team will have launched the new website.',
        spanish: 'Para el próximo viernes, nuestro equipo ya habrá lanzado el nuevo sitio web.',
        contextNote: 'Meta con fecha límite cumplida.',
        audioText: 'By next Friday, our team will have launched the new website.'
      }
    ],
    videoLesson: {
      title: 'Future Perfect: El Secreto de las Metas y Fechas Límite',
      instructor: 'BBC Learning English',
      youtubeId: 'aYbPdiIlBi8',
      duration: '10 min',
      summary: 'El significado de "BY" y cómo estructurar proyectos profesionales con Future Perfect.',
      keyTakeaways: [
        'Siempre se usa WILL HAVE (nunca will has).',
        'Es el tiempo verbal favorito en negocios para compromisos de entrega.'
      ]
    },
    exercises: [
      {
        id: 'fp-ex1',
        type: 'multiple-choice',
        difficulty: 'basic',
        prompt: 'Completa: "By the end of this month, she _____ here for five years."',
        options: ['will have worked', 'will has worked', 'is working', 'will work'],
        correctAnswer: 'will have worked',
        explanation: 'Límite de tiempo ("By the end...") exige "will have" + participio "worked".'
      },
      {
        id: 'fp-ex2',
        type: 'fill-blank',
        difficulty: 'basic',
        prompt: 'Completa el auxiliar: "By 2030, scientists will _____ (have) developed new clean energy solutions."',
        hint: 'Escribe have',
        correctAnswer: 'have',
        explanation: 'La fórmula es will have + participio pasado.'
      },
      {
        id: 'fp-ex3',
        type: 'sentence-order',
        difficulty: 'intermediate',
        prompt: 'Ordena la oración para comprometer una entrega profesional:',
        scrambledWords: ['By', 'Friday', 'we', 'will', 'have', 'completed', 'the', 'report'],
        correctAnswer: ['By', 'Friday', 'we', 'will', 'have', 'completed', 'the', 'report'],
        explanation: 'Estructura: By [fecha límite], Sujeto + will have + participio + complemento.'
      },
      {
        id: 'fp-ex4',
        type: 'multiple-choice',
        difficulty: 'intermediate',
        prompt: 'Regla modal con 3ra persona: ¿Cuál opción es gramaticalmente correcta?',
        options: [
          'By next year, Carlos will have graduated from university.',
          'By next year, Carlos will has graduated from university.',
          'By next year, Carlos will have graduate.',
          'By next year, Carlos will is graduating.'
        ],
        correctAnswer: 'By next year, Carlos will have graduated from university.',
        explanation: 'Incluso con Carlos (he), tras "will" se usa "have", nunca "has".'
      },
      {
        id: 'fp-ex5',
        type: 'multiple-choice',
        difficulty: 'advanced',
        prompt: 'Cláusula temporal subordinada: ¿Cómo se conjuga el verbo tras "by the time"? "By the time you arrive, we _____ dinner."',
        options: [
          'will have prepared',
          'will prepare',
          'had prepared',
          'have prepared'
        ],
        correctAnswer: 'will have prepared',
        explanation: 'La acción principal futura culminada lleva Future Perfect (will have prepared).'
      },
      {
        id: 'fp-ex6',
        type: 'fill-blank',
        difficulty: 'advanced',
        prompt: 'Forma negativa: "They _____ (not / finish) the construction before the winter begins."',
        hint: 'Usa won\'t have finished',
        correctAnswer: "won't have finished",
        explanation: 'Negación en Future Perfect: won\'t have + finished.'
      },
      {
        id: 'fp-ex7',
        type: 'multiple-choice',
        difficulty: 'basic',
        prompt: 'Completa con la fecha límite: "By 6:00 PM today, the mechanics _____ the car."',
        options: ['will have repaired', 'will repair', 'have repaired', 'will be repair'],
        correctAnswer: 'will have repaired',
        explanation: 'El límite temporal "By 6:00 PM" exige Future Perfect ("will have repaired").'
      },
      {
        id: 'fp-ex8',
        type: 'fill-blank',
        difficulty: 'intermediate',
        prompt: 'Completa el participio regular: "By tomorrow morning, we will have _____ (finish) all the modules."',
        hint: 'Participio de finish',
        correctAnswer: 'finished',
        explanation: 'La fórmula es will have + participio pasado (finished).'
      },
      {
        id: 'fp-ex9',
        type: 'sentence-order',
        difficulty: 'advanced',
        prompt: 'Ordena la oración que proyecta una meta profesional completada:',
        scrambledWords: ['By', 'next', 'year', 'she', 'will', 'have', 'saved', 'enough', 'money', 'to', 'travel'],
        correctAnswer: ['By', 'next', 'year', 'she', 'will', 'have', 'saved', 'enough', 'money', 'to', 'travel'],
        explanation: 'Estructura: By next year + Sujeto + will have + saved + complemento de objetivo.'
      },
      {
        id: 'fp-ex10',
        type: 'fill-blank',
        difficulty: 'expert',
        prompt: 'Voz Pasiva en Future Perfect con fecha límite: "By the end of this decade, all legacy fossil plants _____ (decommission) by the national energy grid."',
        hint: 'Fórmula: will have been + participio pasado',
        correctAnswer: 'will have been decommissioned',
        explanation: 'La voz pasiva del Future Perfect se forma con [will have been + participio pasado] para expresar que la acción sobre el sujeto habrá sido consumada antes de una fecha futura determinada.'
      },
      {
        id: 'fp-ex11',
        type: 'multiple-choice',
        difficulty: 'expert',
        prompt: 'Estructura Condicional con Future Perfect en el resultado: "If the antitrust regulators do not intervene by next quarter, the conglomerate _____ all independent distributors in the region."',
        options: ['will have absorbed', 'will absorb', 'has absorbed', 'would absorb'],
        correctAnswer: 'will have absorbed',
        explanation: 'Se utiliza el Future Perfect ("will have absorbed") para indicar que, si no se cumple la condición antes del plazo ("by next quarter"), el monopolio ya se habrá consumado por completo en ese punto futuro.'
      }
    ]
  },

  // 12. FUTURE PERFECT CONTINUOUS
  {
    id: 'future-perfect-continuous',
    name: 'Future Perfect Continuous',
    spanishName: 'Futuro Perfecto Continuo',
    group: 'future',
    aspect: 'perfect-continuous',
    cefrLevel: 'C1',
    isFreePreview: false,
    tagline: 'Mide la duración acumulada de una acción continua hasta un punto en el futuro.',
    timelineGraphic: {
      start: 'Comienza en el pasado o presente',
      focus: 'Duración ininterrumpida acumulada',
      end: 'Hito temporal en el futuro'
    },
    formula: {
      affirmative: 'Sujeto + will have been + Verbo con -ing',
      negative: 'Sujeto + won\'t have been + Verbo con -ing',
      question: 'Will + Sujeto + have been + Verbo con -ing + ?',
      auxiliary: 'Will have been',
      verbForm: 'Verbo con -ing'
    },
    whenToUse: [
      {
        title: 'Celebrar aniversarios y calcular tiempo acumulado',
        description: 'Indicar cuánto tiempo llevarás realizando una actividad cuando llegue cierta fecha.',
        example: 'In 2028, I will have been living in Spain for a decade.'
      }
    ],
    signalWords: ['by next year for...', 'for ten years by...', 'by the time...'],
    commonMistakes: [
      {
        wrong: 'I will have been live.',
        correct: 'I will have been living.',
        why: 'Siempre requiere la terminación "-ing" en el verbo de acción.'
      }
    ],
    examples: [
      {
        id: 'fpc-1',
        english: 'Next month, they will have been working together for twenty years.',
        spanish: 'El próximo mes, ellos habrán estado trabajando juntos durante veinte años.',
        contextNote: 'Cálculo de duración continua acumulada.',
        audioText: 'Next month, they will have been working together for twenty years.'
      }
    ],
    videoLesson: {
      title: 'Future Perfect Continuous: Nivel Avanzado C1 Explicado Simple',
      instructor: 'engVid Rebecca',
      youtubeId: 'mScixcyubUY',
      duration: '7 min',
      summary: 'El tiempo verbal más avanzado del inglés simplificado paso a paso.',
      keyTakeaways: [
        'Estructura: WILL HAVE BEEN + VERBO-ING.',
        'Combina futuro, perfección (hasta un punto) y continuidad (duración).'
      ]
    },
    exercises: [
      {
        id: 'fpc-ex1',
        type: 'multiple-choice',
        difficulty: 'basic',
        prompt: 'Completa: "By 10:00 PM, I _____ for 12 hours straight."',
        options: ['will have been studying', 'will be study', 'have been studying', 'will studied'],
        correctAnswer: 'will have been studying',
        explanation: 'Mide la duración continua que se alcanzará a las 10:00 PM.'
      },
      {
        id: 'fpc-ex2',
        type: 'fill-blank',
        difficulty: 'basic',
        prompt: 'Escribe la palabra faltante en la estructura C1: "Next year, she will have _____ (be) teaching here for two decades."',
        hint: 'Escribe been',
        correctAnswer: 'been',
        explanation: 'La fórmula requiere will have + been + verbo con -ing.'
      },
      {
        id: 'fpc-ex3',
        type: 'sentence-order',
        difficulty: 'intermediate',
        prompt: 'Ordena la oración para celebrar un aniversario laboral:',
        scrambledWords: ['Next', 'month', 'I', 'will', 'have', 'been', 'working', 'here', 'five', 'years', 'for'],
        correctAnswer: ['Next', 'month', 'I', 'will', 'have', 'been', 'working', 'here', 'for', 'five', 'years'],
        explanation: 'Estructura: Next month + Sujeto + will have been + working + here + for [duración].'
      },
      {
        id: 'fpc-ex4',
        type: 'multiple-choice',
        difficulty: 'intermediate',
        prompt: '¿Cuál opción calcula correctamente la duración ininterrumpida?',
        options: [
          'In November, we will have been living in this house for ten years.',
          'In November, we will be lived in this house for ten years.',
          'In November, we will have lived been in this house.',
          'In November, we will living for ten years.'
        ],
        correctAnswer: 'In November, we will have been living in this house for ten years.',
        explanation: '"Will have been living" cuantifica la duración acumulada que se cumplirá en noviembre.'
      },
      {
        id: 'fpc-ex5',
        type: 'multiple-choice',
        difficulty: 'advanced',
        prompt: 'Future Perfect Simple vs Continuous: ¿Qué oración destaca el PROCESO DE ENTRENAMIENTO prolongado más que el simple hecho?',
        options: [
          'By the marathon date, she will have been training for six grueling months.',
          'By the marathon date, she will have trained once.',
          'By the marathon date, she trains.',
          'By the marathon date, she will train.'
        ],
        correctAnswer: 'By the marathon date, she will have been training for six grueling months.',
        explanation: 'El Future Perfect Continuous enfatiza el esfuerzo y la continuidad ininterrumpida de los seis meses de entrenamiento.'
      },
      {
        id: 'fpc-ex6',
        type: 'fill-blank',
        difficulty: 'advanced',
        prompt: 'Completa con la forma negativa: "By noon, we _____ (not / drive) for very long."',
        hint: 'Usa won\'t have been driving',
        correctAnswer: "won't have been driving",
        explanation: 'Negación en Future Perfect Continuous: won\'t have been + driving.'
      },
      {
        id: 'fpc-ex7',
        type: 'multiple-choice',
        difficulty: 'basic',
        prompt: 'Completa: "By October, she _____ at the university for a full decade."',
        options: ['will have been teaching', 'will teach', 'is teaching', 'will have taught been'],
        correctAnswer: 'will have been teaching',
        explanation: 'Expresa la acumulación ininterrumpida de 10 años de docencia alcanzada en octubre.'
      },
      {
        id: 'fpc-ex8',
        type: 'fill-blank',
        difficulty: 'intermediate',
        prompt: 'Escribe la forma continua faltante: "By midnight, the band will have been _____ (play) for five hours."',
        hint: 'Verbo con -ing',
        correctAnswer: 'playing',
        explanation: 'La fórmula de Future Perfect Continuous termina con el gerundio -ing (playing).'
      },
      {
        id: 'fpc-ex9',
        type: 'sentence-order',
        difficulty: 'advanced',
        prompt: 'Ordena la oración de cálculo de trayectoria ininterrumpida:',
        scrambledWords: ['By', '2030', 'we', 'will', 'have', 'been', 'running', 'this', 'business', 'twenty', 'years', 'for'],
        correctAnswer: ['By', '2030', 'we', 'will', 'have', 'been', 'running', 'this', 'business', 'for', 'twenty', 'years'],
        explanation: 'Estructura: By 2030 + we + will have been + running + objeto + for [duración].'
      },
      {
        id: 'fpc-ex10',
        type: 'fill-blank',
        difficulty: 'expert',
        prompt: 'Cláusula condicional compleja con Future Perfect Continuous: "If the clinical trial continues without disruption until December, Dr. Aris _____ (lead) the oncology research department for twenty consecutive years."',
        hint: 'Fórmula: will have been + verbo en -ing',
        correctAnswer: 'will have been leading',
        explanation: 'Combina una cláusula condicional ("if the trial continues...") con una meta temporal futura ("until December") para medir la duración ininterrumpida de una labor con Future Perfect Continuous ("will have been leading").'
      },
      {
        id: 'fpc-ex11',
        type: 'multiple-choice',
        difficulty: 'expert',
        prompt: 'Condición de resistencia continua en entorno extremo: "If the deep-ocean probe withstands the thermal vent until midnight, it _____ telemetry data under immense hydrostatic pressure for 72 uninterrupted hours."',
        options: ['will have been transmitting', 'will be transmitted', 'has been transmitting', 'would transmit'],
        correctAnswer: 'will have been transmitting',
        explanation: 'Para proyectar una acción que habrá estado ocurriendo de forma ininterrumpida durante una cantidad de tiempo antes de un hito futuro ("for 72 uninterrupted hours until midnight"), se emplea Future Perfect Continuous.'
      }
    ]
  }
];

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
