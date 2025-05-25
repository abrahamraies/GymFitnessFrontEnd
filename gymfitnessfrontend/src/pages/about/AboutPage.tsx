import React from 'react';
import { useTranslation } from 'react-i18next';
// import styles from './AboutPage.module.css'; // To be cleaned up
import { FaCheckCircle } from 'react-icons/fa';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper'; // For the main content area
// import { useTheme } from '@mui/material/styles';

const APPBAR_HEIGHT = '64px'; // Adjust if your AppBar height is different

const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  // const theme = useTheme(); // For direct theme access if needed

  // Refactor about.intro
  const introText = t('about.intro');
  const strongRegex = /<strong>(.*?)<\/strong>/;
  const match = introText.match(strongRegex);

  let introParts: React.ReactNode[] = [];
  if (match) {
    const beforeStrong = introText.substring(0, match.index);
    const strongContent = match[1];
    const afterStrong = introText.substring(match.index! + match[0].length);
    introParts = [
      <React.Fragment key="intro-start">{beforeStrong}</React.Fragment>,
      <Typography component="span" fontWeight="bold" key="intro-strong">{strongContent}</Typography>,
      <React.Fragment key="intro-end">{afterStrong}</React.Fragment>
    ];
  } else {
    introParts = [<React.Fragment key="intro-full">{introText}</React.Fragment>];
  }
  

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: { xs: 4, md: 6 },
        px: 2,
        bgcolor: 'background.default',
        minHeight: `calc(100vh - ${APPBAR_HEIGHT})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h3"
          component="h1"
          sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}
        >
          {t('about.header')}
        </Typography>

        <Paper elevation={2} sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Typography variant="body1" sx={{ mb: 2 }} component="div"> {/* component="div" because introParts can be an array */}
            {introParts}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {t('about.mission')}
          </Typography>

          <Box component="section" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: '600' }}>
              {t('about.whyChooseUs')}
            </Typography>
            <List>
              {(t('about.features', { returnObjects: true }) as string[]).map(
                (feature: string, index: number) => (
                  <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 'auto', mr: 1.5, color: 'success.main' }}> {/* Adjusted minWidth and margin */}
                      <FaCheckCircle size={20} />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                )
              )}
            </List>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AboutPage;
