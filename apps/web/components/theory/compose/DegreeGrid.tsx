/**
 * DegreeGrid — grille des 7 degrés diatoniques, légende d'émotions
 * et modulations rapides.
 */

'use client';

import { HelpButton, HelpTooltip } from '@/components/HelpProvider';
import { getContrastColor } from './FretboardChord';
import { DEGREE_COLORS, DEGREE_EMOTIONS, ROMAN_NUMERALS_MAJOR } from '@adagio/theory';
import type { ChordVariation } from '@adagio/theory';

export interface DegreeGridProps {
  chords: string[];
  numerals: readonly string[];
  selectedDegree: number | null;
  selectedVariations: Record<number, string>;
  chordVariations: Record<number, ChordVariation[]>;
  scaleNotes: string[];
  onDegreeClick: (degree: number | null) => void;
  onModulation: (key: string) => void;
}

export function DegreeGrid({
  chords,
  numerals,
  selectedDegree,
  selectedVariations,
  chordVariations,
  scaleNotes,
  onDegreeClick,
  onModulation,
}: DegreeGridProps) {
  return (
    <div className="section-frame p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-metal text-white uppercase tracking-wider">
          Degrés diatoniques
        </h2>
        <HelpTooltip topicId="compose.degrees">
          <HelpButton topicId="compose.degrees" useModal size="md" variant="subtle" />
        </HelpTooltip>
      </div>

      {/* Degree buttons with variation selector */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {chords.map((basicChord, i) => {
          const numeral = numerals[i];
          const color = DEGREE_COLORS[i] || '#3a3a3a';
          const isSelected = selectedDegree === i;
          const variations = chordVariations[i] || [];
          const selectedVariation = selectedVariations[i] || 'basic';
          const currentVariation = variations.find((v) => v.id === selectedVariation);
          const displayChord = currentVariation?.symbol || basicChord;

          return (
            <div key={i} className="flex flex-col items-center">
              <button
                onClick={() => onDegreeClick(isSelected ? null : i)}
                className="flex flex-col items-center w-full"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-black border-2 transition-all ${
                    isSelected ? 'scale-110 shadow-lg' : ''
                  }`}
                  style={{
                    backgroundColor: color,
                    color: getContrastColor(color),
                    borderColor: isSelected ? '#8b1a1a' : '#2a2a2a',
                    boxShadow: isSelected ? `0 0 20px ${color}80` : undefined,
                  }}
                >
                  {i + 1}
                </div>
                <span className="text-xs text-gray mt-1">{numeral}</span>
                <span
                  className={`text-xs font-bold mt-1 ${isSelected ? 'text-toxic' : 'text-white'}`}
                >
                  {displayChord.length > 6 ? displayChord.slice(0, 5) + '…' : displayChord}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Emotion legend */}
      <div className="border-2 border-steel bg-blackness p-4">
        <p className="text-xs text-gray uppercase tracking-wider mb-3">Émotions des degrés</p>
        <div className="space-y-2">
          {ROMAN_NUMERALS_MAJOR.map((numeral, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: DEGREE_COLORS[i] }} />
              <span className="text-sm text-white w-8">{numeral}</span>
              <span className="text-xs text-gray flex-1">{DEGREE_EMOTIONS[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick modulations */}
      <div className="mt-4 border-2 border-steel bg-blackness p-4">
        <p className="text-xs text-gray uppercase tracking-wider mb-3">Modulations rapides</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onModulation(scaleNotes[5]!)}
            className="px-3 py-1 text-xs border-2 border-steel bg-abyss hover:border-blood transition-all"
          >
            Relative mineur ({scaleNotes[5]}m)
          </button>
          <button
            onClick={() => onModulation(scaleNotes[3]!)}
            className="px-3 py-1 text-xs border-2 border-steel bg-abyss hover:border-blood transition-all"
          >
            Sous-dominante ({scaleNotes[3]})
          </button>
          <button
            onClick={() => onModulation(scaleNotes[4]!)}
            className="px-3 py-1 text-xs border-2 border-steel bg-abyss hover:border-blood transition-all"
          >
            Dominante ({scaleNotes[4]})
          </button>
        </div>
      </div>
    </div>
  );
}
