export * from './core/Note';
export * from './core/Interval';
export * from './core/Scale';
export * from './core/Chord';
export * from './constants';
export * from './calculators/CircleOfFifthsCalculator';
export * from './calculators/ChordCalculator';
export * from './fretboard';
export * from './mappings/degree-feelings';
export * from './mappings/chord-feelings';
export * from './mappings/emotion-mapping';
export * from './mappings/chord-mapping';
export * from './data';

// FretboardCalculator exports - use explicit exports to avoid conflicts
export {
  calculateFretboard as calculateFretboardNotes,
  getFretboardNotesForKey,
  type FretboardOptions as FretboardCalculatorOptions,
} from './calculators/FretboardCalculator';
