// ============================================================================
// CHORD VARIANTS - Voicings d'accords par degré
// ============================================================================
/**
 * ADAGIO - Chord Variants Data
 * Base complète des voicings d'accords par degré diatonique
 *
 * Contient:
 * - Positions CAGED complètes pour chaque degré
 * - Renversements avec doigtés suggérés
 * - Difficulté et type de chaque variante
 * - Compatible avec le système de types @adagio/types
 */

import type { NoteName } from '@adagio/types';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Type de variante d'accord
 */
export type VariantType =
  | 'open' // Position ouverte (0-3 frettes)
  | 'closed' // Position fermée (barré)
  | 'moveable' // Forme déplaçable sans barré
  | 'inversion-1st' // 1er renversement
  | 'inversion-2nd' // 2ème renversement
  | 'inversion-3rd' // 3ème renversement (accords 7 notes)
  | 'shell' // Voicing shell (3+7 ou 7+3)
  | 'spread' // Voicing écarté (drop 2, drop 3)
  | 'power' // Power chord (1+5)
  | 'simplified'; // Version simplifiée

/**
 * Niveau de difficulté
 */
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

/**
 * Position d'une corde sur le manche
 * - number: case (0 = corde à vide, 1-24 = cases)
 * - null: corde étouffée/non jouée
 * - 'x': corde à ne pas jouer (notation alternative)
 */
export type StringPosition = number | null;

/**
 * Doigt suggéré pour une position
 * - 1-4: index, majeur, annulaire, auriculaire
 * - 0: pouce (pour certaines positions jazz/classNameical)
 * - null: pas de doigt spécifié
 */
export type FingerSuggestion = 0 | 1 | 2 | 3 | 4 | null;

/**
 * Variante complète d'un accord
 */
export interface ChordVariant {
  /** Identifiant unique de la variante */
  id: string;
  /** Nom descriptif de la position */
  name: string;
  /** Type de variante */
  type: VariantType;
  /** Positions sur les 6 cordes (du mi aigu au mi grave) */
  frets: [
    StringPosition,
    StringPosition,
    StringPosition,
    StringPosition,
    StringPosition,
    StringPosition,
  ];
  /** Doigtés suggérés (optionnel) */
  fingers?: [
    FingerSuggestion,
    FingerSuggestion,
    FingerSuggestion,
    FingerSuggestion,
    FingerSuggestion,
    FingerSuggestion,
  ];
  /** Forme CAGED associée (si applicable) */
  shape?: 'C' | 'A' | 'G' | 'E' | 'D';
  /** Numéro de case où commence la forme (pour barrés) */
  startFret?: number;
  /** Difficulté de la position */
  difficulty: DifficultyLevel;
  /** Description technique */
  description: string;
  /** Notes de l'accord dans cette position (optionnel) */
  notes?: string[];
}

/**
 * Collection de variantes pour un degré donné
 */
