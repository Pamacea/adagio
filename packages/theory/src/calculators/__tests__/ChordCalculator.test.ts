// ============================================================================
// CHORD CALCULATOR TESTS
// Validation des calculs d'accords et positions sur le manche
// ============================================================================

import { describe, it, expect } from 'vitest';
import {
  buildChord,
  getChordVoicings,
  getDegreeNote,
  transposeNote,
  toFlatIfAppropriate,
} from '../ChordCalculator';
import type { NoteName, ChordQuality } from '@adagio/types';

describe('ChordCalculator - buildChord', () => {
  it('should build a C major chord correctly', () => {
    const notes = buildChord('C', '');
    expect(notes).toEqual(['C', 'E', 'G']);
  });

  it('should build a C minor chord correctly', () => {
    const notes = buildChord('C', 'm');
    expect(notes).toEqual(['C', 'D#', 'G']);
  });

  it('should build a C7 chord correctly', () => {
    const notes = buildChord('C', '7');
    expect(notes).toEqual(['C', 'E', 'G', 'A#']);
  });

  it('should build a Cmaj7 chord correctly', () => {
    const notes = buildChord('C', 'maj7');
    expect(notes).toEqual(['C', 'E', 'G', 'B']);
  });

  it('should build chords with flat roots', () => {
    const notes = buildChord('Db', 'm7');
    // Db, Fb(E), Ab, Cb(B) - en version dièse: C#, E, G#, B
    expect(notes).toContain('C#');
    expect(notes).toContain('E');
    expect(notes).toContain('G#');
    expect(notes).toContain('B');
  });

  it('should build diminished chords correctly', () => {
    const notes = buildChord('C', 'dim7');
    expect(notes).toEqual(['C', 'D#', 'F#', 'A']);
  });
});

describe('ChordCalculator - getDegreeNote', () => {
  it('should get correct notes for C major degrees', () => {
    expect(getDegreeNote('C', 'I', 'major')).toBe('C');
    expect(getDegreeNote('C', 'II', 'major')).toBe('D');
    expect(getDegreeNote('C', 'III', 'major')).toBe('E');
    expect(getDegreeNote('C', 'IV', 'major')).toBe('F');
    expect(getDegreeNote('C', 'V', 'major')).toBe('G');
    expect(getDegreeNote('C', 'VI', 'major')).toBe('A');
    expect(getDegreeNote('C', 'VII', 'major')).toBe('B');
  });

  it('should handle flat degrees correctly', () => {
    expect(getDegreeNote('C', 'bII', 'major')).toBe('Db'); // Napoléan
    expect(getDegreeNote('C', 'bIII', 'major')).toBe('Eb');
    expect(getDegreeNote('C', 'bVI', 'major')).toBe('Ab');
  });

  it('should get correct notes for A minor degrees', () => {
    expect(getDegreeNote('A', 'I', 'minor')).toBe('A');
    expect(getDegreeNote('A', 'II', 'minor')).toBe('B');
    expect(getDegreeNote('A', 'III', 'minor')).toBe('C');
    expect(getDegreeNote('A', 'IV', 'minor')).toBe('D');
    expect(getDegreeNote('A', 'V', 'minor')).toBe('E');
  });
});

describe('ChordCalculator - transposeNote', () => {
  it('should transpose notes correctly', () => {
    expect(transposeNote('C', 2)).toBe('D');
    expect(transposeNote('C', 4)).toBe('E');
    expect(transposeNote('C', 7)).toBe('G');
    expect(transposeNote('E', -4)).toBe('C');
    expect(transposeNote('F', 5)).toBe('A#'); // Bb
  });

  it('should handle wraparound correctly', () => {
    expect(transposeNote('A', 4)).toBe('C#'); // Db
    expect(transposeNote('G', 8)).toBe('D#'); // Eb
  });
});

describe('ChordCalculator - toFlatIfAppropriate', () => {
  it('should convert sharps to flats in flat keys', () => {
    expect(toFlatIfAppropriate('C#', 'F')).toBe('Db');
    expect(toFlatIfAppropriate('D#', 'F')).toBe('Eb');
    expect(toFlatIfAppropriate('F#', 'Bb')).toBe('Gb');
    expect(toFlatIfAppropriate('G#', 'Eb')).toBe('Ab');
    expect(toFlatIfAppropriate('A#', 'Bb')).toBe('Bb');
  });

  it('should keep sharps in sharp keys', () => {
    expect(toFlatIfAppropriate('C#', 'G')).toBe('C#');
    expect(toFlatIfAppropriate('D#', 'D')).toBe('D#');
    expect(toFlatIfAppropriate('F#', 'A')).toBe('F#');
  });

  it('should not modify notes without flat equivalents', () => {
    expect(toFlatIfAppropriate('C', 'F')).toBe('C');
    expect(toFlatIfAppropriate('E', 'Bb')).toBe('E');
  });
});

