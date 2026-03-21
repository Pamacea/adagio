/**
 * ADAGIO - Lessons Content
 * Structure de contenu pour les leçons interactives
 * Supporte markdown + démos intégrées + quiz + exercices
 */

// ============================================================================
// TYPES
// ============================================================================

/**
 * Types de blocs de contenu
 */

/**
 * Événements émis par les composants de démo
 */
export interface DemoEvent {
  component: DemoBlock['component'];
  action: string;
  data?: unknown;
}
export type LessonBlockType = 'text' | 'demo' | 'exercise' | 'quiz';

/**
 * Bloc de texte avec support markdown
 */
export interface TextBlock {
  type: 'text';
  content: string; // Markdown
  title?: string;
}

/**
 * Configuration pour un composant de démo interactif
 */
export interface DemoConfig {
  // Props spécifiques à chaque type de démo
  fretboard?: {
    root: string;
    mode: string;
    fretCount?: number;
    showAllNotes?: boolean;
  };
  circle?: {
    selectedKey: string;
    diatonicChords: string[];
    isMinor?: boolean;
  };
  modes?: {
    selectedMode: string;
    showAll?: boolean;
  };
  chords?: {
    root: string;
    quality: string;
    showFingerings?: boolean;
  };
  notation?: {
    tab?: string;
    notation?: string;
  };
}

/**
 * Bloc avec démo interactive
 */
export interface DemoBlock {
  type: 'demo';
  component: 'fretboard' | 'circle' | 'modes' | 'chords' | 'notation';
  config: DemoConfig;
  title?: string;
  description?: string;
}

/**
 * Question de quiz
 */
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index de la bonne réponse
  explanation?: string;
}

/**
 * Bloc quiz interactif
 */
export interface QuizBlock {
  type: 'quiz';
  questions: QuizQuestion[];
  passingScore?: number; // Score minimum pour réussir (0-100)
}

/**
 * Bloc exercice pratique
 */
export interface ExerciseBlock {
  type: 'exercise';
  title: string;
  instructions: string;
  steps: string[];
  tips?: string[];
}

/**
 * Bloc de contenu d'une leçon
 */
export type LessonBlock = TextBlock | DemoBlock | QuizBlock | ExerciseBlock;

/**
 * Métadonnées d'une leçon
 */
export interface LessonMetadata {
  id: string;
  title: string;
  category: 'THEORY' | 'TECHNIQUE' | 'EAR_TRAINING' | 'COMPOSITION';
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  duration: string;
  xp: number;
  description: string;
  topics: string[];
  prerequisites?: string[]; // IDs des leçons prérequis
}

/**
 * Leçon complète
 */
export interface Lesson {
  metadata: LessonMetadata;
  blocks: LessonBlock[];
}

// ============================================================================
// CONTENT - LEÇONS INTERACTIVES
// ============================================================================

/**
 * Contenu des leçons interactives
 */
