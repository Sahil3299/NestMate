// frontend/src/components/listings/FilterBar.jsx
import { useListingFilters } from "@/hooks/useListings";
import { cn } from "@/utils/cn";

const LISTING_TYPES = [
  { value: "",          label: "All"       },
  { value: "room",      label: "Rooms"     },
  { value: "flatmate",  label: "Flatmates" },
  { value: "pg",        label: "PG"        },
];

const SORT_OPTIONS = [
  { value: "newest",    label: "Newest First"    },
  { value: "match",     label: "Best Match"      },
  { value: "rent_asc",  label: "Rent: Low → High"},
  { value: "rent_desc", label: "Rent: High → Low"},
];

const GENDER_OPTIONS = [
  { value: "",       label: "Any Gender" },
  { value: "male",   label: "Male"       },
  { value: "female", label: "Female"     },
];

export default function FilterBar() {
  const { filters, setFilter, resetFilters } = useListingFilters();

  const hasActiveFilters = filters.city || filters.minRent || filters.maxRent ||
    filters.listingType || filters.gender || filters.search;

  return (
    <div className="card p-4 mb-6 space-y-4">
      {/* Row 1: search + sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by area, title, or tag..."
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
            className="input pl-9"
          />
        </div>

        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <input
            type="text"
            placeholder="City (e.g. Pune)"
            value={filters.city}
            onChange={(e) => setFilter("city", e.target.value)}
            className="input pl-9 w-full sm:w-40"
          />
        </div>

        <select
          value={filters.sort}
          onChange={(e) => setFilter("sort", e.target.value)}
          className="input w-full sm:w-auto"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Row 2: listing type pills + budget + gender */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Listing type */}
        <div className="flex gap-1.5 flex-wrap">
          {LISTING_TYPES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter("listingType", value)}
              className={cn(
                "text-xs font-medium px-3.5 py-1.5 rounded-full border transition-all duration-200",
                filters.listingType === value
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-gray-200 hidden sm:block" />

        {/* Budget */}
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            placeholder="Min ₹"
            value={filters.minRent}
            onChange={(e) => setFilter("minRent", e.target.value)}
            className="input w-24 text-xs py-1.5"
          />
          <span className="text-gray-400 text-xs">–</span>
          <input
            type="number"
            placeholder="Max ₹"
            value={filters.maxRent}
            onChange={(e) => setFilter("maxRent", e.target.value)}
            className="input w-24 text-xs py-1.5"
          />
        </div>

        {/* Gender */}
        <select
          value={filters.gender}
          onChange={(e) => setFilter("gender", e.target.value)}
          className="input text-xs py-1.5 w-auto"
        >
          {GENDER_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Reset */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            ✕ Clear All
          </button>
        )}
      </div>
    </div>
  );
}
