import { createTheme } from '@mui/material/styles';

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light Mode Palette
          primary: {
            main: '#4f46e5', // Indigo
            light: '#818cf8',
            dark: '#3730a3',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#9333ea', // Purple
            light: '#c084fc',
            dark: '#6b21a8',
          },
          background: {
            default: '#f8fafc', // Slate 50
            paper: '#ffffff',
            sidebar: '#ffffff',
            glass: 'rgba(255, 255, 255, 0.7)',
          },
          text: {
            primary: '#0f172a', // Slate 900
            secondary: '#64748b', // Slate 500
          },
          divider: '#e2e8f0', // Slate 200
        }
      : {
          // Dark Mode Palette
          primary: {
            main: '#6366f1', // Indigo
            light: '#a5b4fc',
            dark: '#4338ca',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#a855f7', // Purple
            light: '#d8b4fe',
            dark: '#7e22ce',
          },
          background: {
            default: '#0b0f19', // Premium Deep Navy/Slate
            paper: '#131c2e', // Slate 900 tint
            sidebar: '#0d1527',
            glass: 'rgba(19, 28, 46, 0.6)',
          },
          text: {
            primary: '#f8fafc', // Slate 50
            secondary: '#94a3b8', // Slate 400
          },
          divider: '#1e293b', // Slate 800
        }),
    info: {
      main: '#3b82f6', // Blue
    },
    success: {
      main: '#10b981', // Emerald 500
    },
    warning: {
      main: '#f59e0b', // Amber 500
    },
    error: {
      main: '#ef4444', // Red 500
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
    },
    body1: {
      fontSize: '0.925rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.85rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '6px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          background: mode === 'light'
            ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)'
            : 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
          '&:hover': {
            background: mode === 'light'
              ? 'linear-gradient(135deg, #3730a3 0%, #4f46e5 100%)'
              : 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #7e22ce 0%, #9333ea 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: mode === 'light' ? '1px solid #e2e8f0' : '1px solid #1e293b',
          boxShadow: mode === 'light'
            ? '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.02)'
            : '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.1)',
          background: mode === 'light' ? '#ffffff' : '#131c2e',
          backgroundImage: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: mode === 'light' ? '#f8fafc' : '#0d1527',
          color: mode === 'light' ? '#64748b' : '#94a3b8',
          borderBottom: mode === 'light' ? '1px solid #e2e8f0' : '1px solid #1e293b',
        },
        body: {
          borderBottom: mode === 'light' ? '1px solid #e2e8f0' : '1px solid #1e293b',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(11, 15, 25, 0.8)',
          backdropFilter: 'blur(8px)',
          borderBottom: mode === 'light' ? '1px solid #e2e8f0' : '1px solid #1e293b',
          boxShadow: 'none',
          color: mode === 'light' ? '#0f172a' : '#f8fafc',
        },
      },
    },
  },
});
