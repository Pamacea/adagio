import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LessonsService } from './lessons.service';
import { UpdateLessonProgressDto } from './dto/update-lesson-progress.dto';

@ApiTags('lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all lessons' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'level', required: false })
  async getLessons(
    @Query('category') category?: string,
    @Query('level') level?: string,
  ) {
    return this.lessonsService.getLessons(category, level);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all lesson categories' })
  async getCategories() {
    return this.lessonsService.getLessonCategories();
  }

  @Get('levels')
  @ApiOperation({ summary: 'Get all lesson levels' })
  async getLevels() {
    return this.lessonsService.getLessonLevels();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get lesson details by slug' })
  @ApiParam({ name: 'slug', example: 'major-scale-basics' })
  async getLessonBySlug(@Param('slug') slug: string) {
    return this.lessonsService.getLessonBySlug(slug);
  }

  @Post(':slug/start')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Start a lesson' })
  @ApiParam({ name: 'slug', example: 'major-scale-basics' })
  async startLesson(@Request() req, @Param('slug') slug: string) {
    return this.lessonsService.startLessonBySlug(req.user.userId, slug);
  }

  @Patch(':slug/progress')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update lesson progress' })
  @ApiParam({ name: 'slug', example: 'major-scale-basics' })
  async updateProgress(
    @Request() req,
    @Param('slug') slug: string,
    @Query() dto: UpdateLessonProgressDto,
  ) {
    return this.lessonsService.updateProgressBySlug(req.user.userId, slug, dto);
  }
}
