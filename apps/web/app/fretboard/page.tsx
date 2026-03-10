/**
 * ADAGIO - Fretboard Page (Refactored)
 * Manche de guitare interactif
 * Notation française, design brutal metal
 */

'use client';

import { MetalNav, MetalFooter } from '@/components';
import {
  FretboardControls,
  ModeInfo,
  FretboardLegend,
  FretboardDisplay,
  CAGEDInfo,
} from '@/components/theory/fretboard';
import { useFretboardState } from '@/features/theory/hooks';

export default function FretboardPage() {
  // État de la page via hook personnalisé
  const {
    root,
    mode,
    fretCount,
    showAllNotes,
    setRoot,
    setMode,
    setFretCount,
    setShowAllNotes,
    toggleShowAllNotes,
    fretboardData,
    displayNote,
  } = useFretboardState();

  return (
    <div className="min-h-screen flex flex-col bg-abyss">
      <MetalNav />

      <main className="flex-1 px-4 py-24 mt-16">
        <div className="w-3/4 mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-metal text-white tracking-tighter mb-2">
              MANCHE DE GUITARE
            </h1>
            <p className="text-gray text-sm uppercase tracking-widest">
              Visualisez les notes sur le manche
            </p>
          </div>

          {/* Controls */}
          <FretboardControls
            currentRoot={root}
            currentMode={mode}
            fretCount={fretCount}
            showAllNotes={showAllNotes}
            onRootChange={setRoot}
            onModeChange={setMode}
            onFretCountChange={setFretCount}
            onToggleNotes={toggleShowAllNotes}
          />

          {/* Current scale info */}
          <ModeInfo
            root={root}
            mode={mode}
            scaleNotes={fretboardData}
            displayNote={displayNote}
          />

          {/* Fretboard */}
          <FretboardDisplay
            root={root}
            mode={mode}
            fretCount={fretCount}
            showAllNotes={showAllNotes}
          />

          {/* Legend */}
          <FretboardLegend />

          {/* CAGED info */}
          <CAGEDInfo />
        </div>
      </main>

      <MetalFooter />
    </div>
  );
}
