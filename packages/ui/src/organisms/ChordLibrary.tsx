/**
 * ChordLibrary - Interactive Chord Library Component
 *
 * Displays chords organized by harmonic function:
 * - Tonique (I, i, vi, VI)
 * - Pré-dominant (ii, iii, IV, iv)
 * - Dominant (V, v, vii°, VII)
 *
 * Features:
 * - Root note selector (all 12 notes)
 * - Tonality toggle (major/minor)
 * - Function filter (tonic/subdominant/dominant)
 */

'use client';

import { useState } from 'react';
import { type NoteName, type ChordQuality, type AxisGroup } from '@adagio/types';
import { ChordCard } from '../molecules/ChordCard';
import { RootSelector } from '../molecules/RootSelector';
import { Button } from '../atoms/Button';
import { cn } from '../lib/cn';

// Basic chord fingerings for open position chords
const COMMON_FINGERINGS: Record<string, Array<{ string: number; fret: number; finger?: number }>> = {
  // Major chords
  'C': [
    { string: 0, fret: 0 }, { string: 1, fret: 1, finger: 1 }, { string: 2, fret: 0 },
    { string: 3, fret: 2, finger: 2 }, { string: 4, fret: 3, finger: 3 }, { string: 5, fret: -1 },
  ],
  'A': [
    { string: 0, fret: 0 }, { string: 1, fret: 2, finger: 2 }, { string: 2, fret: 2, finger: 3 },
    { string: 3, fret: 2, finger: 4 }, { string: 4, fret: 0 }, { string: 5, fret: -1 },
  ],
  'G': [
    { string: 0, fret: 3, finger: 3 }, { string: 1, fret: 0 }, { string: 2, fret: 0 },
    { string: 3, fret: 0 }, { string: 4, fret: 2, finger: 1 }, { string: 5, fret: 3, finger: 2 },
  ],
  'D': [
    { string: 0, fret: 2, finger: 2 }, { string: 1, fret: 2, finger: 2 }, { string: 2, fret: 3, finger: 3 },
    { string: 3, fret: 0 }, { string: 4, fret: -1 }, { string: 5, fret: -1 },
  ],
  'E': [
    { string: 0, fret: 0 }, { string: 1, fret: 0 }, { string: 2, fret: 1, finger: 1 },
    { string: 3, fret: 2, finger: 2 }, { string: 4, fret: 2, finger: 3 }, { string: 5, fret: 0 },
  ],
  'F': [
    { string: 0, fret: 1, finger: 1 }, { string: 1, fret: 1, finger: 1 }, { string: 2, fret: 2, finger: 2 },
    { string: 3, fret: 3, finger: 3 }, { string: 4, fret: 3, finger: 4 }, { string: 5, fret: 1, finger: 1 },
  ],
  // Minor chords
  'Am': [
    { string: 0, fret: 0 }, { string: 1, fret: 1, finger: 1 }, { string: 2, fret: 2, finger: 2 },
    { string: 3, fret: 2, finger: 3 }, { string: 4, fret: 0 }, { string: 5, fret: -1 },
  ],
  'Dm': [
    { string: 0, fret: 1, finger: 1 }, { string: 1, fret: 1, finger: 1 }, { string: 2, fret: 2, finger: 2 },
    { string: 3, fret: 0 }, { string: 4, fret: -1 }, { string: 5, fret: -1 },
  ],
  'Em': [
    { string: 0, fret: 0 }, { string: 1, fret: 0 }, { string: 2, fret: 0 },
    { string: 3, fret: 2, finger: 2 }, { string: 4, fret: 2, finger: 2 }, { string: 5, fret: 0 },
  ],
  // 7th chords
  'Cmaj7': [
    { string: 0, fret: 0 }, { string: 1, fret: 0 }, { string: 2, fret: 0 },
    { string: 3, fret: 2, finger: 1 }, { string: 4, fret: 3, finger: 2 }, { string: 5, fret: -1 },
  ],
  'Fmaj7': [
    { string: 0, fret: 0 }, { string: 1, fret: 0 }, { string: 2, fret: 2, finger: 1 },
    { string: 3, fret: 3, finger: 2 }, { string: 4, fret: 3, finger: 3 }, { string: 5, fret: -1 },
  ],
  'G7': [
    { string: 0, fret: 1, finger: 1 }, { string: 1, fret: 0 }, { string: 2, fret: 0 },
    { string: 3, fret: 0 }, { string: 4, fret: 2, finger: 2 }, { string: 5, fret: 3, finger: 3 },
  ],
  'D7': [
    { string: 0, fret: 2, finger: 2 }, { string: 1, fret: 1, finger: 1 }, { string: 2, fret: 2, finger: 2 },
    { string: 3, fret: 0 }, { string: 4, fret: -1 }, { string: 5, fret: -1 },
  ],
  'A7': [
    { string: 0, fret: 0 }, { string: 1, fret: 2, finger: 2 }, { string: 2, fret: 0 },
    { string: 3, fret: 2, finger: 3 }, { string: 4, fret: 0 }, { string: 5, fret: -1 },
  ],
  'E7': [
    { string: 0, fret: 0 }, { string: 1, fret: 0 }, { string: 2, fret: 1, finger: 1 },
    { string: 3, fret: 0 }, { string: 4, fret: 2, finger: 2 }, { string: 5, fret: 0 },
  ],
  'Am7': [
    { string: 0, fret: 0 }, { string: 1, fret: 1, finger: 1 }, { string: 2, fret: 0 },
    { string: 3, fret: 2, finger: 2 }, { string: 4, fret: 0 }, { string: 5, fret: -1 },
  ],
  'Dm7': [
    { string: 0, fret: 1, finger: 1 }, { string: 1, fret: 1, finger: 1 }, { string: 2, fret: 2, finger: 2 },
    { string: 3, fret: 0 }, { string: 4, fret: -1 }, { string: 5, fret: -1 },
  ],
  'Em7': [
    { string: 0, fret: 0 }, { string: 1, fret: 0 }, { string: 2, fret: 0 },
    { string: 3, fret: 0 }, { string: 4, fret: 2, finger: 2 }, { string: 5, fret: 0 },
  ],
};

