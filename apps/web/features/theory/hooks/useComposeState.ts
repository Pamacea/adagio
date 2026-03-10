/**
 * useComposeState - Hook personnalisé pour la page Compose
 *
 * Gère la sélection de tonique, mode, degré et variations d'accords
 */

import { useState, useMemo } from 'react';
import type { NoteName } from '@adagio/types';
import {
  MAJOR_KEYS,
  ROMAN_NUMERALS_MAJOR,
  ROMAN_NUMERALS_MINOR,
  DEGREE_COLORS,
  DEGREE_EMOTIONS,
  FRENCH_NOTE_NAMES,
} from '@adagio/theory';

// Types disponibles pour les gammes
export type ComposeScaleType =
  | 'major'
  | 'minor'
  | 'harmonicMinor'
  | 'melodicMinor'
  | 'dorian'
  | 'phrygian'
  | 'lydian'
  | 'mixolydian'
  | 'aeolian'
  | 'locrian';

export type KeyMode = 'major' | 'minor';

export interface ScaleDefinition {
  id: ComposeScaleType;
  name: string;
  nameFr: string;
  intervals: string[];
  description: string;
}

// Définitions des gammes disponibles
export const SCALE_TYPES: ScaleDefinition[] = [
  // Majeures
  { id: 'major', name: 'Major (Ionian)', nameFr: 'Majeur', intervals: ['1', '2', '3', '4', '5', '6', '7'], description: 'Heureux, stable' },
  { id: 'lydian', name: 'Lydian', nameFr: 'Lydien', intervals: ['1', '2', '3', '#4', '5', '6', '7'], description: 'Dreamy, spatial' },
  { id: 'mixolydian', name: 'Mixolydian', nameFr: 'Mixolydien', intervals: ['1', '2', '3', '4', '5', '6', 'b7'], description: 'Bluesy, dominant' },
  // Mineures
  { id: 'minor', name: 'Minor (Aeolian)', nameFr: 'Mineur', intervals: ['1', '2', 'b3', '4', '5', 'b6', 'b7'], description: 'Mélancolique' },
  { id: 'harmonicMinor', name: 'Harmonic Minor', nameFr: 'Mineur Harmonique', intervals: ['1', '2', 'b3', '4', '5', 'b6', '7'], description: 'Classique, metal' },
  { id: 'melodicMinor', name: 'Melodic Minor', nameFr: 'Mineur Mélodique', intervals: ['1', '2', 'b3', '4', '5', '6', '7'], description: 'Jazz, ascendant' },
  { id: 'dorian', name: 'Dorian', nameFr: 'Dorien', intervals: ['1', '2', 'b3', '4', '5', '6', 'b7'], description: 'Jazz, soulful' },
  { id: 'phrygian', name: 'Phrygian', nameFr: 'Phrygien', intervals: ['1', 'b2', 'b3', '4', '5', 'b6', 'b7'], description: 'Flamenco, espagnol' },
  { id: 'locrian', name: 'Locrian', nameFr: 'Locrien', intervals: ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7'], description: 'Instable, tensé' },
];

// ============================================================================
// RÉ-EXPORTS depuis @adagio/theory
// Ces constantes sont définies dans packages/theory/src/data
// TODO: Migrer tous les imports vers @adagio/theory directement
// ============================================================================
export { MAJOR_KEYS, ROMAN_NUMERALS_MAJOR, ROMAN_NUMERALS_MINOR, DEGREE_COLORS, DEGREE_EMOTIONS };
export const NOTE_FR_COMPOSE = FRENCH_NOTE_NAMES;

// ============================================================================
// THEORY FUNCTIONS
// ============================================================================

const SHARP_CHROMATIC: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_CHROMATIC: string[] = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
const MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10];
const FLAT_KEYS: NoteName[] = ['Db', 'Eb', 'Gb', 'Ab', 'Bb', 'F'];

export function getMajorScale(key: NoteName): string[] {
  const useFlats = FLAT_KEYS.includes(key);
  const chromatic = useFlats ? FLAT_CHROMATIC : SHARP_CHROMATIC;
  const keyIndex = chromatic.indexOf(key as string);

  if (keyIndex === -1) return ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  return MAJOR_INTERVALS.map(i => chromatic[(keyIndex + i) % 12]!);
}

