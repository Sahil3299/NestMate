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
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              R
            </div>
            <span className="font-bold text-lg text-gray-900">RoomSync</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => navigate("/matches")}
              className={`text-sm font-medium transition-colors ${
                location.pathname === "/matches"
                  ? "text-primary-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              🏠 Find Matches
            </button>
            <button
              onClick={() => navigate("/profile")}
              className={`text-sm font-medium transition-colors ${
                location.pathname === "/profile"
                  ? "text-primary-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              👤 My Profile
            </button>
          </nav>

          {/* User Menu */}
          {user && (
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:shadow-md transition-shadow">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={logout}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Tab Navigation (only on matches page) */}
        {location.pathname === "/matches" && (
          <div className="border-t border-gray-200 flex gap-8">
            <button className="pb-4 text-primary-600 border-b-2 border-primary-600 font-medium text-sm hover:text-primary-700 transition-colors">
              📋 All Matches
            </button>
            <button className="pb-4 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">
              🏠 Rooms
            </button>
            <button className="pb-4 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">
              👥 Roommates
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
