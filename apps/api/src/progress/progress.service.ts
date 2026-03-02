import { Injectable } from '@nestjs/common';
import { prisma } from '@adagio/database';
import { SaveProgressionDto } from './dto/save-progression.dto';

@Injectable()
export class ProgressService {
  async saveProgression(userId: string, dto: SaveProgressionDto) {
    return prisma.progression.create({
      data: {
        userId,
        name: dto.name,
        key: dto.key,
        timeSignature: dto.timeSignature || '4/4',
        chords: dto.chords as any,
      },
    });
  }

  async completeMilestone(userId: string, progressionId: string, milestoneId: string) {
    const progress = await prisma.userProgress.findUnique({
      where: { id: progressionId },
    });

    if (!progress || progress.userId !== userId) {
      throw new Error('Progression not found');
    }

    const milestonesCompleted = progress.milestonesCompleted as string[] || [];

    return prisma.userProgress.update({
      where: { id: progressionId },
      data: {
        milestonesCompleted: [...milestonesCompleted, milestoneId],
        xp: { increment: 10 },
      },
    });
  }
}
