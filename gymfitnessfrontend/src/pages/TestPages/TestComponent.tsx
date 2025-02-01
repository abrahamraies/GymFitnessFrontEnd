import { ChangeEvent, useEffect, useState } from "react";
import styles from "./TestComponent.module.css";
import { User } from "../../interfaces/UserInterface";
import { Question } from "../../interfaces/QuestionInterface";
import { TestAnswer } from "../../interfaces/AnswerInterface";
import { useNavigate } from "react-router-dom";
import { getOrCreateUser } from "../../api/userApi";
import { getRandomQuestions, sendTestAnswer, processTestResults } from "../../api/testApi";
import { useTranslation } from "react-i18next";

const TestComponent = () => {
  const [step, setStep] = useState<number>(0);
  const [userInfo, setUserInfo] = useState<User>({
    name: localStorage.getItem("username") || "",
    email: localStorage.getItem("email") || "",
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, TestAnswer>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");
    if (storedName && storedEmail) {
      setUserInfo({ name: storedName, email: storedEmail });
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
    localStorage.setItem(name === "name" ? "username" : "email", value);
  };

  const startTest = async () => {
    if (!userInfo.name || !userInfo.email) {
      alert(t("testComponent.alertUser"));
      return;
    }
    setLoading(true);

    try {
      const UserId = await getOrCreateUser(userInfo);
      setUserInfo((prev) => ({ ...prev, id: UserId }));

      const questionsData = await getRandomQuestions();
      setQuestions(questionsData);
      setStep(1);
    } catch (error) {
      console.error("Error al cargar las preguntas:", error);
      alert(t("testComponent.alertLoad"));
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (questionId: number, selectedOptionId?: number, answerValue?: boolean) => {
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

    await sendTestAnswer(answer);
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

  const isTestComplete = questions.length === Object.keys(answers).length;

  const submitTest = async () => {
    if (!isTestComplete) {
      alert(t("testComponent.alertAnswers"));
      return;
    }

    setLoading(true);
    try {
      const response = await processTestResults(userInfo.id!);
      setStep(2);

      await new Promise((resolve) => setTimeout(resolve, 3000));
      navigate(`/recommendations/${response[0].categoryId}`);
    } catch (error) {
      console.error("Error al enviar el test:", error);
      alert(t("testComponent.alertSubmit"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {step === 0 && (
        <div>
          <h1 className={styles.title}>{t("testComponent.welcome")}</h1>
          <p>{t("testComponent.inputData")}</p>
          <input type="text" name="name" placeholder={t("testComponent.inputName")} value={userInfo.name} onChange={handleInputChange} className={styles.input} />
          <input type="email" name="email" placeholder={t("testComponent.inputEmail")} value={userInfo.email} onChange={handleInputChange} className={styles.input} />
          <button onClick={startTest} className={styles.button} disabled={loading}>
            {loading ? "Cargando..." : t("test.startTest")}
          </button>
        </div>
      )}

      {step === 1 && questions.length > 0 && (
        <div>
          <h2 className={styles.subtitle}>{t("testComponent.question")} {currentQuestionIndex + 1} de {questions.length}</h2>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`}}
            ></div>
          </div>
          <div className={styles.questionContainer}>
            <p className={styles.questionText}>{questions[currentQuestionIndex].question}</p>
            {questions[currentQuestionIndex].options?.length ? (
              <div className={styles.options}>
                {questions[currentQuestionIndex].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(questions[currentQuestionIndex].id, option.id)}
                    className={`${styles.option} ${answers[questions[currentQuestionIndex].id]?.selectedOptionId === option.id ? styles.optionSelected : ""}`}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            ) : (
              <div className={styles.options}>
                <button
                  onClick={() => handleAnswer(questions[currentQuestionIndex].id, undefined, true)}
                  className={`${styles.option} ${answers[questions[currentQuestionIndex].id]?.answer === true ? styles.optionSelected : ""}`}
                >
                  {t("testComponent.yes")}
                </button>
                <button
                  onClick={() => handleAnswer(questions[currentQuestionIndex].id, undefined, false)}
                  className={`${styles.option} ${answers[questions[currentQuestionIndex].id]?.answer === false ? styles.optionSelected : ""}`}
                >
                  {t("testComponent.no")}
                </button>
              </div>
            )}
          </div>
          <div className={styles.navigation}>
            <button onClick={goToPreviousQuestion} disabled={currentQuestionIndex === 0} className={styles.button}>{t("general.previous")}</button>
            {currentQuestionIndex < questions.length - 1 ? (
              <button onClick={goToNextQuestion} className={styles.button}>{t("general.next")}</button>
            ) : (
              <button onClick={submitTest} className={styles.button} disabled={loading}>{loading ? t("general.sending") : t("general.submit")}</button>
            )}
          </div>
        </div>
      )}
      {step === 2 && (
        <div>
          <h2 className={styles.subtitle}>{t("testComponent.thanks")}</h2>
          <p className={styles.finalMessage}>
          {t("testComponent.finalMessage")}
          </p>
        </div>
      )}
    </div>
  );
};

export default TestComponent;