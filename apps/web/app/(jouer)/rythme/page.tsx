/**
 * ADAGIO - Rythme Page (Drive)
 * Métronome, subdivisions et grooves — Sheet [MUSIC] Guitar, onglet Drive
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { getSheetTab } from '@adagio/theory';
import { MetalNav, MetalFooter } from '@/components';
import { SheetTabTables } from '@/components/theory/sheet/SheetTable';
import { TheorySection } from '@/components/theory/sheet/TheorySection';
import { Metronome } from '@/components/theory/metronome/Metronome';

export const metadata: Metadata = {
  title: 'Rythme',
  description:
    'Subdivisions rythmiques : noire, croches, triolets, doubles croches, sextolets — leur sensation et leur comptage.',
};

const ANCHORS = [
  { href: '#metronome', label: 'Métronome' },
  { href: '#drive', label: 'Drive' },
  { href: '#astuces', label: 'Astuces' },
];

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
    <div className="min-h-screen flex flex-col bg-abyss text-white font-sans">
      <MetalNav />

      <main className="flex-1 py-14 mt-12 w-full px-5 sm:px-6">
        <div className="mx-auto" style={{ maxWidth: '64rem' }}>
          {/* Header */}
          <header className="mb-16">
            <p className="text-xs uppercase tracking-widest text-gray">Jouer · Rythme</p>
            <h1 className="mt-2 text-3xl font-metal uppercase tracking-tighter text-white sm:text-4xl">
              Rythme &amp; Groove
            </h1>
            <p className="mt-2 text-sm uppercase tracking-widest text-gray">
              Subdivisions, sensation, comptage
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray" style={{ maxWidth: '46rem' }}>
              Le tempo se travaille lentement avant de se lâcher : un métronome pour poser la
              pulsation, les subdivisions du Sheet pour choisir la sensation, et quelques astuces
              pour que la main suive sans y penser.
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
            {/* 01. Métronome */}
            <TheorySection
              id="metronome"
              index="01"
              title="Métronome"
              intro="Règle le tempo, la signature et la subdivision, puis démarre : les clics sont accentués sur le premier temps."
            >
              <Metronome />
            </TheorySection>

            {/* 02. Drive */}
            <TheorySection
              id="drive"
              index="02"
              title="Drive — subdivisions"
              intro="Pour chaque division, la sensation qu'elle produit et le comptage à voix haute qui la pose."
            >
              <SheetTabTables sections={tab.sections} />
            </TheorySection>

            {/* 03. Astuces */}
            <TheorySection
              id="astuces"
              index="03"
              title="Astuces"
              intro="Trois repères pour passer de la pulsation au groove."
            >
              <div className="grid gap-8 md:grid-cols-3">
                {ASTUCES.map((astuce) => (
                  <article key={astuce.titre} className="border-t border-steelwarm pt-5">
                    <h3 className="text-sm font-semibold text-white">{astuce.titre}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray">{astuce.texte}</p>
                  </article>
                ))}
              </div>
            </TheorySection>

            {/* Renvoi vers Harmonie */}
            <section className="flex flex-col gap-4 border-t border-steelwarm pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-relaxed text-gray">
                La vitesse des accords dans une progression (rythme harmonique) se travaille à part
                — c’est le sujet de la page Harmonie.
              </p>
              <Link
                href="/theory/harmonie"
                className="shrink-0 text-sm font-medium text-white transition-colors hover:text-ember"
              >
                Harmonie →
              </Link>
            </section>
          </div>
        </div>
      </main>

      <MetalFooter />
    </div>
  );
}
