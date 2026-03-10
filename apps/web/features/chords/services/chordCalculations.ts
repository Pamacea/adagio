// ============================================================================
// CHORD CALCULATIONS SERVICE
// Business logic for chord analysis, difficulty, and available chords
// Separates UI from theory calculations
// ============================================================================

import type {
  NoteName,
  ChordQuality,
  ChordDegree,
  ChordVoicing,
  FretboardNote as FretboardNoteType,
  Interval,
} from '@adagio/types';
import {
  buildChord,
  getChordTension,
  getChordVoicings,
  getDegreeNote,
} from '@adagio/theory';

// ============================================================================
// CONSTANTS - Chord qualities by degree and tonality
// ============================================================================

/**
 * Qualités d'accords diatoniques par degré (majeur)
 * Note: Utilise string[] pour inclure des variations non-standard
 */
export const MAJOR_DEGREE_QUALITIES: Record<string, string[]> = {
  'I': ['', 'maj7', '6', 'add9', '6add9', 'maj9'],
  'II': ['m', 'm7', 'm6', 'm9', 'm11', 'madd9'],
  'III': ['m', 'm7', 'm6', 'm9', 'madd9'],
  'IV': ['', 'maj7', '6', 'add9', '6add9', 'maj9'],
  'V': ['7', '9', '11', '13', '7sus4', '13sus4'],
  'VI': ['m', 'm7', 'm6', 'm9', 'm11', 'madd9'],
  'VII': ['m7b5', 'm7b5b9', 'm7b11'],
};

/**
 * Qualités d'accords diatoniques par degré (mineur)
 * Note: Utilise string[] pour inclure des variations non-standard
 */
export const MINOR_DEGREE_QUALITIES: Record<string, string[]> = {
  'I': ['m', 'm7', 'm6', 'm9', 'm11', 'madd9'],
  'II': ['m7b5', 'm7b5b9', 'dim7', 'm7b5b11'],
  'III': ['', 'maj7', '6', 'add9'],
  'IV': ['m', 'm7', 'm6', 'm9', 'm11'],
  'V': ['7', '7alt', '7#11', '7#9'],
  'VI': ['', 'maj7', '6', 'add9', '6add9'],
  'VII': ['', '7', 'maj7'],
};

/**
 * Qualités d'accords supplémentaires (extensions, altérations)
 */
export const EXTENSION_QUALITIES: string[] = [
  'aug', 'aug7', 'dim', 'dim7', 'sus2', 'sus4', '7sus4',
  '11', 'm11', '13', 'm13'
];

/**
 * Standard guitar tuning (high to low for display)
 */
export const GUITAR_TUNING: NoteName[] = ['E', 'B', 'G', 'D', 'A', 'E'];

/**
 * All chromatic notes
 */
