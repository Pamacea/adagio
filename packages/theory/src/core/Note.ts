// ============================================================================
// NOTE - Musical note class
// ============================================================================

import type { NoteName } from '@adagio/types';

export class Note {
  constructor(
    public readonly name: NoteName,
    public readonly octave: number
  ) {}

  /**
   * Get the MIDI note number (C4 = 60)
   */
  get midi(): number {
    const noteIndices: Record<NoteName, number> = {
      'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
      'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8,
      'A': 9, 'A#': 10, 'Bb': 10, 'B': 11,
    };

    return this.octave * 12 + noteIndices[this.name];
  }

  /**
   * Get frequency in Hz (A4 = 440Hz)
   */
  frequency(a4 = 440): number {
    // A4 is MIDI note 69
    const a4Midi = 69;
    const semitones = this.midi() - a4Midi;
    return a4 * Math.pow(2, semitones / 12);
  }

  /**
   * Transpose by semitones
   */
  transpose(semitones: number): Note {
    const NOTES: NoteName[] = [
      'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
    ];

    const currentMidi = this.midi();
    const newMidi = currentMidi + semitones;
    const newOctave = Math.floor(newMidi / 12);
    const newNoteIndex = ((newMidi % 12) + 12) % 12; // Handle negative values

    return new Note(NOTES[newNoteIndex], newOctave);
  }

  /**
   * Get enharmonic equivalent (e.g., C# → Db)
   */
  getEnharmonic(): Note | null {
    const enharmonics: Record<string, NoteName> = {
      'C#': 'Db',
      'Db': 'C#',
      'D#': 'Eb',
      'Eb': 'D#',
      'F#': 'Gb',
      'Gb': 'F#',
      'G#': 'Ab',
      'Ab': 'G#',
      'A#': 'Bb',
      'Bb': 'A#',
    };

    const enharmonicName = enharmonics[this.name];
    return enharmonicName ? new Note(enharmonicName, this.octave) : null;
  }

  /**
   * Check if two notes are equal (including enharmonic)
   */
  equals(other: Note): boolean {
    if (this.name === other.name && this.octave === other.octave) {
      return true;
    }

    const enharmonic = this.getEnharmonic();
    return enharmonic !== null && enharmonic.name === other.name && enharmonic.octave === other.octave;
  }

  /**
   * String representation
   */
  toString(): string {
    return `${this.name}${this.octave}`;
  }

  /**
   * Create a Note from MIDI number
   */
  static fromMidi(midi: number): Note {
    const NOTES: NoteName[] = [
      'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
    ];

    const octave = Math.floor(midi / 12);
    const noteIndex = midi % 12;

    return new Note(NOTES[noteIndex], octave);
  }
}
