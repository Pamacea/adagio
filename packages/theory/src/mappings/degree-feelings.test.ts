// ============================================================================
// DEGREE FEELINGS TESTS — filet de non-régression (P1)
// ============================================================================
// Fige la grammaire des clés `${degree}-${tonality}` (même grammaire visée
// par les DegreeKey de l'étape 5 du plan P1).

import { describe, it, expect } from 'vitest';
import type { ProgressionDegree } from '@adagio/types';
import { getDegreeFeeling } from './degree-feelings';

// Les clés du Record ('vii°', 'ii°', 'III') sortent du type ProgressionDegree —
// divergence type/données figée ici telle quelle (purification P1 possible).
const asDegree = (d: string): ProgressionDegree => d as ProgressionDegree;

describe('getDegreeFeeling', () => {
  it('clés majeures : I ii iii IV V vi vii° renseignées', () => {
    const majorDegrees = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
    for (const degree of majorDegrees) {
      const feeling = getDegreeFeeling(asDegree(degree), 'major');
      expect(feeling.sensation, degree).toBeTruthy();
      expect(feeling.advice, degree).toBeTruthy();
      expect(feeling.tonality).toBe('major');
    }
  });

  it('clés mineures : i ii° III iv v VI VII renseignées', () => {
    const minorDegrees = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];
    for (const degree of minorDegrees) {
      const feeling = getDegreeFeeling(asDegree(degree), 'minor');
      expect(feeling.sensation, degree).toBeTruthy();
      expect(feeling.advice, degree).toBeTruthy();
      expect(feeling.tonality).toBe('minor');
    }
  });

  it("figure quelques sensations d'exemple", () => {
    expect(getDegreeFeeling('I', 'major').sensation).toBe('Être content à la maison');
    expect(getDegreeFeeling('V', 'major').sensation).toContain('Tension');
    expect(getDegreeFeeling('i', 'minor').sensation).toBe('Tristesse résignée');
  });
});
