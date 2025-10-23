import { api } from './api/client';
import type {
  RoadmapItem,
  RoadmapFilters,
  RoadmapStats,
  RoadmapImportResult,
} from '@/types/roadmap.types';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export const roadmapService = {
  // Get all roadmap items with filters and pagination
  getRoadmapItems: async (
    filters?: Partial<RoadmapFilters>,
    page = 1,
    pageSize = 20
  ): Promise<PaginatedResponse<RoadmapItem>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    if (filters) {
      if (filters.month) params.append('month', filters.month);
      if (filters.pLevel) params.append('pLevel', filters.pLevel);
      if (filters.searchQuery) params.append('search', filters.searchQuery);
      if (filters.geoIntentType) params.append('intentType', filters.geoIntentType);
      if (filters.minGeoScore) params.append('minScore', filters.minGeoScore.toString());
      if (filters.maxGeoScore) params.append('maxScore', filters.maxGeoScore.toString());
    }

    return api.get<PaginatedResponse<RoadmapItem>>(`/roadmap?${params.toString()}`);
  },

  // Get a single roadmap item by ID
  getRoadmapItemById: async (id: string): Promise<RoadmapItem> => {
    return api.get<RoadmapItem>(`/roadmap/${id}`);
  },

  // Create a new roadmap item
  createRoadmapItem: async (data: Omit<RoadmapItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<RoadmapItem> => {
    return api.post<RoadmapItem>('/roadmap', data);
  },

  // Update an existing roadmap item
  updateRoadmapItem: async (id: string, data: Partial<RoadmapItem>): Promise<RoadmapItem> => {
    return api.put<RoadmapItem>(`/roadmap/${id}`, data);
  },

  // Delete a roadmap item
  deleteRoadmapItem: async (id: string): Promise<void> => {
    return api.delete<void>(`/roadmap/${id}`);
  },

  // Bulk import roadmap items from CSV/TSV
  importRoadmap: async (file: File): Promise<RoadmapImportResult> => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post<RoadmapImportResult>('/roadmap/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get roadmap statistics
  getRoadmapStats: async (): Promise<RoadmapStats> => {
    return api.get<RoadmapStats>('/roadmap/stats');
  },
};
