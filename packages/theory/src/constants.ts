// ============================================================================
// CONSTANTS - Shared musical constants
// ============================================================================

import type { NoteName, ChordQuality } from '@adagio/types';

// ============================================================================
// NOTES
// ============================================================================

/**
 * Notes de la gamme chromatique (ordre standard)
 */
export const CHROMATIC_SCALE: readonly NoteName[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
] as const;

/**
 * Mapping note → nom français
 */
export const NOTE_FR: Record<string, string> = {
  'C': 'DO', 'C#': 'DO♯', 'Db': 'RÉ♭', 'D': 'RÉ', 'D#': 'RÉ♯', 'Eb': 'MI♭',
  'E': 'MI', 'F': 'FA', 'F#': 'FA♯', 'Gb': 'SOL♭', 'G': 'SOL', 'G#': 'SOL♯',
  'Ab': 'LA♭', 'A': 'LA', 'A#': 'LA♯', 'Bb': 'SI♭', 'B': 'SI',
};

/**
 * Accordage standard de la guitare (du plus grave au plus aigu)
 */
export const GUITAR_TUNING: readonly NoteName[] = ['E', 'A', 'D', 'G', 'B', 'E'] as const;

/**
 * Accordage de la guitare pour l'affichage (du plus aigu au plus grave)
 */
export const GUITAR_TUNING_DISPLAY: readonly NoteName[] = ['E', 'B', 'G', 'D', 'A', 'E'] as const;

// ============================================================================
// DEGREE CHORD QUALITIES (ChordCalculator format)
// ============================================================================

/**
 * Qualité d'accord par degré pour une tonalité majeure
 * Format simple: une seule qualité par degré
 */
export const MAJOR_DEGREE_QUALITIES: Record<string, ChordQuality> = {
  'I': '',
  'II': 'm',
  'III': 'm',
  'IV': '',
  'V': '7',
  'VI': 'm',
  'VII': 'm7b5',
};

/**
 * Qualité d'accord par degré pour une tonalité mineure
 * Format simple: une seule qualité par degré
 */
export const MINOR_DEGREE_QUALITIES: Record<string, ChordQuality> = {
  'I': 'm',
  'II': 'm7b5',
  'III': '',
  'IV': 'm',
  'V': '7', // Souvent majeur pour la tension
  'VI': '',
  'VII': '',
};

// ============================================================================
// EXTENDED CHORD QUALITIES (UI format)
// ============================================================================

/**
 * Qualités d'accords diatoniques par degré (majeur) - Format étendu pour l'UI
 * Liste de toutes les variations d'accords pour chaque degré
 * Note: Utilise string[] au lieu de ChordQuality[] pour inclure des variations UI non-standard
 */
export const MAJOR_DEGREE_QUALITIES_EXTENDED: Record<string, string[]> = {
  'I': ['', 'maj7', '6', 'add9', '6add9', 'maj9'],
  'II': ['m', 'm7', 'm6', 'm9', 'm11', 'madd9'],
  'III': ['m', 'm7', 'm6', 'm9', 'madd9'],
  'IV': ['', 'maj7', '6', 'add9', '6add9', 'maj9'],
  'V': ['7', '9', '11', '13', '7sus4', '13sus4'],
  'VI': ['m', 'm7', 'm6', 'm9', 'm11', 'madd9'],
  'VII': ['m7b5', 'm7b5b9', 'm7b11'],
};

/**
 * Qualités d'accords diatoniques par degré (mineur) - Format étendu pour l'UI
 * Note: Utilise string[] au lieu de ChordQuality[] pour inclure des variations UI non-standard
 */
export const MINOR_DEGREE_QUALITIES_EXTENDED: Record<string, string[]> = {
  'I': ['m', 'm7', 'm6', 'm9', 'm11', 'madd9'],
  'II': ['m7b5', 'm7b5b9', 'dim7', 'm7b5b11'],
  'III': ['', 'maj7', '6', 'add9'],
  'IV': ['m', 'm7', 'm6', 'm9', 'm11'],
  'V': ['7', '7alt', '7#11', '7#9'],
  'VI': ['', 'maj7', '6', 'add9', '6add9'],
  'VII': ['', '7', 'maj7'],
};

/**
 * Qualités d'accords supplémentaires non-diatoniques
 */
export const EXTENSION_QUALITIES: string[] = [
  'aug', 'aug7', 'dim', 'dim7', 'sus2', 'sus4', '7sus4',
  '11', 'm11', '13', 'm13'
];
