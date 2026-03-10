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
          <div className="text-6xl font-metal text-gray/30 mb-4 animate-pulse">♪</div>
          <h2 className="text-2xl font-metal text-white mb-2">Sélectionnez un accord</h2>
          <p className="text-gray">Choisissez une tonique et un degré dans le menu</p>
        </div>
      </div>
    </div>
  );
}
