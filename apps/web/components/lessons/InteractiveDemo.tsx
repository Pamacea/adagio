/**
 * ADAGIO - InteractiveDemo Component
 * Composant principal qui instancie les démos interactives
 * Réutilise les composants theory existants
 */

'use client';

import { useState } from 'react';
import type { NoteName, ModeName } from '@adagio/types';
import { FretboardDisplay } from '@/components/theory/fretboard/FretboardDisplay';
import { CircleOfFifths } from '@/components/theory/circle/CircleOfFifths';
import { ModeCircle } from '@/components/theory/modes/ModeCircle';
import type { DemoBlock, DemoConfig } from '@adagio/theory';

// ============================================================================
// TYPES
// ============================================================================

export interface InteractiveDemoProps {
  block: DemoBlock;
  onEvent?: (event: DemoEvent) => void;
}

export type DemoEvent =
  | { type: 'note_click'; note: NoteName; string: number; fret: number }
  | { type: 'mode_change'; mode: ModeName }
  | { type: 'key_change'; key: string }
  | { type: 'chord_change'; chord: string }
  | { type: 'quiz_complete'; score: number; passed: boolean };

// Modes grecs dans l'ordre
const ALL_MODES: ModeName[] = [
  'ionian',
  'dorian',
  'phrygian',
  'lydian',
  'mixolydian',
  'aeolian',
  'locrian',
];

// ============================================================================
// COMPONENT
// ============================================================================

export function InteractiveDemo({ block, onEvent }: InteractiveDemoProps) {
  const { component, config, title, description } = block;

  // États internes pour chaque type de composant
  const [selectedMode, setSelectedMode] = useState<ModeName>(
    (config.modes?.selectedMode as ModeName) || 'dorian'
  );
  const [selectedKey, setSelectedKey] = useState(
    config.circle?.selectedKey || 'C'
  );

  // Rendu selon le type de composant
  const renderComponent = () => {
    switch (component) {
      case 'fretboard':
        return config.fretboard ? (
          <FretboardDisplay
            root={config.fretboard.root as NoteName}
            mode={config.fretboard.mode}
            fretCount={config.fretboard.fretCount ?? 12}
            showAllNotes={config.fretboard.showAllNotes ?? false}
          />
        ) : null;

      case 'circle':
        return config.circle ? (
          <CircleOfFifths
            selectedKey={selectedKey}
            onKeyChange={(key) => {
              setSelectedKey(key);
              onEvent?.({ type: 'key_change', key });
            }}
            diatonicChords={config.circle.diatonicChords}
            isMinor={config.circle.isMinor ?? false}
          />
        ) : null;

      case 'modes':
        return config.modes ? (
          <ModeCircle
            modes={ALL_MODES}
            selectedMode={selectedMode}
            onSelect={(mode) => {
              setSelectedMode(mode);
              onEvent?.({ type: 'mode_change', mode });
            }}
          />
        ) : null;

      case 'chords':
        return (
          <div className="section-frame p-6 text-center text-gray">
            Composant accords bientôt disponible...
          </div>
        );

      case 'notation':
        return (
          <div className="section-frame p-6 text-center text-gray">
            Composant notation bientôt disponible...
          </div>
        );

      default:
        return (
          <div className="section-frame p-6 text-center text-blood">
            Composant inconnu: {component}
          </div>
        );
    }
  };

  return (
    <div className="my-6">
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-metal text-white uppercase mb-2 flex items-center gap-2">
              <span className="w-1 h-6 bg-toxic" />
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray pl-4 border-l-2 border-steel">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="interactive-demo">
        {renderComponent()}
      </div>
    </div>
  );
}
