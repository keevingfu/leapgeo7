import { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';

interface Node {
  id: string;
  name: string;
  layer: 'prompt' | 'content' | 'citation';
  pLevel?: string;
  size: number;
  covered?: boolean;
  category?: string;
  searchVolume?: string;
  targetAudience?: string;
  type?: string;
  count?: number;
  platform?: string;
}

interface Link {
  source: string;
  target: string;
  strength: number;
  pLevel?: string;
}

interface Props {
  data: { nodes: Node[]; links: Link[] };
  onNodeClick: (node: Node) => void;
}

export default function ThreeLayerNetworkGraph({ data, onNodeClick }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || !data.nodes.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    canvas.width = width;
    canvas.height = height;

    // Define three-layer X positions
    const layerX = {
      prompt: width * 0.15,
      content: width * 0.5,
      citation: width * 0.85,
    };

    // Color mapping for priority levels
    const colorMap: Record<string, string> = {
      P0: '#EF4444',
      P1: '#F97316',
      P2: '#EAB308',
      P3: '#3B82F6',
    };

    // Arrange nodes vertically within each layer
    const layerNodes: Record<string, Node[]> = {
      prompt: [],
      content: [],
      citation: [],
    };

    data.nodes.forEach((node) => {
      layerNodes[node.layer].push(node);
    });

    // Calculate Y positions
    const nodePositions: Record<string, { x: number; y: number }> = {};

    Object.keys(layerNodes).forEach((layer) => {
      const nodes = layerNodes[layer];
      const spacing = height / (nodes.length + 1);

      nodes.forEach((node, index) => {
        nodePositions[node.id] = {
          x: layerX[layer as keyof typeof layerX],
          y: spacing * (index + 1),
        };
      });
    });

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw connections
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.4;

    data.links.forEach((link) => {
      const sourcePos = nodePositions[link.source];
      const targetPos = nodePositions[link.target];

      if (!sourcePos || !targetPos) return;

      // Determine color based on pLevel
      const color = link.pLevel ? colorMap[link.pLevel] : '#6ee7b7';

      ctx.strokeStyle = color;
      ctx.lineWidth = link.strength;

      ctx.beginPath();
      ctx.moveTo(sourcePos.x, sourcePos.y);
      ctx.lineTo(targetPos.x, targetPos.y);
      ctx.stroke();
    });

    ctx.globalAlpha = 1;

    // Draw nodes
    data.nodes.forEach((node) => {
      const pos = nodePositions[node.id];
      if (!pos) return;

      // Node color
      let fillColor = '#3B82F6';
      if (node.layer === 'prompt' && node.pLevel) {
        fillColor = colorMap[node.pLevel];
      } else if (node.layer === 'content') {
        fillColor = '#F97316';
      } else if (node.layer === 'citation') {
        fillColor = '#10B981';
      }

      // Border color based on coverage
      let borderColor = '#fff';
      if (node.layer === 'prompt') {
        borderColor = node.covered ? '#10B981' : '#EF4444';
      }

      // Draw node shape
      ctx.save();
      ctx.translate(pos.x, pos.y);

      if (node.layer === 'prompt') {
        // Circle for prompts
        ctx.beginPath();
        ctx.arc(0, 0, node.size, 0, Math.PI * 2);
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 3;
        ctx.stroke();
      } else if (node.layer === 'content') {
        // Rectangle for contents
        const width = node.size * 2;
        const height = node.size * 1.5;
        ctx.fillStyle = fillColor;
        ctx.fillRect(-width / 2, -height / 2, width, height);
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(-width / 2, -height / 2, width, height);
      } else if (node.layer === 'citation') {
        // Triangle for citations
        ctx.beginPath();
        ctx.moveTo(0, -node.size);
        ctx.lineTo(node.size, node.size);
        ctx.lineTo(-node.size, node.size);
        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.restore();

      // Draw text label
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      const labelText =
        node.name.length > 20 ? node.name.substring(0, 20) + '...' : node.name;
      ctx.fillText(labelText, pos.x + 25, pos.y);
    });

    // Handle click events
    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Find clicked node
      for (const node of data.nodes) {
        const pos = nodePositions[node.id];
        if (!pos) continue;

        const distance = Math.sqrt(
          Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2)
        );

        if (distance <= node.size + 5) {
          onNodeClick(node);
          break;
        }
      }
    };

    canvas.addEventListener('click', handleClick);

    return () => {
      canvas.removeEventListener('click', handleClick);
    };
  }, [data, onNodeClick]);

  return (
    <Box ref={containerRef} sx={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Layer Labels */}
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-around',
          px: 3,
        }}
      >
        <Typography variant="body2" fontWeight={600} color="#EF4444">
          Prompts Layer
        </Typography>
        <Typography variant="body2" fontWeight={600} color="#F97316">
          Contents Layer
        </Typography>
        <Typography variant="body2" fontWeight={600} color="#10B981">
          Citations Layer
        </Typography>
      </Box>

      {/* Legend */}
      <Box
        sx={{
          position: 'absolute',
          top: 40,
          left: 20,
          bgcolor: 'rgba(0,0,0,0.6)',
          p: 2,
          borderRadius: 1,
        }}
      >
        <Typography variant="caption" color="#fff" fontWeight={600} gutterBottom>
          Priority Levels
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: '#EF4444',
              }}
            />
            <Typography variant="caption" color="#fff">
              P0 - Core
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: '#F97316',
              }}
            />
            <Typography variant="caption" color="#fff">
              P1 - Important
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: '#EAB308',
              }}
            />
            <Typography variant="caption" color="#fff">
              P2 - Opportunity
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: '#3B82F6',
              }}
            />
            <Typography variant="caption" color="#fff">
              P3 - Reserve
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="caption"
          color="#fff"
          fontWeight={600}
          sx={{ display: 'block', mt: 2 }}
        >
          Coverage Status
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                border: '3px solid #10B981',
              }}
            />
            <Typography variant="caption" color="#fff">
              Covered
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                border: '3px solid #EF4444',
              }}
            />
            <Typography variant="caption" color="#fff">
              Not Covered
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', cursor: 'pointer' }}
      />
    </Box>
  );
}
