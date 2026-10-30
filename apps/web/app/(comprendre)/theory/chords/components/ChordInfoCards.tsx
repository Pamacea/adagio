/**
 * ChordInfoCards - Section de détail de l'accord (panneau droit).
 */

'use client';

import { cn } from '@adagio/ui';

export interface ChordInfoCardsProps {
  notesList: string[];
  tension: 'stable' | 'tense' | 'dissonant' | 'ambiguous';
  voicingsCount: number;
  fretRange: string;
  className?: string;
}

const TENSION_LABELS = {
  stable: 'stable',
  tense: 'tendue',
  dissonant: 'dissonante',
  ambiguous: 'ambiguë',
} as const;

const ROW = 'flex items-baseline justify-between gap-3 text-xs';
const LABEL = 'shrink-0 text-gray/70';
const VALUE = 'min-w-0 truncate text-right text-white';

export function ChordInfoCards({
  notesList,
  tension,
  voicingsCount,
  fretRange,
  className,
}: ChordInfoCardsProps) {
  return (
    <section className={cn('panel p-3', className)}>
      <h3 className="field-label mb-0 text-gold">Détail</h3>
      <dl className="mt-2 space-y-1.5">
        <div className={ROW}>
          <dt className={LABEL}>Notes</dt>
          <dd className={cn(VALUE, 'text-gold')}>{notesList.join(' · ')}</dd>
        </div>
        <div className={ROW}>
          <dt className={LABEL}>Tension</dt>
          <dd className={VALUE}>{TENSION_LABELS[tension]}</dd>
        </div>
        <div className={ROW}>
          <dt className={LABEL}>Formes</dt>
          <dd className={VALUE}>{voicingsCount}</dd>
        </div>
        <div className={ROW}>
          <dt className={LABEL}>Position</dt>
          <dd className={VALUE}>{fretRange}</dd>
        </div>
      </dl>
    </section>
  );
}
