/**
 * ADAGIO - ScaleNotesDisplay Component
 * Affichage des notes de la gamme avec couleurs de degrés
 */

'use client';

import type { NoteName } from '@adagio/types';
import { FRENCH_NOTE_NAMES, DEGREE_COLORS, ROMAN_NUMERALS_MAJOR, ROMAN_NUMERALS_MINOR } from '@adagio/theory';

export interface ScaleNotesDisplayProps {
  scaleNotes: string[];
  keyMode: 'major' | 'minor';
  selectedKey: NoteName;
}

export function ScaleNotesDisplay({
  scaleNotes,
  keyMode,
  selectedKey,
}: ScaleNotesDisplayProps) {
  const numerals = keyMode === 'major' ? ROMAN_NUMERALS_MAJOR : ROMAN_NUMERALS_MINOR;

  return (
    <div className="section-frame p-6 mb-8">
      <p className="text-xs text-gray uppercase tracking-wider mb-4">
        Gamme de {selectedKey} {keyMode === 'major' ? 'Majeur' : 'Mineur Naturel'}
      </p>
      <div className="flex gap-3 justify-center">
        {scaleNotes.map((note, i) => {
          const color = DEGREE_COLORS[i];
          return (
            <div key={note} className="flex-1 text-center">
              <div
                className="w-full aspect-square border-2 flex items-center justify-center mb-2"
                style={{
                  backgroundColor: color + '30',
                  borderColor: color
                }}
              >
                <span className="text-xl font-black" style={{ color }}>
                  {FRENCH_NOTE_NAMES[note] || note}
                </span>
              </div>
              <span className="text-xs text-gray">{numerals[i]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
