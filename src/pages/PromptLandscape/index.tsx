import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Landscape as LandscapeIcon,
  Circle,
  AccountTree as GraphIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import * as d3 from 'd3';
import type { RoadmapItem, PLevel } from '@/types/roadmap.types';
import GraphVisualization, {
  GraphNode,
  GraphEdge,
} from '../../components/charts/GraphVisualization';

// Mock roadmap data for scatter plot
const mockRoadmapItems: RoadmapItem[] = [
  // P0 - Core prompts (high GEO score, high Quick Win)
  { id: '1', month: '2025-01', prompt: 'Best mattress for back pain relief', pLevel: 'P0', enhancedGeoScore: 92, quickWinIndex: 88, geoIntentType: 'commercial', contentStrategy: 'Expert review with medical citations', geoFriendliness: 5, contentHoursEst: 8, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', month: '2025-01', prompt: 'Memory foam vs spring mattress comparison', pLevel: 'P0', enhancedGeoScore: 90, quickWinIndex: 85, geoIntentType: 'informational', contentStrategy: 'Detailed comparison guide', geoFriendliness: 5, contentHoursEst: 8, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', month: '2025-01', prompt: 'Cooling mattress for hot sleepers', pLevel: 'P0', enhancedGeoScore: 88, quickWinIndex: 82, geoIntentType: 'commercial', contentStrategy: 'Temperature regulation technology review', geoFriendliness: 5, contentHoursEst: 8, createdAt: new Date(), updatedAt: new Date() },
  { id: '4', month: '2025-02', prompt: 'Mattress for side sleepers with shoulder pain', pLevel: 'P0', enhancedGeoScore: 91, quickWinIndex: 87, geoIntentType: 'commercial', contentStrategy: 'Pressure relief analysis', geoFriendliness: 5, contentHoursEst: 8, createdAt: new Date(), updatedAt: new Date() },

  // P1 - Important prompts (good GEO score, good Quick Win)
  { id: '5', month: '2025-01', prompt: 'How to clean a memory foam mattress', pLevel: 'P1', enhancedGeoScore: 78, quickWinIndex: 72, geoIntentType: 'informational', contentStrategy: 'Step-by-step maintenance guide', geoFriendliness: 4, contentHoursEst: 6, createdAt: new Date(), updatedAt: new Date() },
  { id: '6', month: '2025-01', prompt: 'Mattress firmness guide', pLevel: 'P1', enhancedGeoScore: 82, quickWinIndex: 75, geoIntentType: 'informational', contentStrategy: 'Firmness scale explanation', geoFriendliness: 4, contentHoursEst: 6, createdAt: new Date(), updatedAt: new Date() },
  { id: '7', month: '2025-02', prompt: 'Best mattress topper for comfort', pLevel: 'P1', enhancedGeoScore: 76, quickWinIndex: 68, geoIntentType: 'commercial', contentStrategy: 'Topper material comparison', geoFriendliness: 4, contentHoursEst: 6, createdAt: new Date(), updatedAt: new Date() },
  { id: '8', month: '2025-02', prompt: 'Mattress size comparison chart', pLevel: 'P1', enhancedGeoScore: 80, quickWinIndex: 74, geoIntentType: 'informational', contentStrategy: 'Visual size guide', geoFriendliness: 4, contentHoursEst: 6, createdAt: new Date(), updatedAt: new Date() },
  { id: '9', month: '2025-03', prompt: 'Organic mattress benefits', pLevel: 'P1', enhancedGeoScore: 79, quickWinIndex: 70, geoIntentType: 'informational', contentStrategy: 'Eco-friendly materials analysis', geoFriendliness: 4, contentHoursEst: 6, createdAt: new Date(), updatedAt: new Date() },

  // P2 - Opportunity prompts (moderate scores)
  { id: '10', month: '2025-02', prompt: 'Mattress warranty coverage explained', pLevel: 'P2', enhancedGeoScore: 65, quickWinIndex: 58, geoIntentType: 'informational', contentStrategy: 'Warranty terms breakdown', geoFriendliness: 3, contentHoursEst: 5, createdAt: new Date(), updatedAt: new Date() },
  { id: '11', month: '2025-02', prompt: 'How long does a mattress last', pLevel: 'P2', enhancedGeoScore: 68, quickWinIndex: 62, geoIntentType: 'informational', contentStrategy: 'Lifespan by material type', geoFriendliness: 3, contentHoursEst: 5, createdAt: new Date(), updatedAt: new Date() },
  { id: '12', month: '2025-03', prompt: 'Mattress delivery and setup process', pLevel: 'P2', enhancedGeoScore: 62, quickWinIndex: 55, geoIntentType: 'informational', contentStrategy: 'Unboxing and installation guide', geoFriendliness: 3, contentHoursEst: 5, createdAt: new Date(), updatedAt: new Date() },
  { id: '13', month: '2025-03', prompt: 'Mattress protector buying guide', pLevel: 'P2', enhancedGeoScore: 70, quickWinIndex: 64, geoIntentType: 'commercial', contentStrategy: 'Protector features comparison', geoFriendliness: 3, contentHoursEst: 5, createdAt: new Date(), updatedAt: new Date() },
  { id: '14', month: '2025-03', prompt: 'Mattress trial period policies', pLevel: 'P2', enhancedGeoScore: 67, quickWinIndex: 60, geoIntentType: 'informational', contentStrategy: 'Trial policy comparison', geoFriendliness: 3, contentHoursEst: 5, createdAt: new Date(), updatedAt: new Date() },

  // P3 - Reserve prompts (lower scores)
  { id: '15', month: '2025-03', prompt: 'Mattress recycling options', pLevel: 'P3', enhancedGeoScore: 45, quickWinIndex: 38, geoIntentType: 'informational', contentStrategy: 'Disposal and recycling guide', geoFriendliness: 2, contentHoursEst: 3, createdAt: new Date(), updatedAt: new Date() },
  { id: '16', month: '2025-04', prompt: 'History of mattress manufacturing', pLevel: 'P3', enhancedGeoScore: 42, quickWinIndex: 35, geoIntentType: 'informational', contentStrategy: 'Historical overview article', geoFriendliness: 2, contentHoursEst: 3, createdAt: new Date(), updatedAt: new Date() },
  { id: '17', month: '2025-04', prompt: 'Mattress materials sourcing', pLevel: 'P3', enhancedGeoScore: 48, quickWinIndex: 40, geoIntentType: 'informational', contentStrategy: 'Supply chain transparency', geoFriendliness: 2, contentHoursEst: 3, createdAt: new Date(), updatedAt: new Date() },
  { id: '18', month: '2025-04', prompt: 'Custom mattress design services', pLevel: 'P3', enhancedGeoScore: 50, quickWinIndex: 43, geoIntentType: 'commercial', contentStrategy: 'Customization options overview', geoFriendliness: 2, contentHoursEst: 3, createdAt: new Date(), updatedAt: new Date() },
];

