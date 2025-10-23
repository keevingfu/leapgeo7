import { Injectable } from '@nestjs/common';
import { Neo4jService } from '../neo4j/neo4j.service';

export interface PromptGraphNode {
  id: string;
  text: string;
  pLevel: string;
  score: number;
  month: string;
  geoIntent?: string;
  isCovered: boolean;
  contentCount: number;
}

export interface PromptGraphEdge {
  source: string;
  target: string;
  weight: number;
  relationType: string;
}

export interface PromptGraphData {
  nodes: PromptGraphNode[];
  edges: PromptGraphEdge[];
  stats: {
    totalPrompts: number;
    coveredPrompts: number;
    uncoveredPrompts: number;
    coverageRate: number;
    totalRelationships: number;
  };
}

export interface ContentGapAnalysis {
  uncoveredP0P1Prompts: PromptGraphNode[];
  structuralHoles: {
    promptId: string;
    promptText: string;
    missingConnections: string[];
    potentialImpact: number;
  }[];
  recommendations: {
    priority: string;
    promptId: string;
    promptText: string;
    reason: string;
    relatedPrompts: string[];
  }[];
}

@Injectable()
export class PromptLandscapeService {
  constructor(private neo4jService: Neo4jService) {}

  /**
   * Get the full prompt landscape graph data
   */
  async getPromptLandscape(filters?: {
    pLevels?: string[];
    month?: string;
    minScore?: number;
  }): Promise<PromptGraphData> {
    // Build filter conditions
    const conditions: string[] = [];
    const params: Record<string, any> = {};

    if (filters?.pLevels && filters.pLevels.length > 0) {
      conditions.push('p.pLevel IN $pLevels');
      params.pLevels = filters.pLevels;
    }

    if (filters?.month) {
      conditions.push('p.month = $month');
      params.month = filters.month;
    }

    if (filters?.minScore !== undefined) {
      conditions.push('p.score >= $minScore');
      params.minScore = filters.minScore;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get nodes with coverage info
    const nodesQuery = `
      MATCH (p:Prompt)
      ${whereClause}
      OPTIONAL MATCH (p)-[:COVERED_BY]->(c:Content)
      WITH p, count(c) as contentCount
      RETURN p.id as id, p.text as text, p.pLevel as pLevel,
             p.score as score, p.month as month, p.geoIntent as geoIntent,
             contentCount > 0 as isCovered, contentCount
      ORDER BY p.score DESC
    `;

    const nodesResult = await this.neo4jService.executeQuery(
      nodesQuery,
      params,
    );

    const nodes: PromptGraphNode[] = nodesResult.map((record) => ({
      id: record.id,
      text: record.text,
      pLevel: record.pLevel,
      score: record.score,
      month: record.month,
      geoIntent: record.geoIntent,
      isCovered: record.isCovered,
      contentCount: record.contentCount,
    }));

    // Get edges (relationships)
    const edgesQuery = `
      MATCH (p1:Prompt)-[r:RELATES_TO]-(p2:Prompt)
      ${whereClause.replace(/p\./g, 'p1.')}
      RETURN p1.id as source, p2.id as target, r.weight as weight,
             type(r) as relationType
    `;

    const edgesResult = await this.neo4jService.executeQuery(
      edgesQuery,
      params,
    );

    const edges: PromptGraphEdge[] = edgesResult.map((record) => ({
      source: record.source,
      target: record.target,
      weight: record.weight,
      relationType: record.relationType,
    }));

    // Get coverage stats
    const coverageStats = await this.neo4jService.getPromptCoverageStats();

    return {
      nodes,
      edges,
      stats: {
        totalPrompts: coverageStats.total,
        coveredPrompts: coverageStats.covered,
        uncoveredPrompts: coverageStats.uncovered,
        coverageRate: coverageStats.coverageRate,
        totalRelationships: edges.length,
      },
    };
  }

  /**
   * Analyze content gaps and structural holes
   */
  async analyzeContentGaps(): Promise<ContentGapAnalysis> {
    // Get uncovered P0/P1 prompts
    const uncoveredPrompts = await this.neo4jService.findUncoveredPrompts(
      ['P0', 'P1'],
      50,
    );

    const uncoveredNodes: PromptGraphNode[] = uncoveredPrompts.map(
      (prompt) => ({
        ...prompt,
        isCovered: false,
        contentCount: 0,
      }),
    );

    // Identify structural holes (prompts with few connections that bridge clusters)
    const structuralHolesQuery = `
      MATCH (p:Prompt)
      WHERE NOT (p)-[:COVERED_BY]->(:Content)
      OPTIONAL MATCH (p)-[r:RELATES_TO]-(related:Prompt)
      WITH p, count(r) as connectionCount, collect(related.id) as relatedIds
      WHERE connectionCount < 3
      RETURN p.id as promptId, p.text as promptText,
             relatedIds as missingConnections,
             p.score * (5 - connectionCount) as potentialImpact
      ORDER BY potentialImpact DESC
      LIMIT 20
    `;

    const holesResult = await this.neo4jService.executeQuery(
      structuralHolesQuery,
    );

    const structuralHoles = holesResult.map((record) => ({
      promptId: record.promptId,
      promptText: record.promptText,
      missingConnections: record.missingConnections || [],
      potentialImpact: record.potentialImpact,
    }));

    // Generate recommendations
    const recommendations = await this.generateRecommendations(
      uncoveredNodes,
      structuralHoles,
    );

    return {
      uncoveredP0P1Prompts: uncoveredNodes,
      structuralHoles,
      recommendations,
    };
  }

  /**
   * Get related prompts network for a specific prompt
   */
  async getPromptNetwork(
    promptId: string,
    depth: number = 2,
  ): Promise<PromptGraphData> {
    // Get prompt and its connections up to specified depth
    const query = `
      MATCH path = (p:Prompt {id: $promptId})-[:RELATES_TO*1..${depth}]-(related:Prompt)
      WITH p, related, relationships(path) as rels
      OPTIONAL MATCH (related)-[:COVERED_BY]->(c:Content)
      WITH p, related, rels, count(c) as contentCount
      RETURN DISTINCT
        related.id as id, related.text as text, related.pLevel as pLevel,
        related.score as score, related.month as month, related.geoIntent as geoIntent,
        contentCount > 0 as isCovered, contentCount,
        rels[0].weight as edgeWeight
    `;

    const result = await this.neo4jService.executeQuery(query, { promptId });

    // Include the source prompt as well
    const sourcePromptQuery = `
      MATCH (p:Prompt {id: $promptId})
      OPTIONAL MATCH (p)-[:COVERED_BY]->(c:Content)
      WITH p, count(c) as contentCount
      RETURN p.id as id, p.text as text, p.pLevel as pLevel,
             p.score as score, p.month as month, p.geoIntent as geoIntent,
             contentCount > 0 as isCovered, contentCount
    `;

    const sourceResult = await this.neo4jService.executeQuery(
      sourcePromptQuery,
      { promptId },
    );

    const nodes: PromptGraphNode[] = [
      ...sourceResult.map((record) => ({
        id: record.id,
        text: record.text,
        pLevel: record.pLevel,
        score: record.score,
        month: record.month,
        geoIntent: record.geoIntent,
        isCovered: record.isCovered,
        contentCount: record.contentCount,
      })),
      ...result.map((record) => ({
        id: record.id,
        text: record.text,
        pLevel: record.pLevel,
        score: record.score,
        month: record.month,
        geoIntent: record.geoIntent,
        isCovered: record.isCovered,
        contentCount: record.contentCount,
      })),
    ];

    // Get edges between these nodes
    const nodeIds = nodes.map((n) => n.id);
    const edgesQuery = `
      MATCH (p1:Prompt)-[r:RELATES_TO]-(p2:Prompt)
      WHERE p1.id IN $nodeIds AND p2.id IN $nodeIds
      RETURN p1.id as source, p2.id as target, r.weight as weight,
             type(r) as relationType
    `;

    const edgesResult = await this.neo4jService.executeQuery(edgesQuery, {
      nodeIds,
    });

    const edges: PromptGraphEdge[] = edgesResult.map((record) => ({
      source: record.source,
      target: record.target,
      weight: record.weight,
      relationType: record.relationType,
    }));

    const networkStats = await this.neo4jService.getPromptCoverageStats();

    return {
      nodes,
      edges,
      stats: {
        totalPrompts: networkStats.total,
        coveredPrompts: networkStats.covered,
        uncoveredPrompts: networkStats.uncovered,
        coverageRate: networkStats.coverageRate,
        totalRelationships: edges.length,
      },
    };
  }

  /**
   * Generate content recommendations based on gaps and structural holes
   */
  private async generateRecommendations(
    uncoveredPrompts: PromptGraphNode[],
    structuralHoles: any[],
  ): Promise<ContentGapAnalysis['recommendations']> {
    const recommendations = [] as Array<{
      priority: string;
      promptId: string;
      promptText: string;
      reason: string;
      relatedPrompts: string[];
    }>;

    // High priority: Uncovered P0 prompts
    const p0Prompts = uncoveredPrompts.filter((p) => p.pLevel === 'P0');
    for (const prompt of p0Prompts.slice(0, 5)) {
      const related = await this.neo4jService.findRelatedPrompts(
        prompt.id,
        0.5,
      );
      recommendations.push({
        priority: 'P0',
        promptId: prompt.id,
        promptText: prompt.text,
        reason: 'High-value uncovered P0 prompt with strong GEO potential',
        relatedPrompts: related.map((r) => r.text),
      });
    }

    // Medium priority: Structural holes
    for (const hole of structuralHoles.slice(0, 5)) {
      recommendations.push({
        priority: 'P1',
        promptId: hole.promptId,
        promptText: hole.promptText,
        reason:
          'Structural hole - creating content here can bridge topic clusters',
        relatedPrompts: hole.missingConnections,
      });
    }

    // Lower priority: High-score P1 prompts
    const p1Prompts = uncoveredPrompts
      .filter((p) => p.pLevel === 'P1')
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    for (const prompt of p1Prompts) {
      const related = await this.neo4jService.findRelatedPrompts(
        prompt.id,
        0.5,
      );
      recommendations.push({
        priority: 'P1',
        promptId: prompt.id,
        promptText: prompt.text,
        reason: 'High-scoring P1 prompt with good coverage potential',
        relatedPrompts: related.map((r) => r.text),
      });
    }

    return recommendations;
  }
}
