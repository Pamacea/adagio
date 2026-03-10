/**
 * ADAGIO - useChordSelection Hook
 *
 * Custom hook for managing chord selection state in the theory/chords page.
 * Extracts chord selection logic from the main page component.
 *
 * Features:
 * - State for selected chord (root + quality)
 * - State for selected voicing index
 * - Functions to change chord/voicing
 * - Memoized computed values for current chord data
 */

import { useState, useMemo, useCallback } from 'react';
import type { NoteName, ChordQuality, ChordVoicing } from '@adagio/types';
import {
  buildChord,
  getChordTension,
  getChordVoicings,
  getDegreeNote,
} from '@adagio/theory';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Selected chord state
 */
export interface SelectedChord {
  root: NoteName;
  quality: ChordQuality;
}

/**
 * Chord data computed from selection
 */
export interface ChordData {
  root: NoteName;
  quality: ChordQuality;
  name: string;
  notes: NoteName[];
  voicings: ChordVoicing[];
  tension: ReturnType<typeof getChordTension>;
}

/**
 * Hook configuration options
 */
export interface UseChordSelectionOptions {
  /** Initial root note (default: 'C') */
  initialRoot?: NoteName;
  /** Initial tonality (default: 'major') */
  initialTonality?: 'major' | 'minor';
  /** Initial degree (default: 'I') */
  initialDegree?: string;
  /** Maximum fret number for voicings (default: 24) */
  maxFrets?: number;
}

/**
 * Hook return value
 */
export interface UseChordSelectionReturn {
  // State
  /** Currently selected chord or null */
  selectedChord: SelectedChord | null;
  /** Index of selected voicing within chord's voicings */
  selectedVoicingIndex: number;
  /** Global root note (tonic) */
  root: NoteName;
  /** Current tonality (major/minor) */
  tonality: 'major' | 'minor';
  /** Currently selected diatonic degree */
  selectedDegree: string;

  // Setters
  /** Set the selected chord */
  setSelectedChord: (chord: SelectedChord | null) => void;
  /** Set the voicing index */
  setSelectedVoicingIndex: (index: number) => void;
  /** Set the root note (tonic) */
  setRoot: (root: NoteName) => void;
  /** Set the tonality */
  setTonality: (tonality: 'major' | 'minor') => void;
  /** Set the selected degree */
  setSelectedDegree: (degree: string) => void;

  // Computed values
  /** Current root note (either selected chord's root or degree-based root) */
  currentRoot: NoteName;
  /** Current chord quality */
  currentQuality: ChordQuality;
  /** Notes in the current chord */
  chordNotes: NoteName[];
  /** All available voicings for current chord */
  chordVoicings: ChordVoicing[];
  /** Currently selected voicing object */
  selectedVoicing: ChordVoicing | undefined;
  /** Tension/stability of current chord */
  chordTension: ReturnType<typeof getChordTension>;

  // Actions
  /** Select a chord by root and quality */
  selectChord: (root: NoteName, quality: ChordQuality) => void;
  /** Select the next voicing */
  nextVoicing: () => void;
  /** Select the previous voicing */
  prevVoicing: () => void;
  /** Reset selection to degree-based default */
  resetSelection: () => void;
  /** Toggle tonality between major and minor */
  toggleTonality: () => void;

