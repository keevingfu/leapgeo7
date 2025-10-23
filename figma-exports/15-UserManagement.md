# User Management Page - Design Specification

**Page**: User Management
**Route**: `/users`
**Design Status**: ✅ Approved
**Last Updated**: 2025-10-21

## Layout Composition

```
┌─────────────────────────────────────────────────────────────┐
│  Header: "User Management"  │  [Invite User] [Manage Roles] │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  User Overview Cards (4 columns)                            │
│  ┌──────────────┬──────────────┬──────────────┬───────────┐│
│  │ Total Users  │ Active Users │ Admins       │ Invitations││
│  │     42       │     38       │      5       │      3     ││
│  │  +2 (7d)     │  +1 (7d)     │    (12%)     │  Pending   ││
│  └──────────────┴──────────────┴──────────────┴───────────┘│
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Left: User List (65% width)                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Search: [🔍 Search by name, email, role...]         │  │
│  │ Filters: [All ▼] [Active ▼] [All Roles ▼]          │  │
│  │ ──────────────────────────────────────────────────── │  │
│  │                                                       │  │
│  │ ┌─┬─────────┬────────────┬─────────┬─────────┬────┐│  │
│  │ │☑│ User    │ Email      │ Role    │ Status  │ ... ││  │
│  │ ├─┼─────────┼────────────┼─────────┼─────────┼────┤│  │
│  │ │☐│ 👤 Alice│alice@...   │ 👑 Admin│ ●Active │ ⋮  ││  │
│  │ │☐│ 👤 Bob  │bob@...     │ ✏️ Editor│ ●Active │ ⋮  ││  │
│  │ │☐│ 👤 Carol│carol@...   │ 📊Analyst│ ●Active │ ⋮  ││  │
│  │ │☐│ 👤 Dave │dave@...    │ 👁️ Viewer│ ⚪Inactive│ ⋮ ││  │
│  │ │☐│ 👤 Eve  │eve@...     │ ✏️ Editor│ ●Active │ ⋮  ││  │
│  │ └─┴─────────┴────────────┴─────────┴─────────┴────┘│  │
│  │                                                       │  │
│  │ Bulk Actions: [Change Role] [Deactivate] [Delete]   │  │
│  │ Pagination: [< 1 2 3 ... 5 >]                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Right: User Details Panel (35% width)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 👤 Alice Chen                           [Edit] [×]   │  │
│  │ alice.chen@sweetnight.com                            │  │
│  │ ──────────────────────────────────────────────────── │  │
│  │                                                       │  │
│  │ Role: 👑 Admin                                        │  │
│  │ Status: ●Active                                       │  │
│  │ Joined: 2025-01-15                                    │  │
│  │ Last Active: 2 hours ago                              │  │
│  │                                                       │  │
│  │ ──────────────────────────────────────────────────── │  │
│  │                                                       │  │
│  │ Permissions:                                          │  │
│  │ ☑ Manage Roadmap (Read, Write, Delete)               │  │
│  │ ☑ Create Content (Read, Write, Publish)              │  │
│  │ ☑ View Citations (Read)                              │  │
│  │ ☑ View Analytics (Read)                              │  │
│  │ ☑ Manage Users (Read, Write, Delete)                 │  │
│  │ ☑ Configure System (Read, Write)                     │  │
│  │                                                       │  │
│  │ ──────────────────────────────────────────────────── │  │
│  │                                                       │  │
│  │ Activity Log (Last 7 days):                          │  │
│  │ • Created 5 roadmap items                            │  │
│  │ • Published 3 content pieces                         │  │
│  │ • Updated workflow settings                          │  │
│  │ [View Full Activity Log]                             │  │
│  │                                                       │  │
│  │ ──────────────────────────────────────────────────── │  │
│  │                                                       │  │
│  │ [Deactivate Account]  [Delete Account]               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Design Tokens

**Colors**:
- Admin Role: #EF4444 (Red-500)
- Editor Role: #3B82F6 (Blue-500)
- Analyst Role: #F59E0B (Amber-500)
- Viewer Role: #6B7280 (Gray-500)
- Active Status: #22C55E (Green-500)
- Inactive Status: #9CA3AF (Gray-400)
- Pending Invitation: #F59E0B (Amber-500)

**Spacing**:
- Card Gap: 24px
- Table Row Height: 60px
- Details Panel Padding: 24px

**Typography**:
- User Name: 16px, Semibold, #111827
- Email: 14px, Regular, #6B7280
- Role Badge: 14px, Medium, #FFFFFF
- Section Title: 18px, Bold, #111827

## Components Used

1. **PageHeader**
   - Title: "User Management"
   - Subtitle: "Manage team members, roles, and permissions"
   - Actions: [Invite User, Manage Roles]

2. **UserOverviewCards** (×4)
   - Total Users
   - Active Users (with 7-day change)
   - Admin Count (percentage)
   - Pending Invitations

3. **UserDataTable**
   - Sortable columns
   - Multi-select checkboxes
   - Search bar
   - Filter dropdowns
   - Bulk actions toolbar
   - Pagination

4. **UserDetailsPanel**
   - User profile card
   - Role badge
   - Status indicator
   - Permissions checklist
   - Activity log preview
   - Action buttons

5. **InviteUserModal**
   - Email input
   - Role selector
   - Custom message
   - Permission template
   - Send invitation button

6. **RoleManagementModal**
   - 4 default roles (Admin, Editor, Analyst, Viewer)
   - Custom role creation
   - Permission matrix
   - Role assignment

## Data Structure

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'invited';
  joinedAt: Date;
  lastActiveAt: Date;
  permissions: Permission[];
  activityLog: Activity[];
}

enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  ANALYST = 'analyst',
  VIEWER = 'viewer'
}

interface Permission {
  resource: string; // 'roadmap' | 'content' | 'citations' | 'analytics' | 'users' | 'settings'
  actions: ('read' | 'write' | 'delete' | 'publish')[];
}

interface Activity {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: Date;
  details: Record<string, any>;
}

interface Invitation {
  id: string;
  email: string;
  role: UserRole;
  invitedBy: string;
  invitedAt: Date;
  expiresAt: Date;
  status: 'pending' | 'accepted' | 'expired';
  customMessage?: string;
}
```

