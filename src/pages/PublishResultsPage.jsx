// src/pages/PublishResultsPage.jsx
import React, { useState, useEffect } from "react";
import api from "../services/api";
import Spinner from "../components/common/Spinner";
import Button from "../components/common/Button";
import ConfirmationModal from "../components/common/ConfirmationModal";
import { TrophyIcon } from "@heroicons/react/24/solid";

export default function PublishResultsPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true); // For initial page load
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContext, setModalContext] = useState({ action: null, message: '', title: '' });
  
  // --- FIX 1: Change isProcessing to loadingButton ---
  // This tracks *which* button is loading, not just if *any* button is.
  const [loadingButton, setLoadingButton] = useState(null); // e.g., 'deploy1', 'finalize1'

  // --- FIX 2: Add state to hold the global settings ---
  const [settings, setSettings] = useState(null);

  const fetchPageData = async () => {
    // We now fetch both leaderboard and settings
    try {
      const [boardRes, settingsRes] = await Promise.all([
        api.get("/admin/leaderboard?round=1"),
        api.get("/admin/settings") // <-- Fetch settings
      ]);
      setLeaderboard(boardRes.data.leaderboard);
      setSettings(settingsRes.data);
    } catch (err) {
      console.error("Failed to fetch page data", err);
      alert("Failed to load page data.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPageData(); // Call the new combined function
  }, []);

  const handleConfirm = async () => {
    const action = modalContext.action;
    setModalOpen(false);
    setLoadingButton(action); // <-- FIX: Set specific button to loading

    let apiEndpoint = '';
    if (action === 'finalize1') apiEndpoint = '/admin/qualify-round-1';
    if (action === 'publish1') apiEndpoint = '/admin/publish-round-1';
    if (action === 'finalize2') apiEndpoint = '/admin/qualify-round-2';
    if (action === 'publish2') apiEndpoint = '/admin/publish-round-2';

    try {
      const { data } = await api.post(apiEndpoint);
      alert(data.message);
      fetchPageData(); // <-- FIX: Refresh all data (leaderboard and settings)
    } catch (error) {
      alert(error.response?.data?.message || 'An error occurred.');
    } finally {
      setLoadingButton(null); // <-- FIX: Reset loading state
    }
  };

  const openModal = (action) => {
    if (action === 'finalize1') {
      setModalContext({
        action: 'finalize1',
        title: 'Finalize Round 1?',
        message: 'This will calculate all Round 1 scores, apply the (50% score or 75% rank) logic, and set the `qualifiedForRound2` flag for all winners.'
      });
    }
    if (action === 'publish1') {
      setModalContext({
        action: 'publish1',
        title: 'Publish Round 1 Results?',
        message: 'This will make the "Qualified" / "Not Qualified" status visible on all participant dashboards.'
      });
    }
    if (action === 'finalize2') {
      setModalContext({
        action: 'finalize2',
        title: 'Finalize Round 2?',
        message: 'This will calculate all Round 2 scores (e.g., top 50%) and set the `qualifiedForRound3` flag for all winners.'
      });
    }
    if (action === 'publish2') {
      setModalContext({
        action: 'publish2',
        title: 'Publish Round 2 Results?',
        message: 'This will make the "Qualified for R3" / "Not Qualified" status visible on all participant dashboards.'
      });
    }
    setModalOpen(true);
  };

  // --- UPDATED DEPLOY HANDLERS ---
  const handleDeploy = async (round) => {
    const action = `deploy${round}`;
    if (window.confirm(`This will make Round ${round} live for all participants. Are you sure?`)) {
      setLoadingButton(action); // <-- Set specific button
      try {
        const { data } = await api.post(`/admin/deploy-round-${round}`);
        alert(data.message);
        fetchPageData(); // <-- Refresh all data
      } catch (error) {
        alert(error.response?.data?.message || `Failed to deploy Round ${round}.`);
      } finally {
        setLoadingButton(null); // <-- Reset
      }
    }
  };
 
  const getRankColor = (index) => {
    if (index === 0) return 'text-yellow-500';
    if (index === 1) return 'text-gray-500';
    if (index === 2) return 'text-orange-500';
    return 'text-gray-800'; // Dark text for light background
  };

  // Use the master 'loading' for the whole page, and 'settings' to check if loaded
  if (loading || !settings) return <Spinner size="lg" />;

  // This is the check for *any* button being processed
  const isProcessing = loadingButton !== null;

  return (
    // Your new light-theme UI
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Publish Results</h1>

      {/* --- ALL BUTTONS ARE NOW FIXED --- */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Button 
          variant="secondary" 
          className="bg-green-600 hover:bg-green-700 text-white" 
          onClick={() => handleDeploy(1)} 
          disabled={isProcessing || settings.round1Live} // <-- FIX: Check settings
        >
          {loadingButton === 'deploy1' ? 'Working...' : settings.round1Live ? 'Round 1 Deployed' : 'Deploy Round 1'}
        </Button>
        
        <Button variant="secondary" onClick={() => openModal('finalize1')} disabled={isProcessing || settings.round1Finalized}>
          {loadingButton === 'finalize1' ? 'Working...' : settings.round1Finalized ? 'R1 Finalized' : 'Finalize R1'}
        </Button>
        
        <Button variant="primary" onClick={() => openModal('publish1')} disabled={isProcessing || settings.round1Published}>
          {loadingButton === 'publish1' ? 'Working...' : settings.round1Published ? 'R1 Published' : 'Publish R1'}
        </Button>
        
        {/* Divider */}
        <div className="w-full border-t border-gray-200 my-2"></div> 

        <Button 
          variant="secondary" 
          className="bg-green-600 hover:bg-green-700 text-white" 
          onClick={() => handleDeploy(2)} 
          disabled={isProcessing || settings.round2Live}
        >
          {loadingButton === 'deploy2' ? 'Working...' : settings.round2Live ? 'Round 2 Deployed' : 'Deploy Round 2'}
        </Button>
        
        <Button variant="secondary" onClick={() => openModal('finalize2')} disabled={isProcessing || settings.round2Finalized}>
          {loadingButton === 'finalize2' ? 'Working...' : settings.round2Finalized ? 'R2 Finalized' : 'Finalize R2'}
        </Button>
        
        <Button variant="primary" onClick={() => openModal('publish2')} disabled={isProcessing || settings.round2Published}>
          {loadingButton === 'publish2' ? 'Working...' : settings.round2Published ? 'R2 Published' : 'Publish R2'}
        </Button>
      </div>
      {/* --- END OF BUTTON FIXES --- */}

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 font-semibold text-sm uppercase">Rank</th>
              <th className="p-4 font-semibold text-sm uppercase">Team</th>
              <th className="p-4 font-semibold text-sm uppercase">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leaderboard.map((item, index) => (
              <tr key={item._id} className="hover:bg-blue-50 transition">
                <td className={`p-4 font-semibold text-lg ${getRankColor(index)}`}>
                   {index < 3 && <TrophyIcon className="h-5 w-5 inline mr-2" />}
                   {index + 1}
                </td>
                <td className="p-4">{item.team?.teamName || "Team Deleted"}</td>
                <td className="p-4 font-semibold">{item.totalScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        title={modalContext.title}
        message={modalContext.message}
        confirmText="Yes, Proceed"
        confirmVariant="danger"
      />
    </div>
  );
}