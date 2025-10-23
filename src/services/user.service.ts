import { api } from './api/client';
import type {
  User,
  UserRole,
  UserFilters,
  Activity,
} from '@/types/user.types';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

interface CreateUserRequest {
  name: string;
  email: string;
  role: UserRole;
}

interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: UserRole;
  status?: 'active' | 'inactive';
}

export const userService = {
  // Get all users with filters and pagination
  getUsers: async (
    filters?: Partial<UserFilters>,
    page = 1,
    pageSize = 20
  ): Promise<PaginatedResponse<User>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    if (filters) {
      if (filters.role) params.append('role', filters.role);
      if (filters.status) params.append('status', filters.status);
      if (filters.searchQuery) params.append('search', filters.searchQuery);
    }

    return api.get<PaginatedResponse<User>>(`/users?${params.toString()}`);
  },

  // Get a single user by ID
  getUserById: async (id: string): Promise<User> => {
    return api.get<User>(`/users/${id}`);
  },

  // Get current authenticated user
  getCurrentUser: async (): Promise<User> => {
    return api.get<User>('/users/me');
  },

  // Create a new user
  createUser: async (data: CreateUserRequest): Promise<User> => {
    return api.post<User>('/users', data);
  },

  // Update an existing user
  updateUser: async (id: string, data: UpdateUserRequest): Promise<User> => {
    return api.put<User>(`/users/${id}`, data);
  },

  // Delete a user
  deleteUser: async (id: string): Promise<void> => {
    return api.delete<void>(`/users/${id}`);
  },

  // Get user activity log
  getUserActivity: async (userId: string, page = 1, pageSize = 20): Promise<{
    data: Activity[];
    total: number;
  }> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    return api.get<{ data: Activity[]; total: number }>(`/users/${userId}/activity?${params.toString()}`);
  },

  // Invite a new user
  inviteUser: async (email: string, role: UserRole): Promise<{ message: string }> => {
    return api.post<{ message: string }>('/users/invite', { email, role });
  },

  // Resend invitation to a user
  resendInvitation: async (userId: string): Promise<{ message: string }> => {
    return api.post<{ message: string }>(`/users/${userId}/resend-invitation`);
  },
};
