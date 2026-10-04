/**
 * ADAGIO - Theory/Renversements Page
 * Renversements d'accords (fondamentale, 6te, 6/4) — Sheet [MUSIC] Guitar
 */

import type { Metadata } from 'next';
import { getSheetTab } from '@adagio/theory';
import { MetalNav, MetalFooter } from '@/components';
import { SheetTabTables } from '@/components/theory/sheet/SheetTable';

export const metadata: Metadata = {
  title: 'Renversements',
  description:
    'Renversements d’accords : fondamentale, premier renversement (sixte), second renversement (sixte et quarte).',
};

export default function RenversementsPage() {
  const tab = getSheetTab('renversement');

  return (
    <div className="min-h-screen flex flex-col bg-abyss text-white">
      <MetalNav />

      <main className="flex-1 py-12 mt-12 w-full px-4">
        <div className="mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl lg:text-5xl font-metal text-white tracking-tighter mb-2">
              RENVERSEMENTS
            </h1>
            <p className="text-gray text-sm uppercase tracking-widest">
              Les mêmes notes, autre ordre — autre couleur
            </p>
          </div>

          {/* Intro */}
          <div className="border-2 border-steel/30 bg-blackness/80 p-6 mb-8">
            <p className="text-sm text-gray-300 leading-relaxed">
              Un renversement déplace la fondamentale ailleurs qu’à la basse. L’accord garde
              exactement les mêmes notes, mais le son change : la basse guide l’oreille vers une
              nouvelle résolution. Les trois positions d’une triade suffisent à enrichir n’importe
              quelle progression.
            </p>
          </div>

          {/* Tableau issu du Sheet */}
          <SheetTabTables sections={tab.sections} cfHref="/theory/chords" />

          {/* Raccourci mémoire */}
          <div className="border-2 border-toxic/40 bg-toxic/5 p-6">
            <h2 className="text-lg font-metal text-toxic uppercase tracking-tight mb-3">
              Raccourci
            </h2>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>
                <span className="text-white font-bold">Fondamentale en bas</span> → l’accord « sonne
                » comme indiqué (I, IV, V…)
              </li>
              <li>
                <span className="text-white font-bold">3è en bas</span> → sixte (6) : plus doux,
                plus fluide — idéal en ligne de basse qui monte
              </li>
              <li>
                <span className="text-white font-bold">5è en bas</span> → sixte et quarte (6/4) :
                position de tension, souvent passage obligé avant la résolution
              </li>
            </ul>
          </div>
        </div>
      </main>

      <MetalFooter />
    </div>
  );
}
