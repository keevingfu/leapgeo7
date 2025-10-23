import { createTheme } from '@mui/material/styles';

// Priority colors (P0-P3) from design system
export const priorityColors = {
  P0: {
    main: '#EF4444',    // Red-500
    light: '#FEF2F2',   // Red-50
    dark: '#DC2626',    // Red-600
  },
  P1: {
    main: '#F97316',    // Orange-500
    light: '#FFF7ED',   // Orange-50
    dark: '#EA580C',    // Orange-600
  },
  P2: {
    main: '#EAB308',    // Yellow-500
    light: '#FEFCE8',   // Yellow-50
    dark: '#CA8A04',    // Yellow-600
  },
  P3: {
    main: '#22C55E',    // Green-500
    light: '#F0FDF4',   // Green-50
    dark: '#16A34A',    // Green-600
  },
};

// Workflow step colors (7-step system)
export const workflowColors = {
  step1: '#8B5CF6',  // Purple-500 (Roadmap Ingestor)
  step2: '#06B6D4',  // Cyan-500 (Content Registry)
  step3: '#F59E0B',  // Amber-500 (Prompt Landscape)
  step4: '#3B82F6',  // Blue-500 (Content Ingestor)
  step5: '#10B981',  // Emerald-500 (Content Generator)
  step6: '#EC4899',  // Pink-500 (Citation Tracker)
  step7: '#6366F1',  // Indigo-500 (Feedback Analyzer)
};

// Create Material-UI theme
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    error: {
      main: priorityColors.P0.main,
      light: priorityColors.P0.light,
      dark: priorityColors.P0.dark,
    },
    warning: {
      main: priorityColors.P1.main,
      light: priorityColors.P1.light,
      dark: priorityColors.P1.dark,
    },
    info: {
      main: '#0ea5e9',
      light: '#38bdf8',
      dark: '#0284c7',
    },
    success: {
      main: priorityColors.P3.main,
      light: priorityColors.P3.light,
      dark: priorityColors.P3.dark,
    },
    background: {
      default: '#f9fafb',
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#6b7280',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
  },
});
