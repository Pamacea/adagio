/**
 * ADAGIO - FretboardDisplay Component
 * Wrapper autour de ScaleFretboard pour le fretboard page
 * Réutilise ScaleFretboard avec les mêmes constantes et styles
 */

'use client';

import { useMemo } from 'react';
import type { NoteName, Interval } from '@adagio/types';
import { getFretboardNotesForKey } from '@adagio/theory';
import { NOTE_FR } from '@/lib/theory';
import { ScaleFretboard, calculateFretPositions } from '../scales/ScaleFretboard';

// Intervalles pour chaque mode (utilisés dans fretboard/page.tsx)
const MODE_INTERVALS: Record<string, Interval[]> = {
  ionian: ['1', '2', '3', '4', '5', '6', '7'],
  dorian: ['1', '2', 'b3', '4', '5', '6', 'b7'],
  phrygian: ['1', 'b2', 'b3', '4', '5', 'b6', 'b7'],
  lydian: ['1', '2', '3', '#4', '5', '6', '7'],
  mixolydian: ['1', '2', '3', '4', '5', '6', 'b7'],
  aeolian: ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
  locrian: ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7'],
};

interface FretboardDisplayProps {
  root: NoteName;
  mode: string;
  fretCount: number;
  showAllNotes: boolean;
}

export function FretboardDisplay({
  root,
  mode,
  fretCount,
  showAllNotes,
}: FretboardDisplayProps) {
  const intervals = useMemo((): Interval[] => {
    const found = (MODE_INTERVALS as Record<string, Interval[]>)[mode];
    return found ?? ['1', '2', '3', '4', '5', '6', '7'];
  }, [mode]);

  // Calculer les données du manche
  const fretboardData = useMemo(() => {
    return getFretboardNotesForKey(root, intervals);
  }, [root, intervals]);

  // Calculer les positions des frettes
  const fretPositions = useMemo(() => {
    return calculateFretPositions(fretCount);
  }, [fretCount]);

  // Fonction d'affichage des notes en français
  const displayNote = (note: string): string => {
    return NOTE_FR[note] || note;
  };

  return (
    <ScaleFretboard
      fretboardData={fretboardData}
      fretPositions={fretPositions}
      fretCount={fretCount}
      showAllNotes={showAllNotes}
      displayNote={displayNote}
    />
  );
}
