import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Spinner from "../components/common/Spinner";
import CodeEditor from "../components/test/CodeEditor";
import Button from "../components/common/Button";
import { ClockIcon } from "@heroicons/react/24/solid";

// Timer Component
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
  if (seconds < 600) colorClass = "text-yellow-500";
  if (seconds < 120) colorClass = "text-red-500 animate-pulse";

  return (
    <div
      className={`text-lg md:text-xl font-semibold flex items-center gap-2 ${colorClass}`}
    >
      <ClockIcon className="h-6 w-6 inline-block" />
      {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
    </div>
  );
};

export default function Round2Page() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [runOutput, setRunOutput] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch Round 2 questions
  useEffect(() => {
    api
      .get("/test/round2")
      .then((res) => {
        if (res.data.questions && res.data.questions.length > 0) {
          setQuestions(res.data.questions);
          const firstProblem = res.data.questions[0];

          const defaultSnippet =
            firstProblem.defaultCodeSnippets?.find(
              (s) => s.language === "cpp"
            ) || firstProblem.defaultCodeSnippets?.[0];

          setCode(defaultSnippet ? defaultSnippet.code : "");
        }
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

  const currentProblem = questions[currentQuestionIndex];

  // Update code when language changes
  useEffect(() => {
    if (currentProblem) {
      const defaultSnippet = currentProblem.defaultCodeSnippets?.find(
        (s) => s.language === language
      );
      const newDefaultCode = defaultSnippet ? defaultSnippet.code : "";

      const isCurrentlyADefault = currentProblem.defaultCodeSnippets?.some(
        (s) => s.language !== language && s.code === code
      );

      if (code === null || code === "" || isCurrentlyADefault) {
        setCode(newDefaultCode);
      }
    }
  }, [language, currentProblem]);

  const handleRun = async () => {
    if (!currentProblem) return;
    setIsRunning(true);
    setRunOutput(null);
    try {
      const { data } = await api.post("/test/run", {
        code,
        language,
        questionId: currentProblem._id,
      });
      setRunOutput(data);
    } catch (error) {
      setRunOutput({ status: "Error", message: "Failed to run code." });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async (isForced = false) => {
    if (isSubmitting || !currentProblem) return;

    const confirmSubmit = isForced
      ? true
      : window.confirm(
          "Are you sure you want to submit? This is your final submission for Round 2."
        );

    if (confirmSubmit) {
      setIsSubmitting(true);
      if (isForced) alert("Time is up! Submitting your answers...");

      try {
        const answersPayload = questions.map((q) => ({
          questionId: q._id,
          answer: code, // You can modify this if multiple question codes are stored
          language: language,
        }));

        await api.post("/test/round2/submit", { answers: answersPayload });
        alert("Submission successful! Good luck.");
        navigate("/dashboard");
      } catch (error) {
        alert("Submission failed.");
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

  if (!currentProblem)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-800 text-xl">
        No problems available for Round 2.
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col text-gray-800">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-300 px-6 py-4 flex flex-col md:flex-row justify-between items-center shadow-sm sticky top-0 z-10">
        <h1 className="text-xl md:text-2xl font-bold tracking-wide text-gray-800">
          ⚙️ Round 2 – AI/ML Challenges
        </h1>
        <div className="flex items-center gap-6 mt-3 md:mt-0">
          <Timer initialMinutes={180} onTimeUp={() => handleSubmit(true)} />
          <Button
            variant="danger"
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
            className="text-sm md:text-base font-semibold px-5 py-2 rounded-md shadow-sm"
          >
            {isSubmitting ? "Submitting..." : "Final Submit"}
          </Button>
        </div>
      </header>

      {/* QUESTION NAVIGATION */}
      <div className="p-4 bg-white border-b border-gray-300 flex flex-wrap gap-3 justify-start shadow-sm">
        {questions.map((q, index) => (
          <button
            key={q._id}
            onClick={() => setCurrentQuestionIndex(index)}
            className={`w-10 h-10 rounded-md transition-all duration-150 border ${
              index === currentQuestionIndex
                ? "bg-blue-500 text-white font-bold"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-col md:flex-row flex-grow overflow-auto">
        {/* LEFT PANEL */}
        <div className="w-full md:w-2/5 p-6 bg-white border-r border-gray-300 overflow-y-auto flex flex-col">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            {currentProblem.title}
          </h2>
          <div
            className="text-gray-700 text-sm mb-6 whitespace-pre-wrap leading-relaxed"
            dangerouslySetInnerHTML={{ __html: currentProblem.description }}
          />

          {currentProblem.testCases?.length > 0 && (
            <div className="mb-4">
              <h4 className="text-base font-semibold text-gray-800 mb-2">
                Visible Test Cases
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto bg-gray-50 border border-gray-300 rounded-md p-2">
                {currentProblem.testCases.map((tc, i) => (
                  <div
                    key={i}
                    className="bg-white p-3 rounded border border-gray-200 text-sm text-gray-700"
                  >
                    <div className="mb-2">
                      <span className="font-semibold text-gray-600 block mb-1">
                        Input:
                      </span>
                      <pre className="bg-gray-100 p-2 rounded-md text-gray-800 text-sm whitespace-pre-wrap overflow-x-auto">
                        {tc.input}
                      </pre>
                    </div>
                    {tc.output && (
                      <div>
                        <span className="font-semibold text-gray-600 block mb-1">
                          Expected Output:
                        </span>
                        <pre className="bg-gray-100 p-2 rounded-md text-gray-800 text-sm whitespace-pre-wrap overflow-x-auto">
                          {tc.output}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            <Button
              variant="primary"
              onClick={handleRun}
              disabled={isRunning}
              className="w-full text-sm py-2 font-semibold"
            >
              {isRunning ? "Running..." : "Run Code"}
            </Button>
          </div>

          <div className="bg-gray-50 border border-gray-300 rounded-md p-3 mt-4 flex-grow overflow-y-auto">
            <h3 className="text-base font-semibold text-gray-800 mb-2">
              Output:
            </h3>
            {isRunning ? (
              <Spinner size="sm" />
            ) : runOutput ? (
              <div
                className={`text-sm ${
                  runOutput.status === "Accepted"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                <p className="font-semibold mb-1">{runOutput.message}</p>
                {runOutput.outputs && (
                  <pre className="text-gray-800 whitespace-pre-wrap mt-2">
                    {runOutput.outputs.join("\n")}
                  </pre>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                Click “Run Code” to test your solution.
              </p>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-3/5 p-6 bg-gray-50 overflow-y-auto flex flex-col">
          <div className="mb-3 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Your Solution
            </h3>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white border border-gray-300 p-2 rounded-md text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="cpp">C++</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
            </select>
          </div>

          <div className="flex-grow border border-gray-300 rounded-lg overflow-hidden shadow-sm">
            <CodeEditor code={code} setCode={setCode} language={language} />
          </div>
        </div>
      </div>
    </div>
  );
}
