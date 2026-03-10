/**
 * ModeIcon - Greek Mode Visual Indicator
 *
 * Circular indicators for the 7 Greek modes with emotional colors
 */

import { type ModeName } from '@adagio/types';
import { cn } from '../lib/cn';

const MODE_COLORS: Record<ModeName, string> = {
  ionian: 'bg-mode-ionian',
  dorian: 'bg-mode-dorian',
  phrygian: 'bg-mode-phrygian',
  lydian: 'bg-mode-lydian',
  mixolydian: 'bg-mode-mixolydian',
  aeolian: 'bg-mode-aeolian',
  locrian: 'bg-mode-locrian',
};

const MODE_GLOW_COLORS: Record<ModeName, string> = {
  ionian: 'shadow-[0_0_20px_rgba(247,201,72,0.5)]',
  dorian: 'shadow-[0_0_20px_rgba(142,184,240,0.5)]',
  phrygian: 'shadow-[0_0_20px_rgba(240,139,139,0.5)]',
  lydian: 'shadow-[0_0_20px_rgba(184,163,240,0.5)]',
  mixolydian: 'shadow-[0_0_20px_rgba(163,217,165,0.5)]',
  aeolian: 'shadow-[0_0_20px_rgba(143,154,170,0.5)]',
  locrian: 'shadow-[0_0_20px_rgba(212,165,124,0.5)]',
};

export interface ModeIconProps {
  mode: ModeName;
  size?: 'sm' | 'md' | 'lg';
  glowing?: boolean;
  className?: string;
}

export function ModeIcon({ mode, size = 'md', glowing = false, className }: ModeIconProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div
      className={cn(
        'rounded-full transition-all duration-300',
        MODE_COLORS[mode],
        sizeClasses[size],
        glowing && MODE_GLOW_COLORS[mode],
        className
      )}
      aria-label={`${mode} mode`}
    />
  );
}
