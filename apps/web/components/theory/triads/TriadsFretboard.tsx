/**
 * ADAGIO - TriadsFretboard Component
 * Visualisation SVG du manche de guitare pour les triades
 * Adaptation de ScaleFretboard pour afficher les triades et extensions
 */

'use client';

import { useMemo } from 'react';
import type { Interval } from '@adagio/types';
import type { FretboardTriadNote } from '@/features/triades/services';
import { NOTE_FR } from '@/lib/theory';

// Cordes de guitare (de la plus aiguë à la plus grave)
const GUITAR_STRINGS: Array<{ note: string; name: string }> = [
  { note: 'E', name: 'MI' },
  { note: 'B', name: 'SI' },
  { note: 'G', name: 'SOL' },
  { note: 'D', name: 'RÉ' },
  { note: 'A', name: 'LA' },
  { note: 'E', name: 'MI' },
];

// SVG constants
export const TRIAD_FRET_CONSTANTS = {
  NUT_POSITION: 60,
  FRET_WIDTH: 120,
  STRING_SPACING: 65,
  SVG_HEIGHT: 420,
} as const;

export function calculateTriadFretPositions(fretCount: number): number[] {
  const positions: number[] = [TRIAD_FRET_CONSTANTS.NUT_POSITION];

  for (let i = 1; i <= fretCount; i++) {
    positions.push(TRIAD_FRET_CONSTANTS.NUT_POSITION + i * TRIAD_FRET_CONSTANTS.FRET_WIDTH);
  }

  return positions;
}

