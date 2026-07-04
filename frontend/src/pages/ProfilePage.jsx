import { useState, useEffect } from 'react';
import { Edit3, MapPin, Mail, Phone, Heart, LogOut, Star, Calendar, Shield, ChevronRight } from 'lucide-react';
import { ProfileSkeleton } from '../components/ui/Skeleton';

const USER_DATA = {
  id: 'user123',
  name: 'Priya Singh',
  age: 28,
  email: 'priya@example.com',
  phone: '+91 98765 43210',
  city: 'Mumbai',
  profession: 'Software Engineer',
  bio: 'Looking for responsible and clean flatmates who respect shared spaces.',
  avatar: 'PS',
  joinDate: 'January 2024',
  preferences: ['Non-smoker', 'Early sleeper', 'Clean person'],
  rating: 4.8,
  reviews: 12,
};

const SAVED_LISTINGS = [
  { id: 1, title: '2BHK in Powai', locality: 'Powai', city: 'Mumbai', price: 35000,
    image: 'https://images.unsplash.com/photo-1501699686415-ba1eb9e88213?w=300&h=200&fit=crop' },
  { id: 2, title: 'Studio in Koregaon Park', locality: 'Koregaon Park', city: 'Pune', price: 15000,
    image: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=300&h=200&fit=crop' },
];

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={16} className={i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-[#E2E8F0]'} />
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(USER_DATA);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  if (loading) return (
    <div className="py-8 bg-[#FAFAFA] min-h-screen">
      <div className="container-max max-w-5xl">
        <ProfileSkeleton />
      </div>
    </div>
  );

  return (
    <div className="py-8 bg-[#FAFAFA] min-h-screen">
      <div className="container-max max-w-5xl">
        {/* Profile Header Card */}
        <div className="card overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-[#14B8A6] to-[#0F766E]" />

          <div className="px-6 md:px-8 pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 mb-6">
              {/* Avatar */}
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-[#14B8A6] to-[#0F766E] flex items-center justify-center text-white font-display text-4xl md:text-5xl font-bold shadow-lg border-4 border-white shrink-0">
                {formData.avatar}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                  <div>
                    <h1 className="font-display text-2xl md:text-4xl font-bold text-[#0F172A] truncate">
                      {formData.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#64748B] mt-1">
                      <span className="flex items-center gap-1 text-sm">
                        {formData.age} &bull; {formData.profession}
                      </span>
                      <span className="flex items-center gap-1 text-sm">
                        <MapPin size={14} />
                        {formData.city}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => { if (isEditing) handleSave(); else setIsEditing(true); }}
                    className="btn-primary shrink-0"
                  >
                    <Edit3 size={16} />
                    {isEditing ? 'Save' : 'Edit Profile'}
                  </button>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3">
                  <Stars rating={formData.rating} />
                  <span className="text-sm text-[#64748B]">
                    {formData.rating} ({formData.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Bio */}
            {isEditing ? (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">Bio</label>
                <textarea name="bio" value={formData.bio} onChange={handleInputChange} className="input resize-none" rows={3} />
              </div>
            ) : formData.bio && (
              <p className="text-[#64748B] leading-relaxed mb-6">{formData.bio}</p>
            )}

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-[#E2E8F0]">
              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">Email</label>
                {isEditing ? (
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="input text-sm" />
                ) : (
                  <div className="flex items-center gap-2 text-[#64748B]">
                    <Mail size={16} /> {formData.email}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">Phone</label>
                {isEditing ? (
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="input text-sm" />
                ) : (
                  <div className="flex items-center gap-2 text-[#64748B]">
                    <Phone size={16} /> {formData.phone}
                  </div>
                )}
              </div>
            </div>

            {/* Preferences */}
            <div className="mt-6">
              <h3 className="font-display font-bold text-[#0F172A] mb-3">Preferences</h3>
              <div className="flex flex-wrap gap-2">
                {formData.preferences.map((pref) => (
                  <span key={pref} className="bg-[#f1f5f9] text-[#64748B] px-3 py-1.5 rounded-full text-sm font-medium">{pref}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            {/* Saved Listings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold text-[#0F172A] flex items-center gap-2">
                  <Heart size={22} className="text-red-500" />
                  Saved Listings
                </h2>
                <span className="text-sm text-[#64748B]">{SAVED_LISTINGS.length} saved</span>
              </div>

              {SAVED_LISTINGS.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SAVED_LISTINGS.map((listing) => (
                    <div key={listing.id} className="card overflow-hidden hover:shadow-card-hover transition-all duration-300 group">
                      <div className="relative overflow-hidden">
                        <img src={listing.image} alt={listing.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-4">
                        <h4 className="font-display font-bold text-[#0F172A] mb-1">{listing.title}</h4>
                        <p className="text-sm text-[#64748B] mb-3">{listing.locality}, {listing.city}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-bold text-[#14B8A6]">₹{listing.price.toLocaleString()}</p>
                          <button className="text-red-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                            <Heart size={18} className="fill-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 card">
                  <Heart size={48} className="mx-auto text-[#94a3b8] mb-4" />
                  <p className="text-[#64748B]">No saved listings yet</p>
                </div>
              )}
            </div>

            {/* Activity */}
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-[#0F172A]">Recent Activity</h2>
              <div className="card p-6 space-y-4">
                {[
                  { action: 'Viewed 2BHK in Powai', time: '2 hours ago' },
                  { action: 'Messaged Rajesh Kumar', time: '1 day ago' },
                  { action: 'Saved Studio in Koregaon Park', time: '3 days ago' },
                  { action: 'Profile updated', time: '1 week ago' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] last:border-0 last:pb-0">
                    <p className="text-[#0F172A] font-medium text-sm">{item.action}</p>
                    <p className="text-sm text-[#64748B]">{item.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Member Since */}
            <div className="card p-6 space-y-3">
              <h3 className="font-display font-bold text-[#0F172A] flex items-center gap-2">
                <Calendar size={16} />
                Member Since
              </h3>
              <p className="text-[#64748B] text-sm">{USER_DATA.joinDate}</p>
            </div>

            {/* Account Actions */}
            <div className="card p-6 space-y-2">
              {['Account Settings', 'Privacy & Security'].map((item) => (
                <button key={item} className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition-colors">
                  {item}
                  <ChevronRight size={14} />
                </button>
              ))}
              <div className="pt-2 border-t border-[#E2E8F0]">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200 transition-colors">
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>

            {/* Help */}
            <div className="card p-6 bg-teal-50 border border-teal-200">
              <h4 className="font-semibold text-teal-900 mb-2 flex items-center gap-2">
                <Shield size={16} />
                Need Help?
              </h4>
              <p className="text-sm text-teal-800 mb-4">
                Check our safety guidelines and FAQs for common questions.
              </p>
              <button className="btn-secondary w-full text-sm">
                View Help Center
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
