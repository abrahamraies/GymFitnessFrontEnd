import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n'; // Adjust path
import HomePage from './HomePage';
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

const renderHomePage = () => {
  return render(
    <MuiThemeProvider theme={muiTheme}>
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <HomePage />
        </I18nextProvider>
      </MemoryRouter>
    </MuiThemeProvider>
  );
};

// Add necessary translations for HomePage if not already in the main i18n instance for tests
i18n.addResourceBundle('en', 'translation', {
  "home": {
    "hero": {
      "title": "Discover Your Perfect Fitness Path",
      "tagline": "Take our quick test to get personalized recommendations and achieve your fitness goals faster."
    },
    "startTest": "Start Test",
    "howItWorks": "How It Works",
    "howItWorksSteps": {
      "step1": {
        "title": "1. Take the Test",
        "description": "Answer a few simple questions about your goals and preferences."
      },
      "step2": {
        "title": "2. Get Profiled",
        "description": "Our system analyzes your answers to create your unique fitness profile."
      },
      "step3": {
        "title": "3. Receive Guidance",
        "description": "Access personalized recommendations for exercises and routines."
      }
    },
    "features": "Features",
    "featureList": [
      "Personalized workout recommendations", // This text will be in a FeatureItem
      "Access to fitness resources and guides",
      "Tools to track your progress"
    ]
  }
}, true, true);


describe('HomePage', () => {
  it('Test 1 (Hero Section): should render hero title, tagline, and Start Test button', () => {
    renderHomePage();
    expect(screen.getByText(i18n.t('home.hero.title'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('home.hero.tagline'))).toBeInTheDocument();
    // The "Start Test" button appears twice on the page, once in Hero, once in HowItWorks.
    // We can get all and check if at least one is the primary one from Hero.
    // Or, be more specific if the Hero button has unique properties (e.g. primary color).
    const startTestButtons = screen.getAllByRole('button', { name: i18n.t('home.startTest') });
    expect(startTestButtons.length).toBeGreaterThanOrEqual(1);
    // To be more specific for the Hero button (it's a primary button):
    // This requires checking its class or specific attributes if possible,
    // or ensuring it's the first one if structure guarantees it.
    // For now, just checking its presence.
  });

  it('Test 2 (How It Works Section): should render section title and at least one step title', () => {
    renderHomePage();
    expect(screen.getByText(i18n.t('home.howItWorks'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('home.howItWorksSteps.step1.title'))).toBeInTheDocument();
  });

  it('Test 3 (Features Section): should render section title and at least one feature text', () => {
    renderHomePage();
    expect(screen.getByText(i18n.t('home.features'))).toBeInTheDocument();
    // FeatureItem text is rendered inside a Typography component
    expect(screen.getByText(i18n.t('home.featureList.0'))).toBeInTheDocument();
  });
});
