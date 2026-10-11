// ============================================================================
// HARMONIC SUGGESTIONS TESTS — filet de non-régression (P1)
// ============================================================================
// Réécriture délibérée à l'étape 3 du plan P1 : les clés kebab (ScaleId) ont
// été remplacées par le canon ScaleType (camel) ; SCALE_ID_TO_TYPE assure la
// rétrocompatibilité des anciennes clés. Les clés CHORD_TO_SCALE et les
// intervalles de référence restent figés.

import { describe, it, expect } from 'vitest';
import {
  CHORD_TO_SCALE,
  SCALE_DEFINITIONS,
  SCALE_ID_TO_TYPE,
  getScalesForChord,
} from './harmonic-suggestions';
import type { ScaleType } from './scales';

describe('CHORD_TO_SCALE', () => {
  it("fige la liste des clés d'accords mappées", () => {
    expect(Object.keys(CHORD_TO_SCALE).sort()).toEqual(
      [
        'Abmaj7#11',
        'Am',
        'Am7',
        'Bdim',
        'Bdim7',
        'Bm7b5',
        'C',
        'C6',
        'C69',
        'Caug',
        'Cm11',
        'Cm9',
        'Cmaj7',
        'Cmaj7#11',
        'Cmaj9',
        'C13',
        'Csus2',
        'Csus4',
        'Dbmaj7',
        'G7',
        'G7alt',
        'G7sus4',
        'G9',
        'G7#11',
        'G7#9',
      ].sort()
    );
  });

  it('chaque accord possède au moins une suggestion avec un match valide', () => {
    const matches = ['perfect', 'good', 'possible', 'experimental'];
    for (const [chord, suggestions] of Object.entries(CHORD_TO_SCALE)) {
      expect(suggestions.length, chord).toBeGreaterThan(0);
      for (const s of suggestions) {
        expect(matches, `${chord} → ${s.scaleId}`).toContain(s.match);
        expect(SCALE_DEFINITIONS[s.scaleId], `${chord} → ${s.scaleId}`).toBeDefined();
      }
    }
  });
});

describe('SCALE_DEFINITIONS', () => {
  it('couvre les 28 ids ScaleType', () => {
    const expected: ScaleType[] = [
      'major',
      'minor',
      'harmonicMajor',
      'harmonicMinor',
      'melodicMajor',
      'melodicMinor',
      'pentatonicMajor',
      'pentatonicMinor',
      'blues',
      'dorian',
      'dorianB2',
      'phrygian',
      'lydian',
      'lydianAugmented',
      'lydianDominant',
      'mixolydian',
      'mixolydianB13',
      'locrian',
      'locrianNatural2',
      'altered',
      'halfDiminished',
      'napolitanMajor',
      'napolitanMinor',
      'augmentedMajor',
      'augmentedMinor',
      'wholeTone',
      'diminished',
      'chromatic',
    ];
    expect(Object.keys(SCALE_DEFINITIONS).sort()).toEqual([...expected].sort());
  });

  it('fige les intervalles de chaque gamme (référence actuelle)', () => {
    expect(SCALE_DEFINITIONS['major'].intervals).toEqual(['1', '2', '3', '4', '5', '6', '7']);
    expect(SCALE_DEFINITIONS['minor'].intervals).toEqual(['1', '2', 'b3', '4', '5', 'b6', 'b7']);
    expect(SCALE_DEFINITIONS['blues'].intervals).toEqual(['1', 'b3', '4', 'b5', '5', 'b7']);
    expect(SCALE_DEFINITIONS['wholeTone'].intervals).toEqual(['1', '2', '3', '#4', '#5', 'b7']);
    expect(SCALE_DEFINITIONS['diminished'].intervals).toEqual([
      '1',
      'b2',
      'b3',
      '3',
      '#4',
      '5',
      '6',
      'b7',
    ]);
    expect(SCALE_DEFINITIONS['altered'].intervals).toEqual([
      '1',
      'b2',
      'b3',
      'b4',
      'b5',
      'b6',
      'b7',
    ]);
    expect(SCALE_DEFINITIONS['chromatic'].intervals).toHaveLength(12);
  });
});

describe('SCALE_ID_TO_TYPE', () => {
  it('fige les 24 anciennes clés kebab et leurs cibles', () => {
    expect(Object.keys(SCALE_ID_TO_TYPE).sort()).toEqual(
      [
        'major',
        'minor',
        'harmonic-minor',
        'melodic-minor',
        'dorian',
        'phrygian',
        'lydian',
        'mixolydian',
        'aeolian',
        'locrian',
        'pentatonic-major',
        'pentatonic-minor',
        'blues',
        'pentatonic-blues',
        'dorian-b2',
        'lydian-augmented',
        'lydian-dominant',
        'mixolydian-b13',
        'locrian-natural2',
        'altered',
        'half-diminished',
        'whole-tone',
        'diminished',
        'chromatic',
      ].sort()
    );
  });

  it('toutes les cibles sont des ids définis dans SCALE_DEFINITIONS', () => {
    for (const [legacy, type] of Object.entries(SCALE_ID_TO_TYPE)) {
      expect(SCALE_DEFINITIONS[type], `${legacy} → ${type}`).toBeDefined();
    }
  });

  it('fusionne les alias historiques (aeolian → minor, pentatonic-blues → blues)', () => {
    expect(SCALE_ID_TO_TYPE['aeolian']).toBe('minor');
    expect(SCALE_ID_TO_TYPE['pentatonic-blues']).toBe('blues');
  });
});

describe('getScalesForChord — index chordKey (étape 5 P1)', () => {
  it("retrouve les clés littérales de CHORD_TO_SCALE via l'index", () => {
    expect(getScalesForChord('C')).toEqual(CHORD_TO_SCALE['C']);
    expect(getScalesForChord('Dbmaj7')).toEqual(CHORD_TO_SCALE['Dbmaj7']);
    expect(getScalesForChord('Am7')).toEqual(CHORD_TO_SCALE['Am7']);
  });

  it("normalise les alias de qualité via l'index (M → '')", () => {
    expect(getScalesForChord('CM')).toEqual(CHORD_TO_SCALE['C']);
  });

  it('conserve le repli générique pour un accord non listé', () => {
    // Cb7 : ni littéral ni index → repli dominant générique basé sur G7
    const suggestions = getScalesForChord('Cb7');
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions.some((s) => s.context?.includes('générique'))).toBe(true);
  });
});
