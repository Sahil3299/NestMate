import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import { FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const FOOTER_LINKS = {
  Platform: [
    { label: "Browse Rooms", href: "/browse" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Safety Tips", href: "#safety" },
  ],
  Company: [
    { label: "About Us", href: "#about" },
    { label: "Blog", href: "#blog" },
    { label: "Contact", href: "#contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Terms of Use", href: "#terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-20">
      <div className="container-max py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-teal-700 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-display font-bold">N</span>
              </div>
              <span className="font-display font-bold text-lg text-slate-900">NestMate</span>
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Find your perfect flatmate in Mumbai, Pune, Bangalore, and other Indian cities. Zero brokerage, verified profiles.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-white border border-slate-300 rounded-lg flex items-center justify-center text-slate-600 hover:text-teal-600 hover:border-teal-600 transition-colors" title="Twitter">
                <FaTwitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white border border-slate-300 rounded-lg flex items-center justify-center text-slate-600 hover:text-teal-600 hover:border-teal-600 transition-colors" title="Instagram">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white border border-slate-300 rounded-lg flex items-center justify-center text-slate-600 hover:text-teal-600 hover:border-teal-600 transition-colors" title="LinkedIn">
                <FaLinkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-sm font-semibold text-slate-900 mb-4">{section}</h4>
              <ul className="space-y-2.5">
                {items.map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="text-sm text-slate-600 hover:text-teal-600 transition-colors">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} NestMate. All rights reserved.</p>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
