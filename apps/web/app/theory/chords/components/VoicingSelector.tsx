/**
 * VoicingSelector - Component for selecting chord voicing positions
 *
 * Displays a list of available voicings with:
 * - Position number
 * - Fret range
 * - Selection highlighting
 */

'use client';

import type { ChordVoicing } from '@adagio/types';
import { cn } from '@adagio/ui';

export interface VoicingSelectorProps {
  voicings: ChordVoicing[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}

export function VoicingSelector({ voicings, selectedIndex, onSelect, className }: VoicingSelectorProps) {
  if (voicings.length <= 1) return null;

  return (
    <div className={className}>
      <h3 className="text-base font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-none bg-toxic"></span>
        Positions
        <span className="text-sm text-gray-400">({voicings.length})</span>
      </h3>
      <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
        {voicings.map((voicing, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={cn(
              'w-full text-left px-4 py-4 border-2 rounded-none transition-all duration-200',
              'flex items-center justify-between group',
              selectedIndex === index
                ? 'border-amber-400 bg-amber-400/20 text-amber-400 shadow-lg shadow-amber-400/10'
                : 'border-steel/30 text-gray-300 hover:border-steel hover:bg-white/[0.02]'
            )}
          >
            <div className="flex items-center gap-3">
              <span className={cn(
                'w-8 h-8 flex items-center justify-center rounded text-base font-bold',
                selectedIndex === index ? 'bg-amber-400 text-black' : 'bg-steel/30 text-gray-400 group-hover:bg-steel/50'
              )}>
                {index + 1}
              </span>
              <span className="text-base font-medium text-gray-300">Cases {voicing.fretRange?.join('-')}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
