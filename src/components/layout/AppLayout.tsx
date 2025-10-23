import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';

const SIDEBAR_WIDTH = 280;

export default function AppLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        {/* Header */}
        <Header />

        {/* Content with spacing for fixed header */}
        <Toolbar /> {/* Spacer for AppBar */}

        {/* Page content */}
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
