import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n'; // Adjust path
import TestComponent from './TestComponent';
import userEvent from '@testing-library/user-event';

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

const renderTestComponent = () => {
  return render(
    <I18nextProvider i18n={i18n}>
      <TestComponent />
    </I18nextProvider>
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
    expect(screen.getByPlaceholderText(i18n.t('testComponent.inputName'))).toBeInTheDocument();
    expect(screen.getByPlaceholderText(i18n.t('testComponent.inputEmail'))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('test.startTest') })).toBeInTheDocument();
  });

  it('Test 2 (Loading State - Starting Test): should show loading state on start button', async () => {
    const user = userEvent.setup();
    mockUseGetOrCreateUser.mockReturnValue({
      ...initialMockValues.getOrCreateUser,
      isLoading: true,
    });
    renderTestComponent();

    const startButton = screen.getByRole('button', { name: i18n.t('general.loading') }); // Text changes to loading
    expect(startButton).toBeInTheDocument();
    expect(startButton).toBeDisabled(); // Button should be disabled while loading
  });

  it('Test 3 (Error State - Failing to Load Questions): should display an error message', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Network Error';
    initialMockValues.getOrCreateUser.mutateAsync.mockResolvedValue({ id: 1, name: 'Test User', email: 'test@example.com' });
    mockUseGetOrCreateUser.mockReturnValue(initialMockValues.getOrCreateUser);

    mockUseRandomQuestions.mockReturnValue({
      ...initialMockValues.randomQuestions,
      refetch: vi.fn().mockResolvedValue({ data: null, isError: true, error: new Error(errorMessage) }),
      isError: true, // This needs to be true after refetch simulation
      error: new Error(errorMessage),
    });

    renderTestComponent();
    const nameInput = screen.getByPlaceholderText(i18n.t('testComponent.inputName'));
    const emailInput = screen.getByPlaceholderText(i18n.t('testComponent.inputEmail'));
    const startButton = screen.getByRole('button', { name: i18n.t('test.startTest') });

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.click(startButton);
    
    // After click, the hook is called, and its state changes. We need to re-render or update based on hook's return
    // For this test, we simulate the error state directly from the hook after startTest logic
    // The error message depends on the text in the component for randomQuestionsQuery.isError
    // Let's assume the error message 'testComponent.errorLoadingQuestions' is used.
    
    // Re-render with the error state for questions (simulating the effect of startTest)
    // This is a bit tricky as startTest itself sets state.
    // A better way is to check the state *after* the interaction that triggers the error.
    // The current `startTest` in `TestComponent` calls `randomQuestionsQuery.refetch()`
    // and then uses `questionsData.isError`.

    // We need to ensure the error from `refetch` is propagated to the `randomQuestionsQuery` mock
    // For simplicity in this setup, we'll assume the error message appears based on the hook's general error state.
    // The error message is: {t('testComponent.errorLoadingQuestions')}{' '}{randomQuestionsQuery.error instanceof Error ? randomQuestionsQuery.error.message : String(randomQuestionsQuery.error)}

    // To correctly test this, the `startTest` function would need to be awaited, and the component re-rendered
    // based on the mocked hook's updated state after `refetch`.
    // Given the current structure, we'll check for the generic error text.
    
    // Let's update the mock to reflect the state *after* the failed refetch attempt in startTest
    mockUseRandomQuestions.mockReturnValueOnce({ // First render
        ...initialMockValues.randomQuestions,
        refetch: vi.fn().mockResolvedValue({ data: null, isError: true, error: new Error(errorMessage) }),
    });
    
    renderTestComponent(); // Initial render
    await user.click(screen.getByRole('button', { name: i18n.t('test.startTest') }));

    // Now update the mock that would be returned *after* the refetch within startTest
    mockUseRandomQuestions.mockReturnValue({
        ...initialMockValues.randomQuestions,
        isError: true,
        error: new Error(errorMessage),
        data: null, // Important: no data on error
        isLoading: false,
        isFetching: false,
    });

    // Re-render or wait for update. Testing Library handles re-renders from state changes.
    // The error text should appear.
    const errorTextElement = await screen.findByText(new RegExp(i18n.t('testComponent.errorLoadingQuestions')));
    expect(errorTextElement).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();

  });

  it('Test 4 (Displaying Questions): should render the first question and options', async () => {
    const user = userEvent.setup();
    const sampleQuestions = [
      { id: 1, question: 'First question text?', type: 'CHOICE', options: [{ id: 1, text: 'Option A' }, { id: 2, text: 'Option B' }] },
      { id: 2, question: 'Second question boolean?', type: 'BOOLEAN' },
    ];
    initialMockValues.getOrCreateUser.mutateAsync.mockResolvedValue({ id: 1, name: 'Test User', email: 'test@example.com' });
    mockUseGetOrCreateUser.mockReturnValue(initialMockValues.getOrCreateUser);

    // Mock for initial render (before startTest)
    mockUseRandomQuestions.mockReturnValueOnce({
        ...initialMockValues.randomQuestions,
        refetch: vi.fn().mockResolvedValue({ data: sampleQuestions, isError: false, error: null }),
        data: [], // Initially no questions
    });
    
    renderTestComponent();
    const startButton = screen.getByRole('button', { name: i18n.t('test.startTest') });
    await user.click(startButton);

    // Mock for subsequent renders after questions are fetched
    mockUseRandomQuestions.mockReturnValue({
        ...initialMockValues.randomQuestions,
        data: sampleQuestions, // Questions are now loaded
        isLoading: false,
        isFetching: false,
        isError: false,
    });
    
    // The component should re-render due to state changes in startTest and hook updates.
    // Wait for the question to appear
    expect(await screen.findByText(sampleQuestions[0].question)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: sampleQuestions[0].options[0].text })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: sampleQuestions[0].options[1].text })).toBeInTheDocument();

    // Check progress bar text
    expect(screen.getByText(`${i18n.t('testComponent.question')} 1 de ${sampleQuestions.length}`)).toBeInTheDocument();
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
