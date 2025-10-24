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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Upload as UploadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Map as MapIcon,
} from '@mui/icons-material';
import { RoadmapItem, PLevel } from '@/types/roadmap.types';
import DataTable, { DataTableColumn, DataTableAction } from '@/components/DataTable';
import PriorityBadge from '@/components/PriorityBadge';

// Mock data for demonstration
const mockRoadmapData: RoadmapItem[] = [
  {
    id: '1',
    month: '2025-09',
    prompt: 'Best mattress for back pain relief',
    pLevel: 'P0',
    enhancedGeoScore: 92.5,
    quickWinIndex: 88.0,
    geoIntentType: 'commercial',
    contentStrategy: 'Comprehensive guide + comparison table',
    geoFriendliness: 5,
    contentHoursEst: 8.0,
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    id: '2',
    month: '2025-09',
    prompt: 'Memory foam vs latex mattress comparison',
    pLevel: 'P0',
    enhancedGeoScore: 88.0,
    quickWinIndex: 85.5,
    geoIntentType: 'informational',
    contentStrategy: 'Side-by-side comparison + expert insights',
    geoFriendliness: 5,
    contentHoursEst: 8.0,
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    id: '3',
    month: '2025-09',
    prompt: 'How to choose mattress firmness level',
    pLevel: 'P1',
    enhancedGeoScore: 78.5,
    quickWinIndex: 72.0,
    geoIntentType: 'informational',
    contentStrategy: 'Decision tree guide + sleep position analysis',
    geoFriendliness: 4,
    contentHoursEst: 6.0,
    createdAt: new Date('2024-12-16'),
    updatedAt: new Date('2024-12-16'),
  },
  {
    id: '4',
    month: '2025-10',
    prompt: 'Mattress warranty coverage explained',
    pLevel: 'P1',
    enhancedGeoScore: 76.0,
    quickWinIndex: 68.5,
    geoIntentType: 'informational',
    contentStrategy: 'FAQ format + warranty comparison',
    geoFriendliness: 4,
    contentHoursEst: 6.0,
    createdAt: new Date('2024-12-17'),
    updatedAt: new Date('2024-12-17'),
  },
  {
    id: '5',
    month: '2025-10',
    prompt: 'Best cooling mattress for hot sleepers',
    pLevel: 'P2',
    enhancedGeoScore: 65.0,
    quickWinIndex: 58.0,
    geoIntentType: 'commercial',
    contentStrategy: 'Product roundup + temperature regulation tech',
    geoFriendliness: 3,
    contentHoursEst: 5.0,
    createdAt: new Date('2024-12-18'),
    updatedAt: new Date('2024-12-18'),
  },
  {
    id: '6',
    month: '2025-10',
    prompt: 'Mattress return policy guidelines',
    pLevel: 'P2',
    enhancedGeoScore: 62.5,
    quickWinIndex: 55.0,
    geoIntentType: 'informational',
    contentStrategy: 'Policy comparison + consumer tips',
    geoFriendliness: 3,
    contentHoursEst: 5.0,
    createdAt: new Date('2024-12-19'),
    updatedAt: new Date('2024-12-19'),
  },
  {
    id: '7',
    month: '2025-11',
    prompt: 'Mattress size dimensions chart',
    pLevel: 'P3',
    enhancedGeoScore: 45.0,
    quickWinIndex: 42.0,
    geoIntentType: 'informational',
    contentStrategy: 'Visual chart + room space calculator',
    geoFriendliness: 2,
    contentHoursEst: 3.0,
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-20'),
  },
  {
    id: '8',
    month: '2025-11',
    prompt: 'Mattress cleaning and maintenance tips',
    pLevel: 'P3',
    enhancedGeoScore: 42.0,
    quickWinIndex: 38.5,
    geoIntentType: 'informational',
    contentStrategy: 'Step-by-step guide + video tutorial',
    geoFriendliness: 2,
    contentHoursEst: 3.0,
    createdAt: new Date('2024-12-21'),
    updatedAt: new Date('2024-12-21'),
  },
];

const months = ['2025-09', '2025-10', '2025-11', '2025-12', '2025-05', '2025-06'];

