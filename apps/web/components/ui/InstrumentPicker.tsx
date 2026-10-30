'use client';

import { INSTRUMENTS, INSTRUMENT_IDS, type Instrument } from '@adagio/theory';
import { GuitarIcon, MusicNoteIcon } from '@/components/AchievementIcons';
import { SegmentedControl } from './SegmentedControl';

const ICONS: Record<Instrument, typeof GuitarIcon> = {
  guitar: GuitarIcon,
  bass: MusicNoteIcon,
};

export interface InstrumentPickerProps {
  value: Instrument;
  onChange: (value: Instrument) => void;
  label?: string;
}

export function InstrumentPicker({ value, onChange, label = 'Instrument' }: InstrumentPickerProps) {
  return (
    <SegmentedControl
      label={label}
      value={value}
      onChange={(next) => onChange(next as Instrument)}
      options={INSTRUMENT_IDS.map((id) => {
        const Icon = ICONS[id];
        return {
          value: id,
          ariaLabel: INSTRUMENTS[id].label,
          label: (
            <>
              <Icon size={14} aria-hidden="true" />
              {INSTRUMENTS[id].label}
            </>
          ),
        };
      })}
    />
  );
}