export function getMajorChords(key: NoteName): string[] {
  const scale = getMajorScale(key);
  if (!scale || scale.length < 7) return ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim'];

  return [
    scale[0]!,                          // I
    scale[1]! + 'm',                    // ii
    scale[2]! + 'm',                    // iii
    scale[3]!,                          // IV
    scale[4]!,                          // V
    scale[5]! + 'm',                    // vi
    scale[6]! + 'dim',                  // vii°
  ];
}

export function getMinorScale(key: NoteName): string[] {
  const useFlats = FLAT_KEYS.includes(key);
  const chromatic = useFlats ? FLAT_CHROMATIC : SHARP_CHROMATIC;
  const keyIndex = chromatic.indexOf(key as string);

  if (keyIndex === -1) return ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'];

  return MINOR_INTERVALS.map(i => chromatic[(keyIndex + i) % 12]!);
}

export function getMinorChords(key: NoteName): string[] {
  const scale = getMinorScale(key);
  if (!scale || scale.length < 7) return ['Cm', 'Ddim', 'Eb', 'Fm', 'Gm', 'Ab', 'Bb'];

  return [
    scale[0]! + 'm',                    // i
    scale[1]! + 'dim',                  // ii°
    scale[2]!,                          // III
    scale[3]! + 'm',                    // iv
    scale[4]! + 'm',                    // v
    scale[5]!,                          // VI
    scale[6]!,                          // VII
  ];
}

// Notes d'un accord avec intervalles
export function getChordNotes(chord: string): { notes: string[]; intervals: string[] } {
  let root = chord;
  let quality = '';

  // Détecter les extensions
  if (chord.includes('maj7')) {
    root = chord.slice(0, -4);
    quality = 'maj7';
  } else if (chord.includes('m7')) {
    root = chord.slice(0, -2);
    quality = 'm7';
  } else if (chord.includes('7')) {
    root = chord.slice(0, -1);
    quality = '7';
  } else if (chord.includes('add9')) {
    root = chord.slice(0, -4);
    quality = 'add9';
  } else if (chord.includes('9')) {
    root = chord.slice(0, -1);
    quality = '9';
  } else if (chord.includes('11')) {
    root = chord.slice(0, -2);
    quality = '11';
  } else if (chord.includes('13')) {
    root = chord.slice(0, -2);
    quality = '13';
  } else if (chord.includes('6')) {
    root = chord.slice(0, -1);
    quality = '6';
  } else if (chord.includes('dim7')) {
    root = chord.slice(0, -4);
    quality = 'dim7';
  } else if (chord.endsWith('dim') || chord.endsWith('°')) {
    root = chord.slice(0, chord.endsWith('dim') ? -3 : -1);
    quality = 'dim';
  } else if (chord.endsWith('m') && !chord.includes('aj')) {
    root = chord.slice(0, -1);
    quality = 'm';
  }

  const useFlats = root.includes('b');
  const chromatic = useFlats ? FLAT_CHROMATIC : SHARP_CHROMATIC;
  const rootIndex = chromatic.indexOf(root);

  if (rootIndex === -1) return { notes: [root], intervals: ['1'] };

  const intervalPatterns: Record<string, { semitones: number[]; names: string[] }> = {
    '': { semitones: [0, 4, 7], names: ['1', '3', '5'] },
    'm': { semitones: [0, 3, 7], names: ['1', 'b3', '5'] },
    'dim': { semitones: [0, 3, 6], names: ['1', 'b3', 'b5'] },
    'dim7': { semitones: [0, 3, 6, 9], names: ['1', 'b3', 'b5', 'bb7'] },
    '6': { semitones: [0, 4, 7, 9], names: ['1', '3', '5', '6'] },
    '7': { semitones: [0, 4, 7, 10], names: ['1', '3', '5', 'b7'] },
    'maj7': { semitones: [0, 4, 7, 11], names: ['1', '3', '5', '7'] },
    'm7': { semitones: [0, 3, 7, 10], names: ['1', 'b3', '5', 'b7'] },
    '9': { semitones: [0, 4, 7, 10, 14], names: ['1', '3', '5', 'b7', '9'] },
    '11': { semitones: [0, 4, 7, 10, 14, 17], names: ['1', '3', '5', 'b7', '9', '11'] },
    '13': { semitones: [0, 4, 7, 10, 14, 17, 21], names: ['1', '3', '5', 'b7', '9', '11', '13'] },
    'add9': { semitones: [0, 4, 7, 14], names: ['1', '3', '5', '9'] },
  };

  const pattern = intervalPatterns[quality] || intervalPatterns['']!;
  const notes = pattern.semitones.map(i => {
    const noteIndex = (rootIndex + i) % 12;
    return chromatic[noteIndex]!;
  });

  return { notes, intervals: pattern.names };
}

