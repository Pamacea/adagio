// ============================================================================
// TESTS - Instruments (abstraction multi-instruments, guitare + basse)
// ============================================================================

import { describe, it, expect } from 'vitest';
import {
  GUITAR,
  BASS,
  INSTRUMENTS,
  INSTRUMENT_IDS,
  getInstrument,
  getInstrumentTuning,
  getStringCount,
} from './instruments';
import { calculateFretboard, getFretboardNotesForKey } from './calculators/FretboardCalculator';
import { getChordVoicings } from './calculators/ChordCalculator';

describe('instruments', () => {
  it('expose guitare et basse', () => {
    expect(INSTRUMENT_IDS).toEqual(['guitar', 'bass']);
    expect(Object.keys(INSTRUMENTS)).toHaveLength(2);
    expect(getInstrument('guitar')).toBe(GUITAR);
    expect(getInstrument('bass')).toBe(BASS);
  });

  it('guitare : 6 cordes EADGBE, 24 frettes', () => {
    expect(GUITAR.stringCount).toBe(6);
    expect(GUITAR.tuning).toEqual(['E', 'A', 'D', 'G', 'B', 'E']);
    expect(GUITAR.tuningDisplay).toEqual(['E', 'B', 'G', 'D', 'A', 'E']);
    expect(GUITAR.defaultFretCount).toBe(24);
  });

  it('basse : 4 cordes EADG, 24 frettes', () => {
    expect(BASS.stringCount).toBe(4);
    expect(BASS.tuning).toEqual(['E', 'A', 'D', 'G']);
    expect(BASS.tuningDisplay).toEqual(['G', 'D', 'A', 'E']);
    expect(BASS.defaultFretCount).toBe(24);
  });

  it('tuning et tuningDisplay sont symétriques', () => {
    for (const id of INSTRUMENT_IDS) {
      const def = INSTRUMENTS[id];
      expect([...def.tuning]).toEqual([...def.tuningDisplay].reverse());
      expect(def.tuning).toHaveLength(def.stringCount);
      expect(getStringCount(id)).toBe(def.stringCount);
      expect(getInstrumentTuning(id)).toBe(def.tuning);
    }
  });
});

describe('FretboardCalculator - paramétrage instrument', () => {
  it('guitare par défaut : 6 cordes × (fretCount + 1) notes', () => {
    const notes = calculateFretboard({ fretCount: 12 });
    expect(notes).toHaveLength(6 * 13);
    expect(new Set(notes.map((n) => n.string)).size).toBe(6);
  });

  it('basse : 4 cordes avec l’accordage EADG', () => {
    const bass = INSTRUMENTS.bass;
    const notes = calculateFretboard({
      key: 'C',
      fretCount: 12,
      tuning: [...bass.tuningDisplay],
    });
    expect(notes).toHaveLength(4 * 13);
    expect(new Set(notes.map((n) => n.string)).size).toBe(4);

    // Cordes ouvertes (fret 0) : G, D, A, E (aigu → grave)
    const open = notes.filter((n) => n.fret === 0).map((n) => n.name);
    expect(open).toEqual(['G', 'D', 'A', 'E']);
  });

  it('getFretboardNotesForKey accepte un tuning optionnel (rétro-compatible)', () => {
    const guitar = getFretboardNotesForKey('C', ['1', '2', '3', '4', '5', '6', '7'], 12);
    const guitarExplicit = getFretboardNotesForKey('C', ['1', '2', '3', '4', '5', '6', '7'], 12, [
      ...GUITAR.tuningDisplay,
    ]);
    expect(guitar).toEqual(guitarExplicit);

    const bass = getFretboardNotesForKey('C', ['1', '2', '3', '4', '5', '6', '7'], 12, [
      ...BASS.tuningDisplay,
    ]);
    expect(bass).toHaveLength(4 * 13);
    // Tonic C présente sur le manche de basse
    expect(bass.some((n) => n.name === 'C' && n.interval === '1')).toBe(true);
  });
});

describe('getChordVoicings - paramétrage instrument', () => {
  it('guitare par défaut : cordes 0-5 (0 = plus aigu)', () => {
    const voicings = getChordVoicings('C', '');
    expect(voicings.length).toBeGreaterThan(0);
    for (const v of voicings) {
      for (const n of v.notes) {
        expect(n.string).toBeGreaterThanOrEqual(0);
        expect(n.string).toBeLessThanOrEqual(5);
      }
    }
  });

  it('basse : voicings sur 4 cordes (string 0-3)', () => {
    const voicings = getChordVoicings('C', '', 12, [...BASS.tuning]);
    expect(voicings.length).toBeGreaterThan(0);
    // La racine C est présente dans chaque voicing
    for (const v of voicings) {
      const unique = new Set(v.notes.map((n) => n.note));
      expect(unique.has('C')).toBe(true);
      for (const n of v.notes) {
        expect(n.string).toBeGreaterThanOrEqual(0);
        expect(n.string).toBeLessThanOrEqual(3);
      }
    }
    // Certains voicings couvrent l'accord complet C-E-G
    expect(
      voicings.some((v) => {
        const u = new Set(v.notes.map((n) => n.note));
        return u.has('C') && u.has('E') && u.has('G');
      })
    ).toBe(true);
  });
});
