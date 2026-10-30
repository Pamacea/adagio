/**
 * ADAGIO - Notes Filter Component
 * Filtres et recherche pour l'antisèche
 */

'use client';

import { CHEATSHEET_CATEGORIES, type CheatsheetCategory } from '@adagio/theory';
import { Icons } from '@/components/MetalIcons';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  scales: <Icons.Scales size="sm" />,
  circle: <Icons.Circle size="sm" />,
  chords: <Icons.Chords size="sm" />,
  modes: <Icons.Modes size="sm" />,
  fretboard: <Icons.Fretboard size="sm" />,
  notes: <Icons.Notes size="sm" />,
};

interface NotesFilterProps {
  selectedCategory: CheatsheetCategory;
  searchQuery: string;
  onCategoryChange: (category: CheatsheetCategory) => void;
  onSearchChange: (query: string) => void;
}

export function NotesFilter({
  selectedCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
}: NotesFilterProps) {
  return (
    <div className="border-b border-steelwarm bg-surface p-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Recherche */}
        <div className="relative w-full md:w-96">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher dans l'antisèche..."
            className="w-full bg-void border border-steelwarm py-2 pl-10 pr-4 text-white text-sm placeholder:text-gray focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Catégories */}
        <div className="flex flex-wrap gap-2">
          {CHEATSHEET_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={`px-4 py-2 text-sm font-medium transition-all border ${
                selectedCategory === cat.value
                  ? 'bg-amber-400/20 text-amber-400 border-amber-400'
                  : 'bg-void text-gray border-steelwarm hover:border-amber-400/50'
              }`}
            >
              <span className="mr-2 inline-flex">{CATEGORY_ICONS[cat.icon] ?? cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Compteur de résultats */}
      <div className="mt-3 text-xs text-gray">{searchQuery && <span>Recherche active</span>}</div>
    </div>
  );
}
