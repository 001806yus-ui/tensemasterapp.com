import { AnalyzedTenseToken, TextAnalysisResult, CEFRLevel, TenseGroup, TenseAspect } from '../types';
import { ALL_12_TENSES } from '../data/tensesData';

export const SAMPLE_TEXTS = [
  {
    id: 'sample-email',
    title: '💼 Email Profesional de Negocios',
    category: 'Trabajo & Carrera',
    text: `Dear Mr. Henderson,

I hope you are doing well today. I am writing to follow up on our productive discussion from last Tuesday. 

As we agreed during the meeting, our engineering team has been developing the new prototype for the past two weeks. We have already completed the initial architecture, and we tested the database connection yesterday afternoon without any issues. 

Tomorrow morning, Sarah will send you the finalized budget forecast. By the end of this month, we will have delivered the first operational beta version to your stakeholders.

If you have any questions, please let me know. I look forward to hearing your thoughts.

Best regards,
Alexander Wright`
  },
  {
    id: 'sample-story',
    title: '📖 Relato Narrativo en el Pasado',
    category: 'Literatura & Storytelling',
    text: `Last summer, I decided to travel across the Scottish Highlands. The sun was shining brightly when I started my journey, but dark clouds were already gathering on the distant horizon.

While I was walking along the rocky path near Loch Ness, the wind suddenly began to howl. I realized that I had forgotten my waterproof jacket at the mountain lodge. Fortunately, an elderly hiker had noticed my dilemma and kindly offered me his spare umbrella. 

Before the storm intensified, we had reached a small stone cottage. We drank hot tea by the fireplace while the heavy rain was battering the wooden shutters.`
  },
  {
    id: 'sample-future',
    title: '🚀 Visión de Innovación y Futuro',
    category: 'Tecnología & Metas',
    text: `In the coming decade, clean renewable energy will transform urban transportation worldwide. Engineers are currently designing next-generation electric batteries that will charge in under three minutes.

By the year 2035, major cities will have eliminated diesel buses completely. Autonomous electric shuttles will be operating seamlessly across metropolitan routes, and millions of commuters will be traveling with zero carbon emissions. 

We will continue innovating relentlessly until sustainable mobility has become accessible to every citizen on our planet.`
  },
  {
    id: 'sample-daily',
    title: '☕ Conversación Cotidiana y Rutina',
    category: 'Vida Diaria',
    text: `Every morning, I wake up at 7:00 AM and prepare fresh black coffee. I always check my daily schedule before I leave home. 

Currently, I am learning English with TenseMaster because I want to expand my career opportunities. I have practiced for fifteen minutes every single day this month, and my listening comprehension has improved remarkably. 

Later tonight, my friends and I are meeting at our favorite Italian restaurant to celebrate Carlos's birthday.`
  }
];

interface TensePattern {
  tenseId: string;
  tenseName: string;
  spanishName: string;
  aspect: TenseAspect;
  group: TenseGroup;
  cefrLevel: CEFRLevel;
  formula: string;
  regex: RegExp;
  explanation: string;
}

