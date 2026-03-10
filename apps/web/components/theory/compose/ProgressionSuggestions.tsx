/**
 * ADAGIO - ProgressionSuggestions Component
 * Liste des progressions suggérées avec filtres par style/genre
 */

'use client';

import { useState, useMemo } from 'react';
import type { NoteName, ChordDegree } from '@adagio/types';
import { getDegreeNote } from '@adagio/theory';
import { NOTE_FR } from '@/lib/theory';

// ============================================================================
// TYPES
// ============================================================================

export interface ProgressionSuggestionsProps {
  /** Tonique de la tonalité */
  root: NoteName;
  /** Mode majeur/mineur */
  tonality: 'major' | 'minor';
  /** Callback lorsqu'une progression est appliquée */
  onProgressionApply?: (chords: string[]) => void;
}

interface Progression {
  id: string;
  name: string;
  degrees: ChordDegree[];
  qualities: string[];
  styles: string[];
  description: string;
}

// ============================================================================
// PROGRESSIONS DATA
// ============================================================================

const MAJOR_PROGRESSIONS: Progression[] = [
  {
    id: 'i-iv-v',
    name: 'I - IV - V',
    degrees: ['I', 'IV', 'V'],
    qualities: ['', '', '7'],
    styles: ['rock', 'blues', 'classic'],
    description: 'La base du rock, du blues et de la musique classique',
  },
  {
    id: 'i-v-vi-iv',
    name: 'I - V - vi - IV',
    degrees: ['I', 'V', 'VI', 'IV'],
    qualities: ['', '7', 'm', ''],
    styles: ['pop', 'ballad'],
    description: 'La progression pop la plus utilisée ("50s progression")',
  },
  {
    id: 'vi-iv-i-v',
    name: 'vi - IV - I - V',
    degrees: ['VI', 'IV', 'I', 'V'],
    qualities: ['m', '', '', '7'],
    styles: ['ballad', 'rock'],
    description: 'Progression émotionnelle pour ballades rock',
  },
  {
    id: 'ii-v-i',
    name: 'ii - V - I',
    degrees: ['II', 'V', 'I'],
    qualities: ['m7', '7', 'maj7'],
    styles: ['jazz', 'r&b'],
    description: 'Le turnaround jazz par excellence',
  },
  {
    id: 'iii-vi-ii-v-i',
    name: 'iii - vi - ii - V - I',
    degrees: ['III', 'VI', 'II', 'V', 'I'],
    qualities: ['m7', 'm7', 'm7', '7', 'maj7'],
    styles: ['jazz'],
    description: 'Turnaround sophistiqué avec descente chromatique',
  },
  {
    id: 'i-vi-ii-v',
    name: 'I - vi - ii - V',
    degrees: ['I', 'VI', 'II', 'V'],
    qualities: ['maj7', 'm7', 'm7', '7'],
    styles: ['jazz', 'r&b'],
    description: 'Turnaround classique du jazz et du rhythm & blues',
  },
  {
    id: 'circle-of-fifths',
    name: 'Cercle des Quintes',
    degrees: ['I', 'IV', 'VII', 'III', 'VI', 'II', 'V', 'I'],
    qualities: ['', '', 'm7b5', 'm', 'm', 'm', '7', ''],
    styles: ['jazz', 'classical'],
    description: 'Progression complète en cercle de quintes',
  },
  {
    id: 'i-bvii-bvi-v',
    name: 'I - bVII - bVI - V',
    degrees: ['I', 'bVII', 'bVI', 'V'],
    qualities: ['', '', '', '7'],
    styles: ['metal', 'hard-rock'],
    description: 'Progression rock/metal puissante',
  },
];

const MINOR_PROGRESSIONS: Progression[] = [
  {
    id: 'i-iv-v',
    name: 'i - iv - V',
    degrees: ['I', 'IV', 'V'],
    qualities: ['m', 'm', '7'],
    styles: ['rock', 'blues'],
    description: 'Progression mineure basique',
  },
  {
    id: 'i-vi-vii',
    name: 'i - VI - VII',
    degrees: ['I', 'VI', 'VII'],
    qualities: ['m', '', '7'],
    styles: ['metal', 'doom', 'gothic'],
    description: 'Typique du metal doom et gothique',
  },
  {
    id: 'i-bvi-bvii-v',
    name: 'i - bVI - bVII - V',
    degrees: ['I', 'bVI', 'bVII', 'V'],
    qualities: ['m', '', '', '7'],
    styles: ['metal', 'hard-rock'],
    description: 'Progression rock/metal mineure puissante',
  },
  {
    id: 'i-iii-vii-v',
    name: 'i - III - VII - v',
    degrees: ['I', 'III', 'VII', 'V'],
    qualities: ['m', '', '', '7'],
    styles: ['flamenco', 'spanish'],
    description: 'Andalucian cadence, base du flamenco',
  },
  {
    id: 'ii-v-i',
    name: 'ii - V - i',
    degrees: ['II', 'V', 'I'],
    qualities: ['m7b5', '7', 'm7'],
    styles: ['jazz'],
    description: 'Le turnaround mineur classique',
  },
];

