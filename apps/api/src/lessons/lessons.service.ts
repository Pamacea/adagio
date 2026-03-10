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
export class LessonsService {
  async getLessons(category?: string, level?: string, userId?: string) {
    const where: any = {
      isPublished: true,
    };

    if (category) where.category = category;
    if (level) where.level = level;

    const lessons = await prisma.lesson.findMany({
      where,
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    });

    // If userId provided, include progress for each lesson
    const lessonsWithProgress = await Promise.all(
      lessons.map(async (lesson) => {
        let progress = null;
        if (userId) {
          progress = await prisma.lessonProgress.findUnique({
            where: {
              userId_lessonId: { userId, lessonId: lesson.id },
            },
          });
        }

        return {
          id: lesson.id,
          slug: lesson.slug,
          title: lesson.title,
          description: lesson.description,
          category: lesson.category,
          level: lesson.level,
          duration: lesson.duration,
          xp: lesson.xp,
          topics: parseJsonField<string[]>(lesson.topics),
          order: lesson.order,
          progress: progress
            ? {
                status: progress.status,
                currentSection: progress.currentSection,
                completedSections: parseJsonField<string[]>(progress.completedSections),
                xp: progress.xp,
                startedAt: progress.startedAt,
                completedAt: progress.completedAt,
                lastAccessed: progress.lastAccessed,
              }
            : null,
        };
      }),
    );

    return lessonsWithProgress;
  }

  async getLessonBySlug(slug: string, userId?: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { slug },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson ${slug} not found`);
    }

    let progress = null;
    if (userId) {
      progress = await prisma.lessonProgress.findUnique({
        where: {
          userId_lessonId: { userId, lessonId: lesson.id },
        },
      });
    }

    return {
      id: lesson.id,
      slug: lesson.slug,
      title: lesson.title,
      description: lesson.description,
      category: lesson.category,
      level: lesson.level,
      duration: lesson.duration,
      xp: lesson.xp,
      topics: parseJsonField<string[]>(lesson.topics),
      content: lesson.content,
      order: lesson.order,
      progress: progress
        ? {
            status: progress.status,
            currentSection: progress.currentSection,
            completedSections: parseJsonField<string[]>(progress.completedSections),
            xp: progress.xp,
            startedAt: progress.startedAt,
            completedAt: progress.completedAt,
            lastAccessed: progress.lastAccessed,
          }
        : null,
    };
  }

  async startLessonBySlug(userId: string, slug: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson ${slug} not found`);
    }

    return this.startLesson(userId, lesson.id);
  }

  async updateProgressBySlug(
    userId: string,
    slug: string,
    data: {
      currentSection?: number;
      completedSections?: string[];
      status?: string;
      xp?: number;
    },
  ) {
    const lesson = await prisma.lesson.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson ${slug} not found`);
    }

    return this.updateProgress(userId, lesson.id, data);
  }

  async startLesson(userId: string, lessonId: string) {
    // Check if lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // Check if progress already exists
    const existing = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: { userId, lessonId },
      },
    });

    if (existing) {
      // Update last accessed
      return prisma.lessonProgress.update({
        where: {
          userId_lessonId: { userId, lessonId },
        },
        data: {
          lastAccessed: new Date(),
          status: existing.status === 'not-started' ? 'in-progress' : existing.status,
        },
      });
    }

    // Create new progress
    return prisma.lessonProgress.create({
      data: {
        userId,
        lessonId,
        status: 'in-progress',
        startedAt: new Date(),
        lastAccessed: new Date(),
        completedSections: [],
        currentSection: 0,
        xp: 0,
      },
    });
  }

  async updateProgress(
    userId: string,
    lessonId: string,
    data: {
      currentSection?: number;
      completedSections?: string[];
      status?: string;
      xp?: number;
    },
  ) {
    // Check if progress exists
    const existing = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: { userId, lessonId },
      },
    });

    if (!existing) {
      throw new NotFoundException('Lesson progress not found. Start the lesson first.');
    }

    const updateData: any = {
      lastAccessed: new Date(),
    };

    if (data.currentSection !== undefined) {
      updateData.currentSection = data.currentSection;
    }

    if (data.completedSections) {
      const existingCompleted = parseJsonField<string[]>(existing.completedSections);
      const newCompleted = [...new Set([...existingCompleted, ...data.completedSections])];
      updateData.completedSections = newCompleted as any;
    }

    if (data.status) {
      updateData.status = data.status;
      if (data.status === 'completed' && !existing.completedAt) {
        updateData.completedAt = new Date();
      }
    }

    if (data.xp !== undefined) {
      updateData.xp = data.xp;
    }

    // Update user total XP
    const updatedProgress = await prisma.lessonProgress.update({
      where: {
        userId_lessonId: { userId, lessonId },
      },
      data: updateData,
    });

    // If lesson is completed, update user preferences
    if (data.status === 'completed' && !existing.completedAt) {
      const xpGained = updatedProgress.xp - existing.xp;
      await prisma.userPreferences.upsert({
        where: { userId },
        create: { userId, totalXP: xpGained },
        update: { totalXP: { increment: xpGained } },
      });
    }

    return updatedProgress;
  }

  async getUserLessonProgress(userId: string) {
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
      completedSections: parseJsonField<string[]>(p.completedSections),
      xp: p.xp,
      startedAt: p.startedAt,
      completedAt: p.completedAt,
      lastAccessed: p.lastAccessed,
      lesson: p.lesson,
    }));
  }

  async getLessonCategories() {
    const categories = await prisma.lesson.findMany({
      where: { isPublished: true },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });

    return categories.map((c) => c.category);
  }

  async getLessonLevels() {
    return ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
  }
}
