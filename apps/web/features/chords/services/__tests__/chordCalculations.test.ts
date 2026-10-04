// ============================================================================
// CHORD CALCULATIONS SERVICE TESTS
// Validation des calculs pour l'affichage des diagrammes d'accords
// ============================================================================

import { describe, it, expect } from 'vitest';
import {
  getIntervalInChord,
  voicingToDiagramPositions,
  calculateFretboardForChord,
  parseChordName,
  getFrenchNoteName,
} from '../chordCalculations';
import type { NoteName, ChordVoicing } from '@adagio/types';

describe('chordCalculations - getIntervalInChord', () => {
  // Tests de régression pour le bug de mapping d'intervalles

  it('should return b7 for 10 semitones (minor 7th)', () => {
    expect(getIntervalInChord('C', 'A#')).toBe('b7'); // Bb enharmonic
    expect(getIntervalInChord('C', 'Bb')).toBe('b7');
    expect(getIntervalInChord('D', 'C')).toBe('b7');
  });

  it('should return 7 for 11 semitones (major 7th)', () => {
    expect(getIntervalInChord('C', 'B')).toBe('7');
    expect(getIntervalInChord('E', 'D#')).toBe('7');
    expect(getIntervalInChord('G', 'F#')).toBe('7');
  });

  it('should return b3 for 3 semitones (minor 3rd)', () => {
    expect(getIntervalInChord('C', 'D#')).toBe('b3'); // Eb enharmonic
    expect(getIntervalInChord('C', 'Eb')).toBe('b3');
    expect(getIntervalInChord('A', 'C')).toBe('b3');
  });

  it('should return 3 for 4 semitones (major 3rd)', () => {
    expect(getIntervalInChord('C', 'E')).toBe('3');
    expect(getIntervalInChord('A', 'C#')).toBe('3');
  });

  it('should return 5 for 7 semitones (perfect 5th)', () => {
    expect(getIntervalInChord('C', 'G')).toBe('5');
    expect(getIntervalInChord('E', 'B')).toBe('5');
  });

  it('should return b5 for 6 semitones (diminished 5th)', () => {
    expect(getIntervalInChord('C', 'F#')).toBe('b5'); // Gb enharmonic
    expect(getIntervalInChord('C', 'Gb')).toBe('b5');
  });

  it('should return #4 for 6 semitones (augmented 4th/tritone)', () => {
    // Note: Same as b5 enharmonically, but context determines which
    // For simplicity, we accept both notations as they are enharmonically equivalent
    const result = getIntervalInChord('F', 'B');
    expect(result === '#4' || result === 'b5').toBe(true); // In Lydian context
  });

  it('should handle all chromatic intervals', () => {
    expect(getIntervalInChord('C', 'C')).toBe('1'); // 0 semitones
    expect(getIntervalInChord('C', 'Db')).toBe('b2'); // 1 semitone
    expect(getIntervalInChord('C', 'D')).toBe('2'); // 2 semitones
    expect(getIntervalInChord('C', 'Eb')).toBe('b3'); // 3 semitones
    expect(getIntervalInChord('C', 'E')).toBe('3'); // 4 semitones
    expect(getIntervalInChord('C', 'F')).toBe('4'); // 5 semitones
    expect(getIntervalInChord('C', 'F#')).toBe('b5'); // 6 semitones (or #4)
    expect(getIntervalInChord('C', 'G')).toBe('5'); // 7 semitones
    expect(getIntervalInChord('C', 'G#')).toBe('#5'); // 8 semitones
    expect(getIntervalInChord('C', 'A')).toBe('b6'); // 9 semitones (or bb7)
    expect(getIntervalInChord('C', 'Bb')).toBe('b7'); // 10 semitones
    expect(getIntervalInChord('C', 'B')).toBe('7'); // 11 semitones
  });
});

