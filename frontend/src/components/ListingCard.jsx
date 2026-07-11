import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Zap, Users, Home } from 'lucide-react';

export default function ListingCard({
  id,
  title,
  description,
  locality,
  city,
  price,
  roomType,
  image,
  matchScore,
  preferences = [],
  owner,
  gender,
  available = true,
  isBrokerageFree = true
}) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="card-hover overflow-hidden group bg-white border border-slate-200/80 rounded-2xl hover:shadow-lg transition-all duration-300">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-slate-50 h-52 md:h-60">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Room Type & Brokerage Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-[#0F172A] shadow-sm flex items-center gap-1.5">
            <Home size={12} />
            {roomType}
          </div>
          {isBrokerageFree && (
            <div className="bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
              100% Brokerage-Free
            </div>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={(e) => { e.preventDefault(); setIsSaved(!isSaved); }}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all duration-200 hover:shadow-md"
        >
          <Heart
            size={18}
            className={isSaved ? 'fill-red-500 text-red-500' : 'text-[#64748B]'}
          />
        </button>

        {/* Match Score Pill */}
        {matchScore && (
          <div className="absolute bottom-3 left-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
            <Zap size={14} />
            {matchScore}% Match
          </div>
        )}

        {/* Availability Badge */}
        <div className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1.5 ${
          available ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${available ? 'bg-green-500' : 'bg-slate-400'}`} />
          {available ? 'Available' : 'Rented'}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 md:p-6">
        {/* Title & Locality */}
        <h3 className="font-display font-bold text-[#0F172A] mb-1 line-clamp-1 text-lg">
          {title}
        </h3>
        <div className="flex items-center gap-1.5 text-sm text-[#64748B] mb-2">
          <MapPin size={14} />
          {locality}, {city}
        </div>

        {/* Short Description */}
        {description && (
          <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed h-8">
            {description}
          </p>
        )}

        {/* Price */}
        <div className="mb-4">
          <p className="text-2xl font-bold text-teal-600">
            &#x20B9;{price.toLocaleString()}<span className="text-sm text-[#64748B] font-normal">/mo</span>
          </p>
        </div>

        {/* Gender & Preferences */}
        <div className="flex flex-wrap gap-2 mb-4">
          {gender && (
            <span className="text-xs bg-slate-100 text-[#64748B] px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
              <Users size={11} />
              {gender}
            </span>
          )}
          {preferences.slice(0, 2).map((pref, idx) => (
            <span
              key={idx}
              className="text-xs bg-slate-100 text-[#64748B] px-2.5 py-1 rounded-full font-medium"
            >
              {pref}
            </span>
          ))}
          {preferences.length > 2 && (
            <span className="text-xs bg-slate-100 text-[#64748B] px-2.5 py-1 rounded-full font-medium">
              +{preferences.length - 2}
            </span>
          )}
        </div>

        {/* Owner & CTA */}
        <div className="flex items-center justify-between">
          {owner && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {owner.avatar || owner.name?.charAt(0) || 'U'}
              </div>
              <span className="text-xs text-[#64748B] font-medium">{owner.name}</span>
            </div>
          )}
          <Link
            to={`/browse/${id}`}
            className="btn-primary text-xs !px-4 !py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
