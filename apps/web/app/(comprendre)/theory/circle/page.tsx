/**
 * ADAGIO - Theory/Circle Page (Refactored)
 * Cercle des quintes - accords diatoniques colorés par position
 *
 * Utilise des composants modulaires pour une architecture propre
 */

'use client';

import { useState } from 'react';
import { MetalNav, MetalFooter } from '@/components';
import { HelpButton, HelpTooltip } from '@/components/HelpProvider';
import { CircleOfFifths, ChordDisplay, RelativeKey } from '@/components/theory/circle';
import { useCircleState } from '@/features/theory/hooks';

export default function CirclePage() {
  const [selectedKey, setSelectedKey] = useState<string>('C');

  // Données recalculées quand la tonique change
  const circleData = useCircleState({ initialKey: selectedKey }).data;

  return (
    <div className="min-h-screen flex flex-col bg-abyss font-sans">
      <MetalNav />

      <main className="flex-1 px-5 pb-20 pt-14 mt-16 sm:px-6">
        <div className="mx-auto" style={{ maxWidth: '72rem' }}>
          {/* En-tête */}
          <header className="mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-gray">Théorie</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-metal uppercase tracking-tighter text-white lg:text-5xl">
                Cercle des quintes
              </h1>
              <HelpTooltip topicId="circle.fifths">
                <HelpButton topicId="circle.fifths" useModal size="md" variant="subtle" />
              </HelpTooltip>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray" style={{ maxWidth: '44rem' }}>
              Sélectionnez une tonalité pour visualiser sa gamme, ses sept accords diatoniques et sa
              tonalité relative.
            </p>
          </header>

          {/* Cercle à gauche, synthèse à droite */}
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
            <section aria-label="Cercle des quintes" className="panel bg-raised p-4 sm:p-6">
              <CircleOfFifths
                selectedKey={selectedKey}
                onKeyChange={setSelectedKey}
                diatonicChords={circleData.chords}
              />
            </section>

            <aside className="space-y-4">
              {/* Tonalité courante */}
              <section className="panel p-5">
                <p className="field-label">Tonalité actuelle</p>
                <div className="flex items-baseline gap-3">
                  <span className="font-metal text-4xl tracking-tighter text-white">
                    {selectedKey}
                  </span>
                  <span className="text-sm text-gray">
                    {circleData.isMinor ? 'mineur' : 'majeur'}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray">
                  {circleData.isMinor
                    ? `Gamme mineure naturelle — relative de ${circleData.majorKey} majeur.`
                    : `Gamme majeure — relative mineure ${circleData.relativeKey}.`}
                </p>
              </section>

              {/* Accords diatoniques */}
              <ChordDisplay chords={circleData.chords} label="Accords diatoniques" />

              {/* Tonalité relative */}
              <RelativeKey
                relativeKey={circleData.relativeKey}
                isMinor={circleData.isMinor}
                majorKey={circleData.majorKey}
              />
            </aside>
          </div>
        </div>
      </main>

      <MetalFooter />
    </div>
  );
}
