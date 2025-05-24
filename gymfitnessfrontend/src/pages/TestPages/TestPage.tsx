import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TestPage.module.css';
import { useTranslation } from 'react-i18next';
import { FaPlay, FaUser } from 'react-icons/fa';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const TestPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleStartTest = () => {
    navigate('/test/start');
  };

  const handleProfileSelection = () => {
    navigate('/test/categories');
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1>{t('test.welcome')}</h1>
        <p className={styles.subtitle}>{t('test.description')}</p>
      </header>

      <Box
        className={styles.buttonContainer}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' }, // Stack on xs, row on sm and up
          gap: 2, // Consistent gap
          mt: 4, // Margin top
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
