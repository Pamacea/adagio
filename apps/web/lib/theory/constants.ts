// ============================================================================
// CONSTANTS - Musical constants for web app
// ============================================================================

import type { NoteName } from '@adagio/types';

// ============================================================================
// NOTE MAPPINGS
// ============================================================================

/**
 * Mapping notes anglaises vers francaises avec symboles
 * Utilise les symboles musicaux corrects (♯, ♭)
 */
export const NOTE_FR: Record<string, string> = {
  'C': 'DO', 'C#': 'DO♯', 'Db': 'RÉ♭',
  'D': 'RÉ', 'D#': 'RÉ♯', 'Eb': 'MI♭',
  'E': 'MI',
  'F': 'FA', 'F#': 'FA♯', 'Gb': 'SOL♭',
  'G': 'SOL', 'G#': 'SOL♯', 'Ab': 'LA♭',
  'A': 'LA', 'A#': 'LA♯', 'Bb': 'SI♭',
  'B': 'SI',
};

// ============================================================================
// GUITAR STRINGS
// ============================================================================

/**
 * Cordes de guitare avec noms français
 * De la plus aiguë à la plus grave (ordre d'affichage)
 */
export const GUITAR_STRINGS: Array<{ note: NoteName; name: string }> = [
  { note: 'E', name: 'MI' },   // Corde 1 - Mi aigu
  { note: 'B', name: 'SI' },   // Corde 2 - Si
  { note: 'G', name: 'SOL' },  // Corde 3 - Sol
  { note: 'D', name: 'RÉ' },   // Corde 4 - Ré
  { note: 'A', name: 'LA' },   // Corde 5 - La
  { note: 'E', name: 'MI' },   // Corde 6 - Mi grave
];

// ============================================================================
// SVG CONSTANTS (Fretboard)
// ============================================================================

/**
 * Constantes SVG pour le fretboard
 * Valeurs optimisées pour l'affichage
 */
export const FRET_CONSTANTS = {
  /** Position X du sillet (nut) */
  NUT_POSITION: 60,
  /** Largeur uniforme par frette */
  FRET_WIDTH: 100,
  /** Espacement entre les cordes */
  STRING_SPACING: 55,
} as const;

// ============================================================================
// CHROMATIC SCALE
// ============================================================================

/**
 * Notes chromatiques dans l'ordre standard
 */
export const CHROMATIC: NoteName[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

// ============================================================================
// ROOT NOTES
// ============================================================================

/**
 * Tonalites disponibles - toutes les notes chromatiques
 */
export const ROOTS: NoteName[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];
