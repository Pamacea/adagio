/**
 * ADAGIO - FretboardControls Component
 * Contrôles pour la page fretboard
 * Sélecteur d'instrument, accordage, tonique, mode, nombre de frettes, affichage
 */

'use client';

import type { NoteName, ModeName, Instrument } from '@adagio/types';
import { FRENCH_NOTE_NAMES as NOTE_FR, type TuningPreset } from '@adagio/theory';
import { InstrumentPicker, SegmentedControl, TuningSelect } from '@/components/ui';

// Toutes les notes chromatiques (avec dièses)
const CHROMATIC_ROOTS: NoteName[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

// Modes grecs disponibles
const GREEK_MODES: ModeName[] = [
  'ionian',
  'dorian',
  'phrygian',
  'lydian',
  'mixolydian',
  'aeolian',
  'locrian',
];

// Noms français des modes
const MODE_FR_NAMES: Record<ModeName, string> = {
  ionian: 'Majeur',
  dorian: 'Dorien',
  phrygian: 'Phrygien',
  lydian: 'Lydien',
  mixolydian: 'Mixolydien',
  aeolian: 'Mineur',
  locrian: 'Locrien',
};

// Options de nombre de frettes
const FRET_COUNT_OPTIONS = [12, 15, 17, 19, 21, 24] as const;
type FretCountOption = (typeof FRET_COUNT_OPTIONS)[number];

interface FretboardControlsProps {
  currentRoot: NoteName;
  currentMode: ModeName;
  fretCount: FretCountOption;
  showAllNotes: boolean;
  instrument: Instrument;
  tuningPreset: TuningPreset;
  onRootChange: (root: NoteName) => void;
  onModeChange: (mode: ModeName) => void;
  onFretCountChange: (count: FretCountOption) => void;
  onToggleNotes: () => void;
  onInstrumentChange: (instrument: Instrument) => void;
  onTuningPresetChange: (preset: TuningPreset) => void;
}

export function FretboardControls({
  currentRoot,
  currentMode,
  fretCount,
  showAllNotes,
  instrument,
  tuningPreset,
  onRootChange,
  onModeChange,
  onFretCountChange,
  onToggleNotes,
  onInstrumentChange,
  onTuningPresetChange,
}: FretboardControlsProps) {
  const displayNote = (note: NoteName): string => {
    return NOTE_FR[note] || note;
  };

  return (
    <div className="panel mb-8 p-4 [&_.control:hover]:text-rust">
      <div className="flex flex-wrap items-start gap-x-6 gap-y-4">
        <InstrumentPicker value={instrument} onChange={onInstrumentChange} label="Instrument" />

        <TuningSelect
          instrument={instrument}
          value={tuningPreset}
          onChange={onTuningPresetChange}
          label="Accordage"
        />

        <SegmentedControl
          label="Tonique"
          options={CHROMATIC_ROOTS.map((root) => ({
            value: root,
            label: displayNote(root),
            ariaLabel: `Note ${displayNote(root)}`,
          }))}
          value={currentRoot}
          onChange={(value) => onRootChange(value as NoteName)}
          wrap
        />

        <SegmentedControl
          label="Mode"
          options={GREEK_MODES.map((mode) => ({
            value: mode,
            label: MODE_FR_NAMES[mode],
            ariaLabel: MODE_FR_NAMES[mode],
          }))}
          value={currentMode}
          onChange={(value) => onModeChange(value as ModeName)}
          wrap
        />

        <SegmentedControl
          label="Frettes"
          options={FRET_COUNT_OPTIONS.map((frets) => ({
            value: String(frets),
            label: frets,
            ariaLabel: `${frets} frettes`,
          }))}
          value={String(fretCount)}
          onChange={(value) => onFretCountChange(Number(value) as FretCountOption)}
        />

        <SegmentedControl
          label="Affichage"
          options={[
            { value: 'scale', label: 'Mode seul' },
            { value: 'all', label: 'Toutes notes' },
          ]}
          value={showAllNotes ? 'all' : 'scale'}
          onChange={(value) => {
            if ((value === 'all') !== showAllNotes) onToggleNotes();
          }}
        />
      </div>
    </div>
  );
}

export type { FretCountOption };
