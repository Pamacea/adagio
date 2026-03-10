// ============================================================================
// LESSONS SERVICE TESTS
// ============================================================================
//
// Tests unitaires pour LessonsService
// Couvre: getLessons(), getLessonBySlug(), startLesson(), updateProgress()
// ============================================================================

import { Test, TestingModule } from '@nestjs/testing';
import { LessonsService } from './lessons.service';
import { NotFoundException } from '@nestjs/common';
import { prisma } from '@adagio/database';

// Mock prisma
jest.mock('@adagio/database', () => ({
  prisma: {
    lesson: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    lessonProgress: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
    },
    userPreferences: {
      upsert: jest.fn(),
    },
  },
}));

describe('LessonsService', () => {
  let service: LessonsService;
  let mockPrisma: any;

  // Mock data
  const mockLesson = {
    id: 'lesson-123',
    slug: 'major-scale-basics',
    title: 'Major Scale Basics',
    description: 'Learn the major scale',
    category: 'theory',
    level: 'BEGINNER',
    duration: 15,
    xp: 100,
    topics: JSON.stringify(['scale', 'major', 'intervals']),
    content: '<div>Lesson content</div>',
    order: 1,
    isPublished: true,
  };

  const mockLessonProgress = {
    id: 'progress-123',
    userId: 'user-123',
    lessonId: 'lesson-123',
    status: 'in-progress',
    currentSection: 2,
    completedSections: JSON.stringify(['section-1', 'section-2']),
    xp: 50,
    startedAt: new Date('2024-01-01'),
    completedAt: null,
    lastAccessed: new Date('2024-01-02'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LessonsService],
    }).compile();

    service = module.get<LessonsService>(LessonsService);
    mockPrisma = prisma as any;

    // Reset mocks
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('getLessons()', () => {
    it('should return all published lessons without filters', async () => {
      mockPrisma.lesson.findMany.mockResolvedValue([mockLesson]);
      mockPrisma.lessonProgress.findUnique.mockResolvedValue(null);

      const result = await service.getLessons();

      expect(mockPrisma.lesson.findMany).toHaveBeenCalledWith({
        where: { isPublished: true },
        orderBy: [{ category: 'asc' }, { order: 'asc' }],
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('slug');
      expect(result[0]).toHaveProperty('topics');
      expect(Array.isArray(result[0].topics)).toBe(true);
    });

    it('should filter lessons by category', async () => {
      mockPrisma.lesson.findMany.mockResolvedValue([mockLesson]);
      mockPrisma.lessonProgress.findUnique.mockResolvedValue(null);

      await service.getLessons('theory');

      expect(mockPrisma.lesson.findMany).toHaveBeenCalledWith({
        where: { isPublished: true, category: 'theory' },
        orderBy: [{ category: 'asc' }, { order: 'asc' }],
      });
    });

    it('should filter lessons by level', async () => {
      mockPrisma.lesson.findMany.mockResolvedValue([mockLesson]);
      mockPrisma.lessonProgress.findUnique.mockResolvedValue(null);

      await service.getLessons(undefined, 'BEGINNER');

      expect(mockPrisma.lesson.findMany).toHaveBeenCalledWith({
        where: { isPublished: true, level: 'BEGINNER' },
        orderBy: [{ category: 'asc' }, { order: 'asc' }],
      });
    });

    it('should filter lessons by both category and level', async () => {
      mockPrisma.lesson.findMany.mockResolvedValue([mockLesson]);
      mockPrisma.lessonProgress.findUnique.mockResolvedValue(null);

      await service.getLessons('theory', 'BEGINNER');

      expect(mockPrisma.lesson.findMany).toHaveBeenCalledWith({
        where: { isPublished: true, category: 'theory', level: 'BEGINNER' },
        orderBy: [{ category: 'asc' }, { order: 'asc' }],
      });
    });

    it('should include user progress when userId is provided', async () => {
      mockPrisma.lesson.findMany.mockResolvedValue([mockLesson]);
      mockPrisma.lessonProgress.findUnique.mockResolvedValue(mockLessonProgress);

      const result = await service.getLessons(undefined, undefined, 'user-123');

      expect(mockPrisma.lessonProgress.findUnique).toHaveBeenCalledWith({
        where: {
          userId_lessonId: { userId: 'user-123', lessonId: 'lesson-123' },
        },
      });
      expect(result[0]).toHaveProperty('progress');
      expect(result[0].progress).not.toBeNull();
      expect(result[0].progress?.status).toBe('in-progress');
    });

    it('should return null progress when userId is not provided', async () => {
      mockPrisma.lesson.findMany.mockResolvedValue([mockLesson]);

      const result = await service.getLessons();

      expect(result[0].progress).toBeNull();
    });

    it('should parse topics JSON correctly', async () => {
      const lessonWithStringTopics = {
        ...mockLesson,
        topics: JSON.stringify(['topic1', 'topic2', 'topic3']),
      };
      mockPrisma.lesson.findMany.mockResolvedValue([lessonWithStringTopics]);
      mockPrisma.lessonProgress.findUnique.mockResolvedValue(null);

      const result = await service.getLessons();

      expect(result[0].topics).toEqual(['topic1', 'topic2', 'topic3']);
    });

    it('should handle topics as array when already parsed', async () => {
      const lessonWithArrayTopics = {
        ...mockLesson,
        topics: ['topic1', 'topic2'] as any,
      };
      mockPrisma.lesson.findMany.mockResolvedValue([lessonWithArrayTopics]);
      mockPrisma.lessonProgress.findUnique.mockResolvedValue(null);

      const result = await service.getLessons();

      expect(result[0].topics).toEqual(['topic1', 'topic2']);
    });

    it('should handle null or undefined topics', async () => {
      const lessonWithNullTopics = {
        ...mockLesson,
        topics: null,
      };
      mockPrisma.lesson.findMany.mockResolvedValue([lessonWithNullTopics]);
      mockPrisma.lessonProgress.findUnique.mockResolvedValue(null);

      const result = await service.getLessons();

      expect(result[0].topics).toEqual([]);
    });

    it('should parse completedSections in progress', async () => {
      mockPrisma.lesson.findMany.mockResolvedValue([mockLesson]);
      mockPrisma.lessonProgress.findUnique.mockResolvedValue(mockLessonProgress);

      const result = await service.getLessons(undefined, undefined, 'user-123');

      expect(result[0].progress?.completedSections).toEqual(['section-1', 'section-2']);
    });

    it('should return empty array when no lessons found', async () => {
      mockPrisma.lesson.findMany.mockResolvedValue([]);

      const result = await service.getLessons();

      expect(result).toEqual([]);
    });

    it('should order lessons by category then order', async () => {
      mockPrisma.lesson.findMany.mockResolvedValue([mockLesson]);
      mockPrisma.lessonProgress.findUnique.mockResolvedValue(null);

      await service.getLessons();

      expect(mockPrisma.lesson.findMany).toHaveBeenCalledWith({
        where: { isPublished: true },
        orderBy: [{ category: 'asc' }, { order: 'asc' }],
      });
    });

    it('should handle multiple lessons with different progress states', async () => {
      const lesson1 = { ...mockLesson, id: 'lesson-1' };
      const lesson2 = { ...mockLesson, id: 'lesson-2' };
      const progress1 = { ...mockLessonProgress, lessonId: 'lesson-1', status: 'completed' };
      const progress2 = { ...mockLessonProgress, lessonId: 'lesson-2', status: 'in-progress' };

      mockPrisma.lesson.findMany.mockResolvedValue([lesson1, lesson2]);
      mockPrisma.lessonProgress.findUnique
        .mockResolvedValueOnce(progress1)
        .mockResolvedValueOnce(progress2);

      const result = await service.getLessons(undefined, undefined, 'user-123');

      expect(result).toHaveLength(2);
      expect(result[0].progress?.status).toBe('completed');
      expect(result[1].progress?.status).toBe('in-progress');
    });
  });

  describe('getLessonBySlug()', () => {
    it('should return lesson by slug', async () => {
      mockPrisma.lesson.findUnique.mockResolvedValue(mockLesson);
      mockPrisma.lessonProgress.findUnique.mockResolvedValue(null);

      const result = await service.getLessonBySlug('major-scale-basics');

      expect(mockPrisma.lesson.findUnique).toHaveBeenCalledWith({
        where: { slug: 'major-scale-basics' },
      });
      expect(result).toHaveProperty('id');
      expect(result?.slug).toBe('major-scale-basics');
      expect(result).toHaveProperty('content');
    });

    it('should throw NotFoundException when lesson not found', async () => {
      mockPrisma.lesson.findUnique.mockResolvedValue(null);

      await expect(service.getLessonBySlug('non-existent')).rejects.toThrow(
        NotFoundException
      );
      await expect(service.getLessonBySlug('non-existent')).rejects.toThrow(
        'Lesson non-existent not found'
      );
    });

    it('should include progress when userId is provided', async () => {
      mockPrisma.lesson.findUnique.mockResolvedValue(mockLesson);
      mockPrisma.lessonProgress.findUnique.mockResolvedValue(mockLessonProgress);

      const result = await service.getLessonBySlug('major-scale-basics', 'user-123');

      expect(mockPrisma.lessonProgress.findUnique).toHaveBeenCalledWith({
        where: {
          userId_lessonId: { userId: 'user-123', lessonId: 'lesson-123' },
        },
      });
      expect(result?.progress).not.toBeNull();
    });

    it('should return null progress when userId not provided', async () => {
      mockPrisma.lesson.findUnique.mockResolvedValue(mockLesson);

      const result = await service.getLessonBySlug('major-scale-basics');

      expect(result?.progress).toBeNull();
    });

    it('should parse topics from JSON', async () => {
      mockPrisma.lesson.findUnique.mockResolvedValue(mockLesson);

      const result = await service.getLessonBySlug('major-scale-basics');

      expect(result?.topics).toEqual(['scale', 'major', 'intervals']);
    });

    it('should parse completedSections in progress', async () => {
      mockPrisma.lesson.findUnique.mockResolvedValue(mockLesson);
      mockPrisma.lessonProgress.findUnique.mockResolvedValue(mockLessonProgress);

      const result = await service.getLessonBySlug('major-scale-basics', 'user-123');

      expect(result?.progress?.completedSections).toEqual(['section-1', 'section-2']);
    });

    it('should include all lesson properties', async () => {
      mockPrisma.lesson.findUnique.mockResolvedValue(mockLesson);

      const result = await service.getLessonBySlug('major-scale-basics');

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('slug');
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('category');
      expect(result).toHaveProperty('level');
      expect(result).toHaveProperty('duration');
      expect(result).toHaveProperty('xp');
      expect(result).toHaveProperty('topics');
      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('order');
    });

    it('should include all progress properties when progress exists', async () => {
      mockPrisma.lesson.findUnique.mockResolvedValue(mockLesson);
      mockPrisma.lessonProgress.findUnique.mockResolvedValue(mockLessonProgress);

      const result = await service.getLessonBySlug('major-scale-basics', 'user-123');

      expect(result?.progress).toHaveProperty('status');
      expect(result?.progress).toHaveProperty('currentSection');
      expect(result?.progress).toHaveProperty('completedSections');
      expect(result?.progress).toHaveProperty('xp');
      expect(result?.progress).toHaveProperty('startedAt');
      expect(result?.progress).toHaveProperty('completedAt');
      expect(result?.progress).toHaveProperty('lastAccessed');
    });
  });

  describe('startLessonBySlug()', () => {
    it('should start a lesson by slug', async () => {
      mockPrisma.lesson.findUnique.mockResolvedValue(mockLesson);
      mockPrisma.lessonProgress.findUnique.mockResolvedValue(null);
      mockPrisma.lessonProgress.create.mockResolvedValue(mockLessonProgress);

      await service.startLessonBySlug('user-123', 'major-scale-basics');

      expect(mockPrisma.lesson.findUnique).toHaveBeenCalledWith({
        where: { slug: 'major-scale-basics' },
        select: { id: true },
      });
    });

    it('should throw NotFoundException when lesson not found', async () => {
      mockPrisma.lesson.findUnique.mockResolvedValue(null);

      await expect(service.startLessonBySlug('user-123', 'non-existent')).rejects.toThrow(
        NotFoundException
      );
    });

    it('should call startLesson with correct parameters', async () => {
      mockPrisma.lesson.findUnique.mockResolvedValue(mockLesson);
      mockPrisma.lessonProgress.findUnique.mockResolvedValue(null);
      mockPrisma.lessonProgress.create.mockResolvedValue(mockLessonProgress);

      const startLessonSpy = jest.spyOn(service, 'startLesson');

      await service.startLessonBySlug('user-123', 'major-scale-basics');

      expect(startLessonSpy).toHaveBeenCalledWith('user-123', 'lesson-123');
    });
  });

  describe('updateProgressBySlug()', () => {
    it('should update progress by slug', async () => {
      mockPrisma.lesson.findUnique.mockResolvedValue(mockLesson);
      mockPrisma.lessonProgress.findUnique.mockResolvedValue(mockLessonProgress);
      mockPrisma.lessonProgress.update.mockResolvedValue(mockLessonProgress);
      mockPrisma.userPreferences.upsert.mockResolvedValue({});

      const updateData = {
        currentSection: 3,
        status: 'completed',
      };

      await service.updateProgressBySlug('user-123', 'major-scale-basics', updateData);

      expect(mockPrisma.lesson.findUnique).toHaveBeenCalledWith({
        where: { slug: 'major-scale-basics' },
        select: { id: true },
      });
    });

    it('should throw NotFoundException when lesson not found', async () => {
      mockPrisma.lesson.findUnique.mockResolvedValue(null);

      await expect(
        service.updateProgressBySlug('user-123', 'non-existent', {})
      ).rejects.toThrow(NotFoundException);
    });

    it('should call updateProgress with correct parameters', async () => {
      mockPrisma.lesson.findUnique.mockResolvedValue(mockLesson);
      mockPrisma.lessonProgress.findUnique.mockResolvedValue(mockLessonProgress);
      mockPrisma.lessonProgress.update.mockResolvedValue(mockLessonProgress);
      mockPrisma.userPreferences.upsert.mockResolvedValue({});

      const updateData = { currentSection: 2 };
      const updateProgressSpy = jest.spyOn(service, 'updateProgress');

      await service.updateProgressBySlug('user-123', 'major-scale-basics', updateData);

      expect(updateProgressSpy).toHaveBeenCalledWith('user-123', 'lesson-123', updateData);
    });
  });

  describe('startLesson()', () => {
    it('should create new lesson progress', async () => {
      mockPrisma.lesson.findUnique.mockResolvedValue(mockLesson);
      mockPrisma.lessonProgress.findUnique.mockResolvedValue(null);
      mockPrisma.lessonProgress.create.mockResolvedValue(mockLessonProgress);

      await service.startLesson('user-123', 'lesson-123');

      expect(mockPrisma.lessonProgress.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-123',
          lessonId: 'lesson-123',
          status: 'in-progress',
          startedAt: expect.any(Date),
          lastAccessed: expect.any(Date),
          completedSections: [],
          currentSection: 0,
          xp: 0,
        },
      });
    });

    it('should throw NotFoundException when lesson does not exist', async () => {
      mockPrisma.lesson.findUnique.mockResolvedValue(null);

      await expect(service.startLesson('user-123', 'non-existent')).rejects.toThrow(
        NotFoundException
      );
      await expect(service.startLesson('user-123', 'non-existent')).rejects.toThrow(
        'Lesson not found'
      );
    });

    it('should update existing progress and change status from not-started to in-progress', async () => {
      const notStartedProgress = { ...mockLessonProgress, status: 'not-started' };
      mockPrisma.lesson.findUnique.mockResolvedValue(mockLesson);
      mockPrisma.lessonProgress.findUnique.mockResolvedValue(notStartedProgress);
      mockPrisma.lessonProgress.update.mockResolvedValue(mockLessonProgress);

      await service.startLesson('user-123', 'lesson-123');

      expect(mockPrisma.lessonProgress.update).toHaveBeenCalledWith({
        where: {
          userId_lessonId: { userId: 'user-123', lessonId: 'lesson-123' },
        },
        data: {
          lastAccessed: expect.any(Date),
          status: 'in-progress',
        },
      });
    });

    it('should keep existing status if not not-started', async () => {
      const inProgressProgress = { ...mockLessonProgress, status: 'completed' };
      mockPrisma.lesson.findUnique.mockResolvedValue(mockLesson);
      mockPrisma.lessonProgress.findUnique.mockResolvedValue(inProgressProgress);
      mockPrisma.lessonProgress.update.mockResolvedValue(inProgressProgress);

      await service.startLesson('user-123', 'lesson-123');

      expect(mockPrisma.lessonProgress.update).toHaveBeenCalledWith({
        where: {
          userId_lessonId: { userId: 'user-123', lessonId: 'lesson-123' },
        },
        data: {
          lastAccessed: expect.any(Date),
          status: 'completed',
        },
      });
    });
  });

  describe('updateProgress()', () => {
    it('should throw NotFoundException when progress not found', async () => {
      mockPrisma.lessonProgress.findUnique.mockResolvedValue(null);

      await expect(
        service.updateProgress('user-123', 'lesson-123', { currentSection: 1 })
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.updateProgress('user-123', 'lesson-123', { currentSection: 1 })
      ).rejects.toThrow('Lesson progress not found. Start the lesson first.');
    });

    it('should update currentSection', async () => {
      mockPrisma.lessonProgress.findUnique.mockResolvedValue(mockLessonProgress);
      mockPrisma.lessonProgress.update.mockResolvedValue({
        ...mockLessonProgress,
        currentSection: 5,
      });

      await service.updateProgress('user-123', 'lesson-123', { currentSection: 5 });

      expect(mockPrisma.lessonProgress.update).toHaveBeenCalledWith({
        where: {
          userId_lessonId: { userId: 'user-123', lessonId: 'lesson-123' },
        },
        data: expect.objectContaining({
          currentSection: 5,
          lastAccessed: expect.any(Date),
        }),
      });
    });

    it('should merge completed sections with existing ones', async () => {
      const existingProgress = {
        ...mockLessonProgress,
        completedSections: JSON.stringify(['section-1', 'section-2']),
      };
      mockPrisma.lessonProgress.findUnique.mockResolvedValue(existingProgress);
      mockPrisma.lessonProgress.update.mockResolvedValue(mockLessonProgress);

      await service.updateProgress('user-123', 'lesson-123', {
        completedSections: ['section-3', 'section-2'],
      });

      expect(mockPrisma.lessonProgress.update).toHaveBeenCalledWith({
        where: {
          userId_lessonId: { userId: 'user-123', lessonId: 'lesson-123' },
        },
        data: expect.objectContaining({
          completedSections: ['section-1', 'section-2', 'section-3'],
        }),
      });
    });

    it('should update status', async () => {
      mockPrisma.lessonProgress.findUnique.mockResolvedValue(mockLessonProgress);
      mockPrisma.lessonProgress.update.mockResolvedValue({
        ...mockLessonProgress,
        status: 'completed',
      });

      await service.updateProgress('user-123', 'lesson-123', { status: 'completed' });

      expect(mockPrisma.lessonProgress.update).toHaveBeenCalledWith({
        where: {
          userId_lessonId: { userId: 'user-123', lessonId: 'lesson-123' },
        },
        data: expect.objectContaining({
          status: 'completed',
        }),
      });
    });

    it('should set completedAt when status changes to completed', async () => {
      const progressWithoutCompleted = { ...mockLessonProgress, completedAt: null };
      mockPrisma.lessonProgress.findUnique.mockResolvedValue(progressWithoutCompleted);
      mockPrisma.lessonProgress.update.mockResolvedValue(mockLessonProgress);
      mockPrisma.userPreferences.upsert.mockResolvedValue({});

      await service.updateProgress('user-123', 'lesson-123', { status: 'completed' });

      expect(mockPrisma.lessonProgress.update).toHaveBeenCalledWith({
        where: {
          userId_lessonId: { userId: 'user-123', lessonId: 'lesson-123' },
        },
        data: expect.objectContaining({
          completedAt: expect.any(Date),
        }),
      });
    });

    it('should not update completedAt if already set', async () => {
      const progressWithCompleted = {
        ...mockLessonProgress,
        completedAt: new Date('2024-01-01'),
      };
      mockPrisma.lessonProgress.findUnique.mockResolvedValue(progressWithCompleted);
      mockPrisma.lessonProgress.update.mockResolvedValue(progressWithCompleted);

      await service.updateProgress('user-123', 'lesson-123', { status: 'completed' });

      const updateCall = mockPrisma.lessonProgress.update.mock.calls[0][0];
      expect(updateCall.data.completedAt).toBeUndefined();
    });

    it('should update xp', async () => {
      mockPrisma.lessonProgress.findUnique.mockResolvedValue(mockLessonProgress);
      mockPrisma.lessonProgress.update.mockResolvedValue({
        ...mockLessonProgress,
        xp: 75,
      });

      await service.updateProgress('user-123', 'lesson-123', { xp: 75 });

      expect(mockPrisma.lessonProgress.update).toHaveBeenCalledWith({
        where: {
          userId_lessonId: { userId: 'user-123', lessonId: 'lesson-123' },
        },
        data: expect.objectContaining({
          xp: 75,
        }),
      });
    });

    it('should update user total XP when lesson is completed', async () => {
      const progressWithXp = { ...mockLessonProgress, xp: 50, completedAt: null };
      mockPrisma.lessonProgress.findUnique.mockResolvedValue(progressWithXp);
      const updatedProgress = { ...progressWithXp, xp: 100 };
      mockPrisma.lessonProgress.update.mockResolvedValue(updatedProgress);
      mockPrisma.userPreferences.upsert.mockResolvedValue({});

      await service.updateProgress('user-123', 'lesson-123', {
        status: 'completed',
        xp: 100,
      });

      expect(mockPrisma.userPreferences.upsert).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        create: { userId: 'user-123', totalXP: 50 },
        update: { totalXP: { increment: 50 } },
      });
    });

    it('should always update lastAccessed', async () => {
      mockPrisma.lessonProgress.findUnique.mockResolvedValue(mockLessonProgress);
      mockPrisma.lessonProgress.update.mockResolvedValue(mockLessonProgress);

      await service.updateProgress('user-123', 'lesson-123', {});

      expect(mockPrisma.lessonProgress.update).toHaveBeenCalledWith({
        where: {
          userId_lessonId: { userId: 'user-123', lessonId: 'lesson-123' },
        },
        data: expect.objectContaining({
          lastAccessed: expect.any(Date),
        }),
      });
    });

    it('should handle all update fields together', async () => {
      mockPrisma.lessonProgress.findUnique.mockResolvedValue(mockLessonProgress);
      mockPrisma.lessonProgress.update.mockResolvedValue(mockLessonProgress);
      mockPrisma.userPreferences.upsert.mockResolvedValue({});

      await service.updateProgress('user-123', 'lesson-123', {
        currentSection: 5,
        completedSections: ['section-3'],
        status: 'completed',
        xp: 100,
      });

      expect(mockPrisma.lessonProgress.update).toHaveBeenCalledWith({
        where: {
          userId_lessonId: { userId: 'user-123', lessonId: 'lesson-123' },
        },
        data: expect.objectContaining({
          currentSection: 5,
          completedSections: expect.arrayContaining(['section-3']),
          status: 'completed',
          xp: 100,
          lastAccessed: expect.any(Date),
        }),
      });
    });

    it('should parse existing completedSections as array', async () => {
      const progressWithArraySections = {
        ...mockLessonProgress,
        completedSections: ['section-1', 'section-2'] as any,
      };
      mockPrisma.lessonProgress.findUnique.mockResolvedValue(progressWithArraySections);
      mockPrisma.lessonProgress.update.mockResolvedValue(mockLessonProgress);

      await service.updateProgress('user-123', 'lesson-123', {
        completedSections: ['section-3'],
      });

      expect(mockPrisma.lessonProgress.update).toHaveBeenCalled();
    });
  });

  describe('getUserLessonProgress()', () => {
    it('should return user lesson progress with lesson details', async () => {
      const progressWithLesson = {
        ...mockLessonProgress,
        lesson: mockLesson,
      };
      mockPrisma.lessonProgress.findMany.mockResolvedValue([progressWithLesson]);

      const result = await service.getUserLessonProgress('user-123');

      expect(mockPrisma.lessonProgress.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        include: {
          lesson: {
            select: {
              id: true,
              slug: true,
              title: true,
              category: true,
              level: true,
              xp: true,
              duration: true,
            },
          },
        },
        orderBy: { lastAccessed: 'desc' },
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('lesson');
    });

    it('should parse completedSections in progress', async () => {
      const progressWithLesson = {
        ...mockLessonProgress,
        lesson: mockLesson,
      };
      mockPrisma.lessonProgress.findMany.mockResolvedValue([progressWithLesson]);

      const result = await service.getUserLessonProgress('user-123');

      expect(result[0].completedSections).toEqual(['section-1', 'section-2']);
    });

    it('should return empty array when no progress found', async () => {
      mockPrisma.lessonProgress.findMany.mockResolvedValue([]);

      const result = await service.getUserLessonProgress('user-123');

      expect(result).toEqual([]);
    });

    it('should order by lastAccessed descending', async () => {
      mockPrisma.lessonProgress.findMany.mockResolvedValue([]);

      await service.getUserLessonProgress('user-123');

      expect(mockPrisma.lessonProgress.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        include: {
          lesson: {
            select: {
              id: true,
              slug: true,
              title: true,
              category: true,
              level: true,
              xp: true,
              duration: true,
            },
          },
        },
        orderBy: { lastAccessed: 'desc' },
      });
    });

    it('should include all required progress fields', async () => {
      const progressWithLesson = {
        ...mockLessonProgress,
        lesson: mockLesson,
      };
      mockPrisma.lessonProgress.findMany.mockResolvedValue([progressWithLesson]);

      const result = await service.getUserLessonProgress('user-123');

      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('status');
      expect(result[0]).toHaveProperty('currentSection');
      expect(result[0]).toHaveProperty('completedSections');
      expect(result[0]).toHaveProperty('xp');
      expect(result[0]).toHaveProperty('startedAt');
      expect(result[0]).toHaveProperty('completedAt');
      expect(result[0]).toHaveProperty('lastAccessed');
      expect(result[0]).toHaveProperty('lesson');
    });

    it('should include all required lesson fields', async () => {
      // Create a lesson with only the fields selected by Prisma (no content)
      const lessonWithoutContent = {
        id: mockLesson.id,
        slug: mockLesson.slug,
        title: mockLesson.title,
        category: mockLesson.category,
        level: mockLesson.level,
        xp: mockLesson.xp,
        duration: mockLesson.duration,
      };
      const progressWithLesson = {
        ...mockLessonProgress,
        lesson: lessonWithoutContent,
      };
      mockPrisma.lessonProgress.findMany.mockResolvedValue([progressWithLesson]);

      const result = await service.getUserLessonProgress('user-123');

      expect(result[0].lesson).toHaveProperty('id');
      expect(result[0].lesson).toHaveProperty('slug');
      expect(result[0].lesson).toHaveProperty('title');
      expect(result[0].lesson).toHaveProperty('category');
      expect(result[0].lesson).toHaveProperty('level');
      expect(result[0].lesson).toHaveProperty('xp');
      expect(result[0].lesson).toHaveProperty('duration');
      expect(result[0].lesson).not.toHaveProperty('content');
    });
  });

  describe('getLessonCategories()', () => {
    it('should return distinct categories', async () => {
      // Prisma distinct would return unique values, so we mock distinct results
      const mockCategories = [
        { category: 'technique' },
        { category: 'theory' },
      ];
      mockPrisma.lesson.findMany.mockResolvedValue(mockCategories);

      const result = await service.getLessonCategories();

      expect(mockPrisma.lesson.findMany).toHaveBeenCalledWith({
        where: { isPublished: true },
        select: { category: true },
        distinct: ['category'],
        orderBy: { category: 'asc' },
      });
      expect(result).toEqual(['technique', 'theory']);
    });

    it('should return empty array when no categories found', async () => {
      mockPrisma.lesson.findMany.mockResolvedValue([]);

      const result = await service.getLessonCategories();

      expect(result).toEqual([]);
    });

    it('should only include published lessons', async () => {
      mockPrisma.lesson.findMany.mockResolvedValue([]);

      await service.getLessonCategories();

      expect(mockPrisma.lesson.findMany).toHaveBeenCalledWith({
        where: { isPublished: true },
        select: { category: true },
        distinct: ['category'],
        orderBy: { category: 'asc' },
      });
    });
  });

  describe('getLessonLevels()', () => {
    it('should return all lesson levels', async () => {
      const result = await service.getLessonLevels();

      expect(result).toEqual(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']);
    });

    it('should return array of strings', async () => {
      const result = await service.getLessonLevels();

      expect(Array.isArray(result)).toBe(true);
      result.forEach((level) => {
        expect(typeof level).toBe('string');
      });
    });

    it('should return fixed list regardless of database', async () => {
      const result1 = await service.getLessonLevels();
      const result2 = await service.getLessonLevels();

      expect(result1).toEqual(result2);
    });
  });
});
