/**
 * ADAGIO - ComposeControls Component
 * Contrôles pour la sélection de tonalité (tonique, mode, gamme)
 */

'use client';

import type { NoteName } from '@adagio/types';
import { CHROMATIC, FRENCH_NOTE_NAMES } from '@adagio/theory';

// ============================================================================
// TYPES
// ============================================================================

export interface ComposeControlsProps {
  /** Tonique sélectionnée */
  root: NoteName;
  /** Callback changement de tonique */
  onRootChange: (root: NoteName) => void;
  /** Mode majeur/mineur */
  tonality: 'major' | 'minor';
  /** Callback changement de mode */
  onTonalityChange: (tonality: 'major' | 'minor') => void;
  /** Type de gamme sélectionné */
  scaleType: string;
  /** Callback changement de type de gamme */
  onScaleTypeChange: (scaleType: string) => void;
}

// ============================================================================
// SCALE TYPES
// ============================================================================

const SCALE_TYPES = [
  { id: 'major', name: 'Majeure', fr: 'Ionien' },
  { id: 'minor', name: 'Mineure naturelle', fr: 'Aéolien' },
  { id: 'harmonic-minor', name: 'Mineure harmonique', fr: 'Harmonique' },
  { id: 'melodic-minor', name: 'Mineure mélodique', fr: 'Mélodique' },
  { id: 'pentatonic-major', name: 'Pentatonique majeure', fr: 'Penta Majeur' },
  { id: 'pentatonic-minor', name: 'Pentatonique mineure', fr: 'Penta Mineur' },
  { id: 'blues', name: 'Blues', fr: 'Blues' },
  { id: 'dorian', name: 'Dorien', fr: 'ii majeur' },
  { id: 'phrygian', name: 'Phrygien', fr: 'iii majeur' },
  { id: 'lydian', name: 'Lydien', fr: 'IV majeur' },
  { id: 'mixolydian', name: 'Mixolydien', fr: 'V majeur' },
] as const;

// ============================================================================
// COMPONENT
// ============================================================================

export function ComposeControls({
  root,
  onRootChange,
  tonality,
  onTonalityChange,
  scaleType,
  onScaleTypeChange,
}: ComposeControlsProps) {
  return (
    <div className="section-frame p-4 mb-6">
      <h3 className="text-sm font-metal text-blood mb-4 tracking-wider uppercase">
        Tonalité
      </h3>

      {/* Sélecteur de tonique */}
      <div className="mb-4">
        <label className="text-xs text-gray uppercase tracking-wider block mb-2">
          Tonique
        </label>
        <div className="flex flex-wrap gap-1">
          {CHROMATIC.map((note) => {
            const isSharp = note.includes('#');
            return (
              <button
                key={note}
                onClick={() => onRootChange(note as NoteName)}
                className={`
                  px-2 py-1 text-xs font-bold border-2 transition-all
                  ${root === note
                    ? 'bg-blood border-blood text-white'
                    : 'bg-blackness border-steel text-gray hover:border-rust hover:text-white'
                  }
                `}
                title={FRENCH_NOTE_NAMES[note] || note}
              >
                {note}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toggle majeur/mineur */}
      <div className="mb-4">
        <label className="text-xs text-gray uppercase tracking-wider block mb-2">
          Mode
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => onTonalityChange('major')}
            className={`
              flex-1 px-4 py-2 text-xs font-bold uppercase border-2 transition-all
              ${tonality === 'major'
                ? 'bg-toxic border-blood text-white'
                : 'bg-blackness border-steel text-gray hover:border-blood'
              }
            `}
          >
              Majeur
          </button>
          <button
            onClick={() => onTonalityChange('minor')}
            className={`
              flex-1 px-4 py-2 text-xs font-bold uppercase border-2 transition-all
              ${tonality === 'minor'
                ? 'bg-toxic border-blood text-white'
                : 'bg-blackness border-steel text-gray hover:border-blood'
              }
            `}
          >
            Mineur
          </button>
        </div>
      </div>

      {/* Sélecteur de gamme */}
      <div>
        <label className="text-xs text-gray uppercase tracking-wider block mb-2">
          Type de gamme
        </label>
        <select
          value={scaleType}
          onChange={(e) => onScaleTypeChange(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-blackness border-2 border-steel text-white focus:border-blood focus:outline-none uppercase font-bold"
        >
          {SCALE_TYPES.map((scale) => (
            <option key={scale.id} value={scale.id}>
              {scale.name} ({scale.fr})
            </option>
          ))}
        </select>
      </div>

      {/* Affichage de la tonalité actuelle */}
      <div className="mt-4 pt-4 border-t border-steel flex items-center justify-between">
        <span className="text-xs text-gray uppercase">Tonalité actuelle</span>
        <span className="text-lg font-metal text-blood">
          {root}{tonality === 'major' ? ' maj' : ' min'}
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// UTILS
// ============================================================================

const NOTE_FR: Record<string, string> = {
  'C': 'DO', 'C#': 'DO♯', 'Db': 'RÉ♭',
  'D': 'RÉ', 'D#': 'RÉ♯', 'Eb': 'MI♭',
  'E': 'MI',
  'F': 'FA', 'F#': 'FA♯', 'Gb': 'SOL♭',
  'G': 'SOL', 'G#': 'SOL♯', 'Ab': 'LA♭',
  'A': 'LA', 'A#': 'LA♯', 'Bb': 'SI♭',
  'B': 'SI',
};
