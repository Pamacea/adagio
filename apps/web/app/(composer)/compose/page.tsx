/**
 * ADAGIO - Compose Page
 * Page de composition avancée — une seule colonne de lecture.
 */

'use client';

import { useState } from 'react';
import { MetalNav, MetalFooter } from '@/components';
import { useComposeState, useComposeAudio } from '@/features/theory';
import {
  ScaleNotesDisplay,
  KeySelector,
  CircleDegreeSelector,
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
  getParallelKey,
  getRelativeKey,
  parseChord,
} from '@adagio/theory';
import type { ComposeProgression, KeyMode } from '@adagio/theory';
import type { Interval, NoteName } from '@adagio/types';

// ============================================================================
// MAIN PAGE
// ============================================================================

/** Modes de la famille majeure (les autres sont mineurs) */
const MAJOR_FAMILY = new Set<string>(['major', 'lydian', 'mixolydian']);

const SECTIONS = [
  { id: 'harmonie', label: 'Harmonie' },
  { id: 'progressions', label: 'Progressions' },
  { id: 'modes', label: 'Modes' },
] as const;

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

  /** Numéraux romains du mode courant — sert au lookup des degrés */
  const numerals: readonly string[] =
    keyMode === 'major' ? ROMAN_NUMERALS_MAJOR : ROMAN_NUMERALS_MINOR;

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

  // Sélection d'un degré dans la tonalité courante (sélecteur unique : cercle)
  const handleDegreeSelect = (degreeIndex: number) => {
    audio.stop();
    setPlayback(null);
    setSelectedDegree(degreeIndex);
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
      const degreeIndex = numerals.indexOf(deg);
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

  return (
    <div className="min-h-screen flex flex-col">
      <MetalNav />

      <main className="flex-1 px-6 pt-28 pb-24">
        <div className="w-full mx-auto space-y-12" style={{ maxWidth: '68rem' }}>
          {/* Header */}
          <header className="space-y-3">
            <h1 className="font-metal text-2xl uppercase tracking-tighter text-white sm:text-3xl">
              Compose
            </h1>
            <p className="text-[15px] leading-relaxed text-gray">
              Studio de composition harmonique.
            </p>
            <nav aria-label="Sections de la page" className="flex gap-6 pt-1">
              {SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-[13px] text-gray/70 hover:text-gold"
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </header>

          {/* Tonalité + gamme */}
          <section className="space-y-2">
            <div className="panel p-3">
              <KeySelector
                selectedKey={selectedKey}
                keyMode={keyMode}
                onKeyChange={handleKeyChange}
                onModeChange={handleModeChange}
                diatonicChords={chords}
              />
            </div>
            <ScaleNotesDisplay
              scaleNotes={scaleNotes}
              keyMode={keyMode}
              selectedKey={selectedKey}
              onPlayScale={handlePlayScale}
            />
          </section>

          {/* Harmonie : cercle à gauche, détail à droite (empilé sur mobile) */}
          <section id="harmonie" className="scroll-mt-28 space-y-3">
            <div className="flex items-baseline justify-between gap-6">
              <h2 className="field-label mb-0 text-gold">Cercle des degrés</h2>
              <p className="text-[11px] text-gray">Cliquez pour sélectionner</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start">
              <div className="panel mx-auto w-full space-y-3 bg-surface p-3">
                <CircleDegreeSelector
                  currentKey={selectedKey}
                  keyMode={keyMode}
                  selectedDegree={selectedDegree}
                  onDegreeSelect={handleDegreeSelect}
                />
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-1 text-[11px] text-gray">
                  <span>
                    Relative <span className="text-white">{getRelativeKey(selectedKey, keyMode)}</span>
                  </span>
                  <span>
                    Parallèle{' '}
                    <span className="text-white">{getParallelKey(selectedKey, keyMode)}</span>
                  </span>
                </div>
              </div>

              <div>
                {selectedDegree === null ? (
                  <p className="panel p-3 text-center text-[13px] text-gray">
                    Choisis un degré…
                  </p>
                ) : (
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
                )}
              </div>
            </div>
          </section>

          {/* Progressions classiques */}
          <section id="progressions" className="scroll-mt-28">
            <ComposeProgressionsSection
              selectedKey={selectedKey}
              progressions={progressions}
              numerals={numerals}
              onSelectDegree={setSelectedDegree}
              onPlayProgression={handlePlayProgression}
              playingIndex={playback?.index ?? null}
              activeStep={playback?.step ?? null}
            />
          </section>

          {/* Modes */}
          <section id="modes" className="scroll-mt-28">
            <ModesSection
              selectedKey={selectedKey}
              keyMode={keyMode}
              activeScaleId={activeScaleId}
              onModeSelect={handleModeSelect}
            />
          </section>
        </div>
      </main>

      <MetalFooter />
    </div>
  );
}
