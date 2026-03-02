import { IsString, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SaveProgressionDto {
  @ApiProperty({ example: 'My Jazz Progression' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'C' })
  @IsString()
  key: string;

  @ApiProperty({ example: '4/4', required: false })
  @IsString()
  @IsOptional()
  timeSignature?: string;

  @ApiProperty({
    example: [
      { degree: 'I', quality: 'maj7', beats: 4 },
      { degree: 'IV', quality: 'maj7', beats: 4 },
    ],
  })
  @IsArray()
  chords: Array<{
    degree: string;
    quality?: string;
    beats: number;
  }>;
}
