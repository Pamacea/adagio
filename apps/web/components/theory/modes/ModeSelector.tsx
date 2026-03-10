/**
 * ADAGIO - ModeSelector Component
 * Contrôles pour la sélection de tonique et la vue liste/cercle
 */

'use client';

import type { NoteName } from '@adagio/types';

interface ModeSelectorProps {
  selectedRoot: NoteName;
  showCircle: boolean;
  onRootChange: (root: NoteName) => void;
  onViewToggle: () => void;
  ROOTS: readonly NoteName[];
  noteFr: Record<string, string>;
}

export function ModeSelector({
  selectedRoot,
  showCircle,
  onRootChange,
  onViewToggle,
  ROOTS,
  noteFr,
}: ModeSelectorProps) {
  return (
    <div className="section-frame p-4 mb-8">
      <div className="flex flex-wrap items-center gap-4">
        {/* Root selection */}
        <div className="flex-1">
          <label className="text-xs text-gray uppercase tracking-wider block mb-2">
            TONIQUE
          </label>
          <div className="flex flex-wrap gap-1">
            {ROOTS.map(root => (
              <button
                key={root}
                onClick={() => onRootChange(root)}
                className={`px-2 py-1.5 text-xs font-bold uppercase border-2 transition-all ${
                  selectedRoot === root
                    ? 'border-blood bg-toxic text-white'
                    : 'border-steel bg-abyss text-gray hover:border-white'
                }`}
              >
                {noteFr[root] || root}
              </button>
            ))}
          </div>
        </div>

        {/* View toggle */}
        <div className="ml-auto">
          <button
            onClick={onViewToggle}
            className="px-4 py-2 text-sm font-bold uppercase border-2 border-steel bg-abyss text-gray hover:border-white transition-all"
          >
            {showCircle ? 'LISTE' : 'CERCLE'}
          </button>
        </div>
      </div>
    </div>
  );
}
