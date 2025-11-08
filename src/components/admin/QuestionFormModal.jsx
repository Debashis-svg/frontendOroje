import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Button from "../common/Button";

const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-white text-gray-800";
const labelClass = "block mb-2 font-semibold text-gray-700";

const defaultCodeSnippets = [
  { language: "cpp", code: "#include <iostream>\nusing namespace std;\n\nint main() {\n  // Your code here\n  return 0;\n}" },
  { language: "python", code: "def solve():\n    # Your code here\n    pass\n\nif __name__ == '__main__':\n    solve()" },
  { language: "java", code: "public class Main {\n  public static void main(String[] args) {\n    // Your code here\n  }\n}" },
  { language: "javascript", code: "function solve() {\n  // Your code here\n}\nsolve();" },
];

const defaultFormState = {
  title: "",
  description: "",
  round: 1,
  type: "mcq",
  points: 10,
  options: [
    { id: "a", text: "" },
    { id: "b", text: "" },
    { id: "c", text: "" },
    { id: "d", text: "" },
  ],
  correctAnswer: "a",
  testCases: [{ input: "", expectedOutput: "" }],
  defaultCodeSnippets,
};

export default function QuestionFormModal({ question, onClose, onSave }) {
  const isEditing = !!question;
  const [formData, setFormData] = useState(defaultFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeLanguageTab, setActiveLanguageTab] = useState("cpp");

  useEffect(() => {
    if (isEditing) {
      setFormData({
        ...defaultFormState,
        ...question,
        options: question.options?.length
          ? question.options
          : defaultFormState.options,
        testCases: question.testCases?.length
          ? question.testCases
          : defaultFormState.testCases,
        defaultCodeSnippets: defaultCodeSnippets.map((snippet) => {
          const existing = question.defaultCodeSnippets?.find(
            (s) => s.language === snippet.language
          );
          return existing || snippet;
        }),
      });
    }
  }, [isEditing, question]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    const options = [...formData.options];
    options[index].text = value;
    setFormData((prev) => ({ ...prev, options }));
  };

  const handleTestCaseChange = (index, field, value) => {
    const testCases = [...formData.testCases];
    testCases[index][field] = value;
    setFormData((prev) => ({ ...prev, testCases }));
  };

  const addTestCase = () => {
    setFormData((prev) => ({
      ...prev,
      testCases: [...prev.testCases, { input: "", expectedOutput: "" }],
    }));
  };

  const handleDefaultCodeChange = (language, code) => {
    setFormData((prev) => ({
      ...prev,
      defaultCodeSnippets: prev.defaultCodeSnippets.map((snippet) =>
        snippet.language === language ? { ...snippet, code } : snippet
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = { ...formData };
    try {
      let res;
      if (isEditing) {
        res = await api.put(`/questions/${question._id}`, payload);
      } else {
        res = await api.post("/questions", payload);
      }
      onSave(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save question");
    } finally {
      setLoading(false);
    }
  };

  const activeSnippet =
    formData.defaultCodeSnippets.find((s) => s.language === activeLanguageTab)
      ?.code || "";

  return (
    <div className="fixed inset-0 bg-white/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {isEditing ? "Edit Question" : "Add New Question"}
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="hover:rotate-90 transition-transform"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Top Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Round</label>
              <select
                name="round"
                value={formData.round}
                onChange={handleChange}
                className={inputClass}
              >
                <option value={1}>Round 1</option>
                <option value={2}>Round 2</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="mcq">MCQ</option>
                <option value="aptitude">Aptitude</option>
                <option value="code">Coding</option>
                <option value="ai_ml">AI / ML</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Points</label>
              <input
                type="number"
                name="points"
                value={formData.points}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* Title & Description */}
          <div>
            <label className={labelClass}>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter question title"
              required
            />
          </div>
          <div>
            <label className={labelClass}>
              Description / Problem Statement
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`${inputClass} min-h-[120px]`}
              placeholder="Describe the question in detail..."
              required
            />
          </div>

          {/* MCQ Section */}
          {(formData.type === "mcq" || formData.type === "aptitude") && (
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <h4 className="text-lg font-semibold text-blue-700 mb-3">
                MCQ Options
              </h4>
              {formData.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-gray-500 w-4">{opt.id}.</span>
                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                    className={inputClass}
                    placeholder={`Option ${opt.id}`}
                    required
                  />
                </div>
              ))}
              <div>
                <label className={labelClass}>Correct Answer</label>
                <select
                  name="correctAnswer"
                  value={formData.correctAnswer}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {formData.options.map((o) => (
                    <option key={o.id} value={o.id}>
                      Option {o.id.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Coding Section */}
          {(formData.type === "code" || formData.type === "ai_ml") && (
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-blue-700 mb-3">
                  Test Cases
                </h4>
                {formData.testCases.map((tc, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3"
                  >
                    <textarea
                      value={tc.input}
                      onChange={(e) =>
                        handleTestCaseChange(i, "input", e.target.value)
                      }
                      placeholder={`Test Case ${i + 1} Input`}
                      className={`${inputClass} min-h-[60px] font-mono`}
                    />
                    <textarea
                      value={tc.expectedOutput}
                      onChange={(e) =>
                        handleTestCaseChange(i, "expectedOutput", e.target.value)
                      }
                      placeholder={`Expected Output`}
                      className={`${inputClass} min-h-[60px] font-mono`}
                    />
                  </div>
                ))}
                <Button type="button" variant="secondary" onClick={addTestCase}>
                  + Add Test Case
                </Button>
              </div>

              {/* Default Code Snippets */}
              <div>
                <h4 className="text-lg font-semibold text-blue-700 mb-3">
                  Default Starter Code
                </h4>
                <div className="flex border-b border-blue-200 mb-3">
                  {defaultCodeSnippets.map((snip) => (
                    <button
                      key={snip.language}
                      type="button"
                      onClick={() => setActiveLanguageTab(snip.language)}
                      className={`px-4 py-2 text-sm font-medium transition-colors duration-200
                      ${
                        activeLanguageTab === snip.language
                          ? "text-blue-700 border-b-2 border-blue-500"
                          : "text-gray-500 hover:text-blue-600"
                      }`}
                    >
                      {snip.language.toUpperCase()}
                    </button>
                  ))}
                </div>
                <textarea
                  value={activeSnippet}
                  onChange={(e) =>
                    handleDefaultCodeChange(activeLanguageTab, e.target.value)
                  }
                  className={`${inputClass} min-h-[200px] font-mono`}
                />
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-center">{error}</p>}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 flex justify-end gap-4 border-t border-gray-200">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Saving..." : "Save Question"}
          </Button>
        </div>
      </form>
    </div>
  );
}
