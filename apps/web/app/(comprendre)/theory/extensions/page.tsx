/**
 * ADAGIO - Theory/Extensions Page
 * Extensions de la gamme composée (9, 11, #11, 13, b13) — Sheet [MUSIC] Guitar
 */

import type { Metadata } from 'next';
import { getSheetTab } from '@adagio/theory';
import { MetalNav, MetalFooter } from '@/components';
import { SheetTabTables } from '@/components/theory/sheet/SheetTable';

export const metadata: Metadata = {
  title: 'Extensions',
  description:
    'Extensions d’accords et gamme composée : 9ème, 11ème, #11, 13ème, b13 — équivalences visuelles sur le manche.',
};

const PRINCIPES = [
  {
    titre: 'Une extension = une note ajoutée au-delà de la 7è',
    texte:
      '9, 11, 13 sont en réalité des synonymes de 2, 4 et 6 une octave au-dessus. On les numérote haut pour dire « je garde la 7è en dessous ».',
  },
  {
    titre: 'La couleur vient des tensions',
    texte:
      'La fondamentale, la 3è et la 7è donnent la fonction (majeur, mineur, dominant). Tout le reste — 9, 11, 13 — est de la couleur qu’on peut ajouter ou retirer sans casser l’accord.',
  },
  {
    titre: 'Sur le manche, tout se compte en cases',
    texte:
      'La 9è est 2 cases au-dessus de la fondamentale (même corde). La 13è est 2 cases sous la 7è. Voir le tableau, c’est voir la position des doigts.',
  },
];

export default function ExtensionsPage() {
  const tab = getSheetTab('composee');

  return (
    <div className="min-h-screen flex flex-col bg-abyss text-white">
      <MetalNav />

      <main className="flex-1 py-12 mt-12 w-full px-4">
        <div className="mx-auto" style={{ maxWidth: '64rem' }}>
          {/* Header */}
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-gray">Théorie · Extensions</p>
            <h1 className="mt-2 text-3xl font-metal uppercase tracking-tighter text-white sm:text-4xl">
              Extensions
            </h1>
            <p className="mt-2 text-sm uppercase tracking-widest text-gray">
              Gamme composée — 9è, 11è, 13è et compagnie
            </p>
          </div>

          {/* Principes */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            {PRINCIPES.map((p) => (
              <div key={p.titre} className="panel p-5">
                <h2 className="text-sm font-metal text-amber-400 uppercase tracking-tight mb-2">
                  {p.titre}
                </h2>
                <p className="text-sm text-gray leading-relaxed">{p.texte}</p>
              </div>
            ))}
          </div>

          {/* Tableau issu du Sheet */}
          <SheetTabTables sections={tab.sections} />

          {/* Lien vers les accords étendus */}
          <div className="panel p-6 mt-4">
            <p className="text-sm text-gray">
              Pour voir ces extensions construites sur chaque fondamentale, direction la
              bibliothèque d’accords — les voicings incluent déjà les tensions.
            </p>
            <a href="/theory/chords" className="control mt-4">
              → Bibliothèque d’accords
            </a>
          </div>
        </div>
      </main>

      <MetalFooter />
    </div>
  );
}
