/**
 * ADAGIO - ChordBuilder Component
 * Affiche les 7 accords diatoniques de la tonalité avec voicings CAGED
 */

'use client';

import { useState, useMemo } from 'react';
import type { NoteName, ChordQuality, ChordVoicing } from '@adagio/types';
import {
  getDiatonicChordsByDegree,
  getChordVoicings,
  buildChord,
} from '@adagio/theory';
import { NOTE_FR } from '@/lib/theory';
import { ScaleFretboard, calculateFretPositions } from '../scales/ScaleFretboard';
import type { FretboardNote } from '@adagio/types';

// ============================================================================
// TYPES
// ============================================================================

export interface ChordBuilderProps {
  /** Tonique de la tonalité */
  root: NoteName;
  /** Mode majeur/mineur */
  tonality: 'major' | 'minor';
  /** Callback lorsqu'un accord est sélectionné */
  onChordSelect?: (chord: string) => void;
}

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

// ============================================================================
// DEGREE LABELS
// ============================================================================

const MAJOR_DEGREES = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'] as const;
const MINOR_DEGREES = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii°'] as const;

const CAGED_SHAPES = ['C', 'A', 'G', 'E', 'D'] as const;

// ============================================================================
// UTILITIES
// ============================================================================

function getDifficultyLabel(level: DifficultyLevel): string {
  switch (level) {
    case 'beginner': return 'Débutant';
    case 'intermediate': return 'Intermédiaire';
    case 'advanced': return 'Avancé';
  }
}

function getDifficultyColor(level: DifficultyLevel): string {
  switch (level) {
    case 'beginner': return 'text-toxic';
    case 'intermediate': return 'text-rust';
    case 'advanced': return 'text-blood';
  }
}

/**
 * Convertit un voicing en données de fretboard pour l'affichage
 */
