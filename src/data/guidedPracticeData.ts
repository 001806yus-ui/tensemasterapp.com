export interface GuidedStep {
  prompt: string;
  promptTranslation: string;
  ruleHint: string;
  suggestedReplies: string[];
  explanation: string;
  keywords: string[];
}

export interface GuidedTensePractice {
  tenseId: string;
  tenseName: string;
  cefrLevel: string;
  title: string;
  situation: string;
  icon: string;
  formula: string;
  steps: GuidedStep[];
}

export const GUIDED_TENSES_PRACTICE: GuidedTensePractice[] = [
  {
    tenseId: 'present-simple',
    tenseName: 'Present Simple',
    cefrLevel: 'A1-A2',
    title: 'Daily Routines & Work Habits',
    situation: 'Talking with a colleague about daily schedules and habitual routines.',
    icon: '☕',
    formula: 'Subject + Verb(base) / Verb(-s)',
    steps: [
      {
        prompt: "Hello! What time do you usually start your workday, and how do you commute?",
        promptTranslation: "¡Hola! ¿A qué hora sueles empezar tu jornada laboral y cómo te trasladas?",
        ruleHint: "Use base verb with 'I': 'I start at 8:30 AM' or 'I take the bus'.",
        suggestedReplies: [
          "I start at 8:30 AM and I drive to work.",
          "I usually begin at 9:00 AM and take the subway.",
          "I work from home, so I start at 8:00 AM at my desk."
        ],
        explanation: "Present Simple expresses habitual routines. Notice the base form with 'I' ('start', 'drive', 'take').",
        keywords: ['start', 'begin', 'work', 'drive', 'take', 'subway', 'bus', 'walk', 'home', 'usually', 'every']
      },
      {
        prompt: "That's a solid schedule! What do you usually do when you finish working for the day?",
        promptTranslation: "¡Es un buen horario! ¿Qué sueles hacer cuando terminas de trabajar?",
        ruleHint: "Express your regular evening habits using base verbs: 'I cook', 'I exercise', 'I relax'.",
        suggestedReplies: [
          "I usually cook dinner and read a book.",
          "I go to the gym three times a week.",
          "I spend time with my family and watch a movie."
        ],
        explanation: "Routine evening habits take the Present Simple with no auxiliary verb in affirmative statements.",
        keywords: ['cook', 'read', 'go', 'gym', 'spend', 'family', 'watch', 'relax', 'exercise']
      }
    ]
  },
  {
    tenseId: 'present-continuous',
    tenseName: 'Present Continuous',
    cefrLevel: 'A1-A2',
    title: 'Actions Happening Right Now',
    situation: 'A study partner calls you while you are actively working in the afternoon.',
    icon: '⚡',
    formula: 'Subject + am/is/are + Verb(-ing)',
    steps: [
      {
        prompt: "Hey! What are you doing right now? Are you working on something interesting?",
        promptTranslation: "¡Hola! ¿Qué estás haciendo ahora mismo? ¿Estás trabajando en algo interesante?",
        ruleHint: "Use 'I am + verb-ing' for an action happening at this exact moment.",
        suggestedReplies: [
          "I am studying English grammar right now.",
          "I am preparing dinner in the kitchen.",
          "I am writing an important report at my desk."
        ],
        explanation: "Present Continuous pairs the auxiliary 'am' with 'verb-ing' to describe in-progress actions.",
        keywords: ['am studying', 'am preparing', 'am writing', 'am working', 'am doing', 'studying', 'working']
      },
      {
        prompt: "Sounds very productive! Is anyone helping you, or are you working alone?",
        promptTranslation: "¡Suena muy productivo! ¿Alguien te está ayudando o estás trabajando solo/a?",
        ruleHint: "Use 'is/are + verb-ing' for other people or 'am' for yourself.",
        suggestedReplies: [
          "I am working on my own today.",
          "My colleagues are collaborating with me online.",
          "A study partner is practicing with me right now."
        ],
        explanation: "Use 'is' with singular subjects ('a partner is practicing') and 'are' with plural ('colleagues are collaborating').",
        keywords: ['working', 'collaborating', 'practicing', 'helping', 'alone', 'on my own']
      }
    ]
  },
  {
    tenseId: 'past-simple',
    tenseName: 'Past Simple',
    cefrLevel: 'A2',
    title: 'Completed Past Events & Memories',
    situation: 'Catching up with a friend on Monday morning about what you did over the weekend.',
    icon: '📅',
    formula: 'Subject + Verb(-ed / irregular V2)',
    steps: [
      {
        prompt: "Good morning! How was your weekend? What did you do on Saturday?",
        promptTranslation: "¡Buenos días! ¿Qué tal tu fin de semana? ¿Qué hiciste el sábado?",
        ruleHint: "Use the past form V2 (e.g. visited, went, watched, stayed).",
        suggestedReplies: [
          "I visited my grandparents and we had lunch together.",
          "I went hiking in the mountains with a friend.",
          "I stayed home and watched an interesting documentary."
        ],
        explanation: "Past Simple specifies a finished action at a completed past time (on Saturday).",
        keywords: ['visited', 'went', 'stayed', 'watched', 'had', 'cooked', 'walked', 'bought']
      },
      {
        prompt: "That sounds great! Did you try any new food or buy anything special?",
        promptTranslation: "¡Suena genial! ¿Probaste alguna comida nueva o compraste algo especial?",
        ruleHint: "Answer in Past Simple: 'I tried...', 'I bought...', or negative: 'I didn't buy...'.",
        suggestedReplies: [
          "Yes, I tried a delicious new Italian restaurant downtown.",
          "No, I cooked all my meals at home and saved money.",
          "I bought a couple of useful English books."
        ],
        explanation: "Irregular verbs change forms in affirmative past (tried, cooked, bought). In negative: didn't + base verb.",
        keywords: ['tried', 'bought', 'cooked', 'saved', "didn't", 'ate', 'enjoyed']
      }
    ]
  },
  {
    tenseId: 'past-continuous',
    tenseName: 'Past Continuous',
    cefrLevel: 'B1',
    title: 'Actions in Progress in the Past',
    situation: 'Describing what you were doing when a sudden storm broke out yesterday.',
    icon: '🌧️',
    formula: 'Subject + was/were + Verb(-ing)',
    steps: [
      {
        prompt: "Where were you when the big storm started yesterday afternoon? What were you doing?",
        promptTranslation: "¿Dónde estabas cuando empezó la gran tormenta ayer por la tarde? ¿Qué estabas haciendo?",
        ruleHint: "Use 'was/were + verb-ing' for the background action in progress when something happened.",
        suggestedReplies: [
          "I was walking home when the rain suddenly started.",
          "I was driving on the highway when the storm hit.",
          "I was reading by the window when thunder shook the house."
        ],
        explanation: "Past Continuous establishes an action in progress ('was walking') that was interrupted by a Past Simple event ('started').",
        keywords: ['was walking', 'was driving', 'was reading', 'was cooking', 'was working', 'were']
      },
      {
        prompt: "Were you scared, or were you able to get indoors quickly?",
        promptTranslation: "¿Te asustaste o pudiste entrar a algún lugar bajo techo rápidamente?",
        ruleHint: "Combine Past Simple and Continuous: 'I was running while the rain was pouring'.",
        suggestedReplies: [
          "I ran into a nearby café and waited until it stopped.",
          "I was holding an umbrella, so I stayed relatively dry.",
          "I was already sitting inside safe and warm."
        ],
        explanation: "Notice the difference: 'ran' is a single completed action; 'was holding' was continuous.",
        keywords: ['ran', 'waited', 'was holding', 'stayed', 'was sitting']
      }
    ]
  },
  {
    tenseId: 'present-perfect',
    tenseName: 'Present Perfect',
    cefrLevel: 'B1',
    title: 'Life Experiences & Recent News',
    situation: 'Sharing memorable travel experiences and life milestones.',
    icon: '🏆',
    formula: 'Subject + have/has + Past Participle (V3)',
    steps: [
      {
        prompt: "Have you ever traveled to another country or visited an iconic landmark?",
        promptTranslation: "¿Alguna vez has viajado a otro país o visitado un lugar emblemático?",
        ruleHint: "Use 'have/has + past participle (V3)' for life experiences with no specific past date.",
        suggestedReplies: [
          "Yes, I have visited three foreign countries so far.",
          "I have never traveled abroad, but I want to.",
          "I have seen the Grand Canyon and it was breathtaking."
        ],
        explanation: "Present Perfect connects your past experience to who you are today. Notice 'have visited', 'have traveled'.",
        keywords: ['have visited', 'have traveled', 'have seen', 'have been', 'have never', 'never traveled']
      },
      {
        prompt: "Wonderful! And what new skill have you learned recently that makes you proud?",
        promptTranslation: "¡Maravilloso! ¿Y qué nueva habilidad has aprendido recientemente que te haga sentir orgullo?",
        ruleHint: "Use 'have + learned/improved/practiced' with recently or lately.",
        suggestedReplies: [
          "I have improved my English speaking confidence a lot.",
          "I have learned how to use complex verb tenses.",
          "I have started reading English novels without a dictionary."
        ],
        explanation: "Recent completed achievements that impact the present take Present Perfect ('have improved', 'have learned').",
        keywords: ['have improved', 'have learned', 'have started', 'have practiced', 'recently', 'lately']
      }
    ]
  },
  {
    tenseId: 'present-perfect-continuous',
    tenseName: 'Present Perfect Continuous',
    cefrLevel: 'B1-B2',
    title: 'Duration & Ongoing Activities',
    situation: 'Discussing the duration of your studies and personal projects.',
    icon: '⏳',
    formula: 'Subject + have/has + been + Verb(-ing)',
    steps: [
      {
        prompt: "Your English is progressing nicely! How long have you been studying English?",
        promptTranslation: "¡Tu inglés está progresando bien! ¿Cuánto tiempo llevas estudiando inglés?",
        ruleHint: "Use 'have been + verb-ing' + 'for [period]' or 'since [year/month]'.",
        suggestedReplies: [
          "I have been studying English for six months now.",
          "I have been practicing every single day this month.",
          "I have been learning English since I was in high school."
        ],
        explanation: "Present Perfect Continuous highlights the uninterrupted duration of an activity from the past until now.",
        keywords: ['have been studying', 'have been practicing', 'have been learning', 'for', 'since']
      },
      {
        prompt: "That dedication really pays off! What specific areas have you been focusing on?",
        promptTranslation: "¡Esa dedicación da frutos! ¿En qué áreas específicas te has estado enfocando?",
        ruleHint: "Use 'I have been focusing on...' or 'I have been listening to...'.",
        suggestedReplies: [
          "I have been focusing on mastering all 12 verb tenses.",
          "I have been listening to authentic podcasts every morning.",
          "I have been practicing pronunciation and speaking aloud."
        ],
        explanation: "Emphasizes the ongoing nature of your daily habit: 'have been focusing', 'have been listening'.",
        keywords: ['have been focusing', 'have been listening', 'have been working', 'have been practicing']
      }
    ]
  },
  {
    tenseId: 'past-perfect',
    tenseName: 'Past Perfect',
    cefrLevel: 'B2',
    title: 'The Past Before the Past',
    situation: 'Explaining an event that had already finished before another past moment.',
    icon: '⏮️',
    formula: 'Subject + had + Past Participle (V3)',
    steps: [
      {
        prompt: "Tell me about a time when you arrived somewhere late. Had the event already started?",
        promptTranslation: "Cuéntame de alguna vez que llegaste tarde a algún lugar. ¿El evento ya había empezado?",
        ruleHint: "Use 'had + V3' for the earlier action that finished before you arrived.",
        suggestedReplies: [
          "Yes, when I arrived, the movie had already started.",
          "By the time I reached the station, the train had left.",
          "Fortunately, the meeting had not started yet when I entered."
        ],
        explanation: "Past Perfect identifies the first of two past actions: the movie 'had started' before I 'arrived'.",
        keywords: ['had started', 'had left', 'had not started', 'had already', 'had arrived', 'had finished']
      },
      {
        prompt: "What did you do once you realized what had happened?",
        promptTranslation: "¿Qué hiciste cuando te diste cuenta de lo que había sucedido?",
        ruleHint: "Past Simple for your subsequent reaction: 'I found...', 'I waited...'.",
        suggestedReplies: [
          "I quietly found my seat and enjoyed the rest of the film.",
          "I waited for the next train and called my colleague.",
          "I apologized to the team and joined the discussion immediately."
        ],
        explanation: "Once the timeline is clear with Past Perfect, subsequent actions continue in Past Simple.",
        keywords: ['found', 'waited', 'apologized', 'joined', 'sat', 'called']
      }
    ]
  },
  {
    tenseId: 'past-perfect-continuous',
    tenseName: 'Past Perfect Continuous',
    cefrLevel: 'B2-C1',
    title: 'Ongoing Past Duration Before an Event',
    situation: 'Explaining how long an action had been continuing before a past cutoff.',
    icon: '⏱️',
    formula: 'Subject + had + been + Verb(-ing)',
    steps: [
      {
        prompt: "How long had you been waiting before your flight finally boarded yesterday?",
        promptTranslation: "¿Cuánto tiempo habías estado esperando antes de que tu vuelo finalmente abordara ayer?",
        ruleHint: "Use 'had been + verb-ing' for duration leading up to a past event.",
        suggestedReplies: [
          "We had been waiting for three hours before the gate opened.",
          "I had been working on my laptop until they called our row.",
          "The passengers had been standing in line for twenty minutes."
        ],
        explanation: "Past Perfect Continuous highlights duration continuing right up to another past moment.",
        keywords: ['had been waiting', 'had been working', 'had been standing', 'had been sitting', 'for hours']
      },
      {
        prompt: "Were travelers frustrated, or had people been remaining calm?",
        promptTranslation: "¿Los viajeros estaban frustrados o la gente había estado manteniendo la calma?",
        ruleHint: "Use 'had been + verb-ing' to describe the sustained atmosphere.",
        suggestedReplies: [
          "People had been staying patient, but everyone was tired.",
          "Passengers had been complaining to the gate staff about the delay.",
          "Most travelers had been reading quietly until the announcement."
        ],
        explanation: "Notice the sustained duration: 'had been staying patient', 'had been complaining'.",
        keywords: ['had been staying', 'had been complaining', 'had been reading', 'patient', 'tired']
      }
    ]
  },
  {
    tenseId: 'future-simple',
    tenseName: 'Future Simple',
    cefrLevel: 'A2',
    title: 'Predictions, Offers & Decisions',
    situation: 'Discussing tomorrow’s weather, upcoming events, and spontaneous decisions.',
    icon: '🔮',
    formula: 'Subject + will + Verb(base)',
    steps: [
      {
        prompt: "What do you think the weather will be like tomorrow? Any predictions?",
        promptTranslation: "¿Cómo crees que estará el clima mañana? ¿Alguna predicción?",
        ruleHint: "Use 'I think it will be...' for opinions and predictions about the future.",
        suggestedReplies: [
          "I think it will be sunny and warm tomorrow.",
          "I believe it will probably rain, so I will take an umbrella.",
          "I think temperatures will drop in the evening."
        ],
        explanation: "Future Simple with 'will' is the standard way to express predictions based on opinion.",
        keywords: ['will be', 'will rain', 'will drop', 'will take', 'will stay', 'think it will']
      },
      {
        prompt: "Will you have some free time tomorrow evening to practice English?",
        promptTranslation: "¿Tendrás algo de tiempo libre mañana por la noche para practicar inglés?",
        ruleHint: "Use 'will + have' or 'will + verb' for spontaneous confirmation.",
        suggestedReplies: [
          "Yes, I will dedicate 30 minutes to my lesson tomorrow evening.",
          "I will probably be busy with work, but I will try.",
          "I will practice right after dinner."
        ],
        explanation: "Will expresses promises and spontaneous decisions made at the moment of speaking.",
        keywords: ['will dedicate', 'will try', 'will practice', 'will have', 'will be']
      }
    ]
  },
  {
    tenseId: 'future-continuous',
    tenseName: 'Future Continuous',
    cefrLevel: 'B1-B2',
    title: 'Actions in Progress in the Future',
    situation: 'Envisioning what you will be doing at an exact time tomorrow afternoon.',
    icon: '🛫',
    formula: 'Subject + will + be + Verb(-ing)',
    steps: [
      {
        prompt: "Tomorrow at 3:00 PM, what will you be doing?",
        promptTranslation: "Mañana a las 3:00 de la tarde, ¿qué estarás haciendo?",
        ruleHint: "Use 'will be + verb-ing' for an action that will be in progress at a specific future time.",
        suggestedReplies: [
          "At 3:00 PM tomorrow, I will be working at my office.",
          "I will be attending an important team meeting at that hour.",
          "I will be traveling on the train to visit my family."
        ],
        explanation: "Future Continuous captures a continuous scene that will be unfolding at an exact future moment.",
        keywords: ['will be working', 'will be attending', 'will be traveling', 'will be studying', 'will be doing']
      },
      {
        prompt: "Will you be working late tomorrow, or will you be heading home early?",
        promptTranslation: "¿Estarás trabajando hasta tarde mañana o estarás yendo a casa temprano?",
        ruleHint: "Use 'will be + verb-ing' for routine future schedules.",
        suggestedReplies: [
          "I will be heading home around 5:30 PM.",
          "I will be finishing my tasks on time and relaxing at home.",
          "I will be working until 7:00 PM to finish my deadlines."
        ],
        explanation: "Future Continuous sounds polite and natural when asking about or stating upcoming plans.",
        keywords: ['will be heading', 'will be finishing', 'will be working', 'will be leaving']
      }
    ]
  },
  {
    tenseId: 'future-perfect',
    tenseName: 'Future Perfect',
    cefrLevel: 'B2',
    title: 'Deadlines & Future Milestones',
    situation: 'Looking forward to goals and achievements completed before a deadline.',
    icon: '🎯',
    formula: 'Subject + will + have + Past Participle (V3)',
    steps: [
      {
        prompt: "By the end of this year, what major English goal will you have achieved?",
        promptTranslation: "Para finales de este año, ¿qué meta importante de inglés habrás alcanzado?",
        ruleHint: "Use 'By [date], I will have + V3' (e.g. will have mastered, will have completed).",
        suggestedReplies: [
          "By the end of this year, I will have mastered all 12 English tenses.",
          "I will have completed the entire course and received my certificate.",
          "I will have read three complete books in English."
        ],
        explanation: "Future Perfect views an event as completed before a future deadline ('by the end of this year').",
        keywords: ['will have mastered', 'will have completed', 'will have read', 'will have finished', 'will have achieved']
      },
      {
        prompt: "That is an inspiring milestone! How will you celebrate once you have reached it?",
        promptTranslation: "¡Es una meta inspiradora! ¿Cómo lo celebrarás una vez que la hayas alcanzado?",
        ruleHint: "Express celebration: 'I will take a trip...', 'I will share my certificate...'.",
        suggestedReplies: [
          "I will celebrate by booking a trip to an English-speaking destination.",
          "I will share my verified completion certificate on my professional profile.",
          "I will take my family out for a special celebration dinner."
        ],
        explanation: "Combine Future Perfect milestones with future rewards and celebrations.",
        keywords: ['will celebrate', 'will share', 'will take', 'will book', 'will enjoy']
      }
    ]
  },
  {
    tenseId: 'future-perfect-continuous',
    tenseName: 'Future Perfect Continuous',
    cefrLevel: 'C1',
    title: 'Duration Measured at a Future Point',
    situation: 'Calculating continuous duration up to a future anniversary or milestone.',
    icon: '📈',
    formula: 'Subject + will + have + been + Verb(-ing)',
    steps: [
      {
        prompt: "By this time next year, how long will you have been learning English?",
        promptTranslation: "Para estas fechas el próximo año, ¿cuánto tiempo habrás estado aprendiendo inglés?",
        ruleHint: "Use 'will have been + verb-ing' + 'for [duration]'.",
        suggestedReplies: [
          "By next year, I will have been practicing English daily for over a year.",
          "I will have been studying for two years by that time.",
          "By then, I will have been building fluency steadily every single week."
        ],
        explanation: "Future Perfect Continuous projects forward to a future point and looks back at ongoing duration.",
        keywords: ['will have been practicing', 'will have been studying', 'will have been learning', 'for over a year']
      },
      {
        prompt: "What will your next milestone be after you have been practicing for so long?",
        promptTranslation: "¿Cuál será tu siguiente meta después de haber estado practicando durante tanto tiempo?",
        ruleHint: "Use 'I will start...' or 'I will aim to...'.",
        suggestedReplies: [
          "I will start conducting business presentations entirely in English.",
          "I will aim for bilingual fluency in professional negotiations.",
          "I will continue practicing every day to maintain effortless fluency."
        ],
        explanation: "Highlights long-term mastery achieved through consistent compound practice.",
        keywords: ['will start', 'will aim', 'will continue', 'presentations', 'fluency']
      }
    ]
  }
];
