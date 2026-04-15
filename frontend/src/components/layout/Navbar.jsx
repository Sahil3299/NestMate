import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Browse', href: '/browse' },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200">
      <div className="container-max py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-teal-700 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white font-display font-bold text-lg">N</span>
            </div>
            <span className="font-display font-bold text-xl text-slate-900">NestMate</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-teal-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <button className="btn-ghost text-sm">
              Sign In
            </button>
            <Link to="/post-room" className="btn-primary text-sm">
              Post Free Ad
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isOpen ? <X size={24} className="text-slate-900" /> : <Menu size={24} className="text-slate-900" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-slate-200 space-y-3 animate-slideDown">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-sm font-medium text-slate-700 hover:text-teal-600 py-2"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 space-y-2 border-t border-slate-200">
              <button className="btn-ghost w-full text-sm">Sign In</button>
              <Link to="/post-room" className="btn-primary w-full text-sm">
                Post Free Ad
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
