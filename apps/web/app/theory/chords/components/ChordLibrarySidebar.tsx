/**
 * ChordLibrarySidebar - Right sidebar with chord categories
 *
 * Displays:
 * - Current root info
 * - Degree info with counts
 * - Chord categories (diatonic, extensions, alterations)
 * - Accordion-style expand/collapse
 */

'use client';

import type { NoteName, ChordQuality } from '@adagio/types';
import { AccordionHeader, ChordCard } from './';
import type { CalculatedChord, ChordCategory } from '../hooks/useChordPage';

export interface ChordLibrarySidebarProps {
  currentRoot: NoteName;
  selectedDegree: string;
  tonality: 'major' | 'minor';
  diatonicChords: CalculatedChord[];
  extensionChords: CalculatedChord[];
  alterationChords: CalculatedChord[];
  chordToDisplay: CalculatedChord | undefined;
  selectedChord: { root: NoteName; quality: ChordQuality } | null;
  openCategories: Record<string, boolean>;
  onToggleCategory: (name: string) => void;
  onChordSelect: (chord: CalculatedChord) => void;
  className?: string;
}

export function ChordLibrarySidebar({
  currentRoot,
  selectedDegree,
  tonality,
  diatonicChords,
  extensionChords,
  alterationChords,
  chordToDisplay,
  selectedChord,
  openCategories,
  onToggleCategory,
  onChordSelect,
  className,
}: ChordLibrarySidebarProps) {
  return (
    <aside className={className}>
      <div className="p-5 sticky top-0 bg-blackness/80 backdrop-blur-sm z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-metal text-white">{currentRoot}</h2>
            <p className="text-xs text-gray">Accords disponibles</p>
          </div>
          <div className="w-8 h-8 rounded-none bg-amber-400/20 flex items-center justify-center">
            <span className="text-amber-400 text-sm">♫</span>
          </div>
        </div>

        {/* Degré info */}
        <div className="mb-4 p-4 border-2 border-steel/30 rounded-none bg-void">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-300 font-semibold">Degré {selectedDegree}</span>
            <span className="text-sm text-gray-400">
              {tonality === 'major' ? 'Majeur' : 'Mineur'}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1.5 text-sm bg-emerald-500/30 text-emerald-400 rounded border border-emerald-500/30">
              {diatonicChords.length} diat.
            </span>
            <span className="px-3 py-1.5 text-sm bg-blue-500/30 text-blue-400 rounded border border-blue-500/30">
              {extensionChords.length} ext.
            </span>
          </div>
        </div>
      </div>

      {/* Accordéons */}
      <div className="space-y-3 px-5 pb-5">
        {/* Diatonique */}
        <div>
          <AccordionHeader
            name={'Diatonique'}
            description={'Accords de la gamme'}
            icon={'◈'}
            color={'#22c55e'}
            count={diatonicChords.length}
            isOpen={openCategories.Diatonique ?? false}
            onToggle={() => onToggleCategory('Diatonique')}
          />
          {openCategories.Diatonique && (
            <div className="space-y-2">
              {diatonicChords.map((chord) => (
                <ChordCard
                  key={chord.name}
                  name={chord.name}
                  root={chord.root}
                  quality={chord.quality}
                  notes={chord.notes}
                  voicings={chord.voicings}
                  categoryName={'Diatonique'}
                  categoryColor={'#22c55e'}
                  isSelected={chordToDisplay?.quality === chord.quality && chordToDisplay?.root === chord.root && !selectedChord}
                  onSelect={() => onChordSelect(chord)}
                  showDiatonic={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* Extensions */}
        <div>
          <AccordionHeader
            name={'Extensions'}
            description={'9, 11, 13'}
            icon={'⌘'}
            color={'#3b82f6'}
            count={extensionChords.length}
            isOpen={openCategories.Extensions ?? false}
            onToggle={() => onToggleCategory('Extensions')}
          />
          {openCategories.Extensions && (
            <div className="space-y-2">
              {extensionChords.map((chord) => (
                <ChordCard
                  key={chord.name}
                  name={chord.name}
                  root={chord.root}
                  quality={chord.quality}
                  notes={chord.notes}
                  voicings={chord.voicings}
                  categoryName={'Extensions'}
                  categoryColor={'#3b82f6'}
                  isSelected={chordToDisplay?.quality === chord.quality && chordToDisplay?.root === chord.root}
                  onSelect={() => onChordSelect(chord)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Altérations */}
        <div>
          <AccordionHeader
            name={'Altérations'}
            description={'dim, aug, sus'}
            icon={'↻'}
            color={'#ef4444'}
            count={alterationChords.length}
            isOpen={openCategories.Altérations ?? false}
            onToggle={() => onToggleCategory('Altérations')}
          />
          {openCategories.Altérations && (
            <div className="space-y-2">
              {alterationChords.map((chord) => (
                <ChordCard
                  key={chord.name}
                  name={chord.name}
                  root={chord.root}
                  quality={chord.quality}
                  notes={chord.notes}
                  voicings={chord.voicings}
                  categoryName={'Altérations'}
                  categoryColor={'#ef4444'}
                  isSelected={chordToDisplay?.quality === chord.quality && chordToDisplay?.root === chord.root}
                  onSelect={() => onChordSelect(chord)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
