import { Box, Typography, Paper, Card, CardContent } from '@mui/material';

interface PagePlaceholderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  color?: string;
}

export default function PagePlaceholder({
  title,
  description,
  icon,
  color = '#1976d2',
}: PagePlaceholderProps) {
  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          {icon && (
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: `${color}15`,
                color: color,
              }}
            >
              {icon}
            </Box>
          )}
          <Typography variant="h4" component="h1" fontWeight={600}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </Box>

      {/* Placeholder Content */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 2,
          border: '2px dashed',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Page Under Development
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This page will be implemented in Phase 1 Step 1.4
          </Typography>
        </Box>
      </Paper>

      {/* Feature Cards */}
      <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Upcoming Features
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Full implementation coming soon with interactive components and real-time data.
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Data Visualization
            </Typography>
            <Typography variant="body2" color="text.secondary">
              D3.js charts and graphs will be integrated for data insights.
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              API Integration
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Backend API connections ready for live data fetching.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
