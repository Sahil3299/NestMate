import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Check,
  Wifi,
  Wind,
  Snowflake,
  Utensils,
  Waves,
  Lock,
  Heart,
  Share2,
  Star,
} from "lucide-react";
import { api } from "../lib/api";
import Button from "../components/Button";

const ProfileDetailPage = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [uid]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/matches/${uid}`);
      setProfile(res.data);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-primary-600 animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => navigate("/matches")} variant="primary">
            Back to Matches
          </Button>
        </div>
      </div>
    );
  }

  const images = profile.images || [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  ];

  const preferences = profile.preferences || [
    "Night Owl",
    "Fitness Freak",
    "Non-Smoker",
  ];
  const highlights = profile.highlights || [
    "Gated Society",
    "Attached Washroom",
    "Balcony",
  ];
  const amenities = profile.amenities || [
    { icon: Wifi, name: "Wifi" },
    { icon: Wind, name: "AC" },
    { icon: Snowflake, name: "Fridge" },
    { icon: Waves, name: "Washing Machine" },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getAvatarColor = (name) => {
    const colors = [
      "from-purple-400 to-pink-600",
      "from-blue-400 to-cyan-600",
      "from-yellow-400 to-orange-600",
      "from-blue-400 to-indigo-600",
      "from-pink-400 to-red-600",
    ];
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <div className="min-h-screen bg-white pb-32 md:pb-0">
      {/* Back Button */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">{profile.name}</h1>
          {profile.verified && (
            <Star className="w-5 h-5 text-accent-600 fill-accent-600" />
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto">
        {/* Hero Card - Profile Section */}
        <div className="mx-4 mt-6 p-6 bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex flex-col items-center text-center mb-8">
            {/* Avatar */}
            <div
              className={`w-24 h-24 bg-gradient-to-br ${getAvatarColor(
                profile.name
              )} rounded-full flex items-center justify-center text-white font-bold text-4xl mb-4 shadow-md`}
            >
              {profile.name.charAt(0).toUpperCase()}
            </div>

            {/* Name & Match */}
            <div className="mb-3">
              <h2 className="text-3xl font-bold text-gray-900">{profile.name}</h2>
              {profile.matchPercent && (
                <div className="mt-2 inline-flex items-center justify-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-semibold">{profile.matchPercent}% Match</span>
                </div>
              )}
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-600 mb-6">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span className="text-sm">{profile.city}, {profile.city}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                onClick={() => navigate(`/chat/${profile.uid}`)}
                variant="primary"
                size="lg"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Chat
              </Button>
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  isSaved
                    ? "bg-accent-100 border-accent-300 text-accent-600"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
              </button>
              <button className="p-3 rounded-lg border-2 border-gray-200 text-gray-600 hover:border-gray-300 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Basic Info Grid */}
        <div className="mx-4 mt-6 grid grid-cols-2 gap-4">
          <div className="p-4 bg-white border border-gray-200 rounded-xl">
            <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Gender</p>
            <p className="text-2xl font-bold text-gray-900">{profile.gender}</p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-xl">
            <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Approx Rent</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{profile.budgetMax?.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-xl">
            <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Occupancy</p>
            <p className="text-lg font-bold text-gray-900">Single</p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-xl">
            <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Looking For</p>
            <p className="text-lg font-bold text-gray-900">Roommate</p>
          </div>
        </div>

        {/* Image Carousel */}
        {images.length > 0 && (
          <div className="mx-4 mt-6">
            <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-square">
              <img
                src={images[currentImageIndex]}
                alt={`${profile.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Image Counter */}
              <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {currentImageIndex + 1} / {images.length}
              </div>

              {/* Navigation Buttons */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-900 p-2 rounded-full transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-900 p-2 rounded-full transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Preferences Tags */}
        <div className="mx-4 mt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">What type of flatmate do they like?</h3>
          <div className="flex flex-wrap gap-3">
            {preferences.map((pref, idx) => (
              <div
                key={idx}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium border-2 border-gray-200 hover:border-primary-300 transition-colors"
              >
                {pref}
              </div>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div className="mx-4 mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Highlights</h3>
          <div className="space-y-3">
            {highlights.map((highlight, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-gray-900 font-medium">{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="mx-4 mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {amenities.map((amenity, idx) => {
              const IconComponent = amenity.icon;
              return (
                <div
                  key={idx}
                  className="p-4 bg-white border border-gray-200 rounded-xl text-center hover:border-primary-300 hover:shadow-md transition-all"
                >
                  <IconComponent className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">{amenity.name}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Description (Locked for Premium) */}
        <div className="mx-4 mt-8 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">About</h3>
          <div className="relative">
            <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <p className="text-gray-600 leading-relaxed blur-sm select-none">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud exercitation ullamco laboris.
              </p>
            </div>

            {/* Premium Lock Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-gradient-to-b from-white via-white to-gray-50 bg-opacity-85">
              <Lock className="w-12 h-12 text-gray-400 mb-3" />
              <h4 className="text-lg font-bold text-gray-900 mb-2">Premium User</h4>
              <p className="text-sm text-gray-600 text-center mb-4">
                View full details by upgrading to Premium
              </p>
              <Button variant="primary" size="md">
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Chat Button (Mobile Only) */}
      <div className="fixed bottom-6 left-4 right-4 md:hidden">
        <Button
          onClick={() => navigate(`/chat/${profile.uid}`)}
          variant="primary"
          size="lg"
          className="w-full flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          Start Chatting
        </Button>
      </div>
    </div>
  );
};

export default ProfileDetailPage;
