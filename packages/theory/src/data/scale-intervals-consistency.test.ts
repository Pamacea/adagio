// ============================================================================
// SCALE INTERVALS CONSISTENCY — P1 étape 3
// ============================================================================
// Invariant : pour tout ScaleType, SCALE_DEFINITIONS (référence) et
// SCALE_INTERVALS décrivent exactement les mêmes intervalles.

import { describe, it, expect } from 'vitest';
import { SCALE_INTERVALS, SCALES, type ScaleType } from './scales';
import { SCALE_DEFINITIONS } from './harmonic-suggestions';

describe('cohérence SCALE_DEFINITIONS ↔ SCALE_INTERVALS', () => {
  it('SCALE_DEFINITIONS couvre exactement les ids de ScaleType', () => {
    expect(Object.keys(SCALE_DEFINITIONS).sort()).toEqual(Object.keys(SCALE_INTERVALS).sort());
  });

  it.each(Object.keys(SCALE_INTERVALS) as ScaleType[])('%s : intervalles identiques', (id) => {
    expect(SCALE_DEFINITIONS[id].intervals).toEqual(SCALE_INTERVALS[id]);
  });

  it('SCALES (UI) référence des intervalles inclus dans SCALE_INTERVALS', () => {
    for (const scale of SCALES) {
      expect(SCALE_INTERVALS[scale.id], scale.id).toEqual(scale.intervals);
    }
  });
});
