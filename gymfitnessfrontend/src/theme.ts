import { ThemeOptions } from '@mui/material/styles';

// Define base typography that might be shared
const baseTypography: Partial<ThemeOptions['typography']> = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Body font
  h1: { fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif', fontWeight: 700, fontSize: '2.5rem' },
  h2: { fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif', fontWeight: 600, fontSize: '2rem' },
  h3: { fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif', fontWeight: 600, fontSize: '1.75rem' },
  h4: { fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif', fontWeight: 500, fontSize: '1.5rem' },
  h5: { fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif', fontWeight: 500, fontSize: '1.25rem' },
  h6: { fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif', fontWeight: 500, fontSize: '1rem' },
  body1: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', fontSize: '1rem' },
  body2: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', fontSize: '0.875rem' },
  button: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', fontWeight: 500 },
};

export const getAppTheme = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? { // Light Mode
          primary: { main: '#007BFF' /* Vibrant Blue */ },
          secondary: { main: '#17A2B8' /* Teal */ },
          background: { default: '#FFFFFF', paper: '#F5F5F5' },
          text: { primary: '#212121', secondary: '#757575' },
          error: { main: '#d32f2f' }, // Standard MUI red
          warning: { main: '#ffa000' }, // Standard MUI orange
          info: { main: '#1976d2' }, // Standard MUI blue
          success: { main: '#388e3c' }, // Standard MUI green
        }
      : { // Dark Mode
          primary: { main: '#3B9DFF' /* Lighter Blue for Dark Mode */ },
          secondary: { main: '#26C6DA' /* Lighter Teal for Dark Mode */ },
          background: { default: '#121212', paper: '#1E1E1E' },
          text: { primary: '#FFFFFF', secondary: '#BDBDBD' },
          error: { main: '#ef5350' }, // Lighter red for dark mode
          warning: { main: '#ffb74d' }, // Lighter orange for dark mode
          info: { main: '#64b5f6' }, // Lighter blue for dark mode
          success: { main: '#81c784' }, // Lighter green for dark mode
        }),
  },
  typography: baseTypography,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Keep button text case as defined
          borderRadius: '8px', // Slightly more rounded buttons
        },
        containedPrimary: {
          // Example: specific styling for containedPrimary buttons
          // color: mode === 'light' ? '#FFFFFF' : '#000000',
        },
      },
    },
    MuiAppBar: {
        styleOverrides: {
            root: {
                // Example: ensure AppBar color is consistent with palette
                // It will use palette.primary.main by default if color="primary"
                // or palette.background.paper if color="default"
            }
        }
    }
    // Further component overrides can be added here
  }
});