export const CHROMATIC_NOTES: NoteName[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

// ============================================================================
// TYPES
// ============================================================================

/**
 * Enriched chord with calculated properties
 */
export interface CalculatedChord {
  root: NoteName;
  quality: ChordQuality;
  name: string;
  notes: NoteName[];
  voicings: ChordVoicing[];
  tension: ReturnType<typeof getChordTension>;
}

/**
 * Chord difficulty rating
 */
export type ChordDifficulty = 'easy' | 'medium' | 'hard';

/**
 * Chord difficulty analysis
 */
export interface ChordDifficultyAnalysis {
  level: ChordDifficulty;
  reasons: string[];
  tips: string[];
}

// ============================================================================
// CHORD AVAILABILITY
// ============================================================================

/**
 * Get available chord qualities for a specific degree and tonality
 *
 * @param degree - The scale degree (I, II, III, etc.)
 * @param tonality - 'major' or 'minor'
 * @returns Array of available chord qualities
 */
export function getAvailableChordsForDegree(
  degree: ChordDegree,
  tonality: 'major' | 'minor'
): string[] {
  const qualities = tonality === 'major'
    ? MAJOR_DEGREE_QUALITIES
    : MINOR_DEGREE_QUALITIES;

  return qualities[degree] || [];
}

/**
 * Get all available chords (diatonic + extensions) for a degree
 *
 * @param degree - The scale degree
 * @param tonality - 'major' or 'minor'
 * @param includeExtensions - Whether to include non-diatonic extensions
 * @returns Array of chord qualities
 */
export function getAllChordsForDegree(
  degree: ChordDegree,
  tonality: 'major' | 'minor',
  includeExtensions = true
): string[] {
  const diatonic = getAvailableChordsForDegree(degree, tonality);

  if (!includeExtensions) {
    return diatonic;
  }

  // Add extensions that aren't already in diatonic
  const diatonicSet = new Set(diatonic);
  const extensions = EXTENSION_QUALITIES.filter(q => !diatonicSet.has(q as ChordQuality));

  return [...diatonic, ...extensions];
}

// ============================================================================
// CHORD CALCULATIONS
// ============================================================================

/**
 * Calculate chord with all its properties
 *
 * @param root - Root note of the chord
 * @param quality - Chord quality
 * @param fretCount - Number of frets for voicing calculation (default: 24)
 * @returns Complete calculated chord data
 */
export function calculateChord(
  root: NoteName,
  quality: ChordQuality,
  fretCount = 24
): CalculatedChord {
  const notes = buildChord(root, quality, []);
  const voicings = getChordVoicings(root, quality, fretCount);
  const tension = getChordTension(quality);

  return {
    root,
    quality,
    name: `${root}${quality || ''}`,
    notes,
    voicings,
    tension,
  };
}

/**
 * Calculate multiple chords for a degree in a key
 *
 * @param key - The key root note
 * @param degree - The scale degree
 * @param tonality - 'major' or 'minor'
 * @param fretCount - Number of frets for voicing calculation
 * @returns Array of calculated chords
 */
export function calculateChordsForDegree(
  key: NoteName,
  degree: ChordDegree,
  tonality: 'major' | 'minor',
  fretCount = 24
): CalculatedChord[] {
  const root = getDegreeNote(key, degree, tonality);
  const qualities = getAvailableChordsForDegree(degree, tonality);

  return qualities
    .map((quality) => {
      try {
        return calculateChord(root, quality as ChordQuality, fretCount);
      } catch {
        return null;
      }
    })
    .filter((chord): chord is CalculatedChord => chord !== null);
}

/**
 * Calculate extension chords (non-diatonic but commonly used)
 *
 * @param root - Root note
 * @param usedQualities - Qualities already used (to avoid duplicates)
 * @param fretCount - Number of frets for voicing calculation
 * @returns Array of calculated extension chords
 */
export function calculateExtensionChords(
  root: NoteName,
  usedQualities: Set<ChordQuality>,
  fretCount = 24
): CalculatedChord[] {
  return EXTENSION_QUALITIES
    .filter(q => !usedQualities.has(q as ChordQuality))
    .map((quality) => {
      try {
        return calculateChord(root, quality as ChordQuality, fretCount);
      } catch {
        return null;
      }
    })
    .filter((chord): chord is CalculatedChord => chord !== null);
}

// ============================================================================
// INTERVAL CALCULATIONS
// ============================================================================

/**
 * Get the interval of a note relative to a chord root
 *
 * @param chordRoot - Root note of the chord
 * @param note - Note to find interval for
 * @returns Interval or undefined if not found
 */
export function getIntervalInChord(chordRoot: NoteName, note: NoteName): Interval | undefined {
  // Semitone values for notes
  const semitones: Record<NoteName, number> = {
    'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5,
    'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
  };

  // Interval mapping by semitone difference
  const intervals: Interval[] = ['1', 'b2', '2', 'b3', '3', '4', '#4', 'b5', '5', '#5', 'b6', '6', 'b7', '7'];

  const rootSemitone = semitones[chordRoot];
  const noteSemitone = semitones[note];
  const diff = (noteSemitone - rootSemitone + 12) % 12;

  return intervals[diff];
}

/**
 * Calculate tension notes (notes that want to resolve)
 *
 * @param chordRoot - Root note of the chord
 * @param quality - Chord quality
 * @returns Array of tension notes
 */
export function calculateTensionNotes(chordRoot: NoteName, quality: ChordQuality): NoteName[] {
  const tensionNotes: NoteName[] = [];

  // Transpose helper
  const transpose = (note: NoteName, semitones: number): NoteName => {
    const notes = CHROMATIC_NOTES;
    const index = notes.indexOf(note);
    const newIndex = ((index + semitones) % 12 + 12) % 12;
    return notes[newIndex] ?? note; // Fallback to original note
  };

  // The 7th and 4th create tension
  if (quality === '7' || quality === '9' || quality === '13' || quality === 'm7' || quality === 'm9' || quality === 'm13') {
    tensionNotes.push(transpose(chordRoot, 10)); // b7
  }
  if (quality === 'maj7' || quality === '9') {
    tensionNotes.push(transpose(chordRoot, 11)); // 7
  }
  if (quality === 'sus4' || quality === '7sus4') {
    tensionNotes.push(transpose(chordRoot, 5)); // 4 (resolves to 3)
  }
  if (quality === 'dim7' || quality === 'm7b5') {
    tensionNotes.push(transpose(chordRoot, 6)); // b5
  }

  return tensionNotes;
}

// ============================================================================
// DIFFICULTY ANALYSIS
// ============================================================================

/**
 * Determine the difficulty level of a chord
 *
 * @param quality - Chord quality
 * @param voicing - Optional voicing to analyze
 * @returns Difficulty analysis with level, reasons, and tips
 */
export function analyzeChordDifficulty(
  quality: ChordQuality,
  voicing?: ChordVoicing
): ChordDifficultyAnalysis {
  const reasons: string[] = [];
  const tips: string[] = [];
  let level: ChordDifficulty = 'easy';

  // Analyze quality complexity
  const simpleQualities: ChordQuality[] = ['', 'm', '7', 'm7', 'sus2', 'sus4'];
  const mediumQualities: ChordQuality[] = ['maj7', 'm6', '6', 'add9', 'madd9', '7sus4', 'm9'];
  const hardQualities: ChordQuality[] = ['dim', 'dim7', 'm7b5', 'aug', 'aug7', '11', 'm11', '13', 'm13'];

  if (hardQualities.includes(quality)) {
    level = 'hard';
    reasons.push('Structure d\'accord complexe avec nombreuses notes altérées');

    if (quality.includes('dim')) {
      reasons.push('Les accords diminués nécessitent une précision de doigté');
      tips.push('Commencez par les positions en forme de "dim7" en barré');
    }
    if (quality.includes('aug')) {
      reasons.push('Les accords augmentés ont un intervalle de quinte augmentée');
      tips.push('Utilisez principalement comme accord de passage');
    }
    if (quality.includes('11') || quality.includes('13')) {
      reasons.push('Les extensions 11 et 13 ajoutent de la complexité');
      tips.push('Privilégiez les voicings de jazz (3-4 notes)');
    }
  } else if (mediumQualities.includes(quality)) {
    level = 'medium';
    reasons.push('Accord intermédiaire avec extensions ou altérations');
    tips.push('Maîtrisez d\'abord les accords de base (majeur, mineur, 7e)');
  } else {
    level = 'easy';
    reasons.push('Accord de base, essentiel pour débuter');
  }

  // Analyze voicing difficulty if provided
  if (voicing) {
    const [minFret, maxFret] = voicing.fretRange;
    const fretSpan = maxFret - minFret;

    if (fretSpan > 5) {
      if (level === 'easy') level = 'medium';
      reasons.push(`Écart important entre les frettes (${fretSpan} frettes)`);
      tips.push('Essayez une position différente si trop difficile');
    }

    // Check for barre chords
    const fretCounts = voicing.notes.reduce((acc, note) => {
      if (note.fret > 0) {
        acc[note.fret] = (acc[note.fret] || 0) + 1;
      }
      return acc;
    }, {} as Record<number, number>);

    const hasBarre = Object.values(fretCounts).some(count => count >= 5);

    if (hasBarre && level === 'easy') {
      level = 'medium';
      reasons.push('Nécessite un barré');
      tips.push('Placez votre index bien à plat pour le barré');
    }

    if (hasBarre && fretSpan > 4) {
      level = 'hard';
      reasons.push('Barré difficile avec grand écart');
      tips.push('Travaillez la force et la position du barré progressivement');
    }
  }

  return { level, reasons, tips };
}

/**
 * Get a simple difficulty level for a chord
 *
 * @param quality - Chord quality
 * @param voicing - Optional voicing to analyze
 * @returns Simple difficulty level
 */
export function getChordDifficulty(
  quality: ChordQuality,
  voicing?: ChordVoicing
): ChordDifficulty {
  return analyzeChordDifficulty(quality, voicing).level;
}

// ============================================================================
// FRETBOARD CALCULATIONS
// ============================================================================

/**
 * Calculate notes on the fretboard for a given chord
 *
 * @param chordNotes - Notes in the chord
 * @param fretCount - Number of frets to calculate (default: 24)
 * @returns Array of fretboard notes
 */
export function calculateFretboardForChord(
  chordNotes: NoteName[],
  fretCount = 24
): FretboardNoteType[] {
  const notes: FretboardNoteType[] = [];

  for (let stringIdx = 0; stringIdx < 6; stringIdx++) {
    const openNote = GUITAR_TUNING[stringIdx];
    if (!openNote) continue;
    const noteIndex = CHROMATIC_NOTES.indexOf(openNote);
    if (noteIndex === -1) continue;

    for (let fret = 0; fret <= fretCount; fret++) {
      const currentNoteIndex = (noteIndex + fret) % 12;
      const noteName = CHROMATIC_NOTES[currentNoteIndex] ?? 'C';
      if (!noteName) continue;

      notes.push({
        name: noteName,
        octave: 4 + Math.floor((noteIndex + fret) / 12),
        string: stringIdx,
        fret,
        inScale: chordNotes.includes(noteName),
        interval: chordNotes.includes(noteName) ? '1' as Interval : undefined,
      });
    }
  }

  return notes;
}

// ============================================================================
// VOICING CONVERSION
// ============================================================================

/**
 * Convert a ChordVoicing to diagram positions
 * Useful for rendering chord diagrams
 *
 * @param voicing - The voicing to convert
 * @returns Array of positions for diagram rendering
 */
export interface DiagramPosition {
  string: number;  // 0=E bass to 5=E treble (left to right)
  fret: number;    // -1=muted, 0=open, >0=fret number
  finger?: number;
  note?: NoteName;
  interval?: Interval;
}

export function voicingToDiagramPositions(voicing: ChordVoicing): DiagramPosition[] {
  // Standard tuning for diagram (E A D G B E - bass to treble)
  const openNotes: NoteName[] = ['E', 'A', 'D', 'G', 'B', 'E'];

  // Extract root and quality from voicing name
  const chordRoot = voicing.name.charAt(0) as NoteName;
  const qualityMatch = voicing.name.slice(1).match(/^(maj7|m7|7|m|6|m6|dim|aug|sus|add|7sus4|maj9|m9|m11|m13|9|11|13)/);
  const quality = (qualityMatch ? qualityMatch[0] : '') as ChordQuality;

  // Build chord to get intervals
  const chordNotes = buildChord(chordRoot, quality);

  const positions: DiagramPosition[] = [];

  // For each string in the diagram (0=E bass left, 5=E treble right)
  for (let diagramString = 0; diagramString <= 5; diagramString++) {
    // Find corresponding note in voicing
    // voicing.notes[].string: 0=high E, 5=low E
    const voicingString = 5 - diagramString;
    const playedNote = voicing.notes.find(n => n.string === voicingString);

    if (playedNote && playedNote.fret > 0) {
      // String is played at a fret
      positions.push({
        string: diagramString,
        fret: playedNote.fret,
        finger: playedNote.finger,
        note: playedNote.note,
        interval: playedNote.interval || getIntervalInChord(chordRoot, playedNote.note),
      });
    } else {
      // String is not played in voicing
      const openNote = openNotes[diagramString];

      if (openNote && chordNotes.includes(openNote)) {
        // Open string (note is in chord)
        positions.push({
          string: diagramString,
          fret: 0,
          note: openNote,
          interval: getIntervalInChord(chordRoot, openNote),
        });
      } else {
        // Muted string
        positions.push({ string: diagramString, fret: -1 });
      }
    }
  }

  return positions;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get French name for a note
 *
 * @param note - Note name in English
 * @returns French note name
 */
export function getFrenchNoteName(note: NoteName): string {
  const NOTE_FR: Record<string, string> = {
    'C': 'DO', 'C#': 'DO♯', 'Db': 'RÉ♭', 'D': 'RÉ', 'D#': 'RÉ♯', 'Eb': 'MI♭',
    'E': 'MI', 'F': 'FA', 'F#': 'FA♯', 'Gb': 'SOL♭', 'G': 'SOL', 'G#': 'SOL♯',
    'Ab': 'LA♭', 'A': 'LA', 'A#': 'LA♯', 'Bb': 'SI♭', 'B': 'SI',
  };
  return NOTE_FR[note] || note;
}

/**
 * Parse chord name into root and quality
 *
 * @param chordName - Full chord name (e.g., "Cmaj7", "Am9", "F#m7b5")
 * @returns Object with root and quality
 */
export function parseChordName(chordName: string): { root: NoteName; quality: ChordQuality } {
  // Match root note (including sharps/flats) followed by quality
  const match = chordName.match(/^([A-G][#b]?)(.*)$/);

  if (!match) {
    return { root: 'C', quality: '' };
  }

  const [, root, quality] = match;

  // Normalize quality
  let normalizedQuality = quality as ChordQuality;
  if (quality === 'major' || quality === 'M') normalizedQuality = '' as ChordQuality;
  if (quality === '-' || quality === 'min') normalizedQuality = 'm' as ChordQuality;

  return {
    root: root as NoteName,
    quality: normalizedQuality,
  };
}
