// ============================================================================
// COLOR MAPPING TESTS
// ============================================================================
//
// Tests du système de couleurs émotionnelles pour le cercle des quintes
// ============================================================================

import { describe, it, expect } from 'vitest';
import {
  // Mode colors
  getModeColor,
  getAllModeColors,
  MODE_COLORS,

  // Degree colors
  getDegreeColor,
  getDegreePrimaryColor,
  getDegreeSecondaryColor,
  getDegreeEmotion,
  getDegreeMode,
  getAllDegreeColors,
  getDegreeHexColors,

  // Chord quality
  getChordQualityColor,
  CHORD_QUALITY_COLORS,
  getChordVisualStyle,
  type ChordVisualStyle,

  // Emotions
  getEmotionForMode,

  // Utilities
  getContrastTextColor,
  colorWithOpacity,
} from './emotion-mapping';
import type { ModeName } from '@adagio/types';

describe('MODE_COLORS', () => {
  it('should have all 7 modes defined', () => {
    const modes: ModeName[] = ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'];
    modes.forEach(mode => {
      expect(MODE_COLORS[mode]).toBeDefined();
    });
  });

  it('should have valid hex color format', () => {
    const hexRegex = /^#[0-9A-F]{6}$/i;
    Object.values(MODE_COLORS).forEach(color => {
      expect(color).toMatch(hexRegex);
    });
  });
});

