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
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalOffer as LocalOfferIcon,
  TrendingUp,
  Inventory2,
  Store,
  AttachMoney,
  Warning as WarningIcon,
} from '@mui/icons-material';

// Mock data
const mockOffers = [
  {
    sku: 'SN-QUEEN-001',
    productName: 'SweetNight Queen Mattress',
    merchant: 'Amazon',
    price: 599.99,
    stock: 45,
    availability: 'In Stock',
  },
  {
    sku: 'SN-KING-002',
    productName: 'SweetNight King Mattress Premium',
    merchant: 'Walmart',
    price: 799.99,
    stock: 12,
    availability: 'Low Stock',
  },
  {
    sku: 'SN-TWIN-003',
    productName: 'SweetNight Twin Mattress',
    merchant: 'Target',
    price: 399.99,
    stock: 0,
    availability: 'Out of Stock',
  },
  {
    sku: 'SN-FULL-004',
    productName: 'SweetNight Full Mattress Deluxe',
    merchant: 'Amazon',
    price: 499.99,
    stock: 28,
    availability: 'In Stock',
  },
  {
    sku: 'SN-CKING-005',
    productName: 'SweetNight California King',
    merchant: 'Wayfair',
    price: 899.99,
    stock: 8,
    availability: 'Low Stock',
  },
];

const topProducts = [
  { name: 'SweetNight Queen Mattress', offers: 24, avgPrice: 584.99 },
  { name: 'SweetNight King Premium', offers: 18, avgPrice: 789.99 },
  { name: 'SweetNight Twin Mattress', offers: 15, avgPrice: 394.99 },
];

const inventoryAlerts = [
  { sku: 'SN-KING-002', product: 'King Mattress Premium', stock: 12, status: 'Low Stock' },
  { sku: 'SN-TWIN-003', product: 'Twin Mattress', stock: 0, status: 'Out of Stock' },
  { sku: 'SN-CKING-005', product: 'California King', stock: 8, status: 'Low Stock' },
];

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

function StatsCard({ title, value, icon, color }: StatsCardProps) {
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

export default function Offers() {
  const [searchQuery, setSearchQuery] = useState('');

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'In Stock':
        return 'success';
      case 'Low Stock':
        return 'warning';
      case 'Out of Stock':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredOffers = mockOffers.filter(
    (offer) =>
      offer.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.merchant.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              bgcolor: '#9C27B015',
              color: '#9C27B0',
            }}
          >
            <LocalOfferIcon fontSize="large" />
          </Box>
          <Box>
            <Typography variant="h4" component="h1" fontWeight={600}>
              Offers
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage merchant offers and pricing across platforms
            </Typography>
          </Box>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} size="large">
          Create Offer
        </Button>
      </Box>

      {/* Demo Mode Banner */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Demo Mode:</strong> This page displays mock offer data. In production, data will sync from merchant platforms (Amazon, Walmart, etc.)
        </Typography>
      </Alert>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Total Offers" value={156} icon={<TrendingUp fontSize="large" />} color="#9C27B0" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Active Offers" value={145} icon={<Inventory2 fontSize="large" />} color="#10B981" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Merchants" value={8} icon={<Store fontSize="large" />} color="#3B82F6" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Avg Price" value="$584" icon={<AttachMoney fontSize="large" />} color="#F59E0B" />
        </Grid>
      </Grid>

      {/* Main Table */}
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ p: 3, pb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search by product name, SKU, or merchant..."
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
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>SKU</strong></TableCell>
                <TableCell><strong>Product</strong></TableCell>
                <TableCell><strong>Merchant</strong></TableCell>
                <TableCell align="right"><strong>Price</strong></TableCell>
                <TableCell align="right"><strong>Stock</strong></TableCell>
                <TableCell><strong>Availability</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOffers.map((offer) => (
                <TableRow key={offer.sku} hover>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {offer.sku}
                    </Typography>
                  </TableCell>
                  <TableCell>{offer.productName}</TableCell>
                  <TableCell>
                    <Chip label={offer.merchant} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={600}>
                      ${offer.price.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{offer.stock}</TableCell>
                  <TableCell>
                    <Chip
                      label={offer.availability}
                      size="small"
                      color={getAvailabilityColor(offer.availability) as any}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="primary">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <DeleteIcon fontSize="small" />
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
              Top Products by Offer Count
            </Typography>
            <List>
              {topProducts.map((product, index) => (
                <ListItem key={index} divider={index < topProducts.length - 1}>
                  <ListItemText
                    primary={product.name}
                    secondary={`${product.offers} offers • Avg: $${product.avgPrice.toFixed(2)}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningIcon color="warning" />
              Inventory Alerts
            </Typography>
            <List>
              {inventoryAlerts.map((alert, index) => (
                <ListItem key={alert.sku} divider={index < inventoryAlerts.length - 1}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontFamily="monospace">
                          {alert.sku}
                        </Typography>
                        <Typography variant="body2">- {alert.product}</Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Typography variant="caption">Stock: {alert.stock}</Typography>
                        <Chip
                          label={alert.status}
                          size="small"
                          color={alert.stock === 0 ? 'error' : 'warning'}
                        />
                      </Box>
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
