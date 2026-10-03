/**
 * ADAGIO - Navigation Metal
 * Navbar fixe avec design brutal
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Icons } from './MetalIcons';
import { MAIN_NAV, ACCOUNT_NAV, type NavLink } from '@/lib/navigation';

export function MetalNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b-2 border-steel bg-blackness">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="icon-box group-hover:border-blood transition-colors">
            <Icons.Logo size="md" />
          </div>
          <div>
            <h1 className="text-xl text-white font-metal tracking-tighter uppercase">
              ADAGIO
            </h1>
          </div>
        </Link>

        {/* Navigation desktop */}
        <div className="hidden lg:flex items-center gap-0">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
            >
              <item.icon size="sm" />
              {item.label}
            </Link>
          ))}
        </div>

        {/* User section desktop */}
        <div className="hidden lg:flex items-center gap-0">
          {ACCOUNT_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
            >
              <item.icon size="sm" />
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 border-2 border-steel bg-blackness hover:border-blood transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <Icons.Close size="lg" /> : <Icons.Menu size="lg" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t-2 border-steel bg-blackness">
          <div className="flex flex-col py-2">
            {[...MAIN_NAV, ...ACCOUNT_NAV].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon size="sm" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

/**
 * Navigation locale pour les pages avec sous-sections
 */
interface LocalNavProps {
  items: NavLink[];
  title: string;
}

export function LocalNav({ items, title }: LocalNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <div className="border-b-2 border-steel bg-blackness">
      <div className="px-4 py-2">
        <h2 className="text-xs text-gray font-mono tracking-widest uppercase mb-2">
          {title}
        </h2>
        <div className="flex flex-wrap gap-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border-2 transition-all ${
                isActive(item.href)
                  ? 'border-blood bg-toxic text-white'
                  : 'border-steel bg-abyss text-gray hover:border-white hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
