import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import Select from "../components/Select";
import Checkbox from "../components/Checkbox";
import Badge from "../components/Badge";

const sleepOptions = [
  { value: "early", label: "🌅 Early Riser (Before 9 AM)" },
  { value: "medium", label: "⏰ Regular (9 AM - 11 PM)" },
  { value: "late", label: "🌙 Night Owl (After 11 PM)" },
];

export default function ProfileSetupPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [city, setCity] = useState("");

  const [smoking, setSmoking] = useState(false);
  const [drinking, setDrinking] = useState(false);
  const [pets, setPets] = useState(false);
  const [sleep, setSleep] = useState("medium");

  useEffect(() => {
    let mounted = true;
    async function loadMe() {
      try {
        const res = await api.get("/api/profile/me");
        const p = res.data.profile;
        if (!mounted) return;
        setName(p.name || "");
        setAge(String(p.age ?? ""));
        setGender(p.gender || "");
        setBudgetMin(String(p.budgetMin ?? ""));
        setBudgetMax(String(p.budgetMax ?? ""));
        setCity(p.city || "");
        setSmoking(Boolean(p.habits?.smoking));
        setDrinking(Boolean(p.habits?.drinking));
        setPets(Boolean(p.habits?.pets));
        setSleep(p.habits?.sleep || "medium");
      } catch (err) {
        // Profile may not exist yet
      }
    }
    loadMe();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        age: Number(age),
        gender: gender.trim(),
        budgetMin: Number(budgetMin),
        budgetMax: Number(budgetMax),
        city: city.trim(),
        habits: {
          smoking,
          drinking,
          pets,
          sleep,
        },
      };

      await api.post("/api/profile", payload);
      navigate("/matches");
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="text-lg text-gray-600">Tell us about yourself so we can find your perfect match</p>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-600 to-accent-600 w-2/3 transition-all duration-500"></div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <Card className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold">1</span>
                Basic Information
              </h2>
              <p className="text-sm text-gray-600 mt-1">Let's start with the basics</p>
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

          {/* Budget Information */}
          <Card className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent-100 text-accent-600 flex items-center justify-center text-sm font-bold">2</span>
                Budget Range
              </h2>
              <p className="text-sm text-gray-600 mt-1">What's your monthly budget?</p>
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
                  <strong>Budget Range:</strong> ${Number(budgetMin).toLocaleString()} - ${Number(budgetMax).toLocaleString()}/month
                </p>
              </div>
            )}
          </Card>

          {/* Lifestyle Preferences */}
          <Card className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">3</span>
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
                <span className="w-8 h-8 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center text-sm font-bold">4</span>
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

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="flex-1"
              onClick={() => navigate("/matches")}
            >
              Skip for now
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Saving..." : "Save & Find Matches"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

