/**
 * ConcordiaChordBox — diagramme d'accord issu de la base Concordia.
 *
 * Affiche la forme (voicing) trouvée dans `chords.json` avec un navigateur
 * ◀ ▶ quand plusieurs formes existent. Accord absent de la base → fallback
 * sur FretboardChord (calcul maison) pour ne jamais laisser un trou.
 */

'use client';

import { ChordDiagram } from '@adagio/ui';
import { useConcordiaChord } from '@/features/theory/hooks/useConcordiaChord';
import { FretboardChord } from './FretboardChord';

export interface ConcordiaChordBoxProps {
  /** Accord au format interne ex. « C », « Dbmaj7 », « Bm7b5 » */
  chord: string;
  className?: string;
}

const NAV_BUTTON =
  'w-8 h-8 border-2 border-steel text-gray font-bold hover:border-blood hover:text-white transition-colors flex items-center justify-center';

export function ConcordiaChordBox({ chord, className }: ConcordiaChordBoxProps) {
  const { shapes, index, setIndex, shape } = useConcordiaChord(chord);

  if (!shape) {
    return <FretboardChord chord={chord} width={280} height={200} />;
  }

  const count = shapes.length;

  return (
    <div className={`flex flex-col items-center gap-3 ${className ?? ''}`}>
      <ChordDiagram
        name={shape.diagram.name}
        positions={shape.positions}
        frets={shape.frets}
        stringOrder="low-first"
      />

      {count > 1 && (
        <div className="flex items-center gap-4">
          <button
            type="button"
            className={NAV_BUTTON}
            aria-label="Forme précédente"
            onClick={() => setIndex((index - 1 + count) % count)}
          >
            ◀
          </button>
          <span className="text-xs text-gray font-mono tracking-wider">
            Forme {index + 1}/{count}
          </span>
          <button
            type="button"
            className={NAV_BUTTON}
            aria-label="Forme suivante"
            onClick={() => setIndex((index + 1) % count)}
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
}
