import React from "react";
import { UserCircleIcon, CheckCircleIcon, UsersIcon } from "@heroicons/react/24/solid";

export default function TeamProfile({ team }) {
  if (!team) return <div>Loading team data...</div>;

  const isVerified = team.paymentStatus === "Verified";

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-blue-200 rounded-2xl shadow-lg p-6 text-gray-900 hover:border-blue-400/40 transition-all duration-300">
      <h3 className="text-2xl font-bold flex items-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
        <UsersIcon className="h-7 w-7 mr-2 text-blue-600" />
        {team.teamName}
      </h3>

      {/* Payment Status */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-500">
          Payment Status
        </label>
        <div
          className={`flex items-center text-lg font-semibold p-3 rounded-xl mt-2 border ${
            isVerified
              ? "bg-green-50 text-green-700 border-green-300"
              : "bg-yellow-50 text-yellow-700 border-yellow-300"
          }`}
        >
          {isVerified && <CheckCircleIcon className="h-6 w-6 mr-2" />}
          {team.paymentStatus}
        </div>
      </div>

      {/* Members */}
      <div>
        <h4 className="text-lg font-semibold text-blue-700 mb-3">Members</h4>
        <ul className="space-y-3">
          {team.members.map((member, index) => (
            <li
              key={index}
              className="flex items-center bg-white border border-gray-200 rounded-xl p-3 hover:border-blue-300 transition-all duration-200"
            >
              <UserCircleIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">
                  {member.name}{" "}
                  {member.role === "leader" && (
                    <span className="ml-2 text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      Leader
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-600">{member.email}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
