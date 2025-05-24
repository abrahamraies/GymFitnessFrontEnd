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

  return (
    <div className={styles.container}>
      {/* Step 0: User Info Input */}
      {step === 0 && (
        <div>
          <h1 className={styles.title}>{t('testComponent.welcome')}</h1>
          <p>{t('testComponent.inputData')}</p>
          {getOrCreateUserMutation.isError && (
            <p className={styles.errorText}>
              {t('testComponent.errorUserCreate')}{' '}
              {getOrCreateUserMutation.error instanceof Error
                ? getOrCreateUserMutation.error.message
                : String(getOrCreateUserMutation.error)}
            </p>
          )}
          {randomQuestionsQuery.isError && !randomQuestionsQuery.data && (
            <p className={styles.errorText}>
              {t('testComponent.errorLoadingQuestions')}{' '}
              {randomQuestionsQuery.error instanceof Error
                ? randomQuestionsQuery.error.message
                : String(randomQuestionsQuery.error)}
            </p>
          )}
          <input
            type="text"
            name="name"
            placeholder={t('testComponent.inputName')}
            value={userInfo.name}
            onChange={handleInputChange}
            className={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder={t('testComponent.inputEmail')}
            value={userInfo.email}
            onChange={handleInputChange}
            className={styles.input}
          />
          <button
            onClick={startTest}
            className={styles.button}
            disabled={getOrCreateUserMutation.isLoading || randomQuestionsQuery.isFetching}
          >
            {getOrCreateUserMutation.isLoading || randomQuestionsQuery.isFetching
              ? t('general.loading')
              : t('test.startTest')}
          </button>
        </div>
      )}

      {/* Step 1: Questions */}
      {step === 1 && (randomQuestionsQuery.isFetching || randomQuestionsQuery.isLoading) && <p>{t('general.loadingQuestions')}</p>}
      {step === 1 && randomQuestionsQuery.isError && (
        <p className={styles.errorText}>
            {t('testComponent.errorLoadingQuestions')}{' '}
            {randomQuestionsQuery.error instanceof Error ? randomQuestionsQuery.error.message : String(randomQuestionsQuery.error)}
        </p>
      )}
      {step === 1 && currentQuestions.length > 0 && !randomQuestionsQuery.isFetching && !randomQuestionsQuery.isLoading && (
        <div>
          <h2 className={styles.subtitle}>
            {t('testComponent.question')} {currentQuestionIndex + 1} de{' '}
            {currentQuestions.length}
          </h2>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%`,
              }}
            ></div>
          </div>
          <div className={styles.questionContainer}>
            <p className={styles.questionText}>
              {currentQuestions[currentQuestionIndex].question}
            </p>
            {currentQuestions[currentQuestionIndex].options?.length ? (
              <div className={styles.options}>
                {currentQuestions[currentQuestionIndex].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() =>
                      handleAnswer(
                        currentQuestions[currentQuestionIndex].id,
                        option.id
                      )
                    }
                    className={`${styles.option} ${answers[currentQuestions[currentQuestionIndex].id]?.selectedOptionId === option.id ? styles.optionSelected : ''}`}
                    disabled={sendTestAnswerMutation.isLoading}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            ) : (
              <div className={styles.options}>
                <button
                  onClick={() =>
                    handleAnswer(
                      currentQuestions[currentQuestionIndex].id,
                      undefined,
                      true
                    )
                  }
                  className={`${styles.option} ${answers[currentQuestions[currentQuestionIndex].id]?.answer === true ? styles.optionSelected : ''}`}
                  disabled={sendTestAnswerMutation.isLoading}
                >
                  {t('testComponent.yes')}
                </button>
                <button
                  onClick={() =>
                    handleAnswer(
                      currentQuestions[currentQuestionIndex].id,
                      undefined,
                      false
                    )
                  }
                  className={`${styles.option} ${answers[currentQuestions[currentQuestionIndex].id]?.answer === false ? styles.optionSelected : ''}`}
                  disabled={sendTestAnswerMutation.isLoading}
                >
                  {t('testComponent.no')}
                </button>
              </div>
            )}
          </div>
          {sendTestAnswerMutation.isError && (
            <p className={styles.errorTextSmall}>
                {t('testComponent.errorSendingAnswer')}{' '}
                {sendTestAnswerMutation.error instanceof Error ? sendTestAnswerMutation.error.message : String(sendTestAnswerMutation.error)}
            </p>
          )}
          <div className={styles.navigation}>
            <button
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0 || sendTestAnswerMutation.isLoading}
              className={styles.button}
            >
              {t('general.previous')}
            </button>
            {currentQuestionIndex < currentQuestions.length - 1 ? (
              <button
                onClick={goToNextQuestion}
                className={styles.button}
                disabled={sendTestAnswerMutation.isLoading || !answers[currentQuestions[currentQuestionIndex].id]}
              >
                {t('general.next')}
              </button>
            ) : (
              <button
                onClick={submitTest}
                className={styles.button}
                disabled={processTestResultsMutation.isLoading || !isTestComplete}
              >
                {processTestResultsMutation.isLoading ? t('general.sending') : t('general.submit')}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Test Submission and Completion Message */}
      {step === 2 && processTestResultsMutation.isLoading && <p>{t('general.processingResults')}</p>}
      {step === 2 && processTestResultsMutation.isError && (
         <p className={styles.errorText}>
            {t('testComponent.errorSubmittingTest')}{' '}
            {processTestResultsMutation.error instanceof Error ? processTestResultsMutation.error.message : String(processTestResultsMutation.error)}
        </p>
      )}
      {step === 2 && !processTestResultsMutation.isLoading && !processTestResultsMutation.isError && (
        <div>
          <h2 className={styles.subtitle}>{t('testComponent.thanks')}</h2>
          <p className={styles.finalMessage}>
            {t('testComponent.finalMessage')}
          </p>
        </div>
      )}
    </div>
  );
};

export default TestComponent;
