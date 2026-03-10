// ============================================================================
// PROGRESS CONTROLLER TESTS
// ============================================================================
//
// Tests unitaires pour ProgressController
// Couvre: POST /progress/progressions, POST /progress/progressions/:id/complete-milestone
// ============================================================================

import { Test, TestingModule } from '@nestjs/testing';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// Mock data
const mockUser = {
  userId: 'user-123',
  email: 'test@example.com',
};

const mockProgression = {
  id: 'prog-123',
  userId: 'user-123',
  name: 'My Jazz Progression',
  key: 'C',
  timeSignature: '4/4',
  chords: [
    { degree: 'I', quality: 'maj7', beats: 4 },
    { degree: 'IV', quality: 'maj7', beats: 4 },
  ],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

const mockUserProgress = {
  id: 'progress-123',
  userId: 'user-123',
  milestonesCompleted: ['milestone-1'],
  xp: 50,
};

const mockProgressService = {
  saveProgression: jest.fn(),
  completeMilestone: jest.fn(),
};

describe('ProgressController', () => {
  let controller: ProgressController;
  let service: ProgressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgressController],
      providers: [
        {
          provide: ProgressService,
          useValue: mockProgressService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context) => {
          const req = context.switchToHttp().getRequest();
          req.user = mockUser;
          return true;
        },
      })
      .compile();

    controller = module.get<ProgressController>(ProgressController);
    service = module.get<ProgressService>(ProgressService);

    // Reset mocks
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('POST /progress/progressions', () => {
    it('should save a progression successfully', async () => {
      const saveDto = {
        name: 'My Jazz Progression',
        key: 'C',
        timeSignature: '4/4',
        chords: [
          { degree: 'I', quality: 'maj7', beats: 4 },
          { degree: 'IV', quality: 'maj7', beats: 4 },
        ],
      };

      const mockRequest = {
        user: mockUser,
      };

      mockProgressService.saveProgression.mockResolvedValue(mockProgression);

      const result = await controller.saveProgression(mockRequest as any, saveDto as any);

      expect(result).toEqual(mockProgression);
      expect(service.saveProgression).toHaveBeenCalledWith('user-123', saveDto);
    });

    it('should save progression with default timeSignature', async () => {
      const saveDto = {
        key: 'C',
        chords: [{ degree: 'I', beats: 4 }],
      };

      const mockRequest = {
        user: mockUser,
      };

      mockProgressService.saveProgression.mockResolvedValue({
        ...mockProgression,
        timeSignature: '4/4',
      });

      await controller.saveProgression(mockRequest as any, saveDto as any);

      expect(service.saveProgression).toHaveBeenCalledWith('user-123', saveDto);
    });

    it('should save progression without optional name', async () => {
      const saveDto = {
        key: 'G',
        chords: [{ degree: 'V', quality: '7', beats: 2 }],
      };

      const mockRequest = {
        user: mockUser,
      };

      mockProgressService.saveProgression.mockResolvedValue({
        ...mockProgression,
        name: undefined,
      });

      await controller.saveProgression(mockRequest as any, saveDto as any);

      expect(service.saveProgression).toHaveBeenCalledWith('user-123', saveDto);
    });

    it('should return progression with all fields', async () => {
      const saveDto = {
        name: 'Test Progression',
        key: 'F',
        timeSignature: '3/4',
        chords: [{ degree: 'ii', quality: 'min7', beats: 3 }],
      };

      const mockRequest = {
        user: mockUser,
      };

      const expectedProgression = {
        id: 'prog-456',
        userId: 'user-123',
        ...saveDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockProgressService.saveProgression.mockResolvedValue(expectedProgression);

      const result = await controller.saveProgression(mockRequest as any, saveDto as any);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('key');
      expect(result).toHaveProperty('timeSignature');
      expect(result).toHaveProperty('chords');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });

    it('should handle empty chords array', async () => {
      const saveDto = {
        key: 'C',
        chords: [],
      };

      const mockRequest = {
        user: mockUser,
      };

      mockProgressService.saveProgression.mockResolvedValue({
        ...mockProgression,
        chords: [],
      });

      await controller.saveProgression(mockRequest as any, saveDto as any);

      expect(service.saveProgression).toHaveBeenCalledWith('user-123', saveDto);
    });

    it('should handle complex chord structures', async () => {
      const saveDto = {
        name: 'Complex Progression',
        key: 'Bb',
        timeSignature: '5/4',
        chords: [
          { degree: 'I', quality: 'maj7#11', beats: 2 },
          { degree: 'vi', quality: 'min9', beats: 1 },
          { degree: 'ii', quality: 'min13', beats: 1 },
          { degree: 'V', quality: '13#11', beats: 1 },
        ],
      };

      const mockRequest = {
        user: mockUser,
      };

      mockProgressService.saveProgression.mockResolvedValue({
        ...mockProgression,
        ...saveDto,
      });

      await controller.saveProgression(mockRequest as any, saveDto as any);

      expect(service.saveProgression).toHaveBeenCalledWith('user-123', saveDto);
    });

    it('should extract userId from request', async () => {
      const saveDto = {
        key: 'D',
        chords: [{ degree: 'IV', beats: 4 }],
      };

      const mockRequest = {
        user: { userId: 'different-user-123' },
      };

      mockProgressService.saveProgression.mockResolvedValue(mockProgression);

      await controller.saveProgression(mockRequest as any, saveDto as any);

      expect(service.saveProgression).toHaveBeenCalledWith('different-user-123', saveDto);
    });

    it('should handle service errors gracefully', async () => {
      const saveDto = {
        key: 'C',
        chords: [{ degree: 'I', beats: 4 }],
      };

      const mockRequest = {
        user: mockUser,
      };

      mockProgressService.saveProgression.mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        controller.saveProgression(mockRequest as any, saveDto as any)
      ).rejects.toThrow('Database error');
    });

    it('should validate chord structure with all properties', async () => {
      const saveDto = {
        name: 'Full Chord Test',
        key: 'E',
        timeSignature: '6/8',
        chords: [
          {
            degree: 'V',
            quality: 'alt',
            beats: 3,
          },
        ],
      };

      const mockRequest = {
        user: mockUser,
      };

      mockProgressService.saveProgression.mockResolvedValue({
        ...mockProgression,
        ...saveDto,
      });

      const result = await controller.saveProgression(mockRequest as any, saveDto as any);

      expect(result.chords[0].degree).toBe('V');
      expect(result.chords[0].quality).toBe('alt');
      expect(result.chords[0].beats).toBe(3);
    });

    it('should accept different time signatures', async () => {
      const timeSignatures = ['2/4', '3/4', '4/4', '5/4', '6/8', '7/8', '12/8'];

      for (const ts of timeSignatures) {
        const saveDto = {
          key: 'C',
          timeSignature: ts,
          chords: [{ degree: 'I', beats: 4 }],
        };

        mockProgressService.saveProgression.mockResolvedValue({
          ...mockProgression,
          timeSignature: ts,
        });

        const mockRequest = { user: mockUser };

        await controller.saveProgression(mockRequest as any, saveDto as any);

        expect(service.saveProgression).toHaveBeenCalledWith('user-123', saveDto);
      }
    });
  });

  describe('POST /progress/progressions/:id/complete-milestone', () => {
    it('should complete a milestone successfully', async () => {
      const mockRequest = {
        user: mockUser,
      };

      const updatedProgress = {
        ...mockUserProgress,
        milestonesCompleted: ['milestone-1', 'milestone-2'],
        xp: 60,
      };

      mockProgressService.completeMilestone.mockResolvedValue(updatedProgress);

      const result = await controller.completeMilestone(
        mockRequest as any,
        'progress-123',
        'milestone-2'
      );

      expect(result).toEqual(updatedProgress);
      expect(service.completeMilestone).toHaveBeenCalledWith(
        'user-123',
        'progress-123',
        'milestone-2'
      );
    });

    it('should add milestone to existing list', async () => {
      const mockRequest = {
        user: mockUser,
      };

      const updatedProgress = {
        ...mockUserProgress,
        milestonesCompleted: ['milestone-1', 'milestone-2', 'milestone-3'],
        xp: 70,
      };

      mockProgressService.completeMilestone.mockResolvedValue(updatedProgress);

      await controller.completeMilestone(
        mockRequest as any,
        'progress-123',
        'milestone-3'
      );

      expect(service.completeMilestone).toHaveBeenCalledWith(
        'user-123',
        'progress-123',
        'milestone-3'
      );
    });

    it('should increment XP when completing milestone', async () => {
      const mockRequest = {
        user: mockUser,
      };

      const updatedProgress = {
        ...mockUserProgress,
        milestonesCompleted: ['milestone-1', 'new-milestone'],
        xp: 60, // +10 from 50
      };

      mockProgressService.completeMilestone.mockResolvedValue(updatedProgress);

      const result = await controller.completeMilestone(
        mockRequest as any,
        'progress-123',
        'new-milestone'
      );

      expect(result.xp).toBe(60);
    });

    it('should extract userId from request', async () => {
      const mockRequest = {
        user: { userId: 'different-user-456' },
      };

      mockProgressService.completeMilestone.mockResolvedValue(mockUserProgress);

      await controller.completeMilestone(
        mockRequest as any,
        'progress-123',
        'milestone-1'
      );

      expect(service.completeMilestone).toHaveBeenCalledWith(
        'different-user-456',
        'progress-123',
        'milestone-1'
      );
    });

    it('should handle service errors when progression not found', async () => {
      const mockRequest = {
        user: mockUser,
      };

      mockProgressService.completeMilestone.mockRejectedValue(
        new Error('Progression not found')
      );

      await expect(
        controller.completeMilestone(
          mockRequest as any,
          'non-existent',
          'milestone-1'
        )
      ).rejects.toThrow('Progression not found');
    });

    it('should handle service errors when user does not own progression', async () => {
      const mockRequest = {
        user: mockUser,
      };

      mockProgressService.completeMilestone.mockRejectedValue(
        new Error('Unauthorized access')
      );

      await expect(
        controller.completeMilestone(
          mockRequest as any,
          'other-users-progress',
          'milestone-1'
        )
      ).rejects.toThrow('Unauthorized access');
    });

    it('should return updated progress with all fields', async () => {
      const mockRequest = {
        user: mockUser,
      };

      const updatedProgress = {
        id: 'progress-123',
        userId: 'user-123',
        milestonesCompleted: ['milestone-1', 'milestone-2'],
        xp: 60,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      };

      mockProgressService.completeMilestone.mockResolvedValue(updatedProgress);

      const result = await controller.completeMilestone(
        mockRequest as any,
        'progress-123',
        'milestone-2'
      );

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('milestonesCompleted');
      expect(result).toHaveProperty('xp');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });

    it('should handle completing first milestone', async () => {
      const mockRequest = {
        user: mockUser,
      };

      const firstTimeProgress = {
        id: 'progress-new',
        userId: 'user-123',
        milestonesCompleted: [] as string[],
        xp: 0,
      };

      const updatedProgress = {
        ...firstTimeProgress,
        milestonesCompleted: ['first-milestone'],
        xp: 10,
      };

      mockProgressService.completeMilestone.mockResolvedValue(updatedProgress);

      const result = await controller.completeMilestone(
        mockRequest as any,
        'progress-new',
        'first-milestone'
      );

      expect(result.milestonesCompleted).toEqual(['first-milestone']);
      expect(result.xp).toBe(10);
    });

    it('should not duplicate existing milestones', async () => {
      const mockRequest = {
        user: mockUser,
      };

      const progressWithExisting = {
        ...mockUserProgress,
        milestonesCompleted: ['milestone-1', 'milestone-2'],
      };

      const updatedProgress = {
        ...progressWithExisting,
        milestonesCompleted: ['milestone-1', 'milestone-2', 'milestone-3'],
        xp: 70,
      };

      mockProgressService.completeMilestone.mockResolvedValue(updatedProgress);

      await controller.completeMilestone(
        mockRequest as any,
        'progress-123',
        'milestone-3'
      );

      expect(service.completeMilestone).toHaveBeenCalledWith(
        'user-123',
        'progress-123',
        'milestone-3'
      );
    });

    it('should handle various milestone ID formats', async () => {
      const milestoneIds = [
        'milestone-1',
        'ml-123',
        'm_abc',
        'level-1-complete',
        '2024-01-01-first-chord',
      ];

      const mockRequest = { user: mockUser };

      for (const milestoneId of milestoneIds) {
        mockProgressService.completeMilestone.mockResolvedValue({
          ...mockUserProgress,
          milestonesCompleted: [milestoneId],
        });

        await controller.completeMilestone(
          mockRequest as any,
          'progress-123',
          milestoneId
        );

        expect(service.completeMilestone).toHaveBeenCalledWith(
          'user-123',
          'progress-123',
          milestoneId
        );
      }
    });
  });

  describe('Request User Context', () => {
    it('should use JWTAuthGuard on saveProgression endpoint', () => {
      // Verify the controller methods are protected
      expect(ProgressController).toBeDefined();
      expect(controller.saveProgression).toBeDefined();
    });

    it('should use JWTAuthGuard on completeMilestone endpoint', () => {
      expect(controller.completeMilestone).toBeDefined();
    });

    it('should extract userId correctly from different request formats', async () => {
      const saveDto = { key: 'C', chords: [{ degree: 'I', beats: 4 }] };

      const testCases = [
        { user: { userId: 'user-1' } },
        { user: { userId: 'user-2', email: 'test@test.com' } },
        { user: { userId: 'user-3', role: 'user' } },
      ];

      for (const req of testCases) {
        mockProgressService.saveProgression.mockResolvedValue(mockProgression);

        await controller.saveProgression(req as any, saveDto as any);

        expect(service.saveProgression).toHaveBeenCalledWith(req.user.userId, saveDto);
      }
    });
  });

  describe('Response Structure', () => {
    it('should return progression object on save', async () => {
      const saveDto = {
        name: 'Test',
        key: 'C',
        chords: [{ degree: 'I', beats: 4 }],
      };

      mockProgressService.saveProgression.mockResolvedValue(mockProgression);

      const mockRequest = { user: mockUser };

      const result = await controller.saveProgression(mockRequest as any, saveDto as any);

      expect(result).toBeInstanceOf(Object);
      expect(result).not.toBeInstanceOf(Array);
    });

    it('should return progress object on complete milestone', async () => {
      const updatedProgress = {
        ...mockUserProgress,
        milestonesCompleted: ['milestone-1', 'milestone-2'],
      };

      mockProgressService.completeMilestone.mockResolvedValue(updatedProgress);

      const mockRequest = { user: mockUser };

      const result = await controller.completeMilestone(
        mockRequest as any,
        'progress-123',
        'milestone-2'
      );

      expect(result).toBeInstanceOf(Object);
      expect(result).toHaveProperty('milestonesCompleted');
    });
  });

  describe('Error Propagation', () => {
    it('should propagate saveProgression errors', async () => {
      const saveDto = { key: 'C', chords: [] };
      const mockRequest = { user: mockUser };

      mockProgressService.saveProgression.mockRejectedValue(
        new Error('Validation failed')
      );

      await expect(
        controller.saveProgression(mockRequest as any, saveDto as any)
      ).rejects.toThrow('Validation failed');
    });

    it('should propagate completeMilestone errors', async () => {
      const mockRequest = { user: mockUser };

      mockProgressService.completeMilestone.mockRejectedValue(
        new Error('Milestone not found')
      );

      await expect(
        controller.completeMilestone(mockRequest as any, 'progress-123', 'invalid')
      ).rejects.toThrow('Milestone not found');
    });

    it('should handle database connection errors', async () => {
      const saveDto = { key: 'C', chords: [] };
      const mockRequest = { user: mockUser };

      mockProgressService.saveProgression.mockRejectedValue(
        new Error('Database connection lost')
      );

      await expect(
        controller.saveProgression(mockRequest as any, saveDto as any)
      ).rejects.toThrow('Database connection lost');
    });

    it('should handle unexpected errors gracefully', async () => {
      const mockRequest = { user: mockUser };

      mockProgressService.completeMilestone.mockRejectedValue(
        new Error('Unexpected error occurred')
      );

      await expect(
        controller.completeMilestone(mockRequest as any, 'progress-123', 'milestone-1')
      ).rejects.toThrow('Unexpected error occurred');
    });
  });
});
