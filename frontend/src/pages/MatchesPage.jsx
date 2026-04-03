import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";
import ListingCard from "../components/ListingCard";
import ListingCardSkeleton from "../components/ListingCardSkeleton";

export default function MatchesPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search & Filter Section */}
      <div className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Find your next roommate</h1>
            <p className="mt-1 text-gray-500">
              Match by location and budget, then chat instantly.
            </p>
          </div>

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <ListingCardSkeleton key={idx} />
            ))}
          </div>
        ) : bestMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestMatches.map((match) => (
              <ListingCard
                key={match.uid}
                match={match}
                onOpen={() =>
                  navigate(`/profile/${match.uid}`, {
                    state: { match },
                  })
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto w-fit px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-100">
              No matches found
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mt-4">Adjust your filters</h3>
            <p className="text-gray-500 mt-2">
              Update your profile to improve match quality.
            </p>
            <div className="mt-6">
              <Button onClick={() => navigate("/profile")} variant="primary" size="md">
                Update Profile
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

