import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import { Sun, Moon, Clock, Smoking, Wine, PawPrint, Check } from "lucide-react";
import Button from "../Button";
import Card from "../Card";
import Checkbox from "../Checkbox";
import Input from "../Input";
import Select from "../Select";
import AvatarSelector from "./AvatarSelector";

const sleepOptions = [
  { value: "early", label: "Early Riser (Before 9 AM)", icon: Sun },
  { value: "medium", label: "Regular (9 AM - 11 PM)", icon: Clock },
  { value: "late", label: "Night Owl (After 11 PM)", icon: Moon },
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
  const [avatarMode, setAvatarMode] = useState("preset");
  const [existingAvatarPath, setExistingAvatarPath] = useState("");

  useEffect(() => {
    let mounted = true;
    async function loadMe() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/api/v1/users/me");
        const p = res.data.data || {};
        if (!mounted) return;
        setName(p.name || "");
        setAge(String(p.age ?? ""));
        setGender(p.gender || "");
        setCity(p.city || "");
        setBudgetMin(String(p.preferences?.budgetMin ?? ""));
        setBudgetMax(String(p.preferences?.budgetMax ?? ""));
        setSmoking(Boolean(p.habits?.smoking));
        setDrinking(Boolean(p.habits?.drinking));
        setPets(Boolean(p.habits?.pets));
        setSleep(p.habits?.sleep || "medium");
        setBio(p.bio || "");
        const loadedAvatarPath = p.avatarPath || p.avatarUrl || p.avatar || "";
        const loadedAvatarPreset = p.avatarPreset || "";
        setExistingAvatarPath(loadedAvatarPath);
        setAvatarMode(loadedAvatarPath ? "upload" : "preset");
        if (loadedAvatarPreset) setAvatarPreset(loadedAvatarPreset);
      } catch (err) {
        // Profile may not exist yet
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadMe();
    return () => { mounted = false; };
  }, []);

  const avatarPreviewSrc = useMemo(() => {
    if (avatarImageFile) return "";
    return getAvatarSrc(apiBaseUrl, existingAvatarPath) || "";
  }, [apiBaseUrl, existingAvatarPath, avatarImageFile]);

  const canSubmit = useMemo(() => {
    return Boolean(name.trim() && city.trim() && gender.trim() && age && budgetMin !== "" && budgetMax !== "" && sleep);
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
      formData.append("preferences.budgetMin", String(Number(budgetMin)));
      formData.append("preferences.budgetMax", String(Number(budgetMax)));
      formData.append("city", city.trim());
      formData.append("bio", bio || "");
      formData.append("habits.sleep", sleep);
      formData.append("habits.smoking", String(Boolean(smoking)));
      formData.append("habits.drinking", String(Boolean(drinking)));
      formData.append("habits.pets", String(Boolean(pets)));
      if (avatarImageFile) {
        formData.append("avatar", avatarImageFile);
        formData.append("avatarPreset", avatarPreset);
      } else {
        formData.append("avatarPreset", avatarPreset);
      }
      formData.append("avatarMode", avatarMode);
      await api.patch("/api/v1/users/me", formData, { headers: { "Content-Type": "multipart/form-data" } });
      onSaved?.();
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-[#FAFAFA] via-white to-teal-50/40">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-[#0F172A]">Complete Your Profile</h1>
          <p className="text-lg text-[#64748B]">Upload your photo and tell us what you're looking for</p>
        </div>

        <div className="h-1 bg-[#E2E8F0] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#14B8A6] to-[#0F766E] w-2/3 transition-all duration-500" />
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">{error}</div>
          )}

          <Card className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">Profile Photo</h2>
              <p className="text-sm text-[#64748B] mt-1">Choose a preset avatar or upload your own photo.</p>
            </div>
            <AvatarSelector
              avatarPreset={avatarPreset}
              onChangeAvatarPreset={(nextPresetId) => { setAvatarPreset(nextPresetId); setAvatarMode("preset"); setExistingAvatarPath(""); }}
              avatarFile={avatarImageFile}
              onChangeAvatarFile={(nextFile) => { setAvatarImageFile(nextFile); if (nextFile) setAvatarMode("upload"); }}
              previewSrc={avatarPreviewSrc}
              fallbackLetter={name?.trim()?.charAt(0)?.toUpperCase() || "N"}
            />
          </Card>

          <Card className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-teal-100 text-[#14B8A6] flex items-center justify-center text-sm font-bold">1</span>
                Basic Information
              </h2>
              <p className="text-sm text-[#64748B] mt-1">Let's start with the basics</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Full Name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input label="Age" type="number" placeholder="25" min="18" max="120" value={age} onChange={(e) => setAge(e.target.value)} required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select label="Gender" value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
              <Input label="City" type="text" placeholder="New York" value={city} onChange={(e) => setCity(e.target.value)} required />
            </div>
          </Card>

          <Card className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-teal-100 text-[#14B8A6] flex items-center justify-center text-sm font-bold">2</span>
                Budget Range
              </h2>
              <p className="text-sm text-[#64748B] mt-1">What's your monthly budget?</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Minimum Budget ($)" type="number" placeholder="1000" value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} required />
              <Input label="Maximum Budget ($)" type="number" placeholder="2000" value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} required />
            </div>

            {budgetMin && budgetMax && (
              <div className="rounded-lg bg-teal-50 border border-teal-200 p-3">
                <p className="text-sm text-teal-700">
                  <strong>Budget Range:</strong> ${Number(budgetMin).toLocaleString()} - ${Number(budgetMax).toLocaleString()}/month
                </p>
              </div>
            )}
          </Card>

          <Card className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-teal-100 text-[#14B8A6] flex items-center justify-center text-sm font-bold">3</span>
                Lifestyle Habits
              </h2>
              <p className="text-sm text-[#64748B] mt-1">Help us match you with compatible roommates</p>
            </div>

            <div className="space-y-4">
              {[
                { label: "I smoke", value: smoking, onChange: setSmoking, icon: Smoking },
                { label: "I drink", value: drinking, onChange: setDrinking, icon: Wine },
                { label: "I have pets", value: pets, onChange: setPets, icon: PawPrint },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Checkbox key={item.label}
                    label={<span className="flex items-center gap-2"><Icon size={14} />{item.label}</span>}
                    checked={item.value}
                    onChange={(e) => item.onChange(e.target.checked)}
                  />
                );
              })}
            </div>
          </Card>

          <Card className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-teal-100 text-[#14B8A6] flex items-center justify-center text-sm font-bold">4</span>
                Sleep Schedule
              </h2>
              <p className="text-sm text-[#64748B] mt-1">When do you usually sleep?</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {sleepOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <label key={option.value}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      sleep === option.value ? "border-[#14B8A6] bg-teal-50" : "border-[#E2E8F0] bg-white hover:border-slate-300"
                    }`}>
                    <input type="radio" name="sleep" value={option.value} checked={sleep === option.value}
                      onChange={(e) => setSleep(e.target.value)} className="w-4 h-4 text-[#14B8A6]" />
                    {Icon && <Icon size={16} className="text-[#64748B]" />}
                    <span className="font-medium text-[#0F172A]">{option.label}</span>
                  </label>
                );
              })}
            </div>
          </Card>

          <Card className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">Bio</h2>
              <p className="text-sm text-[#64748B] mt-1">A short introduction helps others connect faster</p>
            </div>

            <textarea value={bio} onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about your routine, preferences, and what kind of roommate you want."
              className="w-full min-h-[120px] rounded-xl border border-[#E2E8F0] px-4 py-3 text-[#0F172A] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] transition-all text-sm" />
          </Card>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="secondary" size="md" className="flex-1" onClick={() => onSaved?.()}>
              Skip for now
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={saving || loading || !canSubmit} className="flex-1">
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
