import React from "react";
import Button from "../common/Button";
import { CheckCircleIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function UserTable({ teams, onDelete, onVerify }) {
  if (!teams || teams.length === 0)
    return <div className="bg-white p-6 text-gray-500 rounded-lg shadow-sm">No teams have registered yet.</div>;

  const getStatusClass = (payment) => {
    return payment === "Verified"
      ? "bg-green-100 text-green-700 border border-green-300"
      : "bg-yellow-100 text-yellow-700 border border-yellow-300";
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="w-full bg-white text-left text-gray-700">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            {["Team Name", "Team Leader", "Members", "Payment", "Actions"].map((head) => (
              <th key={head} className="p-4 text-sm font-semibold text-gray-600 uppercase">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {teams.map((team) => (
            <tr key={team._id} className="hover:bg-blue-50 transition">
              <td className="p-4">{team.teamName}</td>
              <td className="p-4">{team.leader ? team.leader.email : "N/A"}</td>
              <td className="p-4">{team.members.length}</td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(team.paymentStatus)}`}>
                  {team.paymentStatus}
                </span>
              </td>
              <td className="p-4 space-x-2">
                {team.paymentStatus === "Pending" && (
                  <Button variant="primary" onClick={() => onVerify(team)} className="text-sm px-3 py-1">
                    <CheckCircleIcon className="h-4 w-4 inline mr-1" /> Verify
                  </Button>
                )}
                <Button variant="danger" onClick={() => onDelete(team)} className="text-sm px-3 py-1">
                  <TrashIcon className="h-4 w-4 inline mr-1" /> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
