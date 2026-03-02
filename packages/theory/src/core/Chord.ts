// ============================================================================
// CHORD - Musical chord class
// ============================================================================

import type { NoteName, ChordQuality, Interval } from '@adagio/types';
import { Note } from './Note';
import { INTERVAL_SEMITONES } from './Interval';

export class Chord {
  constructor(
    public readonly root: NoteName,
    public readonly quality: ChordQuality,
    public readonly extensions?: Interval[]
  ) {}

  /**
   * Get the intervals for this chord
   */
  getIntervals(): Interval[] {
    const qualityIntervals: Record<ChordQuality, Interval[]> = {
      '': ['1', '3', '5'],
      'm': ['1', 'b3', '5'],
      '7': ['1', '3', '5', 'b7'],
      'm7': ['1', 'b3', '5', 'b7'],
      'maj7': ['1', '3', '5', '7'],
      'dim': ['1', 'b3', 'b5'],
      'dim7': ['1', 'b3', 'b5', 'bb7'],
      'm7b5': ['1', 'b3', 'b5', 'b7'],
      'aug': ['1', '3', '#5'],
      'aug7': ['1', '3', '#5', 'b7'],
      'sus2': ['1', '2', '5'],
      'sus4': ['1', '4', '5'],
      '7sus4': ['1', '4', '5', 'b7'],
      '6': ['1', '3', '5', '6'],
      'm6': ['1', 'b3', '5', '6'],
      '9': ['1', '3', '5', '9'],
      'm9': ['1', 'b3', '5', '9'],
      '11': ['1', '3', '5', '7', '11'], // Usually omit 3rd
      'm11': ['1', 'b3', '5', 'b7', '11'],
      '13': ['1', '3', '5', '7', '9', '11', '13'],
      'm13': ['1', 'b3', '5', 'b7', '9', '11', '13'],
      'add9': ['1', '3', '5', '9'],
      'madd9': ['1', 'b3', '5', '9'],
    };

    const base = qualityIntervals[this.quality] || qualityIntervals[''];
    return [...base, ...(this.extensions || [])];
  }

  /**
   * Get the chord name
   */
  getName(): string {
    return `${this.root}${this.quality}`;
  }

  /**
   * Get all notes in the chord
   */
  getNotes(octave = 4): Note[] {
    const rootNote = new Note(this.root, octave);
    const intervals = this.getIntervals();

    return intervals.map(interval => {
      const semitones = INTERVAL_SEMITONES[interval];
      return rootNote.transpose(semitones);
    });
  }
}
