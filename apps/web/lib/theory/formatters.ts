// ============================================================================
// FORMATTERS - Display utilities for music theory
// ============================================================================

import type { Interval } from '@adagio/types';

// ============================================================================
// INTERVAL FORMATTING
// ============================================================================

/**
 * Convertit les intervalles vers notation musicale avec symboles (♯, ♭, ♮)
 * Remplace les notations anglaises par des symboles musicaux
 *
 * @example
 * formatInterval('b3') // returns '♭3'
 * formatInterval('#4') // returns '♯4'
 * formatInterval('bb7') // returns '♭♭7'
 */
export function formatInterval(interval: Interval): string {
  const symbols: Record<string, string> = {
    '#': '♯',
    'b': '♭',
    'bb': '♭♭',
    '##': '♯♯',
  };
  let result: string = interval;
  for (const [key, symbol] of Object.entries(symbols)) {
    result = result.replace(new RegExp(key, 'g'), symbol);
  }
  return result;
}

// ============================================================================
// SCALE PATTERNS
// ============================================================================

/**
 * Obtenir le pattern T-S (Ton - Seconde/demi-ton) pour une gamme
 * T = Ton (2 demi-tons)
 * S = Seconde (1 demi-ton)
 * TS = 3 demi-tons (rare, ex: gamme par tons)
 *
 * @example
 * getTSPattern(['1', '2', '3', '4', '5', '6', '7']) // 'T-T-S-T-T-T-S'
 */
export function getTSPattern(intervals: Interval[]): string {
  const semitones: Record<Interval, number> = {
    '1': 0,
    '#1': 1, 'b2': 1,
    '2': 2,
    '#2': 3, 'b3': 3,
    '3': 4, 'b4': 4,
    '4': 5,
    '#4': 6, 'b5': 6,
    '5': 7,
    '#5': 8, 'b6': 8, 'bb6': 8,
    '6': 9,
    '#6': 10, 'bb7': 9, 'b7': 10,
    '7': 11,
    '#3': 5, // Rare (E# = F essentially)
    // Extensions (non utilisées dans les gammes mais requises pour le type complet)
    'b9': 13, '9': 14, '#9': 15,
    '11': 17, '#11': 18,
    'b13': 20, '13': 21,
  };

  const pattern: string[] = [];
  let prevSemitone = 0;

  for (const interval of intervals) {
    const currentSemitone = semitones[interval] ?? 0;
    const diff = currentSemitone - prevSemitone;
    pattern.push(diff === 2 ? 'T' : diff === 1 ? 'S' : diff === 3 ? 'TS' : '?');
    prevSemitone = currentSemitone;
  }

  // Retour au départ (octave)
  const octaveDiff = 12 - prevSemitone;
  pattern.push(octaveDiff === 2 ? 'T' : octaveDiff === 1 ? 'S' : octaveDiff === 3 ? 'TS' : '?');

  return pattern.join('-');
}

// ============================================================================
// NOTE DISPLAY
// ============================================================================

/**
 * Affiche une note en notation francaise
 * Utilise le mapping NOTE_FR si disponible, sinon retourne la note originale
 *
 * @example
 * displayNote('C', NOTE_FR) // 'DO'
 * displayNote('F#', NOTE_FR) // 'FA♯'
 */
export function displayNote(
  note: string,
  noteFr: Record<string, string>
): string {
  return noteFr[note] || note;
}
