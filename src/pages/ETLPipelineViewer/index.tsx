import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  LinearProgress,
  Chip,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Badge,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Storage,
  Transform,
  DataArray,
  Hub,
  Speed,
  CheckCircle,
  Error as ErrorIcon,
  Warning,
  Info,
  PlayArrow,
  Pause,
  Refresh,
  Timeline,
  Memory,
  Code,
  Description,
  AccountTree,
  Insights,
  ViewStream,
  ViewModule,
  ArrowForward,
  ArrowDownward,
} from '@mui/icons-material';
import { Sankey } from 'recharts';

// Pipeline stage types
interface PipelineStage {
  id: string;
  name: string;
  type: 'extraction' | 'transformation' | 'loading';
  status: 'idle' | 'processing' | 'completed' | 'error';
  inputCount: number;
  outputCount: number;
  processingTime: number;
  errors: number;
}

// Data flow statistics
interface DataFlowStats {
  totalDocuments: number;
  processedToday: number;
  averageProcessingTime: number;
  errorRate: number;
}

// Database storage info
interface DatabaseInfo {
  name: string;
  type: string;
  icon: React.ReactElement;
  documentsCount: number;
  dataSize: string;
  lastUpdate: string;
  status: 'active' | 'syncing' | 'error';
}

// Processing job
interface ProcessingJob {
  id: string;
  source: string;
  startTime: string;
  duration: string;
  documentsProcessed: number;
  status: 'running' | 'completed' | 'failed';
  stages: {
    extraction: boolean;
    transformation: boolean;
    mongoStorage: boolean;
    neo4jStorage: boolean;
    vectorStorage: boolean;
  };
}

