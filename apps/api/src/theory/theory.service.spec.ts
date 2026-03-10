// ============================================================================
// THEORY SERVICE TESTS
// ============================================================================
//
// Tests unitaires pour TheoryService
// Couvre: analyzeProgression, getCircleOfFifths, getKeyInfo (getAllKeys)
// ============================================================================
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TheoryService } from './theory.service';
import { prisma } from '@adagio/database';

// Mock Prisma
jest.mock('@adagio/database', () => ({
  prisma: {
    mode: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    scale: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    chord: {
      findMany: jest.fn(),
    },
    axisGroup: {
      findMany: jest.fn(),
    },
    harmonyRule: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    technique: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

describe('TheoryService', () => {
  let service: TheoryService;

  // Mock data
  const mockMode = {
    id: 'mode-1',
    slug: 'ionian',
    name: 'Ionien',
    intervals: JSON.stringify(['1', '2', '3', '4', '5', '6', '7']),
    character: 'bright, happy',
    sensation: 'joyful',
    feeling: 'uplifting',
    greekName: 'Ionian',
    relativeTo: 'major',
    axisGroup: '1',
    advice: 'Use for happy, resolved melodies',
  };

  const mockScale = {
    id: 'scale-1',
    slug: 'major',
    name: 'Major Scale',
    root: 'C',
    intervals: JSON.stringify(['1', '2', '3', '4', '5', '6', '7']),
    type: 'diatonic',
    quality: 'major',
  };

  const mockChord = {
    id: 'chord-1',
    name: 'Cmaj7',
    root: 'C',
    quality: 'maj7',
    intervals: JSON.stringify(['1', '3', '5', '7']),
    extensions: JSON.stringify(['9', '11', '13']),
    fingerings: JSON.stringify(['x32000']),
    tension: 0,
  };

  const mockHarmonyRule = {
    degree: 'I',
    tonality: 'major',
    sensation: 'Stable, resolved',
    advice: 'Tonic chord - home base',
  };

  const mockTechnique = {
    id: 'tech-1',
    slug: 'hammer-on',
    name: 'Hammer-on',
    category: 'left-hand',
    difficulty: 'beginner',
    description: 'Sound a note by hammering a finger onto the fretboard',
    diagramUrl: null,
    videoUrl: null,
    audioExample: null,
    notation: 'H',
    tips: JSON.stringify(['Keep fingers close to fretboard', 'Use quick, precise motion']),
    prerequisites: JSON.stringify([]),
    relatedTechniques: JSON.stringify(['pull-off', 'trill']),
    estimatedPracticeTime: '1-2 weeks',
    milestones: JSON.stringify(['Clean execution at 60 BPM', 'Smooth transitions']),
  };

  const mockAxisGroup = {
    id: 'axis-1',
    name: 'Axis Group 1',
    notes: JSON.stringify(['C', 'E', 'G#']),
    description: 'Major chord tones',
    substitutions: JSON.stringify(['Am', 'F#m']),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TheoryService],
    }).compile();

    service = module.get<TheoryService>(TheoryService);

    // Reset mocks
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('getAllKeys', () => {
    it('should return all 12 musical keys', () => {
      const result = service.getAllKeys();

      expect(result).toHaveLength(12);
      expect(result[0]).toEqual({ name: 'C' });
      expect(result[1]).toEqual({ name: 'C#' });
      expect(result[11]).toEqual({ name: 'B' });
    });

    it('should return keys in chromatic order starting from C', () => {
      const result = service.getAllKeys();
      const expectedNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

      result.forEach((key, index) => {
        expect(key.name).toBe(expectedNotes[index]);
      });
    });
  });

  describe('getCircleOfFifths', () => {
    it('should return circle of fifths with C as default center', () => {
      const result = service.getCircleOfFifths();

      expect(result).toHaveProperty('center', 'C');
      expect(result).toHaveProperty('circle');
      expect(result).toHaveProperty('enharmonics');
      expect(result.circle).toHaveLength(12);
    });

    it('should return circle starting with center note', () => {
      const result = service.getCircleOfFifths('C');

      expect(result.circle[0]).toEqual({ note: 'C', interval: 0 });
      expect(result.circle[1]).toEqual({ note: 'G', interval: 7 });
      expect(result.circle[2]).toEqual({ note: 'D', interval: 2 });
    });

    it('should return circle with different center note', () => {
      const result = service.getCircleOfFifths('G');

      expect(result.center).toBe('G');
      expect(result.circle[0]).toEqual({ note: 'G', interval: 0 });
      expect(result.circle[1]).toEqual({ note: 'D', interval: 7 });
    });

    it('should include enharmonic equivalents', () => {
      const result = service.getCircleOfFifths();

      expect(result.enharmonics).toEqual({
        'C#': 'Db',
        'D#': 'Eb',
        'F#': 'Gb',
        'G#': 'Ab',
        'A#': 'Bb',
      });
    });

    it('should calculate correct intervals for perfect fifths', () => {
      const result = service.getCircleOfFifths('C');

      // Perfect fifth = 7 semitones
      expect(result.circle[1].interval).toBe(7); // C to G
      expect(result.circle[2].interval).toBe(2); // G to D (14 % 12 = 2)
      // After 7 steps, interval is (7 * 7) % 12 = 49 % 12 = 1
      expect(result.circle[7].interval).toBe(1); // After 7 fifths
    });

    it('should handle invalid center notes gracefully', () => {
      const result = service.getCircleOfFifths('H');

      // Should still return a result, even with invalid note
      expect(result).toHaveProperty('center', 'H');
      expect(result).toHaveProperty('circle');
      expect(result.circle).toHaveLength(12);
    });
  });

  describe('analyzeProgression', () => {
    it('should analyze chord progression successfully', async () => {
      const dto = {
        key: 'C',
        chords: [
          { degree: 'I', quality: 'maj7', beats: 4 },
          { degree: 'IV', quality: 'maj7', beats: 4 },
          { degree: 'V', quality: '7', beats: 4 },
          { degree: 'I', quality: 'maj7', beats: 4 },
        ],
      };

      (prisma.harmonyRule.findUnique as jest.Mock)
        .mockResolvedValueOnce(mockHarmonyRule)
        .mockResolvedValueOnce({ ...mockHarmonyRule, degree: 'IV', sensation: 'Expansive', advice: 'Pre-dominant' })
        .mockResolvedValueOnce({ ...mockHarmonyRule, degree: 'V', sensation: 'Tense', advice: 'Dominant' });

      const result = await service.analyzeProgression(dto);

      expect(result).toHaveProperty('key', 'C');
      expect(result).toHaveProperty('analysis');
      expect(result).toHaveProperty('overallFeeling');
      expect(result.analysis).toHaveLength(4);
    });

    it('should return chord analysis with scale, feeling, tension, and advice', async () => {
      const dto = {
        key: 'C',
        chords: [
          { degree: 'I', quality: 'maj7', beats: 4 },
        ],
      };

      (prisma.harmonyRule.findUnique as jest.Mock).mockResolvedValue(mockHarmonyRule);

      const result = await service.analyzeProgression(dto);

      expect(result.analysis[0]).toHaveProperty('chord');
      expect(result.analysis[0]).toHaveProperty('scale');
      expect(result.analysis[0]).toHaveProperty('feeling');
      expect(result.analysis[0]).toHaveProperty('tension');
      expect(result.analysis[0]).toHaveProperty('advice');
      expect(result.analysis[0].scale).toContain('Ionien');
    });

    it('should calculate overall feeling based on tension', async () => {
      const dto = {
        key: 'C',
        chords: [
          { degree: 'I', quality: 'maj7', beats: 4 },
          { degree: 'V', quality: '7', beats: 4 },
        ],
      };

      (prisma.harmonyRule.findUnique as jest.Mock)
        .mockResolvedValueOnce({ ...mockHarmonyRule, sensation: 'Stable' })
        .mockResolvedValueOnce({ ...mockHarmonyRule, degree: 'V', sensation: 'Tense' });

      const result = await service.analyzeProgression(dto);

      expect(result).toHaveProperty('overallFeeling');
      expect(['Stable, résolu', 'Tense, dramatique', 'Équilibré']).toContain(result.overallFeeling);
    });

    it('should return "Équilibré" when tension is balanced', async () => {
      const dto = {
        key: 'C',
        chords: [
          { degree: 'I', quality: 'maj7', beats: 4 },
          { degree: 'V', quality: '7', beats: 4 },
        ],
      };

      (prisma.harmonyRule.findUnique as jest.Mock).mockResolvedValue(mockHarmonyRule);

      const result = await service.analyzeProgression(dto);

      expect(result.overallFeeling).toBe('Équilibré');
    });

    it('should return "Tense, dramatique" when tense chords dominate', async () => {
      const dto = {
        key: 'C',
        chords: [
          { degree: 'V', quality: '7', beats: 4 },
          { degree: 'vii°', quality: 'dim7', beats: 4 },
          { degree: 'I', quality: 'maj7', beats: 4 },
        ],
      };

      (prisma.harmonyRule.findUnique as jest.Mock).mockResolvedValue(mockHarmonyRule);

      const result = await service.analyzeProgression(dto);

      expect(result.overallFeeling).toBe('Tense, dramatique');
    });

    it('should return "Stable, résolu" when stable chords dominate', async () => {
      const dto = {
        key: 'C',
        chords: [
          { degree: 'I', quality: 'maj7', beats: 4 },
          { degree: 'vi', quality: 'm7', beats: 4 },
          { degree: 'I', quality: 'maj7', beats: 4 },
        ],
      };

      (prisma.harmonyRule.findUnique as jest.Mock).mockResolvedValue(mockHarmonyRule);

      const result = await service.analyzeProgression(dto);

      expect(result.overallFeeling).toBe('Stable, résolu');
    });

    it('should map degrees to suggested modes correctly', async () => {
      const dto = {
        key: 'C',
        chords: [
          { degree: 'ii', quality: 'm7', beats: 4 },
        ],
      };

      (prisma.harmonyRule.findUnique as jest.Mock).mockResolvedValue(mockHarmonyRule);

      const result = await service.analyzeProgression(dto);

      expect(result.analysis[0].scale).toContain('Dorien');
    });

    it('should assign correct tension levels to degrees', async () => {
      const testCases = [
        { degree: 'I', expected: 'stable' },
        { degree: 'V', expected: 'tense' },
        { degree: 'vii°', expected: 'tense' },
        { degree: 'vi', expected: 'stable' },
        { degree: 'ii', expected: 'restless' },
      ];

      for (const testCase of testCases) {
        const dto = {
          key: 'C',
          chords: [{ degree: testCase.degree, quality: '7', beats: 4 }],
        };

        (prisma.harmonyRule.findUnique as jest.Mock).mockResolvedValue(mockHarmonyRule);

        const result = await service.analyzeProgression(dto);
        expect(result.analysis[0].tension).toBe(testCase.expected);
      }
    });

    it('should default to Ionien for unknown degrees', async () => {
      const dto = {
        key: 'C',
        chords: [{ degree: 'unknown', quality: '7', beats: 4 }],
      };

      (prisma.harmonyRule.findUnique as jest.Mock).mockResolvedValue(mockHarmonyRule);

      const result = await service.analyzeProgression(dto);

      expect(result.analysis[0].scale).toContain('Ionien');
    });

    it('should handle empty chords array', async () => {
      const dto = {
        key: 'C',
        chords: [],
      };

      const result = await service.analyzeProgression(dto);

      expect(result.analysis).toHaveLength(0);
      // Empty array means 0 tense, 0 stable = "Équilibré"
      expect(result.overallFeeling).toBe('Équilibré');
    });

    it('should handle chords without optional quality field', async () => {
      const dto = {
        key: 'C',
        chords: [{ degree: 'I', beats: 4 }],
      };

      (prisma.harmonyRule.findUnique as jest.Mock).mockResolvedValue(mockHarmonyRule);

      const result = await service.analyzeProgression(dto);

      expect(result.analysis[0].chord).toEqual({ degree: 'I', beats: 4 });
    });
  });

  describe('getModes', () => {
    it('should return all modes without filter', async () => {
      (prisma.mode.findMany as jest.Mock).mockResolvedValue([mockMode]);

      const result = await service.getModes();

      expect(result).toHaveLength(1);
      expect(prisma.mode.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { name: 'asc' },
      });
    });

    it('should filter modes by feeling', async () => {
      (prisma.mode.findMany as jest.Mock).mockResolvedValue([mockMode]);

      await service.getModes('happy');

      expect(prisma.mode.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { character: { contains: 'happy', mode: 'insensitive' } },
            { sensation: { contains: 'happy', mode: 'insensitive' } },
            { feeling: { contains: 'happy', mode: 'insensitive' } },
          ],
        },
        orderBy: { name: 'asc' },
      });
    });

    it('should parse intervals JSON field correctly', async () => {
      const modeWithJsonIntervals = {
        ...mockMode,
        intervals: JSON.stringify(['1', '2', '3', '4', '5', '6', '7']),
      };

      (prisma.mode.findMany as jest.Mock).mockResolvedValue([modeWithJsonIntervals]);

      const result = await service.getModes();

      expect(result[0].intervals).toEqual(['1', '2', '3', '4', '5', '6', '7']);
    });

    it('should handle intervals as array when already parsed', async () => {
      const modeWithArrayIntervals = {
        ...mockMode,
        intervals: ['1', '2', '3', '4', '5', '6', '7'] as unknown as string,
      };

      (prisma.mode.findMany as jest.Mock).mockResolvedValue([modeWithArrayIntervals]);

      const result = await service.getModes();

      expect(result[0].intervals).toEqual(['1', '2', '3', '4', '5', '6', '7']);
    });
  });

  describe('getModeBySlug', () => {
    it('should return mode by slug', async () => {
      (prisma.mode.findUnique as jest.Mock).mockResolvedValue(mockMode);

      const result = await service.getModeBySlug('ionian');

      expect(result).toEqual({
        id: mockMode.id,
        slug: mockMode.slug,
        name: mockMode.name,
        intervals: ['1', '2', '3', '4', '5', '6', '7'],
        character: mockMode.character,
        sensation: mockMode.sensation,
        feeling: mockMode.feeling,
        greekName: mockMode.greekName,
        relativeTo: mockMode.relativeTo,
        axisGroup: mockMode.axisGroup,
        advice: mockMode.advice,
      });

      expect(prisma.mode.findUnique).toHaveBeenCalledWith({
        where: { slug: 'ionian' },
      });
    });

    it('should throw NotFoundException if mode not found', async () => {
      (prisma.mode.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.getModeBySlug('nonexistent')).rejects.toThrow(
        new NotFoundException('Mode nonexistent not found')
      );
    });
  });

  describe('getModesForKey', () => {
    it('should return modes with calculated notes for key', async () => {
      (prisma.mode.findMany as jest.Mock).mockResolvedValue([mockMode]);

      const result = await service.getModesForKey('C');

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('notes');
      expect(Array.isArray(result[0].notes)).toBe(true);
    });

    it('should calculate correct notes for C major scale', async () => {
      const cMajorMode = {
        ...mockMode,
        intervals: JSON.stringify(['1', '2', '3', '4', '5', '6', '7']),
      };

      (prisma.mode.findMany as jest.Mock).mockResolvedValue([cMajorMode]);

      const result = await service.getModesForKey('C');

      expect(result[0].notes).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
    });

    it('should calculate correct notes for D major scale', async () => {
      const dMajorMode = {
        ...mockMode,
        intervals: JSON.stringify(['1', '2', '3', '4', '5', '6', '7']),
      };

      (prisma.mode.findMany as jest.Mock).mockResolvedValue([dMajorMode]);

      const result = await service.getModesForKey('D');

      expect(result[0].notes).toEqual(['D', 'E', 'F#', 'G', 'A', 'B', 'C#']);
    });
  });

  describe('getScales', () => {
    it('should return all scales', async () => {
      (prisma.scale.findMany as jest.Mock).mockResolvedValue([mockScale]);

      const result = await service.getScales();

      expect(result).toHaveLength(1);
      expect(prisma.scale.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
      });
    });

    it('should parse intervals JSON field correctly', async () => {
      (prisma.scale.findMany as jest.Mock).mockResolvedValue([mockScale]);

      const result = await service.getScales();

      expect(result[0].intervals).toEqual(['1', '2', '3', '4', '5', '6', '7']);
    });
  });

  describe('getScaleBySlug', () => {
    it('should return scale by slug', async () => {
      (prisma.scale.findUnique as jest.Mock).mockResolvedValue(mockScale);

      const result = await service.getScaleBySlug('major');

      expect(result).toEqual({
        id: mockScale.id,
        slug: mockScale.slug,
        name: mockScale.name,
        root: mockScale.root,
        intervals: ['1', '2', '3', '4', '5', '6', '7'],
        type: mockScale.type,
        quality: mockScale.quality,
      });
    });

    it('should throw NotFoundException if scale not found', async () => {
      (prisma.scale.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.getScaleBySlug('nonexistent')).rejects.toThrow(
        new NotFoundException('Scale nonexistent not found')
      );
    });
  });

  describe('getChords', () => {
    it('should return all chords without filters', async () => {
      (prisma.chord.findMany as jest.Mock).mockResolvedValue([mockChord]);

      const result = await service.getChords();

      expect(result).toHaveLength(1);
      expect(prisma.chord.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: [{ root: 'asc' }, { quality: 'asc' }],
      });
    });

    it('should filter chords by root', async () => {
      (prisma.chord.findMany as jest.Mock).mockResolvedValue([mockChord]);

      await service.getChords('C');

      expect(prisma.chord.findMany).toHaveBeenCalledWith({
        where: { root: 'C' },
        orderBy: [{ root: 'asc' }, { quality: 'asc' }],
      });
    });

    it('should filter chords by quality', async () => {
      (prisma.chord.findMany as jest.Mock).mockResolvedValue([mockChord]);

      await service.getChords(undefined, 'maj7');

      expect(prisma.chord.findMany).toHaveBeenCalledWith({
        where: { quality: 'maj7' },
        orderBy: [{ root: 'asc' }, { quality: 'asc' }],
      });
    });

    it('should filter chords by both root and quality', async () => {
      (prisma.chord.findMany as jest.Mock).mockResolvedValue([mockChord]);

      await service.getChords('C', 'maj7');

      expect(prisma.chord.findMany).toHaveBeenCalledWith({
        where: { root: 'C', quality: 'maj7' },
        orderBy: [{ root: 'asc' }, { quality: 'asc' }],
      });
    });

    it('should parse intervals and extensions JSON fields', async () => {
      (prisma.chord.findMany as jest.Mock).mockResolvedValue([mockChord]);

      const result = await service.getChords();

      expect(result[0].intervals).toEqual(['1', '3', '5', '7']);
      expect(result[0].extensions).toEqual(['9', '11', '13']);
    });

    it('should handle null extensions field', async () => {
      const chordWithoutExtensions = {
        ...mockChord,
        extensions: null,
      };

      (prisma.chord.findMany as jest.Mock).mockResolvedValue([chordWithoutExtensions]);

      const result = await service.getChords();

      expect(result[0].extensions).toBeUndefined();
    });
  });

  describe('getAxisTheory', () => {
    it('should return all axis groups', async () => {
      (prisma.axisGroup.findMany as jest.Mock).mockResolvedValue([mockAxisGroup]);

      const result = await service.getAxisTheory();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        name: mockAxisGroup.name,
        notes: ['C', 'E', 'G#'],
        description: mockAxisGroup.description,
        substitutions: ['Am', 'F#m'],
      });
    });

    it('should parse notes JSON field', async () => {
      (prisma.axisGroup.findMany as jest.Mock).mockResolvedValue([mockAxisGroup]);

      const result = await service.getAxisTheory();

      expect(result[0].notes).toEqual(['C', 'E', 'G#']);
    });

    it('should parse substitutions JSON field', async () => {
      (prisma.axisGroup.findMany as jest.Mock).mockResolvedValue([mockAxisGroup]);

      const result = await service.getAxisTheory();

      expect(result[0].substitutions).toEqual(['Am', 'F#m']);
    });
  });

  describe('getHarmonyRules', () => {
    it('should return all harmony rules without filter', async () => {
      (prisma.harmonyRule.findMany as jest.Mock).mockResolvedValue([mockHarmonyRule]);

      const result = await service.getHarmonyRules();

      expect(result).toHaveLength(1);
      expect(prisma.harmonyRule.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: [{ tonality: 'asc' }, { degree: 'asc' }],
      });
    });

    it('should filter harmony rules by tonality', async () => {
      (prisma.harmonyRule.findMany as jest.Mock).mockResolvedValue([mockHarmonyRule]);

      await service.getHarmonyRules('major');

      expect(prisma.harmonyRule.findMany).toHaveBeenCalledWith({
        where: { tonality: 'major' },
        orderBy: [{ tonality: 'asc' }, { degree: 'asc' }],
      });
    });
  });

  describe('getHarmonyRuleByDegree', () => {
    it('should return harmony rule by degree and tonality', async () => {
      (prisma.harmonyRule.findUnique as jest.Mock).mockResolvedValue(mockHarmonyRule);

      const result = await service.getHarmonyRuleByDegree('I', 'major');

      expect(result).toEqual({
        degree: mockHarmonyRule.degree,
        tonality: mockHarmonyRule.tonality,
        sensation: mockHarmonyRule.sensation,
        advice: mockHarmonyRule.advice,
      });

      expect(prisma.harmonyRule.findUnique).toHaveBeenCalledWith({
        where: { degree_tonality: { degree: 'I', tonality: 'major' } },
      });
    });

    it('should default tonality to major', async () => {
      (prisma.harmonyRule.findUnique as jest.Mock).mockResolvedValue(mockHarmonyRule);

      await service.getHarmonyRuleByDegree('I');

      expect(prisma.harmonyRule.findUnique).toHaveBeenCalledWith({
        where: { degree_tonality: { degree: 'I', tonality: 'major' } },
      });
    });

    it('should throw NotFoundException if rule not found', async () => {
      (prisma.harmonyRule.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.getHarmonyRuleByDegree('IX', 'major')).rejects.toThrow(
        new NotFoundException('Harmony rule for IX in major not found')
      );
    });
  });

  describe('getTechniques', () => {
    it('should return all techniques without filters', async () => {
      (prisma.technique.findMany as jest.Mock).mockResolvedValue([mockTechnique]);

      const result = await service.getTechniques();

      expect(result).toHaveLength(1);
      expect(prisma.technique.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: [{ difficulty: 'asc' }, { name: 'asc' }],
      });
    });

    it('should filter techniques by category', async () => {
      (prisma.technique.findMany as jest.Mock).mockResolvedValue([mockTechnique]);

      await service.getTechniques('left-hand');

      expect(prisma.technique.findMany).toHaveBeenCalledWith({
        where: { category: 'left-hand' },
        orderBy: [{ difficulty: 'asc' }, { name: 'asc' }],
      });
    });

    it('should filter techniques by difficulty', async () => {
      (prisma.technique.findMany as jest.Mock).mockResolvedValue([mockTechnique]);

      await service.getTechniques(undefined, 'beginner');

      expect(prisma.technique.findMany).toHaveBeenCalledWith({
        where: { difficulty: 'beginner' },
        orderBy: [{ difficulty: 'asc' }, { name: 'asc' }],
      });
    });

    it('should filter techniques by both category and difficulty', async () => {
      (prisma.technique.findMany as jest.Mock).mockResolvedValue([mockTechnique]);

      await service.getTechniques('left-hand', 'beginner');

      expect(prisma.technique.findMany).toHaveBeenCalledWith({
        where: { category: 'left-hand', difficulty: 'beginner' },
        orderBy: [{ difficulty: 'asc' }, { name: 'asc' }],
      });
    });

    it('should parse JSON fields correctly', async () => {
      (prisma.technique.findMany as jest.Mock).mockResolvedValue([mockTechnique]);

      const result = await service.getTechniques();

      expect(result[0].tips).toEqual(['Keep fingers close to fretboard', 'Use quick, precise motion']);
      expect(result[0].prerequisites).toEqual([]);
      expect(result[0].relatedTechniques).toEqual(['pull-off', 'trill']);
      expect(result[0].milestones).toEqual(['Clean execution at 60 BPM', 'Smooth transitions']);
    });
  });

  describe('getTechniqueBySlug', () => {
    it('should return technique by slug', async () => {
      (prisma.technique.findUnique as jest.Mock).mockResolvedValue(mockTechnique);

      const result = await service.getTechniqueBySlug('hammer-on');

      expect(result).toEqual({
        id: mockTechnique.id,
        slug: mockTechnique.slug,
        name: mockTechnique.name,
        category: mockTechnique.category,
        difficulty: mockTechnique.difficulty,
        description: mockTechnique.description,
        diagramUrl: mockTechnique.diagramUrl,
        videoUrl: mockTechnique.videoUrl,
        audioExample: mockTechnique.audioExample,
        notation: mockTechnique.notation,
        tips: ['Keep fingers close to fretboard', 'Use quick, precise motion'],
        prerequisites: [],
        relatedTechniques: ['pull-off', 'trill'],
        estimatedPracticeTime: mockTechnique.estimatedPracticeTime,
        milestones: ['Clean execution at 60 BPM', 'Smooth transitions'],
      });
    });

    it('should throw NotFoundException if technique not found', async () => {
      (prisma.technique.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.getTechniqueBySlug('nonexistent')).rejects.toThrow(
        new NotFoundException('Technique nonexistent not found')
      );
    });
  });
});
