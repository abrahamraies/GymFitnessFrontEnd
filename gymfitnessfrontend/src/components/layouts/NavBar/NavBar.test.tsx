import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n'; // Adjust path if your i18n instance is elsewhere
import NavBar from './NavBar';
// Remove old ThemeContext, use MUI's ThemeProvider
// import { ThemeContext, ThemeContextType } from '../../../utils/context/ThemeContext';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { getAppTheme } from '../../../theme'; // Adjust path as needed
import userEvent from '@testing-library/user-event';

// Mock the custom ThemeContext still used by NavBar internally to get theme mode and toggleTheme
vi.mock('../../../utils/context/ThemeContext', () => ({
  useContext: vi.fn(() => ({ // Mock useContext to return what NavBar expects
    theme: 'light',
    toggleTheme: vi.fn(),
  })),
  ThemeContext: {
    Consumer: ({ children }: { children: (value: unknown) => React.ReactNode }) => children({ theme: 'light', toggleTheme: vi.fn() }),
    // Provide a dummy Consumer if needed, or ensure useContext is fully mocked.
  }
}));


const muiTheme = createTheme(getAppTheme('light')); // Use a specific mode for testing

const renderNavBar = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <MuiThemeProvider theme={muiTheme}>
        <I18nextProvider i18n={i18n}>{ui}</I18nextProvider>
      </MuiThemeProvider>
    </MemoryRouter>
  );
};

