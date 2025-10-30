import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import {
  SmartToy as ChatGPTIcon,
  SmartToy as SmartToyIcon,
  Search as GoogleIcon,
  ShoppingCart as AmazonIcon,
  CheckCircle as CheckIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import { platformsData } from '../../../data/geoStrategyData';

interface LandingPageProps {
  onSelectPlatform: (platformId: string) => void;
  onViewComparison: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSelectPlatform, onViewComparison }) => {
  const platforms = Object.values(platformsData);

  const getPlatformIcon = (platformId: string) => {
    switch (platformId) {
      case 'chatgpt':
        return <ChatGPTIcon sx={{ fontSize: 48 }} />;
      case 'googleAio':
        return <GoogleIcon sx={{ fontSize: 48 }} />;
      case 'amazonRufus':
        return <AmazonIcon sx={{ fontSize: 48 }} />;
      default:
        return <SmartToyIcon sx={{ fontSize: 48 }} />;
    }
  };

  const getOptimizationIcon = (focus: string) => {
    if (focus.includes('Schema') || focus.includes('Structured')) {
      return <PsychologyIcon fontSize="small" />;
    } else if (focus.includes('Content') || focus.includes('A+')) {
      return <TrendingUpIcon fontSize="small" />;
    } else {
      return <SpeedIcon fontSize="small" />;
    }
  };

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom fontWeight="bold">
          GEO Strategy Multi-Platform Optimization
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          AI Search Engine Optimization for SweetNight CoolNest Mattress Products
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={onViewComparison}
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: 'white',
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
            borderRadius: 3,
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #2196F3 60%, #21CBF3 100%)',
            },
          }}
        >
          View Cross-Platform Comparison
        </Button>
      </Box>

      {/* Platform Cards */}
      <Grid container spacing={4}>
        {platforms.map((platform) => (
          <Grid item xs={12} md={4} key={platform.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s',
                cursor: 'pointer',
                border: '2px solid transparent',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                  borderColor: platform.color,
                },
              }}
              onClick={() => onSelectPlatform(platform.id)}
            >
              <CardContent sx={{ flex: 1 }}>
                {/* Platform Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ color: platform.color, mr: 2 }}>
                    {getPlatformIcon(platform.id)}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" fontWeight="bold">
                      {platform.name}
                    </Typography>
                    <Chip
                      label={`${platform.citationRate}% Citation Rate`}
                      size="small"
                      sx={{
                        backgroundColor: `${platform.color}20`,
                        color: platform.color,
                        fontWeight: 600,
                        mt: 0.5,
                      }}
                    />
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {platform.description}
                </Typography>

                {/* Metrics Bar */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: 'grey.50',
                    borderRadius: 2,
                    mb: 3,
                  }}
                >
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Platform Performance
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Box sx={{ flex: 1, mr: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={platform.citationRate}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: platform.color,
                          },
                        }}
                      />
                    </Box>
                    <Typography variant="body2" fontWeight="bold">
                      {platform.citationRate}%
                    </Typography>
                  </Box>
                </Paper>

                {/* Key Strengths */}
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Key Strengths
                </Typography>
                <List dense sx={{ mb: 3 }}>
                  {platform.strengths.slice(0, 3).map((strength, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckIcon sx={{ fontSize: 16, color: platform.color }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={strength}
                        primaryTypographyProps={{
                          variant: 'body2',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>

                {/* Optimization Focus */}
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Optimization Focus
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {platform.optimization.slice(0, 2).map((opt, index) => (
                    <Chip
                      key={index}
                      icon={getOptimizationIcon(opt.focus)}
                      label={opt.focus}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: platform.color,
                        color: platform.color,
                        '& .MuiChip-icon': {
                          color: platform.color,
                        },
                      }}
                    />
                  ))}
                </Box>

                {/* Stats Summary */}
                <Grid container spacing={1} sx={{ mt: 3 }}>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ color: platform.color }}
                      >
                        {platform.prompts.length}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Prompts
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ color: platform.color }}
                      >
                        {platform.contents.length}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Contents
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ color: platform.color }}
                      >
                        {platform.citations.length}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Citations
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    backgroundColor: platform.color,
                    '&:hover': {
                      backgroundColor: platform.color,
                      filter: 'brightness(0.9)',
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPlatform(platform.id);
                  }}
                >
                  View {platform.name} Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Overall Statistics */}
      <Paper
        elevation={2}
        sx={{
          mt: 5,
          p: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Overall Platform Statistics
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={6} md={3}>
            <Box>
              <Typography variant="h3" fontWeight="bold">
                {platforms.reduce((acc, p) => acc + p.prompts.length, 0)}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Total Tracked Prompts
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box>
              <Typography variant="h3" fontWeight="bold">
                {platforms.reduce((acc, p) => acc + p.contents.length, 0)}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Optimized Contents
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box>
              <Typography variant="h3" fontWeight="bold">
                {platforms.reduce((acc, p) => acc + p.citations.length, 0)}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Active Citations
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box>
              <Typography variant="h3" fontWeight="bold">
                {Math.round(
                  platforms.reduce((acc, p) => acc + p.citationRate, 0) /
                    platforms.length
                )}
                %
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Average Citation Rate
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default LandingPage;