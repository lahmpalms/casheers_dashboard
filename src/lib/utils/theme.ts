import { createTheme } from '@mui/material/styles';

// Create a theme instance for light mode
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ED6C1F',
      light: '#F7B589',
      dark: '#A03A00',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#2A84FC',
    },
    error: {
      main: '#F20C1A',
      light: '#FFEAEA',
    },
    warning: {
      main: '#E09E1F',
      light: '#FCF3E4',
    },
    success: {
      main: '#1AB079',
      light: '#E1F5EE',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#7F7F7F',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    divider: '#E6E6E6',
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      color: '#1A1A1A',
      fontWeight: 700,
    },
    h2: {
      color: '#1A1A1A',
      fontWeight: 700,
    },
    h3: {
      color: '#1A1A1A',
      fontWeight: 600,
    },
    h4: {
      color: '#1A1A1A',
      fontWeight: 600,
    },
    h5: {
      color: '#1A1A1A',
      fontWeight: 600,
    },
    h6: {
      color: '#1A1A1A',
      fontWeight: 600,
    },
    body1: {
      color: '#1A1A1A',
    },
    body2: {
      color: '#7F7F7F',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ED6C1F',
          color: '#FFFFFF',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #E6E6E6',
        },
      },
    },
  },
});

// Create a theme instance for dark mode
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ED6C1F',
      light: '#F7B589',
      dark: '#A03A00',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#2A84FC',
    },
    error: {
      main: '#F20C1A',
      light: '#FFEAEA',
    },
    warning: {
      main: '#E09E1F',
      light: '#FCF3E4',
    },
    success: {
      main: '#1AB079',
      light: '#E1F5EE',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#AAAAAA',
    },
    background: {
      default: '#1A1A1A',
      paper: '#2A2A2A',
    },
    divider: '#3A3A3A',
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      color: '#FFFFFF',
      fontWeight: 700,
    },
    h2: {
      color: '#FFFFFF',
      fontWeight: 700,
    },
    h3: {
      color: '#FFFFFF',
      fontWeight: 600,
    },
    h4: {
      color: '#FFFFFF',
      fontWeight: 600,
    },
    h5: {
      color: '#FFFFFF',
      fontWeight: 600,
    },
    h6: {
      color: '#FFFFFF',
      fontWeight: 600,
    },
    body1: {
      color: '#FFFFFF',
    },
    body2: {
      color: '#AAAAAA',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ED6C1F',
          color: '#FFFFFF',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2A2A2A',
          borderRight: '1px solid #3A3A3A',
        },
      },
    },
  },
}); 