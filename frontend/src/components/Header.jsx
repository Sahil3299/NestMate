import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/matches")}>
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
              N
            </div>
            <span className="font-bold text-lg text-gray-900 tracking-tight">Nestmate</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => navigate("/matches")}
              className={`text-sm font-medium transition-colors ${
                location.pathname === "/matches"
                  ? "text-blue-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Find Matches
            </button>
            <button
              onClick={() => navigate("/profile")}
              className={`text-sm font-medium transition-colors ${
                location.pathname === "/profile"
                  ? "text-blue-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Profile
            </button>
          </nav>

          {/* User Menu */}
          {user && (
            <div className="flex items-center gap-4">
              <div
                className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate("/profile")}
                role="button"
                tabIndex={0}
              >
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={() => navigate("/profile")}
                className="text-sm font-semibold text-blue-700 hover:text-blue-800 transition-colors"
              >
                Profile
              </button>
              <button
                onClick={logout}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Logout
              </button>
            </div>
          )}

          {!user && (
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-semibold text-blue-700 hover:text-blue-800 transition-colors"
            >
              Login
            </button>
          )}
        </div>

        {/* Tab Navigation (only on matches page) */}
        {location.pathname === "/matches" && (
          <div className="border-t border-gray-200 flex gap-10">
            <button className="pb-4 text-blue-700 border-b-2 border-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors">
              All Matches
            </button>
            <button className="pb-4 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">
              Rooms
            </button>
            <button className="pb-4 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">
              Roommates
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
