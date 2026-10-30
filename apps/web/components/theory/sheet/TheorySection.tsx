/**
 * ADAGIO - TheorySection
 * Carte de section numérotée partagée par les pages théorie (Harmonie, Rythme).
 */

import type { ReactNode } from 'react';

interface TheorySectionProps {
  id: string;
  index: string;
  title: string;
  intro: string;
  children: ReactNode;
}

export function TheorySection({ id, index, title, intro, children }: TheorySectionProps) {
  return (
    <section id={id} className="panel scroll-mt-24 p-6">
      <div className="mb-6 flex items-baseline gap-4">
        <span aria-hidden="true" className="font-mono text-xs text-amber-400">
          {index}
        </span>
        <div>
          <h2 className="text-xl font-metal uppercase tracking-tighter text-white sm:text-2xl">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray">{intro}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
