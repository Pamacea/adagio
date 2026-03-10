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
 * Includes basic intervals (1-7) and extensions (9, 11, 13)
 * Plus rare intervals for exotic scales (diminished, augmented, chromatic)
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
  | '#6'
  | 'bb6'
  | 'bb7'
  | 'b7'
  | '7'
  | 'b4'
  // Chromatic intervals (rare)
  | '#1'
  | '#2'
  | '#3'
  // Extensions (above octave)
  | 'b9'
  | '9'
  | '#9'
  | '11'
  | '#11'
  | 'b13'
  | '13';

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
// CHORD TYPES - Extended types for chord analysis
// ============================================================================

/**
 * Scale degrees with alterations
 * Used for harmonic analysis and chord identification
 */
export type ChordDegree =
  | 'I'
  | 'bI'
  | '#I'
  | 'II'
  | 'bII'
  | '#II'
  | 'III'
  | 'bIII'
  | '#III'
  | 'IV'
  | 'bIV'
  | '#IV'
  | 'V'
  | 'bV'
  | '#V'
  | 'VI'
  | 'bVI'
  | '#VI'
  | 'VII'
  | 'bVII'
  | '#VII';

/**
 * Harmonic function of a chord in a key
 * Based on functional harmony theory
 */
export type ChordFunction =
  | 'tonic'           // I, vi, iii - stability/rest
  | 'subdominant'     // IV, ii - preparation/departure
  | 'dominant'        // V, vii - tension/resolution
  | 'substitute-dominant' // bII, tritone substitution
  | 'modal-interchange'   // Borrowed from parallel tonality
  | 'secondary-dominant'  // V/x - dominant of another chord
  | 'passing'         // Passing chord
  | 'augmented-sixth'  // German/French/Italian sixth
  | 'neapolitan';     // bII

/**
 * Chord inversion position
 */
export type ChordPosition =
  | 'root'      // Root in bass (e.g., C/E for 1st inversion)
  | 'first'     // 3rd in bass
  | 'second'    // 5th in bass
  | 'third';    // 7th in bass (for 7th chords)

/**
 * CAGED system shapes for guitar
 * Each letter represents the open chord shape that can be moved up the neck
 */
export type ChordShape = 'C' | 'A' | 'G' | 'E' | 'D' | 'none';

/**
 * Note position in a chord voicing
 */
export interface VoicingNote {
  note: NoteName;
  octave: number;
  string: number; // 0-5 (high E to low E)
  fret: number;
  interval: Interval; // 3, 5, b7, 9, etc.
  finger?: number; // 1-4 for fingering
}

/**
 * Complete chord voicing on guitar
 */
export interface ChordVoicing {
  id: string;
  name: string;
  notes: VoicingNote[];
  position: ChordPosition;
  shape?: ChordShape;
  fretRange: [number, number]; // [minFret, maxFret]
  difficulty: 'easy' | 'medium' | 'hard';
  muteStrings?: number[]; // Strings to mute
}

/**
 * Complete chord library entry
 */
export interface ChordLibraryEntry {
  id: string;
  name: string; // e.g., "Cmaj7", "Am9"
  root: NoteName;
  quality: ChordQuality;
  extensions?: Interval[]; // 9, 11, 13, etc.
  intervals: Interval[]; // All intervals in chord
  aliases?: string[]; // Alternative names
  symbols?: string[]; // Common jazz symbols (e.g., Δ, -7, +7)
  voicings: ChordVoicing[];
  theory: {
    function?: ChordFunction;
    stability: 'stable' | 'tense' | 'dissonant' | 'ambiguous';
    tendency?: NoteName[]; // Tendency tones (notes that want to resolve)
    description: string;
  };
  emotional: {
    feeling: string;
    moods: string[];
    styles: string[]; // jazz, classical, rock, etc.
  };
  substitutions?: string[]; // Chords that can substitute this one
}

/**
 * Chords available for each degree in a key
 */
