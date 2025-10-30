import { Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from '../../neo4j/neo4j.service';
import {
  PromptCommunity,
  CommunityDetectionResult,
  CommunityDetectionParams,
} from '../dto/gds.types';

/**
 * Community Detection Service
 *
 * Implements Neo4j GDS community detection algorithms:
 * - Louvain: Hierarchical clustering based on modularity optimization
 * - Label Propagation: Fast clustering based on label propagation
 *
 * Business Value:
 * - Automatic topic clustering for prompt categorization
 * - Identify semantic clusters in the prompt network
 * - Optimize content strategy by targeting community themes
 */
@Injectable()
export class CommunityDetectionService {
  private readonly logger = new Logger(CommunityDetectionService.name);
  private readonly GRAPH_NAME = 'promptNetwork';

  constructor(private readonly neo4jService: Neo4jService) {}

  /**
   * Detect prompt communities using Louvain algorithm
   *
   * @param params - Optional parameters for filtering and configuration
   * @returns Community detection results with modularity score
   */
  async detectPromptCommunities(
    params: CommunityDetectionParams = {},
  ): Promise<CommunityDetectionResult> {
    const {
      pLevels = [],
      minScore = 0,
      relationshipWeightProperty = 'weight',
    } = params;

    try {
      // Step 1: Project graph to GDS
      this.logger.log('Projecting graph to GDS memory...');
      await this.projectGraph(pLevels, minScore);

      // Step 2: Run Louvain algorithm
      this.logger.log('Running Louvain community detection...');
      const communityResults = await this.runLouvain(
        relationshipWeightProperty,
      );

      // Step 3: Calculate modularity
      const modularity = await this.calculateModularity(
        relationshipWeightProperty,
      );

      // Step 4: Cleanup graph projection
      await this.cleanupGraph();

      this.logger.log(
        `Detected ${communityResults.length} communities with modularity: ${modularity}`,
      );

      return {
        communities: communityResults,
        totalCommunities: communityResults.length,
        modularity,
        algorithm: 'louvain',
      };
    } catch (error) {
      this.logger.error('Community detection failed:', error);
      await this.cleanupGraph().catch(() => {}); // Cleanup on error
      throw error;
    }
  }

  /**
   * Detect communities using Label Propagation algorithm
   * Faster but less accurate than Louvain
   */
  async labelPropagationClustering(
    params: CommunityDetectionParams = {},
  ): Promise<CommunityDetectionResult> {
    const { pLevels = [], minScore = 0 } = params;

    try {
      this.logger.log('Projecting graph for Label Propagation...');
      await this.projectGraph(pLevels, minScore, 'promptNetworkLP');

      this.logger.log('Running Label Propagation algorithm...');
      const result = await this.neo4jService.executeQuery(
        `
        CALL gds.labelPropagation.stream($graphName, {
          maxIterations: 10
        })
        YIELD nodeId, communityId
        MATCH (p:Prompt) WHERE id(p) = nodeId
        RETURN
          communityId,
          collect(p.id) as prompts,
          collect(p.text) as promptTexts,
          collect(p.score) as scores,
          collect(p.pLevel) as pLevels
        ORDER BY communityId
      `,
        { graphName: 'promptNetworkLP' },
      );

      await this.cleanupGraph('promptNetworkLP');

      const communities: PromptCommunity[] = result.map((record) => ({
        communityId: record.communityId,
        prompts: record.prompts,
        promptTexts: record.promptTexts,
        avgScore: this.calculateAverage(record.scores),
        dominantPLevel: this.findDominant(record.pLevels),
        theme: this.inferTheme(record.promptTexts),
        size: record.prompts.length,
      }));

      return {
        communities,
        totalCommunities: communities.length,
        modularity: 0, // Label Propagation doesn't provide modularity
        algorithm: 'labelPropagation',
      };
    } catch (error) {
      this.logger.error('Label Propagation failed:', error);
      await this.cleanupGraph('promptNetworkLP').catch(() => {});
      throw error;
    }
  }

  /**
   * Project graph to GDS memory
   */
  private async projectGraph(
    pLevels: string[] = [],
    minScore: number = 0,
    graphName: string = this.GRAPH_NAME,
  ): Promise<void> {
    // Build node filter
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

  /**
   * Run Louvain algorithm and return community results
   */
  private async runLouvain(
    relationshipWeightProperty: string,
  ): Promise<PromptCommunity[]> {
    const result = await this.neo4jService.executeQuery(
      `
      CALL gds.louvain.stream($graphName, {
        relationshipWeightProperty: $weightProperty,
        includeIntermediateCommunities: false
      })
      YIELD nodeId, communityId
      MATCH (p:Prompt) WHERE id(p) = nodeId
      RETURN
        communityId,
        collect(p.id) as prompts,
        collect(p.text) as promptTexts,
        collect(p.score) as scores,
        collect(p.pLevel) as pLevels
      ORDER BY communityId
    `,
      {
        graphName: this.GRAPH_NAME,
        weightProperty: relationshipWeightProperty,
      },
    );

    return result.map((record) => ({
      communityId: record.communityId,
      prompts: record.prompts,
      promptTexts: record.promptTexts,
      avgScore: this.calculateAverage(record.scores),
      dominantPLevel: this.findDominant(record.pLevels),
      theme: this.inferTheme(record.promptTexts),
      size: record.prompts.length,
    }));
  }

  /**
   * Calculate graph modularity score
   */
  private async calculateModularity(
    relationshipWeightProperty: string,
  ): Promise<number> {
    const result = await this.neo4jService.executeQuery(
      `
      CALL gds.louvain.stats($graphName, {
        relationshipWeightProperty: $weightProperty
      })
      YIELD modularity
      RETURN modularity
    `,
      {
        graphName: this.GRAPH_NAME,
        weightProperty: relationshipWeightProperty,
      },
    );

    return result[0]?.modularity || 0;
  }

  /**
   * Cleanup graph projection from memory
   */
  private async cleanupGraph(graphName: string = this.GRAPH_NAME): Promise<void> {
    try {
      await this.neo4jService.executeQuery(
        `CALL gds.graph.drop($graphName)`,
        { graphName },
      );
      this.logger.log(`Graph projection '${graphName}' dropped successfully`);
    } catch (error) {
      // Ignore if graph doesn't exist
      if (!error.message.includes('does not exist')) {
        throw error;
      }
    }
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  private calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, val) => acc + val, 0);
    return Math.round((sum / numbers.length) * 100) / 100;
  }

  private findDominant(items: string[]): string {
    if (items.length === 0) return 'Unknown';

    const counts: Record<string, number> = {};
    items.forEach((item) => {
      counts[item] = (counts[item] || 0) + 1;
    });

    let maxCount = 0;
    let dominant = items[0];
    Object.entries(counts).forEach(([item, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominant = item;
      }
    });

    return dominant;
  }

  /**
   * Infer theme from prompt texts using keyword extraction
   */
  private inferTheme(texts: string[]): string {
    if (texts.length === 0) return 'Unknown';

    // Extract common keywords
    const allWords = texts
      .join(' ')
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 3);

    // Count word frequency
    const wordCounts: Record<string, number> = {};
    allWords.forEach((word) => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });

    // Find top keywords (appear in at least 30% of texts)
    const threshold = texts.length * 0.3;
    const topKeywords = Object.entries(wordCounts)
      .filter(([, count]) => count >= threshold)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([word]) => word);

    if (topKeywords.length === 0) {
      // Fallback: use first 3 words from first text
      return texts[0].split(' ').slice(0, 3).join(' ');
    }

    return topKeywords.join(', ');
  }
}
