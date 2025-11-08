import React from "react";

export default function McqOption({ option, selectedOption, onSelect }) {
  const isSelected = selectedOption === option.id;

  return (
    <button
      onClick={() => onSelect(option.id)}
      className={`w-full text-left p-3 rounded-md border text-sm font-medium transition-colors duration-150 shadow-sm ${
        isSelected
          ? "bg-green-100 border-green-500 text-green-800"
          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
      }`}
    >
      <span
        className={`mr-2 font-semibold ${
          isSelected ? "text-green-700" : "text-gray-500"
        }`}
      >
        {option.id}.
      </span>
      {option.text}
    </button>
  );
}
