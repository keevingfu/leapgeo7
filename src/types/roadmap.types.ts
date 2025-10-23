// Roadmap data models based on database schema

export type PLevel = 'P0' | 'P1' | 'P2' | 'P3';

export type GEOIntentType =
  | 'informational'
  | 'navigational'
  | 'transactional'
  | 'commercial'
  | 'local';

export interface RoadmapItem {
  id: string;
  month: string;
  prompt: string;
  pLevel: PLevel;
  enhancedGeoScore: number;
  quickWinIndex: number;
  geoIntentType: GEOIntentType;
  contentStrategy: string;
  geoFriendliness: 1 | 2 | 3 | 4 | 5;
  contentHoursEst: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoadmapFilters {
  month: string | null;
  pLevel: PLevel | null;
  searchQuery: string;
  geoIntentType?: GEOIntentType | null;
  minGeoScore?: number;
  maxGeoScore?: number;
}

export interface PriorityCalculation {
  enhancedGeoScore: number;
  quickWinIndex: number;
  totalScore: number;
  pLevel: PLevel;
}

export interface RoadmapStats {
  total: number;
  byPLevel: Record<PLevel, number>;
  byMonth: Record<string, number>;
  avgGeoScore: number;
  avgQuickWinIndex: number;
  totalContentHours: number;
}

export interface RoadmapImportResult {
  imported: number;
  failed: number;
  errors: string[];
}
