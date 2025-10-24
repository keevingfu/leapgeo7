import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Card,
  CardContent,
} from '@mui/material';
import {
  ShowChart as ChartIcon,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock data for demonstration
const citationRateData = [
  { date: '2025-09-01', rate: 68.5 },
  { date: '2025-09-02', rate: 70.2 },
  { date: '2025-09-03', rate: 69.8 },
  { date: '2025-09-04', rate: 71.5 },
  { date: '2025-09-05', rate: 72.1 },
  { date: '2025-09-06', rate: 71.8 },
  { date: '2025-09-07', rate: 73.2 },
];

const geoScoreData = [
  { date: '2025-09-01', score: 75.2 },
  { date: '2025-09-02', score: 76.5 },
  { date: '2025-09-03', score: 77.1 },
  { date: '2025-09-04', score: 78.3 },
  { date: '2025-09-05', score: 77.9 },
  { date: '2025-09-06', rate: 78.8 },
  { date: '2025-09-07', score: 79.4 },
];

const contentPerformanceData = [
  { date: '2025-09-01', views: 12450, ctr: 4.2, gmv: 8750 },
  { date: '2025-09-02', views: 15800, ctr: 5.1, gmv: 11200 },
  { date: '2025-09-03', views: 18920, ctr: 4.8, gmv: 9850 },
  { date: '2025-09-04', views: 22400, ctr: 6.2, gmv: 15200 },
  { date: '2025-09-05', views: 19500, ctr: 5.5, gmv: 12800 },
  { date: '2025-09-06', views: 24800, ctr: 6.8, gmv: 17500 },
  { date: '2025-09-07', views: 28900, ctr: 7.2, gmv: 19400 },
];

const channelPerformanceData = [
  { channel: 'YouTube', views: 45800, citations: 38, ctr: 8.5 },
  { channel: 'Blog', views: 32450, citations: 28, ctr: 6.2 },
  { channel: 'Medium', views: 28920, citations: 22, ctr: 5.8 },
  { channel: 'Reddit', views: 24400, citations: 19, ctr: 5.1 },
  { channel: 'Amazon', views: 18500, citations: 15, ctr: 4.5 },
  { channel: 'Quora', views: 15200, citations: 12, ctr: 4.2 },
  { channel: 'LinkedIn', views: 12800, citations: 10, ctr: 3.8 },
];

type TimeRange = '7d' | '30d' | '90d';

export default function KPIDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  const stats = {
    totalViews: 178070,
    totalCitations: 144,
    avgCtr: 6.2,
    avgGeoScore: 78.2,
    citationRate: 73.2,
    totalGmv: 94700,
  };

  const kpiCards = [
    {
      title: 'Citation Rate',
      value: `${stats.citationRate}%`,
      change: 5.4,
      trend: 'up' as const,
      color: '#10B981',
    },
    {
      title: 'Avg GEO Score',
      value: stats.avgGeoScore.toFixed(1),
      change: 3.2,
      trend: 'up' as const,
      color: '#3B82F6',
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      change: 12.8,
      trend: 'up' as const,
      color: '#8B5CF6',
    },
    {
      title: 'Total GMV',
      value: `$${stats.totalGmv.toLocaleString()}`,
      change: 8.5,
      trend: 'up' as const,
      color: '#F59E0B',
    },
  ];

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
            <ChartIcon fontSize="large" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" component="h1" fontWeight={600}>
              KPI Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Performance Metrics & Analytics
            </Typography>
          </Box>

          {/* Time Range Filter */}
          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={(_, newRange) => newRange && setTimeRange(newRange)}
            size="small"
          >
            <ToggleButton value="7d">Last 7 Days</ToggleButton>
            <ToggleButton value="30d">Last 30 Days</ToggleButton>
            <ToggleButton value="90d">Last 90 Days</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpiCards.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {kpi.title}
                </Typography>
                <Typography variant="h4" component="div" fontWeight={700} sx={{ mb: 1 }}>
                  {kpi.value}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {kpi.trend === 'up' ? (
                    <TrendingUp sx={{ fontSize: 18, color: 'success.main' }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: 18, color: 'error.main' }} />
                  )}
                  <Typography
                    variant="body2"
                    sx={{
                      color: kpi.trend === 'up' ? 'success.main' : 'error.main',
                      fontWeight: 600,
                    }}
                  >
                    {kpi.change > 0 ? '+' : ''}
                    {kpi.change}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    vs last period
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Grid */}
      <Grid container spacing={3}>
        {/* Citation Rate Trend */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Citation Rate Trend
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Daily citation rate percentage
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={citationRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis domain={[65, 75]} />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Citation Rate']}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: '#10B981', r: 4 }}
                  name="Citation Rate %"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* GEO Score Trend */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              GEO Score Trend
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Average GEO score over time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={geoScoreData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis domain={[70, 82]} />
                <Tooltip
                  formatter={(value: number) => [value.toFixed(1), 'GEO Score']}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#3B82F6"
                  fill="#3B82F615"
                  strokeWidth={2}
                  name="GEO Score"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Content Performance */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Content Performance
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Views, CTR, and GMV over time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={contentPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="views"
                  stroke="#8B5CF6"
                  fill="#8B5CF615"
                  strokeWidth={2}
                  name="Views"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="ctr"
                  stroke="#EC4899"
                  fill="#EC489915"
                  strokeWidth={2}
                  name="CTR %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Channel Performance */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Channel Performance
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Performance comparison across channels
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={channelPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="channel" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="views"
                  fill="#3B82F6"
                  name="Views"
                />
                <Bar
                  yAxisId="right"
                  dataKey="citations"
                  fill="#10B981"
                  name="Citations"
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
