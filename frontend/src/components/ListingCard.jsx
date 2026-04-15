import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Zap } from 'lucide-react';

export default function ListingCard({
  id,
  title,
  locality,
  city,
  price,
  roomType,
  image,
  matchScore,
  preferences = [],
  owner
}) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="card-hover overflow-hidden group">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-slate-200 h-48 md:h-56">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-sm font-semibold text-slate-900 shadow-md">
          {roomType}
        </div>

        {/* Save Button */}
        <button
          onClick={() => setIsSaved(!isSaved)}
          className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur rounded-full shadow-md hover:bg-white transition-colors"
        >
          <Heart
            size={20}
            className={isSaved ? 'fill-red-500 text-red-500' : 'text-slate-600'}
          />
        </button>

        {/* Match Score Pill */}
        {matchScore && (
          <div className="absolute bottom-3 left-3 bg-teal-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1 shadow-md">
            <Zap size={16} />
            {matchScore}% Match
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 md:p-6">
        {/* Title & Locality */}
        <h3 className="font-display font-bold text-slate-900 mb-1 line-clamp-2">
          {title}
        </h3>
        <div className="flex items-center gap-1 text-sm text-slate-600 mb-4">
          <MapPin size={16} />
          {locality}, {city}
        </div>

        {/* Price */}
        <div className="mb-4">
          <p className="text-2xl font-bold text-teal-600">
            ₹{price.toLocaleString()}<span className="text-sm text-slate-600">/mo</span>
          </p>
        </div>

        {/* Preferences Tags */}
        {preferences.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {preferences.slice(0, 2).map((pref, idx) => (
              <span
                key={idx}
                className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-medium"
              >
                {pref}
              </span>
            ))}
            {preferences.length > 2 && (
              <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-medium">
                +{preferences.length - 2} more
              </span>
            )}
          </div>
        )}

        {/* View Profile Button */}
        <Link
          to={`/browse/${id}`}
          className="w-full btn-primary text-sm"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}

