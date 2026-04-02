import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

function toBoolOrNull(v) {
  if (v === "" || v === undefined) return null;
  if (v === "true") return true;
  if (v === "false") return false;
  return null;
}

export default function MatchesPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bestMatches, setBestMatches] = useState([]);

  const [city, setCity] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");

  const [smoking, setSmoking] = useState(""); // "", "true", "false"
  const [drinking, setDrinking] = useState("");
  const [pets, setPets] = useState("");
  const [sleep, setSleep] = useState(""); // "", early|medium|late

  const params = useMemo(() => {
    const p = { limit: 20 };
    if (city.trim()) p.city = city.trim();
    if (minBudget !== "") p.minBudget = Number(minBudget);
    if (maxBudget !== "") p.maxBudget = Number(maxBudget);

    if (smoking !== "") p.smoking = smoking;
    if (drinking !== "") p.drinking = drinking;
    if (pets !== "") p.pets = pets;
    if (sleep) p.sleep = sleep;
    return p;
  }, [city, minBudget, maxBudget, smoking, drinking, pets, sleep]);

  async function fetchMatches() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/matches/best", { params });
      setBestMatches(res.data.bestMatches || []);
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Failed to fetch matches");
      setBestMatches([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Best Matches</h1>
          <p className="text-sm text-gray-600">Filtered by city, budget overlap, and lifestyle preferences.</p>
        </div>

        <div className="border rounded-xl p-4 bg-white/90">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <label className="block">
              <div className="text-sm mb-1">City (exact)</div>
              <input className="w-full border rounded-lg px-3 py-2" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g., Toronto" />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <div className="text-sm mb-1">Min Budget</div>
                <input className="w-full border rounded-lg px-3 py-2" type="number" value={minBudget} onChange={(e) => setMinBudget(e.target.value)} />
              </label>
              <label className="block">
                <div className="text-sm mb-1">Max Budget</div>
                <input className="w-full border rounded-lg px-3 py-2" type="number" value={maxBudget} onChange={(e) => setMaxBudget(e.target.value)} />
              </label>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <label className="block">
              <div className="text-sm mb-1">Smoking</div>
              <select className="w-full border rounded-lg px-3 py-2" value={smoking} onChange={(e) => setSmoking(e.target.value)}>
                <option value="">Any</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <label className="block">
              <div className="text-sm mb-1">Drinking</div>
              <select className="w-full border rounded-lg px-3 py-2" value={drinking} onChange={(e) => setDrinking(e.target.value)}>
                <option value="">Any</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <label className="block">
              <div className="text-sm mb-1">Pets</div>
              <select className="w-full border rounded-lg px-3 py-2" value={pets} onChange={(e) => setPets(e.target.value)}>
                <option value="">Any</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <label className="block">
              <div className="text-sm mb-1">Sleep Schedule</div>
              <select className="w-full border rounded-lg px-3 py-2" value={sleep} onChange={(e) => setSleep(e.target.value)}>
                <option value="">Any</option>
                <option value="early">Early</option>
                <option value="medium">Medium</option>
                <option value="late">Late</option>
              </select>
            </label>
          </div>

          <button
            type="button"
            onClick={fetchMatches}
            disabled={loading}
            className="mt-4 w-full py-2 rounded-lg bg-purple-600 text-white disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search Matches"}
          </button>
        </div>

        {error ? (
          <div className="border rounded-xl p-4 bg-white/90">
            <div className="text-red-600 text-sm">{error}</div>
            <button type="button" className="mt-3 underline text-sm" onClick={() => navigate("/profile")}>
              Create/Update Profile
            </button>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bestMatches.map((m) => (
            <div key={m.uid} className="border rounded-xl p-4 bg-white/90">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-sm text-gray-600">
                    {m.city} • {m.age} • {m.gender}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Match</div>
                  <div className="text-xl font-semibold">{m.matchPercent}%</div>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-700">
                Budget: ${m.budgetMin}–${m.budgetMax}
              </div>
              <div className="mt-2 text-sm text-gray-700">
                Habits: Smoking {m.habits?.smoking ? "Yes" : "No"} • Drinking {m.habits?.drinking ? "Yes" : "No"} • Pets {m.habits?.pets ? "Yes" : "No"} • Sleep {m.habits?.sleep}
              </div>

              <button
                type="button"
                onClick={() => navigate(`/chat/${m.uid}`)}
                className="mt-4 w-full py-2 rounded-lg border hover:bg-gray-50"
              >
                Connect
              </button>
            </div>
          ))}
        </div>

        {bestMatches.length === 0 && !loading && !error ? (
          <div className="text-sm text-gray-600">No matches found with current filters.</div>
        ) : null}
      </div>
    </div>
  );
}

