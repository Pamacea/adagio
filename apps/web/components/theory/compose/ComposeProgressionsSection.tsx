/**
 * ComposeProgressionsSection — grille des progressions classiques.
 * Clic sur la carte : sélection du 1er degré. Bouton ▶ : lecture séquentielle
 * audio avec highlight du degré en cours (`activeStep`).
 */

'use client';

import { HelpButton, HelpTooltip } from '@/components/HelpProvider';
import { DEGREE_COLORS, ROMAN_NUMERALS_MAJOR } from '@adagio/theory';
import { motion } from 'framer-motion';
import type { ComposeProgression } from '@adagio/theory';
import type { NoteName } from '@adagio/types';

export interface ComposeProgressionsSectionProps {
  selectedKey: NoteName;
  progressions: ComposeProgression[];
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
  onSelectDegree,
  onPlayProgression,
  playingIndex,
  activeStep,
}: ComposeProgressionsSectionProps) {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-metal text-white uppercase tracking-wider">
          Progressions en {selectedKey}
        </h2>
        <HelpTooltip topicId="compose.progressions">
          <HelpButton topicId="compose.progressions" useModal size="md" variant="subtle" />
        </HelpTooltip>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {progressions.map((prog, i) => {
          const isPlayingHere = playingIndex === i;
          return (
            <motion.div
              key={i}
              role="button"
              tabIndex={0}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.15 }}
              className={`section-frame p-4 text-left hover:border-blood transition-all cursor-pointer ${
                isPlayingHere ? 'border-blood' : ''
              }`}
              onClick={() => {
                const firstDegree = prog.degrees[0];
                if (!firstDegree) return;
                const degreeIndex = ROMAN_NUMERALS_MAJOR.indexOf(
                  firstDegree as (typeof ROMAN_NUMERALS_MAJOR)[number]
                );
                if (degreeIndex >= 0) onSelectDegree(degreeIndex);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  const firstDegree = prog.degrees[0];
                  if (!firstDegree) return;
                  const degreeIndex = ROMAN_NUMERALS_MAJOR.indexOf(
                    firstDegree as (typeof ROMAN_NUMERALS_MAJOR)[number]
                  );
                  if (degreeIndex >= 0) onSelectDegree(degreeIndex);
                }
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-white">{prog.name}</p>
                {onPlayProgression && (
                  <button
                    type="button"
                    aria-label={`Écouter ${prog.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayProgression(prog, i);
                    }}
                    className="w-8 h-8 border-2 border-steel text-gray font-bold hover:border-blood hover:text-white transition-colors flex items-center justify-center shrink-0"
                  >
                    ▶
                  </button>
                )}
              </div>
              <p className="text-xs text-gray mb-3">{prog.description}</p>

              {/* Degree visualization */}
              <div className="flex gap-1 mb-3">
                {prog.degrees.map((deg, j) => {
                  const degreeIndex = ROMAN_NUMERALS_MAJOR.indexOf(
                    deg as (typeof ROMAN_NUMERALS_MAJOR)[number]
                  );
                  const color = degreeIndex >= 0 ? DEGREE_COLORS[degreeIndex] : '#3a3a3a';
                  const isActiveStep = isPlayingHere && activeStep === j;

                  return (
                    <motion.div
                      key={j}
                      className="flex-1 text-center py-2 border transition-all"
                      style={{
                        backgroundColor: color + (isActiveStep ? '80' : '30'),
                        borderColor: isActiveStep ? color : undefined,
                      }}
                      animate={{ scale: isActiveStep ? 1.08 : 1 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    >
                      <span className="text-sm font-bold" style={{ color }}>
                        {deg}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              <p className="text-xs text-blood mb-2">{prog.emotion}</p>

              {/* Genre tags */}
              <div className="flex flex-wrap gap-1">
                {prog.genre.map((g) => (
                  <span key={g} className="text-xs px-2 py-1 bg-void text-gray">
                    {g}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
