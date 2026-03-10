// ============================================================================
// DEGREES DATA - Degree colors and emotional mappings
// ============================================================================

// ============================================================================
// DEGREE COLORS
// ============================================================================

/**
 * Couleurs pour les 7 degrés de la gamme (émotionnelles)
 * Chaque couleur représente l'émotion associée au degré
 *
 * 1 - Tonique (bleu): résolution, stable, point de repos
 * 2 - Sus-dominante (violet): mouvement, transition
 * 3 - Médiant (rouge): nostalgie, émotion
 * 4 - Sous-dominante (cyan): aventure, départ
 * 5 - Dominante (orange): tension, besoin de résolution
 * 6 - Sus-tonique (gris): tristesse, mélancolie
 * 7 - Sensible (gris foncé): tension dramatique, attraction vers la tonique
 */
export const DEGREE_COLORS: string[] = [
  '#60A5FA', // 1 - Bleu (tonique, résolution) - stable
  '#A78BFA', // 2 - Violet (sus-dominante) - movement
  '#F87171', // 3 - Rouge (médiant) - nostalgie
  '#38BDF8', // 4 - Cyan (sous-dominante) - aventure
  '#FBBF24', // 5 - Orange (dominante) - tension
  '#94A3B8', // 6 - Gris (sus-tonique) - tristesse
  '#64748B', // 7 - Gris foncé (sensible) - tension dramatique
];

/**
 * Couleur par défaut pour notes hors gamme
 */
export const OFF_SCALE_COLOR = '#3a3a3a';

// ============================================================================
// CHORD DEGREE COLORS (specific to circle view)
// ============================================================================

/**
 * Couleurs pour les qualités d'accords (vue cercle)
 * Note: CHORD_QUALITY_COLORS dans emotion-mapping.ts est la version principale
 */
export const CHORD_DEGREE_COLORS: Record<'major' | 'minor' | 'diminished', string> = {
  major: '#F59E0B',    // Gold/Orange
  minor: '#3B82F6',    // Blue
  diminished: '#64748B', // Dark gray
};

// ============================================================================
// DEGREE NAMES
// ============================================================================

/**
 * Noms des degrés en français
 */
export const DEGREE_NAMES_FR: Record<number, string> = {
  1: 'Tonique',
  2: 'Seconde',
  3: 'Tierce',
  4: 'Quarte',
  5: 'Quinte',
  6: 'Sixte',
  7: 'Septième',
};

/**
 * Noms abrégés des degrés en français
 */
export const DEGREE_NAMES_SHORT_FR: Record<number, string> = {
  1: 'T',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
  6: 'VI',
  7: 'VII',
};

// ============================================================================
// DEGREE FUNCTIONS
// ============================================================================

/**
 * Fonctions harmoniques des degrés en majeur
 */
export const MAJOR_DEGREE_FUNCTIONS: Record<number, string> = {
  1: 'Tonique',
  2: 'Sus-dominante',
  3: 'Médiant',
  4: 'Sous-dominante',
  5: 'Dominante',
  6: 'Sus-tonique',
  7: 'Sensible',
};

/**
 * Fonctions harmoniques des degrés en mineur
 */
export const MINOR_DEGREE_FUNCTIONS: Record<number, string> = {
  1: 'Tonique',
  2: 'Sus-dominante',
  3: 'Médiant',
  4: 'Sous-dominante',
  5: 'Dominante',
  6: 'Sus-tonique',
  7: 'Sensible (subtonique)',
};
