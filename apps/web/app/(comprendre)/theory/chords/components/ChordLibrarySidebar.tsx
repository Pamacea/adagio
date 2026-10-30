/**
 * ChordLibrarySidebar - Bibliothèque d'accords groupée en dossiers.
 *
 * Desktop : panneau gauche. Mobile : bloc replié (<details>).
 */

'use client';

import type { NoteName } from '@adagio/types';
import { DEGREE_COLORS } from '@adagio/theory';
import { cn } from '@adagio/ui';
import { AccordionHeader, ChordCard } from './';
import type { CalculatedChord } from '../hooks/useChordPage';

const DEGREES = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'] as const;

export interface ChordLibrarySidebarProps {
  currentRoot: NoteName;
  selectedDegree: string;
  tonality: 'major' | 'minor';
  diatonicChords: CalculatedChord[];
  extensionChords: CalculatedChord[];
  alterationChords: CalculatedChord[];
  chordToDisplay: CalculatedChord | undefined;
  openCategories: Record<string, boolean>;
  onToggleCategory: (name: string) => void;
  onChordSelect: (chord: CalculatedChord) => void;
  className?: string;
}

const GROUP_BODY = 'border-t border-steelwarm bg-raised/40 py-1 pl-4 pr-1';

function isSelectedChord(chord: CalculatedChord, displayed: CalculatedChord | undefined) {
  return displayed?.root === chord.root && displayed?.quality === chord.quality;
}

export function ChordLibrarySidebar({
  currentRoot,
  selectedDegree,
  tonality,
  diatonicChords,
  extensionChords,
  alterationChords,
  chordToDisplay,
  openCategories,
  onToggleCategory,
  onChordSelect,
  className,
}: ChordLibrarySidebarProps) {
  const groups = [
    { key: 'Diatonique', description: 'Accords de la gamme', chords: diatonicChords },
    { key: 'Extensions', description: '9, 11, 13', chords: extensionChords },
    { key: 'Altérations', description: 'dim, aug, sus', chords: alterationChords },
  ] as const;

  const degreeIndex = DEGREES.indexOf(selectedDegree as (typeof DEGREES)[number]);
  const degreeColor = DEGREE_COLORS[degreeIndex] ?? '#8b1a1a';

  const list = (
    <div className="divide-y divide-steelwarm border-t border-steelwarm">
      {groups.map((group) => (
        <section key={group.key}>
          <AccordionHeader
            name={group.key}
            description={group.description}
            count={group.chords.length}
            isOpen={openCategories[group.key] ?? false}
            onToggle={() => onToggleCategory(group.key)}
            color={group.key === 'Diatonique' ? degreeColor : undefined}
          />
          {openCategories[group.key] && (
            <div className={GROUP_BODY}>
              {group.chords.map((chord, index) => (
                <ChordCard
                  key={`${group.key}-${chord.name}`}
                  name={chord.name}
                  notes={chord.notes}
                  voicings={chord.voicings}
                  isSelected={isSelectedChord(chord, chordToDisplay)}
                  onSelect={() => onChordSelect(chord)}
                  accentColor={
                    group.key === 'Diatonique'
                      ? (DEGREE_COLORS[index] ?? degreeColor)
                      : undefined
                  }
                />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );

  return (
    <>
      <details className="lg:hidden">
        <summary className="cursor-pointer list-none border-b border-steelwarm px-4 py-3 text-sm text-white transition-colors hover:bg-raised/60 [&::-webkit-details-marker]:hidden">
          Bibliothèque d’accords
          <span className="ml-2 text-[10px] text-gray/70">
            {diatonicChords.length + extensionChords.length + alterationChords.length}
          </span>
        </summary>
        <div className="px-3 pb-4 pt-2">{list}</div>
      </details>

      <div className={cn('hidden lg:block', className)}>
        <div className="px-4 py-4">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-lg font-metal tracking-tighter text-white">
              {currentRoot}
              {tonality === 'minor' ? 'm' : ''}
            </h2>
            <p className="field-label mb-0 text-gold">Accords</p>
          </div>
          <p className="mt-1 text-[11px] text-gray">
            Degré{' '}
            <span className="font-bold" style={{ color: degreeColor }}>
              {selectedDegree}
            </span>{' '}
            · {tonality === 'major' ? 'Majeur' : 'Mineur'}
          </p>
        </div>

        <div className="px-3 pb-6">{list}</div>
      </div>
    </>
  );
}
