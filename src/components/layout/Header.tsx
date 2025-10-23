import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const SIDEBAR_WIDTH = 280;

export default function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
        ml: `${SIDEBAR_WIDTH}px`,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar>
        {/* Page Title - will be dynamic based on route */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div" color="text.primary">
            {/* Title will be set by individual pages */}
          </Typography>
        </Box>

        {/* Right side actions */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton color="default" size="medium">
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* User Profile */}
          <Tooltip title="Account">
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                <AccountIcon />
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 3,
              sx: {
                minWidth: 200,
                mt: 1.5,
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" color="text.primary">
                Admin User
              </Typography>
              <Typography variant="caption" color="text.secondary">
                admin@sweetnight.com
              </Typography>
            </Box>

            <Divider />

            <MenuItem onClick={handleMenuClose}>
              <AccountIcon sx={{ mr: 2, fontSize: 20 }} />
              Profile
            </MenuItem>

            <MenuItem onClick={handleMenuClose}>
              <SettingsIcon sx={{ mr: 2, fontSize: 20 }} />
              Settings
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
