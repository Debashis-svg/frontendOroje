import React, { useState, useEffect } from "react";
import CodeEditor from "./CodeEditor";
import McqOption from "./McqOption";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import api from "../../services/api";

export default function TestWindow({
  question,
  onAnswerChange,
  savedAnswer,
  language,
  onLanguageChange,
}) {
  const [isRunning, setIsRunning] = useState(false);
  const [runOutput, setRunOutput] = useState(null);

  useEffect(() => {
    if (question.type === "code" || question.type === "ai_ml") {
      const defaultSnippet = question.defaultCodeSnippets?.find(
        (s) => s.language === language
      );
      const newDefaultCode = defaultSnippet ? defaultSnippet.code : "";
      const isCurrentlyDefault = question.defaultCodeSnippets?.some(
        (s) => s.language !== language && s.code === savedAnswer
      );
      if (savedAnswer === null || savedAnswer === "" || isCurrentlyDefault) {
        onAnswerChange(newDefaultCode);
      }
    }
  }, [language]);

  const handleRunCode = async () => {
    setIsRunning(true);
    setRunOutput(null);
    try {
      const { data } = await api.post("/test/run", {
        code: savedAnswer,
        language,
        questionId: question._id,
      });
      setRunOutput(data);
    } catch {
      setRunOutput({ status: "Error", message: "Failed to run code." });
    } finally {
      setIsRunning(false);
    }
  };

  const getOutputColor = (status) => {
    if (status === "Accepted") return "text-green-600";
    if (["Error", "Wrong Answer", "Compilation Error"].includes(status))
      return "text-red-500";
    return "text-gray-800";
  };

  const renderMCQ = () => (
    <div className="space-y-3">
      {question.options.map((opt) => (
        <McqOption
          key={opt.id}
          option={opt}
          selectedOption={savedAnswer}
          onSelect={onAnswerChange}
        />
      ))}
    </div>
  );

  const renderCodeSidebar = () => (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700">Language:</label>
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="bg-white border border-gray-300 p-2 rounded-md text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="cpp">C++</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="javascript">JavaScript</option>
        </select>
      </div>

      {/* Test Cases */}
      {question.testCases?.length > 0 && (
        <div className="mb-4">
          <h4 className="text-base font-semibold text-gray-800 mb-2">
            Visible Test Cases
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto bg-gray-50 border border-gray-300 rounded-md p-2">
            {question.testCases.map((tc, i) => (
              <div
                key={i}
                className="bg-white p-2 rounded border border-gray-200 text-sm text-gray-700"
              >
                <span className="text-gray-500">Input:</span> {tc.input}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Run Code */}
      <div className="mb-4">
        <Button
          variant="primary"
          onClick={handleRunCode}
          disabled={isRunning}
          className="w-full text-sm py-2 font-semibold"
        >
          {isRunning ? "Running..." : "Run Code"}
        </Button>
      </div>

      {/* Output */}
      <div className="bg-gray-50 border border-gray-300 rounded-md p-3 flex-grow overflow-y-auto">
        <h3 className="text-base font-semibold text-gray-800 mb-2">Output:</h3>
        {isRunning ? (
          <Spinner size="sm" />
        ) : runOutput ? (
          <div className={`${getOutputColor(runOutput.status)} text-sm`}>
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
  );

  const isCodingQuestion = question.type === "code" || question.type === "ai_ml";

  return (
    <div className="flex flex-col md:flex-row h-full bg-white border-t border-gray-300 text-gray-800">
      {/* LEFT PANEL */}
      <div className="w-full md:w-2/5 p-6 border-r border-gray-300 overflow-y-auto">
        <h2 className="text-xl font-bold mb-3 text-gray-900">
          {question.title}
        </h2>
        <div
          className="text-gray-700 text-sm mb-6 whitespace-pre-wrap leading-relaxed"
          dangerouslySetInnerHTML={{ __html: question.description }}
        />
        {isCodingQuestion ? renderCodeSidebar() : renderMCQ()}
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-3/5 p-6 bg-gray-50 overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Your Answer
        </h3>
        {isCodingQuestion ? (
          <CodeEditor
            code={savedAnswer || ""}
            setCode={onAnswerChange}
            language={language}
          />
        ) : (
          <p className="text-gray-500 text-sm">
            Select your answer on the left.
          </p>
        )}
      </div>
    </div>
  );
}
