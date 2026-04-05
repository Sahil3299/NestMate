import React from "react";
import { Star, Trash2 } from "lucide-react";

export default function ReviewCard({ review, canDelete = false, onDelete }) {
  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  const handleDelete = () => {
    if (onDelete && window.confirm("Delete this review?")) {
      onDelete(review._id);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <p className="font-semibold text-gray-900">{review.reviewerId?.email || "Anonymous"}</p>
          {renderStars(review.rating)}
        </div>
        {canDelete && (
          <button
            onClick={handleDelete}
            className="text-red-600 hover:bg-red-50 p-2 rounded transition"
            title="Delete review"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {review.comment && (
        <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
      )}

      <p className="text-xs text-gray-500 mt-3">
        {new Date(review.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
