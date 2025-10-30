import { Controller, Get, Query, Param, Logger } from '@nestjs/common';
import { CommunityDetectionService } from '../services/community-detection.service';
import { CentralityService } from '../services/centrality.service';
import { SimilarityService } from '../services/similarity.service';
import {
  CommunityDetectionParams,
  CentralityAnalysisParams,
  SimilarityAnalysisParams,
} from '../dto/gds.types';

/**
 * Neo4j GDS API Controller
 *
 * Exposes REST API endpoints for Neo4j Graph Data Science algorithms:
 * - Community Detection: /api/v1/neo4j-gds/communities
 * - Centrality Analysis: /api/v1/neo4j-gds/centrality
 * - Similarity Analysis: /api/v1/neo4j-gds/similarity
 */
@Controller('neo4j-gds')
export class Neo4jGdsController {
  private readonly logger = new Logger(Neo4jGdsController.name);

  constructor(
    private readonly communityService: CommunityDetectionService,
    private readonly centralityService: CentralityService,
    private readonly similarityService: SimilarityService,
  ) {}

  // ============================================================================
  // Community Detection Endpoints
  // ============================================================================

  /**
   * GET /api/v1/neo4j-gds/communities
   * Detect prompt communities using Louvain algorithm
   *
   * Query params:
   * - pLevels: Filter by priority levels (comma-separated, e.g., "P0,P1")
   * - minScore: Minimum GEO score threshold
   */
  @Get('communities')
  async detectCommunities(
    @Query('pLevels') pLevelsParam?: string,
    @Query('minScore') minScoreParam?: string,
  ) {
    this.logger.log('Community detection requested');

    const params: CommunityDetectionParams = {};

    if (pLevelsParam) {
      params.pLevels = pLevelsParam.split(',');
    }

    if (minScoreParam) {
      params.minScore = parseFloat(minScoreParam);
    }

    const result = await this.communityService.detectPromptCommunities(params);

    this.logger.log(`Detected ${result.totalCommunities} communities`);

    return {
      success: true,
      data: result,
    };
  }

  /**
   * GET /api/v1/neo4j-gds/communities/label-propagation
   * Detect communities using Label Propagation algorithm
   */
  @Get('communities/label-propagation')
  async labelPropagationCommunities(
    @Query('pLevels') pLevelsParam?: string,
    @Query('minScore') minScoreParam?: string,
  ) {
    this.logger.log('Label Propagation requested');

    const params: CommunityDetectionParams = {};

    if (pLevelsParam) {
      params.pLevels = pLevelsParam.split(',');
    }

    if (minScoreParam) {
      params.minScore = parseFloat(minScoreParam);
    }

    const result =
      await this.communityService.labelPropagationClustering(params);

    return {
      success: true,
      data: result,
    };
  }

  // ============================================================================
  // Centrality Analysis Endpoints
  // ============================================================================

  /**
   * GET /api/v1/neo4j-gds/centrality/pagerank
   * Calculate PageRank centrality scores
   *
   * Query params:
   * - pLevels: Filter by priority levels
   * - minScore: Minimum GEO score threshold
   * - limit: Max results to return (default: 20)
   * - dampingFactor: PageRank damping factor (default: 0.85)
   */
  @Get('centrality/pagerank')
  async pageRankCentrality(
    @Query('pLevels') pLevelsParam?: string,
    @Query('minScore') minScoreParam?: string,
    @Query('limit') limitParam?: string,
    @Query('dampingFactor') dampingFactorParam?: string,
  ) {
    this.logger.log('PageRank centrality requested');

    const params: CentralityAnalysisParams = {};

    if (pLevelsParam) {
      params.pLevels = pLevelsParam.split(',');
    }

    if (minScoreParam) {
      params.minScore = parseFloat(minScoreParam);
    }

    if (limitParam) {
      params.limit = parseInt(limitParam, 10);
    }

    if (dampingFactorParam) {
      params.dampingFactor = parseFloat(dampingFactorParam);
    }

    const result = await this.centralityService.calculatePageRank(params);

    return {
      success: true,
      data: result,
    };
  }

