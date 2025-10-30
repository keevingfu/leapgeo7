import { Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from '../../neo4j/neo4j.service';
import {
  PromptCentrality,
  CentralityAnalysisResult,
  CentralityAnalysisParams,
} from '../dto/gds.types';

/**
 * Centrality Analysis Service
 *
 * Implements Neo4j GDS centrality algorithms:
 * - PageRank: Measures influence based on link structure
 * - Betweenness: Identifies bridge nodes in the network
 * - Closeness: Measures average distance to all other nodes
 *
 * Business Value:
 * - Identify most influential prompts in the network
 * - Prioritize content creation based on centrality scores
 * - Discover key connector prompts for user journey optimization
 */
@Injectable()
export class CentralityService {
  private readonly logger = new Logger(CentralityService.name);
  private readonly GRAPH_NAME = 'promptCentrality';

  constructor(private readonly neo4jService: Neo4jService) {}

  /**
   * Calculate PageRank centrality for all prompts
   *
   * @param params - Optional parameters for filtering and configuration
   * @returns Centrality analysis results with PageRank scores
   */
  async calculatePageRank(
    params: CentralityAnalysisParams = {},
  ): Promise<CentralityAnalysisResult> {
    const {
      pLevels = [],
      minScore = 0,
      limit = 20,
      dampingFactor = 0.85,
      maxIterations = 20,
    } = params;

    try {
      this.logger.log('Projecting graph for PageRank analysis...');
      await this.projectGraph(pLevels, minScore);

      this.logger.log('Calculating PageRank scores...');
      const results = await this.neo4jService.executeQuery(
        `
        CALL gds.pageRank.stream($graphName, {
          relationshipWeightProperty: 'weight',
          dampingFactor: $dampingFactor,
          maxIterations: toInteger($maxIterations)
        })
        YIELD nodeId, score
        MATCH (p:Prompt) WHERE id(p) = nodeId
        RETURN
          p.id as promptId,
          p.text as text,
          p.pLevel as pLevel,
          p.score as geoScore,
          score as pageRank
        ORDER BY score DESC
        LIMIT toInteger($limit)
      `,
        {
          graphName: this.GRAPH_NAME,
          dampingFactor,
          maxIterations,
          limit,
        },
      );

      await this.cleanupGraph();

      const prompts: PromptCentrality[] = results.map((r) => ({
        promptId: r.promptId,
        text: r.text,
        pLevel: r.pLevel,
        geoScore: r.geoScore,
        pageRank: Math.round(r.pageRank * 1000) / 1000,
        betweenness: 0,
        closeness: 0,
        influenceScore: Math.round(r.pageRank * r.geoScore * 10) / 10,
      }));

      return {
        prompts,
        totalAnalyzed: prompts.length,
        algorithm: 'pageRank',
        topInfluencers: prompts.slice(0, 5),
      };
    } catch (error) {
      this.logger.error('PageRank calculation failed:', error);
      await this.cleanupGraph().catch(() => {});
      throw error;
    }
  }

  /**
   * Calculate Betweenness centrality
   * Identifies prompts that serve as bridges in the network
   */
  async calculateBetweenness(
    params: CentralityAnalysisParams = {},
  ): Promise<CentralityAnalysisResult> {
    const { pLevels = [], minScore = 0, limit = 20 } = params;

    try {
      this.logger.log('Projecting graph for Betweenness analysis...');
      await this.projectGraph(pLevels, minScore, 'promptBetweenness');

      this.logger.log('Calculating Betweenness scores...');
      const results = await this.neo4jService.executeQuery(
        `
        CALL gds.betweenness.stream('promptBetweenness')
        YIELD nodeId, score
        MATCH (p:Prompt) WHERE id(p) = nodeId
        RETURN
          p.id as promptId,
          p.text as text,
          p.pLevel as pLevel,
          p.score as geoScore,
          score as betweenness
        ORDER BY score DESC
        LIMIT toInteger($limit)
      `,
        { limit },
      );

      await this.cleanupGraph('promptBetweenness');

      const prompts: PromptCentrality[] = results.map((r) => ({
        promptId: r.promptId,
        text: r.text,
        pLevel: r.pLevel,
        geoScore: r.geoScore,
        pageRank: 0,
        betweenness: Math.round(r.betweenness * 1000) / 1000,
        closeness: 0,
        influenceScore: Math.round(r.betweenness * r.geoScore * 10) / 10,
      }));

      return {
        prompts,
        totalAnalyzed: prompts.length,
        algorithm: 'betweenness',
        topInfluencers: prompts.slice(0, 5),
      };
    } catch (error) {
      this.logger.error('Betweenness calculation failed:', error);
      await this.cleanupGraph('promptBetweenness').catch(() => {});
      throw error;
    }
  }

  /**
   * Calculate Closeness centrality
   * Measures how close a prompt is to all other prompts
   */
  async calculateCloseness(
    params: CentralityAnalysisParams = {},
  ): Promise<CentralityAnalysisResult> {
    const { pLevels = [], minScore = 0, limit = 20 } = params;

    try {
      this.logger.log('Projecting graph for Closeness analysis...');
      await this.projectGraph(pLevels, minScore, 'promptCloseness');

      this.logger.log('Calculating Closeness scores...');
      const results = await this.neo4jService.executeQuery(
        `
        CALL gds.closeness.stream('promptCloseness')
        YIELD nodeId, score
        MATCH (p:Prompt) WHERE id(p) = nodeId
        RETURN
          p.id as promptId,
          p.text as text,
          p.pLevel as pLevel,
          p.score as geoScore,
          score as closeness
        ORDER BY score DESC
        LIMIT toInteger($limit)
      `,
        { limit },
      );

      await this.cleanupGraph('promptCloseness');

      const prompts: PromptCentrality[] = results.map((r) => ({
        promptId: r.promptId,
        text: r.text,
        pLevel: r.pLevel,
        geoScore: r.geoScore,
        pageRank: 0,
        betweenness: 0,
        closeness: Math.round(r.closeness * 1000) / 1000,
        influenceScore: Math.round(r.closeness * r.geoScore * 100) / 100,
      }));

      return {
        prompts,
        totalAnalyzed: prompts.length,
        algorithm: 'closeness',
        topInfluencers: prompts.slice(0, 5),
      };
    } catch (error) {
      this.logger.error('Closeness calculation failed:', error);
      await this.cleanupGraph('promptCloseness').catch(() => {});
      throw error;
    }
  }

  /**
   * Comprehensive centrality analysis
   * Runs all three algorithms and combines results
   */
  async comprehensiveAnalysis(
    params: CentralityAnalysisParams = {},
  ): Promise<CentralityAnalysisResult> {
    const { limit = 20 } = params;

    try {
      this.logger.log('Running comprehensive centrality analysis...');

      // Run all three algorithms in parallel
      const [pageRankResult, betweennessResult, closenessResult] =
        await Promise.all([
          this.calculatePageRank({ ...params, limit: 100 }),
          this.calculateBetweenness({ ...params, limit: 100 }),
          this.calculateCloseness({ ...params, limit: 100 }),
        ]);

      // Merge results by promptId
      const centralities = new Map<string, PromptCentrality>();

      // Add PageRank scores
      pageRankResult.prompts.forEach((p) => {
        centralities.set(p.promptId, { ...p });
      });

      // Add Betweenness scores
      betweennessResult.prompts.forEach((p) => {
        const entry = centralities.get(p.promptId);
        if (entry) {
          entry.betweenness = p.betweenness;
        } else {
          centralities.set(p.promptId, { ...p });
        }
      });

      // Add Closeness scores
      closenessResult.prompts.forEach((p) => {
        const entry = centralities.get(p.promptId);
        if (entry) {
          entry.closeness = p.closeness;
        } else {
          centralities.set(p.promptId, { ...p });
        }
      });

      // Calculate composite influence score
      centralities.forEach((entry) => {
        entry.influenceScore = Math.round(
          (entry.pageRank * 0.5 +
            entry.betweenness * 0.3 +
            entry.closeness * 0.2) *
            entry.geoScore *
            10,
        ) / 10;
      });

      // Sort by influence score
      const sortedPrompts = Array.from(centralities.values()).sort(
        (a, b) => b.influenceScore - a.influenceScore,
      );

      return {
        prompts: sortedPrompts.slice(0, limit),
        totalAnalyzed: sortedPrompts.length,
        algorithm: 'comprehensive',
        topInfluencers: sortedPrompts.slice(0, 5),
      };
    } catch (error) {
      this.logger.error('Comprehensive centrality analysis failed:', error);
      throw error;
    }
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  private async projectGraph(
    pLevels: string[] = [],
    minScore: number = 0,
    graphName: string = this.GRAPH_NAME,
  ): Promise<void> {
    let nodeFilter = '';
    if (pLevels.length > 0 || minScore > 0) {
      const conditions: string[] = [];
      if (pLevels.length > 0) {
        conditions.push(`n.pLevel IN $pLevels`);
      }
      if (minScore > 0) {
        conditions.push(`n.score >= $minScore`);
      }
      nodeFilter = `, nodeFilter: 'WHERE ${conditions.join(' AND ')}'`;
    }

    const query = `
      CALL gds.graph.project(
        $graphName,
        'Prompt',
        {
          RELATES_TO: {
            orientation: 'UNDIRECTED',
            properties: 'weight'
          }
        },
        {
          nodeProperties: ['score']
          ${nodeFilter}
        }
      )
      YIELD graphName, nodeCount, relationshipCount
      RETURN graphName, nodeCount, relationshipCount
    `;

    await this.neo4jService.executeQuery(query, {
      graphName,
      pLevels,
      minScore,
    });
  }

  private async cleanupGraph(graphName: string = this.GRAPH_NAME): Promise<void> {
    try {
      await this.neo4jService.executeQuery(
        `CALL gds.graph.drop($graphName)`,
        { graphName },
      );
      this.logger.log(`Graph projection '${graphName}' dropped successfully`);
    } catch (error) {
      if (!error.message.includes('does not exist')) {
        throw error;
      }
    }
  }
}
