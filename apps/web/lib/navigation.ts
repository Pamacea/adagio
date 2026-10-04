/**
 * ADAGIO - Liens de navigation (source unique : MetalNav + MetalFooter)
 * Nav en 4 piliers : Comprendre / Jouer / Composer / Apprendre (+ Compte)
 */

import type { ComponentType } from 'react';
import { Icons } from '@/components/MetalIcons';

export interface NavLink {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string; size?: 'sm' | 'md' | 'lg' }>;
}

export interface NavPillar extends NavLink {
  /** Sous-pages du pilier (dropdown desktop / groupe mobile). Vide = lien direct. */
  children: NavLink[];
}

export const PILLARS: NavPillar[] = [
  {
    label: 'COMPRENDRE',
    href: '/theory',
    icon: Icons.Modes,
    children: [
      { label: 'ACCORDS', href: '/theory/chords', icon: Icons.Chords },
      { label: 'TRIADES', href: '/theory/triades', icon: Icons.Triads },
      { label: 'MODES', href: '/theory/modes', icon: Icons.Modes },
      { label: 'GAMMES', href: '/theory/scales', icon: Icons.Scales },
      { label: 'CERCLE', href: '/theory/circle', icon: Icons.Circle },
    ],
  },
  {
    label: 'JOUER',
    href: '/play',
    icon: Icons.Fretboard,
    children: [
      { label: 'MANCHE', href: '/fretboard', icon: Icons.Fretboard },
      { label: 'NOTATION', href: '/notation', icon: Icons.Notation },
      { label: 'ANTISÈCHE', href: '/notes', icon: Icons.Notes },
    ],
  },
  {
    label: 'COMPOSER',
    href: '/compose',
    icon: Icons.Compose,
    children: [],
  },
  {
    label: 'APPRENDRE',
    href: '/lessons',
    icon: Icons.Lessons,
    children: [
      { label: 'LEÇONS', href: '/lessons', icon: Icons.Lessons },
    ],
  },
];

// Compte & infos
export const ACCOUNT_NAV: NavLink[] = [
  { label: 'PROFILE', href: '/profile', icon: Icons.User },
  { label: 'WARNING', href: '/warning', icon: Icons.Warning },
];
