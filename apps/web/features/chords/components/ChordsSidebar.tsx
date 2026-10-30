/**
 * ADAGIO - ChordsSidebar Component
 * Sidebar pour la sélection de tonalité et degré
 */

'use client';

import type { NoteName } from '@adagio/types';
import { getDiatonicChordsByDegree, getMajorChords, getMinorChords } from '@adagio/theory';
import { KeyCircle, SegmentedControl } from '@/components/ui';

// ============================================================================
// TYPES
// ============================================================================

export type TonalityType = 'major' | 'minor';

export interface ChordsSidebarProps {
  // State
  root: NoteName;
  tonality: TonalityType;
  selectedDegree: string;
  selectedChordName: string | null;

  // Constants
  majorDegreeQualities: Record<string, string[]>;
  minorDegreeQualities: Record<string, string[]>;

  // Callbacks
  onTonalityChange: (tonality: TonalityType) => void;
  onRootChange: (note: NoteName) => void;
  onDegreeChange: (degree: string) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function ChordsSidebar({
  root,
  tonality,
  selectedDegree,
  selectedChordName: _selectedChordName,
  onTonalityChange,
  onRootChange,
  onDegreeChange,
}: ChordsSidebarProps) {
  const degreeChords = getDiatonicChordsByDegree(root, tonality);
  // Même source que Compose : les triades diatoniques de la tonalité
  // (en mineur le V est mineur, comme dans la gamme naturelle).
  const diatonicChords = tonality === 'major' ? getMajorChords(root) : getMinorChords(root);

  const degreeOptions = degreeChords.map((deg) => ({
    value: deg.degree,
    label: <span className="text-amber-400">{deg.degree}</span>,
    ariaLabel: `Degré ${deg.degree}`,
  }));

  return (
    <aside className="no-scrollbar w-full shrink-0 overflow-y-auto">
      <div className="space-y-6 p-6">
        <div>
          <p className="field-label">Tonalité</p>
          <KeyCircle
            selectedKey={root}
            keyMode={tonality}
            diatonicChords={diatonicChords}
            size={280}
            onChange={(key, mode) => {
              if (key !== root) onRootChange(key);
              if (mode !== tonality) onTonalityChange(mode);
            }}
          />
        </div>

        <SegmentedControl
          label="Degré"
          value={selectedDegree}
          onChange={onDegreeChange}
          options={degreeOptions}
          wrap
        />
      </div>
    </aside>
  );
}
