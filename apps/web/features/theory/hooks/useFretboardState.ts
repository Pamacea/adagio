/**
 * useFretboardState - Hook personnalisé pour la page Fretboard
 *
 * Gère la sélection de tonique, mode et options d'affichage
 */

import { useMemo, useState } from 'react';
import type { NoteName, ModeName, Interval } from '@adagio/types';
import { getFretboardNotesForKey } from '@adagio/theory';
import { calculateFretPositions } from '@/components/theory/scales/ScaleFretboard';

// Intervalles pour chaque mode (notation string comme '1', 'b3', etc.)
const MODE_INTERVALS: Record<ModeName, Interval[]> = {
  ionian: ['1', '2', '3', '4', '5', '6', '7'],
  dorian: ['1', '2', 'b3', '4', '5', '6', 'b7'],
  phrygian: ['1', 'b2', 'b3', '4', '5', 'b6', 'b7'],
  lydian: ['1', '2', '3', '#4', '5', '6', '7'],
  mixolydian: ['1', '2', '3', '4', '5', '6', 'b7'],
  aeolian: ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
  locrian: ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7'],
};

export interface FretboardStateOptions {
  initialRoot?: NoteName;
  initialMode?: ModeName;
  initialFretCount?: 12 | 15 | 17 | 19 | 21 | 24;
  initialShowAllNotes?: boolean;
}

export interface UseFretboardStateReturn {
  // État
  root: NoteName;
  mode: ModeName;
  fretCount: 12 | 15 | 17 | 19 | 21 | 24;
  showAllNotes: boolean;

  // Setters
  setRoot: (root: NoteName) => void;
  setMode: (mode: ModeName) => void;
  setFretCount: (count: UseFretboardStateReturn['fretCount']) => void;
  setShowAllNotes: (show: boolean) => void;

  // Actions
  toggleShowAllNotes: () => void;

  // Données calculées
  fretboardData: ReturnType<typeof getFretboardNotesForKey>;
  fretPositions: number[];
  svgWidth: number;
  displayNote: (note: string) => string;
}

export const MODE_NAMES: Record<ModeName, string> = {
  ionian: 'Majeur',
  dorian: 'Dorien',
  phrygian: 'Phygien',
  lydian: 'Lydien',
  mixolydian: 'Mixolydien',
  aeolian: 'Mineur',
  locrian: 'Locrien',
};

export const ROOTS: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;

export function useFretboardState(options: FretboardStateOptions = {}): UseFretboardStateReturn {
  const {
    initialRoot = 'C',
    initialMode = 'ionian',
    initialFretCount = 12,
    initialShowAllNotes = false,
  } = options;

  // Utiliser useState pour l'état (sera géré par le composant parent)
  const [root, setRoot] = useState<NoteName>(initialRoot);
  const [mode, setMode] = useState<ModeName>(initialMode);
  const [fretCount, setFretCount] = useState<UseFretboardStateReturn['fretCount']>(initialFretCount);
  const [showAllNotes, setShowAllNotes] = useState(initialShowAllNotes);

  // Calculer les positions des frettes
  const fretPositions = useMemo(() => calculateFretPositions(fretCount), [fretCount]);

  // Calculer la largeur SVG
  const svgWidth = useMemo(() => {
    const lastFretPosition = fretPositions[fretPositions.length - 1] ?? 800;
    return Math.max(lastFretPosition + 30, 800);
  }, [fretPositions]);

  // Calculer les données du manche
  const fretboardData = useMemo(() => {
    const intervals = MODE_INTERVALS[mode] ?? ['1', '2', '3', '4', '5', '6', '7'];
    return getFretboardNotesForKey(root, intervals);
  }, [root, mode]);

  // Fonction d'affichage des notes en français
  const displayNote = (note: string): string => {
    const NOTE_FR: Record<string, string> = {
      'C': 'DO', 'C#': 'DO♯', 'Db': 'RÉ♭',
      'D': 'RÉ', 'D#': 'RÉ♯', 'Eb': 'MI♭',
      'E': 'MI',
      'F': 'FA', 'F#': 'FA♯', 'Gb': 'SOL♭',
      'G': 'SOL', 'G#': 'SOL♯', 'Ab': 'LA♭',
      'A': 'LA', 'A#': 'LA♯', 'Bb': 'SI♭',
      'B': 'SI',
    };
    return NOTE_FR[note] || note;
  };

  const toggleShowAllNotes = () => {
    setShowAllNotes(prev => !prev);
  };

  return {
    // État
    root,
    mode,
    fretCount,
    showAllNotes,

    // Setters
    setRoot,
    setMode,
    setFretCount,
    setShowAllNotes,

    // Actions
    toggleShowAllNotes,

    // Données calculées
    fretboardData,
    fretPositions,
    svgWidth,
    displayNote,
  };
}
