import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Users, Home, ChevronRight, Star,
  CheckCircle, Shield, MessageCircle, UserCheck,
  IndianRupee, Building, ArrowRight, Quote, Play
} from 'lucide-react';
import ListingCard from '../components/ListingCard';
import bgPattern from '../assets/Bg.png';
import sharedLiving from '../assets/shared_living_space.png';

const DUMMY_LISTINGS = [
  {
    id: 1,
    title: 'Premium 1BHK in Bandra West',
    locality: 'Bandra West',
    city: 'Mumbai',
    price: 25000,
    roomType: '1BHK',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
    matchScore: 92,
    preferences: ['Vegetarian', 'Non-smoker', 'Female only'],
    gender: 'Female',
    available: true,
    owner: { id: 1, name: 'Priya Singh', avatar: 'PS' }
  },
  {
    id: 2,
    title: 'Spacious 2BHK with Sea View',
    locality: 'Powai',
    city: 'Mumbai',
    price: 35000,
    roomType: '2BHK',
    image: 'https://images.unsplash.com/photo-1501699686415-ba1eb9e88213?w=600&h=400&fit=crop',
    matchScore: 85,
    preferences: ['Professional', 'Early sleeper'],
    gender: 'Male',
    available: true,
    owner: { id: 2, name: 'Rajesh Kumar', avatar: 'RK' }
  },
  {
    id: 3,
    title: 'Cozy Studio near Koregaon Park',
    locality: 'Koregaon Park',
    city: 'Pune',
    price: 15000,
    roomType: 'Studio',
    image: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=600&h=400&fit=crop',
    matchScore: 88,
    preferences: ['Student', 'Non-smoker'],
    gender: 'Any',
    available: false,
    owner: { id: 3, name: 'Neha Patel', avatar: 'NP' }
  },
];

const CITIES = ['Mumbai', 'Pune', 'Bangalore', 'Thane', 'Delhi', 'Hyderabad'];
const BUDGETS = ['Any Budget', 'Under \u20B910k', '\u20B910k - \u20B920k', '\u20B920k - \u20B930k', '\u20B930k - \u20B950k', '\u20B950k+'];
const GENDERS = ['Any', 'Male', 'Female'];
const ROOM_TYPES = ['Any', '1BHK', '2BHK', '3BHK', 'Studio', 'PG'];

const FEATURES = [
  {
    icon: UserCheck,
    title: 'Verified Profiles',
    description: 'Every profile is manually verified with government ID and phone authentication for your safety.',
    color: 'from-teal-500 to-emerald-500'
  },
  {
    icon: IndianRupee,
    title: 'Zero Brokerage',
    description: 'Connect directly with owners and tenants. No middlemen, no hidden fees, no brokerage charges.',
    color: 'from-blue-500 to-teal-500'
  },
  {
    icon: MessageCircle,
    title: 'Instant Chat',
    description: 'Built-in messaging with real-time notifications. Discuss preferences and schedule visits instantly.',
    color: 'from-purple-500 to-teal-500'
  },
  {
    icon: Shield,
    title: 'Safe Community',
    description: 'Background verified community with ratings, reviews, and 24/7 support for peace of mind.',
    color: 'from-amber-500 to-teal-500'
  },
];

const STEPS = [
  {
    icon: Search,
    title: 'Search & Browse',
    description: 'Find rooms and flatmates using advanced filters. View verified profiles and compatibility scores.',
    step: '01'
  },
  {
    icon: MessageCircle,
    title: 'Connect & Chat',
    description: 'Message potential flatmates or landlords directly. Schedule visits and discuss preferences in real-time.',
    step: '02'
  },
  {
    icon: Home,
    title: 'Move In Safely',
    description: 'Complete verification and documentation. Zero brokerage, transparent process, stress-free move-in.',
    step: '03'
  },
];

const TESTIMONIALS = [
  {
    name: 'Arjun Mehta',
    role: 'Software Engineer, Mumbai',
    avatar: 'AM',
    quote: 'NestMate helped me find the perfect flatmate in just 3 days. The verification process gave me complete confidence. Highly recommended for professionals.',
    rating: 5
  },
  {
    name: 'Sneha Kapoor',
    role: 'Design Student, Pune',
    avatar: 'SK',
    quote: 'As a student moving to a new city, NestMate made the process so easy. Zero brokerage and verified listings saved me both money and stress.',
    rating: 5
  },
  {
    name: 'Rahul Verma',
    role: 'Product Manager, Bangalore',
    avatar: 'RV',
    quote: 'The compatibility matching is incredible. Found a flatmate who shares my lifestyle perfectly. The chat feature made coordination seamless.',
    rating: 5
  },
];

