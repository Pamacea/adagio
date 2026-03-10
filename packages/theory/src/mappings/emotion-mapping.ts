// ============================================================================
// EMOTION MAPPING - Map modes to emotions/feelings + Color System
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
    'sombre': ['phrygian', 'locrian'],
    'exotique': ['phrygian'],
    'aérien': ['lydian'],
    'lumineux': ['lydian', 'ionian'],
    'rêveur': ['lydian'],
    'dreamy': ['lydian'],
    'bluesy': ['mixolydian'],
    'rock': ['mixolydian', 'dorian'],
    'energique': ['mixolydian'],
    'mélancolique': ['aeolian'],
    'triste': ['aeolian'],
    'dissonant': ['locrian'],
    'tense': ['locrian'],
  };

  const feelingLower = feeling.toLowerCase();
  return mappings[feelingLower] || [];
}

// ============================================================================
// COLOR SYSTEM - Emotional colors for scale degrees
// ============================================================================

export interface DegreeColorInfo {
  primary: string;      // Main color for the degree
  secondary: string;    // Alternative shade (lighter/darker)
  emotion: string;      // Emotional feeling
  modeAssociation?: ModeName; // Associated mode
}

/**
 * Color palettes for major tonality - based on modal emotions
 */
const MAJOR_DEGREE_COLORS: Record<number, DegreeColorInfo> = {
  0: { // I - Tonic, resolution
    primary: '#60A5FA',    // Blue-400 - Calm, resolved
    secondary: '#93C5FD',
    emotion: 'Resolution, Home',
    modeAssociation: 'ionian',
  },
  1: { // ii - Pre-dominant, movement
    primary: '#A78BFA',    // Purple-400 - Sophisticated, jazzy
    secondary: '#C4B5FD',
    emotion: 'Movement, Preparation',
    modeAssociation: 'dorian',
  },
  2: { // iii - Relative minor, nostalgia
    primary: '#F87171',    // Red-400 - Passionate, tense
    secondary: '#FCA5A5',
    emotion: 'Nostalgia, Longing',
    modeAssociation: 'phrygian',
  },
  3: { // IV - Subdominant, departure
    primary: '#38BDF8',    // Sky-400 - Airy, dreamy
    secondary: '#7DD3FC',
    emotion: 'Adventure, Departure',
    modeAssociation: 'lydian',
  },
  4: { // V - Dominant, tension
    primary: '#FBBF24',    // Amber-400 - Energetic, dominant
    secondary: '#FCD34D',
    emotion: 'Tension, Expectation',
    modeAssociation: 'mixolydian',
  },
  5: { // vi - Relative minor, sadness
    primary: '#94A3B8',    // Slate-400 - Melancholic, neutral
    secondary: '#CBD5E1',
    emotion: 'Sadness, Resignation',
    modeAssociation: 'aeolian',
  },
  6: { // vii° - Leading tone, maximum tension
    primary: '#64748B',    // Slate-500 - Dark, tense
    secondary: '#94A3B8',
    emotion: 'Dramatic Tension, Suspense',
    modeAssociation: 'locrian',
  },
};

/**
 * Color palettes for minor tonality - different emotional landscape
 */
const MINOR_DEGREE_COLORS: Record<number, DegreeColorInfo> = {
  0: { // i - Minor tonic
    primary: '#64748B',    // Slate-500 - Melancholic home
    secondary: '#94A3B8',
    emotion: 'Melancholy, Resignation',
    modeAssociation: 'aeolian',
  },
  1: { // ii° - Diminished supertonic
    primary: '#475569',    // Slate-600 - Dark tension
    secondary: '#64748B',
    emotion: 'Dark Tension',
    modeAssociation: 'locrian',
  },
  2: { // III - Relative major, hope
    primary: '#60A5FA',    // Blue-400 - Ray of hope
    secondary: '#93C5FD',
    emotion: 'Hope, Light',
    modeAssociation: 'ionian',
  },
  3: { // iv - Minor subdominant
    primary: '#A78BFA',    // Purple-400 - Soulful
    secondary: '#C4B5FD',
    emotion: 'Soulful, Comfort',
    modeAssociation: 'dorian',
  },
  4: { // v - Minor dominant
    primary: '#F87171',    // Red-400 - Dark tension
    secondary: '#FCA5A5',
    emotion: 'Dark Tension',
    modeAssociation: 'phrygian',
  },
  5: { // VI - Major submediant
    primary: '#38BDF8',    // Sky-400 - Bright hope
    secondary: '#7DD3FC',
    emotion: 'Brightness, Relief',
    modeAssociation: 'lydian',
  },
  6: { // VII - Major leading tone
    primary: '#FBBF24',    // Amber-400 - Escape
    secondary: '#FCD34D',
    emotion: 'Escape, Urgency',
    modeAssociation: 'mixolydian',
  },
};

