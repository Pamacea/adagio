import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@adagio/database';

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
      tips: tech.tips ? JSON.parse(tech.tips) : [],
      prerequisites: tech.prerequisites ? JSON.parse(tech.prerequisites) : [],
      relatedTechniques: tech.relatedTechniques ? JSON.parse(tech.relatedTechniques) : [],
      estimatedPracticeTime: tech.estimatedPracticeTime,
      milestones: tech.milestones ? JSON.parse(tech.milestones) : [],
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
      tips: technique.tips ? JSON.parse(technique.tips) : [],
      prerequisites: technique.prerequisites ? JSON.parse(technique.prerequisites) : [],
      relatedTechniques: technique.relatedTechniques ? JSON.parse(technique.relatedTechniques) : [],
      estimatedPracticeTime: technique.estimatedPracticeTime,
      milestones: technique.milestones ? JSON.parse(technique.milestones) : [],
    };
  }

  async markAsLearned(userId: string, techniqueId: string) {
    return prisma.userProgress.upsert({
      where: {
        userId_techniqueId: { userId, techniqueId },
      },
      create: {
        userId,
        techniqueId,
        status: 'learned',
        xp: 100,
        practiceCount: 1,
        totalPracticeTime: 0,
      },
      update: {
        status: 'learned',
        xp: { increment: 10 },
        practiceCount: { increment: 1 },
      },
    });
  }
}
