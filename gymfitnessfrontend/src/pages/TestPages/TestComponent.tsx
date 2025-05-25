import { ChangeEvent, useEffect, useState } from 'react';
import styles from './TestComponent.module.css';
import { User } from '../../interfaces/UserInterface';
import { Question } from '../../interfaces/QuestionInterface';
import { TestAnswer } from '../../interfaces/AnswerInterface';
import { useNavigate } from 'react-router-dom';
import { getOrCreateUser } from '../../api/userApi';
import {
  getRandomQuestions,
  sendTestAnswer,
  processTestResults,
} from '../../api/testApi';
import { useTranslation } from 'react-i18next';
import { useGetOrCreateUser } from '../../hooks/api/useGetOrCreateUser';
import { useRandomQuestions } from '../../hooks/api/useRandomQuestions';
import { useSendTestAnswer } from '../../hooks/api/useSendTestAnswer';
import { useProcessTestResults } from '../../hooks/api/useProcessTestResults';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'; // Already imported but good to note
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
// import { useTheme } from '@mui/material/styles'; // For direct theme access if needed

const APPBAR_HEIGHT = '64px'; // Approximate height of the AppBar, adjust if necessary

const TestComponent = () => {
  const [step, setStep] = useState<number>(0);
  const [userInfo, setUserInfo] = useState<User>({
    name: localStorage.getItem('username') || '',
    email: localStorage.getItem('email') || '',
  });
  // const [questions, setQuestions] = useState<Question[]>([]); // Replaced by randomQuestionsQuery.data
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, TestAnswer>>({});
  // const [loading, setLoading] = useState<boolean>(false); // Will be replaced by hook loading states
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Initialize hooks
  const getOrCreateUserMutation = useGetOrCreateUser();
  const randomQuestionsQuery = useRandomQuestions();
  const sendTestAnswerMutation = useSendTestAnswer();
  const processTestResultsMutation = useProcessTestResults();

  useEffect(() => {
    const storedName = localStorage.getItem('username');
    const storedEmail = localStorage.getItem('email');
    if (storedName && storedEmail) {
      setUserInfo({ name: storedName, email: storedEmail });
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
    localStorage.setItem(name === 'name' ? 'username' : 'email', value);
  };

  const startTest = async () => {
    if (!userInfo.name || !userInfo.email) {
      // Consider replacing alert with a more user-friendly error message in JSX
      alert(t('testComponent.alertUser'));
      return;
    }
    // setLoading(true); // Handled by getOrCreateUserMutation.isLoading

    try {
      const user = await getOrCreateUserMutation.mutateAsync(userInfo);
      setUserInfo((prev) => ({ ...prev, id: user.id }));

      // Fetch questions only after user is created/retrieved
      const questionsData = await randomQuestionsQuery.refetch();
      if (questionsData.data) {
        // setQuestions(questionsData.data); // Data will come from randomQuestionsQuery.data
        setStep(1);
      } else if (questionsData.isError) {
        console.error('Error al cargar las preguntas:', questionsData.error);
        // Consider replacing alert with a more user-friendly error message in JSX
        alert(t('testComponent.alertLoad'));
      }
    } catch (error) {
      console.error('Error en startTest:', error);
      // Consider replacing alert with a more user-friendly error message in JSX
      alert(t('testComponent.alertLoad')); // Generic error for now
    }
    // finally {
    //   setLoading(false); // Handled by hook loading states
    // }
  };

  const handleAnswer = async (
    questionId: number,
    selectedOptionId?: number,
    answerValue?: boolean
  ) => {
    const answer: TestAnswer = {
      userId: userInfo.id!,
      questionId,
      selectedOptionId: selectedOptionId || undefined,
      answer: answerValue ?? undefined,
    };

    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));

    try {
      await sendTestAnswerMutation.mutateAsync(answer);
    } catch (error) {
      console.error('Error al enviar la respuesta:', error);
      // Optionally handle answer submission error, e.g., show a small notification
    }
    goToNextQuestion();
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const isTestComplete = (randomQuestionsQuery.data?.length || 0) === Object.keys(answers).length;

  const submitTest = async () => {
    if (!isTestComplete) {
      // Consider replacing alert with a more user-friendly error message in JSX
      alert(t('testComponent.alertAnswers'));
      return;
    }

    // setLoading(true); // Handled by processTestResultsMutation.isLoading
    try {
      const response = await processTestResultsMutation.mutateAsync(userInfo.id!);
      if (response) {
        setStep(2);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        navigate(`/recommendations/${response[0].categoryId}`);
      } else {
        console.error('Error al enviar el test: No response data');
        // Consider replacing alert with a more user-friendly error message in JSX
        alert(t('testComponent.alertSubmit'));
      }
    } catch (error) {
      console.error('Error al enviar el test:', error);
      // Consider replacing alert with a more user-friendly error message in JSX
      alert(t('testComponent.alertSubmit'));
    }
    // finally {
    //   setLoading(false); // Handled by processTestResultsMutation.isLoading
    // }
  };

  // Derived states
  const currentQuestions = randomQuestionsQuery.data || [];
  // const theme = useTheme(); // For direct theme access

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: step === 1 ? 'flex-start' : 'center', // Adjust justification for question step
        minHeight: `calc(100vh - ${APPBAR_HEIGHT})`,
        py: { xs: 3, md: 5 },
        px: 2,
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        {/* Step 0: User Info Input */}
        {step === 0 && (
          <Box sx={{ my: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              {t('testComponent.welcome')}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
              {t('testComponent.inputData')}
            </Typography>

            {getOrCreateUserMutation.isError && (
              <Typography color="error" sx={{ mb: 2 }}>
                {t('testComponent.errorUserCreate')}{' '}
                {getOrCreateUserMutation.error instanceof Error
                  ? getOrCreateUserMutation.error.message
                  : String(getOrCreateUserMutation.error)}
              </Typography>
            )}
            {randomQuestionsQuery.isError && !randomQuestionsQuery.data && ( // This error might be better placed if startTest is attempted
              <Typography color="error" sx={{ mb: 2 }}>
                {t('testComponent.errorLoadingQuestions')}{' '}
                {randomQuestionsQuery.error instanceof Error
                  ? randomQuestionsQuery.error.message
                  : String(randomQuestionsQuery.error)}
              </Typography>
            )}

            <TextField
              fullWidth
              label={t('testComponent.inputName')}
              name="name"
              value={userInfo.name}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
              variant="outlined"
            />
            <TextField
              fullWidth
              label={t('testComponent.inputEmail')}
              name="email"
              type="email"
              value={userInfo.email}
              onChange={handleInputChange}
              sx={{ mb: 3 }}
              variant="outlined"
            />
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={startTest}
              disabled={getOrCreateUserMutation.isLoading || randomQuestionsQuery.isFetching}
              startIcon={(getOrCreateUserMutation.isLoading || randomQuestionsQuery.isFetching) ? <CircularProgress size={24} color="inherit" /> : null}
              sx={{ py: 1.5, px: 5 }}
            >
              {getOrCreateUserMutation.isLoading || randomQuestionsQuery.isFetching
                ? t('general.loading')
                : t('test.startTest')}
            </Button>
          </Box>
        )}

        {/* Step 1: Questions */}
        {step === 1 && (randomQuestionsQuery.isFetching || randomQuestionsQuery.isLoading) && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6">{t('general.loadingQuestions')}</Typography>
          </Box>
        )}
        {step === 1 && randomQuestionsQuery.isError && (
          <Typography color="error" sx={{ my: 4 }}>
            {t('testComponent.errorLoadingQuestions')}{' '}
            {randomQuestionsQuery.error instanceof Error ? randomQuestionsQuery.error.message : String(randomQuestionsQuery.error)}
          </Typography>
        )}
        {step === 1 && currentQuestions.length > 0 && !randomQuestionsQuery.isFetching && !randomQuestionsQuery.isLoading && (
          <Box sx={{ width: '100%', my: 2 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {t('testComponent.question')} {currentQuestionIndex + 1} {t('general.of')} {currentQuestions.length}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={((currentQuestionIndex + 1) / currentQuestions.length) * 100}
              sx={{ height: 8, borderRadius: 4, mb: 3 }}
            />
            <Paper elevation={2} sx={{ p: {xs: 2, sm: 3, md: 4}, mb: 3, textAlign: 'left' }}>
              <Typography variant="h5" component="p" sx={{ mb: 3 }}>
                {currentQuestions[currentQuestionIndex].question}
              </Typography>
              <Stack spacing={1.5} direction="column">
                {currentQuestions[currentQuestionIndex].options?.length ? (
                  currentQuestions[currentQuestionIndex].options.map((option) => (
                    <Button
                      key={option.id}
                      variant={answers[currentQuestions[currentQuestionIndex].id]?.selectedOptionId === option.id ? "contained" : "outlined"}
                      color="primary"
                      size="large"
                      onClick={() => handleAnswer(currentQuestions[currentQuestionIndex].id, option.id)}
                      disabled={sendTestAnswerMutation.isLoading}
                      sx={{ justifyContent: 'flex-start', py: 1.5, textTransform: 'none' }}
                    >
                      {option.text}
                    </Button>
                  ))
                ) : (
                  <>
                    <Button
                      variant={answers[currentQuestions[currentQuestionIndex].id]?.answer === true ? "contained" : "outlined"}
                      color="primary"
                      size="large"
                      onClick={() => handleAnswer(currentQuestions[currentQuestionIndex].id, undefined, true)}
                      disabled={sendTestAnswerMutation.isLoading}
                      sx={{ justifyContent: 'flex-start', py: 1.5 }}
                    >
                      {t('testComponent.yes')}
                    </Button>
                    <Button
                      variant={answers[currentQuestions[currentQuestionIndex].id]?.answer === false ? "contained" : "outlined"}
                      color="primary"
                      size="large"
                      onClick={() => handleAnswer(currentQuestions[currentQuestionIndex].id, undefined, false)}
                      disabled={sendTestAnswerMutation.isLoading}
                      sx={{ justifyContent: 'flex-start', py: 1.5 }}
                    >
                      {t('testComponent.no')}
                    </Button>
                  </>
                )}
              </Stack>
            </Paper>
            {sendTestAnswerMutation.isError && (
              <Typography color="error" variant="body2" sx={{ mt: 1, mb: 2 }}>
                {t('testComponent.errorSendingAnswer')}{' '}
                {sendTestAnswerMutation.error instanceof Error ? sendTestAnswerMutation.error.message : String(sendTestAnswerMutation.error)}
              </Typography>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={goToPreviousQuestion}
                disabled={currentQuestionIndex === 0 || sendTestAnswerMutation.isLoading}
              >
                {t('general.previous')}
              </Button>
              {currentQuestionIndex < currentQuestions.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={goToNextQuestion}
                  disabled={sendTestAnswerMutation.isLoading || !answers[currentQuestions[currentQuestionIndex].id]}
                >
                  {t('general.next')}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success" // Use success color for final submit
                  onClick={submitTest}
                  disabled={processTestResultsMutation.isLoading || !isTestComplete}
                  startIcon={processTestResultsMutation.isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {processTestResultsMutation.isLoading ? t('general.sending') : t('general.submit')}
                </Button>
              )}
            </Box>
          </Box>
        )}

        {/* Step 2: Test Submission and Completion Message */}
        {step === 2 && (
          <Box sx={{ my: 4, textAlign: 'center' }}>
            {processTestResultsMutation.isLoading && (
              <>
                <CircularProgress sx={{ mb: 2 }} />
                <Typography variant="h6">{t('general.processingResults')}</Typography>
              </>
            )}
            {processTestResultsMutation.isError && (
              <Typography color="error">
                {t('testComponent.errorSubmittingTest')}{' '}
                {processTestResultsMutation.error instanceof Error ? processTestResultsMutation.error.message : String(processTestResultsMutation.error)}
              </Typography>
            )}
            {!processTestResultsMutation.isLoading && !processTestResultsMutation.isError && (
              <>
                <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'medium' }}>
                  {t('testComponent.thanks')}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {t('testComponent.finalMessage')}
                </Typography>
              </>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default TestComponent;
