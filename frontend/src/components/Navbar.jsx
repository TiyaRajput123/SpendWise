import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Box,
  Typography,
  useTheme,
  alpha,
  Tooltip,
} from '@mui/material';
import {
  MenuRounded,
  SearchRounded,
  LightModeRounded,
  DarkModeRounded,
  AccountCircleRounded,
} from '@mui/icons-material';

export default function Navbar({
  handleDrawerToggle,
  darkMode,
  toggleDarkMode,
  searchQuery,
  setSearchQuery,
}) {
  const theme = useTheme();

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - 260px)` },
        ml: { md: `260px` },
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
        {/* Mobile menu toggle */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuRounded />
        </IconButton>

        {/* Brand name for Mobile view */}
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            display: { xs: 'block', md: 'none' },
            fontWeight: 800,
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mr: 2,
          }}
        >
          SpendWise
        </Typography>

        {/* Search Bar */}
        <Box
          sx={{
            position: 'relative',
            borderRadius: '10px',
            backgroundColor: theme.palette.mode === 'light'
              ? alpha(theme.palette.primary.main, 0.05)
              : alpha(theme.palette.common.white, 0.05),
            '&:hover': {
              backgroundColor: theme.palette.mode === 'light'
                ? alpha(theme.palette.primary.main, 0.08)
                : alpha(theme.palette.common.white, 0.08),
            },
            marginRight: 2,
            marginLeft: 0,
            width: '100%',
            maxWidth: { xs: '180px', sm: '320px' },
            display: 'flex',
            alignItems: 'center',
            transition: 'width 0.3s ease',
          }}
        >
          <Box
            sx={{
              padding: '0 12px',
              height: '100%',
              position: 'absolute',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
            }}
          >
            <SearchRounded sx={{ fontSize: 20 }} />
          </Box>
          <InputBase
            placeholder="Search by category or note..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              color: 'inherit',
              width: '100%',
              '& .MuiInputBase-input': {
                padding: '8px 8px 8px 0',
                paddingLeft: '40px',
                fontSize: '0.875rem',
                width: '100%',
              },
            }}
          />
        </Box>

        {/* Action Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Light/Dark mode switch */}
          <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton onClick={toggleDarkMode} color="inherit" sx={{ p: 1 }}>
              {darkMode ? (
                <LightModeRounded sx={{ color: '#fbbf24', transition: 'transform 0.4s ease' }} />
              ) : (
                <DarkModeRounded sx={{ color: '#6366f1', transition: 'transform 0.4s ease' }} />
              )}
            </IconButton>
          </Tooltip>

          {/* Dummy User Profile */}
          <IconButton color="inherit" sx={{ p: 0.5, ml: 0.5 }}>
            <AccountCircleRounded sx={{ fontSize: 28, color: 'text.secondary' }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
