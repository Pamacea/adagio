/**
 * ChordInfoCards - Information cards displaying chord properties
 *
 * Displays:
 * - Notes count
 * - Tension (stable, tense, dissonant)
 * - Voicings count
 * - Fret range
 */

'use client';

import type { ChordQuality } from '@adagio/types';
import { cn } from '@adagio/ui';

export interface ChordInfoCardsProps {
  notesCount: number;
  notesList: string[];
  tension: 'stable' | 'tense' | 'dissonant' | 'ambiguous';
  voicingsCount: number;
  fretRange: string;
  className?: string;
}

export function ChordInfoCards({
  notesCount,
  notesList,
  tension,
  voicingsCount,
  fretRange,
  className,
}: ChordInfoCardsProps) {
  const cards = [
    {
      label: 'Notes',
      value: notesCount,
      detail: notesList.join(' - '),
      color: 'emerald',
      dotColor: 'bg-emerald-500',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/5',
    },
    {
      label: 'Tension',
      value: tension === 'stable' ? 'Stable' : tension === 'tense' ? 'Tendu' : tension === 'dissonant' ? 'Dissonant' : 'Ambigu',
      detail: 'caractère',
      color: 'amber',
      dotColor: 'bg-amber-500',
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/5',
    },
    {
      label: 'Voicings',
      value: voicingsCount,
      detail: 'positions',
      color: 'blue',
      dotColor: 'bg-blue-500',
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/5',
    },
    {
      label: 'Position',
      value: fretRange,
      detail: 'cases',
      color: 'purple',
      dotColor: 'bg-purple-500',
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/5',
    },
  ] as const;

  return (
    <div className={className}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={cn(
              'p-5 rounded-none border-2 transition-all duration-300 hover:scale-105',
              card.border,
              card.bg
            )}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className={cn('w-2 h-2 rounded-none', card.dotColor)}></span>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">{card.label}</h4>
            </div>
            <p className="text-3xl font-bold text-white mb-2">{card.value}</p>
            <p className="text-sm text-gray-400">{card.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
