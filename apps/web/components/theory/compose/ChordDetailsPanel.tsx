/**
 * ChordDetailsPanel — panneau de détails de l'accord sélectionné :
 * variation, en-tête, notes, diagramme Concordia, émotion, substitutions.
 */

'use client';

import { ConcordiaChordBox } from './ConcordiaChordBox';
import { getContrastColor } from './FretboardChord';
import { FRENCH_NOTE_NAMES as NOTE_FR, DEGREE_COLORS, DEGREE_EMOTIONS } from '@adagio/theory';
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
      <div className="section-frame p-8 text-center">
        <p className="text-gray">
          Cliquez sur un degré pour voir ses détails, substitutions et diagramme
        </p>
      </div>
    );
  }

  const variations = chordVariations[selectedDegree];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-metal text-white uppercase tracking-wider mb-4">
        Détails: {selectedChord}
      </h2>

      {/* Variation selector */}
      {variations && variations.length > 1 && (
        <div className="mb-4">
          <p className="text-xs text-gray uppercase tracking-wider mb-3">Variation d'accord</p>
          <div className="relative">
            <select
              value={selectedVariations[selectedDegree] || 'basic'}
              onChange={(e) => onVariationChange(selectedDegree, e.target.value)}
              className="w-full text-sm bg-blackness border-2 border-steel text-gray p-3 pr-10 rounded appearance-none hover:border-toxic transition-all cursor-pointer"
            >
              {variations.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray pointer-events-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
      )}

      {/* Chord header */}
      <div className="section-frame p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-4xl font-metal text-white">{selectedChord}</p>
              {selectedVariationDetails && selectedVariationDetails.category !== 'basic' && (
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    selectedVariationDetails.category === 'extension'
                      ? 'bg-toxic text-white'
                      : selectedVariationDetails.category === 'substitution'
                        ? 'bg-circuit text-white'
                        : selectedVariationDetails.category === 'modal'
                          ? 'bg-rust text-white'
                          : 'bg-void text-gray'
                  }`}
                >
                  {selectedVariationDetails.category}
                </span>
              )}
            </div>
            <p className="text-sm text-gray">
              {numerals[selectedDegree]} de {selectedKey}{' '}
              {keyMode === 'major' ? 'Majeur' : 'Mineur'}
            </p>
            {selectedVariationDetails && selectedVariationDetails.description && (
              <p className="text-xs text-gray mt-1">{selectedVariationDetails.description}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {onPlayChord && (
              <button
                type="button"
                onClick={onPlayChord}
                aria-label="Écouter l'accord"
                className="w-10 h-10 border-2 border-steel text-gray font-bold hover:border-blood hover:text-white transition-colors flex items-center justify-center"
              >
                ▶
              </button>
            )}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black border-2"
              style={{
                backgroundColor: DEGREE_COLORS[selectedDegree] || '#3a3a3a',
                color: getContrastColor(DEGREE_COLORS[selectedDegree] || '#3a3a3a'),
                borderColor: '#8b1a1a',
              }}
            >
              {selectedDegree + 1}
            </div>
          </div>
        </div>

        {/* Chord notes with intervals */}
        <div className="border-2 border-steel bg-blackness p-4 mb-4">
          <p className="text-xs text-gray uppercase tracking-wider mb-3">Notes de l'accord</p>
          <div className="flex gap-2 justify-center">
            {chordDetails.notes.map((note, i) => (
              <div key={i} className="text-center">
                <div className="px-4 py-3 border-2 border-blood bg-toxic mb-1">
                  <span className="text-lg font-bold text-white">{NOTE_FR[note] || note}</span>
                </div>
                <span className="text-xs text-gray">{chordDetails.intervals[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fretboard visualization */}
        <div className="border-2 border-steel bg-blackness p-4 mb-4">
          <p className="text-xs text-gray uppercase tracking-wider mb-3">Diagramme du manche</p>
          <div className="flex justify-center">
            <ConcordiaChordBox chord={selectedChord} />
          </div>
        </div>

        {/* Degree emotion */}
        <div className="text-sm">
          <span className="text-blood font-bold">Émotion: </span>
          <span className="text-gray">
            {selectedVariationDetails?.emotion || DEGREE_EMOTIONS[selectedDegree]}
          </span>
        </div>
      </div>

      {/* Substitutions & Extensions */}
      {chordSubstitutions.length > 0 && (
        <div className="section-frame p-6">
          <h3 className="text-sm text-gray uppercase tracking-wider mb-4">
            Substitutions & Extensions
          </h3>
          <div className="space-y-2">
            {chordSubstitutions.map((sub, i) => (
              <button
                key={i}
                onClick={() => onSubstitutionClick?.(sub.chord)}
                className="w-full p-3 border-2 border-steel bg-blackness hover:border-blood transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        sub.type === 'extension'
                          ? 'bg-toxic text-white'
                          : sub.type === 'substitution'
                            ? 'bg-circuit text-white'
                            : 'bg-void text-gray'
                      }`}
                    >
                      {sub.type}
                    </span>
                    <div>
                      <p className="text-sm text-gray">{sub.name}</p>
                      <p className="text-lg font-bold text-white">{sub.chord}</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray mt-2">{sub.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
