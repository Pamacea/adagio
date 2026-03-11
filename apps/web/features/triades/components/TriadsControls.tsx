/**
 * ADAGIO - TriadsControls Component
 * Panneau de contrôle pour la page Triades
 * Sélection de tonique et qualité de triade
 */

'use client';

import { cn } from '@adagio/ui';
import type { NoteName } from '@adagio/types';
import type { TriadQuality } from '../services';
import { TRIAD_QUALITY_LABELS, AVAILABLE_NOTES } from '../hooks';

export interface TriadsControlsProps {
  root: NoteName;
  quality: TriadQuality;
  fretCount: number;
  onRootChange: (note: NoteName) => void;
  onQualityChange: (quality: TriadQuality) => void;
  onFretCountChange: (count: 12 | 15 | 17 | 19 | 21 | 24) => void;
}

const FRET_OPTIONS = [12, 15, 17, 19, 21, 24] as const;

const QUALITY_COLORS: Record<TriadQuality, { border: string; bg: string; text: string }> = {
  major: {
    border: 'border-emerald-500',
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
  },
  minor: {
    border: 'border-amber-400',
    bg: 'bg-amber-400/20',
    text: 'text-amber-400',
  },
  augmented: {
    border: 'border-red-500',
    bg: 'bg-red-500/20',
    text: 'text-red-400',
  },
  diminished: {
    border: 'border-purple-500',
    bg: 'bg-purple-500/20',
    text: 'text-purple-400',
  },
};

export function TriadsControls({
  root,
  quality,
  fretCount,
  onRootChange,
  onQualityChange,
  onFretCountChange,
}: TriadsControlsProps) {
  const qualityColors = QUALITY_COLORS[quality];

  return (
    <div className="space-y-6">
      {/* Note racine */}
      <div>
        <label className="text-xs text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2 font-semibold">
          <span className="w-1.5 h-1.5 rounded-none bg-toxic animate-pulse"></span>
          Note racine
        </label>
        <div className="grid grid-cols-6 gap-1.5">
          {AVAILABLE_NOTES.map(note => (
            <button
              key={note}
              onClick={() => onRootChange(note)}
              className={cn(
                'py-2 text-xs font-bold border-2 rounded-none transition-all duration-200',
                root === note
                  ? 'border-amber-400 bg-gradient-to-br from-amber-400/30 to-amber-600/10 text-amber-400 shadow-lg shadow-amber-400/20 scale-105'
                  : 'border-steel/30 text-gray-300 hover:border-amber-400/50 hover:text-amber-400 hover:scale-105'
              )}
            >
              {note}
            </button>
          ))}
        </div>
      </div>

      {/* Qualité de triade */}
      <div>
        <label className="text-xs text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2 font-semibold">
          <span className="w-1.5 h-1.5 rounded-none bg-blood animate-pulse"></span>
          Qualité de triade
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(TRIAD_QUALITY_LABELS) as [TriadQuality, string][]).map(([q, label]) => {
            const colors = QUALITY_COLORS[q];
            return (
              <button
                key={q}
                onClick={() => onQualityChange(q)}
                className={cn(
                  'py-3 px-4 text-sm font-bold border-2 rounded-none transition-all duration-200',
                  quality === q
                    ? `${colors.border} ${colors.bg} ${colors.text} shadow-md scale-105`
                    : 'border-steel/30 text-gray-300 hover:border-steel hover:bg-white/[0.02]'
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Nombre de frettes */}
      <div>
        <label className="text-xs text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2 font-semibold">
          <span className="w-1.5 h-1.5 rounded-none bg-circuit animate-pulse"></span>
          Nombre de frettes
        </label>
        <div className="flex gap-1.5">
          {FRET_OPTIONS.map(frets => (
            <button
              key={frets}
              onClick={() => onFretCountChange(frets)}
              className={cn(
                'flex-1 py-2 text-sm font-bold border-2 rounded-none transition-all duration-200',
                fretCount === frets
                  ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400'
                  : 'border-steel/30 text-gray-300 hover:border-cyan-400/50'
              )}
            >
              {frets}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
