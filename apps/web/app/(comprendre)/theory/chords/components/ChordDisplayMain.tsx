/**
 * ChordDisplayMain - Scène centrale : carte du diagramme + voicings + manche complet.
 */

'use client';

import type { NoteName } from '@adagio/types';
import { cn } from '@adagio/ui';
import {
  ChordDiagramSection,
  FretboardView,
  EmptyState,
  type FretboardNote,
} from './';
import type { CalculatedChord } from '../hooks/useChordPage';

export interface ChordDisplayMainProps {
  chordToDisplay: CalculatedChord | undefined;
  currentRoot: NoteName;
  chordVoicings: CalculatedChord['voicings'];
  selectedVoicing: CalculatedChord['voicings'][number] | undefined;
  selectedVoicingIndex: number;
  fretboardNotes: FretboardNote[];
  onVoicingSelect: (index: number) => void;
  getFingeringFromVoicing: (voicing?: CalculatedChord['voicings'][number]) => Array<{
    string: number;
    fret: number;
    finger?: number;
    note?: NoteName;
    interval?: import('@adagio/types').Interval;
  }>;
  className?: string;
}

export function ChordDisplayMain({
  chordToDisplay,
  currentRoot,
  chordVoicings,
  selectedVoicing,
  selectedVoicingIndex,
  fretboardNotes,
  onVoicingSelect,
  getFingeringFromVoicing,
  className,
}: ChordDisplayMainProps) {
  if (!chordToDisplay || chordToDisplay.notes.length === 0) {
    return (
      <div className={className}>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className={cn('mx-auto flex w-full flex-col items-center', className)}>
      <ChordDiagramSection
        chordName={chordToDisplay.name}
        selectedVoicing={selectedVoicing}
        selectedVoicingIndex={selectedVoicingIndex}
        allVoicings={chordVoicings}
        onVoicingSelect={onVoicingSelect}
        getFingeringFromVoicing={getFingeringFromVoicing}
      />

      <details className="mt-6 w-full border-t border-steelwarm pt-4">
        <summary className="cursor-pointer list-none px-2.5 text-sm text-gray transition-colors hover:text-white [&::-webkit-details-marker]:hidden">
          Manche complet (24 cases)
        </summary>
        <FretboardView root={currentRoot} fretboardNotes={fretboardNotes} className="pt-5" />
      </details>
    </div>
  );
}
