import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Alert,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  FileDownload as FileDownloadIcon,
  ShoppingCart as ShoppingCartIcon,
  HourglassEmpty,
  AttachMoney,
  TrendingUp,
  Speed,
} from '@mui/icons-material';

// Mock data
const mockOrders = [
  {
    orderId: 'ORD-2025-001',
    status: 'Delivered',
    merchant: 'Amazon',
    source: 'ChatGPT',
    amount: 599.99,
    date: '2025-09-15',
  },
  {
    orderId: 'ORD-2025-002',
    status: 'Processing',
    merchant: 'Walmart',
    source: 'Claude',
    amount: 799.99,
    date: '2025-09-18',
  },
  {
    orderId: 'ORD-2025-003',
    status: 'Shipped',
    merchant: 'Target',
    source: 'Gemini',
    amount: 399.99,
    date: '2025-09-20',
  },
  {
    orderId: 'ORD-2025-004',
    status: 'Delivered',
    merchant: 'Amazon',
    source: 'ChatGPT',
    amount: 899.99,
    date: '2025-09-10',
  },
  {
    orderId: 'ORD-2025-005',
    status: 'Processing',
    merchant: 'Wayfair',
    source: 'Claude',
    amount: 499.99,
    date: '2025-09-22',
  },
];

const orderSteps = ['Order Placed', 'Payment Confirmed', 'Processing', 'Shipped', 'Delivered'];

const topMerchants = [
  { name: 'Amazon', orders: 142, revenue: 85420 },
  { name: 'Walmart', orders: 58, revenue: 34680 },
  { name: 'Target', orders: 34, revenue: 20400 },
];

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

function StatsCard({ title, value, icon, color, subtitle }: StatsCardProps) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight={700}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 56,
              height: 56,
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
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Orders() {
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'Shipped':
        return 'info';
      case 'Processing':
        return 'warning';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'ChatGPT':
        return '#10B981';
      case 'Claude':
        return '#8B5CF6';
      case 'Gemini':
        return '#3B82F6';
      default:
        return '#6b7280';
    }
  };

  const filteredOrders = mockOrders.filter(
    (order) =>
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    console.log('Exporting orders...');
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#FF980015',
              color: '#FF9800',
            }}
          >
            <ShoppingCartIcon fontSize="large" />
          </Box>
          <Box>
            <Typography variant="h4" component="h1" fontWeight={600}>
              Orders
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track AI-driven purchases from multiple platforms
            </Typography>
          </Box>
        </Box>
        <Button variant="outlined" startIcon={<RefreshIcon />} size="large">
          Refresh
        </Button>
      </Box>

      {/* Demo Mode Banner */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Demo Mode:</strong> This page displays mock order data. In production, orders will sync from AI platforms (ChatGPT, Claude, Gemini) and merchant APIs.
        </Typography>
      </Alert>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatsCard
            title="Total Orders"
            value={234}
            icon={<ShoppingCartIcon fontSize="large" />}
            color="#FF9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatsCard
            title="Processing"
            value={12}
            icon={<HourglassEmpty fontSize="large" />}
            color="#F59E0B"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatsCard
            title="Revenue"
            value="$145K"
            icon={<AttachMoney fontSize="large" />}
            color="#10B981"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatsCard
            title="Success Rate"
            value="96.2%"
            icon={<TrendingUp fontSize="large" />}
            color="#3B82F6"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatsCard
            title="Avg Order Value"
            value="$620"
            icon={<Speed fontSize="large" />}
            color="#9C27B0"
          />
        </Grid>
      </Grid>

      {/* Main Table */}
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ p: 3, pb: 2, display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Search by order ID, merchant, or AI source..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={handleExport}>
            Export
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Order ID</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Merchant</strong></TableCell>
                <TableCell><strong>AI Source</strong></TableCell>
                <TableCell align="right"><strong>Amount</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.orderId} hover>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {order.orderId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      size="small"
                      color={getStatusColor(order.status) as any}
                    />
                  </TableCell>
                  <TableCell>{order.merchant}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.source}
                      size="small"
                      sx={{
                        bgcolor: `${getSourceColor(order.source)}15`,
                        color: getSourceColor(order.source),
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={600}>
                      ${order.amount.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Bottom Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Order Status Flow (SAGA State Machine)
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Stepper activeStep={2} alternativeLabel>
                {orderSteps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
                Current step: Processing
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Top Merchants by Orders
            </Typography>
            <List>
              {topMerchants.map((merchant, index) => (
                <ListItem key={merchant.name} divider={index < topMerchants.length - 1}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1" fontWeight={600}>
                          {merchant.name}
                        </Typography>
                        <Chip label={`${merchant.orders} orders`} size="small" color="primary" />
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        Revenue: ${(merchant.revenue / 1000).toFixed(1)}K
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
