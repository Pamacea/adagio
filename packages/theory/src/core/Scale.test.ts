// ============================================================================
// SCALE - Musical scale class tests
// ============================================================================
//
// Tests pour la classe Scale et ses méthodes de factory
// ============================================================================

import { describe, it, expect } from 'vitest';
import { Scale } from './Scale';
import { Note } from './Note';
import type { NoteName } from '@adagio/types';

describe('Scale', () => {
  describe('constructor', () => {
    it('should create a scale with root, intervals, and name', () => {
      const scale = new Scale('C', ['1', '2', '3'], 'Test Scale');

      expect(scale.root).toBe('C');
      expect(scale.intervals).toEqual(['1', '2', '3']);
      expect(scale.name).toBe('Test Scale');
    });

    it('should default name to "Custom Scale" if not provided', () => {
      const scale = new Scale('C', ['1', '2', '3']);

      expect(scale.name).toBe('Custom Scale');
    });

    it('should accept any valid note name as root', () => {
      const notes: NoteName[] = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'];

      notes.forEach(note => {
        const scale = new Scale(note, ['1', '2', '3']);
        expect(scale.root).toBe(note);
      });
    });

    it('should accept any interval array', () => {
      const intervals = ['1', 'b3', '4', '#4', '5', 'b7'];
      const scale = new Scale('C', intervals, 'Blues');

      expect(scale.intervals).toEqual(intervals);
    });
  });

  describe('getNotes', () => {
    it('should return correct notes for C major scale', () => {
      const scale = new Scale('C', ['1', '2', '3', '4', '5', '6', '7'], 'Major');
      const notes = scale.getNotes(4);

      expect(notes).toHaveLength(7);
      expect(notes[0]?.toString()).toBe('C4');
      expect(notes[1]?.toString()).toBe('D4');
      expect(notes[2]?.toString()).toBe('E4');
      expect(notes[3]?.toString()).toBe('F4');
      expect(notes[4]?.toString()).toBe('G4');
      expect(notes[5]?.toString()).toBe('A4');
      expect(notes[6]?.toString()).toBe('B4');
    });

    it('should return Note instances', () => {
      const scale = new Scale('C', ['1', '3', '5']);
      const notes = scale.getNotes();

      notes.forEach(note => {
        expect(note).toBeInstanceOf(Note);
      });
    });

    it('should use default octave 4 if not specified', () => {
      const scale = new Scale('C', ['1', '5']);
      const notes = scale.getNotes();

      expect(notes[0]?.octave).toBe(4);
      expect(notes[1]?.octave).toBe(4);
    });

    it('should respect the octave parameter', () => {
      const scale = new Scale('C', ['1', '5']);
      const notes3 = scale.getNotes(3);
      const notes5 = scale.getNotes(5);

      expect(notes3[0]?.octave).toBe(3);
      expect(notes5[0]?.octave).toBe(5);
    });

    it('should handle chromatic scale', () => {
      const chromaticIntervals = ['1', '#1', '2', '#2', '3', '4', '#4', '5', '#5', '6', '#6', '7'];
      const scale = new Scale('C', chromaticIntervals, 'Chromatic');
      const notes = scale.getNotes();

      expect(notes).toHaveLength(12);
      expect(notes[0]?.toString()).toBe('C4');
      expect(notes[1]?.toString()).toBe('C#4');
      expect(notes[11]?.toString()).toBe('B4');
    });

    it('should handle accidentals in root note', () => {
      const scale = new Scale('F#', ['1', '2', '3', '4', '5', '6', '7'], 'Major');
      const notes = scale.getNotes(4);

      expect(notes[0]?.toString()).toBe('F#4');
      expect(notes[1]?.toString()).toBe('G#4');
      expect(notes[2]?.toString()).toBe('A#4');
    });

    it('should handle flat root notes', () => {
      const scale = new Scale('Bb', ['1', '2', '3', '4', '5', '6', '7'], 'Major');
      const notes = scale.getNotes(4);

      expect(notes[0]?.toString()).toBe('A#4'); // Bb is stored as A#
      expect(notes[1]?.toString()).toBe('C5');
      expect(notes[2]?.toString()).toBe('D5');
    });

    it('should handle intervals that cross octave boundary', () => {
      const scale = new Scale('C', ['1', '7']);
      const notes = scale.getNotes(4);

      expect(notes[0]?.toString()).toBe('C4');
      expect(notes[1]?.toString()).toBe('B4'); // B is in same octave as C4
    });

    it('should handle extension intervals (above octave)', () => {
      const scale = new Scale('C', ['1', '9', '11']);
      const notes = scale.getNotes(4);

      expect(notes[0]?.toString()).toBe('C4');
      expect(notes[1]?.toString()).toBe('D5'); // 9th is one octave above 2nd
      expect(notes[2]?.toString()).toBe('F5'); // 11th is one octave above 4th
    });
  });

  describe('contains', () => {
    it('should return true for notes in C major scale', () => {
      const scale = new Scale('C', ['1', '2', '3', '4', '5', '6', '7'], 'Major');

      expect(scale.contains(new Note('C', 4))).toBe(true);
      expect(scale.contains(new Note('D', 4))).toBe(true);
      expect(scale.contains(new Note('E', 4))).toBe(true);
      expect(scale.contains(new Note('F', 4))).toBe(true);
      expect(scale.contains(new Note('G', 4))).toBe(true);
      expect(scale.contains(new Note('A', 4))).toBe(true);
      expect(scale.contains(new Note('B', 4))).toBe(true);
    });

    it('should return false for notes not in C major scale', () => {
      const scale = new Scale('C', ['1', '2', '3', '4', '5', '6', '7'], 'Major');

      expect(scale.contains(new Note('C#', 4))).toBe(false);
      expect(scale.contains(new Note('D#', 4))).toBe(false);
      expect(scale.contains(new Note('F#', 4))).toBe(false);
      expect(scale.contains(new Note('G#', 4))).toBe(false);
      expect(scale.contains(new Note('A#', 4))).toBe(false);
    });

    it('should handle notes in different octaves', () => {
      const scale = new Scale('C', ['1', '2', '3', '4', '5', '6', '7'], 'Major');

      // Same note, different octave should still be in scale
      expect(scale.contains(new Note('C', 3))).toBe(true);
      expect(scale.contains(new Note('C', 5))).toBe(true);
      expect(scale.contains(new Note('E', 6))).toBe(true);
    });

    it('should handle enharmonic notes correctly', () => {
      const scale = new Scale('C', ['1', '2', '3', '4', '5', '6', '7'], 'Major');

      // C# and Db are enharmonic, but Db is not in C major
      expect(scale.contains(new Note('C#', 4))).toBe(false);
      expect(scale.contains(new Note('Db', 4))).toBe(false); // Should also be false
    });

    it('should work for pentatonic scales', () => {
      const scale = Scale.pentatonicMajor('C');

      expect(scale.contains(new Note('C', 4))).toBe(true);
      expect(scale.contains(new Note('D', 4))).toBe(true);
      expect(scale.contains(new Note('E', 4))).toBe(true);
      expect(scale.contains(new Note('G', 4))).toBe(true);
      expect(scale.contains(new Note('A', 4))).toBe(true);

      // F and B are NOT in C major pentatonic
      expect(scale.contains(new Note('F', 4))).toBe(false);
      expect(scale.contains(new Note('B', 4))).toBe(false);
    });
  });

  describe('static major', () => {
    it('should create a major scale with correct name', () => {
      const scale = Scale.major('C');

      expect(scale.name).toBe('Major');
      expect(scale.root).toBe('C');
    });

    it('should have correct major scale intervals', () => {
      const scale = Scale.major('C');

      expect(scale.intervals).toEqual(['1', '2', '3', '4', '5', '6', '7']);
    });

    it('should create C major scale with correct notes', () => {
      const scale = Scale.major('C');
      const notes = scale.getNotes(4);

      expect(notes.map(n => n.name)).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
    });

    it('should create G major scale with correct notes', () => {
      const scale = Scale.major('G');
      const notes = scale.getNotes(4);

      expect(notes.map(n => n.name)).toEqual(['G', 'A', 'B', 'C', 'D', 'E', 'F#']);
    });

    it('should create D major scale with F# and C#', () => {
      const scale = Scale.major('D');
      const notes = scale.getNotes(4);

      expect(notes.map(n => n.name)).toEqual(['D', 'E', 'F#', 'G', 'A', 'B', 'C#']);
    });

    it('should create F major scale with A# (Bb enharmonic)', () => {
      const scale = Scale.major('F');
      const notes = scale.getNotes(4);

      expect(notes.map(n => n.name)).toEqual(['F', 'G', 'A', 'A#', 'C', 'D', 'E']);
    });

    it('should work with all note names', () => {
      const roots: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

      roots.forEach(root => {
        const scale = Scale.major(root);
        expect(scale.root).toBe(root);
        expect(scale.getNotes()).toHaveLength(7);
      });
    });
  });

  describe('static minor', () => {
    it('should create a natural minor scale with correct name', () => {
      const scale = Scale.minor('A');

      expect(scale.name).toBe('Natural Minor');
      expect(scale.root).toBe('A');
    });

    it('should have correct natural minor scale intervals', () => {
      const scale = Scale.minor('A');

      expect(scale.intervals).toEqual(['1', '2', 'b3', '4', '5', 'b6', 'b7']);
    });

    it('should create A minor scale with correct notes (no accidentals)', () => {
      const scale = Scale.minor('A');
      const notes = scale.getNotes(4);

      expect(notes.map(n => n.name)).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
    });

    it('should create C minor scale with D#, G#, A# (Eb, Ab, Bb enharmonic)', () => {
      const scale = Scale.minor('C');
      const notes = scale.getNotes(4);

      expect(notes.map(n => n.name)).toEqual(['C', 'D', 'D#', 'F', 'G', 'G#', 'A#']);
    });

    it('should create E minor scale with F#, G, C# in scale', () => {
      const scale = Scale.minor('E');
      const notes = scale.getNotes(4);

      expect(notes.map(n => n.name)).toEqual(['E', 'F#', 'G', 'A', 'B', 'C', 'D']);
    });

    it('should have relative major relationship', () => {
      const aMinor = Scale.minor('A');
      const cMajor = Scale.major('C');

      // A minor and C major should have the same notes (different starting point)
      const aMinorNotes = aMinor.getNotes(4).map(n => n.name);
      const cMajorNotes = cMajor.getNotes(4).map(n => n.name);

      // Both should contain the same set of notes
      aMinorNotes.forEach(note => {
        expect(cMajorNotes).toContain(note);
      });
    });
  });

  describe('static pentatonicMajor', () => {
    it('should create a pentatonic major scale', () => {
      const scale = Scale.pentatonicMajor('C');

      expect(scale.name).toBe('Pentatonic Major');
      expect(scale.root).toBe('C');
      expect(scale.intervals).toEqual(['1', '2', '3', '5', '6']);
    });

    it('should have 5 notes', () => {
      const scale = Scale.pentatonicMajor('C');
      const notes = scale.getNotes();

      expect(notes).toHaveLength(5);
    });

    it('should create C pentatonic major with correct notes', () => {
      const scale = Scale.pentatonicMajor('C');
      const notes = scale.getNotes(4);

      expect(notes.map(n => n.name)).toEqual(['C', 'D', 'E', 'G', 'A']);
    });

    it('should exclude 4th and 7th from major scale', () => {
      const cMajor = Scale.major('C');
      const cPentatonic = Scale.pentatonicMajor('C');

      const majorNotes = cMajor.getNotes(4).map(n => n.name);
      const pentatonicNotes = cPentatonic.getNotes(4).map(n => n.name);

      // F (4th) and B (7th) should NOT be in pentatonic
      expect(pentatonicNotes).not.toContain('F');
      expect(pentatonicNotes).not.toContain('B');

      // Pentatonic notes should be subset of major
      pentatonicNotes.forEach(note => {
        expect(majorNotes).toContain(note);
      });
    });

    it('should work with sharp root notes', () => {
      const scale = Scale.pentatonicMajor('F#');
      const notes = scale.getNotes(4);

      expect(notes.map(n => n.name)).toEqual(['F#', 'G#', 'A#', 'C#', 'D#']);
    });
  });

  describe('static pentatonicMinor', () => {
    it('should create a pentatonic minor scale', () => {
      const scale = Scale.pentatonicMinor('A');

      expect(scale.name).toBe('Pentatonic Minor');
      expect(scale.root).toBe('A');
      expect(scale.intervals).toEqual(['1', 'b3', '4', '5', 'b7']);
    });

    it('should have 5 notes', () => {
      const scale = Scale.pentatonicMinor('A');
      const notes = scale.getNotes();

      expect(notes).toHaveLength(5);
    });

    it('should create A pentatonic minor (no accidentals)', () => {
      const scale = Scale.pentatonicMinor('A');
      const notes = scale.getNotes(4);

      expect(notes.map(n => n.name)).toEqual(['A', 'C', 'D', 'E', 'G']);
    });

    it('should create C pentatonic minor with D# and A# (Eb, Bb enharmonic)', () => {
      const scale = Scale.pentatonicMinor('C');
      const notes = scale.getNotes(4);

      expect(notes.map(n => n.name)).toEqual(['C', 'D#', 'F', 'G', 'A#']);
    });

    it('should exclude 2nd and flat 6th from natural minor', () => {
      const aMinor = Scale.minor('A');
      const aPentatonicMinor = Scale.pentatonicMinor('A');

      const minorNotes = aMinor.getNotes(4).map(n => n.name);
      const pentatonicNotes = aPentatonicMinor.getNotes(4).map(n => n.name);

      // B (2nd) and F (b6) should NOT be in pentatonic minor
      expect(pentatonicNotes).not.toContain('B');
      expect(pentatonicNotes).not.toContain('F');

      // Pentatonic notes should be subset of natural minor
      pentatonicNotes.forEach(note => {
        expect(minorNotes).toContain(note);
      });
    });
  });

  describe('static blues', () => {
    it('should create a blues scale', () => {
      const scale = Scale.blues('A');

      expect(scale.name).toBe('Blues');
      expect(scale.root).toBe('A');
      expect(scale.intervals).toEqual(['1', 'b3', '4', '#4', '5', 'b7']);
    });

    it('should have 6 notes', () => {
      const scale = Scale.blues('C');
      const notes = scale.getNotes();

      expect(notes).toHaveLength(6);
    });

    it('should create A blues scale (no accidentals)', () => {
      const scale = Scale.blues('A');
      const notes = scale.getNotes(4);

      expect(notes.map(n => n.name)).toEqual(['A', 'C', 'D', 'D#', 'E', 'G']);
    });

    it('should create C blues scale with blue notes (using sharps)', () => {
      const scale = Scale.blues('C');
      const notes = scale.getNotes(4);

      expect(notes.map(n => n.name)).toEqual(['C', 'D#', 'F', 'F#', 'G', 'A#']);
    });

    it('should include the "blue note" (#4/b5)', () => {
      const cBlues = Scale.blues('C');
      const notes = cBlues.getNotes(4);

      // F# is the blue note in C blues
      expect(notes.map(n => n.name)).toContain('F#');
    });

    it('should be based on pentatonic minor with added #4', () => {
      const cPentatonicMinor = Scale.pentatonicMinor('C');
      const cBlues = Scale.blues('C');

      const pentatonicNotes = cPentatonicMinor.getNotes(4).map(n => n.name);
      const bluesNotes = cBlues.getNotes(4).map(n => n.name);

      // Blues should contain all pentatonic minor notes
      pentatonicNotes.forEach(note => {
        expect(bluesNotes).toContain(note);
      });

      // Blues should have one extra note (#4)
      expect(bluesNotes.length).toBe(pentatonicNotes.length + 1);
    });

    it('should work with different root notes', () => {
      const roots: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

      roots.forEach(root => {
        const scale = Scale.blues(root);
        expect(scale.root).toBe(root);
        expect(scale.getNotes()).toHaveLength(6);
      });
    });
  });

  describe('Scale relationships', () => {
    it('should maintain relative major/minor relationship', () => {
      const cMajor = Scale.major('C');
      const aMinor = Scale.minor('A');

      const majorNotes = cMajor.getNotes(4).map(n => n.name);
      const minorNotes = aMinor.getNotes(4).map(n => n.name);

      // Should have same notes, different order
      expect(new Set(majorNotes)).toEqual(new Set(minorNotes));
    });

    it('should have parallel major/minor relationship (same root)', () => {
      const cMajor = Scale.major('C');
      const cMinor = Scale.minor('C');

      expect(cMajor.root).toBe(cMinor.root);

      // Major has 3rd, minor has b3rd
      const majorNotes = cMajor.getNotes(4).map(n => n.name);
      const minorNotes = cMinor.getNotes(4).map(n => n.name);

      expect(majorNotes).toContain('E');  // Major 3rd
      expect(minorNotes).toContain('D#'); // Minor 3rd (Eb enharmonic, code uses sharps)
    });
  });

  describe('Edge cases', () => {
    it('should handle empty interval array', () => {
      const scale = new Scale('C', [], 'Empty');
      const notes = scale.getNotes();

      expect(notes).toHaveLength(0);
    });

    it('should handle single interval', () => {
      const scale = new Scale('C', ['1'], 'Single');
      const notes = scale.getNotes();

      expect(notes).toHaveLength(1);
      expect(notes[0]?.toString()).toBe('C4');
    });

    it('should handle duplicate intervals', () => {
      const scale = new Scale('C', ['1', '1', '1'], 'Duplicates');
      const notes = scale.getNotes();

      expect(notes).toHaveLength(3);
      expect(notes[0]?.toString()).toBe('C4');
      expect(notes[1]?.toString()).toBe('C4');
      expect(notes[2]?.toString()).toBe('C4');
    });

    it('should handle large interval values', () => {
      const scale = new Scale('C', ['1', '13'], 'Large interval');
      const notes = scale.getNotes(4);

      expect(notes[0]?.toString()).toBe('C4');
      expect(notes[1]?.toString()).toBe('A5'); // 13th is A in next octave
    });
  });
});
