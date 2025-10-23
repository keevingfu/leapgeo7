import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { KPIMetrics, AnalyticsReport, DateRange } from '@/types/analytics.types';

interface AnalyticsState {
  kpiMetrics: KPIMetrics | null;
  reports: AnalyticsReport[];
  selectedReport: AnalyticsReport | null;
  dateRange: DateRange;
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  kpiMetrics: null,
  reports: [],
  selectedReport: null,
  dateRange: {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
    endDate: new Date().toISOString(),
  },
  loading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setKPIMetrics: (state, action: PayloadAction<KPIMetrics>) => {
      state.kpiMetrics = action.payload;
      state.loading = false;
      state.error = null;
    },
    setReports: (state, action: PayloadAction<AnalyticsReport[]>) => {
      state.reports = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedReport: (state, action: PayloadAction<AnalyticsReport | null>) => {
      state.selectedReport = action.payload;
    },
    setDateRange: (state, action: PayloadAction<DateRange>) => {
      state.dateRange = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearAnalytics: (state) => {
      state.kpiMetrics = null;
      state.reports = [];
      state.selectedReport = null;
      state.error = null;
    },
  },
});

export const {
  setKPIMetrics,
  setReports,
  setSelectedReport,
  setDateRange,
  setLoading,
  setError,
  clearAnalytics,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;
