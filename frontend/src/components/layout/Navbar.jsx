import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { House, Search, HelpCircle, PlusCircle, User, LogIn, LogOut, UserPlus, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: 'Home', href: '/', icon: House },
    { label: 'Browse', href: '/browse', icon: Search },
    { label: 'How it Works', href: '#how-it-works', icon: HelpCircle },
  ];

  const handleNavClick = (href) => {
    setIsOpen(false);
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0] h-[78px] flex items-center">
      <div className="container-max w-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <img src={logo} alt="NestMate" className="h-16 w-26" />
            <span className="font-display font-bold text-xl text-[#0F172A] tracking-tight">NestMate</span>
          </Link>

          {/* Desktop Nav - Centered */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-xl flex items-center gap-2 group ${
                    active
                      ? 'text-[#14B8A6] bg-teal-50/50'
                      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50'
                  }`}
                >
                  <Icon size={16} className="shrink-0" />
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-[#14B8A6] to-[#0F766E] rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {user ? (
              <>
                <Link
                  to={`/profile/${user._id || user.id}`}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <User size={16} />
                  My Profile
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#64748B] hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <LogIn size={16} />
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#14B8A6] hover:bg-[#0F766E] rounded-xl transition-colors shadow-sm"
                >
                  <UserPlus size={16} />
                  Sign Up
                </Link>
              </>
            )}
            <Link to="/post-room" className="btn-primary text-sm !px-5 !py-2.5">
              <PlusCircle size={16} />
              Post Free Ad
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2.5 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} className="text-[#0F172A]" /> : <Menu size={22} className="text-[#0F172A]" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="fixed top-[78px] left-0 right-0 bottom-0 bg-white z-40 md:hidden animate-slideDown overflow-y-auto">
          <div className="container-max py-6 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'text-[#14B8A6] bg-teal-50'
                      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50'
                  }`}
                >
                  <Icon size={18} className="shrink-0" />
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-4 mt-4 border-t border-[#E2E8F0] space-y-2">
              {user ? (
                <>
                  <Link
                    to={`/profile/${user._id || user.id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition-all"
                  >
                    <User size={18} />
                    My Profile
                  </Link>
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-[#64748B] hover:text-red-600 hover:bg-red-50 w-full transition-all text-left"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition-all"
                  >
                    <LogIn size={18} />
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-white bg-[#14B8A6] hover:bg-[#0F766E] transition-all"
                  >
                    <UserPlus size={18} />
                    Sign Up
                  </Link>
                </>
              )}
              <Link
                to="/post-room"
                onClick={() => setIsOpen(false)}
                className="btn-primary w-full"
              >
                <PlusCircle size={16} />
                Post Free Ad
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
