import { IsString, IsEnum, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PLevel } from '../../../../generated/prisma';

export class CreateRoadmapDto {
  @ApiProperty({ example: '2025-01', description: 'Month in YYYY-MM format' })
  @IsString()
  month: string;

  @ApiProperty({ example: 'best mattress for back pain', description: 'Target prompt/keyword' })
  @IsString()
  prompt: string;

  @ApiProperty({ enum: PLevel, example: 'P0', description: 'Priority level (P0-P3)' })
  @IsEnum(PLevel)
  pLevel: PLevel;

  @ApiPropertyOptional({ example: 85.5, description: 'Enhanced GEO score (0-100)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  enhancedGeoScore?: number;

  @ApiPropertyOptional({ example: 72.3, description: 'Quick win index (0-100)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  quickWinIndex?: number;

  @ApiPropertyOptional({ example: 8500, description: 'Monthly search volume' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  searchVolume?: number;

  @ApiPropertyOptional({ example: 0.68, description: 'Competition level (0-1)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  competition?: number;

  @ApiPropertyOptional({ example: 'rising', description: 'Trending status' })
  @IsOptional()
  @IsString()
  trendingStatus?: string;

  @ApiPropertyOptional({ example: 12000, description: 'Estimated monthly traffic' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedTraffic?: number;

  @ApiPropertyOptional({ example: 0.45, description: 'SEO difficulty (0-1)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  difficulty?: number;
}
