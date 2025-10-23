import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Tab,
  Tabs,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Badge,
} from '@mui/material';
import {
  FormatQuote as CitationIcon,
  TrendingUp,
  Visibility,
  Link as LinkIcon,
  CheckCircle,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import DataTable, { type DataTableColumn, type DataTableAction } from '@/components/DataTable';
import type { Citation, AIplatform, CitationStrength } from '@/types/citation.types';

// Mock citation data
const mockCitations: Citation[] = [
  {
    id: '1',
    citationId: 'CIT-001',
    contentId: 'CONT-YT-001',
    platform: 'ChatGPT',
    citationUrl: 'https://chat.openai.com/share/abc123',
    aiIndexed: true,
    citationStrength: 3,
    detectedAt: new Date('2025-01-07'),
    query: 'best mattress for back pain',
    context: 'Recommended SweetNight memory foam mattress for back pain relief',
    attribution: 'SweetNight Official Review',
    createdAt: new Date('2025-01-07'),
    updatedAt: new Date('2025-01-07'),
  },
  {
    id: '2',
    citationId: 'CIT-002',
    contentId: 'CONT-RD-002',
    platform: 'Perplexity',
    citationUrl: 'https://perplexity.ai/search/xyz789',
    aiIndexed: true,
    citationStrength: 2,
    detectedAt: new Date('2025-01-06'),
    query: 'memory foam vs latex comparison',
    context: 'Referenced Reddit discussion about mattress types',
    attribution: null,
    createdAt: new Date('2025-01-06'),
    updatedAt: new Date('2025-01-06'),
  },
  {
    id: '3',
    citationId: 'CIT-003',
    contentId: 'CONT-MD-003',
    platform: 'Claude',
    citationUrl: 'https://claude.ai/chat/def456',
    aiIndexed: true,
    citationStrength: 3,
    detectedAt: new Date('2025-01-05'),
    query: 'cooling mattress for hot sleepers',
    context: 'Directly cited Medium article on cooling mattresses',
    attribution: 'Sleep Expert Guide - Medium',
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-05'),
  },
  {
    id: '4',
    citationId: 'CIT-004',
    contentId: 'CONT-BL-004',
    platform: 'Gemini',
    citationUrl: 'https://gemini.google.com/share/ghi789',
    aiIndexed: true,
    citationStrength: 2,
    detectedAt: new Date('2025-01-04'),
    query: 'mattress buying guide 2025',
    context: 'Referenced blog post about mattress selection',
    attribution: 'SweetNight Blog',
    createdAt: new Date('2025-01-04'),
    updatedAt: new Date('2025-01-04'),
  },
  {
    id: '5',
    citationId: 'CIT-005',
    contentId: 'CONT-QR-005',
    platform: 'Copilot',
    citationUrl: 'https://copilot.microsoft.com/share/jkl012',
    aiIndexed: false,
    citationStrength: 1,
    detectedAt: new Date('2025-01-03'),
    query: 'budget mattress recommendations',
    context: 'Mentioned Quora answer in results',
    attribution: null,
    createdAt: new Date('2025-01-03'),
    updatedAt: new Date('2025-01-03'),
  },
  {
    id: '6',
    citationId: 'CIT-006',
    contentId: 'CONT-YT-002',
    platform: 'MetaAI',
    citationUrl: 'https://meta.ai/share/mno345',
    aiIndexed: true,
    citationStrength: 2,
    detectedAt: new Date('2025-01-02'),
    query: 'mattress firmness guide',
    context: 'Referenced YouTube video about mattress firmness',
    attribution: 'SweetNight Official Channel',
    createdAt: new Date('2025-01-02'),
    updatedAt: new Date('2025-01-02'),
  },
  {
    id: '7',
    citationId: 'CIT-007',
    contentId: 'CONT-AM-001',
    platform: 'SearchGPT',
    citationUrl: 'https://searchgpt.com/share/pqr678',
    aiIndexed: true,
    citationStrength: 3,
    detectedAt: new Date('2025-01-01'),
    query: 'best mattress on amazon',
    context: 'Direct link to Amazon product listing',
    attribution: 'Amazon Customer Reviews',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },
];

// Mock trend data
const citationTrendData = [
  { date: '2025-01-01', ChatGPT: 15, Perplexity: 12, Claude: 8, Gemini: 10, Copilot: 7, MetaAI: 5, SearchGPT: 9 },
  { date: '2025-01-02', ChatGPT: 18, Perplexity: 14, Claude: 10, Gemini: 12, Copilot: 8, MetaAI: 6, SearchGPT: 11 },
  { date: '2025-01-03', ChatGPT: 22, Perplexity: 16, Claude: 12, Gemini: 15, Copilot: 10, MetaAI: 7, SearchGPT: 13 },
  { date: '2025-01-04', ChatGPT: 25, Perplexity: 19, Claude: 14, Gemini: 17, Copilot: 12, MetaAI: 9, SearchGPT: 15 },
  { date: '2025-01-05', ChatGPT: 28, Perplexity: 21, Claude: 16, Gemini: 19, Copilot: 13, MetaAI: 10, SearchGPT: 17 },
  { date: '2025-01-06', ChatGPT: 32, Perplexity: 24, Claude: 18, Gemini: 22, Copilot: 15, MetaAI: 12, SearchGPT: 20 },
  { date: '2025-01-07', ChatGPT: 35, Perplexity: 27, Claude: 20, Gemini: 25, Copilot: 17, MetaAI: 14, SearchGPT: 22 },
];

type FilterTab = 'all' | AIplatform;

const strengthLabels: Record<CitationStrength, string> = {
  1: 'Mentioned',
  2: 'Referenced',
  3: 'Direct',
};

const strengthColors: Record<CitationStrength, string> = {
  1: '#94A3B8',
  2: '#3B82F6',
  3: '#10B981',
};

export default function CitationTracker() {
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [strengthFilter, setStrengthFilter] = useState<CitationStrength | 'all'>('all');

  const platforms: AIplatform[] = ['ChatGPT', 'Perplexity', 'Claude', 'Gemini', 'Copilot', 'MetaAI', 'SearchGPT'];

  const platformColors: Record<AIplatform, string> = {
    ChatGPT: '#10A37F',
    Perplexity: '#1FB6FF',
    Claude: '#CC785C',
    Gemini: '#4285F4',
    Copilot: '#0078D4',
    MetaAI: '#0668E1',
    SearchGPT: '#FF6B6B',
  };

  // Filter citations
  const filteredCitations = mockCitations.filter((citation) => {
    const platformMatch = filterTab === 'all' || citation.platform === filterTab;
    const strengthMatch = strengthFilter === 'all' || citation.citationStrength === strengthFilter;
    return platformMatch && strengthMatch;
  });

  // Calculate stats
  const stats = {
    total: mockCitations.length,
    byPlatform: platforms.reduce((acc, platform) => {
      acc[platform] = mockCitations.filter((c) => c.platform === platform).length;
      return acc;
    }, {} as Record<AIplatform, number>),
    byStrength: {
      1: mockCitations.filter((c) => c.citationStrength === 1).length,
      2: mockCitations.filter((c) => c.citationStrength === 2).length,
      3: mockCitations.filter((c) => c.citationStrength === 3).length,
    },
    avgGrowth: 12.5,
    indexed: mockCitations.filter((c) => c.aiIndexed).length,
  };

  // DataTable columns
  const columns: DataTableColumn<Citation>[] = [
    {
      id: 'citationId',
      label: 'Citation ID',
      sortable: true,
      width: 120,
    },
    {
      id: 'platform',
      label: 'Platform',
      sortable: true,
      width: 120,
      render: (row) => (
        <Chip
          label={row.platform}
          size="small"
          sx={{
            bgcolor: platformColors[row.platform],
            color: 'white',
            fontWeight: 600,
          }}
        />
      ),
    },
    {
      id: 'citationStrength',
      label: 'Strength',
      sortable: true,
      width: 120,
      render: (row) => (
        <Chip
          label={strengthLabels[row.citationStrength]}
          size="small"
          sx={{
            bgcolor: strengthColors[row.citationStrength],
            color: 'white',
            fontWeight: 600,
          }}
        />
      ),
    },
    {
      id: 'query',
      label: 'Query',
      sortable: true,
    },
    {
      id: 'context',
      label: 'Context',
      sortable: false,
      render: (row) => (
        <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
          {row.context}
        </Typography>
      ),
    },
    {
      id: 'aiIndexed',
      label: 'Indexed',
      sortable: true,
      align: 'center',
      width: 100,
      render: (row) =>
        row.aiIndexed ? (
          <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
        ) : (
          <Typography variant="caption" color="text.secondary">
            No
          </Typography>
        ),
    },
    {
      id: 'detectedAt',
      label: 'Detected',
      sortable: true,
      width: 120,
      format: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  // DataTable actions
  const actions: DataTableAction<Citation>[] = [
    {
      icon: <Visibility fontSize="small" />,
      tooltip: 'View Details',
      onClick: (row) => console.log('View citation:', row),
      color: 'primary',
    },
    {
      icon: <LinkIcon fontSize="small" />,
      tooltip: 'Open URL',
      onClick: (row) => window.open(row.citationUrl, '_blank'),
      color: 'info',
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
            <CitationIcon fontSize="large" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" component="h1" fontWeight={600}>
              Citation Tracker
            </Typography>
            <Typography variant="body1" color="text.secondary">
              7-Platform AI Citation Monitoring & Analytics
            </Typography>
          </Box>

          {/* Strength Filter */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Strength</InputLabel>
            <Select
              value={strengthFilter}
              onChange={(e) => setStrengthFilter(e.target.value as CitationStrength | 'all')}
              label="Strength"
            >
              <MenuItem value="all">All Strengths</MenuItem>
              <MenuItem value={1}>Mentioned (1)</MenuItem>
              <MenuItem value={2}>Referenced (2)</MenuItem>
              <MenuItem value={3}>Direct (3)</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Citations
              </Typography>
              <Typography variant="h4" component="div" fontWeight={700} sx={{ mb: 1 }}>
                {stats.total}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TrendingUp sx={{ fontSize: 18, color: 'success.main' }} />
                <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
                  +{stats.avgGrowth}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  vs last week
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                AI Indexed
              </Typography>
              <Typography variant="h4" component="div" fontWeight={700} sx={{ mb: 1 }}>
                {stats.indexed}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {((stats.indexed / stats.total) * 100).toFixed(1)}% of total citations
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Direct Citations
              </Typography>
              <Typography variant="h4" component="div" fontWeight={700} sx={{ mb: 1 }}>
                {stats.byStrength[3]}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Strongest citation type
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Top Platform
              </Typography>
              <Typography variant="h4" component="div" fontWeight={700} sx={{ mb: 1 }}>
                ChatGPT
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stats.byPlatform.ChatGPT} citations
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Platform Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={filterTab}
          onChange={(_, newValue) => setFilterTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            label={
              <Badge badgeContent={stats.total} color="primary">
                All Platforms
              </Badge>
            }
            value="all"
          />
          {platforms.map((platform) => (
            <Tab
              key={platform}
              label={
                <Badge badgeContent={stats.byPlatform[platform]} color="default">
                  {platform}
                </Badge>
              }
              value={platform}
            />
          ))}
        </Tabs>
      </Paper>

      {/* Citation Trend Chart */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Citation Trends by Platform
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Daily citation counts across all 7 AI platforms
        </Typography>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={citationTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis />
            <RechartsTooltip
              labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <Legend />
            {platforms.map((platform) => (
              <Line
                key={platform}
                type="monotone"
                dataKey={platform}
                stroke={platformColors[platform]}
                strokeWidth={2}
                dot={{ r: 3 }}
                name={platform}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* Platform Distribution */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Platform Distribution
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {platforms.map((platform) => {
            const count = stats.byPlatform[platform];
            const percentage = ((count / stats.total) * 100).toFixed(1);
            return (
              <Grid item xs={12} sm={6} md={3} key={platform}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: `${platformColors[platform]}08`,
                    borderColor: `${platformColors[platform]}30`,
                    borderWidth: 2,
                  }}
                >
                  <Typography variant="body2" fontWeight={600} sx={{ color: platformColors[platform], mb: 1 }}>
                    {platform}
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {count}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {percentage}% of total
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Paper>

      {/* Citation Strength Breakdown */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[1, 2, 3].map((strength) => {
          const count = stats.byStrength[strength as CitationStrength];
          const percentage = ((count / stats.total) * 100).toFixed(1);
          return (
            <Grid item xs={12} md={4} key={strength}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {strengthLabels[strength as CitationStrength]} Citations
                      </Typography>
                      <Typography variant="h4" component="div" fontWeight={700} sx={{ mb: 1 }}>
                        {count}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {percentage}% of total citations
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: `${strengthColors[strength as CitationStrength]}15`,
                        color: strengthColors[strength as CitationStrength],
                      }}
                    >
                      <Typography variant="h5" fontWeight={700}>
                        {strength}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Citation List Table */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Citation List ({filteredCitations.length})
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {filterTab !== 'all' ? `Filtered by: ${filterTab}` : 'Showing all citations'}
          {strengthFilter !== 'all' && ` • Strength: ${strengthLabels[strengthFilter as CitationStrength]}`}
        </Typography>
      </Box>
      <DataTable
        columns={columns}
        data={filteredCitations}
        actions={actions}
        defaultPageSize={10}
        emptyMessage="No citations found with current filters"
      />
    </Box>
  );
}
