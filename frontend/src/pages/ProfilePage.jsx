import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit3, MapPin, Mail, Phone, Heart, LogOut, Calendar, Shield, MessageCircle, ChevronRight, Camera, Sliders } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { userApi, cloudinaryApi } from "../services/api";
import { ProfileSkeleton } from "../components/ui/Skeleton";
import { getInitials } from "../utils/formatters";

const CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai",
  "Kolkata", "Pune", "Jaipur", "Lucknow", "Noida", "Gurgaon",
  "Chandigarh", "Indore", "Bhopal", "Surat", "Nagpur", "Patna",
  "Thane", "Pimpri-Chinchwad", "Visakhapatnam", "Vadodara", "Ghaziabad",
  "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot",
  "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai",
  "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur", "Gwalior",
  "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Guwahati",
  "Chandigarh Tricity", "Delhi NCR", "Mumbai Metropolitan Region",
];

const AVATAR_PRESETS = [
  { id: "preset-1", color: "#14B8A6", label: "A" },
  { id: "preset-2", color: "#F59E0B", label: "B" },
  { id: "preset-3", color: "#6366F1", label: "C" },
  { id: "preset-4", color: "#EC4899", label: "D" },
  { id: "preset-5", color: "#10B981", label: "E" },
  { id: "preset-6", color: "#F97316", label: "F" },
  { id: "preset-7", color: "#8B5CF6", label: "G" },
  { id: "preset-8", color: "#06B6D4", label: "H" },
];

