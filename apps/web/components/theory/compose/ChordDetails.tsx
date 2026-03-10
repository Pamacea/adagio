/**
 * ADAGIO - ChordDetails Component
 * Affiche les détails de l'accord sélectionné (notes, diagramme, substitutions)
 */

'use client';

import {
  FRENCH_NOTE_NAMES,
  DEGREE_COLORS,
  DEGREE_EMOTIONS,
  ROMAN_NUMERALS_MAJOR,
  ROMAN_NUMERALS_MINOR,
  type ChordSubstitution,
  type ChordVariation,
} from '@adagio/theory';

export interface ChordDetailsProps {
  selectedChord: string;
  selectedDegree: number;
  selectedKey: string;
  keyMode: 'major' | 'minor';
  chordDetails: { notes: string[]; intervals: string[] };
  chordSubstitutions: ChordSubstitution[];
  selectedVariationDetails: ChordVariation | null;
}

// Mini fretboard component
function FretboardChord({ chord, width = 280, height = 200 }: { chord: string; width?: number; height?: number }) {
  const positions = getChordPositions(chord);
  const FRET_WIDTH = width / 5;
  const STRING_SPACING = height / 7;
  const NUT_POSITION = FRET_WIDTH;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <rect x={0} y={0} width={width} height={height} fill="#010101" />

      {/* Frets */}
      {Array.from({ length: 5 }).map((_, i) => (
        <line
          key={i}
          x1={NUT_POSITION + i * FRET_WIDTH}
          y1={20}
          x2={NUT_POSITION + i * FRET_WIDTH}
          y2={height - 20}
          stroke={i === 0 ? '#8b1a1a' : '#2a2a2a'}
          strokeWidth={i === 0 ? 3 : 1.5}
        />
      ))}

      {/* Strings */}
      {Array.from({ length: 6 }).map((_, i) => (
        <line
          key={i}
          x1={NUT_POSITION}
          y1={30 + i * STRING_SPACING}
          x2={width - 10}
          y2={30 + i * STRING_SPACING}
          stroke="#2a2a2a"
          strokeWidth={i === 0 || i === 5 ? 2 : 1}
        />
      ))}

      {/* String names */}
      {['E', 'A', 'D', 'G', 'B', 'E'].map((name, i) => (
        <text
          key={i}
          x={15}
          y={35 + i * STRING_SPACING}
          fill="#666"
          fontSize="8"
          textAnchor="middle"
        >
          {name}
        </text>
      ))}

      {/* Chord dots */}
      {positions.map((pos, i) => {
        if (!pos) return null;
        const x = pos.fret === 0
          ? NUT_POSITION - 15
          : NUT_POSITION + (pos.fret - 0.5) * FRET_WIDTH;
        const y = 30 + pos.string * STRING_SPACING;

        return (
          <g key={i}>
            <circle
              cx={x}
              cy={y}
              r={10}
              fill="#0a0f0a"
              stroke="#8b1a1a"
              strokeWidth={2}
            />
            <text
              x={x}
              y={y + 3}
              fill="#e0e0e0"
              fontSize={10}
              fontWeight="bold"
              textAnchor="middle"
            >
              {pos.fret}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function getChordPositions(chordName: string): ({ fret: number; string: number } | null)[] {
  const root = chordName.replace(/m|dim|°|7|maj|add/g, '');
  const isMinor = chordName.endsWith('m') && !chordName.includes('aj');

  const basePosition: Array<{ fret: number | null; string: number }> = [
    { fret: null, string: 0 },
    { fret: isMinor ? 2 : 1, string: 1 },
    { fret: 0, string: 2 },
    { fret: 2, string: 3 },
    { fret: isMinor ? 2 : 3, string: 4 },
    { fret: isMinor ? 1 : 1, string: 5 },
  ];

  const rootOffsets: Record<string, number[]> = {
    'C': [0, 0, 0, 0, 0, 0],
    'D': [0, 0, 0, 2, 2, 2],
    'E': [0, 2, 2, 2, 2, 0],
    'F': [1, 1, 2, 3, 3, 1],
    'G': [3, 2, 0, 0, 0, 3],
    'A': [0, 0, 2, 2, 2, 0],
    'B': [0, 2, 4, 4, 4, 2],
  };

  const offsets = rootOffsets[root] ?? rootOffsets['C']!;
  return basePosition.map((pos, i) => {
    if (!pos || pos.fret === null) return null;
    return { fret: pos.fret + (offsets[i] || 0), string: pos.string };
  });
}

function getContrastColor(hexColor: string) {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export function ChordDetails({
  selectedChord,
  selectedDegree,
  selectedKey,
  keyMode,
  chordDetails,
  chordSubstitutions,
  selectedVariationDetails,
}: ChordDetailsProps) {
  const numerals = keyMode === 'major' ? ROMAN_NUMERALS_MAJOR : ROMAN_NUMERALS_MINOR;
  const numeral = numerals[selectedDegree];
  const color = DEGREE_COLORS[selectedDegree] || '#3a3a3a';

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-metal text-white uppercase tracking-wider mb-4">
        Détails: {selectedChord}
      </h2>

      {/* Chord header */}
      <div className="section-frame p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-4xl font-metal text-white">
                {selectedChord}
              </p>
              {selectedVariationDetails && selectedVariationDetails.category !== 'basic' && (
                <span className={`text-xs px-2 py-1 rounded ${
                  selectedVariationDetails.category === 'extension' ? 'bg-toxic text-white' :
                  selectedVariationDetails.category === 'substitution' ? 'bg-circuit text-white' :
                  selectedVariationDetails.category === 'modal' ? 'bg-rust text-white' :
                  'bg-void text-gray'
                }`}>
                  {selectedVariationDetails.category}
                </span>
              )}
            </div>
            <p className="text-sm text-gray">
              {numeral} de {selectedKey} {keyMode === 'major' ? 'Majeur' : 'Mineur'}
            </p>
            {selectedVariationDetails && selectedVariationDetails.description && (
              <p className="text-xs text-gray mt-1">
                {selectedVariationDetails.description}
              </p>
            )}
          </div>
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black border-2"
            style={{
              backgroundColor: color,
              color: getContrastColor(color),
              borderColor: '#8b1a1a',
            }}
          >
            {selectedDegree + 1}
          </div>
        </div>

        {/* Chord notes with intervals */}
        <div className="border-2 border-steel bg-blackness p-4 mb-4">
          <p className="text-xs text-gray uppercase tracking-wider mb-3">
            Notes de l'accord
          </p>
          <div className="flex gap-2 justify-center">
            {chordDetails.notes.map((note, i) => (
              <div key={i} className="text-center">
                <div className="px-4 py-3 border-2 border-blood bg-toxic mb-1">
                  <span className="text-lg font-bold text-white">{FRENCH_NOTE_NAMES[note] || note}</span>
                </div>
                <span className="text-xs text-gray">{chordDetails.intervals[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fretboard visualization */}
        <div className="border-2 border-steel bg-blackness p-4 mb-4">
          <p className="text-xs text-gray uppercase tracking-wider mb-3">
            Diagramme du manche
          </p>
          <div className="flex justify-center">
            <FretboardChord chord={selectedChord} width={280} height={200} />
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
                className="w-full p-3 border-2 border-steel bg-blackness hover:border-blood transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded ${
                      sub.type === 'extension' ? 'bg-toxic text-white' :
                      sub.type === 'substitution' ? 'bg-circuit text-white' :
                      'bg-void text-gray'
                    }`}>
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
