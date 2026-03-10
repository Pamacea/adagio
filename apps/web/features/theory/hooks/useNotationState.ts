/**
 * useNotationState - Hook personnalisé pour l'état de la page notation
 *
 * Gère la sélection de l'onglet actif (notes, accords, progressions)
 */

import { useState } from 'react';

export type NotationTab = 'notes' | 'chords' | 'progressions';

export interface NotationState {
  selectedTab: NotationTab;
}

export interface UseNotationStateReturn {
  // État
  selectedTab: NotationTab;

  // Setters
  setSelectedTab: (tab: NotationTab) => void;

  // Actions
  selectNotes: () => void;
  selectChords: () => void;
  selectProgressions: () => void;
}

export interface UseNotationStateOptions {
  initialTab?: NotationTab;
}

export function useNotationState(options: UseNotationStateOptions = {}): UseNotationStateReturn {
  const { initialTab = 'notes' } = options;

  const [selectedTab, setSelectedTab] = useState<NotationTab>(initialTab);

  const selectNotes = () => setSelectedTab('notes');
  const selectChords = () => setSelectedTab('chords');
  const selectProgressions = () => setSelectedTab('progressions');

  return {
    // État
    selectedTab,

    // Setters
    setSelectedTab,

    // Actions
    selectNotes,
    selectChords,
    selectProgressions,
  };
}
