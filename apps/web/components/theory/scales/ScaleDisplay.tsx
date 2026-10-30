/**
 * ADAGIO - ScaleDisplay Component
 * Affichage des informations de la gamme sélectionnée
 */

'use client';

import type { Interval } from '@adagio/types';
import { useMemo } from 'react';
import type { FretboardNote } from '@adagio/types';

// Convertir les intervalles vers notation musicale avec symboles (♯, ♭, ♮)
function formatInterval(interval: Interval): string {
  const symbols: Record<string, string> = {
    '#': '♯',
    b: '♭',
    bb: '♭♭',
    '##': '♯♯',
  };
  let result: string = interval;
  for (const [key, symbol] of Object.entries(symbols)) {
    result = result.replace(new RegExp(key, 'g'), symbol);
  }
  return result;
}

// Obtenir le pattern T-S (Ton - Seconde/demi-ton) pour une gamme
function getTSPattern(intervals: Interval[]): string {
  const semitones: Record<Interval, number> = {
    '1': 0,
    '#1': 1,
    b2: 1,
    '2': 2,
    '#2': 3,
    b3: 3,
    '3': 4,
    b4: 4,
    '4': 5,
    '#4': 6,
    b5: 6,
    '5': 7,
    '#5': 8,
    b6: 8,
    bb6: 8,
    '6': 9,
    '#6': 10,
    bb7: 9,
    b7: 10,
    '7': 11,
    '#3': 5,
    b9: 13,
    '9': 14,
    '#9': 15,
    '11': 17,
    '#11': 18,
    b13: 20,
    '13': 21,
  };

  const pattern: string[] = [];
  let prevSemitone = 0;

  for (const interval of intervals) {
    const currentSemitone = semitones[interval] ?? 0;
    const diff = currentSemitone - prevSemitone;
    pattern.push(diff === 2 ? 'T' : diff === 1 ? 'S' : diff === 3 ? 'TS' : '?');
    prevSemitone = currentSemitone;
  }

  // Retour au départ (octave)
  const octaveDiff = 12 - prevSemitone;
  pattern.push(octaveDiff === 2 ? 'T' : octaveDiff === 1 ? 'S' : octaveDiff === 3 ? 'TS' : '?');

  return pattern.join('-');
}

interface ScaleDisplayProps {
  root: string;
  scaleDef: {
    id: string;
    name: string;
    nameFr: string;
    description: string;
    intervals: Interval[];
  } | null;
  scaleNotes: Interval[];
  fretboardData: FretboardNote[];
  displayNote: (note: string) => string;
}

export function ScaleDisplay({
  root,
  scaleDef,
  scaleNotes: _scaleNotes,
  fretboardData,
  displayNote,
}: ScaleDisplayProps) {
  // Obtenir les notes uniques de la gamme pour l'affichage
  const uniqueScaleNotes = useMemo(() => {
    const notesInScale = fretboardData.filter((d) => d.inScale).map((d) => d.name);
    return Array.from(new Set(notesInScale)).sort();
  }, [fretboardData]);

  if (!scaleDef) {
    return null;
  }

  return (
    <div className="section-frame p-6 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-metal text-white uppercase">
            {displayNote(root)} {scaleDef.nameFr}
          </h2>
          <p className="text-sm text-gray">{scaleDef.description}</p>
        </div>
        <div className="flex gap-2">
          {uniqueScaleNotes.map((note) => (
            <div key={note} className="text-center">
              <span className="px-2 py-1 text-xs bg-surface border border-steelwarm text-white">{displayNote(note)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Formule d'intervalles avec notation musicale */}
      <div className="mt-4 pt-4 border-t border-steelwarm">
        <div className="flex flex-wrap items-center gap-4 mb-3">
          <span className="text-xs text-gray uppercase tracking-wider">FORMULE</span>
          <div className="flex gap-1">
            {scaleDef.intervals.map((interval, i) => (
              <span
                key={i}
                className={`px-2 py-1 text-sm font-bold border-2 ${
                  interval === '1'
                    ? 'border-amber-400 bg-amber-400/20 text-amber-400'
                    : interval === '5'
                      ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400'
                      : ['b3', 'b7', 'bb6', 'bb7'].includes(interval)
                        ? 'border-rose-400 bg-rose-400/20 text-rose-400'
                        : ['3', '7', '#6'].includes(interval)
                          ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                          : ['4', '#4', 'b4', 'b5'].includes(interval)
                            ? 'border-indigo-400 bg-indigo-400/20 text-indigo-400'
                            : 'border-steelwarm bg-surface text-white'
                }`}
              >
                {formatInterval(interval)}
              </span>
            ))}
          </div>
        </div>

        {/* Pattern T-S */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray uppercase tracking-wider">STRUCTURE</span>
          <span className="px-3 py-1 text-xs bg-surface text-white border border-steelwarm">
            {getTSPattern(scaleDef.intervals)}
            <span className="ml-2 text-gray">
              {' '}
              · T = Ton (2 demi-tons) · S = Seconde (1 demi-ton)
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
