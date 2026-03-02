// ============================================================================
// MUSIC TYPES - Core types for music theory
// ============================================================================

/**
 * Note names (English notation)
 */
export type NoteName =
  | 'C'
  | 'C#'
  | 'Db'
  | 'D'
  | 'D#'
  | 'Eb'
  | 'E'
  | 'F'
  | 'F#'
  | 'Gb'
  | 'G'
  | 'G#'
  | 'Ab'
  | 'A'
  | 'A#'
  | 'Bb'
  | 'B';

/**
 * Note with octave
 */
export interface Note {
  name: NoteName;
  octave: number;
}

/**
 * Interval names (semitones from root)
 */
export type Interval =
  | '1'
  | 'b2'
  | '2'
  | 'b3'
  | '3'
  | '4'
  | '#4'
  | 'b5'
  | '5'
  | '#5'
  | 'b6'
  | '6'
  | 'bb7'
  | 'b7'
  | '7';

/**
 * Scale quality
 */
export type ScaleQuality = 'major' | 'minor' | 'pentatonic' | 'blues' | 'chromatic';

/**
 * Mode names (Greek)
 */
export type ModeName =
  | 'ionian'
  | 'dorian'
  | 'phrygian'
  | 'lydian'
  | 'mixolydian'
  | 'aeolian'
  | 'locrian';

/**
 * Chord quality
 */
export type ChordQuality =
  | ''
  | 'm'
  | '7'
  | 'm7'
  | 'maj7'
  | 'dim'
  | 'dim7'
  | 'm7b5'
  | 'aug'
  | 'aug7'
  | 'sus2'
  | 'sus4'
  | '7sus4'
  | 'add9'
  | 'madd9'
  | '6'
  | 'm6'
  | '9'
  | 'm9'
  | '11'
  | 'm11'
  | '13'
  | 'm13';

/**
 * Scale representation
 */
export interface Scale {
  id: string;
  slug: string;
  name: string;
  root: NoteName;
  intervals: Interval[];
  quality: ScaleQuality;
  type: 'scale' | 'mode';
}

/**
 * Mode representation with emotional mapping
 */
export interface Mode extends Scale {
  greekName: ModeName;
  character: string; // Ex: "Aérien / Lumineux"
  sensation: string; // Ex: "Jazzy, Chaud"
  feeling?: string; // Ex: "Féerique, James Bond"
  relativeTo?: string; // Ex: "ii in major"
  axisGroup?: AxisGroup;
  advice?: string;
}

/**
 * Axis groups for substitution theory
 */
export type AxisGroup = 'tonic' | 'dominant' | 'subdominant';

/**
 * Chord representation
 */
export interface Chord {
  id: string;
  name: string; // Ex: "Cmaj7"
  root: NoteName;
  quality: ChordQuality;
  intervals: Interval[];
  extensions?: Interval[]; // 9, 11, 13 etc.
  fingerings: Fingering[];
  theory?: {
    scaleDegrees: string[]; // Ex: ["1", "3", "5", "7"]
    tension: 'stable' | 'tense' | 'dominant' | 'dissonant';
  };
}

/**
 * Fingering position on fretboard
 */
export interface Fingering {
  position: number | 'open'; // Fret number or "open"
  frets: FretPosition[]; // Array of [string, fret] pairs
  shape?: 'C' | 'A' | 'G' | 'E' | 'D';
}

/**
 * Position of a single finger
 * string: 0-5 (from high E to low E)
 * fret: fret number or null for muted/open
 */
export type FretPosition = [string: number, fret: number | null];

/**
 * Note on fretboard
 */
export interface FretboardNote {
  name: NoteName;
  octave: number;
  string: number; // 0-5 (high E to low E)
  fret: number; // 0-24
  inScale: boolean;
  interval?: Interval;
  degree?: string; // I, ii, iii, etc.
}

/**
 * Key signature
 */
export interface KeySignature {
  root: NoteName;
  quality: 'major' | 'minor';
  accidentals: number; // -7 to +7
  keySignature: NoteName[]; // Notes in the key
}

/**
 * Progression degree
 */
export type ProgressionDegree =
  | 'I'
  | 'i'
  | 'ii'
  | 'iii'
  | 'IV'
  | 'iv'
  | 'V'
  | 'v'
  | 'VI'
  | 'vi'
  | 'VII'
  | 'vii'
  | 'bII'
  | 'bII7'
  | 'bIII'
  | 'bIII7'
  | '#IV'
  | '#iv'
  | 'N6'
  | 'It+6'
  | 'Fr+6';

