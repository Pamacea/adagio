import { Controller, Get, Patch, Post, Delete, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(req.user.userId, updateProfileDto);
  }

  @Get('me/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user statistics (XP, level, practice)' })
  async getStats(@Request() req) {
    return this.usersService.getStats(req.user.userId);
  }

  @Get('me/practice')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user practice sessions' })
  async getPracticeSessions(@Request() req) {
    return this.usersService.getPracticeSessions(req.user.userId);
  }

  @Get('me/achievements')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user achievements summary' })
  async getAchievements(@Request() req) {
    return this.usersService.getAchievementsSummary(req.user.userId);
  }

  @Get('me/lessons')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user lesson progress' })
  async getLessons(@Request() req) {
    return this.usersService.getLessonProgress(req.user.userId);
  }

  @Get('me/progressions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user progressions' })
  async getProgressions(@Request() req) {
    return this.usersService.getProgressions(req.user.userId);
  }

  @Get('me/progress')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user technique progress' })
  async getProgress(@Request() req) {
    return this.usersService.getProgress(req.user.userId);
  }

  // ========================================================================
  // PREFERENCES
  // ========================================================================

  @Get('me/preferences')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user preferences' })
  async getPreferences(@Request() req) {
    return this.usersService.getPreferences(req.user.userId);
  }

  @Patch('me/preferences')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user preferences' })
  async updatePreferences(
    @Request() req,
    @Body() preferencesData: Record<string, unknown>,
  ) {
    return this.usersService.updatePreferences(req.user.userId, preferencesData);
  }

  // ========================================================================
  // PASSWORD MANAGEMENT
  // ========================================================================

  @Patch('me/password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change current user password' })
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(req.user.userId, changePasswordDto);
  }

  // ========================================================================
  // ACCOUNT DELETION
  // ========================================================================

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete current user account' })
  async deleteAccount(
    @Request() req,
    @Body() body: { password?: string },
  ) {
    return this.usersService.deleteAccount(req.user.userId, body.password);
  }

  // ========================================================================
  // DATA EXPORT
  // ========================================================================

  @Get('me/export')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Export all user data (JSON)' })
  async exportData(@Request() req) {
    return this.usersService.exportUserData(req.user.userId);
  }
}
