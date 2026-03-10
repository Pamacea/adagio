// ============================================================================
// CHORD MAPPING - Chords by degree with emotional associations
// ============================================================================

import type { NoteName, Interval, ChordDegree, ChordFunction } from '@adagio/types';

/**
 * Chord entry with all its properties
 */
export interface ChordEntry {
  name: string;           // Full chord name (e.g., "Cmaj7")
  symbol: string;         // Short symbol (e.g., "Δ7", "m7")
  intervals: Interval[];  // Intervals from root
  emotion: string;        // Emotional feeling
  stability: 'stable' | 'tense' | 'dissonant';
  function: ChordFunction;
}

/**
 * Chords available for each scale degree in major key
 */
const MAJOR_DEGREE_CHORDS: Record<string, ChordEntry[]> = {
  // I - TONIC (Stability, Home)
  'I': [
    { name: 'I', symbol: '', intervals: ['1', '3', '5'], emotion: 'Stable, Résolu', stability: 'stable', function: 'tonic' },
    { name: 'I6', symbol: '6', intervals: ['1', '3', '5', '6'], emotion: 'Chaleureux, Ouvert', stability: 'stable', function: 'tonic' },
    { name: 'Imaj7', symbol: 'Δ7', intervals: ['1', '3', '5', '7'], emotion: 'Lumineux, Jazz', stability: 'stable', function: 'tonic' },
    { name: 'Imaj9', symbol: 'Δ9', intervals: ['1', '3', '5', '7', '9'], emotion: 'Rêveur, Sophistiqué', stability: 'stable', function: 'tonic' },
    { name: 'Imaj13', symbol: 'Δ13', intervals: ['1', '3', '5', '7', '9', '11', '13'], emotion: 'Riche, Coloré', stability: 'stable', function: 'tonic' },
    { name: 'Iadd9', symbol: 'add9', intervals: ['1', '3', '5', '9'], emotion: 'Doux, Ambient', stability: 'stable', function: 'tonic' },
  ],
  // ii - PRE-DOMINANT (Movement, Preparation)
  'ii': [
    { name: 'iim', symbol: 'm', intervals: ['1', 'b3', '5'], emotion: 'Doux, Mélancolique', stability: 'stable', function: 'subdominant' },
    { name: 'iim7', symbol: 'm7', intervals: ['1', 'b3', '5', 'b7'], emotion: 'Jazzy, Soulful', stability: 'stable', function: 'subdominant' },
    { name: 'iim9', symbol: 'm9', intervals: ['1', 'b3', '5', 'b7', '9'], emotion: 'Chaud, R&B', stability: 'stable', function: 'subdominant' },
    { name: 'iim11', symbol: 'm11', intervals: ['1', 'b3', '5', 'b7', '9', '11'], emotion: 'Mystérieux, Modal', stability: 'stable', function: 'subdominant' },
    { name: 'iim6', symbol: 'm6', intervals: ['1', 'b3', '5', '6'], emotion: 'Nostalgique', stability: 'stable', function: 'subdominant' },
  ],
  // iii - TONIC (Relative minor)
  'iii': [
    { name: 'iiim', symbol: 'm', intervals: ['1', 'b3', '5'], emotion: 'Nostalgie, Désir', stability: 'stable', function: 'tonic' },
    { name: 'iiim7', symbol: 'm7', intervals: ['1', 'b3', '5', 'b7'], emotion: 'Tendre, Intime', stability: 'stable', function: 'tonic' },
    { name: 'iiim9', symbol: 'm9', intervals: ['1', 'b3', '5', 'b7', '9'], emotion: 'Romantique', stability: 'stable', function: 'tonic' },
    { name: 'iiimadd9', symbol: 'madd9', intervals: ['1', 'b3', '5', '9'], emotion: 'Espoir, Douceur', stability: 'stable', function: 'tonic' },
  ],
  // IV - PRE-DOMINANT (Departure)
  'IV': [
    { name: 'IV', symbol: '', intervals: ['1', '3', '5'], emotion: 'Aventure, Départ', stability: 'stable', function: 'subdominant' },
    { name: 'IVmaj7', symbol: 'Δ7', intervals: ['1', '3', '5', '7'], emotion: 'Lumineux, Ouvert', stability: 'stable', function: 'subdominant' },
    { name: 'IVmaj9', symbol: 'Δ9', intervals: ['1', '3', '5', '7', '9'], emotion: 'Éthéré, Dreamy', stability: 'stable', function: 'subdominant' },
    { name: 'IVadd9', symbol: 'add9', intervals: ['1', '3', '5', '9'], emotion: 'Espoir, Renaissance', stability: 'stable', function: 'subdominant' },
    { name: 'IV6', symbol: '6', intervals: ['1', '3', '5', '6'], emotion: 'Chaleureux', stability: 'stable', function: 'subdominant' },
  ],
  // V - DOMINANT (Tension)
  'V': [
    { name: 'V', symbol: '', intervals: ['1', '3', '5'], emotion: 'Puissant, Énergique', stability: 'tense', function: 'dominant' },
    { name: 'V7', symbol: '7', intervals: ['1', '3', '5', 'b7'], emotion: 'Tension, Blues', stability: 'tense', function: 'dominant' },
    { name: 'V9', symbol: '9', intervals: ['1', '3', '5', 'b7', '9'], emotion: 'Jazzy, Funky', stability: 'tense', function: 'dominant' },
    { name: 'V11', symbol: '11', intervals: ['1', '3', '5', 'b7', '9', '11'], emotion: 'Complexe, Moderne', stability: 'tense', function: 'dominant' },
    { name: 'V13', symbol: '13', intervals: ['1', '3', '5', 'b7', '9', '11', '13'], emotion: 'Riche, Coloré', stability: 'tense', function: 'dominant' },
    { name: 'V7alt', symbol: '7alt', intervals: ['1', '3', 'b5', 'b7', 'b9'], emotion: 'Dissonant, Tension max', stability: 'dissonant', function: 'dominant' },
    { name: 'V7b9', symbol: '7b9', intervals: ['1', '3', '5', 'b7', 'b9'], emotion: 'Dark, Tense', stability: 'dissonant', function: 'dominant' },
    { name: 'V7#9', symbol: '7#9', intervals: ['1', '3', '5', 'b7', '#9'], emotion: 'Hendrix, Rock', stability: 'dissonant', function: 'dominant' },
    { name: 'V7#11', symbol: '7#11', intervals: ['1', '3', '5', 'b7', '9', '#11'], emotion: 'Lydien, Mystique', stability: 'tense', function: 'dominant' },
    { name: 'V7sus4', symbol: '7sus4', intervals: ['1', '4', '5', 'b7'], emotion: 'Suspendu, Suspense', stability: 'tense', function: 'dominant' },
  ],
  // vi - TONIC (Relative minor)
  'vi': [
    { name: 'vim', symbol: 'm', intervals: ['1', 'b3', '5'], emotion: 'Tristesse, Résignation', stability: 'stable', function: 'tonic' },
    { name: 'vim7', symbol: 'm7', intervals: ['1', 'b3', '5', 'b7'], emotion: 'Mélancolique, Sad', stability: 'stable', function: 'tonic' },
    { name: 'vim9', symbol: 'm9', intervals: ['1', 'b3', '5', 'b7', '9'], emotion: 'Nostalgique', stability: 'stable', function: 'tonic' },
    { name: 'vim11', symbol: 'm11', intervals: ['1', 'b3', '5', 'b7', '9', '11'], emotion: 'Profond, Émotionnel', stability: 'stable', function: 'tonic' },
    { name: 'vimadd9', symbol: 'madd9', intervals: ['1', 'b3', '5', '9'], emotion: 'Tendre, Doux', stability: 'stable', function: 'tonic' },
    { name: 'vi6', symbol: 'm6', intervals: ['1', 'b3', '5', '6'], emotion: 'Jazzy, Classy', stability: 'stable', function: 'tonic' },
  ],
  // vii° - DOMINANT (Leading tone)
  'vii': [
    { name: 'vii°', symbol: '°', intervals: ['1', 'b3', 'b5'], emotion: 'Tension, Instable', stability: 'dissonant', function: 'dominant' },
    { name: 'vii°7', symbol: '°7', intervals: ['1', 'b3', 'b5', 'bb7'], emotion: 'Dark, Dissonant', stability: 'dissonant', function: 'dominant' },
    { name: 'viim7b5', symbol: 'm7b5', intervals: ['1', 'b3', 'b5', 'b7'], emotion: 'Jazzy, Half-dim', stability: 'tense', function: 'dominant' },
  ],
};

