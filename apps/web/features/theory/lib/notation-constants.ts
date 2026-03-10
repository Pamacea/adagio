/**
 * notation-constants - Constantes pour la notation musicale
 */

import type { NoteName, ChordQuality } from '@adagio/types';

// Mapping des notes anglaises vers françaises
export const NOTE_FR: Record<string, string> = {
  'C': 'DO', 'C#': 'DO#', 'Db': 'REb',
  'D': 'RE', 'D#': 'RE#', 'Eb': 'MIb',
  'E': 'MI',
  'F': 'FA', 'F#': 'FA#', 'Gb': 'SOLb',
  'G': 'SOL', 'G#': 'SOL#', 'Ab': 'LAb',
  'A': 'LA', 'A#': 'LA#', 'Bb': 'SIb',
  'B': 'SI',
};

// Degrés romains
export const DEGREES_ROMAINS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'] as const;
export const DEGREES_ROMAINS_MIN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'] as const;

// Accords communs
export const COMMON_CHORDS: Array<{
  root: NoteName;
  quality: ChordQuality;
  name: string;
  fr: string;
  description: string;
}> = [
  { root: 'C', quality: '', name: 'C', fr: 'DO majeur', description: 'Majeur: Tonique - Tierce majeure - Quinte juste' },
  { root: 'C', quality: 'm', name: 'Cm', fr: 'DO mineur', description: 'Mineur: Tonique - Tierce mineure - Quinte juste' },
  { root: 'C', quality: '7', name: 'C7', fr: 'DO 7', description: 'Dominant 7: Majeur + septième mineure' },
  { root: 'C', quality: 'maj7', name: 'Cmaj7', fr: 'DO maj7', description: 'Majeur 7: Majeur + septième majeure' },
  { root: 'C', quality: 'm7', name: 'Cm7', fr: 'DO mineur 7', description: 'Mineur 7: Mineur + septième mineure' },
  { root: 'C', quality: 'dim', name: 'Cdim', fr: 'DO diminué', description: 'Diminué: Tierce mineure - Quinte diminuée' },
  { root: 'C', quality: 'dim7', name: 'Cdim7', fr: 'DO 7 diminué', description: 'Septième diminué: Toutes tierces mineures' },
  { root: 'C', quality: 'aug', name: 'Caug', fr: 'DO augmenté', description: 'Augmenté: Tierce majeure - Quinte augmentée' },
  { root: 'C', quality: 'sus4', name: 'Csus4', fr: 'DO sus4', description: 'Sus4: Tierce remplacée par quarte' },
  { root: 'C', quality: '7sus4', name: 'C7sus4', fr: 'DO 7 sus4', description: '7sus4: Sus4 + septième mineure' },
];

// Progressions classiques
export const PROGRESSIONS: Array<{
  name: string;
  description: string;
  key: string;
  chords: string[];
  degrees: string[];
  extraInfo?: string;
}> = [
  {
    name: 'I - IV - V',
    description: 'Blues / Rock classique',
    key: 'A',
    chords: ['A', 'D', 'E'],
    degrees: ['I', 'IV', 'V'],
    extraInfo: 'La base du rock, du blues et de la musique classique.',
  },
  {
    name: 'I - V - vi - IV',
    description: 'Pop moderne',
    key: 'C',
    chords: ['C', 'G', 'Am', 'F'],
    degrees: ['I', 'V', 'vi', 'IV'],
    extraInfo: 'Utilisée dans des centaines de chansons pop.',
  },
  {
    name: 'vi - IV - I - V',
    description: 'Ballades rock',
    key: 'E',
    chords: ['C#m', 'A', 'E', 'B'],
    degrees: ['vi', 'IV', 'I', 'V'],
    extraInfo: 'Progression émotionnelle pour ballades.',
  },
  {
    name: 'i - VI - VII',
    description: 'Metal / Doom',
    key: 'E',
    chords: ['Em', 'C', 'D'],
    degrees: ['i', 'VI', 'VII'],
    extraInfo: 'Typique du metal doom et gothique.',
  },
  {
    name: 'i - bII - bIII - bV',
    description: 'Phrygien espagnol',
    key: 'E',
    chords: ['Em', 'F', 'G', 'Bb'],
    degrees: ['i', 'bII', 'bIII', 'bV'],
    extraInfo: 'Son flamenco et phrygien.',
  },
  {
    name: 'ii - V - I',
    description: 'Jazz standard',
    key: 'C',
    chords: ['Dm7', 'G7', 'Cmaj7'],
    degrees: ['ii', 'V', 'I'],
    extraInfo: 'La progression jazz par excellence.',
  },
];

// Notes de la portée
export const STAVE_NOTES = ['DO', 'RE', 'MI', 'FA', 'SOL', 'LA', 'SI'] as const;

// Formules d'accords
export const CHORD_FORMULAS = [
  { name: 'Majeur', intervals: '1 - 3 - 5', description: 'Tonique, Tierce majeure, Quinte juste' },
  { name: 'Mineur', intervals: '1 - b3 - 5', description: 'Tonique, Tierce mineure, Quinte juste' },
  { name: 'Power Chord', intervals: '1 - 5', description: 'Tonique, Quinte (pas de tierce)' },
  { name: '7ème Dominante', intervals: '1 - 3 - 5 - b7', description: 'Majeur + septième mineure' },
  { name: '7ème Majeure', intervals: '1 - 3 - 5 - 7', description: 'Majeur + septième majeure' },
  { name: 'Diminué', intervals: '1 - b3 - b5', description: 'Tierce et quinte diminuées' },
  { name: 'Augmenté', intervals: '1 - 3 - #5', description: 'Tierce majeure, quinte augmentée' },
  { name: 'Sus4', intervals: '1 - 4 - 5', description: 'Quarte au lieu de la tierce' },
] as const;

// Figures de notes (rythme)
export const NOTE_VALUES = [
  {
    name: 'Ronde',
    value: '4 temps',
  },
  {
    name: 'Blanche',
    value: '2 temps',
  },
  {
    name: 'Noire',
    value: '1 temps',
  },
  {
    name: 'Croche',
    value: '1/2 temps',
  },
] as const;

// Helper function
export function displayNote(note: string): string {
  return NOTE_FR[note] || note;
}
