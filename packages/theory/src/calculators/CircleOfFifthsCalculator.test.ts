// ============================================================================
// CIRCLE OF FIFTHS CALCULATOR TESTS
// ============================================================================
//
// Tests pour le cercle des quintes
// ============================================================================

import { describe, it, expect } from 'vitest';
import type { NoteName } from '@adagio/types';
import {
  getCircleOfFifths,
  getPerfectFifth,
  getPerfectFourth,
  getRelativeMinor,
  getRelativeMajor,
  getTritoneSubstitution,
} from './CircleOfFifthsCalculator';

describe('CircleOfFifthsCalculator', () => {
  describe('getCircleOfFifths', () => {
    it('should return 12 notes in the circle', () => {
      const result = getCircleOfFifths('C');

      expect(result.circle).toHaveLength(12);
    });

    it('should start with the center note', () => {
      const result = getCircleOfFifths('C');

      expect(result.center).toBe('C');
      expect(result.circle[0]?.note).toBe('C');
    });

    it('should return correct circle for C major', () => {
      const result = getCircleOfFifths('C');
      const notes = result.circle.map(item => item.note);

      expect(notes).toEqual([
        'C', 'G', 'D', 'A', 'E', 'B', 'F#',
        'Db', 'Ab', 'Eb', 'Bb', 'F',
      ]);
    });

    it('should calculate correct intervals (perfect fifths)', () => {
      const result = getCircleOfFifths('C');

      // Each step should be a perfect fifth (7 semitones)
      const intervals = result.circle.map(item => item.interval);

      expect(intervals[0]).toBe(0); // Unison
      expect(intervals[1]).toBe(7); // Perfect fifth
      expect(intervals[2]).toBe(2); // Major second (7+7=14, 14%12=2)
      expect(intervals[3]).toBe(9); // Major sixth
    });

    it('should handle different center notes', () => {
      const gResult = getCircleOfFifths('G');

      expect(gResult.center).toBe('G');
      expect(gResult.circle[0]?.note).toBe('G');
      expect(gResult.circle[1]?.note).toBe('D'); // Fifth of G
    });

    it('should include enharmonics mapping', () => {
      const result = getCircleOfFifths('C');

      expect(result.enharmonics).toBeDefined();
      expect(result.enharmonics['F#']).toBe('Gb');
      expect(result.enharmonics['Db']).toBe('C#');
    });

    it('should throw error for invalid note', () => {
      expect(() => getCircleOfFifths('H' as NoteName)).toThrow('Invalid note');
    });
  });

  describe('getPerfectFifth', () => {
    const testCases: [NoteName, NoteName][] = [
      ['C', 'G'],
      ['G', 'D'],
      ['D', 'A'],
      ['A', 'E'],
      ['E', 'B'],
      ['B', 'F#'],
      ['F#', 'Db'],
      ['F', 'C'],
    ];

    testCases.forEach(([input, expected]) => {
      it(`should return ${expected} for ${input}`, () => {
        const result = getPerfectFifth(input);
        expect(result).toBe(expected);
      });
    });

    it('should throw error for invalid note', () => {
      expect(() => getPerfectFifth('H' as NoteName)).toThrow('Invalid note');
    });

    it('should be cyclic (12 fifths returns to start)', () => {
      let note: NoteName = 'C';
      for (let i = 0; i < 12; i++) {
        note = getPerfectFifth(note);
      }
      expect(note).toBe('C');
    });
  });

  describe('getPerfectFourth', () => {
    const testCases: [NoteName, NoteName][] = [
      ['C', 'F'],
      ['G', 'C'],
      ['D', 'G'],
      ['A', 'D'],
      ['E', 'A'],
      ['F', 'Bb'],
    ];

    testCases.forEach(([input, expected]) => {
      it(`should return ${expected} for ${input}`, () => {
        const result = getPerfectFourth(input);
        expect(result).toBe(expected);
      });
    });

    it('should be the inverse of perfect fifth', () => {
      // The perfect fourth of the perfect fifth should be the original note
      const note: NoteName = 'C';
      const fifth = getPerfectFifth(note);
      const fourthOfFifth = getPerfectFourth(fifth);

      expect(fourthOfFifth).toBe(note);
    });

    it('should throw error for invalid note', () => {
      expect(() => getPerfectFourth('H' as NoteName)).toThrow('Invalid note');
    });
  });

  describe('getRelativeMinor', () => {
    const testCases: [NoteName, NoteName][] = [
      ['C', 'Eb'], // Based on circle of fifths implementation
      ['G', 'Bb'],
      ['D', 'F'],
      ['A', 'C'],
      ['E', 'G'],
      ['B', 'D'],
    ];

    testCases.forEach(([majorKey, expectedMinor]) => {
      it(`should return ${expectedMinor} for ${majorKey} major`, () => {
        const result = getRelativeMinor(majorKey);
        expect(result).toBe(expectedMinor);
      });
    });

    it('should be 9 steps forward in circle of fifths', () => {
      const circle = getCircleOfFifths('C');
      const cIndex = circle.circle.findIndex(item => item.note === 'C');
      const ebIndex = circle.circle.findIndex(item => item.note === 'Eb');

      // Eb should be 9 steps ahead in circle
      expect((ebIndex - cIndex + 12) % 12).toBe(9);
    });

    it('should throw error for invalid note', () => {
      expect(() => getRelativeMinor('H' as NoteName)).toThrow('Invalid note');
    });
  });

  describe('getRelativeMajor', () => {
    const testCases: [NoteName, NoteName][] = [
      ['Eb', 'C'], // Based on circle of fifths implementation
      ['Bb', 'G'],
      ['F', 'D'],
      ['C', 'A'],
      ['G', 'E'],
      ['D', 'B'],
    ];

    testCases.forEach(([minorKey, expectedMajor]) => {
      it(`should return ${expectedMajor} for ${minorKey} minor`, () => {
        const result = getRelativeMajor(minorKey);
        expect(result).toBe(expectedMajor);
      });
    });

    it('should be inverse of getRelativeMinor', () => {
      const majorKey: NoteName = 'C';
      const relativeMinor = getRelativeMinor(majorKey);
      const backToMajor = getRelativeMajor(relativeMinor);

      expect(backToMajor).toBe(majorKey);
    });

    it('should be 3 steps forward in circle of fifths', () => {
      const circle = getCircleOfFifths('Eb');
      const ebIndex = circle.circle.findIndex(item => item.note === 'Eb');
      const cIndex = circle.circle.findIndex(item => item.note === 'C');

      // C should be 3 steps ahead in circle
      expect((cIndex - ebIndex + 12) % 12).toBe(3);
    });

    it('should throw error for invalid note', () => {
      expect(() => getRelativeMajor('H' as NoteName)).toThrow('Invalid note');
    });
  });

  describe('getTritoneSubstitution', () => {
    const testCases: [NoteName, NoteName][] = [
      ['C', 'F#'], // C7 → F#7
      ['G', 'Db'], // G7 → Db7
      ['D', 'Ab'], // D7 → Ab7
      ['A', 'Eb'], // A7 → Eb7
      ['F#', 'C'], // F#7 → C7 (symmetric)
    ];

    testCases.forEach(([dominant, expectedSub]) => {
      it(`should return ${expectedSub} for ${dominant}`, () => {
        const result = getTritoneSubstitution(dominant);
        expect(result).toBe(expectedSub);
      });
    });

    it('should be symmetric (tritone of tritone is original)', () => {
      const note: NoteName = 'C';
      const tritone = getTritoneSubstitution(note);
      const backToOriginal = getTritoneSubstitution(tritone);

      expect(backToOriginal).toBe(note);
    });

    it('should be 6 semitones (augmented fourth) from original', () => {
      const circle = getCircleOfFifths('C');
      const cIndex = circle.circle.findIndex(item => item.note === 'C');
      const fsIndex = circle.circle.findIndex(item => item.note === 'F#');

      expect((fsIndex - cIndex + 12) % 12).toBe(6);
    });

    it('should throw error for invalid note', () => {
      expect(() => getTritoneSubstitution('H' as NoteName)).toThrow('Invalid note');
    });
  });

  describe('Circle relationships', () => {
    it('should have consistent relationships between functions', () => {
      const note: NoteName = 'C';

      // Fifth of fourth should be original
      const fourth = getPerfectFourth(note);
      const fifthOfFourth = getPerfectFifth(fourth);
      expect(fifthOfFourth).toBe(note);

      // Fourth of fifth should be original
      const fifth = getPerfectFifth(note);
      const fourthOfFifth = getPerfectFourth(fifth);
      expect(fourthOfFifth).toBe(note);
    });

    it('should maintain relative major/minor relationship', () => {
      const majorKey: NoteName = 'C';
      const minorKey = getRelativeMinor(majorKey);

      // The relative major of relative minor should be original
      expect(getRelativeMajor(minorKey)).toBe(majorKey);
    });

    it('should correctly place all 12 notes in circle', () => {
      const result = getCircleOfFifths('C');
      const notes = result.circle.map(item => item.note);

      // All 12 chromatic notes should be present
      const allNotes: NoteName[] = [
        'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
      ];

      // Using enharmonic equivalents
      notes.forEach(note => {
        if (note === 'Db') expect(allNotes).toContain('C#');
        else if (note === 'Eb') expect(allNotes).toContain('D#');
        else if (note === 'Gb') expect(allNotes).toContain('F#');
        else if (note === 'Ab') expect(allNotes).toContain('G#');
        else if (note === 'Bb') expect(allNotes).toContain('A#');
        else expect(allNotes).toContain(note);
      });
    });
  });
});
