import { useState } from 'react';
import { Edit3, MapPin, Mail, Phone, Heart, LogOut } from 'lucide-react';

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
  {
    id: 1,
    title: '2BHK in Powai',
    locality: 'Powai',
    city: 'Mumbai',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1501699686415-ba1eb9e88213?w=300&h=200&fit=crop',
  },
  {
    id: 2,
    title: 'Studio in Koregaon Park',
    locality: 'Koregaon Park',
    city: 'Pune',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=300&h=200&fit=crop',
  },
];

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(USER_DATA);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, this would call an API
    alert('Profile updated successfully!');
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="container-max max-w-4xl">
        {/* Profile Header */}
        <div className="card overflow-hidden mb-8 animate-fadeIn">
          {/* Cover Background */}
          <div className="h-32 bg-gradient-to-r from-teal-500 to-teal-600"></div>

          {/* Profile Info */}
          <div className="px-6 md:px-8 py-8">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-20 mb-6">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-display text-5xl font-bold shadow-lg border-4 border-white">
                {formData.avatar}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900">
                      {formData.name}
                    </h1>
                    <div className="flex flex-wrap gap-4 text-slate-600 mt-2">
                      <span className="flex items-center gap-1">
                        <span>{formData.age}</span>
                        <span>•</span>
                        <span>{formData.profession}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={16} />
                        {formData.city}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (isEditing) handleSave();
                      else setIsEditing(true);
                    }}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Edit3 size={18} />
                    {isEditing ? 'Save' : 'Edit Profile'}
                  </button>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < Math.floor(formData.rating) ? '⭐' : '☆'}`}></span>
                    ))}
                  </div>
                  <span className="text-sm text-slate-600">
                    {formData.rating} ({formData.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Bio */}
            {isEditing ? (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-900 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="input resize-none"
                  rows={3}
                />
              </div>
            ) : (
              formData.bio && (
                <p className="text-slate-700 leading-relaxed mb-6 text-lg">
                  {formData.bio}
                </p>
              )
            )}

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-slate-200">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input text-sm"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail size={16} />
                    {formData.email}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input text-sm"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone size={16} />
                    {formData.phone}
                  </div>
                )}
              </div>
            </div>

            {/* Preferences */}
            <div className="mt-6">
              <h3 className="font-display font-bold text-slate-900 mb-3">Preferences</h3>
              <div className="flex flex-wrap gap-2">
                {formData.preferences.map((pref) => (
                  <span
                    key={pref}
                    className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-sm font-medium"
                  >
                    {pref}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Saved Listings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Heart size={24} className="text-red-500" />
                  Saved Listings
                </h2>
                <span className="text-sm text-slate-600">{SAVED_LISTINGS.length} saved</span>
              </div>

              {SAVED_LISTINGS.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SAVED_LISTINGS.map((listing) => (
                    <div key={listing.id} className="card overflow-hidden hover:shadow-lg transition-shadow">
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="font-display font-bold text-slate-900 mb-1">
                          {listing.title}
                        </h4>
                        <p className="text-sm text-slate-600 mb-3">
                          {listing.locality}, {listing.city}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-bold text-teal-600">
                            ₹{listing.price.toLocaleString()}
                          </p>
                          <button className="text-red-500 hover:text-red-600">
                            <Heart size={18} className="fill-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 card">
                  <Heart size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-600">No saved listings yet</p>
                </div>
              )}
            </div>

            {/* Activity */}
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-slate-900">Recent Activity</h2>
              <div className="card p-6 space-y-4">
                {[
                  { action: 'Viewed 2BHK in Powai', time: '2 hours ago' },
                  { action: 'Messaged Rajesh Kumar', time: '1 day ago' },
                  { action: 'Saved Studio in Koregaon Park', time: '3 days ago' },
                  { action: 'Profile updated', time: '1 week ago' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between pb-4 border-b border-slate-200 last:border-0 last:pb-0">
                    <p className="text-slate-700 font-medium">{item.action}</p>
                    <p className="text-sm text-slate-500">{item.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats */}
            <div className="card p-6 space-y-4">
              <h3 className="font-display font-bold text-slate-900">Member Since</h3>
              <p className="text-slate-700">{USER_DATA.joinDate}</p>
            </div>

            {/* Account Actions */}
            <div className="card p-6 space-y-3">
              <button className="w-full btn-ghost text-sm justify-center">
                Account Settings
              </button>
              <button className="w-full btn-ghost text-sm justify-center">
                Privacy & Security
              </button>
              <button className="w-full text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-lg font-medium transition-colors text-sm border border-red-200">
                <LogOut size={16} className="inline mr-2" />
                Sign Out
              </button>
            </div>

            {/* Help */}
            <div className="card p-6 bg-blue-50 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
              <p className="text-sm text-blue-800 mb-4">
                Check our safety guidelines and FAQs for common questions.
              </p>
              <button className="btn-ghost text-sm w-full">
                View Help Center
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
