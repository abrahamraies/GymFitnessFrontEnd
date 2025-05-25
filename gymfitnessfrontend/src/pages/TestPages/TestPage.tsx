import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TestPage.module.css';
import { useTranslation } from 'react-i18next';
import { FaPlay, FaUser } from 'react-icons/fa';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// import { useTheme } from '@mui/material/styles'; // Not strictly needed if using theme palette strings

const APPBAR_HEIGHT = '64px'; // Approximate height of the AppBar

const TestPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // const theme = useTheme(); // Uncomment if direct theme access is needed beyond what sx props provide

  const handleStartTest = () => {
    navigate('/test/start');
  };

  const handleProfileSelection = () => {
    navigate('/test/categories');
  };

  return (
    <Box
      component="main" // Use Box as the main container
      className={styles.pageContainer} // Keep for any specific overall page tweaks if needed
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: `calc(100vh - ${APPBAR_HEIGHT})`,
        py: { xs: 4, md: 6 }, // Vertical padding
        px: 2, // Horizontal padding
        bgcolor: 'background.default', // Use theme's default background
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Typography
          variant="h3" // Or h2, depending on desired impact
          component="h1"
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 2 }} // Poppins font will be applied by theme
        >
          {t('test.welcome')}
        </Typography>
        <Typography
          variant="h6" // Or subtitle1
          color="text.secondary"
          sx={{ mb: { xs: 4, md: 6 } }} // Roboto font will be applied by theme
        >
          {t('test.description')}
        </Typography>

        <Box
          // className={styles.buttonContainer} // Replaced by sx props below
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'center',
            alignItems: 'center',
            gap: { xs: 2, sm: 3 }, // Consistent gap
            mt: 4, // Keep or adjust margin top
          }}
        >
          <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<FaPlay />}
          onClick={handleStartTest}
          sx={{ minWidth: '220px', py: 1.5 }} // Padding and min-width
        >
          {t('test.startTest')}
        </Button>
        <Button
          variant="outlined" // Using outlined for secondary action
          color="secondary"
          size="large"
          startIcon={<FaUser />}
          onClick={handleProfileSelection}
          sx={{ minWidth: '220px', py: 1.5 }} // Padding and min-width
        >
          {t('test.knowProfile')}
        </Button>
      </Box>
    </main>
  );
};

export default TestPage;
