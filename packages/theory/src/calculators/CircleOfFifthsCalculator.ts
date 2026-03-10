// ============================================================================
// CIRCLE OF FIFTHS CALCULATOR
// ============================================================================

import type { NoteName } from '@adagio/types';

// Circle of fifths order
const CIRCLE_OF_FIFTHS: NoteName[] = [
  'C', 'G', 'D', 'A', 'E', 'B', 'F#',
  'Db', 'Ab', 'Eb', 'Bb', 'F',
];

// Enharmonic equivalents
const ENHARMONICS: Record<string, NoteName> = {
  'F#': 'Gb',
  'Gb': 'F#',
  'Db': 'C#',
  'C#': 'Db',
  'Ab': 'G#',
  'G#': 'Ab',
  'Eb': 'D#',
  'D#': 'Eb',
  'Bb': 'A#',
  'A#': 'Bb',
};

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
  const index = CIRCLE_OF_FIFTHS.indexOf(majorKey);
  if (index === -1) throw new Error(`Invalid note: ${majorKey}`);
  // Minor is 3 semitones below major
  return getNoteAtIndex((index + 9) % 12);
}

/**
 * Get relative major of a minor key
 */
export function getRelativeMajor(minorKey: NoteName): NoteName {
  const index = CIRCLE_OF_FIFTHS.indexOf(minorKey);
  if (index === -1) throw new Error(`Invalid note: ${minorKey}`);
  // Major is 3 semitones above minor
  return getNoteAtIndex((index + 3) % 12);
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
