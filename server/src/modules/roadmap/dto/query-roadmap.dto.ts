import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PLevel } from '../../../../generated/prisma';

export class QueryRoadmapDto {
  @ApiPropertyOptional({ example: '2025-01', description: 'Filter by month' })
  @IsOptional()
  @IsString()
  month?: string;

  @ApiPropertyOptional({ enum: PLevel, description: 'Filter by priority level' })
  @IsOptional()
  @IsEnum(PLevel)
  pLevel?: PLevel;

  @ApiPropertyOptional({ example: 'mattress', description: 'Search in prompt text' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 1, minimum: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, minimum: 1, maximum: 100, description: 'Items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional({ example: 'enhancedGeoScore', description: 'Sort by field' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'enhancedGeoScore';

  @ApiPropertyOptional({ example: 'desc', enum: ['asc', 'desc'], description: 'Sort order' })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
