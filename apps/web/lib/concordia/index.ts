/**
 * Base d'accords Concordia — données, matching et adaptation vers l'UI.
 * Source : `concordia/src/data/chords.json` (copie locale, repo source en lecture seule).
 */

export type {
  ChordsFile,
  Diagram,
  DiagramNote,
  DiagramOrientation,
  Fingerings,
  FreeText,
  Group,
  Position,
  TuningId,
} from './types';
export { findDiagrams, normalizeQuality, parseChordName, pitchClass } from './match';
export { toChordShape, type ChordShape } from './adapter';
