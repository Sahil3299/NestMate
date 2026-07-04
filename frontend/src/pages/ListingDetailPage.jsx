import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, Share2, MessageCircle, MapPin, Zap, CheckCircle, Shield, Calendar, AlertTriangle } from 'lucide-react';
import UserProfileCard from '../components/UserProfileCard';
import { ListingDetailSkeleton } from '../components/ui/Skeleton';

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
    id: 1, name: 'Priya Singh', age: 28, profession: 'Software Engineer',
    city: 'Mumbai', bio: 'Looking for responsible and clean flatmates who respect shared spaces.',
    avatar: 'PS', preferences: ['Non-smoker', 'Early sleeper', 'Clean person'],
    rating: 4.8, reviews: 12,
  },
};

export default function ListingDetailPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % LISTING_DETAIL.images.length);
  };
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + LISTING_DETAIL.images.length) % LISTING_DETAIL.images.length);
  };

  if (loading) return (
    <div className="py-8 bg-[#FAFAFA] min-h-screen">
      <div className="container-max max-w-5xl">
        <ListingDetailSkeleton />
      </div>
    </div>
  );

  return (
    <div className="py-8 bg-[#FAFAFA] min-h-screen">
      <div className="container-max max-w-5xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/browse')}
          className="flex items-center gap-2 text-[#14B8A6] hover:text-[#0F766E] mb-6 font-medium transition-colors"
        >
          <ChevronLeft size={20} />
          Back to Listings
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="card overflow-hidden">
              <div className="relative bg-[#0F172A] h-96 md:h-[500px] flex items-center justify-center group">
                <img
                  src={LISTING_DETAIL.images[currentImageIndex]}
                  alt="Room"
                  className="w-full h-full object-cover"
                />

                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <ChevronLeft className="text-[#0F172A]" size={24} />
                </button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <ChevronRight className="text-[#0F172A]" size={24} />
                </button>

                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {LISTING_DETAIL.images.length}
                </div>

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
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-[#0F172A] mb-2">
                    {LISTING_DETAIL.title}
                  </h1>
                  <div className="flex items-center gap-2 text-[#64748B] mb-4">
                    <MapPin size={18} />
                    {LISTING_DETAIL.locality}, {LISTING_DETAIL.city}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsSaved(!isSaved)}
                    className="p-3 rounded-xl border border-[#E2E8F0] hover:bg-slate-50 transition-colors"
                  >
                    <Heart size={20} className={isSaved ? 'fill-red-500 text-red-500' : 'text-[#64748B]'} />
                  </button>
                  <button className="p-3 rounded-xl border border-[#E2E8F0] hover:bg-slate-50 transition-colors">
                    <Share2 size={20} className="text-[#64748B]" />
                  </button>
                </div>
              </div>

              {/* Price & Match Score */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#E2E8F0]">
                <div>
                  <p className="text-4xl font-bold text-[#14B8A6]">
                    ₹{LISTING_DETAIL.price.toLocaleString()}
                    <span className="text-lg text-[#64748B] font-normal">/mo</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 px-4 py-2 rounded-xl font-semibold">
                    <Zap size={18} />
                    {LISTING_DETAIL.matchScore}% Match
                  </div>
                </div>
              </div>

              {/* Description */}
              <h2 className="font-display text-xl font-bold text-[#0F172A] mb-3">About This Room</h2>
              <p className="text-[#64748B] leading-relaxed mb-8">{LISTING_DETAIL.description}</p>

              {/* Amenities */}
              {LISTING_DETAIL.amenities.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-display font-bold text-[#0F172A] mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {LISTING_DETAIL.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-3 text-[#64748B]">
                        <CheckCircle size={18} className="text-[#14B8A6] flex-shrink-0" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferences */}
              {LISTING_DETAIL.preferences.length > 0 && (
                <div>
                  <h3 className="font-display font-bold text-[#0F172A] mb-4">Flatmate Preferences</h3>
                  <div className="flex flex-wrap gap-2">
                    {LISTING_DETAIL.preferences.map((pref) => (
                      <span key={pref} className="bg-[#f1f5f9] text-[#64748B] px-3 py-1.5 rounded-full text-sm font-medium">
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <UserProfileCard {...LISTING_DETAIL.owner} />

            {/* Quick Actions */}
            <div className="card p-6 space-y-3">
              <button className="btn-primary w-full flex items-center justify-center gap-2">
                <MessageCircle size={18} />
                Send Message
              </button>
              <button className="btn-secondary w-full flex items-center justify-center gap-2">
                <Calendar size={16} />
                Schedule Visit
              </button>
              <div className="text-xs text-[#64748B] text-center pt-3 border-t border-[#E2E8F0]">
                <AlertTriangle size={12} className="inline mr-1" />
                For any issues, report this listing
              </div>
            </div>

            {/* Safety Tips */}
            <div className="card p-6 bg-teal-50 border border-teal-200">
              <h4 className="font-semibold text-teal-900 mb-3 flex items-center gap-2">
                <Shield size={16} />
                Safety Tips
              </h4>
              <ul className="text-xs text-teal-800 space-y-2.5">
                {[
                  'Always verify profiles and documents',
                  'Visit in person before finalizing',
                  'Avoid sharing financial info upfront',
                  'Meet in public spaces when possible',
                ].map((tip) => (
                  <li key={tip} className="flex gap-2 items-start">
                    <CheckCircle size={14} className="text-teal-600 mt-0.5 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
