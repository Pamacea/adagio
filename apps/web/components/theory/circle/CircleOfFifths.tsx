/**
 * ADAGIO - CircleOfFifths Component
 * Cercle des quintes interactif avec 3 anneaux (majeur, mineur, diminué)
 */

'use client';

import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import {
  CIRCLE_OF_FIFTHS,
  NOTE_POSITIONS,
  MINOR_MAP,
  DIM_MAP,
  DEGREE_COLORS,
  OFF_SCALE_COLOR,
  ENHARMONIC_CANONICAL,
  parseChord,
} from '@adagio/theory';

// Re-export for backward compatibility
export { CIRCLE_OF_FIFTHS, NOTE_POSITIONS, MINOR_MAP, DIM_MAP, DEGREE_COLORS, OFF_SCALE_COLOR };

// Charte Adagio : fonds noirs, sélection blood, contour acier.
const OFF_RING_FILL = 'var(--color-abyss)';
const OFF_RING_TEXT = 'var(--color-gray)';
const SELECTED_FILL = '#8b1a1a';
const SELECTED_TEXT = 'var(--color-white)';
const SEGMENT_STROKE = 'var(--color-steel-warm)';
const SELECTED_STROKE = '#8b1a1a';

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
  const start = ((index * 30 - 90) * Math.PI) / 180;
  const end = (((index + 1) * 30 - 90) * Math.PI) / 180;

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
  return luminance > 0.5 ? 'var(--color-abyss)' : 'var(--color-white)';
}

/** Famille d'un accord : l'étagement (7, 9, m7b5…) ne change pas le degré. */
function qualityFamily(quality: string): 'major' | 'minor' | 'dim' {
  if (quality.includes('dim') || quality.includes('°') || quality.includes('m7b5')) return 'dim';
  if (quality.startsWith('m') && !quality.startsWith('maj')) return 'minor';
  return 'major';
}

/**
 * Même degré harmonique : même racine (enharmonique) et même famille.
 * Ex. « G7 » ≡ « G », « Bm7b5 » ≡ « B° ».
 */
function isSameDegreeChord(a: string, b: string): boolean {
  const parsedA = parseChord(a);
  const parsedB = parseChord(b);
  if (!parsedA || !parsedB) return a === b;

  const rootA = ENHARMONIC_CANONICAL[parsedA.root] ?? parsedA.root;
  const rootB = ENHARMONIC_CANONICAL[parsedB.root] ?? parsedB.root;
  return rootA === rootB && qualityFamily(parsedA.quality) === qualityFamily(parsedB.quality);
}

/**
 * Position (0 = degré I) de l'accord dans la tonalité, -1 si hors gamme.
 */
