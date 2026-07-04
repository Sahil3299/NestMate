import { MessageCircle, Star } from 'lucide-react';

export default function UserProfileCard({
  name, age, profession, city, bio, avatar,
  preferences = [], rating = 4.8, reviews = 12,
}) {
  const compatibilityScore = 92;

  return (
    <div className="card overflow-hidden">
      <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-6 pb-20 relative">
        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#0F766E] flex items-center justify-center text-white font-display text-3xl font-bold shadow-lg mb-4">
          {avatar || name?.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="px-6 py-6 -mt-10">
        <h3 className="font-display text-xl font-bold text-[#0F172A] mb-1">{name}</h3>
        <p className="text-sm text-[#64748B] mb-4">{age} &bull; {profession} &bull; {city}</p>

        {bio && <p className="text-sm text-[#64748B] mb-4 leading-relaxed">{bio}</p>}

        {/* Rating */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className={i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-[#E2E8F0]'} />
            ))}
          </div>
          <span className="text-sm text-[#64748B]">{rating} ({reviews} reviews)</span>
        </div>

        {/* Compatibility */}
        <div className="mb-6 pb-6 border-b border-[#E2E8F0]">
          <p className="text-sm font-semibold text-[#0F172A] mb-4">Compatibility Score</p>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#14B8A6" strokeWidth="8"
                  strokeDasharray={`${compatibilityScore * 2.827} 282.7`} strokeLinecap="round" transform="rotate(-90 50 50)" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-[#14B8A6]">{compatibilityScore}%</span>
                <span className="text-xs text-[#64748B]">match</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        {preferences.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-[#0F172A] mb-3">Preferences</p>
            <div className="flex flex-wrap gap-2">
              {preferences.map((pref) => (
                <span key={pref} className="text-xs bg-[#f1f5f9] text-[#64748B] px-2.5 py-1.5 rounded-full font-medium">{pref}</span>
              ))}
            </div>
          </div>
        )}

        <button className="w-full btn-primary flex items-center justify-center gap-2">
          <MessageCircle size={18} />
          Send Message
        </button>
      </div>
    </div>
  );
}
