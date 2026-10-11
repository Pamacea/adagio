// ============================================================================
// CHORD REF TESTS — parser unique (P1 étape 4)
// ============================================================================

import { describe, it, expect } from 'vitest';
import { parseChord, formatChord, chordKey } from './chord-ref';

describe('parseChord', () => {
  it('décompose racine + qualité', () => {
    expect(parseChord('C')).toEqual({ root: 'C', quality: '' });
    expect(parseChord('Am')).toEqual({ root: 'A', quality: 'm' });
    expect(parseChord('Dbmaj7')).toEqual({ root: 'Db', quality: 'maj7' });
    expect(parseChord('F#m7b5')).toEqual({ root: 'F#', quality: 'm7b5' });
    expect(parseChord('G7alt')).toEqual({ root: 'G', quality: '7alt' });
  });

  it('préserve les bémols de la saisie', () => {
    expect(parseChord('Bb')?.root).toBe('Bb');
    expect(parseChord('Ebm6')?.root).toBe('Eb');
  });

  it('gère les slash chords', () => {
    expect(parseChord('C/E')).toEqual({ root: 'C', quality: '', bass: 'E' });
    expect(parseChord('Dbmaj7/Ab')).toEqual({ root: 'Db', quality: 'maj7', bass: 'Ab' });
  });

  it("traite '/9' comme une qualité (6/9) et non une basse", () => {
    expect(parseChord('C6/9')).toEqual({ root: 'C', quality: '6/9' });
  });

  it('normalise les alias de qualité', () => {
    expect(parseChord('Cmajor')?.quality).toBe('');
    expect(parseChord('CM')?.quality).toBe('');
    expect(parseChord('Cmin')?.quality).toBe('m');
    expect(parseChord('C-')?.quality).toBe('m');
    expect(parseChord('C°')?.quality).toBe('dim');
  });

  it('rejette les symboles sans racine valide', () => {
    expect(parseChord('')).toBeNull();
    expect(parseChord('Imaj7')).toBeNull();
    expect(parseChord('xyz')).toBeNull();
  });
});

describe('formatChord', () => {
  it('recompose le symbole', () => {
    expect(formatChord({ root: 'Db', quality: 'maj7' })).toBe('Dbmaj7');
    expect(formatChord({ root: 'C', quality: '', bass: 'E' })).toBe('C/E');
    expect(formatChord({ root: 'A', quality: 'm' })).toBe('Am');
  });

  it('est inverse de parseChord (aller-retour)', () => {
    for (const sym of ['Dbmaj7', 'C/E', 'Am', 'F#m7b5', 'C6/9', 'G7alt']) {
      expect(formatChord(parseChord(sym)!)).toBe(sym);
    }
  });
});

describe('chordKey', () => {
  it('produit la clé standard', () => {
    expect(chordKey(parseChord('Dbmaj7')!)).toBe('Db|maj7');
    expect(chordKey(parseChord('C/E')!)).toBe('C|/E');
    expect(chordKey(parseChord('Am')!)).toBe('A|m');
  });
});
