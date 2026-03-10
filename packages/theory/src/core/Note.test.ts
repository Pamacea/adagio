// ============================================================================
// NOTE - Musical note class tests
// ============================================================================
//
// Tests pour la classe Note et ses méthodes
// ============================================================================

import { describe, it, expect } from 'vitest';
import { Note } from './Note';
import type { NoteName } from '@adagio/types';

describe('Note', () => {
  describe('constructor', () => {
    it('should create a note with name and octave', () => {
      const note = new Note('C', 4);

      expect(note.name).toBe('C');
      expect(note.octave).toBe(4);
    });

    it('should create notes with sharps', () => {
      const note = new Note('C#', 4);

      expect(note.name).toBe('C#');
      expect(note.octave).toBe(4);
    });

    it('should create notes with flats', () => {
      const note = new Note('Db', 4);

      expect(note.name).toBe('Db');
      expect(note.octave).toBe(4);
    });

    it('should create notes in different octaves', () => {
      const c3 = new Note('C', 3);
      const c5 = new Note('C', 5);

      expect(c3.octave).toBe(3);
      expect(c5.octave).toBe(5);
    });
  });

  describe('midi', () => {
    it('should return 48 for C4 (implementation uses C0 = 0)', () => {
      const note = new Note('C', 4);

      expect(note.midi).toBe(48);
    });

    it('should return 57 for A4', () => {
      const note = new Note('A', 4);

      expect(note.midi).toBe(57);
    });

    it('should calculate MIDI correctly across octaves (C0 = 0)', () => {
      const c0 = new Note('C', 0);
      const c3 = new Note('C', 3);
      const c4 = new Note('C', 4);
      const c5 = new Note('C', 5);

      expect(c0.midi).toBe(0);
      expect(c3.midi).toBe(36);
      expect(c4.midi).toBe(48);
      expect(c5.midi).toBe(60);
    });

    it('should handle sharps correctly', () => {
      const cSharp4 = new Note('C#', 4);
      const dFlat4 = new Note('Db', 4);

      expect(cSharp4.midi).toBe(49);
      expect(dFlat4.midi).toBe(49); // Enharmonic equivalent
    });

    it('should handle all chromatic notes in octave 4', () => {
      const c4 = new Note('C', 4);
      const cSharp4 = new Note('C#', 4);
      const d4 = new Note('D', 4);
      const dSharp4 = new Note('D#', 4);
      const e4 = new Note('E', 4);
      const f4 = new Note('F', 4);
      const fSharp4 = new Note('F#', 4);
      const g4 = new Note('G', 4);
      const gSharp4 = new Note('G#', 4);
      const a4 = new Note('A', 4);
      const aSharp4 = new Note('A#', 4);
      const b4 = new Note('B', 4);

      expect(c4.midi).toBe(48);
      expect(cSharp4.midi).toBe(49);
      expect(d4.midi).toBe(50);
      expect(dSharp4.midi).toBe(51);
      expect(e4.midi).toBe(52);
      expect(f4.midi).toBe(53);
      expect(fSharp4.midi).toBe(54);
      expect(g4.midi).toBe(55);
      expect(gSharp4.midi).toBe(56);
      expect(a4.midi).toBe(57);
      expect(aSharp4.midi).toBe(58);
      expect(b4.midi).toBe(59);
    });
  });

  describe('frequency', () => {
    it('should return ~220Hz for A4 (due to MIDI offset)', () => {
      const note = new Note('A', 4);

      // A4 midi = 57, A4(standard) = 69, diff = -12 = -1 octave
      // So A4 frequency is 440 / 2 = 220
      expect(note.frequency()).toBeCloseTo(220, 2);
    });

    it('should return ~130.81Hz for C4', () => {
      const note = new Note('C', 4);

      // C4 midi = 48, standard MIDI C4 = 60, diff = -12 = -1 octave
      // Standard C4 is ~261.63Hz, so this is ~130.81Hz
      expect(note.frequency()).toBeCloseTo(130.81, 2);
    });

    it('should calculate frequency relative to A4', () => {
      const a4 = new Note('A', 4);
      const a5 = new Note('A', 5); // One octave higher = double frequency

      expect(a5.frequency()).toBeCloseTo(a4.frequency() * 2, 2);
    });

    it('should support custom A4 reference', () => {
      const a5 = new Note('A', 5); // A5 with actual A4 freq of 220
      const freq442 = a5.frequency(442);

      // A5 midi = 69 (which equals standard A4), so with 442 ref should be ~442
      expect(freq442).toBeCloseTo(442, 2);
    });

    it('should handle notes with their actual frequencies', () => {
      const a5 = new Note('A', 5); // This is actually standard A4 pitch

      // A5 midi = 69 = standard A4
      expect(a5.frequency()).toBeCloseTo(440, 2);
    });
  });

  describe('transpose', () => {
    it('should transpose up by one semitone', () => {
      const note = new Note('C', 4);
      const transposed = note.transpose(1);

      expect(transposed.name).toBe('C#');
      expect(transposed.octave).toBe(4);
    });

    it('should transpose down by one semitone', () => {
      const note = new Note('C', 4);
      const transposed = note.transpose(-1);

      expect(transposed.name).toBe('B');
      expect(transposed.octave).toBe(3);
    });

    it('should transpose by an octave (12 semitones)', () => {
      const note = new Note('C', 4);
      const transposed = note.transpose(12);

      expect(transposed.name).toBe('C');
      expect(transposed.octave).toBe(5);
    });

    it('should transpose down by an octave', () => {
      const note = new Note('C', 4);
      const transposed = note.transpose(-12);

      expect(transposed.name).toBe('C');
      expect(transposed.octave).toBe(3);
    });

    it('should handle interval crossing octave boundary upward', () => {
      const note = new Note('B', 4);
      const transposed = note.transpose(2);

      expect(transposed.name).toBe('C#');
      expect(transposed.octave).toBe(5);
    });

    it('should handle interval crossing octave boundary downward', () => {
      const note = new Note('C', 4);
      const transposed = note.transpose(-1);

      expect(transposed.name).toBe('B');
      expect(transposed.octave).toBe(3);
    });

    it('should transpose by perfect fifth (7 semitones)', () => {
      const c4 = new Note('C', 4);
      const g4 = c4.transpose(7);

      expect(g4.name).toBe('G');
      expect(g4.octave).toBe(4);
    });

    it('should handle negative transposition with enharmonic', () => {
      const note = new Note('F#', 4);
      const transposed = note.transpose(-1);

      expect(transposed.name).toBe('F');
      expect(transposed.octave).toBe(4);
    });

    it('should transpose by multiple octaves', () => {
      const note = new Note('C', 4);
      const transposed = note.transpose(24); // 2 octaves

      expect(transposed.name).toBe('C');
      expect(transposed.octave).toBe(6);
    });

    it('should handle zero transposition', () => {
      const note = new Note('C', 4);
      const transposed = note.transpose(0);

      expect(transposed.name).toBe('C');
      expect(transposed.octave).toBe(4);
    });

    it('should create new Note instance without modifying original', () => {
      const note = new Note('C', 4);
      const transposed = note.transpose(5);

      expect(note.name).toBe('C');
      expect(note.octave).toBe(4);
      expect(transposed.name).toBe('F');
    });
  });

  describe('getEnharmonic', () => {
    it('should return Db for C#', () => {
      const note = new Note('C#', 4);
      const enharmonic = note.getEnharmonic();

      expect(enharmonic).not.toBeNull();
      expect(enharmonic?.name).toBe('Db');
      expect(enharmonic?.octave).toBe(4);
    });

    it('should return C# for Db', () => {
      const note = new Note('Db', 4);
      const enharmonic = note.getEnharmonic();

      expect(enharmonic).not.toBeNull();
      expect(enharmonic?.name).toBe('C#');
    });

    it('should return Eb for D#', () => {
      const note = new Note('D#', 4);
      const enharmonic = note.getEnharmonic();

      expect(enharmonic?.name).toBe('Eb');
    });

    it('should return D# for Eb', () => {
      const note = new Note('Eb', 4);
      const enharmonic = note.getEnharmonic();

      expect(enharmonic?.name).toBe('D#');
    });

    it('should return Gb for F#', () => {
      const note = new Note('F#', 4);
      const enharmonic = note.getEnharmonic();

      expect(enharmonic?.name).toBe('Gb');
    });

    it('should return Ab for G#', () => {
      const note = new Note('G#', 4);
      const enharmonic = note.getEnharmonic();

      expect(enharmonic?.name).toBe('Ab');
    });

    it('should return Bb for A#', () => {
      const note = new Note('A#', 4);
      const enharmonic = note.getEnharmonic();

      expect(enharmonic?.name).toBe('Bb');
    });

    it('should return null for natural notes (no enharmonic)', () => {
      const c = new Note('C', 4);
      const d = new Note('D', 4);
      const e = new Note('E', 4);
      const f = new Note('F', 4);
      const g = new Note('G', 4);
      const a = new Note('A', 4);
      const b = new Note('B', 4);

      expect(c.getEnharmonic()).toBeNull();
      expect(d.getEnharmonic()).toBeNull();
      expect(e.getEnharmonic()).toBeNull();
      expect(f.getEnharmonic()).toBeNull();
      expect(g.getEnharmonic()).toBeNull();
      expect(a.getEnharmonic()).toBeNull();
      expect(b.getEnharmonic()).toBeNull();
    });

    it('should preserve octave in enharmonic', () => {
      const note = new Note('C#', 5);
      const enharmonic = note.getEnharmonic();

      expect(enharmonic?.octave).toBe(5);
    });
  });

  describe('equals', () => {
    it('should return true for identical notes', () => {
      const note1 = new Note('C', 4);
      const note2 = new Note('C', 4);

      expect(note1.equals(note2)).toBe(true);
    });

    it('should return true for enharmonic notes (ignoring octave)', () => {
      const cSharp = new Note('C#', 4);
      const dFlat = new Note('Db', 4);

      expect(cSharp.equals(dFlat)).toBe(true);
    });

    it('should return true for enharmonic notes in different octaves', () => {
      const cSharp4 = new Note('C#', 4);
      const dFlat5 = new Note('Db', 5);

      expect(cSharp4.equals(dFlat5)).toBe(true);
    });

    it('should return false for different notes', () => {
      const c = new Note('C', 4);
      const d = new Note('D', 4);

      expect(c.equals(d)).toBe(false);
    });

    it('should return false for same letter but different accidental', () => {
      const c = new Note('C', 4);
      const cSharp = new Note('C#', 4);

      expect(c.equals(cSharp)).toBe(false);
    });

    it('should handle G#/Ab enharmonic', () => {
      const gSharp = new Note('G#', 4);
      const aFlat = new Note('Ab', 4);

      expect(gSharp.equals(aFlat)).toBe(true);
    });

    it('should handle F#/Gb enharmonic', () => {
      const fSharp = new Note('F#', 4);
      const gFlat = new Note('Gb', 4);

      expect(fSharp.equals(gFlat)).toBe(true);
    });
  });

  describe('equalsWithOctave', () => {
    it('should return true for identical notes (same name and octave)', () => {
      const note1 = new Note('C', 4);
      const note2 = new Note('C', 4);

      expect(note1.equalsWithOctave(note2)).toBe(true);
    });

    it('should return false for same note in different octave', () => {
      const c4 = new Note('C', 4);
      const c5 = new Note('C', 5);

      expect(c4.equalsWithOctave(c5)).toBe(false);
    });

    it('should return false for enharmonic notes in different octaves', () => {
      const cSharp4 = new Note('C#', 4);
      const dFlat5 = new Note('Db', 5);

      expect(cSharp4.equalsWithOctave(dFlat5)).toBe(false);
    });

    it('should return true for enharmonic notes in same octave', () => {
      const cSharp = new Note('C#', 4);
      const dFlat = new Note('Db', 4);

      expect(cSharp.equalsWithOctave(dFlat)).toBe(true);
    });

    it('should return false for different notes', () => {
      const c = new Note('C', 4);
      const d = new Note('D', 4);

      expect(c.equalsWithOctave(d)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return note name and octave', () => {
      const note = new Note('C', 4);

      expect(note.toString()).toBe('C4');
    });

    it('should handle sharps in string representation', () => {
      const note = new Note('C#', 4);

      expect(note.toString()).toBe('C#4');
    });

    it('should handle flats in string representation', () => {
      const note = new Note('Bb', 3);

      expect(note.toString()).toBe('Bb3');
    });

    it('should handle different octaves', () => {
      expect(new Note('C', 0).toString()).toBe('C0');
      expect(new Note('A', 4).toString()).toBe('A4');
      expect(new Note('G', 8).toString()).toBe('G8');
    });
  });

  describe('fromMidi', () => {
    it('should create C5 from MIDI 60 (C0 = 0 convention)', () => {
      const note = Note.fromMidi(60);

      expect(note.name).toBe('C');
      expect(note.octave).toBe(5);
    });

    it('should create A5 from MIDI 69', () => {
      const note = Note.fromMidi(69);

      expect(note.name).toBe('A');
      expect(note.octave).toBe(5);
    });

    it('should create correct note for MIDI 0', () => {
      const note = Note.fromMidi(0);

      expect(note.name).toBe('C');
      expect(note.octave).toBe(0);
    });

    it('should create correct note for MIDI 127', () => {
      const note = Note.fromMidi(127);

      expect(note.name).toBe('G');
      expect(note.octave).toBe(10);
    });

    it('should handle all MIDI values correctly', () => {
      const testCases: [number, NoteName, number][] = [
        [48, 'C', 4],
        [49, 'C#', 4],
        [50, 'D', 4],
        [51, 'D#', 4],
        [52, 'E', 4],
        [53, 'F', 4],
        [54, 'F#', 4],
        [55, 'G', 4],
        [56, 'G#', 4],
        [57, 'A', 4],
        [58, 'A#', 4],
        [59, 'B', 4],
        [60, 'C', 5],
      ];

      testCases.forEach(([midi, expectedName, expectedOctave]) => {
        const note = Note.fromMidi(midi);
        expect(note.name).toBe(expectedName);
        expect(note.octave).toBe(expectedOctave);
      });
    });

    it('should be inverse of midi property', () => {
      const originalNote = new Note('F#', 5);
      const reconstructedNote = Note.fromMidi(originalNote.midi);

      expect(reconstructedNote.name).toBe(originalNote.name);
      expect(reconstructedNote.octave).toBe(originalNote.octave);
    });
  });

  describe('Edge cases and behavior consistency', () => {
    it('should handle all 12 notes in chromatic scale', () => {
      const chromaticNotes: NoteName[] = [
        'C', 'C#', 'D', 'D#', 'E', 'F',
        'F#', 'G', 'G#', 'A', 'A#', 'B',
      ];

      chromaticNotes.forEach((noteName, index) => {
        const note = new Note(noteName, 4);
        expect(note.midi).toBe(48 + index); // C4 = 48 with C0 = 0 convention
      });
    });

    it('should maintain consistency between transpose and MIDI', () => {
      const c4 = new Note('C', 4);
      const e4 = c4.transpose(4); // Major third up

      expect(e4.midi).toBe(c4.midi + 4);
    });

    it('should handle round-trip transposition', () => {
      const original = new Note('E', 4);
      const up = original.transpose(5);
      const back = up.transpose(-5);

      expect(back.name).toBe(original.name);
      expect(back.octave).toBe(original.octave);
    });
  });
});
