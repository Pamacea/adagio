/**
 * AccordionHeader - Header for collapsible chord categories
 *
 * Displays:
 * - Category icon and name
 * - Chord count badge
 * - Expand/collapse indicator
 */

'use client';

export interface AccordionHeaderProps {
  name: string;
  description: string;
  icon: string;
  color: string;
  count: number;
  isOpen: boolean;
  onToggle: () => void;
}

export function AccordionHeader({ name, description, icon, color, count, isOpen, onToggle }: AccordionHeaderProps) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-3 rounded-none border-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group mb-2"
      style={{
        borderColor: isOpen ? color : 'rgba(255,255,255,0.1)',
        background: isOpen ? `${color}15` : 'transparent'
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="w-8 h-8 flex items-center justify-center rounded-none text-base font-bold transition-transform duration-300"
          style={{
            background: color + '30',
            color: color,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        >
          {icon}
        </span>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">{name}</h3>
      </div>
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 text-xs font-bold rounded-none" style={{ background: color + '30', color: color }}>
          {count}
        </span>
        <svg className="w-5 h-5 transition-transform duration-300" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <path d="M19 9l-7 7-7-7" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ color: color }} />
        </svg>
      </div>
    </button>
  );
}
