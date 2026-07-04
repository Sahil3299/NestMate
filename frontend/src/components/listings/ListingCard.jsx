import { Link } from "react-router-dom";
import { Heart, MapPin, CheckCircle, Wifi, Zap } from "lucide-react";
import { cn } from "../../utils/cn";

const API_URL = import.meta.env.VITE_API_URL?.replace("/api/v1", "") || "";

export default function ListingCard({ listing }) {
  const imageUrl = listing.images?.[0]
    ? listing.images[0].startsWith("http") ? listing.images[0] : `${API_URL}${listing.images[0]}`
    : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80";

  const isSaved = listing.isSaved;

  return (
    <Link to={`/listings/${listing.slug || listing._id}`}
      className="group card overflow-hidden flex flex-col transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <img src={imageUrl} alt={listing.title} loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-white/95 text-[#64748B] text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {listing.roomType}
          </span>
          {listing.isVerified && (
            <span className="bg-[#14B8A6] text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <CheckCircle size={10} /> Verified
            </span>
          )}
        </div>

        {/* Match badge */}
        {listing.matchScore !== undefined && (
          <div className="absolute top-3 right-3">
            <span className="bg-white/95 text-[#14B8A6] text-xs font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
              <Zap size={12} /> {listing.matchScore}%
            </span>
          </div>
        )}

        {/* Save */}
        <button
          className={cn("absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm",
            isSaved ? "bg-red-500 text-white" : "bg-white/90 text-[#64748B] hover:bg-red-50 hover:text-red-500"
          )}>
          <Heart className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} strokeWidth={2} />
        </button>

        {/* Availability */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-green-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            {listing.availabilityLabel || "Available Now"}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-semibold text-[#0F172A] leading-tight group-hover:text-[#14B8A6] transition-colors mb-1 line-clamp-2">
          {listing.title}
        </h3>

        <div className="flex items-center gap-1.5 text-[#64748B] text-sm mb-3">
          <MapPin className="w-3.5 h-3.5 text-[#14B8A6] flex-shrink-0" />
          <span className="truncate">{listing.location?.area || listing.location?.city}</span>
          {listing.distanceKm !== undefined && (
            <span className="text-[#14B8A6] font-medium flex-shrink-0">· {listing.distanceKm} km away</span>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4 flex-1">
          {(listing.tags || []).slice(0, 3).map((t) => (
            <span key={t} className="inline-flex items-center gap-1 rounded-full border border-[#E2E8F0] bg-white px-2.5 py-0.5 text-xs font-medium text-[#64748B]">
              <Wifi size={10} />
              {t}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
          <div>
            <span className="text-xl font-bold text-[#14B8A6]">₹{listing.rent?.toLocaleString()}</span>
            <span className="text-[#94a3b8] text-xs">/mo</span>
          </div>
          {listing.owner && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#14B8A6] to-[#0F766E] flex items-center justify-center text-white text-xs font-bold">
                {listing.owner.name?.charAt(0) || "O"}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
