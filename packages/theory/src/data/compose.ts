// ============================================================================
// COMPOSE DATA - Advanced composition data from compose page
// ============================================================================
/**
 * ADAGIO - Compose Data
 * Données avancées pour la page de composition
 *
 * Contient:
 * - CAGED_VOICINGS: Système complet de voicings CAGED
 * - CHORD_PROGRESSIONS_ADVANCED: Progressions avec émotions et genres
 * - CHORD_SUBSTITUTIONS: Mapping des substitutions harmoniques
 * - CHORD_VARIATIONS: Variations d'accords par degré
 */

import type { NoteName } from '@adagio/types';

// ============================================================================
// TYPES
// ============================================================================

export type KeyMode = 'major' | 'minor';

export interface ChordVariation {
  id: string;
  name: string;
  symbol: string;
  category: 'basic' | 'extension' | 'substitution' | 'modal' | 'advanced';
  description: string;
  emotion?: string;
}

export interface ChordSubstitution {
  name: string;
  chord: string;
  description: string;
  type: 'substitution' | 'extension' | 'voicing' | 'modal';
}

export interface ChordProgressionAdvanced {
  name: string;
  degrees: string[];
  description: string;
  emotion: string;
  genre: string[];
}

export interface ChordVoicing {
  name: string;
  frets: (number | null)[];
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// ============================================================================
// ROMAN NUMERALS
// ============================================================================

/**
 * Numerals romains pour les degrés
 */
export const ROMAN_NUMERALS_MAJOR = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'] as const;
export const ROMAN_NUMERALS_MINOR = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'] as const;

// ============================================================================
// DEGREE EMOTIONS
// ============================================================================

/**
 * Émotions des degrés diatoniques
 */
export const DEGREE_EMOTIONS: string[] = [
  'Stable, résolution, repos',
  'Doux, mélancolique, mouvement',
  'Nostalgique, tendre',
  'Aventureux, lumineux',
  'Tension, besoin de résolution',
  'Triste, émotionnel',
  'Tension dramatique, instable',
] as const;

// ============================================================================
// CAGED VOICINGS SYSTEM
// ============================================================================

/**
 * Système CAGED complet pour les accords majeurs
 * Positions ouvertes et décalées pour chaque forme
 */
export const CAGED_SHAPES: Record<string, ChordVoicing[]> = {
  // C form (x32010)
  'C': [
    { name: 'Position ouverte (C Form)', frets: [0, 3, 2, 0, 1, 0], description: 'Position de base', difficulty: 'beginner' },
    { name: 'C Form - 3ème frette', frets: [3, null, 5, 5, 5, 3], description: 'Décalé', difficulty: 'intermediate' },
    { name: 'C Form - 5ème frette', frets: [null, null, null, 5, 5, null], description: 'Fondamentale 4 notes', difficulty: 'intermediate' },
    { name: 'C Form - 8ème frette', frets: [null, null, null, null, null, 8], description: '3 notes jouées au bout', difficulty: 'beginner' },
    { name: 'C Form - 10ème frette', frets: [null, null, null, null, null, null], description: '3 notes jouées au bout', difficulty: 'beginner' },
  ],
  // A form (x02220) - F shape décalé
  'A': [
    { name: 'Position A (F Form - 5e frette)', frets: [null, 0, 2, 2, 2, null], description: 'F forme décalée', difficulty: 'beginner' },
    { name: 'A Form - 2ème frette', frets: [null, null, null, 2, 2, 0], description: 'Basse jouée', difficulty: 'intermediate' },
    { name: 'A Form - 5ème frette', frets: [null, null, null, null, null, null], description: '3 notes jouées au bout', difficulty: 'beginner' },
    { name: 'A Form - 7ème frette', frets: [null, null, null, 7, 7, 5], description: 'F forme décalée', difficulty: 'intermediate' },
  ],
  // G form (320003)
  'G': [
    { name: 'Position ouverte (G Form)', frets: [3, 2, 0, 0, 0, 3], description: 'Position de bas', difficulty: 'beginner' },
    { name: 'G Form - 5ème frette', frets: [null, null, null, null, null, 3], description: 'Seulement la tonique', difficulty: 'beginner' },
    { name: 'G Form - 7ème frette', frets: [null, null, null, null, null, 7], description: 'Seulement la tonique', difficulty: 'beginner' },
    { name: 'G Form - 10ème frette', frets: [null, null, null, null, null, 10], description: 'Seulement la tonique', difficulty: 'beginner' },
  ],
  // E form (022100)
  'E': [
    { name: 'Position ouverte (E Form)', frets: [0, 2, 2, 1, 0, 0], description: 'Position de base', difficulty: 'beginner' },
    { name: 'E Form - 2ème frette', frets: [null, null, null, 2, 2, 2], description: 'Power chord', difficulty: 'beginner' },
    { name: 'E Form - 4ème frette', frets: [null, null, null, null, null, null], description: '3 notes jouées au bout', difficulty: 'beginner' },
    { name: 'E Form - 7ème frette', frets: [null, null, null, 7, 7, 7], description: '7ème frette', difficulty: 'intermediate' },
    { name: 'E Form - 9ème frette', frets: [null, null, null, null, null, 9], description: '9ème frette', difficulty: 'intermediate' },
  ],
  // D form (xx0232)
  'D': [
    { name: 'Position D (xx0232)', frets: [null, null, 0, 2, 3, 2], description: 'Position de base', difficulty: 'beginner' },
    { name: 'D Form - 2ème frette', frets: [null, null, null, 2, 3, 2], description: 'En bas du manche', difficulty: 'beginner' },
    { name: 'D Form - 5ème frette', frets: [null, null, null, 5, null, 5], description: '5ème frette', difficulty: 'intermediate' },
    { name: 'D Form - 7ème frette', frets: [null, null, null, 7, 7, 7], description: '7ème frette', difficulty: 'intermediate' },
    { name: 'D Form - 9ème frette', frets: [null, null, null, null, null, null], description: '3 notes jouées au bout', difficulty: 'beginner' },
    { name: 'D Form - 10ème frette', frets: [null, null, null, null, null, 10], description: '10ème frette', difficulty: 'intermediate' },
    { name: 'D Form - 12ème frette', frets: [null, null, null, 12, 12, 12], description: '12ème frette', difficulty: 'intermediate' },
  ],
  // F form (133211)
  'F': [
    { name: 'Position F (133211)', frets: [1, 3, 3, 2, 1, 1], description: 'Barré', difficulty: 'intermediate' },
    { name: 'F Form - 3ème frette', frets: [null, null, null, null, null, null], description: '3 notes jouées au bout', difficulty: 'beginner' },
    { name: 'F Form - 5ème frette', frets: [null, null, null, 5, null, 5], description: '5ème frette', difficulty: 'beginner' },
    { name: 'F Form - 8ème frette', frets: [null, null, null, null, null, null], description: '8ème frette', difficulty: 'beginner' },
    { name: 'F Form - 10ème frette', frets: [null, null, null, 10, 10, 10], description: '10ème frette', difficulty: 'intermediate' },
  ],
};

/**
 * Patterns d'accords mineurs (CAGED mineur)
 */
export const MINOR_PATTERNS: Record<string, ChordVoicing[]> = {
  // Am patterns
  'Am': [
    { name: 'Position ouverte (Am)', frets: [0, 2, 2, 0, 1, 0], description: 'Position de base', difficulty: 'beginner' },
    { name: 'Am Form - 2ème frette', frets: [null, null, null, 2, 2, 1], description: 'Em formé', difficulty: 'beginner' },
    { name: 'Am Form - 5ème frette', frets: [null, null, null, null, null, null], description: '3 notes jouées au bout', difficulty: 'beginner' },
    { name: 'Am Form - 7ème frette', frets: [null, null, null, 7, 7, 5], description: '7ème frette', difficulty: 'intermediate' },
  ],
  // Dm patterns
  'Dm': [
    { name: 'Position Dm (xx0231)', frets: [null, null, 0, 2, 3, 1], description: 'Position de base', difficulty: 'beginner' },
    { name: 'Dm Form - 2ème frette', frets: [null, null, null, 2, 3, 1], description: 'En bas du manche', difficulty: 'beginner' },
    { name: 'Dm Form - 5ème frette', frets: [null, null, null, 5, null, null], description: '5ème frette', difficulty: 'beginner' },
    { name: 'Dm Form - 7ème frette', frets: [null, null, null, 7, 7, 7], description: '7ème frette', difficulty: 'intermediate' },
  ],
  // Em patterns
  'Em': [
    { name: 'Position Em (022000)', frets: [0, 2, 2, 0, 0, 0], description: 'Position de base', difficulty: 'beginner' },
    { name: 'Em Form - 2ème frette', frets: [null, null, null, 2, 2, 2], description: '2ème frette', difficulty: 'beginner' },
    { name: 'Em Form - 5ème frette', frets: [null, null, null, null, null, null], description: '3 notes jouées au bout', difficulty: 'beginner' },
    { name: 'Em Form - 7ème frette', frets: [null, null, null, 7, 7, 7], description: '7ème frette', difficulty: 'intermediate' },
  ],
  // Bm patterns (barre required)
  'Bm': [
    { name: 'Bm - Barré 2e frette', frets: [null, null, null, 4, 3, 2], description: 'Barré à 2, x24422', difficulty: 'advanced' },
    { name: 'Bm - Barré 7e frette', frets: [null, null, null, null, 7, 7], description: 'Barré à 7', difficulty: 'advanced' },
    { name: 'Bm - Simplifié', frets: [null, null, null, null, null, 2], description: '2 notes seulement', difficulty: 'beginner' },
  ],
  // F#m patterns
  'F#m': [
    { name: 'F#m - Barré 2e frette', frets: [null, null, null, 4, 3, 2], description: 'Barré à 2', difficulty: 'advanced' },
    { name: 'F#m - Barré 4e frette', frets: [null, null, null, null, null, null], description: '2 notes seulement', difficulty: 'beginner' },
  ],
  // C#m patterns
  'C#m': [
    { name: 'C#m - Barré 4e frette', frets: [null, null, null, null, null, 4], description: 'Barré à 4', difficulty: 'advanced' },
    { name: 'C#m - Simplifié', frets: [null, null, null, null, null, null], description: '2 notes seulement', difficulty: 'beginner' },
  ],
  // Gm patterns
  'Gm': [
    { name: 'Gm - Barré 3e frette', frets: [null, null, null, 0, 5, 3], description: 'Barré à 3', difficulty: 'intermediate' },
    { name: 'Gm - Barré 5e frette', frets: [null, null, null, null, null, null], description: '2 notes seulement', difficulty: 'beginner' },
    { name: 'Gm - Forme 355333', frets: [3, 5, 5, 0, 0, 3], description: 'Forme 355333', difficulty: 'advanced' },
  ],
};

/**
 * Voicings diminués (génériques)
 */
export const DIMINISHED_VOICINGS: ChordVoicing[] = [
  { name: 'Diminué simplifié', frets: [null, null, null, null, null, null], description: '2 notes seulement', difficulty: 'beginner' },
  { name: 'Position 1-3-4', frets: [null, null, null, 3, null, 1], description: 'Tritone diminished', difficulty: 'intermediate' },
  { name: 'Position 3-5-6', frets: [null, null, null, 5, null, 4], description: 'Haut du manche', difficulty: 'intermediate' },
  { name: 'Position 6-8-9', frets: [null, null, null, 8, null, 7], description: 'Encore plus haut', difficulty: 'advanced' },
];

/**
 * Obtenir les voicings pour un accord (CAGED system)
 */
export function getCagedVoicings(chord: string): ChordVoicing[] {
  const root = chord.replace(/m|dim|°|7|maj|add|9|11|13/g, '');
  const isMinor = chord.endsWith('m') && !chord.includes('aj');
  const isDim = chord.includes('dim') || chord.endsWith('°');

  // Diminished chords
  if (isDim) {
    return DIMINISHED_VOICINGS;
  }

  // Minor patterns
  if (isMinor && MINOR_PATTERNS[root + 'm']) {
    return MINOR_PATTERNS[root + 'm']!;
  }

  // Major CAGED shapes
  if (CAGED_SHAPES[root]) {
    return CAGED_SHAPES[root];
  }

  // Fallback
  return [
    { name: 'Position de base', frets: [null, null, null, null, null, null], description: 'À adapter', difficulty: 'beginner' }
  ];
}

// ============================================================================
// CHORD VARIATIONS BY DEGREE
// ============================================================================

/**
 * Variations d'accords pour chaque degré de la gamme majeure
 * Retourne les variations disponibles pour un degré donné
 */
export function getVariationsForDegree(degree: number, rootNote: string, isMinorMode: boolean): ChordVariation[] {
  const variations: ChordVariation[] = [];

  // I - Tonique (stabilité)
  if (degree === 0) {
    variations.push(
      { id: 'basic', name: 'Tonique', symbol: rootNote, category: 'basic', description: 'Stabilité maximale', emotion: 'Repos' },
      { id: 'maj7', name: 'Maj7', symbol: rootNote + 'maj7', category: 'extension', description: 'Jazz élégant', emotion: 'Serein' },
      { id: 'maj9', name: 'Maj9', symbol: rootNote + 'maj9', category: 'extension', description: 'Richesse harmonique', emotion: 'Rêveur' },
      { id: 'maj13', name: 'Maj13', symbol: rootNote + 'maj13', category: 'extension', description: 'Tonalité complète', emotion: 'Luxe' },
      { id: 'add9', name: 'Add9', symbol: rootNote + 'add9', category: 'extension', description: 'Folk, pop', emotion: 'Ouvert' },
      { id: '6', name: 'Sixte', symbol: rootNote + '6', category: 'extension', description: 'Sonnalité nostalgique', emotion: 'Doux' },
      { id: '69', name: '6/9', symbol: rootNote + '6/9', category: 'advanced', description: 'Jazz moderne', emotion: 'Complexe' },
      { id: 'lydian', name: 'Lydien (#11)', symbol: rootNote + 'maj7#11', category: 'modal', description: 'Mystique, spatial', emotion: 'Éthéré' }
    );
    if (!isMinorMode) {
      variations.push(
        { id: 'relative-minor', name: 'Relative Mineur', symbol: rootNote.replace('#', '').replace('b', '') + 'm', category: 'substitution', description: 'Même notes, émotion triste', emotion: 'Mélancolie' }
      );
    }
  }

  // ii - Pré-dominant (tension préparatoire)
  if (degree === 1) {
    variations.push(
      { id: 'basic', name: 'Mineur', symbol: rootNote + 'm', category: 'basic', description: 'Douceur préparatoire', emotion: 'Mouvement' },
      { id: 'm7', name: 'Min7', symbol: rootNote + 'm7', category: 'extension', description: 'Jazz ii-V-I', emotion: 'Sophistiqué' },
      { id: 'm9', name: 'Min9', symbol: rootNote + 'm9', category: 'extension', description: 'Richesse colorée', emotion: 'Nostalgie' },
      { id: 'm11', name: 'Min11', symbol: rootNote + 'm11', category: 'extension', description: 'Ambiance mystique', emotion: 'Flore' },
      { id: 'm6', name: 'Min6', symbol: rootNote + 'm6', category: 'extension', description: 'Bossa, jazz', emotion: 'Douce' }
    );
    if (!isMinorMode) {
      variations.push(
        { id: 'IV-sub', name: 'Sub IV', symbol: rootNote.replace(/[0-9]/g, '').replace('#', '').replace('b', '') + 'maj7', category: 'substitution', description: 'Sous-dominante anticipée', emotion: 'Espérance' }
      );
    }
  }

  // iii - Médiant (nostalgie ou couleur mineure)
  if (degree === 2) {
    if (isMinorMode) {
      // III en mineur = majeur relatif
      variations.push(
        { id: 'basic', name: 'Majeur', symbol: rootNote, category: 'basic', description: 'Tierce de la tonique', emotion: 'Lumineux' },
        { id: 'maj7', name: 'Maj7', symbol: rootNote + 'maj7', category: 'extension', description: 'Élégant', emotion: 'Clair' },
        { id: 'add9', name: 'Add9', symbol: rootNote + 'add9', category: 'extension', description: 'Pop, folk', emotion: 'Ouvert' }
      );
    } else {
      variations.push(
        { id: 'basic', name: 'Mineur', symbol: rootNote + 'm', category: 'basic', description: 'Tendre', emotion: 'Nostalgie' },
        { id: 'm7', name: 'Min7', symbol: rootNote + 'm7', category: 'extension', description: 'Jazz soft', emotion: 'Doux' },
        { id: 'm7b5', name: 'Min7b5', symbol: rootNote + 'm7b5', category: 'advanced', description: 'Tension sombre', emotion: 'Mystère' }
      );
    }
  }

  // IV - Sous-dominant (aventure)
  if (degree === 3) {
    variations.push(
      { id: 'basic', name: 'Majeur', symbol: rootNote, category: 'basic', description: 'Aventure', emotion: 'Lumineux' },
      { id: 'maj7', name: 'Maj7', symbol: rootNote + 'maj7', category: 'extension', description: 'Stable', emotion: 'Calme' },
      { id: 'maj9', name: 'Maj9', symbol: rootNote + 'maj9', category: 'extension', description: 'Folk, pop', emotion: 'Serein' },
      { id: 'add9', name: 'Add9', symbol: rootNote + 'add9', category: 'extension', description: 'Ouvert', emotion: 'Espoir' },
      { id: 'lydian', name: 'Lydien', symbol: rootNote + 'maj7#11', category: 'modal', description: 'Spatial, dreamy', emotion: 'Éthéré' },
      { id: 'IVm', name: 'IV Mineur', symbol: rootNote + 'm', category: 'modal', description: 'Modal interchange', emotion: 'Mélancolique' }
    );
  }

  // V - Dominante (tension maximale)
  if (degree === 4) {
    variations.push(
      { id: 'basic', name: 'Majeur', symbol: rootNote, category: 'basic', description: 'Tension vers I', emotion: 'Dynamique' },
      { id: '7', name: '7', symbol: rootNote + '7', category: 'basic', description: 'Dominante classique', emotion: 'Besoin de résolution' },
      { id: '9', name: '9', symbol: rootNote + '9', category: 'extension', description: 'Blues, rock', emotion: 'Groove' },
      { id: '11', name: '11', symbol: rootNote + '11', category: 'extension', description: 'Jazz fusion', emotion: 'Moderne' },
      { id: '13', name: '13', symbol: rootNote + '13', category: 'extension', description: 'Funk', emotion: 'Dansant' },
      { id: '7alt', name: '7alt', symbol: rootNote + '7alt', category: 'advanced', description: 'Tension jazz maximale', emotion: 'Dissonance' },
      { id: '7#11', name: '7#11', symbol: rootNote + '7#11', category: 'modal', description: 'Lydien dominant', emotion: 'Mystique' },
      { id: '7b13', name: '7b13', symbol: rootNote + '7b13', category: 'modal', description: 'Mixolydien blues', emotion: 'Soul' },
      { id: '7#9', name: '7#9', symbol: rootNote + '7#9', category: 'advanced', description: 'Hendrix style', emotion: 'Rock' },
      { id: '7b9', name: '7b9', symbol: rootNote + '7b9', category: 'advanced', description: 'Jazz sombre', emotion: 'Tension' }
    );
  }

  // vi - Sus-tonique (tristesse ou couleur mineure stable)
  if (degree === 5) {
    if (isMinorMode) {
      // VI en mineur = majeur relatif
      variations.push(
        { id: 'basic', name: 'Majeur', symbol: rootNote, category: 'basic', description: 'Relative majeur', emotion: 'Espoir' },
        { id: 'maj7', name: 'Maj7', symbol: rootNote + 'maj7', category: 'extension', description: 'Lumineux', emotion: 'Serein' },
        { id: 'add9', name: 'Add9', symbol: rootNote + 'add9', category: 'extension', description: 'Pop', emotion: 'Joyeux' }
      );
    } else {
      variations.push(
        { id: 'basic', name: 'Mineur', symbol: rootNote + 'm', category: 'basic', description: 'Émotionnel', emotion: 'Tristesse' },
        { id: 'm7', name: 'Min7', symbol: rootNote + 'm7', category: 'extension', description: 'Soul, R&B', emotion: 'Doux' },
        { id: 'm9', name: 'Min9', symbol: rootNote + 'm9', category: 'extension', description: 'Jazz', emotion: 'Élégant' },
        { id: 'm11', name: 'Min11', symbol: rootNote + 'm11', category: 'extension', description: 'Ambiance', emotion: 'Rêve' },
        { id: 'm6', name: 'Min6', symbol: rootNote + 'm6', category: 'extension', description: 'Doo-wop', emotion: 'Nostalgique' }
      );
    }
  }

  // vii° - Note sensible (tension dramatique)
  if (degree === 6) {
    variations.push(
      { id: 'basic', name: 'Diminué', symbol: rootNote + 'dim', category: 'basic', description: 'Tension dramatique', emotion: 'Instable' },
      { id: 'dim7', name: 'Dim7', symbol: rootNote + 'dim7', category: 'extension', description: 'Complètement diminué', emotion: 'Dissonance' },
      { id: 'm7b5', name: 'Min7b5', symbol: rootNote + 'm7b5', category: 'substitution', description: 'Half-diminué', emotion: 'Mystère' }
    );
    if (!isMinorMode) {
      variations.push(
        { id: 'V7-sub', name: 'V7 (Dominante)', symbol: rootNote.replace(/[0-9]/g, '').replace('#', '').replace('b', '') + '7', category: 'substitution', description: 'Fonction dominante', emotion: 'Tension' }
      );
    }
  }

  return variations;
}

// ============================================================================
// CHORD SUBSTITUTIONS
// ============================================================================

/**
 * Mapping des substitutions d'accords par type
 * Contient les substitutions harmoniques les plus courantes
 */
export const CHORD_SUBSTITUTIONS: Record<string, ChordSubstitution[]> = {
  // Substitutions de dominante
  'dominant': [
    { name: 'Substitution triton', chord: 'II♭7', description: 'II♭7, même notes que V7', type: 'substitution' },
    { name: 'V7alt', chord: 'V7alt', description: 'Tension jazz maximale', type: 'extension' },
    { name: 'V7#11', chord: 'V7#11', description: 'Lydien dominant', type: 'modal' },
    { name: 'V7#9', chord: 'V7#9', description: 'Hendrix chord', type: 'extension' },
    { name: 'V7b9', chord: 'V7b9', description: 'Jazz sombre', type: 'extension' },
    { name: 'V7b13', chord: 'V7b13', description: 'Mixolydien blues', type: 'modal' },
  ],

  // Substitutions de tonique
  'tonic': [
    { name: 'Relative mineure', chord: 'vim', description: 'Mêmes notes que I, ambiance triste', type: 'substitution' },
    { name: 'I maj7', chord: 'Imaj7', description: 'Son jazz élégant', type: 'extension' },
    { name: 'I6', chord: 'I6', description: 'Sonnalité ouverte', type: 'extension' },
    { name: 'I add9', chord: 'Iadd9', description: 'Richesse supplémentaire', type: 'extension' },
    { name: 'I maj7#11', chord: 'Imaj7#11', description: 'Son lydien moderne', type: 'modal' },
  ],

  // Substitutions de sous-dominante
  'subdominant': [
    { name: 'IV maj7', chord: 'IVmaj7', description: 'Lumineux et stable', type: 'extension' },
    { name: 'IV add9', chord: 'IVadd9', description: 'Folk, pop', type: 'extension' },
    { name: 'IV maj7#11', chord: 'IVmaj7#11', description: 'Lydien modal', type: 'modal' },
    { name: 'I/IV', chord: 'I/IV', description: 'Tonique sur IV (pedal)', type: 'voicing' },
    { name: 'Ivm', chord: 'Ivm', description: 'Modal interchange mineur', type: 'modal' },
  ],

  // Substitutions de ii (pré-dominante)
  'ii': [
    { name: 'ii m7', chord: 'iim7', description: 'Prédominant jazz', type: 'extension' },
    { name: 'ii m9', chord: 'iim9', description: 'ii-V-I jazz', type: 'extension' },
    { name: 'IV', chord: 'IV', description: 'Sous-dominante anticipée', type: 'substitution' },
  ],

  // Substitutions de iii (médiant)
  'iii': [
    { name: 'iii m7', chord: 'iiim7', description: 'Mediant élégant', type: 'extension' },
    { name: 'I', chord: 'I', description: 'Polytonie, médiant', type: 'substitution' },
  ],

  // Substitutions de vi (sus-tonique)
  'vi': [
    { name: 'vi m7', chord: 'vim7', description: 'Douceur soul/R&B', type: 'extension' },
    { name: 'vi m9', chord: 'vim9', description: 'Jazz mineur', type: 'extension' },
    { name: 'I', chord: 'I', description: 'Relative majeure, résolution stable', type: 'substitution' },
  ],

  // Substitutions de vii° (sensible)
  'vii': [
    { name: 'vii° dim7', chord: 'vii°dim7', description: 'Tension dramatique', type: 'extension' },
    { name: 'vii° m7b5', chord: 'vii°m7b5', description: 'Half-diminué', type: 'substitution' },
    { name: 'V7', chord: 'V7', description: 'Fonction dominante', type: 'substitution' },
  ],
};

/**
 * Obtenir les substitutions pour un accord donné (avancé)
 * @param chord - Accord de base (ex: 'C', 'Am', 'G7')
 * @param degree - Degré dans la gamme (0-6)
 * @param key - Tonalité (pour calculer les relatifs)
 * @returns Liste des substitutions disponibles
 */
export function getChordSubstitutionsByDegree(chord: string, degree: number, key: NoteName): ChordSubstitution[] {
  const subs: ChordSubstitution[] = [];

  const root = chord.replace(/m|dim|°|7|maj|add/g, '');
  const isMinor = chord.endsWith('m') && !chord.includes('aj');
  const isDim = chord.includes('dim') || chord.endsWith('°');
  const isMajor = !isMinor && !isDim;

  // === EXTENSIONS ===
  if (isMajor) {
    if (degree === 0) { // I
      subs.push({ name: 'Tonique majeure 7', chord: root + 'maj7', description: 'Son jazz élégant', type: 'extension' });
      subs.push({ name: 'Sixte majeure', chord: root + '6', description: 'Sonnalité ouverte', type: 'extension' });
      subs.push({ name: 'Add9', chord: root + 'add9', description: 'Richesse supplémentaire', type: 'extension' });
      subs.push({ name: 'Maj7#11', chord: root + 'maj7#11', description: 'Son lydien moderne', type: 'extension' });
    }
    if (degree === 3) { // IV
      subs.push({ name: 'Subdominante majeure 7', chord: root + 'maj7', description: 'Lumineux et stable', type: 'extension' });
      subs.push({ name: 'IVadd9', chord: root + 'add9', description: 'Folk, pop', type: 'extension' });
    }
    if (degree === 4) { // V
      subs.push({ name: 'Dominante 7', chord: root + '7', description: 'Tension vers I', type: 'extension' });
      subs.push({ name: 'Dominante 9', chord: root + '9', description: 'Couleur jazz/blues', type: 'extension' });
      subs.push({ name: 'Dominante 13', chord: root + '13', description: 'Funk, jazz moderne', type: 'extension' });
      subs.push({ name: '7#11', chord: root + '7#11', description: 'Lydien dominant', type: 'extension' });
      subs.push({ name: '7alt', chord: root + '7alt', description: 'Tension jazz maximale', type: 'extension' });
    }
  }

  if (isMinor) {
    if (degree === 5) { // vi
      subs.push({ name: 'Mineur 7', chord: root + 'm7', description: 'Douceur soul/R&B', type: 'extension' });
      subs.push({ name: 'Mineur 9', chord: root + 'm9', description: 'Jazz mineur', type: 'extension' });
      subs.push({ name: 'Mineur 11', chord: root + 'm11', description: 'Ambiance mystique', type: 'extension' });
    }
    if (degree === 1) { // ii
      subs.push({ name: 'Mineur 7', chord: root + 'm7', description: 'Prédominant jazz', type: 'extension' });
      subs.push({ name: 'Mineur 9', chord: root + 'm9', description: 'ii-V-I jazz', type: 'extension' });
    }
    if (degree === 2) { // iii
      subs.push({ name: 'Mineur 7', chord: root + 'm7', description: 'Mediant élégant', type: 'extension' });
    }
  }

  if (isDim) {
    subs.push({ name: 'Diminué 7', chord: root + 'dim7', description: 'Tension dramatique', type: 'extension' });
  }

  return subs;
}

// ============================================================================
// CHORD PROGRESSIONS (ADVANCED)
// ============================================================================

/**
 * Progressions d'accords avancées avec métadonnées émotionnelles
 * Plus détaillées que CHORD_PROGRESSIONS de notation.ts
 */
export const CHORD_PROGRESSIONS_ADVANCED: ChordProgressionAdvanced[] = [
  {
    name: 'I-V-vi-IV',
    degrees: ['I', 'V', 'vi', 'IV'],
    description: 'La progression pop moderne par excellence',
    emotion: 'Émotionnel et entraînant',
    genre: ['Pop', 'Rock', 'EDM']
  },
  {
    name: 'I-IV-V (Blues)',
    degrees: ['I', 'IV', 'V'],
    description: 'Base du blues, du rock et de la country',
    emotion: 'Direct et puissant',
    genre: ['Blues', 'Rock', 'Country']
  },
  {
    name: 'ii-V-I (Jazz)',
    degrees: ['ii', 'V', 'I'],
    description: 'La progression jazz la plus classique',
    emotion: 'Tension → Résolution sophistiquée',
    genre: ['Jazz', 'Bossa Nova']
  },
  {
    name: 'vi-IV-I-V',
    degrees: ['vi', 'IV', 'I', 'V'],
    description: 'Variation émotionnelle du pop',
    emotion: 'Nostalgique et uplifting',
    genre: ['Pop Ballad', 'Rock']
  },
  {
    name: 'I-vi-ii-V (Turnaround)',
    degrees: ['I', 'vi', 'ii', 'V'],
    description: 'Retour cyclique à la tonique',
    emotion: 'Sophistiqué et swing',
    genre: ['Jazz', 'R&B']
  },
  {
    name: 'iii-vi-ii-V',
    degrees: ['iii', 'vi', 'ii', 'V'],
    description: 'Turnaround avec médiant, plus de couleurs',
    emotion: 'Doux et mélodique',
    genre: ['Jazz', 'Pop']
  },
  {
    name: 'I-IV-vii°-I',
    degrees: ['I', 'IV', 'vii°', 'I'],
    description: 'Progression classique avec sensible',
    emotion: 'Dramatique et cinématique',
    genre: ['Classique', 'Soundtrack']
  },
  {
    name: 'Cycle de quintes',
    degrees: ['iii', 'vi', 'ii', 'V', 'I'],
    description: 'Descente par quintes diatoniques',
    emotion: 'Naturel et fluide',
    genre: ['Jazz', 'Bossa Nova']
  },
  {
    name: 'I-bVII-bVI-I (Andalou)',
    degrees: ['I', 'bVII', 'bVI', 'I'],
    description: 'Progression phrygienne/flamenco',
    emotion: 'Exotique et dramatique',
    genre: ['Flamenco', 'Metal', 'Rock']
  },
  {
    name: 'i-VII-VI (Metal Doom)',
    degrees: ['i', 'VII', 'VI'],
    description: 'Progression mineure sombre',
    emotion: 'Lourd et épique',
    genre: ['Metal', 'Doom', 'Gothic']
  },
  {
    name: 'I-VI-ii-V (R&B)',
    degrees: ['I', 'VI', 'ii', 'V'],
    description: 'Variation R&B du turnaround',
    emotion: 'Groovy et soul',
    genre: ['R&B', 'Soul']
  },
  {
    name: 'I-iii-IV-V',
    degrees: ['I', 'iii', 'IV', 'V'],
    description: 'Progression avec médiant lumineux',
    emotion: 'Optimiste et lumineux',
    genre: ['Pop', 'Folk']
  },
];

/**
 * Obtenir les progressions pour une tonalité donnée
 * @param key - Tonalité principale
 * @returns Progressions disponibles
 */
export function getChordProgressions(key: NoteName): ChordProgressionAdvanced[] {
  return CHORD_PROGRESSIONS_ADVANCED;
}

// ============================================================================
// MAJOR KEYS
// ============================================================================

/**
 * Tonalités majeures disponibles
 */
export const MAJOR_KEYS: NoteName[] = [
  'C', 'G', 'D', 'A', 'E', 'B', 'F#',
  'Db', 'Ab', 'Eb', 'Bb', 'F'
] as const;
