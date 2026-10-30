/**
 * ADAGIO - Notation Page
 * Notation musicale brute
 * Partition française, accords et progressions
 */

'use client';

import { MetalNav, MetalFooter } from '@/components';
import {
  NotationTabs,
  NotesSection,
  ChordsSection,
  ProgressionsSection,
} from '@/components/theory/notation';
import { useNotationState } from '@/features/theory';

export default function NotationPage() {
  const { selectedTab, setSelectedTab } = useNotationState();

  return (
    <div className="min-h-screen flex flex-col bg-abyss">
      <MetalNav />

      <main className="flex-1 px-4 py-24 mt-16">
        <div className="mx-auto" style={{ maxWidth: "72rem" }}>
          {/* Header */}
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-gray">Jouer · Notation</p>
            <h1 className="mt-2 text-3xl font-metal uppercase tracking-tighter text-white sm:text-4xl">
              Notation
            </h1>
            <p className="mt-2 text-sm uppercase tracking-widest text-gray">
              Partition et accords
            </p>
          </div>

          {/* Tabs */}
          <NotationTabs selectedTab={selectedTab} onTabChange={setSelectedTab} />

          {/* Content */}
          {selectedTab === 'notes' && <NotesSection />}
          {selectedTab === 'chords' && <ChordsSection />}
          {selectedTab === 'progressions' && <ProgressionsSection />}
        </div>
      </main>

      <MetalFooter />
    </div>
  );
}
