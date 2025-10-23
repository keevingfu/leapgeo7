import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Citation, CitationFilters } from '@/types/citation.types';

interface CitationsState {
  items: Citation[];
  filters: CitationFilters;
  selectedItem: Citation | null;
  platformMetrics: Record<string, number>;
  loading: boolean;
  error: string | null;
}

const initialState: CitationsState = {
  items: [],
  filters: {
    platform: null,
    strength: null,
    dateRange: null,
    searchQuery: '',
  },
  selectedItem: null,
  platformMetrics: {},
  loading: false,
  error: null,
};

const citationsSlice = createSlice({
  name: 'citations',
  initialState,
  reducers: {
    setCitationItems: (state, action: PayloadAction<Citation[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<Partial<CitationFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedItem: (state, action: PayloadAction<Citation | null>) => {
      state.selectedItem = action.payload;
    },
    setPlatformMetrics: (state, action: PayloadAction<Record<string, number>>) => {
      state.platformMetrics = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearCitations: (state) => {
      state.items = [];
      state.selectedItem = null;
      state.platformMetrics = {};
      state.error = null;
    },
  },
});

export const {
  setCitationItems,
  setFilters,
  setSelectedItem,
  setPlatformMetrics,
  setLoading,
  setError,
  clearCitations,
} = citationsSlice.actions;

export default citationsSlice.reducer;
