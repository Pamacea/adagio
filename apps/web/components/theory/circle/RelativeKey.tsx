/**
 * ADAGIO - RelativeKey Component
 * Carte affichant la tonalité relative (majeur ↔ mineur)
 */

'use client';

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

export function RelativeKey({ relativeKey, isMinor = false, majorKey = 'C' }: RelativeKeyProps) {
  return (
    <section className="panel p-5">
      <p className="field-label">Tonalité relative {isMinor ? 'majeure' : 'mineure'}</p>
      <p className="font-metal text-2xl tracking-tighter text-white">{relativeKey}</p>
      <p className="mt-2 text-sm leading-relaxed text-gray">
        {isMinor
          ? `Mêmes notes que ${majorKey} majeur`
          : `Mêmes notes que ${relativeKey} (mineur)`}
      </p>
    </section>
  );
}
