/**
 * ChordDetailsPanel — panneau de détails de l'accord sélectionné :
 * variation, en-tête, notes, diagramme Concordia, émotion, substitutions.
 */

'use client';

import { ConcordiaChordBox } from './ConcordiaChordBox';
import {
  FRENCH_NOTE_NAMES as NOTE_FR,
  DEGREE_EMOTIONS,
  MAJOR_DEGREE_FUNCTIONS,
  MINOR_DEGREE_FUNCTIONS,
} from '@adagio/theory';
import type { ChordSubstitution, ChordVariation, KeyMode } from '@adagio/theory';
import type { NoteName } from '@adagio/types';

export interface ChordDetailsPanelProps {
  selectedChord: string | null;
  selectedDegree: number | null;
  chordDetails: { notes: string[]; intervals: string[] } | null;
  chordVariations: Record<number, ChordVariation[]>;
  selectedVariations: Record<number, string>;
  selectedVariationDetails: ChordVariation | null;
  chordSubstitutions: ChordSubstitution[];
  numerals: readonly string[];
  selectedKey: NoteName;
  keyMode: KeyMode;
  onVariationChange: (degree: number, variationId: string) => void;
  onSubstitutionClick?: (chord: string) => void;
  /** Joue l'accord affiché */
  onPlayChord?: () => void;
}

const PANEL = 'space-y-2 panel p-3';
const SECTION_TITLE = 'field-label mb-0 text-gold';

export function ChordDetailsPanel({
  selectedChord,
  selectedDegree,
  chordDetails,
  chordVariations,
  selectedVariations,
  selectedVariationDetails,
  chordSubstitutions,
  numerals,
  selectedKey,
  keyMode,
  onVariationChange,
  onSubstitutionClick,
  onPlayChord,
}: ChordDetailsPanelProps) {
  if (!selectedChord || !chordDetails || selectedDegree === null) {
    return (
      <p className="py-4 text-center text-[13px] text-gray">
        Cliquez sur un degré pour voir ses détails, substitutions et diagramme
      </p>
    );
  }

  const variations = chordVariations[selectedDegree];
  const degreeFunction =
    (keyMode === 'major' ? MAJOR_DEGREE_FUNCTIONS : MINOR_DEGREE_FUNCTIONS)[
      selectedDegree + 1
    ] ?? '';

  return (
    <div className="space-y-2">
      {/* Accord et lecture */}
      <section className={PANEL}>
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-1">
            <p className={SECTION_TITLE}>Accord</p>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="text-2xl font-metal tracking-tighter text-gold">{selectedChord}</p>
              {selectedVariationDetails && selectedVariationDetails.category !== 'basic' && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray">
                  {selectedVariationDetails.category}
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray">
              <span className="text-ember">{numerals[selectedDegree]}</span> de {selectedKey}{' '}
              {keyMode === 'major' ? 'Majeur' : 'Mineur'}
              {degreeFunction && (
                <>
                  <span className="mx-2 text-gray/50">·</span>
                  <span className="text-gold">{degreeFunction}</span>
                </>
              )}
            </p>
            {selectedVariationDetails && selectedVariationDetails.description && (
              <p className="text-[13px] text-gray">{selectedVariationDetails.description}</p>
            )}
            <p className="text-[13px] text-gray">
              <span className="text-gray/70">Émotion </span>
              {selectedVariationDetails?.emotion || DEGREE_EMOTIONS[selectedDegree]}
            </p>
          </div>
          {onPlayChord && (
            <button
              type="button"
              onClick={onPlayChord}
              aria-label="Écouter l'accord"
              className="shrink-0 px-2.5 text-xs font-bold uppercase tracking-wider text-gray/70 hover:text-rust"
            >
              ▶ Écouter
            </button>
          )}
        </div>

        {variations && variations.length > 1 && (
          <label className="flex items-center gap-3 text-[11px] text-gray">
            <span className="shrink-0">Variation</span>
            <select
              value={selectedVariations[selectedDegree] || 'basic'}
              onChange={(e) => onVariationChange(selectedDegree, e.target.value)}
              style={{ colorScheme: 'dark' }}
              className="control-select cursor-pointer"
            >
              {variations.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </label>
        )}
      </section>

      {/* Notes de l'accord */}
      <section className={PANEL}>
        <p className={SECTION_TITLE}>Notes de l'accord</p>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {chordDetails.notes.map((note, i) => {
            const interval = chordDetails.intervals[i] ?? '';
            return (
              <div key={i} className="text-center">
                <p className="text-xl font-sans text-white">{NOTE_FR[note] || note}</p>
                <p className="text-[10px] uppercase tracking-wider text-gray">{interval}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Diagramme */}
      <section className={PANEL}>
        <p className={SECTION_TITLE}>Diagramme</p>
        <div className="flex justify-center">
          <div className="w-full" style={{ maxWidth: '24rem' }}>
            <ConcordiaChordBox chord={selectedChord} />
          </div>
        </div>
      </section>

      {/* Substitutions & extensions */}
      {chordSubstitutions.length > 0 && (
        <section className={PANEL}>
          <p className={SECTION_TITLE}>Substitutions & extensions</p>
          <div className="divide-y divide-steelwarm">
            {chordSubstitutions.map((sub, i) => (
              <button
                key={i}
                onClick={() => onSubstitutionClick?.(sub.chord)}
                className="flex w-full items-baseline justify-between gap-4 px-2.5 py-2.5 text-left hover:bg-raised/60"
              >
                <span className="min-w-0">
                  <span className="text-[15px] text-white">{sub.chord}</span>
                  <span className="ml-3 text-[11px] text-gray/70">{sub.name}</span>
                  <span className="mt-1 block text-[13px] text-gray">{sub.description}</span>
                </span>
                <span className="shrink-0 text-[10px] text-gray/70">{sub.type}</span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
