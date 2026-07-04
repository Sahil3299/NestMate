import React from "react";

export default function Checkbox({ label, error, className = "", ...props }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          className="w-5 h-5 rounded border-[#E2E8F0] text-[#14B8A6] focus:ring-[#14B8A6] cursor-pointer"
          {...props}
        />
        {label && <span className="text-sm font-medium text-[#64748B]">{label}</span>}
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
