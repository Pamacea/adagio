/**
 * ADAGIO - Theory/Chords Page
 *
 * Bibliothèque d'accords diatoniques par degré.
 * Page optimisée avec hooks et composants modulaires.
 */

'use client';

import { MetalNav, MetalFooter } from '@/components';
import { ChordsSidebar } from '@/features/chords';
import { useChordPage } from './hooks';
import { ChordLibrarySidebar, ChordDisplayMain } from './components';
import { CHROMATIC_SCALE, GUITAR_TUNING_DISPLAY, MAJOR_DEGREE_QUALITIES_EXTENDED, MINOR_DEGREE_QUALITIES_EXTENDED } from '@adagio/theory';

// Alias pour compatibilité
const NOTES = [...CHROMATIC_SCALE];
const MAJOR_DEGREE_QUALITIES = MAJOR_DEGREE_QUALITIES_EXTENDED;
const MINOR_DEGREE_QUALITIES = MINOR_DEGREE_QUALITIES_EXTENDED;

export default function ChordsPage() {
  const {
    root,
    tonality,
    selectedDegree,
    openCategories,
    setTonality,
    toggleCategory,
    handleChordSelect,
    handleRootChange,
    handleDegreeChange,
    setSelectedVoicingIndex,
    currentRoot,
    chordVoicings,
    selectedVoicing,
    selectedVoicingIndex,
    chordTension,
    diatonicChords,
    extensionChords,
    alterationChords,
    displayedChord: chordToDisplay,
    fretboardNotes,
    getFingeringFromVoicing,
    selectedChord,
  } = useChordPage();

  return (
    <div className="min-h-screen flex flex-col bg-abyss text-white">
      <MetalNav />

      <div className="flex flex-1 pt-[64px]">
        {/* Sidebar gauche - Sélection tonalité/degré */}
        <ChordsSidebar
          root={root}
          tonality={tonality}
          selectedDegree={selectedDegree}
          selectedChordName={selectedChord ? `${selectedChord.root}${selectedChord.quality}` : null}
          notes={NOTES}
          majorDegreeQualities={MAJOR_DEGREE_QUALITIES}
          minorDegreeQualities={MINOR_DEGREE_QUALITIES}
          onTonalityChange={setTonality}
          onRootChange={handleRootChange}
          onDegreeChange={handleDegreeChange}
        />

        {/* Main content - Affichage de l'accord */}
        <main className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-abyss via-void to-abyss">
          <ChordDisplayMain
            chordToDisplay={chordToDisplay}
            currentRoot={currentRoot}
            chordNotes={chordToDisplay?.notes ?? []}
            chordVoicings={chordVoicings}
            selectedVoicing={selectedVoicing}
            selectedVoicingIndex={selectedVoicingIndex}
            chordTension={chordTension}
            fretboardNotes={fretboardNotes}
            onVoicingSelect={setSelectedVoicingIndex}
            getFingeringFromVoicing={getFingeringFromVoicing}
          />
        </main>

        {/* Sidebar droite - Bibliothèque d'accords */}
        <ChordLibrarySidebar
          currentRoot={currentRoot}
          selectedDegree={selectedDegree}
          tonality={tonality}
          diatonicChords={diatonicChords}
          extensionChords={extensionChords}
          alterationChords={alterationChords}
          chordToDisplay={chordToDisplay}
          selectedChord={selectedChord}
          openCategories={openCategories}
          onToggleCategory={toggleCategory}
          onChordSelect={handleChordSelect}
          className="w-80 bg-blackness/80 backdrop-blur-sm border-l border-steel/30 overflow-y-auto shrink-0"
        />
      </div>

      <MetalFooter />
    </div>
  );
}