describe('chordCalculations - voicingToDiagramPositions', () => {
  it('should convert voicing to diagram positions correctly', () => {
    // Mock C major voicing at open position
    const mockVoicing: ChordVoicing = {
      id: 'C-open',
      name: 'C',
      notes: [
        { note: 'E' as NoteName, octave: 4, string: 0, fret: 0, interval: '3' },
        { note: 'C' as NoteName, octave: 3, string: 2, fret: 0, interval: '1' },
        { note: 'G' as NoteName, octave: 3, string: 3, fret: 0, interval: '5' },
      ],
      position: 'root' as const,
      fretRange: [0, 0],
      difficulty: 'easy' as const,
    };

    const positions = voicingToDiagramPositions(mockVoicing);

    // Should have 6 positions (one per string)
    expect(positions.length).toBe(6);

    // Check string numbering (0 = E bass, 5 = E treble)
    positions.forEach((pos, i) => {
      expect(pos.string).toBe(i);
    });

    // Check that played strings have fret 0
    const playedStrings = positions.filter((p) => p.fret === 0);
    expect(playedStrings.length).toBe(3);

    // Check that muted strings have fret -1
    const mutedStrings = positions.filter((p) => p.fret === -1);
    expect(mutedStrings.length).toBe(3);
  });

  it('should handle higher fret positions', () => {
    const mockVoicing: ChordVoicing = {
      id: 'D-5',
      name: 'D',
      notes: [
        { note: 'D' as NoteName, octave: 3, string: 5, fret: 5, interval: '1' },
        { note: 'A' as NoteName, octave: 3, string: 4, fret: 5, interval: '5' },
        { note: 'D' as NoteName, octave: 4, string: 3, fret: 7, interval: '3' },
        { note: 'F#' as NoteName, octave: 4, string: 2, fret: 7, interval: '3' },
      ],
      position: 'root' as const,
      fretRange: [5, 7],
      difficulty: 'medium' as const,
    };

    const positions = voicingToDiagramPositions(mockVoicing);

    const played = positions.filter((p) => p.fret > 0);
    expect(played.length).toBe(4);
  });
});

describe('chordCalculations - parseChordName', () => {
  it('should parse simple chord names', () => {
    expect(parseChordName('C')).toEqual({ root: 'C', quality: '' });
    expect(parseChordName('Dm')).toEqual({ root: 'D', quality: 'm' });
    expect(parseChordName('E7')).toEqual({ root: 'E', quality: '7' });
  });

  it('should parse complex chord names', () => {
    expect(parseChordName('Cmaj7')).toEqual({ root: 'C', quality: 'maj7' });
    expect(parseChordName('Am7b5')).toEqual({ root: 'A', quality: 'm7b5' });
    expect(parseChordName('F#m9')).toEqual({ root: 'F#', quality: 'm9' });
  });

  it('should parse flat note names', () => {
    expect(parseChordName('Dbm7')).toEqual({ root: 'Db', quality: 'm7' });
    expect(parseChordName('Abmaj7')).toEqual({ root: 'Ab', quality: 'maj7' });
    expect(parseChordName('Bb')).toEqual({ root: 'Bb', quality: '' });
  });

  it('should handle alternate quality names', () => {
    expect(parseChordName('Cmajor')).toEqual({ root: 'C', quality: '' });
    expect(parseChordName('Cmin')).toEqual({ root: 'C', quality: 'm' });
    expect(parseChordName('C-')).toEqual({ root: 'C', quality: 'm' });
  });

  it('should default to C for invalid input', () => {
    expect(parseChordName('')).toEqual({ root: 'C', quality: '' });
    expect(parseChordName('Xyz')).toEqual({ root: 'C', quality: '' });
  });
});

