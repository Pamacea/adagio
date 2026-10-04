/**
 * ADAGIO - Navigation Metal
 * Navbar fixe avec design brutal — 4 piliers + compte
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Icons } from './MetalIcons';
import { PILLARS, ACCOUNT_NAV, type NavLink, type NavPillar } from '@/lib/navigation';

function isActivePath(pathname: string | null, href: string): boolean {
  if (href === '/') return pathname === '/';
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function PillarDropdown({
  pillar,
  pathname,
  onNavigate,
}: {
  pillar: NavPillar;
  pathname: string | null;
  onNavigate?: () => void;
}) {
  const active =
    isActivePath(pathname, pillar.href) ||
    pillar.children.some((child) => isActivePath(pathname, child.href));

  if (pillar.children.length === 0) {
    return (
      <Link
        href={pillar.href}
        className={`nav-link ${active ? 'active' : ''}`}
        onClick={onNavigate}
      >
        <pillar.icon size="sm" />
        {pillar.label}
      </Link>
    );
  }

  return (
    <div className="group relative">
      <Link
        href={pillar.href}
        className={`nav-link ${active ? 'active' : ''}`}
        onClick={onNavigate}
      >
        <pillar.icon size="sm" />
        {pillar.label}
        <svg
          className="w-3 h-3 opacity-60"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </Link>
      {/* Dropdown */}
      <div className="invisible absolute left-0 top-full z-50 min-w-48 border-2 border-steel bg-blackness opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <Link
          href={pillar.href}
          className={`flex items-center gap-2 border-b border-steel px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gray hover:bg-toxic hover:text-white ${isActivePath(pathname, pillar.href) ? 'text-white' : ''}`}
          onClick={onNavigate}
        >
          <pillar.icon size="sm" />
          Vue d&apos;ensemble
        </Link>
        {pillar.children.map((child) => (
          <Link
            key={child.href}
            href={child.href}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-toxic hover:text-white ${
              isActivePath(pathname, child.href)
                ? 'border-l-2 border-blood bg-abyss text-white'
                : 'border-l-2 border-transparent text-gray'
            }`}
            onClick={onNavigate}
          >
            <child.icon size="sm" />
            {child.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function MetalNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <h1 className="text-xl text-white font-metal tracking-tighter uppercase">ADAGIO</h1>
          </div>
        </Link>

        {/* Navigation desktop : 4 piliers */}
        <div className="hidden lg:flex items-center gap-0">
          {PILLARS.map((pillar) => (
            <PillarDropdown key={pillar.href} pillar={pillar} pathname={pathname} />
          ))}
        </div>

        {/* User section desktop */}
        <div className="hidden lg:flex items-center gap-0">
          {ACCOUNT_NAV.map((item: NavLink) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${isActivePath(pathname, item.href) ? 'active' : ''}`}
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

      {/* Mobile menu : regroupé par pilier */}
      {mobileMenuOpen && (
        <div className="lg:hidden max-h-[70vh] overflow-y-auto border-t-2 border-steel bg-blackness">
          {PILLARS.map((pillar) => (
            <div key={pillar.href} className="border-b border-steel">
              <Link
                href={pillar.href}
                className={`nav-link font-bold ${isActivePath(pathname, pillar.href) ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <pillar.icon size="sm" />
                {pillar.label}
              </Link>
              {pillar.children.length > 0 && (
                <div className="pl-6 border-l-2 border-steel ml-4">
                  {pillar.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`nav-link ${isActivePath(pathname, child.href) ? 'active' : ''}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <child.icon size="sm" />
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div>
            {ACCOUNT_NAV.map((item: NavLink) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActivePath(pathname, item.href) ? 'active' : ''}`}
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
        <h2 className="text-xs text-gray font-mono tracking-widest uppercase mb-2">{title}</h2>
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
