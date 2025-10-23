import { api } from './api/client';
import type {
  KPIMetrics,
  AnalyticsReport,
  ReportType,
  ReportFormat,
  DateRange,
} from '@/types/analytics.types';

interface GenerateReportRequest {
  type: ReportType;
  dateRange: DateRange;
  format: ReportFormat;
  options?: Record<string, any>;
}

export const analyticsService = {
  // Get dashboard KPI metrics
  getKPIMetrics: async (dateRange?: DateRange): Promise<KPIMetrics> => {
    const params = new URLSearchParams();
    if (dateRange) {
      params.append('startDate', dateRange.startDate);
      params.append('endDate', dateRange.endDate);
    }

    return api.get<KPIMetrics>(`/analytics/kpi?${params.toString()}`);
  },

  // Get all reports
  getReports: async (page = 1, pageSize = 20): Promise<{
    data: AnalyticsReport[];
    total: number;
  }> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    return api.get<{ data: AnalyticsReport[]; total: number }>(`/analytics/reports?${params.toString()}`);
  },

  // Get a single report by ID
  getReportById: async (id: string): Promise<AnalyticsReport> => {
    return api.get<AnalyticsReport>(`/analytics/reports/${id}`);
  },

  // Generate a new report
  generateReport: async (request: GenerateReportRequest): Promise<AnalyticsReport> => {
    return api.post<AnalyticsReport>('/analytics/reports/generate', request);
  },

  // Delete a report
  deleteReport: async (id: string): Promise<void> => {
    return api.delete<void>(`/analytics/reports/${id}`);
  },

  // Export report to file
  exportReport: async (id: string, format: ReportFormat): Promise<Blob> => {
    return api.get<Blob>(`/analytics/reports/${id}/export?format=${format}`, {
      responseType: 'blob',
    });
  },

  // Get dashboard data
  getDashboardData: async (dateRange?: DateRange): Promise<any> => {
    const params = new URLSearchParams();
    if (dateRange) {
      params.append('startDate', dateRange.startDate);
      params.append('endDate', dateRange.endDate);
    }

    return api.get<any>(`/analytics/dashboard?${params.toString()}`);
  },
};