// ============================================================================
// STYLES
// ============================================================================

const STYLE_FILTERS = [
  { id: 'all', name: 'Tous', color: 'bg-steel' },
  { id: 'rock', name: 'Rock', color: 'bg-rust' },
  { id: 'jazz', name: 'Jazz', color: 'bg-toxic' },
  { id: 'blues', name: 'Blues', color: 'bg-circuit' },
  { id: 'metal', name: 'Metal', color: 'bg-blood' },
  { id: 'pop', name: 'Pop', color: 'bg-void' },
] as const;

type StyleFilter = typeof STYLE_FILTERS[number]['id'];

// ============================================================================
// COMPONENT
// ============================================================================

export function ProgressionSuggestions({
  root,
  tonality,
  onProgressionApply,
}: ProgressionSuggestionsProps) {
  const [selectedStyle, setSelectedStyle] = useState<StyleFilter>('all');

  // Filtrer les progressions par style
  const filteredProgressions = useMemo(() => {
    const progressions = tonality === 'major' ? MAJOR_PROGRESSIONS : MINOR_PROGRESSIONS;

    if (selectedStyle === 'all') return progressions;

    return progressions.filter(p => p.styles.includes(selectedStyle));
  }, [tonality, selectedStyle]);

  // Générer les accords d'une progression
  const generateChords = (progression: Progression): string[] => {
    return progression.degrees.map((degree, i) => {
      const note = getDegreeNote(root, degree, tonality);
      const quality = progression.qualities[i] || '';
      return `${note}${quality}`;
    });
  };

  const displayNote = (note: string): string => NOTE_FR[note] || note;

  const handleApplyProgression = (progression: Progression) => {
    const chords = generateChords(progression);
    onProgressionApply?.(chords);
  };

  return (
    <div className="section-frame p-4 mb-6">
      <h3 className="text-sm font-metal text-blood mb-4 tracking-wider uppercase">
        Progressions Suggérées
      </h3>

      {/* Filtres par style */}
      <div className="flex flex-wrap gap-2 mb-4">
        {STYLE_FILTERS.map((style) => (
          <button
            key={style.id}
            onClick={() => setSelectedStyle(style.id)}
            className={`
              px-3 py-1 text-xs font-bold uppercase border-2 transition-all
              ${selectedStyle === style.id
                ? `${style.color} border-blood text-white`
                : 'bg-blackness border-steel text-gray hover:border-rust'
              }
            `}
          >
            {style.name}
          </button>
        ))}
      </div>

      {/* Liste des progressions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredProgressions.map((progression) => {
          const chords = generateChords(progression);

          return (
            <div
              key={progression.id}
              className="bg-blackness border border-steel p-3 hover:border-rust transition-all"
            >
              {/* Nom et styles */}
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-bold text-white">
                  {progression.name}
                </h4>
                <div className="flex gap-1">
                  {progression.styles.slice(0, 2).map((style) => (
                    <span
                      key={style}
                      className="px-1 py-0.5 text-[9px] uppercase bg-void border border-steel text-gray"
                    >
                      {style}
                    </span>
                  ))}
                </div>
              </div>

              {/* Accords de la progression */}
              <div className="flex gap-1 mb-2 flex-wrap">
                {chords.map((chord, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs bg-toxic border border-steel"
                  >
                    {displayNote(chord.replace(/[0-9]/g, '').replace('m', 'm'))}
                    {chord.includes('m') && <span className="text-gray">m</span>}
                    {chord.match(/[0-9]/)?.[0] && (
                      <span className="text-[10px]">{chord.match(/[0-9]+/)?.[0]}</span>
                    )}
                  </span>
                ))}
              </div>

              {/* Degrés romains */}
              <div className="text-[10px] text-gray mb-2">
                {progression.degrees.join(' → ')}
              </div>

              {/* Description */}
              <p className="text-xs text-gray mb-3 line-clamp-2">
                {progression.description}
              </p>

              {/* Bouton Appliquer */}
              <button
                onClick={() => handleApplyProgression(progression)}
                className="w-full px-3 py-1 text-xs font-bold uppercase bg-blood text-white border border-blood hover:bg-rust transition-all"
              >
                Appliquer
              </button>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-steel">
        <div className="text-[10px] text-gray">
          Cliquez sur "Appliquer" pour ajouter la progression à votre composition.
          Les accords sont générés automatiquement dans la tonalité de {root}{tonality === 'major' ? ' majeur' : ' mineur'}.
        </div>
      </div>
    </div>
  );
}
