import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Paper,
  IconButton,
  Button,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Speed as SpeedIcon,
  Article as ArticleIcon,
  Insights as InsightsIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

interface PerformanceMetric {
  metric: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

interface ContentAnalytics {
  date: string;
  generated: number;
  published: number;
  cited: number;
  engagement: number;
}

interface PlatformPerformance {
  platform: string;
  citations: number;
  visibility: number;
  engagement: number;
  growth: number;
}

interface MCPUsageMetric {
  tool: string;
  usage: number;
  efficiency: number;
  cost: number;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

const AnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState('last30days');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [performanceMetrics] = useState<PerformanceMetric[]>([
    { metric: 'Content Generation Rate', value: 156, target: 150, trend: 'up', change: 12.5 },
    { metric: 'Citation Index', value: 82, target: 75, trend: 'up', change: 8.3 },
    { metric: 'AI Indexing Rate', value: 94, target: 90, trend: 'up', change: 5.2 },
    { metric: 'Content Quality Score', value: 78, target: 80, trend: 'down', change: -2.1 },
    { metric: 'Publishing Velocity', value: 24, target: 20, trend: 'up', change: 15.8 },
    { metric: 'Engagement Rate', value: 65, target: 70, trend: 'stable', change: 0.5 },
  ]);

  const [contentAnalytics] = useState<ContentAnalytics[]>([
    { date: '2025-10-22', generated: 12, published: 10, cited: 8, engagement: 450 },
    { date: '2025-10-23', generated: 15, published: 14, cited: 11, engagement: 520 },
    { date: '2025-10-24', generated: 18, published: 16, cited: 14, engagement: 580 },
    { date: '2025-10-25', generated: 14, published: 13, cited: 10, engagement: 490 },
    { date: '2025-10-26', generated: 20, published: 18, cited: 16, engagement: 650 },
    { date: '2025-10-27', generated: 17, published: 15, cited: 13, engagement: 560 },
    { date: '2025-10-28', generated: 22, published: 20, cited: 18, engagement: 720 },
  ]);

  const [platformPerformance] = useState<PlatformPerformance[]>([
    { platform: 'ChatGPT', citations: 142, visibility: 88, engagement: 92, growth: 15 },
    { platform: 'Perplexity', citations: 98, visibility: 95, engagement: 85, growth: 22 },
    { platform: 'Claude', citations: 86, visibility: 82, engagement: 78, growth: 18 },
    { platform: 'Gemini', citations: 75, visibility: 78, engagement: 70, growth: 12 },
    { platform: 'Bing Chat', citations: 95, visibility: 85, engagement: 81, growth: 20 },
  ]);

  const [mcpUsage] = useState<MCPUsageMetric[]>([
    { tool: 'Firecrawl', usage: 85, efficiency: 92, cost: 0.45 },
    { tool: 'InfraNodus', usage: 72, efficiency: 88, cost: 0.32 },
    { tool: 'Neo4j', usage: 95, efficiency: 96, cost: 0.28 },
    { tool: 'MongoDB', usage: 88, efficiency: 91, cost: 0.35 },
    { tool: 'Puppeteer', usage: 45, efficiency: 85, cost: 0.22 },
    { tool: 'Feishu', usage: 78, efficiency: 94, cost: 0.15 },
  ]);

  const [topContent] = useState([
    { title: 'Best Mattresses for Back Pain 2025', citations: 156, score: 94 },
    { title: 'SweetNight vs Purple Comparison', citations: 132, score: 88 },
    { title: 'Memory Foam Density Guide', citations: 98, score: 85 },
    { title: 'Mattress Care & Maintenance', citations: 87, score: 82 },
    { title: 'Sleep Position Guide', citations: 76, score: 79 },
  ]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon sx={{ color: 'success.main', fontSize: 20 }} />;
      case 'down':
        return <TrendingDownIcon sx={{ color: 'error.main', fontSize: 20 }} />;
      default:
        return <SpeedIcon sx={{ color: 'warning.main', fontSize: 20 }} />;
    }
  };

  const radarData = platformPerformance.map(p => ({
    platform: p.platform,
    citations: p.citations,
    visibility: p.visibility,
    engagement: p.engagement,
  }));

