import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { User, LogOut } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-[#E2E8F0] bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-9 h-9 bg-gradient-to-br from-[#14B8A6] to-[#0F766E] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm">
              N
            </div>
            <span className="font-bold text-lg text-[#0F172A] tracking-tight">NestMate</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate("/browse")} className={`text-sm font-medium transition-colors ${
              location.pathname === "/browse" ? "text-[#14B8A6]" : "text-[#64748B] hover:text-[#0F172A]"
            }`}>
              Browse
            </button>
            <button onClick={() => navigate("/profile")} className={`text-sm font-medium transition-colors ${
              location.pathname === "/profile" ? "text-[#14B8A6]" : "text-[#64748B] hover:text-[#0F172A]"
            }`}>
              Profile
            </button>
          </nav>

          {/* User Menu */}
          {user && (
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 bg-gradient-to-br from-[#14B8A6] to-[#0F766E] rounded-full flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate("/profile")} role="button" tabIndex={0}>
                {user.email?.charAt(0).toUpperCase() || user.name?.charAt(0) || "U"}
              </div>
              <button onClick={() => navigate("/profile")} className="text-sm font-semibold text-[#14B8A6] hover:text-[#0F766E] transition-colors flex items-center gap-1">
                <User size={14} />
                Profile
              </button>
              <button onClick={logout} className="text-sm font-medium text-[#64748B] hover:text-red-600 transition-colors flex items-center gap-1">
                <LogOut size={14} />
                Logout
              </button>
            </div>
          )}

          {!user && (
            <button onClick={() => navigate("/login")} className="text-sm font-semibold text-[#14B8A6] hover:text-[#0F766E] transition-colors">
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
