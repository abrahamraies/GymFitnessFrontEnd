import React, { useContext, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom'; // Renamed to avoid conflict
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../../../utils/context/ThemeContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
// It's good practice to ensure LanguageIcon is imported if used, or a suitable alternative
// For now, we'll use text for language toggle in the drawer as well.
// import LanguageIcon from '@mui/icons-material/Language';


const navItems = [
  { labelKey: 'navbar.home', path: '/' },
  { labelKey: 'Test', path: '/test' }, // Assuming 'Test' doesn't need translation or is a proper name
  { labelKey: 'navbar.about', path: '/about' },
];

const NavBar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useContext(ThemeContext)!;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLanguage);
  };

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{ textAlign: 'center', width: 250, pt: 2 }} // Added padding top
    >
      <Typography variant="h6" sx={{ mb: 2 }}> {/* Adjusted margin bottom */}
        Gym & Fitness
      </Typography>
      <Divider sx={{ mb: 1 }} /> {/* Added margin bottom */}
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton component={RouterLink} to={item.path}>
              <ListItemText primary={t(item.labelKey)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={toggleLanguage} sx={{ justifyContent: 'center' }}>
            <ListItemText primary={t('navbar.changeLanguage')} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={toggleTheme} sx={{ justifyContent: 'center' }}>
            <ListItemText
              primary={theme === 'light' ? t('navbar.darkMode') : t('navbar.lightMode')}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const currentTheme = useTheme(); // For accessing theme palette directly for hover effects

  return (
    <>
      <AppBar component="nav" position="static" color="primary"> {/* Uses theme.palette.primary.main */}
        <Toolbar>
          <IconButton
            color="inherit" // Inherits primary.contrastText
            aria-label={t('navbar.openDrawerAriaLabel')}
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }} // Ensure visibility on small screens
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              color: 'inherit', // Inherits primary.contrastText
              textDecoration: 'none',
              fontFamily: theme === 'light' ? currentTheme.typography.h6.fontFamily : currentTheme.typography.h6.fontFamily, // Explicitly Poppins
              fontWeight: theme === 'light' ? currentTheme.typography.h6.fontWeight : currentTheme.typography.h6.fontWeight,
              '&:hover': {
                // No specific color change on hover, rely on inherit or add subtle opacity/brightness if needed
              },
              display: { xs: 'block', sm: 'block' } 
            }}
          >
            Gym & Fitness Guide
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}> {/* Reduced gap slightly */}
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={RouterLink}
                to={item.path}
                color="inherit" // Inherits primary.contrastText
                sx={{ 
                  my: 1, 
                  px: 1.5, 
                  '&:hover': { 
                    backgroundColor: currentTheme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)', // Subtle hover
                  } 
                }}
              >
                {t(item.labelKey)}
              </Button>
            ))}
            <Button
              color="inherit" // Inherits primary.contrastText
              onClick={toggleLanguage}
              sx={{ 
                my: 1, 
                px: 1.5, 
                '&:hover': { 
                  backgroundColor: currentTheme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                } 
              }}
            >
              {i18n.language.toUpperCase()}
            </Button>
            <IconButton
              onClick={toggleTheme}
              color="inherit" // Inherits primary.contrastText
              sx={{ 
                my: 1, 
                px: 1.5, 
                '&:hover': { 
                  backgroundColor: currentTheme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                } 
              }}
            >
              {theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          PaperProps={{
            sx: { 
              backgroundColor: currentTheme.palette.background.paper, // Use theme's paper color
              width: 250 
            } 
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box' }, // Width is now in PaperProps
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default NavBar;
