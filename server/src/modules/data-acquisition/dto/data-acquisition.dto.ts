import { IsString, IsEnum, IsOptional, IsNumber, IsBoolean, IsArray, ValidateNested, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum DataSourceType {
  WEBSITE = 'website',
  SERP = 'serp',
  SOCIAL = 'social',
  API = 'api',
}

export enum DataSourceStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ERROR = 'error',
}

export class DataSourceConfigDto {
  @ApiProperty({ type: [String], description: 'Output formats', example: ['markdown', 'html'] })
  @IsArray()
  @IsString({ each: true })
  formats: string[];

  @ApiPropertyOptional({ description: 'Maximum pages to scrape' })
  @IsOptional()
  @IsNumber()
  maxPages?: number;

  @ApiPropertyOptional({ description: 'Crawl depth' })
  @IsOptional()
  @IsNumber()
  depth?: number;

  @ApiProperty({ description: 'Extract only main content' })
  @IsBoolean()
  onlyMainContent: boolean;

  @ApiProperty({ description: 'Include images in scraping' })
  @IsBoolean()
  includeImages: boolean;
}

export class CreateDataSourceDto {
  @ApiProperty({ description: 'Data source name' })
  @IsString()
  name: string;

  @ApiProperty({ enum: DataSourceType, description: 'Data source type' })
  @IsEnum(DataSourceType)
  type: DataSourceType;

  @ApiProperty({ description: 'URL or query for the data source' })
  @IsString()
  url: string;

  @ApiPropertyOptional({ description: 'Schedule for automatic scraping' })
  @IsOptional()
  @IsString()
  schedule?: string;

  @ApiProperty({ type: DataSourceConfigDto, description: 'Configuration settings' })
  @ValidateNested()
  @Type(() => DataSourceConfigDto)
  config: DataSourceConfigDto;
}

export class UpdateDataSourceDto {
  @ApiPropertyOptional({ description: 'Data source name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'URL or query for the data source' })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional({ description: 'Schedule for automatic scraping' })
  @IsOptional()
  @IsString()
  schedule?: string;

  @ApiPropertyOptional({ type: DataSourceConfigDto, description: 'Configuration settings' })
  @IsOptional()
  @ValidateNested()
  @Type(() => DataSourceConfigDto)
  config?: DataSourceConfigDto;
}

export class StartScrapingDto {
  @ApiProperty({ description: 'Data source ID' })
  @IsString()
  sourceId: string;

  @ApiProperty({ description: 'URL to scrape' })
  @IsString()
  url: string;

  @ApiProperty({ type: [String], description: 'Output formats', example: ['markdown', 'html'] })
  @IsArray()
  @IsString({ each: true })
  formats: string[];

  @ApiPropertyOptional({ type: DataSourceConfigDto, description: 'Scraping configuration' })
  @IsOptional()
  @ValidateNested()
  @Type(() => DataSourceConfigDto)
  config?: DataSourceConfigDto;
}

export class ScrapingProgressDto {
  @ApiProperty({ description: 'Data source ID' })
  sourceId: string;

  @ApiProperty({ description: 'Current status' })
  status: 'starting' | 'scraping' | 'analyzing' | 'storing' | 'graphing' | 'completed' | 'error' | 'paused' | 'stopped';

  @ApiProperty({ description: 'Progress percentage (0-100)' })
  progress: number;

  @ApiProperty({ description: 'Status message' })
  message: string;

  @ApiPropertyOptional({ description: 'Number of pages scraped' })
  pagesScraped?: number;

  @ApiPropertyOptional({ description: 'Data size' })
  dataSize?: string;
}

export class DataSourceResponseDto {
  @ApiProperty({ description: 'Data source ID' })
  id: string;

  @ApiProperty({ description: 'Data source name' })
  name: string;

  @ApiProperty({ enum: DataSourceType, description: 'Data source type' })
  type: DataSourceType;

  @ApiProperty({ description: 'URL or query for the data source' })
  url: string;

  @ApiProperty({ enum: DataSourceStatus, description: 'Current status' })
  status: DataSourceStatus;

  @ApiProperty({ description: 'Progress percentage' })
  progress: number;

  @ApiProperty({ description: 'Pages scraped' })
  pagesScraped: number;

  @ApiProperty({ description: 'Total pages' })
  totalPages: number;

  @ApiProperty({ description: 'Data size' })
  dataSize: string;

  @ApiPropertyOptional({ description: 'Last run time' })
  lastRun?: Date | null;

  @ApiPropertyOptional({ description: 'Schedule' })
  schedule?: string;

  @ApiProperty({ type: DataSourceConfigDto, description: 'Configuration' })
  config: DataSourceConfigDto;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}