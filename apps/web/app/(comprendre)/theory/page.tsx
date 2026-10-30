/**
 * ADAGIO - Hub Comprendre (/theory)
 * Pilier 1/4 : les pages de théorie musicale
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import { MetalNav, MetalFooter, Icons } from '@/components';

export const metadata: Metadata = {
  title: 'Comprendre',
  description: 'Hub théorie musicale : accords, triades, modes, gammes et cercle des quintes.',
};

const SECTIONS = [
  {
    title: 'ACCORDS',
    href: '/theory/chords',
    icon: Icons.Chords,
    description: 'Construction, extensions et renversements — de la triade au dominant 13.',
    tags: ['Triades', '7e', 'Extensions'],
  },
  {
    title: 'TRIADES',
    href: '/theory/triades',
    icon: Icons.Triads,
    description: 'Majeur, mineur, diminué, augmenté — les quatre briques de base.',
    tags: ['Fondamentaux'],
  },
  {
    title: 'RENVERSEMENTS',
    href: '/theory/renversements',
    icon: Icons.Triads,
    description: 'Fondamentale, sixte, sixte et quarte — les trois positions d’une triade.',
    tags: ['Accords'],
  },
  {
    title: 'EXTENSIONS',
    href: '/theory/extensions',
    icon: Icons.Chords,
    description: '9è, 11è, 13è — la gamme composée et ses équivalences sur le manche.',
    tags: ['Tensions'],
  },
  {
    title: 'MODES',
    href: '/theory/modes',
    icon: Icons.Modes,
    description: 'Les 7 modes grecs, leur couleur émotionnelle et leurs emplois.',
    tags: ['ioniens → locrien'],
  },
  {
    title: 'GAMMES',
    href: '/theory/scales',
    icon: Icons.Scales,
    description: 'Toutes les gammes et leur placement sur le manche, en notation française.',
    tags: ['Manche'],
  },
  {
    title: 'CERCLE',
    href: '/theory/circle',
    icon: Icons.Circle,
    description: 'Cercle des quintes : tonalités parentes, relatives et modulations.',
    tags: ['Tonalités'],
  },
  {
    title: 'HARMONIE',
    href: '/theory/harmonie',
    icon: Icons.Compose,
    description: 'Tensions, Axis Theory, Coltrane changes et rythme harmonique.',
    tags: ['Substitutions', 'Axis'],
  },
];

const CONCEPTS = [
  {
    q: 'Pourquoi des quintes ?',
    a: 'Chaque case du cercle ajoute une dièse (ou en retire une) : la distance entre deux cases voisines est toujours une quinte juste.',
  },
  {
    q: 'Majeur ou mineur ?',
    a: 'Une tonalité mineure partage sa gamme avec son relatif majeur : même notes, autre point de départ (le 6e degré).',
  },
  {
    q: "Degrés, c'est quoi ?",
    a: "Les degrés (I, ii, iii…) numérotent chaque note d'une gamme. Toute la théorie d'Adagio se raisonne en degrés.",
  },
];

export default function TheoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-abyss">
      <MetalNav />

      <main className="flex-1 px-4 py-24 mt-16">
        <div className="mx-auto">
          {/* Header */}
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-gray">Théorie</p>
            <h1 className="mt-2 text-3xl font-metal uppercase tracking-tighter text-white sm:text-4xl">
              Comprendre
            </h1>
            <p className="mt-2 text-sm uppercase tracking-widest text-gray">
              Les fondements de l&apos;harmonie
            </p>
          </div>

          {/* Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {SECTIONS.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="panel p-6 group transition-colors hover:border-amber-400/50"
              >
                <div className="icon-box mb-4 border-steelwarm group-hover:border-amber-400/50 transition-colors">
                  <section.icon size="md" />
                </div>
                <h2 className="text-xl font-metal text-white uppercase tracking-tighter mb-2">
                  {section.title}
                </h2>
                <p className="text-sm text-gray mb-4">{section.description}</p>
                <div className="flex flex-wrap gap-1">
                  {section.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs border border-steelwarm text-gray"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}

            {/* CTA Composer (sortie du pilier) */}
            <Link
              href="/compose"
              className="panel p-6 group border-amber-400/60 transition-colors hover:bg-amber-400/10"
            >
              <div className="icon-box mb-4 border-amber-400/60 text-amber-400">
                <Icons.Compose size="md" />
              </div>
              <h2 className="text-xl font-metal text-white uppercase tracking-tighter mb-2">
                PASSER À LA PRATIQUE
              </h2>
              <p className="text-sm text-gray mb-4">
                Explorez ces concepts dans le studio de composition : degrés, substitutions et
                progressions en temps réel.
              </p>
              <span className="text-xs font-bold uppercase text-amber-400 transition-colors">
                Ouvrir Compose →
              </span>
            </Link>
          </div>

          {/* Concepts clés */}
          <div className="panel p-6">
            <h2 className="text-lg font-metal text-white uppercase tracking-wider mb-4">
              Concepts clés
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CONCEPTS.map((concept) => (
                <div key={concept.q} className="border border-steelwarm p-4">
                  <p className="text-sm font-bold text-gold uppercase mb-2">{concept.q}</p>
                  <p className="text-xs text-gray">{concept.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <MetalFooter />
    </div>
  );
}
