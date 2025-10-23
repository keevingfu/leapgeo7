import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ContentItem, ContentFilters } from '@/types/content.types';

interface ContentState {
  items: ContentItem[];
  filters: ContentFilters;
  selectedItem: ContentItem | null;
  viewMode: 'grid' | 'list' | 'heatmap';
  loading: boolean;
  error: string | null;
}

const initialState: ContentState = {
  items: [],
  filters: {
    channel: null,
    status: null,
    searchQuery: '',
  },
  selectedItem: null,
  viewMode: 'grid',
  loading: false,
  error: null,
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setContentItems: (state, action: PayloadAction<ContentItem[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<Partial<ContentFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedItem: (state, action: PayloadAction<ContentItem | null>) => {
      state.selectedItem = action.payload;
    },
    setViewMode: (state, action: PayloadAction<'grid' | 'list' | 'heatmap'>) => {
      state.viewMode = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearContent: (state) => {
      state.items = [];
      state.selectedItem = null;
      state.error = null;
    },
  },
});

export const {
  setContentItems,
  setFilters,
  setSelectedItem,
  setViewMode,
  setLoading,
  setError,
  clearContent,
} = contentSlice.actions;

export default contentSlice.reducer;
