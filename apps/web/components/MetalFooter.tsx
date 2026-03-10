/**
 * ADAGIO - Footer Metal
 * Footer avec design brutal
 */

import Link from 'next/link';

export function MetalFooter() {
  return (
    <footer className="border-t-2 border-steel bg-blackness w-full">
      <div className="py-6 px-4 w-full">
        <div className="w-full">
          {/* Main content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 w-full">
            {/* Brand */}
            <div>
              <h3 className="text-lg font-metal text-white uppercase tracking-tighter mb-2">
                ADAGIO
              </h3>
              <p className="text-xs text-gray">
                Theorie Musicale Brutale
              </p>
              <p className="text-xs text-gray mt-1">
                Pour guitaristes metal
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                Navigation
              </h4>
              <div className="flex flex-col gap-1">
                <Link href="/theory/modes" className="text-xs text-gray hover:text-white transition-colors">
                  Modes Grecs
                </Link>
                <Link href="/theory/scales" className="text-xs text-gray hover:text-white transition-colors">
                  Gammes
                </Link>
                <Link href="/theory/circle" className="text-xs text-gray hover:text-white transition-colors">
                  Cercle des Quintes
                </Link>
                <Link href="/fretboard" className="text-xs text-gray hover:text-white transition-colors">
                  Manche de Guitare
                </Link>
                <Link href="/notation" className="text-xs text-gray hover:text-white transition-colors">
                  Notation
                </Link>
              </div>
            </div>

            {/* Account */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                Compte
              </h4>
              <div className="flex flex-col gap-1">
                <Link href="/sessions" className="text-xs text-gray hover:text-white transition-colors">
                  Sessions
                </Link>
                <Link href="/profile" className="text-xs text-gray hover:text-white transition-colors">
                  Profil
                </Link>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-steel my-4"></div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-gray tracking-widest uppercase">
              THEORIE MUSICALE POUR GUITARRISTES
            </p>
            <p className="text-xs text-gray">
              ADAGIO • {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * Compact footer for pages with more content
 */
export function MetalFooterCompact() {
  return (
    <footer className="border-t-2 border-steel bg-blackness w-full">
      <div className="py-4 px-4 w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 w-full">
          <p className="text-xs text-gray tracking-widest uppercase">
            THEORIE MUSICALE POUR GUITARRISTES
          </p>
          <p className="text-xs text-gray">
            ADAGIO • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
