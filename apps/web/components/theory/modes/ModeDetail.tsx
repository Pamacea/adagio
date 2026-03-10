/**
 * ADAGIO - ModeDetail Component
 * Détails du mode sélectionné avec notes et description
 */

'use client';

import type { ModeName } from '@adagio/types';
import type { EmotionMapping } from '@adagio/theory';

interface ModeDetailProps {
  root: string;
  selectedMode: ModeName;
  modeInfo: EmotionMapping;
  modeNotes: string[];
  modeDegrees: string[];
  modeDegreesDynamic: string[];
  noteFr: Record<string, string>;
  modeColor: string;
}

export function ModeDetail({
  root,
  selectedMode,
  modeInfo,
  modeNotes,
  modeDegrees,
  modeDegreesDynamic,
  noteFr,
  modeColor,
}: ModeDetailProps) {
  const modeDescriptions: Record<ModeName, string> = {
    ionian: "C'est la gamme majeure naturelle, la base de la musique occidentale.",
    dorian: "Souvent utilisé dans le jazz et le rock, il apporte une touche soulful.",
    phrygian: "Très présent dans la musique flamenco et espagnole.",
    lydian: "Donne une impression de rêve et de mystère, très utilisé dans les films.",
    mixolydian: "Le mode du blues et du rock, énergique et dominant.",
    aeolian: "La gamme mineure naturelle, mélancolique et émotive.",
    locrian: "Le mode le plus instable, créant une tension extrême.",
  };

  return (
    <div className={`section-frame p-6 border-2 ${modeColor}`}>
      {/* Mode header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-3xl font-metal text-white uppercase">
            {modeInfo.name}
          </h2>
          <p className="text-blood font-bold mt-1">{modeInfo.character}</p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-metal text-white">
            {noteFr[root] || root}
          </p>
          <p className="text-xs text-gray uppercase">{selectedMode}</p>
        </div>
      </div>

      {/* Emotion tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="px-3 py-1 text-xs font-bold uppercase border-2 border-steel bg-blackness">
          {modeInfo.sensation}
        </span>
        {modeInfo.feeling && (
          <span className="px-3 py-1 text-xs font-bold uppercase border-2 border-steel bg-blackness">
            {modeInfo.feeling}
          </span>
        )}
      </div>

      {/* Mode notes */}
      <div className="border-2 border-steel bg-blackness p-4 mb-6">
        <p className="text-xs text-gray uppercase tracking-wider mb-3">
          Notes du mode
        </p>
        <div className="flex gap-2">
          {modeNotes.map((note, i) => {
            const degree = modeDegrees[i];
            const degreeDynamic = modeDegreesDynamic[i];
            const isRoot = i === 0;

            return (
              <div
                key={note}
                className={`flex-1 text-center p-3 border-2 ${
                  isRoot ? 'border-blood bg-toxic' : 'border-steel bg-void'
                }`}
              >
                <p className={`text-2xl font-metal ${isRoot ? 'text-white' : 'text-gray'}`}>
                  {noteFr[note] || note}
                </p>
                <p className={`text-sm font-mono mt-1 ${isRoot ? 'text-blood' : 'text-gray'}`}>
                  {degreeDynamic}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Description */}
      <div className="border-2 border-steel bg-blackness p-4">
        <p className="text-sm text-gray leading-relaxed">
          Le mode <span className="text-white font-bold">{modeInfo.name.toLowerCase()}</span> est
          caractérisé par son ambiance <span className="text-blood">{modeInfo.character.toLowerCase()}</span>.
          {modeDescriptions[selectedMode]}
        </p>
      </div>
    </div>
  );
}
