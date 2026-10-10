import { ForumPost } from '../types';

export const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    title: '¿Por qué se dice "I have lived here for 5 years" y no "I live here for 5 years"?',
    content: 'Hola a todos. En español decimos simplemente "Vivo aquí desde hace 5 años" usando el presente normal. Sin embargo, mi profesor siempre me corrige y me dice que debo usar "I have lived" o "I have been living". ¿Por qué no se puede usar el Present Simple si todavía vivo ahí hoy en día?',
    authorName: 'Camila Morales',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    authorCountry: 'Colombia',
    authorLevel: 'B1',
    category: 'tenses',
    tenseTag: 'present-perfect',
    createdAt: 'Hace 3 horas',
    upvotes: 34,
    views: 312,
    isSolved: true,
    replies: [
      {
        id: 'rep-1-1',
        authorName: 'Prof. Carlos Mendoza',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        authorLevel: 'C2',
        authorBadge: 'Profesor Verificado',
        content: '¡Gran pregunta Camila! Esta es la trampa #1 para hispanohablantes. En inglés, el **Present Simple** expresa rutinas o verdades atemporales (ej: "I live in Madrid"). Pero en cuanto añades una duración temporal que comenzó en el pasado y continúa hasta el presente ("for 5 years", "since 2019"), el inglés exige **Present Perfect** (`have + participio`) o **Present Perfect Continuous** (`have been living`). Si dices "I live here for 5 years", suena a que cada 5 años te mudas o carece de sentido temporal. Recuerda la regla de oro: ¡Inicio en el pasado + conexión con el presente = Present Perfect!',
        createdAt: 'Hace 2 horas',
        upvotes: 28,
        isAcceptedSolution: true
      },
      {
        id: 'rep-1-2',
        authorName: 'Lucas Ferreira',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
        authorLevel: 'B2',
        content: 'Exacto! Un truco mnemotécnico que me sirvió mucho: piensa en el Present Perfect como un puente colgante que une el pasado con el ahora mismo.',
        createdAt: 'Hace 45 minutos',
        upvotes: 9
      }
    ]
  },
  {
    id: 'post-2',
    title: 'Diferencia real entre "I was doing" vs "I did" al contar anécdotas',
    content: 'A veces me cuesta saber si poner Past Simple o Past Continuous cuando cuento lo que me pasó ayer en el trabajo. ¿Alguien tiene una regla rápida para no dudar mientras hablo?',
    authorName: 'Mateo Roldán',
    authorAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80',
    authorCountry: 'Argentina',
    authorLevel: 'A2',
    category: 'tenses',
    tenseTag: 'past-continuous',
    createdAt: 'Ayer',
    upvotes: 19,
    views: 185,
    isSolved: true,
    replies: [
      {
        id: 'rep-2-1',
        authorName: 'Elena Gómez',
        authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
        authorLevel: 'B2',
        authorBadge: 'Top Contribuidora',
        content: 'Imagina una película 🎬: \n- **Past Continuous** (`was/were + -ing`) es el escenario de fondo: *"I was walking down the street, music was playing..."*\n- **Past Simple** (`V2/-ed`) es la acción repentina que interrumpe la escena: *"...when suddenly I dropped my phone!"*\n\nFondo = Continuous. Interrupción o acción puntual = Simple.',
        createdAt: 'Ayer',
        upvotes: 22,
        isAcceptedSolution: true
      }
    ]
  },
  {
    id: 'post-3',
    title: '⚠️ Cuidado: "I am agree" vs "I agree" (¡El error más común en entrevistas!)',
    content: 'Veo a muchos compañeros decir "I am agree with you" traduciendo literalmente del español "Estoy de acuerdo". Recuerden que en inglés "Agree" ya es un VERBO, no un adjetivo. Se dice "I agree", "I agreed" o "I will agree". ¡Nunca añadas el verbo To Be delante!',
    authorName: 'Valeria Santos',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    authorCountry: 'México',
    authorLevel: 'B2',
    category: 'common-mistakes',
    tenseTag: 'present-simple',
    createdAt: 'Hace 1 día',
    upvotes: 45,
    views: 450,
    isSolved: false,
    replies: [
      {
        id: 'rep-3-1',
        authorName: 'Diego Navas',
        authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
        authorLevel: 'B1',
        content: '¡Uff, culpable! Yo lo decía todo el tiempo hasta que me corrigieron en el trabajo. Lo mismo pasa con "I have 25 years" en vez de "I am 25 years old".',
        createdAt: 'Ayer',
        upvotes: 14
      }
    ]
  },
  {
    id: 'post-4',
    title: '🎯 Reto Semanal: Escribe una micro-historia usando Past Perfect y Past Simple',
    content: '¡Practiquemos juntos! Escribe en los comentarios 2 oraciones donde combines una acción anterior en el pasado (Past Perfect: `had + V3`) con otra acción posterior (Past Simple). ¡Revisamos y nos damos feedback mutuo!',
    authorName: 'Comunidad TenseMaster',
    authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
    authorCountry: 'España',
    authorLevel: 'C1',
    category: 'challenges',
    tenseTag: 'past-perfect',
    createdAt: 'Hace 2 días',
    upvotes: 52,
    views: 520,
    isSolved: false,
    replies: [
      {
        id: 'rep-4-1',
        authorName: 'Andrés Gil',
        authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
        authorLevel: 'B1',
        content: '"When I arrived at the cinema, the movie **had already started**!" ¿Está correcto?',
        createdAt: 'Hace 1 día',
        upvotes: 18,
        isAcceptedSolution: true
      },
      {
        id: 'rep-4-2',
        authorName: 'Sofía Carrión',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        authorLevel: 'B2',
        content: '¡100% perfecto Andrés! La película empezó primero (had started), y tu llegada fue después (arrived).',
        createdAt: 'Hace 1 día',
        upvotes: 12
      }
    ]
  },
  {
    id: 'post-5',
    title: '💡 Mi método infalible para no olvidar las fórmulas verbales (5 minutos al día)',
    content: 'Comparto mi rutina que me llevó de A2 a B2 en 4 meses: \n1. Abro la Matriz de TenseMaster al desayunar.\n2. Me enfoco solo en 1 fila (ej. Presente: Simple, Continuous, Perfect, Perfect Continuous).\n3. Digo 1 frase mía real en voz alta para cada uno usando el botón de pronunciación.\nEl secreto no es estudiar 2 horas el fin de semana, sino 5 minutos con concentración total cada mañana.',
    authorName: 'Javier Domínguez',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    authorCountry: 'Perú',
    authorLevel: 'B2',
    category: 'study-tips',
    createdAt: 'Hace 3 días',
    upvotes: 68,
    views: 890,
    isSolved: false,
    replies: [
      {
        id: 'rep-5-1',
        authorName: 'Mariana Silva',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
        authorLevel: 'A2',
        content: 'Totalmente de acuerdo Javier. La constancia diaria le gana a cualquier maratón de estudio. ¡Gracias por la motivación!',
        createdAt: 'Hace 2 días',
        upvotes: 15
      }
    ]
  }
];
