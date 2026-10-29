import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const ExamContext = createContext(null);

export function ExamProvider({ children }) {
  const [currentExam, setCurrentExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [markedQuestions, setMarkedQuestions] = useState([]);

  const startExam = useCallback((exam) => {
    setCurrentExam(exam);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setMarkedQuestions([]);
  }, []);

  const saveAnswer = useCallback((questionId, answer) => {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: answer,
    }));
  }, []);

  const toggleMarkQuestion = useCallback((questionId) => {
    setMarkedQuestions((previous) =>
      previous.includes(questionId)
        ? previous.filter((id) => id !== questionId)
        : [...previous, questionId]
    );
  }, []);

  const clearExam = useCallback(() => {
    setCurrentExam(null);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setMarkedQuestions([]);
  }, []);

  const value = useMemo(
    () => ({
      currentExam,
      answers,
      currentQuestionIndex,
      markedQuestions,
      setCurrentExam,
      setCurrentQuestionIndex,
      startExam,
      saveAnswer,
      toggleMarkQuestion,
      clearExam,
    }),
    [
      currentExam,
      answers,
      currentQuestionIndex,
      markedQuestions,
      startExam,
      saveAnswer,
      toggleMarkQuestion,
      clearExam,
    ]
  );

  return (
    <ExamContext.Provider value={value}>
      {children}
    </ExamContext.Provider>
  );
}

export function useExamContext() {
  const context = useContext(ExamContext);

  if (!context) {
    throw new Error("useExamContext must be used inside ExamProvider");
  }

  return context;
}