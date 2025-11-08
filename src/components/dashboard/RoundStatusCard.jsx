import React from "react";
import { Link } from "react-router-dom";
import {
  LockClosedIcon,
  CheckIcon,
  RocketLaunchIcon,
  XCircleIcon,
  TrophyIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

export default function RoundStatusCard({ round }) {
  if (!round) return null;

  const getBorderColor = () => {
    switch (round.status) {
      case "Live":
        return "border-green-500";
      case "Qualified_Live":
      case "Qualified_Waiting":
      case "Qualified_Final":
        return "border-green-500";
      case "Not_Qualified":
        return "border-red-500";
      case "Completed_Pending_R1":
      case "Completed_Pending_R2":
        return "border-yellow-500";
      default:
        return "border-gray-300";
    }
  };

  const buttonBase =
    "w-full text-lg py-3 flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 shadow-md";

  const renderStatus = () => {
    switch (round.status) {
      case "Live":
        return (
          <Link to={round.link}>
            <button
              className={`${buttonBase} bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-400 hover:to-emerald-300 text-white shadow-green-500/40 hover:shadow-green-400/60`}
            >
              <RocketLaunchIcon className="h-6 w-6 text-white animate-pulse" />
              Start Round 1 Now
            </button>
          </Link>
        );

      case "Qualified_Live":
        return (
          <Link to={round.link}>
            <button
              className={`${buttonBase} bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-400 hover:to-emerald-300 text-white shadow-green-500/40 hover:shadow-green-400/60`}
            >
              <TrophyIcon className="h-6 w-6 text-white animate-bounce" />
              Start Round 2 Now
            </button>
          </Link>
        );

      case "Qualified_Waiting":
      case "Qualified_Final":
        return (
          <button
            disabled
            className={`${buttonBase} bg-gradient-to-r from-green-600 to-emerald-500 text-white cursor-not-allowed shadow-green-500/30`}
          >
            <CheckIcon className="h-6 w-6 text-white" />
            Qualified
          </button>
        );

      case "Not_Qualified":
        return (
          <button
            disabled
            className={`${buttonBase} bg-gradient-to-r from-red-600 to-rose-500 text-white cursor-not-allowed`}
          >
            <XCircleIcon className="h-6 w-6" />
            Did Not Qualify
          </button>
        );

      case "Completed_Pending_R1":
      case "Completed_Pending_R2":
        return (
          <button
            disabled
            className={`${buttonBase} bg-gradient-to-r from-yellow-500 to-amber-400 text-black cursor-not-allowed`}
          >
            <ClockIcon className="h-6 w-6 text-black" />
            Submission Received
          </button>
        );

      default:
        return (
          <button
            disabled
            className={`${buttonBase} bg-gray-200 text-gray-600 border border-gray-300 cursor-not-allowed`}
          >
            <LockClosedIcon className="h-6 w-6 text-gray-500" />
            Round is Locked
          </button>
        );
    }
  };

  return (
    <div
      className={`bg-white/80 backdrop-blur-xl border-l-4 ${getBorderColor()} rounded-2xl shadow-lg p-6 hover:border-green-400/40 transition-all duration-300`}
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{round.name}</h3>
      <p className="text-gray-600 mb-6">{round.description}</p>
      <div>{renderStatus()}</div>
    </div>
  );
}
