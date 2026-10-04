// ============================================================================
// HARMONIC SUGGESTIONS - Mapping accord → gammes suggérées
// ============================================================================
/**
 * ADAGIO - Harmonic Suggestions Data
 * Mapping complet des accords vers les gammes compatibles
 *
 * Contient:
 * - Correspondances accords → gammes (Dm7 → Dorien, G7 → Mixolydien, etc.)
 * - Niveau de compatibilité (perfect, good, possible)
 * - Justifications théoriques pour chaque suggestion
 * - Compatible avec le système de types @adagio/types
 */

import type { NoteName } from '@adagio/types';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Identifiants des gammes disponibles
 */
export type ScaleId =
  | 'major'
  | 'minor'
  | 'harmonic-minor'
  | 'melodic-minor'
  | 'dorian'
  | 'phrygian'
  | 'lydian'
  | 'mixolydian'
  | 'aeolian'
  | 'locrian'
  | 'pentatonic-major'
  | 'pentatonic-minor'
  | 'blues'
  | 'pentatonic-blues'
  | 'dorian-b2'
  | 'lydian-augmented'
  | 'lydian-dominant'
  | 'mixolydian-b13'
  | 'locrian-natural2'
  | 'altered'
  | 'half-diminished'
  | 'whole-tone'
  | 'diminished'
  | 'chromatic';

/**
 * Niveau de compatibilité entre accord et gamme
 */
export type MatchLevel = 'perfect' | 'good' | 'possible' | 'experimental';

/**
 * Suggestion de gamme pour un accord donné
 */
export interface ScaleSuggestion {
  /** Identifiant unique de la gamme */
  scaleId: ScaleId;
  /** Nom de la gamme (français) */
  name: string;
  /** Nom alternatif */
  alternateNames?: string[];
  /** Intervalles de la gamme */
  intervals: string[];
  /** Pourquoi cette gamme fonctionne */
  reason: string;
  /** Notes à éviter (notes caractéristiques clash) */
  avoidNotes?: string[];
  /** Notes caractéristiques à souligner */
  highlightNotes?: string[];
  /** Niveau de compatibilité */
  match: MatchLevel;
  /** Styles musicaux associés */
  styles?: string[];
  /** Contexte d'utilisation */
  context?: string;
}

/**
 * Entrée de mapping accord → gammes
 */
export interface ChordScaleMapping {
  /** Accord (ex: 'C', 'Am7', 'G7alt') */
  chord: string;
  /** Toutes les gammes compatibles */
  scales: ScaleSuggestion[];
  /** Fonction harmonique principale */
  primaryFunction?: 'tonic' | 'subdominant' | 'dominant' | 'sub-dominant' | 'modal-interchange';
}

// ============================================================================
// SCALE DEFINITIONS
// ============================================================================

/**
 * Définitions des gammes pour référence
 */
