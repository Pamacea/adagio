// ============================================================================
// EMOTION MAPPING - Map modes to emotions/feelings
// ============================================================================

import type { ModeName } from '@adagio/types';

export interface EmotionMapping {
  name: string;
  character: string;
  sensation: string;
  feeling?: string;
}

/**
 * Get emotional characteristics for each mode
 */
export function getEmotionForMode(mode: ModeName): EmotionMapping {
  const emotions: Record<ModeName, EmotionMapping> = {
    ionian: {
      name: 'Ionien',
      character: 'Majeur pur / Joyeux',
      sensation: 'Heureux, Lumineux, Naturel',
      feeling: 'Serein, Résolu',
    },
    dorian: {
      name: 'Dorien',
      character: 'Mineur chaud / Jazzy',
      sensation: 'Chaud, Soulful, Sophistiqué',
      feeling: 'Cool, Jazz',
    },
    phrygian: {
      name: 'Phrygien',
      character: 'Espagnol / Sombre',
      sensation: 'Espagnol, Exotique, Tension',
      feeling: 'Flamenco, Mystérieux',
    },
    lydian: {
      name: 'Lydien',
      character: 'Aérien / Lumineux',
      sensation: 'Rêveur, Féerique, Mystique',
      feeling: 'Dreamy, Ethereal',
    },
    mixolydian: {
      name: 'Mixolydien',
      character: 'Majeur bluesy',
      sensation: 'Bluesy, Rock, Dynamique',
      feeling: 'Énergique, Dominant',
    },
    aeolian: {
      name: 'Éolien',
      character: 'Mineur naturel',
      sensation: 'Mélancolique, Triste, Naturel',
      feeling: 'Sad, Emotional',
    },
    locrian: {
      name: 'Locrien',
      character: 'Tension extrême',
      sensation: 'Dissonant, Instable, Tense',
      feeling: 'Inquiet, Suspens',
    },
  };

  return emotions[mode];
}

/**
 * Get modes that match a feeling
 */
export function getModesByFeeling(feeling: string): ModeName[] {
  const mappings: Record<string, ModeName[]> = {
    'joyeux': ['ionian'],
    'heureux': ['ionian'],
    'serein': ['ionian'],
    'jazzy': ['dorian'],
    'soulful': ['dorian'],
    'sophistique': ['dorian'],
    'espagnol': ['phrygian'],
    'sombre': ['phrygian', 'locrien'],
    'exotique': ['phrygian'],
    'aérien': ['lydien'],
    'lumineux': ['lydien', 'ionian'],
    'rêveur': ['lydien'],
    'dreamy': ['lydien'],
    'bluesy': ['mixolydian'],
    'rock': ['mixolydian', 'dorian'],
    'energique': ['mixolydian'],
    'mélancolique': ['aeolian'],
    'triste': ['aeolian'],
    'dissonant': ['locrien'],
    'tense': ['locrian'],
  };

  const feelingLower = feeling.toLowerCase();
  return mappings[feelingLower] || [];
}
