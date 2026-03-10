// ============================================================================
// CIRCLE DATA - Circle of fifths constants and mappings
// ============================================================================

import type { NoteName } from '@adagio/types';

// ============================================================================
// CIRCLE OF FIFTHS - Note order
// ============================================================================

/**
 * Cercle des quintes - ordre des notes
 * En partant de C et montant par quintes justes
 */
export const CIRCLE_OF_FIFTHS: NoteName[] = [
  'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'
];

// ============================================================================
// NOTE POSITIONS
// ============================================================================

/**
 * Position de chaque note dans le cercle (0-11)
 * Permet de calculer les intervalles dans le cercle des quintes
 */
export const NOTE_POSITIONS: Record<NoteName, number> = {
  'C': 0, 'G': 1, 'D': 2, 'A': 3, 'E': 4, 'B': 5, 'F#': 6,
  'Db': 7, 'Ab': 8, 'Eb': 9, 'Bb': 10, 'F': 11,
  // Enharmonic equivalents
  'C#': 7,  // Same as Db
  'D#': 9,  // Same as Eb
  'G#': 8,  // Same as Ab
  'A#': 10, // Same as Bb
  'Gb': 6,  // Same as F#
};

// ============================================================================
// RELATIVE KEYS
// ============================================================================

/**
 * Mapping majeur -> mineur (relative minor)
 * La mineure relative est située 3 demi-tons plus bas, ou un intervalle de sixte mineure descendante
 */
export const MINOR_MAP: Record<string, string> = {
  'C': 'Am', 'G': 'Em', 'D': 'Bm', 'A': 'F#m', 'E': 'C#m', 'B': 'G#m',
  'F#': 'D#m', 'Gb': 'Ebm', 'Db': 'Bbm', 'Ab': 'Fm', 'Eb': 'Cm', 'Bb': 'Gm', 'F': 'Dm'
};

/**
 * Mapping mineur -> majeur (relative major)
 * La majeure relative est située 3 demi-tons plus haut
 */
export const MAJOR_FROM_MINOR: Record<string, string> = {
  'Am': 'C', 'Em': 'G', 'Bm': 'D', 'F#m': 'A', 'C#m': 'E', 'G#m': 'B',
  'D#m': 'F#', 'Ebm': 'Gb', 'Bbm': 'Db', 'Fm': 'Ab', 'Cm': 'Eb', 'Gm': 'Bb', 'Dm': 'F'
};

// ============================================================================
// DIMINISHED CHORDS
// ============================================================================

/**
 * Mapping pour les accords diminués (VII degré)
 * Chaque note mappe vers l'accord diminé construit sur sa septième majeure
 */
export const DIM_MAP: Record<string, string> = {
  // Côté dièses du cercle (C, G, D, A, E, B, F#)
  'C': 'B°',      // VII de C
  'G': 'F#°',     // VII de G
  'D': 'C#°',     // VII de D
  'A': 'G#°',     // VII de A
  'E': 'D#°',     // VII de E
  'B': 'A#°',     // VII de B
  'F#': 'E#°',    // VII de F# (E#dim)
  // Côté bémols du cercle (Db, Ab, Eb, Bb, F)
  'Db': 'C°',     // VII de Db (Cdim)
  'Ab': 'G°',     // VII de Ab (Gdim)
  'Eb': 'D°',     // VII de Eb (Ddim)
  'Bb': 'A°',     // VII de Bb (Adim)
  'F': 'E°'       // VII de F (Edim)
};

// ============================================================================
// ENHARMONIC EQUIVALENTS
// ============================================================================

/**
 * Équivalences enharmoniques complètes
 * IMPORTANT: Le cercle utilise F# mais Db majeur utilise Gb, donc on mappe les deux sens
 */
export const ENHARMONIC_EQUIVALENTS: Record<string, string[]> = {
  'C#': ['Db'], 'Db': ['C#'],
  'D#': ['Eb'], 'Eb': ['D#'],
  'E#': ['F'], 'F': ['E#'],
  'F#': ['Gb'], 'Gb': ['F#'],  // Gb = F# (important pour Db majeur!)
  'G#': ['Ab'], 'Ab': ['G#'],
  'A#': ['Bb'], 'Bb': ['A#'],
  'B#': ['C'], 'C': ['B#']
};

// ============================================================================
// C MAJOR POSITIONS (for degree coloring)
// ============================================================================

/**
 * Mapping note -> position dans gamme majeure de C (pour couleurs)
 * Utilisé pour déterminer la couleur de degré basée sur la position de C
 */
export const C_MAJOR_POSITIONS: Record<string, number> = {
  'C': 0, 'D': 1, 'E': 2, 'F': 3, 'G': 4, 'A': 5, 'B': 6,
  'C#': -1, 'D#': -1, 'F#': -1, 'G#': -1, 'A#': -1,
  'Db': -1, 'Eb': -1, 'Gb': -1, 'Ab': -1, 'Bb': -1
};

// ============================================================================
// ENHARMONIC CANONICAL (normalization)
// ============================================================================

/**
 * Tableau de conversion enharmonique pour comparaison
 * SEULEMENT pour bémols -> dièses (pas l'inverse!)
 * Utilisé pour normaliser les accords lors des comparaisons
 */
export const ENHARMONIC_CANONICAL: Record<string, string> = {
  // Notes (bémols vers dièses)
  'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#',
  // Accords mineurs (bémols vers dièses)
  'Dbm': 'C#m', 'Ebm': 'D#m', 'Gbm': 'F#m', 'Abm': 'G#m', 'Bbm': 'A#m',
  // Accords diminués (bémols vers dièses)
  'Dbdim': 'C#dim', 'Ebdim': 'D#dim', 'Gbdim': 'F#dim', 'Abdim': 'G#dim', 'Bbdim': 'A#dim',
  // Cas spécial : E#dim = Fdim (enharmonique), B#dim = Cdim
  'E#dim': 'Fdim', 'E#°': 'Fdim',
  'B#dim': 'Cdim', 'B#°': 'Cdim',
};

/**
 * Mapping enharmonique pour les NOTES SEULEMENT (pour les diminés spéciaux)
 */
export const NOTE_ENHARMONICS: Record<string, string[]> = {
  'E#': ['F'],
  'B#': ['C'],
  'F': ['E#'],
  'C': ['B#'],
};
