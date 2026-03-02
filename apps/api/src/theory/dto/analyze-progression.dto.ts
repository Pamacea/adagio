import { IsString, IsArray, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnalyzeProgressionDto {
  @ApiProperty({ example: 'C' })
  @IsString()
  key: string;

  @ApiProperty({
    example: [
      { degree: 'I', quality: 'maj7', beats: 4 },
      { degree: 'IV', quality: 'maj7', beats: 4 },
      { degree: 'V', quality: '7', beats: 4 },
      { degree: 'I', quality: 'maj7', beats: 4 },
    ],
  })
  @IsArray()
  chords: Array<{
    degree: string;
    quality?: string;
    beats: number;
  }>;

  @ApiProperty({ example: '4/4', required: false })
  @IsString()
  @IsOptional()
  timeSignature?: string;
}
