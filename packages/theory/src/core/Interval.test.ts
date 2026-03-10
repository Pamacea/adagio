// ============================================================================
// INTERVAL - Musical interval class tests
// ============================================================================
//
// Tests pour les constantes et fonctions d'intervalles
// ============================================================================

import { describe, it, expect } from 'vitest';
import {
  INTERVAL_SEMITONES,
  getIntervalFromSemitones,
  isAltered,
  isExtension,
} from './Interval';
import type { Interval } from '@adagio/types';

describe('INTERVAL_SEMITONES', () => {
  it('should have all basic intervals defined', () => {
    const basicIntervals: Interval[] = [
      '1', '#1', 'b2', '2', '#2', 'b3', '3', '#3', 'b4', '4', '#4', 'b5',
      '5', '#5', 'b6', 'bb6', '6', '#6', 'bb7', 'b7', '7',
    ];

    basicIntervals.forEach(interval => {
      expect(INTERVAL_SEMITONES[interval]).toBeDefined();
    });
  });

  it('should have all extension intervals defined', () => {
    const extensionIntervals: Interval[] = [
      'b9', '9', '#9', '11', '#11', 'b13', '13',
    ];

    extensionIntervals.forEach(interval => {
      expect(INTERVAL_SEMITONES[interval]).toBeDefined();
    });
  });

  it('should return 0 for unison (1)', () => {
    expect(INTERVAL_SEMITONES['1']).toBe(0);
  });

  it('should return correct semitones for major third', () => {
    expect(INTERVAL_SEMITONES['3']).toBe(4);
  });

  it('should return correct semitones for perfect fifth', () => {
    expect(INTERVAL_SEMITONES['5']).toBe(7);
  });

  it('should return correct semitones for minor third', () => {
    expect(INTERVAL_SEMITONES['b3']).toBe(3);
  });

  it('should return correct semitones for augmented intervals', () => {
    expect(INTERVAL_SEMITONES['#4']).toBe(6);
    expect(INTERVAL_SEMITONES['#5']).toBe(8);
  });

  it('should return correct semitones for diminished intervals', () => {
    expect(INTERVAL_SEMITONES['b5']).toBe(6);
    expect(INTERVAL_SEMITONES['bb7']).toBe(9);
  });

  it('should handle enharmonic intervals (same semitones)', () => {
    // Augmented fourth and diminished fifth are enharmonic
    expect(INTERVAL_SEMITONES['#4']).toBe(INTERVAL_SEMITONES['b5']);

    // Sharp 1 and flat 2 are enharmonic
    expect(INTERVAL_SEMITONES['#1']).toBe(INTERVAL_SEMITONES['b2']);

    // Sharp 2 and flat 3 are enharmonic
    expect(INTERVAL_SEMITONES['#2']).toBe(INTERVAL_SEMITONES['b3']);
  });

  describe('Extension intervals', () => {
    it('should return 13 for flat 9', () => {
      expect(INTERVAL_SEMITONES['b9']).toBe(13);
    });

    it('should return 14 for 9', () => {
      expect(INTERVAL_SEMITONES['9']).toBe(14);
    });

    it('should return 17 for 11', () => {
      expect(INTERVAL_SEMITONES['11']).toBe(17);
    });

    it('should return 21 for 13', () => {
      expect(INTERVAL_SEMITONES['13']).toBe(21);
    });

    it('should relate extensions to basic intervals', () => {
      // 9 is one octave above 2
      expect(INTERVAL_SEMITONES['9']).toBe(INTERVAL_SEMITONES['2'] + 12);

      // 11 is one octave above 4
      expect(INTERVAL_SEMITONES['11']).toBe(INTERVAL_SEMITONES['4'] + 12);

      // 13 is one octave above 6
      expect(INTERVAL_SEMITONES['13']).toBe(INTERVAL_SEMITONES['6'] + 12);
    });
  });

  describe('Interval arithmetic', () => {
    it('should correctly add intervals for major scale', () => {
      // Major scale intervals: 1, 2, 3, 4, 5, 6, 7
      const majorScaleIntervals: Interval[] = ['1', '2', '3', '4', '5', '6', '7'];
      const expectedSemitones = [0, 2, 4, 5, 7, 9, 11];

      majorScaleIntervals.forEach((interval, index) => {
        expect(INTERVAL_SEMITONES[interval]).toBe(expectedSemitones[index]);
      });
    });

    it('should correctly add intervals for minor scale', () => {
      // Natural minor intervals: 1, 2, b3, 4, 5, b6, b7
      const minorScaleIntervals: Interval[] = ['1', '2', 'b3', '4', '5', 'b6', 'b7'];
      const expectedSemitones = [0, 2, 3, 5, 7, 8, 10];

      minorScaleIntervals.forEach((interval, index) => {
        expect(INTERVAL_SEMITONES[interval]).toBe(expectedSemitones[index]);
      });
    });

    it('should calculate perfect fifth interval', () => {
      // Fifth is 7 semitones from root
      expect(INTERVAL_SEMITONES['5'] - INTERVAL_SEMITONES['1']).toBe(7);
    });

    it('should calculate perfect fourth interval', () => {
      // Fourth is 5 semitones from root
      expect(INTERVAL_SEMITONES['4'] - INTERVAL_SEMITONES['1']).toBe(5);
    });

    it('should calculate major third interval', () => {
      // Major third is 4 semitones from root
      expect(INTERVAL_SEMITONES['3'] - INTERVAL_SEMITONES['1']).toBe(4);
    });

    it('should calculate minor third interval', () => {
      // Minor third is 3 semitones from root
      expect(INTERVAL_SEMITONES['b3'] - INTERVAL_SEMITONES['1']).toBe(3);
    });

    it('should calculate tritone interval', () => {
      // Tritone is 6 semitones (augmented fourth or diminished fifth)
      expect(INTERVAL_SEMITONES['#4'] - INTERVAL_SEMITONES['1']).toBe(6);
      expect(INTERVAL_SEMITONES['b5'] - INTERVAL_SEMITONES['1']).toBe(6);
    });
  });
});

