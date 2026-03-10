/**
 * ADAGIO - RelativeKey Component
 * Carte affichant la tonalité relative (majeur ↔ mineur)
 */

'use client';

import { DEGREE_COLORS } from './CircleOfFifths';

// ============================================================================
// TYPES
// ============================================================================

export interface RelativeKeyProps {
  /** Tonalité relative (ex: "Am" si on est en C majeur) */
  relativeKey: string;
  /** Si la tonalité actuelle est mineure */
  isMinor?: boolean;
  /** Tonalité majeure associée */
  majorKey?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function RelativeKey({
  relativeKey,
  isMinor = false,
  majorKey = 'C',
}: RelativeKeyProps) {
  // Couleur dynamique basée sur le type
  const color = isMinor ? DEGREE_COLORS[0] : DEGREE_COLORS[5];

  return (
    <div className="section-frame p-6 text-center">
      <p className="text-xs text-gray uppercase mb-2">
        Relative {isMinor ? 'Majeure' : 'Mineure'}
      </p>
      <p
        className="text-3xl font-metal text-white"
        style={{ color }}
      >
        {relativeKey}
      </p>
      <p className="text-sm text-gray mt-2">
        {isMinor
          ? `Partage les mêmes notes que ${majorKey} Majeur`
          : `Partage les mêmes notes que ${relativeKey} Mineur`
        }
      </p>
    </div>
  );
}
