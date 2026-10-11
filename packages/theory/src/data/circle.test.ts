// ============================================================================
// CIRCLE DATA TESTS — filet de non-régression (P1)
// ============================================================================
// Fige les tables enharmoniques. Étape 2 : NOTE_ENHARMONICS (0 consommateur)
// supprimé ; ENHARMONIC_EQUIVALENTS est la source unique des paires,
// ENHARMONIC_CANONICAL reste la table de normalisation (notes + accords).

import { describe, it, expect } from 'vitest';
import {
  CIRCLE_OF_FIFTHS,
  NOTE_POSITIONS,
  ENHARMONIC_EQUIVALENTS,
  ENHARMONIC_CANONICAL,
  MINOR_MAP,
  DIM_MAP,
} from './circle';

describe('CIRCLE_OF_FIFTHS', () => {
  it('fige lordre des 12 tonalités', () => {
    expect(CIRCLE_OF_FIFTHS).toEqual([
      'C',
      'G',
      'D',
      'A',
      'E',
      'B',
      'F#',
      'Db',
      'Ab',
      'Eb',
      'Bb',
      'F',
    ]);
  });
});

describe('ENHARMONIC_EQUIVALENTS', () => {
  it('fige les 14 entrées symétriques', () => {
    expect(Object.keys(ENHARMONIC_EQUIVALENTS).sort()).toEqual(
      ['A#', 'Ab', 'B#', 'Bb', 'C#', 'C', 'D#', 'Db', 'E#', 'Eb', 'F#', 'F', 'G#', 'Gb'].sort()
    );
    // Symétrie : a ∈ enh(b) ⟺ b ∈ enh(a)
    for (const [note, equivs] of Object.entries(ENHARMONIC_EQUIVALENTS)) {
      for (const equiv of equivs) {
        expect(ENHARMONIC_EQUIVALENTS[equiv], `${note} ↔ ${equiv}`).toContain(note);
      }
    }
  });
});

describe('ENHARMONIC_CANONICAL', () => {
  it('fige la normalisation bémol → dièse (19 entrées)', () => {
    expect(Object.keys(ENHARMONIC_CANONICAL).sort()).toEqual(
      [
        'Ab',
        'Abdim',
        'Abm',
        'Bb',
        'Bbdim',
        'Bbm',
        'B#°',
        'B#dim',
        'Db',
        'Dbdim',
        'Dbm',
        'E#°',
        'E#dim',
        'Eb',
        'Ebdim',
        'Ebm',
        'Gb',
        'Gbdim',
        'Gbm',
      ].sort()
    );
    expect(ENHARMONIC_CANONICAL['Db']).toBe('C#');
    expect(ENHARMONIC_CANONICAL['Dbm']).toBe('C#m');
  });
});

describe('tables du cercle', () => {
  it('NOTE_POSITIONS couvre 17 notes (12 + 5 enharmoniques)', () => {
    expect(Object.keys(NOTE_POSITIONS)).toHaveLength(17);
    expect(NOTE_POSITIONS['C']).toBe(0);
    expect(NOTE_POSITIONS['F#']).toBe(6);
    expect(NOTE_POSITIONS['Gb']).toBe(6);
  });

  it('MINOR_MAP / DIM_MAP couvrent les 12 tonalités du cercle', () => {
    expect(Object.keys(MINOR_MAP)).toHaveLength(13); // 12 + Gb
    expect(MINOR_MAP['C']).toBe('Am');
    expect(Object.keys(DIM_MAP)).toHaveLength(12);
    expect(DIM_MAP['C']).toBe('B°');
  });
});
