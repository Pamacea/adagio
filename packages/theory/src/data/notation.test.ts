// ============================================================================
// NOTATION DATA TESTS — filet de non-régression (P1)
// ============================================================================
// Fige la table FR canonique et les progressions vivantes (consommateur :
// apps/web ProgressionsSection) avant purification.

import { describe, it, expect } from 'vitest';
import {
  FRENCH_NOTE_NAMES,
  CHORD_PROGRESSIONS,
  ROMAN_DEGREES_MAJOR,
  ROMAN_DEGREES_MINOR,
} from './notation';

describe('FRENCH_NOTE_NAMES', () => {
  it('couvre les 17 entrées dièses + bémols actuelles', () => {
    expect(Object.keys(FRENCH_NOTE_NAMES).sort()).toEqual(
      [
        'A',
        'A#',
        'Ab',
        'B',
        'Bb',
        'C',
        'C#',
        'D',
        'D#',
        'Db',
        'E',
        'Eb',
        'F',
        'F#',
        'G',
        'G#',
        'Gb',
      ].sort()
    );
  });

  it('les valeurs sont en unicode ♯/♭ (jamais ASCII #/b)', () => {
    for (const [en, fr] of Object.entries(FRENCH_NOTE_NAMES)) {
      if (en.includes('#')) expect(fr, en).toContain('♯');
      if (en.includes('b') && en !== 'B') expect(fr, en).toContain('♭');
      expect(fr, en).not.toMatch(/[#b]/);
    }
  });

  it("quelques valeurs d'exemple", () => {
    expect(FRENCH_NOTE_NAMES['C']).toBe('DO');
    expect(FRENCH_NOTE_NAMES['C#']).toBe('DO♯');
    expect(FRENCH_NOTE_NAMES['Db']).toBe('RÉ♭');
    expect(FRENCH_NOTE_NAMES['Bb']).toBe('SI♭');
  });
});

describe('CHORD_PROGRESSIONS', () => {
  it('fige les 6 progressions vivantes', () => {
    expect(CHORD_PROGRESSIONS.map((p) => p.name)).toEqual([
      'I - IV - V',
      'I - V - vi - IV',
      'vi - IV - I - V',
      'i - VI - VII',
      'i - bII - bIII - bV',
      'ii - V - I',
    ]);
  });

  it('chaque progression a chords et degrees alignés', () => {
    for (const p of CHORD_PROGRESSIONS) {
      expect(p.chords.length, p.name).toBeGreaterThan(0);
      expect(p.degrees.length, p.name).toBe(p.chords.length);
      expect(p.description, p.name).toBeTruthy();
    }
  });
});

describe('degrés romains', () => {
  it('figure les tableaux majeur/mineur', () => {
    expect([...ROMAN_DEGREES_MAJOR]).toEqual(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']);
    expect([...ROMAN_DEGREES_MINOR]).toEqual(['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii°']);
  });
});