// Patterns ordered carefully from more specific (compound/continuous) to simpler forms
const TENSE_PATTERNS: TensePattern[] = [
  // 1. Future Perfect Continuous: will/won't have been + V-ing
  {
    tenseId: 'future-perfect-continuous',
    tenseName: 'Future Perfect Continuous',
    spanishName: 'Futuro Perfecto Continuo',
    aspect: 'perfect-continuous',
    group: 'future',
    cefrLevel: 'C1',
    formula: 'will have been + Verb(-ing)',
    regex: /\b(?:will|won't|shall|'ll)\s+(?:not\s+)?have\s+been\s+\w+ing\b/gi,
    explanation: 'Expresa una acción continua que se habrá estado desarrollando hasta un momento determinado del futuro.'
  },
  // 2. Past Perfect Continuous: had/hadn't been + V-ing
  {
    tenseId: 'past-perfect-continuous',
    tenseName: 'Past Perfect Continuous',
    spanishName: 'Pasado Perfecto Continuo',
    aspect: 'perfect-continuous',
    group: 'past',
    cefrLevel: 'B2',
    formula: 'had been + Verb(-ing)',
    regex: /\b(?:had|hadn't|'d)\s+(?:not\s+)?been\s+\w+ing\b/gi,
    explanation: 'Acción continua que se estuvo realizando en el pasado antes de que ocurriera otra acción puntual.'
  },
  // 3. Present Perfect Continuous: have/has been + V-ing
  {
    tenseId: 'present-perfect-continuous',
    tenseName: 'Present Perfect Continuous',
    spanishName: 'Presente Perfecto Continuo',
    aspect: 'perfect-continuous',
    group: 'present',
    cefrLevel: 'B1',
    formula: 'have/has been + Verb(-ing)',
    regex: /\b(?:have|has|haven't|hasn't|'ve|'s)\s+(?:not\s+)?been\s+\w+ing\b/gi,
    explanation: 'Acción que comenzó en el pasado y ha continuado ininterrumpidamente hasta el presente con impacto visible.'
  },
  // 4. Future Perfect: will/won't have + V3 (participle)
  {
    tenseId: 'future-perfect',
    tenseName: 'Future Perfect',
    spanishName: 'Futuro Perfecto',
    aspect: 'perfect',
    group: 'future',
    cefrLevel: 'B2',
    formula: 'will have + Verb(Participio / -ed)',
    regex: /\b(?:will|won't|'ll)\s+(?:not\s+)?have\s+(?:delivered|completed|finished|reached|achieved|graduated|done|seen|gone|made|written|worked|become|taken|spoken|found|built|left|bought|understood|\w+ed)\b/gi,
    explanation: 'Acción que habrá sido completada antes de una fecha o evento futuro específico (señal clave: "By the end of...").'
  },
  // 5. Future Continuous: will/won't be + V-ing
  {
    tenseId: 'future-continuous',
    tenseName: 'Future Continuous',
    spanishName: 'Futuro Continuo',
    aspect: 'continuous',
    group: 'future',
    cefrLevel: 'B1',
    formula: 'will be + Verb(-ing)',
    regex: /\b(?:will|won't|'ll)\s+(?:not\s+)?be\s+\w+ing\b/gi,
    explanation: 'Acción que estará en pleno desarrollo y transcurso en un momento específico en el futuro.'
  },
  // 6. Past Perfect: had/hadn't + V3 (participle)
  {
    tenseId: 'past-perfect',
    tenseName: 'Past Perfect',
    spanishName: 'Pasado Perfecto',
    aspect: 'perfect',
    group: 'past',
    cefrLevel: 'B1',
    formula: 'had + Verb(Participio / -ed)',
    regex: /\b(?:had|hadn't|'d)(?:\s+already|\s+just|\s+never|\s+ever|\s+not)?\s+(?:forgotten|reached|noticed|seen|gone|done|eaten|known|worked|lived|finished|started|arrived|left|taken|spoken|written|met|heard|felt|bought|built|\w+ed)\b/gi,
    explanation: 'El "pasado del pasado": acción que ocurrió antes de otro acontecimiento en el pasado.'
  },
  // 7. Present Perfect: have/has + V3 (participle)
  {
    tenseId: 'present-perfect',
    tenseName: 'Present Perfect',
    spanishName: 'Presente Perfecto',
    aspect: 'perfect',
    group: 'present',
    cefrLevel: 'A2',
    formula: 'have/has + Verb(Participio / -ed)',
    regex: /\b(?:have|has|haven't|hasn't|'ve|'s)(?:\s+already|\s+just|\s+never|\s+ever|\s+not|\s+always)?\s+(?:completed|practiced|improved|lived|worked|seen|done|been|gone|taken|written|spoken|found|made|become|eaten|drank|bought|felt|heard|learned|learnt|met|lost|read|understood|known|\w+ed)\b/gi,
    explanation: 'Conecta una experiencia pasada con el momento presente o señala una acción no terminada.'
  },
  // 8. Past Continuous: was/were + V-ing
  {
    tenseId: 'past-continuous',
    tenseName: 'Past Continuous',
    spanishName: 'Pasado Continuo',
    aspect: 'continuous',
    group: 'past',
    cefrLevel: 'A2',
    formula: 'was/were + Verb(-ing)',
    regex: /\b(?:was|were|wasn't|weren't)\s+(?:not\s+)?(?:\s+always|\s+still|\s+already)?\s*\w+ing\b/gi,
    explanation: 'Acción que estaba en progreso durante un instante del pasado, a menudo interrumpida por otra acción puntual.'
  },
  // 9. Present Continuous: am/is/are + V-ing
  {
    tenseId: 'present-continuous',
    tenseName: 'Present Continuous',
    spanishName: 'Presente Continuo',
    aspect: 'continuous',
    group: 'present',
    cefrLevel: 'A1',
    formula: 'am/is/are + Verb(-ing)',
    regex: /\b(?:am|is|are|isn't|aren't|'m|'s|'re)\s+(?:not\s+)?(?:\s+currently|\s+now|\s+still|\s+always)?\s*\w+ing\b/gi,
    explanation: 'Acción que está ocurriendo justo ahora o un plan personal agendado para el futuro cercano.'
  },
  // 10. Future Simple: will/won't + base verb
  {
    tenseId: 'future-simple',
    tenseName: 'Future Simple',
    spanishName: 'Futuro Simple',
    aspect: 'simple',
    group: 'future',
    cefrLevel: 'A1',
    formula: 'will + Verbo Base',
    regex: /\b(?:will|won't|'ll)\s+(?:not\s+)?(?:\s+always|\s+probably|\s+definitely)?\s*(?:send|transform|charge|continue|help|call|go|do|make|see|tell|meet|arrive|start|buy|give|work|study|learn|travel|stay|come|take|get|know|think|look|find|talk|listen|watch|read|write|\w+)\b/gi,
    explanation: 'Predicciones, promesas, ofertas o decisiones espontáneas tomadas en el momento de hablar.'
  },
  // 11. Past Simple: regular -ed & common irregular past forms
  {
    tenseId: 'past-simple',
    tenseName: 'Past Simple',
    spanishName: 'Pasado Simple',
    aspect: 'simple',
    group: 'past',
    cefrLevel: 'A1',
    formula: 'Subject + Verb(-ed / Irregular V2)',
    regex: /\b(?:didn't\s+\w+|decided|started|began|realized|offered|drank|went|saw|spoke|bought|made|took|wrote|felt|thought|knew|told|tested|agreed|called|wanted|needed|liked|lived|worked|arrived|closed|opened|watched|played|walked|talked|listened|studied|asked|helped|visited|used|followed|happened|stopped|moved|stayed|left|met|lost|heard|found|ran|stood|sat|read|understood|became|built|spent|brought|paid|gave|got|came|said)\b/gi,
    explanation: 'Acción completada y concluida en un momento determinado del pasado.'
  },
  // 12. Present Simple: base verbs, 3rd person -s, don't/doesn't
  {
    tenseId: 'present-simple',
    tenseName: 'Present Simple',
    spanishName: 'Presente Simple',
    aspect: 'simple',
    group: 'present',
    cefrLevel: 'A1',
    formula: 'Subject + Verb(Base / -s)',
    regex: /\b(?:don't\s+\w+|doesn't\s+\w+|wake\s+up|prepare|check|leave|want|wants|know|knows|hope|hopes|look\s+forward|likes|plays|works|studies|drinks|eats|lives|travels|reads|writes|understands|speaks|teaches|learns|comes|goes|makes|takes|sees|gives|gets|feels|thinks)\b/gi,
    explanation: 'Verdades permanentes, hechos científicos, hábitos diarios y rutinas establecidas.'
  }
];

export function analyzeEnglishText(rawText: string): TextAnalysisResult {
  if (!rawText.trim()) {
    return {
      totalWords: 0,
      totalSentences: 0,
      analyzedTokens: [],
      tensesFoundCounts: {},
      estimatedCEFR: 'A1',
      tenseVarietyScore: 0,
      feedbackTips: ['Escribe o pega un texto en inglés para comenzar el análisis gramatical.'],
      passiveVoiceCount: 0
    };
  }

  const words = rawText.trim().split(/\s+/).filter(Boolean);
  const sentences = rawText.split(/[.!?]+/).filter((s) => s.trim().length > 0);

  const analyzedTokens: AnalyzedTenseToken[] = [];
  const occupiedRanges: [number, number][] = [];

  // Detect matches
  for (const pattern of TENSE_PATTERNS) {
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    let match: RegExpExecArray | null;

    while ((match = regex.exec(rawText)) !== null) {
      const startIndex = match.index;
      const matchedString = match[0];
      const endIndex = startIndex + matchedString.length;

      // Check if overlaps with an already identified (more specific) token
      const isOverlapping = occupiedRanges.some(
        ([s, e]) => (startIndex >= s && startIndex < e) || (endIndex > s && endIndex <= e)
      );

      if (!isOverlapping) {
        occupiedRanges.push([startIndex, endIndex]);
        analyzedTokens.push({
          id: `token-${startIndex}-${endIndex}`,
          matchedText: matchedString,
          startIndex,
          endIndex,
          tenseId: pattern.tenseId,
          tenseName: pattern.tenseName,
          spanishName: pattern.spanishName,
          aspect: pattern.aspect,
          group: pattern.group,
          cefrLevel: pattern.cefrLevel,
          explanation: pattern.explanation,
          formula: pattern.formula
        });
      }
    }
  }

  // Sort tokens by their appearance in the text
  analyzedTokens.sort((a, b) => a.startIndex - b.startIndex);

  // Count tenses
  const tensesFoundCounts: Record<string, number> = {};
  analyzedTokens.forEach((token) => {
    tensesFoundCounts[token.tenseName] = (tensesFoundCounts[token.tenseName] || 0) + 1;
  });

  // Calculate passive voice instances (e.g. was delivered, is designed, has been completed)
  const passiveRegex = /\b(?:is|are|was|were|been|being)\s+(?:delivered|designed|created|built|written|made|tested|completed|eliminated)\b/gi;
  const passiveMatches = rawText.match(passiveRegex);
  const passiveVoiceCount = passiveMatches ? passiveMatches.length : 0;

  // Calculate variety score & CEFR estimation
  const uniqueTenses = Object.keys(tensesFoundCounts).length;
  const tenseVarietyScore = Math.min(100, Math.round((uniqueTenses / 6) * 100));

  let estimatedCEFR: CEFRLevel = 'A1';
  const hasC1 = analyzedTokens.some((t) => t.cefrLevel === 'C1');
  const hasB2 = analyzedTokens.some((t) => t.cefrLevel === 'B2');
  const hasB1 = analyzedTokens.some((t) => t.cefrLevel === 'B1');
  const hasA2 = analyzedTokens.some((t) => t.cefrLevel === 'A2');

  if (hasC1 && uniqueTenses >= 4) {
    estimatedCEFR = 'C1';
  } else if (hasB2 || uniqueTenses >= 4) {
    estimatedCEFR = 'B2';
  } else if (hasB1 || uniqueTenses >= 3) {
    estimatedCEFR = 'B1';
  } else if (hasA2 || uniqueTenses >= 2) {
    estimatedCEFR = 'A2';
  }

  // Generate personalized pedagogical tips
  const feedbackTips: string[] = [];

  if (uniqueTenses >= 4) {
    feedbackTips.push('🌟 Excelente riqueza verbal: Utilizas una amplia gama de tiempos verbales con fluidez narrativa.');
  } else if (uniqueTenses === 1) {
    feedbackTips.push('💡 Monotonía temporal: El texto depende casi exclusivamente de un solo tiempo. Intenta alternar con otros aspectos temporales.');
  }

  if (tensesFoundCounts['Present Perfect'] || tensesFoundCounts['Present Perfect Continuous']) {
    feedbackTips.push('✅ Buen dominio del Present Perfect: Vincula adecuadamente experiencias previas con el presente.');
  }

  if (tensesFoundCounts['Past Perfect'] && tensesFoundCounts['Past Simple']) {
    feedbackTips.push('🎯 Precisión cronológica: Has coordinado con éxito acciones anteriores y posteriores en el pasado (Past Perfect + Past Simple).');
  }

  if (passiveVoiceCount > 0) {
    feedbackTips.push(`📌 Voz Pasiva detectada (${passiveVoiceCount} casos): Aporta formalidad y estilo periodístico/académico al texto.`);
  }

  if (feedbackTips.length === 0) {
    feedbackTips.push('👍 Estructura gramatical coherente. Continúa practicando añadiendo conectores temporales (e.g., "by then", "meanwhile", "since").');
  }

  return {
    totalWords: words.length,
    totalSentences: Math.max(1, sentences.length),
    analyzedTokens,
    tensesFoundCounts,
    estimatedCEFR,
    tenseVarietyScore,
    feedbackTips,
    passiveVoiceCount
  };
}
