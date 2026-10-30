/**
 * ChordDiagramSection - Diagramme d'accord posé sur sa carte, + sélecteur de positions.
 */

'use client';

import type { ChordVoicing } from '@adagio/types';
import { ChordDiagram, cn, type ChordFingerPosition } from '@adagio/ui';
import { VoicingSelector } from './VoicingSelector';

export interface ChordDiagramSectionProps {
  chordName: string;
  selectedVoicing: ChordVoicing | undefined;
  selectedVoicingIndex: number;
  allVoicings: ChordVoicing[];
  onVoicingSelect: (index: number) => void;
  getFingeringFromVoicing: (voicing?: ChordVoicing) => ChordFingerPosition[];
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
    <div className={cn('flex w-full flex-col items-center', className)}>
      <div className="panel w-full overflow-hidden bg-raised" style={{ maxWidth: '520px' }}>
        <div className="p-6 sm:p-8">
          <h2 className="mb-5 text-center text-2xl font-metal tracking-tighter text-white">
            {chordName}
          </h2>
          <div className="mx-auto" style={{ maxWidth: '300px' }}>
            <ChordDiagram
              name=""
              frets={6}
              positions={getFingeringFromVoicing(selectedVoicing)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <VoicingSelector
        voicings={allVoicings}
        selectedIndex={selectedVoicingIndex}
        onSelect={onVoicingSelect}
        className="mt-4"
      />
    </div>
  );
}