function voicingToFretboardData(voicing: ChordVoicing): FretboardNote[] {
  const fretboardData: FretboardNote[] = [];

  // Générer les notes du manche autour du voicing
  for (let string = 0; string < 6; string++) {
    const voicingNote = voicing.notes.find(n => n.string === string);

    if (voicingNote) {
      // Note jouée dans l'accord
      fretboardData.push({
        name: voicingNote.note,
        octave: voicingNote.octave,
        string,
        fret: voicingNote.fret,
        inScale: true,
        interval: voicingNote.interval,
      });
    } else {
      // Case vide (on marque avec la frette 0 mais pas inScale)
      const stringNote = ['E', 'B', 'G', 'D', 'A', 'E'][5 - string] as NoteName;
      fretboardData.push({
        name: stringNote,
        octave: 4,
        string,
        fret: 0,
        inScale: false,
      });
    }
  }

  return fretboardData;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function ChordBuilder({ root, tonality, onChordSelect }: ChordBuilderProps) {
  const [selectedDegree, setSelectedDegree] = useState<number>(0);
  const [selectedShape, setSelectedShape] = useState<string>('open');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('beginner');

  // Calculer les accords diatoniques
  const diatonicChords = useMemo(() => {
    return getDiatonicChordsByDegree(root, tonality);
  }, [root, tonality]);

  const degrees = tonality === 'major' ? MAJOR_DEGREES : MINOR_DEGREES;
  const selectedChord = diatonicChords[selectedDegree];

  // Calculer les voicings pour l'accord sélectionné
  const chordVoicings = useMemo(() => {
    if (!selectedChord) return [];

    const chordName = selectedChord.diatonic[0];
    if (!chordName) return [];

    const match = chordName.match(/^([A-G][#b]?)(.*)$/);
    if (!match) return [];

    const chordRoot = match[1] as NoteName;
    const chordQuality = (match[2] || '') as ChordQuality;

    return getChordVoicings(chordRoot, chordQuality, 12);
  }, [selectedChord]);

  // Filtrer les voicings par difficulté
  const filteredVoicings = useMemo(() => {
    return chordVoicings.filter(v => {
      switch (difficulty) {
        case 'beginner':
          return v.difficulty === 'easy' && v.fretRange[0] < 4;
        case 'intermediate':
          return v.difficulty === 'easy' || (v.difficulty === 'medium' && v.fretRange[0] < 7);
        case 'advanced':
          return true;
      }
    });
  }, [chordVoicings, difficulty]);

  // Voicing sélectionné pour l'affichage du fretboard
  const selectedVoicing = useMemo(() => {
    if (selectedShape === 'open' && filteredVoicings.length > 0) {
      return filteredVoicings[0];
    }
    return filteredVoicings.find(v => v.id.endsWith(selectedShape)) || filteredVoicings[0];
  }, [filteredVoicings, selectedShape]);

  const fretboardData = useMemo(() => {
    if (!selectedVoicing) return [];
    return voicingToFretboardData(selectedVoicing);
  }, [selectedVoicing]);

  const fretPositions = useMemo(() => calculateFretPositions(12), []);

  const displayNote = (note: string): string => NOTE_FR[note] || note;

  return (
    <div className="section-frame p-4 mb-6">
      <h3 className="text-sm font-metal text-blood mb-4 tracking-wider uppercase">
        Accords Diatoniques
      </h3>

      {/* Sélection de difficulté */}
      <div className="flex gap-2 mb-4">
        {(Object.keys({ beginner: null, intermediate: null, advanced: null }) as DifficultyLevel[]).map((level) => (
          <button
            key={level}
            onClick={() => setDifficulty(level)}
            className={`
              px-3 py-1 text-xs font-bold uppercase border-2 transition-all
              ${difficulty === level
                ? 'bg-toxic border-blood text-white'
                : 'bg-blackness border-steel text-gray hover:border-blood'
              }
            `}
          >
            {getDifficultyLabel(level)}
          </button>
        ))}
      </div>

      {/* Liste des accords diatoniques */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {diatonicChords.map((chord, index) => {
          const isSelected = selectedDegree === index;
          const chordName = chord.diatonic[0] || '';
          const chordRoot = chordName.match(/^([A-G][#b]?)/)?.[1] as NoteName || root;
          const chordQuality = chordName.replace(/^[A-G][#b]?/, '') as ChordQuality;

          // Obtenir les notes de l'accord
          const chordNotes = buildChord(chordRoot, chordQuality);

          return (
            <button
              key={chord.degree}
              onClick={() => {
                setSelectedDegree(index);
                setSelectedShape('open');
                if (onChordSelect) {
                  onChordSelect(chordName);
                }
              }}
              className={`
                p-2 border-2 transition-all flex flex-col items-center gap-1
                ${isSelected
                  ? 'bg-blood border-blood text-white'
                  : 'bg-blackness border-steel text-gray hover:border-rust hover:text-white'
                }
              `}
            >
              <span className="text-lg font-metal">{degrees[index]}</span>
              <span className="text-xs font-bold">{chordName}</span>
              <span className="text-[10px] text-gray uppercase">{chord.function}</span>
            </button>
          );
        })}
      </div>

      {/* Détails de l'accord sélectionné */}
      {selectedChord && (
        <div className="bg-blackness border border-steel p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-2xl font-metal text-blood">
                {selectedChord.diatonic[0]}
              </span>
              <span className="text-sm text-gray ml-2">
                ({degrees[selectedDegree]})
              </span>
            </div>
            <div className="text-xs text-gray">
              {selectedChord.function}
            </div>
          </div>

          {/* Notes de l'accord */}
          <div className="flex gap-2 mb-2">
            {buildChord(
              (selectedChord.diatonic[0]?.match(/^([A-G][#b]?)/)?.[1] || root) as NoteName,
              selectedChord.diatonic[0]?.replace(/^[A-G][#b]?/, '') as ChordQuality || ''
            ).map((note) => (
              <span key={note} className="px-2 py-1 text-xs bg-toxic border border-steel">
                {displayNote(note)}
              </span>
            ))}
          </div>

          <p className="text-xs text-gray">{selectedChord.advice}</p>
        </div>
      )}

      {/* Voicings CAGED */}
      {filteredVoicings.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs text-gray uppercase tracking-wider mb-2">
            Voicings disponibles ({filteredVoicings.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {filteredVoicings.map((voicing) => (
              <button
                key={voicing.id}
                onClick={() => setSelectedShape(voicing.id)}
                className={`
                  px-3 py-1 text-xs font-bold border-2 transition-all
                  ${selectedVoicing?.id === voicing.id
                    ? 'bg-toxic border-blood text-white'
                    : 'bg-blackness border-steel text-gray hover:border-rust'
                  }
                `}
              >
                {voicing.fretRange[0] === 0 ? 'Open' : `Fret ${voicing.fretRange[0]}`}
                <span className="ml-1 text-[10px] text-gray">
                  ({voicing.difficulty === 'easy' ? ' facile' : voicing.difficulty === 'medium' ? ' moyen' : ' dur'})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fretboard pour le voicing sélectionné */}
      {selectedVoicing && fretboardData.length > 0 && (
        <div>
          <h4 className="text-xs text-gray uppercase tracking-wider mb-2">
            Diagramme: {selectedVoicing.name}
          </h4>
          <ScaleFretboard
            fretboardData={fretboardData}
            fretPositions={fretPositions}
            fretCount={selectedVoicing.fretRange[1] + 2}
            showAllNotes={false}
            displayNote={displayNote}
          />
        </div>
      )}

      {/* Extensions communes */}
      {selectedChord && selectedChord.commonExtensions && selectedChord.commonExtensions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-steel">
          <h4 className="text-xs text-gray uppercase tracking-wider mb-2">
            Extensions
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedChord.commonExtensions.map((ext) => (
              <button
                key={ext}
                onClick={() => onChordSelect?.(ext)}
                className="px-2 py-1 text-xs bg-void border border-steel hover:border-rust transition-all"
              >
                {ext}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
