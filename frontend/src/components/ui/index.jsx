// frontend/src/components/ui/index.jsx
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/utils/cn";
import { getInitials, getMatchColor } from "@/utils/formatters";

// ── Avatar ─────────────────────────────────────────────────────────────────
export const Avatar = ({ src, name, size = "md", className }) => {
  const sizes = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-16 w-16 text-xl", xl: "h-24 w-24 text-2xl" };
  return (
    <AvatarPrimitive.Root className={cn("relative flex shrink-0 overflow-hidden rounded-full", sizes[size], className)}>
      <AvatarPrimitive.Image src={src} alt={name} className="h-full w-full object-cover" />
      <AvatarPrimitive.Fallback className="flex h-full w-full items-center justify-center bg-blue-100 text-blue-700 font-semibold">
        {getInitials(name)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
};

// ── Badge ──────────────────────────────────────────────────────────────────
export const Badge = ({ children, variant = "default", className }) => {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    blue:    "bg-blue-100 text-blue-700",
    green:   "bg-green-100 text-green-700",
    red:     "bg-red-100 text-red-700",
    outline: "border border-gray-200 text-gray-600",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", variants[variant], className)}>
      {children}
    </span>
  );
};

// ── Tag pill ───────────────────────────────────────────────────────────────
export const Tag = ({ label }) => (
  <span className="tag-pill">{label}</span>
);

// ── Match score badge ──────────────────────────────────────────────────────
export const MatchBadge = ({ score }) => (
  <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full", getMatchColor(score))}>
    {score}% Match
  </span>
);

// ── Spinner ────────────────────────────────────────────────────────────────
export const Spinner = ({ className }) => (
  <svg className={cn("animate-spin h-5 w-5", className)} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

// ── Divider ────────────────────────────────────────────────────────────────
export const Divider = ({ className }) => (
  <hr className={cn("border-gray-100", className)} />
);

// ── Verified badge ─────────────────────────────────────────────────────────
export const VerifiedBadge = () => (
  <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
    Verified
  </span>
);
