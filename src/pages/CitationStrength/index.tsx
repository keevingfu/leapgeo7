import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  Link as MuiLink,
  Rating,
} from '@mui/material';
import {
  Star as StarIcon,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

type CitationStrength = 'direct' | 'referenced' | 'mentioned';
type Platform = 'YouTube' | 'Reddit' | 'Quora' | 'Medium' | 'Blog' | 'Amazon' | 'LinkedIn';

interface CitationData {
  citationId: string;
  contentId: string;
  platform: Platform;
  citationUrl: string;
  citationStrength: CitationStrength;
  prompt: string;
  dateDiscovered: string;
  aiIndexed: boolean;
}

// Mock citation data
const mockCitationData: CitationData[] = [
  {
    citationId: 'c1',
    contentId: 'cnt-001',
    platform: 'YouTube',
    citationUrl: 'https://youtube.com/watch?v=abc123',
    citationStrength: 'direct',
    prompt: 'Best mattress for back pain relief',
    dateDiscovered: '2025-01-05',
    aiIndexed: true,
  },
  {
    citationId: 'c2',
    contentId: 'cnt-002',
    platform: 'Reddit',
    citationUrl: 'https://reddit.com/r/mattress/comments/xyz',
    citationStrength: 'direct',
    prompt: 'Memory foam mattress comparison',
    dateDiscovered: '2025-01-06',
    aiIndexed: true,
  },
  {
    citationId: 'c3',
    contentId: 'cnt-003',
    platform: 'Medium',
    citationUrl: 'https://medium.com/@author/mattress-guide',
    citationStrength: 'referenced',
    prompt: 'Cooling mattress for hot sleepers',
    dateDiscovered: '2025-01-07',
    aiIndexed: true,
  },
  {
    citationId: 'c4',
    contentId: 'cnt-004',
    platform: 'Quora',
    citationUrl: 'https://quora.com/question/mattress-recommendation',
    citationStrength: 'referenced',
    prompt: 'Mattress for side sleepers',
    dateDiscovered: '2025-01-08',
    aiIndexed: false,
  },
  {
    citationId: 'c5',
    contentId: 'cnt-005',
    platform: 'Blog',
    citationUrl: 'https://sleepblog.com/mattress-reviews',
    citationStrength: 'mentioned',
    prompt: 'Affordable mattress options',
    dateDiscovered: '2025-01-09',
    aiIndexed: true,
  },
  {
    citationId: 'c6',
    contentId: 'cnt-006',
    platform: 'Amazon',
    citationUrl: 'https://amazon.com/product/B08XYZ',
    citationStrength: 'direct',
    prompt: 'Hybrid mattress reviews',
    dateDiscovered: '2025-01-10',
    aiIndexed: true,
  },
  {
    citationId: 'c7',
    contentId: 'cnt-007',
    platform: 'LinkedIn',
    citationUrl: 'https://linkedin.com/pulse/sleep-wellness',
    citationStrength: 'mentioned',
    prompt: 'Sleep quality improvement',
    dateDiscovered: '2025-01-11',
    aiIndexed: false,
  },
  {
    citationId: 'c8',
    contentId: 'cnt-008',
    platform: 'YouTube',
    citationUrl: 'https://youtube.com/watch?v=def456',
    citationStrength: 'referenced',
    prompt: 'Eco-friendly mattress guide',
    dateDiscovered: '2025-01-12',
    aiIndexed: true,
  },
  {
    citationId: 'c9',
    contentId: 'cnt-009',
    platform: 'Reddit',
    citationUrl: 'https://reddit.com/r/sleep/comments/abc',
    citationStrength: 'mentioned',
    prompt: 'Mattress durability test',
    dateDiscovered: '2025-01-13',
    aiIndexed: true,
  },
  {
    citationId: 'c10',
    contentId: 'cnt-010',
    platform: 'Medium',
    citationUrl: 'https://medium.com/@expert/sleep-science',
    citationStrength: 'direct',
    prompt: 'Best mattress brands 2025',
    dateDiscovered: '2025-01-14',
    aiIndexed: true,
  },
  {
    citationId: 'c11',
    contentId: 'cnt-011',
    platform: 'Quora',
    citationUrl: 'https://quora.com/question/mattress-comparison',
    citationStrength: 'direct',
    prompt: 'Mattress buying guide',
    dateDiscovered: '2025-01-15',
    aiIndexed: false,
  },
  {
    citationId: 'c12',
    contentId: 'cnt-012',
    platform: 'Blog',
    citationUrl: 'https://homeblog.com/bedroom-essentials',
    citationStrength: 'referenced',
    prompt: 'Bedroom setup guide',
    dateDiscovered: '2025-01-16',
    aiIndexed: true,
  },
];

// Citation strength configuration
const strengthConfig = {
  direct: {
    label: 'Direct ⭐⭐⭐',
    description: 'Direct citation with brand name + product mention',
    color: '#10B981',
    stars: 3,
  },
  referenced: {
    label: 'Referenced ⭐⭐',
    description: 'Brand mentioned in context/comparison',
    color: '#3B82F6',
    stars: 2,
  },
  mentioned: {
    label: 'Mentioned ⭐',
    description: 'Brief mention or keyword appearance',
    color: '#94A3B8',
    stars: 1,
  },
};

const platformColors: Record<Platform, string> = {
  YouTube: '#FF0000',
  Reddit: '#FF4500',
  Quora: '#B92B27',
  Medium: '#00AB6C',
  Blog: '#6366F1',
  Amazon: '#FF9900',
  LinkedIn: '#0A66C2',
};

export default function CitationStrength() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([
    'YouTube',
    'Reddit',
    'Quora',
    'Medium',
    'Blog',
    'Amazon',
    'LinkedIn',
  ]);
  const [selectedStrengths, setSelectedStrengths] = useState<CitationStrength[]>([
    'direct',
    'referenced',
    'mentioned',
  ]);

  const handlePlatformFilter = (_: React.MouseEvent<HTMLElement>, newPlatforms: Platform[]) => {
    if (newPlatforms.length > 0) {
      setSelectedPlatforms(newPlatforms);
    }
  };

  const handleStrengthFilter = (_: React.MouseEvent<HTMLElement>, newStrengths: CitationStrength[]) => {
    if (newStrengths.length > 0) {
      setSelectedStrengths(newStrengths);
    }
  };

  // Filter data
  const filteredData = mockCitationData.filter(
    (item) =>
      selectedPlatforms.includes(item.platform) &&
      selectedStrengths.includes(item.citationStrength)
  );

  // Calculate stats
  const stats = {
    total: filteredData.length,
    direct: filteredData.filter((i) => i.citationStrength === 'direct').length,
    referenced: filteredData.filter((i) => i.citationStrength === 'referenced').length,
    mentioned: filteredData.filter((i) => i.citationStrength === 'mentioned').length,
    aiIndexed: filteredData.filter((i) => i.aiIndexed).length,
  };

  // Prepare chart data
  const strengthDistributionData = [
    { name: 'Direct ⭐⭐⭐', value: stats.direct, color: strengthConfig.direct.color },
    { name: 'Referenced ⭐⭐', value: stats.referenced, color: strengthConfig.referenced.color },
    { name: 'Mentioned ⭐', value: stats.mentioned, color: strengthConfig.mentioned.color },
  ];

  const platformBreakdownData = (Object.keys(platformColors) as Platform[]).map((platform) => ({
    platform,
    direct: filteredData.filter((i) => i.platform === platform && i.citationStrength === 'direct')
      .length,
    referenced: filteredData.filter(
      (i) => i.platform === platform && i.citationStrength === 'referenced'
    ).length,
    mentioned: filteredData.filter(
      (i) => i.platform === platform && i.citationStrength === 'mentioned'
    ).length,
  }));

  const statsCards = [
    {
      title: 'Total Citations',
      value: stats.total,
      color: '#6366F1',
      description: 'All citation sources',
    },
    {
      title: 'Direct ⭐⭐⭐',
      value: stats.direct,
      color: strengthConfig.direct.color,
      description: 'Strongest citations',
    },
    {
      title: 'Referenced ⭐⭐',
      value: stats.referenced,
      color: strengthConfig.referenced.color,
      description: 'Contextual mentions',
    },
    {
      title: 'Mentioned ⭐',
      value: stats.mentioned,
      color: strengthConfig.mentioned.color,
      description: 'Brief mentions',
    },
  ];

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
              bgcolor: '#EC489915',
              color: '#EC4899',
            }}
          >
            <StarIcon fontSize="large" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" component="h1" fontWeight={600}>
              Citation Strength
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Three-tier citation analysis: Direct ⭐⭐⭐, Referenced ⭐⭐, Mentioned ⭐
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {stat.title}
                </Typography>
                <Typography
                  variant="h3"
                  component="div"
                  fontWeight={700}
                  sx={{ mb: 1, color: stat.color }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Platform Filter */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Filter by Platform
            </Typography>
            <ToggleButtonGroup
              value={selectedPlatforms}
              onChange={handlePlatformFilter}
              size="small"
              sx={{ flexWrap: 'wrap', gap: 1 }}
            >
              {(Object.keys(platformColors) as Platform[]).map((platform) => (
                <ToggleButton key={platform} value={platform}>
                  {platform}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Grid>

          {/* Strength Filter */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Filter by Citation Strength
            </Typography>
            <ToggleButtonGroup
              value={selectedStrengths}
              onChange={handleStrengthFilter}
              size="small"
            >
              <ToggleButton value="direct">Direct ⭐⭐⭐</ToggleButton>
              <ToggleButton value="referenced">Referenced ⭐⭐</ToggleButton>
              <ToggleButton value="mentioned">Mentioned ⭐</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Paper>

      {/* Charts Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Strength Distribution Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Citation Strength Distribution
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Distribution of citation types
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={strengthDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {strengthDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Platform Breakdown Bar Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Citation Strength by Platform
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Breakdown across all platforms
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={platformBreakdownData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="direct" stackId="a" fill={strengthConfig.direct.color} name="Direct ⭐⭐⭐" />
                <Bar
                  dataKey="referenced"
                  stackId="a"
                  fill={strengthConfig.referenced.color}
                  name="Referenced ⭐⭐"
                />
                <Bar
                  dataKey="mentioned"
                  stackId="a"
                  fill={strengthConfig.mentioned.color}
                  name="Mentioned ⭐"
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Citation Details Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Citation Details
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {filteredData.length} citations found
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Platform</TableCell>
                <TableCell>Citation Strength</TableCell>
                <TableCell>Prompt</TableCell>
                <TableCell>Citation URL</TableCell>
                <TableCell>Date Discovered</TableCell>
                <TableCell>AI Indexed</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.citationId} hover>
                  <TableCell>
                    <Chip
                      label={row.platform}
                      size="small"
                      sx={{
                        bgcolor: platformColors[row.platform],
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating
                        value={strengthConfig[row.citationStrength].stars}
                        max={3}
                        readOnly
                        size="small"
                        sx={{
                          color: strengthConfig[row.citationStrength].color,
                        }}
                      />
                      <Typography variant="body2" sx={{ color: strengthConfig[row.citationStrength].color }}>
                        {strengthConfig[row.citationStrength].label}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{row.prompt}</Typography>
                  </TableCell>
                  <TableCell>
                    <MuiLink
                      href={row.citationUrl}
                      target="_blank"
                      rel="noopener"
                      sx={{ fontSize: '0.875rem' }}
                    >
                      View Citation
                    </MuiLink>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(row.dateDiscovered).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {row.aiIndexed ? (
                      <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                    ) : (
                      <Cancel sx={{ color: 'error.main', fontSize: 20 }} />
                    )}
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
