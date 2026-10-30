/**
 * ADAGIO - ScaleNotesDisplay Component
 * Affichage des notes de la gamme avec couleurs de degrés
 */

'use client';

import type { NoteName } from '@adagio/types';
import {
  FRENCH_NOTE_NAMES,
  ROMAN_NUMERALS_MAJOR,
  ROMAN_NUMERALS_MINOR,
} from '@adagio/theory';

export interface ScaleNotesDisplayProps {
  scaleNotes: string[];
  keyMode: 'major' | 'minor';
  selectedKey: NoteName;
  /** Joue la gamme en montage */
  onPlayScale?: () => void;
}

export function ScaleNotesDisplay({
  scaleNotes,
  keyMode,
  selectedKey,
  onPlayScale,
}: ScaleNotesDisplayProps) {
  const numerals = keyMode === 'major' ? ROMAN_NUMERALS_MAJOR : ROMAN_NUMERALS_MINOR;

  return (
    <div className="panel space-y-2 p-3">
      <div className="flex items-center justify-between gap-6">
        <p className="field-label mb-0 text-gold">
          Gamme de {selectedKey} {keyMode === 'major' ? 'Majeur' : 'Mineur naturel'}
        </p>
        {onPlayScale && (
          <button
            type="button"
            onClick={onPlayScale}
            aria-label="Écouter la gamme"
            className="shrink-0 px-2.5 text-xs font-bold uppercase tracking-wider text-gray/70 hover:text-rust"
          >
            ▶ Écouter
          </button>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-x-7 gap-y-4">
        {scaleNotes.map((note, i) => {
          const isTonic = i === 0;
          return (
            <div key={note} className="flex flex-col items-center gap-1.5">
              <span
                className="h-1.5 w-1.5"
                style={{ backgroundColor: isTonic ? '#8b1a1a' : '#2a2a2a' }}
                aria-hidden
              />
              <span className="text-xl font-sans text-white">
                {FRENCH_NOTE_NAMES[note] || note}
              </span>
              <span
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: isTonic ? '#b84a1a' : '#666666' }}
              >
                {numerals[i]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
