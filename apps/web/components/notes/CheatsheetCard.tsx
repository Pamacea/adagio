/**
 * ADAGIO - Cheatsheet Card Component
 * Carte individuelle pour l'antisèche théorique
 */

'use client';

import { DEGREE_COLORS } from '@adagio/theory';
import type { CheatsheetCard as CardType } from '@adagio/theory';

interface CheatsheetCardProps {
  card: CardType;
}

export function CheatsheetCard({ card }: CheatsheetCardProps) {
  // Couleur basée sur le degré si spécifié
  const degreeColor = card.degree !== undefined
    ? DEGREE_COLORS[card.degree - 1] || '#60A5FA'
    : null;

  return (
    <div className="border-2 border-steel bg-blackness p-4 hover:border-blood transition-colors">
      {/* Header avec titre */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h4 className="font-metal text-white text-lg">
          {card.title}
        </h4>
        {degreeColor && (
          <div
            className="w-3 h-3 rounded-full shrink-0 mt-1"
            style={{ backgroundColor: degreeColor }}
          />
        )}
      </div>

      {/* Contenu principal */}
      <p className="text-gray text-sm leading-relaxed mb-3">
        {card.content}
      </p>

      {/* Exemple */}
      {card.example && (
        <div className="bg-void/50 border border-steel/50 rounded p-2 mb-3">
          <p className="text-toxic text-xs font-mono">
            {card.example}
          </p>
        </div>
      )}

      {/* Tip */}
      {card.tip && (
        <div className="flex items-start gap-2 mt-3 pt-3 border-t border-steel/30">
          <span className="text-toxic text-xs font-mono">TIP:</span>
          <p className="text-gray text-xs italic">
            {card.tip}
          </p>
        </div>
      )}
    </div>
  );
}