// ============================================================================
// VARIATIONS D'ACCORDS
// ============================================================================

export interface ChordVariation {
  id: string;
  name: string;
  symbol: string;
  category: 'basic' | 'extension' | 'substitution' | 'modal' | 'advanced';
  description: string;
  emotion?: string;
}

export function getVariationsForDegree(degree: number, rootNote: string, isMinorMode: boolean): ChordVariation[] {
  const variations: ChordVariation[] = [];

  if (degree === 0) { // I
    variations.push(
      { id: 'basic', name: 'Tonique', symbol: rootNote, category: 'basic', description: 'Stabilité maximale', emotion: 'Repos' },
      { id: 'maj7', name: 'Maj7', symbol: rootNote + 'maj7', category: 'extension', description: 'Jazz élégant', emotion: 'Serein' },
      { id: 'maj9', name: 'Maj9', symbol: rootNote + 'maj9', category: 'extension', description: 'Richesse harmonique', emotion: 'Rêveur' },
      { id: 'add9', name: 'Add9', symbol: rootNote + 'add9', category: 'extension', description: 'Folk, pop', emotion: 'Ouvert' },
      { id: '6', name: 'Sixte', symbol: rootNote + '6', category: 'extension', description: 'Sonnalité nostalgique', emotion: 'Doux' },
      { id: 'lydian', name: 'Lydien (#11)', symbol: rootNote + 'maj7#11', category: 'modal', description: 'Mystique, spatial', emotion: 'Éthéré' }
    );
  }

  if (degree === 1) { // ii
    variations.push(
      { id: 'basic', name: 'Mineur', symbol: rootNote + 'm', category: 'basic', description: 'Douceur préparatoire', emotion: 'Mouvement' },
      { id: 'm7', name: 'Min7', symbol: rootNote + 'm7', category: 'extension', description: 'Jazz ii-V-I', emotion: 'Sophistiqué' },
      { id: 'm9', name: 'Min9', symbol: rootNote + 'm9', category: 'extension', description: 'Richesse colorée', emotion: 'Nostalgie' },
      { id: 'm11', name: 'Min11', symbol: rootNote + 'm11', category: 'extension', description: 'Ambiance mystique', emotion: 'Flore' }
    );
  }

  if (degree === 2) { // iii
    if (isMinorMode) {
      variations.push(
        { id: 'basic', name: 'Majeur', symbol: rootNote, category: 'basic', description: 'Tierce de la tonique', emotion: 'Lumineux' },
        { id: 'maj7', name: 'Maj7', symbol: rootNote + 'maj7', category: 'extension', description: 'Élégant', emotion: 'Clair' }
      );
    } else {
      variations.push(
        { id: 'basic', name: 'Mineur', symbol: rootNote + 'm', category: 'basic', description: 'Tendre', emotion: 'Nostalgie' },
        { id: 'm7', name: 'Min7', symbol: rootNote + 'm7', category: 'extension', description: 'Jazz soft', emotion: 'Doux' }
      );
    }
  }

  if (degree === 3) { // IV
    variations.push(
      { id: 'basic', name: 'Majeur', symbol: rootNote, category: 'basic', description: 'Aventure', emotion: 'Lumineux' },
      { id: 'maj7', name: 'Maj7', symbol: rootNote + 'maj7', category: 'extension', description: 'Stable', emotion: 'Calme' },
      { id: 'add9', name: 'Add9', symbol: rootNote + 'add9', category: 'extension', description: 'Ouvert', emotion: 'Espoir' },
      { id: 'lydian', name: 'Lydien', symbol: rootNote + 'maj7#11', category: 'modal', description: 'Spatial, dreamy', emotion: 'Éthéré' }
    );
  }

  if (degree === 4) { // V
    variations.push(
      { id: 'basic', name: 'Majeur', symbol: rootNote, category: 'basic', description: 'Tension vers I', emotion: 'Dynamique' },
      { id: '7', name: '7', symbol: rootNote + '7', category: 'basic', description: 'Dominante classique', emotion: 'Besoin de résolution' },
      { id: '9', name: '9', symbol: rootNote + '9', category: 'extension', description: 'Blues, rock', emotion: 'Groove' },
      { id: '13', name: '13', symbol: rootNote + '13', category: 'extension', description: 'Funk', emotion: 'Dansant' },
      { id: '7alt', name: '7alt', symbol: rootNote + '7alt', category: 'advanced', description: 'Tension jazz maximale', emotion: 'Dissonance' },
      { id: '7#11', name: '7#11', symbol: rootNote + '7#11', category: 'modal', description: 'Lydien dominant', emotion: 'Mystique' }
    );
  }

  if (degree === 5) { // vi
    if (isMinorMode) {
      variations.push(
        { id: 'basic', name: 'Majeur', symbol: rootNote, category: 'basic', description: 'Relative majeur', emotion: 'Espoir' },
        { id: 'add9', name: 'Add9', symbol: rootNote + 'add9', category: 'extension', description: 'Pop', emotion: 'Joyeux' }
      );
    } else {
      variations.push(
        { id: 'basic', name: 'Mineur', symbol: rootNote + 'm', category: 'basic', description: 'Émotionnel', emotion: 'Tristesse' },
        { id: 'm7', name: 'Min7', symbol: rootNote + 'm7', category: 'extension', description: 'Soul, R&B', emotion: 'Doux' },
        { id: 'm9', name: 'Min9', symbol: rootNote + 'm9', category: 'extension', description: 'Jazz', emotion: 'Élégant' }
      );
    }
  }

  if (degree === 6) { // vii°
    variations.push(
      { id: 'basic', name: 'Diminué', symbol: rootNote + 'dim', category: 'basic', description: 'Tension dramatique', emotion: 'Instable' },
      { id: 'dim7', name: 'Dim7', symbol: rootNote + 'dim7', category: 'extension', description: 'Complètement diminué', emotion: 'Dissonance' },
      { id: 'm7b5', name: 'Min7b5', symbol: rootNote + 'm7b5', category: 'substitution', description: 'Half-diminué', emotion: 'Mystère' }
    );
  }

  return variations;
}

