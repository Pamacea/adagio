/**
 * KeySelector — sélecteur de tonalité et de mode (majeur/mineur).
 */

'use client';

import { FRENCH_NOTE_NAMES as NOTE_FR, MAJOR_KEYS } from '@adagio/theory';
import type { KeyMode } from '@adagio/theory';
import type { NoteName } from '@adagio/types';

export interface KeySelectorProps {
  selectedKey: NoteName;
  keyMode: KeyMode;
  onKeyChange: (key: NoteName) => void;
  onModeChange: (mode: KeyMode) => void;
}

export function KeySelector({ selectedKey, keyMode, onKeyChange, onModeChange }: KeySelectorProps) {
  return (
    <div className="section-frame p-4 mb-8">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray uppercase tracking-wider">TONALITÉ</p>
        {/* Mode toggle */}
        <div className="flex gap-1 border-2 border-steel rounded overflow-hidden">
          <button
            onClick={() => onModeChange('major')}
            className={`px-3 py-1 text-xs font-bold uppercase transition-all ${
              keyMode === 'major' ? 'bg-toxic text-black' : 'bg-abyss text-gray hover:text-white'
            }`}
          >
            Majeur
          </button>
          <button
            onClick={() => onModeChange('minor')}
            className={`px-3 py-1 text-xs font-bold uppercase transition-all ${
              keyMode === 'minor' ? 'bg-toxic text-black' : 'bg-abyss text-gray hover:text-white'
            }`}
          >
            Mineur
          </button>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {MAJOR_KEYS.map((key) => {
          const isSelected = selectedKey === key;
          return (
            <button
              key={key}
              onClick={() => onKeyChange(key)}
              className={`px-4 py-2 text-sm font-bold uppercase border-2 transition-all ${
                isSelected
                  ? 'border-blood bg-toxic text-white scale-105'
                  : 'border-steel bg-abyss text-gray hover:border-white'
              }`}
            >
              {key} {isSelected && `(${NOTE_FR[key] || key})`}
            </button>
          );
        })}
      </div>
    </div>
  );
}
