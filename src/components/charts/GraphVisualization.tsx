import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Box, useTheme } from '@mui/material';

export interface GraphNode {
  id: string;
  text: string;
  pLevel: string;
  score: number;
  isCovered: boolean;
  contentCount: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight: number;
}

interface GraphVisualizationProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  width?: number;
  height?: number;
  onNodeClick?: (node: GraphNode) => void;
}

const pLevelColors = {
  P0: '#EF4444',
  P1: '#F59E0B',
  P2: '#10B981',
  P3: '#3B82F6',
};

export default function GraphVisualization({
  nodes,
  edges,
  width = 1200,
  height = 700,
  onNodeClick,
}: GraphVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Create container group for zoom/pan
    const g = svg.append('g');

    // Prepare data for D3
    const nodeData = nodes.map((node) => ({ ...node }));
    const edgeData = edges.map((edge) => ({ ...edge }));

    // Create force simulation
    const simulation = d3
      .forceSimulation(nodeData as any)
      .force(
        'link',
        d3
          .forceLink(edgeData)
          .id((d: any) => d.id)
          .distance((d: any) => 150 - d.weight * 50),
      )
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40));

    // Add zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom as any);

    // Draw edges
    const link = g
      .append('g')
      .selectAll('line')
      .data(edgeData)
      .join('line')
      .attr('stroke', theme.palette.divider)
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d: any) => d.weight * 2);

    // Draw nodes
    const node = g
      .append('g')
      .selectAll('g')
      .data(nodeData)
      .join('g')
      .attr('cursor', 'pointer')
      .call(
        d3
          .drag<any, any>()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended),
      );

    // Node circles
    node
      .append('circle')
      .attr('r', (d: any) => 8 + Math.sqrt(d.score) * 2)
      .attr('fill', (d: any) => pLevelColors[d.pLevel as keyof typeof pLevelColors] || '#6B7280')
      .attr('fill-opacity', (d: any) => (d.isCovered ? 0.8 : 0.4))
      .attr('stroke', (d: any) => (d.isCovered ? '#10B981' : '#EF4444'))
      .attr('stroke-width', 2);

    // Node labels
    node
      .append('text')
      .text((d: any) => d.text.substring(0, 30) + (d.text.length > 30 ? '...' : ''))
      .attr('x', 0)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', theme.palette.text.primary)
      .attr('pointer-events', 'none');

    // Content count badge
    node
      .filter((d: any) => d.contentCount > 0)
      .append('circle')
      .attr('cx', 12)
      .attr('cy', -12)
      .attr('r', 8)
      .attr('fill', '#10B981');

    node
      .filter((d: any) => d.contentCount > 0)
      .append('text')
      .text((d: any) => d.contentCount)
      .attr('x', 12)
      .attr('y', -9)
      .attr('text-anchor', 'middle')
      .attr('font-size', '9px')
      .attr('font-weight', 'bold')
      .attr('fill', 'white')
      .attr('pointer-events', 'none');

    // Tooltips
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'graph-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', theme.palette.background.paper)
      .style('border', `1px solid ${theme.palette.divider}`)
      .style('border-radius', '4px')
      .style('padding', '12px')
      .style('font-size', '12px')
      .style('box-shadow', theme.shadows[3])
      .style('pointer-events', 'none')
      .style('z-index', 1000);

    node
      .on('mouseover', function (_event: any, d: any) {
        tooltip
          .style('visibility', 'visible')
          .html(
            `
            <div>
              <strong>${d.text}</strong><br/>
              <span style="color: ${pLevelColors[d.pLevel as keyof typeof pLevelColors]};">
                ${d.pLevel}
              </span> | Score: ${d.score.toFixed(1)}<br/>
              Content: ${d.contentCount} piece${d.contentCount !== 1 ? 's' : ''}<br/>
              Status: ${d.isCovered ? '<span style="color: #10B981;">Covered ✓</span>' : '<span style="color: #EF4444;">Uncovered</span>'}
            </div>
          `,
          );
        d3.select(this).select('circle').attr('stroke-width', 4);
      })
      .on('mousemove', function (event: any) {
        tooltip
          .style('top', event.pageY - 10 + 'px')
          .style('left', event.pageX + 10 + 'px');
      })
      .on('mouseout', function () {
        tooltip.style('visibility', 'hidden');
        d3.select(this).select('circle').attr('stroke-width', 2);
      })
      .on('click', function (_event: any, d: any) {
        if (onNodeClick) {
          onNodeClick(d);
        }
      });

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Cleanup
    return () => {
      simulation.stop();
      tooltip.remove();
    };
  }, [nodes, edges, width, height, theme, onNodeClick]);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#FAFAFA',
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      <svg ref={svgRef} />
    </Box>
  );
}
