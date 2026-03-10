import { Controller, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProgressService } from './progress.service';
import { SaveProgressionDto } from './dto/save-progression.dto';

@ApiTags('progress')
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post('progressions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async saveProgression(
    @Request() req,
    @Body() dto: SaveProgressionDto,
  ) {
    return this.progressService.saveProgression(req.user.userId, dto);
  }

  @Post('progressions/:id/complete-milestone')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async completeMilestone(
    @Request() req,
    @Param('id') id: string,
    @Body('milestoneId') milestoneId: string,
  ) {
    return this.progressService.completeMilestone(req.user.userId, id, milestoneId);
  }
}