const pLevelColors: Record<PLevel, string> = {
  P0: '#10B981', // Green - Core
  P1: '#3B82F6', // Blue - Important
  P2: '#F59E0B', // Orange - Opportunity
  P3: '#94A3B8', // Gray - Reserve
};

const pLevelLabels: Record<PLevel, string> = {
  P0: 'P0 - Core',
  P1: 'P1 - Important',
  P2: 'P2 - Opportunity',
  P3: 'P3 - Reserve',
};

interface PromptLandscapeData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  stats: {
    totalPrompts: number;
    coveredPrompts: number;
    uncoveredPrompts: number;
    coverageRate: number;
    totalRelationships: number;
  };
}

interface ContentGap {
  promptId: string;
  promptText: string;
  priority: string;
  reason: string;
  relatedPrompts: string[];
}

export default function PromptLandscape() {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [filterPLevel, setFilterPLevel] = useState<PLevel | 'all'>('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');

  // Knowledge Graph states
  const [graphData, setGraphData] = useState<PromptLandscapeData | null>(null);
  const [contentGaps, setContentGaps] = useState<ContentGap[]>([]);
  const [graphLoading, setGraphLoading] = useState(false);
  const [graphError, setGraphError] = useState<string | null>(null);
  const [selectedPLevels, setSelectedPLevels] = useState<string[]>(['P0', 'P1']);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Get unique months
  const uniqueMonths = Array.from(new Set(mockRoadmapItems.map((item) => item.month))).sort();

  // Filter data
  const filteredData = mockRoadmapItems.filter((item) => {
    const pLevelMatch = filterPLevel === 'all' || item.pLevel === filterPLevel;
    const monthMatch = filterMonth === 'all' || item.month === filterMonth;
    return pLevelMatch && monthMatch;
  });

  // Calculate stats
  const stats = {
    total: filteredData.length,
    byPLevel: {
      P0: filteredData.filter((i) => i.pLevel === 'P0').length,
      P1: filteredData.filter((i) => i.pLevel === 'P1').length,
      P2: filteredData.filter((i) => i.pLevel === 'P2').length,
      P3: filteredData.filter((i) => i.pLevel === 'P3').length,
    },
    avgGeoScore: filteredData.reduce((sum, i) => sum + i.enhancedGeoScore, 0) / filteredData.length,
    avgQuickWin: filteredData.reduce((sum, i) => sum + i.quickWinIndex, 0) / filteredData.length,
  };

  // API functions for Knowledge Graph
  const fetchGraphData = async () => {
    setGraphLoading(true);
    setGraphError(null);
    try {
      const params = new URLSearchParams();
      if (selectedPLevels.length > 0) {
        params.append('pLevels', selectedPLevels.join(','));
      }

      const response = await fetch(`http://localhost:3001/api/v1/prompt-landscape?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch graph data');
      }
      const result = await response.json();
      setGraphData(result.data);
    } catch (err: any) {
      setGraphError(err.message);
    } finally {
      setGraphLoading(false);
    }
  };

  const fetchContentGaps = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/prompt-landscape/gaps');
      if (!response.ok) {
        throw new Error('Failed to fetch content gaps');
      }
      const result = await response.json();
      setContentGaps(result.data.recommendations || []);
    } catch (err: any) {
      console.error('Error fetching content gaps:', err);
    }
  };

  const handlePLevelToggle = (pLevel: string) => {
    setSelectedPLevels((prev) =>
      prev.includes(pLevel)
        ? prev.filter((level) => level !== pLevel)
        : [...prev, pLevel],
    );
  };

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedNode(null);
  };

  // Fetch graph data when Knowledge Graph tab is active
  useEffect(() => {
    if (activeTab === 1) {
      fetchGraphData();
      fetchContentGaps();
    }
  }, [activeTab, selectedPLevels]);

  // D3 scatter plot rendering
  useEffect(() => {
    if (!svgRef.current || filteredData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 60, left: 70 };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    // Axes
    const xAxis = d3.axisBottom(xScale).ticks(10);
    const yAxis = d3.axisLeft(yScale).ticks(10);

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .append('text')
      .attr('x', width / 2)
      .attr('y', 45)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .text('Enhanced GEO Score');

    g.append('g')
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -50)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .text('Quick Win Index');

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(() => ''));

    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(() => ''));

    // Quadrant labels
    const quadrants = [
      { x: width * 0.75, y: height * 0.25, label: 'High Priority', color: '#10B981' },
      { x: width * 0.25, y: height * 0.25, label: 'Quick Wins', color: '#3B82F6' },
      { x: width * 0.75, y: height * 0.75, label: 'Strategic', color: '#F59E0B' },
      { x: width * 0.25, y: height * 0.75, label: 'Low Priority', color: '#94A3B8' },
    ];

    quadrants.forEach((q) => {
      g.append('text')
        .attr('x', q.x)
        .attr('y', q.y)
        .attr('text-anchor', 'middle')
        .attr('fill', q.color)
        .attr('opacity', 0.2)
        .style('font-size', '18px')
        .style('font-weight', '700')
        .text(q.label);
    });

    // Data points
    const tooltip = d3.select(tooltipRef.current);

    g.selectAll('.dot')
      .data(filteredData)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (d) => xScale(d.enhancedGeoScore))
      .attr('cy', (d) => yScale(d.quickWinIndex))
      .attr('r', 8)
      .attr('fill', (d) => pLevelColors[d.pLevel])
      .attr('opacity', 0.7)
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', (event, d) => {
        tooltip
          .style('opacity', 1)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`)
          .html(`
            <div style="padding: 12px; background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); max-width: 300px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <div style="width: 12px; height: 12px; background: ${pLevelColors[d.pLevel]}; border-radius: 50%;"></div>
                <strong style="color: ${pLevelColors[d.pLevel]};">${d.pLevel}</strong>
                <span style="color: #64748B; font-size: 12px;">${d.month}</span>
              </div>
              <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px; color: #1E293B;">
                ${d.prompt}
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
                <div>
                  <span style="color: #64748B;">GEO Score:</span>
                  <strong style="color: #1E293B;"> ${d.enhancedGeoScore}</strong>
                </div>
                <div>
                  <span style="color: #64748B;">Quick Win:</span>
                  <strong style="color: #1E293B;"> ${d.quickWinIndex}</strong>
                </div>
              </div>
              <div style="margin-top: 8px; font-size: 11px; color: #64748B;">
                ${d.contentStrategy}
              </div>
            </div>
          `);

        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('r', 12)
          .attr('opacity', 1);
      })
      .on('mouseout', (event) => {
        tooltip.style('opacity', 0);

        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('r', 8)
          .attr('opacity', 0.7);
      });

  }, [filteredData]);

  return (
    <Box>
      {/* Tooltip */}
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 1000,
          transition: 'opacity 0.2s',
        }}
      />

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
              bgcolor: '#F59E0B15',
              color: '#F59E0B',
            }}
          >
            <LandscapeIcon fontSize="large" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" component="h1" fontWeight={600}>
              Prompt Landscape
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {activeTab === 0
                ? 'D3.js Scatter Plot - GEO Score vs Quick Win Index'
                : 'Interactive Knowledge Graph powered by Neo4j'}
            </Typography>
          </Box>
          {activeTab === 1 && (
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => {
                fetchGraphData();
                fetchContentGaps();
              }}
            >
              Refresh
            </Button>
          )}
        </Box>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Scatter Plot" />
          <Tab label="Knowledge Graph" />
        </Tabs>
      </Paper>

      {/* Scatter Plot View */}
      {activeTab === 0 && (
        <>
          {/* Filters */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Filter by Month</InputLabel>
                <Select
                  value={filterMonth}
                  label="Filter by Month"
                  onChange={(e) => setFilterMonth(e.target.value)}
                >
                  <MenuItem value="all">All Months</MenuItem>
                  {uniqueMonths.map((month) => (
                    <MenuItem key={month} value={month}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <ToggleButtonGroup
                value={filterPLevel}
                exclusive
                onChange={(_, newValue) => newValue && setFilterPLevel(newValue)}
                size="small"
                fullWidth
              >
                <ToggleButton value="all">All</ToggleButton>
                <ToggleButton value="P0">P0</ToggleButton>
                <ToggleButton value="P1">P1</ToggleButton>
                <ToggleButton value="P2">P2</ToggleButton>
                <ToggleButton value="P3">P3</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Prompts
              </Typography>
              <Typography variant="h4" component="div" fontWeight={700}>
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Avg GEO Score
              </Typography>
              <Typography variant="h4" component="div" fontWeight={700}>
                {stats.avgGeoScore.toFixed(1)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Avg Quick Win
              </Typography>
              <Typography variant="h4" component="div" fontWeight={700}>
                {stats.avgQuickWin.toFixed(1)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                P0 Prompts
              </Typography>
              <Typography variant="h4" component="div" fontWeight={700} sx={{ color: pLevelColors.P0 }}>
                {stats.byPLevel.P0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Scatter Plot */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Prompt Landscape Visualization
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Interactive scatter plot showing GEO scoring and priority distribution
            </Typography>
          </Box>

          {/* Legend */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {(Object.keys(pLevelColors) as PLevel[]).map((level) => (
              <Chip
                key={level}
                icon={<Circle sx={{ fontSize: 12, color: pLevelColors[level] }} />}
                label={`${pLevelLabels[level]} (${stats.byPLevel[level]})`}
                size="small"
                sx={{ bgcolor: `${pLevelColors[level]}15` }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <svg
            ref={svgRef}
            width={800}
            height={600}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </Box>
      </Paper>
        </>
      )}

      {/* Knowledge Graph View */}
      {activeTab === 1 && (
        <>
          {graphLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
              <CircularProgress />
            </Box>
          )}

          {graphError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Error: {graphError}
            </Alert>
          )}

          {!graphLoading && !graphError && graphData && (
            <>
              {/* Statistics Cards */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={2.4}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Total Prompts
                      </Typography>
                      <Typography variant="h4" fontWeight={700}>
                        {graphData.stats.totalPrompts}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Coverage Rate
                      </Typography>
                      <Typography variant="h4" fontWeight={700} color="#10B981">
                        {graphData.stats.coverageRate.toFixed(1)}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Covered
                      </Typography>
                      <Typography variant="h4" fontWeight={700} color="#10B981">
                        {graphData.stats.coveredPrompts}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Uncovered
                      </Typography>
                      <Typography variant="h4" fontWeight={700} color="#EF4444">
                        {graphData.stats.uncoveredPrompts}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Relationships
                      </Typography>
                      <Typography variant="h4" fontWeight={700}>
                        {graphData.stats.totalRelationships}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                {/* Graph Visualization */}
                <Grid item xs={12} md={9}>
                  <Paper sx={{ p: 3 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        Knowledge Graph
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Interactive force-directed graph showing prompt relationships
                      </Typography>

                      {/* P-Level Filters */}
                      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        {['P0', 'P1', 'P2', 'P3'].map((pLevel) => (
                          <Chip
                            key={pLevel}
                            label={pLevel}
                            onClick={() => handlePLevelToggle(pLevel)}
                            color={selectedPLevels.includes(pLevel) ? 'primary' : 'default'}
                            variant={selectedPLevels.includes(pLevel) ? 'filled' : 'outlined'}
                          />
                        ))}
                      </Box>
                    </Box>

                    <GraphVisualization
                      nodes={graphData.nodes}
                      edges={graphData.edges}
                      width={1100}
                      height={600}
                      onNodeClick={handleNodeClick}
                    />

                    <Box sx={{ mt: 2, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#10B981', border: '2px solid #10B981' }} />
                        <Typography variant="caption">Covered</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#EF4444', border: '2px solid #EF4444', opacity: 0.4 }} />
                        <Typography variant="caption">Uncovered</Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>

                {/* Content Gaps Panel */}
                <Grid item xs={12} md={3}>
                  <Paper sx={{ p: 3, maxHeight: 750, overflow: 'auto' }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      <WarningIcon sx={{ fontSize: 20, mr: 1, verticalAlign: 'middle', color: '#F59E0B' }} />
                      Content Gaps
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      AI-recommended prompts to prioritize
                    </Typography>

                    {contentGaps.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        No content gaps identified
                      </Typography>
                    ) : (
                      <List dense sx={{ p: 0 }}>
                        {contentGaps.slice(0, 10).map((gap, index) => (
                          <ListItem
                            key={index}
                            sx={{
                              flexDirection: 'column',
                              alignItems: 'flex-start',
                              p: 2,
                              mb: 1,
                              bgcolor: '#F9FAFB',
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: 'divider',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Chip
                                label={gap.priority}
                                size="small"
                                color={gap.priority === 'P0' ? 'error' : 'warning'}
                                sx={{ height: 20 }}
                              />
                              <TrendingUpIcon sx={{ fontSize: 16, color: '#10B981' }} />
                            </Box>
                            <Typography variant="body2" fontWeight={600} gutterBottom>
                              {gap.promptText.substring(0, 60)}
                              {gap.promptText.length > 60 ? '...' : ''}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {gap.reason}
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}

          {/* Node Detail Dialog */}
          <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
            <DialogTitle>Prompt Details</DialogTitle>
            <DialogContent>
              {selectedNode && (
                <Box>
                  <Typography variant="body1" fontWeight={600} gutterBottom>
                    {selectedNode.text}
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Priority Level
                      </Typography>
                      <Chip label={selectedNode.pLevel} size="small" sx={{ mt: 0.5 }} />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        GEO Score
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {selectedNode.score.toFixed(1)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Content Count
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {selectedNode.contentCount}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Status
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight={600}
                        color={selectedNode.isCovered ? '#10B981' : '#EF4444'}
                      >
                        {selectedNode.isCovered ? 'Covered ✓' : 'Uncovered'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Close</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
}
