/**
 * ChordHero - Hero section displaying selected chord information
 *
 * Shows:
 * - Chord name with large typography
 * - Note count badge
 * - French note names
 * - Note badges with root highlighting
 */

'use client';

import { NoteBadge } from './NoteBadge';
import type { NoteName } from '@adagio/types';
import { NOTE_FR } from '@adagio/theory';

export interface ChordHeroProps {
  name: string;
  root: NoteName;
  notes: NoteName[];
  className?: string;
}

export function ChordHero({ name, root, notes, className }: ChordHeroProps) {
  return (
    <div className={className}>
      <div className="relative overflow-hidden rounded-none border-2 border-blood/50 bg-gradient-to-br from-blood/20 via-blood/5 to-transparent">
        <div className="absolute inset-0 bg-gradient-to-r from-blood/10 via-transparent to-transparent" />
        <div className="relative p-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="px-4 py-1.5 text-sm font-bold uppercase tracking-wider rounded-none bg-amber-400/20 text-amber-400 border border-amber-400/30">
                  {notes.length} Notes
                </span>
                <h2 className="text-6xl font-metal text-white uppercase tracking-tighter">
                  {name}
                </h2>
              </div>
              <p className="text-base text-gray-300 font-medium">
                {notes.map(n => NOTE_FR[n] || n).join(' • ')}
              </p>
            </div>
            <div className="flex gap-3">
              {notes.map((note, i) => (
                <NoteBadge key={`hero-note-${i}`} note={note} isRoot={note === root} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
