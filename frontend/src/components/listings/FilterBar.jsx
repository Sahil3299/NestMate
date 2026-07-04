import { Search, MapPin, RotateCcw } from "lucide-react";
import { cn } from "../../utils/cn";

const LISTING_TYPES = [
  { value: "", label: "All" },
  { value: "room", label: "Rooms" },
  { value: "flatmate", label: "Flatmates" },
  { value: "pg", label: "PG" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "match", label: "Best Match" },
  { value: "rent_asc", label: "Rent: Low \u2192 High" },
  { value: "rent_desc", label: "Rent: High \u2192 Low" },
];

const GENDER_OPTIONS = [
  { value: "", label: "Any Gender" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export default function FilterBar({ filters, setFilter, resetFilters }) {
  const hasActiveFilters = filters?.city || filters?.minRent || filters?.maxRent ||
    filters?.listingType || filters?.gender || filters?.search;

  return (
    <div className="card p-4 mb-6 space-y-4">
      {/* Row 1: search + city + sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] pointer-events-none" size={16} />
          <input type="text" placeholder="Search by area, title, or tag..."
            value={filters?.search || ""} onChange={(e) => setFilter?.("search", e.target.value)} className="input pl-9" />
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] pointer-events-none" size={16} />
          <input type="text" placeholder="City (e.g. Pune)" value={filters?.city || ""}
            onChange={(e) => setFilter?.("city", e.target.value)} className="input pl-9 w-full sm:w-40" />
        </div>

        <select value={filters?.sort || "newest"} onChange={(e) => setFilter?.("sort", e.target.value)} className="input w-full sm:w-auto">
          {SORT_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
        </select>
      </div>

      {/* Row 2 */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1.5 flex-wrap">
          {LISTING_TYPES.map(({ value, label }) => (
            <button key={value} onClick={() => setFilter?.("listingType", value)}
              className={cn("text-xs font-medium px-3.5 py-1.5 rounded-full border transition-all duration-200",
                filters?.listingType === value
                  ? "bg-[#14B8A6] text-white border-[#14B8A6] shadow-sm"
                  : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#14B8A6] hover:text-[#14B8A6]"
              )}>
              {label}
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-[#E2E8F0] hidden sm:block" />

        <div className="flex items-center gap-1.5">
          <input type="number" placeholder="Min \u20B9" value={filters?.minRent || ""}
            onChange={(e) => setFilter?.("minRent", e.target.value)} className="input w-24 text-xs py-1.5" />
          <span className="text-[#94a3b8] text-xs">\u2013</span>
          <input type="number" placeholder="Max \u20B9" value={filters?.maxRent || ""}
            onChange={(e) => setFilter?.("maxRent", e.target.value)} className="input w-24 text-xs py-1.5" />
        </div>

        <select value={filters?.gender || ""} onChange={(e) => setFilter?.("gender", e.target.value)} className="input text-xs py-1.5 w-auto">
          {GENDER_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
        </select>

        {hasActiveFilters && (
          <button onClick={resetFilters}
            className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1">
            <RotateCcw size={12} /> Clear All
          </button>
        )}
      </div>
    </div>
  );
}
