/**
 * ADAGIO - ModeCircle Component
 * Visualisation circulaire des 7 modes grecs
 */

'use client';

import { getEmotionForMode } from '@adagio/theory';
import type { ModeName } from '@adagio/types';

interface ModeCircleProps {
  modes: ModeName[];
  selectedMode: ModeName;
  onSelect: (mode: ModeName) => void;
}

export function ModeCircle({ modes, selectedMode, onSelect }: ModeCircleProps) {
  // Rayon du cercle central pour masquer les lignes
  const centerRadius = 20;

  return (
    <div className="section-frame p-8">
      <div className="relative w-full max-w-md mx-auto aspect-square">
        {/* Outer circle */}
        <div className="absolute inset-0 border-2 border-steel rounded-full" />
        <div className="absolute inset-4 border border-toxic rounded-full" />

        {/* Connecting lines - SVG au fond */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
          {modes.map((mode, i) => {
            const angle = (i * 51.43 - 90) * (Math.PI / 180);
            const outerRadius = 42;
            const x = 50 + outerRadius * Math.cos(angle);
            const y = 50 + outerRadius * Math.sin(angle);

            // Calculer le point où la ligne s'arrête (bord du cercle central)
            const innerX = 50 + centerRadius * Math.cos(angle);
            const innerY = 50 + centerRadius * Math.sin(angle);

            return (
              <line
                key={mode}
                x1={innerX}
                y1={innerY}
                x2={x}
                y2={y}
                stroke={mode === selectedMode ? '#8b1a1a' : '#2a2a2a'}
                strokeWidth="0.5"
              />
            );
          })}
        </svg>

        {/* Center display - avec fond pour masquer les lignes */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-40 h-40 rounded-full bg-abyss border-2 border-steel flex items-center justify-center">
            <div className="text-center">
              <p className="text-xs text-gray uppercase">Mode</p>
              <p className="text-2xl font-metal text-white uppercase mt-1">
                {getEmotionForMode(selectedMode).name}
              </p>
            </div>
          </div>
        </div>

        {/* Mode buttons around circle */}
        {modes.map((mode, i) => {
          const angle = (i * 51.43 - 90) * (Math.PI / 180);
          const radius = 42;
          const x = 50 + radius * Math.cos(angle);
          const y = 50 + radius * Math.sin(angle);
          const info = getEmotionForMode(mode);
          const isActive = mode === selectedMode;

          return (
            <button
              key={mode}
              onClick={() => onSelect(mode)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center hover:scale-110 transition-transform z-20"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div className={`w-14 h-14 flex items-center justify-center border-2 rounded-full transition-all ${
                isActive ? 'border-blood bg-toxic' : 'border-steel bg-blackness hover:border-white'
              }`}>
                <span className="text-xs font-bold text-white uppercase">{info.name.slice(0, 3).toUpperCase()}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
