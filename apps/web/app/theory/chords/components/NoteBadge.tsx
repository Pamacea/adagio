/**
 * NoteBadge - Musical note badge with root highlighting
 *
 * Displays a note with special styling for root notes
 */

'use client';

import { cn } from '@adagio/ui';

export interface NoteBadgeProps {
  note: string;
  isRoot?: boolean;
}

export function NoteBadge({ note, isRoot = false }: NoteBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center w-10 h-10 rounded-none text-sm font-bold transition-all duration-300',
        isRoot
          ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-amber-950 shadow-lg shadow-amber-500/30 scale-110'
          : 'bg-gradient-to-br from-steel/50 to-steel/30 text-gray-300 border border-steel/30'
      )}
    >
      {note}
    </span>
  );
}