describe('getIntervalFromSemitones', () => {
  it('should return unison for 0 semitones', () => {
    expect(getIntervalFromSemitones(0)).toBe('1');
  });

  it('should return flat 2 for 1 semitone', () => {
    expect(getIntervalFromSemitones(1)).toBe('b2');
  });

  it('should return major second for 2 semitones', () => {
    expect(getIntervalFromSemitones(2)).toBe('2');
  });

  it('should return minor third for 3 semitones', () => {
    expect(getIntervalFromSemitones(3)).toBe('b3');
  });

  it('should return major third for 4 semitones', () => {
    expect(getIntervalFromSemitones(4)).toBe('3');
  });

  it('should return perfect fourth for 5 semitones', () => {
    expect(getIntervalFromSemitones(5)).toBe('4');
  });

  it('should return augmented fourth for 6 semitones', () => {
    expect(getIntervalFromSemitones(6)).toBe('#4');
  });

  it('should return diminished fifth for 7 semitones', () => {
    expect(getIntervalFromSemitones(7)).toBe('b5');
  });

  it('should return perfect fifth for 8 semitones', () => {
    expect(getIntervalFromSemitones(8)).toBe('5');
  });

  it('should return augmented fifth for 9 semitones', () => {
    expect(getIntervalFromSemitones(9)).toBe('#5');
  });

  it('should return flat 6 for 10 semitones', () => {
    expect(getIntervalFromSemitones(10)).toBe('b6');
  });

  it('should return major sixth for 11 semitones', () => {
    expect(getIntervalFromSemitones(11)).toBe('6');
  });

  it('should return double flat 7 for 12 semitones', () => {
    expect(getIntervalFromSemitones(12)).toBe('bb7');
  });

  it('should return flat 7 for 13 semitones', () => {
    expect(getIntervalFromSemitones(13)).toBe('b7');
  });

  it('should return major seventh for 14 semitones', () => {
    expect(getIntervalFromSemitones(14)).toBe('7');
  });

  it('should return unison as default for unknown semitones', () => {
    expect(getIntervalFromSemitones(999)).toBe('1');
  });

  it('should handle negative semitones', () => {
    expect(getIntervalFromSemitones(-1)).toBe('1');
  });
});

