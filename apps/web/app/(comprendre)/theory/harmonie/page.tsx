/**
 * ADAGIO - Theory/Harmonie Page
 * Tensions, Axis Theory, Coltrane changes, rythme harmonique — Sheet [MUSIC] Guitar
 *
 * Note : l'onglet Sheet « Harmonie » mélange dans une même grille plusieurs
 * blocs côte à côte (Coltrane, UST, rythme harmonique, Lydian Concept).
 * On re-découpe en sous-tableaux lisibles ici.
 */

import type { Metadata } from 'next';
import type { SheetSection } from '@adagio/theory';
import { getSheetTab } from '@adagio/theory';
import { MetalNav, MetalFooter } from '@/components';
import { SheetTable, formatSheetCell } from '@/components/theory/sheet/SheetTable';

export const metadata: Metadata = {
  title: 'Harmonie',
  description:
    'Harmonie avancée : tensions sur accords, Axis Theory, Coltrane changes, rythme harmonique et substitutions.',
};

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

  return (
    <div className="min-h-screen flex flex-col bg-abyss text-white">
      <MetalNav />

      <main className="flex-1 py-12 mt-12 w-full px-4">
        <div className="mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl lg:text-5xl font-metal text-white tracking-tighter mb-2">
              HARMONIE
            </h1>
            <p className="text-gray text-sm uppercase tracking-widest">
              Tensions, substitutions et changes — Axis &amp; Coltrane
            </p>
          </div>

          {/* 1. Tensions par accord de base */}
          {tensions && <SheetTable section={tensions} />}

          {/* 2. Axis Theory */}
          {axis && <SheetTable section={axis} />}

          {/* 3. Coltrane + UST */}
          <SheetTable section={coltrane} />
          <SheetTable section={ust} />

          {/* 4. Rythme harmonique */}
          <SheetTable section={rythmeHarmonique} />

          {/* 5. Concepts texte libre (colonne droite du Sheet) */}
          <div className="grid gap-4 md:grid-cols-2 mb-8">
            {parallTitle && (
              <div className="border-2 border-steel/30 bg-blackness/80 p-5">
                <h2 className="text-sm font-metal text-toxic uppercase tracking-tight mb-2">
                  {parallTitle}
                </h2>
                <p className="text-sm text-gray-300 leading-relaxed">{parallLines.join(' ')}</p>
              </div>
            )}
            {lydianTitle && (
              <div className="border-2 border-steel/30 bg-blackness/80 p-5">
                <h2 className="text-sm font-metal text-toxic uppercase tracking-tight mb-2">
                  {lydianTitle}
                </h2>
                <p className="text-sm text-gray-300 leading-relaxed">{lydianLines.join(' ')}</p>
              </div>
            )}
          </div>

          {/* 6. Exemple de mesure */}
          {mesure && (
            <div>
              <h2 className="text-xl font-metal text-white uppercase tracking-tight mb-3">
                Exemple — 2 mesures de changes
              </h2>
              <SheetTable section={mesure} />
            </div>
          )}

          {/* Lien concordant */}
          <div className="border-2 border-steel/30 bg-blackness/80 p-6">
            <p className="text-sm text-gray-300">
              Ces substitutions se réfléchissent sur le cercle des quintes — voir les relations
              parentes et les modulations.
            </p>
            <a
              href="/theory/circle"
              className="inline-block mt-3 text-toxic text-xs uppercase tracking-widest hover:underline"
            >
              → Cercle des quintes
            </a>
          </div>
        </div>
      </main>

      <MetalFooter />
    </div>
  );
}
