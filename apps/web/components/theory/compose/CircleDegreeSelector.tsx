/**
 * ADAGIO - CircleDegreeSelector Component
 * Cercle des degrés harmoniques : sélectionne un degré de la tonalité courante.
 *
 * Charte Fretboard : secteur actif rouge sang, survol rouille ; or réservé
 * aux accents secondaires. Les couleurs d'intervalle restent réservées aux
 * diagrammes et manches, jamais au chrome de l'UI.
 */

'use client';

import { useMemo, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { NoteName } from '@adagio/types';
import {
  DEGREE_COLORS,
  ROMAN_NUMERALS_MAJOR,
  ROMAN_NUMERALS_MINOR,
  getMajorChords,
  getMinorChords,
} from '@adagio/theory';
import type { KeyMode } from '@adagio/theory';

// ============================================================================
// TYPES
// ============================================================================

export interface CircleDegreeSelectorProps {
  /** Tonique actuellement sélectionnée */
  currentKey: NoteName;
  /** Mode actuel ('major' ou 'minor') */
  keyMode: KeyMode;
  /** Degré sélectionné (0-6), null si aucun */
  selectedDegree?: number | null;
  /** Callback lors du clic sur un degré */
  onDegreeSelect: (degreeIndex: number) => void;
}

const ACCENT = '#b84a1a';
const RUST = '#b84a1a';
const HAIRLINE = '#2a2a2a';
const SURFACE = '#000000';
const TEXT_WHITE = '#e0e0e0';
const TEXT_MUTED = '#666666';

const CENTER = 200;
const OUTER_R = 182;
const INNER_R = 96;
const LABEL_R = (OUTER_R + INNER_R) / 2;

// ============================================================================
// UTILITIES
// ============================================================================

/** Arrondi pour éviter les différences serveur/client */
const round = (n: number) => Math.round(n * 100) / 100;

/** Path SVG d'un secteur d'anneau */
function createSegmentPath(index: number, total: number, outerR: number, innerR: number): string {
  const startAngle = (((index * 360) / total - 90) * Math.PI) / 180;
  const endAngle = ((((index + 1) * 360) / total - 90) * Math.PI) / 180;

  const x1 = round(CENTER + outerR * Math.cos(startAngle));
  const y1 = round(CENTER + outerR * Math.sin(startAngle));
  const x2 = round(CENTER + outerR * Math.cos(endAngle));
  const y2 = round(CENTER + outerR * Math.sin(endAngle));
  const x3 = round(CENTER + innerR * Math.cos(endAngle));
  const y3 = round(CENTER + innerR * Math.sin(endAngle));
  const x4 = round(CENTER + innerR * Math.cos(startAngle));
  const y4 = round(CENTER + innerR * Math.sin(startAngle));

  return `M ${x1} ${y1} A ${outerR} ${outerR} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 0 0 ${x4} ${y4} Z`;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function CircleDegreeSelector({
  currentKey,
  keyMode,
  selectedDegree = null,
  onDegreeSelect,
}: CircleDegreeSelectorProps) {
  const degrees = keyMode === 'major' ? ROMAN_NUMERALS_MAJOR : ROMAN_NUMERALS_MINOR;
  const [hoveredDegree, setHoveredDegree] = useState<number | null>(null);

  // Accords diatoniques du mode courant (source unique : package theory)
  const chords = useMemo(
    () => (keyMode === 'major' ? getMajorChords(currentKey) : getMinorChords(currentKey)),
    [currentKey, keyMode]
  );

  const degreeData = degrees.map((degree, index) => ({
    degree,
    chordName: chords[index] ?? '',
    index,
  }));

  const handleKeyDown = (index: number) => (event: KeyboardEvent<SVGPathElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onDegreeSelect(index);
    }
  };

  return (
    <div className="mx-auto w-full" style={{ maxWidth: '26rem' }}>
      <svg
        viewBox="0 0 400 400"
        className="h-auto w-full"
        role="group"
        aria-label="Cercle des degrés harmoniques"
      >
        {degreeData.map(({ degree, chordName, index }) => {
          const totalDegrees = degrees.length;
          const textAngle =
            (((index * 360) / totalDegrees + 180 / totalDegrees - 90) * Math.PI) / 180;

          const textX = round(CENTER + LABEL_R * Math.cos(textAngle));
          const textY = round(CENTER + LABEL_R * Math.sin(textAngle));

          const isActive = selectedDegree === index;
          const isHovered = hoveredDegree === index;

          // Chaque degré porte sa couleur ; le secteur s'allume quand il est actif.
          const degreeColor = DEGREE_COLORS[index] ?? RUST;
          const fill = isActive ? degreeColor : `${degreeColor}${isHovered ? '4d' : '24'}`;
          const labelColor = isActive ? TEXT_WHITE : degreeColor;
          const noteColor = isActive ? TEXT_WHITE : isHovered ? degreeColor : TEXT_MUTED;

          return (
            <g key={degree}>
              <path
                d={createSegmentPath(index, totalDegrees, OUTER_R, INNER_R)}
                fill={fill}
                stroke={HAIRLINE}
                strokeWidth={1}
                role="button"
                tabIndex={0}
                aria-label={`Sélectionner le degré ${degree} (${chordName})`}
                aria-pressed={isActive}
                className="cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b1a1a]"
                onClick={() => onDegreeSelect(index)}
                onKeyDown={handleKeyDown(index)}
                onMouseEnter={() => setHoveredDegree(index)}
                onMouseLeave={() => setHoveredDegree(null)}
              />

              <text
                x={textX}
                y={textY - 7}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={11}
                fontWeight={700}
                letterSpacing="0.08em"
                fill={labelColor}
                style={{ pointerEvents: 'none', textTransform: 'uppercase' }}
              >
                {degree}
              </text>

              <text
                x={textX}
                y={textY + 10}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={13}
                fontWeight={500}
                fill={noteColor}
                style={{ pointerEvents: 'none' }}
              >
                {chordName}
              </text>
            </g>
          );
        })}

        {/* Centre : tonique courante */}
        <circle cx={CENTER} cy={CENTER} r="86" fill={SURFACE} stroke={HAIRLINE} strokeWidth="1" />
        <text
          x={CENTER}
          y={CENTER - 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={30}
          fontWeight={600}
          fill={TEXT_WHITE}
          style={{ pointerEvents: 'none' }}
        >
          {currentKey}
        </text>
        <text
          x={CENTER}
          y={CENTER + 18}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={10}
          fontWeight={700}
          letterSpacing="0.12em"
          fill={ACCENT}
          style={{ pointerEvents: 'none', textTransform: 'uppercase' }}
        >
          {keyMode === 'major' ? 'Majeur' : 'Mineur'}
        </text>
      </svg>
    </div>
  );
}
