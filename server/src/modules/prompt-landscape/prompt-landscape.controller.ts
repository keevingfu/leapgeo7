import {
  Controller,
  Get,
  Query,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PromptLandscapeService } from './prompt-landscape.service';

@Controller('prompt-landscape')
export class PromptLandscapeController {
  constructor(
    private readonly promptLandscapeService: PromptLandscapeService,
  ) {}

  /**
   * GET /api/v1/prompt-landscape
   * Get the full prompt landscape graph data with optional filters
   *
   * Query params:
   * - pLevels: comma-separated list (e.g., "P0,P1")
   * - month: filter by month (e.g., "2025-01")
   * - minScore: minimum GEO score threshold
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getPromptLandscape(
    @Query('pLevels') pLevels?: string,
    @Query('month') month?: string,
    @Query('minScore') minScore?: string,
  ) {
    const filters: any = {};

    if (pLevels) {
      filters.pLevels = pLevels.split(',').map((level) => level.trim());
    }

    if (month) {
      filters.month = month;
    }

    if (minScore) {
      filters.minScore = parseFloat(minScore);
    }

    const data = await this.promptLandscapeService.getPromptLandscape(filters);

    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * GET /api/v1/prompt-landscape/gaps
   * Analyze content gaps and get recommendations
   */
  @Get('gaps')
  @HttpCode(HttpStatus.OK)
  async analyzeContentGaps() {
    const analysis = await this.promptLandscapeService.analyzeContentGaps();

    return {
      success: true,
      data: analysis,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * GET /api/v1/prompt-landscape/network/:promptId
   * Get related prompts network for a specific prompt
   *
   * Query params:
   * - depth: relationship depth to traverse (default: 2)
   */
  @Get('network/:promptId')
  @HttpCode(HttpStatus.OK)
  async getPromptNetwork(
    @Param('promptId') promptId: string,
    @Query('depth') depth?: string,
  ) {
    const depthNumber = depth ? parseInt(depth, 10) : 2;

    const network = await this.promptLandscapeService.getPromptNetwork(
      promptId,
      depthNumber,
    );

    return {
      success: true,
      data: network,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * GET /api/v1/prompt-landscape/stats
   * Get prompt coverage statistics
   */
  @Get('stats')
  @HttpCode(HttpStatus.OK)
  async getStats() {
    const stats = await this.promptLandscapeService.getPromptLandscape();

    return {
      success: true,
      data: {
        totalPrompts: stats.stats.totalPrompts,
        coveredPrompts: stats.stats.coveredPrompts,
        uncoveredPrompts: stats.stats.uncoveredPrompts,
        coverageRate: stats.stats.coverageRate,
        totalRelationships: stats.stats.totalRelationships,
        byPLevel: {
          P0: stats.nodes.filter((n) => n.pLevel === 'P0').length,
          P1: stats.nodes.filter((n) => n.pLevel === 'P1').length,
          P2: stats.nodes.filter((n) => n.pLevel === 'P2').length,
          P3: stats.nodes.filter((n) => n.pLevel === 'P3').length,
        },
        coveredByPLevel: {
          P0: stats.nodes.filter((n) => n.pLevel === 'P0' && n.isCovered)
            .length,
          P1: stats.nodes.filter((n) => n.pLevel === 'P1' && n.isCovered)
            .length,
          P2: stats.nodes.filter((n) => n.pLevel === 'P2' && n.isCovered)
            .length,
          P3: stats.nodes.filter((n) => n.pLevel === 'P3' && n.isCovered)
            .length,
        },
      },
      timestamp: new Date().toISOString(),
    };
  }
}
