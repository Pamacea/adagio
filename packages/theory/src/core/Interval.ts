// ============================================================================
// INTERVAL - Musical interval class
// ============================================================================

import type { Interval } from '@adagio/types';

/**
 * Semitone values for intervals
 */
export const INTERVAL_SEMITONES: Record<Interval, number> = {
  '1': 0,
  'b2': 1,
  '2': 2,
  'b3': 3,
  '3': 4,
  '4': 5,
  '#4': 6,
  'b5': 6,
  '5': 7,
  '#5': 8,
  'b6': 8,
  '6': 9,
  'bb7': 9,
  'b7': 10,
  '7': 11,
};

/**
 * Get interval name from semitones
 */
export function getIntervalFromSemitones(semitones: number): Interval {
  const semitoneToInterval: Record<number, Interval> = {
    0: '1',
    1: 'b2',
    2: '2',
    3: 'b3',
    4: '3',
    5: '4',
    6: '#4',
    7: 'b5',
    8: '5',
    9: '#5',
    10: 'b6',
    11: '6',
    12: 'bb7',
    13: 'b7',
    14: '7',
  };

  return semitoneToInterval[semitones] || '1';
}

/**
 * Check if interval is altered (has sharps/flats)
 */
export function isAltered(interval: Interval): boolean {
  return ['#4', 'b2', 'b3', '#4', 'b5', '#5', 'b6', 'bb7', 'b7'].includes(interval);
}

/**
 * Check if interval is a extension (9, 11, 13)
 */
export function isExtension(interval: Interval): boolean {
  return ['9', '11', '13', 'b9', '#11'].includes(interval);
}
