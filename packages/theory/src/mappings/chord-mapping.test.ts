// ============================================================================
// CHORD MAPPING TESTS — réécriture délibérée (P1 étape 5)
// ============================================================================
// Les anciennes tables MAJOR_DEGREE_CHORDS / MINOR_DEGREE_CHORDS ont fusionné
// en une table unique DEGREE_CHORDS indexée par DegreeChordKey
// (`${degré}-${tonalité}`, même grammaire que degree-feelings).

import { describe, it, expect } from 'vitest';
import {
  DEGREE_CHORDS,
  degreeKey,
  getChordsByDegree,
  getRomanDegrees,
  getChordsByFunction,
} from './chord-mapping';

const MAJOR_ROMANS = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii'];
const MINOR_ROMANS = ['i', 'ii', 'III', 'iv', 'v', 'VI', 'VII'];

describe('DEGREE_CHORDS — index par DegreeChordKey (étape 5 P1)', () => {
  it('degreeKey respecte la grammaire `${degré}-${tonalité}`', () => {
    expect(degreeKey('I', 'major')).toBe('I-major');
    expect(degreeKey('ii', 'major')).toBe('ii-major');
    expect(degreeKey('i', 'minor')).toBe('i-minor');
    expect(degreeKey('vii', 'minor')).toBe('vii-minor');
  });

  it('14 clés : 7 degrés majeurs + 7 degrés mineurs, aucune collision', () => {
    const expected = [
      ...MAJOR_ROMANS.map((d) => degreeKey(d, 'major')),
      ...MINOR_ROMANS.map((d) => degreeKey(d, 'minor')),
    ];
    expect(expected).toHaveLength(14);
    expect(new Set(expected).size).toBe(14);
    expect(Object.keys(DEGREE_CHORDS).sort()).toEqual([...expected].sort());
  });

  it('figure le contenu du degré I-major (6 accords)', () => {
    const entries = getChordsByDegree('I', 'major');
    expect(entries.map((e) => e.name)).toEqual(['I', 'I6', 'Imaj7', 'Imaj9', 'Imaj13', 'Iadd9']);
    expect(entries.map((e) => e.function)).toEqual(Array(6).fill('tonic'));
  });

  it('tous les degrés romains majeurs/mineurs sont renseignés', () => {
    for (const degree of getRomanDegrees('major')) {
      expect(getChordsByDegree(degree, 'major').length, degree).toBeGreaterThan(0);
    }
    for (const degree of getRomanDegrees('minor')) {
      expect(getChordsByDegree(degree, 'minor').length, degree).toBeGreaterThan(0);
    }
    expect([...getRomanDegrees('major')]).toEqual(MAJOR_ROMANS);
    expect([...getRomanDegrees('minor')]).toEqual(MINOR_ROMANS);
  });

  it('un degré inconnu retourne [] et les tonalités restent distinctes', () => {
    expect(getChordsByDegree('IX', 'major')).toEqual([]);
    expect(getChordsByDegree('I', 'major')).not.toBe(getChordsByDegree('i', 'minor'));
  });

  it('groupement par fonction : tonic/predominant/dominant non vides', () => {
    const grouped = getChordsByFunction('major');
    expect(Object.keys(grouped)).toEqual(['tonic', 'predominant', 'dominant']);
    expect(grouped['tonic']!.length).toBeGreaterThan(0);
    expect(grouped['predominant']!.length).toBeGreaterThan(0);
    expect(grouped['dominant']!.length).toBeGreaterThan(0);
  });
});
