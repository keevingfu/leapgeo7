import { api } from './api/client';
import type {
  ContentItem,
  ContentFilters,
  ContentStats,
  ContentTemplate,
  ContentCoverageGap,
  ContentGenerationRequest,
} from '@/types/content.types';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export const contentService = {
  // Get all content items with filters and pagination
  getContentItems: async (
    filters?: Partial<ContentFilters>,
    page = 1,
    pageSize = 20
  ): Promise<PaginatedResponse<ContentItem>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    if (filters) {
      if (filters.channel) params.append('channel', filters.channel);
      if (filters.status) params.append('status', filters.status);
      if (filters.searchQuery) params.append('search', filters.searchQuery);
      if (filters.dateRange) {
        params.append('startDate', filters.dateRange.startDate);
        params.append('endDate', filters.dateRange.endDate);
      }
    }

    return api.get<PaginatedResponse<ContentItem>>(`/content?${params.toString()}`);
  },

  // Get a single content item by ID
  getContentItemById: async (id: string): Promise<ContentItem> => {
    return api.get<ContentItem>(`/content/${id}`);
  },

  // Create a new content item
  createContentItem: async (data: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContentItem> => {
    return api.post<ContentItem>('/content', data);
  },

  // Update an existing content item
  updateContentItem: async (id: string, data: Partial<ContentItem>): Promise<ContentItem> => {
    return api.put<ContentItem>(`/content/${id}`, data);
  },

  // Delete a content item
  deleteContentItem: async (id: string): Promise<void> => {
    return api.delete<void>(`/content/${id}`);
  },

  // Publish content
  publishContent: async (id: string): Promise<ContentItem> => {
    return api.post<ContentItem>(`/content/${id}/publish`);
  },

  // Get content statistics
  getContentStats: async (): Promise<ContentStats> => {
    return api.get<ContentStats>('/content/stats');
  },

  // Get content coverage gaps
  getContentCoverage: async (): Promise<ContentCoverageGap[]> => {
    return api.get<ContentCoverageGap[]>('/content/coverage');
  },

  // Get all content templates
  getTemplates: async (): Promise<ContentTemplate[]> => {
    return api.get<ContentTemplate[]>('/content/templates');
  },

  // Generate content from template
  generateContent: async (request: ContentGenerationRequest): Promise<ContentItem> => {
    return api.post<ContentItem>('/content/generate', request);
  },
};
