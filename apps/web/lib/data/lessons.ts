// ============================================================================
// LESSONS DATA - Fallback data for lessons page
// ============================================================================

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  description?: string;
  category: LessonCategory;
  level: LessonLevel;
  duration: number;  // en minutes
  xp: number;
  topics: string[];
  order: number;
  progress?: {
    status: string;
    currentSection: number;
    completedSections: string[];
    xp: number;
    startedAt?: string;
    completedAt?: string;
    lastAccessed?: string;
  } | null;
}

export type LessonCategory =
  | 'THEORY'
  | 'FRETBOARD'
  | 'CHORDS'
  | 'NOTATION'
  | 'PROGRESSIONS'
  | 'COMPOSITION';

export type LessonLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

// Données des leçons - organisées par catégories et niveaux
export const LESSONS_DATA: Lesson[] = [
  // === THEORIE ===
  {
    id: '1',
    slug: 'modes-grecs-intro',
    title: 'Introduction aux Modes Grecs',
    category: 'THEORY',
    level: 'BEGINNER',
    duration: 15,
    xp: 50,
    description: 'Decouvrez les 7 modes grecs et leurs emotions caracteristiques. Apprenez a les utiliser dans vos compositions.',
    topics: ['Ionien', 'Dorien', 'Phrygien', 'Lydien', 'Mixolydien', 'Eolien', 'Locrien'],
    order: 1,
    progress: null,
  },
  {
    id: '2',
    slug: 'cercle-quintes',
    title: 'Le Cercle des Quintes',
    category: 'THEORY',
    level: 'BEGINNER',
    duration: 20,
    xp: 75,
    description: 'Maîtrisez l\'outil le plus puissant pour comprendre les relations harmoniques entre les tonalites.',
    topics: ['Cycle des quintes', 'Tonalites voisines', 'Armure', 'Modulation'],
    order: 2,
    progress: {
      status: 'completed',
      currentSection: 5,
      completedSections: ['intro', 'quintes', 'tonalites', 'armure', 'modulation'],
      xp: 75,
      startedAt: '2025-01-01T10:00:00Z',
      completedAt: '2025-01-01T10:20:00Z',
      lastAccessed: '2025-01-01T10:20:00Z',
    },
  },
  {
    id: '3',
    slug: 'intervalles-essentiels',
    title: 'Les Intervalles Essentiels',
    category: 'THEORY',
    level: 'BEGINNER',
    duration: 25,
    xp: 80,
    description: 'Comprenez et identifiez tous les intervalles. La base de l\'oreille musicale.',
    topics: ['Intervalles simples', 'Intervalles composes', 'Renversement', 'Oreille relative'],
    order: 3,
    progress: {
      status: 'completed',
      currentSection: 6,
      completedSections: ['unissons', 'secondes', 'tierces', 'quartes', 'quintes', 'sixtes'],
      xp: 80,
      startedAt: '2025-01-02T10:00:00Z',
      completedAt: '2025-01-02T10:25:00Z',
      lastAccessed: '2025-01-02T10:25:00Z',
    },
  },
  {
    id: '4',
    slug: 'harmonie-mode-metal',
    title: 'Harmonie des Modes dans le Metal',
    category: 'THEORY',
    level: 'INTERMEDIATE',
    duration: 35,
    xp: 120,
    description: 'Utilisez les modes pour creer des riffs metal epoustouflants. Phrygien, Locrien et plus.',
    topics: ['Phrygien dominan', 'Locrien', 'Double harmonique', 'Pentatoniques modales'],
    order: 4,
    progress: {
      status: 'in-progress',
      currentSection: 3,
      completedSections: ['phrygien', 'locrien'],
      xp: 54,
      startedAt: '2025-01-03T10:00:00Z',
      lastAccessed: '2025-01-03T10:20:00Z',
    },
  },
  {
    id: '5',
    slug: 'analyse-progression-jazz',
    title: 'Analyse de Progressions Jazz',
    category: 'THEORY',
    level: 'ADVANCED',
    duration: 45,
    xp: 150,
    description: 'Decomposez les progressions complexes du jazz. ii-V-I, triton, substitutions.',
    topics: ['ii-V-I', 'Substitution tritonique', 'Turnarounds', 'Coltrane changes'],
    order: 5,
    progress: null,
  },

  // === MANCHE ===
  {
    id: '6',
    slug: 'manche-position-c',
    title: 'Position C sur le Manche',
    category: 'FRETBOARD',
    level: 'BEGINNER',
    duration: 30,
    xp: 100,
    description: 'Apprenez a trouver toutes les notes depuis la position C. Fondamental pour improviser.',
    topics: ['Position C', 'Tetes de colonne', 'Pattern 5-notes', 'Octaves'],
    order: 6,
    progress: {
      status: 'in-progress',
      currentSection: 4,
      completedSections: ['position-c', 'tetes-colonne'],
      xp: 60,
      startedAt: '2025-01-04T10:00:00Z',
      lastAccessed: '2025-01-04T10:20:00Z',
    },
  },
  {
    id: '7',
    slug: 'systeme-cAGED',
    title: 'Le Systeme CAGED',
    category: 'FRETBOARD',
    level: 'INTERMEDIATE',
    duration: 40,
    xp: 130,
    description: 'Maîtrisez tout le manche avec le systeme CAGED. 5 positions pour liberte totale.',
    topics: ['5 formes CAGED', 'Relier les positions', 'Accords degrés', 'Arpeges'],
    order: 7,
    progress: {
      status: 'in-progress',
      currentSection: 1,
      completedSections: ['intro'],
      xp: 26,
      startedAt: '2025-01-05T10:00:00Z',
      lastAccessed: '2025-01-05T10:10:00Z',
    },
  },
  {
    id: '8',
    slug: 'triades-sur-manche',
    title: 'Triades sur Tout le Manche',
    category: 'FRETBOARD',
    level: 'INTERMEDIATE',
    duration: 35,
    xp: 110,
    description: 'Les triades sont la base du rock et du metal. Apprenez-les partout sur le manche.',
    topics: ['Triades majeures', 'Triades mineures', 'Inversions', 'Voice leading'],
    order: 8,
    progress: null,
  },
  {
    id: '9',
    slug: 'sweep-picking-arpèges',
    title: 'Arpeges en Sweep Picking',
    category: 'FRETBOARD',
    level: 'ADVANCED',
    duration: 50,
    xp: 200,
    description: 'Technique emblematique du metal. Arpeges 5, 6 cordes, patterns avances.',
    topics: ['Technique de base', 'Arpeges majeurs', 'Arpeges mineurs', 'Patterns complexes'],
    order: 9,
    progress: null,
  },

  // === ACCORDS ===
  {
    id: '10',
    slug: 'accords-ouverts-base',
    title: 'Accords Ouverts - Les Bases',
    category: 'CHORDS',
    level: 'BEGINNER',
    duration: 20,
    xp: 60,
    description: 'Les accords essentiels que tout guitariste doit connaitre. E, A, D, G, C, Em, Am.',
    topics: ['Accords majeurs', 'Accords mineurs', 'Progressions simples', 'Rythmique de base'],
    order: 10,
    progress: {
      status: 'completed',
      currentSection: 5,
      completedSections: ['E', 'A', 'D', 'G', 'C'],
      xp: 60,
      startedAt: '2025-01-06T10:00:00Z',
      completedAt: '2025-01-06T10:20:00Z',
      lastAccessed: '2025-01-06T10:20:00Z',
    },
  },
  {
    id: '11',
    slug: 'accords-puissance',
    title: 'Power Chords et Leurs Variations',
    category: 'CHORDS',
    level: 'BEGINNER',
    duration: 25,
    xp: 70,
    description: 'Le power chord est l\'arme du guitariste rock/metal. Maîtrisez-le et ses variantes.',
    topics: ['Power chord basic', 'Power chord inverse', 'Power chrod 3 notes', 'Fry roots'],
    order: 11,
    progress: {
      status: 'completed',
      currentSection: 5,
      completedSections: ['basic', 'inverse', '3-notes', 'fry-roots', 'variations'],
      xp: 70,
      startedAt: '2025-01-07T10:00:00Z',
      completedAt: '2025-01-07T10:25:00Z',
      lastAccessed: '2025-01-07T10:25:00Z',
    },
  },
  {
    id: '12',
    slug: 'accords-jazz-voicings',
    title: 'Voicings Jazz: Shell Chords',
    category: 'CHORDS',
    level: 'INTERMEDIATE',
    duration: 30,
    xp: 100,
    description: 'Les shell chords (3eme et 7eme) sont la base du comping jazz. Economiques et expressifs.',
    topics: ['Shell chords', 'Root position', 'Inversions', 'Extensions'],
    order: 12,
    progress: {
      status: 'in-progress',
      currentSection: 1,
      completedSections: ['shell-chords'],
      xp: 15,
      startedAt: '2025-01-08T10:00:00Z',
      lastAccessed: '2025-01-08T10:05:00Z',
    },
  },
  {
    id: '13',
    slug: 'accords-extension-9-11-13',
    title: 'Accords avec Extensions (9, 11, 13)',
    category: 'CHORDS',
    level: 'ADVANCED',
    duration: 40,
    xp: 140,
    description: 'Enrichissez votre harmonie avec les extensions. Le son moderne du jazz et du RB.',
    topics: ['9eme majeure', '11eme', '13eme', 'Alterations'],
    order: 13,
    progress: null,
  },

  // === NOTATION ===
  {
    id: '14',
    slug: 'notation-francaise-debut',
    title: 'Notation Française: Debutant',
    category: 'NOTATION',
    level: 'BEGINNER',
    duration: 20,
    xp: 50,
    description: 'Apprenez a lire la partition en notation française. Les bases du solfege.',
    topics: ['Notes de la gamme', 'Cle de sol', 'Rythmes simples', 'Armures simples'],
    order: 14,
    progress: {
      status: 'completed',
      currentSection: 5,
      completedSections: ['notes', 'cle-sol', 'rythmes', 'armures', 'lecture'],
      xp: 50,
      startedAt: '2025-01-09T10:00:00Z',
      completedAt: '2025-01-09T10:20:00Z',
      lastAccessed: '2025-01-09T10:20:00Z',
    },
  },
  {
    id: '15',
    slug: 'notation-rythme-complexe',
    title: 'Rythmes Complexes en Notation',
    category: 'NOTATION',
    level: 'INTERMEDIATE',
    duration: 30,
    xp: 90,
    description: 'Noirs pointees, croches, triolets, syncope. Lisez et jouez des rythmes complexes.',
    topics: ['Syncope', 'Triolets', 'Swing', 'Polymetries'],
    order: 15,
    progress: {
      status: 'in-progress',
      currentSection: 2,
      completedSections: ['syncope', 'triolets'],
      xp: 32,
      startedAt: '2025-01-10T10:00:00Z',
      lastAccessed: '2025-01-10T10:12:00Z',
    },
  },

  // === PROGRESSIONS ===
  {
    id: '16',
    slug: 'progression-ii-V-I',
    title: 'La Progression ii-V-I Expliquee',
    category: 'PROGRESSIONS',
    level: 'INTERMEDIATE',
    duration: 30,
    xp: 90,
    description: 'La progression la plus importante du jazz. Comprenez pourquoi elle fonctionne.',
    topics: ['Fonction diatonique', 'Tension et resolution', 'Variations', 'Turnaround'],
    order: 16,
    progress: null,
  },
  {
    id: '17',
    slug: 'progressions-metal',
    title: 'Progressions Metal Epique',
    category: 'PROGRESSIONS',
    level: 'INTERMEDIATE',
    duration: 25,
    xp: 85,
    description: 'Les progressions qui donnent des frissons. Modes mineurs, chromatisme, power.',
    topics: ['Phrygien espagnol', 'Chromatic descending', 'Power metal progressions', 'Doom progressions'],
    order: 17,
    progress: null,
  },

  // === COMPOSITION ===
  {
    id: '18',
    slug: 'composition-structure-de-base',
    title: 'Structure d\'une Chanson',
    category: 'COMPOSITION',
    level: 'BEGINNER',
    duration: 25,
    xp: 70,
    description: 'Verse, chorus, bridge... Apprenez les structures standards et comment les utiliser.',
    topics: ['Verse-Chorus', 'AABA', 'Rondo', 'Bridge'],
    order: 18,
    progress: {
      status: 'completed',
      currentSection: 5,
      completedSections: ['verse-chorus', 'AABA', 'rondo', 'bridge', 'intros-outros'],
      xp: 70,
      startedAt: '2025-01-11T10:00:00Z',
      completedAt: '2025-01-11T10:25:00Z',
      lastAccessed: '2025-01-11T10:25:00Z',
    },
  },
  {
    id: '19',
    slug: 'composition-melodie-memorable',
    title: 'Creer une Melodie Memorable',
    category: 'COMPOSITION',
    level: 'INTERMEDIATE',
    duration: 35,
    xp: 110,
    description: 'Les secrets des melodies qui accrochent. Motifs, repetition, variation.',
    topics: ['Motifs melodiques', 'Question-reponse', 'Contour melodique', 'Rythme de la melodie'],
    order: 19,
    progress: null,
  },
];

export const LESSON_CATEGORIES = ['ALL', 'THEORY', 'FRETBOARD', 'CHORDS', 'NOTATION', 'PROGRESSIONS', 'COMPOSITION'] as const;

export const LESSON_LEVELS = ['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const;
