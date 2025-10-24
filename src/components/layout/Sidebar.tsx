import { NavLink } from 'react-router-dom';
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
  Hub as HubIcon,
} from '@mui/icons-material';

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

  // Awareness Section
  {
    title: 'Awareness',
    items: [
      { path: '/battlefield', label: 'Situational Awareness', icon: <LandscapeIcon />, color: '#EF4444' },
      { path: '/content-mapping', label: 'Content Mapping', icon: <HubIcon />, color: '#3B82F6' },
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

      {/* Navigation */}
      <List sx={{ px: 2, py: 1 }}>
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
    </Drawer>
  );
}
