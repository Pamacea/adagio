/**
 * ChordDiagram - Guitar Chord Diagram Component (SVG)
 *
 * Professional chord diagram with:
 * - Clean SVG rendering with inline styles
 * - Thick nut line
 * - Clear fret markers
 * - Professional finger dots
 * - Open/muted string indicators
 * - Fret numbers for moveable chords
 */

import { type NoteName } from '@adagio/types';
import { cn } from '../lib/cn';

export interface ChordFingerPosition {
  string: number; // 0-5 (0 = high E, 5 = low E)
  fret: number; // 0 = open, -1 = muted, 1+ = fret number
  finger?: number; // 1-4 for finger indication
}

export interface ChordDiagramProps {
  name: string; // Ex: "Cmaj7"
  root?: NoteName;
  positions: ChordFingerPosition[];
  frets?: number; // Number of frets to display (default 4)
  showFretNumbers?: boolean;
  showStringNames?: boolean;
  compact?: boolean; // Compact mode for grids
  className?: string;
}

const STRING_NAMES = ['E', 'B', 'G', 'D', 'A', 'E'] as const; // High to low

// SVG dimensions
const WIDTH = 140;
const HEIGHT = 160;
const MARGIN_LEFT = 20;
const MARGIN_TOP = 28;
const MARGIN_BOTTOM = 25;
const STRING_SPACING = 20;
const FRET_HEIGHT = 28;

// Colors matching the metal theme
const COLORS = {
  nut: '#8b1a1a',
  fret: '#4a5568',
  string: '#6b7280',
  fingerFill: '#0a0f0a',
  fingerStroke: '#ef4444',
  fingerRootFill: '#ef4444',
  openString: '#22c55e',
  mutedString: '#ef4444',
  text: '#9ca3af',
  textLight: '#e0e0e0',
  white: '#e0e0e0',
  barre: 'rgba(255, 255, 255, 0.3)',
};

