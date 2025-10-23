import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ArrowForward,
  Dashboard as DashboardIcon,
  Inventory,
  FormatQuote as CitationIcon,
  Timeline,
  Speed,
} from '@mui/icons-material';
import { useAppDispatch } from '@/store';
import WorkflowStepper from '@/components/WorkflowStepper';
import PriorityBadge from '@/components/PriorityBadge';

// Mock data for demonstration
const mockKPIData = {
  totalContent: { value: 1247, change: 12.5, trend: 'up' as const },
  totalCitations: { value: 892, change: 8.3, trend: 'up' as const },
  citationRate: { value: 71.5, change: -2.1, trend: 'down' as const },
  avgGeoScore: { value: 78.2, change: 5.4, trend: 'up' as const },
};

const mockRecentActivities = [
  {
    id: '1',
    action: 'New content published',
    title: 'Best Mattress for Back Pain 2025',
    time: '2 minutes ago',
    type: 'success' as const,
  },
  {
    id: '2',
    action: 'Citation detected',
    title: 'Featured in ChatGPT response',
    time: '15 minutes ago',
    type: 'info' as const,
  },
  {
    id: '3',
    action: 'Workflow completed',
    title: 'Monthly roadmap processing finished',
    time: '1 hour ago',
    type: 'success' as const,
  },
  {
    id: '4',
    action: 'P0 prompt added',
    title: 'Memory foam vs latex comparison',
    time: '3 hours ago',
    type: 'warning' as const,
  },
];

interface KPICardProps {
  title: string;
  value: number;
  unit?: string;
  change: number;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

function KPICard({ title, value, unit = '', change, trend, icon, color, onClick }: KPICardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'visible',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s',
        '&:hover': onClick
          ? {
              transform: 'translateY(-4px)',
              boxShadow: 4,
            }
          : {},
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight={700} sx={{ mb: 1 }}>
              {value.toLocaleString()}
              {unit && (
                <Typography component="span" variant="h6" color="text.secondary" sx={{ ml: 0.5 }}>
                  {unit}
                </Typography>
              )}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {trend === 'up' ? (
                <TrendingUp sx={{ fontSize: 18, color: 'success.main' }} />
              ) : (
                <TrendingDown sx={{ fontSize: 18, color: 'error.main' }} />
              )}
              <Typography
                variant="body2"
                sx={{
                  color: trend === 'up' ? 'success.main' : 'error.main',
                  fontWeight: 600,
                }}
              >
                {change > 0 ? '+' : ''}
                {change}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                vs last month
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: `${color}15`,
              color: color,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // TODO: Fetch dashboard data
  }, [dispatch]);

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
              bgcolor: '#1976d215',
              color: '#1976d2',
            }}
          >
            <DashboardIcon fontSize="large" />
          </Box>
          <Box>
            <Typography variant="h4" component="h1" fontWeight={600}>
              Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              GEO战场感知态势分析 - System Overview
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Content"
            value={mockKPIData.totalContent.value}
            change={mockKPIData.totalContent.change}
            trend={mockKPIData.totalContent.trend}
            icon={<Inventory fontSize="large" />}
            color="#06B6D4"
            onClick={() => navigate('/content')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Citations"
            value={mockKPIData.totalCitations.value}
            change={mockKPIData.totalCitations.change}
            trend={mockKPIData.totalCitations.trend}
            icon={<CitationIcon fontSize="large" />}
            color="#EC4899"
            onClick={() => navigate('/citations')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Citation Rate"
            value={mockKPIData.citationRate.value}
            unit="%"
            change={mockKPIData.citationRate.change}
            trend={mockKPIData.citationRate.trend}
            icon={<Timeline fontSize="large" />}
            color="#10B981"
            onClick={() => navigate('/kpi')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Avg GEO Score"
            value={mockKPIData.avgGeoScore.value}
            change={mockKPIData.avgGeoScore.change}
            trend={mockKPIData.avgGeoScore.trend}
            icon={<Speed fontSize="large" />}
            color="#F59E0B"
            onClick={() => navigate('/roadmap')}
          />
        </Grid>
      </Grid>

      {/* Workflow Status */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Workflow Execution Status
            </Typography>
            <Typography variant="body2" color="text.secondary">
              7-Step GEO Content Pipeline
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={() => navigate('/workflow')}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            <ArrowForward />
          </IconButton>
        </Box>
        <WorkflowStepper
          currentStep={3}
          completedSteps={[1, 2]}
          errorSteps={[]}
          onStepClick={(step) => console.log('Step clicked:', step)}
        />
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Overall Progress
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              42% Complete
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={42} sx={{ height: 8, borderRadius: 4 }} />
        </Box>
      </Paper>

      {/* Two Column Layout */}
      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Recent Activity
            </Typography>
            <Box sx={{ mt: 2 }}>
              {mockRecentActivities.map((activity, index) => (
                <Box
                  key={activity.id}
                  sx={{
                    display: 'flex',
                    gap: 2,
                    py: 2,
                    borderBottom: index < mockRecentActivities.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor:
                        activity.type === 'success'
                          ? 'success.main'
                          : activity.type === 'warning'
                          ? 'warning.main'
                          : 'info.main',
                      mt: 0.75,
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {activity.action}
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {activity.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activity.time}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Priority Distribution
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <PriorityBadge level="P0" />
                <Typography variant="h6" fontWeight={600}>
                  38
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <PriorityBadge level="P1" />
                <Typography variant="h6" fontWeight={600}>
                  127
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <PriorityBadge level="P2" />
                <Typography variant="h6" fontWeight={600}>
                  245
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <PriorityBadge level="P3" />
                <Typography variant="h6" fontWeight={600}>
                  412
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
