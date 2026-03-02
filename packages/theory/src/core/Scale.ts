// ============================================================================
// SCALE - Musical scale class
// ============================================================================

import type { Interval, NoteName } from '@adagio/types';
import { Note } from './Note';
import { INTERVAL_SEMITONES } from './Interval';

export class Scale {
  constructor(
    public readonly root: NoteName,
    public readonly intervals: Interval[],
    public readonly name: string = 'Custom Scale'
  ) {}

  /**
   * Get all notes in the scale
   */
  getNotes(octave = 4): Note[] {
    const notes: Note[] = [];
    const rootNote = new Note(this.root, octave);

    for (const interval of this.intervals) {
      const semitones = INTERVAL_SEMITONES[interval];
      const newNote = rootNote.transpose(semitones);
      notes.push(newNote);
    }

    return notes;
  }

  /**
   * Check if a note is in the scale
   */
  contains(note: Note): boolean {
    const scaleNotes = this.getNotes(note.octave);
    return scaleNotes.some(scaleNote => scaleNote.equals(note));
  }

  /**
   * Create a major scale (Ionian mode)
   */
  static major(root: NoteName): Scale {
    return new Scale(root, ['1', '2', '3', '4', '5', '6', '7'], 'Major');
  }

  /**
   * Create a natural minor scale (Aeolian mode)
   */
  static minor(root: NoteName): Scale {
    return new Scale(root, ['1', '2', 'b3', '4', '5', 'b6', 'b7'], 'Natural Minor');
  }

  /**
   * Create a pentatonic major scale
   */
  static pentatonicMajor(root: NoteName): Scale {
    return new Scale(root, ['1', '2', '3', '5', '6'], 'Pentatonic Major');
  }

  /**
   * Create a pentatonic minor scale
   */
  static pentatonicMinor(root: NoteName): Scale {
    return new Scale(root, ['1', 'b3', '4', '5', 'b7'], 'Pentatonic Minor');
  }

  /**
   * Create a blues scale
   */
  static blues(root: NoteName): Scale {
    return new Scale(root, ['1', 'b3', '4', '#4', '5', 'b7'], 'Blues');
  }
}