/**
 * Chords available for each scale degree in minor key (natural minor)
 */
const MINOR_DEGREE_CHORDS: Record<string, ChordEntry[]> = {
  // i - TONIC (Minor home)
  'i': [
    { name: 'i', symbol: 'm', intervals: ['1', 'b3', '5'], emotion: 'Mélancolie, Tristesse', stability: 'stable', function: 'tonic' },
    { name: 'im7', symbol: 'm7', intervals: ['1', 'b3', '5', 'b7'], emotion: 'Sombre, Intime', stability: 'stable', function: 'tonic' },
    { name: 'im9', symbol: 'm9', intervals: ['1', 'b3', '5', 'b7', '9'], emotion: 'Profond, Émotionnel', stability: 'stable', function: 'tonic' },
    { name: 'im11', symbol: 'm11', intervals: ['1', 'b3', '5', 'b7', '9', '11'], emotion: 'Dark, Ambient', stability: 'stable', function: 'tonic' },
    { name: 'imadd9', symbol: 'madd9', intervals: ['1', 'b3', '5', '9'], emotion: 'Tendre, Mélancolique', stability: 'stable', function: 'tonic' },
    { name: 'im6', symbol: 'm6', intervals: ['1', 'b3', '5', '6'], emotion: 'Jazzy Mineur', stability: 'stable', function: 'tonic' },
    { name: 'iM7', symbol: 'M7', intervals: ['1', 'b3', '5', '7'], emotion: 'Mélancolie Lumineuse', stability: 'tense', function: 'tonic' },
  ],
  // ii° - DOMINANT (Diminished)
  'ii': [
    { name: 'ii°', symbol: '°', intervals: ['1', 'b3', 'b5'], emotion: 'Tension Dark', stability: 'dissonant', function: 'dominant' },
    { name: 'iim7b5', symbol: 'm7b5', intervals: ['1', 'b3', 'b5', 'b7'], emotion: 'Jazzy, Half-dim', stability: 'tense', function: 'dominant' },
  ],
  // III - TONIC (Relative major)
  'III': [
    { name: 'III', symbol: '', intervals: ['1', '3', '5'], emotion: 'Espoir, Lumière', stability: 'stable', function: 'tonic' },
    { name: 'IIImaj7', symbol: 'Δ7', intervals: ['1', '3', '5', '7'], emotion: 'Lumineux, Joyeux', stability: 'stable', function: 'tonic' },
    { name: 'IIIadd9', symbol: 'add9', intervals: ['1', '3', '5', '9'], emotion: 'Chaleur, Renaissance', stability: 'stable', function: 'tonic' },
  ],
  // iv - PRE-DOMINANT (Minor subdominant)
  'iv': [
    { name: 'iv', symbol: 'm', intervals: ['1', 'b3', '5'], emotion: 'Sombre, Mélancolique', stability: 'stable', function: 'subdominant' },
    { name: 'ivm7', symbol: 'm7', intervals: ['1', 'b3', '5', 'b7'], emotion: 'Dark, Soulful', stability: 'stable', function: 'subdominant' },
    { name: 'ivm9', symbol: 'm9', intervals: ['1', 'b3', '5', 'b7', '9'], emotion: 'Profond, Émotionnel', stability: 'stable', function: 'subdominant' },
    { name: 'ivadd9', symbol: 'madd9', intervals: ['1', 'b3', '5', '9'], emotion: 'Tendre, Triste', stability: 'stable', function: 'subdominant' },
  ],
  // v - DOMINANT (Minor dominant)
  'v': [
    { name: 'v', symbol: 'm', intervals: ['1', 'b3', '5'], emotion: 'Tension Mineure', stability: 'tense', function: 'dominant' },
    { name: 'vm7', symbol: 'm7', intervals: ['1', 'b3', '5', 'b7'], emotion: 'Dark, Blues Mineur', stability: 'tense', function: 'dominant' },
    // V7 (from harmonic minor) - often used
    { name: 'V7', symbol: '7', intervals: ['1', '3', '5', 'b7'], emotion: 'Tension, Résolution', stability: 'tense', function: 'dominant' },
  ],
  // VI - PRE-DOMINANT (Major submediant)
  'VI': [
    { name: 'VI', symbol: '', intervals: ['1', '3', '5'], emotion: 'Lueur d\'espoir', stability: 'stable', function: 'subdominant' },
    { name: 'VImaj7', symbol: 'Δ7', intervals: ['1', '3', '5', '7'], emotion: 'Lumière, Renaissance', stability: 'stable', function: 'subdominant' },
    { name: 'VIadd9', symbol: 'add9', intervals: ['1', '3', '5', '9'], emotion: 'Espoir, Apaisement', stability: 'stable', function: 'subdominant' },
  ],
  // VII - DOMINANT (Leading tone)
  'VII': [
    { name: 'VII', symbol: '', intervals: ['1', '3', '5'], emotion: 'Fuite, Urgence', stability: 'tense', function: 'dominant' },
    { name: 'VII7', symbol: '7', intervals: ['1', '3', '5', 'b7'], emotion: 'Tension vers i', stability: 'tense', function: 'dominant' },
    { name: 'VIImaj7', symbol: 'Δ7', intervals: ['1', '3', '5', '7'], emotion: 'Bright Escape', stability: 'stable', function: 'dominant' },
  ],
};

