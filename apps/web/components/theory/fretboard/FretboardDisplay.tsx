/**
 * ADAGIO - FretboardDisplay Component
 * Wrapper autour de ScaleFretboard pour le fretboard page
 * Réutilise ScaleFretboard avec les mêmes constantes et styles
 */

'use client';

import { useMemo } from 'react';
import type { NoteName, Interval, Instrument } from '@adagio/types';
import { getFretboardNotesForKey, getInstrument } from '@adagio/theory';
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
  instrument?: Instrument;
}

export function FretboardDisplay({
  root,
  mode,
  fretCount,
  showAllNotes,
  instrument = 'guitar',
}: FretboardDisplayProps) {
  const intervals = useMemo((): Interval[] => {
    const found = (MODE_INTERVALS as Record<string, Interval[]>)[mode];
    return found ?? ['1', '2', '3', '4', '5', '6', '7'];
  }, [mode]);

  // Accordage + cordes (aigu → grave) de l'instrument courant
  const { tuning, stringRows } = useMemo(() => {
    const def = getInstrument(instrument);
    const acc: NoteName[] = [...def.tuningDisplay];
    return {
      tuning: acc,
      stringRows: acc.map((note) => ({ note, name: NOTE_FR[note] ?? note })),
    };
  }, [instrument]);

  // Calculer les données du manche
  const fretboardData = useMemo(() => {
    return getFretboardNotesForKey(root, intervals, fretCount, tuning);
  }, [root, intervals, fretCount, tuning]);

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
      strings={stringRows}
    />
  );
}
