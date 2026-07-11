import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { House, Search, HelpCircle, PlusCircle, User, LogIn, LogOut, UserPlus, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <nav
      className={`sticky top-0 z-50 h-[72px] flex items-center transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm'
          : 'bg-white border-b border-slate-200/40'
      }`}
    >
      <div className="container-max w-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <img src={logo} alt="NestMate" className="h-14 w-auto" />
            <div className="hidden sm:block">
              <span className="font-display font-bold text-lg text-slate-900 tracking-tight leading-tight">
                NestMate
              </span>
              <span className="block text-[10px] text-slate-400 font-medium tracking-widest uppercase -mt-0.5">
                Find Your Match
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-xl flex items-center gap-2 ${
                    active
                      ? 'text-teal-600 bg-teal-50/80'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={15} className="shrink-0" />
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-1.5 shrink-0">
            {user ? (
              <>
                <Link
                  to={`/profile/${user._id || user.id}`}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all duration-200"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name?.split(' ')[0] || 'Profile'}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200"
                >
                  <LogOut size={15} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all duration-200"
                >
                  <LogIn size={15} />
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <UserPlus size={15} />
                  Sign Up
                </Link>
              </>
            )}
            <Link
              to="/post-room"
              className="btn-primary text-sm !px-5 !py-2.5 !rounded-xl"
            >
              <PlusCircle size={15} />
              Post Free Ad
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2.5 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} className="text-slate-900" /> : <Menu size={22} className="text-slate-900" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="fixed top-[72px] left-0 right-0 bottom-0 bg-white/95 backdrop-blur-xl z-40 md:hidden animate-fadeIn overflow-y-auto">
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
                      ? 'text-teal-600 bg-teal-50'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={18} className="shrink-0" />
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
              {user ? (
                <>
                  <Link
                    to={`/profile/${user._id || user.id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    My Profile
                  </Link>
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 w-full transition-all text-left"
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
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all"
                  >
                    <LogIn size={18} />
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 transition-all"
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
