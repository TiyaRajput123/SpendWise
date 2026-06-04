import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import {
  DashboardRounded,
  ReceiptLongRounded,
  AccountBalanceWalletRounded,
  AutoAwesomeRounded,
  ChevronLeftRounded,
} from '@mui/icons-material';

const sidebarWidth = 260;

const menuItems = [
  { text: 'Dashboard', path: '/', icon: <DashboardRounded /> },
  { text: 'Expenses', path: '/expenses', icon: <ReceiptLongRounded /> },
  { text: 'Budgets', path: '/budgets', icon: <AccountBalanceWalletRounded /> },
  { text: 'AI Insights', path: '/insights', icon: <AutoAwesomeRounded /> },
];

export default function Sidebar({ mobileOpen, handleDrawerToggle }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile && mobileOpen) {
      handleDrawerToggle();
    }
  };

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#0d1527',
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Brand Logo Header */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Logo icon */}
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)',
            }}
          >
            <AccountBalanceWalletRounded sx={{ fontSize: 18 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.5px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            SpendWise
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftRounded />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ mx: 2, opacity: 0.6 }} />

      {/* Navigation Links */}
      <List sx={{ px: 2, py: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: '10px',
                  py: 1.2,
                  px: 2,
                  transition: 'all 0.2s ease-in-out',
                  backgroundColor: isActive
                    ? theme.palette.mode === 'light'
                      ? 'rgba(79, 70, 229, 0.08)'
                      : 'rgba(99, 102, 241, 0.15)'
                    : 'transparent',
                  color: isActive
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'light'
                      ? 'rgba(0, 0, 0, 0.02)'
                      : 'rgba(255, 255, 255, 0.02)',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                    transition: 'color 0.2s',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Optional User profile / Footer info inside sidebar */}
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: '12px',
            background: theme.palette.mode === 'light'
              ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
            border: `1px solid ${
              theme.palette.mode === 'light' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.2)'
            }`,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
            Personal Account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Single User Mode
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: sidebarWidth }, flexShrink: { md: 0 } }}
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }} // Better open performance on mobile
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: sidebarWidth,
            boxShadow: '8px 0 24px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: sidebarWidth,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
export { sidebarWidth };
