'use client';

import { TUNING_PRESETS, type Instrument, type TuningPreset } from '@adagio/theory';
import { SegmentedControl } from './SegmentedControl';

export interface TuningSelectProps {
  instrument: Instrument;
  value: TuningPreset;
  onChange: (value: TuningPreset) => void;
  label?: string;
}

export function TuningSelect({
  instrument,
  value,
  onChange,
  label = 'Accordage',
}: TuningSelectProps) {
  const options = TUNING_PRESETS.filter(
    (preset) => instrument === 'guitar' || preset.value !== 'drop-d'
  ).map((preset) => ({ ...preset, ariaLabel: preset.label }));

  return (
    <SegmentedControl
      label={label}
      value={value}
      onChange={(next) => onChange(next as TuningPreset)}
      options={options}
    />
  );
}