/**
 * Roman numerals for major key degrees
 */
const MAJOR_ROMAN_DEGREES: readonly string[] = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii'] as const;

/**
 * Roman numerals for minor key degrees
 */
const MINOR_ROMAN_DEGREES: readonly string[] = ['i', 'ii', 'III', 'iv', 'v', 'VI', 'VII'] as const;

/**
 * Get all chords for a specific degree in a key
 * @param degree - Roman numeral degree (e.g., 'I', 'ii', 'V')
 * @param tonality - 'major' or 'minor'
 * @returns Array of chord entries for this degree
 */
export function getChordsByDegree(
  degree: string,
  tonality: 'major' | 'minor' = 'major'
): ChordEntry[] {
  const chords = tonality === 'major' ? MAJOR_DEGREE_CHORDS : MINOR_DEGREE_CHORDS;
  return chords[degree] || [];
}

/**
 * Get all chords grouped by tonal function for a key
 * @param tonality - 'major' or 'minor'
 * @returns Chords grouped by tonic, predominant, dominant
 */
export function getChordsByFunction(
  tonality: 'major' | 'minor' = 'major'
): Record<string, ChordEntry[]> {
  const degrees = tonality === 'major' ? MAJOR_ROMAN_DEGREES : MINOR_ROMAN_DEGREES;
  const chordsByFunction: Record<string, ChordEntry[]> = {
    tonic: [],
    predominant: [],
    dominant: [],
  };

  for (const degree of degrees) {
    const chords = getChordsByDegree(degree, tonality);
    for (const chord of chords) {
      const fn = chord.function;
      if (fn === 'tonic' || fn === 'subdominant' || fn === 'dominant') {
        if (fn === 'subdominant') {
          // Type assertion pour rassurer TypeScript
          (chordsByFunction.predominant as ChordEntry[]).push(chord);
        } else if (fn === 'tonic') {
          (chordsByFunction.tonic as ChordEntry[]).push(chord);
        } else {
          (chordsByFunction.dominant as ChordEntry[]).push(chord);
        }
      }
    }
  }

  return chordsByFunction;
}

