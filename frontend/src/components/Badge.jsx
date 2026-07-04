import React from "react";

export default function Badge({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "bg-teal-100 text-teal-700",
    accent: "bg-blue-100 text-blue-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    gray: "bg-slate-100 text-slate-700",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
