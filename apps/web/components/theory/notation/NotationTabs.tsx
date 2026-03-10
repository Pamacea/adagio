/**
 * ADAGIO - NotationTabs Component
 * Navigation à onglets pour la page notation
 */

'use client';

import type { NotationTab } from '@/features/theory/hooks';

interface NotationTabsProps {
  selectedTab: NotationTab;
  onTabChange: (tab: NotationTab) => void;
}

const TABS: { id: NotationTab; label: string }[] = [
  { id: 'notes', label: 'NOTES' },
  { id: 'chords', label: 'ACCORDS' },
  { id: 'progressions', label: 'PROGRESSIONS' },
];

export function NotationTabs({ selectedTab, onTabChange }: NotationTabsProps) {
  return (
    <div className="flex gap-1 mb-8">
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 text-sm font-bold uppercase border-2 transition-all ${
            selectedTab === tab.id
              ? 'border-blood bg-toxic text-white'
              : 'border-steel bg-abyss text-gray hover:border-white'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
