import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  LinearProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  Add,
  Delete,
  Edit,
  Refresh,
  CloudDownload,
  Language,
  Reddit,
  Assessment,
  Schedule,
  CheckCircle,
  Error as ErrorIcon,
  Warning,
  Info,
  Code,
} from '@mui/icons-material';

// Data source types
interface DataSource {
  id: string;
  name: string;
  type: 'website' | 'serp' | 'social' | 'api';
  url: string;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'error';
  progress: number;
  pagesScraped: number;
  totalPages: number;
  dataSize: string;
  lastRun: string;
  schedule?: string;
  config: {
    formats: string[];
    maxPages?: number;
    depth?: number;
    onlyMainContent: boolean;
    includeImages: boolean;
  };
}

// MCP tool statistics
interface MCPStatistics {
  firecrawl: { calls: number; success: number; avgTime: number };
  puppeteer: { calls: number; success: number; avgTime: number };
  infranodus: { calls: number; success: number; avgTime: number };
  mongodb: { writes: number; documents: number; size: string };
}

// Scraping log entry
interface LogEntry {
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  source?: string;
}

export default function DataAcquisitionHub() {
  const [activeTab, setActiveTab] = useState(0);
  const [sources, setSources] = useState<DataSource[]>([
    {
      id: 'src-001',
      name: 'Competitor Blog Analysis',
      type: 'website',
      url: 'https://competitor.com/blog',
      status: 'idle',
      progress: 0,
      pagesScraped: 0,
      totalPages: 150,
      dataSize: '0 KB',
      lastRun: '2025-10-26 14:30',
      schedule: 'Daily at 2:00 AM',
      config: {
        formats: ['markdown', 'html'],
        maxPages: 150,
        depth: 3,
        onlyMainContent: true,
        includeImages: false,
      },
    },
    {
      id: 'src-002',
      name: 'SERP Monitoring - "AI SEO tools"',
      type: 'serp',
      url: 'search query: AI SEO tools',
      status: 'running',
      progress: 45,
      pagesScraped: 9,
      totalPages: 20,
      dataSize: '1.2 MB',
      lastRun: '2025-10-26 16:15',
      schedule: 'Every 6 hours',
      config: {
        formats: ['markdown'],
        maxPages: 20,
        onlyMainContent: true,
        includeImages: false,
      },
    },
    {
      id: 'src-003',
      name: 'Reddit Community Insights',
      type: 'social',
      url: 'https://reddit.com/r/SEO',
      status: 'completed',
      progress: 100,
      pagesScraped: 50,
      totalPages: 50,
      dataSize: '3.5 MB',
      lastRun: '2025-10-26 12:00',
      config: {
        formats: ['markdown', 'json'],
        maxPages: 50,
        onlyMainContent: true,
        includeImages: false,
      },
    },
  ]);

  const [mcpStats, setMcpStats] = useState<MCPStatistics>({
    firecrawl: { calls: 156, success: 148, avgTime: 2.3 },
    puppeteer: { calls: 42, success: 40, avgTime: 5.1 },
    infranodus: { calls: 89, success: 89, avgTime: 1.8 },
    mongodb: { writes: 287, documents: 4520, size: '125 MB' },
  });

  const [logs, setLogs] = useState<LogEntry[]>([
    { timestamp: '16:45:32', level: 'info', message: 'Starting SERP analysis for query "AI SEO tools"', source: 'src-002' },
    { timestamp: '16:45:35', level: 'success', message: 'Successfully scraped page 9/20', source: 'src-002' },
    { timestamp: '16:44:10', level: 'warning', message: 'Rate limit approaching for Reddit API', source: 'src-003' },
    { timestamp: '16:42:00', level: 'success', message: 'Completed Reddit community data collection', source: 'src-003' },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<DataSource | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  // WebSocket connection for real-time updates
  useEffect(() => {
    // Simulating WebSocket connection
    const wsSimulator = setInterval(() => {
      setSources((prev) =>
        prev.map((source) => {
          if (source.status === 'running' && source.progress < 100) {
            const newProgress = Math.min(source.progress + Math.random() * 5, 100);
            const newPagesScraped = Math.floor((newProgress / 100) * source.totalPages);
            const newDataSize = `${(newPagesScraped * 0.13).toFixed(1)} MB`;

            if (newProgress >= 100) {
              addLog('success', `Completed data collection for ${source.name}`, source.id);
              return {
                ...source,
                status: 'completed',
                progress: 100,
                pagesScraped: source.totalPages,
                dataSize: newDataSize,
              };
            }

            return {
              ...source,
              progress: newProgress,
              pagesScraped: newPagesScraped,
              dataSize: newDataSize,
            };
          }
          return source;
        })
      );
    }, 1000);

    setWsConnected(true);

    return () => {
      clearInterval(wsSimulator);
      setWsConnected(false);
    };
  }, []);

  const addLog = (level: LogEntry['level'], message: string, source?: string) => {
    const timestamp = new Date().toTimeString().split(' ')[0];
    setLogs((prev) => [{ timestamp, level, message, source }, ...prev].slice(0, 50));
  };

  const handleStartSource = async (sourceId: string) => {
    setSources((prev) =>
      prev.map((src) =>
        src.id === sourceId ? { ...src, status: 'running', progress: 0, pagesScraped: 0 } : src
      )
    );
    addLog('info', `Starting data collection for source ${sourceId}`, sourceId);

    // Update MCP statistics
    setMcpStats((prev) => ({
      ...prev,
      firecrawl: { ...prev.firecrawl, calls: prev.firecrawl.calls + 1 },
    }));
  };

  const handlePauseSource = (sourceId: string) => {
    setSources((prev) =>
      prev.map((src) => (src.id === sourceId ? { ...src, status: 'paused' } : src))
    );
    addLog('warning', `Paused data collection for source ${sourceId}`, sourceId);
  };

  const handleStopSource = (sourceId: string) => {
    setSources((prev) =>
      prev.map((src) =>
        src.id === sourceId ? { ...src, status: 'idle', progress: 0, pagesScraped: 0 } : src
      )
    );
    addLog('info', `Stopped data collection for source ${sourceId}`, sourceId);
  };

  const getSourceIcon = (type: DataSource['type']) => {
    switch (type) {
      case 'website':
        return <Language />;
      case 'serp':
        return <Assessment />;
      case 'social':
        return <Reddit />;
      case 'api':
        return <Code />;
      default:
        return <Language />;
    }
  };

  const getStatusColor = (status: DataSource['status']) => {
    switch (status) {
      case 'running':
        return 'primary';
      case 'completed':
        return 'success';
      case 'error':
        return 'error';
      case 'paused':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getLogIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'success':
        return <CheckCircle color="success" fontSize="small" />;
      case 'error':
        return <ErrorIcon color="error" fontSize="small" />;
      case 'warning':
        return <Warning color="warning" fontSize="small" />;
      default:
        return <Info color="info" fontSize="small" />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Data Acquisition Hub
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Centralized data collection powered by MCP tools - Firecrawl, Puppeteer, and InfraNodus
        </Typography>

        {/* MCP Statistics Cards */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, bgcolor: 'primary.dark' }}>
              <Typography variant="body2" color="primary.contrastText">Firecrawl API</Typography>
              <Typography variant="h5" color="primary.contrastText" fontWeight={700}>
                {mcpStats.firecrawl.calls} calls
              </Typography>
              <Typography variant="caption" color="primary.contrastText">
                {((mcpStats.firecrawl.success / mcpStats.firecrawl.calls) * 100).toFixed(1)}% success • {mcpStats.firecrawl.avgTime}s avg
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, bgcolor: 'secondary.dark' }}>
              <Typography variant="body2" color="secondary.contrastText">Puppeteer</Typography>
              <Typography variant="h5" color="secondary.contrastText" fontWeight={700}>
                {mcpStats.puppeteer.calls} calls
              </Typography>
              <Typography variant="caption" color="secondary.contrastText">
                {((mcpStats.puppeteer.success / mcpStats.puppeteer.calls) * 100).toFixed(1)}% success • {mcpStats.puppeteer.avgTime}s avg
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, bgcolor: 'success.dark' }}>
              <Typography variant="body2" color="success.contrastText">MongoDB Storage</Typography>
              <Typography variant="h5" color="success.contrastText" fontWeight={700}>
                {mcpStats.mongodb.documents}
              </Typography>
              <Typography variant="caption" color="success.contrastText">
                documents • {mcpStats.mongodb.size} total
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, bgcolor: wsConnected ? 'success.main' : 'error.main' }}>
              <Typography variant="body2" color="white">WebSocket Status</Typography>
              <Typography variant="h5" color="white" fontWeight={700}>
                {wsConnected ? 'Connected' : 'Disconnected'}
              </Typography>
              <Typography variant="caption" color="white">
                Real-time progress updates
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label={`Data Sources (${sources.length})`} />
          <Tab label="Activity Logs" />
          <Tab label="Configuration" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <>
          {/* Action Bar */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setEditingSource(null);
                setDialogOpen(true);
              }}
            >
              Add Data Source
            </Button>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button startIcon={<CloudDownload />} variant="outlined">
                Export All Data
              </Button>
              <Button startIcon={<Refresh />} variant="outlined">
                Refresh Status
              </Button>
            </Box>
          </Box>

          {/* Data Source Cards */}
          <Grid container spacing={3}>
            {sources.map((source) => (
              <Grid item xs={12} md={6} lg={4} key={source.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        {getSourceIcon(source.type)}
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          {source.name}
                        </Typography>
                      </Box>
                      <Chip
                        label={source.status}
                        size="small"
                        color={getStatusColor(source.status) as any}
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 2 }}>
                      {source.url}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Progress</Typography>
                        <Typography variant="body2">
                          {source.pagesScraped} / {source.totalPages} pages
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={source.progress}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Data Size</Typography>
                        <Typography variant="body2" fontWeight={600}>{source.dataSize}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Last Run</Typography>
                        <Typography variant="body2" fontWeight={600}>{source.lastRun}</Typography>
                      </Grid>
                      {source.schedule && (
                        <>
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Schedule fontSize="small" color="action" />
                              <Typography variant="caption" color="text.secondary">
                                {source.schedule}
                              </Typography>
                            </Box>
                          </Grid>
                        </>
                      )}
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {source.config.formats.map((format) => (
                        <Chip
                          key={format}
                          label={format.toUpperCase()}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions>
                    {source.status === 'idle' && (
                      <Button
                        size="small"
                        startIcon={<PlayArrow />}
                        onClick={() => handleStartSource(source.id)}
                      >
                        Start
                      </Button>
                    )}
                    {source.status === 'running' && (
                      <>
                        <Button
                          size="small"
                          startIcon={<Pause />}
                          onClick={() => handlePauseSource(source.id)}
                        >
                          Pause
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Stop />}
                          onClick={() => handleStopSource(source.id)}
                          color="error"
                        >
                          Stop
                        </Button>
                      </>
                    )}
                    {source.status === 'paused' && (
                      <Button
                        size="small"
                        startIcon={<PlayArrow />}
                        onClick={() => handleStartSource(source.id)}
                      >
                        Resume
                      </Button>
                    )}
                    {source.status === 'completed' && (
                      <Button
                        size="small"
                        startIcon={<Refresh />}
                        onClick={() => handleStartSource(source.id)}
                      >
                        Re-run
                      </Button>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => {
                        setEditingSource(source);
                        setDialogOpen(true);
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Delete fontSize="small" />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {activeTab === 1 && (
        <Paper>
          <List>
            {logs.map((log, index) => (
              <ListItem key={index} divider>
                <ListItemIcon>{getLogIcon(log.level)}</ListItemIcon>
                <ListItemText
                  primary={log.message}
                  secondary={`${log.timestamp} ${log.source ? `• Source: ${log.source}` : ''}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Firecrawl Configuration</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="API Endpoint" value="http://localhost:3002" fullWidth disabled />
                <TextField label="API Key" value="fs-test" type="password" fullWidth disabled />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Auto-retry on failure"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Use caching (maxAge: 48h)"
                />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>MongoDB Configuration</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="Connection String" value="mongodb://localhost:27018" fullWidth disabled />
                <TextField label="Database" value="leapgeo7" fullWidth disabled />
                <TextField label="Collection" value="scraped_content" fullWidth disabled />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Auto-save scraped content"
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingSource ? 'Edit Data Source' : 'Add New Data Source'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField label="Name" fullWidth defaultValue={editingSource?.name} />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select defaultValue={editingSource?.type || 'website'}>
                <MenuItem value="website">Website</MenuItem>
                <MenuItem value="serp">SERP</MenuItem>
                <MenuItem value="social">Social Media</MenuItem>
                <MenuItem value="api">API</MenuItem>
              </Select>
            </FormControl>
            <TextField label="URL / Query" fullWidth defaultValue={editingSource?.url} />
            <TextField
              label="Max Pages"
              type="number"
              defaultValue={editingSource?.config.maxPages || 100}
            />
            <FormControl fullWidth>
              <InputLabel>Output Formats</InputLabel>
              <Select
                multiple
                defaultValue={editingSource?.config.formats || ['markdown']}
                renderValue={(selected) => (selected as string[]).join(', ')}
              >
                <MenuItem value="markdown">Markdown</MenuItem>
                <MenuItem value="html">HTML</MenuItem>
                <MenuItem value="json">JSON</MenuItem>
                <MenuItem value="links">Links</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Schedule (Optional)" placeholder="e.g., Daily at 2:00 AM" fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setDialogOpen(false)}>
            {editingSource ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}