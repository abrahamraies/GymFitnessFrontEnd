import './App.css';
import AppRoutes from './routes/AppRoutes';
import { useContext } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeContext } from './utils/context/ThemeContext'; // Your existing context
import { getAppTheme } from './theme'; // Your new theme configuration

function App() {
  const { theme } = useContext(ThemeContext)!; // Get current mode ('light' | 'dark')

  // Create MUI theme based on the current mode
  const muiTheme = createTheme(getAppTheme(theme));

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline /> {/* Normalizes styles and applies background based on theme */}
      <AppRoutes />
    </MuiThemeProvider>
  );
}

export default App;