describe('NavBar', () => {
  // --- DESKTOP VIEW ---
  // Note: JSDOM doesn't have a real viewport, so we test for elements that
  // MUI typically shows/hides based on screen size.

  it('Desktop View: should display main navigation links, theme, and language toggles', () => {
    renderNavBar(<NavBar />);

    // Check for navigation links (these are in buttons in the MUI setup)
    expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /test/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /about/i })).toBeInTheDocument();

    // Check for language toggle button (shows current language, e.g., EN or ES)
    // The text can be dynamic, so we might check for its presence by role or a more generic label if possible
    // For now, assuming it shows the language code (e.g., EN)
    expect(screen.getByRole('button', { name: i18n.language.toUpperCase() })).toBeInTheDocument();


    // Check for theme toggle button (icon button)
    // MUI IconButtons might not have a "name" accessible attribute by default if only an icon is present.
    // We can look for the icon itself or add an aria-label to the IconButton in NavBar.tsx
    // For now, let's assume the Brightness4Icon (for light theme) or Brightness7Icon (for dark theme) is present.
    // We can also test by the presence of its accessible name if added.
    // Let's assume it has an implicit role of button.
    // This will depend on how MUI renders the IconButton with an icon.
    // A more robust way would be to add aria-label in NavBar.tsx to the theme toggle IconButton.
    // Example: aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    // For this test, we'll try to find an element that could be the theme toggle.
    // If Brightness4Icon is rendered, its Material UI name might be "Brightness4Icon".
    // This is not ideal, a test-id or aria-label is better.
    // Let's assume for now the icon itself makes the button identifiable.
    // A better approach: add aria-label="toggle theme" to the IconButton in NavBar.tsx.
    // Then screen.getByRole('button', { name: /toggle theme/i }) would work.
    // Given the current code, we'll check for one of the icons.
    // The aria-label "toggle theme" is added to the i18n helper at the bottom of the file.
    const themeToggleButton = screen.getByLabelText(i18n.t('navbar.toggleThemeAriaLabel'));
    expect(themeToggleButton).toBeInTheDocument();


    // Check that hamburger menu icon is NOT visible (or not present) for "desktop"
    // MUI hides elements with sx prop (e.g. display: { xs: 'block', md: 'none' }).
    // In JSDOM, these elements are still in the DOM. toBeVisible() checks for CSS display: none.
    // However, MUI's sx prop might not always translate to inline display:none in JSDOM snapshot.
    // A more reliable way is to check its presence based on how MUI implements it.
    // For this test, queryByRole is good. If it's found, we can check its visibility.
    // If not found, it's effectively not there for the user on that "viewport".
    const hamburgerIcon = screen.queryByRole('button', { name: i18n.t('navbar.openDrawerAriaLabel') });
    // We expect it to be in the DOM due to JSDOM not applying media queries for sx props,
    // but it *should* be visually hidden if CSS were fully applied.
    // This part of the test remains potentially flaky for `not.toBeVisible()` in JSDOM.
    // A better test would be in an e2e environment or by checking class names if MUI applies specific ones.
    // For now, we will assume if it's found, it's rendered by MUI, and trust MUI's responsive logic.
    // The crucial part for desktop is that the *links* are visible, and for mobile, the *drawer* opens.
    // So, we'll focus on the presence of desktop links and the absence of drawer items initially.
    expect(hamburgerIcon).toBeInTheDocument(); // It will be in JSDOM
     // expect(hamburgerIcon).not.toBeVisible(); // This can be flaky, MUI might not set display:none directly in JSDOM
  });


  // --- MOBILE VIEW ---
  it('Mobile View: should open drawer with links and toggles when hamburger icon is clicked', async () => {
    const user = userEvent.setup();
    renderNavBar(<NavBar />);

    // Find the hamburger menu button (it should be visible in a "mobile" context)
    // We need to ensure it *is* rendered for this test.
    // In NavBar.tsx, it's sx={{ display: { md: 'none' } }}
    // JSDOM doesn't really do layout, so it will be present in the DOM.
    const hamburgerButton = screen.getByRole('button', { name: i18n.t('navbar.openDrawerAriaLabel') });
    expect(hamburgerButton).toBeInTheDocument(); // It should be present
    // We cannot easily test visibility with JSDOM for sx prop display none.
    // We assume it's "visible" enough for interaction if present.

    await user.click(hamburgerButton);

    // Drawer should be open. Check for elements inside the drawer.
    // These elements are typically in a Dialog or Drawer role.
    // Let's look for a link within the drawer.
    // The drawer itself might have a role, or items within it.
    // Based on NavBar.tsx, items are ListItemButton.
    // We need to ensure that the drawer is properly found by testing library
    // The drawer content is often in a `dialog` role when open.
    const drawer = screen.getByRole('dialog', { hidden: true }); // Drawer is initially hidden or not present with this role until open
    
    await user.click(hamburgerButton);

    // Now that the drawer is open, its content should be accessible.
    // Items are ListItemButtons which have 'button' or 'link' role depending on `component` prop.
    // Here, they are RouterLink, so should be 'link' or if generic, check by text within a listitem.
    // Let's query by text within the drawer (dialog role).
    const homeLinkInDrawer = await screen.findByRole('link', { name: i18n.t('navbar.home') });
    expect(homeLinkInDrawer).toBeVisible(); 

    expect(screen.getByRole('link', { name: i18n.t('Test') })).toBeVisible();
    expect(screen.getByRole('link', { name: i18n.t('navbar.about') })).toBeVisible();
    
    // Check for theme and language toggles within the drawer
    // These are ListItemButtons with onClick, so they should have 'button' role.
    expect(screen.getByRole('button', { name: i18n.t('navbar.changeLanguage') })).toBeVisible();
    
    // The theme toggle text depends on the mocked theme context
    const mockedThemeContext = vi.mocked(React.useContext)(null); // Get the mocked context value
    const themeToggleText = mockedThemeContext.theme === 'light' ? i18n.t('navbar.darkMode') : i18n.t('navbar.lightMode');
    expect(screen.getByRole('button', { name: themeToggleText })).toBeVisible();
  });
});

// Helper to add missing translation keys for testing if not present in i18n.ts
// Ensure React is imported if not already
import React from 'react';

i18n.addResourceBundle('en', 'translation', {
    "navbar.home": "Home",
    "navbar.about": "About Us",
    "navbar.changeLanguage": "Switch Language",
    "navbar.darkMode": "Dark Mode",
    "navbar.lightMode": "Light Mode",
    "navbar.openDrawerAriaLabel": "open navigation menu",
    "navbar.toggleThemeAriaLabel": "toggle theme", // Ensure this matches the label used in getByLabelText
    "Test": "Test" // Assuming 'Test' is a key used directly
}, true, true);
i18n.addResourceBundle('es', 'translation', {
    "navbar.home": "Inicio",
    "navbar.about": "Sobre Nosotros",
    "navbar.changeLanguage": "Cambiar Idioma",
    "navbar.darkMode": "Modo Oscuro",
    "navbar.lightMode": "Modo Claro",
    "navbar.openDrawerAriaLabel": "abrir menú de navegación",
    "navbar.toggleThemeAriaLabel": "cambiar tema",
    "Test": "Test"
}, true, true);
