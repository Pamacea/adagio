/**
 * ADAGIO - ModeInfo Component
 * Affichage des informations du mode sélectionné
 * Nom du mode, description, et notes de la gamme en badges
 */

'use client';

import type { NoteName, ModeName } from '@adagio/types';
import { NOTE_FR } from '@/lib/theory';
import { getEmotionForMode } from '@adagio/theory';
import type { FretboardNote } from '@adagio/types';

interface ModeInfoProps {
  root: NoteName;
  mode: ModeName;
  scaleNotes: FretboardNote[];
  displayNote: (note: string) => string;
}

export function ModeInfo({ root, mode, scaleNotes, displayNote }: ModeInfoProps) {
  const emotion = getEmotionForMode(mode);

  // Extraire les notes uniques de la gamme (triées par ordre d'apparition)
  const uniqueNotes = Array.from(
    new Set(scaleNotes.filter(n => n.inScale).map(n => n.name))
  );

  return (
    <div className="section-frame p-4 mb-8 border-2 border-blood">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Mode name and description */}
        <div className="flex-1 min-w-[200px]">
          <h2 className="text-2xl font-metal text-white uppercase">
            {displayNote(root)} {emotion.name}
          </h2>
          <p className="text-sm text-gray mt-1">{mode}</p>
          <p className="text-xs text-rust mt-1">{emotion.character}</p>
        </div>

        {/* Scale notes badges */}
        <div className="flex gap-2 flex-wrap justify-end">
          {uniqueNotes.map((note) => {
            const noteData = scaleNotes.find(n => n.name === note && n.inScale);
            const isRoot = noteData?.interval === '1';
            const isFifth = noteData?.interval === '5';

            return (
              <div
                key={note}
                className={`px-3 py-1 text-sm font-bold border ${
                  isRoot
                    ? 'border-blood bg-toxic text-white'
                    : isFifth
                    ? 'border-steel bg-circuit text-white'
                    : 'border-steel bg-blackness text-gray'
                }`}
              >
                {displayNote(note)}
                {noteData?.interval && noteData.interval !== '1' && (
                  <span className="ml-1 text-xs text-gray-400">
                    {noteData.interval}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sensation/emotion tags */}
      <div className="flex gap-2 mt-3 flex-wrap">
        {emotion.sensation.split(', ').map((sensation, i) => (
          <span
            key={i}
            className="px-2 py-0.5 text-xs bg-abyss border border-steel text-gray"
          >
            {sensation}
          </span>
        ))}
      </div>
    </div>
  );
}