// ============================================================================
// PROGRESSIONS
// ============================================================================

export interface Progression {
  name: string;
  degrees: string[];
  description: string;
  emotion: string;
  genre: string[];
}

export function getCommonProgressions(key: NoteName): Progression[] {
  return [
    {
      name: 'I-V-vi-IV',
      degrees: ['I', 'V', 'vi', 'IV'],
      description: 'La progression pop moderne par excellence',
      emotion: 'Émotionnel et entraînant',
      genre: ['Pop', 'Rock', 'EDM']
    },
    {
      name: 'I-IV-V (Blues)',
      degrees: ['I', 'IV', 'V'],
      description: 'Base du blues, du rock et de la country',
      emotion: 'Direct et puissant',
      genre: ['Blues', 'Rock', 'Country']
    },
    {
      name: 'ii-V-I (Jazz)',
      degrees: ['ii', 'V', 'I'],
      description: 'La progression jazz la plus classique',
      emotion: 'Tension → Résolution sophistiquée',
      genre: ['Jazz', 'Bossa Nova']
    },
    {
      name: 'vi-IV-I-V',
      degrees: ['vi', 'IV', 'I', 'V'],
      description: 'Variation émotionnelle du pop',
      emotion: 'Nostalgique et uplifting',
      genre: ['Pop Ballad', 'Rock']
    },
    {
      name: 'I-vi-ii-V (Turnaround)',
      degrees: ['I', 'vi', 'ii', 'V'],
      description: 'Retour cyclique à la tonique',
      emotion: 'Sophistiqué et swing',
      genre: ['Jazz', 'R&B']
    },
    {
      name: 'Cycle de quintes',
      degrees: ['iii', 'vi', 'ii', 'V', 'I'],
      description: 'Descente par quintes diatoniques',
      emotion: 'Naturel et fluide',
      genre: ['Jazz', 'Bossa Nova']
    },
  ];
}

