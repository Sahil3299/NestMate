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
    primary: "bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-lg hover:from-primary-700 hover:to-primary-600 disabled:opacity-50 disabled:cursor-not-allowed",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed",
    accent: "bg-gradient-to-r from-accent-600 to-accent-500 text-white hover:shadow-lg hover:from-accent-700 hover:to-accent-600 disabled:opacity-50 disabled:cursor-not-allowed",
    ghost: "text-primary-600 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed",
    outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed",
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
