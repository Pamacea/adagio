/**
 * ModesSection — modes disponibles + SubstitutionsPanel
 * (dominantes secondaires, emprunt modal, tonalités parallèles).
 */

'use client';

import { HelpButton, HelpTooltip } from '@/components/HelpProvider';
import { COMPOSE_SCALE_TYPES } from '@adagio/theory';
import type { KeyMode } from '@adagio/theory';
import type { NoteName } from '@adagio/types';
import { SubstitutionsPanel } from './SubstitutionsPanel';

export interface ModesSectionProps {
  selectedKey: NoteName;
  keyMode: KeyMode;
  /** Mode actuellement sélectionné (highlight) */
  activeScaleId?: string;
  onModeSelect?: (scaleId: string) => void;
  onSubstitutionApply?: (chord: string) => void;
}

export function ModesSection({
  selectedKey,
  keyMode,
  activeScaleId,
  onModeSelect,
  onSubstitutionApply,
}: ModesSectionProps) {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-metal text-white uppercase tracking-wider">
          Modes & Substitutions de {selectedKey} {keyMode === 'major' ? 'Majeur' : 'Mineur'}
        </h2>
        <div className="flex gap-2">
          <HelpTooltip topicId="scales.modes">
            <HelpButton topicId="scales.modes" useModal size="md" variant="subtle" />
          </HelpTooltip>
          <HelpTooltip topicId="compose.modulations">
            <HelpButton topicId="compose.modulations" useModal size="md" variant="subtle" />
          </HelpTooltip>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {/* Available scales */}
        <div className="section-frame p-4">
          <h3 className="text-sm text-gray uppercase tracking-wider mb-3">Modes disponibles</h3>
          <div className="space-y-2">
            {COMPOSE_SCALE_TYPES.map((scaleDef) => {
              const isCompatible =
                scaleDef.id === keyMode || scaleDef.id === 'dorian' || scaleDef.id === 'mixolydian';

              return (
                <button
                  key={scaleDef.id}
                  onClick={() => onModeSelect?.(scaleDef.id)}
                  aria-pressed={activeScaleId === scaleDef.id}
                  className={`w-full p-3 border-2 bg-blackness hover:border-blood transition-all text-left ${
                    activeScaleId === scaleDef.id ? 'border-blood' : 'border-steel'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-sm font-bold ${
                          activeScaleId === scaleDef.id ? 'text-blood' : 'text-white'
                        }`}
                      >
                        {scaleDef.nameFr}
                      </p>
                      <p className="text-xs text-gray">{scaleDef.intervals.join(' - ')}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 ${isCompatible ? 'bg-toxic' : 'bg-void'}`}>
                      {scaleDef.intervals.join('')}
                    </span>
                  </div>
                  <p className="text-xs text-gray mt-1">{scaleDef.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Substitutions harmoniques */}
        <SubstitutionsPanel
          root={selectedKey}
          tonality={keyMode}
          onSubstitutionApply={onSubstitutionApply}
        />
      </div>
    </div>
  );
}