// ============================================================================
// SUBSTITUTIONS
// ============================================================================

export interface ChordSubstitution {
  name: string;
  chord: string;
  description: string;
  type: 'substitution' | 'extension' | 'voicing';
}

export function getSubstitutions(chord: string, degree: number, key: NoteName): ChordSubstitution[] {
  const subs: ChordSubstitution[] = [];
  const scale = getMajorScale(key);

  const root = chord.replace(/m|dim|°|7|maj|add/g, '');
  const isMinor = chord.endsWith('m') && !chord.includes('aj');
  const isDim = chord.includes('dim') || chord.endsWith('°');
  const isMajor = !isMinor && !isDim;

  // Extensions
  if (isMajor) {
    if (degree === 0) {
      subs.push({ name: 'Tonique majeure 7', chord: root + 'maj7', description: 'Son jazz élégant', type: 'extension' });
      subs.push({ name: 'Sixte majeure', chord: root + '6', description: 'Sonnalité ouverte', type: 'extension' });
      subs.push({ name: 'Add9', chord: root + 'add9', description: 'Richesse supplémentaire', type: 'extension' });
    }
    if (degree === 3) {
      subs.push({ name: 'Subdominante majeure 7', chord: root + 'maj7', description: 'Lumineux et stable', type: 'extension' });
    }
    if (degree === 4) {
      subs.push({ name: 'Dominante 7', chord: root + '7', description: 'Tension vers I', type: 'extension' });
      subs.push({ name: 'Dominante 9', chord: root + '9', description: 'Couleur jazz/blues', type: 'extension' });
      subs.push({ name: '7#11', chord: root + '7#11', description: 'Lydien dominant', type: 'extension' });
    }
  }

  if (isMinor) {
    if (degree === 5) {
      subs.push({ name: 'Mineur 7', chord: root + 'm7', description: 'Douceur soul/R&B', type: 'extension' });
      subs.push({ name: 'Mineur 9', chord: root + 'm9', description: 'Jazz mineur', type: 'extension' });
    }
    if (degree === 1) {
      subs.push({ name: 'Mineur 7', chord: root + 'm7', description: 'Prédominant jazz', type: 'extension' });
    }
  }

  if (isDim) {
    subs.push({ name: 'Diminué 7', chord: root + 'dim7', description: 'Tension dramatique', type: 'extension' });
  }

  // Substitutions
  if (degree === 0 && scale[5]) {
    subs.push({ name: 'Relative mineure', chord: scale[5] + 'm', description: 'Mêmes notes que I, ambiance triste', type: 'substitution' });
  }
  if (degree === 5 && scale[0]) {
    subs.push({ name: 'Relative majeure', chord: scale[0], description: 'Résolution stable', type: 'substitution' });
  }
  if (degree === 4 && scale[3]) {
    const tritoneRoot = scale[3];
    subs.push({ name: 'Substitution triton', chord: tritoneRoot + '7', description: 'II♭7, même notes que V7', type: 'substitution' });
  }

  return subs;
}

// ============================================================================
// STATE & HOOK
// ============================================================================

export interface ComposeState {
  selectedKey: NoteName;
  keyMode: KeyMode;
  selectedDegree: number | null;
  selectedVariations: Record<number, string>;
}

export interface UseComposeStateReturn {
  // État
  state: ComposeState;
  selectedKey: NoteName;
  keyMode: KeyMode;
  selectedDegree: number | null;
  selectedVariations: Record<number, string>;

  // Données calculées
  scaleNotes: string[];
  chords: string[];
  progressions: Progression[];
  chordVariations: Record<number, ChordVariation[]>;
  selectedChord: string | null;
  chordSubstitutions: ChordSubstitution[];
  chordDetails: { notes: string[]; intervals: string[] } | null;
  selectedVariationDetails: ChordVariation | null;

