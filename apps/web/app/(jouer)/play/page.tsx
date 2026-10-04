/**
 * ADAGIO - Hub Jouer (/play)
 * Pilier 2/4 : les outils de pratique + ressources externes
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import { MetalNav, MetalFooter, Icons } from '@/components';

export const metadata: Metadata = {
  title: 'Jouer',
  description:
    'Hub pratique : manche interactif, notation musicale et antisèche théorique pour guitaristes.',
};

const TOOLS = [
  {
    title: 'MANCHE',
    href: '/fretboard',
    icon: Icons.Fretboard,
    description: 'Manche interactif : gammes, modes et positions CAGED, en notation française.',
    tags: ['Interactif', 'CAGED'],
  },
  {
    title: 'NOTATION',
    href: '/notation',
    icon: Icons.Notation,
    description: 'Partition française : notes, accords et progressions écrites à lire.',
    tags: ['Lecture'],
  },
  {
    title: 'RYTHME',
    href: '/rythme',
    icon: Icons.Play,
    description:
      'Subdivisions et drive : croches, triolets, doubles croches — comptage et sensation.',
    tags: ['Groove', 'Subdivisions'],
  },
  {
    title: 'ANTISÈCHE',
    href: '/notes',
    icon: Icons.Notes,
    description:
      'Fiches de révision : intervalles, degrés, signatures — tout le nécessaire à portée de main.',
    tags: ['Révision'],
  },
];

export default function PlayPage() {
  return (
    <div className="min-h-screen flex flex-col bg-abyss">
      <MetalNav />

      <main className="flex-1 px-4 py-24 mt-16">
        <div className="mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-metal text-white tracking-tighter mb-2">
              JOUER
            </h1>
            <p className="text-gray text-sm uppercase tracking-widest">
              Outils de pratique à l&apos;instrument
            </p>
          </div>

          {/* Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="section-frame p-6 group hover:border-blood transition-all"
              >
                <div className="icon-box mb-4 group-hover:border-blood transition-colors">
                  <tool.icon size="md" />
                </div>
                <h2 className="text-xl font-metal text-white uppercase tracking-tighter mb-2">
                  {tool.title}
                </h2>
                <p className="text-sm text-gray mb-4">{tool.description}</p>
                <div className="flex flex-wrap gap-1">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs border border-steel bg-blackness text-gray"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>

          {/* Lien sortant Concordia */}
          <div className="section-frame p-6 border-blood">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="icon-box border-blood flex-shrink-0">
                <Icons.ArrowRight size="md" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-metal text-white uppercase tracking-wider mb-1">
                  DESSINE TES ACCORDS — CONCORDIA
                </h2>
                <p className="text-sm text-gray">
                  Éditeur de diagrammes d&apos;accords sur canvas : pointeur, notes, textes, export
                  JSON/PNG/SVG/PDF. Un outil séparé d&apos;Adagio, ouvert dans un nouvel onglet.
                </p>
              </div>
              <a
                href="https://concordia.oalacea.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 text-sm font-bold uppercase border-2 border-blood bg-blackness text-white hover:bg-toxic transition-all poly-left flex-shrink-0"
              >
                OUVRIR CONCORDIA ↗
              </a>
            </div>
          </div>
        </div>
      </main>

      <MetalFooter />
    </div>
  );
}