export interface ChordLibraryProps {
  initialRoot?: NoteName;
  initialTonality?: 'major' | 'minor';
  selectedDegree?: string;
  onChordSelect?: (chordName: string, degree: string) => void;
  onRootChange?: (root: NoteName) => void;
  onTonalityChange?: (tonality: 'major' | 'minor') => void;
  showFlats?: boolean;
  className?: string;
}

// Chord definitions by degree for major and minor keys
const CHORDS_BY_DEGREE = {
  major: {
    tonic: [
      { degree: 'I', name: 'C', quality: '' as ChordQuality, emotion: 'Stable, Résolu', axisGroup: 'tonic' as AxisGroup },
      { degree: 'vi', name: 'Am', quality: 'm' as ChordQuality, emotion: 'Mélancolique, Émotionnel', axisGroup: 'tonic' as AxisGroup },
    ],
    predominant: [
      { degree: 'ii', name: 'Dm', quality: 'm' as ChordQuality, emotion: 'Mouvement, Preparation', axisGroup: 'subdominant' as AxisGroup },
      { degree: 'iii', name: 'Em', quality: 'm' as ChordQuality, emotion: 'Rêveur, Introspectif', axisGroup: 'subdominant' as AxisGroup },
      { degree: 'IV', name: 'F', quality: '' as ChordQuality, emotion: 'Aventure, Départ', axisGroup: 'subdominant' as AxisGroup },
    ],
    dominant: [
      { degree: 'V', name: 'G7', quality: '7' as ChordQuality, emotion: 'Tension, Attente', axisGroup: 'dominant' as AxisGroup },
      { degree: 'vii°', name: 'Bdim', quality: 'dim' as ChordQuality, emotion: 'Dissonance, Suspense', axisGroup: 'dominant' as AxisGroup },
    ],
  },
  minor: {
    tonic: [
      { degree: 'i', name: 'Am', quality: 'm' as ChordQuality, emotion: 'Mélancolie, Résolution', axisGroup: 'tonic' as AxisGroup },
      { degree: 'VI', name: 'F', quality: '' as ChordQuality, emotion: 'Lueur d\'espoir', axisGroup: 'tonic' as AxisGroup },
    ],
    predominant: [
      { degree: 'ii°', name: 'Bdim', quality: 'dim' as ChordQuality, emotion: 'Tension sombre', axisGroup: 'subdominant' as AxisGroup },
      { degree: 'iv', name: 'Dm', quality: 'm' as ChordQuality, emotion: 'Soulful, Réconfort', axisGroup: 'subdominant' as AxisGroup },
    ],
    dominant: [
      { degree: 'v', name: 'Em7', quality: 'm7' as ChordQuality, emotion: 'Tension douce', axisGroup: 'dominant' as AxisGroup },
      { degree: 'VII', name: 'G7', quality: '7' as ChordQuality, emotion: 'Tension majeure', axisGroup: 'dominant' as AxisGroup },
    ],
  },
};

