/**
 * ADAGIO - ScaleSelector Component
 * Sélecteur de tonique et de gamme pour la page Scales
 */

'use client';

import type { NoteName } from '@adagio/types';

// Liste des notes pour le sélecteur de tonique
const NOTES: NoteName[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

// Types de gammes disponibles
export type ScaleType =
  | 'major' | 'minor'
  | 'harmonicMajor' | 'harmonicMinor'
  | 'melodicMajor' | 'melodicMinor'
  | 'pentatonicMajor' | 'pentatonicMinor'
  | 'blues'
  | 'dorian' | 'phrygian' | 'lydian' | 'mixolydian' | 'locrian'
  | 'napolitanMajor' | 'napolitanMinor'
  | 'augmentedMajor' | 'augmentedMinor'
  | 'wholeTone' | 'diminished'
  | 'chromatic';

export interface ScaleDefinition {
  id: ScaleType;
  name: string;
  nameFr: string;
  description: string;
  intervals: string[];
}

export interface ScaleCategory {
  name: string;
  ids: ScaleType[];
}

interface ScaleSelectorProps {
  currentRoot: NoteName;
  currentScale: ScaleType;
  fretCount: 12 | 15 | 17 | 19 | 21 | 24;
  showAllNotes: boolean;
  onRootChange: (root: NoteName) => void;
  onScaleChange: (scale: ScaleType) => void;
  onFretCountChange: (count: 12 | 15 | 17 | 19 | 21 | 24) => void;
  onShowAllNotesChange: (show: boolean) => void;
  scaleCategories: readonly ScaleCategory[];
  scales: readonly ScaleDefinition[];
}

export function ScaleSelector({
  currentRoot,
  currentScale,
  fretCount,
  showAllNotes,
  onRootChange,
  onScaleChange,
  onFretCountChange,
  onShowAllNotesChange,
  scaleCategories,
  scales,
}: ScaleSelectorProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
      {/* Sélecteur de tonique */}
      <div className="section-frame p-4">
        <label className="text-xs text-gray uppercase tracking-wider mb-3 block">
          TONIQUE
        </label>
        <div className="grid grid-cols-6 gap-2">
          {NOTES.map(note => (
            <button
              key={note}
              onClick={() => onRootChange(note)}
              className={`py-2 text-sm font-bold border-2 transition-all ${
                currentRoot === note
                  ? 'border-blood bg-toxic text-white'
                  : 'border-steel bg-abyss text-gray hover:border-white'
              }`}
            >
              {note}
            </button>
          ))}
        </div>
      </div>

      {/* Sélecteur de gamme */}
      <div className="section-frame p-4 lg:col-span-2">
        <label className="text-xs text-gray uppercase tracking-wider mb-3 block">
          TYPE DE GAMME ({scales.length})
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scaleCategories.map(category => (
            <div key={category.name}>
              <p className="text-xs text-gray uppercase mb-2">{category.name}</p>
              <div className="flex flex-wrap gap-2">
                {category.ids.map(scaleId => {
                  const scaleDef = scales.find(s => s.id === scaleId);
                  if (!scaleDef) return null;
                  return (
                    <button
                      key={scaleId}
                      onClick={() => onScaleChange(scaleId)}
                      className={`text-xs px-3 py-2 border-2 transition-all ${
                        currentScale === scaleId
                          ? 'border-blood bg-toxic text-white'
                          : 'border-steel bg-abyss text-gray hover:border-white hover:text-white'
                      }`}
                    >
                      {scaleDef.nameFr}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Options d'affichage */}
      <div className="section-frame p-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-end">
          {/* Fret count */}
          <div className="flex-1">
            <label className="text-xs text-gray uppercase tracking-wider block mb-2">
              FRETTES
            </label>
            <div className="flex gap-1">
              {([12, 15, 17, 19, 21, 24] as const).map(f => (
                <button
                  key={f}
                  onClick={() => onFretCountChange(f)}
                  className={`px-3 py-2 text-sm font-bold border-2 transition-all ${
                    fretCount === f
                      ? 'border-blood bg-toxic text-white'
                      : 'border-steel bg-abyss text-gray hover:border-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Show all notes toggle */}
          <div>
            <label className="text-xs text-gray uppercase tracking-wider block mb-2">
              AFFICHAGE
            </label>
            <button
              onClick={() => onShowAllNotesChange(!showAllNotes)}
              className={`px-4 py-2 text-sm font-bold uppercase border-2 transition-all ${
                showAllNotes
                  ? 'border-steel bg-abyss text-gray'
                  : 'border-blood bg-toxic text-white'
              }`}
            >
              {showAllNotes ? 'MODE SEUL' : 'TOUTES NOTES'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
