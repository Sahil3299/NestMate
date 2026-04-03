import React from "react";

export default function ListingCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="h-44 bg-gray-100 animate-pulse" />
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gray-100 animate-pulse" />
            <div className="space-y-2 min-w-0">
              <div className="h-5 w-36 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-44 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
          <div className="h-6 w-56 bg-gray-100 rounded animate-pulse" />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="h-7 w-28 rounded-full bg-gray-100 animate-pulse" />
          <div className="h-7 w-28 rounded-full bg-gray-100 animate-pulse" />
          <div className="h-7 w-28 rounded-full bg-gray-100 animate-pulse" />
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
          <div className="h-9 w-28 rounded-lg bg-gray-100 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

