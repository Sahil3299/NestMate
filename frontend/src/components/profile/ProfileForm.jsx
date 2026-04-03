import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import Button from "../Button";
import Card from "../Card";
import Checkbox from "../Checkbox";
import Input from "../Input";
import Select from "../Select";
import AvatarSelector from "./AvatarSelector";

const sleepOptions = [
  { value: "early", label: "🌅 Early Riser (Before 9 AM)" },
  { value: "medium", label: "⏰ Regular (9 AM - 11 PM)" },
  { value: "late", label: "🌙 Night Owl (After 11 PM)" },
];

function getAvatarSrc(apiBaseUrl, avatarPath) {
  if (!avatarPath) return "";
  if (typeof avatarPath !== "string") return "";
  if (avatarPath.startsWith("http://") || avatarPath.startsWith("https://")) return avatarPath;
  if (avatarPath.startsWith("/")) return `${apiBaseUrl}${avatarPath}`;
  return `${apiBaseUrl}/${avatarPath}`;
}

export default function ProfileForm({ onSaved }) {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");

  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");

  const [sleep, setSleep] = useState("medium");
  const [smoking, setSmoking] = useState(false);
  const [drinking, setDrinking] = useState(false);
  const [pets, setPets] = useState(false);

  const [bio, setBio] = useState("");

  const [avatarPreset, setAvatarPreset] = useState("preset-1");
  const [avatarImageFile, setAvatarImageFile] = useState(null);
  const [avatarMode, setAvatarMode] = useState("preset"); // "upload" | "preset"

  const [existingAvatarPath, setExistingAvatarPath] = useState("");
  // kept for backward compatibility; avatarPreset is stored directly via avatarPreset

  useEffect(() => {
    let mounted = true;
    async function loadMe() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/api/profile/me");
        const p = res.data.profile || {};
        if (!mounted) return;

        setName(p.name || "");
        setAge(String(p.age ?? ""));
        setGender(p.gender || "");
        setCity(p.city || "");
        setBudgetMin(String(p.budgetMin ?? ""));
        setBudgetMax(String(p.budgetMax ?? ""));

        setSmoking(Boolean(p.habits?.smoking));
        setDrinking(Boolean(p.habits?.drinking));
        setPets(Boolean(p.habits?.pets));
        setSleep(p.habits?.sleep || "medium");

        setBio(p.bio || "");

        // Avatar handling:
        // - avatarPath: relative/absolute path returned from backend upload
        // - avatarPreset: preset id returned from backend
        const loadedAvatarPath = p.avatarPath || p.avatarUrl || p.avatar || "";
        const loadedAvatarPreset = p.avatarPreset || "";

        setExistingAvatarPath(loadedAvatarPath);
        // avatarPreset is kept in `avatarPreset` state for the form.

        setAvatarMode(loadedAvatarPath ? "upload" : "preset");
        if (loadedAvatarPreset) setAvatarPreset(loadedAvatarPreset);
      } catch (err) {
        // Profile may not exist yet
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadMe();
    return () => {
      mounted = false;
    };
  }, []);

  const avatarPreviewSrc = useMemo(() => {
    if (avatarImageFile) return "";
    const src = getAvatarSrc(apiBaseUrl, existingAvatarPath);
    return src || "";
  }, [apiBaseUrl, existingAvatarPath, avatarImageFile]);

  const canSubmit = useMemo(() => {
    return Boolean(
      name.trim() &&
        city.trim() &&
        gender.trim() &&
        age &&
        budgetMin !== "" &&
        budgetMax !== "" &&
        sleep
    );
  }, [name, city, gender, age, budgetMin, budgetMax, sleep]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("age", String(Number(age)));
      formData.append("gender", gender.trim());
      formData.append("budgetMin", String(Number(budgetMin)));
      formData.append("budgetMax", String(Number(budgetMax)));
      formData.append("city", city.trim());
      formData.append("bio", bio || "");

      formData.append("habits.sleep", sleep);
      formData.append("habits.smoking", String(Boolean(smoking)));
      formData.append("habits.drinking", String(Boolean(drinking)));
      formData.append("habits.pets", String(Boolean(pets)));

      if (avatarImageFile) {
        formData.append("avatarImage", avatarImageFile);
        formData.append("avatarPreset", avatarPreset);
      } else {
        formData.append("avatarPreset", avatarPreset);
      }

      formData.append("avatarMode", avatarMode);

      // Backend should return { profile: updatedProfile }
      await api.post("/api/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onSaved?.();
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="text-lg text-gray-600">Upload your photo and tell us what you’re looking for</p>
        </div>

        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-600 to-accent-600 w-2/3 transition-all duration-500" />
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Profile Photo */}
          <Card className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Profile Photo</h2>
              <p className="text-sm text-gray-600 mt-1">
                Choose a preset avatar or upload your own photo.
              </p>
            </div>

            <AvatarSelector
              avatarPreset={avatarPreset}
              onChangeAvatarPreset={(nextPresetId) => {
                setAvatarPreset(nextPresetId);
                setAvatarMode("preset");
                setExistingAvatarPath("");
              }}
              avatarFile={avatarImageFile}
              onChangeAvatarFile={(nextFile) => {
                setAvatarImageFile(nextFile);
                if (nextFile) {
                  setAvatarMode("upload");
                } else {
                  setAvatarMode((prevMode) =>
                    prevMode === "preset" ? "preset" : existingAvatarPath ? "upload" : "preset"
                  );
                }
              }}
              previewSrc={avatarPreviewSrc}
              fallbackLetter={name?.trim()?.charAt(0)?.toUpperCase() || "N"}
            />
          </Card>

          {/* Basic Information */}
          <Card className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold">
                  1
                </span>
                Basic Information
              </h2>
              <p className="text-sm text-gray-600 mt-1">Let’s start with the basics</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Age"
                type="number"
                placeholder="25"
                min="18"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Gender"
                options={[
                  { value: "", label: "Select..." },
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              />

              <Input
                label="City"
                type="text"
                placeholder="New York"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
          </Card>

          {/* Budget Range */}
          <Card className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent-100 text-accent-600 flex items-center justify-center text-sm font-bold">
                  2
                </span>
                Budget Range
              </h2>
              <p className="text-sm text-gray-600 mt-1">What’s your monthly budget?</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Minimum Budget ($)"
                type="number"
                placeholder="1000"
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value)}
                required
              />

              <Input
                label="Maximum Budget ($)"
                type="number"
                placeholder="2000"
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
                required
              />
            </div>

            {budgetMin && budgetMax && (
              <div className="rounded-lg bg-primary-50 border border-primary-200 p-3">
                <p className="text-sm text-primary-700">
                  <strong>Budget Range:</strong> ${Number(budgetMin).toLocaleString()} - $
                  {Number(budgetMax).toLocaleString()}/month
                </p>
              </div>
            )}
          </Card>

          {/* Lifestyle Preferences */}
          <Card className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                  3
                </span>
                Lifestyle Habits
              </h2>
              <p className="text-sm text-gray-600 mt-1">Help us match you with compatible roommates</p>
            </div>

            <div className="space-y-4">
              <Checkbox
                label="I smoke 🚬"
                checked={smoking}
                onChange={(e) => setSmoking(e.target.checked)}
              />
              <Checkbox
                label="I drink 🍺"
                checked={drinking}
                onChange={(e) => setDrinking(e.target.checked)}
              />
              <Checkbox
                label="I have pets 🐾"
                checked={pets}
                onChange={(e) => setPets(e.target.checked)}
              />
            </div>
          </Card>

          {/* Sleep Schedule */}
          <Card className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                  4
                </span>
                Sleep Schedule
              </h2>
              <p className="text-sm text-gray-600 mt-1">When do you usually sleep?</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {sleepOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    sleep === option.value
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="sleep"
                    value={option.value}
                    checked={sleep === option.value}
                    onChange={(e) => setSleep(e.target.value)}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span className="font-medium text-gray-900">{option.label}</span>
                </label>
              ))}
            </div>
          </Card>

          {/* Bio */}
          <Card className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Bio</h2>
              <p className="text-sm text-gray-600 mt-1">A short introduction helps others connect faster</p>
            </div>

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about your routine, preferences, and what kind of roommate you want."
              className="w-full min-h-[120px] rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-colors"
            />
          </Card>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="secondary" size="md" className="flex-1" onClick={() => onSaved?.()}>
              Skip for now
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={saving || loading || !canSubmit}
              className="flex-1"
            >
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

