import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MapPin, Users, Zap } from "lucide-react";
import Button from "./Button";

export default function RoomCard({ room, compatibilityScore = null, onFavorite }) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    if (onFavorite) onFavorite(room._id, !isFavorite);
  };

  const handleClick = () => {
    navigate(`/listings/${room._id}`);
  };

  const primaryImage = room.images?.[0] || "https://via.placeholder.com/400x300?text=No+Image";

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={primaryImage}
          alt={room.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
        >
          <Heart size={20} className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"} />
        </button>

        {/* Room Type Badge */}
        <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {room.roomType === "single"
            ? "Single"
            : room.roomType === "shared"
              ? "Shared"
              : "Entire Place"}
        </div>

        {/* Compatibility Score (if available) */}
        {compatibilityScore !== null && (
          <div className="absolute bottom-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <Zap size={16} />
            {compatibilityScore}% Match
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">{room.title}</h3>

        {/* Location */}
        <div className="flex items-start gap-2 mb-3 text-gray-600">
          <MapPin size={16} className="mt-0.5 flex-shrink-0" />
          <span className="text-sm line-clamp-1">{room.location.address}</span>
        </div>

        {/* Rent & Occupancy */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl font-bold text-blue-600">${room.rent}</div>
          <div className="flex items-center gap-1 text-gray-600">
            <Users size={16} />
            <span className="text-sm">{room.occupancy} max</span>
          </div>
        </div>

        {/* Description Preview */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{room.description}</p>

        {/* Amenities Preview */}
        {room.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {room.amenities.slice(0, 3).map((amenity) => (
              <span key={amenity} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                {amenity}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                +{room.amenities.length - 3}
              </span>
            )}
          </div>
        )}

        {/* View Details Button */}
        <Button
          onClick={handleClick}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
        >
          View Details
        </Button>
      </div>
    </div>
  );
}
