import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User, UserFilters } from '@/types/user.types';

interface UsersState {
  users: User[];
  currentUser: User | null;
  filters: UserFilters;
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  currentUser: null,
  filters: {
    role: null,
    status: null,
    searchQuery: '',
  },
  selectedUser: null,
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<UserFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((u) => u.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearUsers: (state) => {
      state.users = [];
      state.selectedUser = null;
      state.error = null;
    },
  },
});

export const {
  setUsers,
  setCurrentUser,
  setFilters,
  setSelectedUser,
  updateUser,
  deleteUser,
  setLoading,
  setError,
  clearUsers,
} = usersSlice.actions;

export default usersSlice.reducer;
