/**
 * ADAGIO - ModeList Component
 * Grille de cartes pour les modes grecs
 */

'use client';

import { getEmotionForMode } from '@adagio/theory';
import type { ModeName } from '@adagio/types';

interface ModeListProps {
  modes: ModeName[];
  selectedMode: ModeName;
  onSelect: (mode: ModeName) => void;
}

export function ModeList({ modes, selectedMode, onSelect }: ModeListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {modes.map(mode => {
        const info = getEmotionForMode(mode);
        const isActive = mode === selectedMode;

        return (
          <button
            key={mode}
            onClick={() => onSelect(mode)}
            className={`section-frame p-4 text-left transition-all hover:border-blood ${
              isActive ? 'border-blood' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-metal text-white uppercase">{info.name}</h3>
              <div className={`w-3 h-3 border-2 ${isActive ? 'border-blood bg-blood' : 'border-steel'}`} />
            </div>
            <p className="text-xs text-blood font-bold uppercase mb-1">{info.character}</p>
            <p className="text-sm text-gray">{info.sensation}</p>
          </button>
        );
      })}
    </div>
  );
}
