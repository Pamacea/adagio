/**
 * ADAGIO - Footer Metal
 * Footer avec design brutal — miroir des 4 piliers
 */

import Link from 'next/link';
import { PILLARS, ACCOUNT_NAV } from '@/lib/navigation';

export function MetalFooter() {
  return (
    <footer className="border-t-2 border-steel bg-blackness w-full">
      <div className="py-6 px-4 w-full">
        <div className="w-full">
          {/* Main content */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-6 w-full">
            {/* Brand */}
            <div className="md:col-span-1">
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

            {/* 4 piliers */}
            {PILLARS.map(pillar => (
              <div key={pillar.href}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                  <Link href={pillar.href} className="hover:text-toxic transition-colors">
                    {pillar.label.charAt(0) + pillar.label.slice(1).toLowerCase()}
                  </Link>
                </h4>
                <div className="flex flex-col gap-1">
                  {pillar.children.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-xs text-gray hover:text-white transition-colors"
                    >
                      {item.label.charAt(0) + item.label.slice(1).toLowerCase()}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Account */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                Compte
              </h4>
              <div className="flex flex-col gap-1">
                {ACCOUNT_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-xs text-gray hover:text-white transition-colors"
                  >
                    {item.label.charAt(0) + item.label.slice(1).toLowerCase()}
                  </Link>
                ))}
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
