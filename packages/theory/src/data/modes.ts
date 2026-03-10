// ============================================================================
// MODES DATA - Greek modes with interval data
// ============================================================================

import type { ModeName } from '@adagio/types';

// ============================================================================
// MODE INTERVALS
// ============================================================================

/**
 * Intervalles des modes (demi-tons depuis la tonique)
 * Chaque mode est défini par ses 7 degrés exprimés en demi-tons
 */
export const MODE_INTERVALS: Record<ModeName, number[]> = {
  ionian: [0, 2, 4, 5, 7, 9, 11],      // Majeur
  dorian: [0, 2, 3, 5, 7, 9, 10],      // Mineur avec 6 majeure
  phrygian: [0, 1, 3, 5, 7, 8, 10],    // Mineur avec 2 mineure
  lydian: [0, 2, 4, 6, 7, 9, 11],      // Majeur avec #4
  mixolydian: [0, 2, 4, 5, 7, 9, 10],  // Majeur avec 7 mineure
  aeolian: [0, 2, 3, 5, 7, 8, 10],     // Mineur naturel
  locrian: [0, 1, 3, 5, 6, 8, 10],     // Mineur avec 5 diminuée
};

// ============================================================================
// ROMAN NUMERALS (Degree Analysis)
// ============================================================================

/**
 * Degrés romains pour chaque mode
 * Indique la qualité (majeur/mineur/diminué) de chaque degré
 */
export const ROMAN_DEGREES: Record<ModeName, string[]> = {
  ionian: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
  dorian: ['i', 'ii', 'III', 'IV', 'v', 'vi°', 'VII'],
  phrygian: ['i', 'II', 'III', 'iv', 'v°', 'VI', 'vii'],
  lydian: ['I', 'II', 'iii', 'iv°', 'V', 'vi', 'vii'],
  mixolydian: ['I', 'ii', 'iii°', 'iv', 'v', 'VI', 'vii'],
  aeolian: ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'],
  locrian: ['i°', 'II', 'iii', 'iv', 'V', 'VI', 'vii'],
};

// ============================================================================
// MODE ORDER (Circle of Fifths)
// ============================================================================

/**
 * Ordre des modes pour l'affichage
 * Suit le cercle des quintes (brightest to darkest)
 */
export const MODE_ORDER: ModeName[] = [
  'ionian',
  'dorian',
  'phrygian',
  'lydian',
  'mixolydian',
  'aeolian',
  'locrian',
];
