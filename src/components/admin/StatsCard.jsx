import React from "react";

const StatsCard = ({ title, value, icon, color = "blue" }) => {
  const colorClasses = {
    blue: "text-blue-500 bg-blue-100",
    green: "text-green-500 bg-green-100",
    yellow: "text-yellow-500 bg-yellow-100",
    red: "text-red-500 bg-red-100",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center space-x-4 hover:shadow-md transition">
      <div className={`p-3 rounded-full ${colorClasses[color]}`}>{React.cloneElement(icon, { className: "h-7 w-7" })}</div>
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
