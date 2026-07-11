import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Upload, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { listingApi } from '../services/api';

const ROOM_TYPES = ['1BHK', '2BHK', '3BHK', 'Studio', 'PG'];
const CITIES = ['Mumbai', 'Pune', 'Bangalore', 'Thane', 'Delhi', 'Hyderabad'];

export default function PostRoomPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    city: '', locality: '', rent: '', roomType: '', bhk: '',
    genderPreference: '', foodHabit: '', occupation: '',
    smoking: 'no', guests: 'no', pets: 'no',
    description: '', amenities: [],
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
      const preview = URL.createObjectURL(file);
      setImages((prev) => [...prev, { file, preview }]);
    }
  };

  const removeImage = (index) => {
    const removed = images[index];
    if (removed?.preview) URL.revokeObjectURL(removed.preview);
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', `${formData.roomType} in ${formData.city}`);
      fd.append('description', formData.description);
      fd.append('rent', formData.rent);
      fd.append('city', formData.city);
      if (formData.locality) fd.append('locality', formData.locality);
      fd.append('roomType', formData.roomType);
      if (formData.genderPreference) fd.append('genderPreference', formData.genderPreference);
      formData.amenities.forEach((a) => fd.append('amenities', a));
      images.forEach((img) => fd.append('images', img.file));

      await listingApi.create(fd);
      toast.success('Room posted successfully!');
      navigate('/browse');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to post room. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const isStep1Valid = formData.city && formData.locality && formData.rent && formData.roomType;
  const isStep2Valid = formData.genderPreference && formData.foodHabit;
  const isStep3Valid = formData.description.length >= 20;

  return (
    <div className="py-8 md:py-12 bg-gradient-to-br from-[#FAFAFA] to-teal-50/40 min-h-screen">
      <div className="container-max max-w-2xl">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#0F172A] mb-2">
            Post Your Room
          </h1>
          <p className="text-[#64748B]">List your room for free and find the perfect flatmate</p>
        </div>

        {/* Progress */}
        <div className="mb-8 flex items-center justify-between">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center flex-1">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-sm transition-all ${
                i <= step ? 'bg-[#14B8A6] text-white shadow-sm' : 'bg-[#E2E8F0] text-[#64748B]'
              }`}>
                {i < step ? <Check size={18} /> : i}
              </div>
              {i < 3 && (
                <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${i < step ? 'bg-[#14B8A6]' : 'bg-[#E2E8F0]'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1 */}
          {step === 1 && (
            <div className="card p-8 space-y-6">
              <h2 className="font-display text-2xl font-bold text-[#0F172A]">Room Details</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-2">City *</label>
                  <select name="city" value={formData.city} onChange={handleInputChange} className="input">
                    <option value="">Select city</option>
                    {CITIES.map((city) => (<option key={city} value={city}>{city}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-2">Locality *</label>
                  <input type="text" name="locality" placeholder="e.g., Bandra West" value={formData.locality} onChange={handleInputChange} className="input" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-2">Room Type *</label>
                  <select name="roomType" value={formData.roomType} onChange={handleInputChange} className="input">
                    <option value="">Select type</option>
                    {ROOM_TYPES.map((type) => (<option key={type} value={type}>{type}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-2">Monthly Rent (\u20B9) *</label>
                  <input type="number" name="rent" placeholder="25000" value={formData.rent} onChange={handleInputChange} className="input" />
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={() => isStep1Valid && setStep(2)} disabled={!isStep1Valid}
                  className={`btn flex items-center gap-2 ${isStep1Valid ? 'btn-primary' : 'opacity-50 cursor-not-allowed'}`}>
                  Next <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="card p-8 space-y-6">
              <h2 className="font-display text-2xl font-bold text-[#0F172A]">Flatmate Preferences</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-2">Gender Preference *</label>
                  <select name="genderPreference" value={formData.genderPreference} onChange={handleInputChange} className="input">
                    <option value="">Select preference</option>
                    <option value="Male">Any</option>
                    <option value="Male">Male only</option>
                    <option value="Female">Female only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-2">Food Habit *</label>
                  <select name="foodHabit" value={formData.foodHabit} onChange={handleInputChange} className="input">
                    <option value="">Select preference</option>
                    <option value="veg">Vegetarian only</option>
                    <option value="non-veg">Non-veg friendly</option>
                    <option value="any">Any</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-3">Lifestyle Preferences</label>
                <div className="space-y-2">
                  {[
                    { name: 'smoking', label: 'Smoking allowed' },
                    { name: 'guests', label: 'Overnight guests allowed' },
                    { name: 'pets', label: 'Pets allowed' },
                  ].map((pref) => (
                    <label key={pref.name} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={formData[pref.name] === 'yes'}
                        onChange={(e) => setFormData((prev) => ({ ...prev, [pref.name]: e.target.checked ? 'yes' : 'no' }))}
                        className="w-4 h-4 rounded accent-[#14B8A6]" />
                      <span className="text-[#64748B] text-sm">{pref.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">Preferred Occupation</label>
                <input type="text" name="occupation" placeholder="e.g., Software Engineer, Student" value={formData.occupation} onChange={handleInputChange} className="input" />
              </div>

              <div className="flex justify-between">
                <button type="button" onClick={() => setStep(1)} className="btn-ghost flex items-center gap-2">
                  <ChevronLeft size={16} /> Back
                </button>
                <button type="button" onClick={() => isStep2Valid && setStep(3)} disabled={!isStep2Valid}
                  className={`btn flex items-center gap-2 ${isStep2Valid ? 'btn-primary' : 'opacity-50 cursor-not-allowed'}`}>
                  Next <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="card p-8 space-y-6">
              <h2 className="font-display text-2xl font-bold text-[#0F172A]">Photos &amp; Description</h2>

              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-4">Upload Photos</label>
                <div className="border-2 border-dashed border-[#E2E8F0] rounded-xl p-8 text-center hover:bg-slate-50 transition-colors">
                  <Upload className="w-8 h-8 text-[#94a3b8] mx-auto mb-2" />
                  <p className="text-sm text-[#64748B] mb-4">Upload images of your room</p>
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={images.length >= 5} className="hidden" id="image-upload" />
                  <label htmlFor="image-upload" className="btn-primary text-sm cursor-pointer inline-flex">
                    <Upload size={16} />
                    Choose Image ({images.length}/5)
                  </label>
                </div>

                {images.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img src={img.preview} alt="Preview" className="w-full h-32 object-cover rounded-xl" />
                        <button type="button" onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                  Room Description * ({formData.description.length}/500)
                </label>
                <textarea name="description" placeholder="Describe your room, amenities, location highlights, etc."
                  value={formData.description} onChange={handleInputChange} maxLength={500} rows={6} className="input resize-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-3">Amenities</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['WiFi', 'AC', 'Washing Machine', 'Kitchen', 'Balcony', 'Parking', 'TV', 'Water Heater'].map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityChange(amenity)} className="w-4 h-4 rounded accent-[#14B8A6]" />
                      <span className="text-sm text-[#64748B]">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-[#E2E8F0]">
                <button type="button" onClick={() => setStep(2)} className="btn-ghost flex items-center gap-2">
                  <ChevronLeft size={16} /> Back
                </button>
                <button type="submit" disabled={!isStep3Valid || submitting}
                  className={`btn ${isStep3Valid && !submitting ? 'btn-primary' : 'opacity-50 cursor-not-allowed'}`}>
                  {submitting ? 'Posting...' : 'Post Room'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
