import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RoadmapItem, RoadmapFilters } from '@/types/roadmap.types';

interface RoadmapState {
  items: RoadmapItem[];
  filters: RoadmapFilters;
  selectedItem: RoadmapItem | null;
  loading: boolean;
  error: string | null;
}

const initialState: RoadmapState = {
  items: [],
  filters: {
    month: null,
    pLevel: null,
    searchQuery: '',
  },
  selectedItem: null,
  loading: false,
  error: null,
};

const roadmapSlice = createSlice({
  name: 'roadmap',
  initialState,
  reducers: {
    setRoadmapItems: (state, action: PayloadAction<RoadmapItem[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<Partial<RoadmapFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedItem: (state, action: PayloadAction<RoadmapItem | null>) => {
      state.selectedItem = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearRoadmap: (state) => {
      state.items = [];
      state.selectedItem = null;
      state.error = null;
    },
  },
});

export const {
  setRoadmapItems,
  setFilters,
  setSelectedItem,
  setLoading,
  setError,
  clearRoadmap,
} = roadmapSlice.actions;

export default roadmapSlice.reducer;
