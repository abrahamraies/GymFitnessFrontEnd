import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n'; // Adjust path
import RecommendationsPage from './RecommendationsPage';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { getAppTheme } from '../../theme'; // Adjust path
import { Recommendation } from '../../interfaces/RecommendationInterface';

// Mock the useGetRecommendations hook
const mockUseGetRecommendations = vi.fn();
vi.mock('../../hooks/api/useGetRecommendations', () => ({
  useGetRecommendations: (categoryId: string | undefined) => mockUseGetRecommendations(categoryId),
}));

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ categoryId: '1' }), // Mock useParams to provide a categoryId
  };
});

const muiTheme = createTheme(getAppTheme('light'));

const renderRecommendationsPage = () => {
  return render(
    <MuiThemeProvider theme={muiTheme}>
      <MemoryRouter initialEntries={['/recommendations/1']}> {/* Ensure a path that matches useParams */}
        <Routes>
          <Route path="/recommendations/:categoryId" element={
            <I18nextProvider i18n={i18n}>
              <RecommendationsPage />
            </I18nextProvider>
          }/>
        </Routes>
      </MemoryRouter>
    </MuiThemeProvider>
  );
};

// Add necessary translations
i18n.addResourceBundle('en', 'translation', {
  "recommendations": {
    "load": "Loading recommendations...",
    "title": "Recommendations",
    "description": "Here are some suggestions for your chosen category:",
    "moreInfo": "Learn More",
    "error": "Failed to load recommendations. Please try again later.",
    "errorTitle": "Could Not Load Recommendations"
  },
  "general": {
    "back": "Back"
  }
}, true, true);

describe('RecommendationsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Test 1 (Loading State): should show loading indicator', () => {
    mockUseGetRecommendations.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
    });
    renderRecommendationsPage();
    expect(screen.getByText(i18n.t('recommendations.load'))).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument(); // MUI CircularProgress
  });

  it('Test 2 (Error State): should show error message', () => {
    const errorObj = new Error('Network Error');
    mockUseGetRecommendations.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: errorObj,
    });
    renderRecommendationsPage();
    expect(screen.getByText(i18n.t('recommendations.errorTitle'))).toBeInTheDocument();
    expect(screen.getByText(errorObj.message)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('general.back') })).toBeInTheDocument();
  });

  it('Test 3 (Data Display): should render recommendations and back button', () => {
    const sampleRecommendations: Recommendation[] = [
      { id: 1, categoryId: 1, title: 'Yoga Basics', description: 'A great start to yoga.', url: 'http://example.com/yoga' },
      { id: 2, categoryId: 1, title: 'Advanced Pilates', description: 'Challenge yourself.', url: 'http://example.com/pilates' },
    ];
    mockUseGetRecommendations.mockReturnValue({
      data: sampleRecommendations,
      isLoading: false,
      isError: false,
      error: null,
    });
    renderRecommendationsPage();

    expect(screen.getByRole('heading', { name: i18n.t('recommendations.title') })).toBeInTheDocument();
    expect(screen.getByText(i18n.t('recommendations.description'))).toBeInTheDocument();

    // Check for recommendation cards
    expect(screen.getByText(sampleRecommendations[0].title)).toBeInTheDocument();
    expect(screen.getByText(sampleRecommendations[0].description)).toBeInTheDocument();
    expect(screen.getByText(sampleRecommendations[1].title)).toBeInTheDocument();

    // Check for "Learn More" links (MUI Link with button role)
    const learnMoreLinks = screen.getAllByRole('link', { name: i18n.t('recommendations.moreInfo') });
    expect(learnMoreLinks.length).toBe(sampleRecommendations.length);
    expect(learnMoreLinks[0]).toHaveAttribute('href', sampleRecommendations[0].url);

    // Check for "Back" button
    expect(screen.getByRole('button', { name: i18n.t('general.back') })).toBeInTheDocument();
  });
});