/**
 * Get all chords for a key with actual note names
 * @param root - Root note (e.g., 'C')
 * @param tonality - 'major' or 'minor'
 * @returns All chords with actual names (e.g., 'C', 'Cmaj7', 'Dm7', etc.)
 */
export function getChordsForKey(
  root: NoteName,
  tonality: 'major' | 'minor' = 'major'
): Record<string, Array<{ name: string; symbol: string; intervals: Interval[]; emotion: string; stability: string; function: string }>> {
  // Get the scale notes for the key
  const scaleNotes = getScaleNotes(root, tonality);
  const degrees = tonality === 'major' ? MAJOR_ROMAN_DEGREES : MINOR_ROMAN_DEGREES;

  const result: Record<string, Array<{ name: string; symbol: string; intervals: Interval[]; emotion: string; stability: string; function: string }>> = {};

  for (let i = 0; i < 7; i++) {
    const degree = degrees[i]!;
    const scaleNote = scaleNotes[i];
    const chords = getChordsByDegree(degree, tonality);

    result[degree] = chords.map(chord => ({
      name: chord.name.replace(/^I|II|III|IV|V|VI|VII|i|ii|iii|iv|v|vi|vii/, scaleNote || 'C'),
      symbol: chord.symbol,
      intervals: chord.intervals,
      emotion: chord.emotion,
      stability: chord.stability,
      function: chord.function,
    }));
  }

  return result;
}

