/**
 * ADAGIO - ScaleFretboard Component
 * Visualisation SVG du manche de guitare pour les gammes
 */

'use client';

import type { Interval } from '@adagio/types';
import type { FretboardNote } from '@adagio/types';

// Cordes de guitare (de la plus aiguë à la plus grave)
// Accordage standard : e B G D A E (Mi Si Sol Ré La Mi)
const GUITAR_STRINGS: Array<{ note: string; name: string }> = [
  { note: 'E', name: 'MI' },   // Corde 1 - Mi aigu
  { note: 'B', name: 'SI' },   // Corde 2 - Si
  { note: 'G', name: 'SOL' },  // Corde 3 - Sol
  { note: 'D', name: 'RÉ' },   // Corde 4 - Ré
  { note: 'A', name: 'LA' },   // Corde 5 - La
  { note: 'E', name: 'MI' },   // Corde 6 - Mi grave
];

// SVG constants
export const FRET_CONSTANTS = {
  NUT_POSITION: 60,
  FRET_WIDTH: 100,      // Largeur uniforme par frette
  STRING_SPACING: 55,   // Espacement entre les cordes
  SVG_HEIGHT: 360,
} as const;

// Calculate fret positions using LINEAR spacing
export function calculateFretPositions(fretCount: number): number[] {
  const positions: number[] = [FRET_CONSTANTS.NUT_POSITION];

  for (let i = 1; i <= fretCount; i++) {
    positions.push(FRET_CONSTANTS.NUT_POSITION + i * FRET_CONSTANTS.FRET_WIDTH);
  }

  return positions;
}

// Convertir les intervalles vers notation musicale avec symboles
function formatInterval(interval: Interval): string {
  const symbols: Record<string, string> = {
    '#': '♯',
    'b': '♭',
    'bb': '♭♭',
    '##': '♯♯',
  };
  let result: string = interval;
  for (const [key, symbol] of Object.entries(symbols)) {
    result = result.replace(new RegExp(key, 'g'), symbol);
  }
  return result;
}

// Obtenir la couleur de fond pour une note
function getNoteBg(inScale: boolean, interval?: Interval | string): string {
  if (!inScale) return 'bg-void';
  if (interval === '1') return 'bg-toxic border-blood';
  if (interval === '5') return 'bg-circuit border-steel';
  return 'bg-blackness border-steel';
}

interface ScaleFretboardProps {
  fretboardData: FretboardNote[];
  fretPositions: number[];
  fretCount: number;
  showAllNotes: boolean;
  displayNote: (note: string) => string;
}

export function ScaleFretboard({
  fretboardData,
  fretPositions,
  fretCount,
  showAllNotes,
  displayNote,
}: ScaleFretboardProps) {
  // Calculate SVG width based on fret count
  const lastFretPosition = fretPositions[fretPositions.length - 1] ?? 800;
  const SVG_WIDTH = Math.max(lastFretPosition + 30, 800);

  return (
    <div className="section-frame p-2 mb-8 -mx-2 px-4">
      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${FRET_CONSTANTS.SVG_HEIGHT}`}
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          {/* Background */}
          <rect x="0" y="0" width={SVG_WIDTH} height={FRET_CONSTANTS.SVG_HEIGHT} fill="#010101" />

          {/* Strings */}
          {GUITAR_STRINGS.map((_, i) => {
            const y = 40 + i * FRET_CONSTANTS.STRING_SPACING;
            return (
              <line
                key={i}
                x1={FRET_CONSTANTS.NUT_POSITION}
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
                y2="310"
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
                cy="175"
                r="7"
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
                cy="125"
                r="7"
                fill="#0a0f0a"
                stroke="#2a2a2a"
                strokeWidth="1"
              />
              <circle
                cx={((fretPositions[12] ?? 0) + (fretPositions[11] ?? 0)) / 2}
                cy="225"
                r="7"
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
                y="335"
                textAnchor="middle"
                fill="#666666"
                fontSize="10"
                fontFamily="monospace"
              >
                {fretNum}
              </text>
            );
          })}

          {/* String names */}
          {GUITAR_STRINGS.map((s, i) => {
            const y = 40 + i * FRET_CONSTANTS.STRING_SPACING + 4;
            return (
              <text
                key={`string-${i}`}
                x="35"
                y={y}
                textAnchor="end"
                fill="#666666"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {s.name}
              </text>
            );
          })}

          {/* Notes */}
          {fretboardData.map((noteData) => {
            const stringIndex = noteData.string;
            if (stringIndex === undefined) return null;

            const y = 40 + stringIndex * FRET_CONSTANTS.STRING_SPACING;
            // Calculate note position using linear fret positions
            const x = noteData.fret === 0
              ? (FRET_CONSTANTS.NUT_POSITION - 20)
              : ((fretPositions[noteData.fret - 1] ?? 0) + (fretPositions[noteData.fret] ?? 0)) / 2;

            const shouldShow = showAllNotes || noteData.inScale;
            if (!shouldShow) return null;

            const interval = noteData.interval as Interval | undefined;
            const noteBg = getNoteBg(noteData.inScale, interval);

            // Dynamic radius based on fret width to avoid overlap
            const fretWidth = noteData.fret === 0
              ? FRET_CONSTANTS.FRET_WIDTH
              : (fretPositions[noteData.fret] ?? 0) - (fretPositions[noteData.fret - 1] ?? 0);
            const noteRadius = Math.max(12, Math.min(22, Math.floor(fretWidth * 0.45)));

            return (
              <g key={`${noteData.string}-${noteData.fret}`}>
                <circle
                  cx={x}
                  cy={y}
                  r={noteRadius}
                  fill={noteBg.includes('toxic') ? '#0a0f0a' : noteBg.includes('circuit') ? '#0d130d' : '#010101'}
                  stroke={noteBg.includes('blood') ? '#8b1a1a' : '#2a2a2a'}
                  strokeWidth={noteData.inScale ? 2 : 1}
                  opacity={noteData.inScale ? 1 : 0.5}
                />
                <text
                  x={x}
                  y={y + Math.floor(noteRadius * 0.3)}
                  textAnchor="middle"
                  fill={noteData.inScale ? '#e0e0e0' : '#666666'}
                  fontSize={Math.max(7, Math.floor(noteRadius * 0.7))}
                  fontWeight={noteData.interval === '1' ? 'bold' : 'normal'}
                >
                  {displayNote(noteData.name)}
                </text>
                {noteData.interval && noteData.inScale && noteData.interval !== '1' && (
                  <text
                    x={x}
                    y={y - Math.floor(noteRadius * 0.6)}
                    textAnchor="middle"
                    fill="#666666"
                    fontSize={Math.max(5, Math.floor(noteRadius * 0.4))}
                  >
                    {noteData.interval ? formatInterval(noteData.interval as Interval) : ''}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
