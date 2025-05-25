import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n'; // Adjust path
import TestPage from './TestPage';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { getAppTheme } from '../../theme'; // Adjust path

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const muiTheme = createTheme(getAppTheme('light'));

const renderTestPage = () => {
  return render(
    <MuiThemeProvider theme={muiTheme}>
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <TestPage />
        </I18nextProvider>
      </MemoryRouter>
    </MuiThemeProvider>
  );
};

// Add necessary translations for TestPage if not already in the main i18n instance for tests
i18n.addResourceBundle('en', 'translation', {
  "test": {
    "welcome": "Welcome to the Fitness Test",
    "description": "Find your ideal fitness journey based on your preferences.",
    "startTest": "Start Test",
    "knowProfile": "I already know my profile"
  }
}, true, true);
i18n.addResourceBundle('es', 'translation', {
  "test": {
    "welcome": "Bienvenido al Fitness Test",
    "description": "Encontra tu entrenamiento de fitness ideal basado en tus preferencias.",
    "startTest": "Iniciar Test",
    "knowProfile": "Ya conozco mi perfil"
  }
}, true, true);


describe('TestPage', () => {
  it('Test 1 (Content Rendering): should render title, subtitle, and both action buttons', () => {
    renderTestPage();

    // Check for title (Typography h3, role heading)
    expect(screen.getByRole('heading', { name: i18n.t('test.welcome') })).toBeInTheDocument();

    // Check for subtitle (Typography h6)
    expect(screen.getByText(i18n.t('test.description'))).toBeInTheDocument();

    // Check for "Start Test" button
    expect(screen.getByRole('button', { name: i18n.t('test.startTest') })).toBeInTheDocument();

    // Check for "I already know my profile" button
    expect(screen.getByRole('button', { name: i18n.t('test.knowProfile') })).toBeInTheDocument();
  });
});
