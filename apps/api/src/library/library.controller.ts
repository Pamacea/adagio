import { Controller, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LibraryService } from './library.service';

@ApiTags('library')
@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get('techniques')
  async getTechniques(
    @Param('category') category?: string,
    @Param('difficulty') difficulty?: string,
  ) {
    return this.libraryService.getTechniques(category, difficulty);
  }

  @Get('techniques/:id')
  async getTechnique(@Param('id') id: string) {
    return this.libraryService.getTechnique(id);
  }

  @Post('techniques/:id/learn')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async markAsLearned(@Param('id') id: string, @Request() req) {
    return this.libraryService.markAsLearned(req.user.userId, id);
  }
}
