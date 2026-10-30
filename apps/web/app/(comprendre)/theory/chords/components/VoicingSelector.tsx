/**
 * VoicingSelector - Sélecteur de positions (chips compactes).
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

/** Nombre de cases affichées par défaut par ChordDiagram. */
const DISPLAYED_FRETS = 4;

/** Plage de cases affichée, en numérotation humaine (la case 0 n'existe pas). */
function displayedRange(voicing: ChordVoicing): string {
  const fretted = voicing.notes.filter((note) => note.fret > 0).map((note) => note.fret);
  const start = fretted.length > 0 ? Math.max(1, Math.min(...fretted)) : 1;
  const end = Math.max(start + DISPLAYED_FRETS - 1, voicing.fretRange?.[1] ?? start);
  return `${start}-${end}`;
}

export function VoicingSelector({
  voicings,
  selectedIndex,
  onSelect,
  className,
}: VoicingSelectorProps) {
  if (voicings.length <= 1) return null;

  return (
    <div
      role="group"
      aria-label="Positions"
      className={cn('flex flex-wrap justify-center gap-2', className)}
    >
      {voicings.map((voicing, index) => {
        const range = displayedRange(voicing);
        return (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(index)}
            aria-pressed={selectedIndex === index}
            aria-label={`Position ${index + 1}, cases ${range}`}
            data-tooltip={`Cases ${range}`}
            className="control text-xs tabular-nums"
          >
            <span className={cn('mr-1.5', selectedIndex === index ? 'text-white' : 'text-gray/70')}>
              {index + 1}
            </span>
            {range}
          </button>
        );
      })}
    </div>
  );
}
