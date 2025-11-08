import React, { useState } from "react";
import api from "../services/api";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";

export default function GenerateCertificatesPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleGenerate = async () => {
    if (!window.confirm("Are you sure you want to generate all certificates? This action can take time.")) return;

    setLoading(true);
    setMessage("");
    try {
      const { data } = await api.post("/admin/generate-certificates");
      setMessage(data.message);
    } catch {
      setMessage("Failed to generate certificates.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Generate Certificates</h1>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 max-w-3xl">
        <p className="text-gray-600 leading-relaxed mb-6">
          Click the button below to generate certificate entries for all qualifying teams based on the final results.
          This will create unique verification IDs for each team.
        </p>

        <Button
          onClick={handleGenerate}
          variant="primary"
          disabled={loading}
          className="text-lg px-6 py-3"
        >
          {loading ? "Generating..." : "Generate Certificates"}
        </Button>

        {loading && (
          <div className="mt-6 flex items-center gap-3 text-blue-500">
            <Spinner size="sm" />
            <span>Generating certificates... please wait.</span>
          </div>
        )}

        {message && (
          <div
            className={`mt-6 font-semibold p-3 rounded-md ${
              message.includes("Failed")
                ? "bg-red-50 text-red-600 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
