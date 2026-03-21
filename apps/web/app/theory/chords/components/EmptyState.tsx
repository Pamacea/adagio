/**
 * EmptyState - Empty state when no chord is selected
 *
 * Displays:
 * - Musical note icon with animation
 * - Instruction message
 */

'use client';

export interface EmptyStateProps {
  className?: string;
}

export function EmptyState({ className }: EmptyStateProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="flex justify-center mb-4 animate-pulse">
            <svg className="w-16 h-16 text-gray/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
          <h2 className="text-2xl font-metal text-white mb-2">Sélectionnez un accord</h2>
          <p className="text-gray">Choisissez une tonique et un degré dans le menu</p>
        </div>
      </div>
    </div>
  );
}