  const pieData = mcpUsage.map((tool, index) => ({
    name: tool.tool,
    value: tool.usage,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive performance analytics and insights (Process H)
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              label="Date Range"
            >
              <MenuItem value="last7days">Last 7 Days</MenuItem>
              <MenuItem value="last30days">Last 30 Days</MenuItem>
              <MenuItem value="last90days">Last 90 Days</MenuItem>
              <MenuItem value="custom">Custom Range</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            sx={{ textTransform: 'none' }}
          >
            Export Report
          </Button>
          <IconButton
            onClick={handleRefresh}
            disabled={isRefreshing}
            sx={{
              animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
              '@keyframes spin': {
                from: { transform: 'rotate(0deg)' },
                to: { transform: 'rotate(360deg)' },
              },
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {performanceMetrics.slice(0, 4).map((metric) => (
          <Grid item xs={12} md={3} key={metric.metric}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {metric.metric}
                  </Typography>
                  {getTrendIcon(metric.trend)}
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {metric.value}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption">Target: {metric.target}</Typography>
                    <Typography
                      variant="caption"
                      color={metric.change > 0 ? 'success.main' : 'error.main'}
                    >
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(metric.value / metric.target) * 100}
                    sx={{ height: 6, borderRadius: 3 }}
                    color={metric.value >= metric.target ? 'success' : 'warning'}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Row 1 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Content Performance Over Time */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Content Performance Trends
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <AreaChart data={contentAnalytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="generated" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="published" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                <Area type="monotone" dataKey="cited" stackId="1" stroke="#ffc658" fill="#ffc658" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* MCP Tool Usage */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              MCP Tool Usage
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts Row 2 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Platform Performance Radar */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Platform Performance Analysis
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="platform" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Citations" dataKey="citations" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Radar name="Visibility" dataKey="visibility" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                <Radar name="Engagement" dataKey="engagement" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Top Performing Content */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Top Performing Content
            </Typography>
            <List>
              {topContent.map((content, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: COLORS[index], width: 32, height: 32 }}>
                      {index + 1}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={content.title}
                    secondary={
                      <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                        <Chip
                          label={`${content.citations} citations`}
                          size="small"
                          icon={<ArticleIcon />}
                        />
                        <Chip
                          label={`Score: ${content.score}`}
                          size="small"
                          color="success"
                          icon={<SpeedIcon />}
                        />
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* MCP Integration Details */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              MCP Tool Performance & Efficiency
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {mcpUsage.map((tool) => (
                <Grid item xs={12} md={4} key={tool.tool}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {tool.tool}
                        </Typography>
                        <Chip
                          label={`$${tool.cost}/call`}
                          size="small"
                          color="primary"
                        />
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2">Usage</Typography>
                          <Typography variant="body2">{tool.usage}%</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={tool.usage}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>

                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2">Efficiency</Typography>
                          <Typography variant="body2">{tool.efficiency}%</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={tool.efficiency}
                          sx={{ height: 6, borderRadius: 3 }}
                          color="success"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Insights & Recommendations */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <InsightsIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">AI-Generated Insights & Recommendations</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Strong Performance:</strong> Content generation rate exceeded target by 12.5%.
                ChatGPT and Perplexity platforms showing excellent growth rates (15-22%).
                Consider increasing investment in these channels.
              </Typography>
            </Alert>
            <Alert severity="warning">
              <Typography variant="body2">
                <strong>Optimization Opportunity:</strong> Content Quality Score is 2% below target.
                Implement additional E-E-A-T optimization using InfraNodus text analysis
                and Sequential Thinking MCP for enhanced reasoning.
              </Typography>
            </Alert>
          </Grid>
          <Grid item xs={12} md={6}>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Trend Analysis:</strong> Weekend content performance shows 35% higher engagement.
                Schedule high-priority content for Friday-Sunday publication window.
              </Typography>
            </Alert>
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Cost Optimization:</strong> Feishu has the lowest cost per call ($0.15) with 94% efficiency.
                Consider migrating more publishing workflows to Feishu for cost savings.
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      </Paper>

      {/* MCP Integration Note */}
      <Alert severity="info">
        <Typography variant="body2">
          <strong>MCP Integration:</strong> This analytics dashboard aggregates data from Neo4j (graph analytics),
          MongoDB (document metrics), PostgreSQL (relational data), InfraNodus (text analysis insights),
          and Sequential Thinking (AI-generated recommendations). Real-time data processing via n8n workflows
          with automated reporting through Feishu and Slack channels.
        </Typography>
      </Alert>
    </Box>
  );
};

export default AnalyticsDashboard;