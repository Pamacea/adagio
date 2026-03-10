/**
 * ADAGIO - Theory/Scales Page (Refactored)
 * Gammes musicales avec composants modulaires
 */

'use client';

import { useMemo } from 'react';
import { MetalNav, MetalFooter } from '@/components';
import { getFretboardNotesForKey, SCALES, SCALE_CATEGORIES } from '@adagio/theory';
import { NOTE_FR } from '@/lib/theory';
import { ScaleSelector, ScaleDisplay, ScaleFretboard, IntervalLegend } from '@/components/theory/scales';
import { useScaleState } from '@/features/theory/hooks';
import { calculateFretPositions } from '@/components/theory/scales/ScaleFretboard';
import type { ScaleCategory, ScaleDefinition } from '@/components/theory/scales';

export default function ScalesPage() {
  // État de la page via hook personnalisé
  const {
    root,
    scaleType,
    fretCount,
    showAllNotes,
    setRoot,
    setScaleType,
    setFretCount,
    toggleShowAllNotes,
  } = useScaleState();

  // Calculer les positions des frettes (mémoisé selon fretCount)
  const fretPositions = useMemo(() => calculateFretPositions(fretCount), [fretCount]);

  // Calculer les données du manche pour la gamme sélectionnée
  const fretboardData = useMemo(() => {
    const scaleDef = SCALES.find(s => s.id === scaleType);
    if (!scaleDef) return [];
    return getFretboardNotesForKey(root, scaleDef.intervals, fretCount);
  }, [root, scaleType, fretCount]);

  // Récupérer la définition de la gamme courante
  const currentScaleDef = SCALES.find(s => s.id === scaleType) ?? null;

  // Fonction d'affichage des notes en français
  const displayNote = (note: string): string => NOTE_FR[note] || note;

  return (
    <div className="min-h-screen flex flex-col bg-abyss">
      <MetalNav />

      <main className="flex-1 px-4 py-24 mt-16">
        <div className="w-3/4 mx-auto">
          {/* En-tête */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl lg:text-5xl font-metal text-white tracking-tighter mb-2">
              SCALES
            </h1>
            <p className="text-gray text-sm uppercase tracking-widest">
              Gammes Musicales
            </p>
          </div>

          {/* Sélecteurs (composant) */}
          <ScaleSelector
            currentRoot={root}
            currentScale={scaleType}
            fretCount={fretCount}
            showAllNotes={showAllNotes}
            onRootChange={setRoot}
            onScaleChange={setScaleType}
            onFretCountChange={setFretCount}
            onShowAllNotesChange={toggleShowAllNotes}
            scaleCategories={SCALE_CATEGORIES}
            scales={SCALES}
          />

          {/* Affichage de la gamme (composant) */}
          <ScaleDisplay
            root={root}
            scaleDef={currentScaleDef}
            scaleNotes={currentScaleDef?.intervals ?? []}
            fretboardData={fretboardData}
            displayNote={displayNote}
          />

          {/* Manche de guitare (composant) */}
          <ScaleFretboard
            fretboardData={fretboardData}
            fretPositions={fretPositions}
            fretCount={fretCount}
            showAllNotes={showAllNotes}
            displayNote={displayNote}
          />

          {/* Légende des intervalles (composant) */}
          <IntervalLegend />
        </div>
      </main>

      <MetalFooter />
    </div>
  );
}
