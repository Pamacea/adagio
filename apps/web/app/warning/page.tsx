/**
 * ADAGIO - Warning Page
 * Page style warning d'album metal
 * Avertissements style disclaimer
 */

'use client';

import { MetalNav, MetalFooterCompact, Icons } from '@/components';
import Link from 'next/link';

export default function WarningPage() {
  return (
    <div className="min-h-screen flex flex-col bg-abyss">
      <MetalNav />

      <main className="flex-1 px-4 py-24 mt-16">
        <div className="max-w-3xl mx-auto">
          {/* Warning Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="icon-box border-blood animate-pulse">
                <Icons.Warning size="lg" />
              </div>
            </div>
            <h1 className="text-5xl lg:text-7xl font-metal text-blood tracking-tighter mb-4">
              WARNING
            </h1>
            <p className="text-gray text-lg uppercase tracking-widest">
              Avertissement
            </p>
          </div>

          {/* Warning Box */}
          <div className="section-frame p-8 mb-8 border-2 border-blood">
            <div className="border-2 border-blood p-6">
              <h2 className="text-2xl font-metal text-white uppercase mb-6 text-center">
                CONTENU EXPLICITE
              </h2>

              <div className="space-y-4 text-sm text-gray leading-relaxed">
                <p className="text-white font-bold uppercase">
                  Ce contenu peut contenir des elements susceptibles de choquer:
                </p>

                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-blood">▶</span>
                    <span>Theorie musicale extreme non filtree</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blood">▶</span>
                    <span>References a des groupes de metal et de rock</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blood">▶</span>
                    <span>Progressions d'accords dangereusement accrocheuses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blood">▶</span>
                    <span>Riffs qui peuvent causer une dependance permanente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blood">▶</span>
                    <span>Exposition a des modes grecs sans avertissement prealable</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blood">▶</span>
                    <span>Visualisation de cercles des quintes hypnotiques</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Disclaimers */}
          <div className="space-y-4 mb-12">
            {/* Audio warning */}
            <div className="section-frame p-4 border-l-4 border-blood">
              <div className="flex items-start gap-4">
                <div className="icon-box shrink-0">
                  <Icons.Sessions size="sm" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase mb-1">
                    Risque d'addiction musicale
                  </h3>
                  <p className="text-xs text-gray">
                    La pratique de la guitare peut entrainer des symptomes tels que: calloses aux doigts,
                    mal au dos, envie d'acheter toujours plus de materiel, et besoin compulsif de
                    jouer des riffs a tout moment de la journee.
                  </p>
                </div>
              </div>
            </div>

            {/* Theory overload */}
            <div className="section-frame p-4 border-l-4 border-rust">
              <div className="flex items-start gap-4">
                <div className="icon-box shrink-0">
                  <Icons.Modes size="sm" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase mb-1">
                    Surcharge theorique
                  </h3>
                  <p className="text-xs text-gray">
                    L'apprentissage simultane des 7 modes grecs peut provoquer des maux de tete,
                    une confusion temporaire entre Do et C, et des reves involontaires en chiffres
                    romains.
                  </p>
                </div>
              </div>
            </div>

            {/* Gear acquisition syndrome */}
            <div className="section-frame p-4 border-l-4 border-steel">
              <div className="flex items-start gap-4">
                <div className="icon-box shrink-0">
                  <Icons.Fretboard size="sm" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase mb-1">
                    Syndrome d'acquisition de materiel (GAS)
                  </h3>
                  <p className="text-xs text-gray">
                    ADAGIO decline toute responsabilite en cas d'achat compulsif de pedales
                    d'effet, d'amplis a lampes, ou de guitares dont vous n'avez pas besoin.
                    Veuillez consulter votre compte en banque avant de continuer.
                  </p>
                </div>
              </div>
            </div>

            {/* Ear training warning */}
            <div className="section-frame p-4 border-l-4 border-toxic">
              <div className="flex items-start gap-4">
                <div className="icon-box shrink-0">
                  <Icons.Circle size="sm" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase mb-1">
                    Alteration permanente de l'oreille
                  </h3>
                  <p className="text-xs text-gray">
                    L'entrainement auditif peut vous rendre incapable d'ecouter de la musique
                    sans analyser harmoniquement chaque accord. Vos amis ne comprendront plus
                    rien quand vous parlerez de "sous-dominante" ou de "II-V-I".
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Classic warning label */}
          <div className="border-4 border-blood p-8 mb-8 bg-blackness">
            <div className="text-center">
              <p className="text-xs text-gray uppercase tracking-widest mb-2">
                PARENTAL ADVISORY
              </p>
              <p className="text-blood text-xl font-metal uppercase mb-4">
                EXPLICIT MUSIC THEORY
              </p>
              <div className="flex justify-center gap-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-1 border border-blood"
                    style={{
                      transform: `rotate(${i * 15 - 90}deg)`,
                      transformOrigin: 'center',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Acceptance */}
          <div className="text-center mb-12">
            <p className="text-sm text-gray mb-6">
              En continuant, vous acceptez les consequences de votre education musicale
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/theory/modes"
                className="px-8 py-3 text-sm font-bold uppercase border-2 border-blood bg-toxic text-white hover:bg-blood transition-all poly-left"
              >
                J'ACCEPTE LE RISQUE
              </Link>
              <Link
                href="/"
                className="px-8 py-3 text-sm font-bold uppercase border-2 border-steel bg-abyss text-gray hover:border-white hover:text-white transition-all poly-right"
              >
                FUIR MAINTENANT
              </Link>
            </div>
          </div>

          {/* Legal notice */}
          <div className="border-t border-steel pt-6">
            <p className="text-xs text-gray text-center leading-relaxed">
              ADAGIO est fourni "tel quel", sans aucune garantie, explicite ou implicite.
              L'utilisation de ce logiciel pour devenir rockstar n'est pas garantie.
              Les resultats peuvent varier. Les solos de guitare peuvent etre dangereux
              pour votre statut social. Ne pas utiliser si vous ettes enceinte ou si vous
              envisagez une carrière stable. Les Side Effects peuvent inclure: des doigts
              qui saignent, des voisins qui plaignent, et un appartement rempli de materiel.
              Consultez votre professeur de guitare avant utilisation.
            </p>
          </div>
        </div>
      </main>

      <MetalFooterCompact />
    </div>
  );
}