export function ChordDiagram({
  name,
  root,
  positions,
  frets = 4,
  showFretNumbers = true,
  showStringNames = true,
  compact = false,
  className,
}: ChordDiagramProps) {
  // Calculate starting fret
  const validPositions = positions.filter((p) => p.fret > 0);
  const startFret = validPositions.length > 0
    ? Math.min(...validPositions.map((p) => p.fret))
    : 1;

  // Build position map
  const positionMap = new Map(positions.map((p) => [p.string, p]));

  const hasMuted = positions.some(p => p.fret === -1);
  const hasOpen = positions.some(p => p.fret === 0);

  return (
    <div className={cn('inline-block', className)}>
      {name && !compact && (
        <div className="text-center text-sm font-bold mb-2" style={{ color: '#ecb605' }}>
          {name}
        </div>
      )}

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={cn(
          'drop-shadow-lg',
          compact ? 'w-20 h-28' : 'w-36 h-44'
        )}
        style={{ filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4))' }}
      >
        {/* Fret numbers */}
        {showFretNumbers && startFret > 1 && (
          <g>
            {Array.from({ length: frets }, (_, i) => (
              <text
                key={i}
                x={8}
                y={MARGIN_TOP + FRET_HEIGHT * i + FRET_HEIGHT / 2 + 4}
                fill={COLORS.text}
                fontSize={11}
                fontWeight="600"
                textAnchor="middle"
              >
                {startFret + i}
              </text>
            ))}
          </g>
        )}

        {/* String names */}
        {showStringNames && !compact && (
          <g>
            {STRING_NAMES.map((s, i) => (
              <text
                key={i}
                x={MARGIN_LEFT + STRING_SPACING * i}
                y={14}
                fill={COLORS.text}
                fontSize={11}
                fontWeight="600"
                textAnchor="middle"
              >
                {s}
              </text>
            ))}
          </g>
        )}

        {/* Vertical string lines */}
        <g>
          {STRING_NAMES.map((_, i) => (
            <line
              key={i}
              x1={MARGIN_LEFT + STRING_SPACING * i}
              y1={MARGIN_TOP - (hasOpen ? 10 : 0)}
              x2={MARGIN_LEFT + STRING_SPACING * i}
              y2={MARGIN_TOP + FRET_HEIGHT * frets}
              stroke={COLORS.string}
              strokeWidth={i === 0 || i === 5 ? 2 : 1.2}
            />
          ))}
        </g>

        {/* Horizontal fret lines */}
        <g>
          {Array.from({ length: frets + 1 }, (_, i) => {
            const y = MARGIN_TOP + FRET_HEIGHT * i;
            const isNut = i === 0 && startFret === 1;

            return (
              <line
                key={i}
                x1={MARGIN_LEFT}
                y1={y}
                x2={MARGIN_LEFT + STRING_SPACING * 5}
                y2={y}
                stroke={isNut ? COLORS.nut : COLORS.fret}
                strokeWidth={isNut ? 4.5 : 1.8}
              />
            );
          })}
        </g>

        {/* Finger dots */}
        <g>
          {positions.map((pos) => {
            if (pos.fret <= 0) return null;

            const x = MARGIN_LEFT + STRING_SPACING * pos.string;
            const fretIndex = pos.fret - startFret;
            const y = MARGIN_TOP + FRET_HEIGHT * fretIndex + FRET_HEIGHT / 2;

            return (
              <g key={`dot-${pos.string}-${pos.fret}`}>
                {/* Outer circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={11}
                  fill={COLORS.fingerFill}
                  stroke={COLORS.fingerStroke}
                  strokeWidth={2.2}
                />
                {/* Inner fill */}
                <circle
                  cx={x}
                  cy={y}
                  r={8}
                  fill={COLORS.fingerRootFill}
                  opacity={0.9}
                />
                {/* Finger number */}
                {pos.finger && (
                  <text
                    x={x}
                    cy={y + 0.5}
                    fill="#ffffff"
                    fontSize={11}
                    fontWeight="700"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {pos.finger}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* Open string indicators */}
        {hasOpen && (
          <g>
            {positions.map((pos) => {
              if (pos.fret !== 0) return null;
              const x = MARGIN_LEFT + STRING_SPACING * pos.string;
              const y = MARGIN_TOP - 13;

              return (
                <circle
                  key={`open-${pos.string}`}
                  cx={x}
                  cy={y}
                  r={5.5}
                  fill="none"
                  stroke={COLORS.openString}
                  strokeWidth={2.2}
                />
              );
            })}
          </g>
        )}

        {/* Muted string indicators (X) */}
        {hasMuted && (
          <g>
            {positions.map((pos) => {
              if (pos.fret !== -1) return null;
              const x = MARGIN_LEFT + STRING_SPACING * pos.string;
              const y = MARGIN_TOP - 11;
              const size = 6;

              return (
                <g key={`muted-${pos.string}`}>
                  <line
                    x1={x - size}
                    y1={y - size}
                    x2={x + size}
                    y2={y + size}
                    stroke={COLORS.mutedString}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                  />
                  <line
                    x1={x + size}
                    y1={y - size}
                    x2={x - size}
                    y2={y + size}
                    stroke={COLORS.mutedString}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                  />
                </g>
              );
            })}
          </g>
        )}

        {/* Barre indicator */}
        {positions.some(p => p.finger === 1) && (() => {
          const barrePositions = positions.filter(p => p.finger === 1 && p.fret > 0);
          if (barrePositions.length < 2) return null;

          const minString = Math.min(...barrePositions.map(p => p.string));
          const maxString = Math.max(...barrePositions.map(p => p.string));
          const fret = barrePositions[0]?.fret ?? 0;

          const x1 = MARGIN_LEFT + STRING_SPACING * minString;
          const x2 = MARGIN_LEFT + STRING_SPACING * maxString;
          const fretIndex = fret - startFret;
          const y = MARGIN_TOP + FRET_HEIGHT * fretIndex + FRET_HEIGHT / 2;

          return (
            <line
              x1={x1}
              y1={y}
              x2={x2}
              y2={y}
              stroke={COLORS.barre}
              strokeWidth={3}
              strokeLinecap="round"
            />
          );
        })()}

        {/* Compact name overlay */}
        {name && compact && (
          <text
            x={WIDTH / 2}
            y={HEIGHT - 6}
            fill={COLORS.white}
            fontSize={10}
            fontWeight="600"
            textAnchor="middle"
          >
            {name}
          </text>
        )}
      </svg>
    </div>
  );
}
