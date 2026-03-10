/**
 * useModeState - Hook personnalisé pour l'état de la page modes
 *
 * Gère la sélection de tonique, mode sélectionné et le mode d'affichage (liste/cercle)
 */

import { useState } from 'react';
import type { NoteName, ModeName } from '@adagio/types';

export interface ModeState {
  root: NoteName;
  selectedMode: ModeName;
  showCircle: boolean;
}

export interface UseModeStateReturn {
  // État
  root: NoteName;
  selectedMode: ModeName;
  showCircle: boolean;

  // Setters
  setRoot: (root: NoteName) => void;
  setSelectedMode: (mode: ModeName) => void;
  setShowCircle: (show: boolean) => void;

  // Actions
  toggleView: () => void;
}

export interface UseModeStateOptions {
  initialRoot?: NoteName;
  initialSelectedMode?: ModeName;
  initialShowCircle?: boolean;
}

export function useModeState(options: UseModeStateOptions = {}): UseModeStateReturn {
  const {
    initialRoot = 'C',
    initialSelectedMode = 'ionian',
    initialShowCircle = false,
  } = options;

  const [root, setRoot] = useState<NoteName>(initialRoot);
  const [selectedMode, setSelectedMode] = useState<ModeName>(initialSelectedMode);
  const [showCircle, setShowCircle] = useState(initialShowCircle);

  const toggleView = () => {
    setShowCircle(prev => !prev);
  };

  return {
    // État
    root,
    selectedMode,
    showCircle,

    // Setters
    setRoot,
    setSelectedMode,
    setShowCircle,

    // Actions
    toggleView,
  };
}
