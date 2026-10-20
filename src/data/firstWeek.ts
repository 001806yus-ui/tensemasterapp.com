export type WeekQuestion = { prompt: string; choices: string[]; answer: number; explanation: string };
export type WeekDay = { title: string; mission: string; tense: string; tab: 'formulas' | 'examples' | 'pronunciation' | 'practice'; questions: WeekQuestion[]; tutorPrompt: string };
export const FIRST_WEEK: WeekDay[] = [
  {
    "title": "Daily Routine & Habits",
    "mission": "Start with three short questions. Then write two sentences about your routine.",
    "tense": "present-simple",
    "tab": "formulas",
    "questions": [
      {
        "prompt": "I ___ coffee every morning.",
        "choices": [
          "drink",
          "drinks",
          "drinking"
        ],
        "answer": 0,
        "explanation": "Use the base verb with I for a routine."
      },
      {
        "prompt": "She ___ work on Sundays.",
        "choices": [
          "don’t",
          "doesn’t",
          "isn’t"
        ],
        "answer": 1,
        "explanation": "Use doesn’t + base verb with she."
      },
      {
        "prompt": "Right now, they ___ dinner.",
        "choices": [
          "cook",
          "cooks",
          "are cooking"
        ],
        "answer": 2,
        "explanation": "Use are + verb-ing for an action happening now."
      }
    ],
    "tutorPrompt": "Please help me practice this English mission: Start with three short questions. Then write two sentences about your routine. Ask me one short question at a time. Give brief, specific feedback based only on my answers."
  },
  {
    "title": "Tell me about your morning",
    "mission": "Listen to a lesson example, then say three things you do every morning.",
    "tense": "present-simple",
    "tab": "examples",
    "questions": [
      {
        "prompt": "My brother ___ up at seven every day.",
        "choices": [
          "get",
          "gets",
          "is get"
        ],
        "answer": 1,
        "explanation": "Add -s with he, she or it in the present simple."
      }
    ],
    "tutorPrompt": "Please help me practice this English mission: Listen to a lesson example, then say three things you do every morning. Ask me one short question at a time. Give brief, specific feedback based only on my answers."
  },
  {
    "title": "Ask someone about their day",
    "mission": "Practice asking two questions about someone’s routine.",
    "tense": "present-simple",
    "tab": "practice",
    "questions": [
      {
        "prompt": "___ you work from home?",
        "choices": [
          "Does",
          "Are",
          "Do"
        ],
        "answer": 2,
        "explanation": "Use Do + you + base verb for a routine question."
      }
    ],
    "tutorPrompt": "Please help me practice this English mission: Practice asking two questions about someone’s routine. Ask me one short question at a time. Give brief, specific feedback based only on my answers."
  },
  {
    "title": "Say what you do differently",
    "mission": "Say two things you do and one thing you don’t do on weekends.",
    "tense": "present-simple",
    "tab": "pronunciation",
    "questions": [
      {
        "prompt": "We ___ watch television during dinner.",
        "choices": [
          "doesn’t",
          "don’t",
          "aren’t"
        ],
        "answer": 1,
        "explanation": "Use don’t + base verb with we."
      }
    ],
    "tutorPrompt": "Please help me practice this English mission: Say two things you do and one thing you don’t do on weekends. Ask me one short question at a time. Give brief, specific feedback based only on my answers."
  },
  {
    "title": "Describe what is happening now",
    "mission": "Look around and describe two actions happening right now.",
    "tense": "present-continuous",
    "tab": "examples",
    "questions": [
      {
        "prompt": "Listen! The baby ___.",
        "choices": [
          "cries every day",
          "is crying",
          "cry"
        ],
        "answer": 1,
        "explanation": "Is + crying describes what is happening now."
      }
    ],
    "tutorPrompt": "Please help me practice this English mission: Look around and describe two actions happening right now. Ask me one short question at a time. Give brief, specific feedback based only on my answers."
  },
  {
    "title": "A short conversation",
    "mission": "Tell the tutor about your usual day and what you are doing now. Ask one question back.",
    "tense": "present-simple",
    "tab": "practice",
    "questions": [
      {
        "prompt": "Which sentence describes a habit?",
        "choices": [
          "I am walking right now.",
          "I walk to work every day.",
          "I am walking at this moment."
        ],
        "answer": 1,
        "explanation": "Every day signals a repeated routine."
      }
    ],
    "tutorPrompt": "Please help me practice this English mission: Tell the tutor about your usual day and what you are doing now. Ask one question back. Ask me one short question at a time. Give brief, specific feedback based only on my answers."
  },
  {
    "title": "See what you learned",
    "mission": "Answer three new questions about the same skills. Then write your routine again and compare your two samples.",
    "tense": "present-simple",
    "tab": "practice",
    "questions": [
      {
        "prompt": "I ___ English every evening.",
        "choices": [
          "studies",
          "study",
          "studying"
        ],
        "answer": 1,
        "explanation": "Use the base verb with I for a routine."
      },
      {
        "prompt": "He ___ eat meat.",
        "choices": [
          "doesn’t",
          "don’t",
          "isn’t"
        ],
        "answer": 0,
        "explanation": "Use doesn’t + base verb with he."
      },
      {
        "prompt": "At the moment, we ___ for the bus.",
        "choices": [
          "waits",
          "wait",
          "are waiting"
        ],
        "answer": 2,
        "explanation": "Use are + verb-ing for an action happening now."
      }
    ],
    "tutorPrompt": "Please help me practice this English mission: Answer three new questions about the same skills. Then write your routine again and compare your two samples. Ask me one short question at a time. Give brief, specific feedback based only on my answers."
  }
];
