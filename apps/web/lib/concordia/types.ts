/**
 * Types des diagrammes d'accords issus de Concordia.
 *
 * Port de `concordia/src/lib/types.ts` (app séparée, repo en lecture seule) —
 * seuls les types utiles au rendu sont conservés, pas l'éditeur de diagrammes.
 */

/** Position d'une note dans un diagramme Concordia. */
export interface Position {
  /** Index de corde : 0 = corde 6 (mi grave) … 5 = corde 1 (mi aigu) */
  s: number;
  /** Case relative (0 = première case affichée, -1 = corde à vide) */
  f: number;
}

export interface DiagramNote extends Position {
  id: string;
}

/** Doigtage par index de corde (chaîne) : '1'..'4', 'X' (muette), '0' (ouverte), '' */
export type Fingerings = Record<string, string>;

export interface FreeText {
  id: string;
  x: number;
  y: number;
  text: string;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  bold?: boolean;
}

export type DiagramOrientation = 'vertical' | 'horizontal';

/** Accordage : clé dans les tunings Concordia. */
export type TuningId =
  | 'standard-e'
  | 'half-step-down'
  | 'whole-step-down'
  | 'drop-d'
  | 'drop-cs'
  | 'drop-c'
  | 'dadgad'
  | 'open-g'
  | 'open-d'
  | 'open-e'
  | 'open-a'
  | 'nashville';

export interface Diagram {
  id: string;
  groupId: string;
  /** Nom libre : `{Racine} {Qualité} ({détails})` ex. « G Majeur (Forme E - Corde 6) » */
  name: string;
  /** Case de départ (case absolue de la première ligne de case affichée) */
  startFret: number;
  fretCount?: number;
  orientation?: DiagramOrientation;
  tuning?: TuningId;
  root: Position | null;
  notes: DiagramNote[];
  fingerings: Fingerings;
  texts: FreeText[];
}

export interface Group {
  id: string;
  name: string;
  diagramIds: string[];
}

export interface ChordsFile {
  version: string;
  groups: Group[];
  diagrams: Record<string, Diagram>;
}
