import { createTheme } from '@mui/material/styles';

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
          primary: { main: '#1976d2' },
          secondary: { main: '#dc004e' },
          background: { default: '#f4f6f8', paper: '#ffffff' },
        }
      : {
          // palette values for dark mode
          primary: { main: '#90caf9' },
          secondary: { main: '#f48fb1' },
          background: { default: '#121212', paper: '#1e1e1e' },
        }),
  },
  typography: {
    fontFamily: 'Inter, Roboto, sans-serif',
  },
});