describe('ChordCalculator - getChordVoicings', () => {
  it('should generate voicings for C major', () => {
    const voicings = getChordVoicings('C', '', 12);
    expect(voicings.length).toBeGreaterThan(0);

    // Chaque voicing doit avoir au moins 3 notes
    voicings.forEach(voicing => {
      expect(voicing.notes.length).toBeGreaterThanOrEqual(3);
      expect(voicing.name).toBe('C');
      expect(voicing.fretRange[0]).toBeLessThanOrEqual(voicing.fretRange[1]);
    });
  });

  it('should generate voicings for chords with flats', () => {
    const voicings = getChordVoicings('Db', 'm7', 12);
    expect(voicings.length).toBeGreaterThan(0);

    // Les notes doivent être en dièses en interne
    voicings.forEach(voicing => {
      expect(voicing.notes.length).toBeGreaterThanOrEqual(3);
      // Db devient C# en interne
      expect(voicing.notes[0].note).toMatch(/^(C#|D#|F#|G#|A#|E|G|B)$/);
    });
  });

  it('should correctly set string numbers', () => {
    const voicings = getChordVoicings('E', '', 12);
    expect(voicings.length).toBeGreaterThan(0);

    // Vérifier que les cordes sont entre 0 et 5
    voicings.forEach(voicing => {
      voicing.notes.forEach(note => {
        expect(note.string).toBeGreaterThanOrEqual(0);
        expect(note.string).toBeLessThanOrEqual(5);
      });
    });
  });

  it('should calculate correct intervals', () => {
    const voicings = getChordVoicings('C', '7', 12);
    expect(voicings.length).toBeGreaterThan(0);

    // Pour un C7, on doit avoir les intervalles 1, 3, 5, b7
    const expectedIntervals = ['1', '3', '5', 'b7'];
    voicings.forEach(voicing => {
      const intervals = voicing.notes.map(n => n.interval);
      // Chaque intervalle doit être dans la liste attendue
      intervals.forEach(interval => {
        expect(expectedIntervals).toContain(interval);
      });
    });
  });
});

describe('ChordCalculator - Edge Cases', () => {
  it('should handle all 12 roots', () => {
    const roots: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const flatRoots: NoteName[] = ['Db', 'Eb', 'Gb', 'Ab', 'Bb'];

    roots.forEach(root => {
      expect(() => buildChord(root, 'm7')).not.toThrow();
    });

    flatRoots.forEach(root => {
      expect(() => buildChord(root, 'm7')).not.toThrow();
    });
  });

  it('should handle all chord qualities', () => {
    const qualities: ChordQuality[] = [
      '', 'm', '7', 'm7', 'maj7', 'dim', 'dim7', 'm7b5',
      'aug', 'aug7', 'sus2', 'sus4', '7sus4', 'add9', 'madd9',
      '6', 'm6', '9', 'm9', '11', 'm11', '13', 'm13'
    ];

    qualities.forEach(quality => {
      expect(() => buildChord('C', quality)).not.toThrow();
    });
  });
});

describe('ChordCalculator - Interval Calculation Regression Tests', () => {
  // Test suite pour valider les corrections de bugs d'intervalles

  it('should correctly identify b7 interval (10 semitones)', () => {
    const notes = buildChord('C', '7');
    // C7 = C + E + G + Bb
    // Bb est à 10 demi-tons de C (ou A# en version dièse)
    expect(notes).toContain('A#'); // Bb enharmonic
  });

  it('should correctly identify 7 interval (11 semitones)', () => {
    const notes = buildChord('C', 'maj7');
    // Cmaj7 = C + E + G + B
    // B est à 11 demi-tons de C
    expect(notes).toContain('B');
  });

  it('should correctly identify b3 interval (3 semitones)', () => {
    const notes = buildChord('C', 'm');
    // Cm = C + Eb + G
    // Eb est à 3 demi-tons de C (ou D# en version dièse)
    expect(notes).toContain('D#'); // Eb enharmonic
  });

  it('should correctly identify b5 interval (6 semitones)', () => {
    const notes = buildChord('C', 'm7b5');
    // Cm7b5 = C + Eb + Gb + Bb
    // Gb est à 6 demi-tons de C (ou F# en version dièse)
    expect(notes).toContain('F#'); // Gb enharmonic
  });
});
