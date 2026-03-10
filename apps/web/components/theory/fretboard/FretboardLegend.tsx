/**
 * ADAGIO - FretboardLegend Component
 * Légende expliquant les couleurs et symboles du fretboard
 * 3 cartes: Tonique (1), Quinte (5), Autres notes
 */

'use client';

interface LegendItem {
  id: string;
  title: string;
  description: string;
  borderColor: string;
  bgColor: string;
}

const LEGEND_ITEMS: LegendItem[] = [
  {
    id: 'tonic',
    title: 'Tonique (1)',
    description: 'Note fondamentale du mode',
    borderColor: 'border-blood',
    bgColor: 'bg-toxic',
  },
  {
    id: 'fifth',
    title: 'Quinte (5)',
    description: 'Note stable, power chord',
    borderColor: 'border-steel',
    bgColor: 'bg-circuit',
  },
  {
    id: 'other',
    title: 'Autres notes',
    description: 'Degrés du mode',
    borderColor: 'border-steel',
    bgColor: 'bg-blackness',
  },
];

export function FretboardLegend() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {LEGEND_ITEMS.map(({ id, title, description, borderColor, bgColor }) => (
        <div key={id} className="section-frame p-4">
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`w-4 h-4 border-2 ${borderColor} ${bgColor}`}
              aria-hidden="true"
            />
            <p className="text-sm text-white font-bold">{title}</p>
          </div>
          <p className="text-xs text-gray">{description}</p>
        </div>
      ))}
    </div>
  );
}

export type { LegendItem };
