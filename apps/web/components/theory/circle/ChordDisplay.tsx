/**
 * ADAGIO - ChordDisplay Component
 * Affichage typographique des 7 accords diatoniques
 */

'use client';

// ============================================================================
// TYPES
// ============================================================================

export interface ChordDisplayProps {
  /** Liste des 7 accords diatoniques */
  chords: string[];
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
  if (quality === 'major') return 'var(--color-gold)';
  if (quality === 'minor') return 'var(--color-ember)';
  return 'var(--color-rust)';
}

/**
 * Symbole pour la qualité d'accord
 */
export function getChordQualitySymbol(quality: 'major' | 'minor' | 'diminished'): string {
  if (quality === 'major') return 'M';
  if (quality === 'minor') return 'm';
  return '°';
}

const DEGREE_ROMANS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'] as const;

const QUALITY_LABELS: Record<'major' | 'minor' | 'diminished', string> = {
  major: 'Majeur',
  minor: 'Mineur',
  diminished: 'Diminué',
};

/**
 * Degré romain : majuscule pour les accords majeurs, minuscule sinon,
 * avec ° pour les accords diminués (I, ii, iii, IV, V, vi, vii°).
 */
function getDegreeRoman(index: number, quality: 'major' | 'minor' | 'diminished'): string {
  const base = DEGREE_ROMANS[index] ?? `${index + 1}`;
  if (quality === 'major') return base;
  if (quality === 'diminished') return `${base.toLowerCase()}°`;
  return base.toLowerCase();
}

// ============================================================================
// COMPONENT
// ============================================================================

export function ChordDisplay({ chords, label }: ChordDisplayProps) {
  return (
    <section aria-label={label ?? 'Accords diatoniques'} className="panel p-5">
      {label && (
        <h2 className="font-metal text-sm uppercase tracking-tighter text-white">{label}</h2>
      )}

      <ul className="mt-3 divide-y divide-steelwarm">
        {chords.map((chord, i) => {
          if (!chord) return null;

          const quality = getChordQuality(chord);

          return (
            <li key={`${chord}-${i}`} className="flex items-baseline gap-4 py-2.5">
              {/* Degré romain discret */}
              <span className="w-7 shrink-0 font-mono text-xs text-gray">
                {getDegreeRoman(i, quality)}
              </span>

              {/* Nom de l'accord + qualité */}
              <span className="min-w-0 flex-1 text-[15px] font-medium text-white">{chord}</span>
              <span className="shrink-0 text-xs text-gray">{QUALITY_LABELS[quality]}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