describe('isAltered', () => {
  it('should return true for sharped intervals', () => {
    expect(isAltered('#1')).toBe(true);
    expect(isAltered('#2')).toBe(true);
    expect(isAltered('#3')).toBe(true);
    expect(isAltered('#4')).toBe(true);
    expect(isAltered('#5')).toBe(true);
    expect(isAltered('#6')).toBe(true);
    expect(isAltered('#9')).toBe(true);
    expect(isAltered('#11')).toBe(true);
  });

  it('should return true for flatted intervals', () => {
    expect(isAltered('b2')).toBe(true);
    expect(isAltered('b3')).toBe(true);
    expect(isAltered('b4')).toBe(true);
    expect(isAltered('b5')).toBe(true);
    expect(isAltered('b6')).toBe(true);
    expect(isAltered('bb6')).toBe(true);
    expect(isAltered('bb7')).toBe(true);
    expect(isAltered('b7')).toBe(true);
    expect(isAltered('b9')).toBe(true);
    expect(isAltered('b13')).toBe(true);
  });

  it('should return false for natural unaltered intervals', () => {
    expect(isAltered('1')).toBe(false);
    expect(isAltered('2')).toBe(false);
    expect(isAltered('3')).toBe(false);
    expect(isAltered('4')).toBe(false);
    expect(isAltered('5')).toBe(false);
    expect(isAltered('6')).toBe(false);
    expect(isAltered('7')).toBe(false);
  });

  it('should return false for unaltered extensions', () => {
    expect(isAltered('9')).toBe(false);
    expect(isAltered('11')).toBe(false);
    expect(isAltered('13')).toBe(false);
  });

  it('should classify all diatonic major scale intervals as unaltered', () => {
    const majorScaleIntervals: Interval[] = ['1', '2', '3', '4', '5', '6', '7'];

    majorScaleIntervals.forEach(interval => {
      expect(isAltered(interval)).toBe(false);
    });
  });

  it('should classify all natural minor scale intervals', () => {
    // Natural minor: 1, 2, b3, 4, 5, b6, b7
    expect(isAltered('1')).toBe(false);
    expect(isAltered('2')).toBe(false);
    expect(isAltered('b3')).toBe(true);  // Altered compared to major
    expect(isAltered('4')).toBe(false);
    expect(isAltered('5')).toBe(false);
    expect(isAltered('b6')).toBe(true);  // Altered compared to major
    expect(isAltered('b7')).toBe(true);  // Altered compared to major
  });

  it('should identify chromatic intervals', () => {
    // All intervals outside major scale are altered
    const chromaticIntervals: Interval[] = [
      '#1', 'b2', '#2', 'b3', '#3', 'b4', '#4', 'b5',
      '#5', 'b6', 'bb6', 'bb7', 'b7',
    ];

    chromaticIntervals.forEach(interval => {
      expect(isAltered(interval)).toBe(true);
    });
  });
});

describe('isExtension', () => {
  it('should identify 9 as an extension', () => {
    expect(isExtension('9')).toBe(true);
  });

  it('should identify flat 9 as an extension', () => {
    expect(isExtension('b9')).toBe(true);
  });

  it('should identify sharp 9 as an extension', () => {
    expect(isExtension('#9')).toBe(true);
  });

  it('should identify 11 as an extension', () => {
    expect(isExtension('11')).toBe(true);
  });

  it('should identify sharp 11 as an extension', () => {
    expect(isExtension('#11')).toBe(true);
  });

  it('should identify flat 13 as an extension', () => {
    expect(isExtension('b13')).toBe(true);
  });

  it('should identify 13 as an extension', () => {
    expect(isExtension('13')).toBe(true);
  });

  it('should return false for basic intervals within octave', () => {
    const basicIntervals: Interval[] = [
      '1', '2', '3', '4', '5', '6', '7',
      'b2', 'b3', '#4', 'b5', '#5', 'b6', 'b7',
    ];

    basicIntervals.forEach(interval => {
      expect(isExtension(interval)).toBe(false);
    });
  });

  it('should return false for unaltered basic intervals', () => {
    expect(isExtension('1')).toBe(false);
    expect(isExtension('3')).toBe(false);
    expect(isExtension('5')).toBe(false);
  });
});

