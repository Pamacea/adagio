// ============================================================================
// SEED DATA - Gammes
// ============================================================================

export const SCALES_SEED = [
  // === GAMMES MAJEURES ===
  {
    slug: 'major',
    name: 'Gamme Majeure',
    root: 'C',
    intervals: JSON.stringify([0, 2, 4, 5, 7, 9, 11]),
    type: 'scale',
    quality: 'major',
  },
  {
    slug: 'major-pentatonic',
    name: 'Pentatonique Majeure',
    root: 'C',
    intervals: JSON.stringify([0, 2, 4, 7, 9]),
    type: 'scale',
    quality: 'pentatonic',
  },

  // === GAMMES MINEURES ===
  {
    slug: 'minor',
    name: 'Gamme Mineure Naturelle',
    root: 'C',
    intervals: JSON.stringify([0, 2, 3, 5, 7, 8, 10]),
    type: 'scale',
    quality: 'minor',
  },
  {
    slug: 'minor-pentatonic',
    name: 'Pentatonique Mineure',
    root: 'C',
    intervals: JSON.stringify([0, 3, 5, 7, 10]),
    type: 'scale',
    quality: 'pentatonic',
  },
  {
    slug: 'harmonic-minor',
    name: 'Mineure Harmonique',
    root: 'C',
    intervals: JSON.stringify([0, 2, 3, 5, 7, 8, 11]),
    type: 'scale',
    quality: 'minor',
  },
  {
    slug: 'melodic-minor',
    name: 'Mineure Mélodique',
    root: 'C',
    intervals: JSON.stringify([0, 2, 3, 5, 7, 9, 11]),
    type: 'scale',
    quality: 'minor',
  },

  // === GAMMES MODALES ===
  {
    slug: 'dorian',
    name: 'Dorien',
    root: 'C',
    intervals: JSON.stringify([0, 2, 3, 5, 7, 9, 10]),
    type: 'mode',
    quality: 'minor',
  },
  {
    slug: 'phrygian',
    name: 'Phrygien',
    root: 'C',
    intervals: JSON.stringify([0, 1, 3, 5, 7, 8, 10]),
    type: 'mode',
    quality: 'minor',
  },
  {
    slug: 'lydian',
    name: 'Lydien',
    root: 'C',
    intervals: JSON.stringify([0, 2, 4, 6, 7, 9, 11]),
    type: 'mode',
    quality: 'major',
  },
  {
    slug: 'mixolydian',
    name: 'Mixolydien',
    root: 'C',
    intervals: JSON.stringify([0, 2, 4, 5, 7, 9, 10]),
    type: 'mode',
    quality: 'major',
  },

  // === GAMMES BLUES ===
  {
    slug: 'blues',
    name: 'Blues',
    root: 'C',
    intervals: JSON.stringify([0, 3, 5, 6, 7, 10]),
    type: 'scale',
    quality: 'blues',
  },
  {
    slug: 'blues-pentatonic',
    name: 'Blues Pentatonique',
    root: 'C',
    intervals: JSON.stringify([0, 3, 5, 6, 7, 10]),
    type: 'scale',
    quality: 'pentatonic',
  },

  // === GAMMES JAZZ ===
  {
    slug: 'jazz-melodic-minor',
    name: 'Jazz Mineur Mélodique',
    root: 'C',
    intervals: JSON.stringify([0, 2, 3, 5, 7, 9, 11]),
    type: 'scale',
    quality: 'minor',
  },
  {
    slug: 'lydian-dominant',
    name: 'Lydien Dominant',
    root: 'C',
    intervals: JSON.stringify([0, 2, 4, 6, 7, 9, 10]),
    type: 'mode',
    quality: 'dominant',
  },
  {
    slug: 'locrian',
    name: 'Locrien',
    root: 'C',
    intervals: JSON.stringify([0, 1, 3, 5, 6, 8, 10]),
    type: 'mode',
    quality: 'diminished',
  },

  // === GAMMES EXOTIQUES ===
  {
    slug: 'double-harmonic',
    name: 'Double Harmonique',
    root: 'C',
    intervals: JSON.stringify([0, 1, 4, 5, 7, 8, 11]),
    type: 'scale',
    quality: 'exotic',
  },
  {
    slug: 'phrygian-dominant',
    name: 'Phrygien Dominant',
    root: 'C',
    intervals: JSON.stringify([0, 1, 4, 5, 7, 8, 10]),
    type: 'mode',
    quality: 'dominant',
  },
  {
    slug: 'enigmatic',
    name: 'Enigmatique',
    root: 'C',
    intervals: JSON.stringify([0, 1, 4, 5, 7, 9, 11]),
    type: 'scale',
    quality: 'exotic',
  },

  // === GAMMES PENTATONIQUES ===
  {
    slug: 'japanese-pentatonic',
    name: 'Pentatonique Japonaise',
    root: 'C',
    intervals: JSON.stringify([0, 2, 4, 7, 9]),
    type: 'scale',
    quality: 'pentatonic',
  },
  {
    slug: 'egyptian-pentatonic',
    name: 'Pentatonique Égyptienne',
    root: 'C',
    intervals: JSON.stringify([0, 2, 5, 7, 10]),
    type: 'scale',
    quality: 'pentatonic',
  },

  // === GAMMES DIMINUÉES ===
  {
    slug: 'whole-half-diminished',
    name: 'Diminué Ton/Demi-ton',
    root: 'C',
    intervals: JSON.stringify([0, 2, 3, 5, 6, 8, 9, 11]),
    type: 'scale',
    quality: 'diminished',
  },
  {
    slug: 'half-whole-diminished',
    name: 'Demi-ton/Ton Diminuée',
    root: 'C',
    intervals: JSON.stringify([0, 1, 3, 4, 6, 7, 9, 10]),
    type: 'scale',
    quality: 'diminished',
  },

  // === GAMMES ALTÉRÉES ===
  {
    slug: 'chromatic',
    name: 'Chromatique',
    root: 'C',
    intervals: JSON.stringify([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    type: 'scale',
    quality: 'chromatic',
  },
  {
    slug: 'octatonic',
    name: 'Octatonique',
    root: 'C',
    intervals: JSON.stringify([0, 2, 3, 5, 6, 8, 9, 11]),
    type: 'scale',
    quality: 'diminished',
  },
];
