/**
 * ADAGIO - ChordDisplay Component
 * Affichage des 7 accords diatoniques avec cercles colorés et badges de qualité
 */

'use client';

import { DEGREE_COLORS, OFF_SCALE_COLOR, getContrastTextColor } from './CircleOfFifths';

// ============================================================================
// TYPES
// ============================================================================

export interface ChordDisplayProps {
  /** Liste des 7 accords diatoniques */
  chords: string[];
  /** Couleurs personnalisées pour les degrés (optionnel) */
  degreeColors?: string[];
  /** Label pour la section */
  label?: string;
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Détermine la qualité d'un accord (majeur, mineur, diminué)
 */
export function getChordQuality(chord: string): 'major' | 'minor' | 'diminished' {
  if (!chord) return 'major';
  if (chord.endsWith('dim') || chord.endsWith('°')) return 'diminished';
  if (chord.endsWith('m')) return 'minor';
  return 'major';
}

/**
 * Obtient la couleur associée à une qualité d'accord
 */
export function getChordQualityColor(quality: 'major' | 'minor' | 'diminished'): string {
  if (quality === 'major') return '#F59E0B';    // Gold
  if (quality === 'minor') return '#3B82F6';    // Bleu
  return '#64748B';                            // Gris foncé
}

/**
 * Symbole pour la qualité d'accord
 */
export function getChordQualitySymbol(quality: 'major' | 'minor' | 'diminished'): string {
  if (quality === 'major') return 'M';
  if (quality === 'minor') return 'm';
  return '°';
}

// ============================================================================
// COMPONENT
// ============================================================================

export function ChordDisplay({
  chords,
  degreeColors = DEGREE_COLORS,
  label,
}: ChordDisplayProps) {
  return (
    <div className="my-8">
      {label && (
        <p className="text-sm text-gray uppercase mb-2 text-center">
          {label}
        </p>
      )}
      <div className="flex justify-center items-center gap-3 flex-wrap">
        {chords.map((chord, i) => {
          if (!chord) return null;

          const color = degreeColors[i] ?? OFF_SCALE_COLOR;
          const quality = getChordQuality(chord);
          const qualityColor = getChordQualityColor(quality);
          const textColor = getContrastTextColor(color);
          const qualityTextColor = getContrastTextColor(qualityColor);

          return (
            <div key={i} className="flex flex-col items-center">
              <div className="relative">
                {/* Cercle principal avec le degré */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-black border-2 shadow-lg"
                  style={{
                    backgroundColor: color,
                    color: textColor,
                    borderColor: qualityColor,
                  }}
                >
                  {i + 1}
                </div>

                {/* Badge qualité */}
                <div
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-black"
                  style={{
                    backgroundColor: qualityColor,
                    color: qualityTextColor,
                  }}
                >
                  {getChordQualitySymbol(quality)}
                </div>
              </div>

              {/* Nom de l'accord */}
              <span className="text-sm text-white mt-2 font-bold">{chord}</span>
            </div>
          );
        })}
      </div>

      {/* Légende */}
      <div className="flex justify-center items-center gap-6 mt-6 text-xs text-gray">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: DEGREE_COLORS[0] }}></div>
          <span>1 (Tonique)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: DEGREE_COLORS[4] }}></div>
          <span>5 (Dominante)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: DEGREE_COLORS[3] }}></div>
          <span>4 (Sous-dominante)</span>
        </div>
      </div>
    </div>
  );
}
