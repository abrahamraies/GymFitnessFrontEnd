import React from 'react';
// import styles from './Footer.module.css'; // To be cleaned up
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

const Footer: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        // Using theme.palette.background.paper for a distinct but theme-aware background
        backgroundColor: theme.palette.background.paper, 
        color: theme.palette.text.secondary, // Secondary text color for footer content
        py: { xs: 2, md: 3 }, // Responsive padding top and bottom
        mt: 'auto', // Pushes footer to the bottom if main content is short (requires parent flex layout)
                    // For a simple non-sticky footer, mt: theme.spacing(4) or similar might be used.
                    // Assuming a layout where 'auto' works or main content is usually taller.
        textAlign: 'center',
        borderTop: `1px solid ${theme.palette.divider}`, // Subtle top border
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Gym & Fitness Guide. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
