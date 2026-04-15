// frontend/src/components/ui/Skeleton.jsx
import { cn } from "@/utils/cn";

export const Skeleton = ({ className }) => (
  <div className={cn("animate-pulse rounded-lg bg-gray-200", className)} />
);

export const ListingCardSkeleton = () => (
  <div className="card overflow-hidden">
    <Skeleton className="h-48 rounded-none" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>
    </div>
  </div>
);

export const ListingDetailSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
    <Skeleton className="h-80 w-full rounded-2xl" />
    <div className="grid grid-cols-3 gap-4">
      {[1,2,3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <Skeleton className="h-4 w-4/6" />
  </div>
);

export const ProfileSkeleton = () => (
  <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
    <div className="card p-6 space-y-4">
      <Skeleton className="h-28 w-full rounded-xl" />
      <div className="flex gap-4">
        <Skeleton className="h-20 w-20 rounded-2xl" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>
  </div>
);

export const InboxSkeleton = () => (
  <div className="space-y-2">
    {[1,2,3,4].map((i) => (
      <div key={i} className="flex items-center gap-3 p-4 card">
        <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-3 w-12" />
      </div>
    ))}
  </div>
);
