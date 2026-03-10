// ============================================================================
// SEED DATA - Accords
// ============================================================================

// Fingerings pour accord de C (adapter pour chaque racine)
const basicFingerings = {
  'C': [
    { fret: 0, string: 3 }, // C
    { fret: 2, string: 4 }, // E
    { fret: 0, string: 2 }, // C
  ],
  'D': [
    { fret: 0, string: 4 },
    { fret: 2, string: 5 },
    { fret: 0, string: 3 },
  ],
  'E': [
    { fret: 0, string: 5 },
    { fret: 2, string: 4 },
    { fret: 0, string: 3 },
  ],
  'F': [
    { fret: 0, string: 6 },
    { fret: 2, string: 5 },
    { fret: 0, string: 4 },
  ],
  'G': [
    { fret: 0, string: 6 },
    { fret: 2, string: 5 },
    { fret: 0, string: 1 },
  ],
  'A': [
    { fret: 0, string: 5 },
    { fret: 2, string: 4 },
    { fret: 0, string: 3 },
  ],
  'B': [
    { fret: 0, string: 5 },
    { fret: 4, string: 4 },
    { fret: 0, string: 3 },
  ],
};

export const CHORDS_SEED = [
  // === ACCORDS OUVERTS ===
  {
    name: 'C',
    root: 'C',
    quality: '',
    intervals: JSON.stringify([0, 4, 7]),
    extensions: JSON.stringify([]),
    tension: 'stable',
    fingerings: JSON.stringify(basicFingerings['C']),
  },
  {
    name: 'D',
    root: 'D',
    quality: '',
    intervals: JSON.stringify([0, 4, 7]),
    extensions: JSON.stringify([]),
    tension: 'stable',
    fingerings: JSON.stringify(basicFingerings['D']),
  },
  {
    name: 'E',
    root: 'E',
    quality: '',
    intervals: JSON.stringify([0, 4, 7]),
    extensions: JSON.stringify([]),
    tension: 'stable',
    fingerings: JSON.stringify(basicFingerings['E']),
  },
  {
    name: 'F',
    root: 'F',
    quality: '',
    intervals: JSON.stringify([0, 4, 7]),
    extensions: JSON.stringify([]),
    tension: 'stable',
    fingerings: JSON.stringify(basicFingerings['F']),
  },
  {
    name: 'G',
    root: 'G',
    quality: '',
    intervals: JSON.stringify([0, 4, 7]),
    extensions: JSON.stringify([]),
    tension: 'stable',
    fingerings: JSON.stringify(basicFingerings['G']),
  },
  {
    name: 'A',
    root: 'A',
    quality: '',
    intervals: JSON.stringify([0, 4, 7]),
    extensions: JSON.stringify([]),
    tension: 'stable',
    fingerings: JSON.stringify(basicFingerings['A']),
  },
  {
    name: 'Am',
    root: 'C',
    quality: 'm',
    intervals: JSON.stringify([0, 3, 7]),
    extensions: JSON.stringify([]),
    tension: 'stable',
    fingerings: JSON.stringify([
      { fret: 0, string: 3 },
      { fret: 1, string: 4 },
      { fret: 0, string: 2 },
    ]),
  },
  {
    name: 'Dm',
    root: 'D',
    quality: 'm',
    intervals: JSON.stringify([0, 3, 7]),
    extensions: JSON.stringify([]),
    tension: 'stable',
    fingerings: JSON.stringify([
      { fret: 0, string: 4 },
      { fret: 1, string: 5 },
      { fret: 0, string: 3 },
    ]),
  },
  {
    name: 'Em',
    root: 'E',
    quality: 'm',
    intervals: JSON.stringify([0, 3, 7]),
    extensions: JSON.stringify([]),
    tension: 'stable',
    fingerings: JSON.stringify([
      { fret: 0, string: 5 },
      { fret: 0, string: 4 },
      { fret: 0, string: 3 },
    ]),
  },

  // === SEPTIÈMES ===
  {
    name: 'Cmaj7',
    root: 'C',
    quality: 'maj7',
    intervals: JSON.stringify([0, 4, 7, 11]),
    extensions: JSON.stringify([]),
    tension: 'stable',
    fingerings: JSON.stringify([
      { fret: 0, string: 3 },
      { fret: 2, string: 5 },
      { fret: 0, string: 2 },
      { fret: 0, string: 1 },
    ]),
  },
  {
    name: 'C7',
    root: 'C',
    quality: '7',
    intervals: JSON.stringify([0, 4, 7, 10]),
    extensions: JSON.stringify([]),
    tension: 'dominant',
    fingerings: JSON.stringify([
      { fret: 0, string: 3 },
      { fret: 2, string: 4 },
      { fret: 2, string: 2 },
      { fret: 1, string: 1 },
    ]),
  },
  {
    name: 'Cm7',
    root: 'C',
    quality: 'm7',
    intervals: JSON.stringify([0, 3, 7, 10]),
    extensions: JSON.stringify([]),
    tension: 'stable',
    fingerings: JSON.stringify([
      { fret: 0, string: 3 },
      { fret: 1, string: 4 },
      { fret: 0, string: 2 },
      { fret: 1, string: 1 },
    ]),
  },
  {
    name: 'Cm7b5',
    root: 'C',
    quality: 'm7b5',
    intervals: JSON.stringify([0, 3, 6, 10]),
    extensions: JSON.stringify([]),
    tension: 'tense',
    fingerings: JSON.stringify([]),
  },

  // === JAZZ CHORDS ===
  {
    name: 'Cmaj7#5',
    root: 'C',
    quality: 'maj7',
    intervals: JSON.stringify([0, 4, 8, 11]),
    extensions: JSON.stringify(['#5']),
    tension: 'tense',
    fingerings: JSON.stringify([]),
  },
  {
    name: 'Cmaj7#11',
    root: 'C',
    quality: 'maj7',
    intervals: JSON.stringify([0, 4, 7, 11, 15]),
    extensions: JSON.stringify(['#11']),
    tension: 'dreamy',
    fingerings: JSON.stringify([]),
  },
  {
    name: 'C9',
    root: 'C',
    quality: '7',
    intervals: JSON.stringify([0, 4, 7, 10, 14]),
    extensions: JSON.stringify(['9']),
    tension: 'dominant',
    fingerings: JSON.stringify([]),
  },
  {
    name: 'C13',
    root: 'C',
    quality: '7',
    intervals: JSON.stringify([0, 4, 7, 10, 14, 21]),
    extensions: JSON.stringify(['9', '13']),
    tension: 'dominant',
    fingerings: JSON.stringify([]),
  },
  {
    name: 'C11',
    root: 'C',
    quality: '7',
    intervals: JSON.stringify([0, 4, 7, 10, 17]),
    extensions: JSON.stringify(['9', '11']),
    tension: 'dominant',
    fingerings: JSON.stringify([]),
  },
  {
    name: 'Cdim',
    root: 'C',
    quality: 'dim',
    intervals: JSON.stringify([0, 3, 6]),
    extensions: JSON.stringify([]),
    tension: 'dissonant',
    fingerings: JSON.stringify([
      { fret: 0, string: 4 },
      { fret: 0, string: 3 },
      { fret: 0, string: 2 },
    ]),
  },
  {
    name: 'Cdim7',
    root: 'C',
    quality: 'dim7',
    intervals: JSON.stringify([0, 3, 6, 9]),
    extensions: JSON.stringify([]),
    tension: 'dissonant',
    fingerings: JSON.stringify([]),
  },

  // === SUS CHORDS ===
  {
    name: 'Csus2',
    root: 'C',
    quality: 'sus2',
    intervals: JSON.stringify([0, 2, 7]),
    extensions: JSON.stringify([]),
    tension: 'suspended',
    fingerings: JSON.stringify([
      { fret: 0, string: 3 },
      { fret: 1, string: 4 },
      { fret: 0, string: 2 },
    ]),
  },
  {
    name: 'Csus4',
    root: 'C',
    quality: 'sus4',
    intervals: JSON.stringify([0, 5, 7]),
    extensions: JSON.stringify([]),
    tension: 'suspended',
    fingerings: JSON.stringify([
      { fret: 0, string: 3 },
      { fret: 1, string: 2 },
      { fret: 0, string: 1 },
    ]),
  },

  // === AUGMENTED ===
  {
    name: 'Caug',
    root: 'C',
    quality: 'aug',
    intervals: JSON.stringify([0, 4, 8]),
    extensions: JSON.stringify([]),
    tension: 'tense',
    fingerings: JSON.stringify([
      { fret: 0, string: 3 },
      { fret: 1, string: 4 },
      { fret: 0, string: 2 },
    ]),
  },
  {
    name: 'Caug7',
    root: 'C',
    quality: 'aug7',
    intervals: JSON.stringify([0, 4, 8, 10]),
    extensions: JSON.stringify([]),
    tension: 'tense',
    fingerings: JSON.stringify([]),
  },

  // === POWER CHORDS ===
  {
    name: 'C5',
    root: 'C',
    quality: '5',
    intervals: JSON.stringify([0, 7]),
    extensions: JSON.stringify([]),
    tension: 'neutral',
    fingerings: JSON.stringify([
      { fret: 0, string: 5 },
      { fret: 0, string: 4 },
    ]),
  },

  // === ADD9 ===
  {
    name: 'Cadd9',
    root: 'C',
    quality: 'add9',
    intervals: JSON.stringify([0, 4, 7, 14]),
    extensions: JSON.stringify([]),
    tension: 'stable',
    fingerings: JSON.stringify([
      { fret: 0, string: 3 },
      { fret: 2, string: 5 },
      { fret: 0, string: 2 },
      { fret: 0, string: 1 },
    ]),
  },
];
