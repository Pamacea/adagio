// ============================================================================
// TRIADS CALCULATIONS SERVICE
// Business logic for triads and chord extensions
// ============================================================================

import type {
  NoteName,
  Interval,
} from '@adagio/types';
import { CHROMATIC_SCALE } from '@adagio/theory';

// ============================================================================
// TYPES
// ============================================================================

export type TriadQuality = 'major' | 'minor' | 'augmented' | 'diminished';

export type TriadExtension = '2' | '4' | '6' | '7' | '9' | '11' | '13';

export type ExtensionAlteration = 'flat' | 'sharp' | 'natural';

export interface ExtensionConfig {
  extension: TriadExtension;
  alteration: ExtensionAlteration;
}

export interface TriadInfo {
  root: NoteName;
  quality: TriadQuality;
  notes: NoteName[];
  intervals: Interval[];
  name: string;
  nameFr: string;
}

export interface ExtendedChordInfo {
  triad: TriadInfo;
  extensions: ExtensionConfig[];
  allNotes: NoteName[];
  allIntervals: Interval[];
  chordName: string;
}

// ============================================================================
// INTERVALLES PAR QUALITÉ DE TRIADE
// ============================================================================

const TRIAD_INTERVALS: Record<TriadQuality, Interval[]> = {
  major: ['1', '3', '5'],
  minor: ['1', 'b3', '5'],
  augmented: ['1', '3', '#5'],
  diminished: ['1', 'b3', 'b5'],
};

const TRIAD_NAMES_FR: Record<TriadQuality, string> = {
  major: 'Majeur',
  minor: 'Mineur',
  augmented: 'Augmenté',
  diminished: 'Diminué',
};

// ============================================================================
// NOTE CALCULATIONS
// ============================================================================

function getNoteIndex(note: NoteName): number {
  const index = CHROMATIC_SCALE.indexOf(note);
  if (index !== -1) return index;

  const flatMap: Record<string, number> = {
    'Db': 1, 'Eb': 3, 'Gb': 6, 'Ab': 8, 'Bb': 10,
  };
  return flatMap[note] ?? 0;
}

function transposeNote(note: NoteName, semitones: number): NoteName {
  const index = getNoteIndex(note);
  const newIndex = ((index + semitones) % 12 + 12) % 12;
  return CHROMATIC_SCALE[newIndex] as NoteName;
}

const INTERVAL_SEMITONES: Record<Interval, number> = {
  '1': 0,
  'b2': 1,
  '2': 2,
  'b3': 3,
  '3': 4,
  '4': 5,
  '#4': 6,
  'b5': 6,
  '5': 7,
  '#5': 8,
  'b6': 8,
  '6': 9,
  '#6': 10,
  'bb6': 9,
  'bb7': 10,
  'b7': 10,
  '7': 11,
  'b4': 4,
  '#1': 1,
  '#2': 3,
  '#3': 5,
  'b9': 13,
  '9': 14,
  '#9': 15,
  '11': 17,
  '#11': 18,
  'b13': 20,
  '13': 21,
};

// ============================================================================
// TRIAD BUILDING
// ============================================================================

/**
 * Construire une triade à partir de sa fondamentale et sa qualité
 */
export function buildTriad(root: NoteName, quality: TriadQuality): NoteName[] {
  const intervals = TRIAD_INTERVALS[quality];
  return intervals.map(interval => {
    const semitones = INTERVAL_SEMITONES[interval];
    return transposeNote(root, semitones);
  });
}

/**
 * Obtenir les intervalles d'une triade
 */
export function getTriadIntervals(quality: TriadQuality): Interval[] {
  return TRIAD_INTERVALS[quality];
}

/**
 * Obtenir les informations d'une triade
 */
export function getTriadInfo(root: NoteName, quality: TriadQuality): TriadInfo {
  const notes = buildTriad(root, quality);
  const intervals = getTriadIntervals(quality);

  return {
    root,
    quality,
    notes,
    intervals,
    name: `${root} ${TRIAD_NAMES_FR[quality]}`,
    nameFr: `${root} ${TRIAD_NAMES_FR[quality]}`,
  };
}

// ============================================================================
// EXTENSIONS
// ============================================================================

/**
 * Intervalles de base pour chaque extension (avant altération)
 */
const BASE_EXTENSION_INTERVALS: Record<TriadExtension, Interval> = {
  '2': '2',
  '4': '4',
  '6': '6',
  '7': '7',
  '9': '9',
  '11': '11',
  '13': '13',
};

/**
 * Obtenir l'intervalle final avec altération
 */
