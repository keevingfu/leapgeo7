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
  Slider,
} from '@mui/material';
import { Landscape as LandscapeIcon, Circle } from '@mui/icons-material';
import * as d3 from 'd3';
import type { PLevel } from '@/types/roadmap.types';

interface GraphNode {
  id: string;
  label: string;
  pLevel: PLevel;
  geoScore: number;
  quickWin: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  strength: number;
}

// Mock graph data - competitive intelligence network
const mockNodes: GraphNode[] = [
  // P0 - Core nodes (central, high importance)
  { id: '1', label: 'Back Pain Relief', pLevel: 'P0', geoScore: 92, quickWin: 88 },
  { id: '2', label: 'Memory Foam Comparison', pLevel: 'P0', geoScore: 90, quickWin: 85 },
  { id: '3', label: 'Cooling Technology', pLevel: 'P0', geoScore: 88, quickWin: 82 },
  { id: '4', label: 'Side Sleeper Support', pLevel: 'P0', geoScore: 91, quickWin: 87 },

  // P1 - Important nodes (secondary hub)
  { id: '5', label: 'Mattress Cleaning', pLevel: 'P1', geoScore: 78, quickWin: 72 },
  { id: '6', label: 'Firmness Guide', pLevel: 'P1', geoScore: 82, quickWin: 75 },
  { id: '7', label: 'Mattress Topper', pLevel: 'P1', geoScore: 76, quickWin: 68 },
  { id: '8', label: 'Size Chart', pLevel: 'P1', geoScore: 80, quickWin: 74 },
  { id: '9', label: 'Organic Benefits', pLevel: 'P1', geoScore: 79, quickWin: 70 },

  // P2 - Opportunity nodes (peripheral)
  { id: '10', label: 'Warranty Coverage', pLevel: 'P2', geoScore: 65, quickWin: 58 },
  { id: '11', label: 'Mattress Lifespan', pLevel: 'P2', geoScore: 68, quickWin: 62 },
  { id: '12', label: 'Delivery Process', pLevel: 'P2', geoScore: 62, quickWin: 55 },
  { id: '13', label: 'Mattress Protector', pLevel: 'P2', geoScore: 70, quickWin: 64 },
  { id: '14', label: 'Trial Period', pLevel: 'P2', geoScore: 67, quickWin: 60 },

  // P3 - Reserve nodes (outer edge)
  { id: '15', label: 'Recycling Options', pLevel: 'P3', geoScore: 45, quickWin: 38 },
  { id: '16', label: 'Manufacturing History', pLevel: 'P3', geoScore: 42, quickWin: 35 },
  { id: '17', label: 'Material Sourcing', pLevel: 'P3', geoScore: 48, quickWin: 40 },
  { id: '18', label: 'Custom Design', pLevel: 'P3', geoScore: 50, quickWin: 43 },
];

