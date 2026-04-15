import { useState } from 'react';
import { ChevronRight, Upload, Plus, X } from 'lucide-react';

const ROOM_TYPES = ['1BHK', '2BHK', '3BHK', 'Studio', 'PG'];
const CITIES = ['Mumbai', 'Pune', 'Bangalore', 'Thane', 'Delhi', 'Hyderabad'];

export default function PostRoomPage() {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    // Step 1
    city: '',
    locality: '',
    rent: '',
    roomType: '',
    bhk: '',

    // Step 2
    genderPreference: '',
    foodHabit: '',
    occupation: '',
    smoking: 'no',
    guests: 'no',
    pets: 'no',

    // Step 3
    description: '',
    amenities: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData((prev) => {
      const amenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities };
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && images.length < 5) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages((prev) => [...prev, event.target?.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData, images);
    // In a real app, this would call an API
    alert('Room posted successfully! (Demo)');
  };

  const isStep1Valid = formData.city && formData.locality && formData.rent && formData.roomType;
  const isStep2Valid = formData.genderPreference && formData.foodHabit;
  const isStep3Valid = images.length > 0 && formData.description.length >= 20;

  return (
    <div className="py-8 md:py-12 bg-gradient-to-br from-slate-50 to-teal-50 min-h-screen">
      <div className="container-max max-w-2xl">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Post Your Room
          </h1>
          <p className="text-slate-600">List your room for free and find the perfect flatmate</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 flex items-center justify-between">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                  i <= step
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {i}
              </div>
              {i < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-all ${
                    i < step ? 'bg-teal-600' : 'bg-slate-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Steps */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Room Details */}
          {step === 1 && (
            <div className="card p-8 space-y-6 animate-slideUp">
              <h2 className="font-display text-2xl font-bold text-slate-900">Room Details</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">City *</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="">Select city</option>
                    {CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Locality *</label>
                  <input
                    type="text"
                    name="locality"
                    placeholder="e.g., Bandra West"
                    value={formData.locality}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Room Type *</label>
                  <select
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="">Select type</option>
                    {ROOM_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Monthly Rent (₹) *</label>
                  <input
                    type="number"
                    name="rent"
                    placeholder="25000"
                    value={formData.rent}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => isStep1Valid && setStep(2)}
                  disabled={!isStep1Valid}
                  className={`btn flex items-center gap-2 ${
                    isStep1Valid ? 'btn-primary' : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  Next <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Preferences */}
          {step === 2 && (
            <div className="card p-8 space-y-6 animate-slideUp">
              <h2 className="font-display text-2xl font-bold text-slate-900">Flatmate Preferences</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Gender Preference *</label>
                  <select
                    name="genderPreference"
                    value={formData.genderPreference}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="">Select preference</option>
                    <option value="any">Any</option>
                    <option value="male">Male only</option>
                    <option value="female">Female only</option>
                    <option value="couples">Couples friendly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Food Habit *</label>
                  <select
                    name="foodHabit"
                    value={formData.foodHabit}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="">Select preference</option>
                    <option value="veg">Vegetarian only</option>
                    <option value="non-veg">Non-veg friendly</option>
                    <option value="any">Any</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Lifestyle Preferences</label>
                <div className="space-y-2">
                  {[
                    { name: 'smoking', label: 'Smoking allowed' },
                    { name: 'guests', label: 'Overnight guests allowed' },
                    { name: 'pets', label: 'Pets allowed' },
                  ].map((pref) => (
                    <label key={pref.name} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData[pref.name] === 'yes'}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            [pref.name]: e.target.checked ? 'yes' : 'no',
                          }))
                        }
                        className="w-4 h-4 rounded accent-teal-600"
                      />
                      <span className="text-slate-700 text-sm">{pref.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Preferred Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  placeholder="e.g., Software Engineer, Student, Freelancer"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className="input"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-ghost"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => isStep2Valid && setStep(3)}
                  disabled={!isStep2Valid}
                  className={`btn flex items-center gap-2 ${
                    isStep2Valid ? 'btn-primary' : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  Next <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Photos & Description */}
          {step === 3 && (
            <div className="card p-8 space-y-6 animate-slideUp">
              <h2 className="font-display text-2xl font-bold text-slate-900">Photos & Description</h2>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-4">Upload Photos *</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 mb-4">
                    Drag and drop images here or click to browse
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={images.length >= 5}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="btn-primary text-sm cursor-pointer">
                    <Upload size={16} />
                    Choose Image ({images.length}/5)
                  </label>
                </div>

                {/* Image Preview */}
                {images.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Room Description * ({formData.description.length}/500)
                </label>
                <textarea
                  name="description"
                  placeholder="Describe your room, amenities, location highlights, etc."
                  value={formData.description}
                  onChange={handleInputChange}
                  maxLength={500}
                  rows={6}
                  className="input resize-none"
                />
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Amenities</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'WiFi',
                    'AC',
                    'Washing Machine',
                    'Kitchen',
                    'Balcony',
                    'Parking',
                    'TV',
                    'Water Heater',
                  ].map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityChange(amenity)}
                        className="w-4 h-4 rounded accent-teal-600"
                      />
                      <span className="text-sm text-slate-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-ghost"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!isStep3Valid}
                  className={`btn ${
                    isStep3Valid ? 'btn-primary' : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  Post Room
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
