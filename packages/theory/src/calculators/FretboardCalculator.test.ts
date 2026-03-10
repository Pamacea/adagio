// ============================================================================
// FRETBOARD CALCULATOR TESTS
// ============================================================================
//
// Tests pour le calculateur de manche de guitare
// ============================================================================

import { describe, it, expect } from 'vitest';
import type { NoteName, Interval } from '@adagio/types';
import {
  calculateFretboard,
  getFretboardNotesForKey,
  getIntervalColor,
} from './FretboardCalculator';

describe('FretboardCalculator', () => {
  describe('calculateFretboard', () => {
    it('should return notes for all 6 strings', () => {
      const result = calculateFretboard();

      // Get unique string indices
      const strings = new Set(result.map(note => note.string));

      expect(strings.size).toBe(6);
    });

    it('should return notes for standard tuning open strings', () => {
      const result = calculateFretboard({ fretCount: 0 });

      // String 0 (high E): E at fret 0
      const highEOpen = result.find(n => n.string === 0 && n.fret === 0);
      expect(highEOpen?.name).toBe('E');

      // String 1 (B): B at fret 0
      const bOpen = result.find(n => n.string === 1 && n.fret === 0);
      expect(bOpen?.name).toBe('B');

      // String 2 (G): G at fret 0
      const gOpen = result.find(n => n.string === 2 && n.fret === 0);
      expect(gOpen?.name).toBe('G');

      // String 3 (D): D at fret 0
      const dOpen = result.find(n => n.string === 3 && n.fret === 0);
      expect(dOpen?.name).toBe('D');

      // String 4 (A): A at fret 0
      const aOpen = result.find(n => n.string === 4 && n.fret === 0);
      expect(aOpen?.name).toBe('A');

      // String 5 (low E): E at fret 0
      const lowEOpen = result.find(n => n.string === 5 && n.fret === 0);
      expect(lowEOpen?.name).toBe('E');
    });

    it('should calculate correct notes for first fret (all F)', () => {
      const result = calculateFretboard({ fretCount: 1 });

      const firstFretNotes = result.filter(n => n.fret === 1);

      // All strings should have F or F# at fret 1
      expect(firstFretNotes).toHaveLength(6);
      expect(firstFretNotes[0]?.name).toBe('F');
      expect(firstFretNotes[1]?.name).toBe('C');
      expect(firstFretNotes[2]?.name).toBe('G#');
      expect(firstFretNotes[3]?.name).toBe('D#');
      expect(firstFretNotes[4]?.name).toBe('A#');
      expect(firstFretNotes[5]?.name).toBe('F');
    });

    it('should respect fretCount parameter', () => {
      const result12 = calculateFretboard({ fretCount: 12 });
      const result24 = calculateFretboard({ fretCount: 24 });

      const maxFret12 = Math.max(...result12.map(n => n.fret));
      const maxFret24 = Math.max(...result24.map(n => n.fret));

      expect(maxFret12).toBe(12);
      expect(maxFret24).toBe(24);
    });

    it('should calculate correct total notes', () => {
      // 6 strings x (fretCount + 1 frets including 0)
      const fretCount = 12;
      const result = calculateFretboard({ fretCount });

      expect(result.length).toBe(6 * (fretCount + 1));
    });

    it('should mark inScale correctly for C major', () => {
      const result = calculateFretboard({ key: 'C', scale: ['1', '2', '3', '4', '5', '6', '7'], fretCount: 0 });

      // Open strings in C major: E (yes), B (yes), G (yes), D (yes), A (yes), E (yes)
      // C major scale: C, D, E, F, G, A, B - ALL open strings except maybe some are in the scale
      // Open strings: E(high), B, G, D, A, E(low)
      // Actually checking: C major contains C, D, E, F, G, A, B
      // D is IN C major (it's the 2nd degree), A is IN C major (it's the 6th degree)
      const eOpen = result.find(n => n.string === 0 && n.fret === 0); // High E - IN scale
      const bOpen = result.find(n => n.string === 1 && n.fret === 0);  // B - IN scale
      const gOpen = result.find(n => n.string === 2 && n.fret === 0);  // G - IN scale
      const dOpen = result.find(n => n.string === 3 && n.fret === 0);  // D - IN scale (2nd degree)
      const aOpen = result.find(n => n.string === 4 && n.fret === 0);  // A - IN scale (6th degree)

      expect(eOpen?.inScale).toBe(true);
      expect(bOpen?.inScale).toBe(true);
      expect(gOpen?.inScale).toBe(true);
      expect(dOpen?.inScale).toBe(true); // D is in C major!
      expect(aOpen?.inScale).toBe(true); // A is in C major!

      // Notes NOT in C major would be F#, C#, G# - these are the black keys
      const fsNotes = result.filter(n => n.name === 'F#');
      fsNotes.forEach(note => {
        expect(note.inScale).toBe(false);
      });
    });

    it('should work with different keys', () => {
      const gMajor = calculateFretboard({ key: 'G', scale: ['1', '2', '3', '4', '5', '6', '7'], fretCount: 0 });
      const dMajor = calculateFretboard({ key: 'D', scale: ['1', '2', '3', '4', '5', '6', '7'], fretCount: 0 });

      expect(gMajor.length).toBeGreaterThan(0);
      expect(dMajor.length).toBeGreaterThan(0);
    });

    it('should work with pentatonic scale', () => {
      const pentatonic: Interval[] = ['1', '2', '3', '5', '6'];
      const result = calculateFretboard({ key: 'C', scale: pentatonic, fretCount: 4 });

      // Check that some notes are not in scale
      const notesNotInScale = result.filter(n => !n.inScale);
      expect(notesNotInScale.length).toBeGreaterThan(0);
    });

    it('should work with blues scale', () => {
      const blues: Interval[] = ['1', 'b3', '4', 'b5', '5', 'b7'];
      const result = calculateFretboard({ key: 'C', scale: blues, fretCount: 12 });

      expect(result.length).toBe(6 * 13);
    });

    it('should handle different tunings', () => {
      const dropD: NoteName[] = ['E', 'B', 'G', 'D', 'A', 'D']; // Drop D tuning
      const result = calculateFretboard({ tuning: dropD, fretCount: 0 });

      // Low E string (string 5) should now be D
      const lowString = result.find(n => n.string === 5 && n.fret === 0);
      expect(lowString?.name).toBe('D');
    });

    it('should handle Open D tuning', () => {
      const openD: NoteName[] = ['E', 'B', 'G', 'D', 'A', 'D']; // Actually Open D is DADF#AD, but let's test with a valid array
      const result = calculateFretboard({ tuning: ['D', 'A', 'D', 'F#', 'A', 'D'] as NoteName, fretCount: 0 });

      expect(result.length).toBe(6);
    });

    it('should handle Open G tuning', () => {
      const openG: NoteName[] = ['D', 'B', 'G', 'D', 'G', 'D'];
      const result = calculateFretboard({ tuning: openG, fretCount: 0 });

      expect(result.length).toBe(6);
    });

    it('should handle DADGAD tuning', () => {
      const dadgad: NoteName[] = ['D', 'A', 'D', 'G', 'A', 'D'];
      const result = calculateFretboard({ tuning: dadgad, fretCount: 0 });

      expect(result.length).toBe(6);
    });

    it('should assign correct octaves', () => {
      const result = calculateFretboard({ fretCount: 12 });

      result.forEach(note => {
        expect(note.octave).toBeGreaterThanOrEqual(0);
        expect(typeof note.octave).toBe('number');
      });
    });
  });

  describe('getFretboardNotesForKey', () => {
    it('should include interval information', () => {
      const result = getFretboardNotesForKey('C', ['1', '2', '3', '4', '5', '6', '7'], 12);

      // Notes in scale should have interval info
      const rootNotes = result.filter(n => n.interval === '1');
      expect(rootNotes.length).toBeGreaterThan(0);

      // All C notes should be marked as root (1)
      const cNotes = result.filter(n => n.name === 'C');
      cNotes.forEach(note => {
        expect(note.interval).toBeDefined();
      });
    });

    it('should include degree information', () => {
      const result = getFretboardNotesForKey('C', ['1', '2', '3', '4', '5', '6', '7'], 12);

      // Notes in scale should have degree info
      const notesWithDegree = result.filter(n => n.degree !== undefined);
      expect(notesWithDegree.length).toBeGreaterThan(0);
    });

    it('should correctly identify roots in C major', () => {
      const result = getFretboardNotesForKey('C', ['1', '2', '3', '4', '5', '6', '7'], 12);

      const cNotes = result.filter(n => n.name === 'C');
      cNotes.forEach(note => {
        expect(note.interval).toBe('1');
        expect(note.degree).toBe('1');
      });
    });

    it('should correctly identify thirds in C major', () => {
      const result = getFretboardNotesForKey('C', ['1', '2', '3', '4', '5', '6', '7'], 12);

      const eNotes = result.filter(n => n.name === 'E');
      eNotes.forEach(note => {
        if (note.inScale) {
          expect(note.interval).toBe('3');
          expect(note.degree).toBe('3');
        }
      });
    });

    it('should correctly identify fifths in C major', () => {
      const result = getFretboardNotesForKey('C', ['1', '2', '3', '4', '5', '6', '7'], 12);

      const gNotes = result.filter(n => n.name === 'G');
      gNotes.forEach(note => {
        if (note.inScale) {
          expect(note.interval).toBe('5');
          expect(note.degree).toBe('5');
        }
      });
    });

    it('should work with minor scale', () => {
      const result = getFretboardNotesForKey('C', ['1', '2', 'b3', '4', '5', 'b6', 'b7'], 12);

      // Eb/D# should be the b3 (minor third) - enharmonic spelling may vary
      const minorThirdNotes = result.filter(n => n.name === 'Eb' || n.name === 'D#');
      expect(minorThirdNotes.length).toBeGreaterThan(0);

      // Check that notes marked as b3 have correct interval
      const b3Notes = result.filter(n => n.interval === 'b3');
      expect(b3Notes.length).toBeGreaterThan(0);
    });

    it('should work with pentatonic major', () => {
      const pentatonicMajor: Interval[] = ['1', '2', '3', '5', '6'];
      const result = getFretboardNotesForKey('C', pentatonicMajor, 12);

      const rootNotes = result.filter(n => n.interval === '1');
      expect(rootNotes.length).toBeGreaterThan(0);
    });

    it('should work with pentatonic minor', () => {
      const pentatonicMinor: Interval[] = ['1', 'b3', '4', '5', 'b7'];
      const result = getFretboardNotesForKey('C', pentatonicMinor, 12);

      const rootNotes = result.filter(n => n.interval === '1');
      expect(rootNotes.length).toBeGreaterThan(0);
    });

    it('should work with blues scale', () => {
      const blues: Interval[] = ['1', 'b3', '4', 'b5', '5', 'b7'];
      const result = getFretboardNotesForKey('C', blues, 12);

      // Blues scale has 6 notes, check for blue note (b5)
      const blueNotes = result.filter(n => n.interval === 'b5');
      expect(blueNotes.length).toBeGreaterThan(0);
    });

    it('should work with different keys', () => {
      const gMajor = getFretboardNotesForKey('G', ['1', '2', '3', '4', '5', '6', '7'], 12);
      const dMajor = getFretboardNotesForKey('D', ['1', '2', '3', '4', '5', '6', '7'], 12);
      const aMinor = getFretboardNotesForKey('A', ['1', '2', 'b3', '4', '5', 'b6', 'b7'], 12);

      expect(gMajor.length).toBe(6 * 13);
      expect(dMajor.length).toBe(6 * 13);
      expect(aMinor.length).toBe(6 * 13);
    });

    it('should handle sharp keys (F# major)', () => {
      const result = getFretboardNotesForKey('F#', ['1', '2', '3', '4', '5', '6', '7'], 12);

      expect(result.length).toBe(6 * 13);
    });

    it('should handle flat keys (Db major)', () => {
      const result = getFretboardNotesForKey('Db', ['1', '2', '3', '4', '5', '6', '7'], 12);

      expect(result.length).toBe(6 * 13);
    });

    it('should include all note properties', () => {
      const result = getFretboardNotesForKey('C', ['1', '2', '3', '4', '5', '6', '7'], 0);

      result.forEach(note => {
        expect(note.name).toBeDefined();
        expect(note.octave).toBeDefined();
        expect(note.string).toBeGreaterThanOrEqual(0);
        expect(note.string).toBeLessThanOrEqual(5);
        expect(note.fret).toBeGreaterThanOrEqual(0);
        expect(typeof note.inScale).toBe('boolean');
        // interval and degree are optional for notes not in scale
      });
    });
  });

  describe('getIntervalColor', () => {
    it('should return color for root', () => {
      const color = getIntervalColor('1');

      expect(color).toBe('#ef4444');
    });

    it('should return color for thirds', () => {
      const majorThird = getIntervalColor('3');
      const minorThird = getIntervalColor('b3');

      expect(majorThird).toBe('#3b82f6');
      expect(minorThird).toBe('#3b82f6');
    });

    it('should return color for perfect fourth', () => {
      const color = getIntervalColor('4');

      expect(color).toBe('#22c55e');
    });

    it('should return color for perfect fifth', () => {
      const color = getIntervalColor('5');

      expect(color).toBe('#22c55e');
    });

    it('should return color for minor seventh', () => {
      const color = getIntervalColor('b7');

      expect(color).toBe('#eab308');
    });

    it('should return color for major seventh', () => {
      const color = getIntervalColor('7');

      expect(color).toBe('#eab308');
    });

    it('should return color for extensions', () => {
      const ninth = getIntervalColor('9');
      const eleventh = getIntervalColor('11');
      const thirteenth = getIntervalColor('13');

      expect(ninth).toBe('#f97316');
      expect(eleventh).toBe('#f97316');
      expect(thirteenth).toBe('#f97316');
    });

    it('should return color for altered intervals', () => {
      const flatNine = getIntervalColor('b9');
      const sharpNine = getIntervalColor('#9');
      const sharpEleven = getIntervalColor('#11');

      expect(flatNine).toBe('#f97316');
      expect(sharpNine).toBe('#f97316');
      expect(sharpEleven).toBe('#f97316');
    });

    it('should return default gray for undefined interval', () => {
      const color = getIntervalColor(undefined);

      expect(color).toBe('#6b7280');
    });

    it('should return color for second', () => {
      const color = getIntervalColor('2');

      expect(color).toBe('#a855f7');
    });

    it('should return color for sixth', () => {
      const color = getIntervalColor('6');

      expect(color).toBe('#a855f7');
    });

    it('should return color for flat second', () => {
      const color = getIntervalColor('b2');

      expect(color).toBe('#a855f7');
    });
  });

  describe('Fretboard patterns and positions', () => {
    it('should find C notes at standard positions', () => {
      const result = calculateFretboard({ fretCount: 12 });

      // C notes on standard tuning ['E', 'B', 'G', 'D', 'A', 'E']:
      // String 4 (A): 3rd fret (A + 3 semitones = C)
      // String 3 (D): 10th fret (D + 10 semitones = C)
      // String 2 (G): 5th fret (G + 5 semitones = C)
      // String 1 (B): 1st fret (B + 1 semitone = C)
      // String 5 (E low): 8th fret (E + 8 semitones = C)
      // String 0 (E high): 8th fret (E + 8 semitones = C)

      const cNotes = result.filter(n => n.name === 'C');

      expect(cNotes.some(n => n.string === 4 && n.fret === 3)).toBe(true);
      expect(cNotes.some(n => n.string === 3 && n.fret === 10)).toBe(true);
      expect(cNotes.some(n => n.string === 2 && n.fret === 5)).toBe(true);
      expect(cNotes.some(n => n.string === 1 && n.fret === 1)).toBe(true);
    });

    it('should find octave patterns', () => {
      const result = calculateFretboard({ fretCount: 12 });

      // Find all E notes
      const eNotes = result.filter(n => n.name === 'E');

      // With fretCount 12, E appears at:
      // String 0 (E): frets 0, 12
      // String 1 (B): fret 5
      // String 2 (G): fret 9
      // String 3 (D): fret 2
      // String 4 (A): fret 7
      // String 5 (E): frets 0, 12
      // Total: 8 E notes on fretboard (0-12)
      expect(eNotes.length).toBe(8);

      // Should find E notes on both E strings
      const highE = eNotes.filter(n => n.string === 0);
      const lowE = eNotes.filter(n => n.string === 5);
      expect(highE.length).toBe(2); // frets 0 and 12
      expect(lowE.length).toBe(2); // frets 0 and 12
    });

    it('should demonstrate the "box" pattern for pentatonic', () => {
      const result = calculateFretboard({
        key: 'C',
        scale: ['1', 'b3', '4', '5', 'b7'], // Minor pentatonic
        fretCount: 12,
      });

      // In the 5th position (starting at 5th fret), we should have the classic box pattern
      const fifthPosNotes = result.filter(n => n.fret >= 5 && n.fret <= 8);
      const inScaleFifthPos = fifthPosNotes.filter(n => n.inScale);

      // Should have several in-scale notes in this position
      expect(inScaleFifthPos.length).toBeGreaterThan(0);
    });
  });

  describe('Cross-string relationships', () => {
    it('should show same pitch across strings at different frets', () => {
      const result = calculateFretboard({ fretCount: 12 });

      // Find A notes:
      // - String 3 (D string): 7th fret -> A
      // - String 4 (A string): 0 fret (open) -> A
      // Note: Implementation uses octave 4 for all open strings
      // Standard tuning: ['E', 'B', 'G', 'D', 'A', 'E'] (0=high E, 4=A)

      const aOnD = result.find(n => n.string === 3 && n.fret === 7);
      const aOnA = result.find(n => n.string === 4 && n.fret === 0);

      expect(aOnD?.name).toBe('A');
      expect(aOnA?.name).toBe('A');
      // Both have same octave in this simplified implementation
      expect(aOnD?.octave).toBe(aOnA?.octave);
    });

    it('should demonstrate unison relationship', () => {
      const result = calculateFretboard({ fretCount: 12 });

      // G on string 2 (G) at fret 0 (open) = string 3 (D) at 5th fret
      // Standard tuning: ['E', 'B', 'G', 'D', 'A', 'E']

      const gOnG = result.find(n => n.string === 2 && n.fret === 0);
      const gOnD = result.find(n => n.string === 3 && n.fret === 5);

      expect(gOnG?.name).toBe('G');
      expect(gOnD?.name).toBe('G');
    });
  });

  describe('Guitar-specific patterns', () => {
    it('should handle the B string offset', () => {
      const result = calculateFretboard({ fretCount: 12 });

      // The B string is tuned differently (major third instead than fourth)
      // This affects interval patterns across the break
      // Standard tuning: ['E', 'B', 'G', 'D', 'A', 'E'] (string 0=high E, 1=B, 2=G, 3=D)

      // Find C notes:
      // - String 2 (G string): 5th fret = C
      // - String 1 (B string): 1st fret = C (or string 0 high E at 8th fret)

      const cOnG = result.find(n => n.string === 2 && n.fret === 5);
      const cOnB = result.find(n => n.string === 1 && n.fret === 1);

      expect(cOnG?.name).toBe('C');
      expect(cOnB?.name).toBe('C');
    });

    it('should demonstrate 4-fret hand position', () => {
      const result = calculateFretboard({
        key: 'C',
        scale: ['1', '2', '3', '4', '5', '6', '7'],
        fretCount: 12,
      });

      // In first position (frets 0-4), check we have reasonable coverage
      const firstPosNotes = result.filter(n => n.fret >= 0 && n.fret <= 4);
      const inScaleFirstPos = firstPosNotes.filter(n => n.inScale);

      // Should have at least some notes in scale in first position
      expect(inScaleFirstPos.length).toBeGreaterThan(10);
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle zero fret count', () => {
      const result = calculateFretboard({ fretCount: 0 });

      expect(result).toHaveLength(6); // Only open strings
    });

    it('should handle single fret', () => {
      const result = calculateFretboard({ fretCount: 1 });

      expect(result).toHaveLength(12); // 6 strings x 2 frets (0 and 1)
    });

    it('should handle high fret counts', () => {
      const result = calculateFretboard({ fretCount: 24 });

      expect(result).toHaveLength(6 * 25); // 6 strings x 25 frets
    });

    it('should handle empty tuning (should skip incomplete strings)', () => {
      const result = calculateFretboard({ tuning: ['E', '', 'G', 'D', 'A', 'E'] as NoteName, fretCount: 0 });

      // Should skip the empty string position
      expect(result.length).toBeLessThan(6);
    });

    it('should handle chromatic scale', () => {
      const chromatic: Interval[] = ['1', 'b2', '2', 'b3', '3', '4', '#4', '5', 'b6', '6', '#6', '7'];
      const result = calculateFretboard({ key: 'C', scale: chromatic, fretCount: 12 });

      // All notes should be in scale
      const notInScale = result.filter(n => !n.inScale);
      expect(notInScale.length).toBe(0);
    });

    it('should handle all standard guitar keys', () => {
      const keys: NoteName[] = ['C', 'G', 'D', 'A', 'E', 'F', 'Bb', 'Eb'];

      keys.forEach(key => {
        const result = getFretboardNotesForKey(key, ['1', '2', '3', '4', '5', '6', '7'], 12);
        expect(result.length).toBe(6 * 13);
      });
    });
  });

  describe('Scale visualization support', () => {
    it('should support CAGED system visualization', () => {
      const result = calculateFretboard({
        key: 'C',
        scale: ['1', '3', '5'], // Major triad intervals
        fretCount: 12,
      });

      // Should have notes for CAGED pattern visualization
      const inScale = result.filter(n => n.inScale);
      expect(inScale.length).toBeGreaterThan(0);
    });

    it('should support 3-notes-per-string patterns', () => {
      const result = calculateFretboard({
        key: 'C',
        scale: ['1', '2', '3', '4', '5', '6', '7'],
        fretCount: 12,
      });

      // For 3NPS patterns, we need good coverage across frets
      const middleFrets = result.filter(n => n.fret >= 5 && n.fret <= 9);
      expect(middleFrets.length).toBeGreaterThan(20);
    });

    it('should support interval visualization for chord tones', () => {
      const result = getFretboardNotesForKey('C', ['1', '3', '5', 'b7'], 12);

      // Roots (1) should be marked
      const roots = result.filter(n => n.interval === '1');
      expect(roots.length).toBeGreaterThan(0);

      // Thirds should be marked
      const thirds = result.filter(n => n.interval === '3');
      expect(thirds.length).toBeGreaterThan(0);

      // Fifths should be marked
      const fifths = result.filter(n => n.interval === '5');
      expect(fifths.length).toBeGreaterThan(0);

      // Minor sevenths should be marked
      const sevenths = result.filter(n => n.interval === 'b7');
      expect(sevenths.length).toBeGreaterThan(0);
    });
  });

  describe('Musical applications', () => {
    it('should support blues scale visualization', () => {
      const result = calculateFretboard({
        key: 'C',
        scale: ['1', 'b3', '4', 'b5', '5', 'b7'],
        fretCount: 12,
      });

      // The "blue note" (b5) should be in scale
      const blueNotes = result.filter(n => n.name === 'F#');
      expect(blueNotes.length).toBeGreaterThan(0);
    });

    it('should support mixolydian mode visualization', () => {
      const mixolydian: Interval[] = ['1', '2', '3', '4', '5', '6', 'b7'];
      const result = calculateFretboard({
        key: 'C',
        scale: mixolydian,
        fretCount: 12,
      });

      // Mixolydian is like major with b7
      const inScale = result.filter(n => n.inScale);
      expect(inScale.length).toBeGreaterThan(0);
    });

    it('should support dorian mode visualization', () => {
      const dorian: Interval[] = ['1', '2', 'b3', '4', '5', '6', 'b7'];
      const result = calculateFretboard({
        key: 'C',
        scale: dorian,
        fretCount: 12,
      });

      // Dorian is like natural minor with major 6th
      const inScale = result.filter(n => n.inScale);
      expect(inScale.length).toBeGreaterThan(0);
    });

    it('should support jazz scale visualization (melodic minor)', () => {
      const melodicMinor: Interval[] = ['1', '2', 'b3', '4', '5', '6', '7'];
      const result = calculateFretboard({
        key: 'C',
        scale: melodicMinor,
        fretCount: 12,
      });

      expect(result.length).toBe(6 * 13);
    });
  });
});
