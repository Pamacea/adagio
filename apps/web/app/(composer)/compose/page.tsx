/**
 * ADAGIO - Compose Page
 * Page de composition avancée avec cercle des degrés interactif
 *
 * Refactorisée avec hook useComposeState et composants modulaires
 */

'use client';

import { MetalNav, MetalFooter } from '@/components';
import { HelpButton, HelpTooltip } from '@/components/HelpProvider';
import { useComposeState, SCALE_TYPES } from '@/features/theory';
import { ScaleNotesDisplay, FretboardChord, getContrastColor } from '@/components/theory/compose';
import {
  FRENCH_NOTE_NAMES as NOTE_FR,
  DEGREE_COLORS,
  DEGREE_EMOTIONS,
  ROMAN_NUMERALS_MAJOR,
  ROMAN_NUMERALS_MINOR,
  MAJOR_KEYS,
} from '@adagio/theory';
import type { NoteName } from '@adagio/types';

// ============================================================================
// MAIN PAGE
// ============================================================================

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
    selectedChord,
    chordSubstitutions,
    chordDetails,
    selectedVariationDetails,
    setSelectedKey,
    setKeyMode,
    setSelectedDegree,
    setSelectedVariation,
    resetVariations,
  } = useComposeState();

  const handleKeyChange = (key: NoteName) => {
    setSelectedKey(key);
    setSelectedDegree(null);
    resetVariations();
  };

  const handleModeChange = (mode: 'major' | 'minor') => {
    setKeyMode(mode);
    setSelectedDegree(null);
    resetVariations();
  };

  const handleVariationChange = (degree: number, variationId: string) => {
    setSelectedVariation(degree, variationId);
  };

  const handleModulation = (key: string) => {
    setSelectedKey(key as NoteName);
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
          <div className="section-frame p-4 mb-8">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray uppercase tracking-wider">TONALITÉ</p>
              {/* Mode toggle */}
              <div className="flex gap-1 border-2 border-steel rounded overflow-hidden">
                <button
                  onClick={() => handleModeChange('major')}
                  className={`px-3 py-1 text-xs font-bold uppercase transition-all ${
                    keyMode === 'major'
                      ? 'bg-toxic text-black'
                      : 'bg-abyss text-gray hover:text-white'
                  }`}
                >
                  Majeur
                </button>
                <button
                  onClick={() => handleModeChange('minor')}
                  className={`px-3 py-1 text-xs font-bold uppercase transition-all ${
                    keyMode === 'minor'
                      ? 'bg-toxic text-black'
                      : 'bg-abyss text-gray hover:text-white'
                  }`}
                >
                  Mineur
                </button>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {MAJOR_KEYS.map((key) => {
                const isSelected = selectedKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleKeyChange(key)}
                    className={`px-4 py-2 text-sm font-bold uppercase border-2 transition-all ${
                      isSelected
                        ? 'border-blood bg-toxic text-white scale-105'
                        : 'border-steel bg-abyss text-gray hover:border-white'
                    }`}
                  >
                    {key} {isSelected && `(${NOTE_FR[key] || key})`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scale notes display */}
          <ScaleNotesDisplay scaleNotes={scaleNotes} keyMode={keyMode} selectedKey={selectedKey} />

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Degrees circle */}
            <div>
              <div className="section-frame p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-metal text-white uppercase tracking-wider">
                    Degrés diatoniques
                  </h2>
                  <HelpTooltip topicId="compose.degrees">
                    <HelpButton topicId="compose.degrees" useModal size="md" variant="subtle" />
                  </HelpTooltip>
                </div>

                {/* Degree buttons with variation selector */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {chords.map((basicChord, i) => {
                    const numeral = numerals[i];
                    const color = DEGREE_COLORS[i] || '#3a3a3a';
                    const isSelected = selectedDegree === i;
                    const variations = chordVariations[i] || [];
                    const selectedVariation = selectedVariations[i] || 'basic';
                    const currentVariation = variations.find((v) => v.id === selectedVariation);
                    const displayChord = currentVariation?.symbol || basicChord;

                    return (
                      <div key={i} className="flex flex-col items-center">
                        <button
                          onClick={() => setSelectedDegree(isSelected ? null : i)}
                          className="flex flex-col items-center w-full"
                        >
                          <div
                            className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-black border-2 transition-all ${
                              isSelected ? 'scale-110 shadow-lg' : ''
                            }`}
                            style={{
                              backgroundColor: color,
                              color: getContrastColor(color),
                              borderColor: isSelected ? '#8b1a1a' : '#2a2a2a',
                              boxShadow: isSelected ? `0 0 20px ${color}80` : undefined,
                            }}
                          >
                            {i + 1}
                          </div>
                          <span className="text-xs text-gray mt-1">{numeral}</span>
                          <span
                            className={`text-xs font-bold mt-1 ${isSelected ? 'text-toxic' : 'text-white'}`}
                          >
                            {displayChord.length > 6
                              ? displayChord.slice(0, 5) + '…'
                              : displayChord}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Emotion legend */}
                <div className="border-2 border-steel bg-blackness p-4">
                  <p className="text-xs text-gray uppercase tracking-wider mb-3">
                    Émotions des degrés
                  </p>
                  <div className="space-y-2">
                    {ROMAN_NUMERALS_MAJOR.map((numeral, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: DEGREE_COLORS[i] }}
                        />
                        <span className="text-sm text-white w-8">{numeral}</span>
                        <span className="text-xs text-gray flex-1">{DEGREE_EMOTIONS[i]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick modulations */}
                <div className="mt-4 border-2 border-steel bg-blackness p-4">
                  <p className="text-xs text-gray uppercase tracking-wider mb-3">
                    Modulations rapides
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleModulation(scaleNotes[5]!)}
                      className="px-3 py-1 text-xs border-2 border-steel bg-abyss hover:border-blood transition-all"
                    >
                      Relative mineur ({scaleNotes[5]}m)
                    </button>
                    <button
                      onClick={() => handleModulation(scaleNotes[3]!)}
                      className="px-3 py-1 text-xs border-2 border-steel bg-abyss hover:border-blood transition-all"
                    >
                      Sous-dominante ({scaleNotes[3]})
                    </button>
                    <button
                      onClick={() => handleModulation(scaleNotes[4]!)}
                      className="px-3 py-1 text-xs border-2 border-steel bg-abyss hover:border-blood transition-all"
                    >
                      Dominante ({scaleNotes[4]})
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Selected chord details */}
            <div>
              {selectedChord && chordDetails && selectedDegree !== null ? (
                <div className="space-y-4">
                  <h2 className="text-lg font-metal text-white uppercase tracking-wider mb-4">
                    Détails: {selectedChord}
                  </h2>

                  {/* Variation selector */}
                  {selectedDegree !== null &&
                    chordVariations[selectedDegree] &&
                    chordVariations[selectedDegree].length > 1 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray uppercase tracking-wider mb-3">
                          Variation d'accord
                        </p>
                        <div className="relative">
                          <select
                            value={selectedVariations[selectedDegree] || 'basic'}
                            onChange={(e) => handleVariationChange(selectedDegree, e.target.value)}
                            className="w-full text-sm bg-blackness border-2 border-steel text-gray p-3 pr-10 rounded appearance-none hover:border-toxic transition-all cursor-pointer"
                          >
                            {chordVariations[selectedDegree].map((v) => (
                              <option key={v.id} value={v.id}>
                                {v.name}
                              </option>
                            ))}
                          </select>
                          <svg
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray pointer-events-none"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </div>
                      </div>
                    )}

                  {/* Chord header */}
                  <div className="section-frame p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-4xl font-metal text-white">{selectedChord}</p>
                          {selectedVariationDetails &&
                            selectedVariationDetails.category !== 'basic' && (
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  selectedVariationDetails.category === 'extension'
                                    ? 'bg-toxic text-white'
                                    : selectedVariationDetails.category === 'substitution'
                                      ? 'bg-circuit text-white'
                                      : selectedVariationDetails.category === 'modal'
                                        ? 'bg-rust text-white'
                                        : 'bg-void text-gray'
                                }`}
                              >
                                {selectedVariationDetails.category}
                              </span>
                            )}
                        </div>
                        <p className="text-sm text-gray">
                          {numerals[selectedDegree]} de {selectedKey}{' '}
                          {keyMode === 'major' ? 'Majeur' : 'Mineur'}
                        </p>
                        {selectedVariationDetails && selectedVariationDetails.description && (
                          <p className="text-xs text-gray mt-1">
                            {selectedVariationDetails.description}
                          </p>
                        )}
                      </div>
                      <div
                        className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black border-2"
                        style={{
                          backgroundColor: DEGREE_COLORS[selectedDegree] || '#3a3a3a',
                          color: getContrastColor(DEGREE_COLORS[selectedDegree] || '#3a3a3a'),
                          borderColor: '#8b1a1a',
                        }}
                      >
                        {selectedDegree + 1}
                      </div>
                    </div>

                    {/* Chord notes with intervals */}
                    <div className="border-2 border-steel bg-blackness p-4 mb-4">
                      <p className="text-xs text-gray uppercase tracking-wider mb-3">
                        Notes de l'accord
                      </p>
                      <div className="flex gap-2 justify-center">
                        {chordDetails.notes.map((note, i) => (
                          <div key={i} className="text-center">
                            <div className="px-4 py-3 border-2 border-blood bg-toxic mb-1">
                              <span className="text-lg font-bold text-white">
                                {NOTE_FR[note] || note}
                              </span>
                            </div>
                            <span className="text-xs text-gray">{chordDetails.intervals[i]}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fretboard visualization */}
                    <div className="border-2 border-steel bg-blackness p-4 mb-4">
                      <p className="text-xs text-gray uppercase tracking-wider mb-3">
                        Diagramme du manche
                      </p>
                      <div className="flex justify-center">
                        <FretboardChord chord={selectedChord} width={280} height={200} />
                      </div>
                    </div>

                    {/* Degree emotion */}
                    <div className="text-sm">
                      <span className="text-blood font-bold">Émotion: </span>
                      <span className="text-gray">
                        {selectedVariationDetails?.emotion || DEGREE_EMOTIONS[selectedDegree]}
                      </span>
                    </div>
                  </div>

                  {/* Substitutions & Extensions */}
                  {chordSubstitutions.length > 0 && (
                    <div className="section-frame p-6">
                      <h3 className="text-sm text-gray uppercase tracking-wider mb-4">
                        Substitutions & Extensions
                      </h3>
                      <div className="space-y-2">
                        {chordSubstitutions.map((sub, i) => (
                          <button
                            key={i}
                            className="w-full p-3 border-2 border-steel bg-blackness hover:border-blood transition-all text-left"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span
                                  className={`text-xs px-2 py-1 rounded ${
                                    sub.type === 'extension'
                                      ? 'bg-toxic text-white'
                                      : sub.type === 'substitution'
                                        ? 'bg-circuit text-white'
                                        : 'bg-void text-gray'
                                  }`}
                                >
                                  {sub.type}
                                </span>
                                <div>
                                  <p className="text-sm text-gray">{sub.name}</p>
                                  <p className="text-lg font-bold text-white">{sub.chord}</p>
                                </div>
                              </div>
                            </div>
                            <p className="text-xs text-gray mt-2">{sub.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="section-frame p-8 text-center">
                  <p className="text-gray">
                    Cliquez sur un degré pour voir ses détails, substitutions et diagramme
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Common progressions */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-metal text-white uppercase tracking-wider">
                Progressions en {selectedKey}
              </h2>
              <HelpTooltip topicId="compose.progressions">
                <HelpButton topicId="compose.progressions" useModal size="md" variant="subtle" />
              </HelpTooltip>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {progressions.map((prog, i) => (
                <button
                  key={i}
                  className="section-frame p-4 text-left hover:border-blood transition-all"
                  onClick={() => {
                    const firstDegree = prog.degrees[0];
                    if (!firstDegree) return;
                    const degreeIndex = ROMAN_NUMERALS_MAJOR.indexOf(
                      firstDegree as (typeof ROMAN_NUMERALS_MAJOR)[number]
                    );
                    if (degreeIndex >= 0) setSelectedDegree(degreeIndex);
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-white">{prog.name}</p>
                  </div>
                  <p className="text-xs text-gray mb-3">{prog.description}</p>

                  {/* Degree visualization */}
                  <div className="flex gap-1 mb-3">
                    {prog.degrees.map((deg, j) => {
                      const degreeIndex = ROMAN_NUMERALS_MAJOR.indexOf(
                        deg as (typeof ROMAN_NUMERALS_MAJOR)[number]
                      );
                      const color = degreeIndex >= 0 ? DEGREE_COLORS[degreeIndex] : '#3a3a3a';

                      return (
                        <div
                          key={j}
                          className="flex-1 text-center py-2 border border-steel"
                          style={{ backgroundColor: color + '30' }}
                        >
                          <span className="text-sm font-bold" style={{ color }}>
                            {deg}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-xs text-blood mb-2">{prog.emotion}</p>

                  {/* Genre tags */}
                  <div className="flex flex-wrap gap-1">
                    {prog.genre.map((g) => (
                      <span key={g} className="text-xs px-2 py-1 bg-void text-gray">
                        {g}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Scale modes and substitutions */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-metal text-white uppercase tracking-wider">
                Modes & Substitutions de {selectedKey} {keyMode === 'major' ? 'Majeur' : 'Mineur'}
              </h2>
              <div className="flex gap-2">
                <HelpTooltip topicId="scales.modes">
                  <HelpButton topicId="scales.modes" useModal size="md" variant="subtle" />
                </HelpTooltip>
                <HelpTooltip topicId="compose.modulations">
                  <HelpButton topicId="compose.modulations" useModal size="md" variant="subtle" />
                </HelpTooltip>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Available scales */}
              <div className="section-frame p-4">
                <h3 className="text-sm text-gray uppercase tracking-wider mb-3">
                  Modes disponibles
                </h3>
                <div className="space-y-2">
                  {SCALE_TYPES.map((scaleDef) => {
                    const isCompatible =
                      scaleDef.id === keyMode ||
                      scaleDef.id === 'dorian' ||
                      scaleDef.id === 'mixolydian';

                    return (
                      <button
                        key={scaleDef.id}
                        className="w-full p-3 border-2 border-steel bg-blackness hover:border-blood transition-all text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-white">{scaleDef.nameFr}</p>
                            <p className="text-xs text-gray">{scaleDef.intervals.join(' - ')}</p>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 ${isCompatible ? 'bg-toxic' : 'bg-void'}`}
                          >
                            {scaleDef.intervals.join('')}
                          </span>
                        </div>
                        <p className="text-xs text-gray mt-1">{scaleDef.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Substitutions */}
              <div className="section-frame p-4">
                <h3 className="text-sm text-gray uppercase tracking-wider mb-3">
                  Substitutions possibles
                </h3>
                <div className="space-y-3">
                  {/* Secondary dominants */}
                  <div className="border-2 border-steel bg-blackness p-3">
                    <p className="text-xs text-toxic font-bold mb-2">DOMINANTES SECONDAIRES</p>
                    <p className="text-xs text-gray mb-2">
                      Créez une tension temporaire vers chaque degré
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {chords.slice(1, 6).map((chord, i) => (
                        <button
                          key={i}
                          className="px-3 py-1 text-xs border-2 border-steel bg-abyss hover:border-toxic transition-all"
                        >
                          {chord.replace('m', '')}7
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Modal interchange */}
                  <div className="border-2 border-steel bg-blackness p-3">
                    <p className="text-xs text-rust font-bold mb-2">EMPRUNT MODAL</p>
                    <p className="text-xs text-gray mb-2">Empruntez aux gammes voisines</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white w-20">IV → Lydien</span>
                        <span className="text-xs text-gray">{chords[3]}maj7#11</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white w-20">V → Mixolydien</span>
                        <span className="text-xs text-gray">{chords[4]}7</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white w-20">ii → Dorien</span>
                        <span className="text-xs text-gray">{chords[1]}m7</span>
                      </div>
                    </div>
                  </div>

                  {/* Parallel scales */}
                  <div className="border-2 border-steel bg-blackness p-3">
                    <p className="text-xs text-purple font-bold mb-2">TONALITÉS PARALLÈLES</p>
                    <p className="text-xs text-gray mb-2">
                      Changez la tonalité en gardant la même note tonique
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        onClick={() => handleModulation(scaleNotes[3]!)}
                        className="px-2 py-1 text-xs border-2 border-steel bg-abyss hover:border-blood transition-all"
                      >
                        {scaleNotes[3]} Majeur
                      </button>
                      <button
                        onClick={() => {
                          handleModulation(scaleNotes[4]!);
                          setKeyMode('major');
                        }}
                        className="px-2 py-1 text-xs border-2 border-steel bg-abyss hover:border-blood transition-all"
                      >
                        {scaleNotes[4]} Majeur
                      </button>
                      <button
                        onClick={() => {
                          handleModulation(scaleNotes[5]!);
                          setKeyMode('minor');
                        }}
                        className="px-2 py-1 text-xs border-2 border-steel bg-abyss hover:border-blood transition-all"
                      >
                        {scaleNotes[5]} Mineur
                      </button>
                    </div>
                  </div>

                  {/* Relative/Parallel */}
                  <div className="border-2 border-steel bg-blackness p-3">
                    <p className="text-xs text-circuit font-bold mb-2">RELATIVE / PARALLELE</p>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray">Relative mineure:</span>
                        <button
                          onClick={() => {
                            handleModulation(scaleNotes[5]!);
                            setKeyMode('minor');
                          }}
                          className="px-2 py-1 text-xs border-2 border-steel bg-abyss hover:border-toxic transition-all"
                        >
                          {scaleNotes[5]}m
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray">Parallèle majeure:</span>
                        <button
                          onClick={() => {
                            handleModulation(scaleNotes[5]!);
                            setKeyMode('major');
                          }}
                          className="px-2 py-1 text-xs border-2 border-steel bg-abyss hover:border-toxic transition-all"
                        >
                          {scaleNotes[5]}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MetalFooter />
    </div>
  );
}
