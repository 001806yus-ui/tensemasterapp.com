import { GoogleGenAI, Type } from '@google/genai';

// Vercel Serverless Function handler for /api/chat
export default async function handler(req: any, res: any) {
  // Enable CORS if accessed across domains
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const {
      message,
      history = [],
      level = 'intermediate',
      topic = 'general',
      nativeLanguage = 'es',
    } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured in Vercel environment variables.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `You are "TenseMaster AI Coach", an empathetic, expert native English conversation tutor for students whose native language is ${nativeLanguage}.
Your core mission is twofold:
1. Maintain an engaging, realistic, and natural conversation in English tailored to the student's level (${level}) on the chosen topic ("${topic}").
   - Beginner: Simple sentences, vocabulary focused on basic tenses (Present Simple, Past Simple, Future with will/going to).
   - Intermediate: Natural conversational pace, compound sentences, perfect tenses (Present Perfect, Past Continuous, Modal verbs).
   - Advanced: Nuanced vocabulary, idioms, complex tenses (Past Perfect Continuous, Future Perfect, Conditionals, Subjunctive).
2. Provide immediate, constructive, friendly pedagogical feedback on the user's English response:
   - Identify whether the user made any grammatical, tense, preposition, or vocabulary errors.
   - If there are errors, provide:
     a) Exactly what was wrong and why (explanation in Spanish / native language ${nativeLanguage} so they understand clearly).
     b) The corrected version of their sentence in English.
     c) Which verb tense or grammatical rule is involved (e.g., "Present Perfect vs. Past Simple", "Third-person singular -s", "Irregular verb past form").
   - If their sentence was completely correct, give enthusiastic praise and optionally suggest a more natural/native phrasing or an advanced idiom.
3. Continue the conversation in English by answering what the user said and asking a follow-up question to keep the dialogue flowing.

Always respond in strictly formatted JSON adhering to the provided schema.`;

    const conversationContext = history
      .slice(-8)
      .map((h: { sender: string; text: string }) => `${h.sender === 'user' ? 'Student' : 'Tutor'}: ${h.text}`)
      .join('\n');

    const prompt = `Context of past messages:
${conversationContext ? conversationContext : '(Beginning of conversation)'}

Student's new message:
"${message}"

Evaluate the student's message, provide corrective feedback, and continue the conversation as the tutor.`;

    let responseText: string | null = null;
    const candidateModels = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-3.1-flash-lite'];

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                replyEnglish: {
                  type: Type.STRING,
                  description: 'The natural conversational response in English continuing the dialogue, followed by an open-ended question.',
                },
                replyTranslation: {
                  type: Type.STRING,
                  description: 'The translation of replyEnglish into the user native language (Spanish) for comprehension help.',
                },
                hasErrors: {
                  type: Type.BOOLEAN,
                  description: 'True if the user sentence had grammatical, tense, or spelling mistakes; false if it was grammatically correct.',
                },
                feedbackSummary: {
                  type: Type.STRING,
                  description: 'Friendly summary in the native language (Spanish) highlighting what was great or what needs tweaking.',
                },
                correctedSentence: {
                  type: Type.STRING,
                  description: 'The corrected version of the user sentence in English, or empty string if already correct.',
                },
                explanation: {
                  type: Type.STRING,
                  description: 'Clear pedagogical explanation in Spanish of the grammatical rule, verb tense distinction, or error.',
                },
                detectedTenses: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'List of English tenses used or attempted in the user sentence (e.g. ["Past Simple", "Present Perfect"]).',
                },
                betterAlternative: {
                  type: Type.STRING,
                  description: 'A more natural native speaker alternative phrasing or idiom.',
                },
                suggestedReplies: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '2 to 3 suggested quick English response ideas the user can choose to reply next.',
                },
              },
              required: [
                'replyEnglish',
                'replyTranslation',
                'hasErrors',
                'feedbackSummary',
                'detectedTenses',
                'suggestedReplies',
              ],
            },
          },
        });

        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (genError: any) {
        console.warn(`Model ${modelName} failed, trying next...`, genError?.message);
      }
    }

    if (!responseText) {
      throw new Error('All model candidates are busy. Please try again.');
    }

    const parsed = JSON.parse(responseText);
    return res.status(200).json(parsed);
  } catch (error: any) {
    console.error('Error in /api/chat handler:', error);
    return res.status(500).json({
      error: 'Failed to process chat message',
      details: error.message || 'Unknown error',
    });
  }
}
