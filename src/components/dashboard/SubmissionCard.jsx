import React from "react";

export default function SubmissionCard({ submission }) {
  if (!submission) return null;

  const isEvaluated = submission.status === "Evaluated";
  const submissionDate = new Date(submission.submittedAt).toLocaleString();

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-md p-5 flex flex-col md:flex-row justify-between items-start md:items-center hover:border-blue-300 transition-all duration-300">
      <div>
        <h4 className="text-xl font-semibold text-blue-700">
          Submission for Round {submission.round}
        </h4>
        <p className="text-sm text-gray-600 mt-1">
          Submitted on: {submissionDate}
        </p>
      </div>

      <div className="flex items-center space-x-4 mt-4 md:mt-0">
        {isEvaluated ? (
          <div className="text-right">
            <p className="text-sm text-gray-600">Score</p>
            <p className="text-2xl font-bold text-green-600">
              {submission.totalScore}%
            </p>
          </div>
        ) : (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-300">
            Pending Evaluation
          </span>
        )}
      </div>
    </div>
  );
}
