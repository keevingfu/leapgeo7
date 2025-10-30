import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Psychology as PsychologyIcon,
  Article as ArticleIcon,
  FormatQuote as CitationIcon,
} from '@mui/icons-material';
import { platformsData } from '../../../data/geoStrategyData';

interface PlatformDetailProps {
  platformId: string;
  onBack: () => void;
}

const PlatformDetail: React.FC<PlatformDetailProps> = ({ platformId, onBack }) => {
  const platform = platformsData[platformId];
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate connections between layers
  const generateConnections = () => {
    const connections: Array<{ from: string; to: string; strength: number }> = [];

    // Prompt to Content connections
    platform.prompts.forEach((prompt) => {
      const relatedContents = platform.contents.filter(
        (content) =>
          prompt.category.toLowerCase().includes('comparison') &&
          content.type.includes('Comparison') ||
          prompt.category.toLowerCase().includes('tutorial') &&
          content.type.includes('Guide')
      );

      relatedContents.forEach((content) => {
        connections.push({
          from: `prompt-${prompt.id}`,
          to: `content-${content.id}`,
          strength: Math.random() * 0.5 + 0.5,
        });
      });
    });

    // Content to Citation connections
    platform.contents.forEach((content) => {
      platform.citations.forEach((citation) => {
        if (Math.random() > 0.5) {
          connections.push({
            from: `content-${content.id}`,
            to: `citation-${citation.id}`,
            strength: citation.strength === 'Strong' ? 1 : citation.strength === 'Medium' ? 0.7 : 0.4,
          });
        }
      });
    });

    return connections;
  };

  const [connections] = useState(generateConnections());

  // Draw SVG connections
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = svgRef.current;
    svg.innerHTML = '';

    connections.forEach((connection) => {
      const fromElement = document.getElementById(connection.from);
      const toElement = document.getElementById(connection.to);

      if (!fromElement || !toElement) return;

      const fromRect = fromElement.getBoundingClientRect();
      const toRect = toElement.getBoundingClientRect();
      const containerRect = containerRef.current!.getBoundingClientRect();

      const fromX = fromRect.left + fromRect.width / 2 - containerRect.left;
      const fromY = fromRect.top + fromRect.height / 2 - containerRect.top;
      const toX = toRect.left + toRect.width / 2 - containerRect.left;
      const toY = toRect.top + toRect.height / 2 - containerRect.top;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const controlX = (fromX + toX) / 2;
      const d = `M ${fromX} ${fromY} Q ${controlX} ${fromY}, ${controlX} ${toY} T ${toX} ${toY}`;

      path.setAttribute('d', d);
      path.setAttribute('stroke', platform.color);
      path.setAttribute('stroke-width', String(connection.strength * 2));
      path.setAttribute('stroke-opacity', String(connection.strength * 0.5));
      path.setAttribute('fill', 'none');
      path.setAttribute('class', 'connection-path');

      // Highlight connections on hover
      if (
        (selectedPrompt && connection.from === `prompt-${selectedPrompt}`) ||
        (selectedContent && connection.from === `content-${selectedContent}`)
      ) {
        path.setAttribute('stroke-opacity', '1');
        path.setAttribute('stroke-width', '3');
      }

      svg.appendChild(path);
    });
  }, [connections, selectedPrompt, selectedContent, platform.color]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P0':
        return '#EF4444';
      case 'P1':
        return '#F97316';
      case 'P2':
        return '#EAB308';
      case 'P3':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={onBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" fontWeight="bold">
            {platform.name} Optimization Details
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Interactive content mapping and citation tracking
          </Typography>
        </Box>
        <Chip
          label={`${platform.citationRate}% Citation Rate`}
          sx={{
            backgroundColor: `${platform.color}20`,
            color: platform.color,
            fontWeight: 700,
            fontSize: '1rem',
            px: 2,
            py: 1,
          }}
        />
      </Box>

      {/* Optimization Strategies */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Optimization Strategies
        </Typography>
        <Grid container spacing={2}>
          {platform.optimization.map((opt, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                variant="outlined"
                sx={{
                  borderColor:
                    opt.priority === 'HIGH'
                      ? 'error.main'
                      : opt.priority === 'MEDIUM'
                      ? 'warning.main'
                      : 'info.main',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PsychologyIcon sx={{ color: platform.color, mr: 1 }} />
                    <Typography variant="subtitle1" fontWeight="bold">
                      {opt.focus}
                    </Typography>
                  </Box>
                  <Chip
                    label={opt.priority}
                    size="small"
                    color={
                      opt.priority === 'HIGH'
                        ? 'error'
                        : opt.priority === 'MEDIUM'
                        ? 'warning'
                        : 'info'
                    }
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {opt.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Interactive Three-Layer Visualization */}
      <Paper elevation={2} sx={{ p: 3, position: 'relative' }} ref={containerRef}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Content Connection Map
        </Typography>

        {/* SVG Layer for connections */}
        <svg
          ref={svgRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        <Grid container spacing={4} sx={{ position: 'relative', zIndex: 2 }}>
          {/* Prompts Layer */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <PsychologyIcon sx={{ color: platform.color, mr: 1 }} />
              <Typography variant="subtitle1" fontWeight="bold">
                Tracked Prompts ({platform.prompts.length})
              </Typography>
            </Box>
            <List>
              {platform.prompts.map((prompt) => (
                <ListItem
                  key={prompt.id}
                  id={`prompt-${prompt.id}`}
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor:
                      selectedPrompt === prompt.id ? platform.color : 'grey.300',
                    backgroundColor:
                      selectedPrompt === prompt.id ? `${platform.color}10` : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: `${platform.color}05`,
                    },
                  }}
                  onClick={() => setSelectedPrompt(prompt.id)}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {prompt.text}
                        </Typography>
                        <Chip
                          label={prompt.priority}
                          size="small"
                          sx={{
                            backgroundColor: getPriorityColor(prompt.priority),
                            color: 'white',
                            height: 20,
                            fontSize: '0.7rem',
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          {prompt.category}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          •
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Vol: {prompt.searchVolume.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          •
                        </Typography>
                        <Typography variant="caption" fontWeight="bold">
                          GEO: {prompt.geoScore}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Content Layer */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <ArticleIcon sx={{ color: platform.color, mr: 1 }} />
              <Typography variant="subtitle1" fontWeight="bold">
                Optimized Content ({platform.contents.length})
              </Typography>
            </Box>
            <List>
              {platform.contents.map((content) => (
                <ListItem
                  key={content.id}
                  id={`content-${content.id}`}
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor:
                      selectedContent === content.id ? platform.color : 'grey.300',
                    backgroundColor:
                      selectedContent === content.id ? `${platform.color}10` : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: `${platform.color}05`,
                    },
                  }}
                  onClick={() => setSelectedContent(content.id)}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {content.title}
                        </Typography>
                        <Tooltip title="Citation Strength">
                          <Badge
                            badgeContent={content.citationStrength}
                            color="primary"
                            sx={{
                              '& .MuiBadge-badge': {
                                backgroundColor: platform.color,
                              },
                            }}
                          />
                        </Tooltip>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          {content.type}
                        </Typography>
                        {content.platforms.length > 1 && (
                          <Chip
                            label={`${content.platforms.length} platforms`}
                            size="small"
                            sx={{ ml: 1, height: 16, fontSize: '0.65rem' }}
                          />
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Citations Layer */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <CitationIcon sx={{ color: platform.color, mr: 1 }} />
              <Typography variant="subtitle1" fontWeight="bold">
                Active Citations ({platform.citations.length})
              </Typography>
            </Box>
            <List>
              {platform.citations.map((citation) => (
                <ListItem
                  key={citation.id}
                  id={`citation-${citation.id}`}
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'grey.300',
                    backgroundColor: 'white',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: `${platform.color}05`,
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {citation.platform}
                        </Typography>
                        <Chip
                          label={citation.strength}
                          size="small"
                          color={
                            citation.strength === 'Strong'
                              ? 'success'
                              : citation.strength === 'Medium'
                              ? 'warning'
                              : 'default'
                          }
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {citation.date}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Paper>

      {/* Performance Metrics */}
      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Performance Metrics
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(platform.metrics).map(([key, value]) => (
            <Grid item xs={6} md={2} key={key}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    border: `4px solid ${platform.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 1,
                  }}
                >
                  <Typography variant="h5" fontWeight="bold" sx={{ color: platform.color }}>
                    {value}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {key
                    .replace(/([A-Z])/g, ' $1')
                    .trim()
                    .split(' ')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default PlatformDetail;