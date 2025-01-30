import { ChangeEvent, useEffect, useState } from "react";
import styles from "./TestComponent.module.css";
import { User } from "../../interfaces/UserInterface";
import { Question } from "../../interfaces/QuestionInterface";
import { TestAnswer } from "../../interfaces/AnswerInterface";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      alert("Por favor, completa todos los campos.");
      return;
    }
    setLoading(true);

    try {
      const userResponse = await axios.post("/api/user/getorcreate", userInfo);
      const UserId = userResponse.data;

      if (!UserId) {
        throw new Error("No se pudo obtener el ID del usuario.");
      }

      setUserInfo((prev) => ({ ...prev, id: UserId }));

      const questionsResponse = await axios.get(
        "/api/TestQuestion/random?count=10"
      );
      setQuestions(questionsResponse.data);
      setStep(1);
    } catch (error) {
      console.error("Error al cargar las preguntas:", error);
      alert("Hubo un problema al cargar las preguntas.");
    } finally {
      setLoading(false);
    }
  };

  const sendAnswerToBackend = async (answer: TestAnswer) => {
    try {
      await axios.post("/api/TestAnswer", answer);
      goToNextQuestion();
    } catch (error) {
      console.error("Error al enviar la respuesta:", error);
    }
  };

  const handleAnswer = (
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

    sendAnswerToBackend(answer);
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
      alert("Por favor, responde todas las preguntas antes de enviar el test.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `/api/TestAnswer/${userInfo.id}/process`
      );
      setStep(2);

      await new Promise((resolve) => setTimeout(resolve, 3000));
      navigate(`/recommendations/${response.data[0].categoryId}`);
    } catch (error) {
      console.error("Error al enviar el test:", error);
      alert("Hubo un problema al enviar el test.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {step === 0 && (
        <div>
          <h1 className={styles.title}>Bienvenido al Test</h1>
          <p>Por favor, ingresa tus datos para comenzar.</p>
          <input
            type="text"
            name="name"
            placeholder="Nombre de usuario"
            value={userInfo.name}
            onChange={handleInputChange}
            className={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={userInfo.email}
            onChange={handleInputChange}
            className={styles.input}
          />
          <button
            onClick={startTest}
            className={styles.button}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Comenzar Test"}
          </button>
        </div>
      )}

      {step === 1 && questions.length > 0 && (
        <div>
          <h2 className={styles.subtitle}>
            Pregunta {currentQuestionIndex + 1} de {questions.length}
          </h2>
          <div className={styles.questionContainer}>
            <p className={styles.questionText}>
              {questions[currentQuestionIndex].question}
            </p>
            {questions[currentQuestionIndex].options?.length ? (
              <div className={styles.options}>
                {questions[currentQuestionIndex].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() =>
                      handleAnswer(questions[currentQuestionIndex].id, option.id)
                    }
                    className={`${styles.option} ${
                      answers[questions[currentQuestionIndex].id]?.selectedOptionId ===
                      option.id
                        ? styles.optionSelected
                        : ""
                    }`}
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
                      questions[currentQuestionIndex].id,
                      undefined,
                      true
                    )
                  }
                  className={`${styles.option} ${
                    answers[questions[currentQuestionIndex].id]?.answer === true
                      ? styles.optionSelected
                      : ""
                  }`}
                >
                  Sí
                </button>
                <button
                  onClick={() =>
                    handleAnswer(
                      questions[currentQuestionIndex].id,
                      undefined,
                      false
                    )
                  }
                  className={`${styles.option} ${
                    answers[questions[currentQuestionIndex].id]?.answer ===
                    false
                      ? styles.optionSelected
                      : ""
                  }`}
                >
                  No
                </button>
              </div>
            )}
          </div>
          <div className={styles.navigation}>
            <button
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className={styles.button}
            >
              Anterior
            </button>
            {currentQuestionIndex < questions.length - 1 ? (
              <button onClick={goToNextQuestion} className={styles.button}>
                Siguiente
              </button>
            ) : (
              <button
                onClick={submitTest}
                className={styles.button}
                disabled={loading}
              >
                {loading ? "Enviando..." : "Finalizar Test"}
              </button>
            )}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className={styles.subtitle}>¡Gracias por completar el test!</h2>
          <p className={styles.finalMessage}>
            Tus respuestas han sido guardadas. Pronto recibirás recomendaciones
            personalizadas.
          </p>
        </div>
      )}
    </div>
  );
};

export default TestComponent;
