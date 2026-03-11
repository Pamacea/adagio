/**
 * ADAGIO - TriadsInfo Component
 * Affichage des informations sur la triade sélectionnée
 */

'use client';

import { cn } from '@adagio/ui';
import type { TriadInfo, ExtendedChordInfo } from '../services';
import { formatIntervalFr } from '../services';

export interface TriadsInfoProps {
  triadInfo: TriadInfo;
  chordInfo: ExtendedChordInfo;
  displayNote: (note: string) => string;
  displayInterval: (interval: string) => string;
}

const INTERVAL_COLORS: Record<string, string> = {
  '1': 'bg-toxic/30 border-toxic',
  '3': 'bg-emerald-500/30 border-emerald-500',
  'b3': 'bg-amber-400/30 border-amber-400',
  '5': 'bg-cyan-400/30 border-cyan-400',
  '#5': 'bg-red-500/30 border-red-500',
  'b5': 'bg-purple-500/30 border-purple-500',
  '2': 'bg-blue-400/30 border-blue-400',
  'b2': 'bg-blue-400/20 border-blue-400/50',
  '4': 'bg-indigo-400/30 border-indigo-400',
  '#4': 'bg-pink-400/30 border-pink-400',
  '6': 'bg-violet-400/30 border-violet-400',
  'b6': 'bg-violet-400/20 border-violet-400/50',
  '7': 'bg-rose-400/30 border-rose-400',
  'b7': 'bg-rose-400/20 border-rose-400/50',
  '9': 'bg-teal-400/30 border-teal-400',
  '11': 'bg-sky-400/30 border-sky-400',
  '13': 'bg-fuchsia-400/30 border-fuchsia-400',
};

export function TriadsInfo({
  triadInfo,
  chordInfo,
  displayNote,
  displayInterval,
}: TriadsInfoProps) {
  const hasExtensions = chordInfo.extensions.length > 0;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Titre et nom de l'accord */}
      <div className="flex items-center gap-4">
        <div>
          <h3 className="text-xl font-metal text-white">
            {hasExtensions ? chordInfo.chordName : triadInfo.name}
          </h3>
          <p className="text-xs text-gray-400 uppercase tracking-wider">
            {triadInfo.quality === 'major' ? 'Majeur' :
             triadInfo.quality === 'minor' ? 'Mineur' :
             triadInfo.quality === 'augmented' ? 'Augmenté' : 'Diminué'}
            {hasExtensions && <span className="ml-2 text-amber-400">Étendu</span>}
          </p>
        </div>
      </div>

      {/* Notes composant la triade */}
      <div className="flex flex-wrap gap-1.5">
        {triadInfo.notes.map((note, i) => {
          const interval = triadInfo.intervals[i];
          if (!interval) return null;
          const colorClass = INTERVAL_COLORS[interval] || INTERVAL_COLORS['1'];

          return (
            <div
              key={note}
              className={cn(
                'px-2 py-1 border-2 rounded-none text-center min-w-[50px]',
                colorClass
              )}
            >
              <p className="text-xs font-bold text-white">{displayNote(note)}</p>
              <p className="text-[10px] text-gray-300">{displayInterval(interval)}</p>
            </div>
          );
        })}
        {hasExtensions && chordInfo.extensions.map((ext, extIndex) => {
          const interval = ext.extension === '2' && ext.alteration === 'flat' ? 'b2' :
                          ext.extension === '2' && ext.alteration === 'sharp' ? '#2' :
                          ext.extension === '4' && ext.alteration === 'flat' ? 'b4' :
                          ext.extension === '4' && ext.alteration === 'sharp' ? '#4' :
                          ext.extension === '6' && ext.alteration === 'flat' ? 'b6' :
                          ext.extension === '6' && ext.alteration === 'sharp' ? '#6' :
                          ext.extension === '7' && ext.alteration === 'flat' ? 'b7' :
                          ext.extension === '7' && ext.alteration === 'natural' ? '7' :
                          ext.extension === '9' && ext.alteration === 'flat' ? 'b9' :
                          ext.extension === '9' && ext.alteration === 'sharp' ? '#9' :
                          ext.extension === '11' && ext.alteration === 'natural' ? '11' :
                          ext.extension === '11' && ext.alteration === 'sharp' ? '#11' :
                          ext.extension === '13' && ext.alteration === 'flat' ? 'b13' : '13';
          const colorClass = INTERVAL_COLORS[interval] || 'bg-gray-500/30 border-gray-500';
          const extNotes = chordInfo.allNotes.filter(n => !triadInfo.notes.includes(n));
          const extNote = extNotes[extIndex];

          return extNote ? (
            <div
              key={ext.extension}
              className={cn(
                'px-2 py-1 border-2 rounded-none text-center min-w-[50px]',
                colorClass
              )}
            >
              <p className="text-xs font-bold text-white">{displayNote(extNote)}</p>
              <p className="text-[10px] text-gray-300">{displayInterval(interval)}</p>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}
