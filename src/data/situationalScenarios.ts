export interface SituationalScenario {
  id: string;
  title: string;
  spanishTitle: string;
  category: 'daily' | 'travel' | 'work' | 'social';
  photoUrl: string;
  photoAlt: string;
  contextDescription: string;
  targetTenseName: string;
  targetTenseId: string;
  keyPhraseEnglish: string;
  keyPhrasePhonetic: string;
  keyPhraseSpanish: string;
  whyBrainRemembers: string; // The cognitive visual anchor explanation
  interactiveQuiz: {
    question: string;
    options: {
      text: string;
      isCorrect: boolean;
      feedback: string;
    }[];
  };
  tutorStarterPrompt: string;
}

export const SITUATIONAL_SCENARIOS: SituationalScenario[] = [
  {
    id: 'coffee_shop',
    title: 'At the Coffee Shop',
    spanishTitle: 'En la Cafetería',
    category: 'daily',
    photoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    photoAlt: 'Barista preparando café en una cafetería acogedora',
    contextDescription: 'Estás frente al mostrador, hay fila detrás y quieres pedir un café con leche de avena para llevar.',
    targetTenseName: 'Present Continuous & Polite Modals',
    targetTenseId: 'present-continuous',
    keyPhraseEnglish: "I'm having an oat milk latte, and could I get that to go?",
    keyPhrasePhonetic: "/aɪm ˈhævɪŋ ən oʊt mɪlk ˈlɑːteɪ, ænd kəd aɪ ɡɛt ðæt tuː ɡoʊ/",
    keyPhraseSpanish: "Voy a pedir un latte con leche de avena, ¿y me lo podrías poner para llevar?",
    whyBrainRemembers: 'El cerebro asocia el aroma del café y la prisa de la mañana con el verbo en continuo "I\'m having" en lugar de traducir literalmente "yo quiero".',
    interactiveQuiz: {
      question: 'El barista te pregunta: "What can I get started for you today?". ¿Cuál es la forma más natural de responder?',
      options: [
        {
          text: "I am having a medium cappuccino, please.",
          isCorrect: true,
          feedback: "¡Exacto! 'I'm having...' o 'Could I have...' es como lo piden los nativos en el 90% de los casos."
        },
        {
          text: "I want coffee.",
          isCorrect: false,
          feedback: "Aunque se entiende, 'I want' suena seco o descortés en cafeterías anglosajonas."
        },
        {
          text: "I have drinking coffee now.",
          isCorrect: false,
          feedback: "Error gramatical: mezclas 'have' con 'drinking' sin verbo auxiliar correcto."
        }
      ]
    },
    tutorStarterPrompt: "I am at a coffee shop and I want to order a drink and a blueberry muffin. Can we roleplay?"
  },
  {
    id: 'airport_gate',
    title: 'Airport Boarding Gate',
    spanishTitle: 'Puerta de Embarque en el Aeropuerto',
    category: 'travel',
    photoUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80',
    photoAlt: 'Pantalla de salidas y aviones en la puerta de un aeropuerto internacional',
    contextDescription: 'Escuchas el altavoz en el aeropuerto internacional anunciando un cambio de puerta de tu vuelo.',
    targetTenseName: 'Present Perfect (Acción reciente con impacto presente)',
    targetTenseId: 'present-perfect',
    keyPhraseEnglish: "Flight 402 has just started boarding at Gate B12.",
    keyPhrasePhonetic: "/flaɪt fɔːr-oʊ-tuː hæz dʒʌst ˈstɑːrtɪd ˈbɔːrdɪŋ æt ɡeɪt biː-twɛlv/",
    keyPhraseSpanish: "El vuelo 402 acaba de iniciar el embarque en la puerta B12.",
    whyBrainRemembers: 'Tu mente asocia el estrés de la maleta y los altavoces con "has just started": una acción que acaba de ocurrir pero que te afecta en este preciso instante.',
    interactiveQuiz: {
      question: 'La azafata anuncia: "Attention passengers, the flight _____ its gate to C4." ¿Qué opción completa la frase?',
      options: [
        {
          text: "has changed",
          isCorrect: true,
          feedback: "¡Brillante! Se usa Present Perfect ('has changed') porque la acción acaba de ocurrir y es relevante para tu momento presente."
        },
        {
          text: "changes yesterday",
          isCorrect: false,
          feedback: "Incorrecto: el cambio acaba de ocurrir para este vuelo activo, no en el pasado remoto."
        },
        {
          text: "is change",
          isCorrect: false,
          feedback: "Error de concordancia: falta el participio o la forma pasiva."
        }
      ]
    },
    tutorStarterPrompt: "I am at the airport gate and my flight is delayed. What should I ask the airline agent?"
  },
  {
    id: 'job_interview',
    title: 'Job Interview Showcase',
    spanishTitle: 'Entrevista de Trabajo Profesional',
    category: 'work',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
    photoAlt: 'Profesional respondiendo con confianza en una entrevista laboral',
    contextDescription: 'El reclutador te pregunta: "Tell me about what you have been doing recently in your career."',
    targetTenseName: 'Present Perfect Continuous (Trayectoria acumulada)',
    targetTenseId: 'present-perfect-continuous',
    keyPhraseEnglish: "I have been leading cross-functional teams for the last three years.",
    keyPhrasePhonetic: "/aɪ hæv bɪn ˈliːdɪŋ krɔːs-ˈfʌŋkʃənl tiːmz fər ðə læst θriː jɪərz/",
    keyPhraseSpanish: "He estado liderando equipos multidisciplinarios durante los últimos tres años.",
    whyBrainRemembers: 'Visualizar tu currículum y tu salario ideal fija la estructura "have been + ing": comenzaste en el pasado y sigues haciéndolo con maestría hoy.',
    interactiveQuiz: {
      question: '¿Cómo explicas en una entrevista que llevas 5 meses estudiando inglés intensivo todos los días?',
      options: [
        {
          text: "I have been studying English for five months.",
          isCorrect: true,
          feedback: "¡Perfecto! 'Have been studying' transmite constancia y progreso activo ininterrumpido."
        },
        {
          text: "I studied English 5 months ago.",
          isCorrect: false,
          feedback: "Incorrecto: 'I studied' significa que lo hiciste en el pasado y ya terminaste o lo dejaste."
        },
        {
          text: "I am study English since 5 months.",
          isCorrect: false,
          feedback: "Doble error: 'am study' es incorrecto y con duración se usa 'for', no 'since'."
        }
      ]
    },
    tutorStarterPrompt: "Could you conduct a short job interview with me? Ask me 3 questions and correct my answers."
  },
  {
    id: 'supermarket',
    title: 'Supermarket & Groceries',
    spanishTitle: 'En el Supermercado',
    category: 'daily',
    photoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    photoAlt: 'Pasillo de supermercado con frutas y productos frescos',
    contextDescription: 'Buscas ingredientes específicos y preguntas al empleado del supermercado.',
    targetTenseName: 'Present Simple & Habitual Routine',
    targetTenseId: 'present-simple',
    keyPhraseEnglish: "Excuse me, where can I find the organic produce section?",
    keyPhrasePhonetic: "/ɪkˈskjuːz miː, wɛər kæn aɪ faɪnd ðiː ɔːrˈɡænɪk ˈprɒdjuːs ˈsɛkʃən/",
    keyPhraseSpanish: "Disculpe, ¿dónde puedo encontrar la sección de productos orgánicos?",
    whyBrainRemembers: 'Las imágenes de carritos y estanterías fijan el vocabulario de ubicación y la entonación de cortesía con "Excuse me, where can I find...".',
    interactiveQuiz: {
      question: 'Quieres saber si la tienda vende leche de almendras. ¿Cómo preguntas?',
      options: [
        {
          text: "Do you carry almond milk here?",
          isCorrect: true,
          feedback: "¡Excelente! En EE.UU. y Reino Unido, las tiendas usan el verbo 'carry' para referirse a tener productos en stock."
        },
        {
          text: "Are you have almond milk?",
          isCorrect: false,
          feedback: "Error típico de hispanohablantes: en Present Simple no se junta el auxiliar 'are' con el verbo 'have'."
        },
        {
          text: "You sell milk?",
          isCorrect: false,
          feedback: "Le falta el auxiliar 'Do' necesario para formular una pregunta formal."
        }
      ]
    },
    tutorStarterPrompt: "I am grocery shopping and I need to ask where ingredients are and how much they cost. Let's practice!"
  },
  {
    id: 'hotel_checkin',
    title: 'Hotel Check-In',
    spanishTitle: 'Recepción del Hotel',
    category: 'travel',
    photoUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    photoAlt: 'Recepción de hotel elegante con llaves de habitación',
    contextDescription: 'Llegas cansado tras 10 horas de viaje al hotel y necesitas hacer el check-in rápido.',
    targetTenseName: 'Past Simple & Politeness',
    targetTenseId: 'past-simple',
    keyPhraseEnglish: "I booked a non-smoking double room yesterday under the name Rodriguez.",
    keyPhrasePhonetic: "/aɪ bʊkt ə nɑːn-ˈsmoʊkɪŋ ˈdʌbl ruːm ˈjɛstərdeɪ ˈʌndər ðə neɪm roʊˈdriːɡɛz/",
    keyPhraseSpanish: "Reservé ayer una habitación doble para no fumadores a nombre de Rodríguez.",
    whyBrainRemembers: 'El recuerdo de registrarte en el lobby conecta con el Past Simple ("booked yesterday"): una acción terminada en un momento concreto con fecha.',
    interactiveQuiz: {
      question: 'El recepcionista te pregunta: "May I see your passport and booking confirmation?". ¿Cómo respondes?',
      options: [
        {
          text: "Sure, here you go. Everything is under my name.",
          isCorrect: true,
          feedback: "¡Perfecto y natural! 'Here you go' es la expresión nativa estándar al entregar algo en la mano."
        },
        {
          text: "Yes, take it.",
          isCorrect: false,
          feedback: "'Take it' suena brusco e imperativo en inglés."
        },
        {
          text: "I give you now.",
          isCorrect: false,
          feedback: "Frase incompleta y sin la fluidez habitual de cortesía."
        }
      ]
    },
    tutorStarterPrompt: "I want to practice checking in at a hotel, asking about breakfast hours, and requesting a room on a high floor."
  },
  {
    id: 'doctor_consultation',
    title: 'Doctor & Pharmacy',
    spanishTitle: 'Consulta Médica y Farmacia',
    category: 'daily',
    photoUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    photoAlt: 'Doctor escuchando con atención al paciente en consulta médica',
    contextDescription: 'Estás en el extranjero, te duele la cabeza y tienes fiebre desde hace dos días.',
    targetTenseName: 'Present Perfect Continuous (Síntomas y duración)',
    targetTenseId: 'present-perfect-continuous',
    keyPhraseEnglish: "I have been feeling dizzy and feverish since yesterday morning.",
    keyPhrasePhonetic: "/aɪ hæv bɪn ˈfiːlɪŋ ˈdɪzi ænd ˈfiːvərɪʃ sɪns ˈjɛstərdeɪ ˈmɔːrnɪŋ/",
    keyPhraseSpanish: "Me he estado sintiendo mareado y con fiebre desde ayer por la mañana.",
    whyBrainRemembers: 'Las sensaciones físicas de dolor o malestar se graban hondamente con "have been feeling... since": conecta el inicio del síntoma con el presente.',
    interactiveQuiz: {
      question: 'El médico te pregunta: "How long have you had this cough?". ¿Cómo respondes adecuadamente?',
      options: [
        {
          text: "I have had it for three days.",
          isCorrect: true,
          feedback: "¡Excelente! Con duración de tiempo se utiliza 'for three days', respondiendo en Present Perfect."
        },
        {
          text: "I have it since three days ago.",
          isCorrect: false,
          feedback: "Incorrecto: con un periodo de días no se usa 'since', se usa 'for'."
        },
        {
          text: "I am having cough yesterday.",
          isCorrect: false,
          feedback: "Error de tiempo: 'yesterday' requiere tiempo pasado simple."
        }
      ]
    },
    tutorStarterPrompt: "I have a sore throat and fever. Can you act as a doctor in New York and ask me about my symptoms?"
  }
];
