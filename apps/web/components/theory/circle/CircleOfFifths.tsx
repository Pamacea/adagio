/**
 * ADAGIO - CircleOfFifths Component
 * Cercle des quintes interactif avec 3 anneaux (majeur, mineur, diminué)
 */

'use client';

import type { NoteName } from '@adagio/types';
import {
  CIRCLE_OF_FIFTHS,
  NOTE_POSITIONS,
  MINOR_MAP,
  DIM_MAP,
  DEGREE_COLORS,
  OFF_SCALE_COLOR,
  ENHARMONIC_CANONICAL,
} from '@adagio/theory';

// Re-export for backward compatibility
export { CIRCLE_OF_FIFTHS, NOTE_POSITIONS, MINOR_MAP, DIM_MAP, DEGREE_COLORS, OFF_SCALE_COLOR };

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Fonction d'arrondi pour éviter les différences serveur/client (hydration mismatch)
 */
const round = (n: number) => Math.round(n * 100) / 100;

/**
 * Génère le path SVG pour un segment du cercle
 * @param index - Index du segment (0-11)
 * @param outerR - Rayon extérieur
 * @param innerR - Rayon intérieur
 */
export function createSegmentPath(index: number, outerR: number, innerR: number): string {
  const start = (index * 30 - 90) * Math.PI / 180;
  const end = ((index + 1) * 30 - 90) * Math.PI / 180;

  const x1 = round(200 + outerR * Math.cos(start));
  const y1 = round(200 + outerR * Math.sin(start));
  const x2 = round(200 + outerR * Math.cos(end));
  const y2 = round(200 + outerR * Math.sin(end));
  const x3 = round(200 + innerR * Math.cos(end));
  const y3 = round(200 + innerR * Math.sin(end));
  const x4 = round(200 + innerR * Math.cos(start));
  const y4 = round(200 + innerR * Math.sin(start));

  return `M ${x1} ${y1} A ${outerR} ${outerR} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 0 0 ${x4} ${y4} Z`;
}

/**
 * Calcule la couleur de contraste (noir ou blanc) pour un texte sur fond coloré
 */
export function getContrastTextColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

/**
 * Normalise un accord pour comparaison enharmonique
 */
function normalizeChord(chord: string): string {
  if (!chord) return chord;

  const withDim = chord.replace('°', 'dim');

  if (ENHARMONIC_CANONICAL[withDim]) {
    return ENHARMONIC_CANONICAL[withDim];
  }

  if (withDim.endsWith('dim')) {
    const base = withDim.slice(0, -3);
    const normalizedBase = ENHARMONIC_CANONICAL[base] || base;
    return normalizedBase + 'dim';
  }

  if (withDim.endsWith('m')) {
    const base = withDim.slice(0, -1);
    const normalizedBase = ENHARMONIC_CANONICAL[base] || base;
    return normalizedBase + 'm';
  }

  return ENHARMONIC_CANONICAL[withDim] || withDim;
}

/**
 * Vérifie si un accord est diatonique (avec comparaison enharmonique)
 */
function isChordDiatonic(chord: string, diatonicChords: string[]): boolean {
  if (!chord) return false;
  if (diatonicChords.includes(chord)) return true;

  const normalized = normalizeChord(chord);
  return diatonicChords.some(c => normalizeChord(c) === normalized);
}

/**
 * Obtenir l'index d'un accord dans la liste (avec comparaison enharmonique)
 */
function getChordPosition(chord: string, diatonicChords: string[]): number {
  if (!chord) return -1;

  const directIndex = diatonicChords.indexOf(chord);
  if (directIndex >= 0) return directIndex;

  const normalized = normalizeChord(chord);
  for (let i = 0; i < diatonicChords.length; i++) {
    if (normalizeChord(diatonicChords[i]!) === normalized) {
      return i;
    }
  }
  return -1;
}

// ============================================================================
// TYPES
// ============================================================================

