/**
 * Adagio Theory - Fretboard Calculations
 *
 * Pure functions for fretboard note and interval calculations.
 * Shared between web and mobile components.
 */

import {
  STRINGS,
  CHROMATIC,
  STRING_BASE_OCTAVES,
  INTERVALS,
  type NoteData,
  type FretboardData,
  type FretboardOptions,
  type NoteName,
  type StringName,
  type IntervalName,
} from './types';

/**
 * Mapping from semitone offset to possible interval names
 * Used to identify the interval of a note relative to a root
 */
const SEMITONE_TO_INTERVAL: Record<number, string[]> = {
  0: ['1'],
  1: ['b2', '#1'],
  2: ['2'],
  3: ['b3'],
  4: ['3', '#2'],
  5: ['4'],
  6: ['#4', 'b5'],
  7: ['5'],
  8: ['#5', 'bb7', 'b6'],
  9: ['6'],
  10: ['bb7', 'b7', '6'], // bb7 = dim7
  11: ['7', '#6'],
};

/**
 * Get the note at a specific position on the fretboard
 * @param stringOpen - The open string note (e.g., 'E', 'A')
 * @param fret - The fret number (0-12, where 0 is open string)
 * @returns The note name at that position
 *
 * @example
 * getNoteAt('E', 0) // 'E'
 * getNoteAt('E', 3) // 'G'
 * getNoteAt('A', 2) // 'B'
 */
export function getNoteAt(stringOpen: string, fret: number): NoteName {
  const openIndex = CHROMATIC.findIndex(n => n === stringOpen);
  if (openIndex === -1) return 'C';

  const noteIndex = (openIndex + fret) % 12;
  const note = CHROMATIC[noteIndex];
  return note ?? 'C';
}

/**
 * Get the interval name for a note relative to a root note
 * @param note - The note name (e.g., 'G', 'F#')
 * @param root - The root note name (e.g., 'C', 'E')
 * @param modeIntervals - List of valid interval names for this mode
 * @returns The interval name (e.g., 'b3', '5') or null if not in mode
 *
 * @example
 * getIntervalForNote('G', 'E', ['1', 'b3', '5', 'b7']) // 'b3'
 * getIntervalForNote('G', 'C', ['1', '2', '3', '4', '5', '6', '7']) // '5'
 */
export function getIntervalForNote(
  note: string,
  root: string,
  modeIntervals: string[]
): string | null {
  const rootIndex = CHROMATIC.findIndex(n => n === root);
  const noteIndex = CHROMATIC.findIndex(n => n === note);

  if (rootIndex === -1 || noteIndex === -1) return null;

  const semitones = (noteIndex - rootIndex + 12) % 12;
  const possibleIntervals = SEMITONE_TO_INTERVAL[semitones] || [];

  // Find the first interval that exists in the mode
  return possibleIntervals.find(i => modeIntervals.includes(i)) || null;
}

/**
 * Get the octave number for a note at a specific position
 * @param note - The note name
 * @param stringIndex - The string index (0-5)
 * @param fret - The fret number
 * @returns The octave number
 *
 * @example
 * getOctaveForNote('E', 0, 0) // 2 (low E string, open)
 * getOctaveForNote('E', 5, 0) // 4 (high E string, open)
 */
export function getOctaveForNote(
  note: string,
  stringIndex: number,
  fret: number
): number {
  const stringOpen = STRINGS[stringIndex] ?? 'E';
  const baseOctave = STRING_BASE_OCTAVES[stringIndex] ?? 2;

  const openIndex = CHROMATIC.findIndex(n => n === stringOpen);
  const targetIndex = CHROMATIC.findIndex(n => n === note);

  // Calculate how many times we've crossed C (which increments octave)
  const octaveIncrease = Math.floor((openIndex + fret) / 12);

  return baseOctave + octaveIncrease;
}

/**
 * Get the MIDI note identifier for playback
 * @param note - The note name
 * @param octave - The octave number
 * @returns The MIDI note string (e.g., 'C4', 'F#3')
 */
export function getMidiNote(note: string, octave: number): string {
  return `${note}${octave}`;
}

/**
 * Calculate the complete fretboard data
 * @param options - Options for root note and mode intervals
 * @returns 2D array of NoteData indexed by [stringIndex][fret]
 *
 * @example
 * const fretboard = calculateFretboard({
 *   rootNote: 'C',
 *   modeIntervals: ['1', 'b3', '5', 'b7']
 * });
 */
