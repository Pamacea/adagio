/**
 * ADAGIO - Theory/Chords Page
 * Les accords sont désormais consultés dans Concordia : la page n'est qu'un relais.
 */

import { MetalNav, MetalFooter } from '@/components';

const CONCORDIA_URL = 'https://concordia.oalacea.fr/';

export default function ChordsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-abyss text-white">
      <MetalNav />

      <main className="flex flex-1 items-center justify-center px-6 pt-[64px]">
        <div className="text-center">
          <p className="field-label">Théorie</p>
          <h1 className="mt-2 font-metal text-4xl uppercase tracking-tighter text-white">Accords</h1>
          <p className="mt-3 text-sm text-gray">
            Les accords se consultent maintenant dans Concordia.
          </p>
          <a
            href={CONCORDIA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="control mt-8 inline-flex justify-center border-blood text-blood"
          >
            OUVRIR CONCORDIA ↗
          </a>
        </div>
      </main>

      <MetalFooter />
    </div>
  );
}
