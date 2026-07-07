import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit3, MapPin, Mail, Phone, Heart, LogOut, Calendar, Shield, Star, MessageCircle, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { userApi, listingApi, messageApi } from "../services/api";
import { ProfileSkeleton } from "../components/ui/Skeleton";
import { getInitials, timeAgo } from "../utils/formatters";

export default function ProfilePage() {
  const { id: profileId } = useParams();
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const isOwnProfile = authUser?._id === profileId;

  const [profile, setProfile] = useState(null);
  const [savedListings, setSavedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (isOwnProfile) {
        const res = await userApi.getMe();
        setProfile(res.data.data);
        setFormData(res.data.data || {});
        try {
          const savedRes = await userApi.getSaved();
          setSavedListings(savedRes.data.data || []);
        } catch (_) {}
      } else {
        const res = await userApi.getPublicProfile(profileId);
        setProfile(res.data.data);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [profileId, isOwnProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
        occupation: formData.occupation,
        age: formData.age,
        city: formData.city,
        gender: formData.gender,
      };
      const res = await userApi.updateProfile(payload);
      setProfile(res.data.data);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSendMessage = () => {
    if (!authUser) {
      toast.error("Please login to send a message");
      return;
    }
    navigate(`/chat/${profileId}`);
  };

  if (loading) {
    return (
      <div className="py-8 bg-[#FAFAFA] min-h-screen">
        <div className="container-max max-w-5xl">
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 bg-[#FAFAFA] min-h-screen">
        <div className="container-max max-w-5xl text-center py-20">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={fetchProfile} className="btn-primary">Retry</button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const joinedDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recently";

  const initials = getInitials(profile.name);
  const hasAvatar = !!profile.profileImage;

  return (
    <div className="py-8 bg-[#FAFAFA] min-h-screen">
      <div className="container-max max-w-5xl">
        {/* Profile Header Card */}
        <div className="card overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-[#14B8A6] to-[#0F766E]" />

          <div className="px-6 md:px-8 pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 mb-6">
              {/* Avatar */}
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-[#14B8A6] to-[#0F766E] flex items-center justify-center text-white font-display text-4xl md:text-5xl font-bold shadow-lg border-4 border-white shrink-0 overflow-hidden">
                {hasAvatar ? (
                  <img src={profile.profileImage} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                  <div>
                    <h1 className="font-display text-2xl md:text-4xl font-bold text-[#0F172A] truncate">
                      {profile.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#64748B] mt-1">
                      {profile.age && (
                        <span className="text-sm">{profile.age} years</span>
                      )}
                      {profile.occupation && (
                        <span className="text-sm">{profile.occupation}</span>
                      )}
                      {profile.city && (
                        <span className="flex items-center gap-1 text-sm">
                          <MapPin size={14} />
                          {profile.city}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {isOwnProfile ? (
                      <button
                        onClick={() => { if (isEditing) handleSave(); else setIsEditing(true); }}
                        disabled={saving}
                        className="btn-primary"
                      >
                        <Edit3 size={16} />
                        {isEditing ? (saving ? "Saving..." : "Save") : "Edit Profile"}
                      </button>
                    ) : (
                      authUser && (
                        <button onClick={handleSendMessage} className="btn-primary">
                          <MessageCircle size={16} />
                          Chat
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Verified Badge */}
                {profile.verified && (
                  <div className="flex items-center gap-1 text-sm text-blue-600">
                    <Shield size={14} />
                    Verified Account
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            {isEditing ? (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">Bio</label>
                <textarea name="bio" value={formData.bio || ""} onChange={handleInputChange} className="input resize-none" rows={3} />
              </div>
            ) : profile.bio ? (
              <p className="text-[#64748B] leading-relaxed mb-6">{profile.bio}</p>
            ) : null}

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-[#E2E8F0]">
              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">Email</label>
                {isEditing ? (
                  <input type="email" name="email" value={formData.email || ""} onChange={handleInputChange} className="input text-sm" />
                ) : (
                  <div className="flex items-center gap-2 text-[#64748B]">
                    <Mail size={16} /> {profile.email}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">Phone</label>
                {isEditing ? (
                  <input type="tel" name="phone" value={formData.phone || ""} onChange={handleInputChange} className="input text-sm" />
                ) : profile.phone ? (
                  <div className="flex items-center gap-2 text-[#64748B]">
                    <Phone size={16} /> {profile.phone}
                  </div>
                ) : (
                  <div className="text-[#94a3b8] text-sm">Not provided</div>
                )}
              </div>
            </div>

            {/* Preferences */}
            {profile.preferences && (profile.preferences.budgetMin || profile.preferences.budgetMax) && (
              <div className="mt-6">
                <h3 className="font-display font-bold text-[#0F172A] mb-3">Budget Range</h3>
                <span className="bg-[#f1f5f9] text-[#64748B] px-3 py-1.5 rounded-full text-sm font-medium">
                  ${Number(profile.preferences.budgetMin).toLocaleString()} - ${Number(profile.preferences.budgetMax).toLocaleString()}/month
                </span>
              </div>
            )}

            {/* Habits */}
            {profile.habits && (
              <div className="mt-4">
                <h3 className="font-display font-bold text-[#0F172A] mb-3">Lifestyle</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.habits.sleep && (
                    <span className="bg-[#f1f5f9] text-[#64748B] px-3 py-1.5 rounded-full text-sm font-medium">
                      Sleep: {profile.habits.sleep === "early" ? "Early Riser" : profile.habits.sleep === "late" ? "Night Owl" : "Regular"}
                    </span>
                  )}
                  {profile.habits.smoking !== undefined && (
                    <span className="bg-[#f1f5f9] text-[#64748B] px-3 py-1.5 rounded-full text-sm font-medium">
                      {profile.habits.smoking ? "Smoker" : "Non-smoker"}
                    </span>
                  )}
                  {profile.habits.drinking !== undefined && (
                    <span className="bg-[#f1f5f9] text-[#64748B] px-3 py-1.5 rounded-full text-sm font-medium">
                      {profile.habits.drinking ? "Drinks" : "Non-drinker"}
                    </span>
                  )}
                  {profile.habits.pets !== undefined && (
                    <span className="bg-[#f1f5f9] text-[#64748B] px-3 py-1.5 rounded-full text-sm font-medium">
                      {profile.habits.pets ? "Has pets" : "No pets"}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            {/* Saved Listings (only for own profile) */}
            {isOwnProfile && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl font-bold text-[#0F172A] flex items-center gap-2">
                    <Heart size={22} className="text-red-500" />
                    Saved Listings
                  </h2>
                  <span className="text-sm text-[#64748B]">{savedListings.length} saved</span>
                </div>

                {savedListings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedListings.map((listing) => (
                      <div
                        key={listing._id}
                        onClick={() => navigate(`/browse/${listing._id}`)}
                        className="card overflow-hidden hover:shadow-card-hover transition-all duration-300 group cursor-pointer"
                      >
                        <div className="relative overflow-hidden">
                          {listing.images?.[0] ? (
                            <img src={listing.images[0]} alt={listing.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-40 bg-gradient-to-br from-teal-100 to-teal-50 flex items-center justify-center">
                              <Heart size={32} className="text-teal-300" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h4 className="font-display font-bold text-[#0F172A] mb-1">{listing.title}</h4>
                          <p className="text-sm text-[#64748B] mb-3">
                            {listing.locality}{listing.locality && listing.city ? ", " : ""}{listing.city}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-bold text-[#14B8A6]">
                              ${Number(listing.rent).toLocaleString()}
                            </p>
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
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Member Since */}
            <div className="card p-6 space-y-3">
              <h3 className="font-display font-bold text-[#0F172A] flex items-center gap-2">
                <Calendar size={16} />
                Member Since
              </h3>
              <p className="text-[#64748B] text-sm">{joinedDate}</p>
            </div>

            {/* Account Actions (only for own profile) */}
            {isOwnProfile && (
              <div className="card p-6 space-y-2">
                <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition-colors" onClick={() => navigate("/profile/" + authUser?._id)}>
                  Account Settings
                  <ChevronRight size={14} />
                </button>
                <div className="pt-2 border-t border-[#E2E8F0]">
                  <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200 transition-colors">
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}

            {/* Help */}
            <div className="card p-6 bg-teal-50 border border-teal-200">
              <h4 className="font-semibold text-teal-900 mb-2 flex items-center gap-2">
                <Shield size={16} />
                Need Help?
              </h4>
              <p className="text-sm text-teal-800 mb-4">
                Check our safety guidelines and FAQs for common questions.
              </p>
              <button className="btn-secondary w-full text-sm">View Help Center</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