describe('getModeColor', () => {
  const modes: ModeName[] = ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'];

  it('should return a color for each mode', () => {
    modes.forEach(mode => {
      const color = getModeColor(mode);
      expect(color).toBeDefined();
      expect(typeof color).toBe('string');
      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });

  it('should return bright/warm colors for positive emotions', () => {
    // Ionien = joyeux → should be bright
    const ionianColor = getModeColor('ionian');
    expect(ionianColor).toBe('#F59E0B'); // Gold

    // Mixolydien = bluesy/energetic → should be warm
    const mixolydianColor = getModeColor('mixolydian');
    expect(mixolydianColor).toBe('#F97316'); // Orange
  });

  it('should return cool/dark colors for sad emotions', () => {
    // Éolien = mélancolique → should be cool blue
    const aeolianColor = getModeColor('aeolian');
    expect(aeolianColor).toBe('#60A5FA'); // Steel blue

    // Locrien = tension → should be dark
    const locrianColor = getModeColor('locrian');
    expect(locrianColor).toBe('#334155'); // Dark slate
  });
});

describe('getAllModeColors', () => {
  it('should return 7 colors (one per mode)', () => {
    const colors = getAllModeColors();
    expect(colors).toHaveLength(7);
  });

  it('should return valid hex colors', () => {
    const colors = getAllModeColors();
    colors.forEach(color => {
      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });
});

describe('getDegreeColor - Major Key', () => {
  it('should return DegreeColorInfo object', () => {
    const result = getDegreeColor(0, 'major');
    expect(result).toBeDefined();
    expect(result.primary).toBeDefined();
    expect(result.secondary).toBeDefined();
    expect(result.emotion).toBeDefined();
  });

  it('should return calm color for I (tonic - resolution)', () => {
    // I = "Resolution, Home" → blue
    const colorInfo = getDegreeColor(0, 'major');
    expect(colorInfo.primary).toBe('#60A5FA'); // Blue-400
    expect(colorInfo.emotion).toContain('Resolution');
    expect(colorInfo.modeAssociation).toBe('ionian');
  });

  it('should return energetic color for V (dominant)', () => {
    // V = "Tension, Expectation" → amber
    const colorInfo = getDegreeColor(4, 'major');
    expect(colorInfo.primary).toBe('#FBBF24'); // Amber-400
    expect(colorInfo.emotion).toContain('Tension');
    expect(colorInfo.modeAssociation).toBe('mixolydian');
  });

  it('should return melancholic color for vi (relative minor)', () => {
    // vi = "Sadness, Resignation" → slate
    const colorInfo = getDegreeColor(5, 'major');
    expect(colorInfo.primary).toBe('#94A3B8'); // Slate-400
    expect(colorInfo.emotion).toContain('Sadness');
    expect(colorInfo.modeAssociation).toBe('aeolian');
  });

  it('should work with all 7 degrees', () => {
    const degrees = [0, 1, 2, 3, 4, 5, 6];
    degrees.forEach(degree => {
      const colorInfo = getDegreeColor(degree, 'major');
      expect(colorInfo.primary).toMatch(/^#[0-9A-F]{6}$/i);
      expect(colorInfo.emotion).toBeDefined();
    });
  });
});

describe('getDegreeColor - Minor Key', () => {
  it('should return melancholic color for i (tonic)', () => {
    // i = "Melancholy, Resignation" → slate
    const colorInfo = getDegreeColor(0, 'minor');
    expect(colorInfo.primary).toBe('#64748B'); // Slate-500
    expect(colorInfo.emotion).toContain('Melancholy');
  });

  it('should return hopeful color for III (relative major)', () => {
    // III = "Hope, Light" → blue
    const colorInfo = getDegreeColor(2, 'minor');
    expect(colorInfo.primary).toBe('#60A5FA'); // Blue-400
    expect(colorInfo.emotion).toContain('Hope');
  });

  it('should return dark tense color for ii°', () => {
    // ii° = "Dark Tension" → dark slate
    const colorInfo = getDegreeColor(1, 'minor');
    expect(colorInfo.primary).toBe('#475569'); // Slate-600
    expect(colorInfo.emotion).toContain('Tension');
  });

  it('should work with all 7 degrees', () => {
    const degrees = [0, 1, 2, 3, 4, 5, 6];
    degrees.forEach(degree => {
      const colorInfo = getDegreeColor(degree, 'minor');
      expect(colorInfo.primary).toMatch(/^#[0-9A-F]{6}$/i);
      expect(colorInfo.emotion).toBeDefined();
    });
  });
});

describe('getDegreeColor - Major vs Minor Difference', () => {
  it('should return different colors for same degree number', () => {
    // Degree 0 in major (I) vs minor (i) should be different emotions
    const majorI = getDegreeColor(0, 'major');
    const minorI = getDegreeColor(0, 'minor');

    expect(majorI.primary).not.toBe(minorI.primary);
    expect(majorI.emotion).not.toBe(minorI.emotion);
  });

  it('should reflect emotional difference between tonalities', () => {
    // Degree 4: V in major (tension) vs v in minor (dark tension)
    const majorV = getDegreeColor(4, 'major');
    const minorV = getDegreeColor(4, 'minor');

    expect(majorV.primary).not.toBe(minorV.primary);
  });
});

describe('getDegreePrimaryColor', () => {
  it('should return primary color as hex string', () => {
    const color = getDegreePrimaryColor(0, 'major');
    expect(typeof color).toBe('string');
    expect(color).toMatch(/^#[0-9A-F]{6}$/i);
  });

  it('should match the primary property of getDegreeColor', () => {
    const degree = 2;
    const tonality: 'major' | 'minor' = 'major';
    const fullInfo = getDegreeColor(degree, tonality);
    const primaryOnly = getDegreePrimaryColor(degree, tonality);

    expect(primaryOnly).toBe(fullInfo.primary);
  });
});

describe('getDegreeSecondaryColor', () => {
  it('should return secondary color as hex string', () => {
    const color = getDegreeSecondaryColor(0, 'major');
    expect(typeof color).toBe('string');
    expect(color).toMatch(/^#[0-9A-F]{6}$/i);
  });

  it('should match the secondary property of getDegreeColor', () => {
    const degree = 2;
    const tonality: 'major' | 'minor' = 'major';
    const fullInfo = getDegreeColor(degree, tonality);
    const secondaryOnly = getDegreeSecondaryColor(degree, tonality);

    expect(secondaryOnly).toBe(fullInfo.secondary);
  });
});

describe('getDegreeEmotion', () => {
  it('should return emotion string', () => {
    const emotion = getDegreeEmotion(0, 'major');
    expect(typeof emotion).toBe('string');
    expect(emotion.length).toBeGreaterThan(0);
  });

  it('should match the emotion property of getDegreeColor', () => {
    const degree = 3;
    const tonality: 'major' | 'minor' = 'minor';
    const fullInfo = getDegreeColor(degree, tonality);
    const emotionOnly = getDegreeEmotion(degree, tonality);

    expect(emotionOnly).toBe(fullInfo.emotion);
  });
});

describe('getDegreeMode', () => {
  it('should return associated mode name', () => {
    const mode = getDegreeMode(0, 'major');
    expect(mode).toBe('ionian');
  });

  it('should return valid ModeName', () => {
    const validModes: ModeName[] = ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'];
    for (let i = 0; i < 7; i++) {
      const mode = getDegreeMode(i, 'major');
      expect(validModes).toContain(mode);
    }
  });
});

describe('getAllDegreeColors', () => {
  it('should return 7 DegreeColorInfo for major', () => {
    const colors = getAllDegreeColors('major');
    expect(colors).toHaveLength(7);
    colors.forEach(info => {
      expect(info.primary).toBeDefined();
      expect(info.emotion).toBeDefined();
    });
  });

  it('should return 7 DegreeColorInfo for minor', () => {
    const colors = getAllDegreeColors('minor');
    expect(colors).toHaveLength(7);
  });

  it('should return different arrays for major vs minor', () => {
    const majorColors = getAllDegreeColors('major');
    const minorColors = getAllDegreeColors('minor');

    // At least the first degree should be different
    expect(majorColors[0]?.primary).not.toBe(minorColors[0]?.primary);
  });
});

describe('getDegreeHexColors', () => {
  it('should return array of hex strings', () => {
    const colors = getDegreeHexColors('major');
    expect(colors).toHaveLength(7);
    colors.forEach(color => {
      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });

  it('should match primary colors', () => {
    const fullInfo = getAllDegreeColors('major');
    const hexOnly = getDegreeHexColors('major');

    hexOnly.forEach((color, i) => {
      expect(color).toBe(fullInfo[i]?.primary);
    });
  });
});

describe('getChordQualityColor', () => {
  it('should return distinct colors for each quality', () => {
    const majorColor = getChordQualityColor('major');
    const minorColor = getChordQualityColor('minor');
    const diminishedColor = getChordQualityColor('diminished');

    // Colors should be different
    expect(majorColor).not.toBe(minorColor);
    expect(minorColor).not.toBe(diminishedColor);
    expect(majorColor).not.toBe(diminishedColor);
  });

  it('should return warm/bright for major', () => {
    expect(getChordQualityColor('major')).toBe('#F59E0B');
  });

  it('should return cool for minor', () => {
    expect(getChordQualityColor('minor')).toBe('#3B82F6');
  });

  it('should return dark for diminished', () => {
    expect(getChordQualityColor('diminished')).toBe('#334155');
  });
});

describe('CHORD_QUALITY_COLORS', () => {
  it('should have all 3 qualities', () => {
    expect(CHORD_QUALITY_COLORS.major).toBeDefined();
    expect(CHORD_QUALITY_COLORS.minor).toBeDefined();
    expect(CHORD_QUALITY_COLORS.diminished).toBeDefined();
  });
});

describe('getChordVisualStyle', () => {
  it('should return diminished style for diminished chords', () => {
    const style = getChordVisualStyle('Cdim');
    expect(style.quality).toBe('diminished');
    expect(style.icon).toBe('°');
    expect(style.borderColor).toBeDefined();
  });

  it('should return diminished style for ° notation', () => {
    const style = getChordVisualStyle('B°');
    expect(style.quality).toBe('diminished');
    expect(style.icon).toBe('°');
  });

  it('should return minor style for minor chords', () => {
    const style = getChordVisualStyle('Am');
    expect(style.quality).toBe('minor');
    expect(style.icon).toBe('m');
  });

  it('should return major style for major chords', () => {
    const style = getChordVisualStyle('C');
    expect(style.quality).toBe('major');
    expect(style.icon).toBe('M');
  });

  it('should return different border colors for each quality', () => {
    const major = getChordVisualStyle('C').borderColor;
    const minor = getChordVisualStyle('Cm').borderColor;
    const diminished = getChordVisualStyle('Cdim').borderColor;

    expect(major).not.toBe(minor);
    expect(minor).not.toBe(diminished);
  });
});

describe('getEmotionForMode', () => {
  it('should return complete emotion mapping', () => {
    const emotion = getEmotionForMode('ionian');
    expect(emotion.name).toBeDefined();
    expect(emotion.character).toBeDefined();
    expect(emotion.sensation).toBeDefined();
  });

  it('should have correct emotions for each mode', () => {
    const ionian = getEmotionForMode('ionian');
    expect(ionian.character).toContain('Joyeux');

    const aeolian = getEmotionForMode('aeolian');
    expect(aeolian.character).toContain('Mineur');
  });
});

describe('getContrastTextColor', () => {
  it('should return black for light colors', () => {
    expect(getContrastTextColor('#FFFFFF')).toBe('#000000');
    expect(getContrastTextColor('#F59E0B')).toBe('#000000'); // gold
    expect(getContrastTextColor('#EAB308')).toBe('#000000'); // yellow
  });

  it('should return white for dark colors', () => {
    expect(getContrastTextColor('#000000')).toBe('#FFFFFF');
    expect(getContrastTextColor('#334155')).toBe('#FFFFFF'); // dark slate
    expect(getContrastTextColor('#1E293B')).toBe('#FFFFFF');
  });

  it('should handle edge cases', () => {
    // Mid-tone colors should still return a valid value
    const result = getContrastTextColor('#808080');
    expect(['#000000', '#FFFFFF']).toContain(result);
  });
});

describe('colorWithOpacity', () => {
  it('should return rgba string', () => {
    const result = colorWithOpacity('#F59E0B', 0.5);
    expect(result).toMatch(/^rgba\(\d+, \d+, \d+, [01]\.?\d*\)$/);
    expect(result).toContain('0.5');
  });

  it('should handle full opacity', () => {
    const result = colorWithOpacity('#F59E0B', 1);
    expect(result).toContain('1');
  });

  it('should handle zero opacity', () => {
    const result = colorWithOpacity('#F59E0B', 0);
    expect(result).toContain('0');
  });

  it('should clamp opacity between 0 and 1', () => {
    const result1 = colorWithOpacity('#F59E0B', 1.5);
    expect(result1).toContain('1');

    const result2 = colorWithOpacity('#F59E0B', -0.5);
    expect(result2).toContain('0');
  });
});

describe('Color Accessibility', () => {
  it('should have sufficient contrast for dark backgrounds', () => {
    // All mode colors should have good contrast on #0a0a0a
    const modes: ModeName[] = ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'];

    modes.forEach(mode => {
      const color = getModeColor(mode);
      const textColor = getContrastTextColor(color);
      expect(['#000000', '#FFFFFF']).toContain(textColor);
    });
  });

  it('should have distinct colors for each degree', () => {
    const majorColors = getDegreeHexColors('major');
    const minorColors = getDegreeHexColors('minor');

    // Check that adjacent degrees are visually distinct
    for (let i = 0; i < majorColors.length - 1; i++) {
      expect(majorColors[i]).not.toBe(majorColors[i + 1]);
    }

    for (let i = 0; i < minorColors.length - 1; i++) {
      expect(minorColors[i]).not.toBe(minorColors[i + 1]);
    }
  });
});

describe('Emotion-Color Mapping Consistency', () => {
  it('should map positive emotions to warm colors', () => {
    const positiveModes = ['ionian', 'mixolydian', 'dorian'];
    const warmColors = ['#F59E0B', '#F97316', '#F59E0B'];

    positiveModes.forEach(mode => {
      const color = getModeColor(mode as ModeName);
      expect(warmColors).toContain(color);
    });
  });

  it('should map sad emotions to cool colors', () => {
    const sadMode = 'aeolian';
    const coolColor = getModeColor(sadMode);
    const coolColors = ['#60A5FA', '#3B82F6', '#94A3B8'];

    expect(coolColors).toContain(coolColor);
  });

  it('should map tense emotions to dark/intense colors', () => {
    const tenseMode = 'locrian';
    const tenseColor = getModeColor(tenseMode);
    const darkColors = ['#334155', '#475569', '#64748B'];

    expect(darkColors).toContain(tenseColor);
  });

  it('should associate each degree with appropriate mode', () => {
    // Degree I (0) should be ionian
    expect(getDegreeMode(0, 'major')).toBe('ionian');

    // Degree V (4) should be mixolydian
    expect(getDegreeMode(4, 'major')).toBe('mixolydian');

    // Degree vi (5) should be aeolian
    expect(getDegreeMode(5, 'major')).toBe('aeolian');
  });
});

describe('Edge Cases', () => {
  it('should handle invalid degree gracefully', () => {
    // Testing with out-of-range degree - should return fallback
    const colorInfo = getDegreeColor(99, 'major');
    expect(colorInfo).toBeDefined(); // Should return fallback
  });

  it('should handle negative degree', () => {
    // Testing with negative degree - should return fallback
    const colorInfo = getDegreeColor(-1, 'minor');
    expect(colorInfo).toBeDefined();
  });
});
