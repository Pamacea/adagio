/**
 * Adagio Theory - Fretboard Types
 *
 * Type definitions for fretboard calculations and components.
 */

/**
 * Musical string names (standard guitar tuning)
 */
export const STRINGS = ['E', 'A', 'D', 'G', 'B', 'E'] as const;

/**
 * Number of frets on the fretboard
 */
export const FRET_COUNT = 12;

/**
 * MIDI frequencies for open guitar strings (E2 to E4)
 */
export const STRING_FREQUENCIES = [82.41, 110.00, 146.83, 196.00, 246.94, 329.63] as const;

/**
 * Chromatic scale notes
 */
export const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

/**
 * Base octaves for each open string
 */
export const STRING_BASE_OCTAVES = [2, 2, 3, 3, 3, 4] as const;

/**
 * Interval display name and color
 */
export interface IntervalInfo {
  /** Display name (e.g., 'R', '♭3', '5') */
  name: string;
  /** Hex color for visualization */
  color: string;
}

/**
 * Intervals mapping with colors
 */
export const INTERVALS: Record<string, IntervalInfo> = {
  '1': { name: 'R', color: '#ef4444' },
  'b2': { name: '♭2', color: '#7c3aed' },
  '2': { name: '2', color: '#8b5cf6' },
  'b3': { name: '♭3', color: '#3b82f6' },
  '3': { name: '3', color: '#60a5fa' },
  '4': { name: '4', color: '#6b7280' },
  '#4': { name: '#4', color: '#f97316' },
  'b5': { name: '♭5', color: '#a855f7' },
  '5': { name: '5', color: '#22c55e' },
  '#5': { name: '#5', color: '#a855f7' },
  'b6': { name: '♭6', color: '#a855f7' },
  '6': { name: '6', color: '#f97316' },
  'bb7': { name: '♭♭7', color: '#a855f7' },
  'b7': { name: '♭7', color: '#eab308' },
  '7': { name: '7', color: '#fbbf24' },
} as const;

/**
 * Fret marker position information
 */
export interface FretMarker {
  /** Fret number (1-indexed) */
  fret: number;
  /** Position(s) on the fretboard (0-1, where 0.5 is middle) */
  positions: number[];
}

/**
 * Standard fret markers (dots on fretboard)
 */
export const FRET_MARKERS: FretMarker[] = [
  { fret: 3, positions: [0.5] },
  { fret: 5, positions: [0.5] },
  { fret: 7, positions: [0.5] },
  { fret: 9, positions: [0.5] },
  { fret: 12, positions: [0.35, 0.65] },
] as const;

/**
 * Note data for a single position on fretboard
 */
export interface NoteData {
  /** String index (0-5, where 0 is low E) */
  stringIndex: number;
  /** Fret number (0-12, where 0 is open string) */
  fret: number;
  /** Note name (e.g., 'C', 'F#') */
  note: string;
  /** Interval from root (e.g., '1', 'b3', '5') or null if no root set */
  interval: string | null;
  /** Octave number for MIDI/playback */
  octave?: number;
  /** MIDI note identifier for playback */
  midiNote?: string;
}

/**
 * Fretboard data for all positions
 */
export type FretboardData = NoteData[][];

/**
 * Fretboard calculation options
 */
export interface FretboardOptions {
  /** Root note for interval calculation (e.g., 'C', 'F#') */
  rootNote?: string;
  /** Mode intervals to highlight (e.g., ['1', 'b3', '5', 'b7']) */
  modeIntervals?: string[];
}

/**
 * String name type
 */
export type StringName = (typeof STRINGS)[number];

/**
 * Note name type
 */
export type NoteName = (typeof CHROMATIC)[number];

/**
 * Interval name type
 */
export type IntervalName = keyof typeof INTERVALS;