export function getAlterationInterval(
  extension: TriadExtension,
  alteration: ExtensionAlteration
): Interval {
  const baseInterval = BASE_EXTENSION_INTERVALS[extension];

  if (alteration === 'natural') {
    return baseInterval;
  }

  // Gérer les altérations
  const alterationMap: Record<string, Interval> = {
    '2-flat': 'b2',
    '2-sharp': '#2',
    '4-flat': 'b4',
    '4-sharp': '#4',
    '6-flat': 'b6',
    '6-sharp': '#6',
    '7-flat': 'b7',
    '7-sharp': '7', // Pas de #7 en pratique, utilise 7
    '9-flat': 'b9',
    '9-sharp': '#9',
    '11-flat': '11', // 11 est déjà b11 en contexte de 7e
    '11-sharp': '#11',
    '13-flat': 'b13',
    '13-sharp': '13', // Pas de #13 en pratique
  };

  return alterationMap[`${extension}-${alteration}`] ?? baseInterval;
}

/**
 * Étendre une triade avec des extensions
 */
export function extendTriad(
  triadNotes: NoteName[],
  root: NoteName,
  extensions: ExtensionConfig[]
): NoteName[] {
  const allNotes = [...triadNotes];

  for (const config of extensions) {
    const interval = getAlterationInterval(config.extension, config.alteration);
    const semitones = INTERVAL_SEMITONES[interval];
    const newNote = transposeNote(root, semitones);

    // Éviter les doublons
    if (!allNotes.includes(newNote)) {
      allNotes.push(newNote);
    }
  }

  // Trier par hauteur (ordre chromatique)
  return allNotes.sort((a, b) => getNoteIndex(a) - getNoteIndex(b));
}

/**
 * Obtenir tous les intervalles (triade + extensions)
 */
export function getAllIntervals(
  triadQuality: TriadQuality,
  extensions: ExtensionConfig[]
): Interval[] {
  const baseIntervals = [...TRIAD_INTERVALS[triadQuality]];
  const addedIntervals = new Set<Interval>();

  for (const config of extensions) {
    const interval = getAlterationInterval(config.extension, config.alteration);
    addedIntervals.add(interval);
  }

  return [...baseIntervals, ...addedIntervals];
}

/**
 * Obtenir le nom de l'accord étendu
 */
export function getExtendedChordName(
  root: NoteName,
  triadQuality: TriadQuality,
  extensions: ExtensionConfig[]
): string {
  if (extensions.length === 0) {
    return `${root} ${TRIAD_NAMES_FR[triadQuality]}`;
  }

  // Mapper vers les qualités d'accords standards
  let chordQuality = '';
  const extNotes = extensions.map(e => getAlterationInterval(e.extension, e.alteration));

  // Logique de dénomination des accords
  const hasSeventh = extNotes.some(i => i === 'b7' || i === '7');
  const hasNinth = extNotes.some(i => i === '9' || i === 'b9' || i === '#9');
  const hasEleventh = extNotes.some(i => i === '11' || i === '#11');
  const hasThirteenth = extNotes.some(i => i === '13' || i === 'b13');

  if (triadQuality === 'major') {
    if (hasSeventh) {
      chordQuality = extNotes.includes('7') ? 'maj7' : '7';
    }
    if (hasNinth) {
      chordQuality = extNotes.includes('7') ? 'maj9' : '9';
    }
    if (hasEleventh) {
      chordQuality = extNotes.includes('7') ? 'maj11' : '11';
    }
    if (hasThirteenth) {
      chordQuality = extNotes.includes('7') ? 'maj13' : '13';
    }
    if (!hasSeventh && !hasNinth && !hasEleventh && !hasThirteenth) {
      chordQuality = '';
    }
  } else if (triadQuality === 'minor') {
    if (hasSeventh) {
      chordQuality = 'm7';
    }
    if (hasNinth) {
      chordQuality = 'm9';
    }
    if (hasEleventh) {
      chordQuality = 'm11';
    }
    if (hasThirteenth) {
      chordQuality = 'm13';
    }
    if (!hasSeventh && !hasNinth && !hasEleventh && !hasThirteenth) {
      chordQuality = 'm';
    }
  } else if (triadQuality === 'augmented') {
    if (hasSeventh) {
      chordQuality = 'aug7';
    } else {
      chordQuality = 'aug';
    }
  } else if (triadQuality === 'diminished') {
    if (extNotes.includes('bb7') || extNotes.includes('b7')) {
      chordQuality = 'dim7';
    } else {
      chordQuality = 'dim';
    }
  }

  // Gérer les altérations spéciales
  const hasFlatNine = extNotes.includes('b9');
  const hasSharpNine = extNotes.includes('#9');
  const hasSharpEleven = extNotes.includes('#11');
  const hasFlatThirteen = extNotes.includes('b13');

  let suffix = '';
  if (hasFlatNine) suffix += 'b9';
  if (hasSharpNine) suffix += '#9';
  if (hasSharpEleven) suffix += '#11';
  if (hasFlatThirteen) suffix += 'b13';

  return suffix ? `${root}${chordQuality}(${suffix})` : `${root}${chordQuality}`;
}

