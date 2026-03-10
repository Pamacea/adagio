/**
 * ChordCard - Card component for displaying chord information
 *
 * Shows:
 * - Chord name (ex: "Cmaj7")
 * - Chord diagram
 * - Harmonic function (Tonique, Pré-dominant, Dominant)
 * - Emotional quality
 */

import { type NoteName, type ChordQuality, type AxisGroup } from '@adagio/types';
import { Card, CardHeader, CardTitle, CardDescription } from './Card';
import { ChordDiagram } from '../organisms/ChordDiagram';
import { cn } from '../lib/cn';

export interface ChordCardProps {
  name: string; // Ex: "Cmaj7"
  root: NoteName;
  quality: ChordQuality;
  positions: Array<{ string: number; fret: number; finger?: number }>;
  function?: 'Tonique' | 'Pré-dominant' | 'Dominant' | 'Substitution';
  degree?: string; // Ex: "I", "IV", "V7", "ii"
  emotion?: string; // Ex: "Stable, Lumineux"
  axisGroup?: AxisGroup;
  onClick?: () => void;
  className?: string;
  selected?: boolean;
}

const functionStyles: Record<string, string> = {
  Tonique: 'bg-toxic border-blood text-white',
  'Pré-dominant': 'bg-blackness border-rust text-rust',
  Dominant: 'bg-void border-b7 text-b7',
  Substitution: 'bg-blackness border-steel text-gray',
};

const axisGroupStyles: Record<string, string> = {
  tonic: 'bg-toxic border-blood text-white',
  subdominant: 'bg-blackness border-rust text-rust',
  dominant: 'bg-void border-b7 text-b7',
};

export function ChordCard({
  name,
  root,
  quality,
  positions,
  function: chordFunction,
  degree,
  emotion,
  axisGroup,
  onClick,
  className,
  selected = false,
}: ChordCardProps) {
  return (
    <Card
      variant={selected ? 'elevated' : 'default'}
      padding="md"
      className={cn(
        'cursor-pointer transition-all duration-200 hover:border-blood',
        selected && 'ring-2 ring-red-600',
        onClick && 'hover:shadow-lg',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-amber-400">{name}</CardTitle>
          {degree && (
            <span className="text-xs font-mono text-gray bg-blackness px-2 py-1 rounded border border-steel">
              {degree}
            </span>
          )}
        </div>
        {emotion && (
          <CardDescription className="text-gray">{emotion}</CardDescription>
        )}
      </CardHeader>

      <div className="flex flex-col items-center gap-3">
        {/* Harmonic function badge */}
        {chordFunction && (
          <span className={cn(
            'text-xs font-bold uppercase px-3 py-1 rounded border-2',
            functionStyles[chordFunction]
          )}>
            {chordFunction}
          </span>
        )}

        {/* Chord diagram */}
        <ChordDiagram
          name=""
          root={root}
          positions={positions}
          frets={4}
          showFretNumbers={false}
          showStringNames={false}
        />

        {/* Axis group badge */}
        {axisGroup && (
          <span className={cn(
            'text-xs px-3 py-1 rounded border-2',
            axisGroupStyles[axisGroup]
          )}>
            {axisGroup === 'tonic' && 'Tonique'}
            {axisGroup === 'subdominant' && 'Pré-dominant'}
            {axisGroup === 'dominant' && 'Dominant'}
          </span>
        )}
      </div>
    </Card>
  );
}
