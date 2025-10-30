import { Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from '../../neo4j/neo4j.service';
import {
  SimilarPrompt,
  SimilarityAnalysisResult,
  SimilarityAnalysisParams,
} from '../dto/gds.types';

/**
 * Similarity Analysis Service
 *
 * Implements Neo4j GDS similarity algorithms:
 * - Node Similarity: Finds similar nodes based on shared neighbors
 * - K-Nearest Neighbors (KNN): Finds K most similar nodes based on properties
 *
 * Business Value:
 * - Content recommendation: Suggest related prompts to cover
 * - Gap analysis: Identify missing content by finding uncovered similar prompts
 * - User journey optimization: Group similar queries for content clustering
 */
@Injectable()
export class SimilarityService {
  private readonly logger = new Logger(SimilarityService.name);
  private readonly GRAPH_NAME = 'promptSimilarity';

  constructor(private readonly neo4jService: Neo4jService) {}

  /**
   * Find similar prompts using Node Similarity algorithm
   *
   * @param params - Parameters including source promptId and topK
   * @returns Similar prompts ranked by similarity score
   */
  async findSimilarPrompts(
    params: SimilarityAnalysisParams,
  ): Promise<SimilarityAnalysisResult> {
    const { promptId, topK = 10 } = params;

    try {
      this.logger.log(`Finding similar prompts for: ${promptId}`);

      // Step 1: Get source prompt info
      const sourcePrompt = await this.getPromptInfo(promptId);
      if (!sourcePrompt) {
        throw new Error(`Prompt not found: ${promptId}`);
      }

      // Step 2: Project graph
      await this.projectGraph();

      // Step 3: Run Node Similarity algorithm
      const results = await this.neo4jService.executeQuery(
        `
        CALL gds.nodeSimilarity.stream($graphName, {
          topK: toInteger($topK)
        })
        YIELD node1, node2, similarity
        MATCH (p1:Prompt) WHERE id(p1) = node1 AND p1.id = $promptId
        MATCH (p2:Prompt) WHERE id(p2) = node2
        RETURN
          p1.id as sourcePromptId,
          p2.id as targetPromptId,
          p2.text as targetText,
          p2.pLevel as targetPLevel,
          p2.score as targetScore,
          similarity
        ORDER BY similarity DESC
      `,
        { graphName: this.GRAPH_NAME, promptId, topK },
      );

      // Step 4: Cleanup
      await this.cleanupGraph();

      const similarPrompts: SimilarPrompt[] = results.map((r) => ({
        sourcePromptId: r.sourcePromptId,
        targetPromptId: r.targetPromptId,
        targetText: r.targetText,
        targetPLevel: r.targetPLevel,
        targetScore: r.targetScore,
        similarity: Math.round(r.similarity * 1000) / 1000,
      }));

      const avgSimilarity =
        similarPrompts.length > 0
          ? similarPrompts.reduce((sum, p) => sum + p.similarity, 0) /
            similarPrompts.length
          : 0;

      return {
        sourcePrompt: {
          promptId: sourcePrompt.id,
          text: sourcePrompt.text,
          pLevel: sourcePrompt.pLevel,
        },
        similarPrompts,
        totalSimilar: similarPrompts.length,
        algorithm: 'nodeSimilarity',
        avgSimilarity: Math.round(avgSimilarity * 1000) / 1000,
      };
    } catch (error) {
      this.logger.error('Node Similarity failed:', error);
      await this.cleanupGraph().catch(() => {});
      throw error;
    }
  }

  /**
   * K-Nearest Neighbors recommendation
   * Finds K most similar prompts based on GEO score and other properties
   */
  async knnRecommendation(
    params: SimilarityAnalysisParams,
  ): Promise<SimilarityAnalysisResult> {
    const { promptId, topK = 10 } = params;

    try {
      this.logger.log(`Running KNN recommendation for: ${promptId}`);

      // Step 1: Get source prompt info
      const sourcePrompt = await this.getPromptInfo(promptId);
      if (!sourcePrompt) {
        throw new Error(`Prompt not found: ${promptId}`);
      }

      // Step 2: Project graph with node properties
      await this.projectGraphWithProperties();

      // Step 3: Run KNN algorithm
      const results = await this.neo4jService.executeQuery(
        `
        CALL gds.knn.stream('promptKNN', {
          nodeProperties: ['score'],
          topK: toInteger($topK),
          randomSeed: 42,
          concurrency: 1
        })
        YIELD node1, node2, similarity
        MATCH (p1:Prompt) WHERE id(p1) = node1 AND p1.id = $promptId
        MATCH (p2:Prompt) WHERE id(p2) = node2
        RETURN
          p1.id as sourcePromptId,
          p2.id as targetPromptId,
          p2.text as targetText,
          p2.pLevel as targetPLevel,
          p2.score as targetScore,
          similarity
        ORDER BY similarity DESC
      `,
        { promptId, topK },
      );

      // Step 4: Cleanup
      await this.cleanupGraph('promptKNN');

      const similarPrompts: SimilarPrompt[] = results.map((r) => ({
        sourcePromptId: r.sourcePromptId,
        targetPromptId: r.targetPromptId,
        targetText: r.targetText,
        targetPLevel: r.targetPLevel,
        targetScore: r.targetScore,
        similarity: Math.round(r.similarity * 1000) / 1000,
      }));

      const avgSimilarity =
        similarPrompts.length > 0
          ? similarPrompts.reduce((sum, p) => sum + p.similarity, 0) /
            similarPrompts.length
          : 0;

      return {
        sourcePrompt: {
          promptId: sourcePrompt.id,
          text: sourcePrompt.text,
          pLevel: sourcePrompt.pLevel,
        },
        similarPrompts,
        totalSimilar: similarPrompts.length,
        algorithm: 'knn',
        avgSimilarity: Math.round(avgSimilarity * 1000) / 1000,
      };
    } catch (error) {
      this.logger.error('KNN recommendation failed:', error);
      await this.cleanupGraph('promptKNN').catch(() => {});
      throw error;
    }
  }

  /**
   * Batch similarity analysis
   * Find similar prompts for multiple source prompts at once
   */
  async batchSimilarity(
    promptIds: string[],
    topK: number = 5,
  ): Promise<Record<string, SimilarPrompt[]>> {
    this.logger.log(`Running batch similarity for ${promptIds.length} prompts`);

    const results: Record<string, SimilarPrompt[]> = {};

    try {
      await this.projectGraph();

      for (const promptId of promptIds) {
        const similarity = await this.findSimilarPrompts({ promptId, topK });
        results[promptId] = similarity.similarPrompts;
      }

      await this.cleanupGraph();

      return results;
    } catch (error) {
      this.logger.error('Batch similarity failed:', error);
      await this.cleanupGraph().catch(() => {});
      throw error;
    }
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  private async getPromptInfo(promptId: string): Promise<any> {
    const result = await this.neo4jService.executeQuery(
      `
      MATCH (p:Prompt {id: $promptId})
      RETURN p.id as id, p.text as text, p.pLevel as pLevel, p.score as score
    `,
      { promptId },
    );

    return result[0];
  }

  private async projectGraph(): Promise<void> {
    const query = `
      CALL gds.graph.project(
        $graphName,
        'Prompt',
        {
          RELATES_TO: {
            orientation: 'UNDIRECTED'
          }
        }
      )
      YIELD graphName, nodeCount, relationshipCount
      RETURN graphName, nodeCount, relationshipCount
    `;

    await this.neo4jService.executeQuery(query, {
      graphName: this.GRAPH_NAME,
    });
  }

  private async projectGraphWithProperties(): Promise<void> {
    const query = `
      CALL gds.graph.project(
        'promptKNN',
        'Prompt',
        {
          RELATES_TO: {
            orientation: 'UNDIRECTED',
            properties: 'weight'
          }
        },
        {
          nodeProperties: ['score']
        }
      )
      YIELD graphName, nodeCount, relationshipCount
      RETURN graphName, nodeCount, relationshipCount
    `;

    await this.neo4jService.executeQuery(query);
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
