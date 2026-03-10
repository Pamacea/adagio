import { Injectable } from '@nestjs/common';
import type { ModeName } from '@adagio/types';
import {
  getModeColor,
  getEmotionForMode,
  getDegreeColor,
  getDegreeEmotion,
  getAllDegreeColors,
  getChordQualityColor,
  getChordVisualStyle,
} from '@adagio/theory';

const MODE_NAMES: ModeName[] = ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'];
const DEGREE_ROMAN = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'] as const;
const DEGREE_ROMAN_MINOR = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'] as const;

@Injectable()
export class ColorService {
  /**
   * Get all modes with their colors and emotional mappings
   */
  getAllModes() {
    return {
      modes: MODE_NAMES.map((mode) => {
        const emotion = getEmotionForMode(mode);
        const color = getModeColor(mode);
        return {
          name: mode,
          displayName: emotion.name,
          color,
          character: emotion.character,
          sensation: emotion.sensation,
          feeling: emotion.feeling,
        };
      }),
    };
  }

  /**
   * Get a specific mode with its color and emotional mapping
   */
  getMode(mode: string) {
    if (!this.isValidMode(mode)) {
      return null;
    }
    const emotion = getEmotionForMode(mode as ModeName);
    const color = getModeColor(mode as ModeName);
    return {
      name: mode,
      displayName: emotion.name,
      color,
      character: emotion.character,
      sensation: emotion.sensation,
      feeling: emotion.feeling,
    };
  }

  /**
   * Get all degree colors for a tonality
   */
  getDegrees(tonality: 'major' | 'minor' = 'major') {
    const allColors = getAllDegreeColors(tonality);
    const romanNumerals = tonality === 'major' ? DEGREE_ROMAN : DEGREE_ROMAN_MINOR;

    return {
      tonality,
      degrees: allColors.map((info, index) => ({
        degree: romanNumerals[index],
        degreeIndex: index,
        color: info.primary,
        secondary: info.secondary,
        emotion: info.emotion,
        modeAssociation: info.modeAssociation,
      })),
    };
  }

  /**
   * Get a specific degree color for a tonality
   */
  getDegree(degree: number, tonality: 'major' | 'minor' = 'major') {
    if (degree < 0 || degree > 6) {
      return null;
    }
    const colorInfo = getDegreeColor(degree, tonality);
    const romanNumerals = tonality === 'major' ? DEGREE_ROMAN : DEGREE_ROMAN_MINOR;

    return {
      tonality,
      degree: romanNumerals[degree],
      degreeIndex: degree,
      color: colorInfo.primary,
      secondary: colorInfo.secondary,
      emotion: colorInfo.emotion,
      modeAssociation: colorInfo.modeAssociation,
    };
  }

  /**
   * Get chord quality color and visual style
   */
  getChordQuality(quality: string) {
    if (!this.isValidChordQuality(quality)) {
      return null;
    }
    const color = getChordQualityColor(quality as 'major' | 'minor' | 'diminished');
    const visualStyle = getChordVisualStyle(quality);

    return {
      quality,
      color,
      visualStyle,
    };
  }

  private isValidMode(mode: string): mode is ModeName {
    return MODE_NAMES.includes(mode as ModeName);
  }

  private isValidChordQuality(quality: string): quality is 'major' | 'minor' | 'diminished' {
    return ['major', 'minor', 'diminished'].includes(quality);
  }
}
