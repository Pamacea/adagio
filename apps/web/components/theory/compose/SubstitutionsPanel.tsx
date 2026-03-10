/**
 * ADAGIO - SubstitutionsPanel Component
 * Panneau pour les substitutions harmoniques (dominantes secondaires, emprunts modaux, etc.)
 */

'use client';

import { useMemo } from 'react';
import type { NoteName, ChordDegree } from '@adagio/types';
import {
  getSecondaryDominants,
  getModalInterchangeChords,
  getDegreeNote,
} from '@adagio/theory';
import { NOTE_FR } from '@/lib/theory';

// ============================================================================
// TYPES
// ============================================================================

export interface SubstitutionsPanelProps {
  /** Tonique de la tonalité */
  root: NoteName;
  /** Mode majeur/mineur */
  tonality: 'major' | 'minor';
  /** Callback lorsqu'une substitution est appliquée */
  onSubstitutionApply?: (chord: string) => void;
}

// ============================================================================
// SECONDARY DOMINANTS DATA
// ============================================================================

const SECONDARY_DOMINANT_INFO: Record<string, { name: string; description: string }> = {
  'II': { name: 'II7', description: 'V7/II - Prépare le II' },
  'III': { name: 'III7', description: 'V7/III - Prépare le III' },
  'IV': { name: 'IV7', description: 'V7/IV - Prépare le IV' },
  'V': { name: 'V7', description: 'Dominant principal' },
  'VI': { name: 'VI7', description: 'V7/VI - Prépare le VI' },
};

// ============================================================================
// MODAL INTERCHANGE DATA
// ============================================================================

const MODAL_INTERCHANGE_INFO: Record<string, {
  degrees: ChordDegree[];
  name: string;
  description: string;
  target: string;
}> = {
  'lydian': {
    degrees: ['IV'],
    name: 'Lydien',
    description: 'IV#4 - Sonnerie brillante et mystérieuse',
    target: 'IV',
  },
  'mixolydian': {
    degrees: ['V'],
    name: 'Mixolydien',
    description: 'V7 - Sonnerie bluesy et résolutive',
    target: 'V',
  },
  'dorian': {
    degrees: ['II'],
    name: 'Dorien',
    description: 'IV (en majeur) - Sonnerie jazz mineure',
    target: 'II',
  },
  'phrygian': {
    degrees: ['bII'],
    name: 'Phrygien',
    description: 'bII - Sonnerie espagnole/flamenco',
    target: 'bII',
  },
};

// ============================================================================
// PARALLEL KEYS DATA
// ============================================================================

const getParallelKeyChords = (root: NoteName, currentTonality: 'major' | 'minor'): string[] => {
  const parallelTonality = currentTonality === 'major' ? 'minor' : 'major';

  // Accords de la tonalité parallèle
  if (currentTonality === 'major') {
    // Vers mineur parallèle
    return [
      `${root}m`,       // i
      `${root}m7`,      // i7
    ];
  } else {
    // Vers majeur parallèle
    return [
      `${root}`,        // I
      `${root}maj7`,    // Imaj7
    ];
  }
};

