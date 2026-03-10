import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ColorService } from './color.service';

@ApiTags('color')
@Controller('color')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Get('modes')
  @ApiOperation({ summary: 'Get all mode colors with emotions' })
  getAllModes() {
    return this.colorService.getAllModes();
  }

  @Get('modes/:mode')
  @ApiOperation({ summary: 'Get specific mode color' })
  @ApiParam({ name: 'mode', example: 'ionian', description: 'Mode name (ionian, dorian, phrygian, lydian, mixolydian, aeolian, locrian)' })
  getMode(@Param('mode') mode: string) {
    const result = this.colorService.getMode(mode);
    if (!result) {
      throw new NotFoundException(`Mode "${mode}" not found`);
    }
    return result;
  }

  @Get('degrees')
  @ApiOperation({ summary: 'Get degree colors for tonality' })
  @ApiQuery({ name: 'tonality', required: false, enum: ['major', 'minor'], example: 'major' })
  getDegrees(@Query('tonality') tonality: 'major' | 'minor' = 'major') {
    return this.colorService.getDegrees(tonality);
  }

  @Get('degrees/:degree')
  @ApiOperation({ summary: 'Get specific degree color' })
  @ApiParam({ name: 'degree', example: '0', description: 'Degree index (0-6) where 0=I, 1=ii, 2=iii, etc.' })
  @ApiQuery({ name: 'tonality', required: false, enum: ['major', 'minor'], example: 'major' })
  getDegree(
    @Param('degree') degree: string,
    @Query('tonality') tonality: 'major' | 'minor' = 'major'
  ) {
    const degreeNum = parseInt(degree, 10);
    if (isNaN(degreeNum) || degreeNum < 0 || degreeNum > 6) {
      throw new NotFoundException(`Degree must be a number between 0 and 6`);
    }
    const result = this.colorService.getDegree(degreeNum, tonality);
    if (!result) {
      throw new NotFoundException(`Degree "${degree}" not found`);
    }
    return result;
  }

  @Get('chord-quality/:quality')
  @ApiOperation({ summary: 'Get chord quality color' })
  @ApiParam({ name: 'quality', example: 'major', description: 'Chord quality (major, minor, diminished)', enum: ['major', 'minor', 'diminished'] })
  getChordQuality(@Param('quality') quality: string) {
    const result = this.colorService.getChordQuality(quality);
    if (!result) {
      throw new NotFoundException(`Chord quality "${quality}" not found`);
    }
    return result;
  }
}
