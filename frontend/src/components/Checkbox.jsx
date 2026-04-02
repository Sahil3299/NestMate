import React from "react";

export default function Checkbox({ label, error, className = "", ...props }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
          {...props}
        />
        {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
