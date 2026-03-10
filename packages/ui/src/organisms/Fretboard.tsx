/**
 * Fretboard - Interactive Guitar Fretboard Component
 *
 * Displays notes on a guitar fretboard with scale highlighting
 * Enhanced design with better contrast and visibility
 */

'use client';

import { type NoteName, type FretboardNote as FretboardNoteType } from '@adagio/types';
import { cn } from '../lib/cn';

export interface FretboardProps {
  notes: FretboardNoteType[];
  root?: NoteName;
  showFretNumbers?: boolean;
  showStringNumbers?: boolean;
  className?: string;
  onClickNote?: (note: FretboardNoteType) => void;
}

const STRING_NAMES = ['E', 'B', 'G', 'D', 'A', 'E'] as const; // High to low

export function Fretboard({
  notes,
  root,
  showFretNumbers = true,
  showStringNumbers = true,
  className,
  onClickNote,
}: FretboardProps) {
  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <div
        className="min-w-[800px] rounded-lg p-5 border border-steel/30"
        style={{
          background: 'linear-gradient(180deg, #1a1510 0%, #0d0a08 50%, #1a1510 100%)',
        }}
      >
        {/* Fretboard container */}
        <div className="relative">
          {/* Nut (open string indicator) */}
          <div
            className="absolute left-0 top-0 bottom-0 w-5 rounded-l-sm shadow-lg"
            style={{ background: 'linear-gradient(90deg, #3d3225 0%, #2a2319 100%)' }}
          />

          {/* Fretboard grid */}
          <div className="ml-5 space-y-4">
            {STRING_NAMES.map((stringName, stringIndex) => (
              <div key={stringName} className="relative flex items-center h-12">
                {/* String indicator */}
                {showStringNumbers && (
                  <div className="absolute -left-9 w-7 text-center text-sm font-bold text-gray-500 bg-black/30 rounded">
                    {stringIndex + 1}
                  </div>
                )}

                {/* String line */}
                <div
                  className="flex-1 h-0.5 rounded-full relative"
                  style={{ background: 'linear-gradient(90deg, #6b5a45 0%, #8a7358 50%, #6b5a45 100%)' }}
                >
                  {/* Frets */}
                  {Array.from({ length: 13 }, (_, fret) => {
                    const noteAtPosition = notes.find(
                      (n) => n.string === stringIndex && n.fret === fret
                    );

                    return (
                      <div
                        key={fret}
                        className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center"
                        style={{
                          left: fret === 0 ? 0 : `${fret * 7.5}%`,
                          width: fret === 0 ? 20 : '7.5%',
                        }}
                      >
                        {/* Note marker - Enhanced design */}
                        {noteAtPosition && (
                          <button
                            onClick={() => onClickNote?.(noteAtPosition)}
                            className={cn(
                              'w-9 h-9 rounded-full text-sm font-bold flex items-center justify-center transition-all hover:scale-125 shadow-lg',
                              noteAtPosition.name === root
                                ? 'bg-gradient-to-br from-amber-300 to-amber-500 text-neutral-900 ring-2 ring-amber-300 ring-offset-2 ring-offset-neutral-900 shadow-amber-500/50'
                                : noteAtPosition.inScale
                                ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-emerald-500/30'
                                : 'bg-neutral-700 text-neutral-400'
                            )}
                            style={
                              !noteAtPosition.inScale
                                ? { background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)' }
                                : undefined
                            }
                          >
                            {noteAtPosition.name}
                          </button>
                        )}

                        {/* Fret marker (single dot at 3, 5, 7, 9) */}
                        {!noteAtPosition &&
                          [3, 5, 7, 9].includes(fret) &&
                          fret !== 0 && (
                            <div
                              className="w-2.5 h-2.5 rounded-full shadow-inner"
                              style={{ background: 'radial-gradient(circle, #4a5568 0%, #2d3748 100%)' }}
                            />
                          )}

                        {/* Double fret marker (12th fret) */}
                        {!noteAtPosition && fret === 12 && (
                          <div className="flex gap-4">
                            <div
                              className="w-2.5 h-2.5 rounded-full shadow-inner"
                              style={{ background: 'radial-gradient(circle, #4a5568 0%, #2d3748 100%)' }}
                            />
                            <div
                              className="w-2.5 h-2.5 rounded-full shadow-inner"
                              style={{ background: 'radial-gradient(circle, #4a5568 0%, #2d3748 100%)' }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Fret lines */}
                {Array.from({ length: 13 }, (_, fret) =>
                  fret > 0 ? (
                    <div
                      key={fret}
                      className="absolute top-0 bottom-0 shadow-md"
                      style={{
                        left: `${fret * 7.5}%`,
                        width: '2px',
                        background: 'linear-gradient(180deg, #8b7355 0%, #5c4a3a 50%, #8b7355 100%)',
                      }}
                    />
                  ) : null
                )}
              </div>
            ))}
          </div>

          {/* Fret numbers */}
          {showFretNumbers && (
            <div className="ml-5 flex mt-3">
              {Array.from({ length: 13 }, (_, fret) => (
                <div
                  key={fret}
                  className="text-xs font-bold text-gray-500"
                  style={{ width: fret === 0 ? 20 : '7.5%' }}
                >
                  {fret > 0 && (
                    <span className="ml-1 block text-center bg-black/30 px-1.5 py-0.5 rounded">
                      {fret}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
