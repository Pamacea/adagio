/**
 * ADAGIO - Cheatsheet Section Component
 * Section accordéon pour une catégorie de l'antisèche
 */

'use client';

import { useState } from 'react';
import { CheatsheetCard } from './CheatsheetCard';
import { Icons } from '@/components/MetalIcons';
import type { CheatsheetSection as SectionType } from '@adagio/theory';

const SECTION_ICONS: Record<string, React.ReactNode> = {
  scales: <Icons.Scales size="md" />,
  circle: <Icons.Circle size="md" />,
  chords: <Icons.Chords size="md" />,
  modes: <Icons.Modes size="md" />,
  fretboard: <Icons.Fretboard size="md" />,
  notes: <Icons.Notes size="md" />,
};

interface CheatsheetSectionProps {
  section: SectionType;
  defaultOpen?: boolean;
}

export function CheatsheetSection({ section, defaultOpen = true }: CheatsheetSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-steel/50 bg-void/30 mb-4">
      {/* Header accordéon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-void/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-toxic">{SECTION_ICONS[section.icon] ?? section.icon}</span>
          <div className="text-left">
            <h2 className="font-metal text-white text-lg">
              {section.title}
            </h2>
            <p className="text-gray text-xs">
              {section.description}
            </p>
          </div>
        </div>
        <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <svg
            className="w-5 h-5 text-gray"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Contenu accordéon */}
      {isOpen && (
        <div className="p-4 pt-0 border-t border-steel/30">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {section.cards.map(card => (
              <CheatsheetCard key={card.id} card={card} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
