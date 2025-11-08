import React from "react";
import Button from "./Button";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  confirmVariant = "danger",
}) {
  if (!isOpen) return null;

  return (
    <div
      // Full-screen overlay with fade-in
      className="fixed inset-0 z-[100] bg-black/60 flex justify-center items-center p-4 animate-fade-in-fast"
      onClick={onClose}
    >
      <div
        className="bg-white/90 backdrop-blur-md rounded-lg shadow-2xl border border-gray-200 w-full max-w-md transition-all duration-300 hover:shadow-[0_0_25px_3px_rgba(0,150,255,0.3)]"
        onClick={(e) => e.stopPropagation()} // keep clicks inside the modal
      >
        <div className="p-6">
          <div className="flex items-start space-x-4">
            {/* Icon — color depends on variant */}
            <div
              className={`flex-shrink-0 p-3 rounded-full ${
                confirmVariant === "danger"
                  ? "bg-red-100 text-red-500"
                  : "bg-blue-100 text-blue-500"
              }`}
            >
              <ExclamationTriangleIcon className="h-6 w-6" />
            </div>

            {/* Text Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              <p className="text-sm text-gray-600 mt-1">{message}</p>
            </div>
          </div>
        </div>

        {/* Footer with buttons */}
        <div className="bg-gray-100/80 p-4 flex justify-end space-x-3 rounded-b-lg border-t border-gray-200">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant={confirmVariant} onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
