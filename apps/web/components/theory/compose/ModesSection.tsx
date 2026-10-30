/**
 * ModesSection — modes disponibles pour la tonalité courante.
 */

'use client';

import { HelpButton, HelpTooltip } from '@/components/HelpProvider';
import { COMPOSE_SCALE_TYPES } from '@adagio/theory';
import type { KeyMode } from '@adagio/theory';
import type { NoteName } from '@adagio/types';

export interface ModesSectionProps {
  selectedKey: NoteName;
  keyMode: KeyMode;
  /** Mode actuellement sélectionné (highlight) */
  activeScaleId?: string;
  onModeSelect?: (scaleId: string) => void;
}

export function ModesSection({
  selectedKey,
  keyMode,
  activeScaleId,
  onModeSelect,
}: ModesSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-6">
        <h2 className="field-label mb-0 text-gold">
          Modes & substitutions de {selectedKey} {keyMode === 'major' ? 'Majeur' : 'Mineur'}
        </h2>
        <div className="flex shrink-0 gap-2">
          <HelpTooltip topicId="scales.modes">
            <HelpButton topicId="scales.modes" useModal size="md" variant="subtle" />
          </HelpTooltip>
          <HelpTooltip topicId="compose.modulations">
            <HelpButton topicId="compose.modulations" useModal size="md" variant="subtle" />
          </HelpTooltip>
        </div>
      </div>
      <div>
        <p className="field-label mb-0 text-gold">Modes disponibles</p>
        <div className="mt-2">
          {COMPOSE_SCALE_TYPES.map((scaleDef) => {
            const isActive = activeScaleId === scaleDef.id;

            return (
              <button
                key={scaleDef.id}
                onClick={() => onModeSelect?.(scaleDef.id)}
                aria-pressed={isActive}
                className={`flex w-full items-baseline justify-between gap-4 border-t border-steelwarm px-2.5 py-2.5 text-left transition-colors hover:bg-raised/60 ${
                  isActive ? 'bg-amber-400/20' : ''
                }`}
              >
                <span className="min-w-0">
                  <span className="text-[13px] text-white">{scaleDef.nameFr}</span>
                  <span className="ml-3 text-[11px] text-gray/70">
                    {scaleDef.intervals.join(' – ')}
                  </span>
                  <span className="mt-1 block text-[11px] text-gray">
                    {scaleDef.description}
                  </span>
                </span>
                <span className="shrink-0 text-[10px] text-gray/70">
                  {scaleDef.intervals.join('')}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
