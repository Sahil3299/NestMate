// frontend/src/components/listings/ListingCard.jsx
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToggleSave } from "@/hooks/useListings";
import { Tag, MatchBadge, VerifiedBadge, Avatar } from "@/components/ui";
import { formatRent, timeAgo } from "@/utils/formatters";
import { cn } from "@/utils/cn";

const API_URL = import.meta.env.VITE_API_URL?.replace("/api/v1", "") || "";

export default function ListingCard({ listing }) {
  const { user, isAuthenticated } = useAuth();
  const toggleSave = useToggleSave();

  const isSaved  = user?.savedListings?.map(String).includes(String(listing._id));
  const imageUrl = listing.images?.[0]
    ? listing.images[0].startsWith("http") ? listing.images[0] : `${API_URL}${listing.images[0]}`
    : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80";

  const handleSave = (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    toggleSave.mutate({ listingId: listing._id });
  };

  return (
    <Link
      to={`/listings/${listing.slug || listing._id}`}
      className="group card overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-blue-100"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <img
          src={imageUrl}
          alt={listing.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-white/95 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {listing.roomType}
          </span>
          {listing.isVerified && (
            <span className="bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              ✓ Verified
            </span>
          )}
        </div>

        {/* Match badge top-right */}
        {listing.matchScore !== undefined && (
          <div className="absolute top-3 right-3">
            <MatchBadge score={listing.matchScore} />
          </div>
        )}

        {/* Save button */}
        {isAuthenticated && (
          <button
            onClick={handleSave}
            className={cn(
              "absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm",
              isSaved ? "bg-red-500 text-white" : "bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500"
            )}
          >
            <svg className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        )}

        {/* Availability */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-green-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            {listing.availabilityLabel || "Available Now"}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-semibold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors mb-1 line-clamp-2">
          {listing.title}
        </h3>

        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
          <svg className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="truncate">{listing.location?.area || listing.location?.city}</span>
          {listing.distanceKm !== undefined && (
            <span className="text-blue-500 font-medium flex-shrink-0">· {listing.distanceKm} km away</span>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4 flex-1">
          {(listing.tags || []).slice(0, 3).map((t) => <Tag key={t} label={t} />)}
        </div>

        {/* Footer: price + owner */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-xl font-bold text-blue-600">{formatRent(listing.rent)}</span>
            <span className="text-gray-400 text-xs">/mo</span>
          </div>
          {listing.owner && (
            <div className="flex items-center gap-2">
              <Avatar src={listing.owner.avatar} name={listing.owner.name} size="sm" />
              {listing.owner.isVerified && <VerifiedBadge />}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
