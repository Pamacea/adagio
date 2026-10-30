import { describe, expect, it } from 'vitest';
import { getChordNotes } from './compose';

describe('getChordNotes', () => {
  it('couvre les qualités absentes de l’ancienne table locale', () => {
    expect(getChordNotes('Em7b5').notes).toEqual(['E', 'G', 'Bb', 'D']);
    expect(getChordNotes('Dm9').notes).toEqual(['D', 'F', 'A', 'C', 'E']);
    expect(getChordNotes('Cmaj7#11').notes).toEqual(['C', 'E', 'G', 'B', 'F#']);
  });

  it('épelle les altérations en bémols quand l’intervalle le demande', () => {
    expect(getChordNotes('Gm').notes).toEqual(['G', 'Bb', 'D']);
    expect(getChordNotes('C7').notes).toEqual(['C', 'E', 'G', 'Bb']);
  });
});
