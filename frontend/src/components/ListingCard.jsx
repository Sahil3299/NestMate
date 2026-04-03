import React, { useMemo } from "react";
import { MapPin, ArrowRight } from "lucide-react";
import TagPill from "./TagPill";
import Button from "./Button";

function getAvatarTone(name = "N") {
  const tones = [
    "from-blue-400 to-cyan-500",
    "from-indigo-400 to-blue-500",
    "from-sky-400 to-blue-500",
    "from-blue-500 to-emerald-400",
  ];
  return tones[name.charCodeAt(0) % tones.length];
}

function getCardImageSeed(seed) {
  return encodeURIComponent(String(seed || "nestmate"));
}

function getCarouselImages(seed) {
  const s = getCardImageSeed(seed);
  return [
    `https://picsum.photos/seed/${s}-0/1200/800`,
    `https://picsum.photos/seed/${s}-1/1200/800`,
    `https://picsum.photos/seed/${s}-2/1200/800`,
  ];
}

export default function ListingCard({ match, onOpen }) {
  const images = useMemo(() => getCarouselImages(match?.uid || match?.name), [match]);

  const tags = useMemo(() => {
    const t = [];
    const habits = match?.habits || {};

    // Sleep -> preference tags
    if (habits.sleep === "late") t.push("Night Owl");
    if (habits.sleep === "early") t.push("Early Bird");
    if (habits.sleep === "medium") t.push("Regular Schedule");

    // Lifestyle tags
    t.push(habits.smoking ? "Smoker" : "Non-smoker");
    t.push(habits.drinking ? "Drinker" : "Non-drinker");
    t.push(habits.pets ? "Pet Friendly" : "No Pets");

    // Keep layout tidy
    return t.slice(0, 4);
  }, [match]);

  if (!match) return null;

  return (
    <div
      className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={onOpen}
      role="button"
      tabIndex={0}
      aria-label={`Open profile for ${match.name || "roommate"}`}
    >
      <div className="relative">
        <img
          src={images[0]}
          alt={`${match.name || "Roommate"} photo`}
          className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />

        <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
          {match.matchPercent || 0}% Match
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${getAvatarTone(match.name)} flex items-center justify-center text-white font-bold`}
              >
                {(match.name?.charAt(0) || "N").toUpperCase()}
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-gray-900 truncate">{match.name}</h3>
                <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="truncate">{match.city}</span>
                  <span className="text-gray-300">•</span>
                  <span className="whitespace-nowrap">
                    {match.age} • {match.gender}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm text-gray-500 font-medium">Rent</div>
            <div className="text-lg font-bold text-blue-700 truncate">
              ₹{match.budgetMin?.toLocaleString?.() ?? match.budgetMin} - ₹
              {match.budgetMax?.toLocaleString?.() ?? match.budgetMax}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <TagPill key={tag} label={tag} />
          ))}
        </div>

        <div className="pt-1 flex items-center justify-between gap-3">
          <div className="text-sm text-gray-500">View details</div>
          <Button
            variant="secondary"
            size="sm"
            className="px-3 py-2"
            onClick={(e) => {
              e.stopPropagation();
              onOpen?.();
            }}
          >
            <span className="text-sm font-semibold">Open</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

