import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Select,
  MenuItem,
  Button,
  Card,
  Typography,
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import ThreeLayerNetworkGraph from '@/components/charts/ThreeLayerNetworkGraph';

// Mock data for demonstration
const generateMockData = (filters: any) => {
  // Prompts Layer (20 nodes)
  const prompts = [
    { id: 'p1', name: 'best mattress for back pain', pLevel: 'P0', geoScore: 95, covered: true, category: 'Problem Solution', searchVolume: 'Very High', audience: 'Pain Sufferers' },
    { id: 'p2', name: 'how to choose mattress', pLevel: 'P0', geoScore: 92, covered: true, category: 'Tutorial', searchVolume: 'High', audience: 'First-time Buyers' },
    { id: 'p3', name: 'SweetNight vs Casper', pLevel: 'P0', geoScore: 90, covered: true, category: 'Comparison', searchVolume: 'Very High', audience: 'Decision Makers' },
    { id: 'p4', name: 'memory foam benefits', pLevel: 'P1', geoScore: 85, covered: true, category: 'Educational', searchVolume: 'High', audience: 'Researchers' },
    { id: 'p5', name: 'mattress size guide', pLevel: 'P1', geoScore: 82, covered: true, category: 'Tutorial', searchVolume: 'High', audience: 'First-time Buyers' },
    { id: 'p6', name: 'cooling mattress review', pLevel: 'P1', geoScore: 80, covered: true, category: 'Review', searchVolume: 'Medium', audience: 'Hot Sleepers' },
    { id: 'p7', name: 'mattress warranty guide', pLevel: 'P2', geoScore: 75, covered: true, category: 'Educational', searchVolume: 'Medium', audience: 'Researchers' },
    { id: 'p8', name: 'organic mattress options', pLevel: 'P2', geoScore: 72, covered: false, category: 'Product', searchVolume: 'Medium', audience: 'Eco-conscious' },
    { id: 'p9', name: 'mattress trial period', pLevel: 'P2', geoScore: 70, covered: true, category: 'Policy', searchVolume: 'Low', audience: 'Cautious Buyers' },
    { id: 'p10', name: 'affordable queen mattress', pLevel: 'P3', geoScore: 65, covered: false, category: 'Product', searchVolume: 'High', audience: 'Budget Shoppers' },
    { id: 'p11', name: 'mattress delivery time', pLevel: 'P3', geoScore: 60, covered: true, category: 'Logistics', searchVolume: 'Low', audience: 'Urgent Buyers' },
    { id: 'p12', name: 'latex vs memory foam', pLevel: 'P1', geoScore: 88, covered: true, category: 'Comparison', searchVolume: 'High', audience: 'Researchers' },
    { id: 'p13', name: 'mattress firmness levels', pLevel: 'P0', geoScore: 94, covered: true, category: 'Tutorial', searchVolume: 'Very High', audience: 'All Buyers' },
    { id: 'p14', name: 'best mattress 2025', pLevel: 'P0', geoScore: 96, covered: true, category: 'Review', searchVolume: 'Very High', audience: 'Researchers' },
    { id: 'p15', name: 'mattress for side sleepers', pLevel: 'P1', geoScore: 84, covered: true, category: 'Problem Solution', searchVolume: 'High', audience: 'Side Sleepers' },
    { id: 'p16', name: 'king size mattress dimensions', pLevel: 'P2', geoScore: 68, covered: true, category: 'Specifications', searchVolume: 'Medium', audience: 'Planners' },
    { id: 'p17', name: 'mattress cleaning tips', pLevel: 'P3', geoScore: 55, covered: false, category: 'Maintenance', searchVolume: 'Low', audience: 'Existing Owners' },
    { id: 'p18', name: 'hybrid mattress explained', pLevel: 'P2', geoScore: 78, covered: true, category: 'Educational', searchVolume: 'Medium', audience: 'Researchers' },
    { id: 'p19', name: 'mattress return policy', pLevel: 'P2', geoScore: 73, covered: true, category: 'Policy', searchVolume: 'Medium', audience: 'Cautious Buyers' },
    { id: 'p20', name: 'zero pressure mattress', pLevel: 'P1', geoScore: 86, covered: true, category: 'Product', searchVolume: 'High', audience: 'Pain Sufferers' },
  ];

  // Contents Layer (8 nodes)
  const contents = [
    { id: 'c1', name: 'YouTube Reviews', type: 'Video', count: 12 },
    { id: 'c2', name: 'Comparison Articles', type: 'Article', count: 8 },
    { id: 'c3', name: 'Amazon A+ Content', type: 'Product Page', count: 15 },
    { id: 'c4', name: 'FAQ Knowledge Base', type: 'Support', count: 25 },
    { id: 'c5', name: 'Official Website', type: 'Landing Page', count: 10 },
    { id: 'c6', name: 'Community Forum', type: 'UGC', count: 18 },
    { id: 'c7', name: 'Technical Docs', type: 'Documentation', count: 6 },
    { id: 'c8', name: 'Social Media Posts', type: 'Social', count: 30 },
  ];

  // Citations Layer (7 nodes)
  const citations = [
    { id: 'ci1', name: 'Professional Reviews', platform: 'Reviews', count: 45 },
    { id: 'ci2', name: 'YouTube Channels', platform: 'YouTube', count: 38 },
    { id: 'ci3', name: 'Amazon Platform', platform: 'Amazon', count: 52 },
    { id: 'ci4', name: 'Reddit Communities', platform: 'Reddit', count: 28 },
    { id: 'ci5', name: 'News & Blogs', platform: 'Media', count: 33 },
    { id: 'ci6', name: 'Social Media', platform: 'Social', count: 41 },
    { id: 'ci7', name: 'Audio Podcasts', platform: 'Audio', count: 15 },
  ];

  // Apply filters
  let filteredPrompts = prompts;
  if (filters.pLevel !== 'ALL') {
    filteredPrompts = filteredPrompts.filter(p => p.pLevel === filters.pLevel);
  }
  if (filters.category !== 'ALL') {
    filteredPrompts = filteredPrompts.filter(p => p.category === filters.category);
  }
  if (filters.covered !== 'ALL') {
    filteredPrompts = filteredPrompts.filter(p =>
      filters.covered === 'covered' ? p.covered : !p.covered
    );
  }

  // Build nodes
  const nodes = [
    ...filteredPrompts.map(p => ({
      id: p.id,
      name: p.name,
      layer: 'prompt' as const,
      pLevel: p.pLevel,
      size: p.geoScore / 5,
      covered: p.covered,
      category: p.category,
      searchVolume: p.searchVolume,
      targetAudience: p.audience,
    })),
    ...contents.map(c => ({
      id: c.id,
      name: c.name,
      layer: 'content' as const,
      size: 15,
      type: c.type,
      count: c.count,
    })),
    ...citations.map(ci => ({
      id: ci.id,
      name: ci.name,
      layer: 'citation' as const,
      size: 12,
      platform: ci.platform,
      count: ci.count,
    })),
  ];

  // Build links (simplified mapping)
  const links: any[] = [];

  // Prompt → Content links
  filteredPrompts.forEach((prompt, index) => {
    const contentId = `c${(index % 8) + 1}`;
    links.push({
      source: prompt.id,
      target: contentId,
      strength: 2,
      pLevel: prompt.pLevel,
    });
  });

  // Content → Citation links
  contents.forEach((content, index) => {
    const citationId = `ci${(index % 7) + 1}`;
    links.push({
      source: content.id,
      target: citationId,
      strength: 1.5,
    });
  });

  return { nodes, links };
};

