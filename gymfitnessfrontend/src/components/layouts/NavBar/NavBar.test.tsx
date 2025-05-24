import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n'; // Adjust path if your i18n instance is elsewhere
import NavBar from './NavBar';
import { ThemeContext, ThemeContextType } from '../../../utils/context/ThemeContext';
import userEvent from '@testing-library/user-event';

// Mock ThemeContext
const mockToggleTheme = vi.fn();
const themeContextValue: ThemeContextType = {
  theme: 'light',
  toggleTheme: mockToggleTheme,
};

const renderNavBar = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <ThemeContext.Provider value={themeContextValue}>
        <I18nextProvider i18n={i18n}>{ui}</I18nextProvider>
      </ThemeContext.Provider>
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
    const themeToggleButton = screen.getByLabelText(i18n.t('navbar.toggleThemeAriaLabel') || 'toggle theme'); // Assuming you add this aria-label
    expect(themeToggleButton).toBeInTheDocument();


    // Check that hamburger menu icon is NOT visible (or not present)
    // MUI usually conditionally renders this or uses `display: none`.
    // If it's display:none, getByRole might still find it if not careful.
    // queryByRole is safer for asserting absence.
    const hamburgerIcon = screen.queryByRole('button', { name: i18n.t('navbar.openDrawerAriaLabel') });
    // In JSDOM, MUI might render it but hide with CSS.
    // A more robust check might be to check its computed style if possible,
    // or trust MUI's responsive behavior and check for its *absence* from accessibility tree if truly not rendered.
    // For this test, we check if it is NOT visible.
    // `toBeVisible` checks for `display: none` among other things.
    if (hamburgerIcon) {
      expect(hamburgerIcon).not.toBeVisible();
    } else {
      expect(hamburgerIcon).toBeNull(); // Or it might be completely absent from the DOM
    }
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
    const homeLinkInDrawer = await screen.findByRole('button', { name: i18n.t('navbar.home') });
    expect(homeLinkInDrawer).toBeVisible(); // Check if it's visible after drawer opens

    expect(screen.getByRole('button', { name: i18n.t('Test') })).toBeVisible();
    expect(screen.getByRole('button', { name: i18n.t('navbar.about') })).toBeVisible();

    // Check for theme and language toggles within the drawer
    // These are ListItemButtons, which have role 'button'
    expect(screen.getByRole('button', { name: i18n.t('navbar.changeLanguage') })).toBeVisible();
    const themeToggleText = themeContextValue.theme === 'light' ? i18n.t('navbar.darkMode') : i18n.t('navbar.lightMode');
    expect(screen.getByRole('button', { name: themeToggleText })).toBeVisible();
  });
});

// Helper to add missing translation keys for testing if not present in i18n.ts
i18n.addResourceBundle('en', 'translation', {
    "navbar.home": "Home",
    "navbar.about": "About Us",
    "navbar.changeLanguage": "Switch Language",
    "navbar.darkMode": "Dark Mode",
    "navbar.lightMode": "Light Mode",
    "navbar.openDrawerAriaLabel": "open navigation menu",
    "navbar.toggleThemeAriaLabel": "toggle theme",
    "Test": "Test"
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
