import { DiagnosticQuestion } from '../types';

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'diag-1',
    category: 'Presente Cotidiano',
    level: 'A1',
    tenseId: 'present-simple',
    question: 'She usually ________ coffee in the morning, but today she ________ tea.',
    options: [
      'drinks / is drinking',
      'is drinking / drinks',
      'drink / drinking',
      'drinks / drinks'
    ],
    correctIndex: 0,
    explanation: 'Usamos Present Simple ("drinks") para hábitos y rutinas regulares (signal word: "usually"), y Present Continuous ("is drinking") para acciones temporales que ocurren hoy o ahora mismo.',
    grammarFocus: 'Present Simple vs Present Continuous (Hábitos vs Estados temporales)'
  },
  {
    id: 'diag-2',
    category: 'Pasado Simple',
    level: 'A2',
    tenseId: 'past-simple',
    question: 'Last night, we ________ a great movie and then we ________ dinner together.',
    options: [
      'watched / had',
      'watch / have',
      'were watching / had',
      'watched / have had'
    ],
    correctIndex: 0,
    explanation: 'Usamos Past Simple ("watched", "had") para una secuencia de acciones completadas en un tiempo específico del pasado ("Last night").',
    grammarFocus: 'Past Simple (Verbos regulares e irregulares completados)'
  },
  {
    id: 'diag-3',
    category: 'Planes Futuros',
    level: 'A2',
    tenseId: 'future-simple',
    question: 'Look at those dark clouds! It ________ rain in a few minutes.',
    options: [
      'is going to',
      'will',
      'is raining',
      'shall'
    ],
    correctIndex: 0,
    explanation: 'Usamos "be going to" cuando tenemos evidencia visual o física inmediata en el presente ("Look at those dark clouds"). Usamos "will" para decisiones espontáneas o predicciones sin evidencia directa.',
    grammarFocus: 'Future: "Be going to" (Evidencia presente) vs "Will"'
  },
  {
    id: 'diag-4',
    category: 'Experiencias de Vida',
    level: 'B1',
    tenseId: 'present-perfect-simple',
    question: 'I ________ to Japan twice, but I ________ there in 2022.',
    options: [
      'have been / went',
      'went / have been',
      'have gone / went',
      'am / visited'
    ],
    correctIndex: 0,
    explanation: 'Usamos Present Perfect ("have been") para experiencias de vida sin fecha específica. Cuando mencionamos el año exacto ("in 2022"), la regla exige Past Simple ("went").',
    grammarFocus: 'Present Perfect Simple vs Past Simple (Tiempo indefinido vs fecha fija)'
  },
  {
    id: 'diag-5',
    category: 'Acciones en Progreso en el Pasado',
    level: 'B1',
    tenseId: 'past-continuous',
    question: 'While I ________ for the bus, my phone suddenly ________.',
    options: [
      'was waiting / rang',
      'waited / was ringing',
      'waited / rang',
      'have waited / rang'
    ],
    correctIndex: 0,
    explanation: 'La acción de fondo duradera va en Past Continuous ("was waiting"), y la interrupción repentina e instantánea va en Past Simple ("rang").',
    grammarFocus: 'Past Continuous con "While" / Interrupción con Past Simple'
  },
  {
    id: 'diag-6',
    category: 'Duración Continua',
    level: 'B1',
    tenseId: 'present-perfect-continuous',
    question: 'You look exhausted! What ________ all afternoon?',
    options: [
      'have you been doing',
      'did you do',
      'are you doing',
      'had you done'
    ],
    correctIndex: 0,
    explanation: 'Usamos Present Perfect Continuous ("have you been doing") para una actividad continua que acaba de terminar o continúa, cuyos efectos físicos son evidentes ahora ("You look exhausted").',
    grammarFocus: 'Present Perfect Continuous (Efecto visible en el presente)'
  },
  {
    id: 'diag-7',
    category: 'El Pasado del Pasado',
    level: 'B2',
    tenseId: 'past-perfect-simple',
    question: 'When the police arrived at the bank, the suspects ________ already ________.',
    options: [
      'had / escaped',
      'have / escaped',
      'were / escaping',
      'did / escape'
    ],
    correctIndex: 0,
    explanation: 'Past Perfect ("had escaped") se utiliza para indicar qué acción ocurrió primero entre dos hechos en el pasado. El escape ocurrió antes de la llegada de la policía.',
    grammarFocus: 'Past Perfect Simple (Cronología anterior al pasado simple)'
  },
  {
    id: 'diag-8',
    category: 'Futuro en un Momento Exacto',
    level: 'B2',
    tenseId: 'future-continuous',
    question: 'This time tomorrow, we ________ over the Atlantic Ocean on our way to London.',
    options: [
      'will be flying',
      'will fly',
      'are fly',
      'will have flown'
    ],
    correctIndex: 0,
    explanation: 'Usamos Future Continuous ("will be flying") para describir una acción que estará en pleno desarrollo en un momento específico del futuro ("This time tomorrow").',
    grammarFocus: 'Future Continuous (Acción en curso en un instante futuro)'
  },
  {
    id: 'diag-9',
    category: 'Metas Completadas en el Futuro',
    level: 'C1',
    tenseId: 'future-perfect-simple',
    question: 'By the time you finish this course in December, you ________ all 12 English tenses.',
    options: [
      'will have mastered',
      'will master',
      'have mastered',
      'will be mastering'
    ],
    correctIndex: 0,
    explanation: '"By + expresión de tiempo futuro" es la señal por excelencia del Future Perfect ("will have mastered"). Significa que la acción estará completada antes de ese límite temporal.',
    grammarFocus: 'Future Perfect Simple (Proyección completada antes de un límite)'
  },
  {
    id: 'diag-10',
    category: 'Procesos Continuos Anteriores al Pasado',
    level: 'C1',
    tenseId: 'past-perfect-continuous',
    question: 'She was out of breath because she ________ for over an hour before the coach arrived.',
    options: [
      'had been running',
      'has been running',
      'was running',
      'ran'
    ],
    correctIndex: 0,
    explanation: 'Usamos Past Perfect Continuous ("had been running") para enfatizar la duración ininterrumpida de una actividad física antes de otro suceso pasado.',
    grammarFocus: 'Past Perfect Continuous (Causa continua con duración en el pasado)'
  },
  {
    id: 'diag-11',
    category: 'Presente y Tercera Persona',
    level: 'A1',
    tenseId: 'present-simple',
    question: 'My brother ________ in London, and he ________ English every weekend.',
    options: [
      'lives / studies',
      'live / study',
      'is living / study',
      'lives / study'
    ],
    correctIndex: 0,
    explanation: 'Para la tercera persona singular (he / my brother) en afirmativo de Present Simple, los verbos añaden "-s" o "-ies" (live -> lives, study -> studies).',
    grammarFocus: 'Present Simple (Reglas de ortografía para la 3ra persona he/she/it)'
  },
  {
    id: 'diag-12',
    category: 'Preguntas en Pasado',
    level: 'A2',
    tenseId: 'past-simple',
    question: 'Why ________ to the meeting yesterday? We were waiting for you.',
    options: [
      "didn't you come",
      "you didn't come",
      "didn't you came",
      "weren't you come"
    ],
    correctIndex: 0,
    explanation: 'En preguntas negativas de Past Simple la estructura es: Wh-word + didn\'t + sujeto + verbo en forma base (come).',
    grammarFocus: 'Past Simple (Estructura interrogativa negativa con auxiliar did)'
  },
  {
    id: 'diag-13',
    category: 'Present Perfect vs Pasado Cerrado',
    level: 'B1',
    tenseId: 'present-perfect-simple',
    question: 'I ________ in this city for six years, but before that I ________ in Valencia.',
    options: [
      'have lived / lived',
      'lived / have lived',
      'am living / lived',
      'have lived / have lived'
    ],
    correctIndex: 0,
    explanation: 'La situación continua hasta el presente usa Present Perfect ("have lived for six years"), mientras que la etapa previa totalmente cerrada en Valencia usa Past Simple ("lived").',
    grammarFocus: 'Present Perfect (Situación continuada) vs Past Simple (Etapa culminada)'
  },
  {
    id: 'diag-14',
    category: 'Hipotéticos en Pasado (Third Conditional)',
    level: 'B2',
    tenseId: 'past-perfect-simple',
    question: 'If you ________ me earlier, I ________ you with the project.',
    options: [
      'had called / would have helped',
      'called / would help',
      'would have called / helped',
      'had called / helped'
    ],
    correctIndex: 0,
    explanation: 'El tercer condicional expresa situaciones irreales en el pasado: If + Past Perfect (had called) + would have + participio (would have helped).',
    grammarFocus: 'Past Perfect en Tercer Condicional (Causa y consecuencia irreal en el pasado)'
  },
  {
    id: 'diag-15',
    category: 'Proyección Temporal Acumulada',
    level: 'C1',
    tenseId: 'future-perfect-continuous',
    question: 'By this time next month, Dr. Evans ________ research on this vaccine for twenty years.',
    options: [
      'will have been conducting',
      'will conduct',
      'will be conducting',
      'has been conducting'
    ],
    correctIndex: 0,
    explanation: 'Future Perfect Continuous ("will have been conducting") calcula la duración acumulada ininterrumpida que se alcanzará en una fecha específica del futuro.',
    grammarFocus: 'Future Perfect Continuous (Duración proyectada con "By + tiempo futuro + for")'
  }
];