## Role Definitions

### 👑 Admin
**Full System Access**:
- ✅ Manage Roadmap (Read, Write, Delete)
- ✅ Create Content (Read, Write, Publish, Delete)
- ✅ View Citations (Read, Track)
- ✅ View Analytics (Read, Export)
- ✅ Manage Users (Read, Write, Delete, Invite)
- ✅ Configure System (Read, Write)
- ✅ Manage Workflows (Read, Write, Trigger)

**Color**: Red (#EF4444)
**Icon**: 👑

### ✏️ Editor
**Content Creation & Management**:
- ✅ Manage Roadmap (Read, Write)
- ✅ Create Content (Read, Write, Publish)
- ✅ View Citations (Read)
- ✅ View Analytics (Read)
- ❌ Manage Users
- ❌ Configure System
- ✅ View Workflows (Read)

**Color**: Blue (#3B82F6)
**Icon**: ✏️

### 📊 Analyst
**Data Analysis & Reporting**:
- ✅ View Roadmap (Read)
- ✅ View Content (Read)
- ✅ View Citations (Read, Track)
- ✅ View Analytics (Read, Export)
- ❌ Manage Users
- ❌ Configure System
- ✅ View Workflows (Read)

**Color**: Amber (#F59E0B)
**Icon**: 📊

### 👁️ Viewer
**Read-Only Access**:
- ✅ View Roadmap (Read)
- ✅ View Content (Read)
- ✅ View Citations (Read)
- ✅ View Analytics (Read)
- ❌ Manage Users
- ❌ Configure System
- ✅ View Workflows (Read)

**Color**: Gray (#6B7280)
**Icon**: 👁️

## Permission Matrix

```typescript
const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    { resource: 'roadmap', actions: ['read', 'write', 'delete'] },
    { resource: 'content', actions: ['read', 'write', 'delete', 'publish'] },
    { resource: 'citations', actions: ['read', 'write'] },
    { resource: 'analytics', actions: ['read', 'write'] },
    { resource: 'users', actions: ['read', 'write', 'delete'] },
    { resource: 'settings', actions: ['read', 'write'] },
    { resource: 'workflow', actions: ['read', 'write'] }
  ],
  editor: [
    { resource: 'roadmap', actions: ['read', 'write'] },
    { resource: 'content', actions: ['read', 'write', 'publish'] },
    { resource: 'citations', actions: ['read'] },
    { resource: 'analytics', actions: ['read'] },
    { resource: 'workflow', actions: ['read'] }
  ],
  analyst: [
    { resource: 'roadmap', actions: ['read'] },
    { resource: 'content', actions: ['read'] },
    { resource: 'citations', actions: ['read', 'write'] },
    { resource: 'analytics', actions: ['read', 'write'] },
    { resource: 'workflow', actions: ['read'] }
  ],
  viewer: [
    { resource: 'roadmap', actions: ['read'] },
    { resource: 'content', actions: ['read'] },
    { resource: 'citations', actions: ['read'] },
    { resource: 'analytics', actions: ['read'] },
    { resource: 'workflow', actions: ['read'] }
  ]
};
```

## User Table Specifications

**Columns**:
1. **Checkbox** - Multi-select
2. **User** - Avatar + Name
3. **Email** - User email address
4. **Role** - Role badge with icon
5. **Status** - Active/Inactive indicator
6. **Last Active** - Relative time (e.g., "2 hours ago")
7. **Actions** - Dropdown menu (⋮)

**Sorting**:
- Name (A-Z, Z-A)
- Email (A-Z, Z-A)
- Role (Admin → Viewer)
- Last Active (Newest first, Oldest first)

**Filtering**:
- **Status**: All, Active, Inactive, Invited
- **Role**: All Roles, Admin, Editor, Analyst, Viewer
- **Date Range**: Joined in last 7/30/90 days

**Search**:
- Search by name, email, or role
- Real-time filtering as user types
- Debounced 300ms

**Bulk Actions**:
- Change Role (opens role selector modal)
- Deactivate (confirmation required)
- Delete (confirmation + password required)
- Export as CSV

## User Details Panel

**Sections**:

### 1. Profile Header
- Avatar (default: initials in colored circle)
- Name
- Email
- Edit button (opens edit modal)
- Close button (×)

### 2. Basic Info
- Role badge with icon
- Status indicator (●Active / ⚪Inactive)
- Joined date
- Last active timestamp (relative, e.g., "2 hours ago")

### 3. Permissions List
- Checkboxes showing enabled permissions
- Grouped by resource (Roadmap, Content, Citations, etc.)
- Actions per resource (Read, Write, Delete, Publish)
- Disabled for non-admins viewing others

### 4. Activity Log Preview
- Last 5 activities
- Timestamp + action description
- Icon per action type
- "View Full Activity Log" link

### 5. Danger Zone (Admin only)
- [Deactivate Account] button (yellow)
- [Delete Account] button (red)
- Confirmation modals for both

## Interactions

**Invite User**:
1. Click "Invite User" button
2. Modal opens with form:
   - Email input (required)
   - Role selector dropdown (default: Viewer)
   - Custom message textarea (optional)
   - Permission template (pre-filled based on role)
3. Click "Send Invitation"
4. Validation:
   - Email format valid
   - Email not already in system
   - Role selected
5. If valid:
   - Invitation email sent
   - User added to "Pending Invitations" list
   - Success toast: "Invitation sent to {email}"
   - Invitation expires in 7 days

**Click User Row**:
1. Click user row in table
2. User details panel slides in from right (300ms)
3. User row highlighted in table
4. Panel shows full user details
5. Click elsewhere or [×] to close

**Change User Role**:
1. Select user(s) with checkboxes
2. Click "Change Role" in bulk actions
3. Modal opens with role selector
4. Select new role
5. Confirmation: "Change role for {count} user(s)?"
6. Click "Confirm" → Roles updated
7. Success toast: "{count} user(s) updated"

**Deactivate User**:
1. Select user (single or bulk)
2. Click "Deactivate" in bulk actions or details panel
3. Confirmation modal: "Deactivate {name}? They will lose access immediately."
4. Click "Deactivate" → User status → Inactive
5. User sessions terminated
6. User can no longer log in

**Delete User**:
1. Click "Delete Account" in details panel (Admin only)
2. Confirmation modal:
   - "Delete {name}? This action cannot be undone."
   - "All data created by this user will remain."
   - Password input for admin confirmation
3. Click "Delete" → User permanently deleted
4. User removed from table
5. Activity log entry created

**Edit User Profile**:
1. Click "Edit" button in details panel
2. Modal opens with editable fields:
   - Name
   - Email (with verification flow)
   - Avatar (upload or URL)
   - Role (Admin only can change)
3. Click "Save" → User updated
4. Success toast: "Profile updated"

**View Activity Log**:
1. Click "View Full Activity Log" in details panel
2. Modal opens with paginated activity table
3. Columns: Timestamp, Action, Resource, Details
4. Filter by date range and action type
5. Export as CSV option

**Manage Roles**:
1. Click "Manage Roles" in header
2. Modal opens with role configuration
3. Shows 4 default roles + custom roles
4. For each role:
   - Name
   - Description
   - Permission checkboxes
   - User count (how many assigned)
5. Edit role permissions (Admin only)
6. Create custom role button
7. Save changes → All users with that role updated

## Invitation Flow

**Send Invitation**:
```
Admin clicks "Invite User"
  → Fill form (email, role, message)
  → System generates invitation token
  → Email sent with magic link
  → Invitation status: Pending
```

**Accept Invitation**:
```
User clicks magic link in email
  → Redirects to signup page (pre-filled email)
  → User creates password
  → Account activated
  → User logged in
  → Invitation status: Accepted
```

**Expired Invitation**:
```
Invitation not accepted in 7 days
  → Status: Expired
  → Admin notified
  → Admin can resend invitation
```

## Activity Log Types

**Activity Categories**:
1. **Roadmap**: Created item, Updated item, Deleted item
2. **Content**: Created content, Published content, Updated content, Deleted content
3. **Citations**: Tracked citation, Updated citation, Deleted citation
4. **Analytics**: Viewed dashboard, Exported report, Generated analysis
5. **Users**: Invited user, Changed role, Deactivated user, Deleted user
6. **Settings**: Updated settings, Changed priority rules, Modified workflow
7. **Workflow**: Triggered workflow, Paused workflow, Resumed workflow

**Activity Log Entry Format**:
```typescript
interface ActivityEntry {
  timestamp: Date;
  user: string;
  action: string;
  resource: string;
  details: string;
  icon: string;
}

// Example:
{
  timestamp: '2025-10-21T14:32:45Z',
  user: 'Alice Chen',
  action: 'Published',
  resource: 'Content',
  details: 'YouTube video: "Best mattress for back pain"',
  icon: '📺'
}
```

## Responsive Breakpoints

**Desktop (> 1024px)**:
- Side-by-side table and details panel (65/35)
- Full table columns visible
- All action buttons visible

**Tablet (640px - 1024px)**:
- Table stacks above details panel
- Some table columns hidden (Last Active)
- Simplified action menu

**Mobile (< 640px)**:
- Single column layout
- Card-based user list (instead of table)
- Details panel as full-screen modal
- Simplified filters

## Accessibility

- **Keyboard Navigation**: Tab through all interactive elements
- **Screen Reader**: User status announced ("Alice Chen, Admin, Active")
- **Focus States**: Blue ring on focused elements
- **ARIA Labels**: All action buttons labeled

## Magic UI Integration

**Used Components**:
- `badge` - Role badges with icons
- `animated-list` - User table rows with entrance animation
- `tooltip` - Permission descriptions
- `shimmer-button` - "Invite User" CTA
- `avatar` - User avatars with fallback initials

**Implementation Example**:
```tsx
<UserManagement>
  <UserOverviewCards data={userMetrics} />

  <UserDataTable
    users={users}
    selectedUsers={selectedUsers}
    onSelectionChange={setSelectedUsers}
    onUserClick={openUserDetails}
  />

  <UserDetailsPanel
    user={selectedUser}
    onClose={() => setSelectedUser(null)}
    onEdit={handleEditUser}
    onDeactivate={handleDeactivateUser}
  />

  <InviteUserModal
    open={inviteModalOpen}
    onClose={() => setInviteModalOpen(false)}
    onInvite={handleInviteUser}
  />
</UserManagement>
```

---

**Design Assets**:
- Figma File: `sweetnight-geo-user-management.fig`
- Component Library: `sweetnight-components.fig`
- Icon Set: `lucide-react`
- Avatar Library: Gravatar or initials fallback

**Status**: ✅ Design Complete, Ready for Implementation
