import React from "react";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  ...props
}) {
  const baseStyles = "font-medium transition-all duration-200 rounded-lg flex items-center justify-center gap-2 cursor-pointer";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
      "bg-white text-blue-700 hover:bg-blue-50 border border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed",
    accent:
      "bg-blue-100 text-blue-800 hover:bg-blue-200 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed",
    ghost:
      "text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed",
    outline:
      "border-2 border-blue-600 text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
