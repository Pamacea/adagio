// ============================================================================
// CIRCLE OF FIFTHS CALCULATOR
// ============================================================================

import type { NoteName } from '@adagio/types';
import { ENHARMONIC_EQUIVALENTS, MAJOR_FROM_MINOR, MINOR_MAP } from '../data/circle';

// Circle of fifths order
const CIRCLE_OF_FIFTHS: NoteName[] = [
  'C',
  'G',
  'D',
  'A',
  'E',
  'B',
  'F#',
  'Db',
  'Ab',
  'Eb',
  'Bb',
  'F',
];

// Paires enharmoniques dérivées de la table unique (data/circle.ts) :
// les paires impliquant E# / B# sont exclues, comme dans la table historique
// (seules les 10 paires réellement utiles au cercle sont conservées).
const ENHARMONICS: Record<string, NoteName> = {};
for (const [note, equivs] of Object.entries(ENHARMONIC_EQUIVALENTS)) {
  const equiv = equivs[0];
  if (equiv !== undefined && note !== 'E#' && note !== 'B#' && equiv !== 'E#' && equiv !== 'B#') {
    ENHARMONICS[note] = equiv as NoteName;
  }
}

function getNoteAtIndex(index: number): NoteName {
  const note = CIRCLE_OF_FIFTHS[index];
  if (!note) {
    throw new Error(`Invalid circle index: ${index}`);
  }
  return note;
}

/**
 * Get the circle of fifths centered on a note
 */
export function getCircleOfFifths(center: NoteName = 'C') {
  const centerIndex = CIRCLE_OF_FIFTHS.indexOf(center);

  if (centerIndex === -1) {
    throw new Error(`Invalid note: ${center}`);
  }

  const circle: Array<{ note: NoteName; interval: number }> = [];

  for (let i = 0; i < 12; i++) {
    const index = (centerIndex + i) % 12;
    circle.push({
      note: getNoteAtIndex(index),
      interval: (i * 7) % 12, // Perfect fifth = 7 semitones
    });
  }

  return {
    center,
    circle,
    enharmonics: ENHARMONICS,
  };
}

/**
 * Get the perfect fifth of a note
 */
export function getPerfectFifth(note: NoteName): NoteName {
  const index = CIRCLE_OF_FIFTHS.indexOf(note);
  if (index === -1) throw new Error(`Invalid note: ${note}`);
  return getNoteAtIndex((index + 1) % 12);
}

/**
 * Get the perfect fourth of a note
 */
export function getPerfectFourth(note: NoteName): NoteName {
  const index = CIRCLE_OF_FIFTHS.indexOf(note);
  if (index === -1) throw new Error(`Invalid note: ${note}`);
  return getNoteAtIndex((index + 11) % 12); // -1 semitone = 11 semitones
}

/**
 * Get relative minor of a major key
 */
export function getRelativeMinor(majorKey: NoteName): NoteName {
  const relative = MINOR_MAP[majorKey];
  if (relative) return relative.replace(/m$/, '') as NoteName;

  const index = CIRCLE_OF_FIFTHS.indexOf(majorKey);
  if (index === -1) throw new Error(`Invalid note: ${majorKey}`);
  // Minor sits 3 steps forward in the circle of fifths
  return getNoteAtIndex((index + 3) % 12);
}

/**
 * Get relative major of a minor key
 */
export function getRelativeMajor(minorKey: NoteName): NoteName {
  const relative = MAJOR_FROM_MINOR[`${minorKey}m`];
  if (relative) return relative as NoteName;

  const index = CIRCLE_OF_FIFTHS.indexOf(minorKey);
  if (index === -1) throw new Error(`Invalid note: ${minorKey}`);
  // Major sits 9 steps forward in the circle of fifths
  return getNoteAtIndex((index + 9) % 12);
}

/**
 * Relative key chord for a given mode:
 * major → its relative minor (C → Am, A → F#m)
 * minor → its relative major (Am → C)
 */
export function getRelativeKey(key: NoteName, mode: 'major' | 'minor'): string {
  return mode === 'major' ? `${getRelativeMinor(key)}m` : getRelativeMajor(key);
}

/**
 * Parallel key chord: same tonic, opposite quality (A majeur → Am, Am → A)
 */
export function getParallelKey(key: NoteName, mode: 'major' | 'minor'): string {
  return mode === 'major' ? `${key}m` : key;
}

/**
 * Get the tritone substitution of a dominant chord
 */
export function getTritoneSubstitution(dominant: NoteName): NoteName {
  // Tritone is augmented fourth (6 semitones) from root
  const index = CIRCLE_OF_FIFTHS.indexOf(dominant);
  if (index === -1) throw new Error(`Invalid note: ${dominant}`);
  return getNoteAtIndex((index + 6) % 12);
}
