import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import Spinner from "../components/common/Spinner";
import TeamProfile from "../components/dashboard/TeamProfile";
import RoundStatusCard from "../components/dashboard/RoundStatusCard";
import SubmissionCard from "../components/dashboard/SubmissionCard";
import Button from "../components/common/Button";
import { DocumentArrowDownIcon } from "@heroicons/react/24/solid";

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => {
        setDashboardData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await api.get("/certificate/download", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const filename = response.headers["content-disposition"]
        ? response.headers["content-disposition"]
            .split("filename=")[1]
            .replace(/"/g, "")
        : "certificate.pdf";
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
      alert(
        "Failed to download certificate. Certificates may not be published yet."
      );
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center text-red-500">
        Failed to load dashboard data.
      </div>
    );
  }

  const { team, currentRound, pastSubmissions, settings } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-teal-100 text-gray-900 py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2">
            Welcome,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
              {team.teamName}
            </span>
            !
          </h1>
          <p className="text-gray-600 text-lg">
            View your team’s performance, progress, and certificates.
          </p>
        </div>

        {/* Certificate Section */}
        {settings.certificatesPublished ? (
          <div className="bg-white/80 backdrop-blur-md border border-yellow-300 rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-[0_0_20px_3px_rgba(255,215,0,0.6)] hover:border-yellow-400">
            <h2 className="text-2xl font-bold text-yellow-600 mb-3">
              Certificates are Ready! 🎉
            </h2>
            <p className="text-gray-700 mb-4">
              Thank you for your participation! You can now check and download
              your official certificate.
            </p>
            <Button
              variant="primary"
              onClick={handleDownload}
              disabled={downloading}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all duration-300"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
              {downloading ? "Generating..." : "Check for Certificate"}
            </Button>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-md border border-blue-300 rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-[0_0_20px_3px_rgba(0,128,255,0.4)] hover:border-blue-400">
            <h2 className="text-2xl font-bold text-blue-600 mb-3">
              Hackathon in Progress 🚀
            </h2>
            <p className="text-gray-700">
              Thank you for your participation! Certificates will be available
              once the event concludes and results are published.
            </p>
          </div>
        )}

        {/* Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Section */}
          <div className="lg:col-span-2 space-y-10">
            {/* Current Round */}
            <section>
              <h2 className="text-2xl font-semibold text-blue-700 mb-4">
                Current Round
              </h2>
              <div className="bg-white/80 backdrop-blur-md border border-blue-200 rounded-2xl shadow-md p-6 transition-all duration-300 hover:shadow-[0_0_20px_3px_rgba(0,255,200,0.5)] hover:border-blue-400">
                <RoundStatusCard round={currentRound} />
              </div>
            </section>

            {/* Past Submissions */}
            <section>
              <h2 className="text-2xl font-semibold text-blue-700 mb-4">
                Past Submissions
              </h2>
              {pastSubmissions.length > 0 ? (
                <div className="space-y-4">
                  {pastSubmissions.map((sub) => (
                    <div
                      key={sub._id}
                      className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-[0_0_18px_2px_rgba(0,150,255,0.4)] hover:border-blue-300"
                    >
                      <SubmissionCard submission={sub} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  You haven’t made any submissions yet.
                </p>
              )}
            </section>
          </div>

          {/* Right Section */}
          <div className="lg:col-span-1 space-y-8">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">
              Your Team
            </h2>
            <div className="bg-white/80 backdrop-blur-md border border-blue-200 rounded-2xl shadow-md p-6 transition-all duration-300 hover:shadow-[0_0_20px_3px_rgba(0,200,255,0.5)] hover:border-blue-400">
              <TeamProfile team={team} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