/**
 * Obtenir les informations complètes de l'accord étendu
 * Les notes et intervalles sont triés par degré harmonique (1, 2, 3, 4, 5, 6, 7, 9, 11, 13)
 */
export function getExtendedChordInfo(
  root: NoteName,
  quality: TriadQuality,
  extensions: ExtensionConfig[]
): ExtendedChordInfo {
  const triad = getTriadInfo(root, quality);

  // Ordre harmonique naturel des degrés
  const HARMONIC_ORDER: Interval[] = [
    '1', // fondamentale
    'b2', '2', // seconde
    'b3', '3', // tierce
    'b4', '4', // quarte
    '#4', // quarte augmentée
    'b5', '5', '#5', // quinte
    'b6', '6', '#6', // sixte
    'bb7', 'b7', '7', // septième
    'b9', '9', '#9', // neuvième
    '11', '#11', // onzième
    'b13', '13', // treizième
  ];

  // Construire toutes les notes et intervalles
  const allNotes: NoteName[] = [...triad.notes];
  const allIntervals: Interval[] = [...triad.intervals];

  // Ajouter les extensions
  for (const ext of extensions) {
    let interval: Interval;

    if (ext.extension === '2') {
      interval = ext.alteration === 'flat' ? 'b2' : ext.alteration === 'sharp' ? '#2' : '2';
    } else if (ext.extension === '4') {
      interval = ext.alteration === 'flat' ? 'b4' : ext.alteration === 'sharp' ? '#4' : '4';
    } else if (ext.extension === '6') {
      interval = ext.alteration === 'flat' ? 'b6' : ext.alteration === 'sharp' ? '#6' : '6';
    } else if (ext.extension === '7') {
      interval = ext.alteration === 'flat' ? 'b7' : '7';
    } else if (ext.extension === '9') {
      interval = ext.alteration === 'flat' ? 'b9' : ext.alteration === 'sharp' ? '#9' : '9';
    } else if (ext.extension === '11') {
      interval = ext.alteration === 'sharp' ? '#11' : '11';
    } else if (ext.extension === '13') {
      interval = ext.alteration === 'flat' ? 'b13' : '13';
    } else {
      interval = '1';
    }

    const semitones = INTERVAL_SEMITONES[interval];
    const newNote = transposeNote(root, semitones);

    // Ajouter seulement si pas déjà présent
    if (!allNotes.includes(newNote)) {
      allNotes.push(newNote);
    }
    allIntervals.push(interval);
  }

  // Trier par ordre harmonique
  const indexedNotes = allNotes.map((note, i) => ({
    note,
    interval: allIntervals[i],
    harmonicIndex: HARMONIC_ORDER.indexOf(allIntervals[i] ?? '1'),
  }));

  indexedNotes.sort((a, b) => {
    // Si l'index n'est pas trouvé, mettre à la fin
    const aIndex = a.harmonicIndex >= 0 ? a.harmonicIndex : 999;
    const bIndex = b.harmonicIndex >= 0 ? b.harmonicIndex : 999;
    return aIndex - bIndex;
  });

  const sortedNotes = indexedNotes.map(item => item.note);
  const sortedIntervals = indexedNotes
    .map(item => item.interval)
    .filter((interval): interval is Interval => typeof interval === 'string');

  const chordName = getExtendedChordName(root, quality, extensions);

  return {
    triad,
    extensions,
    allNotes: sortedNotes,
    allIntervals: sortedIntervals,
    chordName,
  };
}

// ============================================================================
// FRETBOARD CALCULATIONS
// ============================================================================

/**
 * Calculer les positions sur le manche pour les notes d'une triade/accord
 */
export interface FretboardTriadNote {
  name: NoteName;
  octave: number;
  string: number; // 0-5 (high E to low E)
  fret: number;
  interval: Interval;
  isRoot: boolean;
  isTriadNote: boolean;
  isExtension: boolean;
}

