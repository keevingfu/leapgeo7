import { Module } from '@nestjs/common';
import { Neo4jModule } from '../neo4j/neo4j.module';

// Services
import { CommunityDetectionService } from './services/community-detection.service';
import { CentralityService } from './services/centrality.service';
import { SimilarityService } from './services/similarity.service';

// Controllers
import { Neo4jGdsController } from './controllers/neo4j-gds.controller';

/**
 * Neo4j GDS (Graph Data Science) Module
 *
 * This module provides advanced graph analytics capabilities using Neo4j GDS algorithms:
 *
 * **Phase 1 Algorithms (Currently Implemented)**:
 * - Community Detection (Louvain, Label Propagation)
 * - Centrality Analysis (PageRank, Betweenness, Closeness)
 * - Similarity Analysis (Node Similarity, KNN)
 *
 * **API Endpoints**:
 * - GET /api/v1/neo4j-gds/communities
 * - GET /api/v1/neo4j-gds/centrality/pagerank
 * - GET /api/v1/neo4j-gds/centrality/betweenness
 * - GET /api/v1/neo4j-gds/centrality/closeness
 * - GET /api/v1/neo4j-gds/centrality/comprehensive
 * - GET /api/v1/neo4j-gds/similarity/prompts/:promptId/similar
 * - GET /api/v1/neo4j-gds/similarity/prompts/:promptId/knn
 *
 * **Business Value**:
 * - Automatic topic clustering for prompt organization
 * - Identify most influential prompts in the network
 * - Content recommendation based on similarity
 * - Data-driven content strategy optimization
 */
@Module({
  imports: [Neo4jModule],
  controllers: [Neo4jGdsController],
  providers: [
    CommunityDetectionService,
    CentralityService,
    SimilarityService,
  ],
  exports: [
    CommunityDetectionService,
    CentralityService,
    SimilarityService,
  ],
})
export class Neo4jGdsModule {}
