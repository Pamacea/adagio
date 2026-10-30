/**
 * AccordionHeader - En-tête d'un dossier de catégorie d'accords.
 */

'use client';

import { cn } from '@adagio/ui';

export interface AccordionHeaderProps {
  name: string;
  description: string;
  count: number;
  isOpen: boolean;
  onToggle: () => void;
  /** Couleur du degré diatonique courant ; rust par défaut. */
  color?: string;
}

export function AccordionHeader({
  name,
  description,
  count,
  isOpen,
  onToggle,
  color = 'var(--color-rust)',
}: AccordionHeaderProps) {
  return (
    <button
      onClick={onToggle}
      aria-expanded={isOpen}
      data-tooltip={description}
      className="flex w-full items-center gap-2 px-2.5 py-2 text-left transition-colors hover:bg-raised/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ember/60"
    >
      <svg
        className={cn(
          'h-3.5 w-3.5 shrink-0 transition-transform duration-200',
          isOpen && 'rotate-90'
        )}
        style={{ color }}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
      <span className="min-w-0 flex-1 truncate text-sm text-white">{name}</span>
      <span className="shrink-0 text-[10px] text-gray/70">{count}</span>
    </button>
  );
}
