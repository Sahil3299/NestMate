import { Link } from "react-router-dom";
import { Shield, ExternalLink } from "lucide-react";
import logo from "../../assets/logo.png";

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

function SocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="w-9 h-9 bg-white border border-[#E2E8F0] rounded-xl flex items-center justify-center text-[#64748B] hover:text-[#14B8A6] hover:border-[#14B8A6] hover:shadow-sm transition-all duration-200"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E2E8F0] mt-20">
      <div className="container-max py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <img src={logo} alt="NestMate" className="h-10 w-auto" />
              <span className="font-display font-bold text-xl text-[#0F172A] tracking-tight">NestMate</span>
            </Link>
            <p className="text-sm text-[#64748B] leading-relaxed mb-6 max-w-xs">
              Find your perfect flatmate in Mumbai, Pune, Bangalore, and other Indian cities. Zero brokerage, verified profiles, trusted by thousands.
            </p>
            <div className="flex gap-2">
              <SocialIcon href="#" label="Twitter / X">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                  <path d="M4 20l6.768 -6.768m2.46 -2.46L20 4" />
                </svg>
              </SocialIcon>
              <SocialIcon href="#" label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
                </svg>
              </SocialIcon>
              <SocialIcon href="#" label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="4" />
                  <path d="M8 11v5" />
                  <path d="M8 8v0" />
                  <path d="M12 16v-5" />
                  <path d="M16 16v-3a2 2 0 0 0 -4 0" />
                </svg>
              </SocialIcon>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-sm font-semibold text-[#0F172A] mb-4">{section}</h4>
              <ul className="space-y-3">
                {items.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-sm text-[#64748B] hover:text-[#14B8A6] transition-colors inline-flex items-center gap-1.5 group"
                    >
                      {label}
                      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#E2E8F0] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#64748B]">&copy; {new Date().getFullYear()} NestMate. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
              <Shield size={12} className="text-[#22C55E]" />
              Privacy Protected
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#22C55E]">
              <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse" />
              All systems operational
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
