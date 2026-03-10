/**
 * useChordPage - Main hook for chords page logic
 *
 * Manages all state and calculations for the chords page:
 * - Root, tonality, degree selection
 * - Chord calculations (diatonic, extensions, alterations)
 * - Voicings cache
 * - Fretboard notes
 * - Category accordion state
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import type { NoteName, ChordQuality, ChordVoicing, ChordDegree, Interval } from '@adagio/types';
import {
  buildChord,
  getChordTension,
  getChordVoicings,
  getDegreeNote,
  CHROMATIC_SCALE,
  GUITAR_TUNING_DISPLAY,
  MAJOR_DEGREE_QUALITIES_EXTENDED,
  MINOR_DEGREE_QUALITIES_EXTENDED,
  EXTENSION_QUALITIES,
} from '@adagio/theory';
import type { FretboardNote } from '../components/FretboardView';

// Alias pour compatibilité
const NOTES = [...CHROMATIC_SCALE];
const GUITAR_TUNING = [...GUITAR_TUNING_DISPLAY];
const MAJOR_DEGREE_QUALITIES = MAJOR_DEGREE_QUALITIES_EXTENDED;
const MINOR_DEGREE_QUALITIES = MINOR_DEGREE_QUALITIES_EXTENDED;

export interface CalculatedChord {
  root: NoteName;
  quality: ChordQuality;
  name: string;
  notes: NoteName[];
  voicings: ChordVoicing[];
}

export interface ChordCategory {
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const CHORD_CATEGORIES: readonly ChordCategory[] = [
  { name: 'Diatonique', description: 'Accords de la gamme', icon: '◈', color: '#22c55e' },
  { name: 'Extensions', description: '9, 11, 13', icon: '⌘', color: '#3b82f6' },
  { name: 'Altérations', description: 'dim, aug, sus', icon: '↻', color: '#ef4444' },
] as const;

export interface UseChordPageReturn {
  // State
  root: NoteName;
  tonality: 'major' | 'minor';
  selectedDegree: string;
  selectedChord: { root: NoteName; quality: ChordQuality } | null;
  selectedVoicingIndex: number;
  openCategories: Record<string, boolean>;

  // Setters
  setTonality: (tonality: 'major' | 'minor') => void;
  setRoot: (note: NoteName) => void;
  setDegree: (degree: string) => void;
  setSelectedVoicingIndex: (index: number) => void;
  toggleCategory: (categoryName: string) => void;

  // Handlers
  handleChordSelect: (chord: CalculatedChord) => void;
  handleRootChange: (note: NoteName) => void;
  handleDegreeChange: (degree: string) => void;

  // Computed values
  currentRoot: NoteName;
  currentQuality: ChordQuality;
  chordNotes: NoteName[];
  chordVoicings: ChordVoicing[];
  selectedVoicing: ChordVoicing | undefined;
  chordTension: ReturnType<typeof getChordTension>;
  diatonicChords: CalculatedChord[];
  extensionChords: CalculatedChord[];
  alterationChords: CalculatedChord[];
  displayedChord: CalculatedChord | undefined;
  fretboardNotes: FretboardNote[];

  // Helpers
  getFingeringFromVoicing: (voicing?: ChordVoicing) => Array<{
    string: number;
    fret: number;
    finger?: number;
    note?: NoteName;
    interval?: Interval;
  }>;
}

export function useChordPage(): UseChordPageReturn {
  // State
  const [root, setRoot] = useState<NoteName>('C');
  const [tonality, setTonality] = useState<'major' | 'minor'>('major');
  const [selectedDegree, setSelectedDegree] = useState<string>('I');
  const [selectedChord, setSelectedChord] = useState<{ root: NoteName; quality: ChordQuality } | null>(null);
  const [selectedVoicingIndex, setSelectedVoicingIndex] = useState<number>(0);

  // État des accordéons ouverts
  const [openCategories, setOpenCategories] = useState({
    'Diatonique': true,
    'Extensions': false,
    'Altérations': false,
  });

  // Basculer une catégorie (une seule ouverte à la fois)
  const toggleCategory = useCallback((categoryName: string) => {
    setOpenCategories(prev => {
      const isOpen = prev[categoryName as keyof typeof prev];
      if (isOpen) {
        return { ...prev, [categoryName]: false };
      }
      return {
        Diatonique: categoryName === 'Diatonique',
        Extensions: categoryName === 'Extensions',
        Altérations: categoryName === 'Altérations',
      };
    });
  }, []);

  // Racine actuelle
  const currentRoot = useMemo(() => {
    if (selectedChord) return selectedChord.root;
    return getDegreeNote(root, selectedDegree as ChordDegree, tonality);
  }, [root, tonality, selectedDegree, selectedChord]);

  // Qualité actuelle
  const currentQuality = useMemo(() => {
    if (selectedChord) return selectedChord.quality;
    return '' as ChordQuality;
  }, [selectedChord]);

  // Notes de l'accord
  const chordNotes = useMemo(() => {
    return buildChord(currentRoot, currentQuality, []);
  }, [currentRoot, currentQuality]);

  // Voicings
  const chordVoicings = useMemo(() => {
    if (chordNotes.length === 0) return [];
    return getChordVoicings(currentRoot, currentQuality, 24);
  }, [currentRoot, currentQuality, chordNotes]);

  // Voicing sélectionné
  const selectedVoicing = useMemo(() => {
    if (chordVoicings.length === 0) return undefined;
    const index = Math.min(selectedVoicingIndex, chordVoicings.length - 1);
    return chordVoicings[index];
  }, [chordVoicings, selectedVoicingIndex]);

  // Tension
  const chordTension = useMemo(() => {
    return getChordTension(currentQuality);
  }, [currentQuality]);

  // Qualités disponibles par catégorie
  const diatonicQualities = useMemo(() => {
    return tonality === 'major'
      ? MAJOR_DEGREE_QUALITIES[selectedDegree] || []
      : MINOR_DEGREE_QUALITIES[selectedDegree] || [];
  }, [tonality, selectedDegree]);

  const diatonicQualitySet = useMemo(() => new Set(diatonicQualities), [diatonicQualities]);

  // Cache des voicings
  const voicingsCache = useMemo(() => {
    const cache = new Map<string, ChordVoicing[]>();
    const allQualities = [...diatonicQualities, ...EXTENSION_QUALITIES] as ChordQuality[];

    for (const quality of allQualities) {
      const cacheKey = `${currentRoot}-${quality}`;
      try {
        cache.set(cacheKey, getChordVoicings(currentRoot, quality, 24));
      } catch {
        cache.set(cacheKey, []);
      }
    }
    return cache;
  }, [currentRoot, diatonicQualities]);

  const getCachedVoicings = useCallback((root: NoteName, quality: ChordQuality): ChordVoicing[] => {
    return voicingsCache.get(`${root}-${quality}`) || [];
  }, [voicingsCache]);

  // Accords diatoniques
  const diatonicChords = useMemo(() => {
    return diatonicQualities.map((quality) => {
      try {
        const notes = buildChord(currentRoot, quality as ChordQuality, []);
        const voicings = getCachedVoicings(currentRoot, quality as ChordQuality);
        return {
          root: currentRoot,
          quality,
          name: `${currentRoot}${quality || ''}`,
          notes,
          voicings,
        };
      } catch (e) {
        return null;
      }
    }).filter(Boolean) as CalculatedChord[];
  }, [currentRoot, diatonicQualities, getCachedVoicings]);

  // Accords extensions
  const extensionChords = useMemo(() => {
    return EXTENSION_QUALITIES
      .filter(q => !diatonicQualitySet.has(q))
      .map((quality) => {
        try {
          const notes = buildChord(currentRoot, quality as ChordQuality, []);
          const voicings = getCachedVoicings(currentRoot, quality as ChordQuality);
          return {
            root: currentRoot,
            quality,
            name: `${currentRoot}${quality}`,
            notes,
            voicings,
          };
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean) as CalculatedChord[];
  }, [currentRoot, diatonicQualitySet, getCachedVoicings]);

  // Accords altérations
  const alterationChords = useMemo(() => {
    const usedQualities = new Set([
      ...diatonicQualitySet,
      ...extensionChords.map(c => c.quality)
    ]);

    return EXTENSION_QUALITIES
      .filter(q => !usedQualities.has(q))
      .map((quality) => {
        try {
          const notes = buildChord(currentRoot, quality as ChordQuality, []);
          const voicings = getCachedVoicings(currentRoot, quality as ChordQuality);
          return {
            root: currentRoot,
            quality,
            name: `${currentRoot}${quality}`,
            notes,
            voicings,
          };
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean) as CalculatedChord[];
  }, [currentRoot, diatonicQualitySet, extensionChords, getCachedVoicings]);

  // Accord affiché
  const displayedChord = useMemo(() => {
    const allChords = [...diatonicChords, ...extensionChords, ...alterationChords];
    return allChords.find(
      c => c.root === currentRoot && c.quality === currentQuality
    ) || diatonicChords[0];
  }, [diatonicChords, extensionChords, alterationChords, currentRoot, currentQuality]);

  // Notes sur le manche
  const fretboardNotes = useMemo(() => {
    if (chordNotes.length === 0) return [];
    const notes: FretboardNote[] = [];

    for (let stringIdx = 0; stringIdx < 6; stringIdx++) {
      const openNote = GUITAR_TUNING[stringIdx] as NoteName;
      const noteIndex = NOTES.indexOf(openNote);
      if (noteIndex === -1) continue;

      for (let fret = 0; fret <= 24; fret++) {
        const currentNoteIndex = (noteIndex + fret) % 12;
        const noteName = NOTES[currentNoteIndex];
        if (!noteName) continue;

        notes.push({
          name: noteName,
          string: stringIdx,
          fret,
          inScale: chordNotes.includes(noteName),
        });
      }
    }
    return notes;
  }, [chordNotes]);

  // Helper: getFingeringFromVoicing
  const getFingeringFromVoicing = useCallback((voicing?: ChordVoicing) => {
    if (!voicing) return [];

    const openNotes: NoteName[] = ['E', 'A', 'D', 'G', 'B', 'E'];
    const chordRoot = voicing.name.charAt(0) as NoteName;
    const qualityMatch = voicing.name.slice(1).match(/^(maj7|m7|7|m|6|m6|dim|aug|sus|add|7sus4|maj9|m9|m11|m13|9|11|13)/);
    const quality = (qualityMatch ? qualityMatch[0] : '') as ChordQuality;
    const chordNotes = buildChord(chordRoot, quality);

    const getIntervalForNote = (note: NoteName): Interval | undefined => {
      const intervals: Interval[] = ['1', 'b2', '2', 'b3', '3', '4', '#4', 'b5', '5', '#5', 'b6', '6', 'b7', '7'];
      const semitones: Record<string, number> = {
        'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5,
        'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
      };
      const rootSemitone = semitones[chordRoot];
      const noteSemitone = semitones[note];
      if (rootSemitone === undefined || noteSemitone === undefined) return undefined;
      const diff = (noteSemitone - rootSemitone + 12) % 12;
      return intervals[diff];
    };

    const positions: Array<{
      string: number;
      fret: number;
      finger?: number;
      note?: NoteName;
      interval?: Interval;
    }> = [];

    for (let diagramString = 0; diagramString <= 5; diagramString++) {
      const voicingString = 5 - diagramString;
      const playedNote = voicing.notes.find(n => n.string === voicingString);

      if (playedNote && playedNote.fret > 0) {
        positions.push({
          string: diagramString,
          fret: playedNote.fret,
          finger: playedNote.finger,
          note: playedNote.note,
          interval: playedNote.interval || getIntervalForNote(playedNote.note)
        });
      } else {
        const openNote = openNotes[diagramString];

        if (openNote && chordNotes.includes(openNote)) {
          positions.push({
            string: diagramString,
            fret: 0,
            note: openNote,
            interval: getIntervalForNote(openNote)
          });
        } else {
          positions.push({ string: diagramString, fret: -1 });
        }
      }
    }

    return positions;
  }, []);

  // Handlers
  const handleChordSelect = useCallback((chord: CalculatedChord) => {
    setSelectedChord({ root: chord.root, quality: chord.quality });
    setSelectedVoicingIndex(0);
  }, []);

  const handleRootChange = useCallback((note: NoteName) => {
    setRoot(note);
    setSelectedChord(null);
    setSelectedVoicingIndex(0);
  }, []);

  const handleDegreeChange = useCallback((degree: string) => {
    setSelectedDegree(degree);
    setSelectedChord(null);
    setSelectedVoicingIndex(0);
  }, []);

  return {
    root,
    tonality,
    selectedDegree,
    selectedChord,
    selectedVoicingIndex,
    openCategories,
    setTonality,
    setRoot,
    setDegree: setSelectedDegree,
    setSelectedVoicingIndex,
    toggleCategory,
    handleChordSelect,
    handleRootChange,
    handleDegreeChange,
    currentRoot,
    currentQuality,
    chordNotes,
    chordVoicings,
    selectedVoicing,
    chordTension,
    diatonicChords,
    extensionChords,
    alterationChords,
    displayedChord,
    fretboardNotes,
    getFingeringFromVoicing,
  };
}