function formatInterval(interval: Interval): string {
  return interval
    .replace(/#/g, '♯')
    .replace(/b/g, '♭')
    .replace(/bb/g, '♭♭');
}

interface TriadsFretboardProps {
  fretboardNotes: FretboardTriadNote[];
  fretCount: number;
  displayNote: (note: string) => string;
}

export function TriadsFretboard({
  fretboardNotes,
  fretCount,
  displayNote,
}: TriadsFretboardProps) {
  const fretPositions = useMemo(() => calculateTriadFretPositions(fretCount), [fretCount]);
  const lastFretPosition = fretPositions[fretPositions.length - 1] ?? 800;
  const SVG_WIDTH = Math.max(lastFretPosition + 30, 800);

  // Couleurs par type de note
  function getNoteColors(note: FretboardTriadNote): { bg: string; border: string; text: string } {
    if (note.isRoot) {
      return { bg: '#0a0f0a', border: '#22c55e', text: '#22c55e' }; // toxic green
    }
    if (note.isTriadNote) {
      return { bg: '#010101', border: '#2a2a2a', text: '#e0e0e0' }; // triade notes
    }
    return { bg: '#0d0d15', border: '#f59e0b', text: '#f59e0b' }; // extensions
  }

  return (
    <div className="w-full">
      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${TRIAD_FRET_CONSTANTS.SVG_HEIGHT}`}
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background */}
          <rect x="0" y="0" width={SVG_WIDTH} height={TRIAD_FRET_CONSTANTS.SVG_HEIGHT} fill="#010101" />

          {/* Strings */}
          {GUITAR_STRINGS.map((_, i) => {
            const y = 40 + i * TRIAD_FRET_CONSTANTS.STRING_SPACING;
            return (
              <line
                key={i}
                x1={TRIAD_FRET_CONSTANTS.NUT_POSITION}
                y1={y}
                x2={SVG_WIDTH - 10}
                y2={y}
                stroke="#2a2a2a"
                strokeWidth={i === 0 || i === 5 ? 2 : 1.5}
              />
            );
          })}

          {/* Frets */}
          {fretPositions.map((x, i) => {
            const isNut = i === 0;
            return (
              <line
                key={i}
                x1={x}
                y1="20"
                x2={x}
                y2="365"
                stroke={isNut ? '#8b1a1a' : '#2a2a2a'}
                strokeWidth={isNut ? 4 : 2}
              />
            );
          })}

          {/* Fret markers (dots) */}
          {[3, 5, 7, 9].map(fret => {
            if (fret > fretCount) return null;
            const currentFret = fretPositions[fret];
            const prevFret = fretPositions[fret - 1];
            if (currentFret === undefined || prevFret === undefined) return null;
            const x = (currentFret + prevFret) / 2;
            return (
              <circle
                key={fret}
                cx={x}
                cy="205"
                r="8"
                fill="#0a0f0a"
                stroke="#2a2a2a"
                strokeWidth="1"
              />
            );
          })}

          {/* Double markers at 12 */}
          {fretCount >= 12 && (
            <>
              <circle
                cx={((fretPositions[12] ?? 0) + (fretPositions[11] ?? 0)) / 2}
                cy="145"
                r="8"
                fill="#0a0f0a"
                stroke="#2a2a2a"
                strokeWidth="1"
              />
              <circle
                cx={((fretPositions[12] ?? 0) + (fretPositions[11] ?? 0)) / 2}
                cy="265"
                r="8"
                fill="#0a0f0a"
                stroke="#2a2a2a"
                strokeWidth="1"
              />
            </>
          )}

          {/* Fret numbers */}
          {fretPositions.slice(1).map((x, i) => {
            const fretNum = i + 1;
            const prevFret = fretPositions[i];
            if (prevFret === undefined) return null;
            const labelX = (x + prevFret) / 2;
            return (
              <text
                key={fretNum}
                x={labelX}
                y="395"
                textAnchor="middle"
                fill="#666666"
                fontSize="11"
                fontFamily="monospace"
              >
                {fretNum}
              </text>
            );
          })}

          {/* String names */}
          {GUITAR_STRINGS.map((s, i) => {
            const y = 40 + i * TRIAD_FRET_CONSTANTS.STRING_SPACING + 4;
            return (
              <text
                key={`string-${i}`}
                x="35"
                y={y}
                textAnchor="end"
                fill="#666666"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {s.name}
              </text>
            );
          })}

          {/* Notes */}
          {fretboardNotes.map((noteData) => {
            const stringIndex = noteData.string;
            const y = 40 + stringIndex * TRIAD_FRET_CONSTANTS.STRING_SPACING;
            const x = noteData.fret === 0
              ? (TRIAD_FRET_CONSTANTS.NUT_POSITION - 20)
              : ((fretPositions[noteData.fret - 1] ?? 0) + (fretPositions[noteData.fret] ?? 0)) / 2;

            const colors = getNoteColors(noteData);
            const fretWidth = noteData.fret === 0
              ? TRIAD_FRET_CONSTANTS.FRET_WIDTH
              : (fretPositions[noteData.fret] ?? 0) - (fretPositions[noteData.fret - 1] ?? 0);
            const noteRadius = Math.max(16, Math.min(28, Math.floor(fretWidth * 0.42)));

            return (
              <g key={`${noteData.string}-${noteData.fret}`}>
                <circle
                  cx={x}
                  cy={y}
                  r={noteRadius}
                  fill={colors.bg}
                  stroke={colors.border}
                  strokeWidth={noteData.isRoot ? 3 : noteData.isExtension ? 2 : 2}
                  opacity={1}
                />
                <text
                  x={x}
                  y={y + Math.floor(noteRadius * 0.35)}
                  textAnchor="middle"
                  fill={colors.text}
                  fontSize={Math.max(9, Math.floor(noteRadius * 0.65))}
                  fontWeight={noteData.isRoot ? 'bold' : noteData.isExtension ? '600' : 'normal'}
                >
                  {displayNote(noteData.name)}
                </text>
                {noteData.interval && noteData.interval !== '1' && (
                  <text
                    x={x}
                    y={y - Math.floor(noteRadius * 0.65)}
                    textAnchor="middle"
                    fill={noteData.isExtension ? '#f59e0b' : '#666666'}
                    fontSize={Math.max(6, Math.floor(noteRadius * 0.45))}
                  >
                    {formatInterval(noteData.interval)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Légende */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#0a0f0a] border-2 border-[#22c55e]"></span>
          <span>Fondamentale</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#010101] border-2 border-[#2a2a2a]"></span>
          <span>Triade</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#0d0d15] border-2 border-[#f59e0b]"></span>
          <span>Extension</span>
        </div>
      </div>
    </div>
  );
}