export function ChordLibrary({
  initialRoot = 'C',
  initialTonality = 'major',
  selectedDegree,
  onChordSelect,
  onRootChange,
  onTonalityChange,
  showFlats = false,
  className,
}: ChordLibraryProps) {
  const [root, setRoot] = useState<NoteName>(initialRoot);
  const [tonality, setTonality] = useState<'major' | 'minor'>(initialTonality);
  const [filterFunction, setFilterFunction] = useState<'tonic' | 'predominant' | 'dominant' | null>(null);

  const chords = CHORDS_BY_DEGREE[tonality];
  const isFiltered = filterFunction !== null;

  const handleRootChange = (newRoot: NoteName) => {
    setRoot(newRoot);
    onRootChange?.(newRoot);
  };

  const handleTonalityChange = (newTonality: 'major' | 'minor') => {
    setTonality(newTonality);
    setFilterFunction(null);
    onTonalityChange?.(newTonality);
  };

  const handleChordClick = (chordName: string, degree: string) => {
    onChordSelect?.(chordName, degree);
  };

  const getFingerings = (chordName: string) => {
    return COMMON_FINGERINGS[chordName] || COMMON_FINGERINGS['C']!;
  };

  const transposeName = (baseName: string, targetRoot: NoteName): string => {
    const baseRoot = baseName.charAt(0) as NoteName;
    const quality = baseName.substring(1);
    return targetRoot + quality;
  };

  // Style pour les sections
  const getSectionStyle = (func: 'tonic' | 'predominant' | 'dominant', isActive: boolean) => {
    const colors = {
      tonic: 'border-blood',
      predominant: 'border-rust',
      dominant: 'border-b7 border-red-600',
    };
    return cn(
      'section-frame p-4 transition-all',
      colors[func],
      isActive && 'border-2'
    );
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header with title and controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-bold text-white">
            Bibliothèque d&apos;accords
          </h2>

          {/* Tonality toggle */}
          <div className="flex items-center gap-2 bg-blackness rounded-lg p-1 border border-steel">
            <button
              onClick={() => handleTonalityChange('major')}
              className={cn(
                'flex-1 px-4 py-2 text-sm font-bold uppercase transition-all',
                tonality === 'major'
                  ? 'bg-toxic border-blood text-white'
                  : 'text-gray hover:text-white'
              )}
            >
              Majeur
            </button>
            <button
              onClick={() => handleTonalityChange('minor')}
              className={cn(
                'flex-1 px-4 py-2 text-sm font-bold uppercase transition-all',
                tonality === 'minor'
                  ? 'bg-toxic border-blood text-white'
                  : 'text-gray hover:text-white'
              )}
            >
              Mineur
            </button>
          </div>
        </div>

        {/* Root note selector */}
        <RootSelector
          value={root}
          onChange={handleRootChange}
          showFlats={showFlats}
        />

        {/* Function filter buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterFunction(null)}
            className={cn(
              'px-4 py-2 text-sm font-bold uppercase border-2 transition-all',
              filterFunction === null
                ? 'border-blood bg-toxic text-white'
                : 'border-steel text-gray hover:text-white'
            )}
          >
            Tous
          </button>
          <button
            onClick={() => setFilterFunction('tonic')}
            className={cn(
              'px-4 py-2 text-sm font-bold uppercase border-2 transition-all',
              filterFunction === 'tonic'
                ? 'border-blood bg-toxic text-white'
                : 'border-steel text-gray hover:text-white'
            )}
          >
            Tonique (T)
          </button>
          <button
            onClick={() => setFilterFunction('predominant')}
            className={cn(
              'px-4 py-2 text-sm font-bold uppercase border-2 transition-all',
              filterFunction === 'predominant'
                ? 'border-rust bg-toxic text-white'
                : 'border-steel text-gray hover:text-white'
            )}
          >
            Pré-dominant (S)
          </button>
          <button
            onClick={() => setFilterFunction('dominant')}
            className={cn(
              'px-4 py-2 text-sm font-bold uppercase border-2 transition-all',
              filterFunction === 'dominant'
                ? 'border-b7 border-red-600 bg-toxic text-white'
                : 'border-steel text-gray hover:text-white'
            )}
          >
            Dominant (D)
          </button>
        </div>

        {/* Current key indicator */}
        <div className="text-sm text-gray">
          Tonalité actuelle : <span className="text-blood font-semibold">{root} {tonality === 'major' ? 'Majeur' : 'Mineur'}</span>
        </div>
      </div>

      {/* Chord sections */}
      {(!isFiltered || filterFunction === 'tonic') && (
        <section className={getSectionStyle('tonic', filterFunction === 'tonic')}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-toxic border border-blood flex items-center justify-center text-xs font-bold">T</span>
            <span className="text-blood">Fonction Tonique</span>
            <span className="text-sm font-normal text-gray">- Stabilité, Résolution</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {chords.tonic.map((chord) => {
              const fullName = transposeName(chord.name, root);
              const isSelected = selectedDegree === chord.degree;
              return (
                <ChordCard
                  key={chord.degree}
                  name={fullName}
                  root={root}
                  quality={chord.quality}
                  positions={getFingerings(chord.name)}
                  function="Tonique"
                  degree={chord.degree}
                  emotion={chord.emotion}
                  axisGroup={chord.axisGroup}
                  onClick={() => handleChordClick(fullName, chord.degree)}
                  selected={isSelected}
                />
              );
            })}
          </div>
        </section>
      )}

      {(!isFiltered || filterFunction === 'predominant') && (
        <section className={getSectionStyle('predominant', filterFunction === 'predominant')}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-toxic border border-rust flex items-center justify-center text-xs font-bold">S</span>
            <span className="text-rust">Fonction Pré-dominante</span>
            <span className="text-sm font-normal text-gray">- Mouvement, Départ</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {chords.predominant.map((chord) => {
              const fullName = transposeName(chord.name, root);
              const isSelected = selectedDegree === chord.degree;
              return (
                <ChordCard
                  key={chord.degree}
                  name={fullName}
                  root={root}
                  quality={chord.quality}
                  positions={getFingerings(chord.name)}
                  function="Pré-dominant"
                  degree={chord.degree}
                  emotion={chord.emotion}
                  axisGroup={chord.axisGroup}
                  onClick={() => handleChordClick(fullName, chord.degree)}
                  selected={isSelected}
                />
              );
            })}
          </div>
        </section>
      )}

      {(!isFiltered || filterFunction === 'dominant') && (
        <section className={getSectionStyle('dominant', filterFunction === 'dominant')}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-toxic border border-b7 flex items-center justify-center text-xs font-bold">D</span>
            <span className="text-b7">Fonction Dominante</span>
            <span className="text-sm font-normal text-gray">- Tension, Attente</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {chords.dominant.map((chord) => {
              const fullName = transposeName(chord.name, root);
              const isSelected = selectedDegree === chord.degree;
              return (
                <ChordCard
                  key={chord.degree}
                  name={fullName}
                  root={root}
                  quality={chord.quality}
                  positions={getFingerings(chord.name)}
                  function="Dominant"
                  degree={chord.degree}
                  emotion={chord.emotion}
                  axisGroup={chord.axisGroup}
                  onClick={() => handleChordClick(fullName, chord.degree)}
                  selected={isSelected}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Empty state */}
      {isFiltered && !chords[filterFunction as keyof typeof chords] && (
        <div className="text-center text-gray py-8">
          Aucun accord pour cette fonction
        </div>
      )}
    </div>
  );
}
