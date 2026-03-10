/**
 * RootSelector - Musical Note Selector Component
 *
 * Displays all 12 chromatic notes as selectable buttons
 * with enharmonic equivalents support (C#/Db, etc.)
 */

import { type NoteName } from '@adagio/types';
import { cn } from '../lib/cn';

export interface RootSelectorProps {
  value: NoteName;
  onChange: (root: NoteName) => void;
  showFlats?: boolean; // Show flat names (Db, Eb, etc.)
  className?: string;
}

// All 12 note names with their flat equivalents
const NOTE_SETS = {
  sharps: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as NoteName[],
  flats: ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'] as NoteName[],
};

// Enharmonic equivalents mapping
const ENHARMONICS: Record<NoteName, NoteName> = {
  'C#': 'Db',
  'Db': 'C#',
  'D#': 'Eb',
  'Eb': 'D#',
  'F#': 'Gb',
  'Gb': 'F#',
  'G#': 'Ab',
  'Ab': 'G#',
  'A#': 'Bb',
  'Bb': 'A#',
  'C': 'C',
  'D': 'D',
  'E': 'E',
  'F': 'F',
  'G': 'G',
  'A': 'A',
  'B': 'B',
};

// Color coding for notes (circle of fifths / signature visual)
const NOTE_COLORS: Record<NoteName, string> = {
  'C': 'bg-red-500/20 border-red-500/40 text-red-400',
  'C#': 'bg-orange-500/20 border-orange-500/40 text-orange-400',
  'Db': 'bg-orange-500/20 border-orange-500/40 text-orange-400',
  'D': 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400',
  'D#': 'bg-green-500/20 border-green-500/40 text-green-400',
  'Eb': 'bg-green-500/20 border-green-500/40 text-green-400',
  'E': 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
  'F': 'bg-teal-500/20 border-teal-500/40 text-teal-400',
  'F#': 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400',
  'Gb': 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400',
  'G': 'bg-sky-500/20 border-sky-500/40 text-sky-400',
  'G#': 'bg-blue-500/20 border-blue-500/40 text-blue-400',
  'Ab': 'bg-blue-500/20 border-blue-500/40 text-blue-400',
  'A': 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400',
  'A#': 'bg-purple-500/20 border-purple-500/40 text-purple-400',
  'Bb': 'bg-purple-500/20 border-purple-500/40 text-purple-400',
  'B': 'bg-pink-500/20 border-pink-500/40 text-pink-400',
};

export function RootSelector({
  value,
  onChange,
  showFlats = false,
  className,
}: RootSelectorProps) {
  const notes = showFlats ? NOTE_SETS.flats : NOTE_SETS.sharps;
  const displayValue = showFlats && ENHARMONICS[value] !== value ? ENHARMONICS[value]! : value;

  const getButtonColor = (note: NoteName) => {
    const isSelected = note === value || ENHARMONICS[note] === value;
    if (isSelected) {
      return NOTE_COLORS[note];
    }
    return 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white border-transparent';
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm text-neutral-400">Note tonale</label>
        <button
          onClick={() => {
            // Toggle between sharps and flats
            const currentIsSharp = !showFlats;
            // Will be handled by parent re-render with different showFlats prop
          }}
          className="text-xs text-neutral-500 hover:text-neutral-400 transition-colors"
        >
          {showFlats ? '♭ Altération bémol' : '♯ Altération dièse'}
        </button>
      </div>

      <div className="flex flex-wrap gap-1">
        {notes.map((note) => (
          <button
            key={note}
            onClick={() => onChange(note)}
            className={cn(
              'w-10 h-10 rounded-lg border font-mono text-sm font-medium transition-all',
              'hover:scale-105 active:scale-95',
              getButtonColor(note)
            )}
            title={`${note} (enharmonique: ${ENHARMONICS[note]})`}
          >
            {note}
          </button>
        ))}
      </div>

      {/* Enharmonic indicator */}
      {value !== displayValue && (
        <div className="text-xs text-neutral-500 text-center">
          {displayValue} = {ENHARMONICS[displayValue]!}
        </div>
      )}
    </div>
  );
}
