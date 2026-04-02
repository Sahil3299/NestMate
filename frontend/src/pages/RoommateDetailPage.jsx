import React, { useState } from "react";
import {
  MapPin,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Check,
  Lock,
  Star,
  Bookmark,
  Wifi,
  Wind,
  Droplet,
  Zap,
  Sofa,
  Tv,
  Utensils,
  Heater,
  Smartphone,
  Shield,
} from "lucide-react";
import Button from "../components/Button";

// Preference Tag Component
function PreferenceTag({ icon, label, selected = false }) {
  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
        selected
          ? "border-primary-500 bg-primary-50"
          : "border-gray-200 bg-gray-50 hover:border-gray-300"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
  );
}

// Amenity Item Component
function AmenityItem({ icon: Icon, label }) {
  return (
    <div className="flex flex-col items-center gap-2 px-3 py-2">
      <Icon className="w-6 h-6 text-primary-600" />
      <span className="text-xs font-medium text-gray-700 text-center">{label}</span>
    </div>
  );
}

// Image Carousel Component
function ImageCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full aspect-video bg-gray-200 rounded-xl overflow-hidden group">
      <img
        src={images[currentIndex]}
        alt={`Property ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-opacity duration-300"
      />

      {/* Carousel Controls */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-5 h-5 text-gray-800" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex ? "bg-white w-6" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Image Counter */}
      <div className="absolute top-3 right-3 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}

// Highlight Item Component
function HighlightItem({ text }) {
  return (
    <div className="flex items-center gap-3">
      <Check className="w-5 h-5 text-primary-600 flex-shrink-0" />
      <span className="text-gray-700 font-medium">{text}</span>
    </div>
  );
}

// Basic Info Card Component
function BasicInfoCard({ icon: Icon, label, value }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-5 h-5 text-primary-600" />
        <span className="text-xs font-medium text-gray-600 uppercase">{label}</span>
      </div>
      <span className="text-lg font-bold text-gray-900">{value}</span>
    </div>
  );
}

export default function RoommateDetailPage() {
  const [isSaved, setIsSaved] = useState(false);

  // Sample data - in production, this would come from props or API
  const roommate = {
    uid: "user123",
    name: "Sahil",
    age: 26,
    gender: "Male",
    city: "Pune",
    location: "Shivajinagar, Pune, Maharashtra, India",
    budgetMin: 8000,
    budgetMax: 10000,
    occupancy: "Single",
    lookingFor: "Male",
    matchPercent: 85,
    verified: true,
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    ],
    preferences: [
      { icon: "🦉", label: "Night Owl" },
      { icon: "🌅", label: "Early Bird" },
      { icon: "📚", label: "Studious" },
      { icon: "💪", label: "Fitness Freak" },
      { icon: "⚽", label: "Sporty" },
      { icon: "✋", label: "Non-Smoker" },
    ],
    highlights: [
      "Gated Society",
      "Attached Washroom",
      "Balcony",
      "Study Area",
      "Natural Light",
    ],
    amenities: [
      { icon: Wifi, label: "WiFi" },
      { icon: Wind, label: "AC" },
      { icon: Droplet, label: "Fridge" },
      { icon: Utensils, label: "Washing Machine" },
      { icon: Heater, label: "Water Heater" },
      { icon: Tv, label: "Smart TV" },
    ],
    description:
      "A professional and well-organized roommate looking for someone who values cleanliness and quiet hours. I work in IT and often have late-night calls. Prefer someone who is independent and respectful of personal space.",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <a href="/" className="hover:text-primary-600 transition-colors">
              Home
            </a>
            <span>/</span>
            <a href="/matches" className="hover:text-primary-600 transition-colors">
              Looking for Roommate
            </a>
            <span>/</span>
            <span className="text-gray-900 font-medium">{roommate.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-20 space-y-4">
              {/* Avatar */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 via-primary-500 to-accent-600 flex items-center justify-center text-white font-bold text-5xl shadow-lg">
                    {roommate.name.charAt(0)}
                  </div>
                  {roommate.verified && (
                    <div className="absolute bottom-0 right-0 bg-primary-600 rounded-full p-2 shadow-lg">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Name & Match Badge */}
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">{roommate.name}</h1>
                <div className="flex items-center justify-center gap-2 bg-primary-50 px-3 py-1 rounded-full w-fit mx-auto">
                  <Star className="w-4 h-4 text-primary-600 fill-primary-600" />
                  <span className="text-sm font-bold text-primary-600">
                    {roommate.matchPercent}% Match
                  </span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-2 text-center text-sm">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">{roommate.location}</span>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-200"></div>

              {/* Chat Button - Desktop */}
              <div className="hidden sm:block space-y-2">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full gap-2 justify-center"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat Now
                </Button>

                {/* Save Button */}
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                    isSaved
                      ? "border-primary-600 bg-primary-50 text-primary-600"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Bookmark
                    className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`}
                  />
                  {isSaved ? "Saved" : "Save"}
                </button>
              </div>

              {/* Premium Info */}
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 text-center">
                <p className="text-xs font-medium text-gray-600 mb-2">
                  Premium User
                </p>
                <p className="text-sm font-semibold text-primary-700">
                  Verified & Active
                </p>
              </div>
            </div>
          </div>

          {/* Right Content - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <ImageCarousel images={roommate.images} />
            </div>

            {/* Basic Info Grid */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Basic Info</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <BasicInfoCard
                  icon={roommate.gender === "Male" ? Shield : Star}
                  label="Gender"
                  value={roommate.gender}
                />
                <BasicInfoCard
                  icon={Zap}
                  label="Approx Rent"
                  value={`₹${roommate.budgetMin}-${roommate.budgetMax}`}
                />
                <BasicInfoCard
                  icon={Sofa}
                  label="Occupancy"
                  value={roommate.occupancy}
                />
                <BasicInfoCard
                  icon={Smartphone}
                  label="Looking For"
                  value={roommate.lookingFor}
                />
              </div>
            </div>

            {/* Preferences Tags */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Roommate Type
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                What type of flatmate do you prefer?
              </p>
              <div className="flex flex-wrap gap-3">
                {roommate.preferences.map((pref, idx) => (
                  <PreferenceTag
                    key={idx}
                    icon={pref.icon}
                    label={pref.label}
                    selected={idx < 2}
                  />
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Highlights</h2>
              <div className="space-y-3">
                {roommate.highlights.map((highlight, idx) => (
                  <HighlightItem key={idx} text={highlight} />
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {roommate.amenities.map((amenity, idx) => (
                  <AmenityItem
                    key={idx}
                    icon={amenity.icon}
                    label={amenity.label}
                  />
                ))}
              </div>
            </div>

            {/* Description - Premium Lock */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">About</h2>
              <div className="relative">
                <div className="blur-sm text-gray-700 leading-relaxed">
                  {roommate.description}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white rounded-lg shadow-lg p-6 text-center max-w-xs">
                    <Lock className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <h3 className="font-bold text-gray-900 mb-2">
                      Upgrade to Premium
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      View full details and connect with verified users
                    </p>
                    <Button variant="primary" size="md" className="w-full">
                      Upgrade Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Chat Button */}
      <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-white border-t border-gray-200 p-4 shadow-lg">
        <Button
          variant="primary"
          size="lg"
          className="w-full gap-2 justify-center"
        >
          <MessageCircle className="w-5 h-5" />
          Chat Now
        </Button>
      </div>

      {/* Spacer for mobile sticky button */}
      <div className="h-20 sm:h-0"></div>
    </div>
  );
}
