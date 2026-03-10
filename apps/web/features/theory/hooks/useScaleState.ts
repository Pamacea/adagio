/**
 * useScaleState - Hook personnalisé pour l'état de la page scales
 *
 * Gère la sélection de tonique, type de gamme, nombre de frettes et options d'affichage
 */

import { useState } from 'react';
import type { NoteName } from '@adagio/types';

// Import ScaleType from @adagio/theory data
type ScaleType =
  | 'major' | 'minor'
  | 'harmonicMajor' | 'harmonicMinor'
  | 'melodicMajor' | 'melodicMinor'
  | 'pentatonicMajor' | 'pentatonicMinor'
  | 'blues'
  | 'dorian' | 'phrygian' | 'lydian' | 'mixolydian' | 'locrian'
  | 'napolitanMajor' | 'napolitanMinor'
  | 'augmentedMajor' | 'augmentedMinor'
  | 'wholeTone' | 'diminished'
  | 'chromatic';

export interface ScaleState {
  root: NoteName;
  scaleType: ScaleType;
  fretCount: 12 | 15 | 17 | 19 | 21 | 24;
  showAllNotes: boolean;
}

export interface UseScaleStateReturn {
  // État
  root: NoteName;
  scaleType: ScaleType;
  fretCount: ScaleState['fretCount'];
  showAllNotes: boolean;

  // Setters
  setRoot: (root: NoteName) => void;
  setScaleType: (scaleType: ScaleType) => void;
  setFretCount: (count: ScaleState['fretCount']) => void;
  setShowAllNotes: (show: boolean) => void;

  // Actions
  toggleShowAllNotes: () => void;
}

export interface UseScaleStateOptions {
  initialRoot?: NoteName;
  initialScaleType?: ScaleType;
  initialFretCount?: ScaleState['fretCount'];
  initialShowAllNotes?: boolean;
}

export function useScaleState(options: UseScaleStateOptions = {}): UseScaleStateReturn {
  const {
    initialRoot = 'C',
    initialScaleType = 'major',
    initialFretCount = 12,
    initialShowAllNotes = false,
  } = options;

  const [root, setRoot] = useState<NoteName>(initialRoot);
  const [scaleType, setScaleType] = useState<ScaleType>(initialScaleType);
  const [fretCount, setFretCount] = useState<ScaleState['fretCount']>(initialFretCount);
  const [showAllNotes, setShowAllNotes] = useState(initialShowAllNotes);

  const toggleShowAllNotes = () => {
    setShowAllNotes(prev => !prev);
  };

  return {
    // État
    root,
    scaleType,
    fretCount,
    showAllNotes,

    // Setters
    setRoot,
    setScaleType,
    setFretCount,
    setShowAllNotes,

    // Actions
    toggleShowAllNotes,
  };
}
