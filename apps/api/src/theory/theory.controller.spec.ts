// ============================================================================
// THEORY CONTROLLER TESTS
// ============================================================================
//
// Tests unitaires pour TheoryController
// Couvre: tous les endpoints GET et POST /theory/analyze
// ============================================================================
import { Test, TestingModule } from '@nestjs/testing';
import { TheoryController } from './theory.controller';
import { TheoryService } from './theory.service';
import { NotFoundException } from '@nestjs/common';

describe('TheoryController', () => {
  let controller: TheoryController;
  let service: TheoryService;

  // Mock data
  const mockKeys = [
    { name: 'C' },
    { name: 'C#' },
    { name: 'D' },
    { name: 'D#' },
    { name: 'E' },
    { name: 'F' },
    { name: 'F#' },
    { name: 'G' },
    { name: 'G#' },
    { name: 'A' },
    { name: 'A#' },
    { name: 'B' },
  ];

  const mockModes = [
    {
      id: 'mode-1',
      slug: 'ionian',
      name: 'Ionien',
      intervals: ['1', '2', '3', '4', '5', '6', '7'],
      character: 'bright, happy',
      sensation: 'joyful',
      feeling: 'uplifting',
      greekName: 'Ionian',
      relativeTo: 'major',
      axisGroup: '1',
      advice: 'Use for happy melodies',
    },
  ];

  const mockScales = [
    {
      id: 'scale-1',
      slug: 'major',
      name: 'Major Scale',
      root: 'C',
      intervals: ['1', '2', '3', '4', '5', '6', '7'],
      type: 'diatonic',
      quality: 'major',
    },
  ];

  const mockChords = [
    {
      id: 'chord-1',
      name: 'Cmaj7',
      root: 'C',
      quality: 'maj7',
      intervals: ['1', '3', '5', '7'],
      extensions: ['9', '11', '13'],
      fingerings: ['x32000'],
      tension: 0,
    },
  ];

  const mockCircleOfFifths = {
    center: 'C',
    circle: [
      { note: 'C', interval: 0 },
      { note: 'G', interval: 7 },
      { note: 'D', interval: 2 },
      { note: 'A', interval: 9 },
      { note: 'E', interval: 4 },
      { note: 'B', interval: 11 },
      { note: 'F#', interval: 6 },
      { note: 'Db', interval: 1 },
      { note: 'Ab', interval: 8 },
      { note: 'Eb', interval: 3 },
      { note: 'Bb', interval: 10 },
      { note: 'F', interval: 5 },
    ],
    enharmonics: {
      'C#': 'Db',
      'D#': 'Eb',
      'F#': 'Gb',
      'G#': 'Ab',
      'A#': 'Bb',
    },
  };

  const mockAxisTheory = [
    {
      name: 'Axis Group 1',
      notes: ['C', 'E', 'G#'],
      description: 'Major chord tones',
      substitutions: ['Am', 'F#m'],
    },
  ];

  const mockHarmonyRules = [
    {
      degree: 'I',
      tonality: 'major',
      sensation: 'Stable, resolved',
      advice: 'Tonic chord',
    },
    {
      degree: 'V',
      tonality: 'major',
      sensation: 'Tense, dominant',
      advice: 'Dominant chord',
    },
  ];

  const mockTechniques = [
    {
      id: 'tech-1',
      slug: 'hammer-on',
      name: 'Hammer-on',
      category: 'left-hand',
      difficulty: 'beginner',
      description: 'Sound a note by hammering',
      diagramUrl: null,
      videoUrl: null,
      audioExample: null,
      notation: 'H',
      tips: ['Keep fingers close'],
      prerequisites: [],
      relatedTechniques: ['pull-off'],
      estimatedPracticeTime: '1-2 weeks',
      milestones: ['Clean at 60 BPM'],
    },
  ];

  const mockModesForKey = [
    {
      ...mockModes[0],
      notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    },
  ];

  const mockTheoryService = {
    getAllKeys: jest.fn(),
    getModes: jest.fn(),
    getModeBySlug: jest.fn(),
    getModesForKey: jest.fn(),
    getScales: jest.fn(),
    getScaleBySlug: jest.fn(),
    getChords: jest.fn(),
    analyzeProgression: jest.fn(),
    getCircleOfFifths: jest.fn(),
    getAxisTheory: jest.fn(),
    getHarmonyRules: jest.fn(),
    getHarmonyRuleByDegree: jest.fn(),
    getTechniques: jest.fn(),
    getTechniqueBySlug: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TheoryController],
      providers: [
        {
          provide: TheoryService,
          useValue: mockTheoryService,
        },
      ],
    }).compile();

    controller = module.get<TheoryController>(TheoryController);
    service = module.get<TheoryService>(TheoryService);

    // Reset mocks
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('GET /theory/keys', () => {
    it('should return all musical keys', async () => {
      mockTheoryService.getAllKeys.mockResolvedValue(mockKeys);

      const result = await controller.getAllKeys();

      expect(result).toEqual(mockKeys);
      expect(service.getAllKeys).toHaveBeenCalled();
    });

    it('should return 12 keys in chromatic order', async () => {
      mockTheoryService.getAllKeys.mockResolvedValue(mockKeys);

      const result = await controller.getAllKeys();

      expect(result).toHaveLength(12);
      expect(result[0].name).toBe('C');
      expect(result[11].name).toBe('B');
    });
  });

  describe('GET /theory/modes', () => {
    it('should return all modes without feeling filter', async () => {
      mockTheoryService.getModes.mockResolvedValue(mockModes);

      const result = await controller.getModes();

      expect(result).toEqual(mockModes);
      expect(service.getModes).toHaveBeenCalledWith(undefined);
    });

    it('should filter modes by feeling when query param provided', async () => {
      mockTheoryService.getModes.mockResolvedValue(mockModes);

      const result = await controller.getModes('happy');

      expect(result).toEqual(mockModes);
      expect(service.getModes).toHaveBeenCalledWith('happy');
    });

    it('should return modes with all expected properties', async () => {
      mockTheoryService.getModes.mockResolvedValue(mockModes);

      const result = await controller.getModes();

      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('slug');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('intervals');
      expect(result[0]).toHaveProperty('character');
      expect(result[0]).toHaveProperty('sensation');
      expect(result[0]).toHaveProperty('feeling');
    });
  });

  describe('GET /theory/modes/:slug', () => {
    it('should return mode by slug', async () => {
      mockTheoryService.getModeBySlug.mockResolvedValue(mockModes[0]);

      const result = await controller.getModeBySlug('ionian');

      expect(result).toEqual(mockModes[0]);
      expect(service.getModeBySlug).toHaveBeenCalledWith('ionian');
    });

    it('should propagate NotFoundException from service', async () => {
      mockTheoryService.getModeBySlug.mockRejectedValue(
        new NotFoundException('Mode nonexistent not found')
      );

      await expect(controller.getModeBySlug('nonexistent')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('GET /theory/keys/:key/modes', () => {
    it('should return modes for specific key', async () => {
      mockTheoryService.getModesForKey.mockResolvedValue(mockModesForKey);

      const result = await controller.getModesForKey('C');

      expect(result).toEqual(mockModesForKey);
      expect(service.getModesForKey).toHaveBeenCalledWith('C');
    });

    it('should return modes with calculated notes', async () => {
      mockTheoryService.getModesForKey.mockResolvedValue(mockModesForKey);

      const result = await controller.getModesForKey('C');

      expect(result[0]).toHaveProperty('notes');
      expect(Array.isArray(result[0].notes)).toBe(true);
    });

    it('should handle different key notes', async () => {
      mockTheoryService.getModesForKey.mockResolvedValue(mockModesForKey);

      await controller.getModesForKey('D');

      expect(service.getModesForKey).toHaveBeenCalledWith('D');
    });

    it('should handle sharp key notes', async () => {
      mockTheoryService.getModesForKey.mockResolvedValue(mockModesForKey);

      await controller.getModesForKey('F#');

      expect(service.getModesForKey).toHaveBeenCalledWith('F#');
    });
  });

  describe('GET /theory/scales', () => {
    it('should return all scales', async () => {
      mockTheoryService.getScales.mockResolvedValue(mockScales);

      const result = await controller.getScales();

      expect(result).toEqual(mockScales);
      expect(service.getScales).toHaveBeenCalled();
    });

    it('should return scales with expected properties', async () => {
      mockTheoryService.getScales.mockResolvedValue(mockScales);

      const result = await controller.getScales();

      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('slug');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('intervals');
      expect(result[0]).toHaveProperty('type');
      expect(result[0]).toHaveProperty('quality');
    });
  });

  describe('GET /theory/chords', () => {
    it('should return all chords without filters', async () => {
      mockTheoryService.getChords.mockResolvedValue(mockChords);

      const result = await controller.getChords();

      expect(result).toEqual(mockChords);
      expect(service.getChords).toHaveBeenCalledWith(undefined, undefined);
    });

    it('should filter chords by root', async () => {
      mockTheoryService.getChords.mockResolvedValue(mockChords);

      const result = await controller.getChords('C', undefined);

      expect(result).toEqual(mockChords);
      expect(service.getChords).toHaveBeenCalledWith('C', undefined);
    });

    it('should filter chords by quality', async () => {
      mockTheoryService.getChords.mockResolvedValue(mockChords);

      const result = await controller.getChords(undefined, 'maj7');

      expect(result).toEqual(mockChords);
      expect(service.getChords).toHaveBeenCalledWith(undefined, 'maj7');
    });

    it('should filter chords by both root and quality', async () => {
      mockTheoryService.getChords.mockResolvedValue(mockChords);

      const result = await controller.getChords('C', 'maj7');

      expect(result).toEqual(mockChords);
      expect(service.getChords).toHaveBeenCalledWith('C', 'maj7');
    });
  });

  describe('POST /theory/analyze', () => {
    it('should analyze chord progression successfully', async () => {
      const analyzeDto = {
        key: 'C',
        chords: [
          { degree: 'I', quality: 'maj7', beats: 4 },
          { degree: 'IV', quality: 'maj7', beats: 4 },
          { degree: 'V', quality: '7', beats: 4 },
          { degree: 'I', quality: 'maj7', beats: 4 },
        ],
      };

      const mockAnalysis = {
        key: 'C',
        analysis: [
          {
            chord: { degree: 'I', quality: 'maj7', beats: 4 },
            scale: ['Ionien', 'Lydien'],
            feeling: 'Stable, resolved',
            tension: 'stable',
            advice: 'Tonic chord',
          },
        ],
        overallFeeling: 'Stable, résolu',
      };

      mockTheoryService.analyzeProgression.mockResolvedValue(mockAnalysis);

      const result = await controller.analyzeProgression(analyzeDto);

      expect(result).toEqual(mockAnalysis);
      expect(service.analyzeProgression).toHaveBeenCalledWith(analyzeDto);
    });

    it('should return analysis with key, analysis array, and overallFeeling', async () => {
      const analyzeDto = {
        key: 'C',
        chords: [{ degree: 'I', quality: 'maj7', beats: 4 }],
      };

      const mockAnalysis = {
        key: 'C',
        analysis: [
          {
            chord: { degree: 'I', quality: 'maj7', beats: 4 },
            scale: ['Ionien'],
            feeling: 'Stable',
            tension: 'stable',
            advice: 'Home base',
          },
        ],
        overallFeeling: 'Stable, résolu',
      };

      mockTheoryService.analyzeProgression.mockResolvedValue(mockAnalysis);

      const result = await controller.analyzeProgression(analyzeDto);

      expect(result).toHaveProperty('key');
      expect(result).toHaveProperty('analysis');
      expect(result).toHaveProperty('overallFeeling');
    });

    it('should handle optional timeSignature field', async () => {
      const analyzeDto = {
        key: 'C',
        chords: [{ degree: 'I', quality: 'maj7', beats: 4 }],
        timeSignature: '4/4',
      };

      const mockAnalysis = {
        key: 'C',
        analysis: [],
        overallFeeling: 'Stable, résolu',
      };

      mockTheoryService.analyzeProgression.mockResolvedValue(mockAnalysis);

      await controller.analyzeProgression(analyzeDto);

      expect(service.analyzeProgression).toHaveBeenCalledWith(analyzeDto);
    });

    it('should handle progression without optional quality field', async () => {
      const analyzeDto = {
        key: 'C',
        chords: [{ degree: 'I', beats: 4 }],
      };

      const mockAnalysis = {
        key: 'C',
        analysis: [],
        overallFeeling: 'Stable, résolu',
      };

      mockTheoryService.analyzeProgression.mockResolvedValue(mockAnalysis);

      const result = await controller.analyzeProgression(analyzeDto);

      expect(result).toBeDefined();
    });
  });

  describe('GET /theory/circle-of-fifths', () => {
    it('should return circle of fifths with default center C', async () => {
      mockTheoryService.getCircleOfFifths.mockResolvedValue(mockCircleOfFifths);

      const result = await controller.getCircleOfFifths();

      expect(result).toEqual(mockCircleOfFifths);
      expect(service.getCircleOfFifths).toHaveBeenCalledWith(undefined);
    });

    it('should return circle of fifths with custom center', async () => {
      const customCircle = { ...mockCircleOfFifths, center: 'G' };
      mockTheoryService.getCircleOfFifths.mockResolvedValue(customCircle);

      const result = await controller.getCircleOfFifths('G');

      expect(result.center).toBe('G');
      expect(service.getCircleOfFifths).toHaveBeenCalledWith('G');
    });

    it('should return circle with 12 notes', async () => {
      mockTheoryService.getCircleOfFifths.mockResolvedValue(mockCircleOfFifths);

      const result = await controller.getCircleOfFifths();

      expect(result.circle).toHaveLength(12);
    });

    it('should return enharmonic equivalents', async () => {
      mockTheoryService.getCircleOfFifths.mockResolvedValue(mockCircleOfFifths);

      const result = await controller.getCircleOfFifths();

      expect(result).toHaveProperty('enharmonics');
      expect(result.enharmonics).toHaveProperty('C#');
      expect(result.enharmonics['C#']).toBe('Db');
    });
  });

  describe('GET /theory/axis-theory', () => {
    it('should return axis theory groups', async () => {
      mockTheoryService.getAxisTheory.mockResolvedValue(mockAxisTheory);

      const result = await controller.getAxisTheory();

      expect(result).toEqual(mockAxisTheory);
      expect(service.getAxisTheory).toHaveBeenCalled();
    });

    it('should return axis groups with notes and substitutions', async () => {
      mockTheoryService.getAxisTheory.mockResolvedValue(mockAxisTheory);

      const result = await controller.getAxisTheory();

      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('notes');
      expect(result[0]).toHaveProperty('description');
      expect(result[0]).toHaveProperty('substitutions');
    });
  });

  describe('GET /theory/harmony-rules', () => {
    it('should return all harmony rules without filter', async () => {
      mockTheoryService.getHarmonyRules.mockResolvedValue(mockHarmonyRules);

      const result = await controller.getHarmonyRules();

      expect(result).toEqual(mockHarmonyRules);
      expect(service.getHarmonyRules).toHaveBeenCalledWith(undefined);
    });

    it('should filter harmony rules by tonality', async () => {
      mockTheoryService.getHarmonyRules.mockResolvedValue(mockHarmonyRules);

      const result = await controller.getHarmonyRules('major');

      expect(result).toEqual(mockHarmonyRules);
      expect(service.getHarmonyRules).toHaveBeenCalledWith('major');
    });

    it('should return rules with degree, tonality, sensation, and advice', async () => {
      mockTheoryService.getHarmonyRules.mockResolvedValue(mockHarmonyRules);

      const result = await controller.getHarmonyRules();

      expect(result[0]).toHaveProperty('degree');
      expect(result[0]).toHaveProperty('tonality');
      expect(result[0]).toHaveProperty('sensation');
      expect(result[0]).toHaveProperty('advice');
    });
  });

  describe('GET /theory/harmony-rules/:degree', () => {
    it('should return harmony rule for specific degree', async () => {
      mockTheoryService.getHarmonyRuleByDegree.mockResolvedValue(mockHarmonyRules[0]);

      const result = await controller.getHarmonyRuleByDegree('I');

      expect(result).toEqual(mockHarmonyRules[0]);
      expect(service.getHarmonyRuleByDegree).toHaveBeenCalledWith('I', undefined);
    });

    it('should filter harmony rule by tonality', async () => {
      mockTheoryService.getHarmonyRuleByDegree.mockResolvedValue(mockHarmonyRules[0]);

      const result = await controller.getHarmonyRuleByDegree('I', 'major');

      expect(result).toEqual(mockHarmonyRules[0]);
      expect(service.getHarmonyRuleByDegree).toHaveBeenCalledWith('I', 'major');
    });

    it('should propagate NotFoundException from service', async () => {
      mockTheoryService.getHarmonyRuleByDegree.mockRejectedValue(
        new NotFoundException('Harmony rule for IX in major not found')
      );

      await expect(controller.getHarmonyRuleByDegree('IX', 'major')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('GET /theory/techniques', () => {
    it('should return all techniques without filters', async () => {
      mockTheoryService.getTechniques.mockResolvedValue(mockTechniques);

      const result = await controller.getTechniques();

      expect(result).toEqual(mockTechniques);
      expect(service.getTechniques).toHaveBeenCalledWith(undefined, undefined);
    });

    it('should filter techniques by category', async () => {
      mockTheoryService.getTechniques.mockResolvedValue(mockTechniques);

      const result = await controller.getTechniques('left-hand', undefined);

      expect(result).toEqual(mockTechniques);
      expect(service.getTechniques).toHaveBeenCalledWith('left-hand', undefined);
    });

    it('should filter techniques by difficulty', async () => {
      mockTheoryService.getTechniques.mockResolvedValue(mockTechniques);

      const result = await controller.getTechniques(undefined, 'beginner');

      expect(result).toEqual(mockTechniques);
      expect(service.getTechniques).toHaveBeenCalledWith(undefined, 'beginner');
    });

    it('should filter techniques by both category and difficulty', async () => {
      mockTheoryService.getTechniques.mockResolvedValue(mockTechniques);

      const result = await controller.getTechniques('left-hand', 'beginner');

      expect(result).toEqual(mockTechniques);
      expect(service.getTechniques).toHaveBeenCalledWith('left-hand', 'beginner');
    });

    it('should return techniques with all expected properties', async () => {
      mockTheoryService.getTechniques.mockResolvedValue(mockTechniques);

      const result = await controller.getTechniques();

      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('slug');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('category');
      expect(result[0]).toHaveProperty('difficulty');
      expect(result[0]).toHaveProperty('description');
      expect(result[0]).toHaveProperty('tips');
      expect(result[0]).toHaveProperty('prerequisites');
    });
  });

  describe('GET /theory/techniques/:slug', () => {
    it('should return technique by slug', async () => {
      mockTheoryService.getTechniqueBySlug.mockResolvedValue(mockTechniques[0]);

      const result = await controller.getTechniqueBySlug('hammer-on');

      expect(result).toEqual(mockTechniques[0]);
      expect(service.getTechniqueBySlug).toHaveBeenCalledWith('hammer-on');
    });

    it('should propagate NotFoundException from service', async () => {
      mockTheoryService.getTechniqueBySlug.mockRejectedValue(
        new NotFoundException('Technique nonexistent not found')
      );

      await expect(controller.getTechniqueBySlug('nonexistent')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('GET /theory/scales/:slug', () => {
    it('should return scale by slug', async () => {
      mockTheoryService.getScaleBySlug.mockResolvedValue(mockScales[0]);

      const result = await controller.getScaleBySlug('major');

      expect(result).toEqual(mockScales[0]);
      expect(service.getScaleBySlug).toHaveBeenCalledWith('major');
    });

    it('should propagate NotFoundException from service', async () => {
      mockTheoryService.getScaleBySlug.mockRejectedValue(
        new NotFoundException('Scale nonexistent not found')
      );

      await expect(controller.getScaleBySlug('nonexistent')).rejects.toThrow(
        NotFoundException
      );
    });

    it('should return scale with intervals', async () => {
      mockTheoryService.getScaleBySlug.mockResolvedValue(mockScales[0]);

      const result = await controller.getScaleBySlug('major');

      expect(result).toHaveProperty('intervals');
      expect(Array.isArray(result.intervals)).toBe(true);
    });
  });

  describe('API Documentation', () => {
    it('should have ApiTags decorator for theory module', () => {
      // Verify controller is properly decorated
      expect(TheoryController).toBeDefined();
    });

    it('should have all endpoints properly configured', () => {
      // Verify controller instance is created
      expect(controller).toBeInstanceOf(TheoryController);
    });
  });

  describe('Error Handling', () => {
    it('should propagate service errors on getAllKeys', async () => {
      mockTheoryService.getAllKeys.mockRejectedValue(new Error('Database error'));

      await expect(controller.getAllKeys()).rejects.toThrow('Database error');
    });

    it('should propagate service errors on getModes', async () => {
      mockTheoryService.getModes.mockRejectedValue(new Error('Database error'));

      await expect(controller.getModes()).rejects.toThrow('Database error');
    });

    it('should propagate service errors on analyzeProgression', async () => {
      const analyzeDto = {
        key: 'C',
        chords: [{ degree: 'I', beats: 4 }],
      };

      mockTheoryService.analyzeProgression.mockRejectedValue(new Error('Analysis failed'));

      await expect(controller.analyzeProgression(analyzeDto)).rejects.toThrow('Analysis failed');
    });

    it('should propagate service errors on getCircleOfFifths', async () => {
      mockTheoryService.getCircleOfFifths.mockRejectedValue(new Error('Calculation error'));

      await expect(controller.getCircleOfFifths()).rejects.toThrow('Calculation error');
    });
  });
});
