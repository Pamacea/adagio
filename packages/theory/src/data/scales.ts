// ============================================================================
// SCALES DATA - Scale definitions with intervals
// ============================================================================

import type { Interval } from '@adagio/types';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Types de gammes disponibles
 */
export type ScaleType =
  | 'major' | 'minor'
  | 'harmonicMajor' | 'harmonicMinor'
  | 'melodicMajor' | 'melodicMinor'
  | 'pentatonicMajor' | 'pentatonicMinor'
  | 'blues'
  | 'dorian' | 'phrygian' | 'lydian' | 'mixolydian' | 'locrian'
  | 'napolitanMajor' | 'napolitanMinor'
  | 'augmentedMajor' | 'augmentedMinor'
  | 'wholeTone' | 'diminished'
  | 'chromatic';

/**
 * Définition d'une gamme
 */
export interface ScaleDefinition {
  id: ScaleType;
  name: string;
  nameFr: string;
  description: string;
  intervals: Interval[];
}

// ============================================================================
// SCALE INTERVALS
// ============================================================================

/**
 * Intervalles pour les gammes
 */
export const SCALE_INTERVALS: Record<ScaleType, Interval[]> = {
  // Gammes majeures
  major: ['1', '2', '3', '4', '5', '6', '7'],
  harmonicMajor: ['1', '2', '3', '4', '5', 'b6', '7'],
  melodicMajor: ['1', '2', '3', '4', '5', '6', '7'], // Ascending
  lydian: ['1', '2', '3', '#4', '5', '6', '7'],
  mixolydian: ['1', '2', '3', '4', '5', '6', 'b7'],
  // Gammes mineures
  minor: ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
  harmonicMinor: ['1', '2', 'b3', '4', '5', 'b6', '7'],
  melodicMinor: ['1', '2', 'b3', '4', '5', '6', '7'], // Ascending (jazz)
  dorian: ['1', '2', 'b3', '4', '5', '6', 'b7'],
  phrygian: ['1', 'b2', 'b3', '4', '5', 'b6', 'b7'],
  locrian: ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7'],
  // Napolitain
  napolitanMajor: ['1', 'b2', 'b3', '4', '5', 'b6', 'b7'],
  napolitanMinor: ['1', 'b2', 'b3', '4', '5', 'b6', '7'],
  // Gammes augmentées et spéciales
  augmentedMajor: ['1', '2', '3', '#4', '5', '#6', '7'], // Lydien #5
  augmentedMinor: ['1', '2', 'b3', '4', '#5', '6', '7'],   // Mineure #5
  wholeTone: ['1', '2', '3', '#4', '#5', '#6', 'b7'],      // Gamme par tons
  diminished: ['1', 'b2', 'b3', 'b4', 'b5', 'bb6', 'bb7'],  // Diminuée (symétrique)
  chromatic: ['1', '#1', '2', '#2', '3', '#3', '4', '#4', '5', '#5', '6', '#6'], // 12 demi-tons
  // Pentatoniques & Blues
  pentatonicMajor: ['1', '2', '3', '5', '6'],
  pentatonicMinor: ['1', 'b3', '4', '5', 'b7'],
  blues: ['1', 'b3', '4', '#4', '5', 'b7'],
};

// ============================================================================
// SCALE DEFINITIONS
// ============================================================================

/**
 * Définition des gammes avec métadonnées
 */
