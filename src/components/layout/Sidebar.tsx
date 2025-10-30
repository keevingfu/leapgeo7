import { NavLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  ListSubheader,
  Avatar,
  Card,
  CardContent,
  Chip,
  Button,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Map as MapIcon,
  Inventory as InventoryIcon,
  Landscape as LandscapeIcon,
  AutoAwesome as GeneratorIcon,
  FormatQuote as CitationIcon,
  AccountTree as WorkflowIcon,
  Settings as SettingsIcon,
  Edit as EditIcon,
  Assessment as ReportsIcon,
  GridOn as CoverageIcon,
  Star as StarIcon,
  People as PeopleIcon,
  ShowChart as ChartIcon,
  Help as HelpIcon,
  LocalOffer as LocalOfferIcon,
  ShoppingCart as ShoppingCartIcon,
  DeviceHub as DeviceHubIcon,
  Logout as LogoutIcon,
  SmartToy as SmartToyIcon,
  Assessment as AssessmentIcon,
  FormatQuote,
  Rocket as RocketIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';

const SIDEBAR_WIDTH = 280;

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  color?: string;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

// Organized navigation structure
const navSections: NavSection[] = [
  // Overview (no section title)
  {
    items: [
      { path: '/dashboard', label: 'Overview', icon: <DashboardIcon />, color: '#1976d2' },
    ],
  },

  // Data Pipeline Section (NEW)
  {
    title: 'Data Pipeline',
    items: [
      { path: '/data-acquisition', label: 'Data Acquisition Hub', icon: <DeviceHubIcon />, color: '#9333EA' },
      { path: '/etl-pipeline', label: 'ETL Pipeline Viewer', icon: <ChartIcon />, color: '#0EA5E9' },
    ],
  },

  // AI Generation Section (NEW)
  {
    title: 'AI Generation',
    items: [
      { path: '/aigc-studio', label: 'AIGC Studio', icon: <SmartToyIcon />, color: '#6366F1' },
      { path: '/content-scoring', label: 'Content Scoring Center', icon: <AssessmentIcon />, color: '#10B981' },
    ],
  },

  // Awareness Section
  {
    title: 'Awareness',
    items: [
      { path: '/battlefield', label: 'Situational Awareness', icon: <LandscapeIcon />, color: '#EF4444' },
      { path: '/geo-mapping-network', label: 'Content Mapping', icon: <DeviceHubIcon />, color: '#8B5CF6' },
      { path: '/geo-strategy', label: 'GEO Strategy', icon: <RocketIcon />, color: '#FF6B6B' },
      { path: '/coverage', label: 'Content Coverage', icon: <CoverageIcon />, color: '#10B981' },
      { path: '/citation-strength', label: 'Citation Strength', icon: <StarIcon />, color: '#EC4899' },
    ],
  },

  // Execution Section
  {
    title: 'Execution',
    items: [
      { path: '/roadmap', label: 'Roadmap Manager', icon: <MapIcon />, color: '#8B5CF6' },
      { path: '/content', label: 'Content Registry', icon: <InventoryIcon />, color: '#06B6D4' },
      { path: '/prompts', label: 'Prompt Landscape', icon: <LandscapeIcon />, color: '#F59E0B' },
      { path: '/generator', label: 'Content Generator', icon: <GeneratorIcon />, color: '#10B981' },
      { path: '/citations', label: 'Citation Tracker', icon: <CitationIcon />, color: '#EC4899' },
      { path: '/kpi', label: 'KPI Dashboard', icon: <ChartIcon />, color: '#6366F1' },
    ],
  },

  // Publishing Section (NEW)
  {
    title: 'Publishing',
    items: [
      { path: '/multi-channel-publisher', label: 'Multi-Channel Publisher', icon: <DeviceHubIcon />, color: '#F59E0B' },
      { path: '/citation-monitor', label: 'Citation Monitor', icon: <FormatQuote />, color: '#06B6D4' },
    ],
  },

  // Analytics Section (NEW)
  {
    title: 'Analytics',
    items: [
      { path: '/analytics-dashboard', label: 'Analytics Dashboard', icon: <DashboardIcon />, color: '#8B5CF6' },
    ],
  },

  // Conversion Section
  {
    title: 'Conversion',
    items: [
      { path: '/offers', label: 'Offers', icon: <LocalOfferIcon />, color: '#9C27B0' },
      { path: '/orders', label: 'Orders', icon: <ShoppingCartIcon />, color: '#FF9800' },
    ],
  },

  // Admin Section
  {
    title: 'Admin',
    items: [
      { path: '/workflow', label: 'Workflow Monitor', icon: <WorkflowIcon />, color: '#3B82F6' },
      { path: '/templates', label: 'Template Editor', icon: <EditIcon />, color: '#F59E0B' },
      { path: '/reports', label: 'Analytics Reports', icon: <ReportsIcon />, color: '#8B5CF6' },
      { path: '/users', label: 'User Management', icon: <PeopleIcon />, color: '#6366F1' },
      { path: '/settings', label: 'System Settings', icon: <SettingsIcon />, color: '#6b7280' },
      { path: '/help', label: 'Help & Documentation', icon: <HelpIcon />, color: '#F97316' },
    ],
  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'editor':
        return 'warning';
      case 'analyst':
        return 'info';
      case 'viewer':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Logo/Title */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Typography variant="h6" component="div" fontWeight={700} color="primary">
          SweetNight GEO
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Situational Awareness & Mission Execution Platform
        </Typography>
      </Box>

      <Divider />

      {/* User Info Card */}
      {user && (
        <Box sx={{ p: 2 }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: 'primary.main',
                    fontWeight: 700,
                  }}
                >
                  {user.username[0].toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {user.username}
                  </Typography>
                  <Chip
                    label={user.role}
                    size="small"
                    color={getRoleColor(user.role) as any}
                    sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      <Divider />

      {/* Navigation */}
      <List sx={{ px: 2, py: 1, flex: 1, overflow: 'auto' }}>
        {navSections.map((section, sectionIndex) => (
          <Box key={sectionIndex}>
            {/* Section Title */}
            {section.title && (
              <>
                {sectionIndex > 0 && <Divider sx={{ my: 1.5 }} />}
                <ListSubheader
                  sx={{
                    bgcolor: 'transparent',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    px: 2,
                    py: 1,
                  }}
                >
                  {section.title}
                </ListSubheader>
              </>
            )}

            {/* Section Items */}
            {section.items.map((item) => (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <NavLink
                  to={item.path}
                  style={{ textDecoration: 'none', width: '100%' }}
                >
                  {({ isActive }) => (
                    <ListItemButton
                      selected={isActive}
                      sx={{
                        borderRadius: 1,
                        '&.Mui-selected': {
                          bgcolor: item.color ? `${item.color}15` : 'action.selected',
                          borderLeft: '3px solid',
                          borderColor: item.color || 'primary.main',
                          '&:hover': {
                            bgcolor: item.color ? `${item.color}25` : 'action.hover',
                          },
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: isActive ? (item.color || 'primary.main') : 'text.secondary',
                          minWidth: 40,
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? 'text.primary' : 'text.secondary',
                        }}
                      />
                    </ListItemButton>
                  )}
                </NavLink>
              </ListItem>
            ))}
          </Box>
        ))}
      </List>

      {/* Logout Button */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            py: 1,
            borderRadius: 1,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
}
