/**
 * ADAGIO - Page d'accueil Metallica / Steve Vai Style
 * Noir dominant, navbar fixe, icons SVG custom
 */

'use client';

import Link from 'next/link';
import { MetalNav, MetalFooter, MetalLink } from '@/components';

const frenchNotes = ['DO', 'RE', 'MI', 'FA', 'SOL', 'LA', 'SI'];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-abyss">
      <MetalNav />

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-24 mt-16">
        {/* Titre massif */}
        <div className="text-center relative z-10">
          <h2 className="text-massive font-metal text-white tracking-tighter mb-6">
            ADAGIO
          </h2>

          {/* Sous-titre */}
          <div className="section-frame inline-block px-8 py-4 mb-8">
            <p className="text-sm text-gray font-mono tracking-widest uppercase">
              Theorie Musicale • Notation Francaise • Metal
            </p>
          </div>

          {/* Notes francaises */}
          <div className="flex gap-6 text-giant font-metal mt-12">
            {frenchNotes.map((note, i) => (
              <span
                key={note}
                className={`note note-${note.toLowerCase()} ${
                  i === 0 ? 'note-delay-0' : ''
                } ${i === 1 ? 'note-delay-1' : ''} ${
                  i === 2 ? 'note-delay-2' : ''
                } ${i === 3 ? 'note-delay-3' : ''} ${
                  i === 4 ? 'note-delay-4' : ''
                } ${i === 5 ? 'note-delay-5' : ''} ${
                  i === 6 ? 'note-delay-6' : ''
                }`}
              >
                {note}
              </span>
            ))}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="mt-16 flex flex-col sm:flex-row gap-4 z-10">
          <MetalLink href="/theory/modes" variant="primary" shape="left" size="lg">
            COMMENCER
          </MetalLink>
          <MetalLink href="/warning" variant="blood" shape="right" size="lg">
            AVERTISSEMENT
          </MetalLink>
        </div>

        {/* Diagramme decoratif */}
        <div className="absolute bottom-64 right-8 w-48 h-48 border-2 border-circuit opacity-20 hidden lg:block">
          <div className="w-full h-full border border-steel m-2 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-metal text-gray">5</div>
              <div className="text-xs text-gray font-mono mt-1">CIRCLE</div>
            </div>
          </div>
        </div>
      </main>

      <MetalFooter />
    </div>
  );
}
