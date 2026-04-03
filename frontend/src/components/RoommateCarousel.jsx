import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function RoommateCarousel({ images = [] }) {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!safeImages.length) return null;

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % safeImages.length);
  const prevImage = () =>
    setCurrentIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);

  return (
    <div className="relative w-full bg-gray-100 rounded-xl overflow-hidden">
      <img
        src={safeImages[currentIndex]}
        alt={`Photo ${currentIndex + 1}`}
        className="w-full h-80 md:h-[420px] object-cover"
        loading="lazy"
      />

      {safeImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-sm transition-opacity"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-5 h-5 text-gray-900" />
          </button>
          <button
            type="button"
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-sm transition-opacity"
            aria-label="Next photo"
          >
            <ChevronRight className="w-5 h-5 text-gray-900" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {safeImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex ? "bg-blue-600 w-6" : "bg-blue-600/40"
                }`}
                aria-label={`Go to photo ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}

      <div className="absolute top-4 right-4 bg-black/30 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
        {currentIndex + 1} / {safeImages.length}
      </div>
    </div>
  );
}

