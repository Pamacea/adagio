/**
 * ADAGIO - Theory/Harmonie Page
 * Tensions, Axis Theory, Coltrane changes, rythme harmonique — Sheet [MUSIC] Guitar
 *
 * Note : l'onglet Sheet « Harmonie » mélange dans une même grille plusieurs
 * blocs côte à côte (Coltrane, UST, rythme harmonique, Lydian Concept).
 * On re-découpe en sous-tableaux lisibles ici.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import type { SheetSection } from '@adagio/theory';
import { getSheetTab } from '@adagio/theory';
import { MetalNav, MetalFooter } from '@/components';
import { SheetTable, formatSheetCell } from '@/components/theory/sheet/SheetTable';
import { TheorySection } from '@/components/theory/sheet/TheorySection';

export const metadata: Metadata = {
  title: 'Harmonie',
  description:
    'Harmonie avancée : tensions sur accords, Axis Theory, Coltrane changes, rythme harmonique et substitutions.',
};

const ANCHORS = [
  { href: '#tensions', label: 'Tensions' },
  { href: '#axis', label: 'Axis' },
  { href: '#coltrane', label: 'Coltrane' },
  { href: '#ust', label: 'UST' },
  { href: '#rythme', label: 'Rythme' },
  { href: '#concepts', label: 'Concepts' },
  { href: '#exemple', label: 'Exemple' },
];

export default function HarmoniePage() {
  const tab = getSheetTab('harmonie');
  const [tensions, axis, merged, mesure] = tab.sections;
  const mergedRows: string[][] = merged?.rows ?? [];

  // --- Découpage de la grille fusionnée (colonnes 0-3 | 4-5) ---
  const coltrane: SheetSection = {
    title: 'Coltrane — Coltrane changes',
    headers: (mergedRows[0] ?? []).slice(0, 4),
    rows: mergedRows.slice(1, 4).map((r) => r.slice(0, 4)),
  };
  const ust: SheetSection = {
    title: 'UST — Notes négatives',
    headers: (mergedRows[0] ?? []).slice(4, 6),
    rows: mergedRows.slice(1, 7).map((r) => r.slice(4, 6)),
  };
  const rythmeHarmonique: SheetSection = {
    title: 'Rythme harmonique',
    headers: (mergedRows[6] ?? []).slice(0, 4),
    rows: mergedRows.slice(7, 11).map((r) => r.slice(0, 4)),
  };

  // Blocs de la colonne droite (texte libre du Sheet)
  const [parallTitle, ...parallLines] = [
    mergedRows[8]?.[4],
    mergedRows[9]?.[4],
    mergedRows[10]?.[4],
  ]
    .filter((c): c is string => Boolean(c))
    .map(formatSheetCell);
  const [lydianTitle, ...lydianLines] = [
    mergedRows[12]?.[4],
    mergedRows[13]?.[4],
    mergedRows[14]?.[4],
  ]
    .filter((c): c is string => Boolean(c))
    .map(formatSheetCell);

  const hasConcepts = Boolean(parallTitle || lydianTitle);

  return (
    <div className="min-h-screen flex flex-col bg-abyss text-white font-sans">
      <MetalNav />

      <main className="flex-1 py-14 mt-12 w-full px-5 sm:px-6">
        <div className="mx-auto" style={{ maxWidth: '64rem' }}>
          {/* Header */}
          <header className="mb-16">
            <p className="text-xs uppercase tracking-widest text-gray">Théorie · Harmonie</p>
            <h1 className="mt-2 text-3xl font-metal uppercase tracking-tighter text-white sm:text-4xl">
              Harmonie
            </h1>
            <p className="mt-2 text-sm uppercase tracking-widest text-gray">
              Tensions, substitutions et changes
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray" style={{ maxWidth: '46rem' }}>
              Cette page rassemble les outils pour enrichir et déplacer un accord : quelles
              tensions ajouter, comment le substituer, comment relier deux pôles et à quel rythme
              faire changer les accords.
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
            {/* 01. Tensions par accord de base */}
            {tensions && (
              <TheorySection
                id="tensions"
                index="01"
                title="Tensions sur un accord"
                intro="Pour chaque type d'accord de base, les tensions possibles et la couleur qu'elles produisent."
              >
                <SheetTable
                  section={tensions}
                  hideTitle
                  caption="Tensions par type d'accord de base"
                />
              </TheorySection>
            )}

            {/* 02. Axis Theory */}
            {axis && (
              <TheorySection
                id="axis"
                index="02"
                title="Axis Theory"
                intro="Trois familles d'accords — tonique, dominante, sous-dominante — et leurs substituts par déplacement de tierces."
              >
                <SheetTable section={axis} hideTitle caption="Axis Theory : familles et substituts" />
              </TheorySection>
            )}

            {/* 03. Coltrane changes */}
            <TheorySection
              id="coltrane"
              index="03"
              title="Coltrane changes"
              intro="Les substitutions de tierce qui relient les pôles de résolution, avec la distance parcourue en demi-tons."
            >
              <SheetTable
                section={coltrane}
                hideTitle
                caption="Coltrane changes : pôles et substitutions de tierce"
              />
            </TheorySection>

            {/* 04. UST — notes négatives */}
            <TheorySection
              id="ust"
              index="04"
              title="UST — notes négatives"
              intro="La note négative obtenue pour chaque note d'origine, avec la tierce comme axe fixe."
            >
              <SheetTable
                section={ust}
                hideTitle
                caption="UST : notes d'origine et notes négatives"
              />
            </TheorySection>

            {/* 05. Rythme harmonique */}
            <TheorySection
              id="rythme"
              index="05"
              title="Rythme harmonique"
              intro="La fréquence des changements d'accords et l'effet ressenti selon les styles."
            >
              <SheetTable
                section={rythmeHarmonique}
                hideTitle
                caption="Rythme harmonique : fréquences, effets et styles"
              />
            </TheorySection>

            {/* 06. Concepts texte libre (colonne droite du Sheet) */}
            {hasConcepts && (
              <TheorySection
                id="concepts"
                index="06"
                title="Concepts"
                intro="Deux lectures complémentaires pour déplacer un accord sans en changer la fonction."
              >
                <div className="grid gap-8 md:grid-cols-2">
                  {parallTitle && (
                    <article className="border-t border-steelwarm pt-5">
                      <h3 className="text-sm font-semibold text-white">{parallTitle}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray">
                        {parallLines.join(' ')}
                      </p>
                    </article>
                  )}
                  {lydianTitle && (
                    <article className="border-t border-steelwarm pt-5">
                      <h3 className="text-sm font-semibold text-white">{lydianTitle}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray">
                        {lydianLines.join(' ')}
                      </p>
                    </article>
                  )}
                </div>
              </TheorySection>
            )}

            {/* 07. Exemple de mesure */}
            {mesure && (
              <TheorySection
                id="exemple"
                index="07"
                title="Exemple — 2 mesures de changes"
                intro="Une grille de deux mesures qui place les substitutions sur les temps et les anticipations."
              >
                <SheetTable section={mesure} hideTitle caption="Exemple : deux mesures de changes" />
              </TheorySection>
            )}

            {/* CTA final */}
            <section className="flex flex-col gap-4 border-t border-steelwarm pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-relaxed text-gray">
                Ces substitutions se réfléchissent sur le cercle des quintes — voir les relations
                parentes et les modulations.
              </p>
              <Link
                href="/theory/circle"
                className="shrink-0 text-sm font-medium text-white transition-colors hover:text-ember"
              >
                Cercle des quintes →
              </Link>
            </section>
          </div>
        </div>
      </main>

      <MetalFooter />
    </div>
  );
}
