/**
 * ADAGIO - Notes Page
 * Antisèche théorique pour guitaristes
 */

'use client';

import { useState, useMemo } from 'react';
import { MetalNav, MetalFooter } from '@/components';
import { HelpButton, HelpTooltip } from '@/components/HelpProvider';
import { NotesFilter, CheatsheetSection } from '@/components/notes';
import {
  CHEATSHEET_SECTIONS,
  CHEATSHEET_CATEGORIES,
  ALL_CHEATSHEET_CARDS,
  type CheatsheetCategory,
  type CheatsheetSection as CheatsheetSectionType,
} from '@adagio/theory';

export default function NotesPage() {
  const [selectedCategory, setSelectedCategory] = useState<CheatsheetCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrer les sections et cartes basé sur la catégorie et la recherche
  const filteredSections = useMemo(() => {
    let sections: CheatsheetSectionType[] = CHEATSHEET_SECTIONS[selectedCategory];

    // Filtrer par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      sections = sections.map(section => ({
        ...section,
        cards: section.cards.filter(card =>
          card.title.toLowerCase().includes(query) ||
          card.content.toLowerCase().includes(query) ||
          card.example?.toLowerCase().includes(query) ||
          card.tip?.toLowerCase().includes(query)
        ),
      })).filter(section => section.cards.length > 0);
    }

    return sections;
  }, [selectedCategory, searchQuery]);

  // Compter les résultats
  const resultCount = useMemo(() => {
    return filteredSections.reduce((acc, section) => acc + section.cards.length, 0);
  }, [filteredSections]);

  return (
    <div className="min-h-screen flex flex-col bg-abyss text-white">
      <MetalNav />

      {/* Hero Section */}
      <div className="pt-[64px]">
        <div className="border-b border-steel/30 bg-gradient-to-r from-blood/20 via-void to-toxic/20">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-8 h-8 text-toxic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <h1 className="font-metal text-3xl md:text-4xl text-white">
                Antisèche Théorique
              </h1>
              <HelpTooltip topicId="notes.cheatsheet">
                <HelpButton topicId="notes.cheatsheet" useModal size="md" variant="subtle" />
              </HelpTooltip>
            </div>
            <p className="text-gray text-sm md:text-base max-w-2xl">
              Référence rapide pour guitaristes: gammes, accords, manche, et choix de gammes.
              Tout ce que vous devez savoir, en un coup d'œil.
            </p>
          </div>
        </div>

        {/* Filtres */}
        <NotesFilter
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          onCategoryChange={setSelectedCategory}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Contenu principal */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {/* Message si aucun résultat */}
        {filteredSections.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <h3 className="font-metal text-xl text-white mb-2">
              Aucun résultat
            </h3>
            <p className="text-gray text-sm">
              Essayez d'autres mots-clés ou changez de catégorie
            </p>
          </div>
        ) : (
          <>
            {/* Compteur de résultats */}
            {searchQuery && (
              <div className="mb-4 text-sm text-gray">
                {resultCount} carte{resultCount > 1 ? 's' : ''} trouvée{resultCount > 1 ? 's' : ''}
              </div>
            )}

            {/* Sections accordéon */}
            {filteredSections.map(section => (
              <CheatsheetSection
                key={section.id}
                section={section}
                defaultOpen={selectedCategory !== 'all' || filteredSections.length <= 2}
              />
            ))}
          </>
        )}
      </main>

      {/* Footer */}
      <MetalFooter />
    </div>
  );
}
