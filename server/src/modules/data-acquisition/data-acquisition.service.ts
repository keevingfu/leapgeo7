import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../../prisma/prisma.service';
import { DataAcquisitionGateway } from './data-acquisition.gateway';
import {
  CreateDataSourceDto,
  UpdateDataSourceDto,
  StartScrapingDto,
  ScrapingProgressDto,
  DataSourceResponseDto,
  DataSourceType,
  DataSourceStatus,
} from './dto/data-acquisition.dto';

// Simulated MCP client (in production, this would be the actual MCP SDK)
interface MCPClient {
  callTool: (server: string, tool: string, params: any) => Promise<any>;
}

@Injectable()
export class DataAcquisitionService {
  private readonly logger = new Logger(DataAcquisitionService.name);
  private mcpClient: MCPClient;

  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: DataAcquisitionGateway,
    @InjectQueue('data-acquisition') private readonly acquisitionQueue: Queue,
  ) {
    // Initialize MCP client (simulated)
    this.mcpClient = {
      callTool: async (server: string, tool: string, params: any) => {
        this.logger.log(`Calling MCP tool: ${server}.${tool}`, params);
        // Simulate MCP tool call
        return {
          success: true,
          markdown: '# Sample Content\nThis is scraped content...',
          html: '<h1>Sample Content</h1><p>This is scraped content...</p>',
          metadata: {
            title: 'Sample Page',
            description: 'Sample description',
            url: params.url,
            scrapedAt: new Date().toISOString(),
          },
        };
      },
    };
  }

  /**
   * Get all data sources
   */
  async getAllDataSources(): Promise<DataSourceResponseDto[]> {
    // In a real implementation, this would query the database
    // For now, return mock data
    return [
      {
        id: 'src-001',
        name: 'Competitor Blog Analysis',
        type: DataSourceType.WEBSITE,
        url: 'https://competitor.com/blog',
        status: DataSourceStatus.IDLE,
        progress: 0,
        pagesScraped: 0,
        totalPages: 150,
        dataSize: '0 KB',
        lastRun: new Date('2025-10-26T14:30:00'),
        schedule: 'Daily at 2:00 AM',
        config: {
          formats: ['markdown', 'html'],
          maxPages: 150,
          depth: 3,
          onlyMainContent: true,
          includeImages: false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'src-002',
        name: 'SERP Monitoring',
        type: DataSourceType.SERP,
        url: 'AI SEO tools',
        status: DataSourceStatus.RUNNING,
        progress: 45,
        pagesScraped: 9,
        totalPages: 20,
        dataSize: '1.2 MB',
        lastRun: new Date('2025-10-26T16:15:00'),
        schedule: 'Every 6 hours',
        config: {
          formats: ['markdown'],
          maxPages: 20,
          onlyMainContent: true,
          includeImages: false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  /**
   * Create a new data source
   */
  async createDataSource(dto: CreateDataSourceDto): Promise<DataSourceResponseDto> {
    this.logger.log('Creating new data source:', dto);

    // In production, save to database
    const dataSource: DataSourceResponseDto = {
      id: `src-${Date.now()}`,
      ...dto,
      status: DataSourceStatus.IDLE,
      progress: 0,
      pagesScraped: 0,
      totalPages: dto.config.maxPages || 100,
      dataSize: '0 KB',
      lastRun: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Emit creation event
    this.gateway.emitDataSourceCreated(dataSource);

    return dataSource;
  }

  /**
   * Start scraping process for a data source
   */
  async startScraping(dto: StartScrapingDto): Promise<{ jobId: string; message: string }> {
    this.logger.log('Starting scraping for source:', dto.sourceId);

    // Add job to Bull queue
    const job = await this.acquisitionQueue.add('scrape', {
      sourceId: dto.sourceId,
      url: dto.url,
      formats: dto.formats,
      config: dto.config,
    });

    // Emit initial progress
    this.emitProgress({
      sourceId: dto.sourceId,
      status: 'starting',
      progress: 0,
      message: 'Initializing scraping process...',
    });

    // Start async scraping process
    this.performScraping(dto);

    return {
      jobId: job.id.toString(),
      message: 'Scraping job started successfully',
    };
  }

  /**
   * Perform the actual scraping (async)
   */
  private async performScraping(dto: StartScrapingDto): Promise<void> {
    try {
      // Step 1: Call Firecrawl MCP tool
      this.emitProgress({
        sourceId: dto.sourceId,
        status: 'scraping',
        progress: 10,
        message: 'Connecting to Firecrawl API...',
      });

      const scrapingResult = await this.mcpClient.callTool('firecrawl', 'firecrawl_scrape', {
        url: dto.url,
        formats: dto.formats,
        onlyMainContent: dto.config?.onlyMainContent ?? true,
        maxAge: 172800000, // 48 hours cache
      });

      // Step 2: Process with InfraNodus for text analysis
      this.emitProgress({
        sourceId: dto.sourceId,
        status: 'analyzing',
        progress: 40,
        message: 'Analyzing content with InfraNodus...',
      });

      const analysisResult = await this.mcpClient.callTool(
        'infranodus',
        'generate_knowledge_graph',
        {
          text: scrapingResult.markdown,
          includeStatements: false,
          addNodesAndEdges: false,
        },
      );

      // Step 3: Store in MongoDB
      this.emitProgress({
        sourceId: dto.sourceId,
        status: 'storing',
        progress: 70,
        message: 'Storing data in MongoDB...',
      });

      const storageResult = await this.mcpClient.callTool('mongodb', 'insert-many', {
        database: 'leapgeo7',
        collection: 'scraped_content',
        documents: [
          {
            sourceId: dto.sourceId,
            url: dto.url,
            markdown: scrapingResult.markdown,
            html: scrapingResult.html,
            metadata: scrapingResult.metadata,
            topics: analysisResult.topics,
            keywords: analysisResult.keywords,
            scrapedAt: new Date(),
          },
        ],
      });

      // Step 4: Create Neo4j nodes for entities
      this.emitProgress({
        sourceId: dto.sourceId,
        status: 'graphing',
        progress: 85,
        message: 'Creating knowledge graph nodes...',
      });

      if (analysisResult.keywords && analysisResult.keywords.length > 0) {
        for (const keyword of analysisResult.keywords.slice(0, 10)) {
          await this.mcpClient.callTool('neo4j', 'create_node', {
            label: 'Keyword',
            properties: {
              text: keyword.text,
              frequency: keyword.frequency,
              sourceId: dto.sourceId,
              createdAt: new Date().toISOString(),
            },
          });
        }
      }

      // Step 5: Complete
      this.emitProgress({
        sourceId: dto.sourceId,
        status: 'completed',
        progress: 100,
        message: 'Scraping completed successfully!',
        pagesScraped: 1,
        dataSize: this.calculateDataSize(scrapingResult.markdown),
      });

      this.logger.log(`Scraping completed for source ${dto.sourceId}`);
    } catch (error) {
      this.logger.error('Scraping error:', error);
      this.emitProgress({
        sourceId: dto.sourceId,
        status: 'error',
        progress: 0,
        message: `Error: ${error.message}`,
      });
    }
  }

  /**
   * Emit progress update via WebSocket
   */
  private emitProgress(progress: ScrapingProgressDto): void {
    this.gateway.emitScrapingProgress(progress);
  }

  /**
   * Calculate data size from content
   */
  private calculateDataSize(content: string): string {
    const bytes = new TextEncoder().encode(content).length;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  /**
   * Get MCP statistics
   */
  async getMCPStatistics(): Promise<any> {
    // In production, this would query actual MCP usage stats
    return {
      firecrawl: {
        calls: 156,
        success: 148,
        avgTime: 2.3,
      },
      puppeteer: {
        calls: 42,
        success: 40,
        avgTime: 5.1,
      },
      infranodus: {
        calls: 89,
        success: 89,
        avgTime: 1.8,
      },
      mongodb: {
        writes: 287,
        documents: 4520,
        size: '125 MB',
      },
    };
  }

  /**
   * Stop scraping for a data source
   */
  async stopScraping(sourceId: string): Promise<void> {
    this.logger.log('Stopping scraping for source:', sourceId);

    // Cancel job in queue
    const jobs = await this.acquisitionQueue.getJobs(['active', 'waiting']);
    const job = jobs.find((j) => j.data.sourceId === sourceId);
    if (job) {
      await job.remove();
    }

    this.emitProgress({
      sourceId,
      status: 'stopped',
      progress: 0,
      message: 'Scraping stopped by user',
    });
  }

  /**
   * Pause scraping for a data source
   */
  async pauseScraping(sourceId: string): Promise<void> {
    this.logger.log('Pausing scraping for source:', sourceId);

    const jobs = await this.acquisitionQueue.getJobs(['active']);
    const job = jobs.find((j) => j.data.sourceId === sourceId);
    if (job) {
      // Note: pause() method may not be available in current Bull version
      // await job.pause();
      this.logger.warn('Job pause not implemented in current Bull version');
    }

    this.emitProgress({
      sourceId,
      status: 'paused',
      progress: 50,
      message: 'Scraping paused',
    });
  }

  /**
   * Resume scraping for a data source
   */
  async resumeScraping(sourceId: string): Promise<void> {
    this.logger.log('Resuming scraping for source:', sourceId);

    const jobs = await this.acquisitionQueue.getJobs(['paused']);
    const job = jobs.find((j) => j.data.sourceId === sourceId);
    if (job) {
      // Note: resume() method may not be available in current Bull version
      // await job.resume();
      this.logger.warn('Job resume not implemented in current Bull version');
    }

    this.emitProgress({
      sourceId,
      status: 'scraping',
      progress: 50,
      message: 'Scraping resumed',
    });
  }
}