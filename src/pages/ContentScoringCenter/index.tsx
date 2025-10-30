import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Chip,
  Alert,
  Tab,
  Tabs,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Rating,
  Stack,
  Divider,
  Badge,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Science as ScienceIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Visibility as VisibilityIcon,
  FormatQuote as QuoteIcon,
  Link as LinkIcon,
  LocalOffer as TagIcon,
  Psychology as AIIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';

interface ContentItem {
  id: string;
  title: string;
  type: string;
  lastScored: string;
  citationScore: number;
  evidenceScore: number;
  credibilityScore: number;
  freshnessScore: number;
  overallScore: number;
  status: 'ready' | 'scoring' | 'needs_review' | 'published';
  platforms: string[];
  issues: string[];
}

interface ScoringMetric {
  name: string;
  score: number;
  weight: number;
  description: string;
  status: 'good' | 'warning' | 'error';
  recommendations: string[];
}

interface PlatformScore {
  platform: string;
  score: number;
  indexed: boolean;
  ranking: number;
  lastChecked: string;
}

export default function ContentScoringCenter() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [contentItems, setContentItems] = useState<ContentItem[]>([
    {
      id: 'content-001',
      title: 'Complete Guide to AI Content Generation',
      type: 'Blog Article',
      lastScored: '2 hours ago',
      citationScore: 92,
      evidenceScore: 88,
      credibilityScore: 95,
      freshnessScore: 100,
      overallScore: 94,
      status: 'published',
      platforms: ['Google', 'Bing', 'YouTube'],
      issues: [],
    },
    {
      id: 'content-002',
      title: 'MCP Integration Tutorial',
      type: 'Technical Guide',
      lastScored: '5 hours ago',
      citationScore: 78,
      evidenceScore: 72,
      credibilityScore: 85,
      freshnessScore: 90,
      overallScore: 81,
      status: 'ready',
      platforms: ['Google', 'GitHub'],
      issues: ['Missing citations', 'Outdated references'],
    },
    {
      id: 'content-003',
      title: 'Product Comparison: AI Tools 2024',
      type: 'Comparison Article',
      lastScored: 'Scoring...',
      citationScore: 0,
      evidenceScore: 0,
      credibilityScore: 0,
      freshnessScore: 0,
      overallScore: 0,
      status: 'scoring',
      platforms: [],
      issues: [],
    },
    {
      id: 'content-004',
      title: 'Customer Success Stories',
      type: 'Case Study',
      lastScored: '1 day ago',
      citationScore: 65,
      evidenceScore: 60,
      credibilityScore: 70,
      freshnessScore: 75,
      overallScore: 68,
      status: 'needs_review',
      platforms: ['LinkedIn'],
      issues: ['Low evidence score', 'Needs more citations', 'Update statistics'],
    },
  ]);

  const [scoringMetrics, setScoringMetrics] = useState<ScoringMetric[]>([
    {
      name: 'Citation Quality',
      score: 85,
      weight: 0.3,
      description: 'Quality and quantity of citations from authoritative sources',
      status: 'good',
      recommendations: ['Add 2-3 more academic sources', 'Include recent industry reports'],
    },
    {
      name: 'Evidence Support',
      score: 72,
      weight: 0.25,
      description: 'Factual backing and data support for claims',
      status: 'warning',
      recommendations: ['Add statistical evidence', 'Include case study results'],
    },
    {
      name: 'Source Credibility',
      score: 90,
      weight: 0.2,
      description: 'Authority and trustworthiness of referenced sources',
      status: 'good',
      recommendations: [],
    },
    {
      name: 'Content Freshness',
      score: 95,
      weight: 0.15,
      description: 'Recency of information and last update date',
      status: 'good',
      recommendations: [],
    },
    {
      name: 'Claim Validation',
      score: 68,
      weight: 0.1,
      description: 'Verification of key claims against knowledge graph',
      status: 'warning',
      recommendations: ['Verify technical specifications', 'Cross-reference competitor claims'],
    },
  ]);

  const platformScores: PlatformScore[] = [
    { platform: 'Google SGE', score: 92, indexed: true, ranking: 3, lastChecked: '1 hour ago' },
    { platform: 'Bing Chat', score: 88, indexed: true, ranking: 5, lastChecked: '2 hours ago' },
    { platform: 'Perplexity', score: 85, indexed: true, ranking: 7, lastChecked: '3 hours ago' },
    { platform: 'ChatGPT', score: 78, indexed: false, ranking: 0, lastChecked: '4 hours ago' },
    { platform: 'Claude', score: 90, indexed: true, ranking: 4, lastChecked: '1 hour ago' },
    { platform: 'YouTube AI', score: 82, indexed: true, ranking: 8, lastChecked: '5 hours ago' },
    { platform: 'GitHub Copilot', score: 75, indexed: false, ranking: 0, lastChecked: '6 hours ago' },
  ];

  const handleScoreContent = (contentId: string) => {
    setContentItems((prev) =>
      prev.map((item) =>
        item.id === contentId ? { ...item, status: 'scoring' } : item
      )
    );

    // Simulate scoring process
    setTimeout(() => {
      setContentItems((prev) =>
        prev.map((item) =>
          item.id === contentId
            ? {
                ...item,
                status: 'ready',
                citationScore: Math.floor(Math.random() * 30 + 70),
                evidenceScore: Math.floor(Math.random() * 30 + 70),
                credibilityScore: Math.floor(Math.random() * 30 + 70),
                freshnessScore: Math.floor(Math.random() * 30 + 70),
                overallScore: Math.floor(Math.random() * 30 + 70),
                lastScored: 'Just now',
                platforms: ['Google', 'Bing', 'Perplexity'],
              }
            : item
        )
      );
    }, 3000);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckIcon sx={{ color: '#10B981' }} />;
      case 'scoring':
        return <CircularProgress size={20} />;
      case 'needs_review':
        return <WarningIcon sx={{ color: '#F59E0B' }} />;
      default:
        return <AssessmentIcon />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Content Scoring Center
          </Typography>
          <Typography variant="body1" color="text.secondary">
            AI-powered citation scoring and E-E-A-T optimization
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button startIcon={<UploadIcon />} variant="outlined">
            Import Content
          </Button>
          <Button startIcon={<RefreshIcon />} variant="contained">
            Rescore All
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary" variant="subtitle2">
                  Average Score
                </Typography>
                <AssessmentIcon sx={{ color: '#6366F1' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                81.5
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon sx={{ fontSize: 16, color: '#10B981', mr: 0.5 }} />
                <Typography variant="caption" sx={{ color: '#10B981' }}>
                  +5.2% from last week
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary" variant="subtitle2">
                  Citation Ready
                </Typography>
                <CheckIcon sx={{ color: '#10B981' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                75%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                15 of 20 contents
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary" variant="subtitle2">
                  Platform Coverage
                </Typography>
                <LanguageIcon sx={{ color: '#8B5CF6' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                7/7
              </Typography>
              <Typography variant="caption" color="text.secondary">
                All platforms indexed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary" variant="subtitle2">
                  Needs Review
                </Typography>
                <WarningIcon sx={{ color: '#F59E0B' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                3
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Contents below threshold
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Content List */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Content Library</Typography>
              <IconButton size="small">
                <FilterIcon />
              </IconButton>
            </Box>

            <List>
              {contentItems.map((item) => (
                <ListItem
                  key={item.id}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 2,
                    cursor: 'pointer',
                    bgcolor: selectedContent?.id === item.id ? 'action.selected' : 'transparent',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                  onClick={() => setSelectedContent(item)}
                >
                  <ListItemIcon>{getStatusIcon(item.status)}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2">{item.title}</Typography>
                        <Chip label={item.type} size="small" />
                        {item.status === 'scoring' && (
                          <Chip label="Scoring..." size="small" color="warning" />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="caption">Citation Score</Typography>
                              <Typography variant="caption" sx={{ color: getScoreColor(item.citationScore) }}>
                                {item.status === 'scoring' ? '...' : `${item.citationScore}/100`}
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant={item.status === 'scoring' ? 'indeterminate' : 'determinate'}
                              value={item.citationScore}
                              sx={{
                                height: 6,
                                borderRadius: 1,
                                bgcolor: 'grey.200',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: getScoreColor(item.citationScore),
                                },
                              }}
                            />
                          </Box>
                          <Box sx={{ minWidth: 80 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                color: getScoreColor(item.overallScore),
                                fontWeight: 600,
                                textAlign: 'center',
                              }}
                            >
                              {item.status === 'scoring' ? '...' : item.overallScore}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
                              Overall
                            </Typography>
                          </Box>
                        </Box>

                        {item.issues.length > 0 && (
                          <Box sx={{ mt: 1, display: 'flex', gap: 0.5 }}>
                            {item.issues.map((issue) => (
                              <Chip
                                key={issue}
                                label={issue}
                                size="small"
                                color="warning"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        )}

                        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            Last scored: {item.lastScored}
                          </Typography>
                          <Button
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleScoreContent(item.id);
                            }}
                            disabled={item.status === 'scoring'}
                          >
                            {item.status === 'scoring' ? 'Scoring...' : 'Rescore'}
                          </Button>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Scoring Details */}
        <Grid item xs={12} md={4}>
          {/* Scoring Metrics */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Scoring Metrics
            </Typography>
            {scoringMetrics.map((metric) => (
              <Box key={metric.name} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="subtitle2">{metric.name}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: getScoreColor(metric.score) }}
                    >
                      {metric.score}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ({Math.round(metric.weight * 100)}% weight)
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={metric.score}
                  sx={{
                    height: 4,
                    borderRadius: 1,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: getScoreColor(metric.score),
                    },
                  }}
                />
                {metric.recommendations.length > 0 && (
                  <Box sx={{ mt: 0.5 }}>
                    {metric.recommendations.map((rec, index) => (
                      <Typography key={index} variant="caption" color="text.secondary" display="block">
                        • {rec}
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Paper>

          {/* Platform Performance */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Platform Performance
            </Typography>
            <List dense>
              {platformScores.map((platform) => (
                <ListItem key={platform.platform} sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2">{platform.platform}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {platform.indexed && (
                            <Chip
                              label={`#${platform.ranking}`}
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          )}
                          <Typography
                            variant="subtitle2"
                            sx={{ color: getScoreColor(platform.score) }}
                          >
                            {platform.score}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Chip
                          label={platform.indexed ? 'Indexed' : 'Not Indexed'}
                          size="small"
                          color={platform.indexed ? 'success' : 'default'}
                          sx={{ height: 20 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Checked {platform.lastChecked}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* E-E-A-T Analysis Section */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          E-E-A-T Analysis
        </Typography>
        <Grid container spacing={3}>
          {[
            { label: 'Experience', score: 88, icon: <ScienceIcon />, color: '#6366F1' },
            { label: 'Expertise', score: 92, icon: <AIIcon />, color: '#8B5CF6' },
            { label: 'Authoritativeness', score: 85, icon: <SecurityIcon />, color: '#EC4899' },
            { label: 'Trustworthiness', score: 90, icon: <CheckIcon />, color: '#10B981' },
          ].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.label}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ color: item.color, mb: 1 }}>{item.icon}</Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  {item.label}
                </Typography>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <CircularProgress
                    variant="determinate"
                    value={item.score}
                    size={80}
                    thickness={4}
                    sx={{
                      color: item.color,
                      '& .MuiCircularProgress-circle': {
                        strokeLinecap: 'round',
                      },
                    }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                      {item.score}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}