export const LESSONS_CONTENT: Record<string, Lesson> = {
  'modes-grecs-intro': {
    metadata: {
      id: 'modes-grecs-intro',
      title: 'Introduction aux Modes Grecs',
      category: 'THEORY',
      level: 'BEGINNER',
      duration: '15 min',
      xp: 50,
      description: 'Découvrez les 7 modes grecs et leurs émotions caractéristiques.',
      topics: ['Ionien', 'Dorien', 'Phrygien', 'Lydien', 'Mixolydien', 'Éolien', 'Locrien'],
    },
    blocks: [
      // Introduction
      {
        type: 'text',
        title: 'INTRODUCTION',
        content: `Les modes grecs sont des "gammes" dérivées de la gamme majeure. Chaque mode a une **couleur émotionnelle unique** qui peut transformer complètement l'ambiance de votre musique.

Dans cette leçon, nous allons explorer les 7 modes et comment les utiliser pour créer des ambiances spécifiques dans vos compositions.`,
      },
      // Démo interactive: Cercle des modes
      {
        type: 'demo',
        component: 'modes',
        title: 'Explorez les 7 Modes',
        description: 'Cliquez sur chaque mode pour découvrir son caractère émotionnel unique.',
        config: {
          modes: {
            selectedMode: 'dorian',
            showAll: true,
          },
        },
      },
      // Texte: Qu'est-ce qu'un mode
      {
        type: 'text',
        title: "Qu'est-ce qu'un Mode?",
        content: `Un mode est simplement une gamme qui commence et finit sur une note différente de la **tonique** (note "de base") de la gamme majeure.

**Exemple:**
- Si vous jouez les notes de **DO MAJEUR** mais commencez et finissez sur **RÉ**, vous jouez le **MODE DORIEN**.
- La formule restant la même (l'ordre des intervalles), seule la note de départ change - et cela change tout le caractère de la gamme!`,
      },
      // Démo: Fretboard avec mode
      {
        type: 'demo',
        component: 'fretboard',
        title: 'Visualisez sur le Manche',
        description: 'Voyez comment les notes du mode se positionnent sur le manche de guitare. Changez de mode pour voir la différence.',
        config: {
          fretboard: {
            root: 'C',
            mode: 'dorian',
            fretCount: 12,
            showAllNotes: false,
          },
        },
      },
      // Résumé des 7 modes
      {
        type: 'text',
        title: 'Les 7 Modes Grecs',
        content: `| Mode | Son | Utilisation |
|------|-----|--------------|
| **Ionien** | Heureux, brillant, stable | Pop, rock, hymnes |
| **Dorien** | Jazzy, soulful, mineur optimiste | Jazz, funk, rock |
| **Phrygien** | Exotique, sombre, dramatique | Flamenco, metal oriental |
| **Lydien** | Rêveur, flottant, magique | Film scores, ambient |
| **Mixolydien** | Bluesy, rock'n'roll | Blues, rock, folk |
| **Éolien** | Triste, mélancolique | Ballades, metal |
| **Locrien** | Tense, instable, menaçant | Metal, horror |`,
      },
      // Quiz
      {
        type: 'quiz',
        questions: [
          {
            id: 'q1',
            question: 'Quel mode est utilisé dans "So What" de Miles Davis?',
            options: ['Ionien', 'Dorien', 'Phrygien', 'Mixolydien'],
            correctAnswer: 1,
            explanation: 'Le thème de "So What" est basé sur le mode Dorien de Ré!',
          },
          {
            id: 'q2',
            question: 'Quel mode a une couleur "magique" et "rêveuse"?',
            options: ['Lydien', 'Éolien', 'Locrien', 'Phrygien'],
            correctAnswer: 0,
            explanation: 'Le mode Lydien avec sa 4te augmentée (#4) donne cette couleur magique.',
          },
          {
            id: 'q3',
            question: 'Quel mode est la gamme mineure naturelle?',
            options: ['Dorien', 'Phrygien', 'Éolien', 'Locrien'],
            correctAnswer: 2,
            explanation: 'Le mode Éolien correspond à la gamme mineure naturelle.',
          },
        ],
        passingScore: 70,
      },
      // Exercice
      {
        type: 'exercise',
        title: 'EXERCICE PRATIQUE',
        instructions: 'Comparez les modes Dorien et Éolien pour sentir la différence.',
        steps: [
          'Enregistrez un accord de LA MINEUR sur 4 mesures',
          'Jouez la gamme de LA DORIEN sur cet accord (LA SI DO RÉ MI FA# SOL LA)',
          'Puis jouez la gamme de LA ÉOLIEN sur le même accord (LA SI DO RÉ MI FA SOL LA)',
          'Comparez comment la simple note FA# vs FA change complètement l\'ambiance!',
        ],
        tips: [
          'Le Dorien a une 6te majeure (FA#) qui le rend plus "optimiste"',
          'L\'Éolien a une 6te mineure (FA) qui le rend plus "triste"',
        ],
      },
    ],
  },

  'cercle-quintes': {
    metadata: {
      id: 'cercle-quintes',
      title: 'Le Cercle des Quintes',
      category: 'THEORY',
      level: 'BEGINNER',
      duration: '20 min',
      xp: 75,
      description: 'Maîtrisez l\'outil le plus puissant pour comprendre les relations harmoniques.',
      topics: ['Cycle des quintes', 'Tonalités voisines', 'Armure', 'Modulation'],
    },
    blocks: [
      {
        type: 'text',
        title: 'INTRODUCTION',
        content: `Le **cercle des quintes** est l'un des outils les plus puissants en théorie musicale. Il visualise les relations entre les 12 tonalités et permet de comprendre:

- Les armures (combien d'altérations par tonalité)
- Les tonalités voisines (facilite les modulations)
- Les accords diatoniques
- Les progressions harmoniques`,
      },
      {
        type: 'demo',
        component: 'circle',
        title: 'Explorez le Cercle des Quintes',
        description: 'Cliquez sur chaque tonalité pour voir les accords diatoniques s\'afficher.',
        config: {
          circle: {
            selectedKey: 'C',
            diatonicChords: ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim'],
            isMinor: false,
          },
        },
      },
      {
        type: 'text',
        title: 'Lire les Armures',
        content: `Le cercle des quintes vous dit instantanément combien d'altérations a chaque tonalité:

**À droite (dièses #):**
- SOL: 1 dièse (FA#)
- RÉ: 2 dièses (FA#, DO#)
- LA: 3 dièses (FA#, DO#, SOL#)
- MI: 4 dièses (FA#, DO#, SOL#, RÉ#)

**À gauche (bémols b):**
- FA: 1 bémol (SIb)
- SIb: 2 bémols (SIb, MIb)
- MIb: 3 bémols (SIb, MIb, LAb)

**Astuce:** La dernière altération ajoutée est la tonique de la tonalité suivante!`,
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'q1',
            question: 'Combien de dièses dans la tonalité de RÉ majeur?',
            options: ['1', '2', '3', '4'],
            correctAnswer: 1,
            explanation: 'RÉ majeur a 2 dièses: FA# et DO#',
          },
          {
            id: 'q2',
            question: 'Quelle tonalité a 3 bémols?',
            options: ['FA', 'SIb', 'MIb', 'LAb'],
            correctAnswer: 2,
            explanation: 'MIb majeur a 3 bémols: SIb, MIb, LAb',
          },
          {
            id: 'q3',
            question: 'Quelle est la tonalité voisine de SOL majeur (une quinte plus haut)?',
            options: ['RÉ', 'LA', 'MI', 'SI'],
            correctAnswer: 0,
            explanation: 'RÉ majeur est une quinte plus haut que SOL (SOL → RÉ)',
          },
        ],
        passingScore: 70,
      },
    ],
  },

  'intervalles-essentiels': {
    metadata: {
      id: 'intervalles-essentiels',
      title: 'Les Intervalles Essentiels',
      category: 'THEORY',
      level: 'BEGINNER',
      duration: '25 min',
      xp: 80,
      description: 'Comprenez et identifiez tous les intervalles. La base de l\'oreille musicale.',
      topics: ['Intervalles simples', 'Intervalles composés', 'Renversement', 'Oreille relative'],
    },
    blocks: [
      {
        type: 'text',
        title: 'INTRODUCTION',
        content: `Un **intervalle** est la distance entre deux notes. C'est la base de la mélodie, de l'harmonie et de l'oreille musicale.

Comprendre les intervalles vous permettra de:
- Identifier des mélodies à l'oreille
- Construire des accords
- Improviser intelligemment`,
      },
      {
        type: 'text',
        title: 'Les Intervalles Simples',
        content: `| Intervalle | Demi-tons | Son | Importance |
|------------|-----------|-----|-------------|
| **Unisson** | 0 | Même note | - |
| **Seconde m.** | 1 | Dissonant | - |
| **Seconde M.** | 2 | Assez dissonant | - |
| **Tierce m.** | 3 | T->riste | ⭐ Base accords mineurs |
| **Tierce M.** | 4 | Heureux | ⭐ Base accords majeurs |
| **Quarte J** | 5 | Stable, tendu | - |
| **Quinte J** | 7 | Puissant, stable | ⭐ Base de l'harmonie |
| **Sixte m.** | 8 | Triste, dramatique | - |
| **Sixte M.** | 9 | Lyrique | - |
| **Septième m.** | 10 | Tendu, bluesy | - |
| **Septième M.** | 11 | Très tendu | - |
| **Octave** | 12 | Consonance parfaite | - |`,
      },
      {
        type: 'demo',
        component: 'fretboard',
        title: 'Visualisez les Intervalles',
        description: 'Le manche de guitare avec les intervalles de la gamme. Les tierces et quintes sont les plus importantes.',
        config: {
          fretboard: {
            root: 'C',
            mode: 'ionian',
            fretCount: 12,
            showAllNotes: true,
          },
        },
      },
      {
        type: 'exercise',
        title: 'EXERCICE D\'OREILLE',
        instructions: 'Entrainez votre oreille à reconnaître les intervalles.',
        steps: [
          'Sur votre guitare/clavier, jouez DO puis MI (tierce majeure)',
          'Puis jouez DO puis MIb (tierce mineure)',
          'Comparez la différence "heureux" vs "triste"',
          'Jouez DO puis SOL (quinte juste) et écoutez la stabilité',
        ],
        tips: [
          'Utilisez une app d\'entraînement oreille (comme Perfect Ear) quotidiennement',
          'Commencez par la tierce (majeure vs mineure) et la quinte',
          'Associez chaque intervalle à une chanson connue',
        ],
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'q1',
            question: 'Combien de demi-tons dans une tierce mineure?',
            options: ['2', '3', '4', '5'],
            correctAnswer: 1,
            explanation: 'Une tierce mineure = 3 demi-tons (ex: DO-MIb)',
          },
          {
            id: 'q2',
            question: 'Quel intervalle est le plus consonant?',
            options: ['Seconde', 'Tierce', 'Quinte', 'Septième'],
            correctAnswer: 2,
            explanation: 'La quinte juste (7 demi-tons) est l\'intervalle le plus consonant',
          },
          {
            id: 'q3',
            question: 'Quel intervalle donne le caractère "heureux" vs "triste"?',
            options: ['Seconde', 'Tierce', 'Quarte', 'Quinte'],
            correctAnswer: 1,
            explanation: 'La tierce définit si un accord est majeur (heureux) ou mineur (triste)',
          },
        ],
        passingScore: 70,
      },
    ],
  },

  'maths-musique': {
    metadata: {
      id: 'maths-musique',
      title: 'Les Maths de la Musique',
      category: 'THEORY',
      level: 'BEGINNER',
      duration: '30 min',
      xp: 100,
      description: 'Comprenez les fondements mathématiques de la musique: fréquences, intervalles et harmoniques.',
      topics: ['Fréquences', 'Ratios harmoniques', 'Série harmonique', 'Tempérament'],
    },
    blocks: [
      {
        type: 'text',
        title: 'INTRODUCTION',
        content: `La musique est profondément mathématique. Chaque note que vous entendez correspond à une **fréquence** (vibration) mesurée en Hertz (Hz).

Comprendre ces mathématiques vous permettra de:
- Comprendre pourquoi certains accords sonnent bien ensemble
- Savoir pourquoi les guitares sont accordées comme elles le sont
- Comprendre la physique du son`,
      },
      {
        type: 'text',
        title: 'La Fréquence du La',
        content: `Le **La3 (A4)** est la note de référence moderne:

**440 Hz** = Vibration du diapason standard

Cela signifie que la vibration de la corde produit 440 allers-retours par seconde.

**Octaves et fréquences:**
- La2: 220 Hz (La3 divisé par 2)
- La3: 440 Hz (référence)
- La4: 880 Hz (La3 multiplié par 2)
- La5: 1760 Hz (La3 multiplié par 4)

**Règle d'or:** Monter d'une octave = doubler la fréquence`,
      },
      {
        type: 'text',
        title: 'Ratios Harmoniques',
        content: `Les intervalles consonants correspondent à des **ratios simples**:

| Intervalle | Ratio | Exemple (Hz) | Consonance |
|------------|-------|--------------|------------|
| **Octave** | 2:1 | 440 → 880 | Parfaite |
| **Quinte** | 3:2 | 440 → 660 | Très consonant |
| **Quarte** | 4:3 | 440 → 587 | Consonant |
| **Tierce M** | 5:4 | 440 → 550 | Heureux |
| **Tierce m** | 6:5 | 440 → 528 | Triste |

Plus le ratio est simple, plus l'intervalle sonne "bien" à l'oreille.`,
      },
      {
        type: 'text',
        title: 'La Série Harmonique',
        content: `Lorsqu'une corde vibre, elle produit non seulement sa note fondamentale, mais aussi une **série d'harmoniques**:

**Harmoniques d'un La (110 Hz):**
1. 110 Hz (fondamentale) - La1
2. 220 Hz (2×) - La2 (octave)
3. 330 Hz (3×) - Mi3 (quinte)
4. 440 Hz (4×) - La3 (octave)
5. 550 Hz (5×) - Do#4 (tierce majeure)
6. 660 Hz (6×) - Mi4 (quinte)

C'est pourquoi la quinte (3:2) et l'octave (2:1) sont si naturelles: elles sont les premières harmoniques après l'octave!`,
      },
      {
        type: 'text',
        title: 'Le Tempérament Égal',
        content: `Problème: Les ratios parfaits ne s'enchaînent pas parfaitement sur 12 notes!

**Exemple du problème:**
- 12 quintes parfaites (3:2) ≠ 7 octaves parfaites (2:1)
- 3:2^12 ≈ 129.746 vs 2^7 = 128

**Solution moderne: Tempérament Égal**
- Diviser l'octave en 12 demi-tons **égaux**
- Chaque demi-tons = 2^(1/12) ≈ 1.05946...
- Ratio de quinte = 2^(7/12) ≈ 1.498 (vs 1.5 parfait)

**Conséquence:** Toutes les tonalités sont jouables, mais aucune n'est "parfaitement" juste.`,
      },
      {
        type: 'text',
        title: 'Pourquoi 12 Notes?',
        content: `Le nombre 12 n'est pas arbitraire! Il vient des mathématiques:

**Approche 1: Approximation de 3:2**
- Combien de fois pour approcher 3:2 avec des puissances de 2?
- 2^19 ≈ 3^12 (524288 ≈ 531441)
- Donc 19 octaves ≈ 12 quintes
- Simplifié: 12 demi-tons dans une octave

**Approche 2: Continuum consonant**
- Avec 12 notes, on a des approximations excellentes de:
  - Quinte (3:2) = 7 demi-tons
  - Quarte (4:3) = 5 demi-tons
  - Tierce (5:4) = 4 demi-tons

Moins de notes = intervalles moins précis
Plus de notes = système trop complexe`,
      },
      {
        type: 'text',
        title: 'Accord de Guitare',
        content: `L'accord standard E-A-D-G-B-E n'est pas un hasard:

**Harmoniques entre cordes à vide:**
- E(6) → A(5) = Quinte parfaite (ratio 3:2)
- A(5) → D(4) = Quinte parfaite (ratio 3:2)
- D(4) → G(3) = Quinte parfaite (ratio 3:2)
- G(3) → B(2) = Tierce majeure (ratio 5:4)
- B(2) → E(1) = Quarte juste (ratio 4:3)

C'est une séquence de quartes et quintes qui maximise les harmoniques naturelles entre cordes adjacentes!`,
      },
      {
        type: 'text',
        title: 'Beats et Dissonance',
        content: `Pourquoi un intervalle dissonant "grince"?

**Phénomène de battement:**
Deux fréquences proches interfèrent et créent des pulsations.

Exemple: 440 Hz et 445 Hz
- Battent à 445 - 440 = 5 fois par seconde
- Audible comme une vibration rapide ("wah-wah-wah")

**Plus le ratio est complexe, plus il y a de battements:**
- Octave (2:1) = Pas de battements = consonance parfaite
- Seconde (ex: 9:8) = Beaucoup de battements = dissonance

C'est la base physique de la consonance et dissonance!`,
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'q1',
            question: 'Quelle est la fréquence du La4 (une octave au-dessus du La3 à 440 Hz)?',
            options: ['550 Hz', '660 Hz', '880 Hz', '1760 Hz'],
            correctAnswer: 2,
            explanation: 'Monter d\'une octave = doubler la fréquence. 440 × 2 = 880 Hz',
          },
          {
            id: 'q2',
            question: 'Quel ratio harmonique correspond à la quinte juste?',
            options: ['2:1', '3:2', '4:3', '5:4'],
            correctAnswer: 1,
            explanation: 'La quinte juste correspond au ratio 3:2, la 2e harmonique après l\'octave',
          },
          {
            id: 'q3',
            question: 'Dans le tempérament égal, combien de demi-tons dans une octave?',
            options: ['10', '11', '12', '14'],
            correctAnswer: 2,
            explanation: 'Le tempérament égal divise l\'octave en 12 demi-tons égaux (2^(1/12) chacun)',
          },
          {
            id: 'q4',
            question: 'Pourquoi la quinte sonne-elle si consonante?',
            options: [
              'C\'est une tradition culturelle',
              'C\'est le ratio 3:2, présent dans la série harmonique',
              'C\'est le plus grand intervalle',
              'C\'est une découverte récente',
            ],
            correctAnswer: 1,
            explanation: 'La quinte (ratio 3:2) est la 2e harmonique naturelle après l\'octave, donc notre cerveau la reconnaît facilement',
          },
          {
            id: 'q5',
            question: 'Quel intervalle correspond au ratio 5:4?',
            options: ['Quarte', 'Quinte', 'Tierce majeure', 'Tierce mineure'],
            correctAnswer: 2,
            explanation: 'Le ratio 5:4 correspond à la tierce majeure, qui donne le caractère "heureux" aux accords',
          },
        ],
        passingScore: 70,
      },
      {
        type: 'exercise',
        title: 'EXERCICE PRATIQUE - Entendez les Harmoniques',
        instructions: 'Utilisez une guitare pour entendre la série harmonique.',
        steps: [
          'Jouez la corde de La (5e corde) à vide',
          'Effleurez doucement la corde au-dessus de la 12e frette et jouez - vous entendez l\'octave (harmonique 2)',
          'Effleurez au-dessus de la 7e frette - vous entendez la quinte (harmonique 3)',
          'Effleurez au-dessus de la 5e frette - vous entendez la double octave (harmonique 4)',
          'Comparez: ces harmoniques sont toutes "contenues" dans une seule note à vide!',
        ],
        tips: [
          'Les harmoniques de guitare sont la preuve physique de la série harmonique',
          'Chaque note que vous jouez contient virtuellement toutes ces harmoniques',
          'C\'est pourquoi un accord de La majeur "résonne": il utilise ces harmoniques naturelles',
        ],
      },
    ],
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Récupère une leçon par son ID
 */
export function getLesson(id: string): Lesson | null {
  return LESSONS_CONTENT[id as keyof typeof LESSONS_CONTENT] || null;
}

/**
 * Récupère toutes les métadonnées des leçons
 */
export function getAllLessonsMetadata(): LessonMetadata[] {
  return Object.values(LESSONS_CONTENT).map(lesson => lesson.metadata);
}

/**
 * Récupère les leçons par catégorie
 */
export function getLessonsByCategory(category: LessonMetadata['category']): Lesson[] {
  return Object.values(LESSONS_CONTENT).filter(
    lesson => lesson.metadata.category === category
  );
}

/**
 * Récupère les leçons par niveau
 */
export function getLessonsByLevel(level: LessonMetadata['level']): Lesson[] {
  return Object.values(LESSONS_CONTENT).filter(
    lesson => lesson.metadata.level === level
  );
}
