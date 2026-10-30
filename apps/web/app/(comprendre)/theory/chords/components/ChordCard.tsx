/**
 * ChordCard - Ligne compacte d'accord dans la bibliothèque.
 */

'use client';

import type { NoteName, ChordVoicing } from '@adagio/types';
import { cn } from '@adagio/ui';

export interface ChordCardProps {
  name: string;
  notes: NoteName[];
  voicings: ChordVoicing[];
  isSelected: boolean;
  onSelect: () => void;
  /** Couleur du degré diatonique ; blood par défaut. */
  accentColor?: string;
}

export function ChordCard({
  name,
  notes,
  voicings,
  isSelected,
  onSelect,
  accentColor = '#8b1a1a',
}: ChordCardProps) {
  return (
    <button
      onClick={onSelect}
      aria-pressed={isSelected}
      data-tooltip={notes.join(' · ')}
      style={
        isSelected
          ? { borderColor: accentColor, backgroundColor: `${accentColor}33`, color: accentColor }
          : undefined
      }
      className={cn(
        'flex w-full items-center justify-between gap-2 border px-2.5 py-1.5 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blood/60',
        isSelected ? 'border-transparent' : 'border-transparent text-gray hover:border-white/30 hover:text-white'
      )}
    >
      <span className="min-w-0 truncate">{name}</span>
      <span className="shrink-0 text-[10px] text-gray/70">{voicings.length} formes</span>
    </button>
  );
}
