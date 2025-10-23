// Analytics and KPI data models

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface KPIMetric {
  label: string;
  value: number;
  unit: string;
  change: number; // Percentage change from previous period
  trend: 'up' | 'down' | 'stable';
}

export interface KPIMetrics {
  totalContent: KPIMetric;
  totalCitations: KPIMetric;
  citationRate: KPIMetric;
  avgGeoScore: KPIMetric;
  totalViews: KPIMetric;
  totalGmv: KPIMetric;
  avgCtr: KPIMetric;
  contentProductionRate: KPIMetric;
}

export interface AnalyticsReport {
  id: string;
  reportId: string;
  title: string;
  type: ReportType;
  dateRange: DateRange;
  generatedAt: Date;
  generatedBy: string;
  format: ReportFormat;
  fileUrl: string | null;
  data: Record<string, any>;
}

export type ReportType =
  | 'monthly_summary'
  | 'citation_analysis'
  | 'content_performance'
  | 'geo_optimization'
  | 'workflow_efficiency'
  | 'custom';

export type ReportFormat = 'pdf' | 'excel' | 'powerpoint' | 'json';

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface TimeSeriesData {
  date: string;
  value: number;
  metadata?: Record<string, any>;
}

export interface ComparisonData {
  category: string;
  current: number;
  previous: number;
  change: number;
}

export interface TopPerformer {
  id: string;
  name: string;
  metric: number;
  rank: number;
  category: string;
}
