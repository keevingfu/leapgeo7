import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { DataAcquisitionService } from './data-acquisition.service';
import {
  CreateDataSourceDto,
  UpdateDataSourceDto,
  StartScrapingDto,
  DataSourceResponseDto,
} from './dto/data-acquisition.dto';

@ApiTags('Data Acquisition')
@Controller('api/v1/data-acquisition')
export class DataAcquisitionController {
  constructor(private readonly dataAcquisitionService: DataAcquisitionService) {}

  /**
   * Get all data sources
   */
  @Get('sources')
  @ApiOperation({ summary: 'Get all data sources' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all configured data sources',
    type: [DataSourceResponseDto],
  })
  async getAllDataSources(): Promise<DataSourceResponseDto[]> {
    return this.dataAcquisitionService.getAllDataSources();
  }

  /**
   * Create a new data source
   */
  @Post('sources')
  @ApiOperation({ summary: 'Create a new data source' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Data source created successfully',
    type: DataSourceResponseDto,
  })
  async createDataSource(@Body() dto: CreateDataSourceDto): Promise<DataSourceResponseDto> {
    return this.dataAcquisitionService.createDataSource(dto);
  }

  /**
   * Start scraping for a data source
   */
  @Post('scrape/start')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Start scraping process for a data source' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Scraping process started',
    schema: {
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  async startScraping(@Body() dto: StartScrapingDto) {
    return this.dataAcquisitionService.startScraping(dto);
  }

  /**
   * Stop scraping for a data source
   */
  @Post('scrape/stop/:sourceId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Stop scraping process for a data source' })
  @ApiParam({ name: 'sourceId', description: 'Data source ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Scraping process stopped',
  })
  async stopScraping(@Param('sourceId') sourceId: string) {
    await this.dataAcquisitionService.stopScraping(sourceId);
    return { message: 'Scraping stopped successfully' };
  }

  /**
   * Pause scraping for a data source
   */
  @Post('scrape/pause/:sourceId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Pause scraping process for a data source' })
  @ApiParam({ name: 'sourceId', description: 'Data source ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Scraping process paused',
  })
  async pauseScraping(@Param('sourceId') sourceId: string) {
    await this.dataAcquisitionService.pauseScraping(sourceId);
    return { message: 'Scraping paused successfully' };
  }

  /**
   * Resume scraping for a data source
   */
  @Post('scrape/resume/:sourceId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resume scraping process for a data source' })
  @ApiParam({ name: 'sourceId', description: 'Data source ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Scraping process resumed',
  })
  async resumeScraping(@Param('sourceId') sourceId: string) {
    await this.dataAcquisitionService.resumeScraping(sourceId);
    return { message: 'Scraping resumed successfully' };
  }

  /**
   * Get MCP tool statistics
   */
  @Get('mcp-stats')
  @ApiOperation({ summary: 'Get MCP tool usage statistics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns MCP tool usage statistics',
  })
  async getMCPStatistics() {
    return this.dataAcquisitionService.getMCPStatistics();
  }

  /**
   * Get scraping logs
   */
  @Get('logs')
  @ApiOperation({ summary: 'Get recent scraping logs' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of logs to return (default: 50)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns recent scraping activity logs',
  })
  async getScrapingLogs(@Query('limit') limit: number = 50) {
    // In production, this would query actual logs from database
    return [
      {
        timestamp: '16:45:32',
        level: 'info',
        message: 'Starting SERP analysis for query "AI SEO tools"',
        source: 'src-002',
      },
      {
        timestamp: '16:45:35',
        level: 'success',
        message: 'Successfully scraped page 9/20',
        source: 'src-002',
      },
      {
        timestamp: '16:44:10',
        level: 'warning',
        message: 'Rate limit approaching for Reddit API',
        source: 'src-003',
      },
      {
        timestamp: '16:42:00',
        level: 'success',
        message: 'Completed Reddit community data collection',
        source: 'src-003',
      },
    ].slice(0, limit);
  }
}