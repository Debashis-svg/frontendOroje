import React, { useState, useEffect } from "react";
import api from "../services/api";
import UserTable from "../components/admin/UserTable";
import Spinner from "../components/common/Spinner";
import ConfirmationModal from "../components/common/ConfirmationModal";

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/teams/all");
      setTeams(data.teams);
    } catch (err) {
      setError("Failed to load teams.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const openModal = (team, action) => {
    setSelectedTeam(team);
    setModalAction(action);
    setModalOpen(true);
  };

  const handleModalConfirm = async () => {
    if (!selectedTeam || !modalAction) return;

    try {
      if (modalAction === "delete") {
        await api.delete(`/admin/teams/${selectedTeam._id}`);
        setTeams(teams.filter((t) => t._id !== selectedTeam._id));
      } else if (modalAction === "verify") {
        const { data } = await api.put(`/admin/teams/${selectedTeam._id}/verify`);
        setTeams(teams.map((t) => (t._id === data.team._id ? data.team : t)));
      }
    } catch {
      alert(`Failed to ${modalAction} team.`);
    } finally {
      setModalOpen(false);
      setSelectedTeam(null);
      setModalAction(null);
    }
  };

  if (loading) return <Spinner size="lg" />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Teams</h1>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <UserTable
          teams={teams}
          onDelete={(team) => openModal(team, "delete")}
          onVerify={(team) => openModal(team, "verify")}
        />
      </div>

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