export const SCALES: ScaleDefinition[] = [
  // === GAMMES MAJEURES ===
  {
    id: 'major',
    name: 'Major Scale (Ionian)',
    nameFr: 'Majeure (Ionien)',
    description: 'La gamme de référence, heureuse et stable',
    intervals: SCALE_INTERVALS.major,
  },
  {
    id: 'lydian',
    name: 'Lydian',
    nameFr: 'Lydien (#4)',
    description: 'Dreamy, spatial, comme un rêve éveillé',
    intervals: SCALE_INTERVALS.lydian,
  },
  {
    id: 'mixolydian',
    name: 'Mixolydian',
    nameFr: 'Mixolydien (b7)',
    description: 'Rock, bluesy, dominante sans tension finale',
    intervals: SCALE_INTERVALS.mixolydian,
  },
  {
    id: 'harmonicMajor',
    name: 'Harmonic Major',
    nameFr: 'Majeur Harmonique (b6)',
    description: 'Exotique, mystérieux, comme une romance espagnole',
    intervals: SCALE_INTERVALS.harmonicMajor,
  },
  {
    id: 'melodicMajor',
    name: 'Melodic Major',
    nameFr: 'Majeur Mélodique',
    description: 'Ascendant, jazz moderne, brightness contrôlée',
    intervals: SCALE_INTERVALS.melodicMajor,
  },
  // === GAMMES MINEURES ===
  {
    id: 'minor',
    name: 'Natural Minor (Aeolian)',
    nameFr: 'Mineure Naturelle (Éolien)',
    description: 'Mélancolique, émotionnelle, la relative de la majeure',
    intervals: SCALE_INTERVALS.minor,
  },
  {
    id: 'dorian',
    name: 'Dorian',
    nameFr: 'Dorien (b3, b7)',
    description: 'Jazz, soulful, brighter que la mineure naturelle',
    intervals: SCALE_INTERVALS.dorian,
  },
  {
    id: 'phrygian',
    name: 'Phrygian',
    nameFr: 'Phrygien (b2, b6, b7)',
    description: 'Flamenco, espagnol, dark et exotique',
    intervals: SCALE_INTERVALS.phrygian,
  },
  {
    id: 'harmonicMinor',
    name: 'Harmonic Minor',
    nameFr: 'Mineur Harmonique (7)',
    description: 'Classique, metal, néo-classique, tension dramatique',
    intervals: SCALE_INTERVALS.harmonicMinor,
  },
  {
    id: 'melodicMinor',
    name: 'Melodic Minor (Ascending)',
    nameFr: 'Mineur Mélodique (Ascendant)',
    description: 'Jazz, ascending, 6 et 7 majeurs',
    intervals: SCALE_INTERVALS.melodicMinor,
  },
  {
    id: 'locrian',
    name: 'Locrian',
    nameFr: 'Locrien (b5)',
    description: 'Instable, tensé, seldom used as tonal center',
    intervals: SCALE_INTERVALS.locrian,
  },
  // === GAMMES NAPOLITAINES ===
  {
    id: 'napolitanMajor',
    name: 'Neapolitan Major',
    nameFr: 'Napolitain Majeur (b2, b3, b6, b7)',
    description: 'Exotique, dramatique, usage rare en métal',
    intervals: SCALE_INTERVALS.napolitanMajor,
  },
  {
    id: 'napolitanMinor',
    name: 'Neapolitan Minor',
    nameFr: 'Napolitain Mineur (b2, b3, b6, 7)',
    description: 'Dark exotique, utilisé dans le metal oriental',
    intervals: SCALE_INTERVALS.napolitanMinor,
  },
  // === PENTATONIQUES & BLUES ===
  {
    id: 'pentatonicMajor',
    name: 'Pentatonic Major',
    nameFr: 'Pentatonique Majeure',
    description: 'Gamme joyeuse à 5 notes, très utilisée en rock et country',
    intervals: SCALE_INTERVALS.pentatonicMajor,
  },
  {
    id: 'pentatonicMinor',
    name: 'Pentatonic Minor',
    nameFr: 'Pentatonique Mineure',
    description: 'La gamme du blues et du rock, essentielle pour improviser',
    intervals: SCALE_INTERVALS.pentatonicMinor,
  },
  {
    id: 'blues',
    name: 'Blues Scale',
    nameFr: 'Blues (avec blue note)',
    description: 'Pentatonique mineure + blue note (#4) pour plus de couleur',
    intervals: SCALE_INTERVALS.blues,
  },
  // === SYMÉTRIQUES & SPÉCIALES ===
  {
    id: 'wholeTone',
    name: 'Whole Tone Scale',
    nameFr: 'Gamme Par Tons (Symétrique)',
    description: 'Intervalle de ton constant, son flottant et onirique (Debussy)',
    intervals: SCALE_INTERVALS.wholeTone,
  },
  {
    id: 'diminished',
    name: 'Diminished Scale (Octatonic)',
    nameFr: 'Diminuée (2 POS - Symétrique)',
    description: 'Alterne ton/demi-ton, usage jazz et metal moderne',
    intervals: SCALE_INTERVALS.diminished,
  },
  {
    id: 'augmentedMajor',
    name: 'Augmented Major Scale',
    nameFr: 'Majeure Augmentée (Lydien ♯5)',
    description: 'Son mystérieux, comme un suspens permanent',
    intervals: SCALE_INTERVALS.augmentedMajor,
  },
  {
    id: 'augmentedMinor',
    name: 'Augmented Minor / Hungarian Minor',
    nameFr: 'Hongrois Mineur (♯5)',
    description: 'Gamme tzigane/exotique avec quinte augmentée',
    intervals: SCALE_INTERVALS.augmentedMinor,
  },
  {
    id: 'chromatic',
    name: 'Chromatic Scale',
    nameFr: 'Chromatique (12 demi-tons)',
    description: 'Toutes les notes, usage atonal et expressionniste',
    intervals: SCALE_INTERVALS.chromatic,
  },
];

// ============================================================================
// SCALE CATEGORIES
// ============================================================================

/**
 * Organisation des gammes par catégorie pour l'UI
 */
export const SCALE_CATEGORIES = [
  { name: 'Majeures', ids: ['major', 'lydian', 'mixolydian', 'harmonicMajor', 'melodicMajor'] as ScaleType[] },
  { name: 'Mineures', ids: ['minor', 'dorian', 'phrygian', 'harmonicMinor', 'melodicMinor', 'locrian'] as ScaleType[] },
  { name: 'Napolitaines', ids: ['napolitanMajor', 'napolitanMinor'] as ScaleType[] },
  { name: 'Pentatoniques & Blues', ids: ['pentatonicMajor', 'pentatonicMinor', 'blues'] as ScaleType[] },
  { name: 'Symétriques & Spéciales', ids: ['wholeTone', 'diminished', 'augmentedMajor', 'augmentedMinor', 'chromatic'] as ScaleType[] },
] as const;
