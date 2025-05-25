import React from 'react';
import styles from './FeatureItem.module.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

interface FeatureItemProps {
  Icon: React.ElementType;
  text: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ Icon, text }) => {
  const theme = useTheme();

  return (
    <Card
      className={styles.featureCard} // Keep for potential minor overrides not easily done with sx
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        p: 2,
        boxShadow: theme.shadows[2], // Apply a subtle shadow
        '&:hover': {
          boxShadow: theme.shadows[4], // Slightly more pronounced shadow on hover
          transform: 'translateY(-4px)', // Lift effect
        },
        transition: theme.transitions.create(['box-shadow', 'transform'], {
          duration: theme.transitions.duration.short,
        }),
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Box className={styles.iconContainer} sx={{ mb: 2, color: theme.palette.primary.main }}>
          <Icon size={48} aria-hidden="true" /> 
        </Box>
        <Typography variant="body1" component="p" className={styles.featureText}>
          {text}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FeatureItem;
