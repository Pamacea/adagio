/**
 * ADAGIO - CircleDegreeSelector Component
 * Cercle des degrés harmoniques interactif pour sélectionner la tonique par degré
 *
 * Affiche les 7 degrés (I, ii, iii, IV, V, vi, vii°) autour du cercle
 * Chaque degré est cliquable et change la tonique en conséquence
 */

'use client';

import { useMemo } from 'react';
import type { NoteName, ChordDegree } from '@adagio/types';
import {
  getDegreeNote,
  getRomanDegrees,
  DEGREE_COLORS,
} from '@adagio/theory';

// ============================================================================
// TYPES
// ============================================================================

export interface CircleDegreeSelectorProps {
  /** Tonique actuellement sélectionnée */
  currentKey: NoteName;
  /** Mode actuel ('major' ou 'minor') */
  keyMode: 'major' | 'minor';
  /** Callback lors du clic sur un degré */
  onDegreeClick: (degree: string, newKey: NoteName, newMode: 'major' | 'minor') => void;
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Fonction d'arrondi pour éviter les différences serveur/client
 */
const round = (n: number) => Math.round(n * 100) / 100;

/**
 * Calcule la couleur de contraste pour un texte sur fond coloré
 */
function getContrastTextColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

/**
 * Qualité de l'accord pour un degré donné
 */
function getChordQuality(degree: string, mode: 'major' | 'minor'): string {
  const majorQualities: Record<string, string> = {
    'I': '', 'II': 'm', 'III': 'm', 'IV': '', 'V': '', 'VI': 'm', 'VII': 'dim'
  };
  const minorQualities: Record<string, string> = {
    'I': 'm', 'II': 'dim', 'III': '', 'IV': 'm', 'V': 'm', 'VI': '', 'VII': ''
  };

  return mode === 'major' ? majorQualities[degree] || '' : minorQualities[degree] || 'm';
}

/**
 * Génère le path SVG pour un segment du cercle
 */
function createSegmentPath(index: number, total: number, outerR: number, innerR: number): string {
  const startAngle = (index * 360 / total - 90) * Math.PI / 180;
  const endAngle = ((index + 1) * 360 / total - 90) * Math.PI / 180;

  const x1 = round(200 + outerR * Math.cos(startAngle));
  const y1 = round(200 + outerR * Math.sin(startAngle));
  const x2 = round(200 + outerR * Math.cos(endAngle));
  const y2 = round(200 + outerR * Math.sin(endAngle));
  const x3 = round(200 + innerR * Math.cos(endAngle));
  const y3 = round(200 + innerR * Math.sin(endAngle));
  const x4 = round(200 + innerR * Math.cos(startAngle));
  const y4 = round(200 + innerR * Math.sin(startAngle));

  return `M ${x1} ${y1} A ${outerR} ${outerR} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 0 0 ${x4} ${y4} Z`;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function CircleDegreeSelector({
  currentKey,
  keyMode,
  onDegreeClick,
}: CircleDegreeSelectorProps) {
  // Récupérer les degrés romains selon le mode
  const degrees = useMemo(() => getRomanDegrees(keyMode), [keyMode]);

  // Calculer les données pour chaque degré
  const degreeData = useMemo(() => {
    return degrees.map((degree, index) => {
      // Cast sécurisé vers ChordDegree pour getDegreeNote
      const chordDegree = degree.toUpperCase() as ChordDegree;
      const note = getDegreeNote(currentKey, chordDegree, keyMode);
      const quality = getChordQuality(degree, keyMode);
      // Récupérer la couleur avec fallback explicite
      const color: string = DEGREE_COLORS[index] ?? DEGREE_COLORS[0]!;
      const chordName = `${note}${quality}`;

      // Déterminer le nouveau mode si on clique sur ce degré
      // I, IV, V → gardent le mode actuel
      // ii, iii, vi → passent en mineur
      // vii° → passe en mineur (ou garde selon contexte)
      let newMode: 'major' | 'minor' = keyMode;
      if (['ii', 'iii', 'vi', 'vii'].includes(degree.toLowerCase())) {
        newMode = 'minor';
      }

      return {
        degree,
        note,
        quality,
        chordName,
        color,
        newMode,
        index,
      };
    });
  }, [currentKey, keyMode, degrees]);

  const tonicColor = DEGREE_COLORS[0];

  return (
    <div className="relative aspect-square max-w-md mx-auto my-6">
      <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl">
        {degreeData.map((data) => {
          const { degree, note, chordName, color, newMode, index } = data;
          const totalDegrees = degrees.length;

          // Position du texte
          const textAngle = (index * 360 / totalDegrees + 180 / totalDegrees - 90) * Math.PI / 180;
          const outerR = 140;
          const innerR = 100;

          const textX = round(200 + ((outerR + innerR) / 2) * Math.cos(textAngle));
          const textY = round(200 + ((outerR + innerR) / 2) * Math.sin(textAngle));

          // Vérifier si c'est le degré actif (tonique)
          const isActive = degree === 'I';
          const strokeWidth = isActive ? 3 : 1.5;
          const strokeColor = isActive ? tonicColor : '#0a0a0a';

          return (
            <g key={degree}>
              {/* Segment du degré */}
              <path
                d={createSegmentPath(index, totalDegrees, outerR, innerR)}
                fill={color}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                style={{ cursor: 'pointer', transition: 'all 0.2s ease-in-out' }}
                onClick={() => onDegreeClick(degree, note, newMode)}
                className="hover:opacity-80"
              />

              {/* Symbole du degré (romain) */}
              <text
                x={textX}
                y={textY - 8}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xl font-bold"
                fill={getContrastTextColor(color)}
                style={{ pointerEvents: 'none', fontFamily: 'serif' }}
              >
                {degree}
              </text>

              {/* Nom de l'accord */}
              <text
                x={textX}
                y={textY + 12}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm font-semibold"
                fill={getContrastTextColor(color)}
                style={{ pointerEvents: 'none' }}
              >
                {chordName}
              </text>
            </g>
          );
        })}

        {/* Cercle central - affiche la tonique actuelle */}
        <circle cx="200" cy="200" r="85" fill="#0a0a0a" stroke={tonicColor} strokeWidth="4" />
        <text
          x="200"
          y="190"
          textAnchor="middle"
          className="text-3xl font-metal font-bold"
          fill="#FFF"
          style={{ pointerEvents: 'none' }}
        >
          {currentKey}
        </text>
        <text
          x="200"
          y="215"
          textAnchor="middle"
          className="text-sm font-bold tracking-wider"
          fill={tonicColor}
          style={{ pointerEvents: 'none', textTransform: 'uppercase' }}
        >
          {keyMode === 'major' ? 'Majeur' : 'Mineur'}
        </text>
      </svg>

      {/* Légende des émotions associées aux degrés */}
      <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full" style={{ background: DEGREE_COLORS[0] }} />
          Tonique
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full" style={{ background: DEGREE_COLORS[4] }} />
          Dominante
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full" style={{ background: DEGREE_COLORS[6] }} />
          Sensible
        </span>
      </div>
    </div>
  );
}