/**
 * Get color information for a scale degree (0-6)
 * @param degree - Scale degree index (0 = I/i, 1 = ii/ii°, etc.)
 * @param tonality - 'major' or 'minor'
 * @returns Color information for the degree
 */
export function getDegreeColor(degree: number, tonality: 'major' | 'minor'): DegreeColorInfo {
  const colors = tonality === 'major' ? MAJOR_DEGREE_COLORS : MINOR_DEGREE_COLORS;
  return colors[degree] ?? MAJOR_DEGREE_COLORS[0]!;
}

/**
 * Get the primary color for a scale degree
 * @param degree - Scale degree index (0 = I/i, 1 = ii/ii°, etc.)
 * @param tonality - 'major' or 'minor'
 * @returns Primary hex color
 */
export function getDegreePrimaryColor(degree: number, tonality: 'major' | 'minor'): string {
  return getDegreeColor(degree, tonality).primary;
}

/**
 * Get the secondary color for a scale degree
 * @param degree - Scale degree index (0 = I/i, 1 = ii/ii°, etc.)
 * @param tonality - 'major' or 'minor'
 * @returns Secondary hex color
 */
export function getDegreeSecondaryColor(degree: number, tonality: 'major' | 'minor'): string {
  return getDegreeColor(degree, tonality).secondary;
}

/**
 * Get the emotion for a scale degree
 * @param degree - Scale degree index (0 = I/i, 1 = ii/ii°, etc.)
 * @param tonality - 'major' or 'minor'
 * @returns Emotional description
 */
export function getDegreeEmotion(degree: number, tonality: 'major' | 'minor'): string {
  return getDegreeColor(degree, tonality).emotion;
}

/**
 * Get the associated mode for a scale degree
 * @param degree - Scale degree index (0 = I/i, 1 = ii/ii°, etc.)
 * @param tonality - 'major' or 'minor'
 * @returns Associated mode name
 */
export function getDegreeMode(degree: number, tonality: 'major' | 'minor'): ModeName {
  return getDegreeColor(degree, tonality).modeAssociation ?? 'ionian';
}

/**
 * Get chord quality visual style
 * @param chordSymbol - Chord symbol (e.g., 'C', 'Cm', 'Cdim')
 * @returns Visual style info for the chord
 */
export interface ChordVisualStyle {
  quality: 'major' | 'minor' | 'diminished';
  borderColor: string;
  icon?: string;
  bgPattern?: string;
}

export function getChordVisualStyle(chordSymbol: string): ChordVisualStyle {
  if (chordSymbol.endsWith('dim') || chordSymbol.endsWith('°')) {
    return {
      quality: 'diminished',
      borderColor: '#64748B', // Slate
      icon: '°',
      bgPattern: 'striped',
    };
  }
  if (chordSymbol.endsWith('m')) {
    return {
      quality: 'minor',
      borderColor: '#A78BFA', // Purple tint
      icon: 'm',
      bgPattern: 'solid',
    };
  }
  return {
    quality: 'major',
    borderColor: '#60A5FA', // Blue tint
    icon: 'M',
    bgPattern: 'solid',
  };
}

/**
 * Get all degree colors for a tonality
 * @param tonality - 'major' or 'minor'
 * @returns Array of all 7 degree colors
 */
export function getAllDegreeColors(tonality: 'major' | 'minor'): DegreeColorInfo[] {
  const colors = tonality === 'major' ? MAJOR_DEGREE_COLORS : MINOR_DEGREE_COLORS;
  return Array.from({ length: 7 }, (_, i) => colors[i] ?? MAJOR_DEGREE_COLORS[0]!);
}

// ============================================================================
// MODE COLORS - Emotional colors for musical modes
// ============================================================================

/**
 * Mode color mapping based on emotional character
 *
 * - Ionien (joyeux, lumineux) → gold/yellow
 * - Éolien (mélancolique, triste) → cool blue/grey
 * - Dorien (chaud, jazzy) → warm amber
 * - Lydien (rêveur, féerique) → ethereal lavender
 * - Mixolydien (bluesy, rock) → dynamic orange
 * - Phrygien (espagnol, exotique) → intense red
 * - Locrien (tension, dissonant) → dark tense colors
 */
