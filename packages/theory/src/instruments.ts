// ============================================================================
// INSTRUMENTS - Définitions d'instruments (guitare, basse, ...)
//
// Source de vérité pour le nombre de cordes, l'accordage et le nombre de
// frettes par défaut. Utilisé par les calculateurs (fretboard, voicings)
// et par l'UI pour afficher le bon manche.
// ============================================================================

import type { NoteName } from '@adagio/types';
import { Note } from './core/Note';

export type Instrument = 'guitar' | 'bass';

export type TuningPreset = 'standard' | 'drop-d' | 'half-step-down';

export const TUNING_PRESETS = [
  { value: 'standard', label: 'Standard' },
  { value: 'drop-d', label: 'Drop D' },
  { value: 'half-step-down', label: '1/2 ton plus bas' },
] as const satisfies readonly { value: TuningPreset; label: string }[];

export interface InstrumentDefinition {
  id: Instrument;
  /** Nom d'affichage */
  label: string;
  stringCount: number;
  /** Accordage du plus grave au plus aigu (ordre de calcul) */
  tuning: readonly NoteName[];
  /** Accordage du plus aigu au plus grave (ordre visuel haut → bas du manche) */
  tuningDisplay: readonly NoteName[];
  /** Nombre de frettes par défaut */
  defaultFretCount: number;
}

export const GUITAR: InstrumentDefinition = {
  id: 'guitar',
  label: 'Guitare',
  stringCount: 6,
  tuning: ['E', 'A', 'D', 'G', 'B', 'E'],
  tuningDisplay: ['E', 'B', 'G', 'D', 'A', 'E'],
  defaultFretCount: 24,
};

export const BASS: InstrumentDefinition = {
  id: 'bass',
  label: 'Basse',
  stringCount: 4,
  tuning: ['E', 'A', 'D', 'G'],
  tuningDisplay: ['G', 'D', 'A', 'E'],
  defaultFretCount: 24,
};

export const INSTRUMENTS: Record<Instrument, InstrumentDefinition> = {
  guitar: GUITAR,
  bass: BASS,
};

export const INSTRUMENT_IDS = ['guitar', 'bass'] as const;

export function getInstrument(id: Instrument): InstrumentDefinition {
  return INSTRUMENTS[id];
}

/** Accordage grave → aigu pour un instrument */
export function getInstrumentTuning(id: Instrument): readonly NoteName[] {
  return INSTRUMENTS[id].tuning;
}

const GUITAR_DROP_D: readonly NoteName[] = ['D', 'A', 'D', 'G', 'B', 'E'];

/** Accordage grave → aigu pour un instrument et un preset. */
export function getTuningPreset(instrument: Instrument, preset: TuningPreset): readonly NoteName[] {
  const tuning = INSTRUMENTS[instrument].tuning;
  if (preset === 'standard') return tuning;
  if (preset === 'drop-d') {
    // Drop D n'existe que pour la guitare : la basse retombe sur l'accordage standard.
    return instrument === 'guitar' ? GUITAR_DROP_D : tuning;
  }
  return tuning.map((note) => new Note(note, 4).transpose(-1).name);
}

/** Nombre de cordes d'un instrument */
export function getStringCount(id: Instrument): number {
  return INSTRUMENTS[id].stringCount;
}
