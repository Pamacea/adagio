/**
 * useCircleState - Hook personnalisé pour la page Circle of Fifths
 *
 * Gère la sélection de tonique et calcule les données de gamme
 */

import { useMemo } from 'react';
import type { NoteName } from '@adagio/types';
import { MAJOR_FROM_MINOR, getMajorScale, getMajorChords } from '@adagio/theory';

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

/**
 * Obtenir les accords mineurs diatoniques
 * La gamme majeure relative provient de @adagio/theory (étape 6 P1).
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
    (scale[0] || 'A') + 'm', // i
    (scale[1] || 'B') + 'dim', // ii°
    scale[2] || 'C', // III
    (scale[3] || 'D') + 'm', // iv
    (scale[4] || 'E') + 'm', // v
    scale[5] || 'F', // VI
    scale[6] || 'G', // VII
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
    const majKey = minor ? MAJOR_FROM_MINOR[initialKey] || initialKey.replace('m', '') : initialKey;

    const scale = getMajorScale(majKey as NoteName);
    const chordList = minor ? getMinorChords(initialKey) : getMajorChords(majKey as NoteName);
    const relKey = minor ? majKey : MAJOR_FROM_MINOR[majKey] || '?';

    return {
      scaleNotes: scale,
      chords: chordList,
      isMinor: minor,
      majorKey: majKey as NoteName,
      tonality: minor ? 'minor' : 'major',
      relativeKey: relKey,
    };
  }, [initialKey]);

  return {
    data: circleData,
    initialKey,
  };
}
