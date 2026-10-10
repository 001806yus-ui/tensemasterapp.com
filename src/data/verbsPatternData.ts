import { VerbPatternItem, VerbPatternGroupId } from '../types';

export interface VerbPatternCategoryMeta {
  id: VerbPatternGroupId;
  title: string;
  shortTitle: string;
  icon: string;
  color: string;
  summary: string;
  formula: string;
  mnemonicRule: string;
}

export const VERB_PATTERN_CATEGORIES: VerbPatternCategoryMeta[] = [
  {
    id: 'untouchables',
    title: '🛡️ Los "Intocables" (V1 = V2 = V3)',
    shortTitle: 'Intocables (V1=V2=V3)',
    icon: '🛡️',
    color: 'emerald',
    summary: 'Verbos que nunca cambian: la misma palabra sirve para presente, pasado y participio.',
    formula: 'V1 = V2 = V3 (Idénticos)',
    mnemonicRule: '¡No te compliques! Si es un verbo corto como cut, put o cost, se queda exactamente igual en los 3 tiempos.'
  },
  {
    id: 'twins',
    title: '👯 Los "Gemelos" (V2 = V3)',
    shortTitle: 'Gemelos (V2=V3)',
    icon: '👯',
    color: 'indigo',
    summary: 'El pasado simple y el participio son exactamente iguales. Si te aprendes uno, ya te sabes los dos.',
    formula: 'V2 = V3 (Pasado = Participio)',
    mnemonicRule: 'Familias de sonido clave: -ought/-aught (bought, thought, caught), terminados en -t (felt, sent) y cambio a -found/-told.'
  },
  {
    id: 'musical',
    title: '🎵 Los "Musicales" (i ➔ a ➔ u)',
    shortTitle: 'Musicales (i ➔ a ➔ u)',
    icon: '🎵',
    color: 'purple',
    summary: 'Siguen un ritmo musical perfecto: la vocal central cambia secuencialmente de "i" a "a" y luego a "u".',
    formula: 'i ➔ a ➔ u (Ritmo pegajoso)',
    mnemonicRule: 'Canta mentalmente: "sing, sang, sung", "drink, drank, drunk", "swim, swam, swum". ¡Es una escala melódica!'
  },
  {
    id: 'royals',
    title: '👑 Los "Regios con -EN" (V3 termina en -en/-n)',
    shortTitle: 'Regios con -EN (V3 -en)',
    icon: '👑',
    color: 'amber',
    summary: 'El participio pasado (V3) siempre se corona agregando la terminación "-en" o "-n".',
    formula: 'V3 termina en "-en" o "-n"',
    mnemonicRule: 'Indispensables para el Present Perfect ("have eaten", "have seen", "have written"). Recuerda la corona "-en".'
  },
  {
    id: 'flyers',
    title: '🦅 Los "Voladores" (-ow/-y ➔ -ew ➔ -own)',
    shortTitle: 'Voladores (-ew ➔ -own)',
    icon: '🦅',
    color: 'sky',
    summary: 'Verbos fluidos donde el pasado cambia a "-ew" y el participio vuela a "-own" o "-awn".',
    formula: '-ow / -y ➔ -ew ➔ -own',
    mnemonicRule: 'Know, knew, known. Grow, grew, grown. Fly, flew, flown. Sienten como una brisa suave en el paladar.'
  },
  {
    id: 'boomerang',
    title: '🪃 Los "Bumerán" (V1 = V3)',
    shortTitle: 'Bumerán (V1 = V3)',
    icon: '🪃',
    color: 'rose',
    summary: 'Verbos donde el participio regresa al punto de partida exacto del infinitivo.',
    formula: 'V1 = V3 (El participio regresa)',
    mnemonicRule: 'Van y vuelven: come ➔ came ➔ come. Become ➔ became ➔ become. Run ➔ ran ➔ run.'
  },
  {
    id: 'regular-rules',
    title: '📐 Regla Secreta de los Regulares (-ED)',
    shortTitle: 'Regulares (-ed real)',
    icon: '📐',
    color: 'teal',
    summary: 'Todos terminan en -ed, pero casi todos los hispanohablantes los pronuncian mal. ¡Aprende el secreto fonético en 1 minuto!',
    formula: 'V2 = V3 = Verbo + "-ed"',
    mnemonicRule: '¿Cuándo se pronuncia "/ɪd/" con sílaba extra? ¡ÚNICAMENTE si el verbo termina en T o D (wanted, needed)! En el resto suena como una simple "t" o "d".'
  }
];

