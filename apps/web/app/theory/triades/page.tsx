/**
 * ADAGIO - Theory/Triads Page
 *
 * Visualisation des triades sur le manche de guitare
 * Page optimisée avec hooks et composants modulaires
 */

'use client';

import { cn } from '@adagio/ui';
import type { NoteName } from '@adagio/types';
import { MetalNav, MetalFooter } from '@/components';
import { useTriadsState } from '@/features/triades';
import { TriadsExtensions } from '@/features/triades/components';
import { TriadsFretboard } from '@/components/theory/triads';

// Constantes pour la page
const NOTES: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const QUALITY_OPTIONS = [
  { q: 'major' as const, label: 'Majeur', color: 'border-emerald-500 bg-emerald-500/20 text-emerald-400' },
  { q: 'minor' as const, label: 'Mineur', color: 'border-amber-400 bg-amber-400/20 text-amber-400' },
  { q: 'augmented' as const, label: 'Augmenté', color: 'border-red-500 bg-red-500/20 text-red-400' },
  { q: 'diminished' as const, label: 'Diminé', color: 'border-purple-500 bg-purple-500/20 text-purple-400' },
];

const FRET_OPTIONS = [12, 15, 17, 19, 21, 24] as const;

export default function TriadsPage() {
  const {
    root,
    quality,
    fretCount,
    extensions,
    triadInfo,
    chordInfo,
    fretboardNotes,
    setRoot,
    setQuality,
    setFretCount,
    toggleExtension,
    clearExtensions,
    hasExtension,
    getExtensionAlteration,
    displayNote,
    displayInterval,
  } = useTriadsState();

  return (
    <div className="min-h-screen flex flex-col bg-abyss text-white">
      <MetalNav />

      <main className="flex-1 py-12 mt-12 w-full px-4">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-metal text-white tracking-tighter mb-2">
              TRIADES
            </h1>
            <p className="text-gray text-sm uppercase tracking-widest">
              Visualisez les accords de 3 notes sur le manche
            </p>
          </div>

          {/* Layout principal avec sidebar droite */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Zone principale (gauche) */}
            <div className="flex-1 min-w-0 flex flex-col gap-4">
              {/* 1. Sélection de la note (tonique) */}
              <div className="bg-blackness/80 backdrop-blur-sm border-2 border-steel/30 rounded-none p-4">
                <label className="text-xs text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-none bg-toxic animate-pulse"></span>
                  Note racine
                </label>
                <div className="grid grid-cols-6 lg:grid-cols-12 gap-1.5">
                  {NOTES.map(note => (
                    <button
                      key={note}
                      onClick={() => setRoot(note)}
                      className={cn(
                        'py-3 text-sm font-bold border-2 rounded-none transition-all duration-200',
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

              {/* 2. Qualité de triade */}
              <div className="bg-blackness/80 backdrop-blur-sm border-2 border-steel/30 rounded-none p-4">
                <label className="text-xs text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-none bg-blood animate-pulse"></span>
                  Qualité de triade
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {QUALITY_OPTIONS.map(({ q, label, color }) => (
                    <button
                      key={q}
                      onClick={() => setQuality(q)}
                      className={cn(
                        'py-3 px-4 text-sm font-bold border-2 rounded-none transition-all duration-200',
                        quality === q
                          ? `${color} shadow-md scale-105`
                          : 'border-steel/30 text-gray-300 hover:border-steel hover:bg-white/[0.02]'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Fretboard */}
              <div className="bg-blackness/50 backdrop-blur-sm border-2 border-steel/30 rounded-none p-4">
                <TriadsFretboard
                  fretboardNotes={fretboardNotes}
                  fretCount={fretCount}
                  displayNote={displayNote}
                />
              </div>

              {/* 4. Accord actuel + Frettes (côte à côte) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Accord actuel */}
                <div className="bg-blackness/80 backdrop-blur-sm border-2 border-steel/30 rounded-none p-4">
                  <div className="mb-3">
                    <label className="text-xs text-gray-400 uppercase tracking-widest flex items-center gap-2 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-none bg-circuit animate-pulse"></span>
                      Accord actuel
                    </label>
                    <span className="text-2xl font-metal text-amber-400 ml-2">
                      {chordInfo.chordName}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {chordInfo.allNotes.map((note, i) => {
                      const interval = chordInfo.allIntervals[i];
                      if (!interval) return null;
                      const isRoot = note === root;
                      const colorClass = isRoot ? 'bg-toxic/30 border-toxic' :
                                        interval === '3' ? 'bg-emerald-500/30 border-emerald-500' :
                                        interval === 'b3' ? 'bg-amber-400/30 border-amber-400' :
                                        interval === '5' ? 'bg-cyan-400/30 border-cyan-400' :
                                        interval === '#5' ? 'bg-red-400/30 border-red-400' :
                                        interval === 'b5' ? 'bg-purple-500/30 border-purple-500' :
                                        interval === '7' ? 'bg-rose-400/30 border-rose-400' :
                                        interval === 'b7' ? 'bg-orange-400/30 border-orange-400' :
                                        interval === '9' ? 'bg-teal-400/30 border-teal-400' :
                                        interval === '11' ? 'bg-sky-400/30 border-sky-400' :
                                        interval === '13' ? 'bg-fuchsia-400/30 border-fuchsia-400' :
                                        interval === '2' ? 'bg-blue-400/30 border-blue-400' :
                                        interval === 'b2' ? 'bg-blue-400/20 border-blue-400/50' :
                                        interval === '4' ? 'bg-indigo-400/30 border-indigo-400' :
                                        interval === 'b4' ? 'bg-indigo-400/20 border-indigo-400/50' :
                                        interval === '6' ? 'bg-violet-400/30 border-violet-400' :
                                        interval === 'b6' ? 'bg-violet-400/20 border-violet-400/50' :
                                        'bg-gray-500/30 border-gray-500';
                      return (
                        <div key={note} className={cn('px-3 py-2 border-2 rounded-none text-center min-w-[60px]', colorClass)}>
                          <p className="text-sm font-bold text-white">{displayNote(note)}</p>
                          <p className="text-xs text-gray-300">{displayInterval(interval)}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Frettes */}
                <div className="bg-blackness/80 backdrop-blur-sm border-2 border-steel/30 rounded-none p-4">
                  <label className="text-xs text-gray-400 uppercase tracking-widest flex items-center gap-2 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-none bg-cyan-400 animate-pulse"></span>
                    Nombre de frettes
                  </label>
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {FRET_OPTIONS.map(frets => (
                      <button
                        key={frets}
                        onClick={() => setFretCount(frets)}
                        className={cn(
                          'py-3 text-sm font-bold border-2 rounded-none transition-all duration-200',
                          fretCount === frets
                            ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400'
                            : 'border-steel/30 text-gray-300 hover:border-cyan-400/50'
                        )}
                      >
                        {frets}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar droite - Extensions */}
            <aside className="w-full lg:w-80 bg-blackness/80 backdrop-blur-sm border-2 border-steel/30 rounded-none p-4">
              <TriadsExtensions
                extensions={extensions}
                onToggleExtension={toggleExtension}
                hasExtension={hasExtension}
                getExtensionAlteration={getExtensionAlteration}
                onClearExtensions={clearExtensions}
              />
            </aside>
          </div>
        </div>
      </main>

      <MetalFooter />
    </div>
  );
}
