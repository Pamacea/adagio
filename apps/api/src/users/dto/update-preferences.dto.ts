import { IsBoolean, IsIn, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Champs de `UserPreferences` modifiables par l'utilisateur.
 * Le ValidationPipe global (whitelist + forbidNonWhitelisted) rejette le reste :
 * `userId`, `totalXP`, `level` ne sont plus mass-assignables.
 */
export class UpdatePreferencesDto {
  @ApiPropertyOptional({ enum: ['midnight', 'light', 'auto'] })
  @IsOptional()
  @IsIn(['midnight', 'light', 'auto'])
  theme?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showIntervals?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showNotes?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showDegrees?: boolean;

  @ApiPropertyOptional({ example: 'guitar' })
  @IsOptional()
  @IsString()
  instrument?: string;

  @ApiPropertyOptional({ example: 'EADGBE' })
  @IsOptional()
  @IsString()
  tuning?: string;

  @ApiPropertyOptional({ minimum: 12, maximum: 36 })
  @IsOptional()
  @IsInt()
  @Min(12)
  @Max(36)
  fretCount?: number;

  @ApiPropertyOptional({ minimum: 0, maximum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  volume?: number;

  @ApiPropertyOptional({ minimum: 0, maximum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  metronomeVolume?: number;
}