export const SCALE_DEFINITIONS: Record<ScaleId, { name: string; intervals: string[] }> = {
  major: { name: 'Majeur (Ionien)', intervals: ['1', '2', '3', '4', '5', '6', '7'] },
  minor: { name: 'Mineur Naturel (Aeolian)', intervals: ['1', '2', 'b3', '4', '5', 'b6', 'b7'] },
  'harmonic-minor': { name: 'Mineur Harmonique', intervals: ['1', '2', 'b3', '4', '5', 'b6', '7'] },
  'melodic-minor': { name: 'Mineur Mélodique', intervals: ['1', '2', 'b3', '4', '5', '6', '7'] },
  dorian: { name: 'Dorien', intervals: ['1', '2', 'b3', '4', '5', '6', 'b7'] },
  phrygian: { name: 'Phrygien', intervals: ['1', 'b2', 'b3', '4', '5', 'b6', 'b7'] },
  lydian: { name: 'Lydien', intervals: ['1', '2', '3', '#4', '5', '6', '7'] },
  mixolydian: { name: 'Mixolydien', intervals: ['1', '2', '3', '4', '5', '6', 'b7'] },
  aeolian: { name: 'Aeolian (Mineur)', intervals: ['1', '2', 'b3', '4', '5', 'b6', 'b7'] },
  locrian: { name: 'Locrien', intervals: ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7'] },
  'pentatonic-major': { name: 'Pentatonique Majeure', intervals: ['1', '2', '3', '5', '6'] },
  'pentatonic-minor': { name: 'Pentatonique Mineure', intervals: ['1', 'b3', '4', '5', 'b7'] },
  blues: { name: 'Blues', intervals: ['1', 'b3', '4', 'b5', '5', 'b7'] },
  'pentatonic-blues': { name: 'Pentatonique Blues', intervals: ['1', 'b3', '4', 'b5', '5', 'b7'] },
  'dorian-b2': { name: 'Dorien b2', intervals: ['1', 'b2', 'b3', '4', '5', '6', 'b7'] },
  'lydian-augmented': { name: 'Lydien Augmenté', intervals: ['1', '2', '3', '#4', '#5', '6', '7'] },
  'lydian-dominant': { name: 'Lydien Dominant', intervals: ['1', '2', '3', '#4', '5', '6', 'b7'] },
  'mixolydian-b13': { name: 'Mixolydien b13', intervals: ['1', '2', '3', '4', '5', 'b6', 'b7'] },
  'locrian-natural2': { name: 'Locrien nat2', intervals: ['1', '2', 'b3', '4', 'b5', 'b6', 'b7'] },
  altered: { name: 'Altéré', intervals: ['1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7'] },
  'half-diminished': {
    name: 'Half-Diminished',
    intervals: ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7'],
  },
  'whole-tone': { name: 'Tons Entiers', intervals: ['1', '2', '3', '#4', '#5', 'b7'] },
  diminished: { name: 'Diminué', intervals: ['1', 'b2', 'b3', '3', '#4', '5', '6', 'b7'] },
  chromatic: {
    name: 'Chromatique',
    intervals: ['1', 'b2', '2', 'b3', '3', '4', '#4', '5', '#5', '6', 'b7', '7'],
  },
};

// ============================================================================
// CHORD TO SCALE MAPPING
// ============================================================================

/**
 * Mapping complet des accords vers les gammes suggérées
 */
export const CHORD_TO_SCALE: Record<string, ScaleSuggestion[]> = {
  // ============================================================================
  // ACCORDS MAJEURS
  // ============================================================================

  C: [
    {
      scaleId: 'major',
      name: 'Majeur (Ionien)',
      intervals: ['1', '2', '3', '4', '5', '6', '7'],
      reason: 'Gamme homonyme, stabilité maximale',
      highlightNotes: ['3', '5'],
      match: 'perfect',
      styles: ['Classique', 'Pop', 'Folk'],
    },
    {
      scaleId: 'lydian',
      name: 'Lydien',
      intervals: ['1', '2', '3', '#4', '5', '6', '7'],
      reason: '#4 crée un son spatial, dreamy',
      avoidNotes: [],
      highlightNotes: ['#4'],
      match: 'perfect',
      styles: ['Fusion', 'Prog', 'Ambient'],
      context: 'Très utilisé sur les accords majeurs II, IV, vii',
    },
    {
      scaleId: 'mixolydian',
      name: 'Mixolydien',
      intervals: ['1', '2', '3', '4', '5', '6', 'b7'],
      reason: 'b7 ajoute une couleur bluesy/rock',
      avoidNotes: [],
      highlightNotes: ['b7'],
      match: 'good',
      styles: ['Rock', 'Blues', 'Country'],
      context: 'Son dominant sans tension résolutive',
    },
    {
      scaleId: 'pentatonic-major',
      name: 'Pentatonique Majeure',
      intervals: ['1', '2', '3', '5', '6'],
      reason: 'Simple, mélodique, fonctionne partout',
      avoidNotes: [],
      highlightNotes: ['2', '6'],
      match: 'perfect',
      styles: ['Pop', 'Rock', 'Country'],
    },
    {
      scaleId: 'dorian',
      name: 'Dorien',
      intervals: ['1', '2', 'b3', '4', '5', '6', 'b7'],
      reason: 'Modal interchange: emprunt au mode II pour son #6 mélodique (jazz minor)',
      avoidNotes: [],
      highlightNotes: ['6', 'b3'],
      match: 'possible',
      styles: ['Jazz', 'Fusion'],
      context:
        'La b3 (= #9 enharmonique) crée une tension colorée avec la tierce majeure de l\'accord. Ce n\'est PAS une incompatibilité théorique, mais un choix stylistique de modal interchange. La b3 peut être utilisée comme note de passage ou appogiature, sans se résoudre dessus. Le degré 6 (#6 relatif à la tonalité) est la note "sûre" à souligner.',
    },
  ],

  Cmaj7: [
    {
      scaleId: 'major',
      name: 'Majeur (Ionien)',
      intervals: ['1', '2', '3', '4', '5', '6', '7'],
      reason: 'Gamme diatonique, la maj7 est la note charnière',
      highlightNotes: ['7'],
      match: 'perfect',
      styles: ['Jazz', 'Pop'],
    },
    {
      scaleId: 'lydian',
      name: 'Lydien',
      intervals: ['1', '2', '3', '#4', '5', '6', '7'],
      reason: '#4 avec maj7 = son jazz moderne très recherché',
      highlightNotes: ['#4', '7'],
      match: 'perfect',
      styles: ['Jazz', 'Fusion'],
      context: 'Standard sur les accords maj7#11',
    },
    {
      scaleId: 'pentatonic-major',
      name: 'Pentatonique Majeure',
      intervals: ['1', '2', '3', '5', '6'],
      reason: 'Simplicité mélodique',
      match: 'perfect',
      styles: ['Pop', 'Country'],
    },
    {
      scaleId: 'lydian-augmented',
      name: 'Lydien Augmenté',
      intervals: ['1', '2', '3', '#4', '#5', '6', '7'],
      reason: 'Son exotique, très dissonant',
      avoidNotes: ['#5'],
      highlightNotes: ['#4', '#5'],
      match: 'experimental',
      styles: ['Jazz Avant-garde'],
      context: 'À utiliser avec parcimonie',
    },
  ],

  // ============================================================================
  // ACCORDS MINEURS
  // ============================================================================

  Am: [
    {
      scaleId: 'aeolian',
      name: 'Mineur Naturel (Aeolian)',
      intervals: ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
      reason: 'Gamme relative mineure, son triste standard',
      highlightNotes: ['b3', 'b6'],
      match: 'perfect',
      styles: ['Rock', 'Pop', 'Metal'],
    },
    {
      scaleId: 'dorian',
      name: 'Dorien',
      intervals: ['1', '2', 'b3', '4', '5', '6', 'b7'],
      reason: '6 majore apporte une couleur jazz/soul',
      highlightNotes: ['6'],
      match: 'perfect',
      styles: ['Jazz', 'Soul', 'Funk'],
      context: 'Le mode le plus utilisé en jazz sur accords mineurs',
    },
    {
      scaleId: 'pentatonic-minor',
      name: 'Pentatonique Mineure',
      intervals: ['1', 'b3', '4', '5', 'b7'],
      reason: 'Base du blues et du rock',
      highlightNotes: ['b3', 'b7'],
      match: 'perfect',
      styles: ['Blues', 'Rock', 'Metal'],
    },
    {
      scaleId: 'phrygian',
      name: 'Phrygien',
      intervals: ['1', 'b2', 'b3', '4', '5', 'b6', 'b7'],
      reason: 'b2 espagnol/flamenco',
      avoidNotes: [],
      highlightNotes: ['b2'],
      match: 'good',
      styles: ['Flamenco', 'Metal'],
      context: 'Très caractéristique, son espagnol',
    },
    {
      scaleId: 'harmonic-minor',
      name: 'Mineur Harmonique',
      intervals: ['1', '2', 'b3', '4', '5', 'b6', '7'],
      reason: '7 majeure crée une tension orientale/metal',
      highlightNotes: ['7'],
      match: 'good',
      styles: ['Metal', 'Classique', 'Néo-classique'],
    },
    {
      scaleId: 'melodic-minor',
      name: 'Mineur Mélodique',
      intervals: ['1', '2', 'b3', '4', '5', '6', '7'],
      reason: 'Son jazz ascendant',
      highlightNotes: ['6', '7'],
      match: 'good',
      styles: ['Jazz'],
    },
  ],

  Am7: [
    {
      scaleId: 'dorian',
      name: 'Dorien',
      intervals: ['1', '2', 'b3', '4', '5', '6', 'b7'],
      reason: 'Le choix standard pour les accords m7 en jazz',
      highlightNotes: ['6'],
      match: 'perfect',
      styles: ['Jazz', 'Funk', 'Soul'],
      context: 'ii-V-I jazz: utiliser Dorien sur le ii',
    },
    {
      scaleId: 'aeolian',
      name: 'Aeolian',
      intervals: ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
      reason: 'Son mineur naturel plus sombre',
      match: 'good',
      styles: ['Pop', 'Rock'],
    },
    {
      scaleId: 'pentatonic-minor',
      name: 'Pentatonique Mineure',
      intervals: ['1', 'b3', '4', '5', 'b7'],
      reason: 'Simple et efficace',
      match: 'perfect',
      styles: ['Blues', 'Rock'],
    },
    {
      scaleId: 'dorian-b2',
      name: 'Dorien b2',
      intervals: ['1', 'b2', 'b3', '4', '5', '6', 'b7'],
      reason: 'Modal interchange, son exotique',
      highlightNotes: ['b2', '6'],
      match: 'experimental',
      styles: ['Jazz Moderne'],
    },
  ],

  // ============================================================================
  // ACCORDS DOMINANTS (7)
  // ============================================================================

  G7: [
    {
      scaleId: 'mixolydian',
      name: 'Mixolydien',
      intervals: ['1', '2', '3', '4', '5', '6', 'b7'],
      reason: 'Le choix standard pour les accords 7',
      highlightNotes: ['b7'],
      match: 'perfect',
      styles: ['Rock', 'Blues', 'Jazz'],
      context: 'Gamme dominante par excellence',
    },
    {
      scaleId: 'blues',
      name: 'Blues',
      intervals: ['1', 'b3', '4', 'b5', '5', 'b7'],
      reason: 'Son blues authentique avec la blue note',
      highlightNotes: ['b5'],
      match: 'perfect',
      styles: ['Blues', 'Rock'],
    },
    {
      scaleId: 'pentatonic-major',
      name: 'Pentatonique Majeure',
      intervals: ['1', '2', '3', '5', '6'],
      reason: 'Son country/clean sur 7',
      match: 'good',
      styles: ['Country', 'Rockabilly'],
    },
    {
      scaleId: 'pentatonic-blues',
      name: 'Pentatonique Blues',
      intervals: ['1', 'b3', '4', 'b5', '5', 'b7'],
      reason: 'Base blues avec blue note',
      match: 'perfect',
      styles: ['Blues', 'Rock'],
    },
    {
      scaleId: 'mixolydian-b13',
      name: 'Mixolydien b13',
      intervals: ['1', '2', '3', '4', '5', 'b6', 'b7'],
      reason: 'b6 ajoute une couleur soul/R&B',
      highlightNotes: ['b6'],
      match: 'good',
      styles: ['Soul', 'R&B'],
    },
  ],

  G9: [
    {
      scaleId: 'mixolydian',
      name: 'Mixolydien',
      intervals: ['1', '2', '3', '4', '5', '6', 'b7'],
      reason: 'Contient la 9ème (2)',
      highlightNotes: ['2', 'b7'],
      match: 'perfect',
      styles: ['Jazz', 'Funk'],
    },
    {
      scaleId: 'blues',
      name: 'Blues',
      intervals: ['1', 'b3', '4', 'b5', '5', 'b7'],
      reason: 'Fonctionne aussi sur 9',
      match: 'good',
      styles: ['Blues'],
    },
    {
      scaleId: 'lydian-dominant',
      name: 'Lydien Dominant',
      intervals: ['1', '2', '3', '#4', '5', '6', 'b7'],
      reason: '#4 crée un son fusion moderne',
      highlightNotes: ['#4', 'b7'],
      match: 'good',
      styles: ['Jazz Fusion'],
      context: 'IV7 altéré, très utilisé en fusion',
    },
  ],

  G7alt: [
    {
      scaleId: 'altered',
      name: 'Altéré (Super-Locrien)',
      intervals: ['1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7'],
      reason: 'La gamme de tension maximale pour V7alt',
      highlightNotes: ['b2', 'b5'],
      match: 'perfect',
      styles: ['Jazz'],
      context: 'Standard sur les accords V7alt en jazz',
    },
    {
      scaleId: 'whole-tone',
      name: 'Tons Entiers',
      intervals: ['1', '2', '3', '#4', '#5', 'b7'],
      reason: 'Son symétrique, très instable',
      highlightNotes: ['#4', '#5'],
      match: 'good',
      styles: ['Jazz', 'Classique'],
      context: 'Fonctionne sur 7#5 ou 7b5',
    },
    {
      scaleId: 'diminished',
      name: 'Diminué',
      intervals: ['1', 'b2', 'b3', '3', '#4', '5', '6', 'b7'],
      reason: 'Pour 7b9 (b2 = b9 enharmonique)',
      highlightNotes: ['b2'],
      match: 'good',
      styles: ['Jazz'],
    },
    {
      scaleId: 'lydian-dominant',
      name: 'Lydien Dominant',
      intervals: ['1', '2', '3', '#4', '5', '6', 'b7'],
      reason: 'Alternative moins dissonante',
      match: 'possible',
      styles: ['Jazz Fusion'],
    },
  ],

  'G7#11': [
    {
      scaleId: 'lydian-dominant',
      name: 'Lydien Dominant',
      intervals: ['1', '2', '3', '#4', '5', '6', 'b7'],
      reason: 'Contient le #11, choix évident',
      highlightNotes: ['#4'],
      match: 'perfect',
      styles: ['Jazz', 'Fusion'],
      context: 'Mode IV du mineur mélodique',
    },
  ],

  'G7#9': [
    {
      scaleId: 'altered',
      name: 'Altéré',
      intervals: ['1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7'],
      reason: 'Contient #9 (=b3)',
      highlightNotes: ['b3'],
      match: 'perfect',
      styles: ['Jazz', 'Rock (Hendrix)'],
      context: '"Hendrix chord"',
    },
    {
      scaleId: 'blues',
      name: 'Blues',
      intervals: ['1', 'b3', '4', 'b5', '5', 'b7'],
      reason: 'b3 + 7 = son Hendrix',
      highlightNotes: ['b3'],
      match: 'good',
      styles: ['Blues', 'Rock'],
    },
  ],

  // ============================================================================
  // ACCORDS DIMINUÉS
  // ============================================================================

  Bdim: [
    {
      scaleId: 'locrian',
      name: 'Locrien',
      intervals: ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7'],
      reason: 'Mode vii, naturel sur diminué',
      highlightNotes: ['b5'],
      match: 'perfect',
      styles: ['Jazz', 'Classique'],
    },
    {
      scaleId: 'half-diminished',
      name: 'Half-Diminished',
      intervals: ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7'],
      reason: 'Similaire au Locrien, plus jazz',
      match: 'good',
      styles: ['Jazz'],
    },
    {
      scaleId: 'diminished',
      name: 'Diminué (octatonique)',
      intervals: ['1', 'b2', 'b3', '3', '#4', '5', '6', 'b7'],
      reason: 'Gamme symétrique pour dim7',
      match: 'perfect',
      styles: ['Jazz', 'Metal'],
    },
  ],

  Bdim7: [
    {
      scaleId: 'diminished',
      name: 'Diminué (octatonique)',
      intervals: ['1', 'b2', 'b3', '3', '#4', '5', '6', 'b7'],
      reason: 'Gamme octatonique, standard pour dim7',
      match: 'perfect',
      styles: ['Jazz', 'Classique'],
      context: '8 notes symétriques',
    },
    {
      scaleId: 'locrian',
      name: 'Locrien',
      intervals: ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7'],
      reason: 'Fonctionne mais moins complet',
      match: 'good',
      styles: ['Jazz'],
    },
  ],

  Bm7b5: [
    {
      scaleId: 'locrian',
      name: 'Locrien',
      intervals: ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7'],
      reason: 'Mode naturel pour half-diminished',
      highlightNotes: ['b5'],
      match: 'perfect',
      styles: ['Jazz'],
      context: 'vii en majeur, ii en mineur',
    },
    {
      scaleId: 'half-diminished',
      name: 'Half-Diminished',
      intervals: ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7'],
      reason: 'Alternative jazz',
      match: 'good',
      styles: ['Jazz'],
    },
  ],

  // ============================================================================
  // ACCORDS AUGMENTÉS
  // ============================================================================

  Caug: [
    {
      scaleId: 'whole-tone',
      name: 'Tons Entiers',
      intervals: ['1', '2', '3', '#4', '#5', 'b7'],
      reason: 'Gamme par tons entiers pour augmenté',
      highlightNotes: ['#4', '#5'],
      match: 'perfect',
      styles: ['Jazz', 'Classique'],
    },
    {
      scaleId: 'lydian-augmented',
      name: 'Lydien Augmenté',
      intervals: ['1', '2', '3', '#4', '#5', '6', '7'],
      reason: 'Mode III du mineur mélodique',
      highlightNotes: ['#4', '#5'],
      match: 'good',
      styles: ['Jazz'],
    },
  ],

  // ============================================================================
  // ACCORDS SUS
  // ============================================================================

  Csus2: [
    {
      scaleId: 'major',
      name: 'Majeur',
      intervals: ['1', '2', '3', '4', '5', '6', '7'],
      reason: 'Utiliser 2 et 4 comme notes principales',
      avoidNotes: ['3'],
      highlightNotes: ['2', '4'],
      match: 'perfect',
      styles: ['Pop', 'Rock'],
    },
    {
      scaleId: 'pentatonic-major',
      name: 'Pentatonique Majeure',
      intervals: ['1', '2', '3', '5', '6'],
      reason: 'Contient le sus2',
      highlightNotes: ['2'],
      match: 'perfect',
      styles: ['Pop'],
    },
    {
      scaleId: 'dorian',
      name: 'Dorien',
      intervals: ['1', '2', 'b3', '4', '5', '6', 'b7'],
      reason: 'Modal interchange: couleur mineure jazz sur accord sus (sans tierce)',
      avoidNotes: [],
      highlightNotes: ['6', '2'],
      match: 'possible',
      styles: ['Fusion'],
      context:
        'Comme l\'accord sus2 n\'a pas de tierce, la b3 du Dorien ne crée pas de conflit. Le #6 (6) donne une couleur "jazz minor" intéressante.',
    },
  ],

  Csus4: [
    {
      scaleId: 'major',
      name: 'Majeur',
      intervals: ['1', '2', '3', '4', '5', '6', '7'],
      reason: '4 est la note caractéristique',
      avoidNotes: ['3'],
      highlightNotes: ['4'],
      match: 'perfect',
      styles: ['Rock', 'Pop'],
    },
    {
      scaleId: 'mixolydian',
      name: 'Mixolydien',
      intervals: ['1', '2', '3', '4', '5', '6', 'b7'],
      reason: 'Son plus bluesy',
      highlightNotes: ['4', 'b7'],
      match: 'good',
      styles: ['Rock'],
    },
  ],

  G7sus4: [
    {
      scaleId: 'mixolydian',
      name: 'Mixolydien',
      intervals: ['1', '2', '3', '4', '5', '6', 'b7'],
      reason: 'Sus4 dominant standard',
      highlightNotes: ['4', 'b7'],
      match: 'perfect',
      styles: ['Rock', 'Jazz'],
    },
    {
      scaleId: 'dorian',
      name: 'Dorien',
      intervals: ['1', '2', 'b3', '4', '5', '6', 'b7'],
      reason: 'Modal interchange sur sus4 dominant (sans tierce)',
      avoidNotes: [],
      highlightNotes: ['6', '4'],
      match: 'good',
      styles: ['Fusion'],
      context:
        "Comme l'accord sus4 n'a pas de tierce, la b3 du Dorien ne crée pas de conflit. Le #6 (6) et la 4 fonctionnent bien.",
    },
  ],

  // ============================================================================
  // ACCORDS 6/9
  // ============================================================================

  C6: [
    {
      scaleId: 'major',
      name: 'Majeur',
      intervals: ['1', '2', '3', '4', '5', '6', '7'],
      reason: 'Contient la sixte',
      highlightNotes: ['6'],
      match: 'perfect',
      styles: ['Jazz', 'Pop'],
    },
    {
      scaleId: 'pentatonic-major',
      name: 'Pentatonique Majeure',
      intervals: ['1', '2', '3', '5', '6'],
      reason: 'Contient 6 et pas de 7',
      match: 'perfect',
      styles: ['Pop'],
    },
  ],

  C69: [
    {
      scaleId: 'pentatonic-major',
      name: 'Pentatonique Majeure',
      intervals: ['1', '2', '3', '5', '6'],
      reason: 'Contient exactement 1, 2, 3, 5, 6',
      match: 'perfect',
      styles: ['Jazz', 'Pop'],
    },
    {
      scaleId: 'major',
      name: 'Majeur',
      intervals: ['1', '2', '3', '4', '5', '6', '7'],
      reason: 'Gamme complète',
      match: 'perfect',
      styles: ['Jazz'],
    },
  ],

  // ============================================================================
  // EXTENSIONS JAZZ
  // ============================================================================

  Cmaj9: [
    {
      scaleId: 'lydian',
      name: 'Lydien',
      intervals: ['1', '2', '3', '#4', '5', '6', '7'],
      reason: 'Son maj9 moderne avec #11 optionnel',
      highlightNotes: ['2', '7'],
      match: 'perfect',
      styles: ['Jazz'],
    },
    {
      scaleId: 'major',
      name: 'Majeur',
      intervals: ['1', '2', '3', '4', '5', '6', '7'],
      reason: 'Diatonique',
      match: 'perfect',
      styles: ['Pop', 'Jazz'],
    },
    {
      scaleId: 'pentatonic-major',
      name: 'Pentatonique Majeure',
      intervals: ['1', '2', '3', '5', '6'],
      reason: 'Contient la 9 (2)',
      match: 'perfect',
      styles: ['Pop'],
    },
  ],

  'Cmaj7#11': [
    {
      scaleId: 'lydian',
      name: 'Lydien',
      intervals: ['1', '2', '3', '#4', '5', '6', '7'],
      reason: 'Contient le #11 (#4)',
      highlightNotes: ['#4'],
      match: 'perfect',
      styles: ['Jazz', 'Fusion'],
      context: 'Le choix unique pour maj7#11',
    },
  ],

  Cm9: [
    {
      scaleId: 'dorian',
      name: 'Dorien',
      intervals: ['1', '2', 'b3', '4', '5', '6', 'b7'],
      reason: 'Contient la 9 (2) et la 6, son jazz m9 standard',
      highlightNotes: ['2', '6'],
      match: 'perfect',
      styles: ['Jazz', 'Soul'],
    },
    {
      scaleId: 'aeolian',
      name: 'Aeolian',
      intervals: ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
      reason: 'Plus sombre, b6 présent',
      match: 'good',
      styles: ['Pop', 'Rock'],
    },
  ],

  Cm11: [
    {
      scaleId: 'dorian',
      name: 'Dorien',
      intervals: ['1', '2', 'b3', '4', '5', '6', 'b7'],
      reason: 'Contient la 11 (4)',
      highlightNotes: ['4', '6'],
      match: 'perfect',
      styles: ['Jazz'],
    },
  ],

  C13: [
    {
      scaleId: 'mixolydian',
      name: 'Mixolydien',
      intervals: ['1', '2', '3', '4', '5', '6', 'b7'],
      reason: 'Contient 9 (2), 11 (4), 13 (6)',
      highlightNotes: ['6'],
      match: 'perfect',
      styles: ['Jazz', 'Funk'],
    },
    {
      scaleId: 'blues',
      name: 'Blues',
      intervals: ['1', 'b3', '4', 'b5', '5', 'b7'],
      reason: 'Son blues même sur 13',
      match: 'good',
      styles: ['Blues', 'Funk'],
    },
  ],

  // ============================================================================
  // MODAL INTERCHANGE (EMPRUNTS)
  // ============================================================================

  Dbmaj7: [
    {
      scaleId: 'lydian',
      name: 'Lydien',
      intervals: ['1', '2', '3', '#4', '5', '6', '7'],
      reason: 'IV lydien, modal interchange',
      highlightNotes: ['#4'],
      match: 'perfect',
      styles: ['Jazz'],
      context: 'bVII en majeur ou IV lydien en mineur',
    },
  ],

  'Abmaj7#11': [
    {
      scaleId: 'lydian',
      name: 'Lydien',
      intervals: ['1', '2', '3', '#4', '5', '6', '7'],
      reason: 'Lydien est le seul choix pour #11',
      highlightNotes: ['#4'],
      match: 'perfect',
      styles: ['Jazz'],
    },
  ],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Obtient les suggestions de gammes pour un accord donné
 */
export function getScalesForChord(chord: string): ScaleSuggestion[] {
  // Recherche exacte
  if (CHORD_TO_SCALE[chord]) {
    return CHORD_TO_SCALE[chord]!;
  }

  // Normalisation et recherche partielle
  const normalizedChord = chord.trim();

  // Extraire la racine pour les accords non listés
  const rootMatch = normalizedChord.match(/^([A-G][#b]?)(.*)$/);
  if (rootMatch) {
    const [, root, suffix] = rootMatch;

    // Accord majeur simple
    if (!suffix && root) {
      const majorKey = CHORD_TO_SCALE[root as keyof typeof CHORD_TO_SCALE];
      if (majorKey) {
        return majorKey.map((s: ScaleSuggestion) => ({
          ...s,
          context: s.context
            ? `${s.context} (Transposé depuis ${root})`
            : `Transposé depuis ${root}`,
        }));
      }
    }

    // Accord mineur simple
    if (suffix === 'm' && root) {
      const minorKey = CHORD_TO_SCALE[`${root}m` as keyof typeof CHORD_TO_SCALE];
      if (minorKey) {
        return minorKey.map((s: ScaleSuggestion) => ({
          ...s,
          context: s.context
            ? `${s.context} (Transposé depuis ${root}m)`
            : `Transposé depuis ${root}m`,
        }));
      }
    }

    // Accord 7
    if (suffix === '7' && root) {
      const sevenKey = CHORD_TO_SCALE[`${root}7` as keyof typeof CHORD_TO_SCALE];
      if (sevenKey) return sevenKey;
      const generic7 = CHORD_TO_SCALE['G7'];
      if (generic7) {
        return generic7.map((s: ScaleSuggestion) => ({
          ...s,
          context: `Dominant générique (basé sur G7)`,
        }));
      }
    }

    // Accord maj7
    if (suffix === 'maj7' && root) {
      const maj7Key = CHORD_TO_SCALE[`${root}maj7` as keyof typeof CHORD_TO_SCALE];
      if (maj7Key) return maj7Key;
      const genericMaj7 = CHORD_TO_SCALE['Cmaj7'];
      if (genericMaj7) {
        return genericMaj7.map((s) => ({
          ...s,
          context: `Maj7 générique (basé sur Cmaj7)`,
        }));
      }
    }

    // Accord m7
    if (suffix === 'm7' && root) {
      const m7Key = CHORD_TO_SCALE[`${root}m7` as keyof typeof CHORD_TO_SCALE];
      if (m7Key) return m7Key;
      const genericM7 = CHORD_TO_SCALE['Am7'];
      if (genericM7) {
        return genericM7.map((s: ScaleSuggestion) => ({
          ...s,
          context: `m7 générique (basé sur Am7)`,
        }));
      }
    }
  }

  // Fallback: suggestions par type d'accord
  const chordType = getChordType(chord);
  return getGenericSuggestions(chordType);
}

/**
 * Détermine le type d'accord pour les suggestions génériques
 */
function getChordType(chord: string): string {
  if (chord.includes('dim')) return 'diminished';
  if (chord.includes('aug')) return 'augmented';
  if (chord.includes('7alt') || chord.includes('alt')) return 'altered';
  if (chord.includes('#11') || chord.includes('b5')) return 'lydian';
  if (chord.includes('7#9') || chord.includes('7b9')) return 'altered-dim';
  if (chord.includes('7')) return 'dominant';
  if (chord.includes('maj7') || chord.includes('Δ')) return 'major7';
  if (chord.includes('m7') || chord.includes('-7')) return 'minor7';
  if (chord.includes('m') || chord.includes('-')) return 'minor';
  if (chord.includes('add9') || chord.includes('2')) return 'sus2';
  if (chord.includes('sus4')) return 'sus4';
  if (chord.includes('sus')) return 'sus';
  if (chord.includes('6')) return 'major6';
  return 'major';
}

/**
 * Suggestions génériques par type d'accord
 */
function getGenericSuggestions(type: string): ScaleSuggestion[] {
  const suggestions: Record<string, ScaleSuggestion[]> = {
    major: CHORD_TO_SCALE['C'] || [],
    minor: CHORD_TO_SCALE['Am'] || [],
    dominant: CHORD_TO_SCALE['G7'] || [],
    major7: CHORD_TO_SCALE['Cmaj7'] || [],
    minor7: CHORD_TO_SCALE['Am7'] || [],
    diminished: CHORD_TO_SCALE['Bdim'] || [],
    augmented: CHORD_TO_SCALE['Caug'] || [],
    altered: CHORD_TO_SCALE['G7alt'] || [],
    lydian: CHORD_TO_SCALE['Cmaj7#11'] || [],
    sus2: CHORD_TO_SCALE['Csus2'] || [],
    sus4: CHORD_TO_SCALE['Csus4'] || [],
    major6: CHORD_TO_SCALE['C6'] || [],
    sus: CHORD_TO_SCALE['Csus4'] || [],
  };

  return suggestions[type] || suggestions['major'] || [];
}

/**
 * Filtre les suggestions par niveau de compatibilité
 */
export function filterByMatch(
  suggestions: ScaleSuggestion[],
  minMatch: MatchLevel
): ScaleSuggestion[] {
  const matchOrder: MatchLevel[] = ['experimental', 'possible', 'good', 'perfect'];
  const minIndex = matchOrder.indexOf(minMatch);

  return suggestions.filter((s) => {
    const index = matchOrder.indexOf(s.match);
    return index >= minIndex;
  });
}

/**
 * Filtre les suggestions par style musical
 */
export function filterByStyle(suggestions: ScaleSuggestion[], style: string): ScaleSuggestion[] {
  return suggestions.filter((s) =>
    s.styles?.some((s) => s.toLowerCase().includes(style.toLowerCase()))
  );
}

/**
 * Obtient la meilleure suggestion pour un accord donné
 */
export function getBestScaleForChord(chord: string): ScaleSuggestion | null {
  const suggestions = getScalesForChord(chord);
  const perfect = suggestions.filter((s) => s.match === 'perfect');
  return perfect[0] || suggestions[0] || null;
}

/**
 * Obtient les suggestions pour un degré diatonique dans une tonalité
 */
export function getScalesForDegree(
  degree: number,
  key: NoteName,
  mode: 'major' | 'minor' = 'major'
): ScaleSuggestion[] {
  const sharpChromatic: NoteName[] = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
  ];
  const flatChromatic: NoteName[] = [
    'C',
    'Db',
    'D',
    'Eb',
    'E',
    'F',
    'Gb',
    'G',
    'Ab',
    'A',
    'Bb',
    'B',
  ];

  const useFlats = ['Db', 'Eb', 'Gb', 'Ab', 'Bb', 'F'].includes(key);
  const chromatic = useFlats ? flatChromatic : sharpChromatic;
  const keyIndex = chromatic.indexOf(key);

  const majorIntervals = [0, 2, 4, 5, 7, 9, 11];
  const minorIntervals = [0, 2, 3, 5, 7, 8, 10];
  const intervals = mode === 'major' ? majorIntervals : minorIntervals;

  const degreeNote = chromatic[(keyIndex + (intervals[degree] ?? 0)) % 12]!;

  // Qualité de l'accord par degré
  const majorQualities = ['', 'm', 'm', '', '', 'm', 'dim'];
  const minorQualities = ['m', 'dim', '', 'm', 'm', '', ''];

  const quality =
    mode === 'major' ? (majorQualities[degree] ?? '') : (minorQualities[degree] ?? '');
  const chord = degreeNote + quality;

  return getScalesForChord(chord);
}

/**
 * Formatte les suggestions pour affichage
 */
export function formatSuggestion(suggestion: ScaleSuggestion): string {
  const matchIndicator = {
    perfect: '⭐',
    good: '✓',
    possible: '~',
    experimental: '?',
  };

  return `${matchIndicator[suggestion.match]} ${suggestion.name} - ${suggestion.reason}`;
}
