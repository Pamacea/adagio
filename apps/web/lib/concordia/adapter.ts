/**
 * Adapter Concordia → ChordDiagram (`@adagio/ui`).
 *
 * Conversion des coordonnées Concordia vers le format du composant :
 * - cordes : Concordia 0 = mi grave → interne 0 = mi aigu (`5 - s`)
 * - cases : relatives (`abs = startFret + f`) → absolues, -1 (vide) → 0
 * - doigtage : '1'..'4' → finger, 'X'/absent → corde muette
 */

import type { ChordFingerPosition } from '@adagio/ui';
import type { Diagram } from './types';

export interface ChordShape {
  diagram: Diagram;
  /** 6 positions (mi grave → mi aigu en index Concordia, convention interne ChordDiagram) */
  positions: ChordFingerPosition[];
  /** Nombre de cases à afficher (min 4, sinon toutes les cases utiles) */
  frets: number;
}

/** Convertit un diagramme Concordia en positions prêtes pour ChordDiagram. */
export function toChordShape(diagram: Diagram): ChordShape {
  const startFret = diagram.startFret || 1;
  const positions: ChordFingerPosition[] = [];

  for (let s = 0; s <= 5; s++) {
    const string = 5 - s; // Concordia 0 = mi grave → interne 0 = mi aigu
    const note = diagram.notes.find((n) => n.s === s);

    if (!note) {
      positions.push({ string, fret: -1 }); // absente du diagramme = muette
      continue;
    }

    const fret = note.f === -1 ? 0 : startFret + note.f;
    const fing = diagram.fingerings[String(s)];
    if (fing && /^[1-4]$/.test(fing)) {
      positions.push({ string, fret, finger: Number(fing) } satisfies ChordFingerPosition);
    } else {
      positions.push({ string, fret });
    }
  }

  const maxFret = positions.reduce((max, p) => (p.fret > max ? p.fret : max), 0);
  const frets = Math.max(4, maxFret - startFret + 1);

  return { diagram, positions, frets };
}
