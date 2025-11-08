import React from "react";

const Spinner = ({ size = "md", color = "blue" }) => {
  const sizeMap = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  const colorMap = {
    blue: "bg-blue-500",
    teal: "bg-teal-400",
    white: "bg-white",
    gray: "bg-gray-300",
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div
        className={`relative ${sizeMap[size]} animate-orbit-spin`}
      >
        {/* Center dot */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${colorMap[color]} rounded-full h-[25%] w-[25%] opacity-70`}
        ></div>

        {/* Orbiting dot */}
        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-green-400 rounded-full h-[20%] w-[20%] shadow-lg"
        ></div>
      </div>
    </div>
  );
};

export default Spinner;
