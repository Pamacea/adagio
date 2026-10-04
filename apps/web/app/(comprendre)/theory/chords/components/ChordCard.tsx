/**
 * ChordCard - Card displaying a chord in the sidebar
 *
 * Displays:
 * - Chord name with diatonic indicator
 * - Notes preview
 * - Voicings count indicator
 * - Selection state
 */

'use client';

import type { NoteName, ChordQuality, ChordVoicing } from '@adagio/types';
import { cn } from '@adagio/ui';

export interface ChordCardProps {
  name: string;
  root: NoteName;
  quality: ChordQuality;
  notes: NoteName[];
  voicings: ChordVoicing[];
  isSelected: boolean;
  onSelect: () => void;
  categoryName: string;
  categoryColor: string;
  showDiatonic?: boolean;
}

export function ChordCard({
  name,
  root,
  notes,
  voicings,
  isSelected,
  onSelect,
  categoryName,
  categoryColor,
  showDiatonic,
}: ChordCardProps) {
  const colorClasses = {
    'Diatonique': 'border-emerald-500/50 bg-gradient-to-br from-emerald-500/20 to-transparent shadow-emerald-500/20',
    'Extensions': 'border-blue-500/50 bg-gradient-to-br from-blue-500/20 to-transparent shadow-blue-500/20',
    'Altérations': 'border-red-500/50 bg-gradient-to-br from-red-500/20 to-transparent shadow-red-500/20',
  };

  return (
    <button
      onClick={onSelect}
      className={cn(
        'group relative w-full text-left p-4 rounded-none border-2 transition-all duration-300',
        'hover:scale-[1.02] active:scale-[0.98]',
        isSelected
          ? colorClasses[categoryName as keyof typeof colorClasses]
          : 'border-steel/30 hover:border-steel/50 hover:bg-white/[0.02] bg-void'
      )}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r-none shadow-lg animate-pulse" style={{ background: categoryColor }} />
      )}

      <div className="flex items-center justify-between mb-3 pl-4">
        <div className="flex items-center gap-2">
          <span className={cn(
            'font-metal font-bold text-lg tracking-wide',
            isSelected ? 'text-white' : 'text-gray-200 group-hover:text-white transition-colors'
          )}>
            {name}
          </span>
          {showDiatonic && (
            <span className="px-2 py-1 text-xs bg-emerald-500/30 text-emerald-400 rounded border border-emerald-500/30">
              Diat.
            </span>
          )}
        </div>
        <span className="text-sm text-gray-400 font-medium">{notes.length}</span>
      </div>

      {/* Notes preview */}
      <div className="flex gap-1.5 flex-wrap pl-4">
        {notes.slice(0, 6).map((note, i) => (
          <span
            key={`chord-note-${i}`}
            className={cn(
              'px-2 py-1 text-sm rounded transition-all font-medium',
              note === root
                ? 'bg-amber-400/30 text-amber-400 border border-amber-400/50'
                : 'bg-white/10 text-gray-300 border border-white/20'
            )}
          >
            {note}
          </span>
        ))}
        {notes.length > 6 && (
          <span className="px-2 py-1 text-sm bg-white/10 text-gray-400 rounded">
            +{notes.length - 6}
          </span>
        )}
      </div>

      {/* Voicings indicator */}
      {voicings.length > 0 && (
        <div className="flex items-center gap-2 pl-4 mt-2">
          <span className="text-sm text-gray-400">
            {voicings.length} positions
          </span>
          <div className="flex gap-0.5">
            {voicings.slice(0, 5).map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-none bg-toxic/50" />
            ))}
          </div>
        </div>
      )}
    </button>
  );
}