  // Setters
  setSelectedKey: (key: NoteName) => void;
  setKeyMode: (mode: KeyMode) => void;
  setSelectedDegree: (degree: number | null) => void;
  setSelectedVariation: (degree: number, variationId: string) => void;
  resetVariations: () => void;
}

export interface UseComposeStateOptions {
  initialKey?: NoteName;
  initialKeyMode?: KeyMode;
}

const DEFAULT_VARIATIONS: Record<number, string> = {
  0: 'basic',
  1: 'basic',
  2: 'basic',
  3: 'basic',
  4: 'basic',
  5: 'basic',
  6: 'basic',
};

export function useComposeState(options: UseComposeStateOptions = {}): UseComposeStateReturn {
  const {
    initialKey = 'C',
    initialKeyMode = 'major',
  } = options;

  const [selectedKey, setSelectedKey] = useState<NoteName>(initialKey);
  const [keyMode, setKeyMode] = useState<KeyMode>(initialKeyMode);
  const [selectedDegree, setSelectedDegree] = useState<number | null>(null);
  const [selectedVariations, setSelectedVariations] = useState<Record<number, string>>(DEFAULT_VARIATIONS);

  // Données calculées
  const scaleNotes = useMemo(() => {
    return keyMode === 'major' ? getMajorScale(selectedKey) : getMinorScale(selectedKey);
  }, [selectedKey, keyMode]);

  const chords = useMemo(() => {
    return keyMode === 'major' ? getMajorChords(selectedKey) : getMinorChords(selectedKey);
  }, [selectedKey, keyMode]);

  const progressions = useMemo(() => getCommonProgressions(selectedKey), [selectedKey]);

  const chordVariations = useMemo(() => {
    const variations: Record<number, ChordVariation[]> = {};
    for (let i = 0; i < 7; i++) {
      variations[i] = getVariationsForDegree(i, chords[i]?.replace(/m|dim|°/g, '') || '', keyMode === 'minor');
    }
    return variations;
  }, [chords, keyMode]);

  const selectedChord = useMemo(() => {
    if (selectedDegree === null) return null;
    const variationId = selectedVariations[selectedDegree] || 'basic';
    const variations = chordVariations[selectedDegree];
    const variation = variations?.find(v => v.id === variationId);
    return variation?.symbol || chords[selectedDegree] || null;
  }, [selectedDegree, selectedVariations, chordVariations, chords]);

  const chordSubstitutions = useMemo(() => {
    if (selectedDegree === null) return [];
    return getSubstitutions(chords[selectedDegree]!, selectedDegree, selectedKey);
  }, [selectedDegree, chords, selectedKey]);

  const chordDetails = useMemo(() => {
    if (!selectedChord) return null;
    return getChordNotes(selectedChord);
  }, [selectedChord]);

  const selectedVariationDetails = useMemo(() => {
    if (selectedDegree === null) return null;
    const variations = chordVariations[selectedDegree];
    const selectedVariation = selectedVariations[selectedDegree] || 'basic';
    return variations?.find(v => v.id === selectedVariation) || null;
  }, [selectedDegree, selectedVariations, chordVariations]);

  // Actions
  const resetVariations = () => {
    setSelectedVariations(DEFAULT_VARIATIONS);
  };

  const setSelectedVariation = (degree: number, variationId: string) => {
    setSelectedVariations(prev => ({ ...prev, [degree]: variationId }));
  };

  const state: ComposeState = {
    selectedKey,
    keyMode,
    selectedDegree,
    selectedVariations,
  };

  return {
    // État
    state,
    selectedKey,
    keyMode,
    selectedDegree,
    selectedVariations,

    // Données calculées
    scaleNotes,
    chords,
    progressions,
    chordVariations,
    selectedChord,
    chordSubstitutions,
    chordDetails,
    selectedVariationDetails,

    // Setters
    setSelectedKey,
    setKeyMode,
    setSelectedDegree,
    setSelectedVariation,
    resetVariations,
  };
}
