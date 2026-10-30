/**
 * KeySelector — sélecteur de tonalité en cercle des quintes.
 * L'anneau extérieur choisit une tonalité majeure, l'anneau intérieur une mineure.
 */

'use client';

import type { KeyMode } from '@adagio/theory';
import type { NoteName } from '@adagio/types';
import { KeyCircle } from '@/components/ui';

export interface KeySelectorProps {
  selectedKey: NoteName;
  keyMode: KeyMode;
  onKeyChange: (key: NoteName) => void;
  onModeChange: (mode: KeyMode) => void;
  /** Accords diatoniques de la tonalité courante, pour surligner le cercle */
  diatonicChords?: string[];
}

export function KeySelector({
  selectedKey,
  keyMode,
  onKeyChange,
  onModeChange,
  diatonicChords = [],
}: KeySelectorProps) {
  return (
    <div>
      <p className="field-label">Tonalité</p>
      <KeyCircle
        selectedKey={selectedKey}
        keyMode={keyMode}
        diatonicChords={diatonicChords}
        onChange={(key, mode) => {
          if (key !== selectedKey) onKeyChange(key);
          if (mode !== keyMode) onModeChange(mode);
        }}
      />
    </div>
  );
}
