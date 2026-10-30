/**
 * KeyCircle — sélecteur de tonalité en cercle des quintes.
 *
 * L'anneau extérieur choisit une tonalité majeure, l'anneau intérieur une mineure :
 * un seul geste remplace les deux sélecteurs « tonalité » + « majeur/mineur ».
 */

'use client';

import type { NoteName } from '@adagio/types';
import type { KeyMode } from '@adagio/theory';
import { CircleOfFifths } from '@/components/theory/circle/CircleOfFifths';

export interface KeyCircleProps {
  selectedKey: NoteName;
  keyMode: KeyMode;
  onChange: (key: NoteName, mode: KeyMode) => void;
  /** Accords diatoniques de la tonalité courante, pour surligner le cercle */
  diatonicChords?: string[];
  /** Largeur maximale du cercle, en pixels */
  size?: number;
}

export function KeyCircle({
  selectedKey,
  keyMode,
  onChange,
  diatonicChords = [],
  size = 320,
}: KeyCircleProps) {
  return (
    <div className="mx-auto" style={{ maxWidth: `${size}px` }}>
      <CircleOfFifths
        selectedKey={keyMode === 'minor' ? `${selectedKey}m` : selectedKey}
        diatonicChords={diatonicChords}
        compact
        onKeyChange={(value) => {
          const minor = value.endsWith('m');
          onChange((minor ? value.slice(0, -1) : value) as NoteName, minor ? 'minor' : 'major');
        }}
      />
    </div>
  );
}
