import { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  TextField,
  InputAdornment,
  Chip,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  CardActions,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  ViewList as ListIcon,
  ViewModule as GridIcon,
  GridOn as HeatmapIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { ContentItem, ContentChannel, PublishStatus } from '@/types/content.types';
import DataTable, { DataTableColumn, DataTableAction } from '@/components/DataTable';

// Mock data for demonstration
const mockContentData: ContentItem[] = [
  {
    id: '1',
    contentId: 'CNT-2025-001',
    title: 'Ultimate Guide to Memory Foam Mattresses',
    coveredPrompts: ['Best mattress for back pain relief', 'Memory foam vs latex'],
    channel: 'Blog',
    publishStatus: 'published',
    publishDate: new Date('2025-01-10'),
    kpiCtr: 4.2,
    kpiViews: 12450,
    kpiGmv: 8750.0,
    content: '',
    metadata: {},
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-10'),
  },
  {
    id: '2',
    contentId: 'CNT-2025-002',
    title: 'Top 5 Mattresses for Side Sleepers 2025',
    coveredPrompts: ['Best mattress for side sleepers'],
    channel: 'YouTube',
    publishStatus: 'published',
    publishDate: new Date('2025-01-15'),
    kpiCtr: 8.5,
    kpiViews: 45800,
    kpiGmv: 15200.0,
    content: '',
    metadata: {},
    createdAt: new Date('2025-01-08'),
    updatedAt: new Date('2025-01-15'),
  },
  {
    id: '3',
    contentId: 'CNT-2025-003',
    title: 'How to Choose the Right Mattress Firmness',
    coveredPrompts: ['How to choose mattress firmness level'],
    channel: 'Medium',
    publishStatus: 'published',
    publishDate: new Date('2025-01-18'),
    kpiCtr: 3.8,
    kpiViews: 8920,
    kpiGmv: 4200.0,
    content: '',
    metadata: {},
    createdAt: new Date('2025-01-12'),
    updatedAt: new Date('2025-01-18'),
  },
  {
    id: '4',
    contentId: 'CNT-2025-004',
    title: 'Memory Foam vs Latex: Which is Better?',
    coveredPrompts: ['Memory foam vs latex mattress comparison'],
    channel: 'Reddit',
    publishStatus: 'published',
    publishDate: new Date('2025-01-20'),
    kpiCtr: 6.2,
    kpiViews: 18400,
    kpiGmv: 9850.0,
    content: '',
    metadata: {},
    createdAt: new Date('2025-01-14'),
    updatedAt: new Date('2025-01-20'),
  },
  {
    id: '5',
    contentId: 'CNT-2025-005',
    title: 'Best Cooling Mattress Reviews',
    coveredPrompts: ['Best cooling mattress for hot sleepers'],
    channel: 'Amazon',
    publishStatus: 'scheduled',
    publishDate: new Date('2025-01-25'),
    kpiCtr: 0,
    kpiViews: 0,
    kpiGmv: 0,
    content: '',
    metadata: {},
    createdAt: new Date('2025-01-16'),
    updatedAt: new Date('2025-01-16'),
  },
  {
    id: '6',
    contentId: 'CNT-2025-006',
    title: 'Understanding Mattress Warranty Coverage',
    coveredPrompts: ['Mattress warranty coverage explained'],
    channel: 'Quora',
    publishStatus: 'draft',
    publishDate: null,
    kpiCtr: 0,
    kpiViews: 0,
    kpiGmv: 0,
    content: '',
    metadata: {},
    createdAt: new Date('2025-01-17'),
    updatedAt: new Date('2025-01-17'),
  },
];

const channels: ContentChannel[] = ['YouTube', 'Reddit', 'Quora', 'Medium', 'Blog', 'Amazon', 'LinkedIn'];
const statuses: PublishStatus[] = ['draft', 'scheduled', 'published', 'archived'];

const channelColors: Record<ContentChannel, string> = {
  YouTube: '#FF0000',
  Reddit: '#FF4500',
  Quora: '#B92B27',
  Medium: '#000000',
  Blog: '#06B6D4',
  Amazon: '#FF9900',
  LinkedIn: '#0A66C2',
};

const statusColors: Record<PublishStatus, string> = {
  draft: '#9CA3AF',
  scheduled: '#F59E0B',
  published: '#10B981',
  archived: '#6B7280',
};

type ViewMode = 'grid' | 'list' | 'heatmap';

export default function ContentRegistry() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<ContentChannel | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<PublishStatus | ''>('');

  const filteredData = mockContentData.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.coveredPrompts.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesChannel = selectedChannel === '' || item.channel === selectedChannel;
    const matchesStatus = selectedStatus === '' || item.publishStatus === selectedStatus;

    return matchesSearch && matchesChannel && matchesStatus;
  });

  const stats = {
    total: filteredData.length,
    totalViews: filteredData.reduce((sum, i) => sum + i.kpiViews, 0),
    totalGmv: filteredData.reduce((sum, i) => sum + i.kpiGmv, 0),
    avgCtr:
      filteredData.length > 0
        ? filteredData.reduce((sum, i) => sum + i.kpiCtr, 0) / filteredData.length
        : 0,
    published: filteredData.filter((i) => i.publishStatus === 'published').length,
  };

  const columns: DataTableColumn<ContentItem>[] = [
    {
      id: 'contentId',
      label: 'Content ID',
      sortable: true,
      width: 120,
      render: (row) => (
        <Typography variant="body2" fontWeight={600} color="primary.main">
          {row.contentId}
        </Typography>
      ),
    },
    {
      id: 'title',
      label: 'Title',
      sortable: true,
      width: 300,
      render: (row) => (
        <Typography variant="body2" fontWeight={500}>
          {row.title}
        </Typography>
      ),
    },
    {
      id: 'channel',
      label: 'Channel',
      sortable: true,
      width: 120,
      align: 'center',
      render: (row) => (
        <Chip
          label={row.channel}
          size="small"
          sx={{
            bgcolor: `${channelColors[row.channel]}15`,
            color: channelColors[row.channel],
            fontWeight: 600,
          }}
        />
      ),
    },
    {
      id: 'publishStatus',
      label: 'Status',
      sortable: true,
      width: 120,
      align: 'center',
      render: (row) => (
        <Chip
          label={row.publishStatus}
          size="small"
          sx={{
            bgcolor: `${statusColors[row.publishStatus]}15`,
            color: statusColors[row.publishStatus],
            fontWeight: 600,
            textTransform: 'capitalize',
          }}
        />
      ),
    },
    {
      id: 'kpiViews',
      label: 'Views',
      sortable: true,
      width: 100,
      align: 'right',
      render: (row) => (
        <Typography variant="body2" fontWeight={600}>
          {row.kpiViews.toLocaleString()}
        </Typography>
      ),
    },
    {
      id: 'kpiCtr',
      label: 'CTR %',
      sortable: true,
      width: 100,
      align: 'right',
      render: (row) => (
        <Typography variant="body2" fontWeight={600} color="secondary.main">
          {row.kpiCtr.toFixed(1)}%
        </Typography>
      ),
    },
    {
      id: 'kpiGmv',
      label: 'GMV',
      sortable: true,
      width: 120,
      align: 'right',
      render: (row) => (
        <Typography variant="body2" fontWeight={600} color="success.main">
          ${row.kpiGmv.toLocaleString()}
        </Typography>
      ),
    },
  ];

  const actions: DataTableAction<ContentItem>[] = [
    {
      icon: <ViewIcon fontSize="small" />,
      tooltip: 'View Content',
      onClick: (row) => console.log('View:', row.id),
      color: 'info',
    },
    {
      icon: <EditIcon fontSize="small" />,
      tooltip: 'Edit Content',
      onClick: (row) => console.log('Edit:', row.id),
      color: 'primary',
    },
    {
      icon: <DeleteIcon fontSize="small" />,
      tooltip: 'Delete Content',
      onClick: (row) => console.log('Delete:', row.id),
      color: 'error',
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
              bgcolor: '#06B6D415',
              color: '#06B6D4',
            }}
          >
            <InventoryIcon fontSize="large" />
          </Box>
          <Box>
            <Typography variant="h4" component="h1" fontWeight={600}>
              Content Registry
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Content Inventory Management - 7-Channel Distribution
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stats Summary */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Content
            </Typography>
            <Typography variant="h5" fontWeight={600}>
              {stats.total}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Published
            </Typography>
            <Typography variant="h5" fontWeight={600} color="success.main">
              {stats.published}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Views
            </Typography>
            <Typography variant="h5" fontWeight={600} color="primary.main">
              {stats.totalViews.toLocaleString()}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Avg CTR
            </Typography>
            <Typography variant="h5" fontWeight={600} color="secondary.main">
              {stats.avgCtr.toFixed(1)}%
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total GMV
            </Typography>
            <Typography variant="h5" fontWeight={600} color="success.main">
              ${stats.totalGmv.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Filters and View Controls */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <TextField
            placeholder="Search content..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />

          {/* Channel Filter */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Channel</InputLabel>
            <Select
              value={selectedChannel}
              label="Channel"
              onChange={(e) => setSelectedChannel(e.target.value as ContentChannel | '')}
            >
              <MenuItem value="">All Channels</MenuItem>
              {channels.map((channel) => (
                <MenuItem key={channel} value={channel}>
                  {channel}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Status Filter */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedStatus}
              label="Status"
              onChange={(e) => setSelectedStatus(e.target.value as PublishStatus | '')}
            >
              <MenuItem value="">All Statuses</MenuItem>
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ flex: 1 }} />

          {/* View Mode Toggle */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, newMode) => newMode && setViewMode(newMode)}
            size="small"
          >
            <ToggleButton value="grid">
              <Tooltip title="Grid View">
                <GridIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="list">
              <Tooltip title="List View">
                <ListIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="heatmap">
              <Tooltip title="Heatmap View">
                <HeatmapIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Add Button */}
          <Button variant="contained" startIcon={<AddIcon />}>
            Add Content
          </Button>
        </Box>
      </Paper>

      {/* Content Display - Grid View */}
      {viewMode === 'grid' && (
        <Grid container spacing={3}>
          {filteredData.map((content) => (
            <Grid item xs={12} sm={6} md={4} key={content.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      label={content.channel}
                      size="small"
                      sx={{
                        bgcolor: `${channelColors[content.channel]}15`,
                        color: channelColors[content.channel],
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      label={content.publishStatus}
                      size="small"
                      sx={{
                        bgcolor: `${statusColors[content.publishStatus]}15`,
                        color: statusColors[content.publishStatus],
                        fontWeight: 600,
                        textTransform: 'capitalize',
                      }}
                    />
                  </Box>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    {content.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    {content.contentId}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Views
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {content.kpiViews.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        CTR
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color="secondary.main">
                        {content.kpiCtr.toFixed(1)}%
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        GMV
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color="success.main">
                        ${content.kpiGmv.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions>
                  <IconButton size="small" color="info">
                    <ViewIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="primary">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Content Display - List View */}
      {viewMode === 'list' && (
        <DataTable
          columns={columns}
          data={filteredData}
          rowKey="id"
          actions={actions}
          selectable
          defaultPageSize={10}
          pageSizeOptions={[10, 25, 50, 100]}
        />
      )}

      {/* Content Display - Heatmap View */}
      {viewMode === 'heatmap' && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Content Coverage Heatmap
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Content distribution across channels and status
          </Typography>
          <Grid container spacing={2}>
            {channels.map((channel) => (
              <Grid item xs={12} sm={6} md={3} key={channel}>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: `${channelColors[channel]}08`,
                    border: '2px solid',
                    borderColor: `${channelColors[channel]}20`,
                  }}
                >
                  <Typography variant="body2" fontWeight={600} color={channelColors[channel]}>
                    {channel}
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ my: 1 }}>
                    {filteredData.filter((c) => c.channel === channel).length}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {statuses.map((status) => {
                      const count = filteredData.filter(
                        (c) => c.channel === channel && c.publishStatus === status
                      ).length;
                      if (count === 0) return null;
                      return (
                        <Box key={status} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption" color="text.secondary">
                            {status}
                          </Typography>
                          <Typography variant="caption" fontWeight={600}>
                            {count}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </Box>
  );
}
