/**
 * useCircleState - Hook personnalisé pour la page Circle of Fifths
 *
 * Gère la sélection de tonique et calcule les données de gamme
 */

import { useMemo } from 'react';
import type { NoteName } from '@adagio/types';
import { MAJOR_FROM_MINOR } from '@adagio/theory';

export interface CircleState {
  selectedKey: NoteName | string; // Peut être "Am", "Em", etc.
}

export interface CircleData {
  scaleNotes: string[];
  chords: string[];
  isMinor: boolean;
  majorKey: NoteName;
  tonality: 'major' | 'minor';
  relativeKey: string;
}

// Tableau chromatique avec DIÈSES
const SHARP_CHROMATIC: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
// Tableau chromatique avec BÉMOLS
const FLAT_CHROMATIC: string[] = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Intervalles de la gamme majeure
const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11];

// Tonalités qui utilisent les bémols
const FLAT_KEYS: NoteName[] = ['Db', 'Eb', 'Gb', 'Ab', 'Bb', 'F'] as const;

/**
 * Obtenir la gamme majeure pour une tonique donnée
 */
function getMajorScale(key: NoteName): string[] {
  const useFlats = FLAT_KEYS.includes(key);
  const chromatic = useFlats ? FLAT_CHROMATIC : SHARP_CHROMATIC;
  const keyIndex = chromatic.indexOf(key as string);

  if (keyIndex === -1) {
    return ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  }

  return MAJOR_INTERVALS.map(i => chromatic[(keyIndex + i) % 12]!);
}

/**
 * Obtenir les accords majeurs diatoniques
 */
function getMajorChords(key: NoteName): string[] {
  const scale = getMajorScale(key);

  if (!scale || scale.length < 7) {
    return ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim'];
  }

  return [
    scale[0] || 'C',                          // I
    (scale[1] || 'D') + 'm',                    // ii
    (scale[2] || 'E') + 'm',                    // iii
    scale[3] || 'F',                          // IV
    scale[4] || 'G',                          // V
    (scale[5] || 'A') + 'm',                    // vi
    (scale[6] || 'B') + 'dim',                  // vii°
  ];
}

/**
 * Obtenir les accords mineurs diatoniques
 */
function getMinorChords(root: string): string[] {
  const majorKey = MAJOR_FROM_MINOR[root] || root.replace('m', '');
  const majorScale = getMajorScale(majorKey as NoteName);

  if (!majorScale || majorScale.length < 7) {
    return ['Am', 'Bdim', 'C', 'Dm', 'Em', 'F', 'G'];
  }

  // Gamme mineure naturelle = gamme majeure commençant au 6e degré (5 en index)
  const scale = [...majorScale.slice(5), ...majorScale.slice(0, 5)];

  return [
    (scale[0] || 'A') + 'm',                    // i
    (scale[1] || 'B') + 'dim',                  // ii°
    scale[2] || 'C',                          // III
    (scale[3] || 'D') + 'm',                    // iv
    (scale[4] || 'E') + 'm',                    // v
    scale[5] || 'F',                          // VI
    scale[6] || 'G',                          // VII
  ];
}

export interface UseCircleStateOptions {
  initialKey?: NoteName | string;
}

export function useCircleState(options: UseCircleStateOptions = {}) {
  const { initialKey = 'C' } = options;

  // Calculer toutes les données du cercle
  const circleData = useMemo((): CircleData => {
    const minor = initialKey.endsWith('m');
    const majKey = minor
      ? (MAJOR_FROM_MINOR[initialKey] || initialKey.replace('m', ''))
      : initialKey;

    const scale = getMajorScale(majKey as NoteName);
    const chordList = minor
      ? getMinorChords(initialKey)
      : getMajorChords(majKey as NoteName);
    const relKey = minor ? majKey : (MAJOR_FROM_MINOR[majKey] || '?');

    return {
      scaleNotes: scale,
      chords: chordList,
      isMinor: minor,
      majorKey: majKey as NoteName,
      tonality: minor ? 'minor' : 'major',
      relativeKey: relKey
    };
  }, [initialKey]);

  return {
    data: circleData,
    initialKey,
  };
}
