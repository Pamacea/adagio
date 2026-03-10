/**
 * ADAGIO - FretboardControls Component
 * Contrôles pour la page fretboard
 * Sélecteur de tonique, mode, nombre de frettes, et options d'affichage
 */

'use client';

import type { NoteName, ModeName } from '@adagio/types';
import { NOTE_FR } from '@/lib/theory';

// Toutes les notes chromatiques (avec dièses)
const CHROMATIC_ROOTS: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Modes grecs disponibles
const GREEK_MODES: ModeName[] = [
  'ionian',
  'dorian',
  'phrygian',
  'lydian',
  'mixolydian',
  'aeolian',
  'locrian',
];

// Noms français des modes
const MODE_FR_NAMES: Record<ModeName, string> = {
  ionian: 'Majeur',
  dorian: 'Dorien',
  phrygian: 'Phrygien',
  lydian: 'Lydien',
  mixolydian: 'Mixolydien',
  aeolian: 'Mineur',
  locrian: 'Locrien',
};

// Options de nombre de frettes
const FRET_COUNT_OPTIONS = [12, 15, 17, 19, 21, 24] as const;
type FretCountOption = typeof FRET_COUNT_OPTIONS[number];

interface FretboardControlsProps {
  currentRoot: NoteName;
  currentMode: ModeName;
  fretCount: FretCountOption;
  showAllNotes: boolean;
  onRootChange: (root: NoteName) => void;
  onModeChange: (mode: ModeName) => void;
  onFretCountChange: (count: FretCountOption) => void;
  onToggleNotes: () => void;
}

export function FretboardControls({
  currentRoot,
  currentMode,
  fretCount,
  showAllNotes,
  onRootChange,
  onModeChange,
  onFretCountChange,
  onToggleNotes,
}: FretboardControlsProps) {
  const displayNote = (note: NoteName): string => {
    return NOTE_FR[note] || note;
  };

  return (
    <div className="section-frame p-4 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Root selection */}
        <div>
          <label className="text-xs text-gray uppercase tracking-wider block mb-2">
            TONIQUE
          </label>
          <div className="flex flex-wrap gap-1">
            {CHROMATIC_ROOTS.map(root => (
              <button
                key={root}
                onClick={() => onRootChange(root)}
                className={`px-3 py-2 text-sm font-bold uppercase border-2 transition-all ${
                  currentRoot === root
                    ? 'border-blood bg-toxic text-white'
                    : 'border-steel bg-abyss text-gray hover:border-white'
                }`}
                aria-label={`Note ${displayNote(root)}`}
                aria-pressed={currentRoot === root}
              >
                {displayNote(root)}
              </button>
            ))}
          </div>
        </div>

        {/* Mode selection */}
        <div>
          <label className="text-xs text-gray uppercase tracking-wider block mb-2">
            MODE
          </label>
          <select
            value={currentMode}
            onChange={(e) => onModeChange(e.target.value as ModeName)}
            className="w-full px-3 py-2 text-sm font-bold uppercase border-2 border-steel bg-abyss text-white"
          >
            {GREEK_MODES.map(mode => (
              <option key={mode} value={mode}>
                {MODE_FR_NAMES[mode]}
              </option>
            ))}
          </select>
        </div>

        {/* Fret count */}
        <div>
          <label className="text-xs text-gray uppercase tracking-wider block mb-2">
            FRETTES
          </label>
          <div className="flex gap-1 flex-wrap">
            {FRET_COUNT_OPTIONS.map(frets => (
              <button
                key={frets}
                onClick={() => onFretCountChange(frets)}
                className={`px-3 py-2 text-sm font-bold border-2 transition-all ${
                  fretCount === frets
                    ? 'border-blood bg-toxic text-white'
                    : 'border-steel bg-abyss text-gray hover:border-white'
                }`}
                aria-label={`${frets} frettes`}
                aria-pressed={fretCount === frets}
              >
                {frets}
              </button>
            ))}
          </div>
        </div>

        {/* Display toggle */}
        <div>
          <label className="text-xs text-gray uppercase tracking-wider block mb-2">
            AFFICHAGE
          </label>
          <button
            onClick={onToggleNotes}
            className={`w-full px-4 py-2 text-sm font-bold uppercase border-2 transition-all ${
              showAllNotes
                ? 'border-blood bg-toxic text-white'
                : 'border-steel bg-abyss text-gray hover:border-white'
            }`}
            aria-pressed={showAllNotes}
          >
            {showAllNotes ? 'MODE SEUL' : 'TOUTES NOTES'}
          </button>
        </div>
      </div>
    </div>
  );
}

export type { FretCountOption };
