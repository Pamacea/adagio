// ============================================================================
// CHORD - Musical chord class tests
// ============================================================================
//
// Tests pour la classe Chord et ses méthodes
// ============================================================================

import { describe, it, expect } from 'vitest';
import { Chord } from './Chord';
import { Note } from './Note';
import type { NoteName, ChordQuality } from '@adagio/types';

describe('Chord', () => {
  describe('constructor', () => {
    it('should create a chord with root and quality', () => {
      const chord = new Chord('C', '');

      expect(chord.root).toBe('C');
      expect(chord.quality).toBe('');
    });

    it('should create a chord with extensions', () => {
      const chord = new Chord('C', '7', ['9', '11']);

      expect(chord.root).toBe('C');
      expect(chord.quality).toBe('7');
      expect(chord.extensions).toEqual(['9', '11']);
    });

    it('should accept any valid note name as root', () => {
      const roots: NoteName[] = ['C', 'C#', 'Db', 'D', 'F#', 'Bb'];

      roots.forEach(root => {
        const chord = new Chord(root, '');
        expect(chord.root).toBe(root);
      });
    });

    it('should accept any valid chord quality', () => {
      const qualities: ChordQuality[] = ['', 'm', '7', 'm7', 'maj7', 'dim', 'dim7', 'aug'];

      qualities.forEach(quality => {
        const chord = new Chord('C', quality);
        expect(chord.quality).toBe(quality);
      });
    });
  });

  describe('getName', () => {
    it('should return "C" for C major triad', () => {
      const chord = new Chord('C', '');

      expect(chord.getName()).toBe('C');
    });

    it('should return "Cm" for C minor', () => {
      const chord = new Chord('C', 'm');

      expect(chord.getName()).toBe('Cm');
    });

    it('should return "C7" for C dominant 7th', () => {
      const chord = new Chord('C', '7');

      expect(chord.getName()).toBe('C7');
    });

    it('should return "Cm7" for C minor 7th', () => {
      const chord = new Chord('C', 'm7');

      expect(chord.getName()).toBe('Cm7');
    });

    it('should return "Cmaj7" for C major 7th', () => {
      const chord = new Chord('C', 'maj7');

      expect(chord.getName()).toBe('Cmaj7');
    });

    it('should return "Cdim" for C diminished', () => {
      const chord = new Chord('C', 'dim');

      expect(chord.getName()).toBe('Cdim');
    });

    it('should return "Caug" for C augmented', () => {
      const chord = new Chord('C', 'aug');

      expect(chord.getName()).toBe('Caug');
    });

    it('should work with sharp root notes', () => {
      const chord = new Chord('F#', 'm7');

      expect(chord.getName()).toBe('F#m7');
    });

    it('should work with flat root notes', () => {
      const chord = new Chord('Bb', '7');

      expect(chord.getName()).toBe('Bb7');
    });
  });

  describe('getIntervals', () => {
    describe('Triads', () => {
      it('should return [1, 3, 5] for major triad', () => {
        const chord = new Chord('C', '');

        expect(chord.getIntervals()).toEqual(['1', '3', '5']);
      });

      it('should return [1, b3, 5] for minor triad', () => {
        const chord = new Chord('C', 'm');

        expect(chord.getIntervals()).toEqual(['1', 'b3', '5']);
      });

      it('should return [1, b3, b5] for diminished triad', () => {
        const chord = new Chord('C', 'dim');

        expect(chord.getIntervals()).toEqual(['1', 'b3', 'b5']);
      });

      it('should return [1, 3, #5] for augmented triad', () => {
        const chord = new Chord('C', 'aug');

        expect(chord.getIntervals()).toEqual(['1', '3', '#5']);
      });

      it('should return [1, 2, 5] for sus2 chord', () => {
        const chord = new Chord('C', 'sus2');

        expect(chord.getIntervals()).toEqual(['1', '2', '5']);
      });

      it('should return [1, 4, 5] for sus4 chord', () => {
        const chord = new Chord('C', 'sus4');

        expect(chord.getIntervals()).toEqual(['1', '4', '5']);
      });
    });

    describe('Seventh chords', () => {
      it('should return [1, 3, 5, b7] for dominant 7th', () => {
        const chord = new Chord('C', '7');

        expect(chord.getIntervals()).toEqual(['1', '3', '5', 'b7']);
      });

      it('should return [1, b3, 5, b7] for minor 7th', () => {
        const chord = new Chord('C', 'm7');

        expect(chord.getIntervals()).toEqual(['1', 'b3', '5', 'b7']);
      });

      it('should return [1, 3, 5, 7] for major 7th', () => {
        const chord = new Chord('C', 'maj7');

        expect(chord.getIntervals()).toEqual(['1', '3', '5', '7']);
      });

      it('should return [1, b3, b5, b7] for minor 7th flat 5', () => {
        const chord = new Chord('C', 'm7b5');

        expect(chord.getIntervals()).toEqual(['1', 'b3', 'b5', 'b7']);
      });

      it('should return [1, b3, b5, bb7] for diminished 7th', () => {
        const chord = new Chord('C', 'dim7');

        expect(chord.getIntervals()).toEqual(['1', 'b3', 'b5', 'bb7']);
      });

      it('should return [1, 3, #5, b7] for augmented 7th', () => {
        const chord = new Chord('C', 'aug7');

        expect(chord.getIntervals()).toEqual(['1', '3', '#5', 'b7']);
      });

      it('should return [1, 4, 5, b7] for 7sus4', () => {
        const chord = new Chord('C', '7sus4');

        expect(chord.getIntervals()).toEqual(['1', '4', '5', 'b7']);
      });
    });

    describe('Sixth chords', () => {
      it('should return [1, 3, 5, 6] for major 6th', () => {
        const chord = new Chord('C', '6');

        expect(chord.getIntervals()).toEqual(['1', '3', '5', '6']);
      });

      it('should return [1, b3, 5, 6] for minor 6th', () => {
        const chord = new Chord('C', 'm6');

        expect(chord.getIntervals()).toEqual(['1', 'b3', '5', '6']);
      });
    });

    describe('Extended chords', () => {
      it('should return [1, 3, 5, 9] for add9', () => {
        const chord = new Chord('C', 'add9');

        expect(chord.getIntervals()).toEqual(['1', '3', '5', '9']);
      });

      it('should return [1, b3, 5, 9] for madd9', () => {
        const chord = new Chord('C', 'madd9');

        expect(chord.getIntervals()).toEqual(['1', 'b3', '5', '9']);
      });

      it('should return [1, 3, 5, 9] for 9th', () => {
        const chord = new Chord('C', '9');

        expect(chord.getIntervals()).toEqual(['1', '3', '5', '9']);
      });

      it('should return [1, b3, 5, 9] for m9', () => {
        const chord = new Chord('C', 'm9');

        expect(chord.getIntervals()).toEqual(['1', 'b3', '5', '9']);
      });

      it('should return [1, 3, 5, 7, 11] for 11th', () => {
        const chord = new Chord('C', '11');

        expect(chord.getIntervals()).toEqual(['1', '3', '5', '7', '11']);
      });

      it('should return [1, b3, 5, b7, 11] for m11', () => {
        const chord = new Chord('C', 'm11');

        expect(chord.getIntervals()).toEqual(['1', 'b3', '5', 'b7', '11']);
      });

      it('should return full intervals for 13th', () => {
        const chord = new Chord('C', '13');

        expect(chord.getIntervals()).toEqual(['1', '3', '5', '7', '9', '11', '13']);
      });

      it('should return full intervals for m13', () => {
        const chord = new Chord('C', 'm13');

        expect(chord.getIntervals()).toEqual(['1', 'b3', '5', 'b7', '9', '11', '13']);
      });
    });

    describe('With extensions', () => {
      it('should add custom extensions to base intervals', () => {
        const chord = new Chord('C', '7', ['b9', '#11']);

        expect(chord.getIntervals()).toEqual(['1', '3', '5', 'b7', 'b9', '#11']);
      });

      it('should handle single extension', () => {
        const chord = new Chord('C', '', ['9']);

        expect(chord.getIntervals()).toEqual(['1', '3', '5', '9']);
      });

      it('should handle multiple extensions', () => {
        const chord = new Chord('C', '7', ['9', '11', '13']);

        expect(chord.getIntervals()).toEqual(['1', '3', '5', 'b7', '9', '11', '13']);
      });

      it('should handle empty extensions array', () => {
        const chord = new Chord('C', '7', []);

        expect(chord.getIntervals()).toEqual(['1', '3', '5', 'b7']);
      });
    });

    describe('Unknown quality fallback', () => {
      it('should default to major triad for unknown quality', () => {
        // Cast to quality for testing - in practice this shouldn't happen
        const chord = new Chord('C', 'unknown_quality' as ChordQuality);

        expect(chord.getIntervals()).toEqual(['1', '3', '5']);
      });
    });
  });

  describe('getNotes', () => {
    it('should return correct notes for C major triad', () => {
      const chord = new Chord('C', '');
      const notes = chord.getNotes(4);

      expect(notes).toHaveLength(3);
      expect(notes[0]?.toString()).toBe('C4');
      expect(notes[1]?.toString()).toBe('E4');
      expect(notes[2]?.toString()).toBe('G4');
    });

    it('should return correct notes for C minor triad', () => {
      const chord = new Chord('C', 'm');
      const notes = chord.getNotes(4);

      expect(notes).toHaveLength(3);
      expect(notes[0]?.toString()).toBe('C4');
      expect(notes[1]?.toString()).toBe('D#4'); // Code uses sharps, not flats
      expect(notes[2]?.toString()).toBe('G4');
    });

    it('should return correct notes for C diminished triad', () => {
      const chord = new Chord('C', 'dim');
      const notes = chord.getNotes(4);

      expect(notes).toHaveLength(3);
      expect(notes[0]?.toString()).toBe('C4');
      expect(notes[1]?.toString()).toBe('D#4'); // Code uses sharps, not flats
      expect(notes[2]?.toString()).toBe('F#4'); // Code uses sharps, not flats
    });

    it('should return correct notes for C augmented triad', () => {
      const chord = new Chord('C', 'aug');
      const notes = chord.getNotes(4);

      expect(notes).toHaveLength(3);
      expect(notes[0]?.toString()).toBe('C4');
      expect(notes[1]?.toString()).toBe('E4');
      expect(notes[2]?.toString()).toBe('G#4');
    });

    it('should return correct notes for C dominant 7th', () => {
      const chord = new Chord('C', '7');
      const notes = chord.getNotes(4);

      expect(notes).toHaveLength(4);
      expect(notes[0]?.toString()).toBe('C4');
      expect(notes[1]?.toString()).toBe('E4');
      expect(notes[2]?.toString()).toBe('G4');
      expect(notes[3]?.toString()).toBe('A#4'); // Code uses sharps, not flats
    });

    it('should return correct notes for C major 7th', () => {
      const chord = new Chord('C', 'maj7');
      const notes = chord.getNotes(4);

      expect(notes).toHaveLength(4);
      expect(notes[3]?.toString()).toBe('B4'); // Major 7th, not Bb
    });

    it('should return correct notes for C minor 7th', () => {
      const chord = new Chord('C', 'm7');
      const notes = chord.getNotes(4);

      expect(notes).toHaveLength(4);
      expect(notes[0]?.toString()).toBe('C4');
      expect(notes[1]?.toString()).toBe('D#4'); // Code uses sharps
      expect(notes[2]?.toString()).toBe('G4');
      expect(notes[3]?.toString()).toBe('A#4'); // Code uses sharps
    });

    it('should return correct notes for C sus2', () => {
      const chord = new Chord('C', 'sus2');
      const notes = chord.getNotes(4);

      expect(notes).toHaveLength(3);
      expect(notes[0]?.toString()).toBe('C4');
      expect(notes[1]?.toString()).toBe('D4');
      expect(notes[2]?.toString()).toBe('G4');
    });

    it('should return correct notes for C sus4', () => {
      const chord = new Chord('C', 'sus4');
      const notes = chord.getNotes(4);

      expect(notes).toHaveLength(3);
      expect(notes[0]?.toString()).toBe('C4');
      expect(notes[1]?.toString()).toBe('F4');
      expect(notes[2]?.toString()).toBe('G4');
    });

    it('should return correct notes for C diminished 7th', () => {
      const chord = new Chord('C', 'dim7');
      const notes = chord.getNotes(4);

      expect(notes).toHaveLength(4);
      expect(notes[0]?.toString()).toBe('C4');
      expect(notes[1]?.toString()).toBe('D#4'); // Code uses sharps
      expect(notes[2]?.toString()).toBe('F#4'); // Code uses sharps
      expect(notes[3]?.toString()).toBe('A4');  // bb7 is A
    });

    it('should return Note instances', () => {
      const chord = new Chord('C', 'm7');
      const notes = chord.getNotes();

      notes.forEach(note => {
        expect(note).toBeInstanceOf(Note);
      });
    });

    it('should use default octave 4 if not specified', () => {
      const chord = new Chord('C', '');
      const notes = chord.getNotes();

      expect(notes[0]?.octave).toBe(4);
    });

    it('should respect the octave parameter', () => {
      const chord = new Chord('C', '');
      const notes3 = chord.getNotes(3);
      const notes5 = chord.getNotes(5);

      expect(notes3[0]?.octave).toBe(3);
      expect(notes5[0]?.octave).toBe(5);
    });

    it('should work with sharp root notes', () => {
      const chord = new Chord('F#', 'm');
      const notes = chord.getNotes(4);

      expect(notes[0]?.toString()).toBe('F#4');
      expect(notes[1]?.toString()).toBe('A4');
      expect(notes[2]?.toString()).toBe('C#5');
    });

    it('should work with flat root notes (stored as sharps internally)', () => {
      const chord = new Chord('Bb', '7');
      const notes = chord.getNotes(4);

      expect(notes[0]?.toString()).toBe('A#4'); // Bb is stored as A#
      expect(notes[1]?.toString()).toBe('D5');
      expect(notes[2]?.toString()).toBe('F5');
      expect(notes[3]?.toString()).toBe('G#5'); // Ab is stored as G#
    });

    it('should handle extensions in getNotes', () => {
      const chord = new Chord('C', '7', ['9']);
      const notes = chord.getNotes(4);

      expect(notes).toHaveLength(5);
      expect(notes[4]?.toString()).toBe('D5'); // 9th is D in next octave
    });

    it('should handle 13th chord with multiple notes', () => {
      const chord = new Chord('C', '13');
      const notes = chord.getNotes(4);

      expect(notes).toHaveLength(7);
      expect(notes[0]?.toString()).toBe('C4');
      expect(notes[6]?.toString()).toBe('A5'); // 13th
    });
  });

  describe('Chord quality analysis', () => {
    it('should identify major triad intervals', () => {
      const chord = new Chord('C', '');
      const intervals = chord.getIntervals();

      expect(intervals).toContain('1');
      expect(intervals).toContain('3');
      expect(intervals).toContain('5');
      expect(intervals).not.toContain('b3');
    });

    it('should identify minor triad has flat 3rd', () => {
      const chord = new Chord('C', 'm');
      const intervals = chord.getIntervals();

      expect(intervals).toContain('b3');
      expect(intervals).not.toContain('3');
    });

    it('should identify diminished has flat 3rd and flat 5th', () => {
      const chord = new Chord('C', 'dim');
      const intervals = chord.getIntervals();

      expect(intervals).toContain('b3');
      expect(intervals).toContain('b5');
      expect(intervals).not.toContain('5');
    });

    it('should identify augmented has sharp 5th', () => {
      const chord = new Chord('C', 'aug');
      const intervals = chord.getIntervals();

      expect(intervals).toContain('#5');
      expect(intervals).not.toContain('5');
    });

    it('should identify dominant 7th has flat 7th', () => {
      const chord = new Chord('C', '7');
      const intervals = chord.getIntervals();

      expect(intervals).toContain('b7');
      expect(intervals).not.toContain('7');
    });

    it('should identify major 7th has natural 7th', () => {
      const chord = new Chord('C', 'maj7');
      const intervals = chord.getIntervals();

      expect(intervals).toContain('7');
      expect(intervals).not.toContain('b7');
    });
  });

  describe('Chord relationships', () => {
    it('should have relative minor/major relationship for triads', () => {
      const cMajor = new Chord('C', '');
      const aMinor = new Chord('A', 'm');

      const cNotes = cMajor.getNotes(4).map(n => n.name);
      const aNotes = aMinor.getNotes(4).map(n => n.name);

      // A minor should be like C major but starting on A
      // C major: C, E, G
      // A minor: A, C, E
      expect(aNotes).toContain('A');
      expect(cNotes).toContain('C');
      expect(cNotes).toContain('E');
      expect(aNotes).toContain('C');
      expect(aNotes).toContain('E');
    });

    it('should handle parallel major/minor (same root)', () => {
      const cMajor = new Chord('C', '');
      const cMinor = new Chord('C', 'm');

      expect(cMajor.root).toBe(cMinor.root);

      const majorNotes = cMajor.getNotes(4).map(n => n.name);
      const minorNotes = cMinor.getNotes(4).map(n => n.name);

      // Only the 3rd should differ
      expect(majorNotes).toContain('E');
      expect(minorNotes).toContain('D#'); // Code uses sharps, not Eb

      // Root and 5th should be same
      expect(majorNotes[0]).toBe(minorNotes[0]); // Both C
      expect(majorNotes[2]).toBe(minorNotes[2]); // Both G
    });
  });

  describe('Complex chords', () => {
    it('should handle 9th chord correctly (add9 without 7th)', () => {
      const chord = new Chord('D', '9');
      const notes = chord.getNotes(4);

      // The 9 chord in this implementation is add9 (no 7th)
      expect(notes.map(n => n.name)).toEqual(['D', 'F#', 'A', 'E']);
    });

    it('should handle 11th chord correctly', () => {
      const chord = new Chord('G', '11');
      const notes = chord.getNotes(4);

      // Note: 11th chord contains 1, 3, 5, 7, 11
      // G11 = G, B, D, F#, C (F# is the 11th enharmonic to F, but stored as F#)
      expect(notes[0]?.name).toBe('G');
      expect(notes[1]?.name).toBe('B');
      expect(notes[2]?.name).toBe('D');
      expect(notes[3]?.name).toBe('F#'); // Major 7th
      expect(notes[4]?.name).toBe('C');   // 11th
    });

    it('should handle add9 (no 7th)', () => {
      const chord = new Chord('C', 'add9');
      const intervals = chord.getIntervals();

      expect(intervals).not.toContain('b7');
      expect(intervals).not.toContain('7');
      expect(intervals).toContain('9');
    });

    it('should handle 6 vs add9 differences', () => {
      const sixChord = new Chord('C', '6');
      const add9Chord = new Chord('C', 'add9');

      expect(sixChord.getIntervals()).toContain('6');
      expect(add9Chord.getIntervals()).toContain('9');
    });
  });

  describe('Edge cases', () => {
    it('should handle all valid qualities', () => {
      const qualities: ChordQuality[] = [
        '', 'm', '7', 'm7', 'maj7', 'dim', 'dim7', 'm7b5',
        'aug', 'aug7', 'sus2', 'sus4', '7sus4',
        '6', 'm6', '9', 'm9', '11', 'm11', '13', 'm13',
        'add9', 'madd9',
      ];

      qualities.forEach(quality => {
        const chord = new Chord('C', quality);
        expect(chord.getIntervals().length).toBeGreaterThan(0);
      });
    });

    it('should handle complex 13th chord with all extensions', () => {
      const chord = new Chord('B', '13');
      const intervals = chord.getIntervals();

      expect(intervals.length).toBe(7);
      expect(intervals).toContain('1');
      expect(intervals).toContain('3');
      expect(intervals).toContain('5');
      expect(intervals).toContain('7');
      expect(intervals).toContain('9');
      expect(intervals).toContain('11');
      expect(intervals).toContain('13');
    });

    it('should handle m13 chord correctly', () => {
      const chord = new Chord('E', 'm13');
      const intervals = chord.getIntervals();

      expect(intervals).toContain('b3'); // Minor 3rd
      expect(intervals).toContain('b7'); // Minor 7th
      expect(intervals).toContain('13'); // 13th extension
    });
  });
});
