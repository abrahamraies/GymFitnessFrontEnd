import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n'; // Adjust path
import TestComponent from './TestComponent';
import userEvent from '@testing-library/user-event';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { getAppTheme } from '../../theme'; // Adjust path as needed

// Mocks for react-query hooks
const mockUseGetOrCreateUser = vi.fn();
const mockUseRandomQuestions = vi.fn();
const mockUseSendTestAnswer = vi.fn();
const mockUseProcessTestResults = vi.fn();

vi.mock('../../hooks/api/useGetOrCreateUser', () => ({
  useGetOrCreateUser: () => mockUseGetOrCreateUser(),
}));
vi.mock('../../hooks/api/useRandomQuestions', () => ({
  useRandomQuestions: () => mockUseRandomQuestions(),
}));
vi.mock('../../hooks/api/useSendTestAnswer', () => ({
  useSendTestAnswer: () => mockUseSendTestAnswer(),
}));
vi.mock('../../hooks/api/useProcessTestResults', () => ({
  useProcessTestResults: () => mockUseProcessTestResults(),
}));

// Mock for react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const initialMockValues = {
  getOrCreateUser: {
    mutateAsync: vi.fn(),
    isLoading: false,
    isError: false,
    error: null,
  },
  randomQuestions: {
    refetch: vi.fn(),
    data: [],
    isLoading: false,
    isFetching: false,
    isError: false,
    error: null,
  },
  sendTestAnswer: {
    mutateAsync: vi.fn(),
    isLoading: false,
    isError: false,
    error: null,
  },
  processTestResults: {
    mutateAsync: vi.fn(),
    isLoading: false,
    isError: false,
    error: null,
  },
};

const muiTheme = createTheme(getAppTheme('light')); // Use a specific mode for testing

const renderTestComponent = () => {
  return render(
    <MuiThemeProvider theme={muiTheme}>
      <I18nextProvider i18n={i18n}>
        <TestComponent />
      </I18nextProvider>
    </MuiThemeProvider>
  );
};

describe('TestComponent', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    mockUseGetOrCreateUser.mockReturnValue(initialMockValues.getOrCreateUser);
    mockUseRandomQuestions.mockReturnValue(initialMockValues.randomQuestions);
    mockUseSendTestAnswer.mockReturnValue(initialMockValues.sendTestAnswer);
    mockUseProcessTestResults.mockReturnValue(initialMockValues.processTestResults);

    // Mock localStorage
    Storage.prototype.getItem = vi.fn((key) => {
        if (key === 'username') return 'TestUser';
        if (key === 'email') return 'test@example.com';
        return null;
    });
    Storage.prototype.setItem = vi.fn();
  });

  it('Test 1 (Initial State - User Info Input): should render input fields and start button', () => {
    renderTestComponent();
    // MUI TextFields are queried by label
    expect(screen.getByLabelText(i18n.t('testComponent.inputName'))).toBeInTheDocument();
    expect(screen.getByLabelText(i18n.t('testComponent.inputEmail'))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('test.startTest') })).toBeInTheDocument();
  });

  it('Test 2 (Loading State - Starting Test): should show loading state on start button and CircularProgress', async () => {
    const user = userEvent.setup();
    mockUseGetOrCreateUser.mockReturnValue({
      ...initialMockValues.getOrCreateUser,
      isLoading: true,
    });
    renderTestComponent();

    const startButton = screen.getByRole('button', { name: i18n.t('general.loading') });
    expect(startButton).toBeInTheDocument();
    expect(startButton).toBeDisabled();
    // Check for CircularProgress (it's inside the button as startIcon)
    expect(startButton.querySelector('[role="progressbar"]')).toBeInTheDocument();
  });

  it('Test 3 (Error State - Failing to Load Questions): should display an error message using Typography', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Network Error';
    initialMockValues.getOrCreateUser.mutateAsync.mockResolvedValue({ id: 1, name: 'Test User', email: 'test@example.com' });
    mockUseGetOrCreateUser.mockReturnValue(initialMockValues.getOrCreateUser);

    // Simulate error after attempting to fetch questions in startTest
    initialMockValues.getOrCreateUser.mutateAsync.mockResolvedValueOnce({ id: 1, name: 'Test User', email: 'test@example.com' });
    mockUseRandomQuestions.mockReturnValueOnce({ // Before startTest click
      ...initialMockValues.randomQuestions,
      refetch: vi.fn().mockResolvedValue({ data: null, isError: true, error: new Error(errorMessage) }),
    });
    
    renderTestComponent(); // Initial render with mocks set for the first call
    
    const nameInput = screen.getByLabelText(i18n.t('testComponent.inputName'));
    const emailInput = screen.getByLabelText(i18n.t('testComponent.inputEmail'));
    const startButton = screen.getByRole('button', { name: i18n.t('test.startTest') });

    await user.type(nameInput, 'John Doe'); // Use userEvent for typing
    await user.type(emailInput, 'john@example.com');
    
    // After clicking start, the component's internal logic will call refetch.
    // We need to update the mock that will be used for the re-render *after* startTest's effects.
    mockUseRandomQuestions.mockReturnValue({ // This mock will be active for re-renders triggered by startTest
      ...initialMockValues.randomQuestions,
      isError: true,
      error: new Error(errorMessage),
      data: null,
      isLoading: false,
      isFetching: false,
      refetch: vi.fn().mockResolvedValue({ data: null, isError: true, error: new Error(errorMessage) }), // ensure refetch is still there
    });

    await user.click(startButton);
        
    // Error message is rendered in a Typography component
    const errorTextElement = await screen.findByText(new RegExp(i18n.t('testComponent.errorLoadingQuestions')));
    expect(errorTextElement).toBeInTheDocument();
    expect(errorTextElement.tagName).toBe('P'); // MUI Typography often renders as <p>
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('Test 4 (Displaying Questions): should render the first question, options, and LinearProgress', async () => {
    const user = userEvent.setup();
    const sampleQuestions = [
      { id: 1, question: 'First question text?', type: 'CHOICE', options: [{ id: 1, text: 'Option A' }, { id: 2, text: 'Option B' }] },
      { id: 2, question: 'Second question boolean?', type: 'BOOLEAN' },
    ];
    initialMockValues.getOrCreateUser.mutateAsync.mockResolvedValue({ id: 1, name: 'Test User', email: 'test@example.com' });
    mockUseGetOrCreateUser.mockReturnValue(initialMockValues.getOrCreateUser);
    initialMockValues.getOrCreateUser.mutateAsync.mockResolvedValueOnce({ id: 1, name: 'Test User', email: 'test@example.com' });

    mockUseRandomQuestions.mockReturnValueOnce({ // Before startTest click
      ...initialMockValues.randomQuestions,
      refetch: vi.fn().mockResolvedValue({ data: sampleQuestions, isError: false, error: null }),
      data: [], 
    });
    
    renderTestComponent();
    const startButton = screen.getByRole('button', { name: i18n.t('test.startTest') });
    
    // Simulate the state *after* questions are fetched and component re-renders
    mockUseRandomQuestions.mockReturnValue({
      ...initialMockValues.randomQuestions,
      data: sampleQuestions,
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: vi.fn().mockResolvedValue({ data: sampleQuestions, isError: false, error: null }),
    });
    
    await user.click(startButton); // This should trigger the refetch and subsequent re-render
    
    // Check for question text (inside Paper > Typography)
    expect(await screen.findByText(sampleQuestions[0].question)).toBeInTheDocument();
    
    // Check for option buttons (MUI Buttons)
    expect(screen.getByRole('button', { name: sampleQuestions[0].options[0].text })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: sampleQuestions[0].options[1].text })).toBeInTheDocument();

    // Check for LinearProgress (by role="progressbar")
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    
    // Check progress bar text (Typography)
    expect(screen.getByText(`${i18n.t('testComponent.question')} 1 ${i18n.t('general.of')} ${sampleQuestions.length}`)).toBeInTheDocument();
  });
});