describe('chordCalculations - getFrenchNoteName', () => {
  it('should convert note names to French', () => {
    expect(getFrenchNoteName('C')).toBe('DO');
    expect(getFrenchNoteName('D')).toBe('RÉ');
    expect(getFrenchNoteName('E')).toBe('MI');
    expect(getFrenchNoteName('F')).toBe('FA');
    expect(getFrenchNoteName('G')).toBe('SOL');
    expect(getFrenchNoteName('A')).toBe('LA');
    expect(getFrenchNoteName('B')).toBe('SI');
  });

  it('should handle sharps and flats', () => {
    expect(getFrenchNoteName('C#')).toBe('DO♯');
    expect(getFrenchNoteName('Db')).toBe('RÉ♭');
    expect(getFrenchNoteName('F#')).toBe('FA♯');
    expect(getFrenchNoteName('Bb')).toBe('SI♭');
  });
});

describe('chordCalculations - calculateFretboardForChord', () => {
  it('should calculate all notes on fretboard', () => {
    const chordNotes = ['C', 'E', 'G'] as NoteName[];
    const fretboard = calculateFretboardForChord(chordNotes, 12);

    // 6 strings × 13 frets (0-12) = 78 notes
    expect(fretboard.length).toBe(78);

    // All notes should have proper structure
    fretboard.forEach((note) => {
      expect(note.name).toBeTruthy();
      expect(typeof note.fret).toBe('number');
      expect(note.string).toBeGreaterThanOrEqual(0);
      expect(note.string).toBeLessThanOrEqual(5);
      expect(typeof note.inScale).toBe('boolean');
    });
  });

  it('should correctly identify chord notes on fretboard', () => {
    const chordNotes = ['C', 'E', 'G'] as NoteName[];
    const fretboard = calculateFretboardForChord(chordNotes, 12);

    // Count chord notes (C, E, G appear many times)
    const chordNoteCount = fretboard.filter((n) => n.inScale).length;
    expect(chordNoteCount).toBeGreaterThan(0);

    // Check that E string at fret 8 is C
    const lowE8 = fretboard.find((n) => n.string === 0 && n.fret === 8);
    expect(lowE8?.inScale).toBe(true);
    expect(lowE8?.name).toBe('C');
  });

  it('should handle chords with sharps/flats', () => {
    const chordNotes = ['F#', 'A#', 'C#'] as NoteName[];
    const fretboard = calculateFretboardForChord(chordNotes, 12);

    const chordNoteCount = fretboard.filter((n) => n.inScale).length;
    expect(chordNoteCount).toBeGreaterThan(0);
  });
});

describe('chordCalculations - Regression Tests', () => {
  // Tests pour valider les corrections de bugs

  it('BUG FIX: b7 should be 10 semitones, not b6', () => {
    // Avant correction: getIntervalInChord('C', 'Bb') retournait 'b6' (incorrect)
    // Après correction: retourne 'b7' (correct)
    expect(getIntervalInChord('C', 'Bb')).toBe('b7');
  });

  it('BUG FIX: 7 should be 11 semitones, not 6', () => {
    // Avant correction: getIntervalInChord('C', 'B') retournait '6' (incorrect)
    // Après correction: retourne '7' (correct)
    expect(getIntervalInChord('C', 'B')).toBe('7');
  });

  it('BUG FIX: String numbering consistency', () => {
    // Vérifier la cohérence de la numérotation des cordes
    const mockVoicing: ChordVoicing = {
      id: 'test',
      name: 'C',
      notes: [
        { note: 'C' as NoteName, octave: 3, string: 5, fret: 3, interval: '1' },
        { note: 'E' as NoteName, octave: 4, string: 0, fret: 0, interval: '3' },
      ],
      position: 'root' as const,
      fretRange: [0, 3],
      difficulty: 'easy' as const,
    };

    const positions = voicingToDiagramPositions(mockVoicing);

    // string 5 in voicing = string 0 in diagram (basse)
    const bassPos = positions.find((p) => p.string === 0);
    expect(bassPos?.fret).toBe(3);

    // string 0 in voicing = string 5 in diagram (aigu)
    const treblePos = positions.find((p) => p.string === 5);
    expect(treblePos?.fret).toBe(0);
  });
});
