import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from '@mui/material';
import {
  GridOn as CoverageIcon,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Remove,
} from '@mui/icons-material';
import type { PLevel } from '@/types/roadmap.types';

interface CoverageData {
  promptId: string;
  prompt: string;
  pLevel: PLevel;
  month: string;
  coverageStatus: 'covered' | 'partial' | 'uncovered';
  contentCount: number;
  channels: string[];
  geoScore: number;
}

// Mock coverage data
const mockCoverageData: CoverageData[] = [
  { promptId: '1', prompt: 'Best mattress for back pain relief', pLevel: 'P0', month: '2025-09', coverageStatus: 'covered', contentCount: 5, channels: ['YouTube', 'Blog', 'Reddit', 'Medium', 'Amazon'], geoScore: 92 },
  { promptId: '2', prompt: 'Memory foam vs spring mattress comparison', pLevel: 'P0', month: '2025-09', coverageStatus: 'covered', contentCount: 4, channels: ['YouTube', 'Blog', 'Quora', 'Medium'], geoScore: 90 },
  { promptId: '3', prompt: 'Cooling mattress for hot sleepers', pLevel: 'P0', month: '2025-09', coverageStatus: 'partial', contentCount: 2, channels: ['YouTube', 'Blog'], geoScore: 88 },
  { promptId: '4', prompt: 'Mattress for side sleepers with shoulder pain', pLevel: 'P0', month: '2025-10', coverageStatus: 'uncovered', contentCount: 0, channels: [], geoScore: 91 },

  { promptId: '5', prompt: 'How to clean a memory foam mattress', pLevel: 'P1', month: '2025-09', coverageStatus: 'covered', contentCount: 3, channels: ['Blog', 'Reddit', 'Quora'], geoScore: 78 },
  { promptId: '6', prompt: 'Mattress firmness guide', pLevel: 'P1', month: '2025-09', coverageStatus: 'partial', contentCount: 2, channels: ['Blog', 'Medium'], geoScore: 82 },
  { promptId: '7', prompt: 'Best mattress topper for comfort', pLevel: 'P1', month: '2025-10', coverageStatus: 'uncovered', contentCount: 0, channels: [], geoScore: 76 },
  { promptId: '8', prompt: 'Mattress size comparison chart', pLevel: 'P1', month: '2025-10', coverageStatus: 'covered', contentCount: 2, channels: ['Blog', 'LinkedIn'], geoScore: 80 },
  { promptId: '9', prompt: 'Organic mattress benefits', pLevel: 'P1', month: '2025-11', coverageStatus: 'partial', contentCount: 1, channels: ['Blog'], geoScore: 79 },

  { promptId: '10', prompt: 'Mattress warranty coverage explained', pLevel: 'P2', month: '2025-10', coverageStatus: 'uncovered', contentCount: 0, channels: [], geoScore: 65 },
  { promptId: '11', prompt: 'How long does a mattress last', pLevel: 'P2', month: '2025-10', coverageStatus: 'partial', contentCount: 1, channels: ['Blog'], geoScore: 68 },
  { promptId: '12', prompt: 'Mattress delivery and setup process', pLevel: 'P2', month: '2025-11', coverageStatus: 'uncovered', contentCount: 0, channels: [], geoScore: 62 },
  { promptId: '13', prompt: 'Mattress protector buying guide', pLevel: 'P2', month: '2025-11', coverageStatus: 'covered', contentCount: 2, channels: ['Amazon', 'Blog'], geoScore: 70 },
  { promptId: '14', prompt: 'Mattress trial period policies', pLevel: 'P2', month: '2025-11', coverageStatus: 'uncovered', contentCount: 0, channels: [], geoScore: 67 },

  { promptId: '15', prompt: 'Mattress recycling options', pLevel: 'P3', month: '2025-11', coverageStatus: 'uncovered', contentCount: 0, channels: [], geoScore: 45 },
  { promptId: '16', prompt: 'History of mattress manufacturing', pLevel: 'P3', month: '2025-12', coverageStatus: 'uncovered', contentCount: 0, channels: [], geoScore: 42 },
  { promptId: '17', prompt: 'Mattress materials sourcing', pLevel: 'P3', month: '2025-12', coverageStatus: 'uncovered', contentCount: 0, channels: [], geoScore: 48 },
  { promptId: '18', prompt: 'Custom mattress design services', pLevel: 'P3', month: '2025-12', coverageStatus: 'partial', contentCount: 1, channels: ['Blog'], geoScore: 50 },
];

