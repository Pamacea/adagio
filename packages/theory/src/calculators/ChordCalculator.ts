// ============================================================================
// CHORD CALCULATOR - Chord analysis and calculation utilities
// ============================================================================

import type {
  NoteName,
  ChordQuality,
  Interval,
  ChordDegree,
  ChordFunction,
  ChordVoicing,
  DegreeChords,
  KeyChordLibrary,
  VoicingNote,
} from '@adagio/types';
import { INTERVAL_SEMITONES } from '../core/Interval';
import {
  MAJOR_DEGREE_QUALITIES,
  MINOR_DEGREE_QUALITIES,
  CHROMATIC_SCALE,
  GUITAR_TUNING,
} from '../constants';

/**
 * Fonction harmonique de chaque degré
 */
export const DEGREE_FUNCTIONS: Record<string, ChordFunction> = {
  'I': 'tonic',
  'i': 'tonic',
  'II': 'subdominant',
  'ii': 'subdominant',
  'III': 'tonic',
  'iii': 'tonic',
  'IV': 'subdominant',
  'iv': 'subdominant',
  'V': 'dominant',
  'v': 'dominant',
  'VI': 'tonic',
  'vi': 'tonic',
  'VII': 'dominant',
  'vii': 'dominant',
  'bII': 'substitute-dominant',
  'bIII': 'modal-interchange',
  'bIV': 'modal-interchange',
  'bV': 'modal-interchange',
  'bVI': 'modal-interchange',
  'bVII': 'modal-interchange',
  '#IV': 'modal-interchange',
};

// ============================================================================
// NOTE CALCULATIONS
// ============================================================================

/**
 * Obtenir l'indice chromatique d'une note
 * Gère les dièses (#) et bémols (b) de manière cohérente
 */
function getNoteIndex(note: NoteName): number {
  const index = CHROMATIC_SCALE.indexOf(note);
  if (index !== -1) return index;

  // Gérer les bémols - conversion enharmonique
  const flatToSharp: Record<string, number> = {
    'Db': 1,  // C#
    'Eb': 3,  // D#
    'Gb': 6,  // F#
    'Ab': 8,  // G#
    'Bb': 10, // A#
  };
  return flatToSharp[note] ?? 0;
}

/**
 * Transpose une note par un certain nombre de demi-tons
 * Retourne toujours la version en dièse pour la cohérence interne
 * (L'affichage gérera la conversion enharmonique si nécessaire)
 */
export function transposeNote(note: NoteName, semitones: number): NoteName {
  const index = getNoteIndex(note);
  const newIndex = ((index + semitones) % 12 + 12) % 12;
  return CHROMATIC_SCALE[newIndex] as NoteName;
}

/**
 * Convertit une note en bémol si approprié (pour l'affichage)
 * Par exemple: C# → Db, F# → Gb dans certains contextes
 */
export function toFlatIfAppropriate(note: NoteName, context?: NoteName): NoteName {
  const flatMap: Record<string, NoteName> = {
    'C#': 'Db',
    'D#': 'Eb',
    'F#': 'Gb',
    'G#': 'Ab',
    'A#': 'Bb',
  };

  // Si la note a un équivalent bémol
  if (flatMap[note]) {
    // Utiliser le contexte si fourni (ex: tonalité) pour décider
    // Par défaut, utiliser le bémol pour certaines tonalités clés
    const flatKeys = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'];
    if (context && flatKeys.includes(context as string)) {
      return flatMap[note];
    }
  }

  return note;
}

/**
 * Obtenir les notes d'une gamme majeure
 */
function getMajorScaleNotes(root: NoteName): NoteName[] {
  const majorIntervals = [0, 2, 4, 5, 7, 9, 11]; // T T S T T T S
  const rootIndex = getNoteIndex(root);

  return majorIntervals.map(interval => {
    const noteIndex = (rootIndex + interval) % 12;
    return CHROMATIC_SCALE[noteIndex] as NoteName;
  });
}

