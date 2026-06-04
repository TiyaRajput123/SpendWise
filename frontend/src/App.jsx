import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Toaster } from 'react-hot-toast';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Budgets from './pages/Budgets';
import AIInsights from './pages/AIInsights';
import { getDesignTokens } from './theme/theme';

export default function App() {
  // Retrieve theme preference from localStorage, default to light
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('spendwise-theme');
    return saved ? JSON.parse(saved) : false;
  });

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newVal = !prev;
      localStorage.setItem('spendwise-theme', JSON.stringify(newVal));
      return newVal;
    });
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Generate MUI Theme dynamically based on darkMode setting
  const theme = useMemo(
    () => createTheme(getDesignTokens(darkMode ? 'dark' : 'light')),
    [darkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
            borderRadius: '10px',
            fontSize: '0.875rem',
            fontWeight: 500,
            background: darkMode ? '#131c2e' : '#ffffff',
            color: darkMode ? '#f8fafc' : '#0f172a',
            border: `1px solid ${theme.palette.divider}`,
          },
        }}
      />
      <Router>
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
          <Navbar
            handleDrawerToggle={handleDrawerToggle}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: { xs: 2.5, sm: 4 },
              width: { md: `calc(100% - 260px)` },
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              transition: 'background-color 0.3s ease',
            }}
          >
            <Toolbar /> {/* Top padding offset for fixed Navbar */}
            <Box sx={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/expenses" element={<Expenses searchQuery={searchQuery} />} />
                <Route path="/budgets" element={<Budgets />} />
                <Route path="/insights" element={<AIInsights />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}
