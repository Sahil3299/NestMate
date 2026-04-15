// frontend/src/components/listings/Pagination.jsx
import { cn } from "@/utils/cn";
import { useListingFilters } from "@/hooks/useListings";

export default function Pagination({ totalPages, currentPage }) {
  const { setPage } = useListingFilters();

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter((p) =>
    p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button
        onClick={() => setPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn-ghost px-3 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ← Prev
      </button>

      {visiblePages.map((page, idx) => {
        const prev = visiblePages[idx - 1];
        const showEllipsis = prev && page - prev > 1;
        return (
          <span key={page} className="flex items-center gap-1.5">
            {showEllipsis && <span className="text-gray-400 px-1">…</span>}
            <button
              onClick={() => setPage(page)}
              className={cn(
                "w-9 h-9 rounded-lg text-sm font-medium transition-all",
                page === currentPage
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {page}
            </button>
          </span>
        );
      })}

      <button
        onClick={() => setPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn-ghost px-3 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next →
      </button>
    </div>
  );
}
