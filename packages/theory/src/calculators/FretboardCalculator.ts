// ============================================================================
// FRETBOARD CALCULATOR - Calculate notes on guitar fretboard
// ============================================================================

import type { NoteName, Interval, FretboardNote } from '@adagio/types';
import { Note } from '../core/Note';
import { Scale } from '../core/Scale';
import { INTERVAL_SEMITONES } from '../core/Interval';

// Standard tuning (EADGBE)
const STANDARD_TUNING: NoteName[] = ['E', 'B', 'G', 'D', 'A', 'E']; // High E to low E

export interface FretboardOptions {
  key?: NoteName;
  scale?: Interval[];
  tuning?: NoteName[];
  fretCount?: number;
}

/**
 * Calculate all notes on the fretboard
 */
export function calculateFretboard(options: FretboardOptions = {}): FretboardNote[] {
  const {
    key = 'C',
    scale = ['1', '2', '3', '4', '5', '6', '7'],
    tuning = STANDARD_TUNING,
    fretCount = 24,
  } = options;

  const notes: FretboardNote[] = [];
  const scaleObj = new Scale(key, scale);
  const scaleNotes = scaleObj.getNotes();

  // Generate notes for each string and fret
  for (let string = 0; string < 6; string++) {
    // Open string note (at fret 0)
    const openNote = new Note(tuning[string], 4); // Assume octave 4 for open strings

    for (let fret = 0; fret <= fretCount; fret++) {
      const note = openNote.transpose(fret);
      const inScale = scaleNotes.some(sn => sn.equals(note));

      notes.push({
        name: note.name,
        octave: note.octave,
        string,
        fret,
        inScale,
      });
    }
  }

  return notes;
}

/**
 * Get notes for a specific key and scale, with interval information
 */
export function getFretboardNotesForKey(
  key: NoteName,
  scale: Interval[]
): FretboardNote[] {
  const notes = calculateFretboard({ key, scale });

  // Add interval information
  const rootNote = new Note(key, 4);
  const scaleIntervals = scale;
  const scaleNotes = new Scale(key, scale).getNotes();

  return notes.map(note => {
    const noteObj = new Note(note.name, note.octave);
    let interval: Interval | undefined;
    let degree: string | undefined;

    // Find interval from root
    for (let i = 0; i < scaleIntervals.length; i++) {
      const scaleNote = rootNote.transpose(INTERVAL_SEMITONES[scaleIntervals[i]]);
      if (noteObj.equals(scaleNote)) {
        interval = scaleIntervals[i];
        degree = (i + 1).toString();
        break;
      }
    }

    return {
      ...note,
      interval,
      degree,
    };
  });
}

/**
 * Get interval color for display
 */
export function getIntervalColor(interval?: Interval): string {
  const colors: Record<string, string> = {
    '1': '#ef4444', // Red - Root
    'b2': '#a855f7',
    '2': '#a855f7',
    'b3': '#3b82f6', // Blue - Minor third
    '3': '#3b82f6', // Blue - Major third
    '4': '#22c55e',
    '#4': '#22c55e', // Green - Perfect fourth
    '#5': '#22c55e', // Green - Perfect fifth
    '#5': '#22c55e',
    'b6': '#a855f7',
    '6': '#a855f7',
    'bb7': '#a855f7',
    'b7': '#eab308', // Yellow - Minor seventh
    '7': '#eab308', // Yellow - Major seventh
    '9': '#f97316', // Orange - Ninth
    '11': '#f97316',
    '13': '#f97316',
    '#4': '#a855f7', // Purple - Altered fourth
    'b5': '#a855f7',
  };

  return interval ? colors[interval] || '#6b7280' : '#6b7280';
}
