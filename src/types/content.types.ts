// Content data models

export type ContentChannel =
  | 'YouTube'
  | 'Reddit'
  | 'Quora'
  | 'Medium'
  | 'Blog'
  | 'Amazon'
  | 'LinkedIn';

export type PublishStatus =
  | 'draft'
  | 'scheduled'
  | 'published'
  | 'archived';

export interface ContentItem {
  id: string;
  contentId: string;
  title: string;
  coveredPrompts: string[];
  channel: ContentChannel;
  publishStatus: PublishStatus;
  publishDate: Date | null;
  kpiCtr: number; // Click-through rate
  kpiViews: number;
  kpiGmv: number; // Gross Merchandise Value
  content: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentFilters {
  channel: ContentChannel | null;
  status: PublishStatus | null;
  searchQuery: string;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}

export interface ContentTemplate {
  id: string;
  name: string;
  channel: ContentChannel;
  template: string;
  variables: string[];
  description: string;
}

export interface ContentCoverageGap {
  promptId: string;
  prompt: string;
  pLevel: string;
  geoScore: number;
  isCovered: boolean;
}

export interface ContentStats {
  total: number;
  byChannel: Record<ContentChannel, number>;
  byStatus: Record<PublishStatus, number>;
  totalViews: number;
  totalGmv: number;
  avgCtr: number;
}

export interface ContentGenerationRequest {
  templateId: string;
  channel: ContentChannel;
  variables: Record<string, string>;
  targetPrompts: string[];
}
