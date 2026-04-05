import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import listingValidationSchema from "../../lib/listingValidation";
import { listingAPI } from "../../lib/api";
import Button from "../Button";
import Card from "../Card";
import Input from "../Input";
import Select from "../Select";

const amenitiesOptions = [
  { value: "wifi", label: "🌐 WiFi" },
  { value: "ac", label: "❄️ Air Conditioning" },
  { value: "heating", label: "🔥 Heating" },
  { value: "kitchen", label: "🍳 Kitchen" },
  { value: "parking", label: "🚗 Parking" },
  { value: "laundry", label: "🧺 Laundry" },
  { value: "balcony", label: "🌳 Balcony" },
  { value: "gym", label: "💪 Gym" },
  { value: "pool", label: "🏊 Pool" },
  { value: "garden", label: "🌿 Garden" },
  { value: "tv", label: "📺 TV" },
  { value: "fridge", label: "🧊 Fridge" },
  { value: "washer", label: "🧼 Washing Machine" },
  { value: "dryer", label: "🌬️ Dryer" },
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

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    resolver: zodResolver(listingValidationSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      description: "",
      rent: "",
      securityDeposit: "",
      occupancy: 1,
      roomType: "single",
      availableFrom: "",
      address: "",
      city: "",
      latitude: 0,
      longitude: 0,
      amenities: [],
      images: [],
    },
  });

  const selectedAmenities = watch("amenities") || [];
  const images = watch("images") || [];

  const handleAmenityToggle = (amenity) => {
    const current = getValues("amenities") || [];
    if (current.includes(amenity)) {
      setValue(
        "amenities",
        current.filter((a) => a !== amenity)
      );
    } else {
      setValue("amenities", [...current, amenity]);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = [];
    const newImages = [];

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          newPreviews.push(reader.result);
          newImages.push(reader.result);
          if (newPreviews.length === files.length) {
            setPreviewImages((prev) => [...prev, ...newPreviews]);
            const currentImages = getValues("images") || [];
            setValue("images", [...currentImages, ...newImages].slice(0, 10));
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    const currentImages = getValues("images") || [];
    setValue(
      "images",
      currentImages.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError("");

      const payload = {
        ...data,
        rent: Number(data.rent),
        securityDeposit: Number(data.securityDeposit),
        occupancy: Number(data.occupancy),
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
      };

      await listingAPI.create(payload);
      setIsSubmitting(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setIsSubmitting(false);
      setError(err.response?.data?.error || "Failed to create listing");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a Room Listing</h1>
        <div className="flex justify-between items-center">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  s <= step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {s}
              </div>
              {s < 3 && <div className="w-8 h-1 bg-gray-300 mx-2"></div>}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <Card className="bg-white">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Basic Information</h2>

            <Input
              label="Room Title *"
              placeholder="e.g., Cozy studio in city center"
              {...register("title")}
              error={errors.title?.message}
              className="mb-4"
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                placeholder="Describe your room, amenities, and what makes it special..."
                {...register("description")}
                rows="5"
                className={`w-full px-3 py-2 border rounded-lg font-sans ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <Input
                label="Monthly Rent ($) *"
                type="number"
                placeholder="1500"
                {...register("rent", { valueAsNumber: true })}
                error={errors.rent?.message}
              />
              <Input
                label="Security Deposit ($) *"
                type="number"
                placeholder="3000"
                {...register("securityDeposit", { valueAsNumber: true })}
                error={errors.securityDeposit?.message}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <Select
                label="Room Type *"
                {...register("roomType")}
                error={errors.roomType?.message}
              >
                {roomTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>

              <Input
                label="Occupancy (max people) *"
                type="number"
                placeholder="1"
                {...register("occupancy", { valueAsNumber: true })}
                error={errors.occupancy?.message}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Available From *"
                type="date"
                {...register("availableFrom")}
                error={errors.availableFrom?.message}
              />
            </div>

            <div className="flex gap-4 mt-8">
              <Button
                onClick={() => setStep(2)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next →
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Amenities & Photos */}
        {step === 2 && (
          <Card className="bg-white">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Amenities & Photos</h2>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Amenities
              </label>
              <div className="grid grid-cols-2 gap-3">
                {amenitiesOptions.map((amenity) => (
                  <label key={amenity.value} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity.value)}
                      onChange={() => handleAmenityToggle(amenity.value)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{amenity.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Upload Photos ({previewImages.length}/10)
              </label>
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer block">
                  <div className="text-3xl mb-2">📸</div>
                  <p className="text-sm text-gray-700">Click to upload or drag images</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10 images</p>
                </label>
              </div>

              {previewImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {previewImages.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img src={img} alt={`Preview ${idx}`} className="w-full h-40 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900"
              >
                ← Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next →
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Location & Review */}
        {step === 3 && (
          <Card className="bg-white">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Location & Review</h2>

            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                📍 Provide accurate location coordinates using Google Maps or your address
              </p>
            </div>

            <Input
              label="Full Address *"
              placeholder="123 Main St"
              {...register("address")}
              error={errors.address?.message}
              className="mb-4"
            />

            <Input
              label="City *"
              placeholder="New York"
              {...register("city")}
              error={errors.city?.message}
              className="mb-4"
            />

            <div className="grid grid-cols-2 gap-4 mb-4">
              <Input
                label="Latitude *"
                type="number"
                step="0.000001"
                placeholder="40.7128"
                {...register("latitude", { valueAsNumber: true })}
                error={errors.latitude?.message}
              />
              <Input
                label="Longitude *"
                type="number"
                step="0.000001"
                placeholder="-74.0060"
                {...register("longitude", { valueAsNumber: true })}
                error={errors.longitude?.message}
              />
            </div>

            {/* Review Summary */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Review Your Listing</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <strong>Title:</strong> {getValues("title")}
                </p>
                <p>
                  <strong>Price:</strong> ${getValues("rent")}/month
                </p>
                <p>
                  <strong>Room Type:</strong> {getValues("roomType")}
                </p>
                <p>
                  <strong>Photos:</strong> {previewImages.length}/10
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900"
              >
                ← Back
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 text-white ${
                  isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isSubmitting ? "Publishing..." : "✓ Publish Listing"}
              </Button>
            </div>
          </Card>
        )}
      </form>
    </div>
  );
}