// Helper for translations if not fully set up in i18n.ts for tests
i18n.addResourceBundle('en', 'translation', {
    "testComponent.inputName": "Your Name",
    "testComponent.inputEmail": "Your Email",
    "test.startTest": "Start Test",
    "general.loading": "Loading...",
    "general.loadingQuestions": "Loading questions...",
    "testComponent.errorUserCreate": "Error creating user:",
    "testComponent.errorLoadingQuestions": "Error loading questions:",
    "testComponent.question": "Question",
    "general.of": "of", // Added "of" for "X of Y"
    "testComponent.yes": "Yes",
    "testComponent.no": "No",
    "general.previous": "Previous",
    "general.next": "Next",
    "general.submit": "Submit",
    "general.sending": "Sending...",
    "testComponent.thanks": "Thank you for completing the test!",
    "testComponent.finalMessage": "We are processing your results...",
    "testComponent.alertUser": "Please enter your name and email.",
    "testComponent.alertLoad": "Error loading questions. Please try again.",
    "testComponent.alertAnswers": "Please answer all questions before submitting.",
    "testComponent.alertSubmit": "Error submitting test. Please try again.",
    "testComponent.errorSendingAnswer": "Error sending answer:",
    "testComponent.errorSubmittingTest": "Error submitting test:",
}, true, true);

i18n.addResourceBundle('es', 'translation', {
    "testComponent.inputName": "Tu Nombre",
    "testComponent.inputEmail": "Tu Email",
    "test.startTest": "Empezar Test",
    "general.loading": "Cargando...",
    "general.loadingQuestions": "Cargando preguntas...",
    "testComponent.errorUserCreate": "Error creando usuario:",
    "testComponent.errorLoadingQuestions": "Error al cargar las preguntas:",
    "testComponent.question": "Pregunta",
    "general.of": "de", // Added "of" for "X de Y"
    "testComponent.yes": "Sí",
    "testComponent.no": "No",
    "general.previous": "Anterior",
    "general.next": "Siguiente",
    "general.submit": "Enviar",
    "general.sending": "Enviando...",
    "testComponent.thanks": "¡Gracias por completar el test!",
    "testComponent.finalMessage": "Estamos procesando tus resultados...",
    "testComponent.alertUser": "Por favor, introduce tu nombre y email.",
    "testComponent.alertLoad": "Error al cargar las preguntas. Inténtalo de nuevo.",
    "testComponent.alertAnswers": "Por favor, responde todas las preguntas antes de enviar.",
    "testComponent.alertSubmit": "Error al enviar el test. Inténtalo de nuevo.",
    "testComponent.errorSendingAnswer": "Error al enviar respuesta:",
    "testComponent.errorSubmittingTest": "Error al enviar el test:",
}, true, true);
