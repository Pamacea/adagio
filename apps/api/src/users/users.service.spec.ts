// ============================================================================
// USERS SERVICE TESTS
// ============================================================================
//
// Tests unitaires pour UsersService
// Couvre: getProfile, updateProfile, changePassword
// ============================================================================
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { prisma } from '@adagio/database';

// Mock Prisma
jest.mock('@adagio/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    userPreferences: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      create: jest.fn(),
    },
    progression: {
      findMany: jest.fn(),
    },
    userProgress: {
      findMany: jest.fn(),
    },
    technique: {
      count: jest.fn(),
    },
    lessonProgress: {
      findMany: jest.fn(),
    },
    lesson: {
      count: jest.fn(),
    },
    userAchievement: {
      findMany: jest.fn(),
    },
    achievement: {
      count: jest.fn(),
    },
    practiceSession: {
      findMany: jest.fn(),
    },
  },
}));

// Mock bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;

  // Mock data
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    image: 'https://example.com/avatar.jpg',
    password: '$2b$10$hashedpassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPreferences = {
    userId: 'user-123',
    theme: 'midnight',
    showIntervals: true,
    showNotes: true,
    showDegrees: false,
    tuning: 'EADGBE',
    fretCount: 24,
    volume: 0.7,
    metronomeVolume: 0.5,
    totalXP: 500,
    level: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);

    // Reset mocks
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('getProfile', () => {
    it('should return user profile with preferences', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        ...mockUser,
        preferences: mockPreferences,
      });

      const result = await service.getProfile('user-123');

      expect(result).toHaveProperty('id', 'user-123');
      expect(result).toHaveProperty('email', 'test@example.com');
      expect(result).toHaveProperty('preferences');
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        include: { preferences: true },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.getProfile('nonexistent-id')).rejects.toThrow(
        new NotFoundException('User not found')
      );
    });

    it('should return profile even without preferences', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        ...mockUser,
        preferences: null,
      });

      const result = await service.getProfile('user-123');

      expect(result).toBeDefined();
      expect(result.id).toBe('user-123');
    });
  });

  describe('updateProfile', () => {
    it('should update user name successfully', async () => {
      const updateDto = { name: 'Updated Name' };

      (prisma.user.update as jest.Mock).mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Updated Name',
        image: 'https://example.com/avatar.jpg',
      });

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        ...mockUser,
        name: 'Updated Name',
        preferences: null,
      });

      const result = await service.updateProfile('user-123', updateDto);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: { name: 'Updated Name' },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
        },
      });

      expect(result).toHaveProperty('id', 'user-123');
    });

    it('should update user image successfully', async () => {
      const updateDto = { image: 'https://example.com/new-avatar.jpg' };

      (prisma.user.update as jest.Mock).mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        image: 'https://example.com/new-avatar.jpg',
      });

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        ...mockUser,
        image: 'https://example.com/new-avatar.jpg',
        preferences: null,
      });

      const result = await service.updateProfile('user-123', updateDto);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: { image: 'https://example.com/new-avatar.jpg' },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
        },
      });

      expect(result).toHaveProperty('image', 'https://example.com/new-avatar.jpg');
    });

    it('should update user preferences when provided', async () => {
      const updateDto = {
        name: 'Updated Name',
        preferences: { theme: 'light', showIntervals: false },
      };

      (prisma.user.update as jest.Mock).mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Updated Name',
        image: mockUser.image,
      });

      (prisma.userPreferences.upsert as jest.Mock).mockResolvedValue({
        ...mockPreferences,
        theme: 'light',
        showIntervals: false,
      });

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        ...mockUser,
        preferences: { ...mockPreferences, theme: 'light', showIntervals: false },
      });

      await service.updateProfile('user-123', updateDto);

      expect(prisma.userPreferences.upsert).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        create: {
          userId: 'user-123',
          theme: 'light',
          showIntervals: false,
        },
        update: { theme: 'light', showIntervals: false },
      });
    });

    it('should not update preferences when not provided', async () => {
      const updateDto = { name: 'Updated Name' };

      (prisma.user.update as jest.Mock).mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Updated Name',
        image: mockUser.image,
      });

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        ...mockUser,
        name: 'Updated Name',
        preferences: mockPreferences,
      });

      await service.updateProfile('user-123', updateDto);

      expect(prisma.userPreferences.upsert).not.toHaveBeenCalled();
    });

    it('should update both user data and preferences', async () => {
      const updateDto = {
        name: 'Updated Name',
        image: 'https://example.com/new.jpg',
        preferences: { tuning: 'DADGAD', fretCount: 20 },
      };

      (prisma.user.update as jest.Mock).mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Updated Name',
        image: 'https://example.com/new.jpg',
      });

      (prisma.userPreferences.upsert as jest.Mock).mockResolvedValue({
        ...mockPreferences,
        tuning: 'DADGAD',
        fretCount: 20,
      });

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        ...mockUser,
        name: 'Updated Name',
        image: 'https://example.com/new.jpg',
        preferences: { ...mockPreferences, tuning: 'DADGAD', fretCount: 20 },
      });

      const result = await service.updateProfile('user-123', updateDto);

      expect(prisma.user.update).toHaveBeenCalled();
      expect(prisma.userPreferences.upsert).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should return updated profile with preferences', async () => {
      const updateDto = { name: 'New Name' };

      (prisma.user.update as jest.Mock).mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        name: 'New Name',
        image: mockUser.image,
      });

      const updatedProfile = {
        ...mockUser,
        name: 'New Name',
        preferences: mockPreferences,
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(updatedProfile);

      const result = await service.updateProfile('user-123', updateDto);

      expect(result.name).toBe('New Name');
      expect(result.preferences).toBeDefined();
    });
  });

  describe('changePassword', () => {
    const mockChangePasswordDto = {
      currentPassword: 'CurrentPass123!',
      newPassword: 'NewPass456!',
    };

    it('should change password successfully with valid current password', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        password: '$2b$10$hashedpassword',
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$newhashedpassword');

      (prisma.user.update as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.changePassword('user-123', mockChangePasswordDto);

      expect(result).toEqual({
        success: true,
        message: 'Password changed successfully',
      });

      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockChangePasswordDto.currentPassword,
        '$2b$10$hashedpassword'
      );

      expect(bcrypt.hash).toHaveBeenCalledWith(mockChangePasswordDto.newPassword, 10);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: { password: '$2b$10$newhashedpassword' },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.changePassword('nonexistent-id', mockChangePasswordDto)
      ).rejects.toThrow(new NotFoundException('User not found'));

      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if user has no password (OAuth)', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        password: null,
      });

      await expect(
        service.changePassword('oauth-user', mockChangePasswordDto)
      ).rejects.toThrow(
        new BadRequestException('Account uses OAuth or has no password set')
      );

      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if current password is incorrect', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        password: '$2b$10$hashedpassword',
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.changePassword('user-123', mockChangePasswordDto)
      ).rejects.toThrow(new ForbiddenException('Current password is incorrect'));

      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockChangePasswordDto.currentPassword,
        '$2b$10$hashedpassword'
      );

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('should hash new password with SALT_ROUNDS', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        password: '$2b$10$oldhash',
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$newhash');

      (prisma.user.update as jest.Mock).mockResolvedValue(mockUser);

      await service.changePassword('user-123', mockChangePasswordDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(mockChangePasswordDto.newPassword, 10);
    });

    it('should handle bcrypt compare errors - throws original error', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        password: '$2b$10$hashedpassword',
      });

      (bcrypt.compare as jest.Mock).mockRejectedValue(new Error('bcrypt error'));

      // The service does not catch bcrypt errors, so they are propagated as-is
      await expect(
        service.changePassword('user-123', mockChangePasswordDto)
      ).rejects.toThrow('bcrypt error');
    });

    it('should handle bcrypt hash errors during password update', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        password: '$2b$10$hashedpassword',
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockRejectedValue(new Error('Hash failed'));

      await expect(
        service.changePassword('user-123', mockChangePasswordDto)
      ).rejects.toThrow('Hash failed');
    });
  });

  describe('getProgress', () => {
    it('should return user progress with stats', async () => {
      const mockProgressData = [
        {
          id: 'progress-1',
          userId: 'user-123',
          techniqueId: 'tech-1',
          status: 'mastered',
          xp: 100,
          updatedAt: new Date(),
          technique: {
            id: 'tech-1',
            slug: 'scales-major',
            name: 'Major Scales',
            category: 'scales',
            difficulty: 'intermediate',
          },
        },
        {
          id: 'progress-2',
          userId: 'user-123',
          techniqueId: 'tech-2',
          status: 'in-progress',
          xp: 50,
          updatedAt: new Date(),
          technique: {
            id: 'tech-2',
            slug: 'chords-minor',
            name: 'Minor Chords',
            category: 'chords',
            difficulty: 'beginner',
          },
        },
      ];

      (prisma.userProgress.findMany as jest.Mock).mockResolvedValue(mockProgressData);
      (prisma.technique.count as jest.Mock).mockResolvedValue(100);

      const result = await service.getProgress('user-123');

      expect(result).toHaveProperty('progress');
      expect(result).toHaveProperty('stats');
      expect(result.stats).toEqual({
        total: 100,
        learned: 1,
        inProgress: 1,
        mastered: 1,
      });

      expect(prisma.userProgress.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        include: {
          technique: {
            select: {
              id: true,
              slug: true,
              name: true,
              category: true,
              difficulty: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });
    });

    it('should handle empty progress data', async () => {
      (prisma.userProgress.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.technique.count as jest.Mock).mockResolvedValue(100);

      const result = await service.getProgress('user-123');

      expect(result.progress).toEqual([]);
      expect(result.stats).toEqual({
        total: 100,
        learned: 0,
        inProgress: 0,
        mastered: 0,
      });
    });
  });

  describe('getProgressions', () => {
    it('should return user progressions ordered by updatedAt', async () => {
      const mockProgressions = [
        {
          id: 'prog-1',
          userId: 'user-123',
          lessonId: 'lesson-1',
          status: 'in-progress',
          updatedAt: new Date('2024-01-02'),
        },
        {
          id: 'prog-2',
          userId: 'user-123',
          lessonId: 'lesson-2',
          status: 'completed',
          updatedAt: new Date('2024-01-05'),
        },
      ];

      (prisma.progression.findMany as jest.Mock).mockResolvedValue(mockProgressions);

      const result = await service.getProgressions('user-123');

      expect(result).toEqual(mockProgressions);
      expect(prisma.progression.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        orderBy: { updatedAt: 'desc' },
      });
    });

    it('should return empty array for user with no progressions', async () => {
      (prisma.progression.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.getProgressions('user-123');

      expect(result).toEqual([]);
    });
  });

  describe('deleteAccount', () => {
    it('should delete account with password verification', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        password: '$2b$10$hashedpassword',
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      (prisma.user.delete as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.deleteAccount('user-123', 'CurrentPass123!');

      expect(result).toEqual({
        success: true,
        message: 'Account deleted successfully',
      });

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: 'user-123' },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.deleteAccount('nonexistent-id')).rejects.toThrow(
        new NotFoundException('User not found')
      );

      expect(prisma.user.delete).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException with incorrect password', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        password: '$2b$10$hashedpassword',
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.deleteAccount('user-123', 'WrongPassword')).rejects.toThrow(
        new ForbiddenException('Password is incorrect')
      );

      expect(prisma.user.delete).not.toHaveBeenCalled();
    });

    it('should allow deletion for OAuth user without password', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        password: null,
      });

      (prisma.user.delete as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.deleteAccount('oauth-user');

      expect(result).toEqual({
        success: true,
        message: 'Account deleted successfully',
      });

      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: 'oauth-user' },
      });
    });
  });

  describe('getPreferences', () => {
    it('should return existing user preferences', async () => {
      (prisma.userPreferences.findUnique as jest.Mock).mockResolvedValue(mockPreferences);

      const result = await service.getPreferences('user-123');

      expect(result).toEqual(mockPreferences);
      expect(prisma.userPreferences.create).not.toHaveBeenCalled();
    });

    it('should create default preferences if none exist', async () => {
      (prisma.userPreferences.findUnique as jest.Mock).mockResolvedValue(null);

      const defaultPreferences = {
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

      (prisma.userPreferences.create as jest.Mock).mockResolvedValue(defaultPreferences);

      const result = await service.getPreferences('user-123');

      expect(result).toEqual(defaultPreferences);
      expect(prisma.userPreferences.create).toHaveBeenCalledWith({
        data: defaultPreferences,
      });
    });
  });

  describe('updatePreferences', () => {
    it('should update existing preferences via upsert', async () => {
      const updateData = { theme: 'light', volume: 0.9 };

      const updatedPrefs = { ...mockPreferences, ...updateData };
      (prisma.userPreferences.upsert as jest.Mock).mockResolvedValue(updatedPrefs);

      const result = await service.updatePreferences('user-123', updateData);

      expect(result).toEqual(updatedPrefs);
      expect(prisma.userPreferences.upsert).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        create: expect.objectContaining({
          userId: 'user-123',
          theme: 'light',
          volume: 0.9,
        }),
        update: updateData,
      });
    });

    it('should use default values for missing preferences on create', async () => {
      const updateData = { theme: 'light' };

      const updatedPrefs = { ...mockPreferences, theme: 'light' };
      (prisma.userPreferences.upsert as jest.Mock).mockResolvedValue(updatedPrefs);

      await service.updatePreferences('user-123', updateData);

      expect(prisma.userPreferences.upsert).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        create: expect.objectContaining({
          userId: 'user-123',
          theme: 'light',
          showIntervals: true,
          showNotes: true,
          showDegrees: false,
          tuning: 'EADGBE',
          fretCount: 24,
          volume: 0.7,
          metronomeVolume: 0.5,
        }),
        update: updateData,
      });
    });
  });

  describe('getStats', () => {
    it('should return complete user statistics', async () => {
      (prisma.userPreferences.findUnique as jest.Mock).mockResolvedValue(mockPreferences);
      (prisma.userProgress.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.lessonProgress.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.userAchievement.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.practiceSession.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.technique.count as jest.Mock).mockResolvedValue(50);
      (prisma.lesson.count as jest.Mock).mockResolvedValue(20);
      (prisma.achievement.count as jest.Mock).mockResolvedValue(30);

      jest.spyOn(service as any, 'getPracticeThisWeek').mockResolvedValue({
        sessions: 3,
        minutes: 120,
      });

      jest.spyOn(service as any, 'getPracticeThisMonth').mockResolvedValue({
        sessions: 10,
        minutes: 400,
      });

      const result = await service.getStats('user-123');

      expect(result).toHaveProperty('xp');
      expect(result).toHaveProperty('techniques');
      expect(result).toHaveProperty('lessons');
      expect(result).toHaveProperty('achievements');
      expect(result).toHaveProperty('practice');

      expect(result.xp).toEqual({
        total: 500,
        level: 1,
        currentLevelXP: 500,
        xpToNextLevel: 500,
        progressPercent: 50,
      });
    });

    it('should handle user with no preferences (use defaults)', async () => {
      (prisma.userPreferences.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.userProgress.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.lessonProgress.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.userAchievement.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.practiceSession.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.technique.count as jest.Mock).mockResolvedValue(0);
      (prisma.lesson.count as jest.Mock).mockResolvedValue(0);
      (prisma.achievement.count as jest.Mock).mockResolvedValue(0);

      jest.spyOn(service as any, 'getPracticeThisWeek').mockResolvedValue({
        sessions: 0,
        minutes: 0,
      });

      jest.spyOn(service as any, 'getPracticeThisMonth').mockResolvedValue({
        sessions: 0,
        minutes: 0,
      });

      const result = await service.getStats('user-123');

      expect(result.xp.total).toBe(0);
      expect(result.xp.level).toBe(1);
    });
  });

  describe('getPracticeSessions', () => {
    it('should return practice sessions with default limit', async () => {
      const mockSessions = [
        { id: 'session-1', userId: 'user-123', duration: 30, date: new Date() },
        { id: 'session-2', userId: 'user-123', duration: 45, date: new Date() },
      ];

      (prisma.practiceSession.findMany as jest.Mock).mockResolvedValue(mockSessions);

      const result = await service.getPracticeSessions('user-123');

      expect(result).toEqual(mockSessions);
      expect(prisma.practiceSession.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        orderBy: { date: 'desc' },
        take: 30,
      });
    });

    it('should respect custom limit parameter', async () => {
      const mockSessions = [{ id: 'session-1', userId: 'user-123', duration: 30, date: new Date() }];

      (prisma.practiceSession.findMany as jest.Mock).mockResolvedValue(mockSessions);

      await service.getPracticeSessions('user-123', 10);

      expect(prisma.practiceSession.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        orderBy: { date: 'desc' },
        take: 10,
      });
    });
  });

  describe('getAchievementsSummary', () => {
    it('should return achievements summary with recent unlocks and in-progress', async () => {
      const mockUserAchievements = [
        {
          id: 'ua-1',
          userId: 'user-123',
          achievementId: 'ach-1',
          progress: 10,
          target: 10,
          unlockedAt: new Date('2024-01-01'),
          achievement: {
            id: 'ach-1',
            slug: 'first-practice',
            title: 'First Practice',
            rarity: 'common',
            xp: 50,
          },
        },
        {
          id: 'ua-2',
          userId: 'user-123',
          achievementId: 'ach-2',
          progress: 5,
          target: 10,
          unlockedAt: null,
          achievement: {
            id: 'ach-2',
            slug: 'practice-streak',
            title: 'Practice Streak',
            rarity: 'rare',
            xp: 100,
          },
        },
      ];

      (prisma.userAchievement.findMany as jest.Mock).mockResolvedValue(mockUserAchievements);
      (prisma.achievement.count as jest.Mock).mockResolvedValue(30);

      const result = await service.getAchievementsSummary('user-123');

      expect(result).toHaveProperty('total', 30);
      expect(result).toHaveProperty('unlocked', 1);
      expect(result).toHaveProperty('locked');
      expect(result).toHaveProperty('completionPercent');
      expect(result).toHaveProperty('recentUnlocks');
      expect(result).toHaveProperty('inProgress');

      expect(result.recentUnlocks).toHaveLength(1);
      expect(result.recentUnlocks[0]).toMatchObject({
        slug: 'first-practice',
        title: 'First Practice',
        rarity: 'common',
      });

      expect(result.inProgress).toHaveLength(1);
      expect(result.inProgress[0]).toMatchObject({
        slug: 'practice-streak',
        progress: 5,
        target: 10,
        percent: 50,
      });
    });

    it('should handle user with no achievements', async () => {
      (prisma.userAchievement.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.achievement.count as jest.Mock).mockResolvedValue(30);

      const result = await service.getAchievementsSummary('user-123');

      expect(result.total).toBe(30);
      expect(result.unlocked).toBe(0);
      expect(result.locked).toBe(30);
      expect(result.recentUnlocks).toEqual([]);
      expect(result.inProgress).toEqual([]);
    });
  });

  describe('getLessonProgress', () => {
    it('should return lesson progress with lesson details', async () => {
      const mockLessonProgress = [
        {
          id: 'lp-1',
          userId: 'user-123',
          lessonId: 'lesson-1',
          status: 'in-progress',
          currentSection: 2,
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

      (prisma.lessonProgress.findMany as jest.Mock).mockResolvedValue(mockLessonProgress);

      const result = await service.getLessonProgress('user-123');

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'lp-1',
        status: 'in-progress',
        currentSection: 2,
      });

      expect(result[0].lesson).toMatchObject({
        slug: 'major-scales',
        title: 'Major Scales',
        category: 'scales',
      });
    });

    it('should return empty array for user with no lesson progress', async () => {
      (prisma.lessonProgress.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.getLessonProgress('user-123');

      expect(result).toEqual([]);
    });
  });

  describe('exportUserData', () => {
    it('should export all user data', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        image: 'https://example.com/avatar.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.userPreferences.findUnique as jest.Mock).mockResolvedValue(mockPreferences);
      (prisma.userProgress.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.lessonProgress.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.userAchievement.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.practiceSession.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.progression.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.exportUserData('user-123');

      expect(result).toHaveProperty('exportedAt');
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('preferences');
      expect(result).toHaveProperty('progress');
      expect(result).toHaveProperty('lessonProgress');
      expect(result).toHaveProperty('achievements');
      expect(result).toHaveProperty('practiceSessions');
      expect(result).toHaveProperty('progressions');

      expect(result.user).toMatchObject({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      });
    });
  });
});