export function calculateFretboard(options: FretboardOptions = {}): FretboardData {
  const { rootNote, modeIntervals = [] } = options;

  const fretboard: FretboardData = [];

  for (let stringIndex = 0; stringIndex < STRINGS.length; stringIndex++) {
    const stringOpen = STRINGS[stringIndex];
    if (!stringOpen) continue;

    const stringData: NoteData[] = [];

    for (let fret = 0; fret <= 12; fret++) {
      const note = getNoteAt(stringOpen, fret);
      const octave = getOctaveForNote(note, stringIndex, fret);
      const midiNote = getMidiNote(note, octave);

      let interval: string | null = null;
      if (rootNote && modeIntervals.length > 0) {
        interval = getIntervalForNote(note, rootNote, modeIntervals);
      }

      stringData.push({
        stringIndex,
        fret,
        note,
        octave,
        midiNote,
        interval,
      });
    }

    fretboard.push(stringData);
  }

  return fretboard;
}

/**
 * Get interval info (name and color) by interval name
 * @param interval - The interval name (e.g., '1', 'b3', '5')
 * @returns IntervalInfo or null if not found
 */
export function getIntervalInfo(interval: string) {
  return INTERVALS[interval] || null;
}

/**
 * Check if a note is in the current mode (has an interval)
 * @param noteData - The note data to check
 * @returns True if the note is highlighted in the mode
 */
export function isNoteInMode(noteData: NoteData): boolean {
  return noteData.interval !== null;
}

/**
 * Get all notes on the fretboard for a specific interval
 * @param fretboard - The fretboard data
 * @param interval - The interval to find (e.g., '1', '5', 'b3')
 * @returns Array of note data matching the interval
 */
export function getNotesByInterval(
  fretboard: FretboardData,
  interval: string
): NoteData[] {
  const notes: NoteData[] = [];

  for (const stringData of fretboard) {
    for (const noteData of stringData) {
      if (noteData.interval === interval) {
        notes.push(noteData);
      }
    }
  }

  return notes;
}

/**
 * Get root note positions on the fretboard
 * @param fretboard - The fretboard data
 * @returns Array of root note positions
 */
export function getRootNotes(fretboard: FretboardData): NoteData[] {
  return getNotesByInterval(fretboard, '1');
}

/**
 * Calculate semitone distance between two notes
 * @param from - Starting note
 * @param to - Ending note
 * @returns Number of semitones (0-11)
 */
export function getSemitoneDistance(from: NoteName, to: NoteName): number {
  const fromIndex = CHROMATIC.findIndex(n => n === from);
  const toIndex = CHROMATIC.findIndex(n => n === to);

  if (fromIndex === -1 || toIndex === -1) return 0;

  return (toIndex - fromIndex + 12) % 12;
}

/**
 * Check if two notes are enharmonically equivalent
 * (For the purposes of this guitar fretboard, we use simple names only)
 * @param note1 - First note
 * @param note2 - Second note
 * @returns True if notes are the same
 */
export function areNotesSame(note1: string, note2: string): boolean {
  return note1 === note2;
}

// ============================================================================
// HELPER FUNCTIONS FOR MOBILE/WEB COMPONENTS
// ============================================================================

/**
 * Get interval color by interval name
 * @param interval - The interval name (e.g., '1', 'b3', '5')
 * @returns Hex color string
 */
export function getIntervalColor(interval: string): string {
  return INTERVALS[interval]?.color ?? '#6b7280';
}

/**
 * Get fretboard notes for a specific key and intervals (mobile-friendly format)
 * @param key - Root note (e.g., 'C', 'F#')
 * @param intervals - Array of interval names (e.g., ['1', 'b3', '5'])
 * @returns Flat array of FretboardNote objects
 */
export function getFretboardNotesForMobile(
  key: string,
  intervals: string[]
): Array<{ name: string; note: string; interval: string | null; inScale: boolean; string: number; fret: number; color: string }> {
  const fretboard = calculateFretboard({ rootNote: key, modeIntervals: intervals });
  const result: Array<{ name: string; note: string; interval: string | null; inScale: boolean; string: number; fret: number; color: string }> = [];

  for (let stringIdx = 0; stringIdx < fretboard.length; stringIdx++) {
    const stringData = fretboard[stringIdx];
    if (!stringData) continue;

    for (let fret = 0; fret < stringData.length; fret++) {
      const noteData = stringData[fret];
      if (!noteData) continue;

      const inScale = noteData.interval !== null;
      result.push({
        name: noteData.note,
        note: noteData.note,
        interval: noteData.interval,
        inScale,
        string: stringIdx,
        fret: noteData.fret,
        color: noteData.interval ? getIntervalColor(noteData.interval) : '#374151',
      });
    }
  }

  return result;
}