const pLevelColors: Record<PLevel, string> = {
  P0: '#10B981',
  P1: '#3B82F6',
  P2: '#F59E0B',
  P3: '#94A3B8',
};

const coverageStatusConfig = {
  covered: {
    label: 'Covered',
    color: '#10B981',
    icon: <CheckCircle sx={{ fontSize: 18 }} />,
    bgColor: '#10B98115',
  },
  partial: {
    label: 'Partial',
    color: '#F59E0B',
    icon: <Warning sx={{ fontSize: 18 }} />,
    bgColor: '#F59E0B15',
  },
  uncovered: {
    label: 'Uncovered',
    color: '#EF4444',
    icon: <ErrorIcon sx={{ fontSize: 18 }} />,
    bgColor: '#EF444415',
  },
};

export default function ContentCoverage() {
  const [filterPLevel, setFilterPLevel] = useState<PLevel | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'covered' | 'partial' | 'uncovered'>('all');

  // Filter data
  const filteredData = mockCoverageData.filter((item) => {
    const pLevelMatch = filterPLevel === 'all' || item.pLevel === filterPLevel;
    const statusMatch = filterStatus === 'all' || item.coverageStatus === filterStatus;
    return pLevelMatch && statusMatch;
  });

  // Calculate stats
  const stats = {
    total: mockCoverageData.length,
    covered: mockCoverageData.filter((i) => i.coverageStatus === 'covered').length,
    partial: mockCoverageData.filter((i) => i.coverageStatus === 'partial').length,
    uncovered: mockCoverageData.filter((i) => i.coverageStatus === 'uncovered').length,
    coverageRate: (mockCoverageData.filter((i) => i.coverageStatus === 'covered').length / mockCoverageData.length) * 100,
    byPLevel: {
      P0: {
        total: mockCoverageData.filter((i) => i.pLevel === 'P0').length,
        covered: mockCoverageData.filter((i) => i.pLevel === 'P0' && i.coverageStatus === 'covered').length,
      },
      P1: {
        total: mockCoverageData.filter((i) => i.pLevel === 'P1').length,
        covered: mockCoverageData.filter((i) => i.pLevel === 'P1' && i.coverageStatus === 'covered').length,
      },
      P2: {
        total: mockCoverageData.filter((i) => i.pLevel === 'P2').length,
        covered: mockCoverageData.filter((i) => i.pLevel === 'P2' && i.coverageStatus === 'covered').length,
      },
      P3: {
        total: mockCoverageData.filter((i) => i.pLevel === 'P3').length,
        covered: mockCoverageData.filter((i) => i.pLevel === 'P3' && i.coverageStatus === 'covered').length,
      },
    },
  };

  // Priority gaps (uncovered high-priority prompts)
  const priorityGaps = mockCoverageData
    .filter((i) => (i.pLevel === 'P0' || i.pLevel === 'P1') && i.coverageStatus === 'uncovered')
    .sort((a, b) => b.geoScore - a.geoScore);

  return (
    <Box>
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
              bgcolor: '#10B98115',
              color: '#10B981',
            }}
          >
            <CoverageIcon fontSize="large" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" component="h1" fontWeight={600}>
              Content Coverage
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Heatmap Visualization with Gap Analysis
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
                Coverage Rate
              </Typography>
              <Typography variant="h4" component="div" fontWeight={700} sx={{ color: '#10B981' }}>
                {stats.coverageRate.toFixed(0)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Fully Covered
              </Typography>
              <Typography variant="h4" component="div" fontWeight={700} sx={{ color: '#10B981' }}>
                {stats.covered}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Critical Gaps
              </Typography>
              <Typography variant="h4" component="div" fontWeight={700} sx={{ color: '#EF4444' }}>
                {priorityGaps.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* P-Level Coverage Breakdown */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Coverage by Priority Level
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Completion rate for each priority tier
        </Typography>
        <Grid container spacing={3}>
          {(Object.keys(stats.byPLevel) as PLevel[]).map((level) => {
            const data = stats.byPLevel[level];
            const rate = data.total > 0 ? (data.covered / data.total) * 100 : 0;
            return (
              <Grid item xs={12} md={6} key={level}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: pLevelColors[level],
                        }}
                      />
                      <Typography variant="body2" fontWeight={600}>
                        {level}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {data.covered}/{data.total} ({rate.toFixed(0)}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={rate}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: `${pLevelColors[level]}20`,
                      '& .MuiLinearProgress-bar': {
                        bgcolor: pLevelColors[level],
                      },
                    }}
                  />
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Paper>

      {/* Priority Gaps Alert */}
      {priorityGaps.length > 0 && (
        <Paper sx={{ p: 3, mb: 4, bgcolor: '#FEF2F2', border: '1px solid #FCA5A5' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <ErrorIcon sx={{ color: '#EF4444', fontSize: 32 }} />
            <Box>
              <Typography variant="h6" fontWeight={600} sx={{ color: '#B91C1C' }}>
                {priorityGaps.length} High-Priority Gaps Detected
              </Typography>
              <Typography variant="body2" color="text.secondary">
                These P0/P1 prompts require immediate content creation
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {priorityGaps.slice(0, 5).map((gap) => (
              <Chip
                key={gap.promptId}
                label={gap.prompt}
                size="small"
                sx={{
                  bgcolor: pLevelColors[gap.pLevel],
                  color: 'white',
                  fontWeight: 600,
                }}
              />
            ))}
            {priorityGaps.length > 5 && (
              <Chip
                label={`+${priorityGaps.length - 5} more`}
                size="small"
                sx={{ bgcolor: '#94A3B8', color: 'white' }}
              />
            )}
          </Box>
        </Paper>
      )}

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
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
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="P0">P0</ToggleButton>
              <ToggleButton value="P1">P1</ToggleButton>
              <ToggleButton value="P2">P2</ToggleButton>
              <ToggleButton value="P3">P3</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              Filter by Coverage Status
            </Typography>
            <ToggleButtonGroup
              value={filterStatus}
              exclusive
              onChange={(_, newValue) => newValue && setFilterStatus(newValue)}
              size="small"
              fullWidth
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="covered">Covered</ToggleButton>
              <ToggleButton value="partial">Partial</ToggleButton>
              <ToggleButton value="uncovered">Gaps</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Paper>

      {/* Coverage Table */}
      <Paper>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Coverage Details ({filteredData.length} prompts)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Detailed coverage status for each prompt
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="5%">P-Level</TableCell>
                <TableCell width="35%">Prompt</TableCell>
                <TableCell width="10%">Month</TableCell>
                <TableCell width="10%">Status</TableCell>
                <TableCell width="10%">Content</TableCell>
                <TableCell width="20%">Channels</TableCell>
                <TableCell width="10%">GEO Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.promptId} hover>
                  <TableCell>
                    <Chip
                      label={row.pLevel}
                      size="small"
                      sx={{
                        bgcolor: pLevelColors[row.pLevel],
                        color: 'white',
                        fontWeight: 600,
                        width: 50,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {row.prompt}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {row.month}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={coverageStatusConfig[row.coverageStatus].icon}
                      label={coverageStatusConfig[row.coverageStatus].label}
                      size="small"
                      sx={{
                        bgcolor: coverageStatusConfig[row.coverageStatus].bgColor,
                        color: coverageStatusConfig[row.coverageStatus].color,
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {row.contentCount} {row.contentCount === 1 ? 'piece' : 'pieces'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {row.channels.length > 0 ? (
                        row.channels.map((channel) => (
                          <Chip key={channel} label={channel} size="small" variant="outlined" />
                        ))
                      ) : (
                        <Chip
                          icon={<Remove sx={{ fontSize: 14 }} />}
                          label="None"
                          size="small"
                          sx={{ color: '#94A3B8' }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {row.geoScore}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
