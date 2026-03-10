/**
 * ADAGIO - ChordsSidebar Component
 * Sidebar pour la sélection de tonalité et degré
 */

'use client';

import { cn } from '@adagio/ui';
import type { NoteName, ChordDegree } from '@adagio/types';
import { getDiatonicChordsByDegree } from '@adagio/theory';

// ============================================================================
// TYPES
// ============================================================================

export type TonalityType = 'major' | 'minor';

export interface ChordsSidebarProps {
  // State
  root: NoteName;
  tonality: TonalityType;
  selectedDegree: string;
  selectedChordName: string | null;

  // Constants
  notes: NoteName[];
  majorDegreeQualities: Record<string, string[]>;
  minorDegreeQualities: Record<string, string[]>;

  // Callbacks
  onTonalityChange: (tonality: TonalityType) => void;
  onRootChange: (note: NoteName) => void;
  onDegreeChange: (degree: string) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function ChordsSidebar({
  root,
  tonality,
  selectedDegree,
  selectedChordName,
  notes,
  majorDegreeQualities,
  minorDegreeQualities,
  onTonalityChange,
  onRootChange,
  onDegreeChange,
}: ChordsSidebarProps) {
  return (
    <aside className="w-72 bg-blackness/80 backdrop-blur-sm border-r border-steel/30 overflow-y-auto shrink-0">
      <div className="p-5">
        {/* Header */}
        <div className="mb-6 pb-4 border-b border-steel/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-none bg-gradient-to-br from-blood to-blood/70 flex items-center justify-center">
              <span className="text-xl">♬</span>
            </div>
            <div>
              <h1 className="text-2xl font-metal text-white">ACCORDS</h1>
              <p className="text-sm text-gray-400">Bibliothèque diatonique</p>
            </div>
          </div>
        </div>

        {/* Tonalité */}
        <div className="mb-6">
          <label className="text-xs text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2 font-semibold">
            <span className="w-1.5 h-1.5 rounded-none bg-blood animate-pulse"></span>
            Tonalité
          </label>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => onTonalityChange('major')}
              className={cn(
                'flex-1 py-2.5 text-sm font-bold uppercase border-2 rounded-none transition-all duration-300',
                tonality === 'major'
                  ? 'border-blood bg-gradient-to-br from-blood/30 to-blood/10 text-white shadow-lg shadow-blood/20'
                  : 'border-steel/30 text-gray-300 hover:border-steel hover:bg-white/[0.02]'
              )}
            >
              Majeur
            </button>
            <button
              onClick={() => onTonalityChange('minor')}
              className={cn(
                'flex-1 py-2.5 text-sm font-bold uppercase border-2 rounded-none transition-all duration-300',
                tonality === 'minor'
                  ? 'border-blood bg-gradient-to-br from-blood/30 to-blood/10 text-white shadow-lg shadow-blood/20'
                  : 'border-steel/30 text-gray-300 hover:border-steel hover:bg-white/[0.02]'
              )}
            >
              Mineur
            </button>
          </div>

          {/* Note selector */}
          <div className="grid grid-cols-6 gap-1.5">
            {notes.map(note => (
              <button
                key={note}
                onClick={() => onRootChange(note)}
                className={cn(
                  'py-2 text-xs font-bold border-2 rounded-none transition-all duration-200',
                  root === note
                    ? 'border-amber-400 bg-gradient-to-br from-amber-400/30 to-amber-600/10 text-amber-400 shadow-lg shadow-amber-400/20 scale-105'
                    : 'border-steel/30 text-gray-300 hover:border-amber-400/50 hover:text-amber-400 hover:scale-105'
                )}
              >
                {note}
              </button>
            ))}
          </div>
        </div>

        {/* Degré */}
        <div className="mb-5">
          <label className="text-xs text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2 font-semibold">
            <span className="w-1.5 h-1.5 rounded-none bg-toxic animate-pulse"></span>
            Degré
          </label>
          <div className="flex flex-wrap gap-1.5">
            {getDiatonicChordsByDegree(root, tonality).map((deg) => {
              const diatonicCount = tonality === 'major'
                ? majorDegreeQualities[deg.degree]?.length || 0
                : minorDegreeQualities[deg.degree]?.length || 0;

              return (
                <button
                  key={deg.degree}
                  onClick={() => onDegreeChange(deg.degree)}
                  className={cn(
                    'px-3 py-1.5 text-sm font-bold border-2 rounded-none transition-all duration-200 relative',
                    selectedDegree === deg.degree
                      ? 'border-amber-400 bg-amber-400/20 text-amber-400 shadow-md shadow-amber-400/10'
                      : 'border-steel/30 text-gray-300 hover:border-amber-400/50 hover:text-amber-400'
                  )}
                >
                  {deg.degree}
                  {diatonicCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-none bg-emerald-500 text-white text-[10px] font-bold">
                      {diatonicCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Info actuelle */}
        <div className="p-4 border-2 border-steel/30 rounded-none bg-gradient-to-br from-void to-abyss">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Tonique actuelle</p>
          <p className="text-3xl font-metal text-amber-400 mb-1">{root}</p>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            {selectedChordName ? (
              <>
                <span className="w-2 h-2 rounded-none bg-emerald-500"></span>
                {selectedChordName}
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-none bg-blue-500"></span>
                Degré {selectedDegree}
              </>
            )}
          </div>
        </div>

        {/* Légende */}
        <div className="mt-6 p-4 border-2 border-steel/20 rounded-none bg-void/50">
          <p className="text-xs text-gray-400 mb-3 font-semibold">Accords diatoniques</p>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-none bg-emerald-500"></span>
              <span>Vert = Diatonique</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-none bg-blue-500"></span>
              <span>Bleu = Extension</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-none bg-red-500"></span>
              <span>Rouge = Altération</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
