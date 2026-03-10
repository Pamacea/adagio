// ============================================================================
// METAL THEME - Design Metal/Brutal pour ADAGIO
// ============================================================================
//
// Style inspiré de Metallica / Steve Vai
// - Noir dominant (#000000)
// - Vert-noir extrême (#0a0f0a)
// - Bordures fines angulaires
// - Police Archivo Black (titres), Space Mono (texte)
// ============================================================================

export const Colors = {
  // Primary colors
  black: '#000000',
  darkGreen: '#0a0f0a',
  green: '#0d1a0d',
  lightGreen: '#1a2f1a',

  // Accents
  acidGreen: '#00ff00',
  darkAcid: '#00cc00',
  rust: '#8b4513',
  steel: '#4a5568',
  silver: '#a0aec0',
  white: '#ffffff',

  // Semantic
  danger: '#ff0000',
  warning: '#ff6600',
  success: '#00ff00',
  info: '#00ccff',

  // Grayscale
  gray900: '#0a0a0a',
  gray800: '#1a1a1a',
  gray700: '#2a2a2a',
  gray600: '#3a3a3a',
  gray500: '#6a6a6a',
  gray400: '#9a9a9a',
  gray300: '#bababa',
  gray200: '#dadada',
  gray100: '#eeeeee',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
  full: 9999,
};

export const Typography = {
  // Title font - Archivo Black (condensed, bold)
  titleXXL: 36,
  titleXL: 30,
  titleLG: 24,
  titleMD: 20,
  titleSM: 16,

  // Body font - Space Mono (monospace)
  bodyLG: 18,
  bodyMD: 16,
  bodySM: 14,
  bodyXS: 12,

  // Labels
  labelLG: 14,
  labelMD: 12,
  labelSM: 10,
};

export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  black: '900' as const,
};

export const Shadows = {
  sm: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
};

// French note names
export const FrenchNotes = {
  'C': 'Do',
  'C#': 'Do#',
  'Db': 'Réb',
  'D': 'Ré',
  'D#': 'Ré#',
  'Eb': 'Mib',
  'E': 'Mi',
  'F': 'Fa',
  'F#': 'Fa#',
  'Gb': 'Solb',
  'G': 'Sol',
  'G#': 'Sol#',
  'Ab': 'Lab',
  'A': 'La',
  'A#': 'La#',
  'Bb': 'Sib',
  'B': 'Si',
} as const;

export type NoteName = keyof typeof FrenchNotes;

export function toFrenchNote(note: string): string {
  return FrenchNotes[note as NoteName] || note;
}

// French intervals
export const FrenchIntervals = {
  '1': '1',
  'b2': 'b2',
  '2': '2',
  'b3': 'b3',
  '3': '3',
  '4': '4',
  '#4': '#4',
  'b5': 'b5',
  '5': '5',
  '#5': '#5',
  'b6': 'b6',
  '6': '6',
  'bb7': 'bb7',
  'b7': 'b7',
  '7': '7',
  'b9': 'b9',
  '9': '9',
  '#9': '#9',
  '11': '11',
  '#11': '#11',
  'b13': 'b13',
  '13': '13',
} as const;

// Mode names in French
export const FrenchModes = {
  'ionian': 'Ionien',
  'dorian': 'Dorien',
  'phrygian': 'Phrygien',
  'lydian': 'Lydien',
  'mixolydian': 'Mixolydien',
  'aeolian': 'Éolien',
  'locrian': 'Locrien',
} as const;

export function toFrenchMode(mode: string): string {
  return FrenchModes[mode as keyof typeof FrenchModes] || mode;
}

// Chord qualities in French
export const FrenchChordQualities = {
  '': 'Majeur',
  'm': 'mineur',
  '7': '7',
  'm7': 'm7',
  'maj7': 'maj7',
  'dim': 'dim',
  'dim7': 'dim7',
  'm7b5': 'm7b5',
  'aug': 'aug',
  'aug7': 'aug7',
  'sus2': 'sus2',
  'sus4': 'sus4',
  '7sus4': '7sus4',
  'add9': 'add9',
  'madd9': 'madd9',
  '6': '6',
  'm6': 'm6',
  '9': '9',
  'm9': 'm9',
  '11': '11',
  'm11': 'm11',
  '13': '13',
  'm13': 'm13',
} as const;
