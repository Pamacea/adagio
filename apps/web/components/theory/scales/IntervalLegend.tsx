/**
 * ADAGIO - IntervalLegend Component
 * Légende des intervalles avec couleurs hexadécimales
 */

'use client';

import type { Interval } from '@adagio/types';

// Couleurs hexadécimales pour la légende
const INTERVAL_HEX_COLORS: Record<string, string> = {
  '1': '#ef4444',      // rouge - fondamentale
  '5': '#f97316',      // orange - quinte
  'b3': '#6b7280',     // gris - tierce mineure
  'b7': '#6b7280',     // gris - septième mineure
  'bb6': '#6b7280',    // gris - sixte double-bémol
  'bb7': '#6b7280',    // gris - septième double-bémol
  '3': '#22c55e',      // vert - tierce majeure
  '7': '#a855f7',      // violet - septième majeure
  '#6': '#a855f7',     // violet - sixte augmentée
  '4': '#06b6d4',      // cyan - quarte
  '#4': '#06b6d4',     // cyan - quarte augmentée
  'b5': '#0891b2',     // cyan foncé - quinte diminuée
  'b4': '#0891b2',     // cyan foncé - quarte diminuée
  '#5': '#a855f7',     // violet - quinte augmentée
  'b2': '#f97316',     // orange - seconde mineure
  'b6': '#f97316',     // orange - sixte mineure
  '2': '#fbbf24',      // jaune - seconde
  '6': '#fbbf24',      // jaune - sixte
};

// Convertir les intervalles vers notation musicale
function formatInterval(interval: Interval): string {
  const symbols: Record<string, string> = {
    '#': '♯',
    'b': '♭',
    'bb': '♭♭',
    '##': '♯♯',
  };
  let result: string = interval;
  for (const [key, symbol] of Object.entries(symbols)) {
    result = result.replace(new RegExp(key, 'g'), symbol);
  }
  return result;
}

interface IntervalInfo {
  interval: Interval;
  name: string;
  description: string;
}

const INTERVALS_INFO: IntervalInfo[] = [
  { interval: '1', name: 'Fondamentale', description: 'Note tonique, centre de la gamme' },
  { interval: '2', name: 'Seconde majeure', description: 'Note de passage' },
  { interval: 'b2', name: 'Seconde mineure', description: 'Phrygien, espagnol' },
  { interval: 'b3', name: 'Tierce mineure', description: 'Son triste/mélancolique' },
  { interval: '3', name: 'Tierce majeure', description: 'Son heureux' },
  { interval: '4', name: 'Quarte', description: 'Note stable' },
  { interval: '#4', name: 'Quarte augmentée', description: 'Lydien, tension' },
  { interval: 'b5', name: 'Quinte diminuée', description: 'Locrien, instable' },
  { interval: '5', name: 'Quinte', description: 'Note stable, power chord' },
  { interval: '#5', name: 'Quinte augmentée', description: 'Tension vers VI' },
  { interval: '6', name: 'Sixte', description: 'Note de passage' },
  { interval: 'b6', name: 'Sixte mineure', description: 'Sombre' },
  { interval: 'b7', name: 'Septième mineure', description: 'Son bluesy' },
  { interval: '7', name: 'Septième majeure', description: 'Tension vers la tonique' },
  { interval: '#6', name: 'Sixte augmentée', description: 'Lydien augmenté' },
  { interval: 'bb6', name: 'Sixte double-bémol', description: 'Diminuée (6♭♭)' },
  { interval: 'bb7', name: 'Septième double-bémol', description: 'Diminuée (7♭♭)' },
];

export function IntervalLegend() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {INTERVALS_INFO.map(({ interval, name, description }) => (
        <div key={interval} className="section-frame p-3">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
              style={{ backgroundColor: INTERVAL_HEX_COLORS[interval] || '#444', color: 'white' }}
            >
              {formatInterval(interval)}
            </div>
            <p className="text-sm font-bold text-white">{name}</p>
          </div>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
      ))}
    </div>
  );
}
