import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, Share2, MessageCircle, MapPin, Zap, CheckCircle, Shield, Calendar, AlertTriangle } from 'lucide-react';
import UserProfileCard from '../components/UserProfileCard';
import { ListingDetailSkeleton } from '../components/ui/Skeleton';
import { listingApi } from '../services/api';

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
];

const DUMMY_LISTINGS = [
  {
    _id: 'dummy-1', title: '1BHK in Bandra', locality: 'Bandra West', city: 'Mumbai', rent: 25000,
    roomType: '1BHK', images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'],
    matchScore: 92, description: 'Beautiful 1BHK apartment in the heart of Bandra with modern amenities.',
    amenities: ['WiFi', 'AC', 'Washing Machine', 'Kitchen', 'Balcony', 'Water Heater'],
    preferences: ['Vegetarian', 'Non-smoker', 'Female only'],
    owner: { _id: 'owner-1', name: 'Priya Singh', age: 28, profession: 'Software Engineer', city: 'Mumbai', bio: 'Looking for responsible and clean flatmates.', avatar: 'PS', preferences: ['Non-smoker', 'Early sleeper', 'Clean person'], rating: 4.8, reviews: 12 }
  },
  {
    _id: 'dummy-2', title: '2BHK in Powai', locality: 'Powai', city: 'Mumbai', rent: 35000,
    roomType: '2BHK', images: ['https://images.unsplash.com/photo-1501699686415-ba1eb9e88213?w=800&h=600&fit=crop'],
    matchScore: 85, description: 'Spacious 2BHK with sea view in Powai.',
    amenities: ['WiFi', 'AC', 'Kitchen', 'Parking'],
    preferences: ['Professional', 'Early sleeper'],
    owner: { _id: 'owner-2', name: 'Rajesh Kumar', avatar: 'RK' }
  },
  {
    _id: 'dummy-3', title: 'Studio in Koregaon Park', locality: 'Koregaon Park', city: 'Pune', rent: 15000,
    roomType: 'Studio', images: ['https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800&h=600&fit=crop'],
    matchScore: 88, description: 'Cozy studio near Koregaon Park.',
    amenities: ['WiFi', 'Kitchen'],
    preferences: ['Student', 'Non-smoker'],
    owner: { _id: 'owner-3', name: 'Neha Patel', avatar: 'NP' }
  },
];

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!id) {
      setError('No listing ID provided');
      setLoading(false);
      return;
    }

    const fetchListing = async () => {
      let fetchErr;
      try {
        const res = await listingApi.getOne(id);
        setListing(res.data.data);
        setLoading(false);
        return;
      } catch (err) {
        fetchErr = err;
      }
      const dummy = DUMMY_LISTINGS.find((d) => d._id === id);
      if (dummy) {
        setListing(dummy);
        setLoading(false);
      } else {
        setError(fetchErr?.response?.data?.message || 'Listing not found');
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const images = listing?.images?.length ? listing.images : DEFAULT_IMAGES;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) return (
    <div className="py-8 bg-[#FAFAFA] min-h-screen">
      <div className="container-max max-w-5xl">
        <ListingDetailSkeleton />
      </div>
    </div>
  );

  if (error) return (
    <div className="py-8 bg-[#FAFAFA] min-h-screen">
      <div className="container-max max-w-5xl">
        <button
          onClick={() => navigate('/browse')}
          className="flex items-center gap-2 text-[#14B8A6] hover:text-[#0F766E] mb-6 font-medium transition-colors"
        >
          <ChevronLeft size={20} />
          Back to Listings
        </button>
        <div className="card p-12 text-center">
          <AlertTriangle size={48} className="mx-auto text-red-400 mb-4" />
          <h2 className="text-xl font-bold text-[#0F172A] mb-2">Listing Not Found</h2>
          <p className="text-[#64748B] mb-6">{error}</p>
          <button onClick={() => navigate('/browse')} className="btn-primary">
            Browse Listings
          </button>
        </div>
      </div>
    </div>
  );

  if (!listing) return null;

  const ownerId = listing.owner?._id || listing.owner;

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
                  src={images[currentImageIndex]}
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
                  {currentImageIndex + 1} / {images.length}
                </div>

                <div className="absolute bottom-4 left-4 flex gap-2">
                  {images.map((img, idx) => (
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
                    {listing.title || 'Untitled Room'}
                  </h1>
                  <div className="flex items-center gap-2 text-[#64748B] mb-4">
                    <MapPin size={18} />
                    {listing.locality}{listing.locality && listing.city ? ', ' : ''}{listing.city || ''}
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
                    ₹{(listing.rent || 0).toLocaleString()}
                    <span className="text-lg text-[#64748B] font-normal">/mo</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 px-4 py-2 rounded-xl font-semibold">
                    <Zap size={18} />
                    {listing.matchScore || 90}% Match
                  </div>
                </div>
              </div>

              {/* Description */}
              <h2 className="font-display text-xl font-bold text-[#0F172A] mb-3">About This Room</h2>
              <p className="text-[#64748B] leading-relaxed mb-8">{listing.description || 'No description provided.'}</p>

              {/* Amenities */}
              {listing.amenities?.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-display font-bold text-[#0F172A] mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {listing.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-3 text-[#64748B]">
                        <CheckCircle size={18} className="text-[#14B8A6] flex-shrink-0" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferences */}
              {listing.preferences?.length > 0 && (
                <div>
                  <h3 className="font-display font-bold text-[#0F172A] mb-4">Flatmate Preferences</h3>
                  <div className="flex flex-wrap gap-2">
                    {listing.preferences.map((pref) => (
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
            <UserProfileCard
              {...listing.owner}
              userId={ownerId}
            />

            {/* Quick Actions */}
            <div className="card p-6 space-y-3">
              <button
                onClick={() => navigate(`/messages/${ownerId}`)}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
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
