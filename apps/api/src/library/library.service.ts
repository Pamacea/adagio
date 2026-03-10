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
  // Already an object/array
  return (value as T) ?? ([] as T);
}

@Injectable()
export class LibraryService {
  async getTechniques(category?: string, difficulty?: string) {
    const where: any = {};

    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;

    const techniques = await prisma.technique.findMany({
      where,
      orderBy: [{ difficulty: 'asc' }, { name: 'asc' }],
    });

    return techniques.map(tech => ({
      id: tech.id,
      slug: tech.slug,
      name: tech.name,
      category: tech.category,
      difficulty: tech.difficulty,
      description: tech.description,
      diagramUrl: tech.diagramUrl,
      videoUrl: tech.videoUrl,
      audioExample: tech.audioExample,
      notation: tech.notation,
      tips: parseJsonField<string[]>(tech.tips),
      prerequisites: parseJsonField<string[]>(tech.prerequisites),
      relatedTechniques: parseJsonField<string[]>(tech.relatedTechniques),
      estimatedPracticeTime: tech.estimatedPracticeTime,
      milestones: parseJsonField<string[]>(tech.milestones),
    }));
  }

  async getTechnique(id: string) {
    const technique = await prisma.technique.findUnique({
      where: { id },
    });

    if (!technique) {
      throw new NotFoundException('Technique not found');
    }

    return {
      id: technique.id,
      slug: technique.slug,
      name: technique.name,
      category: technique.category,
      difficulty: technique.difficulty,
      description: technique.description,
      diagramUrl: technique.diagramUrl,
      videoUrl: technique.videoUrl,
      audioExample: technique.audioExample,
      notation: technique.notation,
      tips: parseJsonField<string[]>(technique.tips),
      prerequisites: parseJsonField<string[]>(technique.prerequisites),
      relatedTechniques: parseJsonField<string[]>(technique.relatedTechniques),
      estimatedPracticeTime: technique.estimatedPracticeTime,
      milestones: parseJsonField<string[]>(technique.milestones),
    };
  }

  async markAsLearned(userId: string, techniqueId: string) {
    // Check if progress already exists
    const existing = await prisma.userProgress.findUnique({
      where: {
        userId_techniqueId: { userId, techniqueId },
      },
    });

    if (existing) {
      // Update existing progress
      return prisma.userProgress.update({
        where: {
          userId_techniqueId: { userId, techniqueId },
        },
        data: {
          status: 'learned',
          xp: { increment: 10 },
          practiceCount: { increment: 1 },
        },
      });
    } else {
      // Create new progress
      return prisma.userProgress.create({
        data: {
          userId,
          techniqueId,
          status: 'learned',
          xp: 100,
          practiceCount: 1,
          totalPracticeTime: 0,
        },
      } as any);
    }
  }
}