export const VERBS_PATTERN_DATA: VerbPatternItem[] = [
  // 1. LOS INTOCABLES (V1 = V2 = V3)
  {
    id: 'v-cut',
    base: 'cut',
    past: 'cut',
    participle: 'cut',
    spanish: 'cortar',
    phonetic: '/kʌt/ - /kʌt/ - /kʌt/',
    patternGroup: 'untouchables',
    patternName: 'Los Intocables',
    trickTip: 'Idéntico en los 3 tiempos. No agregues "-ed".',
    example: {
      sentence: 'I cut the paper today, I cut it yesterday, and I have cut it many times.',
      translation: 'Corto el papel hoy, lo corté ayer y lo he cortado muchas veces.'
    },
    level: 'A1'
  },
  {
    id: 'v-put',
    base: 'put',
    past: 'put',
    participle: 'put',
    spanish: 'poner / colocar',
    phonetic: '/pʊt/ - /pʊt/ - /pʊt/',
    patternGroup: 'untouchables',
    patternName: 'Los Intocables',
    trickTip: 'Permanece igual siempre. Jamás digas "putted".',
    example: {
      sentence: 'She put the keys on the counter yesterday.',
      translation: 'Ella puso las llaves sobre el mostrador ayer.'
    },
    level: 'A1'
  },
  {
    id: 'v-cost',
    base: 'cost',
    past: 'cost',
    participle: 'cost',
    spanish: 'costar / valer',
    phonetic: '/kɒst/ - /kɒst/ - /kɒst/',
    patternGroup: 'untouchables',
    patternName: 'Los Intocables',
    trickTip: 'El pasado de "cuesta $10" es "costó $10": "It cost $10".',
    example: {
      sentence: 'My flight to Madrid cost $300 last month.',
      translation: 'Mi vuelo a Madrid costó $300 el mes pasado.'
    },
    level: 'A1'
  },
  {
    id: 'v-let',
    base: 'let',
    past: 'let',
    participle: 'let',
    spanish: 'permitir / dejar',
    phonetic: '/lɛt/ - /lɛt/ - /lɛt/',
    patternGroup: 'untouchables',
    patternName: 'Los Intocables',
    trickTip: 'Invariable: "He let me go" (Él me dejó ir).',
    example: {
      sentence: 'They have let us enter without tickets.',
      translation: 'Nos han permitido entrar sin entradas.'
    },
    level: 'A2'
  },
  {
    id: 'v-hit',
    base: 'hit',
    past: 'hit',
    participle: 'hit',
    spanish: 'golpear / impactar',
    phonetic: '/hɪt/ - /hɪt/ - /hɪt/',
    patternGroup: 'untouchables',
    patternName: 'Los Intocables',
    trickTip: 'Igual en presente, pasado y participio.',
    example: {
      sentence: 'The ball hit the window hard.',
      translation: 'La pelota golpeó fuertemente la ventana.'
    },
    level: 'A2'
  },
  {
    id: 'v-hurt',
    base: 'hurt',
    past: 'hurt',
    participle: 'hurt',
    spanish: 'doler / lastimar',
    phonetic: '/hɜːt/ - /hɜːt/ - /hɜːt/',
    patternGroup: 'untouchables',
    patternName: 'Los Intocables',
    trickTip: 'Nunca "hurted": "My knee hurt yesterday".',
    example: {
      sentence: 'It hurt for two days after training.',
      translation: 'Dolió durante dos días después de entrenar.'
    },
    level: 'A2'
  },
  {
    id: 'v-set',
    base: 'set',
    past: 'set',
    participle: 'set',
    spanish: 'fijar / configurar / poner',
    phonetic: '/sɛt/ - /sɛt/ - /sɛt/',
    patternGroup: 'untouchables',
    patternName: 'Los Intocables',
    trickTip: 'Inalterable: "I set the alarm clock at 6 AM".',
    example: {
      sentence: 'We have set clear goals for this quarter.',
      translation: 'Hemos fijado objetivos claros para este trimestre.'
    },
    level: 'B1'
  },
  {
    id: 'v-read',
    base: 'read',
    past: 'read',
    participle: 'read',
    spanish: 'leer',
    phonetic: '/riːd/ - /rɛd/ - /rɛd/',
    patternGroup: 'untouchables',
    patternName: 'Los Intocables',
    trickTip: '¡El falso intocable! Se escribe exactamente igual, pero en pasado se pronuncia como el color rojo /red/.',
    example: {
      sentence: 'I read (ri:d) books every day. Yesterday, I read (red) three chapters.',
      translation: 'Leo libros todos los días. Ayer, leí tres capítulos.'
    },
    level: 'A1'
  },

  // 2. LOS GEMELOS (V2 = V3)
  {
    id: 'v-buy',
    base: 'buy',
    past: 'bought',
    participle: 'bought',
    spanish: 'comprar',
    phonetic: '/baɪ/ - /bɔːt/ - /bɔːt/',
    patternGroup: 'twins',
    patternName: 'Los Gemelos (-ought)',
    trickTip: 'Terminación "-ought" (suena "bot"). V2 y V3 idénticos.',
    example: {
      sentence: 'I bought a laptop yesterday and I have bought three this year.',
      translation: 'Compré una laptop ayer y he comprado tres este año.'
    },
    level: 'A1'
  },
  {
    id: 'v-bring',
    base: 'bring',
    past: 'brought',
    participle: 'brought',
    spanish: 'traer',
    phonetic: '/brɪŋ/ - /brɔːt/ - /brɔːt/',
    patternGroup: 'twins',
    patternName: 'Los Gemelos (-ought)',
    trickTip: 'Rima con bought: bring ➔ brought ➔ brought.',
    example: {
      sentence: 'She brought delicious dessert to dinner.',
      translation: 'Ella trajo un postre delicioso a la cena.'
    },
    level: 'A1'
  },
  {
    id: 'v-think',
    base: 'think',
    past: 'thought',
    participle: 'thought',
    spanish: 'pensar / creer',
    phonetic: '/θɪŋk/ - /θɔːt/ - /θɔːt/',
    patternGroup: 'twins',
    patternName: 'Los Gemelos (-ought)',
    trickTip: 'Hermano de buy y bring: think ➔ thought ➔ thought.',
    example: {
      sentence: 'I thought about the problem all night.',
      translation: 'Pensé en el problema toda la noche.'
    },
    level: 'A1'
  },
  {
    id: 'v-catch',
    base: 'catch',
    past: 'caught',
    participle: 'caught',
    spanish: 'atrapar / tomar (transporte)',
    phonetic: '/kætʃ/ - /kɔːt/ - /kɔːt/',
    patternGroup: 'twins',
    patternName: 'Los Gemelos (-aught)',
    trickTip: 'Familia "-aught" (suena "cot"): catch ➔ caught ➔ caught.',
    example: {
      sentence: 'We caught the morning train to London.',
      translation: 'Tomamos el tren de la mañana a Londres.'
    },
    level: 'A2'
  },
  {
    id: 'v-teach',
    base: 'teach',
    past: 'taught',
    participle: 'taught',
    spanish: 'enseñar',
    phonetic: '/tiːtʃ/ - /tɔːt/ - /tɔːt/',
    patternGroup: 'twins',
    patternName: 'Los Gemelos (-aught)',
    trickTip: 'Hermano de catch: teach ➔ taught ➔ taught.',
    example: {
      sentence: 'Professor Smith taught me English grammar.',
      translation: 'El profesor Smith me enseñó gramática inglesa.'
    },
    level: 'A2'
  },
  {
    id: 'v-send',
    base: 'send',
    past: 'sent',
    participle: 'sent',
    spanish: 'enviar / mandar',
    phonetic: '/sɛnd/ - /sɛnt/ - /sɛnt/',
    patternGroup: 'twins',
    patternName: 'Los Gemelos (D ➔ T)',
    trickTip: 'Regla del toque suave: la "d" final simplemente se convierte en "t".',
    example: {
      sentence: 'I have already sent the confirmation email.',
      translation: 'Ya he enviado el correo de confirmación.'
    },
    level: 'A1'
  },
  {
    id: 'v-spend',
    base: 'spend',
    past: 'spent',
    participle: 'spent',
    spanish: 'gastar / pasar tiempo',
    phonetic: '/spɛnd/ - /spɛnt/ - /spɛnt/',
    patternGroup: 'twins',
    patternName: 'Los Gemelos (D ➔ T)',
    trickTip: 'Igual que send: la "d" cambia a "t" (spent).',
    example: {
      sentence: 'We spent two wonderful weeks in Italy.',
      translation: 'Pasamos dos semanas maravillosas en Italia.'
    },
    level: 'A2'
  },
  {
    id: 'v-build',
    base: 'build',
    past: 'built',
    participle: 'built',
    spanish: 'construir',
    phonetic: '/bɪld/ - /bɪlt/ - /bɪlt/',
    patternGroup: 'twins',
    patternName: 'Los Gemelos (D ➔ T)',
    trickTip: 'La "d" se convierte en "t" (built).',
    example: {
      sentence: 'They built this bridge in 1995.',
      translation: 'Construyeron este puente en 1995.'
    },
    level: 'A2'
  },
  {
    id: 'v-feel',
    base: 'feel',
    past: 'felt',
    participle: 'felt',
    spanish: 'sentir',
    phonetic: '/fiːl/ - /fɛlt/ - /fɛlt/',
    patternGroup: 'twins',
    patternName: 'Los Gemelos (-t corta)',
    trickTip: 'La vocal larga "ee" se acorta y se agrega "-t" (felt).',
    example: {
      sentence: 'I felt much more confident during the interview.',
      translation: 'Me sentí mucho más seguro durante la entrevista.'
    },
    level: 'A1'
  },
  {
    id: 'v-keep',
    base: 'keep',
    past: 'kept',
    participle: 'kept',
    spanish: 'mantener / guardar',
    phonetic: '/kiːp/ - /kɛpt/ - /kɛpt/',
    patternGroup: 'twins',
    patternName: 'Los Gemelos (-t corta)',
    trickTip: 'Rima con felt: keep ➔ kept ➔ kept.',
    example: {
      sentence: 'He kept his promise until the end.',
      translation: 'Él mantuvo su promesa hasta el final.'
    },
    level: 'A2'
  },
  {
    id: 'v-sleep',
    base: 'sleep',
    past: 'slept',
    participle: 'slept',
    spanish: 'dormir',
    phonetic: '/sliːp/ - /slɛpt/ - /slɛpt/',
    patternGroup: 'twins',
    patternName: 'Los Gemelos (-t corta)',
    trickTip: 'Hermano de keep y feel: sleep ➔ slept ➔ slept.',
    example: {
      sentence: 'I slept for eight peaceful hours last night.',
      translation: 'Dormí durante ocho horas tranquilas anoche.'
    },
    level: 'A1'
  },
  {
    id: 'v-find',
    base: 'find',
    past: 'found',
    participle: 'found',
    spanish: 'encontrar',
    phonetic: '/faɪnd/ - /faʊnd/ - /faʊnd/',
    patternGroup: 'twins',
    patternName: 'Los Gemelos (i ➔ ou)',
    trickTip: 'La "i" pasa al sonido "au": find ➔ found ➔ found.',
    example: {
      sentence: 'I found my lost passport under the desk.',
      translation: 'Encontré mi pasaporte perdido debajo del escritorio.'
    },
    level: 'A1'
  },
  {
    id: 'v-tell',
    base: 'tell',
    past: 'told',
    participle: 'told',
    spanish: 'decir / contar',
    phonetic: '/tɛl/ - /toʊld/ - /toʊld/',
    patternGroup: 'twins',
    patternName: 'Los Gemelos (-old)',
    trickTip: 'Familia "-old": tell ➔ told, sell ➔ sold.',
    example: {
      sentence: 'She told me the whole truth.',
      translation: 'Ella me dijo toda la verdad.'
    },
    level: 'A1'
  },

  // 3. LOS MUSICALES (i ➔ a ➔ u)
  {
    id: 'v-sing',
    base: 'sing',
    past: 'sang',
    participle: 'sung',
    spanish: 'cantar',
    phonetic: '/sɪŋ/ - /sæŋ/ - /sʌŋ/',
    patternGroup: 'musical',
    patternName: 'Los Musicales (i ➔ a ➔ u)',
    trickTip: 'El rey de la melodía: sing (i) ➔ sang (a) ➔ sung (u).',
    example: {
      sentence: 'We sing now, we sang yesterday, and we have sung together for years.',
      translation: 'Cantamos ahora, cantamos ayer y hemos cantado juntos durante años.'
    },
    level: 'A1'
  },
  {
    id: 'v-drink',
    base: 'drink',
    past: 'drank',
    participle: 'drunk',
    spanish: 'beber / tomar',
    phonetic: '/drɪŋk/ - /dræŋk/ - /drʌŋk/',
    patternGroup: 'musical',
    patternName: 'Los Musicales (i ➔ a ➔ u)',
    trickTip: 'drink (i) ➔ drank (a) ➔ drunk (u).',
    example: {
      sentence: 'I drank two glasses of water before breakfast.',
      translation: 'Bebí dos vasos de agua antes del desayuno.'
    },
    level: 'A1'
  },
  {
    id: 'v-swim',
    base: 'swim',
    past: 'swam',
    participle: 'swum',
    spanish: 'nadar',
    phonetic: '/swɪm/ - /swæm/ - /swʌm/',
    patternGroup: 'musical',
    patternName: 'Los Musicales (i ➔ a ➔ u)',
    trickTip: 'swim (i) ➔ swam (a) ➔ swum (u).',
    example: {
      sentence: 'They swam across the entire lake.',
      translation: 'Nadaron a través de todo el lago.'
    },
    level: 'A2'
  },
  {
    id: 'v-begin',
    base: 'begin',
    past: 'began',
    participle: 'begun',
    spanish: 'comenzar / empezar',
    phonetic: '/bɪˈɡɪn/ - /bɪˈɡæn/ - /bɪˈɡʌn/',
    patternGroup: 'musical',
    patternName: 'Los Musicales (i ➔ a ➔ u)',
    trickTip: 'begin (i) ➔ began (a) ➔ begun (u).',
    example: {
      sentence: 'The concert has already begun!',
      translation: '¡El concierto ya ha comenzado!'
    },
    level: 'A2'
  },
  {
    id: 'v-ring',
    base: 'ring',
    past: 'rang',
    participle: 'rung',
    spanish: 'sonar / llamar por timbre',
    phonetic: '/rɪŋ/ - /ræŋ/ - /rʌŋ/',
    patternGroup: 'musical',
    patternName: 'Los Musicales (i ➔ a ➔ u)',
    trickTip: 'ring (i) ➔ rang (a) ➔ rung (u). Como las campanas.',
    example: {
      sentence: 'The alarm rang at 7:00 AM sharp.',
      translation: 'La alarma sonó a las 7:00 AM en punto.'
    },
    level: 'A2'
  },

  // 4. LOS REGIOS CON -EN (V3 TERMINA EN -EN)
  {
    id: 'v-take',
    base: 'take',
    past: 'took',
    participle: 'taken',
    spanish: 'tomar / llevar',
    phonetic: '/teɪk/ - /tʊk/ - /teɪkən/',
    patternGroup: 'royals',
    patternName: 'Los Regios (-en)',
    trickTip: 'Participio coronado con -en: take ➔ took ➔ taken.',
    example: {
      sentence: 'Have you taken your medicine today?',
      translation: '¿Has tomado tu medicina hoy?'
    },
    level: 'A1'
  },
  {
    id: 'v-give',
    base: 'give',
    past: 'gave',
    participle: 'given',
    spanish: 'dar / entregar',
    phonetic: '/ɡɪv/ - /ɡeɪv/ - /ɡɪvən/',
    patternGroup: 'royals',
    patternName: 'Los Regios (-en)',
    trickTip: 'give ➔ gave ➔ given.',
    example: {
      sentence: 'She gave me a wonderful book.',
      translation: 'Ella me dio un libro maravilloso.'
    },
    level: 'A1'
  },
  {
    id: 'v-write',
    base: 'write',
    past: 'wrote',
    participle: 'written',
    spanish: 'escribir',
    phonetic: '/raɪt/ - /roʊt/ - /ˈrɪtən/',
    patternGroup: 'royals',
    patternName: 'Los Regios (-en)',
    trickTip: 'En el participio "written" duplica la "t": write ➔ wrote ➔ written.',
    example: {
      sentence: 'He has written three best-selling novels.',
      translation: 'Él ha escrito tres novelas de gran éxito.'
    },
    level: 'A1'
  },
  {
    id: 'v-drive',
    base: 'drive',
    past: 'drove',
    participle: 'driven',
    spanish: 'conducir / manejar',
    phonetic: '/draɪv/ - /droʊv/ - /ˈdrɪvən/',
    patternGroup: 'royals',
    patternName: 'Los Regios (-en)',
    trickTip: 'Igual que write: drive ➔ drove ➔ driven (/ˈdrɪvən/).',
    example: {
      sentence: 'We drove all the way to California.',
      translation: 'Condujimos todo el camino hasta California.'
    },
    level: 'A2'
  },
  {
    id: 'v-eat',
    base: 'eat',
    past: 'ate',
    participle: 'eaten',
    spanish: 'comer',
    phonetic: '/iːt/ - /eɪt/ - /ˈiːtən/',
    patternGroup: 'royals',
    patternName: 'Los Regios (-en)',
    trickTip: 'eat ➔ ate (suena como el número 8 "eight") ➔ eaten.',
    example: {
      sentence: 'I have never eaten authentic Japanese sushi.',
      translation: 'Nunca he comido auténtico sushi japonés.'
    },
    level: 'A1'
  },
  {
    id: 'v-see',
    base: 'see',
    past: 'saw',
    participle: 'seen',
    spanish: 'ver',
    phonetic: '/siː/ - /sɔː/ - /siːn/',
    patternGroup: 'royals',
    patternName: 'Los Regios (-n)',
    trickTip: 'see ➔ saw ➔ seen. El participio agrega una "-n".',
    example: {
      sentence: 'I saw that movie last Friday.',
      translation: 'Vi esa película el viernes pasado.'
    },
    level: 'A1'
  },
  {
    id: 'v-speak',
    base: 'speak',
    past: 'spoke',
    participle: 'spoken',
    spanish: 'hablar',
    phonetic: '/spiːk/ - /spoʊk/ - /ˈspoʊkən/',
    patternGroup: 'royals',
    patternName: 'Los Regios (-en)',
    trickTip: 'speak ➔ spoke ➔ spoken.',
    example: {
      sentence: 'English is spoken all over the world.',
      translation: 'El inglés se habla en todo el mundo.'
    },
    level: 'A1'
  },
  {
    id: 'v-choose',
    base: 'choose',
    past: 'chose',
    participle: 'chosen',
    spanish: 'elegir / escoger',
    phonetic: '/tʃuːz/ - /tʃoʊz/ - /ˈtʃoʊzən/',
    patternGroup: 'royals',
    patternName: 'Los Regios (-en)',
    trickTip: 'Hermano de speak: choose ➔ chose ➔ chosen.',
    example: {
      sentence: 'You have chosen the best option.',
      translation: 'Has elegido la mejor opción.'
    },
    level: 'B1'
  },
  {
    id: 'v-break',
    base: 'break',
    past: 'broke',
    participle: 'broken',
    spanish: 'romper',
    phonetic: '/breɪk/ - /broʊk/ - /ˈbroʊkən/',
    patternGroup: 'royals',
    patternName: 'Los Regios (-en)',
    trickTip: 'break ➔ broke ➔ broken.',
    example: {
      sentence: 'The glass broke into a hundred pieces.',
      translation: 'El vaso se rompió en cien pedazos.'
    },
    level: 'A2'
  },
  {
    id: 'v-forget',
    base: 'forget',
    past: 'forgot',
    participle: 'forgotten',
    spanish: 'olvidar',
    phonetic: '/fərˈɡɛt/ - /fərˈɡɒt/ - /fərˈɡɒtən/',
    patternGroup: 'royals',
    patternName: 'Los Regios (-en)',
    trickTip: 'Duplica la "t": forget ➔ forgot ➔ forgotten.',
    example: {
      sentence: 'I had forgotten my umbrella at home.',
      translation: 'Había olvidado mi paraguas en casa.'
    },
    level: 'A2'
  },

  // 5. LOS VOLADORES (-EW / -OWN)
  {
    id: 'v-know',
    base: 'know',
    past: 'knew',
    participle: 'known',
    spanish: 'saber / conocer',
    phonetic: '/noʊ/ - /njuː/ - /noʊn/',
    patternGroup: 'flyers',
    patternName: 'Los Voladores (-ew ➔ -own)',
    trickTip: 'know ➔ knew ➔ known. En pasado suena como "new".',
    example: {
      sentence: 'I knew the answer immediately.',
      translation: 'Supe la respuesta de inmediato.'
    },
    level: 'A1'
  },
  {
    id: 'v-grow',
    base: 'grow',
    past: 'grew',
    participle: 'grown',
    spanish: 'crecer / cultivar',
    phonetic: '/ɡroʊ/ - /ɡruː/ - /ɡroʊn/',
    patternGroup: 'flyers',
    patternName: 'Los Voladores (-ew ➔ -own)',
    trickTip: 'Rima con know: grow ➔ grew ➔ grown.',
    example: {
      sentence: 'The tech company grew rapidly last year.',
      translation: 'La empresa tecnológica creció rápidamente el año pasado.'
    },
    level: 'A2'
  },
  {
    id: 'v-throw',
    base: 'throw',
    past: 'threw',
    participle: 'thrown',
    spanish: 'lanzar / tirar',
    phonetic: '/θroʊ/ - /θruː/ - /θroʊn/',
    patternGroup: 'flyers',
    patternName: 'Los Voladores (-ew ➔ -own)',
    trickTip: 'throw ➔ threw ➔ thrown.',
    example: {
      sentence: 'He threw the ball to his teammate.',
      translation: 'Él lanzó la pelota a su compañero de equipo.'
    },
    level: 'A2'
  },
  {
    id: 'v-fly',
    base: 'fly',
    past: 'flew',
    participle: 'flown',
    spanish: 'volar',
    phonetic: '/flaɪ/ - /fluː/ - /floʊn/',
    patternGroup: 'flyers',
    patternName: 'Los Voladores (-ew ➔ -own)',
    trickTip: '¡El volador literal! fly ➔ flew ➔ flown.',
    example: {
      sentence: 'We flew over the Andes mountains.',
      translation: 'Volamos sobre la cordillera de los Andes.'
    },
    level: 'A2'
  },
  {
    id: 'v-draw',
    base: 'draw',
    past: 'drew',
    participle: 'drawn',
    spanish: 'dibujar / trazar',
    phonetic: '/drɔː/ - /druː/ - /drɔːn/',
    patternGroup: 'flyers',
    patternName: 'Los Voladores (-ew ➔ -awn)',
    trickTip: 'draw ➔ drew ➔ drawn.',
    example: {
      sentence: 'The architect drew the building plans.',
      translation: 'El arquitecto dibujó los planos del edificio.'
    },
    level: 'A2'
  },

  // 6. LOS BUMERÁN (V1 = V3)
  {
    id: 'v-come',
    base: 'come',
    past: 'came',
    participle: 'come',
    spanish: 'venir / llegar',
    phonetic: '/kʌm/ - /keɪm/ - /kʌm/',
    patternGroup: 'boomerang',
    patternName: 'Los Bumerán (V1 = V3)',
    trickTip: 'Vuelve al inicio: come ➔ came ➔ come.',
    example: {
      sentence: 'She has come to visit us three times this year.',
      translation: 'Ella ha venido a visitarnos tres veces este año.'
    },
    level: 'A1'
  },
  {
    id: 'v-become',
    base: 'become',
    past: 'became',
    participle: 'become',
    spanish: 'convertirse en / llegar a ser',
    phonetic: '/bɪˈkʌm/ - /bɪˈkeɪm/ - /bɪˈkʌm/',
    patternGroup: 'boomerang',
    patternName: 'Los Bumerán (V1 = V3)',
    trickTip: 'Hermano gemelo de come: become ➔ became ➔ become.',
    example: {
      sentence: 'She became a certified doctor in 2020.',
      translation: 'Ella se convirtió en médico certificada en 2020.'
    },
    level: 'A2'
  },
  {
    id: 'v-run',
    base: 'run',
    past: 'ran',
    participle: 'run',
    spanish: 'correr',
    phonetic: '/rʌn/ - /ræn/ - /rʌn/',
    patternGroup: 'boomerang',
    patternName: 'Los Bumerán (V1 = V3)',
    trickTip: 'El participio vuelve a "run": run ➔ ran ➔ run.',
    example: {
      sentence: 'He has run five full marathons.',
      translation: 'Él ha corrido cinco maratones completos.'
    },
    level: 'A1'
  },

  // 7. LOS REGULARES Y REGLAS DE -ED
  {
    id: 'v-want',
    base: 'want',
    past: 'wanted',
    participle: 'wanted',
    spanish: 'querer',
    phonetic: '/wɒnt/ - /ˈwɒntɪd/ - /ˈwɒntɪd/',
    patternGroup: 'regular-rules',
    patternName: 'Regla -ED: Sonido /ɪd/ (Termina en T)',
    trickTip: 'Como termina en "T", aquí SÍ se pronuncia la "ed" como una sílaba nueva: /wɒn-tɪd/.',
    example: {
      sentence: 'I wanted to practice my pronunciation today.',
      translation: 'Quería practicar mi pronunciación hoy.'
    },
    level: 'A1',
    isRegular: true
  },
  {
    id: 'v-need',
    base: 'need',
    past: 'needed',
    participle: 'needed',
    spanish: 'necesitar',
    phonetic: '/niːd/ - /ˈniːdɪd/ - /ˈniːdɪd/',
    patternGroup: 'regular-rules',
    patternName: 'Regla -ED: Sonido /ɪd/ (Termina en D)',
    trickTip: 'Como termina en "D", aquí SÍ se pronuncia la "ed": /niː-dɪd/.',
    example: {
      sentence: 'We needed more time to finish the exam.',
      translation: 'Necesitábamos más tiempo para terminar el examen.'
    },
    level: 'A1',
    isRegular: true
  },
  {
    id: 'v-work',
    base: 'work',
    past: 'worked',
    participle: 'worked',
    spanish: 'trabajar',
    phonetic: '/wɜːk/ - /wɜːkt/ - /wɜːkt/',
    patternGroup: 'regular-rules',
    patternName: 'Regla -ED: Sonido /t/ (Sordo)',
    trickTip: '¡NO digas "uorked"! La "e" es muda. Se pronuncia como una "t" seca: /werkt/.',
    example: {
      sentence: 'She worked at Microsoft for five years.',
      translation: 'Ella trabajó en Microsoft durante cinco años.'
    },
    level: 'A1',
    isRegular: true
  },
  {
    id: 'v-play',
    base: 'play',
    past: 'played',
    participle: 'played',
    spanish: 'jugar / tocar instrumento',
    phonetic: '/pleɪ/ - /pleɪd/ - /pleɪd/',
    patternGroup: 'regular-rules',
    patternName: 'Regla -ED: Sonido /d/ (Sonoro)',
    trickTip: '¡NO digas "plei-ed"! La "e" es muda. Suena como una "d" suave: /pleid/.',
    example: {
      sentence: 'They played guitar all evening.',
      translation: 'Tocaron la guitarra durante toda la tarde.'
    },
    level: 'A1',
    isRegular: true
  }
];
