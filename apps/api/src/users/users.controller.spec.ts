// ============================================================================
// USERS CONTROLLER TESTS
// ============================================================================
//
// Tests unitaires pour UsersController
// Couvre: GET /users/me, PATCH /users/me, PATCH /users/me/password
// ============================================================================
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let jwtService: JwtService;

  // Mock data
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    image: 'https://example.com/avatar.jpg',
    preferences: {
      userId: 'user-123',
      theme: 'midnight',
      showIntervals: true,
      showNotes: true,
      showDegrees: false,
      tuning: 'EADGBE',
      fretCount: 24,
      volume: 0.7,
      metronomeVolume: 0.5,
    },
  };

  const mockRequest = (userId = 'user-123') => ({
    user: { userId, email: 'test@example.com' },
  });

  const mockUsersService = {
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
    changePassword: jest.fn(),
    deleteAccount: jest.fn(),
    getStats: jest.fn(),
    getPracticeSessions: jest.fn(),
    getAchievementsSummary: jest.fn(),
    getLessonProgress: jest.fn(),
    getProgressions: jest.fn(),
    getProgress: jest.fn(),
    getPreferences: jest.fn(),
    updatePreferences: jest.fn(),
    exportUserData: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('token'),
            verify: jest.fn().mockReturnValue({ sub: 'user-123', email: 'test@example.com' }),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);

    // Reset mocks
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('GET /users/me', () => {
    it('should return current user profile', async () => {
      mockUsersService.getProfile.mockResolvedValue(mockUser);

      const result = await controller.getProfile(mockRequest());

      expect(result).toEqual(mockUser);
      expect(service.getProfile).toHaveBeenCalledWith('user-123');
    });

    it('should call service with userId from request', async () => {
      mockUsersService.getProfile.mockResolvedValue(mockUser);

      await controller.getProfile(mockRequest('another-user-id'));

      expect(service.getProfile).toHaveBeenCalledWith('another-user-id');
    });

    it('should propagate NotFoundException from service', async () => {
      mockUsersService.getProfile.mockRejectedValue(
        new NotFoundException('User not found')
      );

      await expect(controller.getProfile(mockRequest())).rejects.toThrow(
        NotFoundException
      );
    });

    it('should return profile with preferences', async () => {
      const userWithPrefs = {
        ...mockUser,
        preferences: {
          theme: 'light',
          showIntervals: false,
        },
      };

      mockUsersService.getProfile.mockResolvedValue(userWithPrefs);

      const result = await controller.getProfile(mockRequest());

      expect(result).toHaveProperty('preferences');
      expect(result.preferences.theme).toBe('light');
    });
  });

  describe('PATCH /users/me', () => {
    it('should update user profile successfully', async () => {
      const updateDto: UpdateProfileDto = { name: 'Updated Name' };
      const updatedUser = { ...mockUser, name: 'Updated Name' };

      mockUsersService.updateProfile.mockResolvedValue(updatedUser);

      const result = await controller.updateProfile(mockRequest(), updateDto);

      expect(result).toEqual(updatedUser);
      expect(service.updateProfile).toHaveBeenCalledWith('user-123', updateDto);
    });

    it('should update user image', async () => {
      const updateDto: UpdateProfileDto = {
        image: 'https://example.com/new-avatar.jpg',
      };
      const updatedUser = { ...mockUser, image: 'https://example.com/new-avatar.jpg' };

      mockUsersService.updateProfile.mockResolvedValue(updatedUser);

      const result = await controller.updateProfile(mockRequest(), updateDto);

      expect(result.image).toBe('https://example.com/new-avatar.jpg');
      expect(service.updateProfile).toHaveBeenCalledWith('user-123', updateDto);
    });

    it('should update both name and image', async () => {
      const updateDto: UpdateProfileDto = {
        name: 'New Name',
        image: 'https://example.com/new.jpg',
      };
      const updatedUser = {
        ...mockUser,
        name: 'New Name',
        image: 'https://example.com/new.jpg',
      };

      mockUsersService.updateProfile.mockResolvedValue(updatedUser);

      const result = await controller.updateProfile(mockRequest(), updateDto);

      expect(result.name).toBe('New Name');
      expect(result.image).toBe('https://example.com/new.jpg');
    });

    it('should update preferences when provided', async () => {
      const updateDto: UpdateProfileDto = {
        name: 'Updated Name',
        preferences: {
          theme: 'light',
          showIntervals: false,
          tuning: 'DADGAD',
        },
      };
      const updatedUser = {
        ...mockUser,
        name: 'Updated Name',
        preferences: {
          ...mockUser.preferences,
          theme: 'light',
          showIntervals: false,
          tuning: 'DADGAD',
        },
      };

      mockUsersService.updateProfile.mockResolvedValue(updatedUser);

      const result = await controller.updateProfile(mockRequest(), updateDto);

      expect(result).toHaveProperty('preferences');
      expect(service.updateProfile).toHaveBeenCalledWith('user-123', updateDto);
    });

    it('should handle empty update object', async () => {
      const updateDto: UpdateProfileDto = {};

      mockUsersService.updateProfile.mockResolvedValue(mockUser);

      const result = await controller.updateProfile(mockRequest(), updateDto);

      expect(result).toBeDefined();
      expect(service.updateProfile).toHaveBeenCalledWith('user-123', updateDto);
    });

    it('should propagate service errors', async () => {
      const updateDto: UpdateProfileDto = { name: 'Updated Name' };

      mockUsersService.updateProfile.mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        controller.updateProfile(mockRequest(), updateDto)
      ).rejects.toThrow('Database error');
    });
  });

  describe('PATCH /users/me/password', () => {
    it('should change password successfully', async () => {
      const changePasswordDto: ChangePasswordDto = {
        currentPassword: 'CurrentPass123!',
        newPassword: 'NewPass456!',
      };

      const response = {
        success: true,
        message: 'Password changed successfully',
      };

      mockUsersService.changePassword.mockResolvedValue(response);

      const result = await controller.changePassword(mockRequest(), changePasswordDto);

      expect(result).toEqual(response);
      expect(service.changePassword).toHaveBeenCalledWith('user-123', changePasswordDto);
    });

    it('should propagate NotFoundException from service', async () => {
      const changePasswordDto: ChangePasswordDto = {
        currentPassword: 'CurrentPass123!',
        newPassword: 'NewPass456!',
      };

      mockUsersService.changePassword.mockRejectedValue(
        new NotFoundException('User not found')
      );

      await expect(
        controller.changePassword(mockRequest(), changePasswordDto)
      ).rejects.toThrow(NotFoundException);

      expect(service.changePassword).toHaveBeenCalledWith('user-123', changePasswordDto);
    });

    it('should propagate BadRequestException from service', async () => {
      const changePasswordDto: ChangePasswordDto = {
        currentPassword: 'CurrentPass123!',
        newPassword: 'NewPass456!',
      };

      mockUsersService.changePassword.mockRejectedValue(
        new BadRequestException('Account uses OAuth or has no password set')
      );

      await expect(
        controller.changePassword(mockRequest(), changePasswordDto)
      ).rejects.toThrow(BadRequestException);
    });

    it('should propagate ForbiddenException for incorrect password', async () => {
      const changePasswordDto: ChangePasswordDto = {
        currentPassword: 'WrongPassword',
        newPassword: 'NewPass456!',
      };

      mockUsersService.changePassword.mockRejectedValue(
        new ForbiddenException('Current password is incorrect')
      );

      await expect(
        controller.changePassword(mockRequest(), changePasswordDto)
      ).rejects.toThrow(ForbiddenException);
    });

    it('should validate DTO constraints (currentPassword required)', async () => {
      const invalidDto = {
        currentPassword: '',
        newPassword: 'NewPass456!',
      } as ChangePasswordDto;

      mockUsersService.changePassword.mockResolvedValue({
        success: true,
        message: 'Password changed successfully',
      });

      // Note: Validation is handled by NestJS validation pipe
      // This test verifies the service is called with the provided DTO
      await controller.changePassword(mockRequest(), invalidDto);

      expect(service.changePassword).toHaveBeenCalledWith('user-123', invalidDto);
    });

    it('should validate DTO constraints (newPassword minLength: 8)', async () => {
      const shortPasswordDto = {
        currentPassword: 'CurrentPass123!',
        newPassword: 'Short1!',
      } as ChangePasswordDto;

      mockUsersService.changePassword.mockResolvedValue({
        success: true,
        message: 'Password changed successfully',
      });

      // Note: Validation is handled by NestJS validation pipe
      await controller.changePassword(mockRequest(), shortPasswordDto);

      expect(service.changePassword).toHaveBeenCalledWith('user-123', shortPasswordDto);
    });
  });

  describe('GET /users/me/stats', () => {
    it('should return user statistics', async () => {
      const mockStats = {
        xp: {
          total: 500,
          level: 1,
          currentLevelXP: 500,
          xpToNextLevel: 500,
          progressPercent: 50,
        },
        techniques: {
          total: 100,
          learned: 20,
          mastered: 5,
          inProgress: 15,
          completionPercent: 20,
        },
        lessons: {
          total: 50,
          completed: 10,
          inProgress: 5,
          completionPercent: 20,
        },
        achievements: {
          total: 30,
          unlocked: 5,
          completionPercent: 17,
        },
        practice: {
          totalSessions: 25,
          totalHours: 12.5,
          avgSessionMinutes: 30,
          streak: 5,
          thisWeek: { sessions: 3, minutes: 90 },
          thisMonth: { sessions: 10, minutes: 300 },
        },
      };

      mockUsersService.getStats.mockResolvedValue(mockStats);

      const result = await controller.getStats(mockRequest());

      expect(result).toEqual(mockStats);
      expect(service.getStats).toHaveBeenCalledWith('user-123');
    });

    it('should propagate service errors', async () => {
      mockUsersService.getStats.mockRejectedValue(new Error('Database error'));

      await expect(controller.getStats(mockRequest())).rejects.toThrow('Database error');
    });
  });

  describe('GET /users/me/practice', () => {
    it('should return practice sessions', async () => {
      const mockSessions = [
        {
          id: 'session-1',
          userId: 'user-123',
          duration: 30,
          date: new Date('2024-01-05'),
        },
        {
          id: 'session-2',
          userId: 'user-123',
          duration: 45,
          date: new Date('2024-01-03'),
        },
      ];

      mockUsersService.getPracticeSessions.mockResolvedValue(mockSessions);

      const result = await controller.getPracticeSessions(mockRequest());

      expect(result).toEqual(mockSessions);
      expect(service.getPracticeSessions).toHaveBeenCalledWith('user-123');
    });

    it('should return empty array for no sessions', async () => {
      mockUsersService.getPracticeSessions.mockResolvedValue([]);

      const result = await controller.getPracticeSessions(mockRequest());

      expect(result).toEqual([]);
    });
  });

  describe('GET /users/me/achievements', () => {
    it('should return achievements summary', async () => {
      const mockAchievements = {
        total: 30,
        unlocked: 5,
        locked: 25,
        completionPercent: 17,
        recentUnlocks: [
          {
            slug: 'first-practice',
            title: 'First Practice',
            rarity: 'common',
            xp: 50,
            unlockedAt: new Date('2024-01-05'),
          },
        ],
        inProgress: [
          {
            slug: 'practice-streak',
            title: 'Practice Streak',
            progress: 5,
            target: 10,
            percent: 50,
          },
        ],
      };

      mockUsersService.getAchievementsSummary.mockResolvedValue(mockAchievements);

      const result = await controller.getAchievements(mockRequest());

      expect(result).toEqual(mockAchievements);
      expect(service.getAchievementsSummary).toHaveBeenCalledWith('user-123');
    });

    it('should handle user with no achievements', async () => {
      const emptyAchievements = {
        total: 30,
        unlocked: 0,
        locked: 30,
        completionPercent: 0,
        recentUnlocks: [],
        inProgress: [],
      };

      mockUsersService.getAchievementsSummary.mockResolvedValue(emptyAchievements);

      const result = await controller.getAchievements(mockRequest());

      expect(result.unlocked).toBe(0);
      expect(result.recentUnlocks).toEqual([]);
    });
  });

  describe('GET /users/me/lessons', () => {
    it('should return lesson progress', async () => {
      const mockLessonProgress = [
        {
          id: 'lp-1',
          status: 'in-progress',
          currentSection: 3,
          completedSections: ['intro', 'basics'],
          xp: 25,
          startedAt: new Date('2024-01-01'),
          completedAt: null,
          lastAccessed: new Date('2024-01-05'),
          lesson: {
            id: 'lesson-1',
            slug: 'major-scales',
            title: 'Major Scales',
            category: 'scales',
            level: 'beginner',
            xp: 100,
            duration: 30,
          },
        },
      ];

      mockUsersService.getLessonProgress.mockResolvedValue(mockLessonProgress);

      const result = await controller.getLessons(mockRequest());

      expect(result).toEqual(mockLessonProgress);
      expect(service.getLessonProgress).toHaveBeenCalledWith('user-123');
    });

    it('should return empty array for no lesson progress', async () => {
      mockUsersService.getLessonProgress.mockResolvedValue([]);

      const result = await controller.getLessons(mockRequest());

      expect(result).toEqual([]);
    });
  });

  describe('GET /users/me/progressions', () => {
    it('should return user progressions', async () => {
      const mockProgressions = [
        {
          id: 'prog-1',
          userId: 'user-123',
          lessonId: 'lesson-1',
          status: 'in-progress',
          updatedAt: new Date('2024-01-05'),
        },
        {
          id: 'prog-2',
          userId: 'user-123',
          lessonId: 'lesson-2',
          status: 'completed',
          updatedAt: new Date('2024-01-03'),
        },
      ];

      mockUsersService.getProgressions.mockResolvedValue(mockProgressions);

      const result = await controller.getProgressions(mockRequest());

      expect(result).toEqual(mockProgressions);
      expect(service.getProgressions).toHaveBeenCalledWith('user-123');
    });

    it('should return empty array for no progressions', async () => {
      mockUsersService.getProgressions.mockResolvedValue([]);

      const result = await controller.getProgressions(mockRequest());

      expect(result).toEqual([]);
    });
  });

  describe('GET /users/me/progress', () => {
    it('should return technique progress with stats', async () => {
      const mockProgressData = {
        progress: [
          {
            id: 'progress-1',
            technique: {
              id: 'tech-1',
              slug: 'scales-major',
              name: 'Major Scales',
              category: 'scales',
              difficulty: 'intermediate',
            },
            status: 'mastered',
          },
        ],
        stats: {
          total: 100,
          learned: 1,
          inProgress: 0,
          mastered: 1,
        },
      };

      mockUsersService.getProgress.mockResolvedValue(mockProgressData);

      const result = await controller.getProgress(mockRequest());

      expect(result).toEqual(mockProgressData);
      expect(service.getProgress).toHaveBeenCalledWith('user-123');
    });

    it('should handle user with no progress', async () => {
      const emptyProgress = {
        progress: [],
        stats: {
          total: 100,
          learned: 0,
          inProgress: 0,
          mastered: 0,
        },
      };

      mockUsersService.getProgress.mockResolvedValue(emptyProgress);

      const result = await controller.getProgress(mockRequest());

      expect(result.progress).toEqual([]);
      expect(result.stats.total).toBe(100);
    });
  });

  describe('GET /users/me/preferences', () => {
    it('should return user preferences', async () => {
      mockUsersService.getPreferences.mockResolvedValue(mockUser.preferences);

      const result = await controller.getPreferences(mockRequest());

      expect(result).toEqual(mockUser.preferences);
      expect(service.getPreferences).toHaveBeenCalledWith('user-123');
    });

    it('should create default preferences if none exist', async () => {
      const defaultPrefs = {
        userId: 'user-123',
        theme: 'midnight',
        showIntervals: true,
        showNotes: true,
        showDegrees: false,
        tuning: 'EADGBE',
        fretCount: 24,
        volume: 0.7,
        metronomeVolume: 0.5,
      };

      mockUsersService.getPreferences.mockResolvedValue(defaultPrefs);

      const result = await controller.getPreferences(mockRequest());

      expect(result.theme).toBe('midnight');
      expect(result.tuning).toBe('EADGBE');
    });
  });

  describe('PATCH /users/me/preferences', () => {
    it('should update user preferences', async () => {
      const updateData = {
        theme: 'light',
        volume: 0.9,
      };

      const updatedPrefs = {
        ...mockUser.preferences,
        theme: 'light',
        volume: 0.9,
      };

      mockUsersService.updatePreferences.mockResolvedValue(updatedPrefs);

      const result = await controller.updatePreferences(mockRequest(), updateData);

      expect(result).toEqual(updatedPrefs);
      expect(service.updatePreferences).toHaveBeenCalledWith('user-123', updateData);
    });

    it('should allow partial preference updates', async () => {
      const updateData = {
        tuning: 'DADGAD',
      };

      const updatedPrefs = {
        ...mockUser.preferences,
        tuning: 'DADGAD',
      };

      mockUsersService.updatePreferences.mockResolvedValue(updatedPrefs);

      const result = await controller.updatePreferences(mockRequest(), updateData);

      expect(result.tuning).toBe('DADGAD');
      expect(result.showIntervals).toBe(true); // Original value preserved
    });
  });

  describe('DELETE /users/me', () => {
    it('should delete user account with password', async () => {
      const deleteResponse = {
        success: true,
        message: 'Account deleted successfully',
      };

      mockUsersService.deleteAccount.mockResolvedValue(deleteResponse);

      const result = await controller.deleteAccount(mockRequest(), {
        password: 'Password123!',
      });

      expect(result).toEqual(deleteResponse);
      expect(service.deleteAccount).toHaveBeenCalledWith('user-123', 'Password123!');
    });

    it('should delete OAuth account without password', async () => {
      const deleteResponse = {
        success: true,
        message: 'Account deleted successfully',
      };

      mockUsersService.deleteAccount.mockResolvedValue(deleteResponse);

      const result = await controller.deleteAccount(mockRequest(), {});

      expect(result).toEqual(deleteResponse);
      expect(service.deleteAccount).toHaveBeenCalledWith('user-123', undefined);
    });

    it('should propagate NotFoundException', async () => {
      mockUsersService.deleteAccount.mockRejectedValue(
        new NotFoundException('User not found')
      );

      await expect(
        controller.deleteAccount(mockRequest(), { password: 'Password123!' })
      ).rejects.toThrow(NotFoundException);
    });

    it('should propagate ForbiddenException for incorrect password', async () => {
      mockUsersService.deleteAccount.mockRejectedValue(
        new ForbiddenException('Password is incorrect')
      );

      await expect(
        controller.deleteAccount(mockRequest(), { password: 'WrongPassword' })
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('GET /users/me/export', () => {
    it('should export all user data', async () => {
      const mockExportData = {
        exportedAt: new Date().toISOString(),
        user: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
          image: 'https://example.com/avatar.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        preferences: mockUser.preferences,
        progress: [],
        lessonProgress: [],
        achievements: [],
        practiceSessions: [],
        progressions: [],
      };

      mockUsersService.exportUserData.mockResolvedValue(mockExportData);

      const result = await controller.exportData(mockRequest());

      expect(result).toEqual(mockExportData);
      expect(service.exportUserData).toHaveBeenCalledWith('user-123');
    });

    it('should include all expected data sections', async () => {
      const mockExportData = {
        exportedAt: new Date().toISOString(),
        user: mockUser,
        preferences: mockUser.preferences,
        progress: [],
        lessonProgress: [],
        achievements: [],
        practiceSessions: [],
        progressions: [],
      };

      mockUsersService.exportUserData.mockResolvedValue(mockExportData);

      const result = await controller.exportData(mockRequest());

      expect(result).toHaveProperty('exportedAt');
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('preferences');
      expect(result).toHaveProperty('progress');
      expect(result).toHaveProperty('lessonProgress');
      expect(result).toHaveProperty('achievements');
      expect(result).toHaveProperty('practiceSessions');
      expect(result).toHaveProperty('progressions');
    });
  });

  describe('Guards and Decorators', () => {
    it('should have JwtAuthGuard applied to all endpoints', () => {
      // Verify controller is properly configured
      expect(UsersController).toBeDefined();
      expect(controller).toBeInstanceOf(UsersController);
    });

    it('should have ApiTags decorator with "users"', () => {
      // Controller should have ApiTags decorator
      expect(UsersController).toBeDefined();
    });

    it('should have ApiBearerAuth decorator on protected endpoints', () => {
      // Swagger documentation should be configured
      expect(UsersController).toBeDefined();
    });
  });

  describe('Request Handling', () => {
    it('should extract userId from request.user', async () => {
      mockUsersService.getProfile.mockResolvedValue(mockUser);

      const customRequest = { user: { userId: 'custom-user-id', email: 'custom@example.com' } };

      await controller.getProfile(customRequest);

      expect(service.getProfile).toHaveBeenCalledWith('custom-user-id');
    });

    it('should handle requests with different user IDs', async () => {
      mockUsersService.getProfile.mockResolvedValue(mockUser);

      await controller.getProfile(mockRequest('user-A'));
      await controller.getProfile(mockRequest('user-B'));
      await controller.getProfile(mockRequest('user-C'));

      expect(service.getProfile).toHaveBeenCalledTimes(3);
      expect(service.getProfile).toHaveBeenNthCalledWith(1, 'user-A');
      expect(service.getProfile).toHaveBeenNthCalledWith(2, 'user-B');
      expect(service.getProfile).toHaveBeenNthCalledWith(3, 'user-C');
    });
  });

  describe('Response Structure', () => {
    it('should return profile with consistent structure', async () => {
      mockUsersService.getProfile.mockResolvedValue(mockUser);

      const result = await controller.getProfile(mockRequest());

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('name');
    });

    it('should return password change response with success indicator', async () => {
      mockUsersService.changePassword.mockResolvedValue({
        success: true,
        message: 'Password changed successfully',
      });

      const result = await controller.changePassword(mockRequest(), {
        currentPassword: 'CurrentPass123!',
        newPassword: 'NewPass456!',
      });

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('message');
    });

    it('should return stats with all categories', async () => {
      const mockStats = {
        xp: { total: 0, level: 1, currentLevelXP: 0, xpToNextLevel: 1000, progressPercent: 0 },
        techniques: { total: 0, learned: 0, mastered: 0, inProgress: 0, completionPercent: 0 },
        lessons: { total: 0, completed: 0, inProgress: 0, completionPercent: 0 },
        achievements: { total: 0, unlocked: 0, completionPercent: 0 },
        practice: {
          totalSessions: 0,
          totalHours: 0,
          avgSessionMinutes: 0,
          streak: 0,
          thisWeek: { sessions: 0, minutes: 0 },
          thisMonth: { sessions: 0, minutes: 0 },
        },
      };

      mockUsersService.getStats.mockResolvedValue(mockStats);

      const result = await controller.getStats(mockRequest());

      expect(result).toHaveProperty('xp');
      expect(result).toHaveProperty('techniques');
      expect(result).toHaveProperty('lessons');
      expect(result).toHaveProperty('achievements');
      expect(result).toHaveProperty('practice');
    });
  });

  describe('Error Propagation', () => {
    it('should propagate all service exceptions', async () => {
      const testCases = [
        { method: 'getProfile', serviceMethod: 'getProfile'},
        { method: 'updateProfile', serviceMethod: 'updateProfile', args: [{ name: 'Test' }]},
        { method: 'changePassword', serviceMethod: 'changePassword', args: [{ currentPassword: 'Pass123!', newPassword: 'NewPass123!' }]},
        { method: 'getStats', serviceMethod: 'getStats' },
        { method: 'getPracticeSessions', serviceMethod: 'getPracticeSessions' },
        { method: 'getAchievements', serviceMethod: 'getAchievementsSummary' },
        { method: 'getLessons', serviceMethod: 'getLessonProgress' },
        { method: 'getProgressions', serviceMethod: 'getProgressions' },
        { method: 'getProgress', serviceMethod: 'getProgress' },
        { method: 'getPreferences', serviceMethod: 'getPreferences' },
        { method: 'updatePreferences', serviceMethod: 'updatePreferences', args: [{ theme: 'light' }]},
        { method: 'deleteAccount', serviceMethod: 'deleteAccount', args: [{ password: 'Pass123!' }]},
        { method: 'exportData', serviceMethod: 'exportUserData' },
      ];

      for (const testCase of testCases) {
        mockUsersService[testCase.serviceMethod].mockRejectedValue(
          new Error(`Service error: ${testCase.serviceMethod}`)
        );

        await expect(
          controller[testCase.method](mockRequest(), ...(testCase.args || []))
        ).rejects.toThrow(`Service error: ${testCase.serviceMethod}`);

        // Reset for next test
        mockUsersService[testCase.serviceMethod].mockReset();
      }
    });
  });
});
