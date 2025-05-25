import React from 'react';
import styles from './HomePage.module.css'; // Will be mostly unused for Hero, but kept for other sections for now
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FaDumbbell, FaClipboardList, FaChartLine } from 'react-icons/fa';
import FeatureItem from '../../components/FeatureItem/FeatureItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles'; // To access theme properties
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper'; // For step backgrounds if desired
import { FaQuestionCircle, FaUserCheck, FaTasks } from 'react-icons/fa'; // Example icons

const featuresData = [
  {
    id: 'personalized',
    textKey: 'home.featureList.0',
    IconComponent: FaDumbbell,
  },
  {
    id: 'progress',
    textKey: 'home.featureList.1',
    IconComponent: FaClipboardList,
  },
  {
    id: 'adaptive',
    textKey: 'home.featureList.2',
    IconComponent: FaChartLine,
  },
];

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme(); // Access the current theme

  const handleStartTest = () => {
    navigate('/test/start');
  };

  const howItWorksSteps = [
    {
      id: 'step1',
      icon: <FaQuestionCircle size={40} color={theme.palette.primary.main} />,
      titleKey: 'home.howItWorksSteps.step1.title',
      descriptionKey: 'home.howItWorksSteps.step1.description',
    },
    {
      id: 'step2',
      icon: <FaUserCheck size={40} color={theme.palette.primary.main} />,
      titleKey: 'home.howItWorksSteps.step2.title',
      descriptionKey: 'home.howItWorksSteps.step2.description',
    },
    {
      id: 'step3',
      icon: <FaTasks size={40} color={theme.palette.primary.main} />,
      titleKey: 'home.howItWorksSteps.step3.title',
      descriptionKey: 'home.howItWorksSteps.step3.description',
    },
  ];

  return (
    <main> {/* Removed styles.container, MUI Container below handles width */}
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900], // Subtle background
          py: { xs: 6, md: 10 }, // Vertical padding
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md"> {/* Constrain content width */}
          <Typography
            variant="h2" // Large and impactful
            component="h1" // Semantic H1 for the page title
            gutterBottom
            sx={{ fontWeight: 700, mb: 2 }}
          >
            {t('home.hero.title')}
          </Typography>
          <Typography
            variant="h5"
            component="p"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            {t('home.hero.tagline')}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleStartTest}
            sx={{ py: 1.5, px: 4 }} // Make button a bit larger
          >
            {t('home.startTest')}
          </Button>
        </Container>
      </Box>

      {/* "How It Works" Section */}
      <Container sx={{ py: { xs: 4, md: 8 } }} maxWidth="lg">
        <Box component="section" sx={{ textAlign: 'center' }}> {/* Removed className={styles.howItWorksSection} */}
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 1 /* fontWeight: 'bold' removed to use theme default */ }}>
            {t('home.howItWorks')}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 6, maxWidth: '700px', margin: 'auto' }}>
            {t('home.instructions')} 
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {howItWorksSteps.map((step) => (
              <Grid item xs={12} sm={6} md={4} key={step.id}>
                <Paper
                  elevation={2} // Subtle shadow
                  sx={{
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%', // Make papers of equal height in a row
                    bgcolor: theme.palette.mode === 'light' ? 'background.paper' : theme.palette.grey[800],
                  }}
                >
                  <Box sx={{ mb: 2 }}>{step.icon}</Box>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'medium' }}>
                    {t(step.titleKey)}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ flexGrow: 1 }}>
                    {t(step.descriptionKey)}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Box className={styles.buttonContainer} sx={{ mt: 6 }}> {/* Re-use buttonContainer class for centering for now */}
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleStartTest}
              sx={{ py: 1.5, px: 4 }}
            >
              {t('home.startTest')}
            </Button>
          </Box>
        </Box>

        <Box component="section" sx={{ mt: 8, textAlign: 'center' }}> {/* Removed className={styles.featureSection} */}
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 6 /* fontWeight: 'bold' removed to use theme default */ }}>
            {t('home.features')}
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {featuresData.map((feature) => (
              <Grid item xs={12} sm={6} md={4} key={feature.id}>
                <FeatureItem
                  Icon={feature.IconComponent}
                  text={t(feature.textKey)}
                />
              </Grid>
            ))}
          </Grid>
        </section>
      </Container>
    </main>
  );
};

export default HomePage;