export interface CircleOfFifthsProps {
  /** Tonique actuellement sélectionnée */
  selectedKey: string;
  /** Callback lors du changement de tonique */
  onKeyChange: (key: string) => void;
  /** Liste des accords diatoniques de la tonalité actuelle */
  diatonicChords: string[];
  /** Si la tonalité est mineure */
  isMinor?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function CircleOfFifths({
  selectedKey,
  onKeyChange,
  diatonicChords,
  isMinor = false,
}: CircleOfFifthsProps) {
  // Couleur de la tonique pour le cercle central
  const tonicColor = DEGREE_COLORS[0];

  return (
    <div className="relative aspect-square max-w-md mx-auto my-6">
      <svg viewBox="0 0 400 400" className="w-full h-full">
        {CIRCLE_OF_FIFTHS.map((note, i) => {
          // Vérifier si chaque ACCORD est diatonique
          const majorChord = note;
          const minorChord = MINOR_MAP[note] || 'Cm';
          const dimChord = (DIM_MAP[note] || 'B°').replace('°', 'dim');

          // Vérifier si l'accord est diatonique (AVEC comparaison enharmonique)
          const isMajorDiatonic = isChordDiatonic(majorChord, diatonicChords);
          const isMinorDiatonic = isChordDiatonic(minorChord, diatonicChords);
          const isDimDiatonic = isChordDiatonic(dimChord, diatonicChords);

          // Trouver la position de couleur
          const majorPosition = getChordPosition(majorChord, diatonicChords);
          const minorPosition = getChordPosition(minorChord, diatonicChords);
          const dimPosition = getChordPosition(dimChord, diatonicChords);

          // Couleurs spécifiques pour chaque segment
          const majorColor = majorPosition >= 0 ? (DEGREE_COLORS[majorPosition] ?? OFF_SCALE_COLOR) : OFF_SCALE_COLOR;
          const minorColor = minorPosition >= 0 ? (DEGREE_COLORS[minorPosition] ?? OFF_SCALE_COLOR) : OFF_SCALE_COLOR;
          const dimColor = dimPosition >= 0 ? (DEGREE_COLORS[dimPosition] ?? OFF_SCALE_COLOR) : OFF_SCALE_COLOR;

          const textAngle = (i * 30 + 15 - 90) * Math.PI / 180;
          const outerR = 162, midR = 122, innerR = 82;

          const outerX = round(200 + outerR * Math.cos(textAngle));
          const outerY = round(200 + outerR * Math.sin(textAngle));
          const midX = round(200 + midR * Math.cos(textAngle));
          const midY = round(200 + midR * Math.sin(textAngle));
          const innerX = round(200 + innerR * Math.cos(textAngle));
          const innerY = round(200 + innerR * Math.sin(textAngle));

          // Note sélectionnée - bordure accentuée
          const isSelected = note === selectedKey;
          const strokeWidth = isSelected ? 3 : 1.5;
          const strokeColor = isSelected ? tonicColor : '#0a0a0a';

          return (
            <g key={note}>
              {/* Segment extérieur - Majeur */}
              <path
                d={createSegmentPath(i, 180, 145)}
                fill={majorColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => onKeyChange(note)}
                opacity={isMajorDiatonic ? 1 : 0.15}
              />

              {/* Segment du milieu - Mineur */}
              <path
                d={createSegmentPath(i, 140, 105)}
                fill={minorColor}
                stroke="#0a0a0a"
                strokeWidth="1"
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => onKeyChange(MINOR_MAP[note]!)}
                opacity={isMinorDiatonic ? 0.8 : 0.15}
              />

              {/* Segment intérieur - Diminué */}
              <path
                d={createSegmentPath(i, 100, 65)}
                fill={dimColor}
                stroke="#0a0a0a"
                strokeWidth="1"
                opacity={isDimDiatonic ? 0.6 : 0.15}
              />

              {/* Texte extérieur - Major */}
              <text
                x={outerX}
                y={outerY + 4}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm font-bold"
                fill={isMajorDiatonic ? getContrastTextColor(majorColor) : '#666'}
                style={{ pointerEvents: 'none', fontWeight: isSelected ? '900' : '400' }}
              >
                {note}
              </text>

              {/* Texte milieu - Minor */}
              <text
                x={midX}
                y={midY + 3}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-bold"
                fill={isMinorDiatonic ? getContrastTextColor(minorColor) : '#888'}
                style={{ pointerEvents: 'none', opacity: isMinorDiatonic ? 1 : 0.3 }}
              >
                {MINOR_MAP[note]}
              </text>

              {/* Texte intérieur - Diminué */}
              <text
                x={innerX}
                y={innerY + 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[10px] font-bold"
                fill={isDimDiatonic ? getContrastTextColor(dimColor) : '#888'}
                style={{ pointerEvents: 'none', opacity: isDimDiatonic ? 0.8 : 0.3 }}
              >
                {DIM_MAP[note]}
              </text>
            </g>
          );
        })}

        {/* Cercle central */}
        <circle cx="200" cy="200" r="60" fill="#0a0a0a" stroke={tonicColor} strokeWidth="4" />
        <text
          x="200"
          y="190"
          textAnchor="middle"
          className="text-2xl font-metal font-bold"
          fill="#FFF"
          style={{ pointerEvents: 'none' }}
        >
          {selectedKey}
        </text>
        <text
          x="200"
          y="212"
          textAnchor="middle"
          className="text-xs font-bold"
          fill={tonicColor}
          style={{ pointerEvents: 'none' }}
        >
          {isMinor ? 'MINEUR' : 'MAJEUR'}
        </text>
      </svg>
    </div>
  );
}