export interface DegreeChords {
  degree: ChordDegree;
  function: ChordFunction;
  diatonic: string[]; // Diatonic chords (e.g., ['C', 'Cmaj7'])
  secondaryDominants?: string[]; // V/x chords
  modalInterchange?: string[]; // Borrowed chords
  commonExtensions?: string[]; // 9, 11, 13 variations
  voicings?: string[]; // Common voicing IDs
  advice: string;
}

/**
 * All chords available for a key
 */
export interface KeyChordLibrary {
  key: NoteName;
  tonality: 'major' | 'minor';
  degrees: Record<ChordDegree, DegreeChords>;
  commonProgressions: {
    name: string;
    degrees: ChordDegree[];
    description: string;
  }[];
}

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
  '#6',
  'bb6',
  'bb7',
  'b7',
  '7',
  'b4',
  // Chromatic intervals (rare)
  '#1',
  '#2',
  '#3',
  // Extensions (above octave)
  'b9',
  '9',
  '#9',
  '11',
  '#11',
  'b13',
  '13',
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

// Zod schemas for new chord types
export const ChordDegreeSchema = z.enum([
  'I', 'bI', '#I',
  'II', 'bII', '#II',
  'III', 'bIII', '#III',
  'IV', 'bIV', '#IV',
  'V', 'bV', '#V',
  'VI', 'bVI', '#VI',
  'VII', 'bVII', '#VII',
]);

export const ChordFunctionSchema = z.enum([
  'tonic',
  'subdominant',
  'dominant',
  'substitute-dominant',
  'modal-interchange',
  'secondary-dominant',
  'passing',
  'augmented-sixth',
  'neapolitan',
]);

export const ChordPositionSchema = z.enum(['root', 'first', 'second', 'third']);

export const ChordShapeSchema = z.enum(['C', 'A', 'G', 'E', 'D', 'none']);

export const VoicingNoteSchema = z.object({
  note: NoteNameSchema,
  octave: z.number().int().min(0).max(8),
  string: z.number().int().min(0).max(5),
  fret: z.number().int().min(0).max(24),
  interval: IntervalSchema,
  finger: z.number().int().min(1).max(4).optional(),
});

export const ChordVoicingSchema = z.object({
  id: z.string(),
  name: z.string(),
  notes: z.array(VoicingNoteSchema),
  position: ChordPositionSchema,
  shape: ChordShapeSchema.optional(),
  fretRange: z.tuple([z.number(), z.number()]),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  muteStrings: z.array(z.number()).optional(),
});

export const ChordLibraryEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  root: NoteNameSchema,
  quality: ChordQualitySchema,
  extensions: z.array(IntervalSchema).optional(),
  intervals: z.array(IntervalSchema),
  aliases: z.array(z.string()).optional(),
  symbols: z.array(z.string()).optional(),
  voicings: z.array(ChordVoicingSchema),
  theory: z.object({
    function: ChordFunctionSchema.optional(),
    stability: z.enum(['stable', 'tense', 'dissonant', 'ambiguous']),
    tendency: z.array(NoteNameSchema).optional(),
    description: z.string(),
  }),
  emotional: z.object({
    feeling: z.string(),
    moods: z.array(z.string()),
    styles: z.array(z.string()),
  }),
  substitutions: z.array(z.string()).optional(),
});

export const DegreeChordsSchema = z.object({
  degree: ChordDegreeSchema,
  function: ChordFunctionSchema,
  diatonic: z.array(z.string()),
  secondaryDominants: z.array(z.string()).optional(),
  modalInterchange: z.array(z.string()).optional(),
  commonExtensions: z.array(z.string()).optional(),
  voicings: z.array(z.string()).optional(),
  advice: z.string(),
});

export const KeyChordLibrarySchema = z.object({
  key: NoteNameSchema,
  tonality: z.enum(['major', 'minor']),
  degrees: z.record(z.string(), DegreeChordsSchema),
  commonProgressions: z.array(z.object({
    name: z.string(),
    degrees: z.array(ChordDegreeSchema),
    description: z.string(),
  })),
});
