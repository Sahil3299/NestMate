import { useState } from 'react';
import { X } from 'lucide-react';
import ListingCard from '../components/ListingCard';

const DUMMY_LISTINGS = [
  {
    id: 1,
    title: '1BHK in Bandra',
    locality: 'Bandra West',
    city: 'Mumbai',
    price: 25000,
    roomType: '1BHK',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
    matchScore: 92,
    preferences: ['Vegetarian', 'Non-smoker', 'Female only'],
  },
  {
    id: 2,
    title: '2BHK in Powai',
    locality: 'Powai',
    city: 'Mumbai',
    price: 35000,
    roomType: '2BHK',
    image: 'https://images.unsplash.com/photo-1501699686415-ba1eb9e88213?w=600&h=400&fit=crop',
    matchScore: 85,
    preferences: ['Professional', 'Early sleeper'],
  },
  {
    id: 3,
    title: 'Studio in Koregaon Park',
    locality: 'Koregaon Park',
    city: 'Pune',
    price: 15000,
    roomType: 'Studio',
    image: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=600&h=400&fit=crop',
    matchScore: 88,
    preferences: ['Student', 'Non-smoker'],
  },
  {
    id: 4,
    title: '3BHK in Whitefield',
    locality: 'Whitefield',
    city: 'Bangalore',
    price: 45000,
    roomType: '3BHK',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
    matchScore: 90,
    preferences: ['Professional', 'Vegetarian'],
  },
  {
    id: 5,
    title: 'PG in Dadar',
    locality: 'Dadar',
    city: 'Mumbai',
    price: 12000,
    roomType: 'PG',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
    matchScore: 78,
    preferences: ['Student friendly', 'WiFi included'],
  },
  {
    id: 6,
    title: '1BHK in Indiranagar',
    locality: 'Indiranagar',
    city: 'Bangalore',
    price: 20000,
    roomType: '1BHK',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop',
    matchScore: 86,
    preferences: ['Young professional', 'Non-smoker'],
  },
];

const CITIES = ['All Cities', 'Mumbai', 'Pune', 'Bangalore', 'Thane', 'Delhi'];
const ROOM_TYPES = ['All', '1BHK', '2BHK', '3BHK', 'Studio', 'PG'];

export default function BrowseListingsPage() {
  const [filters, setFilters] = useState({
    city: 'All Cities',
    budgetMin: 0,
    budgetMax: 100000,
    roomType: 'All',
    gender: '',
  });

  // Apply filters
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
    setFilters({
      city: 'All Cities',
      budgetMin: 0,
      budgetMax: 100000,
      roomType: 'All',
      gender: '',
    });
  };

  const activeFilters = [
    filters.city !== 'All Cities' && { key: 'city', label: filters.city },
    filters.roomType !== 'All' && { key: 'roomType', label: filters.roomType },
    filters.budgetMax < 100000 && { key: 'budget', label: `₹${filters.budgetMin.toLocaleString()} - ₹${filters.budgetMax.toLocaleString()}` },
  ].filter(Boolean);

  return (
    <div className="py-8">
      <div className="container-max">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Browse Rooms & Flatmates
          </h1>
          <p className="text-slate-600">{filteredListings.length} listings found</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-bold text-slate-900">Filters</h2>
                  {activeFilters.length > 0 && (
                    <button
                      onClick={resetFilters}
                      className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* City Filter */}
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <label className="block text-sm font-semibold text-slate-900 mb-3">City</label>
                  <select
                    value={filters.city}
                    onChange={(e) => updateFilter('city', e.target.value)}
                    className="input text-sm"
                  >
                    {CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Room Type Filter */}
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <label className="block text-sm font-semibold text-slate-900 mb-3">Room Type</label>
                  <div className="space-y-2">
                    {ROOM_TYPES.map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="roomType"
                          value={type}
                          checked={filters.roomType === type}
                          onChange={(e) => updateFilter('roomType', e.target.value)}
                          className="w-4 h-4 rounded accent-teal-600"
                        />
                        <span className="text-sm text-slate-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Budget Range */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-4">
                    Budget: ₹{filters.budgetMin.toLocaleString()} - ₹{filters.budgetMax.toLocaleString()}
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={filters.budgetMin}
                      onChange={(e) => updateFilter('budgetMin', parseInt(e.target.value))}
                      className="w-full accent-teal-600"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={filters.budgetMax}
                      onChange={(e) => updateFilter('budgetMax', parseInt(e.target.value))}
                      className="w-full accent-teal-600"
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
            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredListings.map((listing) => (
                  <ListingCard key={listing.id} {...listing} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
                  No listings found
                </h3>
                <p className="text-slate-600 mb-6">
                  Try adjusting your filters to see more results
                </p>
                <button
                  onClick={resetFilters}
                  className="btn-primary"
                >
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
