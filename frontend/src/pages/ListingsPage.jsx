import React, { useEffect, useState, useRef, useCallback } from "react";
import { listingAPI } from "../lib/api";
import RoomCard from "../components/RoomCard";
import Input from "../components/Input";
import Button from "../components/Button";
import { Search, MapPin } from "lucide-react";

export default function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");

  // Filter states
  const [minRent, setMinRent] = useState("");
  const [maxRent, setMaxRent] = useState("");
  const [city, setCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [skip, setSkip] = useState(0);
  const [limit] = useState(12);

  // Debounce timer
  const debounceTimer = useRef(null);

  // Reset and search with new filters
  const performSearch = useCallback(
    async (newFilters = {}) => {
      setLoading(true);
      setError("");
      setListings([]);
      setSkip(0);

      try {
        const params = {
          limit,
          skip: 0,
          ...newFilters,
        };

        const response = await listingAPI.search(params);
        setListings(response.data.listings || []);
        setHasMore((response.data.total || 0) > limit);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load listings");
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  // Debounced search handler
  const handleFilterChange = useCallback(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      performSearch({
        minRent: minRent ? Number(minRent) : undefined,
        maxRent: maxRent ? Number(maxRent) : undefined,
        city: city || undefined,
      });
    }, 500);
  }, [minRent, maxRent, city, performSearch]);

  // Initial load
  useEffect(() => {
    performSearch();
  }, [performSearch]);

  // Load more listings (pagination)
  const loadMore = async () => {
    const newSkip = skip + limit;
    setLoading(true);

    try {
      const params = {
        limit,
        skip: newSkip,
        minRent: minRent ? Number(minRent) : undefined,
        maxRent: maxRent ? Number(maxRent) : undefined,
        city: city || undefined,
      };

      const response = await listingAPI.search(params);
      const newListings = response.data.listings || [];

      setListings((prev) => [...prev, ...newListings]);
      setSkip(newSkip);
      setHasMore(newListings.length === limit);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load more listings");
    } finally {
      setLoading(false);
    }
  };

  // Trigger search when filters change
  useEffect(() => {
    handleFilterChange();
  }, [minRent, maxRent, city, handleFilterChange]);

  const resetFilters = () => {
    setMinRent("");
    setMaxRent("");
    setCity("");
    setSearchQuery("");
    performSearch();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Rooms</h1>
          <p className="text-gray-600">Find your perfect living space</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Min Rent */}
            <Input
              label="Min Rent ($)"
              type="number"
              placeholder="500"
              value={minRent}
              onChange={(e) => setMinRent(e.target.value)}
            />

            {/* Max Rent */}
            <Input
              label="Max Rent ($)"
              type="number"
              placeholder="5000"
              value={maxRent}
              onChange={(e) => setMaxRent(e.target.value)}
            />

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MapPin size={16} />
                City
              </label>
              <input
                type="text"
                placeholder="e.g., New York"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <Button
                onClick={resetFilters}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Results Info */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600 font-semibold">
            Showing {listings.length} listings {city && `in ${city}`}
          </p>
        </div>

        {/* Listings Grid */}
        {listings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {listings.map((room) => (
                <RoomCard
                  key={room._id}
                  room={room}
                  onFavorite={(id, isFav) => {
                    console.log(`Room ${id} ${isFav ? "favorited" : "unfavorited"}`);
                  }}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center">
                <Button
                  onClick={loadMore}
                  disabled={loading}
                  className={`px-8 py-2 ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  } text-white`}
                >
                  {loading ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}
          </>
        ) : !loading ? (
          <div className="text-center py-12">
            <Search size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg font-semibold">No listings found</p>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        ) : null}

        {/* Loading State */}
        {loading && listings.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  );
}
