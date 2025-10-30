import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  CompareArrows as CompareArrowsIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadarController,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { platformsData } from '../../../data/geoStrategyData';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadarController,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ComparisonPageProps {
  onBack: () => void;
}

const ComparisonPage: React.FC<ComparisonPageProps> = ({ onBack }) => {
  const [selectedMetric, setSelectedMetric] = useState<'performance' | 'coverage' | 'engagement'>('performance');
  const platforms = Object.values(platformsData);

  // Radar chart data for platform comparison
  const radarData = {
    labels: ['Content Quality', 'Citation Rate', 'Platform Coverage', 'Keyword Match', 'User Engagement', 'Technical SEO'],
    datasets: platforms.map(platform => ({
      label: platform.name,
      data: [
        platform.metrics.contentQuality,
        platform.metrics.citationRate,
        platform.metrics.platformCoverage,
        platform.metrics.keywordMatch,
        platform.metrics.userEngagement,
        platform.metrics.technicalSEO,
      ],
      backgroundColor: `${platform.color}20`,
      borderColor: platform.color,
      borderWidth: 2,
      pointBackgroundColor: platform.color,
    })),
  };

  // Bar chart data for citation rates
  const barData = {
    labels: platforms.map(p => p.name),
    datasets: [
      {
        label: 'Citation Rate (%)',
        data: platforms.map(p => p.citationRate),
        backgroundColor: platforms.map(p => `${p.color}80`),
        borderColor: platforms.map(p => p.color),
        borderWidth: 2,
      },
    ],
  };

  // Line chart data for trend analysis
  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: platforms.map(platform => ({
      label: platform.name,
      data: [
        Math.random() * 20 + 30,
        Math.random() * 20 + 35,
        Math.random() * 20 + 40,
        Math.random() * 20 + 42,
        Math.random() * 20 + 45,
        platform.citationRate,
      ],
      borderColor: platform.color,
      backgroundColor: `${platform.color}20`,
      tension: 0.4,
    })),
  };

  const getMetricComparison = () => {
    switch (selectedMetric) {
      case 'performance':
        return platforms.map(p => ({
          name: p.name,
          citationRate: p.citationRate,
          contentQuality: p.metrics.contentQuality,
          technicalSEO: p.metrics.technicalSEO,
        }));
      case 'coverage':
        return platforms.map(p => ({
          name: p.name,
          prompts: p.prompts.length,
          contents: p.contents.length,
          coverage: Math.round((p.contents.length / p.prompts.length) * 100),
        }));
      case 'engagement':
        return platforms.map(p => ({
          name: p.name,
          userEngagement: p.metrics.userEngagement,
          keywordMatch: p.metrics.keywordMatch,
          citations: p.citations.length,
        }));
      default:
        return [];
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ mr: 2 }}
        >
          Back to Overview
        </Button>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" fontWeight="bold">
            Cross-Platform Comparison Analysis
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Compare performance metrics across ChatGPT, Google AIO, and Amazon Rufus
          </Typography>
        </Box>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {platforms.map(platform => (
          <Grid item xs={12} md={4} key={platform.id}>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${platform.color}20, ${platform.color}05)`,
                borderLeft: `4px solid ${platform.color}`,
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {platform.name}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Citation Rate
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: platform.color }}>
                    {platform.citationRate}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={platform.citationRate}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: platform.color,
                    },
                  }}
                />
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Chip
                    label={`${platform.prompts.length} Prompts`}
                    size="small"
                    sx={{ fontSize: '0.75rem' }}
                  />
                  <Chip
                    label={`${platform.contents.length} Contents`}
                    size="small"
                    sx={{ fontSize: '0.75rem' }}
                  />
                  <Chip
                    label={`${platform.citations.length} Citations`}
                    size="small"
                    sx={{ fontSize: '0.75rem' }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Comparison Charts */}
      <Grid container spacing={3}>
        {/* Radar Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Multi-Dimensional Comparison
            </Typography>
            <Box sx={{ height: 350 }}>
              <Chart
                type="radar"
                data={radarData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        stepSize: 20,
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Citation Rate Comparison
            </Typography>
            <Box sx={{ height: 350 }}>
              <Chart
                type="bar"
                data={barData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 60,
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Trend Analysis */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Citation Rate Trends (6 Week Period)
            </Typography>
            <Box sx={{ height: 300 }}>
              <Chart
                type="line"
                data={lineData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 60,
                      title: {
                        display: true,
                        text: 'Citation Rate (%)',
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Detailed Metrics Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                Detailed Metrics Comparison
              </Typography>
              <ToggleButtonGroup
                value={selectedMetric}
                exclusive
                onChange={(_, value) => value && setSelectedMetric(value)}
                size="small"
              >
                <ToggleButton value="performance">
                  <TrendingUpIcon sx={{ mr: 1 }} fontSize="small" />
                  Performance
                </ToggleButton>
                <ToggleButton value="coverage">
                  <AssessmentIcon sx={{ mr: 1 }} fontSize="small" />
                  Coverage
                </ToggleButton>
                <ToggleButton value="engagement">
                  <CompareArrowsIcon sx={{ mr: 1 }} fontSize="small" />
                  Engagement
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Platform</strong></TableCell>
                    {selectedMetric === 'performance' && (
                      <>
                        <TableCell align="center"><strong>Citation Rate</strong></TableCell>
                        <TableCell align="center"><strong>Content Quality</strong></TableCell>
                        <TableCell align="center"><strong>Technical SEO</strong></TableCell>
                      </>
                    )}
                    {selectedMetric === 'coverage' && (
                      <>
                        <TableCell align="center"><strong>Total Prompts</strong></TableCell>
                        <TableCell align="center"><strong>Content Created</strong></TableCell>
                        <TableCell align="center"><strong>Coverage Rate</strong></TableCell>
                      </>
                    )}
                    {selectedMetric === 'engagement' && (
                      <>
                        <TableCell align="center"><strong>User Engagement</strong></TableCell>
                        <TableCell align="center"><strong>Keyword Match</strong></TableCell>
                        <TableCell align="center"><strong>Total Citations</strong></TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getMetricComparison().map((row: any) => (
                    <TableRow key={row.name}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor: platforms.find(p => p.name === row.name)?.color,
                            }}
                          />
                          {row.name}
                        </Box>
                      </TableCell>
                      {selectedMetric === 'performance' && (
                        <>
                          <TableCell align="center">
                            <Chip
                              label={`${row.citationRate}%`}
                              size="small"
                              sx={{
                                backgroundColor: `${platforms.find(p => p.name === row.name)?.color}20`,
                                color: platforms.find(p => p.name === row.name)?.color,
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">{row.contentQuality}</TableCell>
                          <TableCell align="center">{row.technicalSEO}</TableCell>
                        </>
                      )}
                      {selectedMetric === 'coverage' && (
                        <>
                          <TableCell align="center">{row.prompts}</TableCell>
                          <TableCell align="center">{row.contents}</TableCell>
                          <TableCell align="center">
                            <LinearProgress
                              variant="determinate"
                              value={row.coverage}
                              sx={{
                                height: 20,
                                borderRadius: 10,
                                backgroundColor: 'grey.200',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: platforms.find(p => p.name === row.name)?.color,
                                },
                              }}
                            />
                            <Typography variant="caption">{row.coverage}%</Typography>
                          </TableCell>
                        </>
                      )}
                      {selectedMetric === 'engagement' && (
                        <>
                          <TableCell align="center">{row.userEngagement}</TableCell>
                          <TableCell align="center">{row.keywordMatch}</TableCell>
                          <TableCell align="center">{row.citations}</TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ComparisonPage;