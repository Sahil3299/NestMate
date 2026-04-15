import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, Share2, MessageCircle, MapPin, Zap, CheckCircle } from 'lucide-react';
import UserProfileCard from '../components/UserProfileCard';

const LISTING_DETAIL = {
  id: 1,
  title: '1BHK in Bandra',
  locality: 'Bandra West',
  city: 'Mumbai',
  price: 25000,
  roomType: '1BHK',
  images: [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
  ],
  matchScore: 92,
  description: 'Beautiful 1BHK apartment in the heart of Bandra with modern amenities. Spacious living area with a dedicated workspace, fully equipped kitchen, and a balcony overlooking the bustling locality. Perfect for young professionals or students.',
  amenities: ['WiFi', 'AC', 'Washing Machine', 'Kitchen', 'Balcony', 'Water Heater'],
  preferences: ['Vegetarian', 'Non-smoker', 'Female only'],
  owner: {
    id: 1,
    name: 'Priya Singh',
    age: 28,
    profession: 'Software Engineer',
    city: 'Mumbai',
    bio: 'Looking for responsible and clean flatmates who respect shared spaces.',
    avatar: 'PS',
    preferences: ['Non-smoker', 'Early sleeper', 'Clean person'],
    rating: 4.8,
    reviews: 12,
  },
};

export default function ListingDetailPage() {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % LISTING_DETAIL.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + LISTING_DETAIL.images.length) % LISTING_DETAIL.images.length);
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="container-max max-w-5xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/browse')}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 font-medium transition-colors"
        >
          <ChevronLeft size={20} />
          Back to Listings
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 animate-fadeIn">
            {/* Image Gallery */}
            <div className="card overflow-hidden">
              <div className="relative bg-slate-900 h-96 md:h-[500px] flex items-center justify-center group">
                <img
                  src={LISTING_DETAIL.images[currentImageIndex]}
                  alt="Room"
                  className="w-full h-full object-cover"
                />

                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="text-slate-900" size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="text-slate-900" size={24} />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {LISTING_DETAIL.images.length}
                </div>

                {/* Thumbnails */}
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {LISTING_DETAIL.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                        idx === currentImageIndex ? 'border-white' : 'border-white/30'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Title & Basic Info */}
            <div className="card p-6 md:p-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                    {LISTING_DETAIL.title}
                  </h1>
                  <div className="flex items-center gap-2 text-slate-600 mb-4">
                    <MapPin size={18} />
                    {LISTING_DETAIL.locality}, {LISTING_DETAIL.city}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsSaved(!isSaved)}
                    className="p-3 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
                  >
                    <Heart
                      size={20}
                      className={isSaved ? 'fill-red-500 text-red-500' : 'text-slate-600'}
                    />
                  </button>
                  <button className="p-3 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors">
                    <Share2 size={20} className="text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Price & Match Score */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200">
                <div>
                  <p className="text-4xl font-bold text-teal-600">
                    ₹{LISTING_DETAIL.price.toLocaleString()}
                    <span className="text-lg text-slate-600">/mo</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 px-4 py-2 rounded-lg font-semibold">
                    <Zap size={18} />
                    {LISTING_DETAIL.matchScore}% Match
                  </div>
                </div>
              </div>

              {/* Description */}
              <h2 className="font-display text-xl font-bold text-slate-900 mb-3">About This Room</h2>
              <p className="text-slate-700 leading-relaxed mb-8">{LISTING_DETAIL.description}</p>

              {/* Amenities */}
              {LISTING_DETAIL.amenities.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-display font-bold text-slate-900 mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {LISTING_DETAIL.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-3 text-slate-700">
                        <CheckCircle size={18} className="text-teal-600 flex-shrink-0" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferences */}
              {LISTING_DETAIL.preferences.length > 0 && (
                <div>
                  <h3 className="font-display font-bold text-slate-900 mb-4">Flatmate Preferences</h3>
                  <div className="flex flex-wrap gap-2">
                    {LISTING_DETAIL.preferences.map((pref) => (
                      <span
                        key={pref}
                        className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-sm font-medium"
                      >
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Owner Profile & CTA */}
          <div className="lg:col-span-1 space-y-6 animate-fadeIn">
            {/* Owner Profile Card */}
            <UserProfileCard {...LISTING_DETAIL.owner} />

            {/* Quick Actions */}
            <div className="card p-6 space-y-3">
              <button className="btn-primary w-full flex items-center justify-center gap-2">
                <MessageCircle size={18} />
                Send Message
              </button>
              <button className="btn-ghost w-full">
                Schedule Visit
              </button>
              <div className="text-xs text-slate-600 text-center pt-3 border-t border-slate-200">
                For any issues, report this listing
              </div>
            </div>

            {/* Safety Tips */}
            <div className="card p-6 bg-blue-50 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3">Safety Tips</h4>
              <ul className="text-xs text-blue-800 space-y-2">
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Always verify profiles and documents</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Visit in person before finalizing</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Avoid sharing financial info upfront</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Meet in public spaces when possible</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
