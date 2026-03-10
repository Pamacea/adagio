import { IsOptional, IsNumber, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLessonProgressDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  currentSection?: number;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  completedSections?: string[];

  @ApiProperty({ required: false, enum: ['not-started', 'in-progress', 'completed'] })
  @IsOptional()
  @IsString()
  status?: 'not-started' | 'in-progress' | 'completed';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  xp?: number;
}