/**
 * Get the scale notes for a key
 * @param root - Root note
 * @param tonality - 'major' or 'minor'
 * @returns Array of 7 note names
 */
function getScaleNotes(root: NoteName, tonality: 'major' | 'minor'): string[] {
  const CHROMATIC: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  // Major key intervals (semitones from root)
  const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
  // Minor key intervals (natural minor)
  const MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10];

  const intervals = tonality === 'major' ? MAJOR_INTERVALS : MINOR_INTERVALS;
  const rootIndex = CHROMATIC.indexOf(root);

  if (rootIndex === -1) return ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  return intervals.map(i => CHROMATIC[(rootIndex + i) % 12]!);
}

/**
 * Get emotional feeling for a specific chord
 * @param degree - Scale degree (e.g., 'I', 'V')
 * @param chordType - Chord type (e.g., 'maj7', 'm7')
 * @param tonality - 'major' or 'minor'
 * @returns Emotional description
 */
export function getEmotionForChord(
  degree: string,
  chordType: string,
  tonality: 'major' | 'minor' = 'major'
): string {
  const chords = getChordsByDegree(degree, tonality);
  const chord = chords.find(c => c.symbol === chordType || c.name.endsWith(chordType));
  return chord?.emotion || 'Émotion inconnue';
}

/**
 * Get all Roman numeral degrees for a tonality
 * @param tonality - 'major' or 'minor'
 * @returns Array of 7 Roman numerals
 */
export function getRomanDegrees(tonality: 'major' | 'minor'): readonly string[] {
  return tonality === 'major' ? MAJOR_ROMAN_DEGREES : MINOR_ROMAN_DEGREES;
}

/**
 * Get the tonal function category for a degree
 * @param degree - Roman numeral degree
 * @param tonality - 'major' or 'minor'
 * @returns 'tonic', 'predominant', or 'dominant'
 */
export function getDegreeFunction(
  degree: string,
  tonality: 'major' | 'minor' = 'major'
): 'tonic' | 'predominant' | 'dominant' {
  const chords = getChordsByDegree(degree, tonality);
  if (chords.length === 0) return 'tonic';

  const fn = chords[0]!.function;
  if (fn === 'subdominant') return 'predominant';
  if (fn === 'tonic' || fn === 'dominant') return fn;
  return 'tonic';
}
