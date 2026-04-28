import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, IndianRupee, Users, CheckCircle, Shield, Award } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import bgImage from '../assets/Bg.png';

// Dummy data
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
    owner: {
      id: 1,
      name: 'Priya Singh',
      avatar: 'PS'
    }
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
    owner: {
      id: 2,
      name: 'Rajesh Kumar',
      avatar: 'RK'
    }
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
    owner: {
      id: 3,
      name: 'Neha Patel',
      avatar: 'NP'
    }
  },
];

const CITIES = ['Mumbai', 'Pune', 'Bangalore', 'Thane', 'Delhi', 'Hyderabad'];

export default function HomePage() {
  const [searchCity, setSearchCity] = useState('Mumbai');
  const [budgetMin, setBudgetMin] = useState('10000');
  const [budgetMax, setBudgetMax] = useState('50000');
  const [gender, setGender] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to browse with filters
    window.location.href = `/browse?city=${searchCity}`;
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        className="relative py-16 md:py-24 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-slate-900/60" />

        <div className="container-max relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12 animate-fadeIn">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
              Find Your Perfect Flatmate in{' '}
              <span className="text-teal-300">
                {searchCity}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 drop-shadow-md">
              Discover verified flatmates and rooms with zero brokerage. Safe, transparent, and stress-free.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 border border-slate-200 animate-slideUp">
            <form onSubmit={handleSearch} className="space-y-4 md:space-y-0 md:grid md:grid-cols-4 md:gap-4">
              {/* City */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                <select
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="input"
                >
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Min Budget</label>
                <input
                  type="number"
                  placeholder="10,000"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                  className="input"
                />
              </div>

              {/* Budget Max */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Max Budget</label>
                <input
                  type="number"
                  placeholder="50,000"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  className="input"
                />
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button type="submit" className="btn-primary w-full">
                  <Search size={18} />
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto">
            <div className="text-center p-4 md:p-6">
              <Award className="w-8 h-8 md:w-10 md:h-10 mx-auto text-teal-300 mb-2" />
              <p className="font-semibold text-white text-lg md:text-xl">10,000+</p>
              <p className="text-sm text-white/80">Verified Listings</p>
            </div>
            <div className="text-center p-4 md:p-6">
              <CheckCircle className="w-8 h-8 md:w-10 md:h-10 mx-auto text-teal-300 mb-2" />
              <p className="font-semibold text-white text-lg md:text-xl">Zero Brokerage</p>
              <p className="text-sm text-white/80">Direct Connect</p>
            </div>
            <div className="text-center p-4 md:p-6">
              <Shield className="w-8 h-8 md:w-10 md:h-10 mx-auto text-teal-300 mb-2" />
              <p className="font-semibold text-white text-lg md:text-xl">100% Safe</p>
              <p className="text-sm text-white/80">Verified Profiles</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-16 md:py-24">
        <div className="container-max">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                Featured Listings
              </h2>
              <p className="text-slate-600">Explore top-rated rooms across Indian cities</p>
            </div>
            <Link to="/browse" className="btn-primary text-sm md:text-base">
              View All
            </Link>
          </div>

          {/* Listing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {DUMMY_LISTINGS.map((listing) => (
              <ListingCard key={listing.id} {...listing} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 bg-slate-50">
        <div className="container-max">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 text-center mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: 'Search & Browse',
                description: 'Find rooms and flatmates using advanced filters. View verified profiles and compatibility scores.',
                icon: '🔍'
              },
              {
                step: 2,
                title: 'Connect',
                description: 'Message potential flatmates or landlords directly. Schedule visits and discuss preferences.',
                icon: '💬'
              },
              {
                step: 3,
                title: 'Move In',
                description: 'Complete verification and documentation. Zero brokerage, transparent process.',
                icon: '🏠'
              }
            ].map((item) => (
              <div key={item.step} className="card p-8 text-center hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
                  Step {item.step}: {item.title}
                </h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-teal-600 to-teal-700">
        <div className="container-max text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Find Your Flatmate?
          </h2>
          <p className="text-teal-50 text-lg mb-8 max-w-2xl mx-auto">
            Post your room for free or start browsing verified flatmates now. No registration needed!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/post-room"
              className="btn bg-white text-teal-600 hover:bg-slate-50 font-semibold"
            >
              Post Free Ad
            </Link>
            <Link
              to="/browse"
              className="btn bg-teal-500 text-white hover:bg-teal-400 font-semibold border border-white/30"
            >
              Browse Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
