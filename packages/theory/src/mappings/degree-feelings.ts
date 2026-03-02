// ============================================================================
// DEGREE FEELINGS - Emotional associations for scale degrees
// ============================================================================

import type { ProgressionDegree } from '@adagio/types';

export interface DegreeFeeling {
  degree: string;
  tonality: 'major' | 'minor';
  sensation: string;
  advice: string;
}

/**
 * Get feeling for a harmonic degree
 */
export function getDegreeFeeling(degree: ProgressionDegree, tonality: 'major' | 'minor'): DegreeFeeling {
  const key = `${degree}-${tonality}`;

  const feelings: Record<string, DegreeFeeling> = {
    'I-major': {
      degree: 'I',
      tonality: 'major',
      sensation: 'Être content à la maison',
      advice: 'Résolution parfaite. Stable et reposant.',
    },
    'ii-major': {
      degree: 'ii',
      tonality: 'major',
      sensation: 'Départ contraint',
      advice: 'Prépare le V. Utilisez le Dorien pour improviser.',
    },
    'iii-major': {
      degree: 'iii',
      tonality: 'major',
      sensation: 'Nostalgie douce',
      advice: 'Peut remplacer le I. Moins stable que le vi.',
    },
    'IV-major': {
      degree: 'IV',
      tonality: 'major',
      sensation: 'Aventure : Vous quittez la maison',
      advice: 'Sens de départ. Utilisez le Lydien pour une couleur dreamy.',
    },
    'V-major': {
      degree: 'V',
      tonality: 'major',
      sensation: 'Tension : Le retour est incertain',
      advice: 'Crée une tension qui demande résolution sur le I.',
    },
    'vi-major': {
      degree: 'vi',
      tonality: 'major',
      sensation: 'Tristesse résignée',
      advice: 'La relative mineure du I. Mélancolique mais beau.',
    },
    'vii°-major': {
      degree: 'vii°',
      tonality: 'major',
      sensation: 'Suspens dramatique',
      advice: 'Tension maximale. Résolution sur le I ou vi.',
    },
    'i-minor': {
      degree: 'i',
      tonality: 'minor',
      sensation: 'Tristesse résignée',
      advice: 'La base du mineur. Stable mais mélancolique.',
    },
    'ii°-minor': {
      degree: 'ii°',
      tonality: 'minor',
      sensation: 'Tension sombre',
      advice: 'Prépare le i. Souvent remplacé par le IV.',
    },
    'III-minor': {
      degree: 'III',
      tonality: 'minor',
      sensation: 'Lueur d\'espoir',
      advice: 'La relative majeure du i. Moment de lumière.',
    },
    'iv-minor': {
      degree: 'iv',
      tonality: 'minor',
      sensation: 'Lueur d\'espoir',
      advice: 'Soulagement dans la mineur.',
    },
    'v-minor': {
      degree: 'v',
      tonality: 'minor',
      sensation: 'Tension sombre',
      advice: 'Souvent remplacé par le V7 (majeur) pour plus de tension.',
    },
    'VI-minor': {
      degree: 'VI',
      tonality: 'minor',
      sensation: 'Retour à la réalité',
      advice: 'Prépare le retour au i. Plus stable que le ii°.',
    },
    'VII-minor': {
      degree: 'VII',
      tonality: 'minor',
      sensation: 'Fuite vers l\'inconnu',
      advice: 'Sens de fuite, d\'évasion. Peut mener au i ou au III.',
    },
  };

  return feelings[key] || {
    degree,
    tonality,
    sensation: 'Inconnu',
    advice: '',
  };
}

/**
 * Get suggested modes for a chord degree
 */
export function getSuggestedModesForDegree(degree: ProgressionDegree, tonality: 'major' | 'minor'): string[] {
  const suggestions: Record<string, string[]> = {
    'I-major': ['Ionien', 'Lydien'],
    'ii-major': ['Dorien'],
    'iii-major': ['Phrygien'],
    'IV-major': ['Lydien', 'Ionien'],
    'V-major': ['Mixolydien', 'Phrygien Dominant'],
    'vi-major': ['Éolien'],
    'vii°-major': ['Locrien'],
    'i-minor': ['Éolien'],
    'ii°-minor': ['Locrien'],
    'III-minor': ['Ionien'],
    'iv-minor': ['Dorien'],
    'v-minor': ['Phrygien Dominant', 'Aeolian'],
    'VI-minor': ['Lydien'],
    'VII-minor': ['Ionien'],
  };

  return suggestions[`${degree}-${tonality}`] || ['Ionien'];
}
