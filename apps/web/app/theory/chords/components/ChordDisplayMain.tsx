/**
 * ChordDisplayMain - Main content area for chord display
 *
 * Displays:
 * - Chord hero section
 * - Chord diagram with voicing selector
 * - Fretboard view
 * - Info cards
 * - Empty state when no chord selected
 */

'use client';

import type { NoteName } from '@adagio/types';
import { NOTE_FR } from '@adagio/theory';
import {
  ChordHero,
  ChordDiagramSection,
  FretboardView,
  ChordInfoCards,
  EmptyState,
  type FretboardNote,
} from './';
import type { CalculatedChord } from '../hooks/useChordPage';

export interface ChordDisplayMainProps {
  chordToDisplay: CalculatedChord | undefined;
  currentRoot: NoteName;
  chordNotes: NoteName[];
  chordVoicings: CalculatedChord['voicings'];
  selectedVoicing: CalculatedChord['voicings'][number] | undefined;
  selectedVoicingIndex: number;
  chordTension: ReturnType<typeof import('@adagio/theory').getChordTension>;
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
  chordNotes,
  chordVoicings,
  selectedVoicing,
  selectedVoicingIndex,
  chordTension,
  fretboardNotes,
  onVoicingSelect,
  getFingeringFromVoicing,
  className,
}: ChordDisplayMainProps) {
  if (!chordToDisplay || chordToDisplay.notes.length === 0) {
    return <div className={className}><EmptyState /></div>;
  }

  return (
    <div className={className}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Card */}
        <ChordHero
          name={chordToDisplay.name}
          root={chordToDisplay.root}
          notes={chordToDisplay.notes}
        />

        {/* Diagramme + Positions */}
        <ChordDiagramSection
          chordName={chordToDisplay.name}
          selectedVoicing={selectedVoicing}
          selectedVoicingIndex={selectedVoicingIndex}
          allVoicings={chordVoicings}
          onVoicingSelect={onVoicingSelect}
          getFingeringFromVoicing={getFingeringFromVoicing}
        />

        {/* Fretboard 24 frets */}
        <FretboardView
          root={currentRoot}
          fretboardNotes={fretboardNotes}
          className="p-6 rounded-none border-2 border-steel/30 bg-gradient-to-br from-void to-abyss overflow-hidden"
        />

        {/* Info Cards */}
        <ChordInfoCards
          notesCount={chordToDisplay.notes.length}
          notesList={chordToDisplay.notes}
          tension={chordTension}
          voicingsCount={chordToDisplay.voicings.length}
          fretRange={selectedVoicing?.fretRange?.join('-') || 'N/A'}
        />
      </div>
    </div>
  );
}
