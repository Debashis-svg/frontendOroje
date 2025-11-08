import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Spinner from "../components/common/Spinner";
import TestWindow from "../components/test/TestWindow";
import Button from "../components/common/Button";

// --- Timer component ---
const Timer = ({ initialMinutes, onTimeUp }) => {
  const [seconds, setSeconds] = useState(initialMinutes * 60);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    if (isTimeUp) return;
    if (seconds <= 0) {
      setIsTimeUp(true);
      onTimeUp();
      return;
    }
    const interval = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(interval);
  }, [seconds, onTimeUp, isTimeUp]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  let colorClass = "text-green-600";
  if (seconds < 600) colorClass = "text-yellow-500"; // <10min
  if (seconds < 120) colorClass = "text-red-500 animate-pulse"; // <2min

  return (
    <div className={`text-lg md:text-xl font-semibold ${colorClass}`}>
      ⏱ Time Left: {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
    </div>
  );
};

export default function Round1Page() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [languages, setLanguages] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/test/round1")
      .then((res) => {
        setQuestions(res.data.questions);
        const initialAnswers = {};
        const initialLanguages = {};
        res.data.questions.forEach((q) => {
          if (q.type === "code" || q.type === "ai_ml") {
            const defaultSnippet =
              q.defaultCodeSnippets?.find((s) => s.language === "cpp") ||
              q.defaultCodeSnippets?.[0];
            initialAnswers[q._id] = defaultSnippet ? defaultSnippet.code : "";
            initialLanguages[q._id] = "cpp";
          } else {
            initialAnswers[q._id] = null;
          }
        });
        setAnswers(initialAnswers);
        setLanguages(initialLanguages);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 403) {
          alert("You have already submitted for this round.");
          navigate("/dashboard");
        }
        setLoading(false);
      });
  }, [navigate]);

  const handleSubmitTest = async (isForced = false) => {
    if (isSubmitting) return;

    const confirmSubmit = isForced
      ? true
      : window.confirm(
          "Are you sure you want to submit? You cannot change your answers after this."
        );

    if (confirmSubmit) {
      setIsSubmitting(true);
      if (isForced)
        alert("Time is up! Submitting your answers automatically...");

      const answersPayload = Object.keys(answers).map((questionId) => ({
        questionId: questionId,
        answer: answers[questionId],
        language: languages[questionId] || "cpp",
      }));

      try {
        await api.post("/test/round1/submit", { answers: answersPayload });
        alert("Submission successful! Your score will be evaluated.");
        navigate("/dashboard");
      } catch (error) {
        console.error("Submission failed", error);
        alert("An error occurred during submission. Please contact support.");
        setIsSubmitting(false);
      }
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Spinner size="lg" />
      </div>
    );

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerChange = (answer) => {
    if (currentQuestion) {
      setAnswers((prev) => ({ ...prev, [currentQuestion._id]: answer }));
    }
  };

  const handleLanguageChange = (language) => {
    if (currentQuestion) {
      setLanguages((prev) => ({ ...prev, [currentQuestion._id]: language }));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col text-gray-800">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 px-6 py-4 flex flex-col md:flex-row justify-between items-center shadow-sm sticky top-0 z-10">
        <h1 className="text-xl md:text-2xl font-bold tracking-wide text-gray-800">
          🧩 Round 1 – Online MCQ,Aptitude and Coding Test
        </h1>
        <div className="flex items-center gap-6 mt-3 md:mt-0">
          <Timer initialMinutes={60} onTimeUp={() => handleSubmitTest(true)} />
          <Button
            variant="danger"
            onClick={() => handleSubmitTest(false)}
            disabled={isSubmitting}
            className="text-sm md:text-base font-semibold px-5 py-2 rounded-md shadow-sm"
          >
            {isSubmitting ? "Submitting..." : "Submit Test"}
          </Button>
        </div>
      </header>

      {/* Question Navigation */}
      <div className="p-4 bg-white border-b border-gray-300 flex flex-wrap gap-3 justify-start shadow-sm">
        {questions.map((q, index) => {
          const isCurrent = index === currentQuestionIndex;
          const hasAnswer =
            answers[q._id] &&
            q.defaultCodeSnippets &&
            !q.defaultCodeSnippets.some((s) => s.code === answers[q._id]) &&
            answers[q._id] !== null;

          let boxStyle =
            "bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-300";
          if (isCurrent) boxStyle = "bg-blue-500 text-white font-bold";
          else if (hasAnswer) boxStyle = "bg-green-500 text-white font-semibold";

          return (
            <button
              key={q._id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-10 h-10 rounded-md transition-all duration-150 ${boxStyle}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      {/* Test Window */}
      <div className="flex-grow overflow-auto">
        {currentQuestion && (
          <TestWindow
            key={currentQuestion._id}
            question={currentQuestion}
            onAnswerChange={handleAnswerChange}
            savedAnswer={answers[currentQuestion._id]}
            language={languages[currentQuestion._id]}
            onLanguageChange={handleLanguageChange}
          />
        )}
      </div>
    </div>
  );
}
