// ============================================================================
// MUSIC UTILS - Music theory utility functions
// ============================================================================

import type { NoteName, Interval } from '@adagio/types';

/**
 * Get the semitone value for an interval
 */
export function getIntervalSemitones(interval: Interval): number {
  const semitones: Record<Interval, number> = {
    '1': 0,
    'b2': 1,
    '2': 2,
    'b3': 3,
    '3': 4,
    '4': 5,
    '#4': 6,
    'b5': 6,
    '5': 7,
    '#5': 8,
    'b6': 8,
    '6': 9,
    '#6': 10,
    'bb6': 7,
    'bb7': 9,
    'b7': 10,
    '7': 11,
    'b4': 4,
    // Chromatic intervals (rare)
    '#1': 1,
    '#2': 3,
    '#3': 5,
    // Extensions (above octave)
    'b9': 13,
    '9': 14,
    '#9': 15,
    '11': 17,
    '#11': 18,
    'b13': 20,
    '13': 21,
  };
  return semitones[interval];
}

/**
 * Get color for an interval (for visualization)
 */
export function getIntervalColor(interval: Interval): string {
  const colors: Record<string, string> = {
    '1': '#ef4444', // Red - Root
    'b2': '#a855f7',
    '2': '#a855f7',
    'b3': '#3b82f6', // Blue - Minor third
    '3': '#3b82f6', // Blue - Major third
    '4': '#22c55e', // Green - Perfect fourth
    '5': '#22c55e', // Green - Perfect fifth
    'b6': '#a855f7',
    '6': '#a855f7',
    'bb7': '#a855f7',
    'b7': '#eab308', // Yellow - Minor seventh
    '7': '#eab308', // Yellow - Major seventh
    'b9': '#f97316',
    '9': '#f97316',
    '#9': '#f97316',
    '11': '#f97316',
    '#11': '#f97316',
    'b13': '#f97316',
    '13': '#f97316',
  };

  return colors[interval] || '#6b7280';
}

/**
 * Format a chord degree for display
 */
export function formatDegree(degree: string): string {
  // Convert "bII" to "♭II", "#IV" to "♯IV", etc.
  return degree
    .replace(/b/g, '♭')
    .replace(/#/g, '♯')
    .replace(/vii°/g, 'vii°');
}

/**
 * Get note name with accidental symbols
 */
export function formatNote(note: NoteName): string {
  return note
    .replace(/#/g, '♯')
    .replace(/b/g, '♭');
}

/**
 * Check if a note is a black key (has accidental)
 */
export function isBlackKey(note: NoteName): boolean {
  return note.includes('#') || note.includes('b');
}

/**
 * Get all note names in order
 */
export const ALL_NOTES: NoteName[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
  'Db', 'Eb', 'Gb', 'Ab', 'Bb',
];

/**
 * Get the natural notes (no accidentals)
 */
export const NATURAL_NOTES: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

/**
 * Standard guitar tuning (low to high)
 */
export const STANDARD_TUNING: NoteName[] = ['E', 'A', 'D', 'G', 'B', 'E'];

/**
 * Get string number for note (0 = high E, 5 = low E in standard tuning)
 */
export function getStringForNote(note: NoteName, openStringIndex: number): NoteName {
  const tuning: NoteName[] = ['E', 'B', 'G', 'D', 'A', 'E'];
  const openNote = tuning[openStringIndex];
  if (!openNote) return 'C';

  // This is a simplified version - the actual implementation would
  // need to handle octave changes
  return note;
}

/**
 * Convert frequency to note name
 */
export function frequencyToNote(frequency: number): { note: NoteName; octave: number; cents: number } {
  const A4 = 440;
  const C0 = A4 * Math.pow(2, -4.75);

  const halfSteps = 12 * Math.log2(frequency / C0);
  const octave = Math.floor(halfSteps / 12);
  const noteIndex = Math.round(halfSteps) % 12;

  const notes: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  const safeNoteIndex = Math.abs(noteIndex) % 12;

  return {
    note: notes[safeNoteIndex] || 'C',
    octave,
    cents: Math.round((halfSteps - Math.round(halfSteps)) * 100),
  };
}

/**
 * Convert note name to frequency
 */
export function noteToFrequency(note: NoteName, octave: number): number {
  const A4 = 440;
  const notes: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const noteIndex = notes.indexOf(note);

  if (noteIndex === -1) {
    // Handle flats
    const flatNotes: NoteName[] = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
    const flatIndex = flatNotes.indexOf(note);
    if (flatIndex === -1) return A4;
    return A4 * Math.pow(2, (octave - 4) + (flatIndex - 9) / 12);
  }

  // Safe check for noteIndex
  const safeIndex = noteIndex >= 0 ? noteIndex : 0;

  return A4 * Math.pow(2, (octave - 4) + (noteIndex - 9) / 12);
}
