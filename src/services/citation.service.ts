import { api } from './api/client';
import type {
  Citation,
  CitationFilters,
  CitationMetrics,
  CitationTrend,
  CitationDiscovery,
} from '@/types/citation.types';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export const citationService = {
  // Get all citations with filters and pagination
  getCitations: async (
    filters?: Partial<CitationFilters>,
    page = 1,
    pageSize = 20
  ): Promise<PaginatedResponse<Citation>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    if (filters) {
      if (filters.platform) params.append('platform', filters.platform);
      if (filters.strength) params.append('strength', filters.strength.toString());
      if (filters.searchQuery) params.append('search', filters.searchQuery);
      if (filters.dateRange) {
        params.append('startDate', filters.dateRange.startDate);
        params.append('endDate', filters.dateRange.endDate);
      }
    }

    return api.get<PaginatedResponse<Citation>>(`/citations?${params.toString()}`);
  },

  // Get a single citation by ID
  getCitationById: async (id: string): Promise<Citation> => {
    return api.get<Citation>(`/citations/${id}`);
  },

  // Track a new citation
  trackCitation: async (data: Omit<Citation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Citation> => {
    return api.post<Citation>('/citations/track', data);
  },

  // Update citation metadata
  updateCitation: async (id: string, data: Partial<Citation>): Promise<Citation> => {
    return api.put<Citation>(`/citations/${id}`, data);
  },

  // Delete a citation
  deleteCitation: async (id: string): Promise<void> => {
    return api.delete<void>(`/citations/${id}`);
  },

  // Get citation metrics
  getCitationMetrics: async (): Promise<CitationMetrics> => {
    return api.get<CitationMetrics>('/citations/metrics');
  },

  // Get citation trends over time
  getCitationTrends: async (startDate: string, endDate: string): Promise<CitationTrend[]> => {
    const params = new URLSearchParams();
    params.append('startDate', startDate);
    params.append('endDate', endDate);

    return api.get<CitationTrend[]>(`/citations/trends?${params.toString()}`);
  },

  // Discover new citations for content
  discoverCitations: async (contentId: string): Promise<CitationDiscovery[]> => {
    return api.post<CitationDiscovery[]>('/citations/discover', { contentId });
  },
};
