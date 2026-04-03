import React from "react";

export default function TagPill({ label, icon: Icon, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ${
        className || ""
      }`}
    >
      {Icon ? <Icon className="h-4 w-4" /> : null}
      {label}
    </span>
  );
}