export default function RoadmapManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedPLevel, setSelectedPLevel] = useState<PLevel | ''>('');
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const columns: DataTableColumn<RoadmapItem>[] = [
    {
      id: 'month',
      label: 'Month',
      sortable: true,
      width: 100,
      render: (row) => (
        <Chip
          label={row.month}
          size="small"
          sx={{ bgcolor: '#3B82F615', color: '#3B82F6', fontWeight: 600 }}
        />
      ),
    },
    {
      id: 'prompt',
      label: 'Prompt',
      sortable: true,
      width: 300,
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {row.prompt}
        </Typography>
      ),
    },
    {
      id: 'pLevel',
      label: 'P-Level',
      sortable: true,
      width: 120,
      align: 'center',
      render: (row) => (
        <PriorityBadge
          level={row.pLevel}
          score={(row.enhancedGeoScore * 0.7 + row.quickWinIndex * 0.3)}
          showScore={false}
          size="small"
        />
      ),
    },
    {
      id: 'enhancedGeoScore',
      label: 'GEO Score',
      sortable: true,
      width: 100,
      align: 'right',
      render: (row) => (
        <Typography variant="body2" fontWeight={600} color="primary.main">
          {row.enhancedGeoScore.toFixed(1)}
        </Typography>
      ),
    },
    {
      id: 'quickWinIndex',
      label: 'Quick Win',
      sortable: true,
      width: 100,
      align: 'right',
      render: (row) => (
        <Typography variant="body2" fontWeight={600} color="secondary.main">
          {row.quickWinIndex.toFixed(1)}
        </Typography>
      ),
    },
    {
      id: 'contentStrategy',
      label: 'Content Strategy',
      sortable: false,
      width: 250,
      render: (row) => (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          {row.contentStrategy}
        </Typography>
      ),
    },
    {
      id: 'contentHoursEst',
      label: 'Hours Est.',
      sortable: true,
      width: 100,
      align: 'right',
      render: (row) => (
        <Chip
          label={`${row.contentHoursEst}h`}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      ),
    },
  ];

  const actions: DataTableAction<RoadmapItem>[] = [
    {
      icon: <EditIcon fontSize="small" />,
      tooltip: 'Edit Roadmap Item',
      onClick: (row) => console.log('Edit:', row.id),
      color: 'primary',
    },
    {
      icon: <DeleteIcon fontSize="small" />,
      tooltip: 'Delete Roadmap Item',
      onClick: (row) => console.log('Delete:', row.id),
      color: 'error',
    },
  ];

  const filteredData = mockRoadmapData.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contentStrategy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMonth = selectedMonth === '' || item.month === selectedMonth;

    const matchesPLevel = selectedPLevel === '' || item.pLevel === selectedPLevel;

    return matchesSearch && matchesMonth && matchesPLevel;
  });

  const stats = {
    total: filteredData.length,
    p0: filteredData.filter((i) => i.pLevel === 'P0').length,
    p1: filteredData.filter((i) => i.pLevel === 'P1').length,
    p2: filteredData.filter((i) => i.pLevel === 'P2').length,
    p3: filteredData.filter((i) => i.pLevel === 'P3').length,
    avgGeoScore: filteredData.length
      ? filteredData.reduce((sum, i) => sum + i.enhancedGeoScore, 0) / filteredData.length
      : 0,
    totalHours: filteredData.reduce((sum, i) => sum + i.contentHoursEst, 0),
  };

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
              bgcolor: '#A855F715',
              color: '#A855F7',
            }}
          >
            <MapIcon fontSize="large" />
          </Box>
          <Box>
            <Typography variant="h4" component="h1" fontWeight={600}>
              Roadmap Manager
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monthly GEO Roadmap - P0-P3 Priority Hierarchy
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stats Summary */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Items
            </Typography>
            <Typography variant="h5" fontWeight={600}>
              {stats.total}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              P0 Core
            </Typography>
            <Typography variant="h5" fontWeight={600} color="#EF4444">
              {stats.p0}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              P1 Important
            </Typography>
            <Typography variant="h5" fontWeight={600} color="#F97316">
              {stats.p1}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              P2 Opportunity
            </Typography>
            <Typography variant="h5" fontWeight={600} color="#EAB308">
              {stats.p2}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              P3 Reserve
            </Typography>
            <Typography variant="h5" fontWeight={600} color="#22C55E">
              {stats.p3}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Avg GEO Score
            </Typography>
            <Typography variant="h5" fontWeight={600} color="primary.main">
              {stats.avgGeoScore.toFixed(1)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Hours Est.
            </Typography>
            <Typography variant="h5" fontWeight={600} color="secondary.main">
              {stats.totalHours}h
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Filters and Actions */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 3 }}>
          {/* Search */}
          <TextField
            placeholder="Search prompts..."
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

          {/* Month Filter */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Month</InputLabel>
            <Select
              value={selectedMonth}
              label="Month"
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <MenuItem value="">All Months</MenuItem>
              {months.map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* P-Level Filter Chips */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label="All"
              onClick={() => setSelectedPLevel('')}
              color={selectedPLevel === '' ? 'primary' : 'default'}
              variant={selectedPLevel === '' ? 'filled' : 'outlined'}
            />
            <Chip
              label="P0"
              onClick={() => setSelectedPLevel('P0')}
              color={selectedPLevel === 'P0' ? 'primary' : 'default'}
              variant={selectedPLevel === 'P0' ? 'filled' : 'outlined'}
              sx={{
                borderColor: '#EF4444',
                color: selectedPLevel === 'P0' ? 'white' : '#EF4444',
                bgcolor: selectedPLevel === 'P0' ? '#EF4444' : 'transparent',
              }}
            />
            <Chip
              label="P1"
              onClick={() => setSelectedPLevel('P1')}
              color={selectedPLevel === 'P1' ? 'primary' : 'default'}
              variant={selectedPLevel === 'P1' ? 'filled' : 'outlined'}
              sx={{
                borderColor: '#F97316',
                color: selectedPLevel === 'P1' ? 'white' : '#F97316',
                bgcolor: selectedPLevel === 'P1' ? '#F97316' : 'transparent',
              }}
            />
            <Chip
              label="P2"
              onClick={() => setSelectedPLevel('P2')}
              color={selectedPLevel === 'P2' ? 'primary' : 'default'}
              variant={selectedPLevel === 'P2' ? 'filled' : 'outlined'}
              sx={{
                borderColor: '#EAB308',
                color: selectedPLevel === 'P2' ? 'white' : '#EAB308',
                bgcolor: selectedPLevel === 'P2' ? '#EAB308' : 'transparent',
              }}
            />
            <Chip
              label="P3"
              onClick={() => setSelectedPLevel('P3')}
              color={selectedPLevel === 'P3' ? 'primary' : 'default'}
              variant={selectedPLevel === 'P3' ? 'filled' : 'outlined'}
              sx={{
                borderColor: '#22C55E',
                color: selectedPLevel === 'P3' ? 'white' : '#22C55E',
                bgcolor: selectedPLevel === 'P3' ? '#22C55E' : 'transparent',
              }}
            />
          </Box>

          <Box sx={{ flex: 1 }} />

          {/* Action Buttons */}
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={() => setImportDialogOpen(true)}
          >
            Bulk Import
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => console.log('Add new')}>
            Add Roadmap Item
          </Button>
        </Box>
      </Paper>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        rowKey="id"
        actions={actions}
        selectable
        defaultPageSize={10}
        pageSizeOptions={[10, 25, 50, 100]}
      />

      {/* Bulk Import Dialog */}
      <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Bulk Import Roadmap</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Upload a CSV/TSV file with the following columns:
            </Typography>
            <Typography variant="caption" component="pre" sx={{ display: 'block', mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              month, prompt, p_level, enhanced_geo_score, quickwin_index,{'\n'}
              geo_intent_type, content_strategy, geo_friendliness,{'\n'}
              content_hours_est
            </Typography>
            <Button variant="outlined" fullWidth sx={{ mt: 3 }} startIcon={<UploadIcon />}>
              Choose File
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setImportDialogOpen(false)}>
            Import
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
