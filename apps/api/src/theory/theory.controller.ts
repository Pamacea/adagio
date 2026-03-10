import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TheoryService } from './theory.service';
import { AnalyzeProgressionDto } from './dto/analyze-progression.dto';

@ApiTags('theory')
@Controller('theory')
export class TheoryController {
  constructor(private readonly theoryService: TheoryService) {}

  @Get('keys')
  @ApiOperation({ summary: 'Get all musical keys' })
  getAllKeys() {
    return this.theoryService.getAllKeys();
  }

  @Get('modes')
  @ApiOperation({ summary: 'Get all modes with emotional mapping' })
  @ApiQuery({ name: 'feeling', required: false })
  getModes(@Query('feeling') feeling?: string) {
    return this.theoryService.getModes(feeling);
  }

  @Get('modes/:slug')
  @ApiOperation({ summary: 'Get mode details by slug' })
  @ApiParam({ name: 'slug', example: 'dorian' })
  getModeBySlug(@Param('slug') slug: string) {
    return this.theoryService.getModeBySlug(slug);
  }

  @Get('keys/:key/modes')
  @ApiOperation({ summary: 'Get modes for a specific key' })
  @ApiParam({ name: 'key', example: 'C' })
  getModesForKey(@Param('key') key: string) {
    return this.theoryService.getModesForKey(key);
  }

  @Get('scales')
  @ApiOperation({ summary: 'Get all scales' })
  getScales() {
    return this.theoryService.getScales();
  }

  @Get('chords')
  @ApiOperation({ summary: 'Get all chords' })
  @ApiQuery({ name: 'root', required: false })
  @ApiQuery({ name: 'quality', required: false })
  getChords(@Query('root') root?: string, @Query('quality') quality?: string) {
    return this.theoryService.getChords(root, quality);
  }

  @Post('analyze')
  @ApiOperation({ summary: 'Analyze a chord progression' })
  analyzeProgression(@Body() dto: AnalyzeProgressionDto) {
    return this.theoryService.analyzeProgression(dto);
  }

  @Get('circle-of-fifths')
  @ApiOperation({ summary: 'Get circle of fifths data' })
  @ApiQuery({ name: 'center', required: false, example: 'C' })
  getCircleOfFifths(@Query('center') center?: string) {
    return this.theoryService.getCircleOfFifths(center);
  }

  @Get('axis-theory')
  @ApiOperation({ summary: 'Get axis theory groups' })
  getAxisTheory() {
    return this.theoryService.getAxisTheory();
  }

  @Get('harmony-rules')
  @ApiOperation({ summary: 'Get harmony rules for Axis Theory' })
  @ApiQuery({ name: 'tonality', required: false, example: 'major' })
  getHarmonyRules(@Query('tonality') tonality?: string) {
    return this.theoryService.getHarmonyRules(tonality);
  }

  @Get('harmony-rules/:degree')
  @ApiOperation({ summary: 'Get harmony rule for specific degree' })
  @ApiParam({ name: 'degree', example: 'I' })
  @ApiQuery({ name: 'tonality', required: false, example: 'major' })
  getHarmonyRuleByDegree(
    @Param('degree') degree: string,
    @Query('tonality') tonality?: string,
  ) {
    return this.theoryService.getHarmonyRuleByDegree(degree, tonality);
  }

  @Get('techniques')
  @ApiOperation({ summary: 'Get all techniques' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'difficulty', required: false })
  getTechniques(
    @Query('category') category?: string,
    @Query('difficulty') difficulty?: string,
  ) {
    return this.theoryService.getTechniques(category, difficulty);
  }

  @Get('techniques/:slug')
  @ApiOperation({ summary: 'Get technique details by slug' })
  @ApiParam({ name: 'slug', example: 'hammer-on' })
  getTechniqueBySlug(@Param('slug') slug: string) {
    return this.theoryService.getTechniqueBySlug(slug);
  }

  @Get('scales/:slug')
  @ApiOperation({ summary: 'Get scale details by slug' })
  @ApiParam({ name: 'slug', example: 'major-pentatonic' })
  getScaleBySlug(@Param('slug') slug: string) {
    return this.theoryService.getScaleBySlug(slug);
  }
}
