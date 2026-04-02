import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";

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

  const [smoking, setSmoking] = useState("");
  const [drinking, setDrinking] = useState("");
  const [pets, setPets] = useState("");
  const [sleep, setSleep] = useState("");

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

  // Generate avatar color based on name
  const getAvatarColor = (name) => {
    const colors = [
      "from-purple-400 to-pink-600",
      "from-blue-400 to-cyan-600",
      "from-yellow-400 to-orange-600",
      "from-green-400 to-emerald-600",
      "from-pink-400 to-red-600",
    ];
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Search & Filter Section */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <Input
              label="Location"
              type="text"
              placeholder="Search city..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <Input
              label="Min Budget"
              type="number"
              placeholder="5000"
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value)}
            />
            <Input
              label="Max Budget"
              type="number"
              placeholder="50000"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
            />
            <Select
              label="Sleep"
              options={[
                { value: "", label: "Any" },
                { value: "early", label: "Early" },
                { value: "medium", label: "Medium" },
                { value: "late", label: "Late" },
              ]}
              value={sleep}
              onChange={(e) => setSleep(e.target.value)}
            />
            <div className="flex items-end">
              <Button
                onClick={fetchMatches}
                disabled={loading}
                variant="primary"
                size="md"
                className="w-full"
              >
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
              More Filters ▼
            </summary>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 pt-3 border-t border-gray-300">
              <Select
                label="Smoking"
                options={[
                  { value: "", label: "Any" },
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ]}
                value={smoking}
                onChange={(e) => setSmoking(e.target.value)}
              />
              <Select
                label="Drinking"
                options={[
                  { value: "", label: "Any" },
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ]}
                value={drinking}
                onChange={(e) => setDrinking(e.target.value)}
              />
              <Select
                label="Pets"
                options={[
                  { value: "", label: "Any" },
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ]}
                value={pets}
                onChange={(e) => setPets(e.target.value)}
              />
            </div>
          </details>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium mb-2">{error}</p>
            <Button
              onClick={() => navigate("/profile")}
              variant="primary"
              size="sm"
            >
              Create/Update Your Profile
            </Button>
          </div>
        )}

        {/* Matches Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-primary-600 animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Finding perfect matches...</p>
            </div>
          </div>
        ) : bestMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestMatches.map((match) => (
              <div
                key={match.uid}
                className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer bg-white"
                onClick={() => navigate(`/profile/${match.uid}`)}
              >
                {/* Header with Match % */}
                <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{match.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        📍 {match.city} • {match.age} • {match.gender}
                      </p>
                    </div>
                    {/* Avatar */}
                    <div className={`w-16 h-16 bg-gradient-to-br ${getAvatarColor(match.name)} rounded-lg flex items-center justify-center text-white font-bold text-2xl flex-shrink-0`}>
                      {match.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                  {/* Rent */}
                  <div>
                    <p className="text-xs text-gray-600 font-medium uppercase">Rent</p>
                    <p className="text-lg font-bold text-gray-900">
                      ₹{match.budgetMin?.toLocaleString()} - ₹{match.budgetMax?.toLocaleString()}
                    </p>
                  </div>

                  {/* Looking For */}
                  <div>
                    <p className="text-xs text-gray-600 font-medium uppercase">Looking for</p>
                    <p className="text-sm font-medium text-gray-900">Roommate</p>
                  </div>

                  {/* Match Score */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
                        style={{ width: `${match.matchPercent}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-primary-600">{match.matchPercent}%</span>
                  </div>

                  {/* Habits */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${match.habits?.smoking ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>
                      🚬 {match.habits?.smoking ? "Smoker" : "Non-smoker"}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${match.habits?.drinking ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}`}>
                      🍺 {match.habits?.drinking ? "Drinker" : "Non-drinker"}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${match.habits?.pets ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                      🐾 {match.habits?.pets ? "Has Pets" : "No Pets"}
                    </span>
                  </div>
                </div>

                {/* Footer with Actions */}
                <div className="p-4 border-t border-gray-200 flex gap-2 bg-gray-50">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 00.948-.684l1.498-4.493a1 1 0 011.502 0l1.498 4.493a1 1 0 00.948.684H19a2 2 0 012 2v1M3 5a2 2 0 002 2h3l1 3h4l1-3h3a2 2 0 012-2m-1 11a1 1 0 100-2 1 1 0 000 2m-9 0a1 1 0 100-2 1 1 0 000 2m10 0a1 1 0 100-2 1 1 0 000 2m-6-1v-3" />
                    </svg>
                  </button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/profile/${match.uid}`);
                    }}
                  >
                    👁️ View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No matches found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or update your profile</p>
            <Button
              onClick={() => navigate("/profile")}
              variant="primary"
              size="md"
            >
              Update Your Profile
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