export const MODE_COLORS: Record<ModeName, string> = {
  ionian: '#F59E0B',      // Gold - Joyeux, Lumineux
  dorian: '#F59E0B',      // Amber - Chaud, Soulful
  phrygian: '#DC2626',    // Crimson - Espagnol, Exotique
  lydian: '#A78BFA',      // Lavender - Rêveur, Féerique
  mixolydian: '#F97316',  // Orange - Bluesy, Rock
  aeolian: '#60A5FA',     // Steel Blue - Mélancolique, Triste
  locrian: '#334155',     // Dark Slate - Dissonant, Instable
} as const;

/**
 * Get color for a mode based on its emotional character
 * @param mode - The mode name (ionian, dorian, etc.)
 * @returns Hex color string optimized for dark backgrounds
 *
 * @example
 * ```ts
 * getModeColor('ionian')    // '#F59E0B' (gold)
 * getModeColor('aeolian')   // '#60A5FA' (steel blue)
 * getModeColor('lydian')    // '#A78BFA' (lavender)
 * ```
 */
export function getModeColor(mode: ModeName): string {
  return MODE_COLORS[mode];
}

/**
 * Get all mode colors as an array
 * @returns Array of hex colors in order of mode brightness (light to dark)
 */
export function getAllModeColors(): readonly string[] {
  return [
    MODE_COLORS.lydian,     // Lightest (dreamy)
    MODE_COLORS.ionian,     // Bright (joyful)
    MODE_COLORS.mixolydian, // Warm (energetic)
    MODE_COLORS.dorian,     // Warm amber
    MODE_COLORS.phrygian,   // Intense
    MODE_COLORS.aeolian,    // Cool (sad)
    MODE_COLORS.locrian,    // Darkest (tense)
  ];
}

/**
 * Chord quality colors
 * - Major: Warm, positive (gold/amber)
 * - Minor: Cool, melancholic (blue)
 * - Diminished: Dark, tense (dark grey)
 */
export const CHORD_QUALITY_COLORS: Readonly<Record<'major' | 'minor' | 'diminished', string>> = {
  major: '#F59E0B',         // Bright, positive
  minor: '#3B82F6',         // Melancholic
  diminished: '#334155',    // Tense, unstable
} as const;

/**
 * Get color for a chord quality
 * @param quality - The chord quality (major, minor, diminished)
 * @returns Hex color string
 *
 * @example
 * ```ts
 * getChordQualityColor('major')       // '#F59E0B'
 * getChordQualityColor('minor')       // '#3B82F6'
 * getChordQualityColor('diminished')  // '#334155'
 * ```
 */
export function getChordQualityColor(quality: 'major' | 'minor' | 'diminished'): string {
  return CHORD_QUALITY_COLORS[quality];
}

/**
 * Get all degree colors as simple hex strings for a tonality
 * @param tonality - 'major' or 'minor'
 * @returns Array of 7 hex colors for degrees I-i through VII-vii
 *
 * @example
 * ```ts
 * getDegreeHexColors('major')  // ['#60A5FA', '#A78BFA', '#F87171', ...]
 * getDegreeHexColors('minor')  // ['#64748B', '#475569', '#60A5FA', ...]
 * ```
 */
export function getDegreeHexColors(tonality: 'major' | 'minor'): string[] {
  return getAllDegreeColors(tonality).map((info) => info.primary);
}

/**
 * Get a contrasting text color for a given background color
 * Returns black or white depending on background luminance
 * @param hexColor - The background color in hex format
 * @returns '#000000' or '#FFFFFF' for contrast
 *
 * @example
 * ```ts
 * getContrastTextColor('#F59E0B')  // '#000000' (dark text on light gold)
 * getContrastTextColor('#334155')  // '#FFFFFF' (light text on dark slate)
 * ```
 */
export function getContrastTextColor(hexColor: string): '#000000' | '#FFFFFF' {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate luminance (perceptual brightness)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

/**
 * Create a color with opacity for overlays and backgrounds
 * @param hexColor - The base color in hex format
 * @param opacity - Opacity value from 0 to 1
 * @returns RGBA color string
 *
 * @example
 * ```ts
 * colorWithOpacity('#F59E0B', 0.1)  // 'rgba(245, 158, 11, 0.1)'
 * ```
 */
export function colorWithOpacity(hexColor: string, opacity: number): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const clampedOpacity = Math.max(0, Math.min(1, opacity));
  return `rgba(${r}, ${g}, ${b}, ${clampedOpacity})`;
}
