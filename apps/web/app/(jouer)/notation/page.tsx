/**
 * ADAGIO - Notation Page
 * Notation musicale brute
 * Partition française, accords et progressions
 */

'use client';

import { MetalNav, MetalFooter } from '@/components';
import { NotationTabs, NotesSection, ChordsSection, ProgressionsSection } from '@/components/theory/notation';
import { useNotationState } from '@/features/theory';

export default function NotationPage() {
  const { selectedTab, setSelectedTab } = useNotationState();

  return (
    <div className="min-h-screen flex flex-col bg-abyss">
      <MetalNav />

      <main className="flex-1 px-4 py-24 mt-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-metal text-white tracking-tighter mb-2">
              NOTATION
            </h1>
            <p className="text-gray text-sm uppercase tracking-widest">
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