/**
 * Obtenir les notes d'une gamme mineure naturelle
 */
function getMinorScaleNotes(root: NoteName): NoteName[] {
  const minorIntervals = [0, 2, 3, 5, 7, 8, 10]; // T S T T S T T
  const rootIndex = getNoteIndex(root);

  return minorIntervals.map(interval => {
    const noteIndex = (rootIndex + interval) % 12;
    return CHROMATIC_SCALE[noteIndex] as NoteName;
  });
}

// ============================================================================
// CHORD BUILDING
// ============================================================================

/**
 * Construire un accord à partir de sa fondamentale et sa qualité
 */
export function buildChord(root: NoteName, quality: ChordQuality, extensions?: Interval[]): NoteName[] {
  const qualityIntervals: Record<ChordQuality, Interval[]> = {
    '': ['1', '3', '5'],
    'm': ['1', 'b3', '5'],
    '7': ['1', '3', '5', 'b7'],
    'm7': ['1', 'b3', '5', 'b7'],
    'maj7': ['1', '3', '5', '7'],
    'dim': ['1', 'b3', 'b5'],
    'dim7': ['1', 'b3', 'b5', 'bb7'],
    'm7b5': ['1', 'b3', 'b5', 'b7'],
    'aug': ['1', '3', '#5'],
    'aug7': ['1', '3', '#5', 'b7'],
    'sus2': ['1', '2', '5'],
    'sus4': ['1', '4', '5'],
    '7sus4': ['1', '4', '5', 'b7'],
    '6': ['1', '3', '5', '6'],
    'm6': ['1', 'b3', '5', '6'],
    '9': ['1', '3', '5', 'b7', '9'],
    'm9': ['1', 'b3', '5', 'b7', '9'],
    '11': ['1', '3', '5', 'b7', '9', '11'],
    'm11': ['1', 'b3', '5', 'b7', '9', '11'],
    '13': ['1', '3', '5', 'b7', '9', '11', '13'],
    'm13': ['1', 'b3', '5', 'b7', '9', '11', '13'],
    'add9': ['1', '3', '5', '9'],
    'madd9': ['1', 'b3', '5', '9'],
    'maj9': ['1', '3', '5', '7', '9'],
    'maj13': ['1', '3', '5', '7', '9', '13'],
    '6add9': ['1', '3', '5', '6', '9'],
    '6/9': ['1', '3', '5', '6', '9'],
    'm6/9': ['1', 'b3', '5', '6', '9'],
    'add4': ['1', '3', '4', '5'],
    '5add9': ['1', '5', '9'],
    '7alt': ['1', '3', 'b5', 'b7', '#9'],
    '7b9': ['1', '3', '5', 'b7', 'b9'],
    '7#9': ['1', '3', '5', 'b7', '#9'],
    '7b5': ['1', '3', 'b5', 'b7'],
    '7#5': ['1', '3', '#5', 'b7'],
    '7#11': ['1', '3', '5', 'b7', '#11'],
    '7b13': ['1', '3', '5', 'b7', 'b13'],
    '13sus4': ['1', '4', '5', 'b7', '13'],
    '7sus2': ['1', '2', '5', 'b7'],
    'mMaj7': ['1', 'b3', '5', '7'],
    'm7b5b9': ['1', 'b3', 'b5', 'b7', 'b9'],
    'm7b5b11': ['1', 'b3', 'b5', 'b7', '11'],
    'm7b11': ['1', 'b3', '5', 'b7', '11'],
  };

  const base = qualityIntervals[quality] || qualityIntervals[''];
  const allIntervals = [...base, ...(extensions || [])];

  return allIntervals.map(interval => {
    const semitones = INTERVAL_SEMITONES[interval];
    return transposeNote(root, semitones);
  });
}

/**
 * Obtenir le nom complet d'un accord
 */
