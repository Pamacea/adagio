/**
 * ADAGIO - Rythme Page (Drive)
 * Subdivisions, sensations et grooves — Sheet [MUSIC] Guitar, onglet Drive
 */

import type { Metadata } from 'next';
import { getSheetTab } from '@adagio/theory';
import { MetalNav, MetalFooter } from '@/components';
import { SheetTabTables } from '@/components/theory/sheet/SheetTable';

export const metadata: Metadata = {
  title: 'Rythme',
  description:
    'Subdivisions rythmiques : noire, croches, triolets, doubles croches, sextolets — leur sensation et leur comptage.',
};

const ASTUCES = [
  {
    titre: 'Compter à voix haute',
    texte:
      'Le comptage du Sheet (« 1 - et », « 1 - puis - la ») se dit, pas se pense. Tant que ça n’est pas oral, la main ne suit pas.',
  },
  {
    titre: 'Le triolet change la sensation, pas le tempo',
    texte:
      'Même pulsation, 3 temps au lieu de 2 : le « balancement » blues/jazz vient de là. Enchaîner croches → triolets à métronome fixe est l’exercice roi.',
  },
  {
    titre: 'Le drive, c’est la 5ème colonne',
    texte:
      '1 accord toutes les 4 mesures ou 2 accords par mesure : le rythme harmonique décide de l’énergie avant même les notes (voir Harmonie).',
  },
];

export default function RythmePage() {
  const tab = getSheetTab('drive');

  return (
    <div className="min-h-screen flex flex-col bg-abyss text-white">
      <MetalNav />

      <main className="flex-1 py-12 mt-12 w-full px-4">
        <div className="mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl lg:text-5xl font-metal text-white tracking-tighter mb-2">
              RYTHME
            </h1>
            <p className="text-gray text-sm uppercase tracking-widest">
              Drive — subdivisions, sensation, comptage
            </p>
          </div>

          {/* Tableau issu du Sheet */}
          <SheetTabTables sections={tab.sections} />

          {/* Astuces */}
          <div className="grid gap-4 md:grid-cols-3">
            {ASTUCES.map((a) => (
              <div key={a.titre} className="border-2 border-steel/30 bg-blackness/80 p-5">
                <h2 className="text-sm font-metal text-toxic uppercase tracking-tight mb-2">
                  {a.titre}
                </h2>
                <p className="text-sm text-gray-300 leading-relaxed">{a.texte}</p>
              </div>
            ))}
          </div>

          {/* Renvoi vers le rythme harmonique */}
          <div className="border-2 border-steel/30 bg-blackness/80 p-6 mt-8">
            <p className="text-sm text-gray-300">
              La vitesse des accords dans une progression (rythme harmonique) se travaille à part —
              c’est le sujet de la page Harmonie.
            </p>
            <a
              href="/theory/harmonie"
              className="inline-block mt-3 text-toxic text-xs uppercase tracking-widest hover:underline"
            >
              → Harmonie
            </a>
          </div>
        </div>
      </main>

      <MetalFooter />
    </div>
  );
}
