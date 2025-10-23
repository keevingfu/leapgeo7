import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Import slices
import roadmapReducer from './slices/roadmapSlice';
import contentReducer from './slices/contentSlice';
import citationsReducer from './slices/citationsSlice';
import workflowReducer from './slices/workflowSlice';
import analyticsReducer from './slices/analyticsSlice';
import usersReducer from './slices/usersSlice';

export const store = configureStore({
  reducer: {
    roadmap: roadmapReducer,
    content: contentReducer,
    citations: citationsReducer,
    workflow: workflowReducer,
    analytics: analyticsReducer,
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['roadmap/setFilters'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['roadmap.lastUpdated'],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export typed hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
