/**
 * ADAGIO - TriadsExtensions Component
 * Panneau d'extensions pour étendre les triades en accords complets
 */

'use client';

import { cn } from '@adagio/ui';
import type { TriadExtension, ExtensionAlteration, ExtensionConfig } from '../services';
import { TRIAD_EXTENSION_LABELS, TRIAD_EXTENSIONS } from '../hooks';

export interface TriadsExtensionsProps {
  extensions: ExtensionConfig[];
  onToggleExtension: (extension: TriadExtension, alteration: ExtensionAlteration) => void;
  hasExtension: (extension: TriadExtension) => boolean;
  getExtensionAlteration: (extension: TriadExtension) => ExtensionAlteration | undefined;
  onClearExtensions: () => void;
}

const ALTERATIONS: { value: ExtensionAlteration; label: string; sym: string }[] = [
  { value: 'natural', label: 'Naturel', sym: '♮' },
  { value: 'flat', label: 'Bémol', sym: '♭' },
  { value: 'sharp', label: 'Dièse', sym: '♯' },
];

export function TriadsExtensions({
  extensions,
  onToggleExtension,
  hasExtension,
  getExtensionAlteration,
  onClearExtensions,
}: TriadsExtensionsProps) {
  const activeCount = extensions.length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-metal text-white">Extensions</h3>
        {activeCount > 0 && (
          <button
            onClick={onClearExtensions}
            className="text-xs text-gray-400 hover:text-red-400 transition-colors"
          >
            Effacer ({activeCount})
          </button>
        )}
      </div>

      {/* Extensions */}
      <div className="space-y-2">
        {TRIAD_EXTENSIONS.map((extension) => {
          const isActive = hasExtension(extension);
          const currentAlteration = getExtensionAlteration(extension);

          return (
            <div
              key={extension}
              className={cn(
                'border-2 rounded-none transition-all duration-200',
                isActive
                  ? 'border-amber-400/50 bg-amber-400/10'
                  : 'border-steel/30 bg-void/50'
              )}
            >
              {/* Extension label */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-steel/20">
                <span className={cn(
                  'text-sm font-semibold',
                  isActive ? 'text-amber-400' : 'text-gray-400'
                )}>
                  {TRIAD_EXTENSION_LABELS[extension]} ({extension})
                </span>
                <span className={cn(
                  'text-xs',
                  isActive ? 'text-amber-400' : 'text-gray-500'
                )}>
                  {currentAlteration ? ALTERATIONS.find(a => a.value === currentAlteration)?.sym : '—'}
                </span>
              </div>

              {/* Altérations */}
              <div className="flex px-2 py-1.5 gap-1">
                {ALTERATIONS.map((alt) => {
                  const isSelected = isActive && currentAlteration === alt.value;

                  return (
                    <button
                      key={alt.value}
                      onClick={() => onToggleExtension(extension, alt.value)}
                      className={cn(
                        'flex-1 py-1.5 text-xs font-medium border rounded-none transition-all duration-150',
                        isSelected
                          ? 'border-amber-400 bg-amber-400/30 text-amber-400'
                          : 'border-steel/30 text-gray-400 hover:border-amber-400/30 hover:text-gray-300'
                      )}
                      title={alt.label}
                    >
                      {alt.sym}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Légende */}
      <div className="p-3 border-2 border-steel/20 rounded-none bg-void/50">
        <p className="text-xs text-gray-400 mb-2 font-semibold">Altérations</p>
        <div className="space-y-1.5 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <span className="text-amber-400">♮</span>
            <span>Naturel (intervalle standard)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400">♭</span>
            <span>Bémol (un demi-ton en dessous)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400">♯</span>
            <span>Dièse (un demi-ton au-dessus)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