/**
 * Chord in a progression
 */
export interface ProgressionChord {
  degree: ProgressionDegree;
  actualChord?: string; // Actual chord name if different from degree
  beats: number;
  analysis?: ChordAnalysis;
}

/**
 * Analysis for a chord in progression
 */
export interface ChordAnalysis {
  scale: Mode | Scale;
  feeling: string;
  tension: 'stable' | 'tense' | 'restless';
  advice: string;
  avoid?: NoteName[];
}

/**
 * Complete chord progression
 */
export interface ChordProgression {
  id: string;
  name?: string;
  key: NoteName;
  timeSignature: string;
  chords: ProgressionChord[];
  analysis?: ProgressionAnalysis;
}

/**
 * Analysis of entire progression
 */
export interface ProgressionAnalysis {
  overall: {
    feeling: string;
    tonality: string;
    complexity: 'simple' | 'intermediate' | 'advanced';
  };
  chords: ChordAnalysis[];
  suggestions: string[];
}

/**
 * Circle of fifths data
 */
export interface CircleOfFifthsData {
  center: NoteName;
  circle: CircleEntry[];
  enharmonics: Record<string, string>;
}

export interface CircleEntry {
  note: NoteName;
  interval: number; // Semitones from center
}

/**
 * Axis theory mapping
 */
export interface AxisTheory {
  groups: AxisGroupEntry[];
}

export interface AxisGroupEntry {
  name: AxisGroup;
  notes: NoteName[];
  description: string;
  substitutions: SubstitutionType[];
}

export type SubstitutionType =
  | 'relative-minor'
  | 'relative-major'
  | 'tritone'
  | 'secondary-dominant'
  | 'diminished';

// ============================================================================
// VALIDATION WITH ZOD
// ============================================================================

import { z } from 'zod';

export const NoteNameSchema = z.enum([
  'C',
  'C#',
  'Db',
  'D',
  'D#',
  'Eb',
  'E',
  'F',
  'F#',
  'Gb',
  'G',
  'G#',
  'Ab',
  'A',
  'A#',
  'Bb',
  'B',
]);

export const IntervalSchema = z.enum([
  '1',
  'b2',
  '2',
  'b3',
  '3',
  '4',
  '#4',
  'b5',
  '5',
  '#5',
  'b6',
  '6',
  'bb7',
  'b7',
  '7',
]);

export const ModeNameSchema = z.enum([
  'ionian',
  'dorian',
  'phrygian',
  'lydian',
  'mixolydian',
  'aeolian',
  'locrian',
]);

export const ChordQualitySchema = z.enum([
  '',
  'm',
  '7',
  'm7',
  'maj7',
  'dim',
  'dim7',
  'm7b5',
  'aug',
  'aug7',
  'sus2',
  'sus4',
  '7sus4',
  'add9',
  'madd9',
  '6',
  'm6',
  '9',
  'm9',
  '11',
  'm11',
  '13',
  'm13',
]);

export const NoteSchema = z.object({
  name: NoteNameSchema,
  octave: z.number().int().min(0).max(8),
});

export const ModeSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  root: NoteNameSchema,
  intervals: z.array(IntervalSchema),
  quality: z.enum(['major', 'minor', 'pentatonic', 'blues', 'chromatic']),
  type: z.enum(['scale', 'mode']),
  greekName: ModeNameSchema,
  character: z.string(),
  sensation: z.string(),
  feeling: z.string().optional(),
  relativeTo: z.string().optional(),
  axisGroup: z.enum(['tonic', 'dominant', 'subdominant']).optional(),
  advice: z.string().optional(),
});

export const ChordSchema = z.object({
  id: z.string(),
  name: z.string(),
  root: NoteNameSchema,
  quality: ChordQualitySchema,
  intervals: z.array(IntervalSchema),
  extensions: z.array(IntervalSchema).optional(),
});

export const ProgressionDegreeSchema = z.enum([
  'I',
  'i',
  'ii',
  'iii',
  'IV',
  'iv',
  'V',
  'v',
  'VI',
  'vi',
  'VII',
  'vii',
  'bII',
  'bII7',
  'bIII',
  'bIII7',
  '#IV',
  '#iv',
  'N6',
  'It+6',
  'Fr+6',
]);

export const ProgressionChordSchema = z.object({
  degree: ProgressionDegreeSchema,
  actualChord: z.string().optional(),
  beats: z.number().int().positive(),
});

export const ChordProgressionSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  key: NoteNameSchema,
  timeSignature: z.string().default('4/4'),
  chords: z.array(ProgressionChordSchema),
});
