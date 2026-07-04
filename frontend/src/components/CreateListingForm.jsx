import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X, Wifi, Snowflake, CookingPot, Car, Trees, Dumbbell, Waves, Tv, Refrigerator, ChevronLeft, ChevronRight, Check } from "lucide-react";
import listingValidationSchema from "../lib/listingValidation";
import { listingAPI } from "../lib/api";
import Button from "../Button";
import Card from "../Card";
import Input from "../Input";
import Select from "../Select";

const amenitiesOptions = [
  { value: "wifi", label: "WiFi", icon: Wifi },
  { value: "ac", label: "Air Conditioning", icon: Snowflake },
  { value: "kitchen", label: "Kitchen", icon: CookingPot },
  { value: "parking", label: "Parking", icon: Car },
  { value: "balcony", label: "Balcony", icon: Trees },
  { value: "gym", label: "Gym", icon: Dumbbell },
  { value: "pool", label: "Pool", icon: Waves },
  { value: "tv", label: "TV", icon: Tv },
  { value: "fridge", label: "Fridge", icon: Refrigerator },
];

const roomTypeOptions = [
  { value: "single", label: "Single Room" },
  { value: "shared", label: "Shared Room" },
  { value: "entire", label: "Entire Place" },
];

export default function CreateListingForm({ onSuccess }) {
  const [step, setStep] = useState(1);
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, watch, formState: { errors }, setValue, getValues } = useForm({
    resolver: zodResolver(listingValidationSchema), mode: "onBlur",
    defaultValues: {
      title: "", description: "", rent: "", securityDeposit: "",
      occupancy: 1, roomType: "single", availableFrom: "", address: "",
      city: "", latitude: 0, longitude: 0, amenities: [], images: [],
    },
  });

  const selectedAmenities = watch("amenities") || [];

  const handleAmenityToggle = (amenity) => {
    const current = getValues("amenities") || [];
    setValue("amenities", current.includes(amenity) ? current.filter((a) => a !== amenity) : [...current, amenity]);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewImages((prev) => [...prev, reader.result]);
          const currentImages = getValues("images") || [];
          setValue("images", [...currentImages, reader.result].slice(0, 10));
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    const currentImages = getValues("images") || [];
    setValue("images", currentImages.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError("");
      const payload = { ...data, rent: Number(data.rent), securityDeposit: Number(data.securityDeposit), occupancy: Number(data.occupancy), latitude: Number(data.latitude), longitude: Number(data.longitude) };
      await listingAPI.create(payload);
      setIsSubmitting(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      setIsSubmitting(false);
      setError(err.response?.data?.error || "Failed to create listing");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Post a Room Listing</h1>
        <div className="flex justify-between items-center">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                s <= step ? "bg-[#14B8A6] text-white" : "bg-[#E2E8F0] text-[#64748B]"
              }`}>
                {s < step ? <Check size={18} /> : s}
              </div>
              {s < 3 && <div className={`w-8 h-1 mx-2 rounded-full ${s < step ? "bg-[#14B8A6]" : "bg-[#E2E8F0]"}`} />}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          <Card className="bg-white">
            <h2 className="text-xl font-semibold mb-6 text-[#0F172A]">Basic Information</h2>

            <Input label="Room Title *" placeholder="e.g., Cozy studio in city center" {...register("title")} error={errors.title?.message} className="mb-4" />

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#0F172A] mb-2">Description *</label>
              <textarea placeholder="Describe your room, amenities, and what makes it special..." {...register("description")} rows="5"
                className={`w-full px-4 py-3 rounded-xl border text-sm ${errors.description ? "border-red-500" : "border-[#E2E8F0]"} focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] transition-all`} />
              {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <Input label="Monthly Rent ($) *" type="number" placeholder="1500" {...register("rent", { valueAsNumber: true })} error={errors.rent?.message} />
              <Input label="Security Deposit ($) *" type="number" placeholder="3000" {...register("securityDeposit", { valueAsNumber: true })} error={errors.securityDeposit?.message} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <Select label="Room Type *" {...register("roomType")} error={errors.roomType?.message}>
                {roomTypeOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
              </Select>
              <Input label="Occupancy (max people) *" type="number" placeholder="1" {...register("occupancy", { valueAsNumber: true })} error={errors.occupancy?.message} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <Input label="Available From *" type="date" {...register("availableFrom")} error={errors.availableFrom?.message} />
            </div>

            <div className="flex gap-4 mt-8">
              <Button onClick={() => setStep(2)} className="flex-1 bg-[#14B8A6] hover:bg-[#0F766E] text-white flex items-center justify-center gap-2">
                Next <ChevronRight size={16} />
              </Button>
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card className="bg-white">
            <h2 className="text-xl font-semibold mb-6 text-[#0F172A]">Amenities &amp; Photos</h2>

            <div className="mb-8">
              <label className="block text-sm font-medium text-[#0F172A] mb-3">Select Amenities</label>
              <div className="grid grid-cols-2 gap-3">
                {amenitiesOptions.map((amenity) => {
                  const Icon = amenity.icon;
                  return (
                    <label key={amenity.value} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-slate-50 rounded-xl border border-[#E2E8F0]">
                      <input type="checkbox" checked={selectedAmenities.includes(amenity.value)}
                        onChange={() => handleAmenityToggle(amenity.value)} className="w-4 h-4 rounded accent-[#14B8A6]" />
                      {Icon && <Icon size={14} className="text-[#64748B]" />}
                      <span className="text-sm text-[#64748B]">{amenity.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-[#0F172A] mb-3">Upload Photos ({previewImages.length}/10)</label>
              <div className="border-2 border-dashed border-[#E2E8F0] rounded-xl p-6 text-center cursor-pointer hover:border-[#14B8A6] hover:bg-teal-50 transition">
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload-2" />
                <label htmlFor="image-upload-2" className="cursor-pointer block">
                  <Upload size={24} className="mx-auto mb-2 text-[#94a3b8]" />
                  <p className="text-sm text-[#64748B]">Click to upload or drag images</p>
                  <p className="text-xs text-[#94a3b8] mt-1">PNG, JPG, GIF up to 10 images</p>
                </label>
              </div>

              {previewImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {previewImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img src={img} alt={`Preview ${idx}`} className="w-full h-40 object-cover rounded-xl" />
                      <button type="button" onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="button" onClick={() => setStep(1)} className="flex-1 bg-[#E2E8F0] hover:bg-slate-300 text-[#0F172A] flex items-center justify-center gap-2">
                <ChevronLeft size={16} /> Back
              </Button>
              <Button onClick={() => setStep(3)} className="flex-1 bg-[#14B8A6] hover:bg-[#0F766E] text-white flex items-center justify-center gap-2">
                Next <ChevronRight size={16} />
              </Button>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card className="bg-white">
            <h2 className="text-xl font-semibold mb-6 text-[#0F172A]">Location &amp; Review</h2>

            <div className="mb-4 p-4 bg-teal-50 border border-teal-200 rounded-xl flex items-start gap-2">
              <span className="text-[#14B8A6] flex-shrink-0">i</span>
              <p className="text-sm text-teal-900">Provide accurate location coordinates using Google Maps or your address.</p>
            </div>

            <Input label="Full Address *" placeholder="123 Main St" {...register("address")} error={errors.address?.message} className="mb-4" />
            <Input label="City *" placeholder="New York" {...register("city")} error={errors.city?.message} className="mb-4" />

            <div className="grid grid-cols-2 gap-4 mb-4">
              <Input label="Latitude *" type="number" step="0.000001" placeholder="40.7128" {...register("latitude", { valueAsNumber: true })} error={errors.latitude?.message} />
              <Input label="Longitude *" type="number" step="0.000001" placeholder="-74.0060" {...register("longitude", { valueAsNumber: true })} error={errors.longitude?.message} />
            </div>

            <div className="mb-8 p-4 bg-[#FAFAFA] rounded-xl border border-[#E2E8F0]">
              <h3 className="font-semibold text-[#0F172A] mb-3">Review Your Listing</h3>
              <div className="space-y-2 text-sm text-[#64748B]">
                <p><strong>Title:</strong> {getValues("title")}</p>
                <p><strong>Price:</strong> ${getValues("rent")}/month</p>
                <p><strong>Room Type:</strong> {getValues("roomType")}</p>
                <p><strong>Photos:</strong> {previewImages.length}/10</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="button" onClick={() => setStep(2)} className="flex-1 bg-[#E2E8F0] hover:bg-slate-300 text-[#0F172A] flex items-center justify-center gap-2">
                <ChevronLeft size={16} /> Back
              </Button>
              <Button type="submit" disabled={isSubmitting}
                className={`flex-1 text-white flex items-center justify-center gap-2 ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#14B8A6] hover:bg-[#0F766E]"}`}>
                {isSubmitting ? "Publishing..." : <><Check size={16} /> Publish Listing</>}
              </Button>
            </div>
          </Card>
        )}
      </form>
    </div>
  );
}