export default function GeoMappingNetwork() {
  const [filters, setFilters] = useState({
    pLevel: 'ALL',
    category: 'ALL',
    covered: 'ALL',
  });

  const [graphData, setGraphData] = useState<any>({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [stats, setStats] = useState({
    visiblePrompts: 20,
    totalPrompts: 20,
    activeConnections: 61,
    coverageRate: 85,
    competitorGap: -10,
  });

  useEffect(() => {
    const data = generateMockData(filters);
    setGraphData(data);

    // Calculate stats
    const promptNodes = data.nodes.filter((n: any) => n.layer === 'prompt');
    const coveredCount = promptNodes.filter((n: any) => n.covered).length;
    const totalLinks = data.links.length;

    setStats({
      visiblePrompts: promptNodes.length,
      totalPrompts: 20,
      activeConnections: totalLinks,
      coverageRate: Math.round((coveredCount / promptNodes.length) * 100),
      competitorGap: -10,
    });
  }, [filters]);

  const handleReset = () => {
    setFilters({ pLevel: 'ALL', category: 'ALL', covered: 'ALL' });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Title */}
      <Typography variant="h4" fontWeight={700} gutterBottom>
        GEO Content Mapping Network
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Three-Layer Visualization - Strategic Coverage Analysis
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Priority Filter</InputLabel>
            <Select
              value={filters.pLevel}
              label="Priority Filter"
              onChange={(e) => setFilters({ ...filters, pLevel: e.target.value })}
            >
              <MenuItem value="ALL">All Levels</MenuItem>
              <MenuItem value="P0">P0 - Core</MenuItem>
              <MenuItem value="P1">P1 - Important</MenuItem>
              <MenuItem value="P2">P2 - Opportunity</MenuItem>
              <MenuItem value="P3">P3 - Reserve</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Category Filter</InputLabel>
            <Select
              value={filters.category}
              label="Category Filter"
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <MenuItem value="ALL">All Categories</MenuItem>
              <MenuItem value="Comparison">Comparison</MenuItem>
              <MenuItem value="Tutorial">Tutorial</MenuItem>
              <MenuItem value="Review">Review</MenuItem>
              <MenuItem value="Problem Solution">Problem Solution</MenuItem>
              <MenuItem value="Educational">Educational</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Coverage Status</InputLabel>
            <Select
              value={filters.covered}
              label="Coverage Status"
              onChange={(e) => setFilters({ ...filters, covered: e.target.value })}
            >
              <MenuItem value="ALL">All Status</MenuItem>
              <MenuItem value="covered">Covered Only</MenuItem>
              <MenuItem value="uncovered">Uncovered Only</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleReset}
          >
            Reset Filters
          </Button>
        </Box>
      </Paper>

      {/* Main Content Area */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        {/* Graph Visualization */}
        <Paper sx={{ flex: 1, p: 2, minHeight: 600, bgcolor: '#0f1729' }}>
          <ThreeLayerNetworkGraph
            data={graphData}
            onNodeClick={setSelectedNode}
          />
        </Paper>

        {/* Details Panel */}
        {selectedNode && (
          <Paper sx={{ width: 350, p: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Node Details
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Full Text:
              </Typography>
              <Typography variant="body1" fontWeight={600} sx={{ mb: 2 }}>
                {selectedNode.name}
              </Typography>

              {selectedNode.layer === 'prompt' && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Category:
                    </Typography>
                    <Chip
                      label={selectedNode.category}
                      size="small"
                      color="error"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Priority:
                    </Typography>
                    <Typography variant="body1" fontWeight={600} color="error.main">
                      {selectedNode.pLevel}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Search Volume:
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {selectedNode.searchVolume}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Target Audience:
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {selectedNode.targetAudience}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Coverage:
                    </Typography>
                    <Chip
                      label={selectedNode.covered ? 'Covered' : 'Not Covered'}
                      size="small"
                      color={selectedNode.covered ? 'success' : 'error'}
                    />
                  </Box>
                </>
              )}

              {selectedNode.layer === 'content' && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Type:
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {selectedNode.type}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Asset Count:
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {selectedNode.count}
                    </Typography>
                  </Box>
                </>
              )}

              {selectedNode.layer === 'citation' && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Platform:
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {selectedNode.platform}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Citation Count:
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {selectedNode.count}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </Paper>
        )}
      </Box>

      {/* KPI Statistics */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }}>
        <Card
          sx={{
            p: 3,
            textAlign: 'center',
            bgcolor: '#1e3a5f',
            border: '1px solid rgba(110, 231, 183, 0.3)',
          }}
        >
          <Typography variant="body2" color="#6ee7b7" gutterBottom>
            Visible Prompts
          </Typography>
          <Typography variant="h4" color="#6ee7b7" fontWeight={700}>
            {stats.visiblePrompts}/{stats.totalPrompts}
          </Typography>
        </Card>

        <Card
          sx={{
            p: 3,
            textAlign: 'center',
            bgcolor: '#1e3a5f',
            border: '1px solid rgba(110, 231, 183, 0.3)',
          }}
        >
          <Typography variant="body2" color="#6ee7b7" gutterBottom>
            Active Connections
          </Typography>
          <Typography variant="h4" color="#6ee7b7" fontWeight={700}>
            {stats.activeConnections}
          </Typography>
        </Card>

        <Card
          sx={{
            p: 3,
            textAlign: 'center',
            bgcolor: '#1e3a5f',
            border: '1px solid rgba(110, 231, 183, 0.3)',
          }}
        >
          <Typography variant="body2" color="#6ee7b7" gutterBottom>
            Content Coverage
          </Typography>
          <Typography variant="h4" color="#6ee7b7" fontWeight={700}>
            {stats.coverageRate}%
          </Typography>
        </Card>

        <Card
          sx={{
            p: 3,
            textAlign: 'center',
            bgcolor: '#1e3a5f',
            border: '1px solid rgba(110, 231, 183, 0.3)',
          }}
        >
          <Typography variant="body2" color="#6ee7b7" gutterBottom>
            Competitor Gap
          </Typography>
          <Typography
            variant="h4"
            color={stats.competitorGap < 0 ? '#ef4444' : '#10b981'}
            fontWeight={700}
          >
            {stats.competitorGap}%
          </Typography>
        </Card>
      </Box>
    </Box>
  );
}
