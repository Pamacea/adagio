/**
 * FretboardView - 24-fret guitar fretboard component
 *
 * Displays a 24-fret fretboard with:
 * - String labels (MI, SI, SOL, RÉ, LA, MI)
 * - Fret numbers
 * - Scale notes with root highlighting
 * - Fret markers at standard positions
 */

'use client';

import type { NoteName } from '@adagio/types';
import { cn } from '@adagio/ui';

export interface FretboardNote {
  string: number;
  fret: number;
  name: NoteName;
  inScale: boolean;
}

export interface FretboardViewProps {
  root: NoteName;
  fretboardNotes: FretboardNote[];
  className?: string;
}

export function FretboardView({ root, fretboardNotes, className }: FretboardViewProps) {
  return (
    <div className={className}>
      <h3 className="text-lg font-metal text-white mb-4 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-none bg-toxic"></span>
        Manche de guitare (24 frets)
      </h3>
      <svg
        viewBox="0 0 1900 340"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="fretboardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a1510" />
            <stop offset="50%" stopColor="#0d0a08" />
            <stop offset="100%" stopColor="#1a1510" />
          </linearGradient>
          <radialGradient id="noteRootGrad" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </radialGradient>
          <radialGradient id="noteScaleGrad" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#16a34a" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <rect x="0" y="0" width="1900" height="340" fill="url(#fretboardGrad)" rx="0" />

        {/* Strings */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const y = 42 + i * 48;
          return (
            <line key={`string-${i}`} x1="50" y1={y} x2="1880" y2={y} stroke={i < 3 ? '#8a7358' : '#6b5a45'} strokeWidth={i === 0 || i === 5 ? 2.5 : 2} opacity={0.8} />
          );
        })}

        {/* Frets - 24 frets */}
        {Array.from({ length: 25 }, (_, i) => {
          const x = 50 + i * 75;
          const isNut = i === 0;
          return (
            <line key={`fret-${i}`} x1={x} y1="20" x2={x} y2="300" stroke={isNut ? '#8b7355' : '#5c4a3a'} strokeWidth={isNut ? 5 : 2} />
          );
        })}

        {/* Nut */}
        <rect x="45" y="20" width="10" height="280" fill="#3d3225" rx="0" />

        {/* Fret markers - single dots at 3, 5, 7, 9, 15, 17, 19, 21 */}
        {[3, 5, 7, 9, 15, 17, 19, 21].map(fret => (
          <circle key={`marker-${fret}`} cx={50 + fret * 75 - 37.5} cy="160" r={7} fill="#4a5568" opacity={0.5} />
        ))}
        {/* Double markers at 12, 24 */}
        <circle cx={50 + 12 * 75 - 37.5} cy="125" r={7} fill="#4a5568" opacity={0.5} />
        <circle cx={50 + 12 * 75 - 37.5} cy="195" r={7} fill="#4a5568" opacity={0.5} />
        <circle cx={50 + 24 * 75 - 37.5} cy="125" r={7} fill="#4a5568" opacity={0.5} />
        <circle cx={50 + 24 * 75 - 37.5} cy="195" r={7} fill="#4a5568" opacity={0.5} />

        {/* Fret numbers */}
        {Array.from({ length: 24 }, (_, i) => {
          const fretNum = i + 1;
          return (
            <text key={`fret-num-${fretNum}`} x={50 + i * 75 + 37.5} y="320" textAnchor="middle" fill="#6b7280" fontSize="10" fontFamily="monospace" fontWeight="bold">
              {fretNum}
            </text>
          );
        })}

        {/* String names */}
        {['MI', 'SI', 'SOL', 'RÉ', 'LA', 'MI'].map((name, i) => (
          <text key={`string-name-${i}`} x="28" y={42 + i * 48 + 4} textAnchor="end" fill="#6b7280" fontSize="9" fontFamily="monospace" fontWeight="bold">
            {name}
          </text>
        ))}

        {/* Notes - enhanced with octaves */}
        {fretboardNotes.map((noteData) => {
          const stringIndex = noteData.string;
          if (stringIndex === undefined) return null;
          const y = 42 + stringIndex * 48;
          const x = noteData.fret === 0 ? 25 : 50 + (noteData.fret - 1) * 75 + 37.5;
          const isRoot = noteData.name === root;
          const inScale = noteData.inScale;
          const noteRadius = noteData.fret === 0 ? 13 : 17;

          if (!inScale) {
            return (
              <g key={`note-${noteData.string}-${noteData.fret}`}>
                <circle cx={x} cy={y} r={noteRadius - 1} fill="#1f2937" stroke="#374151" strokeWidth={1} opacity={0.2} />
              </g>
            );
          }

          return (
            <g key={`note-${noteData.string}-${noteData.fret}`}>
              {isRoot && (
                <circle cx={x} cy={y} r={noteRadius + 3} fill="none" stroke="#fbbf24" strokeWidth={1} opacity={0.4}>
                  <animate attributeName="r" values={`${noteRadius + 3};${noteRadius + 6};${noteRadius + 3}`} dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={x} cy={y} r={noteRadius} fill={isRoot ? 'url(#noteRootGrad)' : 'url(#noteScaleGrad)'} stroke={isRoot ? '#fbbf24' : '#22c55e'} strokeWidth={1.5} filter="url(#glow)" />
              <text x={x} y={y + noteRadius * 0.35} textAnchor="middle" fill={isRoot ? '#1a1a1a' : '#ffffff'} fontSize={9} fontWeight="bold">
                {noteData.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