  /**
   * GET /api/v1/neo4j-gds/centrality/betweenness
   * Calculate Betweenness centrality scores
   */
  @Get('centrality/betweenness')
  async betweennessCentrality(
    @Query('pLevels') pLevelsParam?: string,
    @Query('minScore') minScoreParam?: string,
    @Query('limit') limitParam?: string,
  ) {
    this.logger.log('Betweenness centrality requested');

    const params: CentralityAnalysisParams = {};

    if (pLevelsParam) {
      params.pLevels = pLevelsParam.split(',');
    }

    if (minScoreParam) {
      params.minScore = parseFloat(minScoreParam);
    }

    if (limitParam) {
      params.limit = parseInt(limitParam, 10);
    }

    const result = await this.centralityService.calculateBetweenness(params);

    return {
      success: true,
      data: result,
    };
  }

  /**
   * GET /api/v1/neo4j-gds/centrality/closeness
   * Calculate Closeness centrality scores
   */
  @Get('centrality/closeness')
  async closenessCentrality(
    @Query('pLevels') pLevelsParam?: string,
    @Query('minScore') minScoreParam?: string,
    @Query('limit') limitParam?: string,
  ) {
    this.logger.log('Closeness centrality requested');

    const params: CentralityAnalysisParams = {};

    if (pLevelsParam) {
      params.pLevels = pLevelsParam.split(',');
    }

    if (minScoreParam) {
      params.minScore = parseFloat(minScoreParam);
    }

    if (limitParam) {
      params.limit = parseInt(limitParam, 10);
    }

    const result = await this.centralityService.calculateCloseness(params);

    return {
      success: true,
      data: result,
    };
  }

  /**
   * GET /api/v1/neo4j-gds/centrality/comprehensive
   * Run comprehensive centrality analysis (all three algorithms)
   */
  @Get('centrality/comprehensive')
  async comprehensiveCentrality(
    @Query('pLevels') pLevelsParam?: string,
    @Query('minScore') minScoreParam?: string,
    @Query('limit') limitParam?: string,
  ) {
    this.logger.log('Comprehensive centrality analysis requested');

    const params: CentralityAnalysisParams = {};

    if (pLevelsParam) {
      params.pLevels = pLevelsParam.split(',');
    }

    if (minScoreParam) {
      params.minScore = parseFloat(minScoreParam);
    }

    if (limitParam) {
      params.limit = parseInt(limitParam, 10);
    }

    const result =
      await this.centralityService.comprehensiveAnalysis(params);

    return {
      success: true,
      data: result,
    };
  }

  // ============================================================================
  // Similarity Analysis Endpoints
  // ============================================================================

  /**
   * GET /api/v1/neo4j-gds/similarity/prompts/:promptId/similar
   * Find similar prompts using Node Similarity algorithm
   *
   * Query params:
   * - topK: Number of similar prompts to return (default: 10)
   */
  @Get('similarity/prompts/:promptId/similar')
  async findSimilarPrompts(
    @Param('promptId') promptId: string,
    @Query('topK') topKParam?: string,
  ) {
    this.logger.log(`Finding similar prompts for: ${promptId}`);

    const params: SimilarityAnalysisParams = {
      promptId,
      topK: topKParam ? parseInt(topKParam, 10) : 10,
    };

    const result = await this.similarityService.findSimilarPrompts(params);

    return {
      success: true,
      data: result,
    };
  }

  /**
   * GET /api/v1/neo4j-gds/similarity/prompts/:promptId/knn
   * K-Nearest Neighbors recommendation
   */
  @Get('similarity/prompts/:promptId/knn')
  async knnRecommendation(
    @Param('promptId') promptId: string,
    @Query('topK') topKParam?: string,
  ) {
    this.logger.log(`KNN recommendation for: ${promptId}`);

    const params: SimilarityAnalysisParams = {
      promptId,
      topK: topKParam ? parseInt(topKParam, 10) : 10,
    };

    const result = await this.similarityService.knnRecommendation(params);

    return {
      success: true,
      data: result,
    };
  }
}