  // Helpers
  /** Get complete chord data object */
  getChordData: () => ChordData | null;
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

/**
 * Custom hook for managing chord selection in theory/chords page
 *
 * @example
 * ```tsx
 * const {
 *   selectedChord,
 *   selectedVoicing,
 *   chordNotes,
 *   selectChord,
 *   nextVoicing,
 *   prevVoicing
 * } = useChordSelection();
 * ```
 */
export function useChordSelection(
  options: UseChordSelectionOptions = {}
): UseChordSelectionReturn {
  const {
    initialRoot = 'C',
    initialTonality = 'major',
    initialDegree = 'I',
    maxFrets = 24,
  } = options;

  // ==========================================================================
  // STATE
  // ==========================================================================

  const [root, setRoot] = useState<NoteName>(initialRoot);
  const [tonality, setTonality] = useState<'major' | 'minor'>(initialTonality);
  const [selectedDegree, setSelectedDegree] = useState<string>(initialDegree);
  const [selectedChord, setSelectedChord] = useState<SelectedChord | null>(null);
  const [selectedVoicingIndex, setSelectedVoicingIndex] = useState<number>(0);

  // ==========================================================================
  // COMPUTED VALUES
  // ==========================================================================

  /**
   * Current root note
   * Either the selected chord's root or the degree-based root
   */
  const currentRoot = useMemo(() => {
    if (selectedChord) return selectedChord.root;
    try {
      return getDegreeNote(root, selectedDegree as any, tonality);
    } catch {
      return root;
    }
  }, [root, tonality, selectedDegree, selectedChord]);

  /**
   * Current chord quality
   */
  const currentQuality = useMemo(() => {
    if (selectedChord) return selectedChord.quality;
    return '' as ChordQuality;
  }, [selectedChord]);

  /**
   * Notes in the current chord
   */
  const chordNotes = useMemo(() => {
    return buildChord(currentRoot, currentQuality, []);
  }, [currentRoot, currentQuality]);

  /**
   * All available voicings for the current chord
   */
  const chordVoicings = useMemo(() => {
    if (chordNotes.length === 0) return [];
    return getChordVoicings(currentRoot, currentQuality, maxFrets);
  }, [currentRoot, currentQuality, chordNotes, maxFrets]);

  /**
   * Currently selected voicing
   */
  const selectedVoicing = useMemo(() => {
    if (chordVoicings.length === 0) return undefined;
    const index = Math.min(selectedVoicingIndex, chordVoicings.length - 1);
    return chordVoicings[index];
  }, [chordVoicings, selectedVoicingIndex]);

  /**
   * Tension/stability of the current chord
   */
  const chordTension = useMemo(() => {
    return getChordTension(currentQuality);
  }, [currentQuality]);

  // ==========================================================================
  // ACTIONS
  // ==========================================================================

  /**
   * Select a chord by root and quality
   */
  const selectChord = useCallback((newRoot: NoteName, newQuality: ChordQuality) => {
    setSelectedChord({ root: newRoot, quality: newQuality });
    setSelectedVoicingIndex(0); // Reset to first voicing
  }, []);

  /**
   * Select the next voicing (cyclic)
   */
  const nextVoicing = useCallback(() => {
    setSelectedVoicingIndex((prev) => {
      if (chordVoicings.length === 0) return 0;
      return (prev + 1) % chordVoicings.length;
    });
  }, [chordVoicings.length]);

  /**
   * Select the previous voicing (cyclic)
   */
  const prevVoicing = useCallback(() => {
    setSelectedVoicingIndex((prev) => {
      if (chordVoicings.length === 0) return 0;
      return (prev - 1 + chordVoicings.length) % chordVoicings.length;
    });
  }, [chordVoicings.length]);

  /**
   * Reset selection to degree-based default
   */
  const resetSelection = useCallback(() => {
    setSelectedChord(null);
    setSelectedVoicingIndex(0);
  }, []);

  /**
   * Toggle tonality between major and minor
   */
  const toggleTonality = useCallback(() => {
    setTonality((prev) => (prev === 'major' ? 'minor' : 'major'));
  }, []);

  /**
   * Get complete chord data object
   */
  const getChordData = useCallback((): ChordData | null => {
    if (chordNotes.length === 0) return null;

    return {
      root: currentRoot,
      quality: currentQuality,
      name: `${currentRoot}${currentQuality || ''}`,
      notes: chordNotes,
      voicings: chordVoicings,
      tension: chordTension,
    };
  }, [currentRoot, currentQuality, chordNotes, chordVoicings, chordTension]);

  // ==========================================================================
  // RETURN VALUE
  // ==========================================================================

  return {
    // State
    selectedChord,
    selectedVoicingIndex,
    root,
    tonality,
    selectedDegree,

    // Setters
    setSelectedChord,
    setSelectedVoicingIndex,
    setRoot,
    setTonality,
    setSelectedDegree,

    // Computed values
    currentRoot,
    currentQuality,
    chordNotes,
    chordVoicings,
    selectedVoicing,
    chordTension,

    // Actions
    selectChord,
    nextVoicing,
    prevVoicing,
    resetSelection,
    toggleTonality,

    // Helpers
    getChordData,
  };
}

// ============================================================================
// BARREL EXPORT
// ============================================================================

export default useChordSelection;