export function calculateFretboardForTriad(
  root: NoteName,
  quality: TriadQuality,
  extensions: ExtensionConfig[],
  fretCount = 12
): FretboardTriadNote[] {
  const chordInfo = getExtendedChordInfo(root, quality, extensions);
  const allNotes = chordInfo.allNotes;
  const allIntervals = chordInfo.allIntervals;
  const triadIntervals = TRIAD_INTERVALS[quality];

  // Créer un mapping note -> intervalle correct
  const noteToInterval: Record<string, Interval> = {};
  chordInfo.triad.notes.forEach((note, i) => {
    const interval = chordInfo.triad.intervals[i];
    if (interval) {
      noteToInterval[note] = interval;
    }
  });
  // Ajouter les extensions
  const extNotes = chordInfo.allNotes.filter(n => !chordInfo.triad.notes.includes(n));
  chordInfo.extensions.forEach((ext, i) => {
    const interval = getAlterationInterval(ext.extension, ext.alteration);
    if (extNotes[i]) {
      noteToInterval[extNotes[i]] = interval;
    }
  });

  const guitarTuning: NoteName[] = ['E', 'B', 'G', 'D', 'A', 'E'];
  const notes: FretboardTriadNote[] = [];

  for (let stringIdx = 0; stringIdx < 6; stringIdx++) {
    const openNote = guitarTuning[stringIdx];
    if (!openNote) continue;
    const openNoteIndex = getNoteIndex(openNote);

    for (let fret = 0; fret <= fretCount; fret++) {
      const noteIndex = (openNoteIndex + fret) % 12;
      const noteName = CHROMATIC_SCALE[noteIndex] as NoteName | undefined;

      if (noteName && allNotes.includes(noteName)) {
        // Trouver l'intervalle correct via le mapping
        const interval = noteToInterval[noteName] ?? '1';

        // La fondamentale est la note racine elle-même
        const isRoot = noteName === root;

        notes.push({
          name: noteName,
          octave: 4 + Math.floor((openNoteIndex + fret) / 12),
          string: stringIdx,
          fret,
          interval,
          isRoot,
          isTriadNote: triadIntervals.includes(interval),
          isExtension: !triadIntervals.includes(interval),
        });
      }
    }
  }

  return notes;
}

// ============================================================================
// FRENCH NOTATION
// ============================================================================

export const NOTE_FR: Record<string, string> = {
  'C': 'DO', 'C#': 'DO♯', 'Db': 'RÉ♭',
  'D': 'RÉ', 'D#': 'RÉ♯', 'Eb': 'MI♭',
  'E': 'MI',
  'F': 'FA', 'F#': 'FA♯', 'Gb': 'SOL♭',
  'G': 'SOL', 'G#': 'SOL♯', 'Ab': 'LA♭',
  'A': 'LA', 'A#': 'LA♯', 'Bb': 'SI♭',
  'B': 'SI',
};

export function formatNoteFr(note: NoteName): string {
  return NOTE_FR[note] || note;
}

export function formatIntervalFr(interval: Interval): string {
  return interval
    .replace(/#/g, '♯')
    .replace(/b/g, '♭')
    .replace(/bb/g, '♭♭');
}

// ============================================================================
// PRESETS D'EXTENSIONS COURANTS
// ============================================================================

export const COMMON_EXTENSION_PRESETS: Record<string, ExtensionConfig[]> = {
  'Aucune': [],
  'Septième (7)': [{ extension: '7', alteration: 'flat' }],
  'Majeur 7 (maj7)': [{ extension: '7', alteration: 'natural' }],
  'Sixte (6)': [{ extension: '6', alteration: 'natural' }],
  'Add9': [{ extension: '9', alteration: 'natural' }],
  'Mineur 7 (m7)': [{ extension: '7', alteration: 'flat' }],
  '9 (9e)': [{ extension: '7', alteration: 'flat' }, { extension: '9', alteration: 'natural' }],
  '11 (11e)': [{ extension: '7', alteration: 'flat' }, { extension: '9', alteration: 'natural' }, { extension: '11', alteration: 'natural' }],
  '13 (13e)': [{ extension: '7', alteration: 'flat' }, { extension: '9', alteration: 'natural' }, { extension: '11', alteration: 'natural' }, { extension: '13', alteration: 'natural' }],
  '7#11': [{ extension: '7', alteration: 'flat' }, { extension: '11', alteration: 'sharp' }],
  '7b9': [{ extension: '7', alteration: 'flat' }, { extension: '9', alteration: 'flat' }],
  '7#9': [{ extension: '7', alteration: 'flat' }, { extension: '9', alteration: 'sharp' }],
};
