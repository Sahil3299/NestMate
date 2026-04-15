// frontend/src/hooks/useListings.js
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { listingApi, userApi } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/Toast";

export const LISTING_KEYS = {
  all:       ["listings"],
  list:      (params) => ["listings", "list", params],
  detail:    (id)     => ["listings", "detail", id],
  mine:      ()       => ["listings", "mine"],
};

// ── URL-synced listing filters ─────────────────────────────────────────────
export const useListingFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    city:        searchParams.get("city")        || "",
    minRent:     searchParams.get("minRent")     || "",
    maxRent:     searchParams.get("maxRent")     || "",
    listingType: searchParams.get("listingType") || "",
    roomType:    searchParams.get("roomType")    || "",
    gender:      searchParams.get("gender")      || "",
    sort:        searchParams.get("sort")        || "newest",
    search:      searchParams.get("search")      || "",
    page:        Number(searchParams.get("page") || 1),
  };

  const setFilter = (key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else       next.delete(key);
      next.set("page", "1"); // reset page on filter change
      return next;
    });
  };

  const setPage = (page) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(page));
      return next;
    });
  };

  const resetFilters = () => setSearchParams({});

  return { filters, setFilter, setPage, resetFilters };
};

// ── Fetch listings ─────────────────────────────────────────────────────────
export const useListings = (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== "" && v !== undefined && v !== null)
  );
  return useQuery({
    queryKey: LISTING_KEYS.list(cleanParams),
    queryFn:  () => listingApi.getAll(cleanParams).then((r) => r.data),
    keepPreviousData: true,
  });
};

// ── Fetch single listing ───────────────────────────────────────────────────
export const useListing = (id) =>
  useQuery({
    queryKey: LISTING_KEYS.detail(id),
    queryFn:  () => listingApi.getOne(id).then((r) => r.data.data),
    enabled:  !!id,
  });

// ── My listings ────────────────────────────────────────────────────────────
export const useMyListings = () =>
  useQuery({
    queryKey: LISTING_KEYS.mine(),
    queryFn:  () => listingApi.getMine().then((r) => r.data.data),
  });

// ── Create listing ─────────────────────────────────────────────────────────
export const useCreateListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: listingApi.create,
    onSuccess:  () => {
      queryClient.invalidateQueries({ queryKey: LISTING_KEYS.all });
      toast.success("Listing created successfully!");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to create listing."),
  });
};

// ── Delete listing ─────────────────────────────────────────────────────────
export const useDeleteListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: listingApi.remove,
    onSuccess:  () => {
      queryClient.invalidateQueries({ queryKey: LISTING_KEYS.all });
      toast.success("Listing deleted.");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to delete listing."),
  });
};

// ── Toggle save (optimistic update) ───────────────────────────────────────
export const useToggleSave = () => {
  const queryClient  = useQueryClient();
  const { user, updateUser } = useAuth();

  return useMutation({
    mutationFn: ({ listingId }) => userApi.toggleSave(listingId),

    onMutate: async ({ listingId }) => {
      await queryClient.cancelQueries({ queryKey: ["user", "saved"] });
      const previousSaved = user?.savedListings || [];
      const isSaved = previousSaved.map(String).includes(String(listingId));

      // Optimistic update
      const nextSaved = isSaved
        ? previousSaved.filter((id) => String(id) !== String(listingId))
        : [...previousSaved, listingId];
      updateUser({ savedListings: nextSaved });

      return { previousSaved };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previousSaved) updateUser({ savedListings: ctx.previousSaved });
      toast.error("Failed to update saved listings.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "saved"] });
    },
  });
};
