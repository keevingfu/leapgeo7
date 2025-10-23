import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Grid,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  People as PeopleIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon,
  Create as EditorIcon,
  Analytics as AnalystIcon,
  Visibility as ViewerIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
} from '@mui/icons-material';

type UserRole = 'admin' | 'editor' | 'analyst' | 'viewer';
type UserStatus = 'active' | 'inactive';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
  createdAt: string;
}

interface Permission {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

// Mock user data
const initialUsers: User[] = [
  {
    id: '1',
    name: 'John Admin',
    email: 'john@sweetnight.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2025-01-21 10:30 AM',
    createdAt: '2024-12-01',
  },
  {
    id: '2',
    name: 'Sarah Editor',
    email: 'sarah@sweetnight.com',
    role: 'editor',
    status: 'active',
    lastLogin: '2025-01-21 09:15 AM',
    createdAt: '2024-12-15',
  },
  {
    id: '3',
    name: 'Mike Analyst',
    email: 'mike@sweetnight.com',
    role: 'analyst',
    status: 'active',
    lastLogin: '2025-01-20 03:45 PM',
    createdAt: '2025-01-05',
  },
  {
    id: '4',
    name: 'Emily Viewer',
    email: 'emily@sweetnight.com',
    role: 'viewer',
    status: 'active',
    lastLogin: '2025-01-19 11:20 AM',
    createdAt: '2025-01-10',
  },
  {
    id: '5',
    name: 'David Former',
    email: 'david@sweetnight.com',
    role: 'viewer',
    status: 'inactive',
    lastLogin: '2024-12-20 02:00 PM',
    createdAt: '2024-11-01',
  },
];

const roleConfig = {
  admin: {
    label: 'Admin',
    description: 'Full system access with all permissions',
    color: '#EF4444',
    icon: AdminIcon,
  },
  editor: {
    label: 'Editor',
    description: 'Can create, edit, and publish content',
    color: '#F59E0B',
    icon: EditorIcon,
  },
  analyst: {
    label: 'Analyst',
    description: 'View and analyze data, generate reports',
    color: '#3B82F6',
    icon: AnalystIcon,
  },
  viewer: {
    label: 'Viewer',
    description: 'Read-only access to dashboards and reports',
    color: '#94A3B8',
    icon: ViewerIcon,
  },
};

// Permission matrix by role
const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    { module: 'Dashboard', view: true, create: true, edit: true, delete: true },
    { module: 'Roadmap', view: true, create: true, edit: true, delete: true },
    { module: 'Content', view: true, create: true, edit: true, delete: true },
    { module: 'Citations', view: true, create: true, edit: true, delete: true },
    { module: 'Analytics', view: true, create: true, edit: true, delete: true },
    { module: 'Settings', view: true, create: true, edit: true, delete: true },
    { module: 'Users', view: true, create: true, edit: true, delete: true },
  ],
  editor: [
    { module: 'Dashboard', view: true, create: false, edit: false, delete: false },
    { module: 'Roadmap', view: true, create: true, edit: true, delete: false },
    { module: 'Content', view: true, create: true, edit: true, delete: false },
    { module: 'Citations', view: true, create: true, edit: true, delete: false },
    { module: 'Analytics', view: true, create: false, edit: false, delete: false },
    { module: 'Settings', view: true, create: false, edit: false, delete: false },
    { module: 'Users', view: false, create: false, edit: false, delete: false },
  ],
  analyst: [
    { module: 'Dashboard', view: true, create: false, edit: false, delete: false },
    { module: 'Roadmap', view: true, create: false, edit: false, delete: false },
    { module: 'Content', view: true, create: false, edit: false, delete: false },
    { module: 'Citations', view: true, create: false, edit: false, delete: false },
    { module: 'Analytics', view: true, create: true, edit: true, delete: false },
    { module: 'Settings', view: false, create: false, edit: false, delete: false },
    { module: 'Users', view: false, create: false, edit: false, delete: false },
  ],
  viewer: [
    { module: 'Dashboard', view: true, create: false, edit: false, delete: false },
    { module: 'Roadmap', view: true, create: false, edit: false, delete: false },
    { module: 'Content', view: true, create: false, edit: false, delete: false },
    { module: 'Citations', view: true, create: false, edit: false, delete: false },
    { module: 'Analytics', view: true, create: false, edit: false, delete: false },
    { module: 'Settings', view: false, create: false, edit: false, delete: false },
    { module: 'Users', view: false, create: false, edit: false, delete: false },
  ],
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewPermissions, setViewPermissions] = useState<UserRole | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'viewer' as UserRole,
    status: 'active' as UserStatus,
  });

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } else {
      setSelectedUser(null);
      setFormData({
        name: '',
        email: '',
        role: 'viewer',
        status: 'active',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleSaveUser = () => {
    if (selectedUser) {
      // Edit existing user
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id
            ? { ...u, ...formData, lastLogin: selectedUser.lastLogin, createdAt: selectedUser.createdAt }
            : u
        )
      );
      setSuccessMessage(`User ${formData.name} updated successfully!`);
    } else {
      // Create new user
      const newUser: User = {
        id: String(users.length + 1),
        ...formData,
        lastLogin: 'Never',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setUsers([...users, newUser]);
      setSuccessMessage(`User ${formData.name} created successfully!`);
    }
    handleCloseDialog();
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((u) => u.id !== userId));
    setSuccessMessage('User deleted successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(
      users.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
          : u
      )
    );
  };

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === 'active').length,
    adminCount: users.filter((u) => u.role === 'admin').length,
    editorCount: users.filter((u) => u.role === 'editor').length,
    analystCount: users.filter((u) => u.role === 'analyst').length,
    viewerCount: users.filter((u) => u.role === 'viewer').length,
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#6366F115',
              color: '#6366F1',
            }}
          >
            <PeopleIcon fontSize="large" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" component="h1" fontWeight={600}>
              User Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage user accounts, roles, and permissions
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add User
          </Button>
        </Box>
      </Box>

      {/* Success Alert */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h4" fontWeight={700}>
                {stats.totalUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Active Users
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ color: '#10B981' }}>
                {stats.activeUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <Card sx={{ borderLeft: 3, borderColor: roleConfig.admin.color }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Admins
              </Typography>
              <Typography variant="h4" fontWeight={700}>
                {stats.adminCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <Card sx={{ borderLeft: 3, borderColor: roleConfig.editor.color }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Editors
              </Typography>
              <Typography variant="h4" fontWeight={700}>
                {stats.editorCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <Card sx={{ borderLeft: 3, borderColor: roleConfig.analyst.color }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Analysts
              </Typography>
              <Typography variant="h4" fontWeight={700}>
                {stats.analystCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <Card sx={{ borderLeft: 3, borderColor: roleConfig.viewer.color }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Viewers
              </Typography>
              <Typography variant="h4" fontWeight={700}>
                {stats.viewerCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* User List Table */}
        <Grid item xs={12} md={viewPermissions ? 8 : 12}>
          <Paper>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                User List
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Last Login</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => {
                      const RoleIcon = roleConfig[user.role].icon;
                      return (
                        <TableRow key={user.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <RoleIcon sx={{ fontSize: 20, color: roleConfig[user.role].color }} />
                              <Typography variant="body2" fontWeight={600}>
                                {user.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {user.email}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={roleConfig[user.role].label}
                              size="small"
                              onClick={() => setViewPermissions(user.role)}
                              sx={{
                                bgcolor: roleConfig[user.role].color + '20',
                                color: roleConfig[user.role].color,
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {user.status === 'active' ? (
                                <ActiveIcon sx={{ fontSize: 18, color: '#10B981' }} />
                              ) : (
                                <InactiveIcon sx={{ fontSize: 18, color: '#EF4444' }} />
                              )}
                              <Typography
                                variant="body2"
                                sx={{
                                  color: user.status === 'active' ? '#10B981' : '#EF4444',
                                  fontWeight: 600,
                                }}
                              >
                                {user.status === 'active' ? 'Active' : 'Inactive'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {user.lastLogin}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleOpenDialog(user)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                              <Switch
                                size="small"
                                checked={user.status === 'active'}
                                onChange={() => handleToggleStatus(user.id)}
                              />
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Permission Matrix */}
        {viewPermissions && (
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  {roleConfig[viewPermissions].label} Permissions
                </Typography>
                <Button size="small" onClick={() => setViewPermissions(null)}>
                  Close
                </Button>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {roleConfig[viewPermissions].description}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Module</TableCell>
                      <TableCell align="center">View</TableCell>
                      <TableCell align="center">Create</TableCell>
                      <TableCell align="center">Edit</TableCell>
                      <TableCell align="center">Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rolePermissions[viewPermissions].map((perm) => (
                      <TableRow key={perm.module}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {perm.module}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {perm.view ? (
                            <CheckCircle sx={{ fontSize: 18, color: '#10B981' }} />
                          ) : (
                            <Cancel sx={{ fontSize: 18, color: '#EF4444' }} />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {perm.create ? (
                            <CheckCircle sx={{ fontSize: 18, color: '#10B981' }} />
                          ) : (
                            <Cancel sx={{ fontSize: 18, color: '#EF4444' }} />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {perm.edit ? (
                            <CheckCircle sx={{ fontSize: 18, color: '#10B981' }} />
                          ) : (
                            <Cancel sx={{ fontSize: 18, color: '#EF4444' }} />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {perm.delete ? (
                            <CheckCircle sx={{ fontSize: 18, color: '#10B981' }} />
                          ) : (
                            <Cancel sx={{ fontSize: 18, color: '#EF4444' }} />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        )}

        {/* Role Descriptions */}
        {!viewPermissions && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Role Descriptions
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={2}>
                {(Object.keys(roleConfig) as UserRole[]).map((role) => {
                  const RoleIcon = roleConfig[role].icon;
                  return (
                    <Grid item xs={12} sm={6} md={3} key={role}>
                      <Card
                        variant="outlined"
                        sx={{
                          borderLeft: 3,
                          borderColor: roleConfig[role].color,
                          cursor: 'pointer',
                          '&:hover': { bgcolor: '#F9FAFB' },
                        }}
                        onClick={() => setViewPermissions(role)}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <RoleIcon sx={{ color: roleConfig[role].color }} />
                            <Typography variant="h6" fontWeight={600}>
                              {roleConfig[role].label}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {roleConfig[role].description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Add/Edit User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedUser ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                label="Role"
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              >
                {(Object.keys(roleConfig) as UserRole[]).map((role) => {
                  const RoleIcon = roleConfig[role].icon;
                  return (
                    <MenuItem key={role} value={role}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <RoleIcon sx={{ fontSize: 18, color: roleConfig[role].color }} />
                        {roleConfig[role].label}
                      </Box>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.status === 'active'}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.checked ? 'active' : 'inactive' })
                  }
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveUser}
            disabled={!formData.name || !formData.email}
          >
            {selectedUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// Helper components for permission icons
function CheckCircle(props: { sx?: object }) {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...props.sx,
      }}
    >
      ✓
    </Box>
  );
}

function Cancel(props: { sx?: object }) {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...props.sx,
      }}
    >
      ✗
    </Box>
  );
}
