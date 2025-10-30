import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Alert,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  Badge,
  Divider,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Language as LanguageIcon,
  Speed as SpeedIcon,
  Psychology as PsychologyIcon,
  Hub as HubIcon,
} from '@mui/icons-material';

interface Citation {
  id: string;
  contentId: string;
  contentTitle: string;
  platform: string;
  url: string;
  aiIndexed: boolean;
  citationStrength: 'strong' | 'moderate' | 'weak';
  indexedDate: string;
  visibility: number;
  context: string;
  mentionType: 'direct' | 'indirect' | 'reference';
}

interface PlatformStats {
  platform: string;
  totalCitations: number;
  aiIndexed: number;
  averageStrength: number;
  growthRate: number;
  lastChecked: string;
  status: 'online' | 'checking' | 'offline';
}

interface MCPMonitor {
  tool: string;
  callsToday: number;
  successRate: number;
  avgResponseTime: number;
  status: 'active' | 'idle' | 'error';
}

const CitationMonitor = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [citations] = useState<Citation[]>([
    {
      id: 'cit-001',
      contentId: 'cnt-001',
      contentTitle: 'Best Mattresses for Back Pain 2025',
      platform: 'Perplexity',
      url: 'https://perplexity.ai/search/best-mattresses',
      aiIndexed: true,
      citationStrength: 'strong',
      indexedDate: '2025-10-28T10:30:00',
      visibility: 95,
      context: 'Featured as top recommendation with direct quote and backlink',
      mentionType: 'direct',
    },
    {
      id: 'cit-002',
      contentId: 'cnt-001',
      contentTitle: 'Best Mattresses for Back Pain 2025',
      platform: 'ChatGPT',
      url: 'https://chat.openai.com/share/example',
      aiIndexed: true,
      citationStrength: 'moderate',
      indexedDate: '2025-10-27T15:20:00',
      visibility: 82,
      context: 'Mentioned in knowledge base response about sleep health',
      mentionType: 'indirect',
    },
    {
      id: 'cit-003',
      contentId: 'cnt-002',
      contentTitle: 'SweetNight vs Purple Mattress Comparison',
      platform: 'Claude',
      url: 'https://claude.ai/chat/example',
      aiIndexed: true,
      citationStrength: 'strong',
      indexedDate: '2025-10-28T08:15:00',
      visibility: 88,
      context: 'Used as primary source for mattress comparison query',
      mentionType: 'direct',
    },
    {
      id: 'cit-004',
      contentId: 'cnt-003',
      contentTitle: 'Memory Foam Density Guide',
      platform: 'Gemini',
      url: 'https://bard.google.com/share/example',
      aiIndexed: true,
      citationStrength: 'moderate',
      indexedDate: '2025-10-26T12:45:00',
      visibility: 75,
      context: 'Referenced in technical explanation about foam materials',
      mentionType: 'reference',
    },
    {
      id: 'cit-005',
      contentId: 'cnt-002',
      contentTitle: 'SweetNight vs Purple Mattress Comparison',
      platform: 'You.com',
      url: 'https://you.com/search?q=sweetnight',
      aiIndexed: false,
      citationStrength: 'weak',
      indexedDate: '2025-10-25T09:30:00',
      visibility: 60,
      context: 'Appears in search results but not in AI response',
      mentionType: 'indirect',
    },
    {
      id: 'cit-006',
      contentId: 'cnt-004',
      contentTitle: 'Mattress Care & Maintenance Tips',
      platform: 'Bing Chat',
      url: 'https://bing.com/chat/example',
      aiIndexed: true,
      citationStrength: 'strong',
      indexedDate: '2025-10-28T11:00:00',
      visibility: 91,
      context: 'Primary source for maintenance guide with full attribution',
      mentionType: 'direct',
    },
  ]);

  const [platformStats, setPlatformStats] = useState<PlatformStats[]>([
    {
      platform: 'ChatGPT',
      totalCitations: 142,
      aiIndexed: 138,
      averageStrength: 72,
      growthRate: 15.2,
      lastChecked: '2025-10-28T12:00:00',
      status: 'online',
    },
    {
      platform: 'Perplexity',
      totalCitations: 98,
      aiIndexed: 95,
      averageStrength: 85,
      growthRate: 22.5,
      lastChecked: '2025-10-28T12:00:00',
      status: 'online',
    },
    {
      platform: 'Claude',
      totalCitations: 86,
      aiIndexed: 84,
      averageStrength: 78,
      growthRate: 18.3,
      lastChecked: '2025-10-28T12:00:00',
      status: 'online',
    },
    {
      platform: 'Gemini',
      totalCitations: 75,
      aiIndexed: 72,
      averageStrength: 70,
      growthRate: 12.8,
      lastChecked: '2025-10-28T12:00:00',
      status: 'checking',
    },
    {
      platform: 'You.com',
      totalCitations: 62,
      aiIndexed: 45,
      averageStrength: 58,
      growthRate: 8.5,
      lastChecked: '2025-10-28T11:45:00',
      status: 'online',
    },
    {
      platform: 'Bing Chat',
      totalCitations: 95,
      aiIndexed: 92,
      averageStrength: 81,
      growthRate: 20.1,
      lastChecked: '2025-10-28T12:00:00',
      status: 'online',
    },
  ]);

  const [mcpMonitor] = useState<MCPMonitor[]>([
    {
      tool: 'Firecrawl (Citation Scraping)',
      callsToday: 342,
      successRate: 96.5,
      avgResponseTime: 1.8,
      status: 'active',
    },
    {
      tool: 'Puppeteer (Dynamic Check)',
      callsToday: 128,
      successRate: 94.2,
      avgResponseTime: 3.2,
      status: 'idle',
    },
    {
      tool: 'Sentry (Error Tracking)',
      callsToday: 15,
      successRate: 100,
      avgResponseTime: 0.5,
      status: 'active',
    },
    {
      tool: 'Neo4j (Citation Graph)',
      callsToday: 456,
      successRate: 99.8,
      avgResponseTime: 0.3,
      status: 'active',
    },
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Simulate data refresh
      const updatedStats = platformStats.map(stat => ({
        ...stat,
        totalCitations: stat.totalCitations + Math.floor(Math.random() * 5),
        aiIndexed: stat.aiIndexed + Math.floor(Math.random() * 3),
        lastChecked: new Date().toISOString(),
      }));
      setPlatformStats(updatedStats);
      setIsRefreshing(false);
    }, 2000);
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong':
        return 'success';
      case 'moderate':
        return 'warning';
      case 'weak':
        return 'error';
      default:
        return 'default';
    }
  };

  const getMentionTypeIcon = (type: string) => {
    switch (type) {
      case 'direct':
        return '🎯';
      case 'indirect':
        return '🔄';
      case 'reference':
        return '📚';
      default:
        return '📝';
    }
  };

  const totalCitations = platformStats.reduce((sum, stat) => sum + stat.totalCitations, 0);
  const totalIndexed = platformStats.reduce((sum, stat) => sum + stat.aiIndexed, 0);
  const indexRate = ((totalIndexed / totalCitations) * 100).toFixed(1);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Citation Monitor
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track AI citations and content indexing across multiple platforms (Process G)
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            sx={{ textTransform: 'none' }}
          >
            Deep Scan
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

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LanguageIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Total Citations</Typography>
              </Box>
              <Typography variant="h3" fontWeight={700}>
                {totalCitations}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon sx={{ mr: 0.5, fontSize: 18, color: 'success.main' }} />
                <Typography variant="body2" color="success.main">
                  +18.5% this week
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PsychologyIcon sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">AI Indexed</Typography>
              </Box>
              <Typography variant="h3" fontWeight={700}>
                {totalIndexed}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Index Rate: {indexRate}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SpeedIcon sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Avg Strength</Typography>
              </Box>
              <Typography variant="h3" fontWeight={700}>
                74.8
              </Typography>
              <LinearProgress
                variant="determinate"
                value={74.8}
                sx={{ mt: 2, height: 6, borderRadius: 3 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <HubIcon sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Platforms</Typography>
              </Box>
              <Typography variant="h3" fontWeight={700}>
                6
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                {platformStats.map((stat) => (
                  <Box
                    key={stat.platform}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: stat.status === 'online' ? 'success.main' :
                              stat.status === 'checking' ? 'warning.main' : 'error.main',
                    }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Platform Filter and Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tabs value={selectedTab} onChange={(_, v) => setSelectedTab(v)}>
            <Tab label="Recent Citations" />
            <Tab label="Platform Statistics" />
            <Tab label="MCP Tool Status" />
          </Tabs>
        </Box>
      </Paper>

      {/* Tab Content */}
      {selectedTab === 0 && (
        <Paper>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Recent AI Citations</Typography>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Platform</InputLabel>
              <Select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                label="Platform"
              >
                <MenuItem value="all">All Platforms</MenuItem>
                <MenuItem value="ChatGPT">ChatGPT</MenuItem>
                <MenuItem value="Perplexity">Perplexity</MenuItem>
                <MenuItem value="Claude">Claude</MenuItem>
                <MenuItem value="Gemini">Gemini</MenuItem>
                <MenuItem value="You.com">You.com</MenuItem>
                <MenuItem value="Bing Chat">Bing Chat</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Divider />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Content</TableCell>
                  <TableCell>Platform</TableCell>
                  <TableCell>AI Indexed</TableCell>
                  <TableCell>Strength</TableCell>
                  <TableCell>Visibility</TableCell>
                  <TableCell>Context</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {citations
                  .filter(c => selectedPlatform === 'all' || c.platform === selectedPlatform)
                  .map((citation) => (
                    <TableRow key={citation.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {citation.contentTitle}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {citation.contentId}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={citation.platform} size="small" />
                      </TableCell>
                      <TableCell>
                        {citation.aiIndexed ? (
                          <CheckCircleIcon sx={{ color: 'success.main' }} />
                        ) : (
                          <CancelIcon sx={{ color: 'error.main' }} />
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={citation.citationStrength}
                          size="small"
                          color={getStrengthColor(citation.citationStrength) as any}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={citation.visibility}
                            sx={{ width: 60, height: 6, borderRadius: 3 }}
                          />
                          <Typography variant="caption">{citation.visibility}%</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {getMentionTypeIcon(citation.mentionType)} {citation.context}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Citation">
                          <IconButton size="small">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {selectedTab === 1 && (
        <Grid container spacing={3}>
          {platformStats.map((stat) => (
            <Grid item xs={12} md={6} key={stat.platform}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">{stat.platform}</Typography>
                    <Badge
                      color={stat.status === 'online' ? 'success' :
                            stat.status === 'checking' ? 'warning' : 'error'}
                      variant="dot"
                    >
                      <Chip
                        label={stat.status}
                        size="small"
                        color={stat.status === 'online' ? 'success' :
                              stat.status === 'checking' ? 'warning' : 'error'}
                      />
                    </Badge>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Total Citations</Typography>
                      <Typography variant="h5" fontWeight={600}>{stat.totalCitations}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">AI Indexed</Typography>
                      <Typography variant="h5" fontWeight={600}>{stat.aiIndexed}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Avg Strength</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={stat.averageStrength}
                          sx={{ width: 60, height: 6, borderRadius: 3 }}
                        />
                        <Typography variant="body2">{stat.averageStrength}%</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Growth Rate</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {stat.growthRate > 0 ? (
                          <TrendingUpIcon sx={{ fontSize: 18, color: 'success.main' }} />
                        ) : (
                          <TrendingDownIcon sx={{ fontSize: 18, color: 'error.main' }} />
                        )}
                        <Typography variant="body2" color={stat.growthRate > 0 ? 'success.main' : 'error.main'}>
                          {stat.growthRate > 0 ? '+' : ''}{stat.growthRate}%
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                    Last checked: {new Date(stat.lastChecked).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {selectedTab === 2 && (
        <Grid container spacing={3}>
          {mcpMonitor.map((monitor) => (
            <Grid item xs={12} md={6} key={monitor.tool}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">{monitor.tool}</Typography>
                    <Chip
                      label={monitor.status}
                      size="small"
                      color={monitor.status === 'active' ? 'success' :
                            monitor.status === 'idle' ? 'default' : 'error'}
                    />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">Calls Today</Typography>
                      <Typography variant="h6" fontWeight={600}>{monitor.callsToday}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">Success Rate</Typography>
                      <Typography variant="h6" fontWeight={600}>{monitor.successRate}%</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">Avg Time</Typography>
                      <Typography variant="h6" fontWeight={600}>{monitor.avgResponseTime}s</Typography>
                    </Grid>
                  </Grid>

                  <LinearProgress
                    variant="determinate"
                    value={monitor.successRate}
                    sx={{ mt: 2, height: 6, borderRadius: 3 }}
                    color={monitor.successRate > 95 ? 'success' :
                          monitor.successRate > 90 ? 'warning' : 'error'}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* MCP Integration Note */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>MCP Integration:</strong> This page demonstrates citation tracking using Firecrawl for web scraping,
          Puppeteer for dynamic content verification, Neo4j for citation graph storage, and Sentry for error tracking.
          Real-time citation monitoring across 6 AI platforms with automated indexing detection.
        </Typography>
      </Alert>
    </Box>
  );
};

export default CitationMonitor;