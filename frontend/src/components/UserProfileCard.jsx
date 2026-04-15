import { MessageCircle, Star, TrendingUp } from 'lucide-react';

export default function UserProfileCard({
  id,
  name,
  age,
  profession,
  city,
  bio,
  avatar,
  preferences = [],
  rating = 4.8,
  reviews = 12,
}) {
  // Render a simple CSS-only compatibility ring chart
  const compatibilityScore = 92;

  return (
    <div className="card overflow-hidden">
      {/* Header with avatar */}
      <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-6 pb-20 relative">
        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-display text-3xl font-bold shadow-lg mb-4">
          {avatar || name?.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Content (overlapping avatar) */}
      <div className="px-6 py-6 -mt-10">
        <h3 className="font-display text-xl font-bold text-slate-900 mb-1">
          {name}
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          {age} • {profession} • {city}
        </p>

        {/* Bio */}
        {bio && (
          <p className="text-sm text-slate-700 mb-4 leading-relaxed">
            {bio}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}
              />
            ))}
          </div>
          <span className="text-sm text-slate-600">
            {rating} ({reviews} reviews)
          </span>
        </div>

        {/* Compatibility Ring Chart - CSS Only */}
        <div className="mb-6 pb-6 border-b border-slate-200">
          <p className="text-sm font-semibold text-slate-900 mb-4">Compatibility Score</p>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              {/* SVG Ring Chart */}
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="8"
                />
                {/* Filled circle (92% = 331.2 degrees) */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="8"
                  strokeDasharray={`${compatibilityScore * 2.827} 282.7`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-teal-600">{compatibilityScore}%</span>
                <span className="text-xs text-slate-600">match</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        {preferences.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-slate-900 mb-3">Preferences</p>
            <div className="flex flex-wrap gap-2">
              {preferences.map((pref) => (
                <span
                  key={pref}
                  className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1.5 rounded-full font-medium"
                >
                  {pref}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Message Button */}
        <button className="w-full btn-primary flex items-center justify-center gap-2">
          <MessageCircle size={18} />
          Send Message
        </button>
      </div>
    </div>
  );
}
