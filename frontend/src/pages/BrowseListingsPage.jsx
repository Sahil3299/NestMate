import { useState, useEffect } from 'react';
import { X, MapPin, Home, IndianRupee, SlidersHorizontal, Search, Building, RotateCcw } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import { ListingCardSkeleton } from '../components/ui/Skeleton';

const DUMMY_LISTINGS = [
  {
    id: 1, title: '1BHK in Bandra', locality: 'Bandra West', city: 'Mumbai', price: 25000,
    roomType: '1BHK', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
    matchScore: 92, preferences: ['Vegetarian', 'Non-smoker', 'Female only'],
    gender: 'Female', available: true, owner: { id: 1, name: 'Priya Singh', avatar: 'PS' }
  },
  {
    id: 2, title: '2BHK in Powai', locality: 'Powai', city: 'Mumbai', price: 35000,
    roomType: '2BHK', image: 'https://images.unsplash.com/photo-1501699686415-ba1eb9e88213?w=600&h=400&fit=crop',
    matchScore: 85, preferences: ['Professional', 'Early sleeper'],
    gender: 'Male', available: true, owner: { id: 2, name: 'Rajesh Kumar', avatar: 'RK' }
  },
  {
    id: 3, title: 'Studio in Koregaon Park', locality: 'Koregaon Park', city: 'Pune', price: 15000,
    roomType: 'Studio', image: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=600&h=400&fit=crop',
    matchScore: 88, preferences: ['Student', 'Non-smoker'],
    gender: 'Any', available: false, owner: { id: 3, name: 'Neha Patel', avatar: 'NP' }
  },
  {
    id: 4, title: '3BHK in Whitefield', locality: 'Whitefield', city: 'Bangalore', price: 45000,
    roomType: '3BHK', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
    matchScore: 90, preferences: ['Professional', 'Vegetarian'],
    gender: 'Any', available: true, owner: { id: 4, name: 'Amit Shah', avatar: 'AS' }
  },
  {
    id: 5, title: 'PG in Dadar', locality: 'Dadar', city: 'Mumbai', price: 12000,
    roomType: 'PG', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
    matchScore: 78, preferences: ['Student friendly', 'WiFi included'],
    gender: 'Any', available: true, owner: { id: 5, name: 'Sneha Rao', avatar: 'SR' }
  },
  {
    id: 6, title: '1BHK in Indiranagar', locality: 'Indiranagar', city: 'Bangalore', price: 20000,
    roomType: '1BHK', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop',
    matchScore: 86, preferences: ['Young professional', 'Non-smoker'],
    gender: 'Male', available: true, owner: { id: 6, name: 'Vikram Joshi', avatar: 'VJ' }
  },
];

const CITIES = ['All Cities', 'Mumbai', 'Pune', 'Bangalore', 'Thane', 'Delhi'];
const ROOM_TYPES = ['All', '1BHK', '2BHK', '3BHK', 'Studio', 'PG'];

export default function BrowseListingsPage() {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: 'All Cities',
    budgetMin: 0,
    budgetMax: 100000,
    roomType: 'All',
    gender: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredListings = DUMMY_LISTINGS.filter((listing) => {
    if (filters.city !== 'All Cities' && listing.city !== filters.city) return false;
    if (listing.price < filters.budgetMin || listing.price > filters.budgetMax) return false;
    if (filters.roomType !== 'All' && listing.roomType !== filters.roomType) return false;
    return true;
  });

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ city: 'All Cities', budgetMin: 0, budgetMax: 100000, roomType: 'All', gender: '' });
  };

  const activeFilters = [
    filters.city !== 'All Cities' && { key: 'city', label: filters.city },
    filters.roomType !== 'All' && { key: 'roomType', label: filters.roomType },
    filters.budgetMax < 100000 && { key: 'budget', label: `\u20B9${filters.budgetMin.toLocaleString()} - \u20B9${filters.budgetMax.toLocaleString()}` },
  ].filter(Boolean);

  return (
    <div className="py-8 md:py-12">
      <div className="container-max">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#0F172A] mb-2">
            Browse Rooms &amp; Flatmates
          </h1>
          <p className="text-[#64748B]">{loading ? 'Searching...' : `${filteredListings.length} listings found`}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-bold text-[#0F172A] flex items-center gap-2">
                    <SlidersHorizontal size={16} />
                    Filters
                  </h2>
                  {activeFilters.length > 0 && (
                    <button onClick={resetFilters} className="text-xs text-[#14B8A6] hover:text-[#0F766E] font-medium flex items-center gap-1">
                      <RotateCcw size={12} />
                      Reset
                    </button>
                  )}
                </div>

                {/* City Filter */}
                <div className="mb-6 pb-6 border-b border-[#E2E8F0]">
                  <label className="block text-sm font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
                    <MapPin size={14} />
                    City
                  </label>
                  <select
                    value={filters.city}
                    onChange={(e) => updateFilter('city', e.target.value)}
                    className="input text-sm"
                  >
                    {CITIES.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Room Type Filter */}
                <div className="mb-6 pb-6 border-b border-[#E2E8F0]">
                  <label className="block text-sm font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
                    <Home size={14} />
                    Room Type
                  </label>
                  <div className="space-y-2">
                    {ROOM_TYPES.map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="roomType"
                          value={type}
                          checked={filters.roomType === type}
                          onChange={(e) => updateFilter('roomType', e.target.value)}
                          className="w-4 h-4 rounded accent-[#14B8A6]"
                        />
                        <span className="text-sm text-[#64748B]">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Budget Range */}
                <div>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-4 flex items-center gap-2">
                    <IndianRupee size={14} />
                    Budget: \u20B9{filters.budgetMin.toLocaleString()} - \u20B9{filters.budgetMax.toLocaleString()}
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={filters.budgetMin}
                      onChange={(e) => updateFilter('budgetMin', parseInt(e.target.value))}
                      className="w-full accent-[#14B8A6]"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={filters.budgetMax}
                      onChange={(e) => updateFilter('budgetMax', parseInt(e.target.value))}
                      className="w-full accent-[#14B8A6]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Active Filters Chips */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {activeFilters.map((filter) => (
                  <div
                    key={filter.key}
                    className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 px-3 py-1.5 rounded-full text-sm font-medium"
                  >
                    {filter.label}
                    <button
                      onClick={() => {
                        if (filter.key === 'city') updateFilter('city', 'All Cities');
                        else if (filter.key === 'roomType') updateFilter('roomType', 'All');
                        else if (filter.key === 'budget') resetFilters();
                      }}
                      className="hover:text-teal-900"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Listings Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1,2,3,4].map((i) => <ListingCardSkeleton key={i} />)}
              </div>
            ) : filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredListings.map((listing) => (
                  <ListingCard key={listing.id} {...listing} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Building size={48} className="mx-auto text-[#94a3b8] mb-4" />
                <h3 className="font-display text-xl font-bold text-[#0F172A] mb-2">
                  No listings found
                </h3>
                <p className="text-[#64748B] mb-6">
                  Try adjusting your filters to see more results
                </p>
                <button onClick={resetFilters} className="btn-primary">
                  <RotateCcw size={16} />
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
