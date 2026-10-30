/**
 * Adapter Concordia → ChordDiagram (`@adagio/ui`).
 *
 * Conversion des coordonnées Concordia vers le format du composant :
 * - cordes : Concordia 0 = mi grave → ChordDiagram 0 = mi grave (identique)
 * - cases : relatives (`abs = startFret + f`) → absolues, -1 (vide) → 0
 * - doigtage : '1'..'4' → finger, 'X'/absent → corde muette
 */

import type { ChordFingerPosition } from '@adagio/ui';
import type { ChordQuality, NoteName } from '@adagio/types';
import { GUITAR_TUNING, getIntervalInChord, transposeNote } from '@adagio/theory';
import { parseChordName } from './match';
import type { Diagram } from './types';

export interface ChordShape {
  diagram: Diagram;
  /** 6 positions (0 = mi grave, 5 = mi aigu) */
  positions: ChordFingerPosition[];
  /** Nombre de cases à afficher (min 4, sinon toutes les cases utiles) */
  frets: number;
}

/** Convertit un diagramme Concordia en positions prêtes pour ChordDiagram. */
export function toChordShape(diagram: Diagram): ChordShape {
  const startFret = diagram.startFret || 1;
  // Racine + qualité du nom (« G Majeur (…) » → G / '') pour l'intervalle.
  const ref = parseChordName(diagram.name);
  const positions: ChordFingerPosition[] = [];

  for (let s = 0; s <= 5; s++) {
    const string = s; // Concordia 0 = mi grave = ChordDiagram 0
    const note = diagram.notes.find((n) => n.s === s);

    if (!note) {
      positions.push({ string, fret: -1 }); // absente du diagramme = muette
      continue;
    }

    const fret = note.f === -1 ? 0 : startFret + note.f;
    const position: ChordFingerPosition = { string, fret };

    // Couleur Concordia : intervalle de la note jouée par rapport à la racine.
    if (ref) {
      const playedNote = transposeNote(GUITAR_TUNING[s] as NoteName, fret);
      position.interval = getIntervalInChord(
        ref.root as NoteName,
        playedNote,
        ref.quality as ChordQuality
      );
    }

    const fing = diagram.fingerings[String(s)];
    if (fing && /^[1-4]$/.test(fing)) position.finger = Number(fing);

    positions.push(position);
  }

  const maxFret = positions.reduce((max, p) => (p.fret > max ? p.fret : max), 0);
  const frets = Math.max(4, maxFret - startFret + 1);

  return { diagram, positions, frets };
}
