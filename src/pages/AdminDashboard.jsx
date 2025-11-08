import React, { useState, useEffect } from "react";
import api from "../services/api";
import StatsCard from "../components/admin/StatsCard";
import { UsersIcon, CheckCircleIcon, CurrencyRupeeIcon } from "@heroicons/react/24/outline";
import UserTable from "../components/admin/UserTable";
import Spinner from "../components/common/Spinner";
import ConfirmationModal from "../components/common/ConfirmationModal";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentTeams, setRecentTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const fetchData = () => {
    setLoading(true);
    Promise.all([api.get("/admin/stats"), api.get("/admin/teams?limit=5")])
      .then(([statsRes, teamsRes]) => {
        setStats(statsRes.data);
        setRecentTeams(teamsRes.data.teams);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (team, action) => {
    setSelectedTeam(team);
    setModalAction(action);
    setModalOpen(true);
  };

  const handleModalConfirm = async () => {
    if (!selectedTeam || !modalAction) return;
    try {
      if (modalAction === "delete") await api.delete(`/admin/teams/${selectedTeam._id}`);
      if (modalAction === "verify") await api.put(`/admin/teams/${selectedTeam._id}/verify`);
      fetchData();
    } catch {
      alert(`Failed to ${modalAction} team.`);
    } finally {
      setModalOpen(false);
      setSelectedTeam(null);
      setModalAction(null);
    }
  };

  if (loading) return <Spinner size="lg" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-8 transition-all duration-300">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_2px_rgba(59,130,246,0.3)] rounded-xl">
            <StatsCard title="Total Teams" value={stats.totalTeams} icon={<UsersIcon />} color="blue" />
          </div>
          <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_2px_rgba(34,197,94,0.3)] rounded-xl">
            <StatsCard title="Verified Payments" value={stats.verifiedPayments} icon={<CheckCircleIcon />} color="green" />
          </div>
          <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_2px_rgba(250,204,21,0.3)] rounded-xl">
            <StatsCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={<CurrencyRupeeIcon />} color="yellow" />
          </div>
        </div>
      )}

      {/* Recent Teams */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 transition-all duration-300 hover:shadow-[0_0_20px_2px_rgba(0,200,255,0.2)] hover:border-blue-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Registrations</h2>
        <UserTable
          teams={recentTeams}
          onDelete={(team) => openModal(team, "delete")}
          onVerify={(team) => openModal(team, "verify")}
        />
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleModalConfirm}
        title={`Confirm ${modalAction}`}
        message={`Are you sure you want to ${modalAction} team "${selectedTeam?.teamName}"?`}
        confirmText={modalAction === "delete" ? "Delete" : "Verify"}
        confirmVariant={modalAction === "delete" ? "danger" : "primary"}
      />
    </div>
  );
}
