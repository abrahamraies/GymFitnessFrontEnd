import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n'; // Adjust path
import AboutPage from './AboutPage';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { getAppTheme } from '../../theme'; // Adjust path

const muiTheme = createTheme(getAppTheme('light'));

const renderAboutPage = () => {
  return render(
    <MuiThemeProvider theme={muiTheme}>
      <MemoryRouter> {/* AboutPage doesn't use Links, but good practice if sub-components might */}
        <I18nextProvider i18n={i18n}>
          <AboutPage />
        </I18nextProvider>
      </MemoryRouter>
    </MuiThemeProvider>
  );
};

// Add necessary translations
i18n.addResourceBundle('en', 'translation', {
  "about": {
    "header": "About Gym & Fitness Guide",
    "intro": "Welcome to <strong>Gym & Fitness Guide</strong>, your ultimate tool...", // Keep it short for test matching
    "mission": "Our mission is to help everyone find their perfect way to stay active...",
    "whyChooseUs": "Why Choose Us?",
    "features": [
      "🌟 Customized training plans for all levels.",
      "💪 Access to top resources, including YouTube channels and apps."
    ]
  }
}, true, true);
i18n.addResourceBundle('es', 'translation', {
  "about": {
    "header": "Acerca de Gym & Fitness Guide",
    "intro": "Bienvenido a <strong>Gym & Fitness Guide</strong>, tu herramienta definitiva...",
    "mission": "Nuestra misión es ayudar a todos a encontrar su forma ideal de mantenerse activos...",
    "whyChooseUs": "¿Por qué elegirnos?",
    "features": [
      "🌟 Planes de entrenamiento personalizados para todos los niveles.",
      "💪 Acceso a los mejores recursos, incluidos canales de YouTube y aplicaciones."
    ]
  }
}, true, true);


describe('AboutPage', () => {
  it('Test 1 (Content Rendering): should render main header, intro snippet, mission snippet, "Why Choose Us" subheader, and a feature item', () => {
    renderAboutPage();

    // Main header
    expect(screen.getByRole('heading', { name: i18n.t('about.header') })).toBeInTheDocument();

    // Intro snippet (check for the non-strong part)
    // The strong part is handled by Typography component="span"
    expect(screen.getByText(/Welcome to/i, { selector: 'div' })).toBeInTheDocument(); // Check for the text node part
    expect(screen.getByText('Gym & Fitness Guide', { selector: 'span' })).toBeInTheDocument(); // Check for the strong part

    // Mission snippet
    expect(screen.getByText(/Our mission is to help everyone/i)).toBeInTheDocument();

    // "Why Choose Us" subheader
    expect(screen.getByRole('heading', { name: i18n.t('about.whyChooseUs') })).toBeInTheDocument();

    // At least one feature list item
    // The feature text includes an emoji. We can match part of the text.
    expect(screen.getByText(/Customized training plans for all levels/i)).toBeInTheDocument();
  });
});