const mockLinks: GraphLink[] = [
  // P0 core cluster - strong connections
  { source: '1', target: '2', strength: 0.9 },
  { source: '1', target: '3', strength: 0.85 },
  { source: '1', target: '4', strength: 0.88 },
  { source: '2', target: '3', strength: 0.82 },
  { source: '3', target: '4', strength: 0.8 },

  // P0 to P1 connections
  { source: '1', target: '5', strength: 0.6 },
  { source: '2', target: '6', strength: 0.65 },
  { source: '3', target: '7', strength: 0.6 },
  { source: '4', target: '8', strength: 0.55 },
  { source: '2', target: '9', strength: 0.58 },

  // P1 internal connections
  { source: '5', target: '6', strength: 0.5 },
  { source: '6', target: '7', strength: 0.52 },
  { source: '7', target: '8', strength: 0.48 },
  { source: '8', target: '9', strength: 0.5 },

  // P1 to P2 connections
  { source: '6', target: '10', strength: 0.4 },
  { source: '7', target: '11', strength: 0.42 },
  { source: '8', target: '12', strength: 0.38 },
  { source: '9', target: '13', strength: 0.45 },
  { source: '5', target: '14', strength: 0.4 },

  // P2 internal connections
  { source: '10', target: '11', strength: 0.35 },
  { source: '11', target: '12', strength: 0.32 },
  { source: '12', target: '13', strength: 0.38 },
  { source: '13', target: '14', strength: 0.35 },

  // P2 to P3 connections
  { source: '11', target: '15', strength: 0.25 },
  { source: '12', target: '16', strength: 0.22 },
  { source: '13', target: '17', strength: 0.28 },
  { source: '14', target: '18', strength: 0.26 },

  // P3 internal connections (weak)
  { source: '15', target: '16', strength: 0.2 },
  { source: '16', target: '17', strength: 0.18 },
  { source: '17', target: '18', strength: 0.2 },
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

const pLevelSizes: Record<PLevel, number> = {
  P0: 20,
  P1: 15,
  P2: 12,
  P3: 10,
};

export default function BattlefieldMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [filterPLevel, setFilterPLevel] = useState<PLevel | 'all'>('all');
  const [linkStrengthThreshold, setLinkStrengthThreshold] = useState<number>(0);

  // Filter data
  const filteredNodes = mockNodes.filter((node) => {
    return filterPLevel === 'all' || node.pLevel === filterPLevel;
  });

  const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));

  const filteredLinks = mockLinks.filter((link) => {
    const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
    const targetId = typeof link.target === 'string' ? link.target : link.target.id;
    return (
      link.strength >= linkStrengthThreshold &&
      filteredNodeIds.has(sourceId) &&
      filteredNodeIds.has(targetId)
    );
  });

  // Calculate stats
  const stats = {
    totalNodes: filteredNodes.length,
    totalLinks: filteredLinks.length,
    avgGeoScore: filteredNodes.reduce((sum, n) => sum + n.geoScore, 0) / filteredNodes.length,
    byPLevel: {
      P0: filteredNodes.filter((n) => n.pLevel === 'P0').length,
      P1: filteredNodes.filter((n) => n.pLevel === 'P1').length,
      P2: filteredNodes.filter((n) => n.pLevel === 'P2').length,
      P3: filteredNodes.filter((n) => n.pLevel === 'P3').length,
    },
  };

  // D3 force-directed graph rendering
  useEffect(() => {
    if (!svgRef.current || filteredNodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 1000;
    const height = 700;

    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    const g = svg.append('g');

    // Force simulation
    const simulation = d3
      .forceSimulation(filteredNodes as d3.SimulationNodeDatum[])
      .force(
        'link',
        d3
          .forceLink(filteredLinks)
          .id((d: any) => d.id)
          .distance((d: any) => 100 / d.strength)
          .strength((d: any) => d.strength)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d: any) => pLevelSizes[(d as GraphNode).pLevel] + 5));

    // Links
    const link = g
      .append('g')
      .selectAll('line')
      .data(filteredLinks)
      .enter()
      .append('line')
      .attr('stroke', '#94A3B8')
      .attr('stroke-opacity', (d) => d.strength * 0.6)
      .attr('stroke-width', (d) => d.strength * 3);

    // Nodes
    const tooltip = d3.select(tooltipRef.current);

    const node = g
      .append('g')
      .selectAll('g')
      .data(filteredNodes)
      .enter()
      .append('g')
      .style('cursor', 'grab')
      .call(
        d3
          .drag<SVGGElement, GraphNode>()
          .on('start', (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d: any) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Node circles
    node
      .append('circle')
      .attr('r', (d) => pLevelSizes[d.pLevel])
      .attr('fill', (d) => pLevelColors[d.pLevel])
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .on('mouseover', (event, d) => {
        tooltip
          .style('opacity', 1)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`)
          .html(`
            <div style="padding: 12px; background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); max-width: 280px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <div style="width: 12px; height: 12px; background: ${pLevelColors[d.pLevel]}; border-radius: 50%;"></div>
                <strong style="color: ${pLevelColors[d.pLevel]};">${d.pLevel}</strong>
              </div>
              <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px; color: #1E293B;">
                ${d.label}
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
                <div>
                  <span style="color: #64748B;">GEO Score:</span>
                  <strong style="color: #1E293B;"> ${d.geoScore}</strong>
                </div>
                <div>
                  <span style="color: #64748B;">Quick Win:</span>
                  <strong style="color: #1E293B;"> ${d.quickWin}</strong>
                </div>
              </div>
            </div>
          `);

        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('r', pLevelSizes[d.pLevel] * 1.5)
          .attr('stroke-width', 3);
      })
      .on('mouseout', (event, d) => {
        tooltip.style('opacity', 0);

        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('r', pLevelSizes[d.pLevel])
          .attr('stroke-width', 2);
      });

    // Node labels
    node
      .append('text')
      .text((d) => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => pLevelSizes[d.pLevel] + 12)
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('fill', '#475569')
      .style('pointer-events', 'none');

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [filteredNodes, filteredLinks]);

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
              bgcolor: '#EF444415',
              color: '#EF4444',
            }}
          >
            <LandscapeIcon fontSize="large" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" component="h1" fontWeight={600}>
              Situational Awareness
            </Typography>
            <Typography variant="body1" color="text.secondary">
              D3.js Force-Directed Graph - Competitive Intelligence Network
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Nodes
              </Typography>
              <Typography variant="h4" component="div" fontWeight={700}>
                {stats.totalNodes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Connections
              </Typography>
              <Typography variant="h4" component="div" fontWeight={700}>
                {stats.totalLinks}
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
                Core Nodes (P0)
              </Typography>
              <Typography variant="h4" component="div" fontWeight={700} sx={{ color: pLevelColors.P0 }}>
                {stats.byPLevel.P0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Force-Directed Graph */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Competitive Intelligence Network
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Interactive force-directed graph - drag nodes, scroll to zoom
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

          {/* Filters */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Filter by Priority Level
              </Typography>
              <ToggleButtonGroup
                value={filterPLevel}
                exclusive
                onChange={(_, newValue) => newValue && setFilterPLevel(newValue)}
                size="small"
                fullWidth
              >
                <ToggleButton value="all">All Levels</ToggleButton>
                <ToggleButton value="P0">P0</ToggleButton>
                <ToggleButton value="P1">P1</ToggleButton>
                <ToggleButton value="P2">P2</ToggleButton>
                <ToggleButton value="P3">P3</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Link Strength Threshold: {linkStrengthThreshold.toFixed(2)}
              </Typography>
              <Slider
                value={linkStrengthThreshold}
                onChange={(_, newValue) => setLinkStrengthThreshold(newValue as number)}
                min={0}
                max={1}
                step={0.1}
                marks={[
                  { value: 0, label: '0' },
                  { value: 0.5, label: '0.5' },
                  { value: 1, label: '1.0' },
                ]}
                valueLabelDisplay="auto"
              />
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', bgcolor: '#F8FAFC', borderRadius: 2, p: 2 }}>
          <svg
            ref={svgRef}
            width={1000}
            height={700}
            style={{ maxWidth: '100%', height: 'auto', border: '1px solid #E2E8F0', borderRadius: '8px', background: 'white' }}
          />
        </Box>
      </Paper>
    </Box>
  );
}
