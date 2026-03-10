import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { prisma } from '@adagio/database';
import * as bcrypt from 'bcrypt';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        preferences: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const { preferences, ...userData } = updateProfileDto;

    // Update user
    const user = await prisma.user.update({
      where: { id: userId },
      data: userData,
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
      },
    });

    // Update preferences if provided
    if (preferences) {
      await prisma.userPreferences.upsert({
        where: { userId },
        create: { userId, ...preferences },
        update: preferences,
      });
    }

    return this.getProfile(userId);
  }

  async getProgressions(userId: string) {
    const progressions = await prisma.progression.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    return progressions;
  }

  async getProgress(userId: string) {
    const progress = await prisma.userProgress.findMany({
      where: { userId },
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

    const learned = progress.filter(p => p.status === 'learned' || p.status === 'mastered').length;
    const total = await prisma.technique.count();

    return {
      progress,
      stats: {
        total,
        learned,
        inProgress: progress.filter(p => p.status === 'in-progress').length,
        mastered: progress.filter(p => p.status === 'mastered').length,
      },
    };
  }

  async getStats(userId: string) {
    const [preferences, techniqueProgress, lessonProgress, achievements, practiceSessions] =
      await Promise.all([
        prisma.userPreferences.findUnique({ where: { userId } }),
        prisma.userProgress.findMany({ where: { userId } }),
        prisma.lessonProgress.findMany({ where: { userId } }),
        prisma.userAchievement.findMany({ where: { userId } }),
        prisma.practiceSession.findMany({
          where: { userId },
          orderBy: { date: 'desc' },
          take: 30, // Last 30 sessions
        }),
      ]);

    const totalXP = preferences?.totalXP || 0;
    const level = preferences?.level || 1;

    // Calculate level progress (1000 XP per level)
    const currentLevelXP = totalXP % 1000;
    const xpToNextLevel = 1000 - currentLevelXP;

    // Technique stats
    const totalTechniques = await prisma.technique.count();
    const masteredTechniques = techniqueProgress.filter((p) => p.status === 'mastered').length;
    const learnedTechniques = techniqueProgress.filter(
      (p) => p.status === 'learned' || p.status === 'mastered',
    ).length;

    // Lesson stats
    const totalLessons = await prisma.lesson.count({ where: { isPublished: true } });
    const completedLessons = lessonProgress.filter((p) => p.status === 'completed').length;
    const inProgressLessons = lessonProgress.filter((p) => p.status === 'in-progress').length;

    // Achievement stats
    const totalAchievements = await prisma.achievement.count();
    const unlockedAchievements = achievements.filter((a) => a.unlockedAt).length;

    // Practice stats
    const totalPracticeMinutes = practiceSessions.reduce((sum, s) => sum + s.duration, 0);
    const totalPracticeHours = Math.round((totalPracticeMinutes / 60) * 10) / 10;
    const avgSessionDuration =
      practiceSessions.length > 0
        ? Math.round((totalPracticeMinutes / practiceSessions.length) * 10) / 10
        : 0;

    // Calculate streak (consecutive days with practice)
    const streak = this.calculateStreak(practiceSessions);

    return {
      xp: {
        total: totalXP,
        level,
        currentLevelXP,
        xpToNextLevel,
        progressPercent: Math.round((currentLevelXP / 1000) * 100),
      },
      techniques: {
        total: totalTechniques,
        learned: learnedTechniques,
        mastered: masteredTechniques,
        inProgress: techniqueProgress.filter((p) => p.status === 'in-progress').length,
        completionPercent: Math.round((learnedTechniques / totalTechniques) * 100),
      },
      lessons: {
        total: totalLessons,
        completed: completedLessons,
        inProgress: inProgressLessons,
        completionPercent: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      },
      achievements: {
        total: totalAchievements,
        unlocked: unlockedAchievements,
        completionPercent: Math.round((unlockedAchievements / totalAchievements) * 100),
      },
      practice: {
        totalSessions: practiceSessions.length,
        totalHours: totalPracticeHours,
        avgSessionMinutes: avgSessionDuration,
        streak,
        thisWeek: await this.getPracticeThisWeek(userId),
        thisMonth: await this.getPracticeThisMonth(userId),
      },
    };
  }

  async getPracticeSessions(userId: string, limit = 30) {
    const sessions = await prisma.practiceSession.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: limit,
    });

    return sessions;
  }

  async getAchievementsSummary(userId: string) {
    const achievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: { unlockedAt: 'desc' },
    });

    const total = await prisma.achievement.count();
    const unlocked = achievements.filter((a) => a.unlockedAt).length;

    // Recent unlocks (last 5)
    const recentUnlocks = achievements
      .filter((a) => a.unlockedAt)
      .slice(0, 5)
      .map((a) => ({
        slug: a.achievement.slug,
        title: a.achievement.title,
        rarity: a.achievement.rarity,
        xp: a.achievement.xp,
        unlockedAt: a.unlockedAt,
      }));

    // In progress
    const inProgress = achievements
      .filter((a) => !a.unlockedAt && a.progress > 0)
      .map((a) => ({
        slug: a.achievement.slug,
        title: a.achievement.title,
        progress: a.progress,
        target: a.target,
        percent: Math.round((a.progress / a.target) * 100),
      }))
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 5);

    return {
      total,
      unlocked,
      locked: total - achievements.length,
      completionPercent: Math.round((unlocked / total) * 100),
      recentUnlocks,
      inProgress,
    };
  }

  async getLessonProgress(userId: string) {
    const progress = await prisma.lessonProgress.findMany({
      where: { userId },
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

    return progress.map((p) => ({
      id: p.id,
      status: p.status,
      currentSection: p.currentSection,
      completedSections: p.completedSections as unknown as string[],
      xp: p.xp,
      startedAt: p.startedAt,
      completedAt: p.completedAt,
      lastAccessed: p.lastAccessed,
      lesson: p.lesson,
    }));
  }

  private calculateStreak(sessions: { date: Date }[]): number {
    if (sessions.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sortedSessions = [...sessions].sort(
      (a, b) => b.date.getTime() - a.date.getTime(),
    );

    let streak = 0;
    let currentDate = today;

    for (const session of sortedSessions) {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor(
        (currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays === 0 || diffDays === 1) {
        streak++;
        currentDate = sessionDate;
      } else {
        break;
      }
    }

    return streak;
  }

  private async getPracticeThisWeek(userId: string): Promise<{ sessions: number; minutes: number }> {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const sessions = await prisma.practiceSession.findMany({
      where: {
        userId,
        date: { gte: weekAgo },
      },
    });

    return {
      sessions: sessions.length,
      minutes: sessions.reduce((sum, s) => sum + s.duration, 0),
    };
  }

  private async getPracticeThisMonth(userId: string): Promise<{ sessions: number; minutes: number }> {
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const sessions = await prisma.practiceSession.findMany({
      where: {
        userId,
        date: { gte: monthAgo },
      },
    });

    return {
      sessions: sessions.length,
      minutes: sessions.reduce((sum, s) => sum + s.duration, 0),
    };
  }

  // ========================================================================
  // PREFERENCES MANAGEMENT
  // ========================================================================

  async getPreferences(userId: string) {
    let preferences = await prisma.userPreferences.findUnique({
      where: { userId },
    });

    // Create default preferences if none exist
    if (!preferences) {
      preferences = await prisma.userPreferences.create({
        data: {
          userId,
          theme: 'midnight',
          showIntervals: true,
          showNotes: true,
          showDegrees: false,
          tuning: 'EADGBE',
          fretCount: 24,
          volume: 0.7,
          metronomeVolume: 0.5,
        },
      });
    }

    return preferences;
  }

  async updatePreferences(userId: string, preferencesData: {
    theme?: string;
    notation?: string;
    sound?: string;
    showIntervals?: boolean;
    showNotes?: boolean;
    showDegrees?: boolean;
    tuning?: string;
    fretCount?: number;
    volume?: number;
    metronomeVolume?: number;
  }) {
    const preferences = await prisma.userPreferences.upsert({
      where: { userId },
      create: {
        userId,
        theme: preferencesData.theme ?? 'midnight',
        showIntervals: preferencesData.showIntervals ?? true,
        showNotes: preferencesData.showNotes ?? true,
        showDegrees: preferencesData.showDegrees ?? false,
        tuning: preferencesData.tuning ?? 'EADGBE',
        fretCount: preferencesData.fretCount ?? 24,
        volume: preferencesData.volume ?? 0.7,
        metronomeVolume: preferencesData.metronomeVolume ?? 0.5,
      },
      update: preferencesData,
    });

    return preferences;
  }

  // ========================================================================
  // PASSWORD MANAGEMENT
  // ========================================================================

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.password) {
      throw new BadRequestException('Account uses OAuth or has no password set');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      throw new ForbiddenException('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(
      changePasswordDto.newPassword,
      SALT_ROUNDS
    );

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: newPasswordHash },
    });

    return { success: true, message: 'Password changed successfully' };
  }

  // ========================================================================
  // ACCOUNT DELETION
  // ========================================================================

  async deleteAccount(userId: string, password?: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If user has password, verify it before deletion
    if (user.password && password) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new ForbiddenException('Password is incorrect');
      }
    }

    // Delete user (cascade will delete related records)
    await prisma.user.delete({
      where: { id: userId },
    });

    return { success: true, message: 'Account deleted successfully' };
  }

  // ========================================================================
  // DATA EXPORT
  // ========================================================================

  async exportUserData(userId: string) {
    const [
      user,
      preferences,
      progress,
      lessonProgress,
      achievements,
      practiceSessions,
      progressions,
    ] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.userPreferences.findUnique({ where: { userId } }),
      prisma.userProgress.findMany({
        where: { userId },
        include: { technique: { select: { id: true, slug: true, name: true } } },
      }),
      prisma.lessonProgress.findMany({
        where: { userId },
        include: { lesson: { select: { id: true, slug: true, title: true } } },
      }),
      prisma.userAchievement.findMany({
        where: { userId },
        include: { achievement: { select: { id: true, slug: true, title: true } } },
      }),
      prisma.practiceSession.findMany({ where: { userId } }),
      prisma.progression.findMany({ where: { userId } }),
    ]);

    return {
      exportedAt: new Date().toISOString(),
      user,
      preferences,
      progress,
      lessonProgress,
      achievements,
      practiceSessions,
      progressions,
    };
  }
}