function getChordPosition(chord: string, diatonicChords: string[]): number {
  if (!chord) return -1;
  return diatonicChords.findIndex((diatonic) => isSameDegreeChord(chord, diatonic));
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
  /** Masque la légende : utile quand le cercle est un simple sélecteur */
  compact?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function CircleOfFifths({
  selectedKey,
  onKeyChange,
  diatonicChords,
  compact = false,
}: CircleOfFifthsProps) {
  // Contrat unique : `selectedKey` porte l'accord complet (« C » ou « Am »).
  const isMinor = selectedKey.endsWith('m');
  // Accessibilité clavier pour les segments cliquables
  const handleSegmentKeyDown = (key: string) => (event: ReactKeyboardEvent<SVGPathElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onKeyChange(key);
    }
  };

  return (
    <div className="mx-auto w-full" style={{ maxWidth: '36rem' }}>
      <svg
        viewBox="0 0 400 400"
        className="w-full h-auto"
        role="group"
        aria-label="Cercle des quintes interactif"
      >
        {CIRCLE_OF_FIFTHS.map((note, i) => {
          // Vérifier si chaque ACCORD est diatonique
          const majorChord = note;
          const minorChord = MINOR_MAP[note] || 'Cm';
          const dimChord = (DIM_MAP[note] || 'B°').replace('°', 'dim');

          // Couleur du degré (I → VII) pour les segments diatoniques
          const majorPosition = getChordPosition(majorChord, diatonicChords);
          const minorPosition = getChordPosition(minorChord, diatonicChords);
          const dimPosition = getChordPosition(dimChord, diatonicChords);

          const majorFill =
            majorPosition >= 0 ? (DEGREE_COLORS[majorPosition] ?? OFF_SCALE_COLOR) : OFF_RING_FILL;
          const minorFill =
            minorPosition >= 0 ? (DEGREE_COLORS[minorPosition] ?? OFF_SCALE_COLOR) : OFF_RING_FILL;
          const dimFill =
            dimPosition >= 0 ? (DEGREE_COLORS[dimPosition] ?? OFF_SCALE_COLOR) : OFF_RING_FILL;
          const majorText = majorPosition >= 0 ? getContrastTextColor(majorFill) : OFF_RING_TEXT;
          const minorText = minorPosition >= 0 ? getContrastTextColor(minorFill) : OFF_RING_TEXT;
          const dimText = dimPosition >= 0 ? getContrastTextColor(dimFill) : OFF_RING_TEXT;

          const textAngle = ((i * 30 + 15 - 90) * Math.PI) / 180;
          const outerR = 162,
            midR = 122,
            innerR = 82;

          const outerX = round(200 + outerR * Math.cos(textAngle));
          const outerY = round(200 + outerR * Math.sin(textAngle));
          const midX = round(200 + midR * Math.cos(textAngle));
          const midY = round(200 + midR * Math.sin(textAngle));
          const innerX = round(200 + innerR * Math.cos(textAngle));
          const innerY = round(200 + innerR * Math.sin(textAngle));

          // Mise en évidence de la tonique sélectionnée (majeur ET mineur)
          const isMajorSelected = note === selectedKey;
          const isMinorSelected = MINOR_MAP[note] === selectedKey;

          return (
            <g key={note}>
              {/* Segment extérieur - Majeur */}
              <path
                d={createSegmentPath(i, 180, 145)}
                fill={isMajorSelected ? SELECTED_FILL : majorFill}
                stroke={isMajorSelected ? SELECTED_STROKE : SEGMENT_STROKE}
                strokeWidth={1.5}
                opacity={1}
                role="button"
                tabIndex={0}
                aria-label={`Sélectionner la tonalité de ${note}`}
                aria-pressed={isMajorSelected}
                className="cursor-pointer outline-none transition-colors hover:stroke-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                onClick={() => onKeyChange(note)}
                onKeyDown={handleSegmentKeyDown(note)}
              />

              {/* Segment du milieu - Mineur */}
              <path
                d={createSegmentPath(i, 140, 105)}
                fill={isMinorSelected ? SELECTED_FILL : minorFill}
                stroke={isMinorSelected ? SELECTED_STROKE : SEGMENT_STROKE}
                strokeWidth={1.5}
                opacity={1}
                role="button"
                tabIndex={0}
                aria-label={`Sélectionner la tonalité de ${minorChord}`}
                aria-pressed={isMinorSelected}
                className="cursor-pointer outline-none transition-colors hover:stroke-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                onClick={() => onKeyChange(minorChord)}
                onKeyDown={handleSegmentKeyDown(minorChord)}
              />

              {/* Segment intérieur - Diminué */}
              <path
                d={createSegmentPath(i, 100, 65)}
                fill={dimFill}
                stroke={SEGMENT_STROKE}
                strokeWidth={1.5}
                opacity={1}
              />

              {/* Texte extérieur - Major */}
              <text
                x={outerX}
                y={outerY + 4}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={14}
                fontWeight={isMajorSelected ? 600 : 500}
                fill={isMajorSelected ? SELECTED_TEXT : majorText}
                style={{ pointerEvents: 'none' }}
              >
                {note}
              </text>

              {/* Texte milieu - Minor */}
              <text
                x={midX}
                y={midY + 3}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={12}
                fontWeight={isMinorSelected ? 600 : 500}
                fill={isMinorSelected ? SELECTED_TEXT : minorText}
                style={{ pointerEvents: 'none' }}
              >
                {MINOR_MAP[note]}
              </text>

              {/* Texte intérieur - Diminué */}
              <text
                x={innerX}
                y={innerY + 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={12}
                fontWeight={500}
                fill={dimText}
                style={{ pointerEvents: 'none' }}
              >
                {DIM_MAP[note]}
              </text>
            </g>
          );
        })}

        {/* Cercle central */}
        <circle
          cx="200"
          cy="200"
          r="60"
          fill="var(--color-abyss)"
          stroke="var(--color-steel-warm)"
          strokeWidth="1"
        />
        <text
          x="200"
          y="190"
          textAnchor="middle"
          fontSize={30}
          fontWeight={600}
          fill="#8b1a1a"
          style={{ pointerEvents: 'none' }}
        >
          {selectedKey}
        </text>
        <text
          x="200"
          y="214"
          textAnchor="middle"
          fontSize={11}
          fontWeight={500}
          letterSpacing="0.5"
          fill="var(--color-gray)"
          style={{ pointerEvents: 'none' }}
        >
          {isMinor ? 'mineur' : 'majeur'}
        </text>
      </svg>

      {/* Légende */}
      {!compact && (
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray">
        <span className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded border border-steelwarm bg-steelwarm"
            aria-hidden="true"
          />
          Couleur = degré
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded border border-steelwarm bg-abyss" aria-hidden="true" />
          Hors gamme
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 bg-amber-400" aria-hidden="true" />
          Sélection
        </span>
      </div>
      )}
    </div>
  );
}
