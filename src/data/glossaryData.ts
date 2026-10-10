import { SupportedLanguage } from '../i18n/translations';

export interface GlossaryEntry {
  word: string;
  lemma: string; // root form (e.g., "eaten" -> "eat")
  category: 'verb' | 'auxiliary' | 'time-marker' | 'noun' | 'adjective' | 'expression';
  phonetic: string;
  translations: Partial<Record<SupportedLanguage, string>> & { es: string; [key: string]: string | undefined };
  grammarNote: Partial<Record<SupportedLanguage, string>> & { es: string; [key: string]: string | undefined };
  conjugations?: {
    base: string;
    past: string;
    participle: string;
  };
}

export const VOCABULARY_GLOSSARY: Record<string, GlossaryEntry> = {
  // Common auxiliaries
  'do': {
    word: 'do',
    lemma: 'do',
    category: 'auxiliary',
    phonetic: '/duː/',
    translations: { es: 'hacer / auxiliar de presente', pt: 'fazer / auxiliar do presente', fr: 'faire / auxiliaire du présent', it: 'fare / ausiliare del presente', de: 'tun / Gegenwarts-Hilfsverb' },
    grammarNote: { es: 'Auxiliar interrogativo y negativo para I, you, we, they en presente simple.', pt: 'Auxiliar para I, you, we, they no presente simples.', fr: 'Auxiliaire pour I, you, we, they au présent simple.', it: 'Ausiliare per I, you, we, they al presente semplice.', de: 'Hilfsverb für I, you, we, they im Simple Present.' }
  },
  'does': {
    word: 'does',
    lemma: 'do',
    category: 'auxiliary',
    phonetic: '/dʌz/',
    translations: { es: 'hacer (3ra persona he/she/it)', pt: 'fazer (3ª pessoa he/she/it)', fr: 'faire (3e personne he/she/it)', it: 'fare (3ª persona he/she/it)', de: 'tut (3. Person he/she/it)' },
    grammarNote: { es: 'Auxiliar de 3ra persona singular (he, she, it) en presente simple.', pt: 'Auxiliar da 3ª pessoa do singular no presente.', fr: 'Auxiliaire de 3e personne du singulier au présent.', it: 'Ausiliare della 3ª persona singolare al presente.', de: 'Hilfsverb der 3. Person Singular im Präsens.' }
  },
  'did': {
    word: 'did',
    lemma: 'do',
    category: 'auxiliary',
    phonetic: '/dɪd/',
    translations: { es: 'hizo / auxiliar de pasado', pt: 'fez / auxiliar do passado', fr: 'a fait / auxiliaire du passé', it: 'ha fatto / ausiliare del passato', de: 'tat / Vergangenheits-Hilfsverb' },
    grammarNote: { es: 'Auxiliar del pasado simple para todas las personas.', pt: 'Auxiliar do passado simples para todas as pessoas.', fr: 'Auxiliaire du passé simple pour tous les pronoms.', it: 'Ausiliare del passato semplice per tutti i pronomi.', de: 'Hilfsverb des Simple Past für alle Personen.' },
    conjugations: { base: 'do', past: 'did', participle: 'done' }
  },
  'have': {
    word: 'have',
    lemma: 'have',
    category: 'auxiliary',
    phonetic: '/hæv/',
    translations: { es: 'haber / tener', pt: 'haver / ter', fr: 'avoir / posséder', it: 'avere', de: 'haben' },
    grammarNote: { es: 'Auxiliar fundamental para tiempos perfectos (have + participio).', pt: 'Auxiliar essencial para tempos perfeitos.', fr: 'Auxiliaire des temps parfaits.', it: 'Ausiliare per i tempi perfetti.', de: 'Hilfsverb für Perfekt-Zeitformen.' },
    conjugations: { base: 'have', past: 'had', participle: 'had' }
  },
  'has': {
    word: 'has',
    lemma: 'have',
    category: 'auxiliary',
    phonetic: '/hæz/',
    translations: { es: 'ha (3ra persona) / tiene', pt: 'tem / há (3ª pessoa)', fr: 'a (3e personne)', it: 'ha (3ª persona)', de: 'hat (3. Person)' },
    grammarNote: { es: 'Forma de "have" para he, she, it en presente perfecto.', pt: 'Forma de "have" para he, she, it no presente perfeito.', fr: 'Forme de "have" pour he, she, it.', it: 'Forma di "have" per he, she, it.', de: 'Form von "have" für he, she, it.' }
  },
  'had': {
    word: 'had',
    lemma: 'have',
    category: 'auxiliary',
    phonetic: '/hæd/',
    translations: { es: 'había / tuvo', pt: 'havia / tinha', fr: 'avait / a eu', it: 'aveva / ha avuto', de: 'hatte' },
    grammarNote: { es: 'Auxiliar universal del Past Perfect (had + participio).', pt: 'Auxiliar do Past Perfect para todas as pessoas.', fr: 'Auxiliaire du Past Perfect.', it: 'Ausiliare del Past Perfect.', de: 'Hilfsverb des Past Perfect.' }
  },
  'been': {
    word: 'been',
    lemma: 'be',
    category: 'auxiliary',
    phonetic: '/biːn/',
    translations: { es: 'sido / estado (participio)', pt: 'sido / estado', fr: 'été', it: 'stato', de: 'gewesen' },
    grammarNote: { es: 'Participio de to be. Crucial en todos los tiempos continuos perfectos.', pt: 'Particípio de to be.', fr: 'Participe passé du verbe être.', it: 'Participio passato del verbo essere.', de: 'Partizip von to be.' },
    conjugations: { base: 'be', past: 'was/were', participle: 'been' }
  },
  'will': {
    word: 'will',
    lemma: 'will',
    category: 'auxiliary',
    phonetic: '/wɪl/',
    translations: { es: 'auxiliar de futuro', pt: 'auxiliar de futuro', fr: 'auxiliaire du futur', it: 'ausiliare del futuro', de: 'wird (Zukunfts-Hilfsverb)' },
    grammarNote: { es: 'Verbo modal para decisiones espontáneas y promesas futuras.', pt: 'Verbo modal para decisões e previsões futuras.', fr: 'Auxiliaire modal pour le futur.', it: 'Modale per il futuro.', de: 'Modalverb für das Futur.' }
  },

  // Key verbs with irregulars
  'eat': {
    word: 'eat',
    lemma: 'eat',
    category: 'verb',
    phonetic: '/iːt/',
    translations: { es: 'comer', pt: 'comer', fr: 'manger', it: 'mangiare', de: 'essen' },
    grammarNote: { es: 'Verbo irregular muy frecuente.', pt: 'Verbo irregular frequente.', fr: 'Verbe irrégulier fréquent.', it: 'Verbo irregolare comune.', de: 'Häufiges unregelmäßiges Verb.' },
    conjugations: { base: 'eat', past: 'ate', participle: 'eaten' }
  },
  'ate': {
    word: 'ate',
    lemma: 'eat',
    category: 'verb',
    phonetic: '/eɪt/',
    translations: { es: 'comí / comió (pasado)', pt: 'comi / comeu', fr: 'a mangé (passé)', it: 'ha mangiato', de: 'aß' },
    grammarNote: { es: 'Pasado simple de eat.', pt: 'Passado simples de eat.', fr: 'Passé simple de eat.', it: 'Passato semplice di eat.', de: 'Simple Past von eat.' },
    conjugations: { base: 'eat', past: 'ate', participle: 'eaten' }
  },
  'eaten': {
    word: 'eaten',
    lemma: 'eat',
    category: 'verb',
    phonetic: '/ˈiːtən/',
    translations: { es: 'comido (participio)', pt: 'comido (particípio)', fr: 'mangé (participe)', it: 'mangiato (participio)', de: 'gegessen' },
    grammarNote: { es: 'Participio pasado de eat (usado con have/has/had).', pt: 'Particípio passado de eat.', fr: 'Participe passé de eat.', it: 'Participio passato di eat.', de: 'Partizip II von eat.' },
    conjugations: { base: 'eat', past: 'ate', participle: 'eaten' }
  },
  'live': {
    word: 'live',
    lemma: 'live',
    category: 'verb',
    phonetic: '/lɪv/',
    translations: { es: 'vivir', pt: 'viver / morar', fr: 'vivre / habiter', it: 'vivere / abitare', de: 'wohnen / leben' },
    grammarNote: { es: 'Verbo regular (live -> lived -> lived).', pt: 'Verbo regular.', fr: 'Verbe régulier.', it: 'Verbo regolare.', de: 'Regelmäßiges Verb.' },
    conjugations: { base: 'live', past: 'lived', participle: 'lived' }
  },
  'work': {
    word: 'work',
    lemma: 'work',
    category: 'verb',
    phonetic: '/wɜːrk/',
    translations: { es: 'trabajar', pt: 'trabalhar', fr: 'travailler', it: 'lavorare', de: 'arbeiten' },
    grammarNote: { es: 'Verbo regular (work -> worked -> worked).', pt: 'Verbo regular.', fr: 'Verbe régulier.', it: 'Verbo regolare.', de: 'Regelmäßiges Verb.' },
    conjugations: { base: 'work', past: 'worked', participle: 'worked' }
  },
  'see': {
    word: 'see',
    lemma: 'see',
    category: 'verb',
    phonetic: '/siː/',
    translations: { es: 'ver', pt: 'ver', fr: 'voir', it: 'vedere', de: 'sehen' },
    grammarNote: { es: 'Verbo irregular de percepción.', pt: 'Verbo irregular de percepção.', fr: 'Verbe irrégulier.', it: 'Verbo irregolare.', de: 'Unregelmäßiges Verb.' },
    conjugations: { base: 'see', past: 'saw', participle: 'seen' }
  },
  'saw': {
    word: 'saw',
    lemma: 'see',
    category: 'verb',
    phonetic: '/sɔː/',
    translations: { es: 'vi / vio (pasado)', pt: 'vi / viu', fr: 'ai vu / a vu', it: 'ha visto', de: 'sah' },
    grammarNote: { es: 'Pasado simple de see.', pt: 'Passado simples de see.', fr: 'Passé de see.', it: 'Passato di see.', de: 'Simple Past von see.' },
    conjugations: { base: 'see', past: 'saw', participle: 'seen' }
  },
  'seen': {
    word: 'seen',
    lemma: 'see',
    category: 'verb',
    phonetic: '/siːn/',
    translations: { es: 'visto (participio)', pt: 'visto', fr: 'vu', it: 'visto', de: 'gesehen' },
    grammarNote: { es: 'Participio de see.', pt: 'Particípio de see.', fr: 'Participe passé de see.', it: 'Participio di see.', de: 'Partizip II von see.' },
    conjugations: { base: 'see', past: 'saw', participle: 'seen' }
  },

  // Crucial Signal Words
  'since': {
    word: 'since',
    lemma: 'since',
    category: 'time-marker',
    phonetic: '/sɪns/',
    translations: { es: 'desde (punto de inicio)', pt: 'desde', fr: 'depuis (point de départ)', it: 'da / fin da', de: 'seit (Zeitpunkt)' },
    grammarNote: { es: 'Se usa con Present Perfect para señalar el momento exacto en que empezó una acción (since 2018, since Monday).', pt: 'Usado para marcar o ponto de início.', fr: 'Indique le point de départ d’une action.', it: 'Indica il punto di partenza nel tempo.', de: 'Gibt den Startzeitpunkt an.' }
  },
  'for': {
    word: 'for',
    lemma: 'for',
    category: 'time-marker',
    phonetic: '/fɔːr/',
    translations: { es: 'durante / por (duración)', pt: 'por / durante', fr: 'pendant / depuis (durée)', it: 'per (durata)', de: 'seit / während (Zeitdauer)' },
    grammarNote: { es: 'Indica la duración acumulada de tiempo (for 3 years, for 2 hours).', pt: 'Indica a duração de tempo acumulada.', fr: 'Exprime une durée cumulée.', it: 'Esprime una durata cumulativa.', de: 'Gibt eine Zeitspanne an.' }
  },
  'already': {
    word: 'already',
    lemma: 'already',
    category: 'time-marker',
    phonetic: '/ɔːlˈredi/',
    translations: { es: 'ya (antes de lo previsto)', pt: 'já', fr: 'déjà', it: 'già', de: 'bereits / schon' },
    grammarNote: { es: 'Va entre el auxiliar y el participio: "I have already eaten".', pt: 'Coloca-se entre o auxiliar e o verbo principal.', fr: 'Se place entre l’auxiliaire et le participe.', it: 'Si posiziona tra l’ausiliare e il participio.', de: 'Steht zwischen Hilfsverb und Partizip.' }
  },
  'yet': {
    word: 'yet',
    lemma: 'yet',
    category: 'time-marker',
    phonetic: '/jet/',
    translations: { es: 'aún / todavía (al final)', pt: 'ainda (no final)', fr: 'encore / déjà (en fin)', it: 'ancora (a fine frase)', de: 'noch (am Satzende)' },
    grammarNote: { es: 'Se coloca al final de oraciones negativas o preguntas.', pt: 'Usado no final de negações e perguntas.', fr: 'Placé en fin de phrase négative ou interrogative.', it: 'Posto alla fine di frasi negative o interrogative.', de: 'Steht am Ende negativer Sätze oder Fragen.' }
  },
  'just': {
    word: 'just',
    lemma: 'just',
    category: 'time-marker',
    phonetic: '/dʒʌst/',
    translations: { es: 'acabar de (hace unos instantes)', pt: 'acabar de', fr: 'venir de (à l’instant)', it: 'appena', de: 'gerade eben' },
    grammarNote: { es: 'Indica que la acción concluyó hace escasos minutos: "I have just arrived".', pt: 'Ação terminada há poucos minutos.', fr: 'Action achevée il y a quelques instants.', it: 'Azione conclusa pochi istanti fa.', de: 'Aktion gerade eben beendet.' }
  },
  'ever': {
    word: 'ever',
    lemma: 'ever',
    category: 'time-marker',
    phonetic: '/ˈevər/',
    translations: { es: 'alguna vez en la vida', pt: 'alguma vez na vida', fr: 'jamais / déjà dans sa vie', it: 'mai (nella vita)', de: 'jemals' },
    grammarNote: { es: 'Típico en preguntas de experiencia con Present Perfect: "Have you ever been to Paris?".', pt: 'Usado em perguntas de experiências de vida.', fr: 'Utilisé pour les questions d’expérience de vie.', it: 'Tipico delle domande sulle esperienze.', de: 'Klassisch bei Fragen nach Lebenserfahrungen.' }
  },
  'never': {
    word: 'never',
    lemma: 'never',
    category: 'time-marker',
    phonetic: '/ˈnevər/',
    translations: { es: 'nunca / jamás', pt: 'nunca / jamais', fr: 'jamais', it: 'mai', de: 'nie / niemals' },
    grammarNote: { es: 'Adverbio negativo. Como ya es negativo, el verbo va en forma afirmativa.', pt: 'Advérbio negativo.', fr: 'Adverbe négatif.', it: 'Avverbio negativo.', de: 'Negationsadverb.' }
  },
  'by the time': {
    word: 'by the time',
    lemma: 'by the time',
    category: 'time-marker',
    phonetic: '/baɪ ðə taɪm/',
    translations: { es: 'para cuando / cuando llegue el momento', pt: 'no momento em que', fr: 'au moment où / d’ici à ce que', it: 'nel momento in cui', de: 'zu dem Zeitpunkt, als / bis' },
    grammarNote: { es: 'Compañero clásico de tiempos perfectos: Past Perfect y Future Perfect.', pt: 'Companheiro dos tempos perfeitos.', fr: 'Marqueur des temps parfaits.', it: 'Tipico dei tempi perfetti.', de: 'Signal für vollendete Zeitformen.' }
  }
};

export const lookupWordInGlossary = (rawWord: string): GlossaryEntry | null => {
  const clean = rawWord.toLowerCase().replace(/[^a-z\s]/g, '').trim();
  if (!clean) return null;

  // Direct lookup
  if (VOCABULARY_GLOSSARY[clean]) {
    return VOCABULARY_GLOSSARY[clean];
  }

  // Remove trailing s/es/ed/ing to find base lemma
  const singular = clean.replace(/(?:ing|ed|es|s)$/, '');
  if (VOCABULARY_GLOSSARY[singular]) {
    return VOCABULARY_GLOSSARY[singular];
  }

  // Find if it matches a past or participle conjugation in any entry
  const matchedConjugation = Object.values(VOCABULARY_GLOSSARY).find(
    (e) =>
      e.conjugations?.past.toLowerCase() === clean ||
      e.conjugations?.participle.toLowerCase() === clean
  );

  return matchedConjugation || null;
};
