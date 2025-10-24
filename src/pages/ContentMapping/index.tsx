import { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Slider,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  AccountTree as NetworkIcon,
  Settings as SettingsIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';

// Type definitions
interface Node {
  id: string;
  name?: string;
  level?: string;
  score?: number;
  type?: string;
  status?: string;
  platform?: string;
  color?: string;
  x?: number;
  y?: number;
}

// Data structure: Prompts → Contents → Citations mapping
const data = {
  prompts: [
    { id: 'p1', name: 'best cooling mattress', level: 'P0', score: 155 },
    { id: 'p2', name: 'memory foam vs spring mattress', level: 'P0', score: 143 },
    { id: 'p3', name: 'mattress for back pain', level: 'P1', score: 112 },
    { id: 'p4', name: 'organic mattress guide', level: 'P1', score: 98 },
    { id: 'p5', name: 'mattress size comparison', level: 'P2', score: 76 },
    { id: 'p6', name: 'mattress warranty guide', level: 'P3', score: 54 },
  ],
  contents: [
    { id: 'c1', name: 'Blog #1: Technical White Paper', type: 'Deep Blog', status: 'Published' },
    { id: 'c2', name: 'Blog #2: User Experience Guide', type: 'Practical Blog', status: 'Published' },
    { id: 'c3', name: 'FAQ #1: Common Questions Collection', type: 'FAQ', status: 'Published' },
    { id: 'c4', name: 'Product #1: SweetNight Mattress', type: 'Product', status: 'Published' },
    { id: 'c5', name: 'Video #1: Unboxing Experience', type: 'Video', status: 'Planned' },
    { id: 'c6', name: 'Guide #1: Buying Guide', type: 'Guide', status: 'Planned' },
    { id: 'c7', name: 'Review #1: Expert Review', type: 'Review', status: 'Draft' },
  ],
  citations: [
    { id: 'ct1', name: 'YouTube', platform: 'YouTube', color: '#ff0000' },
    { id: 'ct2', name: 'Reddit', platform: 'Reddit', color: '#ff4500' },
    { id: 'ct3', name: 'Medium', platform: 'Medium', color: '#00ab6c' },
    { id: 'ct4', name: 'Quora', platform: 'Quora', color: '#b92b27' },
    { id: 'ct5', name: 'ChatGPT', platform: 'ChatGPT', color: '#10a37f' },
    { id: 'ct6', name: 'Claude', platform: 'Claude', color: '#8b5cf6' },
  ],
  links: [
    // Prompt → Content connections
    { source: 'p1', target: 'c1', type: 'prompt-content' },
    { source: 'p1', target: 'c4', type: 'prompt-content' },
    { source: 'p2', target: 'c1', type: 'prompt-content' },
    { source: 'p2', target: 'c3', type: 'prompt-content' },
    { source: 'p3', target: 'c2', type: 'prompt-content' },
    { source: 'p3', target: 'c4', type: 'prompt-content' },
    { source: 'p4', target: 'c2', type: 'prompt-content' },
    { source: 'p4', target: 'c6', type: 'prompt-content' },
    { source: 'p5', target: 'c3', type: 'prompt-content' },
    { source: 'p6', target: 'c7', type: 'prompt-content' },

    // Content → Citation connections
    { source: 'c1', target: 'ct1', type: 'content-citation' },
    { source: 'c1', target: 'ct5', type: 'content-citation' },
    { source: 'c1', target: 'ct6', type: 'content-citation' },
    { source: 'c2', target: 'ct2', type: 'content-citation' },
    { source: 'c2', target: 'ct3', type: 'content-citation' },
    { source: 'c3', target: 'ct4', type: 'content-citation' },
    { source: 'c3', target: 'ct5', type: 'content-citation' },
    { source: 'c4', target: 'ct1', type: 'content-citation' },
    { source: 'c4', target: 'ct2', type: 'content-citation' },
    { source: 'c4', target: 'ct5', type: 'content-citation' },
  ],
};

// P-level colors
const pLevelColors: Record<string, string> = {
  P0: '#EF4444',
  P1: '#F59E0B',
  P2: '#10B981',
  P3: '#94A3B8',
};

// Content type colors
const contentTypeColors: Record<string, string> = {
  'Deep Blog': '#3B82F6',
  'Practical Blog': '#06B6D4',
  FAQ: '#8B5CF6',
  Product: '#EC4899',
  Video: '#F59E0B',
  Guide: '#10B981',
  Review: '#6366F1',
};

export default function ContentMapping() {
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [showAllEdges, setShowAllEdges] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Calculate positions for force-directed layout
  const graphData = useMemo(() => {
    const width = 1000;
    const height = 600;
    const layerSpacing = width / 4;

    // Create nodes with positions
    const nodes: Node[] = [
      // Prompts layer (left)
      ...data.prompts.map((p, i) => ({
        ...p,
        x: layerSpacing,
        y: (height / (data.prompts.length + 1)) * (i + 1),
      })),
      // Contents layer (middle)
      ...data.contents.map((c, i) => ({
        ...c,
        x: layerSpacing * 2,
        y: (height / (data.contents.length + 1)) * (i + 1),
      })),
      // Citations layer (right)
      ...data.citations.map((ct, i) => ({
        ...ct,
        x: layerSpacing * 3,
        y: (height / (data.citations.length + 1)) * (i + 1),
      })),
    ];

    // Filter links based on selected prompt
    let filteredLinks = data.links;
    if (selectedPrompt && !showAllEdges) {
      // Find content IDs connected to selected prompt
      const connectedContentIds = data.links
        .filter(link => link.source === selectedPrompt && link.type === 'prompt-content')
        .map(link => link.target);

      // Only show links from selected prompt and its connected contents
      filteredLinks = data.links.filter(
        link =>
          (link.source === selectedPrompt && link.type === 'prompt-content') ||
          (connectedContentIds.includes(link.source) && link.type === 'content-citation')
      );
    }

    return { nodes, links: filteredLinks, width, height };
  }, [selectedPrompt, showAllEdges]);

  // Get prompt statistics when one is selected
  const selectedPromptStats = useMemo(() => {
    if (!selectedPrompt) return null;

    const prompt = data.prompts.find(p => p.id === selectedPrompt);
    if (!prompt) return null;

    const connectedContents = data.links
      .filter(link => link.source === selectedPrompt && link.type === 'prompt-content')
      .map(link => data.contents.find(c => c.id === link.target))
      .filter(Boolean);

    const allCitations = new Set<string>();
    connectedContents.forEach(content => {
      if (content) {
        data.links
          .filter(link => link.source === content.id && link.type === 'content-citation')
          .forEach(link => allCitations.add(link.target));
      }
    });

    return {
      prompt: prompt.name,
      level: prompt.level,
      score: prompt.score,
      contentCount: connectedContents.length,
      citationCount: allCitations.size,
      contents: connectedContents,
    };
  }, [selectedPrompt]);

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#3B82F615',
              color: '#3B82F6',
            }}
          >
            <NetworkIcon fontSize="large" />
          </Box>
          <Box>
            <Typography variant="h4" component="h1" fontWeight={600}>
              Prompts → Contents → Citations Mapping
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Three-layer content distribution and citation chain visualization in GEO flywheel
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Controls */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 300 }}>
            <InputLabel>Filter by Prompt</InputLabel>
            <Select
              value={selectedPrompt}
              label="Filter by Prompt"
              onChange={(e) => setSelectedPrompt(e.target.value)}
            >
              <MenuItem value="">
                <em>Show All</em>
              </MenuItem>
              {data.prompts.map((prompt) => (
                <MenuItem key={prompt.id} value={prompt.id}>
                  [{prompt.level}] {prompt.name} (Score: {prompt.score})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant={showAllEdges ? 'contained' : 'outlined'}
            startIcon={<FilterIcon />}
            onClick={() => setShowAllEdges(!showAllEdges)}
          >
            {showAllEdges ? 'Showing All Edges' : 'Show All Edges'}
          </Button>

          <Box sx={{ flex: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 200 }}>
            <SettingsIcon color="action" />
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 60 }}>
              Zoom: {zoomLevel.toFixed(1)}x
            </Typography>
            <Slider
              value={zoomLevel}
              onChange={(_, value) => setZoomLevel(value as number)}
              min={0.5}
              max={2}
              step={0.1}
              sx={{ flex: 1 }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Graph Visualization */}
      <Paper sx={{ p: 3, mb: 3, overflow: 'hidden' }}>
        <svg
          width="100%"
          height={graphData.height}
          viewBox={`0 0 ${graphData.width} ${graphData.height}`}
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
        >
          {/* Draw edges */}
          {graphData.links.map((link, i) => {
            const sourceNode = graphData.nodes.find(n => n.id === link.source);
            const targetNode = graphData.nodes.find(n => n.id === link.target);
            if (!sourceNode || !targetNode) return null;

            return (
              <line
                key={i}
                x1={sourceNode.x}
                y1={sourceNode.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke={link.type === 'prompt-content' ? '#94A3B8' : '#D1D5DB'}
                strokeWidth={link.type === 'prompt-content' ? 2 : 1}
                strokeOpacity={0.5}
              />
            );
          })}

          {/* Draw nodes */}
          {graphData.nodes.map((node) => {
            const isPrompt = node.id.startsWith('p');
            const isContent = node.id.startsWith('c');
            const isCitation = node.id.startsWith('ct');

            let fill = '#94A3B8';
            let shape = 'circle';
            let size = 30;

            if (isPrompt) {
              fill = pLevelColors[node.level || 'P3'];
              shape = 'circle';
              size = 35;
            } else if (isContent) {
              fill = contentTypeColors[node.type || 'Guide'];
              shape = 'rect';
              size = 35;
            } else if (isCitation) {
              fill = node.color || '#94A3B8';
              shape = 'triangle';
              size = 30;
            }

            const isSelected = selectedNode?.id === node.id;

            return (
              <g
                key={node.id}
                onClick={() => setSelectedNode(node)}
                style={{ cursor: 'pointer' }}
              >
                {shape === 'circle' && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={size / 2}
                    fill={fill}
                    stroke={isSelected ? '#000' : 'none'}
                    strokeWidth={isSelected ? 3 : 0}
                    opacity={0.8}
                  />
                )}
                {shape === 'rect' && (
                  <rect
                    x={node.x! - size / 2}
                    y={node.y! - size / 2}
                    width={size}
                    height={size}
                    fill={fill}
                    stroke={isSelected ? '#000' : 'none'}
                    strokeWidth={isSelected ? 3 : 0}
                    opacity={0.8}
                    rx={4}
                  />
                )}
                {shape === 'triangle' && (
                  <polygon
                    points={`${node.x},${node.y! - size / 2} ${node.x! + size / 2},${node.y! + size / 2} ${node.x! - size / 2},${node.y! + size / 2}`}
                    fill={fill}
                    stroke={isSelected ? '#000' : 'none'}
                    strokeWidth={isSelected ? 3 : 0}
                    opacity={0.8}
                  />
                )}
                <text
                  x={node.x}
                  y={node.y! + size / 2 + 15}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#374151"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {node.name && node.name.length > 20 ? node.name.substring(0, 20) + '...' : node.name || ''}
                </text>
              </g>
            );
          })}
        </svg>
      </Paper>

      {/* Legend and Stats */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Legend */}
        <Card sx={{ flex: 1, minWidth: 300 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Legend
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: '#EF4444',
                  }}
                />
                <Typography variant="body2">Prompts (Circle, sized by priority)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: '#3B82F6',
                    borderRadius: 0.5,
                  }}
                />
                <Typography variant="body2">Contents (Rectangle, colored by type)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <svg width="20" height="20">
                  <polygon points="10,2 18,18 2,18" fill="#10B981" />
                </svg>
                <Typography variant="body2">Citations (Triangle, platform colors)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 40, height: 2, bgcolor: '#94A3B8' }} />
                <Typography variant="body2">Prompt → Content link</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 40, height: 1, bgcolor: '#D1D5DB' }} />
                <Typography variant="body2">Content → Citation link</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Statistics */}
        {selectedPromptStats && (
          <Card sx={{ flex: 1, minWidth: 300 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Selected Prompt Statistics
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Prompt
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {selectedPromptStats.prompt}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Chip
                    label={selectedPromptStats.level}
                    size="small"
                    sx={{
                      bgcolor: `${pLevelColors[selectedPromptStats.level]}15`,
                      color: pLevelColors[selectedPromptStats.level],
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    label={`Score: ${selectedPromptStats.score}`}
                    size="small"
                    color="primary"
                  />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Connected Contents: {selectedPromptStats.contentCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Citations: {selectedPromptStats.citationCount}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
}
