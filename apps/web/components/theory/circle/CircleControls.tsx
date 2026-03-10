/**
 * ADAGIO - CircleControls Component
 * Contrôles pour la sélection de tonique et affichage des accords
 */

'use client';

import { CIRCLE_OF_FIFTHS } from './CircleOfFifths';

// ============================================================================
// TYPES
// ============================================================================

export interface CircleControlsProps {
  /** Tonique actuellement sélectionnée */
  selectedKey: string;
  /** Callback lors du changement de tonique */
  onKeyChange: (key: string) => void;
  /** Afficher ou masquer les accords */
  showChords?: boolean;
  /** Callback pour toggle l'affichage des accords */
  onToggleChords?: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function CircleControls({
  selectedKey,
  onKeyChange,
  showChords = true,
  onToggleChords,
}: CircleControlsProps) {
  return (
    <div className="section-frame p-4 mb-6">
      {/* Sélecteur de tonique */}
      <div className="mb-4">
        <label className="text-xs text-gray uppercase tracking-wider block mb-2">
          Tonique
        </label>
        <div className="flex flex-wrap gap-2">
          {CIRCLE_OF_FIFTHS.map((note) => (
            <button
              key={note}
              onClick={() => onKeyChange(note)}
              className={`
                px-3 py-2 text-sm font-bold border-2 transition-all
                ${selectedKey === note
                  ? 'bg-blood border-blood text-white'
                  : 'bg-blackness border-steel text-gray hover:border-blood hover:text-white'
                }
              `}
            >
              {note}
            </button>
          ))}
        </div>
      </div>

      {/* Toggle affichage accords */}
      {onToggleChords && (
        <div className="flex items-center justify-between pt-3 border-t border-steel">
          <span className="text-xs text-gray uppercase">Afficher les accords</span>
          <button
            onClick={onToggleChords}
            className={`
              px-4 py-2 text-xs font-bold uppercase border-2 transition-all
              ${showChords
                ? 'bg-toxic border-blood text-white'
                : 'bg-blackness border-steel text-gray hover:border-blood'
              }
            `}
          >
            {showChords ? 'ON' : 'OFF'}
          </button>
        </div>
      )}
    </div>
  );
}
