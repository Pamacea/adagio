/**
 * ComposeProgressionsSection — grille des progressions classiques.
 * Clic sur la carte : sélection du 1er degré. Bouton ▶ : lecture séquentielle
 * audio avec highlight du degré en cours (`activeStep`).
 */

'use client';

import { HelpButton, HelpTooltip } from '@/components/HelpProvider';
import type { ComposeProgression } from '@adagio/theory';
import type { NoteName } from '@adagio/types';

export interface ComposeProgressionsSectionProps {
  selectedKey: NoteName;
  progressions: ComposeProgression[];
  /** Numéraux romains du mode courant (majeur ou mineur) */
  numerals: readonly string[];
  onSelectDegree: (degree: number | null) => void;
  /** Lecture séquentielle de la progression */
  onPlayProgression?: (progression: ComposeProgression, index: number) => void;
  /** Index de la progression en cours de lecture */
  playingIndex?: number | null;
  /** Étape (degré) en cours de lecture */
  activeStep?: number | null;
}

export function ComposeProgressionsSection({
  selectedKey,
  progressions,
  numerals,
  onSelectDegree,
  onPlayProgression,
  playingIndex,
  activeStep,
}: ComposeProgressionsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-6">
        <h2 className="field-label mb-0 text-gold">Progressions en {selectedKey}</h2>
        <HelpTooltip topicId="compose.progressions">
          <HelpButton topicId="compose.progressions" useModal size="md" variant="subtle" />
        </HelpTooltip>
      </div>
      <div>
        {progressions.map((prog, i) => {
          const isPlayingHere = playingIndex === i;
          const firstDegree = prog.degrees[0];
          const firstDegreeIndex = firstDegree ? numerals.indexOf(firstDegree) : -1;
          const selectFirstDegree = () => {
            if (firstDegreeIndex >= 0) onSelectDegree(firstDegreeIndex);
          };

          return (
            <div
              key={prog.name}
              role="button"
              tabIndex={0}
              className={`cursor-pointer scroll-mt-28 border-t border-steelwarm px-2.5 py-2.5 text-left transition-colors hover:bg-raised/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/60 ${
                isPlayingHere ? 'bg-amber-400/20' : ''
              }`}
              onClick={selectFirstDegree}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  selectFirstDegree();
                }
              }}
            >
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-[13px] text-white">{prog.name}</p>
                {onPlayProgression && (
                  <button
                    type="button"
                    aria-label={`Écouter ${prog.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayProgression(prog, i);
                    }}
                    className="shrink-0 px-2.5 text-[11px] text-gray/70 transition-colors hover:text-rust focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/60"
                  >
                    ▶ Écouter
                  </button>
                )}
              </div>
              <p className="mt-1 text-[14px] leading-relaxed text-gray">{prog.description}</p>

              {/* Degrés */}
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                {prog.degrees.map((deg, j) => {
                  const isActiveStep = isPlayingHere && activeStep === j;
                  return (
                    <span key={j} className="flex items-center gap-3">
                      {j > 0 && <span className="text-gray/50">–</span>}
                      <span
                        className={`text-[11px] transition-colors ${
                          isActiveStep ? 'text-ember' : 'text-gray'
                        }`}
                      >
                        {deg}
                      </span>
                    </span>
                  );
                })}
              </div>

              <p className="mt-2 text-[10px] text-gray/70">
                {prog.emotion} · {prog.genre.join(', ')}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
