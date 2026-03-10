/**
 * ChordDiagramSection - Section containing the chord diagram and voicing selector
 *
 * Displays:
 * - Professional chord diagram
 * - Voicing selector (if multiple voicings available)
 */

'use client';

import type { ChordVoicing, NoteName, Interval } from '@adagio/types';
import { ChordDiagram } from './ChordDiagram';
import { VoicingSelector } from './VoicingSelector';

export interface ChordDiagramSectionProps {
  chordName: string;
  selectedVoicing: ChordVoicing | undefined;
  selectedVoicingIndex: number;
  allVoicings: ChordVoicing[];
  onVoicingSelect: (index: number) => void;
  getFingeringFromVoicing: (voicing?: ChordVoicing) => Array<{
    string: number;
    fret: number;
    finger?: number;
    note?: NoteName;
    interval?: Interval;
  }>;
  className?: string;
}

export function ChordDiagramSection({
  chordName,
  selectedVoicing,
  selectedVoicingIndex,
  allVoicings,
  onVoicingSelect,
  getFingeringFromVoicing,
  className,
}: ChordDiagramSectionProps) {
  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Diagramme */}
        <div className="lg:col-span-2 p-8 rounded-none border-2 border-steel/30 bg-gradient-to-br from-void via-blackness to-abyss">
          <h3 className="text-base font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-none bg-toxic"></span>
            Diagramme
          </h3>
          <div className="flex justify-center py-6">
            <ChordDiagram
              name={chordName}
              positions={getFingeringFromVoicing(selectedVoicing)}
              position={selectedVoicingIndex + 1}
              totalPositions={allVoicings.length}
              className="w-72"
            />
          </div>
        </div>

        {/* Voicing Selector */}
        <VoicingSelector
          voicings={allVoicings}
          selectedIndex={selectedVoicingIndex}
          onSelect={onVoicingSelect}
          className="p-6 rounded-none border-2 border-steel/30 bg-gradient-to-br from-void to-blackness"
        />
      </div>
    </div>
  );
}
