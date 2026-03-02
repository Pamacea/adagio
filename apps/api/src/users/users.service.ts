import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@adagio/database';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        preferences: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        createdAt: true,
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
        technique: true,
      },
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
}
