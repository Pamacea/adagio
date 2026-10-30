/**
 * useFretboardState - Hook personnalisé pour la page Fretboard
 *
 * Gère la sélection de tonique, mode et options d'affichage
 */

import { useMemo, useState } from 'react';
import type { NoteName, ModeName, Interval, Instrument } from '@adagio/types';
import {
  getFretboardNotesForKey,
  getTuningPreset,
  FRENCH_NOTE_NAMES,
  type TuningPreset,
} from '@adagio/theory';
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
  initialInstrument?: Instrument;
  initialTuningPreset?: TuningPreset;
}

export interface UseFretboardStateReturn {
  // État
  root: NoteName;
  mode: ModeName;
  fretCount: 12 | 15 | 17 | 19 | 21 | 24;
  showAllNotes: boolean;
  instrument: Instrument;
  tuningPreset: TuningPreset;
  /** Accordage effectif de l'instrument (aigu → grave) */
  tuning: NoteName[];

  // Setters
  setRoot: (root: NoteName) => void;
  setMode: (mode: ModeName) => void;
  setFretCount: (count: UseFretboardStateReturn['fretCount']) => void;
  setShowAllNotes: (show: boolean) => void;
  setInstrument: (instrument: Instrument) => void;
  setTuningPreset: (preset: TuningPreset) => void;

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
    initialInstrument = 'guitar',
    initialTuningPreset = 'standard',
  } = options;

  // Utiliser useState pour l'état (sera géré par le composant parent)
  const [root, setRoot] = useState<NoteName>(initialRoot);
  const [mode, setMode] = useState<ModeName>(initialMode);
  const [fretCount, setFretCount] =
    useState<UseFretboardStateReturn['fretCount']>(initialFretCount);
  const [showAllNotes, setShowAllNotes] = useState(initialShowAllNotes);
  const [instrument, setInstrument] = useState<Instrument>(initialInstrument);
  const [tuningPreset, setTuningPreset] = useState<TuningPreset>(initialTuningPreset);

  // Changer d'instrument remet l'accordage à standard : un preset peut ne pas exister
  // pour le nouvel instrument (Drop D en basse) et laisserait sinon aucun bouton actif.
  const changeInstrument = (next: Instrument) => {
    setInstrument(next);
    setTuningPreset('standard');
  };

  // getTuningPreset renvoie grave → aigu et gère le repli standard d'un preset invalide
  const tuning = useMemo(
    () => [...getTuningPreset(instrument, tuningPreset)].reverse(),
    [instrument, tuningPreset]
  );

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
    return getFretboardNotesForKey(root, intervals, fretCount, tuning);
  }, [root, mode, fretCount, tuning]);

  // Fonction d'affichage des notes en français
  const displayNote = (note: string): string => {
    return FRENCH_NOTE_NAMES[note] || note;
  };

  const toggleShowAllNotes = () => {
    setShowAllNotes((prev) => !prev);
  };

  return {
    // État
    root,
    mode,
    fretCount,
    showAllNotes,
    instrument,
    tuningPreset,
    tuning,

    // Setters
    setRoot,
    setMode,
    setFretCount,
    setShowAllNotes,
    setInstrument: changeInstrument,
    setTuningPreset,

    // Actions
    toggleShowAllNotes,

    // Données calculées
    fretboardData,
    fretPositions,
    svgWidth,
    displayNote,
  };
}
