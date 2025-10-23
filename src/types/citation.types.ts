// Citation tracking data models

export type AIplatform =
  | 'ChatGPT'
  | 'Perplexity'
  | 'Claude'
  | 'Gemini'
  | 'Copilot'
  | 'MetaAI'
  | 'SearchGPT';

export type CitationStrength = 1 | 2 | 3; // Mentioned | Referenced | Direct

export interface Citation {
  id: string;
  citationId: string;
  contentId: string;
  platform: AIplatform;
  citationUrl: string;
  aiIndexed: boolean;
  citationStrength: CitationStrength;
  detectedAt: Date;
  query: string;
  context: string;
  attribution: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CitationFilters {
  platform: AIplatform | null;
  strength: CitationStrength | null;
  dateRange: {
    startDate: string;
    endDate: string;
  } | null;
  searchQuery: string;
}

export interface CitationMetrics {
  totalCitations: number;
  byPlatform: Record<AIplatform, number>;
  byStrength: Record<CitationStrength, number>;
  citationRate: number; // Percentage of content cited
  topCitedContent: {
    contentId: string;
    title: string;
    citationCount: number;
  }[];
}

export interface CitationTrend {
  date: string;
  count: number;
  platform: AIplatform;
  strength: CitationStrength;
}

export interface CitationDiscovery {
  url: string;
  platform: AIplatform;
  query: string;
  foundAt: Date;
  needsVerification: boolean;
}
