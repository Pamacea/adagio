/**
 * ADAGIO - Notation Data
 * Données pour la page de notation musicale
 */

import type { NoteName, ChordQuality } from '@adagio/types';

// ============================================================================
// NOTES FRANÇAISES
// ============================================================================

/** Mapping des notes anglaises vers françaises */
export const FRENCH_NOTE_NAMES: Record<string, string> = {
  'C': 'DO', 'C#': 'DO♯', 'Db': 'RÉ♭',
  'D': 'RÉ', 'D#': 'RÉ♯', 'Eb': 'MI♭',
  'E': 'MI',
  'F': 'FA', 'F#': 'FA♯', 'Gb': 'SOL♭',
  'G': 'SOL', 'G#': 'SOL♯', 'Ab': 'LA♭',
  'A': 'LA', 'A#': 'LA♯', 'Bb': 'SI♭',
  'B': 'SI',
};

/** Notes de la gamme en français */
export const FRENCH_SCALE_NOTES = ['DO', 'RÉ', 'MI', 'FA', 'SOL', 'LA', 'SI'] as const;

// ============================================================================
// DEGRÉS ROMAINS
// ============================================================================

/** Degrés romains majeurs */
export const ROMAN_DEGREES_MAJOR = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'] as const;

/** Degrés romains mineurs */
export const ROMAN_DEGREES_MINOR = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii°'] as const;

// ============================================================================
// TYPES D'ACCORDS
// ============================================================================

export interface ChordDefinition {
  root: NoteName;
  quality: ChordQuality;
  name: string;
  fr: string;
  description?: string;
}

/** Accords communs avec leurs descriptions */
export const CHORD_DEFINITIONS: ChordDefinition[] = [
  { root: 'C', quality: '', name: 'C', fr: 'DO majeur', description: 'Tonique - Tierce majeure - Quinte juste' },
  { root: 'C', quality: 'm', name: 'Cm', fr: 'DO mineur', description: 'Tonique - Tierce mineure - Quinte juste' },
  { root: 'C', quality: '7', name: 'C7', fr: 'DO 7', description: 'Majeur + Septième mineure' },
  { root: 'C', quality: 'maj7', name: 'Cmaj7', fr: 'DO maj7', description: 'Majeur + Septième majeure' },
  { root: 'C', quality: 'm7', name: 'Cm7', fr: 'DO mineur 7', description: 'Mineur + Septième mineure' },
  { root: 'C', quality: 'dim', name: 'Cdim', fr: 'DO diminué', description: 'Tierce mineure - Quinte diminuée' },
  { root: 'C', quality: 'dim7', name: 'Cdim7', fr: 'DO 7 diminué', description: 'Toutes tierces mineures' },
  { root: 'C', quality: 'aug', name: 'Caug', fr: 'DO augmenté', description: 'Tierce majeure - Quinte augmentée' },
  { root: 'C', quality: 'sus4', name: 'Csus4', fr: 'DO sus4', description: 'Tierce remplacée par quarte' },
  { root: 'C', quality: '7sus4', name: 'C7sus4', fr: 'DO 7 sus4', description: 'Sus4 + Septième mineure' },
];

// ============================================================================
// FORMULES D'ACCORDS
// ============================================================================

export interface ChordFormula {
  name: string;
  intervals: string;
  description: string;
}

/** Formules d'accords avec intervalles */
export const CHORD_FORMULAS: ChordFormula[] = [
  { name: 'Majeur', intervals: '1 - 3 - 5', description: 'Tonique, Tierce majeure, Quinte juste' },
  { name: 'Mineur', intervals: '1 - b3 - 5', description: 'Tonique, Tierce mineure, Quinte juste' },
  { name: 'Power Chord', intervals: '1 - 5', description: 'Tonique, Quinte (pas de tierce)' },
  { name: '7eme Dominante', intervals: '1 - 3 - 5 - b7', description: 'Majeur + Septième mineure' },
  { name: '7eme Majeure', intervals: '1 - 3 - 5 - 7', description: 'Majeur + Septième majeure' },
  { name: 'Diminue', intervals: '1 - b3 - b5', description: 'Tierce et quinte diminuées' },
  { name: 'Augmente', intervals: '1 - 3 - #5', description: 'Tierce majeure, Quinte augmentée' },
  { name: 'Sus4', intervals: '1 - 4 - 5', description: 'Quarte au lieu de la tierce' },
];

// ============================================================================
// PROGRESSIONS D'ACCORDS
// ============================================================================

export interface ChordProgression {
  name: string;
  description: string;
  key: NoteName | string;
  chords: string[];
  degrees: string[];
  detail?: string;
}

/** Progressions d'accords classiques */
export const CHORD_PROGRESSIONS: ChordProgression[] = [
  {
    name: 'I - IV - V',
    description: 'Blues / Rock classique',
    key: 'A',
    chords: ['A', 'D', 'E'],
    degrees: ['I', 'IV', 'V'],
    detail: 'La base du rock, du blues et de la musique classique.',
  },
  {
    name: 'I - V - vi - IV',
    description: 'Pop moderne',
    key: 'C',
    chords: ['C', 'G', 'Am', 'F'],
    degrees: ['I', 'V', 'vi', 'IV'],
    detail: 'Utilisée dans des centaines de chansons pop.',
  },
  {
    name: 'vi - IV - I - V',
    description: 'Ballades rock',
    key: 'E',
    chords: ['C#m', 'A', 'E', 'B'],
    degrees: ['vi', 'IV', 'I', 'V'],
    detail: 'Progression émotionnelle pour ballades.',
  },
  {
    name: 'i - VI - VII',
    description: 'Metal / Doom',
    key: 'E',
    chords: ['Em', 'C', 'D'],
    degrees: ['i', 'VI', 'VII'],
    detail: 'Typique du metal doom et gothique.',
  },
  {
    name: 'i - bII - bIII - bV',
    description: 'Phrygien espagnol',
    key: 'E',
    chords: ['Em', 'F', 'G', 'Bb'],
    degrees: ['i', 'bII', 'bIII', 'bV'],
    detail: 'Son flamenco et phrygien.',
  },
  {
    name: 'ii - V - I',
    description: 'Jazz standard',
    key: 'C',
    chords: ['Dm7', 'G7', 'Cmaj7'],
    degrees: ['ii', 'V', 'I'],
    detail: 'La progression jazz par excellence.',
  },
];
