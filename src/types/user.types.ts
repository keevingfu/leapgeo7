// User management data models

export type UserRole = 'admin' | 'editor' | 'analyst' | 'viewer';

export type UserStatus = 'active' | 'inactive' | 'invited';

export type Permission =
  | 'roadmap.read'
  | 'roadmap.write'
  | 'roadmap.delete'
  | 'content.read'
  | 'content.write'
  | 'content.publish'
  | 'content.delete'
  | 'citations.read'
  | 'citations.write'
  | 'workflow.read'
  | 'workflow.trigger'
  | 'analytics.read'
  | 'analytics.export'
  | 'users.read'
  | 'users.write'
  | 'users.delete'
  | 'settings.read'
  | 'settings.write';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: UserRole;
  status: UserStatus;
  permissions: Permission[];
  joinedAt: Date;
  lastActiveAt: Date;
  metadata: Record<string, any>;
}

export interface UserFilters {
  role: UserRole | null;
  status: UserStatus | null;
  searchQuery: string;
}

export interface Activity {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
  description: string;
}

export const ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: 'admin',
    permissions: [
      'roadmap.read',
      'roadmap.write',
      'roadmap.delete',
      'content.read',
      'content.write',
      'content.publish',
      'content.delete',
      'citations.read',
      'citations.write',
      'workflow.read',
      'workflow.trigger',
      'analytics.read',
      'analytics.export',
      'users.read',
      'users.write',
      'users.delete',
      'settings.read',
      'settings.write',
    ],
    description: 'Full system access',
  },
  {
    role: 'editor',
    permissions: [
      'roadmap.read',
      'roadmap.write',
      'content.read',
      'content.write',
      'content.publish',
      'citations.read',
      'citations.write',
      'workflow.read',
      'workflow.trigger',
      'analytics.read',
    ],
    description: 'Content creation and workflow management',
  },
  {
    role: 'analyst',
    permissions: [
      'roadmap.read',
      'content.read',
      'citations.read',
      'workflow.read',
      'analytics.read',
      'analytics.export',
    ],
    description: 'Read-only access with analytics export',
  },
  {
    role: 'viewer',
    permissions: [
      'roadmap.read',
      'content.read',
      'citations.read',
      'workflow.read',
      'analytics.read',
    ],
    description: 'Read-only access',
  },
];
