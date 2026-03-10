/**
 * ADAGIO - Theory/Circle Page (Refactored)
 * Cercle des quintes - accords diatoniques colorés par position
 *
 * Utilise des composants modulaires pour une architecture propre
 */

'use client';

import { useState } from 'react';
import { MetalNav, MetalFooter } from '@/components';
import { DEGREE_COLORS } from '@adagio/theory';
import {
  CircleOfFifths,
  ChordDisplay,
  RelativeKey,
} from '@/components/theory/circle';
import { useCircleState } from '@/features/theory/hooks';

export default function CirclePage() {
  // État de la page via hook personnalisé
  const { data, initialKey } = useCircleState({ initialKey: 'C' });

  // État local pour la sélection (le hook retourne les données calculées)
  const [selectedKey, setSelectedKey] = useState<string>(initialKey);

  // Recalculer les données quand la tonique change
  const circleData = useCircleState({ initialKey: selectedKey }).data;

  // Couleur de la tonique pour le cercle central
  const tonicColor = DEGREE_COLORS[0];

  return (
    <div className="min-h-screen flex flex-col bg-abyss">
      <MetalNav />

      <main className="flex-1 px-4 py-24 mt-16">
        <div className="max-w-2xl mx-auto">
          {/* En-tête */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl lg:text-4xl font-metal text-white tracking-tighter mb-2">
              CIRCLE OF FIFTHS
            </h1>
            <p className="text-xs text-gray uppercase tracking-widest">
              Cercle des Quintes
            </p>
            <p className="text-sm text-gray-300 mt-2">
              Tonique: <span className="font-bold" style={{ color: tonicColor }}>{selectedKey}</span>
            </p>
          </div>

          {/* Cercle des quintes interactif */}
          <CircleOfFifths
            selectedKey={selectedKey}
            onKeyChange={setSelectedKey}
            diatonicChords={circleData.chords}
            isMinor={circleData.isMinor}
          />

          {/* Accords diatoniques */}
          <ChordDisplay
            chords={circleData.chords}
            label={`${selectedKey} - ACCORDS`}
          />

          {/* Tonalité relative */}
          <RelativeKey
            relativeKey={circleData.relativeKey}
            isMinor={circleData.isMinor}
            majorKey={circleData.majorKey}
          />

          {/* Indication de la couleur sélectionnée */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Les notes colorées appartiennent à la gamme de {selectedKey}
            </p>
          </div>
        </div>
      </main>

      <MetalFooter />
    </div>
  );
}
