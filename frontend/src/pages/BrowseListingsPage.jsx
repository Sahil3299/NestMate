import { useState, useEffect } from 'react';
import { X, MapPin, Home, IndianRupee, SlidersHorizontal, Search, Building, RotateCcw, Users } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import { ListingCardSkeleton } from '../components/ui/Skeleton';
import { listingApi } from '../services/api';

const DUMMY_LISTINGS = [
  {
    _id: 'dummy-1', title: '1BHK in Bandra', description: 'Lovely cozy room in the heart of Bandra West with great natural light and premium furniture.', locality: 'Bandra West', city: 'Mumbai', rent: 25000,
    roomType: '1BHK', images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop'],
    matchScore: 92, preferences: ['Vegetarian', 'Non-smoker', 'Female only'],
    genderPreference: 'Female', availability: true, owner: { _id: 'owner-1', name: 'Priya Singh' }, isBrokerageFree: true
  },
  {
    _id: 'dummy-2', title: '2BHK in Powai', description: 'Shared roommate listing in beautiful highrise apartment overlooking Powai Lake.', locality: 'Powai', city: 'Mumbai', rent: 35000,
    roomType: '2BHK', images: ['https://images.unsplash.com/photo-1501699686415-ba1eb9e88213?w=600&h=400&fit=crop'],
    matchScore: 85, preferences: ['Professional', 'Early sleeper'],
    genderPreference: 'Male', availability: true, owner: { _id: 'owner-2', name: 'Rajesh Kumar' }, isBrokerageFree: true
  },
  {
    _id: 'dummy-3', title: 'Studio in Koregaon Park', description: 'Studio apartment with attached bathroom, private kitchen, and high-speed fiber internet.', locality: 'Koregaon Park', city: 'Pune', rent: 15000,
    roomType: 'Studio', images: ['https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=600&h=400&fit=crop'],
    matchScore: 88, preferences: ['Student', 'Non-smoker'],
    genderPreference: 'Any', availability: false, owner: { _id: 'owner-3', name: 'Neha Patel' }, isBrokerageFree: true
  },
  {
    _id: 'dummy-4', title: '3BHK in Whitefield', description: 'Luxury 3BHK flatmate listing. Looking for neat and clean flatmates to share spacious hall.', locality: 'Whitefield', city: 'Bangalore', rent: 45000,
    roomType: '3BHK', images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop'],
    matchScore: 90, preferences: ['Professional', 'Vegetarian'],
    genderPreference: 'Any', availability: true, owner: { _id: 'owner-4', name: 'Amit Shah' }, isBrokerageFree: true
  },
];

const CITIES = ['All Cities', 'Mumbai', 'Pune', 'Bangalore', 'Thane', 'Delhi', 'Hyderabad'];
const ROOM_TYPES = ['All', '1BHK', '2BHK', '3BHK', 'Studio', 'PG'];

export default function BrowseListingsPage() {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({
    city: 'All Cities',
    budgetMin: 0,
    budgetMax: 100000,
    roomType: 'All',
    gender: '',
  });

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await listingApi.getAll();
        const data = res.data.data;
        if (Array.isArray(data) && data.length > 0) {
          setListings(data);
        } else {
          setListings(DUMMY_LISTINGS);
        }
      } catch (err) {
        setListings(DUMMY_LISTINGS);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const filteredListings = listings.filter((listing) => {
    if (filters.city !== 'All Cities' && listing.city?.toLowerCase() !== filters.city?.toLowerCase()) return false;
    if (listing.rent < filters.budgetMin || listing.rent > filters.budgetMax) return false;
    if (filters.roomType !== 'All' && listing.roomType !== filters.roomType) return false;
    if (filters.gender && listing.genderPreference !== filters.gender) return false;
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
    filters.gender && { key: 'gender', label: `Gender: ${filters.gender}` },
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
                    <button onClick={resetFilters} className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
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
                          className="w-4 h-4 rounded accent-teal-500"
                        />
                        <span className="text-sm text-[#64748B]">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Gender Preference Filter */}
                <div className="mb-6 pb-6 border-b border-[#E2E8F0]">
                  <label className="block text-sm font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
                    <Users size={14} />
                    Gender Preference
                  </label>
                  <select
                    value={filters.gender}
                    onChange={(e) => updateFilter('gender', e.target.value)}
                    className="input text-sm"
                  >
                    <option value="">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Any">Any</option>
                  </select>
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
                      className="w-full accent-teal-500"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={filters.budgetMax}
                      onChange={(e) => updateFilter('budgetMax', parseInt(e.target.value))}
                      className="w-full accent-teal-500"
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
                        else if (filter.key === 'gender') updateFilter('gender', '');
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
                  <ListingCard
                    key={listing._id}
                    id={listing._id}
                    title={listing.title}
                    description={listing.description}
                    isBrokerageFree={listing.isBrokerageFree}
                    locality={listing.locality}
                    city={listing.city}
                    price={listing.rent}
                    roomType={listing.roomType}
                    image={listing.images?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop'}
                    matchScore={listing.matchScore || 90}
                    preferences={listing.preferences || []}
                    gender={listing.genderPreference}
                    available={listing.availability !== false}
                    owner={listing.owner ? {
                      name: listing.owner.name,
                      avatar: listing.owner.name?.charAt(0) || 'U',
                      id: listing.owner._id
                    } : null}
                  />
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
