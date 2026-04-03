import React, { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  MessageCircle,
  Check,
  Lock,
  Star,
  Wifi,
  Wind,
  Droplet,
  Zap,
  Sofa,
  Tv,
  Utensils,
  Heater,
  Smartphone,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import Button from "../components/Button";
import TagPill from "../components/TagPill";
import RoommateCarousel from "../components/RoommateCarousel";

// Amenity Item Component
function AmenityItem({ icon: Icon, label }) {
  return (
    <div className="flex flex-col items-center gap-2 px-3 py-2 w-[86px]">
      <Icon className="w-6 h-6 text-blue-600" />
      <span className="text-xs font-medium text-gray-700 text-center">{label}</span>
    </div>
  );
}

// Highlight Item Component
function HighlightItem({ text }) {
  return (
    <div className="flex items-center gap-3">
      <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
      <span className="text-gray-700 font-medium">{text}</span>
    </div>
  );
}

// Basic Info Card Component
function BasicInfoCard({ icon: Icon, label, value }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-5 h-5 text-blue-600" />
        <span className="text-xs font-medium text-gray-500 uppercase">{label}</span>
      </div>
      <span className="text-base font-bold text-gray-900">{value}</span>
    </div>
  );
}

export default function RoommateDetailPage() {
  const navigate = useNavigate();
  const { uid } = useParams();
  const routeLocation = useLocation();
  const initialMatch = routeLocation.state?.match || null;

  const [loading, setLoading] = useState(!initialMatch);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (initialMatch) {
      setProfile(initialMatch);
      setLoading(false);
      return;
    }

    let active = true;

    async function fetchProfile() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/api/matches/best", { params: { limit: 50 } });
        const found =
          (res?.data?.bestMatches || []).find((m) => String(m.uid) === String(uid)) ||
          null;
        if (active) {
          setProfile(found);
          if (!found) setError("Profile not found in current match results.");
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.error || err?.message || "Failed to load profile");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchProfile();
    return () => {
      active = false;
    };
  }, [initialMatch, uid]);

  const roommate = useMemo(() => {
    if (!profile) return null;
    const fallbackImage =
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1200&h=900&fit=crop";
    const mappedAmenities = [
      { icon: Wifi, label: "Wifi" },
      { icon: Wind, label: "AC" },
      { icon: Droplet, label: "Fridge" },
      { icon: Utensils, label: "Washing Machine" },
      { icon: Heater, label: "Water Heater" },
      { icon: Tv, label: "Smart TV" },
    ];

    const habits = profile?.habits || {};
    const preferences = [];
    if (habits.sleep === "late") preferences.push("Night Owl");
    if (habits.sleep === "early") preferences.push("Early Bird");
    if (habits.sleep === "medium") preferences.push("Regular Schedule");
    preferences.push(habits.smoking ? "Smoker" : "Non-smoker");
    preferences.push(habits.drinking ? "Drinker" : "Non-drinker");
    preferences.push(habits.pets ? "Pet Friendly" : "No Pets");

    return {
      uid: profile.uid,
      name: profile.name || "Nestmate User",
      gender: profile.gender || "Not specified",
      city: profile.city || "Unknown",
      location: `${profile.city || "Unknown city"}, India`,
      budgetMin: profile.budgetMin || profile.budgetMax || 0,
      budgetMax: profile.budgetMax || profile.budgetMin || 0,
      occupancy: "Single",
      lookingFor: "Roommate",
      matchPercent: profile.matchPercent || 0,
      verified: true,
      images: profile.images?.length
        ? profile.images
        : [
            `https://picsum.photos/seed/${encodeURIComponent(profile.uid)}-0/1200/800`,
            `https://picsum.photos/seed/${encodeURIComponent(profile.uid)}-1/1200/800`,
            `https://picsum.photos/seed/${encodeURIComponent(profile.uid)}-2/1200/800`,
          ],
      preferences: (preferences.length ? preferences : ["Night Owl", "Fitness Freak", "Non-smoker"])
        .slice(0, 6)
        .map((label) => ({ icon: null, label })),
      highlights: profile.highlights || ["Gated Society", "Attached Washroom", "Natural Light"],
      amenities: profile.amenities?.length ? profile.amenities : mappedAmenities,
      description:
        "This profile has detailed roommate expectations and personal habits. Upgrade to premium to unlock complete details and connect faster.",
    };
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-primary-600 animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !roommate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-center max-w-md w-full">
          <p className="text-gray-900 font-semibold mb-2">Profile unavailable</p>
          <p className="text-gray-600 mb-4">{error || "Unable to render this listing."}</p>
          <Button onClick={() => navigate("/matches")} variant="primary">
            Back to listings
          </Button>
        </div>
      </div>
    );
  }

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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-20 space-y-4">
              {/* Avatar */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white font-bold text-5xl shadow-lg">
                    {roommate.name.charAt(0)}
                  </div>
                  {roommate.verified && (
                    <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 shadow-lg">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Name & Match Badge */}
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">{roommate.name}</h1>
                <div className="flex items-center justify-center gap-2 bg-blue-50 px-3 py-1 rounded-full w-fit mx-auto">
                  <Star className="w-4 h-4 text-blue-600 fill-blue-600" />
                  <span className="text-sm font-bold text-blue-700">
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
                  onClick={() => navigate(`/chat/${roommate.uid}`)}
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat Now
                </Button>
              </div>

              {/* Premium Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-xs font-medium text-gray-600 mb-2">
                  Premium User
                </p>
                <p className="text-sm font-semibold text-blue-700">
                  Verified & Active
                </p>
              </div>
            </div>
          </div>

          {/* Right Content - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <RoommateCarousel images={roommate.images} />
            </div>

            {/* Basic Info Grid */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Basic Info</h2>
              <div className="grid grid-cols-2 gap-4">
                <BasicInfoCard
                  icon={Star}
                  label="Gender"
                  value={roommate.gender}
                />
                <BasicInfoCard
                  icon={Zap}
                  label="Approx Rent"
                  value={`₹${roommate.budgetMin?.toLocaleString()}-${roommate.budgetMax?.toLocaleString()}`}
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
              <h2 className="text-lg font-bold text-gray-900 mb-4">Preferences</h2>
              <p className="text-sm text-gray-600 mb-4">
                What type of flatmate do you prefer?
              </p>
              <div className="flex flex-wrap gap-3">
                {roommate.preferences.map((pref) => (
                  <TagPill key={pref.label} label={pref.label} />
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
              <div className="flex flex-wrap gap-3">
                {roommate.amenities.map((amenity, idx) => {
                  const Icon = amenity.icon || Wifi;
                  return (
                    <AmenityItem
                      key={idx}
                      icon={Icon}
                      label={amenity.label || amenity.name || "Amenity"}
                    />
                  );
                })}
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
          onClick={() => navigate(`/chat/${roommate.uid}`)}
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
