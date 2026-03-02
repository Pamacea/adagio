import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ required: false })
  preferences?: {
    theme?: string;
    showIntervals?: boolean;
    showNotes?: boolean;
    showDegrees?: boolean;
    tuning?: string;
    fretCount?: number;
    volume?: number;
    metronomeVolume?: number;
  };
}
