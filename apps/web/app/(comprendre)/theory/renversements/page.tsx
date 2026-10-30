/**
 * ADAGIO - Theory/Renversements Page
 * Renversements d'accords (fondamentale, 6te, 6/4) — Sheet [MUSIC] Guitar
 */

import type { Metadata } from 'next';
import { ChordDiagram, type ChordFingerPosition } from '@adagio/ui/organisms/ChordDiagram';
import { getSheetTab } from '@adagio/theory';
import { MetalNav, MetalFooter } from '@/components';
import { SheetTabTables } from '@/components/theory/sheet/SheetTable';
import { TheorySection } from '@/components/theory/sheet/TheorySection';

export const metadata: Metadata = {
  title: 'Renversements',
  description:
    'Renversements d’accords : fondamentale, premier renversement (sixte), second renversement (sixte et quarte).',
};

const ANCHORS = [
  { href: '#positions', label: 'Positions' },
  { href: '#tableau', label: 'Tableau de référence' },
  { href: '#raccourci', label: 'Raccourci' },
];

// Voicings ouverts vérifiables (cordes 0 = mi grave) : C = x32010, C/E = 032010, C/G = 332010.
const INVERSIONS: { name: string; detail: string; positions: ChordFingerPosition[] }[] = [
  {
    name: 'C',
    detail: 'Fondamentale — la tonique à la basse',
    positions: [
      { string: 0, fret: -1 },
      { string: 1, fret: 3, interval: 'R' },
      { string: 2, fret: 2, interval: '3' },
      { string: 3, fret: 0, interval: '5' },
      { string: 4, fret: 1, interval: 'R' },
      { string: 5, fret: 0, interval: '3' },
    ],
  },
  {
    name: 'C/E',
    detail: '1er renversement — la tierce à la basse',
    positions: [
      { string: 0, fret: 0, interval: '3' },
      { string: 1, fret: 3, interval: 'R' },
      { string: 2, fret: 2, interval: '3' },
      { string: 3, fret: 0, interval: '5' },
      { string: 4, fret: 1, interval: 'R' },
      { string: 5, fret: 0, interval: '3' },
    ],
  },
  {
    name: 'C/G',
    detail: '2nd renversement — la quinte à la basse',
    positions: [
      { string: 0, fret: 3, interval: '5' },
      { string: 1, fret: 3, interval: 'R' },
      { string: 2, fret: 2, interval: '3' },
      { string: 3, fret: 0, interval: '5' },
      { string: 4, fret: 1, interval: 'R' },
      { string: 5, fret: 0, interval: '3' },
    ],
  },
];

const RACCOURCIS = [
  {
    label: 'Fondamentale en bas',
    text: 'L’accord « sonne » comme indiqué (I, IV, V…).',
  },
  {
    label: '3è en bas',
    text: 'Sixte (6) : plus doux, plus fluide — idéal en ligne de basse qui monte.',
  },
  {
    label: '5è en bas',
    text: 'Sixte et quarte (6/4) : position de tension, souvent passage obligé avant la résolution.',
  },
];

export default function RenversementsPage() {
  const tab = getSheetTab('renversement');

  return (
    <div className="min-h-screen flex flex-col bg-abyss text-white font-sans">
      <MetalNav />

      <main className="flex-1 py-14 mt-12 w-full px-5 sm:px-6">
        <div className="mx-auto" style={{ maxWidth: '64rem' }}>
          {/* Header */}
          <header className="mb-16">
            <p className="text-xs uppercase tracking-widest text-gray">Théorie · Renversements</p>
            <h1 className="mt-2 text-3xl font-metal uppercase tracking-tighter text-white sm:text-4xl">
              Renversements
            </h1>
            <p className="mt-2 text-sm uppercase tracking-widest text-gray">
              Les mêmes notes, un autre ordre — une autre couleur
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray" style={{ maxWidth: '46rem' }}>
              Un renversement déplace la fondamentale ailleurs qu’à la basse. L’accord garde
              exactement les mêmes notes, mais le son change : la basse guide l’oreille vers une
              nouvelle résolution. Les trois positions d’une triade suffisent à enrichir n’importe
              quelle progression.
            </p>

            <nav aria-label="Sections de la page" className="mt-8 flex flex-wrap gap-2">
              {ANCHORS.map((anchor) => (
                <a key={anchor.href} href={anchor.href} className="control">
                  {anchor.label}
                </a>
              ))}
            </nav>
          </header>

          <div className="space-y-16">
            {/* 01. Les trois positions */}
            <TheorySection
              id="positions"
              index="01"
              title="Les trois positions"
              intro="La même triade de Do, avec la fondamentale, la tierce puis la quinte à la basse."
            >
              <div className="grid gap-8 sm:grid-cols-3">
                {INVERSIONS.map((inversion) => (
                  <div key={inversion.name} className="panel p-4">
                    <p className="text-sm font-semibold text-white">{inversion.name}</p>
                    <p className="mt-1 text-xs text-gray">{inversion.detail}</p>
                    <div className="mt-4">
                      <ChordDiagram name="" positions={inversion.positions} />
                    </div>
                  </div>
                ))}
              </div>
            </TheorySection>

            {/* 02. Tableau issu du Sheet */}
            <TheorySection
              id="tableau"
              index="02"
              title="Tableau de référence"
              intro="Les trois positions, leurs intervalles et les notes qui les distinguent."
            >
              <SheetTabTables sections={tab.sections} cfHref="/theory/chords" />
            </TheorySection>

            {/* 03. Raccourci mémoire */}
            <TheorySection
              id="raccourci"
              index="03"
              title="Raccourci"
              intro="Trois repères pour reconnaître une position à l’oreille."
            >
              <ul>
                {RACCOURCIS.map((item) => (
                  <li
                    key={item.label}
                    className="border-b border-steelwarm py-4 first:pt-0 last:border-b-0 last:pb-0"
                  >
                    <p className="text-sm font-medium text-white">{item.label}</p>
                    <p className="mt-1 text-sm leading-relaxed text-gray">{item.text}</p>
                  </li>
                ))}
              </ul>
            </TheorySection>
          </div>
        </div>
      </main>

      <MetalFooter />
    </div>
  );
}
