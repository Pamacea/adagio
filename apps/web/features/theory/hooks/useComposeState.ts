/**
 * useComposeState - Hook personnalisé pour la page Compose
 *
 * Gère la sélection de tonique, mode, degré et variations d'accords.
 * Toute la théorie (gammes, accords diatoniques, variations, substitutions,
 * progressions, notes d'accord) provient de @adagio/theory (purge étape 6 P1).
 */

import { useState, useMemo } from 'react';
import type { NoteName } from '@adagio/types';
import {
  parseChord,
  getMajorScale,
  getMinorScale,
  getMajorChords,
  getMinorChords,
  getChordNotes,
  getVariationsForDegree,
  getChordSubstitutionsByDegree,
  COMPOSE_PROGRESSIONS,
} from '@adagio/theory';
import type {
  KeyMode,
  ChordVariation,
  ChordSubstitution,
  ComposeProgression,
} from '@adagio/theory';

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
  progressions: ComposeProgression[];
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
  const { initialKey = 'C', initialKeyMode = 'major' } = options;

  const [selectedKey, setSelectedKey] = useState<NoteName>(initialKey);
  const [keyMode, setKeyMode] = useState<KeyMode>(initialKeyMode);
  const [selectedDegree, setSelectedDegree] = useState<number | null>(null);
  const [selectedVariations, setSelectedVariations] =
    useState<Record<number, string>>(DEFAULT_VARIATIONS);

  // Données calculées
  const scaleNotes = useMemo(() => {
    return keyMode === 'major' ? getMajorScale(selectedKey) : getMinorScale(selectedKey);
  }, [selectedKey, keyMode]);

  const chords = useMemo(() => {
    return keyMode === 'major' ? getMajorChords(selectedKey) : getMinorChords(selectedKey);
  }, [selectedKey, keyMode]);

  const progressions = useMemo(() => COMPOSE_PROGRESSIONS, []);

  const chordVariations = useMemo(() => {
    const variations: Record<number, ChordVariation[]> = {};
    for (let i = 0; i < 7; i++) {
      const chordSym = chords[i] ?? '';
      // Parser unique (ChordRef) : extraction de la racine diatonique
      const rootNote = parseChord(chordSym)?.root ?? chordSym;
      variations[i] = getVariationsForDegree(i, rootNote, keyMode === 'minor');
    }
    return variations;
  }, [chords, keyMode]);

  const selectedChord = useMemo(() => {
    if (selectedDegree === null) return null;
    const variationId = selectedVariations[selectedDegree] || 'basic';
    const variations = chordVariations[selectedDegree];
    const variation = variations?.find((v) => v.id === variationId);
    return variation?.symbol || chords[selectedDegree] || null;
  }, [selectedDegree, selectedVariations, chordVariations, chords]);

  const chordSubstitutions = useMemo(() => {
    if (selectedDegree === null) return [];
    return getChordSubstitutionsByDegree(chords[selectedDegree]!, selectedDegree, selectedKey);
  }, [selectedDegree, chords, selectedKey]);

  const chordDetails = useMemo(() => {
    if (!selectedChord) return null;
    return getChordNotes(selectedChord);
  }, [selectedChord]);

  const selectedVariationDetails = useMemo(() => {
    if (selectedDegree === null) return null;
    const variations = chordVariations[selectedDegree];
    const selectedVariation = selectedVariations[selectedDegree] || 'basic';
    return variations?.find((v) => v.id === selectedVariation) || null;
  }, [selectedDegree, selectedVariations, chordVariations]);

  // Actions
  const resetVariations = () => {
    setSelectedVariations(DEFAULT_VARIATIONS);
  };

  const setSelectedVariation = (degree: number, variationId: string) => {
    setSelectedVariations((prev) => ({ ...prev, [degree]: variationId }));
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
