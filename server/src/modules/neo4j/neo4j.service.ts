import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import neo4j, { Driver, Session } from 'neo4j-driver';

export interface PromptNode {
  id: string;
  text: string;
  pLevel: string;
  score: number;
  month: string;
  geoIntent?: string;
}

export interface ContentNode {
  id: string;
  title: string;
  channel: string;
  publishStatus: string;
  url?: string;
}

export interface PromptRelationship {
  weight: number;
  relationType: string;
}

@Injectable()
export class Neo4jService implements OnModuleInit, OnModuleDestroy {
  private driver: Driver;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const uri = this.configService.get<string>('NEO4J_URI');
    const username = this.configService.get<string>('NEO4J_USERNAME');
    const password = this.configService.get<string>('NEO4J_PASSWORD');

    this.driver = neo4j.driver(uri, neo4j.auth.basic(username, password));

    // Test connection
    try {
      await this.driver.verifyConnectivity();
      console.log('Neo4j connection established successfully');
    } catch (error) {
      console.error('Failed to connect to Neo4j:', error.message);
    }
  }

  async onModuleDestroy() {
    await this.driver.close();
  }

  private getSession(): Session {
    return this.driver.session();
  }

  /**
   * Create or update a Prompt node
   */
  async createPromptNode(prompt: PromptNode): Promise<void> {
    const session = this.getSession();
    try {
      await session.run(
        `
        MERGE (p:Prompt {id: $id})
        SET p.text = $text,
            p.pLevel = $pLevel,
            p.score = $score,
            p.month = $month,
            p.geoIntent = $geoIntent,
            p.updatedAt = datetime()
        `,
        {
          id: prompt.id,
          text: prompt.text,
          pLevel: prompt.pLevel,
          score: prompt.score,
          month: prompt.month,
          geoIntent: prompt.geoIntent || null,
        }
      );
    } finally {
      await session.close();
    }
  }

  /**
   * Create or update a Content node
   */
  async createContentNode(content: ContentNode): Promise<void> {
    const session = this.getSession();
    try {
      await session.run(
        `
        MERGE (c:Content {id: $id})
        SET c.title = $title,
            c.channel = $channel,
            c.publishStatus = $publishStatus,
            c.url = $url,
            c.updatedAt = datetime()
        `,
        {
          id: content.id,
          title: content.title,
          channel: content.channel,
          publishStatus: content.publishStatus,
          url: content.url || null,
        }
      );
    } finally {
      await session.close();
    }
  }

  /**
   * Create COVERED_BY relationship between Prompt and Content
   */
  async linkPromptToContent(promptId: string, contentId: string): Promise<void> {
    const session = this.getSession();
    try {
      await session.run(
        `
        MATCH (p:Prompt {id: $promptId})
        MATCH (c:Content {id: $contentId})
        MERGE (p)-[:COVERED_BY]->(c)
        `,
        { promptId, contentId }
      );
    } finally {
      await session.close();
    }
  }

  /**
   * Create RELATES_TO relationship between two Prompts
   */
  async linkRelatedPrompts(
    promptId1: string,
    promptId2: string,
    weight: number
  ): Promise<void> {
    const session = this.getSession();
    try {
      await session.run(
        `
        MATCH (p1:Prompt {id: $promptId1})
        MATCH (p2:Prompt {id: $promptId2})
        MERGE (p1)-[r:RELATES_TO]-(p2)
        SET r.weight = $weight
        `,
        { promptId1, promptId2, weight }
      );
    } finally {
      await session.close();
    }
  }

  /**
   * Find uncovered prompts (prompts with no content)
   */
  async findUncoveredPrompts(
    pLevels: string[] = ['P0', 'P1'],
    limit: number = 20
  ): Promise<PromptNode[]> {
    const session = this.getSession();
    try {
      const result = await session.run(
        `
        MATCH (p:Prompt)
        WHERE NOT (p)-[:COVERED_BY]->(:Content)
        AND p.pLevel IN $pLevels
        RETURN p.id as id, p.text as text, p.pLevel as pLevel,
               p.score as score, p.month as month, p.geoIntent as geoIntent
        ORDER BY p.score DESC
        LIMIT $limit
        `,
        { pLevels, limit: neo4j.int(limit) }
      );

      return result.records.map((record) => ({
        id: record.get('id'),
        text: record.get('text'),
        pLevel: record.get('pLevel'),
        score: record.get('score'),
        month: record.get('month'),
        geoIntent: record.get('geoIntent'),
      }));
    } finally {
      await session.close();
    }
  }

  /**
   * Find related prompts (prompts connected via RELATES_TO)
   */
  async findRelatedPrompts(promptId: string, minWeight: number = 0.5): Promise<PromptNode[]> {
    const session = this.getSession();
    try {
      const result = await session.run(
        `
        MATCH (p:Prompt {id: $promptId})-[r:RELATES_TO]-(related:Prompt)
        WHERE r.weight >= $minWeight
        RETURN related.id as id, related.text as text, related.pLevel as pLevel,
               related.score as score, related.month as month, r.weight as relationWeight
        ORDER BY r.weight DESC
        `,
        { promptId, minWeight }
      );

      return result.records.map((record) => ({
        id: record.get('id'),
        text: record.get('text'),
        pLevel: record.get('pLevel'),
        score: record.get('score'),
        month: record.get('month'),
      }));
    } finally {
      await session.close();
    }
  }

  /**
   * Get prompt coverage statistics
   */
  async getPromptCoverageStats(): Promise<{
    total: number;
    covered: number;
    uncovered: number;
    coverageRate: number;
  }> {
    const session = this.getSession();
    try {
      const result = await session.run(`
        MATCH (p:Prompt)
        OPTIONAL MATCH (p)-[:COVERED_BY]->(c:Content)
        RETURN
          count(p) as total,
          count(c) as covered,
          count(p) - count(c) as uncovered
      `);

      const record = result.records[0];
      const total = record.get('total').toNumber();
      const covered = record.get('covered').toNumber();
      const uncovered = record.get('uncovered').toNumber();

      return {
        total,
        covered,
        uncovered,
        coverageRate: total > 0 ? (covered / total) * 100 : 0,
      };
    } finally {
      await session.close();
    }
  }

  /**
   * Get content by prompt ID
   */
  async getContentByPrompt(promptId: string): Promise<ContentNode[]> {
    const session = this.getSession();
    try {
      const result = await session.run(
        `
        MATCH (p:Prompt {id: $promptId})-[:COVERED_BY]->(c:Content)
        RETURN c.id as id, c.title as title, c.channel as channel,
               c.publishStatus as publishStatus, c.url as url
        `,
        { promptId }
      );

      return result.records.map((record) => ({
        id: record.get('id'),
        title: record.get('title'),
        channel: record.get('channel'),
        publishStatus: record.get('publishStatus'),
        url: record.get('url'),
      }));
    } finally {
      await session.close();
    }
  }

  /**
   * Delete a prompt node and all its relationships
   */
  async deletePrompt(promptId: string): Promise<void> {
    const session = this.getSession();
    try {
      await session.run(
        `
        MATCH (p:Prompt {id: $promptId})
        DETACH DELETE p
        `,
        { promptId }
      );
    } finally {
      await session.close();
    }
  }

  /**
   * Convert Neo4j native types to JavaScript types
   * Handles Integer objects, Dates, and nested structures
   */
  private convertNeo4jTypes(value: any): any {
    if (value === null || value === undefined) {
      return value;
    }

    // Handle Neo4j Integer type
    if (value?.constructor?.name === 'Integer' || typeof value?.toNumber === 'function') {
      return value.toNumber();
    }

    // Handle Neo4j Date/Time types
    if (value?.constructor?.name === 'DateTime' || typeof value?.toStandardDate === 'function') {
      return value.toStandardDate();
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return value.map((item) => this.convertNeo4jTypes(item));
    }

    // Handle objects
    if (typeof value === 'object') {
      const converted: Record<string, any> = {};
      for (const [key, val] of Object.entries(value)) {
        converted[key] = this.convertNeo4jTypes(val);
      }
      return converted;
    }

    return value;
  }

  /**
   * Execute custom Cypher query (for advanced operations)
   */
  async executeQuery(cypher: string, params: Record<string, any> = {}): Promise<any[]> {
    const session = this.getSession();
    try {
      const result = await session.run(cypher, params);
      return result.records.map((record) => {
        const obj = record.toObject();
        return this.convertNeo4jTypes(obj);
      });
    } finally {
      await session.close();
    }
  }
}