export default function ETLPipelineViewer() {
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState<'flow' | 'grid'>('flow');
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>([
    {
      id: 'extraction',
      name: 'Data Extraction',
      type: 'extraction',
      status: 'processing',
      inputCount: 1250,
      outputCount: 1180,
      processingTime: 2.3,
      errors: 3,
    },
    {
      id: 'transformation',
      name: 'Content Transformation',
      type: 'transformation',
      status: 'processing',
      inputCount: 1180,
      outputCount: 3540,
      processingTime: 4.7,
      errors: 0,
    },
    {
      id: 'loading',
      name: 'Database Loading',
      type: 'loading',
      status: 'processing',
      inputCount: 3540,
      outputCount: 3540,
      processingTime: 1.8,
      errors: 0,
    },
  ]);

  const [dataFlowStats, setDataFlowStats] = useState<DataFlowStats>({
    totalDocuments: 45320,
    processedToday: 3540,
    averageProcessingTime: 8.8,
    errorRate: 0.25,
  });

  const [databases, setDatabases] = useState<DatabaseInfo[]>([
    {
      name: 'MongoDB',
      type: 'Document Store',
      icon: <Storage color="success" />,
      documentsCount: 15420,
      dataSize: '2.3 GB',
      lastUpdate: '2 min ago',
      status: 'active',
    },
    {
      name: 'Neo4j',
      type: 'Graph Database',
      icon: <Hub color="primary" />,
      documentsCount: 8930,
      dataSize: '850 MB',
      lastUpdate: '5 min ago',
      status: 'syncing',
    },
    {
      name: 'Pinecone',
      type: 'Vector Database',
      icon: <AccountTree color="secondary" />,
      documentsCount: 20970,
      dataSize: '1.2 GB',
      lastUpdate: '1 min ago',
      status: 'active',
    },
  ]);

  const [processingJobs, setProcessingJobs] = useState<ProcessingJob[]>([
    {
      id: 'job-001',
      source: 'Competitor Blog Analysis',
      startTime: '16:45:00',
      duration: '12:34',
      documentsProcessed: 150,
      status: 'running',
      stages: {
        extraction: true,
        transformation: true,
        mongoStorage: true,
        neo4jStorage: false,
        vectorStorage: false,
      },
    },
    {
      id: 'job-002',
      source: 'SERP Monitoring',
      startTime: '16:30:00',
      duration: '15:00',
      documentsProcessed: 200,
      status: 'completed',
      stages: {
        extraction: true,
        transformation: true,
        mongoStorage: true,
        neo4jStorage: true,
        vectorStorage: true,
      },
    },
  ]);

  // Sankey diagram data for data flow visualization
  const sankeyData = {
    nodes: [
      { name: 'Raw Data' },
      { name: 'Extraction' },
      { name: 'Text Content' },
      { name: 'Metadata' },
      { name: 'Entities' },
      { name: 'MongoDB' },
      { name: 'Neo4j' },
      { name: 'Vector DB' },
    ],
    links: [
      { source: 0, target: 1, value: 1250 },
      { source: 1, target: 2, value: 800 },
      { source: 1, target: 3, value: 380 },
      { source: 2, target: 4, value: 650 },
      { source: 2, target: 5, value: 800 },
      { source: 3, target: 5, value: 380 },
      { source: 4, target: 6, value: 650 },
      { source: 2, target: 7, value: 800 },
    ],
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPipelineStages((prev) =>
        prev.map((stage) => ({
          ...stage,
          inputCount: stage.inputCount + Math.floor(Math.random() * 10),
          outputCount: stage.outputCount + Math.floor(Math.random() * 10),
          processingTime: stage.processingTime + Math.random() * 0.1,
        }))
      );

      setDataFlowStats((prev) => ({
        ...prev,
        processedToday: prev.processedToday + Math.floor(Math.random() * 5),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStageIcon = (type: PipelineStage['type']) => {
    switch (type) {
      case 'extraction':
        return <DataArray />;
      case 'transformation':
        return <Transform />;
      case 'loading':
        return <Storage />;
      default:
        return <Code />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
      case 'running':
      case 'syncing':
        return 'primary';
      case 'completed':
      case 'active':
        return 'success';
      case 'error':
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          ETL Pipeline Viewer
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Real-time data transformation and multi-database distribution monitoring
        </Typography>

        {/* Statistics Cards */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, bgcolor: 'primary.main' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Description sx={{ color: 'primary.contrastText', fontSize: 32 }} />
                <Box>
                  <Typography variant="body2" color="primary.contrastText">
                    Total Documents
                  </Typography>
                  <Typography variant="h5" color="primary.contrastText" fontWeight={700}>
                    {dataFlowStats.totalDocuments.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, bgcolor: 'success.main' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Speed sx={{ color: 'success.contrastText', fontSize: 32 }} />
                <Box>
                  <Typography variant="body2" color="success.contrastText">
                    Processed Today
                  </Typography>
                  <Typography variant="h5" color="success.contrastText" fontWeight={700}>
                    {dataFlowStats.processedToday.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, bgcolor: 'info.main' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Timeline sx={{ color: 'info.contrastText', fontSize: 32 }} />
                <Box>
                  <Typography variant="body2" color="info.contrastText">
                    Avg Processing Time
                  </Typography>
                  <Typography variant="h5" color="info.contrastText" fontWeight={700}>
                    {dataFlowStats.averageProcessingTime.toFixed(1)}s
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, bgcolor: 'warning.main' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Warning sx={{ color: 'warning.contrastText', fontSize: 32 }} />
                <Box>
                  <Typography variant="body2" color="warning.contrastText">
                    Error Rate
                  </Typography>
                  <Typography variant="h5" color="warning.contrastText" fontWeight={700}>
                    {dataFlowStats.errorRate}%
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* View Mode Toggle */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label="Pipeline Overview" />
          <Tab label="Processing Jobs" />
          <Tab label="Database Status" />
          <Tab label="Transformation Rules" />
        </Tabs>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, v) => v && setViewMode(v)}
          size="small"
        >
          <ToggleButton value="flow">
            <ViewStream /> Flow View
          </ToggleButton>
          <ToggleButton value="grid">
            <ViewModule /> Grid View
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <>
          {viewMode === 'flow' ? (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Data Flow Visualization
              </Typography>
              <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Simplified flow diagram since Sankey requires additional setup */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  {pipelineStages.map((stage, index) => (
                    <Box key={stage.id} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Paper
                        elevation={3}
                        sx={{
                          p: 3,
                          minWidth: 200,
                          textAlign: 'center',
                          border: '2px solid',
                          borderColor: getStatusColor(stage.status) + '.main',
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                          {getStageIcon(stage.type)}
                        </Box>
                        <Typography variant="h6" gutterBottom>
                          {stage.name}
                        </Typography>
                        <Chip
                          label={stage.status}
                          color={getStatusColor(stage.status) as any}
                          size="small"
                          sx={{ mb: 2 }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 1 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Input
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {stage.inputCount}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Output
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {stage.outputCount}
                            </Typography>
                          </Box>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={75}
                          sx={{ mb: 1 }}
                          color={getStatusColor(stage.status) as any}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {stage.processingTime.toFixed(1)}s avg • {stage.errors} errors
                        </Typography>
                      </Paper>
                      {index < pipelineStages.length - 1 && (
                        <ArrowForward sx={{ mx: 2, fontSize: 32, color: 'primary.main' }} />
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {pipelineStages.map((stage) => (
                <Grid item xs={12} md={4} key={stage.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        {getStageIcon(stage.type)}
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          {stage.name}
                        </Typography>
                        <Box sx={{ ml: 'auto' }}>
                          <Chip
                            label={stage.status}
                            color={getStatusColor(stage.status) as any}
                            size="small"
                          />
                        </Box>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Input Documents
                          </Typography>
                          <Typography variant="h5" fontWeight={700}>
                            {stage.inputCount}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Output Documents
                          </Typography>
                          <Typography variant="h5" fontWeight={700}>
                            {stage.outputCount}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Processing Time
                          </Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {stage.processingTime.toFixed(1)}s
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Error Count
                          </Typography>
                          <Typography variant="body1" fontWeight={600} color="error">
                            {stage.errors}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Database Distribution */}
          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            Database Distribution
          </Typography>
          <Grid container spacing={3}>
            {databases.map((db) => (
              <Grid item xs={12} md={4} key={db.name}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {db.icon}
                      <Box sx={{ ml: 2, flex: 1 }}>
                        <Typography variant="h6">{db.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {db.type}
                        </Typography>
                      </Box>
                      <Chip
                        label={db.status}
                        color={getStatusColor(db.status) as any}
                        size="small"
                      />
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Documents
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                          {db.documentsCount.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Data Size
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                          {db.dataSize}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Last Update: {db.lastUpdate}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {activeTab === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Job ID</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Documents</TableCell>
                <TableCell>Pipeline Stages</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {processingJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>{job.id}</TableCell>
                  <TableCell>{job.source}</TableCell>
                  <TableCell>{job.startTime}</TableCell>
                  <TableCell>{job.duration}</TableCell>
                  <TableCell>{job.documentsProcessed}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Extraction">
                        <Chip
                          icon={<DataArray />}
                          label="E"
                          size="small"
                          color={job.stages.extraction ? 'success' : 'default'}
                        />
                      </Tooltip>
                      <Tooltip title="Transformation">
                        <Chip
                          icon={<Transform />}
                          label="T"
                          size="small"
                          color={job.stages.transformation ? 'success' : 'default'}
                        />
                      </Tooltip>
                      <Tooltip title="MongoDB">
                        <Chip
                          icon={<Storage />}
                          label="M"
                          size="small"
                          color={job.stages.mongoStorage ? 'success' : 'default'}
                        />
                      </Tooltip>
                      <Tooltip title="Neo4j">
                        <Chip
                          icon={<Hub />}
                          label="N"
                          size="small"
                          color={job.stages.neo4jStorage ? 'success' : 'default'}
                        />
                      </Tooltip>
                      <Tooltip title="Vector DB">
                        <Chip
                          icon={<AccountTree />}
                          label="V"
                          size="small"
                          color={job.stages.vectorStorage ? 'success' : 'default'}
                        />
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={job.status}
                      color={getStatusColor(job.status) as any}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                MongoDB Performance
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Write Operations/sec</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    125
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={65} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Read Operations/sec</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    89
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={45} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Index Efficiency</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    98%
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={98} color="success" />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Neo4j Performance
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Node Creation/sec</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    78
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={78} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Relationship Creation/sec</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    156
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={85} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Query Response Time</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    23ms
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={95} color="success" />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 3 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Transformation Rules
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            Data transformation rules powered by InfraNodus text analysis and Neo4j GDS algorithms
          </Alert>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText
                primary="HTML to Markdown Conversion"
                secondary="Convert scraped HTML to clean Markdown format, preserving structure"
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Entity Extraction"
                secondary="Extract people, organizations, locations, and products using NER"
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Topic Clustering"
                secondary="Use InfraNodus to identify main topics and create knowledge graph nodes"
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Vector Embedding"
                secondary="Generate semantic embeddings for similarity search and RAG"
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Schema Validation"
                secondary="Validate and enrich with Schema.org markup for SEO optimization"
              />
            </ListItem>
          </List>
        </Paper>
      )}
    </Box>
  );
}