describe('Interval classification consistency', () => {
  it('should correctly categorize all intervals', () => {
    const intervals: Interval[] = [
      '1', '#1', 'b2', '2', '#2', 'b3', '3', '#3', 'b4', '4', '#4', 'b5',
      '5', '#5', 'b6', 'bb6', '6', '#6', 'bb7', 'b7', '7',
      'b9', '9', '#9', '11', '#11', 'b13', '13',
    ];

    // All intervals should have a valid semitone value
    intervals.forEach(interval => {
      expect(typeof INTERVAL_SEMITONES[interval]).toBe('number');
    });

    // Extensions should be > 12 semitones (above octave)
    const allExtensions: Interval[] = ['b9', '9', '#9', '11', '#11', 'b13', '13'];
    allExtensions.forEach(ext => {
      expect(INTERVAL_SEMITONES[ext]).toBeGreaterThan(12);
    });
  });

  it('should maintain consistency between isAltered and isExtension', () => {
    // Extensions can be altered or unaltered
    expect(isExtension('b9')).toBe(true);
    expect(isAltered('b9')).toBe(true);

    expect(isExtension('9')).toBe(true);
    expect(isAltered('9')).toBe(false);

    expect(isExtension('#9')).toBe(true);
    expect(isAltered('#9')).toBe(true);
  });
});

describe('Interval relationships for chord construction', () => {
  it('should provide intervals for major triad', () => {
    // Major triad: 1, 3, 5
    expect(INTERVAL_SEMITONES['1']).toBe(0);
    expect(INTERVAL_SEMITONES['3']).toBe(4);
    expect(INTERVAL_SEMITONES['5']).toBe(7);
  });

  it('should provide intervals for minor triad', () => {
    // Minor triad: 1, b3, 5
    expect(INTERVAL_SEMITONES['1']).toBe(0);
    expect(INTERVAL_SEMITONES['b3']).toBe(3);
    expect(INTERVAL_SEMITONES['5']).toBe(7);
  });

  it('should provide intervals for diminished triad', () => {
    // Diminished triad: 1, b3, b5
    expect(INTERVAL_SEMITONES['1']).toBe(0);
    expect(INTERVAL_SEMITONES['b3']).toBe(3);
    expect(INTERVAL_SEMITONES['b5']).toBe(6);
  });

  it('should provide intervals for augmented triad', () => {
    // Augmented triad: 1, 3, #5
    expect(INTERVAL_SEMITONES['1']).toBe(0);
    expect(INTERVAL_SEMITONES['3']).toBe(4);
    expect(INTERVAL_SEMITONES['#5']).toBe(8);
  });

  it('should provide intervals for dominant 7th chord', () => {
    // Dominant 7th: 1, 3, 5, b7
    const intervals = [0, 4, 7, 10];
    expect(INTERVAL_SEMITONES['1']).toBe(intervals[0]);
    expect(INTERVAL_SEMITONES['3']).toBe(intervals[1]);
    expect(INTERVAL_SEMITONES['5']).toBe(intervals[2]);
    expect(INTERVAL_SEMITONES['b7']).toBe(intervals[3]);
  });

  it('should provide intervals for major 7th chord', () => {
    // Major 7th: 1, 3, 5, 7
    const intervals = [0, 4, 7, 11];
    expect(INTERVAL_SEMITONES['1']).toBe(intervals[0]);
    expect(INTERVAL_SEMITONES['3']).toBe(intervals[1]);
    expect(INTERVAL_SEMITONES['5']).toBe(intervals[2]);
    expect(INTERVAL_SEMITONES['7']).toBe(intervals[3]);
  });
});
