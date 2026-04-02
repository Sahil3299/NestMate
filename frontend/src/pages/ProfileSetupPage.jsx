import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

const sleepOptions = [
  { id: "early", label: "Early" },
  { id: "medium", label: "Medium" },
  { id: "late", label: "Late" },
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
        // Profile may not exist yet; that's fine.
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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xl border rounded-xl p-6 bg-white/90">
        <h1 className="text-2xl font-semibold mb-2">Your Profile</h1>
        <p className="text-sm text-gray-600 mb-5">Set your preferences so we can match you.</p>

        {error ? <div className="text-sm text-red-600 mb-4">{error}</div> : null}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <div className="text-sm mb-1">Name</div>
              <input className="w-full border rounded-lg px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label className="block">
              <div className="text-sm mb-1">Age</div>
              <input className="w-full border rounded-lg px-3 py-2" type="number" min="0" max="120" value={age} onChange={(e) => setAge(e.target.value)} required />
            </label>
          </div>

          <label className="block">
            <div className="text-sm mb-1">Gender</div>
            <input className="w-full border rounded-lg px-3 py-2" value={gender} onChange={(e) => setGender(e.target.value)} required />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <div className="text-sm mb-1">Budget Min</div>
              <input className="w-full border rounded-lg px-3 py-2" type="number" min="0" value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} required />
            </label>
            <label className="block">
              <div className="text-sm mb-1">Budget Max</div>
              <input className="w-full border rounded-lg px-3 py-2" type="number" min="0" value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} required />
            </label>
          </div>

          <label className="block">
            <div className="text-sm mb-1">City</div>
            <input className="w-full border rounded-lg px-3 py-2" value={city} onChange={(e) => setCity(e.target.value)} required />
          </label>

          <div className="border rounded-lg p-4 space-y-3">
            <div className="text-sm font-medium">Habits</div>

            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={smoking} onChange={(e) => setSmoking(e.target.checked)} />
                Smoking
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={drinking} onChange={(e) => setDrinking(e.target.checked)} />
                Drinking
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={pets} onChange={(e) => setPets(e.target.checked)} />
                Pets
              </label>
            </div>

            <label className="block">
              <div className="text-sm mb-1">Sleep Schedule</div>
              <select className="w-full border rounded-lg px-3 py-2" value={sleep} onChange={(e) => setSleep(e.target.value)} required>
                {sleepOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button type="submit" disabled={loading} className="w-full py-2 rounded-lg bg-purple-600 text-white disabled:opacity-50">
            {loading ? "Saving..." : "Save & Find Matches"}
          </button>
        </form>
      </div>
    </div>
  );
}