const getRelativeKeyChords = (root: NoteName, currentTonality: 'major' | 'minor'): {
  key: string;
  chords: string[];
  description: string;
} => {
  const majorScales = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab'] as NoteName[];
  const minorScales = ['A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'D', 'G', 'C', 'F'] as NoteName[];

  if (currentTonality === 'major') {
    // Relative mineure: 3 demi-tons plus bas
    const rootIndex = majorScales.indexOf(root);
    const relativeMinor = minorScales[rootIndex];
    return {
      key: `${relativeMinor} min`,
      chords: [
        `${relativeMinor}m`,
        `${relativeMinor}m7`,
      ],
      description: `Relative mineure de ${root}`,
    };
  } else {
    // Relative majeure: 3 demi-tons plus haut
    const rootIndex = minorScales.indexOf(root);
    const relativeMajor = majorScales[rootIndex];
    return {
      key: `${relativeMajor} maj`,
      chords: [
        `${relativeMajor}`,
        `${relativeMajor}maj7`,
      ],
      description: `Relative majeure de ${root}`,
    };
  }
};

// ============================================================================
// COMPONENT
// ============================================================================

export function SubstitutionsPanel({
  root,
  tonality,
  onSubstitutionApply,
}: SubstitutionsPanelProps) {
  // Calculer les dominantes secondaires
  const secondaryDominants = useMemo(() => {
    return getSecondaryDominants(root, tonality);
  }, [root, tonality]);

  // Calculer les accords d'emprunt modal
  const modalInterchange = useMemo(() => {
    return getModalInterchangeChords(root, tonality);
  }, [root, tonality]);

  // Accords de la tonalité parallèle
  const parallelChords = useMemo(() => {
    return getParallelKeyChords(root, tonality);
  }, [root, tonality]);

  // Accords de la tonalité relative
  const relativeInfo = useMemo(() => {
    return getRelativeKeyChords(root, tonality);
  }, [root, tonality]);

  const displayNote = (note: string): string => NOTE_FR[note] || note;

  return (
    <div className="section-frame p-4 mb-6">
      <h3 className="text-sm font-metal text-blood mb-4 tracking-wider uppercase">
        Substitutions Harmoniques
      </h3>

      {/* Dominantes Secondaires */}
      <div className="mb-6">
        <h4 className="text-xs text-gray uppercase tracking-wider mb-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-rust"></span>
          Dominantes Secondaires (V/x)
        </h4>
        <p className="text-xs text-gray mb-3">
          Créez des tensions en dominant un autre degré que la tonique.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(secondaryDominants).map(([degree, chords]) => {
            const info = SECONDARY_DOMINANT_INFO[degree];
            if (!info) return null;

            return (
              <div key={degree} className="bg-blackness border border-steel p-2">
                <div className="text-xs text-gray mb-1">{info.name}</div>
                <div className="text-[10px] text-gray mb-2">{info.description}</div>
                {chords.map((chord) => (
                  <button
                    key={chord}
                    onClick={() => onSubstitutionApply?.(chord)}
                    className="w-full px-2 py-1 text-xs bg-toxic border border-steel hover:border-rust transition-all mb-1"
                  >
                    {displayNote(chord.replace(/7b?9?$/, ''))}
                    <span className="text-gray">{chord.match(/[0-9]/)?.[0] || ''}</span>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Emprunt Modal */}
      <div className="mb-6">
        <h4 className="text-xs text-gray uppercase tracking-wider mb-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-toxic"></span>
          Emprunt Modal (Modal Interchange)
        </h4>
        <p className="text-xs text-gray mb-3">
          Empruntez des accords à la tonalité parallèle pour créer de la couleur.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(MODAL_INTERCHANGE_INFO).map(([mode, info]) => {
            // Filtrer selon la tonalité
            if (tonality === 'major' && mode === 'dorian') return null;

            const targetDegree = info.degrees[0];
            if (!targetDegree) return null;

            const targetNote = getDegreeNote(root, targetDegree, tonality);

            return (
              <div key={mode} className="bg-blackness border border-steel p-2">
                <div className="text-xs text-blood mb-1">{info.name}</div>
                <div className="text-[10px] text-gray mb-2">{info.description}</div>
                <button
                  onClick={() => onSubstitutionApply?.(`${displayNote(targetNote)}`)}
                  className="w-full px-2 py-1 text-xs bg-toxic border border-steel hover:border-rust transition-all"
                >
                  {displayNote(targetNote)}
                </button>
              </div>
            );
          })}
        </div>

        {/* Liste des accords d'emprunt disponibles */}
        {modalInterchange.length > 0 && (
          <div className="mt-3">
            <div className="text-[10px] text-gray uppercase tracking-wider mb-1">
              Accords disponibles
            </div>
            <div className="flex flex-wrap gap-1">
              {modalInterchange.map((chord) => (
                <button
                  key={chord}
                  onClick={() => onSubstitutionApply?.(chord)}
                  className="px-2 py-1 text-xs bg-void border border-steel hover:border-rust transition-all"
                  title={chord}
                >
                  {displayNote(chord.replace(/m.*$/, 'm'))}
                  {chord.match(/[0-9]/)?.[0] || ''}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tonalités Parallèles et Relatives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tonalité Parallèle */}
        <div>
          <h4 className="text-xs text-gray uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-blood"></span>
            Tonalité Parallèle
          </h4>
          <p className="text-xs text-gray mb-2">
            Même tonique, mode opposé ({tonality === 'major' ? 'mineur' : 'majeur'})
          </p>
          <div className="bg-blackness border border-steel p-2">
            <div className="text-[10px] text-gray mb-1">
              {tonality === 'major' ? `Mineur parallèle de ${root}` : `Majeur parallèle de ${root}`}
            </div>
            <div className="flex flex-wrap gap-1">
              {parallelChords.map((chord) => (
                <button
                  key={chord}
                  onClick={() => onSubstitutionApply?.(chord)}
                  className="px-2 py-1 text-xs bg-toxic border border-steel hover:border-rust transition-all"
                >
                  {displayNote(chord.replace(/m.*$/, 'm'))}
                  {chord.includes('7') ? '7' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tonalité Relative */}
        <div>
          <h4 className="text-xs text-gray uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-toxic"></span>
            Tonalité Relative
          </h4>
          <p className="text-xs text-gray mb-2">
            Même armure, tonique différente ({relativeInfo.key})
          </p>
          <div className="bg-blackness border border-steel p-2">
            <div className="text-[10px] text-gray mb-1">
              {relativeInfo.description}
            </div>
            <div className="flex flex-wrap gap-1">
              {relativeInfo.chords.map((chord) => (
                <button
                  key={chord}
                  onClick={() => onSubstitutionApply?.(chord)}
                  className="px-2 py-1 text-xs bg-toxic border border-steel hover:border-rust transition-all"
                >
                  {displayNote(chord.replace(/m.*$/, 'm'))}
                  {chord.includes('7') ? '7' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Switch */}
      <div className="mt-4 pt-4 border-t border-steel">
        <h4 className="text-xs text-gray uppercase tracking-wider mb-2">
          Changements Rapides
        </h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSubstitutionApply?.(`${root}${tonality === 'major' ? 'm' : ''}`)}
            className="px-3 py-1 text-xs bg-blood text-white border border-blood hover:bg-rust transition-all"
          >
            Parallèle
          </button>
          <button
            onClick={() => {
              const relativeRoot = tonality === 'major'
                ? getDegreeNote(root, 'VI', 'major')
                : getDegreeNote(root, 'III', 'minor');
              onSubstitutionApply?.(`${displayNote(relativeRoot)}${tonality === 'major' ? 'm' : ''}`);
            }}
            className="px-3 py-1 text-xs bg-toxic border border-steel hover:border-rust transition-all"
          >
            Relative
          </button>
          <button
            onClick={() => onSubstitutionApply?.(`${root}7`)}
            className="px-3 py-1 text-xs bg-blackness border border-steel hover:border-rust transition-all"
          >
            Dominante
          </button>
          <button
            onClick={() => onSubstitutionApply?.(`${root}dim7`)}
            className="px-3 py-1 text-xs bg-blackness border border-steel hover:border-rust transition-all"
          >
            Dim7°
          </button>
        </div>
      </div>
    </div>
  );
}
