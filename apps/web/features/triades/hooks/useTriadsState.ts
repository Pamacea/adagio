/**
 * useTriadsState - Hook personnalisé pour la page Triades
 *
 * Gère la sélection de tonique, qualité de triade et extensions
 */

import { useMemo, useState, useCallback } from 'react';
import type { NoteName } from '@adagio/types';
import type {
  TriadQuality,
  TriadExtension,
  ExtensionConfig,
  TriadInfo,
  ExtendedChordInfo,
  FretboardTriadNote,
} from '../services/triadsCalculations';
import {
  getTriadInfo,
  getExtendedChordInfo,
  calculateFretboardForTriad,
  formatNoteFr,
  formatIntervalFr,
} from '../services/triadsCalculations';

export interface UseTriadsStateOptions {
  initialRoot?: NoteName;
  initialQuality?: TriadQuality;
  initialFretCount?: 12 | 15 | 17 | 19 | 21 | 24;
}

export interface UseTriadsStateReturn {
  // État de base
  root: NoteName;
  quality: TriadQuality;
  fretCount: 12 | 15 | 17 | 19 | 21 | 24;

  // Extensions
  extensions: ExtensionConfig[];
  activeExtensions: Set<TriadExtension>;

  // Données calculées
  triadInfo: TriadInfo;
  chordInfo: ExtendedChordInfo;
  fretboardNotes: FretboardTriadNote[];

  // Setters
  setRoot: (root: NoteName) => void;
  setQuality: (quality: TriadQuality) => void;
  setFretCount: (count: 12 | 15 | 17 | 19 | 21 | 24) => void;

  // Gestion des extensions
  toggleExtension: (extension: TriadExtension, alteration: ExtensionConfig['alteration']) => void;
  removeExtension: (extension: TriadExtension) => void;
  clearExtensions: () => void;
  hasExtension: (extension: TriadExtension) => boolean;
  getExtensionAlteration: (extension: TriadExtension) => ExtensionConfig['alteration'] | undefined;

  // Utilitaires d'affichage
  displayNote: (note: string) => string;
  displayInterval: (interval: string) => string;
}

export const TRIAD_QUALITIES: TriadQuality[] = ['major', 'minor', 'augmented', 'diminished'] as const;

export const TRIAD_QUALITY_LABELS: Record<TriadQuality, string> = {
  major: 'Majeur',
  minor: 'Mineur',
  augmented: 'Augmenté',
  diminished: 'Diminué',
};

export const TRIAD_EXTENSIONS: ExtensionConfig['extension'][] = ['2', '4', '6', '7', '9', '11', '13'] as const;

export const TRIAD_EXTENSION_LABELS: Record<TriadExtension, string> = {
  '2': 'Seconde',
  '4': 'Quarte',
  '6': 'Sixte',
  '7': 'Septième',
  '9': 'Neuvième',
  '11': 'Onzième',
  '13': 'Treizième',
};

export const AVAILABLE_NOTES: NoteName[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
] as const;

export function useTriadsState(options: UseTriadsStateOptions = {}): UseTriadsStateReturn {
  const {
    initialRoot = 'C',
    initialQuality = 'major',
    initialFretCount = 12,
  } = options;

  // État de base
  const [root, setRoot] = useState<NoteName>(initialRoot);
  const [quality, setQuality] = useState<TriadQuality>(initialQuality);
  const [fretCount, setFretCount] = useState<UseTriadsStateReturn['fretCount']>(initialFretCount);

  // État des extensions
  const [extensions, setExtensions] = useState<ExtensionConfig[]>([]);

  // Calculer les informations de la triade
  const triadInfo = useMemo<TriadInfo>(() => {
    return getTriadInfo(root, quality);
  }, [root, quality]);

  // Calculer les informations de l'accord étendu
  const chordInfo = useMemo<ExtendedChordInfo>(() => {
    return getExtendedChordInfo(root, quality, extensions);
  }, [root, quality, extensions]);

  // Calculer les notes sur le manche
  const fretboardNotes = useMemo<FretboardTriadNote[]>(() => {
    return calculateFretboardForTriad(root, quality, extensions, fretCount);
  }, [root, quality, extensions, fretCount]);

  // Extensions actives (Set pour recherche rapide)
  const activeExtensions = useMemo<Set<TriadExtension>>(() => {
    return new Set(extensions.map(e => e.extension));
  }, [extensions]);

  // Toggle une extension avec son altération
  const toggleExtension = useCallback((
    extension: TriadExtension,
    alteration: ExtensionConfig['alteration']
  ) => {
    setExtensions(prev => {
      const existingIndex = prev.findIndex(e => e.extension === extension);

      if (existingIndex !== -1) {
        // Si l'extension existe déjà avec la même altération, on la retire
        if (prev[existingIndex]?.alteration === alteration) {
          return prev.filter(e => e.extension !== extension);
        }
        // Sinon on met à jour l'altération
        const updated = [...prev];
        if (updated[existingIndex]) {
          updated[existingIndex] = { extension, alteration };
        }
        return updated;
      }

      // Ajouter la nouvelle extension
      return [...prev, { extension, alteration }];
    });
  }, []);

  // Retirer une extension
  const removeExtension = useCallback((extension: TriadExtension) => {
    setExtensions(prev => prev.filter(e => e.extension !== extension));
  }, []);

  // Vider toutes les extensions
  const clearExtensions = useCallback(() => {
    setExtensions([]);
  }, []);

  // Vérifier si une extension est active
  const hasExtension = useCallback((extension: TriadExtension) => {
    return activeExtensions.has(extension);
  }, [activeExtensions]);

  // Obtenir l'altération d'une extension
  const getExtensionAlteration = useCallback((extension: TriadExtension) => {
    return extensions.find(e => e.extension === extension)?.alteration;
  }, [extensions]);

  // Fonctions d'affichage
  const displayNote = useCallback((note: string) => {
    return formatNoteFr(note as NoteName);
  }, []);

  const displayInterval = useCallback((interval: string) => {
    return formatIntervalFr(interval as any);
  }, []);

  return {
    // État de base
    root,
    quality,
    fretCount,

    // Extensions
    extensions,
    activeExtensions,

    // Données calculées
    triadInfo,
    chordInfo,
    fretboardNotes,

    // Setters
    setRoot,
    setQuality,
    setFretCount,

    // Gestion des extensions
    toggleExtension,
    removeExtension,
    clearExtensions,
    hasExtension,
    getExtensionAlteration,

    // Utilitaires d'affichage
    displayNote,
    displayInterval,
  };
}
