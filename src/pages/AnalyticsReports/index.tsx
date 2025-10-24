import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material';
import {
  Assessment as ReportsIcon,
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  GridOn as ExcelIcon,
  Slideshow as PowerPointIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type ReportType = 'daily' | 'weekly' | 'monthly' | 'custom';
type ExportFormat = 'pdf' | 'excel' | 'ppt';

interface ReportMetrics {
  date: string;
  citations: number;
  geoScore: number;
  views: number;
  ctr: number;
  gmv: number;
}

interface ReportConfig {
  reportType: ReportType;
  startDate: string;
  endDate: string;
  includeMetrics: string[];
  exportFormat: ExportFormat;
}

// Mock report data
const mockReportData: ReportMetrics[] = [
  { date: '2025-09-01', citations: 12, geoScore: 75.2, views: 15800, ctr: 4.2, gmv: 8750 },
  { date: '2025-09-02', citations: 15, geoScore: 76.5, views: 18920, ctr: 5.1, gmv: 11200 },
  { date: '2025-09-03', citations: 18, geoScore: 77.1, views: 22400, ctr: 4.8, gmv: 9850 },
  { date: '2025-09-04', citations: 21, geoScore: 78.3, views: 24800, ctr: 6.2, gmv: 15200 },
  { date: '2025-09-05', citations: 19, geoScore: 77.9, views: 19500, ctr: 5.5, gmv: 12800 },
  { date: '2025-09-06', citations: 23, geoScore: 78.8, views: 28900, ctr: 6.8, gmv: 17500 },
  { date: '2025-09-07', citations: 26, geoScore: 79.4, views: 31200, ctr: 7.2, gmv: 19400 },
];

const mockPlatformData = [
  { platform: 'YouTube', citations: 38, performance: 92 },
  { platform: 'Blog', citations: 28, performance: 85 },
  { platform: 'Medium', citations: 22, performance: 78 },
  { platform: 'Reddit', citations: 19, performance: 72 },
  { platform: 'Amazon', citations: 15, performance: 68 },
  { platform: 'Quora', citations: 12, performance: 65 },
  { platform: 'LinkedIn', citations: 10, performance: 61 },
];

const reportTypeConfig = {
  daily: { label: 'Daily Report', period: '24 hours' },
  weekly: { label: 'Weekly Report', period: '7 days' },
  monthly: { label: 'Monthly Report', period: '30 days' },
  custom: { label: 'Custom Range', period: 'Custom' },
};

const exportFormatConfig = {
  pdf: { label: 'PDF', icon: PdfIcon, color: '#EF4444' },
  excel: { label: 'Excel', icon: ExcelIcon, color: '#10B981' },
  ppt: { label: 'PowerPoint', icon: PowerPointIcon, color: '#F59E0B' },
};

const availableMetrics = [
  'Citations',
  'GEO Score',
  'Views',
  'CTR',
  'GMV',
  'Platform Performance',
  'Content Coverage',
  'P-Level Distribution',
];

export default function AnalyticsReports() {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    reportType: 'weekly',
    startDate: '2025-09-01',
    endDate: '2025-09-07',
    includeMetrics: ['Citations', 'GEO Score', 'Views', 'GMV'],
    exportFormat: 'pdf',
  });

  const [generatedReport, setGeneratedReport] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleReportTypeChange = (type: ReportType) => {
    setReportConfig({ ...reportConfig, reportType: type });
    setGeneratedReport(false);
  };

  const handleMetricToggle = (metric: string) => {
    const currentMetrics = reportConfig.includeMetrics;
    const newMetrics = currentMetrics.includes(metric)
      ? currentMetrics.filter((m) => m !== metric)
      : [...currentMetrics, metric];
    setReportConfig({ ...reportConfig, includeMetrics: newMetrics });
  };

  const handleGenerateReport = () => {
    setGeneratedReport(true);
    setExportSuccess(false);
  };

  const handleExport = () => {
    // Simulate export
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const calculateSummaryStats = () => {
    const totalCitations = mockReportData.reduce((sum, d) => sum + d.citations, 0);
    const avgGeoScore = mockReportData.reduce((sum, d) => sum + d.geoScore, 0) / mockReportData.length;
    const totalViews = mockReportData.reduce((sum, d) => sum + d.views, 0);
    const avgCtr = mockReportData.reduce((sum, d) => sum + d.ctr, 0) / mockReportData.length;
    const totalGmv = mockReportData.reduce((sum, d) => sum + d.gmv, 0);

    return {
      totalCitations,
      avgGeoScore: avgGeoScore.toFixed(1),
      totalViews,
      avgCtr: avgCtr.toFixed(1),
      totalGmv,
    };
  };

  const stats = calculateSummaryStats();

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
              bgcolor: '#8B5CF615',
              color: '#8B5CF6',
            }}
          >
            <ReportsIcon fontSize="large" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" component="h1" fontWeight={600}>
              Analytics Reports
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Generate and export comprehensive performance reports
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Export Success Alert */}
      {exportSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Report exported successfully as {reportConfig.exportFormat.toUpperCase()}!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Report Configuration */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Report Configuration
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* Report Type Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Report Type
              </Typography>
              <Grid container spacing={1}>
                {(Object.keys(reportTypeConfig) as ReportType[]).map((type) => (
                  <Grid item xs={6} key={type}>
                    <Button
                      fullWidth
                      variant={reportConfig.reportType === type ? 'contained' : 'outlined'}
                      onClick={() => handleReportTypeChange(type)}
                      size="small"
                    >
                      {reportTypeConfig[type].label}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Date Range */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Date Range
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CalendarIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                <TextField
                  fullWidth
                  type="date"
                  size="small"
                  label="Start Date"
                  value={reportConfig.startDate}
                  onChange={(e) =>
                    setReportConfig({ ...reportConfig, startDate: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                <TextField
                  fullWidth
                  type="date"
                  size="small"
                  label="End Date"
                  value={reportConfig.endDate}
                  onChange={(e) =>
                    setReportConfig({ ...reportConfig, endDate: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Box>

            {/* Metrics Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Include Metrics
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {availableMetrics.map((metric) => (
                  <Chip
                    key={metric}
                    label={metric}
                    size="small"
                    onClick={() => handleMetricToggle(metric)}
                    color={reportConfig.includeMetrics.includes(metric) ? 'primary' : 'default'}
                    variant={reportConfig.includeMetrics.includes(metric) ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Box>

            {/* Export Format */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Export Format
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Format</InputLabel>
                <Select
                  value={reportConfig.exportFormat}
                  label="Format"
                  onChange={(e) =>
                    setReportConfig({
                      ...reportConfig,
                      exportFormat: e.target.value as ExportFormat,
                    })
                  }
                >
                  {(Object.keys(exportFormatConfig) as ExportFormat[]).map((format) => {
                    const Icon = exportFormatConfig[format].icon;
                    return (
                      <MenuItem key={format} value={format}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Icon sx={{ fontSize: 18, color: exportFormatConfig[format].color }} />
                          {exportFormatConfig[format].label}
                        </Box>
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleGenerateReport}
                startIcon={<ReportsIcon />}
              >
                Generate Report
              </Button>
              {generatedReport && (
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleExport}
                  startIcon={<DownloadIcon />}
                >
                  Export
                </Button>
              )}
            </Box>
          </Paper>

          {/* Report Info */}
          {generatedReport && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Report Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Period:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {reportTypeConfig[reportConfig.reportType].period}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Date Range:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {reportConfig.startDate} to {reportConfig.endDate}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Metrics:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {reportConfig.includeMetrics.length} selected
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Format:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {reportConfig.exportFormat.toUpperCase()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Report Preview */}
        <Grid item xs={12} md={8}>
          {!generatedReport ? (
            <Paper
              sx={{
                p: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 600,
                bgcolor: '#F9FAFB',
              }}
            >
              <ReportsIcon sx={{ fontSize: 80, color: '#9CA3AF', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Report Generated
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Configure your report settings and click "Generate Report" to preview
              </Typography>
            </Paper>
          ) : (
            <Paper sx={{ p: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  {reportTypeConfig[reportConfig.reportType].label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Generated on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} | Period: {reportConfig.startDate} to {reportConfig.endDate}
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Executive Summary */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Executive Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={4} md={2.4}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Citations
                        </Typography>
                        <Typography variant="h5" fontWeight={700}>
                          {stats.totalCitations}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={4} md={2.4}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Avg GEO Score
                        </Typography>
                        <Typography variant="h5" fontWeight={700}>
                          {stats.avgGeoScore}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={4} md={2.4}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Total Views
                        </Typography>
                        <Typography variant="h5" fontWeight={700}>
                          {stats.totalViews.toLocaleString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={4} md={2.4}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Avg CTR
                        </Typography>
                        <Typography variant="h5" fontWeight={700}>
                          {stats.avgCtr}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={4} md={2.4}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Total GMV
                        </Typography>
                        <Typography variant="h5" fontWeight={700}>
                          ${stats.totalGmv.toLocaleString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>

              {/* Performance Trend Chart */}
              {reportConfig.includeMetrics.includes('Citations') && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Citation Trend
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={mockReportData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })
                        }
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(label) =>
                          new Date(label).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })
                        }
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="citations"
                        stroke="#10B981"
                        strokeWidth={2}
                        name="Citations"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              )}

              {/* Platform Performance */}
              {reportConfig.includeMetrics.includes('Platform Performance') && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Platform Performance
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockPlatformData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="platform" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="citations"
                        fill="#3B82F6"
                        name="Citations"
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="performance"
                        fill="#10B981"
                        name="Performance Score"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              )}

              {/* Data Table */}
              <Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Detailed Metrics
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        {reportConfig.includeMetrics.includes('Citations') && (
                          <TableCell align="right">Citations</TableCell>
                        )}
                        {reportConfig.includeMetrics.includes('GEO Score') && (
                          <TableCell align="right">GEO Score</TableCell>
                        )}
                        {reportConfig.includeMetrics.includes('Views') && (
                          <TableCell align="right">Views</TableCell>
                        )}
                        {reportConfig.includeMetrics.includes('CTR') && (
                          <TableCell align="right">CTR (%)</TableCell>
                        )}
                        {reportConfig.includeMetrics.includes('GMV') && (
                          <TableCell align="right">GMV ($)</TableCell>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockReportData.map((row) => (
                        <TableRow key={row.date}>
                          <TableCell>
                            {new Date(row.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </TableCell>
                          {reportConfig.includeMetrics.includes('Citations') && (
                            <TableCell align="right">{row.citations}</TableCell>
                          )}
                          {reportConfig.includeMetrics.includes('GEO Score') && (
                            <TableCell align="right">{row.geoScore.toFixed(1)}</TableCell>
                          )}
                          {reportConfig.includeMetrics.includes('Views') && (
                            <TableCell align="right">{row.views.toLocaleString()}</TableCell>
                          )}
                          {reportConfig.includeMetrics.includes('CTR') && (
                            <TableCell align="right">{row.ctr.toFixed(1)}%</TableCell>
                          )}
                          {reportConfig.includeMetrics.includes('GMV') && (
                            <TableCell align="right">${row.gmv.toLocaleString()}</TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
