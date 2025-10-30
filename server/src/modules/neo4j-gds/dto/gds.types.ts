/**
 * Neo4j GDS (Graph Data Science) Type Definitions
 *
 * This file contains all TypeScript interfaces and types for GDS algorithm results.
 */

// ============================================================================
// Community Detection Types
// ============================================================================

export interface PromptCommunity {
  communityId: number;
  prompts: string[];
  promptTexts: string[];
  avgScore: number;
  dominantPLevel: string;
  theme: string;
  size: number;
}

export interface CommunityDetectionResult {
  communities: PromptCommunity[];
  totalCommunities: number;
  modularity: number;
  algorithm: 'louvain' | 'labelPropagation';
}

// ============================================================================
// Centrality Analysis Types
// ============================================================================

export interface PromptCentrality {
  promptId: string;
  text: string;
  pLevel: string;
  geoScore: number;
  pageRank: number;
  betweenness: number;
  closeness: number;
  influenceScore: number;
}

export interface CentralityAnalysisResult {
  prompts: PromptCentrality[];
  totalAnalyzed: number;
  algorithm: 'pageRank' | 'betweenness' | 'closeness' | 'comprehensive';
  topInfluencers: PromptCentrality[];
}

// ============================================================================
// Similarity Analysis Types
// ============================================================================

export interface SimilarPrompt {
  sourcePromptId: string;
  targetPromptId: string;
  targetText: string;
  similarity: number;
  commonNeighbors?: string[];
  targetPLevel?: string;
  targetScore?: number;
}

export interface SimilarityAnalysisResult {
  sourcePrompt: {
    promptId: string;
    text: string;
    pLevel: string;
  };
  similarPrompts: SimilarPrompt[];
  totalSimilar: number;
  algorithm: 'nodeSimilarity' | 'knn';
  avgSimilarity: number;
}

// ============================================================================
// Path Finding Types
// ============================================================================

export interface PromptPath {
  startPromptId: string;
  endPromptId: string;
  path: string[];
  pathTexts: string[];
  totalCost: number;
  pathLength: number;
}

export interface PathFindingResult {
  paths: PromptPath[];
  algorithm: 'dijkstra' | 'aStar';
}

// ============================================================================
// Graph Features Types
// ============================================================================

export interface GraphQualityMetrics {
  totalNodes: number;
  totalRelationships: number;
  density: number;
  avgDegree: number;
  triangleCount: number;
  avgClusteringCoefficient: number;
}

export interface PromptGraphFeatures {
  promptId: string;
  text: string;
  degree: number;
  triangleCount: number;
  clusteringCoefficient: number;
}

// ============================================================================
// Link Prediction Types
// ============================================================================

export interface PredictedLink {
  node1Id: string;
  node1Text: string;
  node2Id: string;
  node2Text: string;
  score: number;
  algorithm: 'adamicAdar' | 'resourceAllocation';
}

export interface LinkPredictionResult {
  predictions: PredictedLink[];
  totalPredictions: number;
  avgScore: number;
}

// ============================================================================
// Connectivity Analysis Types
// ============================================================================

export interface ConnectedComponent {
  componentId: number;
  size: number;
  prompts: string[];
  promptTexts: string[];
}

export interface ConnectivityAnalysisResult {
  components: ConnectedComponent[];
  totalComponents: number;
  largestComponent: ConnectedComponent;
  isolatedNodes: string[];
  algorithm: 'wcc' | 'scc';
}

// ============================================================================
// Query Parameters
// ============================================================================

export interface GdsQueryParams {
  pLevels?: string[];
  minScore?: number;
  limit?: number;
  topK?: number;
  depth?: number;
}

export interface CommunityDetectionParams extends GdsQueryParams {
  relationshipWeightProperty?: string;
  seedProperty?: string;
}

export interface CentralityAnalysisParams extends GdsQueryParams {
  dampingFactor?: number;
  maxIterations?: number;
}

export interface SimilarityAnalysisParams extends GdsQueryParams {
  promptId: string;
}

export interface PathFindingParams {
  sourcePromptId: string;
  targetPromptId: string;
  weightProperty?: string;
}

// ============================================================================
// Graph Projection Types
// ============================================================================

export interface GraphProjection {
  graphName: string;
  nodeProjection: string | Record<string, any>;
  relationshipProjection: string | Record<string, any>;
  configuration?: Record<string, any>;
}

export interface GraphStats {
  nodeCount: number;
  relationshipCount: number;
  density: number;
  memoryUsage: string;
}
