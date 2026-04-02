import React from "react";

export default function Card({ children, className = "", hover = false, ...props }) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ${
        hover ? "hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