export interface DegreeChordVariants {
  /** Degré (0-6) */
  degree: number;
  /** Numéral romain */
  numeral: string;
  /** Fonction harmonique */
  function: 'tonic' | 'subdominant' | 'dominant';
  /** Toutes les variantes disponibles */
  variants: ChordVariant[];
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Crée un identifiant unique pour une variante
 */
function variantId(degree: number, type: VariantType, index: number): string {
  return `degree-${degree}-${type}-${index}`;
}

/**
 * Obtient les frets de base pour un accord majeur ouvert
 */
function getOpenMajorFrets(root: NoteName): ChordVariant['frets'] {
  const baseMap: Record<string, ChordVariant['frets']> = {
    C: [0, 3, 2, 0, 1, 0],
    D: [null, null, 0, 2, 3, 2],
    E: [0, 2, 2, 1, 0, 0],
    F: [null, null, 3, 2, 1, 1],
    G: [3, 2, 0, 0, 0, 3],
    A: [null, 0, 2, 2, 2, 0],
    B: [null, null, null, 4, 4, 4],
  };
  return baseMap[root] || [null, null, null, null, null, null];
}

/**
 * Obtient les frets de base pour un accord mineur ouvert
 */
function getOpenMinorFrets(root: NoteName): ChordVariant['frets'] {
  const baseMap: Record<string, ChordVariant['frets']> = {
    C: [null, null, null, null, 1, 0],
    D: [null, null, 0, 2, 3, 1],
    E: [0, 2, 2, 0, 0, 0],
    F: [1, 3, 3, 1, 1, 1],
    G: [3, 5, 5, 3, 3, 3],
    A: [null, 0, 2, 2, 1, 0],
    B: [null, null, null, 4, 3, 2],
  };
  return baseMap[root] || [null, null, null, null, null, null];
}

/**
 * Obtient les frets pour un accord diminué
 */
function getDiminishedFrets(root: NoteName, isOpen: boolean): ChordVariant['frets'] {
  if (isOpen) {
    const openMap: Record<string, ChordVariant['frets']> = {
      B: [null, null, null, 2, 0, 1],
      D: [null, null, 0, 1, 0, null],
    };
    return openMap[root] || [null, null, null, null, null, null];
  }

  // Forme déplaçable (pattern 1332)
  return [null, null, 3, 1, 3, 2];
}

// ============================================================================
// CHORD VARIANTS BY DEGREE
// ============================================================================

/**
 * Variantes pour le degré I (tonique) - Accord majeur
 */
export function getDegreeIVariants(root: NoteName): DegreeChordVariants {
  const openFrets = getOpenMajorFrets(root);

  const variants: ChordVariant[] = [
    // Position ouverte de base
    {
      id: variantId(0, 'open', 0),
      name: 'Position ouverte',
      type: 'open',
      frets: openFrets,
      fingers: [null, 3, 2, null, 1, null],
      difficulty: 'beginner',
      description: 'Position fondamentale, la plus simple',
    },
    // Forme C décalée (CAGED)
    {
      id: variantId(0, 'moveable', 0),
      name: 'Forme C (CAGED)',
      type: 'moveable',
      frets: [null, null, null, 5, 5, 3],
      fingers: [null, null, null, 2, 1, 3],
      shape: 'C',
      startFret: 3,
      difficulty: 'intermediate',
      description: 'Forme C déplaçable, commence à la 3ème case',
    },
    // Forme A (barré partiel)
    {
      id: variantId(0, 'closed', 0),
      name: 'Forme A (barré partiel)',
      type: 'closed',
      frets: [null, null, null, 2, 2, 1],
      fingers: [null, null, null, 3, 4, 1],
      shape: 'A',
      startFret: 1,
      difficulty: 'intermediate',
      description: 'Barré partiel sur les cordes aiguües',
    },
    // Forme G
    {
      id: variantId(0, 'moveable', 1),
      name: 'Forme G (CAGED)',
      type: 'moveable',
      frets: [3, 2, 0, 0, 0, 3],
      fingers: [3, 2, null, null, null, 4],
      shape: 'G',
      difficulty: 'beginner',
      description: 'Forme G naturelle',
    },
    // Forme E (barré complet)
    {
      id: variantId(0, 'closed', 1),
      name: 'Forme E (barré complet)',
      type: 'closed',
      frets: [null, null, 1, 3, 3, 2],
      fingers: [null, null, 1, 3, 4, 2],
      shape: 'E',
      startFret: 1,
      difficulty: 'intermediate',
      description: 'Barré complet, forme E décalée',
    },
    // Forme D
    {
      id: variantId(0, 'moveable', 2),
      name: 'Forme D (CAGED)',
      type: 'moveable',
      frets: [null, null, null, 2, 3, 2],
      fingers: [null, null, null, 1, 3, 2],
      shape: 'D',
      difficulty: 'beginner',
      description: 'Forme D sur les 4 cordes aiguües',
    },
    // 1er renversement
    {
      id: variantId(0, 'inversion-1st', 0),
      name: '1er renversement (3 à la basse)',
      type: 'inversion-1st',
      frets: [null, null, null, null, 1, null],
      fingers: [null, null, null, null, 1, null],
      difficulty: 'intermediate',
      description: 'La tierce à la basse, son subtil',
    },
    // 2ème renversement
    {
      id: variantId(0, 'inversion-2nd', 0),
      name: '2ème renversement (5 à la basse)',
      type: 'inversion-2nd',
      frets: [null, null, null, null, null, 3],
      fingers: [null, null, null, null, null, 3],
      difficulty: 'intermediate',
      description: 'La quinte à la basse',
    },
    // Voicing shell (1ère inversion simplifiée)
    {
      id: variantId(0, 'shell', 0),
      name: 'Shell voicing (3+7)',
      type: 'shell',
      frets: [null, null, null, null, 1, 0],
      fingers: [null, null, null, null, 1, null],
      difficulty: 'advanced',
      description: 'Jazz: tierce et septième seulement',
    },
    // Power chord
    {
      id: variantId(0, 'power', 0),
      name: 'Power chord (1+5)',
      type: 'power',
      frets: [null, null, null, 2, 2, null],
      fingers: [null, null, null, 1, 1, null],
      difficulty: 'beginner',
      description: 'Rock/metal: fondamentale + quinte',
    },
  ];

  return {
    degree: 0,
    numeral: 'I',
    function: 'tonic',
    variants,
  };
}

/**
 * Variantes pour le degré ii (pré-dominante) - Accord mineur
 */
export function getDegreeIiVariants(root: NoteName): DegreeChordVariants {
  const openFrets = getOpenMinorFrets(root);

  const variants: ChordVariant[] = [
    // Position ouverte
    {
      id: variantId(1, 'open', 0),
      name: 'Position ouverte',
      type: 'open',
      frets: openFrets,
      fingers: [null, 2, 2, null, 1, null],
      difficulty: 'beginner',
      description: 'Position mineure fondamentale',
    },
    // Forme Am (CAGED)
    {
      id: variantId(1, 'moveable', 0),
      name: 'Forme Am (CAGED)',
      type: 'moveable',
      frets: [null, null, null, 2, 2, 1],
      fingers: [null, null, null, 3, 4, 1],
      shape: 'A',
      startFret: 1,
      difficulty: 'intermediate',
      description: 'Forme A mineur déplaçable',
    },
    // Forme Em
    {
      id: variantId(1, 'moveable', 1),
      name: 'Forme Em (CAGED)',
      type: 'moveable',
      frets: [0, 2, 2, 0, 0, 0],
      fingers: [null, 2, 3, null, null, null],
      shape: 'E',
      difficulty: 'beginner',
      description: 'Forme E mineur',
    },
    // Barré mineur
    {
      id: variantId(1, 'closed', 0),
      name: 'Barré mineur (forme Em)',
      type: 'closed',
      frets: [null, null, 1, 3, 3, 1],
      fingers: [null, null, 1, 3, 4, 1],
      shape: 'E',
      startFret: 1,
      difficulty: 'advanced',
      description: 'Barré complet mineur',
    },
    // Forme Dm
    {
      id: variantId(1, 'moveable', 2),
      name: 'Forme Dm (CAGED)',
      type: 'moveable',
      frets: [null, null, 0, 2, 3, 1],
      fingers: [null, null, null, 2, 3, 1],
      shape: 'D',
      difficulty: 'beginner',
      description: 'Forme D mineur',
    },
    // 1er renversement
    {
      id: variantId(1, 'inversion-1st', 0),
      name: '1er renversement (b3 à la basse)',
      type: 'inversion-1st',
      frets: [null, null, null, null, 1, null],
      fingers: [null, null, null, null, 1, null],
      difficulty: 'intermediate',
      description: 'La petite tierce à la basse',
    },
    // Shell voicing jazz
    {
      id: variantId(1, 'shell', 0),
      name: 'Shell m7 (b3+7)',
      type: 'shell',
      frets: [null, null, null, null, 1, null],
      fingers: [null, null, null, null, 1, null],
      difficulty: 'advanced',
      description: 'Jazz: b3 et b7 seulement',
    },
  ];

  return {
    degree: 1,
    numeral: 'ii',
    function: 'subdominant',
    variants,
  };
}

/**
 * Variantes pour le degré iii (médiant) - Accord mineur ou majeur selon mode
 */
export function getDegreeIiiVariants(root: NoteName, isMinorMode: boolean): DegreeChordVariants {
  const variants: ChordVariant[] = [];

  if (isMinorMode) {
    // III en mineur = accord majeur (relative)
    const openFrets = getOpenMajorFrets(root);
    variants.push(
      {
        id: variantId(2, 'open', 0),
        name: 'Position ouverte (majeur)',
        type: 'open',
        frets: openFrets,
        fingers: [null, 3, 2, null, 1, null],
        difficulty: 'beginner',
        description: 'Relative majeure, son lumineux',
      },
      {
        id: variantId(2, 'moveable', 0),
        name: 'Barré majeur',
        type: 'closed',
        frets: [null, null, 1, 3, 3, 2],
        fingers: [null, null, 1, 3, 4, 2],
        shape: 'E',
        startFret: 1,
        difficulty: 'intermediate',
        description: 'Forme E majeur déplaçable',
      }
    );
  } else {
    // iii en majeur = accord mineur
    const openFrets = getOpenMinorFrets(root);
    variants.push(
      {
        id: variantId(2, 'open', 0),
        name: 'Position ouverte (mineur)',
        type: 'open',
        frets: openFrets,
        fingers: [null, 2, 2, null, 1, null],
        difficulty: 'beginner',
        description: 'Médiant mineur, nostalgique',
      },
      {
        id: variantId(2, 'moveable', 0),
        name: 'Barré mineur',
        type: 'closed',
        frets: [null, null, 1, 3, 3, 1],
        fingers: [null, null, 1, 3, 4, 1],
        shape: 'E',
        startFret: 1,
        difficulty: 'advanced',
        description: 'Forme Em déplaçable',
      }
    );
  }

  return {
    degree: 2,
    numeral: isMinorMode ? 'III' : 'iii',
    function: 'tonic',
    variants,
  };
}

/**
 * Variantes pour le degré IV (sous-dominante) - Accord majeur
 */
export function getDegreeIvVariants(root: NoteName): DegreeChordVariants {
  const openFrets = getOpenMajorFrets(root);

  const variants: ChordVariant[] = [
    {
      id: variantId(3, 'open', 0),
      name: 'Position ouverte',
      type: 'open',
      frets: openFrets,
      fingers: [null, 3, 2, null, 1, null],
      difficulty: 'beginner',
      description: 'Sous-dominante majeure',
    },
    {
      id: variantId(3, 'moveable', 0),
      name: 'Forme D (CAGED)',
      type: 'moveable',
      frets: [null, null, null, 2, 3, 2],
      fingers: [null, null, null, 1, 3, 2],
      shape: 'D',
      difficulty: 'beginner',
      description: 'Forme D classique',
    },
    {
      id: variantId(3, 'moveable', 1),
      name: 'Forme C décalée',
      type: 'moveable',
      frets: [null, null, null, 5, 5, 3],
      fingers: [null, null, null, 2, 1, 3],
      shape: 'C',
      startFret: 3,
      difficulty: 'intermediate',
      description: 'Forme C déplaçable',
    },
    {
      id: variantId(3, 'closed', 0),
      name: 'Barré forme E',
      type: 'closed',
      frets: [null, null, 1, 3, 3, 2],
      fingers: [null, null, 1, 3, 4, 2],
      shape: 'E',
      startFret: 1,
      difficulty: 'intermediate',
      description: 'Barré complet',
    },
    {
      id: variantId(3, 'inversion-1st', 0),
      name: '1er renversement',
      type: 'inversion-1st',
      frets: [null, null, null, null, 1, null],
      fingers: [null, null, null, null, 1, null],
      difficulty: 'intermediate',
      description: 'Tierce à la basse',
    },
    {
      id: variantId(3, 'shell', 0),
      name: 'Shell voicing',
      type: 'shell',
      frets: [null, null, null, null, null, 0],
      fingers: [null, null, null, null, null, null],
      difficulty: 'advanced',
      description: '3 et 7 seulement',
    },
  ];

  return {
    degree: 3,
    numeral: 'IV',
    function: 'subdominant',
    variants,
  };
}

/**
 * Variantes pour le degré V (dominante) - Accord majeur
 */
export function getDegreeVVariants(root: NoteName): DegreeChordVariants {
  const openFrets = getOpenMajorFrets(root);

  const variants: ChordVariant[] = [
    {
      id: variantId(4, 'open', 0),
      name: 'Position ouverte',
      type: 'open',
      frets: openFrets,
      fingers: [null, 3, 2, null, 1, null],
      difficulty: 'beginner',
      description: 'Dominante fondamentale',
    },
    {
      id: variantId(4, 'open', 1),
      name: 'Position ouverte (forme E)',
      type: 'open',
      frets: [0, 2, 2, 1, 0, 0],
      fingers: [null, 2, 3, 1, null, null],
      shape: 'E',
      difficulty: 'beginner',
      description: 'Pour les tonalités avec V = E ou A',
    },
    {
      id: variantId(4, 'moveable', 0),
      name: 'Barré forme E',
      type: 'closed',
      frets: [null, null, 1, 3, 3, 2],
      fingers: [null, null, 1, 3, 4, 2],
      shape: 'E',
      startFret: 1,
      difficulty: 'intermediate',
      description: 'Barré complet, très utilisé',
    },
    {
      id: variantId(4, 'moveable', 1),
      name: 'Forme A (barré partiel)',
      type: 'closed',
      frets: [null, null, null, 2, 2, 1],
      fingers: [null, null, null, 3, 4, 1],
      shape: 'A',
      startFret: 1,
      difficulty: 'intermediate',
      description: 'Barré partiel, plus facile',
    },
    {
      id: variantId(4, 'moveable', 2),
      name: 'Forme D',
      type: 'moveable',
      frets: [null, null, null, 2, 3, 2],
      fingers: [null, null, null, 1, 3, 2],
      shape: 'D',
      difficulty: 'beginner',
      description: 'Sur 4 cordes',
    },
    {
      id: variantId(4, 'power', 0),
      name: 'Power chord',
      type: 'power',
      frets: [null, null, null, 2, 2, null],
      fingers: [null, null, null, 1, 1, null],
      difficulty: 'beginner',
      description: 'Rock/blues: 1 + 5',
    },
    {
      id: variantId(4, 'inversion-2nd', 0),
      name: '2ème renversement',
      type: 'inversion-2nd',
      frets: [null, null, null, null, null, 3],
      fingers: [null, null, null, null, null, 3],
      difficulty: 'intermediate',
      description: 'Quinte à la basse, très stable',
    },
  ];

  return {
    degree: 4,
    numeral: 'V',
    function: 'dominant',
    variants,
  };
}

/**
 * Variantes pour le degré vi (sus-tonique) - Accord mineur
 */
export function getDegreeViVariants(root: NoteName, isMinorMode: boolean): DegreeChordVariants {
  const variants: ChordVariant[] = [];

  if (isMinorMode) {
    // VI en mineur = accord majeur (relative)
    const openFrets = getOpenMajorFrets(root);
    variants.push(
      {
        id: variantId(5, 'open', 0),
        name: 'Position ouverte (majeur)',
        type: 'open',
        frets: openFrets,
        fingers: [null, 3, 2, null, 1, null],
        difficulty: 'beginner',
        description: 'Relative majeure',
      },
      {
        id: variantId(5, 'moveable', 0),
        name: 'Barré majeur',
        type: 'closed',
        frets: [null, null, 1, 3, 3, 2],
        fingers: [null, null, 1, 3, 4, 2],
        shape: 'E',
        startFret: 1,
        difficulty: 'intermediate',
        description: 'Forme E déplaçable',
      }
    );
  } else {
    // vi en majeur = accord mineur
    const openFrets = getOpenMinorFrets(root);
    variants.push(
      {
        id: variantId(5, 'open', 0),
        name: 'Position ouverte (mineur)',
        type: 'open',
        frets: openFrets,
        fingers: [null, 2, 2, null, 1, null],
        difficulty: 'beginner',
        description: 'Sus-tonique mineure, émotive',
      },
      {
        id: variantId(5, 'moveable', 0),
        name: 'Barré mineur',
        type: 'closed',
        frets: [null, null, 1, 3, 3, 1],
        fingers: [null, null, 1, 3, 4, 1],
        shape: 'E',
        startFret: 1,
        difficulty: 'advanced',
        description: 'Forme Em déplaçable',
      },
      {
        id: variantId(5, 'moveable', 1),
        name: 'Forme Dm',
        type: 'moveable',
        frets: [null, null, 0, 2, 3, 1],
        fingers: [null, null, null, 2, 3, 1],
        shape: 'D',
        difficulty: 'beginner',
        description: 'Forme D mineur',
      }
    );
  }

  return {
    degree: 5,
    numeral: isMinorMode ? 'VI' : 'vi',
    function: 'tonic',
    variants,
  };
}

/**
 * Variantes pour le degré vii° (note sensible) - Accord diminué
 */
export function getDegreeViiVariants(root: NoteName): DegreeChordVariants {
  const openFrets = getDiminishedFrets(root, true);

  const variants: ChordVariant[] = [
    {
      id: variantId(6, 'open', 0),
      name: 'Position ouverte (si possible)',
      type: 'open',
      frets: openFrets,
      fingers: [null, null, null, 1, null, 1],
      difficulty: 'intermediate',
      description: 'Diminué ouvert (tonalités spécifiques)',
    },
    {
      id: variantId(6, 'moveable', 0),
      name: 'Forme déplaçable (pattern 1332)',
      type: 'moveable',
      frets: [null, null, 3, 1, 3, 2],
      fingers: [null, null, 3, 1, 4, 2],
      difficulty: 'intermediate',
      description: 'Pattern 4 cordes déplaçable',
    },
    {
      id: variantId(6, 'moveable', 1),
      name: 'Forme 4 cordes (pattern 2342)',
      type: 'moveable',
      frets: [null, null, null, 2, 3, 4],
      fingers: [null, null, null, 1, 2, 3],
      difficulty: 'intermediate',
      description: 'Variante 4 cordes',
    },
    {
      id: variantId(6, 'simplified', 0),
      name: 'Version simplifiée (3 notes)',
      type: 'simplified',
      frets: [null, null, null, null, 3, 2],
      fingers: [null, null, null, null, 2, 1],
      difficulty: 'beginner',
      description: 'Seulement 1, b3, b5',
    },
    {
      id: variantId(6, 'simplified', 1),
      name: 'Version 2 notes (triton)',
      type: 'simplified',
      frets: [null, null, null, null, 3, null],
      fingers: [null, null, null, null, 2, null],
      difficulty: 'beginner',
      description: 'Triton seulement (1 et b5)',
    },
  ];

  return {
    degree: 6,
    numeral: 'vii°',
    function: 'dominant',
    variants,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * Obtient toutes les variantes pour tous les degrés d'une tonalité
 */
export function getAllDegreeVariants(
  key: NoteName,
  mode: 'major' | 'minor' = 'major'
): DegreeChordVariants[] {
  // Calculer les notes de la gamme pour avoir les fondamentales
  const sharpChromatic: NoteName[] = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
  ];
  const flatChromatic: NoteName[] = [
    'C',
    'Db',
    'D',
    'Eb',
    'E',
    'F',
    'Gb',
    'G',
    'Ab',
    'A',
    'Bb',
    'B',
  ];

  const useFlats = ['Db', 'Eb', 'Gb', 'Ab', 'Bb', 'F'].includes(key);
  const chromatic = useFlats ? flatChromatic : sharpChromatic;
  const keyIndex = chromatic.indexOf(key);

  // Intervalles de la gamme majeure
  const majorIntervals = [0, 2, 4, 5, 7, 9, 11];
  // Intervalles de la gamme mineure naturelle
  const minorIntervals = [0, 2, 3, 5, 7, 8, 10];

  const intervals = mode === 'major' ? majorIntervals : minorIntervals;

  // Obtenir les notes de chaque degré
  const degreeNotes = intervals.map((i) => chromatic[(keyIndex + i) % 12]!);

  return [
    getDegreeIVariants(degreeNotes[0]!),
    getDegreeIiVariants(degreeNotes[1]!),
    getDegreeIiiVariants(degreeNotes[2]!, mode === 'minor'),
    getDegreeIvVariants(degreeNotes[3]!),
    getDegreeVVariants(degreeNotes[4]!),
    getDegreeViVariants(degreeNotes[5]!, mode === 'minor'),
    getDegreeViiVariants(degreeNotes[6]!),
  ];
}

/**
 * Recherche une variante par son ID
 */
export function findVariantById(
  key: NoteName,
  mode: 'major' | 'minor',
  variantId: string
): ChordVariant | null {
  const allVariants = getAllDegreeVariants(key, mode);
  for (const degree of allVariants) {
    const found = degree.variants.find((v) => v.id === variantId);
    if (found) return found;
  }
  return null;
}

/**
 * Filtre les variantes par difficulté
 */
export function filterByDifficulty(
  variants: ChordVariant[],
  maxDifficulty: DifficultyLevel
): ChordVariant[] {
  const difficultyOrder: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'];
  const maxIndex = difficultyOrder.indexOf(maxDifficulty);

  return variants.filter((v) => {
    const index = difficultyOrder.indexOf(v.difficulty);
    return index <= maxIndex;
  });
}

/**
 * Filtre les variantes par type
 */
export function filterByType(variants: ChordVariant[], types: VariantType[]): ChordVariant[] {
  return variants.filter((v) => types.includes(v.type));
}
