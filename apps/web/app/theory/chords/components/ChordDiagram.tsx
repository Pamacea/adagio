/**
 * ChordDiagram - Professional guitar chord diagram component
 *
 * Displays a chord diagram with:
 * - String labels (E A D G B E)
 * - Fret numbers for higher positions
 * - Open string indicators (○)
 * - Muted string indicators (×)
 * - Interval-colored notes (R, 3, 5, etc.)
 * - Note names above each position
 * - Barre chord visualization
 */

'use client';

import type { NoteName, Interval } from '@adagio/types';

export interface ChordDiagramProps {
  name: string;
  positions: Array<{
    string: number;
    fret: number;
    finger?: number;
    note?: NoteName;
    interval?: Interval;
  }>;
  className?: string;
  position?: number;
  totalPositions?: number;
}

export function ChordDiagram({
  name,
  positions,
  className,
  position,
  totalPositions,
}: ChordDiagramProps) {
  // Dimensions
  const W = 320;
  const H = 340;
  const MARGIN_LEFT = 45;
  const MARGIN_TOP = 70;
  const STRING_SPACING = 38;
  const FRET_HEIGHT = 38;
  const NUM_FRETS = 5;

  // Calculer la frette de départ (pour les positions hautes)
  const pressedFrets = positions.filter((p) => p.fret > 0).map((p) => p.fret);
  const minFret = pressedFrets.length > 0 ? Math.min(...pressedFrets) : 1;
  const startFret = minFret > 3 ? minFret : 1;

  // Détecter si c'est un barré
  const barreChord = positions.find(
    (p) =>
      p.finger &&
      positions.filter((o) => o.finger === p.finger && o.fret > 0).length >= 2
  );

  // Cordes E A D G B E (de bas aigu à haut grave, gauche à droite)
  const STRING_NAMES = ['E', 'A', 'D', 'G', 'B', 'E'];

  // Couleurs pour les intervalles
  const getIntervalColor = (interval?: Interval) => {
    if (!interval) return '#888';
    switch (interval) {
      case '1':
        return '#fbbf24'; // Tonique - Amber
      case '3':
        return '#22c55e'; // Tierce - Green
      case '5':
        return '#3b82f6'; // Quinte - Blue
      case 'b3':
        return '#22c55e';
      case 'b7':
        return '#a855f7'; // Septième mineure - Purple
      case '7':
        return '#a855f7';
      case '9':
        return '#f472b6'; // Neuvième - Pink
      case '11':
        return '#fb923c';
      case '13':
        return '#14b8a6';
      default:
        return '#888';
    }
  };

  const getIntervalLabel = (interval?: Interval) => {
    if (!interval) return '';
    switch (interval) {
      case '1':
        return 'R';
      case 'b2':
        return '♭2';
      case '2':
        return '2';
      case 'b3':
        return '♭3';
      case '3':
        return '3';
      case '4':
        return '4';
      case '#4':
        return '♯4';
      case 'b5':
        return '♭5';
      case '5':
        return '5';
      case '#5':
        return '♯5';
      case '6':
        return '6';
      case 'b7':
        return '♭7';
      case '7':
        return '7';
      case 'b9':
        return '♭9';
      case '9':
        return '9';
      case '11':
        return '11';
      case '13':
        return '13';
      default:
        return interval;
    }
  };

  return (
    <div className={className}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        <defs>
          {/* Gradient pour le fond du diagramme */}
          <linearGradient id="diagramBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a1814" />
            <stop offset="100%" stopColor="#0f0d0a" />
          </linearGradient>

          {/* Gradient pour les notes */}
          <radialGradient id="noteFill" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </radialGradient>

          {/* Ombre portée */}
          <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Fond */}
        <rect x="0" y="0" width={W} height={H} fill="#0a0908" rx="4" />
        <rect
          x="4"
          y="4"
          width={W - 8}
          height={H - 8}
          fill="url(#diagramBg)"
          rx="3"
        />
        <rect
          x="4"
          y="4"
          width={W - 8}
          height={H - 8}
          fill="none"
          stroke="#333"
          strokeWidth={1}
          rx="3"
        />

        {/* Nom de l'accord */}
        <text
          x={W / 2}
          y={38}
          fill="#e5e5e5"
          fontSize={30}
          fontWeight="bold"
          textAnchor="middle"
          className="font-metal"
          filter="url(#softShadow)"
        >
          {name}
        </text>

        {/* Indicateur de position */}
        {position !== undefined && totalPositions && totalPositions > 1 && (
          <text
            x={W - 16}
            y={38}
            fill="#666"
            fontSize={14}
            fontWeight="600"
            textAnchor="end"
          >
            {position}/{totalPositions}
          </text>
        )}

        {/* Indicateur de frette de départ */}
        {startFret > 1 && (
          <g>
            <rect
              x={MARGIN_LEFT - 10}
              y={MARGIN_TOP - 14}
              width={36}
              height={22}
              fill="#333"
              rx="3"
            />
            <text
              x={MARGIN_LEFT + 8}
              y={MARGIN_TOP + 2}
              fill="#fff"
              fontSize={14}
              fontWeight="bold"
              textAnchor="middle"
            >
              {startFret}
            </text>
            <text
              x={MARGIN_LEFT + 8}
              y={MARGIN_TOP + 15}
              fill="#888"
              fontSize={8}
              textAnchor="middle"
            >
              fr
            </text>
          </g>
        )}

        {/* DIAGRAMME CENTRAL */}
        <g transform={`translate(${MARGIN_LEFT}, ${MARGIN_TOP})`}>
          {/* Sillet (nut) */}
          {startFret === 1 && (
            <line
              x1={0}
              y1={0}
              x2={STRING_SPACING * 5}
              y2={0}
              stroke="#666"
              strokeWidth={8}
              strokeLinecap="butt"
            />
          )}

          {/* Cordes verticales */}
          {STRING_NAMES.map((_, i) => (
            <line
              key={`string-${i}`}
              x1={i * STRING_SPACING}
              y1={0}
              x2={i * STRING_SPACING}
              y2={FRET_HEIGHT * NUM_FRETS}
              stroke="#555"
              strokeWidth={i === 0 || i === 5 ? 2.5 : 1.8}
              opacity={0.8}
            />
          ))}

          {/* Frettes horizontales */}
          {Array.from({ length: NUM_FRETS + 1 }).map((_, i) => (
            <line
              key={`fret-${i}`}
              x1={0}
              y1={i * FRET_HEIGHT}
              x2={STRING_SPACING * 5}
              y2={i * FRET_HEIGHT}
              stroke="#555"
              strokeWidth={i === 0 && startFret === 1 ? 0 : 1.8}
              opacity={0.7}
            />
          ))}

          {/* Indicateurs de cordes à vide (○) */}
          {positions.map((pos) => {
            if (pos.fret !== 0) return null;
            const x = pos.string * STRING_SPACING;
            return (
              <g key={`open-${pos.string}`}>
                <circle
                  cx={x}
                  cy={-22}
                  r={9}
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                />
              </g>
            );
          })}

          {/* Indicateurs de cordes étouffées (×) */}
          {positions.map((pos) => {
            if (pos.fret !== -1) return null;
            const x = pos.string * STRING_SPACING;
            const size = 8;
            return (
              <g key={`muted-${pos.string}`}>
                <line
                  x1={x - size}
                  y1={-22 - size}
                  x2={x + size}
                  y2={-22 + size}
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
                <line
                  x1={x + size}
                  y1={-22 - size}
                  x2={x - size}
                  y2={-22 + size}
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
              </g>
            );
          })}

          {/* Ligne de barré */}
          {barreChord &&
            barreChord.finger &&
            positions.filter(
              (p) => p.finger === barreChord.finger && p.fret > 0
            ).length >= 3 && (
              <path
                d={`M ${positions
                  .filter((p) => p.finger === barreChord.finger && p.fret > 0)
                  .reduce((min, p) => Math.min(min, p.string), 5) *
                  STRING_SPACING -
                  14} ${(barreChord.fret - startFret) * FRET_HEIGHT + FRET_HEIGHT / 2 - 18}
                   Q ${2.5 * STRING_SPACING} ${(barreChord.fret - startFret) * FRET_HEIGHT + FRET_HEIGHT / 2 - 28}
                   ${positions
                  .filter((p) => p.finger === barreChord.finger && p.fret > 0)
                  .reduce((max, p) => Math.max(max, p.string), 0) *
                  STRING_SPACING +
                  14} ${(barreChord.fret - startFret) * FRET_HEIGHT + FRET_HEIGHT / 2 - 18}`}
                fill="none"
                stroke="#888"
                strokeWidth={2}
                strokeDasharray="4 4"
                opacity={0.6}
              />
            )}

          {/* Positions des doigts avec intervalles */}
          {positions.map((pos) => {
            if (pos.fret <= 0) return null;

            const relativeFret = pos.fret - startFret;
            if (relativeFret < 0 || relativeFret >= NUM_FRETS) return null;

            const x = pos.string * STRING_SPACING;
            const y = relativeFret * FRET_HEIGHT + FRET_HEIGHT / 2;

            const isBarreFinger = barreChord && pos.finger === barreChord.finger;
            const intervalColor = getIntervalColor(pos.interval);
            const intervalLabel = getIntervalLabel(pos.interval);

            return (
              <g key={`${pos.string}-${pos.fret}`}>
                {/* Cercle de la note */}
                <circle
                  cx={x}
                  cy={y}
                  r={isBarreFinger ? 12 : 14}
                  fill="url(#noteFill)"
                  stroke={intervalColor}
                  strokeWidth={2.5}
                  filter="url(#softShadow)"
                />

                {/* Intervalle (au lieu du numéro de doigt) */}
                <text
                  x={x}
                  y={y + 1}
                  fill={intervalColor}
                  fontSize={12}
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {intervalLabel}
                </text>

                {/* Nom de la note en petit au-dessus */}
                {pos.note && (
                  <text
                    x={x}
                    y={y - 20}
                    fill="#888"
                    fontSize={9}
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {pos.note}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* Labels des cordes en bas */}
        <g
          transform={`translate(${MARGIN_LEFT}, ${MARGIN_TOP + FRET_HEIGHT * NUM_FRETS + 22})`}
        >
          {STRING_NAMES.map((name, i) => (
            <text
              key={`string-label-${i}`}
              x={i * STRING_SPACING}
              y={0}
              fill="#555"
              fontSize={13}
              fontWeight="600"
              textAnchor="middle"
            >
              {name}
            </text>
          ))}
        </g>

        {/* Numéros de frettes sur le côté (pour positions hautes) */}
        {startFret > 1 && (
          <g
            transform={`translate(${MARGIN_LEFT + STRING_SPACING * 5 + 12}, ${MARGIN_TOP})`}
          >
            {Array.from({ length: NUM_FRETS }, (_, i) => (
              <text
                key={`fret-num-${i}`}
                x={0}
                y={i * FRET_HEIGHT + FRET_HEIGHT / 2 + 4}
                fill="#555"
                fontSize={11}
                fontWeight="500"
                textAnchor="start"
              >
                {startFret + i}
              </text>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
