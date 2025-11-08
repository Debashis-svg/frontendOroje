// src/pages/EvaluateSubmissionsPage.jsx
import React, { useState, useEffect } from "react";
import api from "../services/api";
import Spinner from "../components/common/Spinner";
import Button from "../components/common/Button";

// --- MODAL COMPONENT (Copied from our previous work) ---
const EvaluationModal = ({ submission, onClose, onSave }) => {
  const [score, setScore] = useState(submission.totalScore);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data } = await api.put(`/admin/submissions/${submission._id}`, {
        totalScore: score,
        status: 'Evaluated'
      });
      onSave(data.submission);
    } catch (err) {
      alert('Failed to update score.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto text-gray-800">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Evaluate Submission</h2>
          <p className="text-gray-600">Team: {submission.team?.teamName || "Team Deleted"}</p>
        </div>
        <div className="p-6 space-y-4">
          {submission.answers.map(ans => (
            <div key={ans._id} className="bg-gray-100 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900">{ans.questionId?.title || 'Question'}</h4>
              <p className="text-sm text-gray-500">Type: {ans.questionId?.type}</p>
              {ans.questionId?.type === 'code' ? (
                <pre className="bg-gray-900 text-white p-3 rounded-md overflow-x-auto mt-2">
                  {ans.answer}
                </pre>
              ) : (
                <p className="text-gray-800 mt-2">Answer: {ans.answer}</p>
              )}
            </div>
          ))}
          <hr className="border-gray-200" />
          <div>
            <label className="block mb-2 font-medium text-gray-700">Final Score</label>
            <input
              type="number"
              value={score}
              onChange={e => setScore(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="p-6 bg-gray-50 flex justify-end gap-4 rounded-b-lg">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="button" variant="primary" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Score'}
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function EvaluateSubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try { // Added try/catch for error handling
        const { data } = await api.get("/admin/submissions");
        setSubmissions(data.submissions);
      } catch (err) {
        console.error("Failed to fetch submissions", err);
        alert("Failed to load submissions.");
      }
      setLoading(false);
    };
    fetchSubmissions();
  }, []);

  const handleSave = (updatedSubmission) => {
    setSubmissions(
      submissions.map((s) => (s._id === updatedSubmission._id ? updatedSubmission : s))
    );
    setSelectedSubmission(null);
  };

  if (loading) return <Spinner size="lg" />;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Evaluate Submissions</h1>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 font-semibold text-sm uppercase">Team</th>
              <th className="p-4 font-semibold text-sm uppercase">Round</th>
              <th className="p-4 font-semibold text-sm uppercase">Score</th>
              <th className="p-4 font-semibold text-sm uppercase">Status</th>
              <th className="p-4 font-semibold text-sm uppercase">Submitted At</th>
              <th className="p-4 font-semibold text-sm uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {submissions.map((sub) => (
              <tr key={sub._id} className="hover:bg-blue-50 transition">
                <td className="p-4">{sub.team?.teamName || "Team Deleted"}</td>
                <td className="p-4">{sub.round}</td>
                <td className="p-4">{sub.totalScore}</td>
                <td className="p-4">{sub.status}</td>
                <td className="p-4">{new Date(sub.submittedAt).toLocaleString()}</td>
                <td className="p-4">
                  <Button variant="primary" onClick={() => setSelectedSubmission(sub)}>
                    Review
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- ADDED MODAL RENDER --- */}
      {selectedSubmission && (
        <EvaluationModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}