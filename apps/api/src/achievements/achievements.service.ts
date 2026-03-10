import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@adagio/database';

// Helper function to safely parse JSON fields
function parseJsonField<T>(value: unknown): T {
  if (value === null || value === undefined) {
    return [] as T;
  }
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return [] as T;
    }
  }
  return (value as T) ?? ([] as T);
}

@Injectable()
export class AchievementsService {
  async getAchievements(category?: string, rarity?: string) {
    const where: any = {};

    if (category) where.category = category;
    if (rarity) where.rarity = rarity;

    const achievements = await prisma.achievement.findMany({
      where,
      orderBy: [{ category: 'asc' }, { rarity: 'asc' }, { title: 'asc' }],
    });

    return achievements.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      description: a.description,
      category: a.category,
      xp: a.xp,
      target: a.target,
      rarity: a.rarity,
      icon: a.icon,
    }));
  }

  async getAchievement(idOrSlug: string) {
    const achievement = await prisma.achievement.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
    });

    if (!achievement) {
      throw new NotFoundException('Achievement not found');
    }

    return {
      id: achievement.id,
      slug: achievement.slug,
      title: achievement.title,
      description: achievement.description,
      category: achievement.category,
      xp: achievement.xp,
      target: achievement.target,
      rarity: achievement.rarity,
      icon: achievement.icon,
    };
  }

  async getUserAchievements(userId: string, category?: string) {
    const where: any = { userId };

    if (category) {
      where.achievement = { category };
    }

    const userAchievements = await prisma.userAchievement.findMany({
      where,
      include: {
        achievement: true,
      },
      orderBy: { unlockedAt: 'desc' },
    });

    return userAchievements.map((ua) => ({
      id: ua.id,
      progress: ua.progress,
      target: ua.target,
      unlockedAt: ua.unlockedAt,
      completedAt: ua.completedAt,
      achievement: {
        id: ua.achievement.id,
        slug: ua.achievement.slug,
        title: ua.achievement.title,
        description: ua.achievement.description,
        category: ua.achievement.category,
        xp: ua.achievement.xp,
        rarity: ua.achievement.rarity,
        icon: ua.achievement.icon,
      },
    }));
  }

  async updateProgress(
    userId: string,
    achievementId: string,
    progressDelta: number,
  ) {
    // Check if achievement exists
    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId },
    });

    if (!achievement) {
      throw new NotFoundException('Achievement not found');
    }

    // Check if user achievement exists
    const existing = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: { userId, achievementId },
      },
    });

    if (existing) {
      // Update existing progress
      const newProgress = Math.min(existing.progress + progressDelta, achievement.target);
      const isNowUnlocked = newProgress >= achievement.target && !existing.unlockedAt;
      const isNowCompleted = newProgress >= achievement.target;

      const updated = await prisma.userAchievement.update({
        where: {
          userId_achievementId: { userId, achievementId },
        },
        data: {
          progress: newProgress,
          unlockedAt: isNowUnlocked ? new Date() : existing.unlockedAt,
          completedAt: isNowCompleted && !existing.completedAt ? new Date() : existing.completedAt,
        },
      });

      // If newly unlocked, award XP
      if (isNowUnlocked) {
        await prisma.userPreferences.upsert({
          where: { userId },
          create: { userId, totalXP: achievement.xp },
          update: { totalXP: { increment: achievement.xp } },
        });
      }

      return updated;
    } else {
      // Create new user achievement
      const newProgress = Math.min(progressDelta, achievement.target);
      const isUnlocked = newProgress >= achievement.target;

      const created = await prisma.userAchievement.create({
        data: {
          userId,
          achievementId,
          progress: newProgress,
          target: achievement.target,
          unlockedAt: isUnlocked ? new Date() : null,
          completedAt: isUnlocked ? new Date() : null,
        },
      });

      // If unlocked, award XP
      if (isUnlocked) {
        await prisma.userPreferences.upsert({
          where: { userId },
          create: { userId, totalXP: achievement.xp },
          update: { totalXP: { increment: achievement.xp } },
        });
      }

      return created;
    }
  }

  async unlockAchievement(userId: string, achievementId: string) {
    // Force unlock achievement (for admin/testing)
    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId },
    });

    if (!achievement) {
      throw new NotFoundException('Achievement not found');
    }

    const updated = await prisma.userAchievement.upsert({
      where: {
        userId_achievementId: { userId, achievementId },
      },
      create: {
        userId,
        achievementId,
        progress: achievement.target,
        target: achievement.target,
        unlockedAt: new Date(),
        completedAt: new Date(),
      },
      update: {
        progress: achievement.target,
        unlockedAt: new Date(),
        completedAt: new Date(),
      },
    });

    // Award XP
    await prisma.userPreferences.upsert({
      where: { userId },
      create: { userId, totalXP: achievement.xp },
      update: { totalXP: { increment: achievement.xp } },
    });

    return updated;
  }

  async getUserAchievementProgress(userId: string) {
    const [userAchievements, totalAchievements, userPreferences] = await Promise.all([
      prisma.userAchievement.findMany({
        where: { userId },
        include: { achievement: true },
      }),
      prisma.achievement.count(),
      prisma.userPreferences.findUnique({
        where: { userId },
      }),
    ]);

    const unlockedCount = userAchievements.filter((ua) => ua.unlockedAt).length;
    const completedCount = userAchievements.filter((ua) => ua.completedAt).length;
    const totalXP = userPreferences?.totalXP || 0;
    const level = userPreferences?.level || 1;

    // Group by category
    const byCategory = userAchievements.reduce((acc, ua) => {
      const cat = ua.achievement.category;
      if (!acc[cat]) {
        acc[cat] = { unlocked: 0, total: 0, inProgress: 0 };
      }
      acc[cat].total++;
      if (ua.unlockedAt) acc[cat].unlocked++;
      else if (ua.progress > 0) acc[cat].inProgress++;
      return acc;
    }, {} as Record<string, { unlocked: number; total: number; inProgress: number }>);

    // Get total achievements per category
    const categoryTotals = await prisma.achievement.groupBy({
      by: ['category'],
      _count: { id: true },
    });

    categoryTotals.forEach((ct) => {
      if (!byCategory[ct.category]) {
        byCategory[ct.category] = { unlocked: 0, total: ct._count.id, inProgress: 0 };
      } else {
        byCategory[ct.category].total = ct._count.id;
      }
    });

    // Calculate next level
    const xpForNextLevel = level * 1000;
    const xpProgress = totalXP % 1000;

    return {
      overview: {
        total: totalAchievements,
        unlocked: unlockedCount,
        completed: completedCount,
        inProgress: userAchievements.filter((ua) => !ua.unlockedAt && ua.progress > 0).length,
        locked: totalAchievements - userAchievements.length,
        percentage: Math.round((unlockedCount / totalAchievements) * 100),
      },
      byCategory,
      xp: {
        total: totalXP,
        level,
        currentLevelXP: xpProgress,
        nextLevelXP: xpForNextLevel,
        progressToNext: Math.round((xpProgress / 1000) * 100),
      },
      recent: userAchievements
        .filter((ua) => ua.unlockedAt)
        .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0))
        .slice(0, 5)
        .map((ua) => ({
          slug: ua.achievement.slug,
          title: ua.achievement.title,
          rarity: ua.achievement.rarity,
          unlockedAt: ua.unlockedAt,
        })),
    };
  }

  async getAchievementCategories() {
    const achievements = await prisma.achievement.findMany({
      select: { category: true },
      distinct: ['category'],
    });

    return achievements.map((a) => a.category);
  }

  async getRarities() {
    return ['common', 'rare', 'epic', 'legendary'];
  }
}
