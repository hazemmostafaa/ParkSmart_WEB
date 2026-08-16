import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#071F3D',
      light: '#0C2F58',
      dark: '#041226',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#0FB9AF',
      light: '#16D4C4',
      dark: '#057D7A',
      contrastText: '#031B1A'
    },
    background: {
      default: '#F5F8FB',
      paper: '#FFFFFF'
    },
    success: { main: '#10B981' },
    warning: { main: '#F59E0B' },
    error: { main: '#EF4444' },
    info: { main: '#2563EB' }
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontWeight: 800, letterSpacing: 0 },
    h2: { fontWeight: 800, letterSpacing: 0 },
    h3: { fontWeight: 800, letterSpacing: 0 },
    h4: { fontWeight: 800, letterSpacing: 0 },
    h5: { fontWeight: 750, letterSpacing: 0 },
    h6: { fontWeight: 750, letterSpacing: 0 },
    button: { textTransform: 'none', fontWeight: 750, letterSpacing: 0 }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(7, 31, 61, 0.08)',
          boxShadow: '0 18px 42px rgba(7, 31, 61, 0.08)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 38
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 750
        }
      }
    }
  }
});
