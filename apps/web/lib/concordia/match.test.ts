import { describe, expect, it } from 'vitest';
import { findDiagrams, normalizeQuality, parseChordName, pitchClass } from './match';

describe('pitchClass', () => {
  it('mappe les racines vers les 12 classes de hauteur', () => {
    expect(pitchClass('C')).toBe(0);
    expect(pitchClass('B')).toBe(11);
    expect(pitchClass('F#')).toBe(6);
  });

  it('unifie les enharmoniques', () => {
    expect(pitchClass('C#')).toBe(pitchClass('Db'));
    expect(pitchClass('A#')).toBe(pitchClass('Bb'));
  });

  it('rejette les racines invalides', () => {
    expect(pitchClass('H')).toBeNull();
    expect(pitchClass('Cbb')).toBeNull();
    expect(pitchClass('')).toBeNull();
  });
});

describe('normalizeQuality', () => {
  it('traduit les libellés français', () => {
    expect(normalizeQuality(' Majeur ')).toBe('');
    expect(normalizeQuality('mineur')).toBe('m');
    expect(normalizeQuality('Augmenté')).toBe('aug');
    expect(normalizeQuality('Diminué Triade')).toBe('dim');
  });

  it("normalise variantes de casse et d'espaces", () => {
    expect(normalizeQuality('maj7 sus4')).toBe('maj7sus4');
    expect(normalizeQuality('Maj7Sus4')).toBe('maj7sus4');
    expect(normalizeQuality('7Sus4')).toBe('7sus4');
    expect(normalizeQuality('69')).toBe('6/9');
    expect(normalizeQuality('min9')).toBe('m9');
  });

  it('traite m(maj7) comme qualité et non comme détail', () => {
    expect(normalizeQuality('m(maj7)')).toBe('mMaj7');
    expect(normalizeQuality('m(Maj7)')).toBe('mMaj7');
  });

  it('retourne null pour une qualité inconnue', () => {
    expect(normalizeQuality('7 sus b9')).toBeNull();
    expect(normalizeQuality('/C#')).toBeNull();
  });
});

describe('parseChordName', () => {
  it('décompose racine + qualité', () => {
    expect(parseChordName('G Majeur (Forme E - Corde 6)')).toEqual({ root: 'G', quality: '' });
    expect(parseChordName('Cm6 (Corde 5)')).toEqual({ root: 'C', quality: 'm6' });
    expect(parseChordName('D#7b5 (Cordes 5 à 2 - Corde 5)')).toEqual({
      root: 'D#',
      quality: '7b5',
    });
    expect(parseChordName('B m7b5 (Demi-diminué Corde 5)')).toEqual({
      root: 'B',
      quality: 'm7b5',
    });
  });

  it('exclut power chords, octaves et septièmes', () => {
    expect(parseChordName('Power Chord - Racine Corde 6 (ex: G5)')).toBeNull();
    expect(parseChordName('Octave (Corde 6)')).toBeNull();
    expect(parseChordName('Septième(Corde 6)')).toBeNull();
  });

  it('exclut les renversements (A/C#)', () => {
    expect(parseChordName('A/C# (Fermé - Basse F#)')).toBeNull();
  });
});

describe('findDiagrams', () => {
  it('trouve les formes majeures de C', () => {
    const diagrams = findDiagrams('C', '');
    expect(diagrams.length).toBeGreaterThan(0);
    expect(diagrams.some((d) => d.name.startsWith('C '))).toBe(true);
  });

  it('matche les enharmoniques (F# ≡ Gb)', () => {
    const sharp = findDiagrams('F#', 'm');
    const flat = findDiagrams('Gb', 'm');
    expect(sharp.length).toBeGreaterThan(0);
    expect(flat.length).toBe(sharp.length);
    expect(flat[0]?.name).toContain('F#');
  });

  it('trouve mineur, m7b5 et 7alt', () => {
    expect(findDiagrams('G', 'm').some((d) => d.name.includes('mineur'))).toBe(true);
    expect(findDiagrams('B', 'm7b5').length).toBeGreaterThan(0);
    expect(findDiagrams('C', '7alt').length).toBe(1);
  });

  it('indexe les qualités normalisées depuis les noms concaténés', () => {
    expect(findDiagrams('C', 'm6').length).toBeGreaterThan(0); // « Cm6 (Corde 5) »
    expect(findDiagrams('C#', '6/9').length).toBeGreaterThan(0); // « C# 69 (Corde 4) »
    expect(findDiagrams('E', 'm11').length).toBeGreaterThan(0); // « Emin11(Corde 1) »
  });

  it('retourne [] pour qualité ou racine inconnue', () => {
    expect(findDiagrams('C', 'zzz')).toEqual([]);
    expect(findDiagrams('H', '')).toEqual([]);
  });
});
