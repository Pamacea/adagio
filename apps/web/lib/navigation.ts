/**
 * ADAGIO - Liens de navigation (source unique : MetalNav + MetalFooter)
 */

import type { ComponentType } from 'react';
import { Icons } from '@/components/MetalIcons';

export interface NavLink {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string; size?: 'sm' | 'md' | 'lg' }>;
}

// Outils & théorie (pilier principal)
export const MAIN_NAV: NavLink[] = [
  { label: 'COMPOSE', href: '/compose', icon: Icons.Compose },
  { label: 'ACCORDS', href: '/theory/chords', icon: Icons.Chords },
  { label: 'NOTES', href: '/notes', icon: Icons.Notes },
  { label: 'LEÇONS', href: '/lessons', icon: Icons.Lessons },
  { label: 'TRIADES', href: '/theory/triades', icon: Icons.Triads },
  { label: 'MODES', href: '/theory/modes', icon: Icons.Modes },
  { label: 'GAMMES', href: '/theory/scales', icon: Icons.Scales },
  { label: 'CERCLE', href: '/theory/circle', icon: Icons.Circle },
  { label: 'MANCHE', href: '/fretboard', icon: Icons.Fretboard },
  { label: 'NOTATION', href: '/notation', icon: Icons.Notation },
];

// Compte & parcours
export const ACCOUNT_NAV: NavLink[] = [
  { label: 'SESSIONS', href: '/sessions', icon: Icons.Sessions },
  { label: 'SUCCÈS', href: '/achievements', icon: Icons.Fire },
  { label: 'PROFILE', href: '/profile', icon: Icons.User },
  { label: 'WARNING', href: '/warning', icon: Icons.Warning },
];