export function getChordName(root: NoteName, quality: ChordQuality, extensions?: Interval[]): string {
  const ext = extensions && extensions.length > 0 ? extensions.join('/') : '';
  return `${root}${quality}${ext ? '(' + ext + ')' : ''}`;
}

// ============================================================================
// DEGREE CHORD CALCULATIONS
// ============================================================================

/**
 * Obtenir la note racine d'un degré dans une tonalité
 */
export function getDegreeNote(key: NoteName, degree: ChordDegree, tonality: 'major' | 'minor'): NoteName {
  const scaleNotes = tonality === 'major' ? getMajorScaleNotes(key) : getMinorScaleNotes(key);

  // Gérer les altérations (b, #) : abaissent/haussent la note DU degré d'un demi-ton
  // ex: bII de C = Db (D abaissé), #IV de C = F# (F haussé)
  const baseDegree = degree.replace(/^[b#]/, '');
  const alteration = degree.startsWith('b') ? -1 : degree.startsWith('#') ? 1 : 0;

  const degreeIndexMap: Record<string, number> = {
    'I': 0, 'II': 1, 'III': 2, 'IV': 3, 'V': 4, 'VI': 5, 'VII': 6,
  };

  const index = degreeIndexMap[baseDegree] ?? 0;
  const note = scaleNotes[index] ?? key;

  if (alteration === 0) return note;

  const altered = transposeNote(note, alteration);

  if (alteration === -1) {
    // Nommer en bémol quand la transposition donne un dièse (D-1 = C# → Db)
    const toFlat: Partial<Record<NoteName, NoteName>> = {
      'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb',
    };
    return toFlat[altered] ?? altered;
  }

  return altered;
}

/**
 * Obtenir les accords diatoniques pour chaque degré d'une tonalité
 * Renommée pour éviter le conflit avec chord-mapping.ts
 */
export function getDiatonicChordsByDegree(key: NoteName, tonality: 'major' | 'minor'): DegreeChords[] {
  const qualities = tonality === 'major' ? MAJOR_DEGREE_QUALITIES : MINOR_DEGREE_QUALITIES;

  const degrees: ChordDegree[] = tonality === 'major'
    ? ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']
    : ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

  return degrees.map(degree => {
    const rootNote = getDegreeNote(key, degree, tonality);
    const baseQuality = qualities[degree];
    const chordFunction = DEGREE_FUNCTIONS[degree] || 'tonic';

    const diatonicChords = [`${rootNote}${baseQuality}`];

    // Ajouter les extensions courantes
    const commonExtensions: string[] = [];
    if (baseQuality === '' || baseQuality === 'm') {
      commonExtensions.push(`${rootNote}${baseQuality}7`);
      commonExtensions.push(`${rootNote}${baseQuality}9`);
    } else if (baseQuality === '7') {
      commonExtensions.push(`${rootNote}9`);
      commonExtensions.push(`${rootNote}13`);
    } else if (baseQuality === 'm7') {
      commonExtensions.push(`${rootNote}m9`);
      commonExtensions.push(`${rootNote}m11`);
    } else if (baseQuality === 'maj7') {
      commonExtensions.push(`${rootNote}maj9`);
    }

    return {
      degree,
      function: chordFunction,
      diatonic: diatonicChords,
      commonExtensions,
      advice: getDegreeAdvice(degree, tonality),
    };
  });
}

/**
 * Obtenir les dominants secondaires pour une tonalité
 */
export function getSecondaryDominants(key: NoteName, tonality: 'major' | 'minor'): Record<string, string[]> {
  const scaleNotes = tonality === 'major' ? getMajorScaleNotes(key) : getMinorScaleNotes(key);
  const secondaryDominants: Record<string, string[]> = {};

  // Pour chaque degré diatonique
  const targetDegrees = tonality === 'major'
    ? ['I', 'II', 'III', 'IV', 'V', 'VI']
    : ['I', 'III', 'IV', 'V', 'VI', 'VII'];

  targetDegrees.forEach(targetDeg => {
    const degreeNum = targetDeg === 'I' ? 0
      : targetDeg === 'II' ? 1
      : targetDeg === 'III' ? 2
      : targetDeg === 'IV' ? 3
      : targetDeg === 'V' ? 4
      : targetDeg === 'VI' ? 5
      : 6;

    const targetNote = scaleNotes[degreeNum] ?? key;
    // Le dominant est une quinte au-dessus (7 demi-tons)
    const dominantRoot = transposeNote(targetNote, 7);
    secondaryDominants[targetDeg] = [
      `${dominantRoot}7`,  // V7/x
      `${dominantRoot}7b9`, // V7b9/x (plus coloré)
    ];
  });

  return secondaryDominants;
}

/**
 * Obtenir les accords d'emprunt modal (modal interchange)
 */
export function getModalInterchangeChords(key: NoteName, tonality: 'major' | 'minor'): string[] {
  const parallelTonality = tonality === 'major' ? 'minor' : 'major';
  const parallelScale = parallelTonality === 'major' ? getMajorScaleNotes(key) : getMinorScaleNotes(key);

  const chords: string[] = [];

  if (tonality === 'major') {
    // Emprunts depuis le mineur parallèle
    chords.push(`${parallelScale[1] ?? 'D'}m7`);
    chords.push(`${parallelScale[2] ?? 'E'}`);
    chords.push(`${parallelScale[3] ?? 'F'}m`);
    chords.push(`${parallelScale[4] ?? 'G'}m7b5`);
    chords.push(`${parallelScale[5] ?? 'A'}`);
    chords.push(`${parallelScale[6] ?? 'B'}`);
  } else {
    // Emprunts depuis le majeur parallèle
    chords.push(`${parallelScale[1] ?? 'D'}m7`);
    chords.push(`${parallelScale[2] ?? 'E'}m`);
    chords.push(`${parallelScale[3] ?? 'F'}`);
    chords.push(`${parallelScale[4] ?? 'G'}7`);
    chords.push(`${parallelScale[5] ?? 'A'}m`);
  }

  return chords;
}

// ============================================================================
// HARMONIC ANALYSIS
// ============================================================================

/**
 * Analyser la fonction harmonique d'un accord dans une tonalité
 */
export function analyzeChordFunction(chordRoot: NoteName, key: NoteName, tonality: 'major' | 'minor'): ChordFunction {
  const scaleNotes = tonality === 'major' ? getMajorScaleNotes(key) : getMinorScaleNotes(key);
  const chordIndex = scaleNotes.indexOf(chordRoot);

  if (chordIndex === -1) {
    // L'accord n'est pas diatonique - vérifier les emprunts modaux
    const minorScale = getMinorScaleNotes(key);
    if (minorScale.includes(chordRoot)) {
      return 'modal-interchange';
    }
    return 'passing';
  }

  const degrees: ChordDegree[] = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const degree = degrees[chordIndex];

  if (!degree) return 'tonic';
  return DEGREE_FUNCTIONS[degree] ?? 'tonic';
}

/**
 * Obtenir la tension d'un accord
 */
export function getChordTension(quality: ChordQuality): 'stable' | 'tense' | 'dissonant' | 'ambiguous' {
  const stable: ChordQuality[] = ['', 'm', '6', 'm6', 'add9', 'madd9'];
  const tense: ChordQuality[] = ['7', 'm7', '9', 'm9', '13', 'm13', 'sus2', 'sus4'];
  const dissonant: ChordQuality[] = ['dim', 'dim7', 'm7b5', 'aug'];
  const ambiguous: ChordQuality[] = ['7sus4', '11', 'm11', 'aug7'];

  if (stable.includes(quality)) return 'stable';
  if (tense.includes(quality)) return 'tense';
  if (dissonant.includes(quality)) return 'dissonant';
  return 'ambiguous';
}

/**
 * Obtenir les notes de tendance (notes qui veulent résoudre)
 */
export function getTendencyTones(chordRoot: NoteName, quality: ChordQuality): NoteName[] {
  const tendencyNotes: NoteName[] = [];

  // La 7ème et la 4ème créent des tensions
  if (quality === '7' || quality === '9' || quality === '13' || quality === 'm7' || quality === 'm9' || quality === 'm13') {
    tendencyNotes.push(transposeNote(chordRoot, 10)); // b7
  }
  if (quality === 'maj7' || quality === '9') {
    tendencyNotes.push(transposeNote(chordRoot, 11)); // 7
  }
  if (quality === 'sus4' || quality === '7sus4') {
    tendencyNotes.push(transposeNote(chordRoot, 5)); // 4 (vers 3)
  }
  if (quality === 'dim7' || quality === 'm7b5') {
    tendencyNotes.push(transposeNote(chordRoot, 6)); // b5
  }

  return tendencyNotes;
}

// ============================================================================
// FRETBOARD VOICINGS
// ============================================================================

/**
 * Obtenir les positions d'un accord sur le manche
 * Calcule les voicings possibles pour un accord donné
 *
 * IMPORTANT: Convention de numérotation des cordes:
 * - tuning est passé grave → aigu (défaut GUITAR_TUNING = E A D G B E)
 * - VoicingNote.string: 0 = corde la plus aigu(e), stringCount-1 = corde la plus grave
 */
export function getChordVoicings(
  chordRoot: NoteName,
  quality: ChordQuality,
  fretCount = 12,
  tuning: readonly NoteName[] = GUITAR_TUNING
): ChordVoicing[] {
  const voicings: ChordVoicing[] = [];
  const chordNotes = buildChord(chordRoot, quality);
  const seenFingerprints = new Set<string>();

  // Générer des positions sur tout le manche
  const maxStartFret = Math.max(7, fretCount - 4);

  for (let startFret = 0; startFret <= maxStartFret; startFret++) {
    const voicingNotes: VoicingNote[] = [];
    let minFret = 24;
    let maxFret = 0;

    // tuning est [grave → aigu] : [E(low), A, D, G, B, E(high)] pour la guitare
    for (let stringIdx = 0; stringIdx < tuning.length; stringIdx++) {
      const openNote = tuning[stringIdx] as NoteName;
      const openNoteIndex = getNoteIndex(openNote);

      // Chercher la note de l'accord sur cette corde (jusqu'à 5 frettes plus loin)
      for (let fret = startFret; fret <= Math.min(startFret + 5, fretCount); fret++) {
        const noteIndex = (openNoteIndex + fret) % 12;
        const note = CHROMATIC_SCALE[noteIndex] as NoteName | undefined;

        if (note && chordNotes.includes(note)) {
          const voicingString = tuning.length - 1 - stringIdx;
          const octave = 4 + Math.floor((openNoteIndex + fret) / 12) - (stringIdx >= 2 ? 1 : 0);

          voicingNotes.push({
            note,
            octave,
            string: voicingString,
            fret,
            interval: getIntervalInChord(chordRoot, note, quality),
          });

          minFret = Math.min(minFret, fret);
          maxFret = Math.max(maxFret, fret);
          break;
        }
      }
    }

    // Vérifier que le voicing contient toutes les notes distinctes de l'accord
    // (pas seulement 3 notes quelconques - sinon C6 ressemble à C majeur)
    const uniqueNotesInVoicing = new Set(voicingNotes.map(n => n.note));
    const hasAllChordNotes = chordNotes.every(n => uniqueNotesInVoicing.has(n));

    // Accepter si toutes les notes sont présentes, ou au moins 3 notes pour les triades
    const isValid = hasAllChordNotes || (chordNotes.length <= 3 && voicingNotes.length >= 3);

    if (isValid && voicingNotes.length >= 3) {
      // Dédupliquer : créer une empreinte basée sur les frettes jouées par corde
      const fingerprint = voicingNotes
        .sort((a, b) => b.string - a.string)
        .map(n => `${n.string}:${n.fret}`)
        .join('|');

      if (!seenFingerprints.has(fingerprint)) {
        seenFingerprints.add(fingerprint);
        voicings.push({
          id: `${chordRoot}${quality}-${startFret}`,
          name: `${chordRoot}${quality}`,
          notes: voicingNotes,
          position: 'root',
          fretRange: [minFret, maxFret],
          difficulty: maxFret - minFret > 4 ? 'hard' : 'easy',
        });
      }
    }
  }

  return voicings;
}

/**
 * Obtenir l'intervalle d'une note dans un accord
 * Mapping complet des demi-tons vers les intervalles
 */
function getIntervalInChord(root: NoteName, note: NoteName, quality: ChordQuality): Interval {
  const rootIndex = getNoteIndex(root);
  const noteIndex = getNoteIndex(note);
  const semitones = ((noteIndex - rootIndex) + 12) % 12;

  // Selon la qualité de l'accord, 6 et 9 demi-tons se nomment autrement
  if (semitones === 6 && (quality === 'dim' || quality === 'dim7' || quality === 'm7b5')) return 'b5';
  if (semitones === 9 && (quality === 'aug' || quality === 'aug7')) return '#5';

  // Mapping complet demi-tons → intervalles
  const semitoneToInterval: Record<number, Interval> = {
    0: '1',
    1: 'b2',
    2: '2',
    3: 'b3',
    4: '3',
    5: '4',
    6: '#4',
    7: '5',
    8: 'b6',
    9: '6',
    10: 'b7',
    11: '7',
  };

  return semitoneToInterval[semitones] ?? '1';
}

// ============================================================================
// CAGED SYSTEM
// ============================================================================

/**
 * Obtenir la forme CAGED d'un accord
 */
export function getCAGEDShape(chordRoot: NoteName): { shape: 'C' | 'A' | 'G' | 'E' | 'D'; rootFret: number }[] {
  // Positions racines pour chaque forme CAGED
  const cagedSystem = [
    { shape: 'C' as const, rootNotes: ['C', 'F', 'Bb', 'Eb', 'G#'], startFret: 0 },
    { shape: 'A' as const, rootNotes: ['A', 'D', 'G', 'C', 'E'], startFret: 0 },
    { shape: 'G' as const, rootNotes: ['G', 'C', 'F', 'Bb', 'Eb'], startFret: 0 },
    { shape: 'E' as const, rootNotes: ['E', 'A', 'D', 'G', 'C'], startFret: 0 },
    { shape: 'D' as const, rootNotes: ['D', 'G', 'C', 'F', 'Bb'], startFret: 0 },
  ];

  const results: { shape: 'C' | 'A' | 'G' | 'E' | 'D'; rootFret: number }[] = [];

  cagedSystem.forEach(({ shape, rootNotes, startFret }) => {
    const rootIndex = rootNotes.indexOf(chordRoot);
    if (rootIndex !== -1) {
      results.push({
        shape,
        rootFret: rootIndex * 5 + startFret,
      });
    }
  });

  return results;
}

// ============================================================================
// COMMON PROGRESSIONS
// ============================================================================

/**
 * Progressions d'accords communes
 */
export function getCommonProgressions(tonality: 'major' | 'minor') {
  const majorProgressions = [
    {
      name: 'II-V-I',
      degrees: ['II', 'V', 'I'] as ChordDegree[],
      description: 'La progression jazz la plus importante. Crée mouvement et résolution.',
    },
    {
      name: 'I-VI-ii-V',
      degrees: ['I', 'VI', 'II', 'V'] as ChordDegree[],
      description: 'Turnaround classique du jazz et du rhythm & blues.',
    },
    {
      name: 'I-IV-V',
      degrees: ['I', 'IV', 'V'] as ChordDegree[],
      description: 'Base du rock, du blues et du pop.',
    },
    {
      name: 'I-vi-IV-V',
      degrees: ['I', 'VI', 'IV', 'V'] as ChordDegree[],
      description: '"50s progression", très utilisée dans la pop.',
    },
    {
      name: 'iii-vi-ii-V',
      degrees: ['III', 'VI', 'II', 'V'] as ChordDegree[],
      description: 'Turnaround sophistiqué avec descente chromatique.',
    },
    {
      name: 'I-IV-vii-III-vi-ii-V-I',
      degrees: ['I', 'IV', 'VII', 'III', 'VI', 'II', 'V', 'I'] as ChordDegree[],
      description: 'Cercle des quintes complet (rags), tourne en boucle.',
    },
  ];

  const minorProgressions = [
    {
      name: 'ii-V-i',
      degrees: ['II', 'V', 'I'] as ChordDegree[],
      description: 'Le turnaround mineur classique.',
    },
    {
      name: 'i-iv-V',
      degrees: ['I', 'IV', 'V'] as ChordDegree[],
      description: 'Progression mineure basique.',
    },
    {
      name: 'i-VI-III-VII',
      degrees: ['I', 'VI', 'III', 'VII'] as ChordDegree[],
      description: 'Andalucian cadence, base du flamenco.',
    },
    {
      name: 'i-bVI-bVII-V',
      degrees: ['I', 'bVI', 'bVII', 'V'] as ChordDegree[],
      description: 'Progression rock/metal mineure.',
    },
  ];

  return tonality === 'major' ? majorProgressions : minorProgressions;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Obtenir les conseils pour un degré
 */
function getDegreeAdvice(degree: ChordDegree, tonality: 'major' | 'minor'): string {
  const advices: Record<string, string> = {
    'I-major': 'Tonique - stabilité, repos, point de départ et d\'arrivée.',
    'II-major': 'Prédominant - prépare le V, mouvement doux.',
    'III-major': 'Tonique faible - peut remplacer le I, couleur mineure.',
    'IV-major': 'Sous-dominant - départ, éloignement de la tonique.',
    'V-major': 'Dominant - tension maximale, demande résolution sur I.',
    'VI-major': 'Tonique - relative mineure du I, mélancolique mais stable.',
    'VII-major': 'Dominant - tension très forte, rare comme accord de repos.',
    'I-minor': 'Tonique mineure - base, stable mais mélancolique.',
    'II-minor': 'Dominant - très instable, prépare le i.',
    'III-minor': 'Tonique - relative majeure du i, lumineux.',
    'IV-minor': 'Sous-dominant mineure - préparation sombre.',
    'V-minor': 'Dominant - souvent joué majeur (V7) pour plus de tension.',
    'VI-minor': 'Tonique - retour calme vers le i.',
    'VII-minor': 'Dominant - tension vers i ou III.',
  };

  return advices[`${degree}-${tonality}`] ?? '';
}

/**
 * Obtenir une bibliothèque complète d'accords pour une tonalité
 */
export function getKeyChordLibrary(key: NoteName, tonality: 'major' | 'minor'): KeyChordLibrary {
  const degrees = getDiatonicChordsByDegree(key, tonality);
  const degreeMap: Record<ChordDegree, DegreeChords> = {} as Record<ChordDegree, DegreeChords>;

  degrees.forEach(d => {
    degreeMap[d.degree as ChordDegree] = {
      ...d,
      secondaryDominants: getSecondaryDominants(key, tonality)[d.degree],
      modalInterchange: getModalInterchangeChords(key, tonality),
    };
  });

  return {
    key,
    tonality,
    degrees: degreeMap,
    commonProgressions: getCommonProgressions(tonality),
  };
}