const LIFESTYLE_GROUPS = [
  {
    key: "food",
    label: "Food",
    options: [
      { value: "veg", label: "Veg" },
      { value: "non-veg", label: "Non-Veg" },
      { value: "eggetarian", label: "Eggetarian" },
    ],
  },
  {
    key: "smoking",
    label: "Smoking",
    options: [
      { value: "non-smoker", label: "Non-Smoker" },
      { value: "occasional", label: "Occasional" },
      { value: "smoker", label: "Smoker" },
    ],
  },
  {
    key: "drinking",
    label: "Drinking",
    options: [
      { value: "non-drinker", label: "Non-Drinker" },
      { value: "occasional", label: "Occasional" },
      { value: "drinker", label: "Drinker" },
    ],
  },
  {
    key: "sleep",
    label: "Sleep",
    options: [
      { value: "early-bird", label: "Early Bird" },
      { value: "flexible", label: "Flexible" },
      { value: "night-owl", label: "Night Owl" },
    ],
  },
  {
    key: "cleanliness",
    label: "Cleanliness",
    options: [
      { value: "very-tidy", label: "Clean" },
      { value: "moderate", label: "Average" },
      { value: "messy", label: "Messy" },
    ],
  },
  {
    key: "pets",
    label: "Pets",
    options: [
      { value: "no-pets", label: "No Pets" },
      { value: "pet-friendly", label: "Pet Friendly" },
      { value: "has-pets", label: "Has Pets" },
    ],
  },
];

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
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (isOwnProfile) {
        const res = await userApi.getMe();
        const profileData = res.data.data || {};
        setProfile(profileData);
        setFormData(profileData);
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

  const handleNestedChange = (path, value) => {
    const keys = path.split(".");
    setFormData((prev) => {
      const copy = { ...prev };
      let obj = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const handleLifestyleChange = (groupKey, value) => {
    setFormData((prev) => ({
      ...prev,
      lifestyle: {
        ...(prev.lifestyle || {}),
        [groupKey]: value === prev.lifestyle?.[groupKey] ? "" : value,
      },
    }));
  };

  const handleAvatarPresetSelect = (presetId) => {
    setFormData((prev) => ({
      ...prev,
      avatarPreset: presetId,
      avatarMode: "preset",
      profileImage: "",
      avatarPublicId: "",
    }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }
    setUploadingAvatar(true);
    try {
      const signRes = await cloudinaryApi.signUpload();
      const { timestamp, signature, apiKey, cloudName, folder } = signRes.data.data;
      const cloudFormData = new FormData();
      cloudFormData.append("file", file);
      cloudFormData.append("api_key", apiKey);
      cloudFormData.append("timestamp", timestamp);
      cloudFormData.append("signature", signature);
      cloudFormData.append("folder", folder);
      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: cloudFormData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error?.message || "Upload failed");
      setFormData((prev) => ({
        ...prev,
        profileImage: uploadData.secure_url,
        avatarPublicId: uploadData.public_id,
        avatarMode: "upload",
        avatarPreset: "",
      }));
      toast.success("Photo uploaded");
    } catch (err) {
      toast.error(err?.message || "Failed to upload photo");
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {};

      if (formData.name !== undefined) payload.name = formData.name;
      if (formData.city !== undefined) payload.city = formData.city;
      if (formData.bio !== undefined) payload.bio = formData.bio;
      if (formData.profileImage !== undefined) payload.profileImage = formData.profileImage;
      if (formData.avatarPublicId !== undefined) payload.avatarPublicId = formData.avatarPublicId;
      if (formData.avatarPreset !== undefined) payload.avatarPreset = formData.avatarPreset;
      if (formData.avatarMode !== undefined) payload.avatarMode = formData.avatarMode;

      if (formData.preferences) {
        payload.preferences = {};
        if (formData.preferences.budgetMin !== undefined) payload.preferences.budgetMin = formData.preferences.budgetMin;
        if (formData.preferences.budgetMax !== undefined) payload.preferences.budgetMax = formData.preferences.budgetMax;
      }

      if (formData.lifestyle) {
        payload.lifestyle = {};
        for (const [key, val] of Object.entries(formData.lifestyle)) {
          if (val !== undefined) payload.lifestyle[key] = val;
        }
      }

      const res = await userApi.editProfile(payload);
      const updatedData = res.data.data || {};
      setProfile(updatedData);
      setFormData(updatedData);
      setIsEditing(false);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...profile });
    setIsEditing(false);
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

  const viewPresetId = profile.avatarPreset || "preset-1";
  const viewPreset = AVATAR_PRESETS.find((p) => p.id === viewPresetId);

  const selectedPresetId = isEditing ? formData.avatarPreset || "preset-1" : viewPresetId;
  const selectedPreset = AVATAR_PRESETS.find((p) => p.id === selectedPresetId);

  const showPresetColor = isEditing ? (formData.avatarMode === "preset") : (profile.avatarMode === "preset" && !hasAvatar);
  const displayPreset = isEditing ? selectedPreset : viewPreset;
  const displayPresetColor = displayPreset?.color || "#14B8A6";
  const displayPresetLabel = displayPreset?.label || initials;
  const displayImage = isEditing ? (formData.avatarMode === "upload" ? (formData.profileImage || "") : "") : (profile.avatarMode === "upload" ? profile.profileImage : "");

  return (
    <div className="py-8 bg-[#FAFAFA] min-h-screen">
      <div className="container-max max-w-5xl">
        <div className="card overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-[#14B8A6] to-[#0F766E]" />

          <div className="px-6 md:px-8 pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 mb-6">
              <div className="relative w-28 h-28 md:w-32 md:h-32 shrink-0">
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#14B8A6] to-[#0F766E] flex items-center justify-center text-white font-display text-4xl md:text-5xl font-bold shadow-lg border-4 border-white overflow-hidden">
                  {displayImage ? (
                    <img src={displayImage} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: showPresetColor ? displayPresetColor : undefined }}
                    >
                      {showPresetColor ? displayPresetLabel : initials}
                    </div>
                  )}
                </div>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute -bottom-1 -right-1 w-9 h-9 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:shadow-lg transition-all"
                  >
                    {uploadingAvatar ? (
                      <div className="w-4 h-4 border-2 border-[#14B8A6] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera size={16} />
                    )}
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>

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
                      isEditing ? (
                        <div className="flex gap-2">
                          <button
                            onClick={handleSave}
                            disabled={saving}
                            className="btn-primary"
                          >
                            {saving ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={handleCancel}
                            disabled={saving}
                            className="btn-secondary"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="btn-primary"
                        >
                          <Edit3 size={16} />
                          Edit Profile
                        </button>
                      )
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
                {profile.verified && (
                  <div className="flex items-center gap-1 text-sm text-blue-600">
                    <Shield size={14} />
                    Verified Account
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="space-y-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-3">Choose Avatar</label>
                  <div className="flex flex-wrap gap-3">
                    {AVATAR_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleAvatarPresetSelect(preset.id)}
                        className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg transition-all duration-200 ${
                          selectedPresetId === preset.id
                            ? "ring-2 ring-offset-2 ring-[#14B8A6] scale-110"
                            : "hover:scale-105 opacity-70 hover:opacity-100"
                        }`}
                        style={{ background: preset.color }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    className="input text-sm"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-2">City</label>
                  <select
                    name="city"
                    value={formData.city || ""}
                    onChange={handleInputChange}
                    className="input text-sm"
                  >
                    <option value="">Select your city</option>
                    {CITIES.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio || ""}
                    onChange={handleInputChange}
                    className="input resize-none"
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-2">Monthly Budget Range</label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <input
                        type="number"
                        name="budgetMin"
                        value={formData.preferences?.budgetMin || ""}
                        onChange={(e) => handleNestedChange("preferences.budgetMin", e.target.value ? Number(e.target.value) : "")}
                        className="input text-sm"
                        placeholder="Min"
                        min={0}
                      />
                    </div>
                    <span className="text-[#64748B]">-</span>
                    <div className="flex-1">
                      <input
                        type="number"
                        name="budgetMax"
                        value={formData.preferences?.budgetMax || ""}
                        onChange={(e) => handleNestedChange("preferences.budgetMax", e.target.value ? Number(e.target.value) : "")}
                        className="input text-sm"
                        placeholder="Max"
                        min={0}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isEditing && profile.bio && (
              <p className="text-[#64748B] leading-relaxed mb-6">{profile.bio}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-[#E2E8F0]">
              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">Email</label>
                <div className="flex items-center gap-2 text-[#64748B]">
                  <Mail size={16} /> {profile.email}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">Phone</label>
                {profile.phone ? (
                  <div className="flex items-center gap-2 text-[#64748B]">
                    <Phone size={16} /> {profile.phone}
                  </div>
                ) : (
                  <div className="text-[#94a3b8] text-sm">Not provided</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">Gender</label>
                <div className="text-[#64748B] text-sm">{profile.gender || "Not specified"}</div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-display font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                <Sliders size={18} />
                Lifestyle Preferences
              </h3>
              <div className="space-y-5">
                {LIFESTYLE_GROUPS.map((group) => (
                  <div key={group.key}>
                    <p className="text-sm font-semibold text-[#0F172A] mb-2">{group.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {group.options.map((option) => {
                        const currentValue = isEditing
                          ? formData.lifestyle?.[group.key]
                          : profile.lifestyle?.[group.key];
                        const isSelected = currentValue === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            disabled={!isEditing}
                            onClick={() => handleLifestyleChange(group.key, option.value)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                              isSelected
                                ? "bg-[#14B8A6] text-white shadow-md"
                                : isEditing
                                  ? "bg-[#f1f5f9] text-[#64748B] hover:bg-[#e2e8f0]"
                                  : "bg-[#f1f5f9] text-[#64748B]"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {!isEditing && profile.preferences && (profile.preferences.budgetMin || profile.preferences.budgetMax) && (
              <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
                <h3 className="font-display font-bold text-[#0F172A] mb-3">Budget Range</h3>
                <span className="bg-[#f1f5f9] text-[#64748B] px-3 py-1.5 rounded-full text-sm font-medium">
                  ${Number(profile.preferences.budgetMin).toLocaleString()} - ${Number(profile.preferences.budgetMax).toLocaleString()}/month
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
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

          <div className="lg:col-span-1 space-y-6">
            <div className="card p-6 space-y-3">
              <h3 className="font-display font-bold text-[#0F172A] flex items-center gap-2">
                <Calendar size={16} />
                Member Since
              </h3>
              <p className="text-[#64748B] text-sm">{joinedDate}</p>
            </div>

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
