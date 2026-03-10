/**
 * ADAGIO - Theory/Modes Page (Refactored)
 * Les 7 modes grecs avec émotions - composants modulaires
 */

'use client';

import { useMemo } from 'react';
import { MetalNav, MetalFooter, MetalCard } from '@/components';
import { getEmotionForMode, MODE_INTERVALS, ROMAN_DEGREES, MODE_ORDER } from '@adagio/theory';
import { NOTE_FR, CHROMATIC } from '@/lib/theory';
import { ModeSelector, ModeCircle, ModeList, ModeDetail } from '@/components/theory/modes';
import { useModeState } from '@/features/theory/hooks';
import type { ModeName } from '@adagio/types';

// Mapping des couleurs pour chaque mode (classes CSS)
const MODE_COLORS: Record<ModeName, string> = {
  ionian: 'border-white',
  dorian: 'border-rust',
  phrygian: 'border-blood',
  lydian: 'border-toxic',
  mixolydian: 'border-steel',
  aeolian: 'border-gray',
  locrian: 'border-blackness',
};

// Retourne les notes du mode pour une tonique donnée
function getModeNotes(root: string, mode: ModeName): string[] {
  const rootIndex = CHROMATIC.indexOf(root as typeof CHROMATIC[number]);
  const intervals = MODE_INTERVALS[mode];
  return intervals.map(i => {
    const noteIndex = (rootIndex + i) % 12;
    return CHROMATIC[noteIndex]!;
  });
}

// Retourne les degrés dynamiques avec altérations (1, 2, b3, 4, 5, b6, b7)
function getDynamicDegrees(mode: ModeName): string[] {
  const modeIntervals = MODE_INTERVALS[mode];
  const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11];

  return modeIntervals.map((interval, index) => {
    const degree = index + 1;
    const majorInterval = MAJOR_INTERVALS[index];

    if (majorInterval === undefined) return degree.toString();

    if (interval === majorInterval) return degree.toString();
    if (interval < majorInterval) return `b${degree}`;
    return `#${degree}`;
  });
}

export default function ModesPage() {
  // État de la page via hook personnalisé
  const {
    root,
    selectedMode,
    showCircle,
    setRoot,
    setSelectedMode,
    toggleView,
  } = useModeState();

  // Données du mode sélectionné
  const modeInfo = getEmotionForMode(selectedMode);
  const modeNotes = useMemo(() => getModeNotes(root, selectedMode), [root, selectedMode]);
  const modeDegrees = ROMAN_DEGREES[selectedMode];
  const modeDegreesDynamic = useMemo(() => getDynamicDegrees(selectedMode), [selectedMode]);
  const modeColor = MODE_COLORS[selectedMode];

  return (
    <div className="min-h-screen flex flex-col bg-abyss">
      <MetalNav />

      <main className="flex-1 px-4 py-24 mt-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-metal text-white tracking-tighter mb-2">
              MODES GRECS
            </h1>
            <p className="text-gray text-sm uppercase tracking-widest">
              Les 7 emotions de la musique
            </p>
          </div>

          {/* Sélecteur (composant) */}
          <ModeSelector
            selectedRoot={root}
            showCircle={showCircle}
            onRootChange={setRoot}
            onViewToggle={toggleView}
            ROOTS={CHROMATIC}
            noteFr={NOTE_FR}
          />

          {/* Mode display - Liste ou Cercle (composants) */}
          {showCircle ? (
            <ModeCircle
              modes={MODE_ORDER}
              selectedMode={selectedMode}
              onSelect={setSelectedMode}
            />
          ) : (
            <ModeList
              modes={MODE_ORDER}
              selectedMode={selectedMode}
              onSelect={setSelectedMode}
            />
          )}

          {/* Détail du mode sélectionné (composant) */}
          <div className="mt-8">
            <ModeDetail
              root={root}
              selectedMode={selectedMode}
              modeInfo={modeInfo}
              modeNotes={modeNotes}
              modeDegrees={modeDegrees}
              modeDegreesDynamic={modeDegreesDynamic}
              noteFr={NOTE_FR}
              modeColor={modeColor}
            />
          </div>

          {/* Quick reference */}
          <div className="mt-8">
            <h3 className="text-lg font-metal text-white uppercase tracking-wider mb-4">
              Reference Rapide
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
              {MODE_ORDER.map(mode => {
                const info = getEmotionForMode(mode);
                const isActive = mode === selectedMode;
                return (
                  <button
                    key={mode}
                    onClick={() => setSelectedMode(mode)}
                    className={`p-3 border-2 text-left transition-all ${
                      isActive
                        ? 'border-blood bg-toxic'
                        : 'border-steel bg-blackness hover:border-white'
                    }`}
                  >
                    <p className="text-xs font-bold text-white uppercase">{info.name}</p>
                    <p className="text-xs text-gray mt-1 line-clamp-2">{info.character}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <MetalFooter />
    </div>
  );
}