const DELAYS = ['animate-delay-100', 'animate-delay-200', 'animate-delay-300', 'animate-delay-400'];

function AnimatedCounter({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const increment = target / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
        />
      ))}
    </div>
  );
}

function HeroIllustration() {
  return (
    <div className="relative w-full aspect-[4/3]">
      <svg viewBox="0 0 520 480" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="bg-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#0F766E" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="building-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="blob-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0F766E" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        <circle cx="260" cy="240" r="200" fill="url(#blob-grad)" />
        <circle cx="400" cy="150" r="100" fill="url(#blob-grad)" />
        <circle cx="120" cy="360" r="80" fill="url(#blob-grad)" />

        <rect x="190" y="140" width="160" height="240" rx="12" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
        <rect x="190" y="140" width="160" height="8" rx="4" fill="url(#building-grad)" />

        {[0, 1, 2].map((i) => (
          <g key={`row1-${i}`}>
            <rect x="210" y={170 + i * 55} width="28" height="36" rx="4" fill="#E2E8F0" />
            <rect x="210" y={170 + i * 55} width="28" height="36" rx="4" fill="#14B8A6" opacity="0.08" />
            <rect x="262" y={170 + i * 55} width="28" height="36" rx="4" fill="#E2E8F0" />
            <rect x="262" y={170 + i * 55} width="28" height="36" rx="4" fill="#14B8A6" opacity="0.08" />
            <rect x="314" y={170 + i * 55} width="28" height="36" rx="4" fill="#E2E8F0" />
            <rect x="314" y={170 + i * 55} width="28" height="36" rx="4" fill="#14B8A6" opacity="0.08" />
          </g>
        ))}

        <rect x="240" y="320" width="55" height="60" rx="8" fill="#E2E8F0" />
        <rect x="240" y="320" width="55" height="60" rx="8" fill="url(#building-grad)" opacity="0.2" />
        <circle cx="282" cy="350" r="3" fill="#14B8A6" />
        <path d="M185 140 L270 100 L355 140" stroke="#14B8A6" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

        <g>
          <rect x="138" y="310" width="8" height="70" rx="3" fill="#94a3b8" />
          <circle cx="142" cy="290" r="35" fill="#14B8A6" opacity="0.15" />
          <circle cx="142" cy="290" r="25" fill="#14B8A6" opacity="0.25" />
          <circle cx="142" cy="290" r="15" fill="#14B8A6" opacity="0.4" />
        </g>

        <g>
          <rect x="370" y="280" width="7" height="100" rx="3" fill="#94a3b8" opacity="0.6" />
          <circle cx="373" cy="260" r="30" fill="#14B8A6" opacity="0.12" />
          <circle cx="373" cy="260" r="20" fill="#14B8A6" opacity="0.2" />
          <circle cx="373" cy="260" r="12" fill="#14B8A6" opacity="0.3" />
        </g>

        <circle cx="140" cy="160" r="4" fill="#14B8A6" opacity="0.5" />
        <circle cx="160" cy="180" r="3" fill="#14B8A6" opacity="0.4" />
        <circle cx="170" cy="205" r="5" fill="#14B8A6" opacity="0.6" />
        <circle cx="355" cy="130" r="4" fill="#0F766E" opacity="0.5" />
        <circle cx="380" cy="155" r="3" fill="#0F766E" opacity="0.4" />
        <circle cx="370" cy="180" r="5" fill="#0F766E" opacity="0.6" />

        <path d="M140 160 Q200 130 260 140" stroke="#14B8A6" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3" fill="none" />
        <path d="M355 130 Q290 110 230 130" stroke="#0F766E" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3" fill="none" />
        <path d="M170 205 Q200 220 240 210" stroke="#14B8A6" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.25" fill="none" />
        <path d="M370 180 Q340 200 310 195" stroke="#0F766E" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.25" fill="none" />

        <circle cx="160" cy="395" r="8" fill="#14B8A6" opacity="0.4" />
        <rect x="154" y="403" width="12" height="18" rx="4" fill="#14B8A6" opacity="0.3" />
        <circle cx="370" cy="395" r="8" fill="#14B8A6" opacity="0.4" />
        <rect x="364" y="403" width="12" height="18" rx="4" fill="#14B8A6" opacity="0.3" />
        <circle cx="265" cy="405" r="8" fill="#0F766E" opacity="0.4" />
        <rect x="259" y="413" width="12" height="18" rx="4" fill="#0F766E" opacity="0.3" />

        <path d="M350 220 C350 210 360 205 367 212 C374 205 384 210 384 220 C384 235 367 245 367 245 C367 245 350 235 350 220Z" fill="#14B8A6" opacity="0.3" />
        <path d="M355 222 C355 215 362 212 367 217 C372 212 379 215 379 222 C379 232 367 239 367 239 C367 239 355 232 355 222Z" fill="#14B8A6" opacity="0.5" />
      </svg>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [searchCity, setSearchCity] = useState('Mumbai');
  const [budget, setBudget] = useState('Any Budget');
  const [gender, setGender] = useState('Any');
  const [roomType, setRoomType] = useState('Any');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCity) params.set('city', searchCity);
    if (budget !== 'Any Budget') params.set('budget', budget);
    if (gender !== 'Any') params.set('gender', gender);
    if (roomType !== 'Any') params.set('roomType', roomType);
    navigate(`/browse?${params.toString()}`);
  };

  return (
    <div className="w-full overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FAFAFA] via-white to-teal-50/40"
        style={{ backgroundImage: `url(${bgPattern})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="container-max pt-16 md:pt-20 pb-32 md:pb-40">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 max-w-2xl text-center lg:text-left">
              <div className="flex flex-wrap justify-center lg:justify-start gap-2.5 mb-6" style={{animation: 'fadeIn 0.6s ease-out forwards'}}>
                <span className="pill">
                  <CheckCircle size={12} className="text-[#14B8A6]" />
                  12,000+ Verified Listings
                </span>
                <span className="pill">
                  <IndianRupee size={12} className="text-[#14B8A6]" />
                  Zero Brokerage
                </span>
                <span className="pill">
                  <Shield size={12} className="text-[#14B8A6]" />
                  Trusted by Professionals
                </span>
              </div>

              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-[#0F172A] leading-[1.08] mb-6" style={{animation: 'slideUp 0.6s ease-out forwards'}}>
                Find Your Perfect<br className="hidden sm:block" />
                <span className="gradient-text">Flatmate</span> in{' '}
                <span className="gradient-text">Mumbai</span>
              </h1>

              <p className="text-lg md:text-xl text-[#64748B] max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed" style={{animation: 'slideUp 0.6s ease-out 0.1s forwards', opacity: 0}}>
                Discover verified flatmates and rental homes with zero brokerage across India. Safe, transparent, and stress-free.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3" style={{animation: 'fadeUp 0.8s ease-out 0.2s forwards', opacity: 0}}>
                <Link to="/browse" className="btn-primary px-8 py-3.5 text-base">
                  Start Browsing
                  <ChevronRight size={18} />
                </Link>
                <Link to="#how-it-works" className="btn-secondary px-8 py-3.5 text-base"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Play size={16} />
                  See How It Works
                </Link>
              </div>
            </div>

            <div className="flex-1 w-full max-w-lg lg:max-w-none hidden lg:block" style={{animation: 'fadeIn 0.6s ease-out 0.3s forwards', opacity: 0}}>
              <HeroIllustration />
            </div>
          </div>
        </div>

        <div className="container-max relative z-20 -mt-20 md:-mt-24 pb-8">
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-[#E2E8F0] p-4 md:p-6 max-w-5xl mx-auto" style={{animation: 'slideUp 0.6s ease-out 0.3s forwards', opacity: 0}}>
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
                <div className="input-icon">
                  <MapPin className="icon" size={16} />
                  <select
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="input pl-10"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="input-icon">
                  <IndianRupee className="icon" size={16} />
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="input pl-10"
                  >
                    {BUDGETS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div className="input-icon">
                  <Users className="icon" size={16} />
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="input pl-10"
                  >
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div className="input-icon">
                  <Home className="icon" size={16} />
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="input pl-10"
                  >
                    {ROOM_TYPES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full !rounded-xl !py-3 text-sm lg:text-base !gap-2 relative overflow-hidden group/btn"
                >
                  <span className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                  <Search size={18} className="relative z-10" />
                  <span className="relative z-10">Search</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      <section className="py-20 md:py-28">
        <div className="container-max">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="section-title">Featured Listings</h2>
              <p className="section-subtitle">Explore top-rated rooms across Indian cities</p>
            </div>
            <Link to="/browse" className="btn-secondary shrink-0">
              View All Listings
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {DUMMY_LISTINGS.map((listing, i) => (
              <div key={listing.id} style={{animation: `fadeUp 0.8s ease-out ${(i + 1) * 0.1}s forwards`, opacity: 0}}>
                <ListingCard {...listing} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE NESTMATE */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="section-title">Why Choose NestMate</h2>
            <p className="section-subtitle mx-auto">Everything you need to find the perfect flatmate, all in one place.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group relative bg-[#FAFAFA] rounded-2xl p-6 md:p-8 border border-[#E2E8F0] hover:border-[#14B8A6]/30 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
                  style={{animation: `fadeUp 0.8s ease-out ${(i + 1) * 0.1}s forwards`, opacity: 0}}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-sm group-hover:shadow-md transition-all duration-300`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-[#0F172A] mb-2">{feature.title}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAFA] to-transparent" />
        <div className="container-max relative z-10">
          <div className="text-center mb-16">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle mx-auto">Three simple steps to find your perfect flatmate.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="relative text-center"
                  style={{animation: `fadeUp 0.8s ease-out ${(i + 1) * 0.1}s forwards`, opacity: 0}}
                >
                  <div className="relative mb-8 inline-flex">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#14B8A6] to-[#0F766E] flex items-center justify-center shadow-lg shadow-teal-500/20">
                      <Icon size={32} className="text-white" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-white border border-[#E2E8F0] rounded-full flex items-center justify-center text-xs font-bold text-[#14B8A6] shadow-sm">
                      {step.step}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl text-[#0F172A] mb-3">{step.title}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed max-w-xs mx-auto">{step.description}</p>

                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-10 -right-6 w-12 h-0.5 bg-gradient-to-r from-[#14B8A6]/40 to-transparent" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#14B8A6] to-[#0F766E]">
        <div className="container-max">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { icon: Building, value: 12000, suffix: '+', label: 'Verified Listings' },
              { icon: Users, value: 5000, suffix: '+', label: 'Happy Tenants' },
              { icon: Building, value: 50, suffix: '+', label: 'Cities Covered' },
              { icon: Star, value: 48, suffix: '', label: 'Rating' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              const displayValue = stat.label === 'Rating' ? (
                <span className="tabular-nums">4.8</span>
              ) : (
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              );
              return (
                <div
                  key={stat.label}
                  className="text-center text-white"
                  style={{animation: `fadeUp 0.8s ease-out ${(i + 1) * 0.1}s forwards`, opacity: 0}}
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                    <Icon size={24} className="text-white" />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold font-display mb-1">
                    {displayValue}
                  </p>
                  <p className="text-sm text-teal-100/80">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="section-title">Loved by Thousands</h2>
            <p className="section-subtitle mx-auto">Hear from people who found their perfect flatmate on NestMate.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className="bg-[#FAFAFA] rounded-2xl p-6 md:p-8 border border-[#E2E8F0] hover:border-[#14B8A6]/20 hover:shadow-card-hover transition-all duration-300"
                style={{animation: `fadeUp 0.8s ease-out ${(i + 1) * 0.1}s forwards`, opacity: 0}}
              >
                <Quote size={24} className="text-[#14B8A6]/30 mb-4" />
                <p className="text-sm text-[#64748B] leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                <Stars rating={t.rating} />
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#E2E8F0]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#14B8A6] to-[#0F766E] flex items-center justify-center text-white text-sm font-bold shadow-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">{t.name}</p>
                    <p className="text-xs text-[#64748B]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#14B8A6] to-[#0F766E]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-30" />

        <div className="container-max relative z-10 text-center">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
            <div className="text-left">
              <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Ready to Find Your Perfect Flatmate?
              </h2>
              <p className="text-teal-50/80 text-lg md:text-xl mb-10 max-w-2xl leading-relaxed">
                Join thousands of verified tenants and owners. Post your room for free or start browsing now.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/post-room"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#14B8A6] font-semibold rounded-xl hover:bg-teal-50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 text-base gap-2"
            >
              <Home size={18} />
              Post Free Ad
            </Link>
            <Link
              to="/browse"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/25 hover:bg-white/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 text-base gap-2"
            >
              <Search size={18} />
              Browse Now
            </Link>
          </div>
            </div>
            <div className="hidden lg:block">
              <img src={sharedLiving} alt="Shared living space" className="w-full h-auto rounded-2xl shadow-lg" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
