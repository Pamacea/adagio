/**
 * ADAGIO - Compose Page
 * Page de composition avancée — orchestrateur (état + sections modulaires)
 */

'use client';

import { useState } from 'react';
import { FadeIn, MetalNav, MetalFooter } from '@/components';
import { useComposeState, useComposeAudio } from '@/features/theory';
import {
  ScaleNotesDisplay,
  KeySelector,
  CircleDegreeSelector,
  DegreeGrid,
  ChordDetailsPanel,
  ComposeProgressionsSection,
  ModesSection,
} from '@/components/theory/compose';
import {
  ROMAN_NUMERALS_MAJOR,
  ROMAN_NUMERALS_MINOR,
  COMPOSE_SCALE_TYPES,
  INTERVAL_SEMITONES,
  transposeNote,
  getChordNotes,
  parseChord,
} from '@adagio/theory';
import type { ComposeProgression, KeyMode } from '@adagio/theory';
import type { Interval, NoteName } from '@adagio/types';

// ============================================================================
// MAIN PAGE
// ============================================================================

/** Modes de la famille majeure (les autres sont mineurs) */
const MAJOR_FAMILY = new Set<string>(['major', 'lydian', 'mixolydian']);

export default function ComposePage() {
  const {
    selectedKey,
    keyMode,
    selectedDegree,
    selectedVariations,
    scaleNotes,
    chords,
    progressions,
    chordVariations,
    effectiveChord,
    chordSubstitutions,
    chordDetails,
    selectedVariationDetails,
    setSelectedKey,
    setKeyMode,
    setSelectedDegree,
    setSelectedVariation,
    resetVariations,
    applyManualChord,
  } = useComposeState();

  const audio = useComposeAudio();

  /** Progression en cours de lecture : index de carte + étape (degré) active */
  const [playback, setPlayback] = useState<{ index: number; step: number } | null>(null);
  /** Mode cliqué dans « Modes disponibles » */
  const [activeScaleId, setActiveScaleId] = useState<string>(keyMode);

  // ---------------------------------------------------------------------------
  // Handlers — tonalité / mode
  // ---------------------------------------------------------------------------

  const handleKeyChange = (key: NoteName) => {
    audio.stop();
    setPlayback(null);
    setSelectedKey(key);
    setSelectedDegree(null);
    resetVariations();
  };

  const handleModeChange = (mode: KeyMode) => {
    audio.stop();
    setPlayback(null);
    setActiveScaleId(mode);
    setKeyMode(mode);
    setSelectedDegree(null);
    resetVariations();
  };

  const handleModulation = (key: string) => {
    audio.stop();
    setPlayback(null);
    setSelectedKey(key as NoteName);
  };

  // Cercle des degrés : modulation (change tonique + mode), réinitialise la sélection
  const handleCircleDegree = (_degree: string, newKey: NoteName, newMode: KeyMode) => {
    audio.stop();
    setPlayback(null);
    setActiveScaleId(newMode);
    setSelectedKey(newKey);
    setKeyMode(newMode);
    setSelectedDegree(null);
    resetVariations();
  };

  // ---------------------------------------------------------------------------
  // Handlers — audio
  // ---------------------------------------------------------------------------

  const handlePlayScale = () => {
    setPlayback(null);
    audio.playScale(scaleNotes);
  };

  const handlePlayChord = () => {
    setPlayback(null);
    if (chordDetails) audio.playChord(chordDetails.notes);
  };

  /** Clic ▶ sur une progression : lecture séquentielle + highlight synchronisé */
  const handlePlayProgression = (prog: ComposeProgression, index: number) => {
    const sequence = prog.degrees.map((deg) => {
      const degreeIndex = ROMAN_NUMERALS_MAJOR.indexOf(
        deg as (typeof ROMAN_NUMERALS_MAJOR)[number]
      );
      const chord = degreeIndex >= 0 ? chords[degreeIndex] : undefined;
      return chord ? getChordNotes(chord).notes : [];
    });
    setPlayback({ index, step: 0 });
    audio.playProgression(
      sequence,
      (step) => setPlayback({ index, step }),
      () => setPlayback(null)
    );
  };

  // ---------------------------------------------------------------------------
  // Handlers — substitutions & modes
  // ---------------------------------------------------------------------------

  /**
   * Applique un accord manuel (substitution / emprunt) :
   * sélectionne le degré portant la même racine si aucun n'est actif,
   * pose `manualChord` et joue un aperçu sonore.
   */
  const handleSubstitution = (chord: string) => {
    setPlayback(null);
    if (selectedDegree === null) {
      const root = parseChord(chord)?.root ?? chord;
      const degreeIndex = chords.findIndex((c) => (parseChord(c)?.root ?? c) === root);
      if (degreeIndex >= 0) setSelectedDegree(degreeIndex);
    }
    applyManualChord(chord);
    audio.playChord(getChordNotes(chord).notes);
  };

  /** Clic sur un mode : bascule la famille majeure/mineure + preview de la gamme */
  const handleModeSelect = (scaleId: string) => {
    const scaleDef = COMPOSE_SCALE_TYPES.find((d) => d.id === scaleId);
    if (!scaleDef) return;
    setPlayback(null);
    setActiveScaleId(scaleId);
    const family: KeyMode = MAJOR_FAMILY.has(scaleId) ? 'major' : 'minor';
    if (family !== keyMode) {
      setKeyMode(family);
      setSelectedDegree(null);
      resetVariations();
    }
    const notes = scaleDef.intervals.map((iv) =>
      transposeNote(selectedKey, INTERVAL_SEMITONES[iv as Interval])
    );
    audio.playScale(notes);
  };

  const numerals = keyMode === 'major' ? ROMAN_NUMERALS_MAJOR : ROMAN_NUMERALS_MINOR;

  return (
    <div className="min-h-screen flex flex-col bg-abyss">
      <MetalNav />

      <main className="flex-1 px-4 py-24 mt-16">
        <div className="w-3/4 mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl lg:text-4xl font-metal text-white tracking-tighter mb-2">
              COMPOSE
            </h1>
            <p className="text-xs text-gray uppercase tracking-widest">
              Studio de composition harmonique
            </p>
          </div>

          {/* Key selector */}
          <FadeIn>
            <KeySelector
              selectedKey={selectedKey}
              keyMode={keyMode}
              onKeyChange={handleKeyChange}
              onModeChange={handleModeChange}
            />
          </FadeIn>

          {/* Scale notes display */}
          <FadeIn>
            <ScaleNotesDisplay
              scaleNotes={scaleNotes}
              keyMode={keyMode}
              selectedKey={selectedKey}
              onPlayScale={handlePlayScale}
            />
          </FadeIn>

          <FadeIn className="grid lg:grid-cols-2 gap-8">
            {/* Left: Degrees */}
            <div>
              <div className="section-frame p-6 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-metal text-white uppercase tracking-wider">
                    Cercle des degrés
                  </h2>
                  <p className="text-xs text-gray uppercase tracking-wider">Cliquez pour moduler</p>
                </div>
                <CircleDegreeSelector
                  currentKey={selectedKey}
                  keyMode={keyMode}
                  onDegreeClick={handleCircleDegree}
                />
              </div>
              <DegreeGrid
                chords={chords}
                numerals={numerals}
                selectedDegree={selectedDegree}
                selectedVariations={selectedVariations}
                chordVariations={chordVariations}
                scaleNotes={scaleNotes}
                onDegreeClick={setSelectedDegree}
                onModulation={handleModulation}
              />
            </div>

            {/* Right: Selected chord details */}
            <div>
              <ChordDetailsPanel
                selectedChord={effectiveChord}
                selectedDegree={selectedDegree}
                chordDetails={chordDetails}
                chordVariations={chordVariations}
                selectedVariations={selectedVariations}
                selectedVariationDetails={selectedVariationDetails}
                chordSubstitutions={chordSubstitutions}
                numerals={numerals}
                selectedKey={selectedKey}
                keyMode={keyMode}
                onVariationChange={setSelectedVariation}
                onSubstitutionClick={handleSubstitution}
                onPlayChord={handlePlayChord}
              />
            </div>
          </FadeIn>

          {/* Common progressions */}
          <FadeIn>
            <ComposeProgressionsSection
              selectedKey={selectedKey}
              progressions={progressions}
              onSelectDegree={setSelectedDegree}
              onPlayProgression={handlePlayProgression}
              playingIndex={playback?.index ?? null}
              activeStep={playback?.step ?? null}
            />
          </FadeIn>

          {/* Scale modes and substitutions */}
          <FadeIn>
            <ModesSection
              selectedKey={selectedKey}
              keyMode={keyMode}
              activeScaleId={activeScaleId}
              onModeSelect={handleModeSelect}
              onSubstitutionApply={handleSubstitution}
            />
          </FadeIn>
        </div>
      </main>

      <MetalFooter />
    </div>
  );
}
