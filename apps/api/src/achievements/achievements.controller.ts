import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AchievementsService } from './achievements.service';

@ApiTags('achievements')
@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all achievements' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'rarity', required: false })
  async getAchievements(
    @Query('category') category?: string,
    @Query('rarity') rarity?: string,
  ) {
    return this.achievementsService.getAchievements(category, rarity);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get achievement categories' })
  async getCategories() {
    return this.achievementsService.getAchievementCategories();
  }

  @Get('rarities')
  @ApiOperation({ summary: 'Get achievement rarities' })
  async getRarities() {
    return this.achievementsService.getRarities();
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user achievements' })
  @ApiQuery({ name: 'category', required: false })
  async getUserAchievements(
    @Request() req,
    @Query('category') category?: string,
  ) {
    return this.achievementsService.getUserAchievements(req.user.userId, category);
  }

  @Get('user/progress')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user achievement progress overview' })
  async getUserProgress(@Request() req) {
    return this.achievementsService.getUserAchievementProgress(req.user.userId);
  }

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get achievement details by ID or slug' })
  @ApiParam({ name: 'idOrSlug', example: 'first-riff' })
  async getAchievement(@Param('idOrSlug') idOrSlug: string) {
    return this.achievementsService.getAchievement(idOrSlug);
  }

  @Post(':id/unlock')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unlock an achievement (admin/testing)' })
  @ApiParam({ name: 'id', example: 'clxxx...' })
  async unlockAchievement(@Request() req, @Param('id') id: string) {
    return this.achievementsService.unlockAchievement(req.user.userId, id);
  }

  @Post(':id/progress')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update achievement progress' })
  @ApiParam({ name: 'id', example: 'clxxx...' })
  @ApiQuery({ name: 'delta', required: true, example: '1' })
  async updateProgress(
    @Request() req,
    @Param('id') id: string,
    @Query('delta') delta: string,
  ) {
    return this.achievementsService.updateProgress(
      req.user.userId,
      id,
      parseInt(delta, 10) || 1,
    );
  }
}
