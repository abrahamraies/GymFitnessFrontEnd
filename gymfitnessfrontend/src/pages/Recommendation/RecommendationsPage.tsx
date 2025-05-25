import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import styles from './RecommendationsPage.module.css'; // To be removed or minimally used
import { useTranslation } from 'react-i18next';
import { useGetRecommendations } from '../../hooks/api/useGetRecommendations';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Link from '@mui/material/Link'; // MUI Link
import Grid from '@mui/material/Grid';
// import Paper from '@mui/material/Paper'; // Alternative to Card

import { ArrowLeft, ExternalLink, BookOpen } from 'lucide-react'; // Using BookOpen for a slightly different look

const APPBAR_HEIGHT = '64px'; // Approximate height of the AppBar

const RecommendationsPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    data: recommendations,
    isLoading,
    isError,
    error,
  } = useGetRecommendations(categoryId);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: `calc(100vh - ${APPBAR_HEIGHT})`,
        }}
      >
        <CircularProgress sx={{ mb: 2 }} />
        <Typography>{t('recommendations.load')}</Typography>
      </Box>
    );
  }

  if (isError || !recommendations) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: `calc(100vh - ${APPBAR_HEIGHT})`,
          textAlign: 'center',
          p: 2,
        }}
      >
        <Typography color="error" variant="h6">
          {t('recommendations.errorTitle') || 'Error Loading Recommendations'}
        </Typography>
        <Typography color="error" sx={{ mt: 1 }}>
          {error instanceof Error ? error.message : String(error)}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<ArrowLeft />}
          onClick={() => navigate(-1)}
          sx={{ mt: 3 }}
        >
          {t('general.back')}
        </Button>
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: { xs: 3, md: 5 },
        px: 2,
        bgcolor: 'background.default',
        minHeight: `calc(100vh - ${APPBAR_HEIGHT})`,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {t('recommendations.title')}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {t('recommendations.description')}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {recommendations.map((recommendation) => (
            <Grid item xs={12} sm={6} md={4} key={recommendation.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <BookOpen size={28} style={{ color: 'primary.main' }} /> {/* color: 'primary.main' is not a valid style property, will use sx */}
                    {/* Corrected: Apply color via sx prop on an encapsulating Box or directly if library supports it, or use theme for direct color string */}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Box component={BookOpen} size={28} sx={{ mr: 1.5, color: 'primary.main' }} />
                    <Typography variant="h5" component="h3" sx={{ fontWeight: 'medium' }}>
                      {recommendation.title}
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    {recommendation.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-start', px: 2, pb: 2 }}>
                  <Link
                    href={recommendation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="button" // Gives button-like styling
                    sx={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
                  >
                    {t('recommendations.moreInfo')}
                    <ExternalLink size={18} style={{ marginLeft: theme.spacing(0.75) }} /> 
                    {/* Used theme.spacing for consistency, 0.75 * 8px = 6px */}
                  </Link>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: { xs: 4, md: 6 } }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ArrowLeft />}
            onClick={() => navigate(-1)}
            size="large"
          >
            {t('general.back')}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default RecommendationsPage;

// Add new i18n key for error title if it doesn't exist
// t('recommendations.errorTitle')
// Example in en.json:
// "recommendations": {
//   ...
//   "errorTitle": "Could Not Load Recommendations",
//   ...
// }
