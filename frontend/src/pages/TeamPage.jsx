// frontend/src/pages/TeamPage.jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { matchApi } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Avatar, MatchBadge, VerifiedBadge, Tag, Spinner, Badge } from "@/components/ui";
import { ListingCardSkeleton } from "@/components/ui/Skeleton";
import { QueryError, EmptyState } from "@/components/ui/ErrorBoundary";
import { toast } from "@/components/ui/Toast";
import { Link } from "react-router-dom";

function SeekerCard({ seeker, onInvite, isPending }) {
  return (
    <div className="card p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start gap-4 mb-4">
        <Avatar src={seeker.avatar} name={seeker.name} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-gray-900">{seeker.name}</h3>
            {seeker.isVerified && <VerifiedBadge />}
            {seeker.matchScore !== undefined && <MatchBadge score={seeker.matchScore} />}
          </div>
          <p className="text-sm text-gray-500">{seeker.occupation || "No occupation listed"}</p>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
            <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {seeker.preferredCity || "Location not set"}
          </div>
        </div>
      </div>

      {seeker.bio && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{seeker.bio}</p>
      )}

      <div className="flex flex-wrap gap-1.5 mb-4">
        {seeker.budget && (
          <Badge variant="blue">
            ₹{seeker.budget.min?.toLocaleString("en-IN")} – ₹{seeker.budget.max?.toLocaleString("en-IN")}/mo
          </Badge>
        )}
        {seeker.gender && <Badge>{seeker.gender}</Badge>}
        {Object.entries(seeker.lifestyle || {}).filter(([, v]) => v).slice(0, 3).map(([k]) => (
          <Tag key={k} label={k.replace(/([A-Z])/g, " $1").trim()} />
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onInvite(seeker._id)}
          disabled={isPending}
          className="btn-primary flex-1 justify-center py-2"
        >
          {isPending ? <Spinner className="w-4 h-4 text-white" /> : "🤝 Team Up"}
        </button>
        <Link to={`/users/${seeker._id}`} className="btn-secondary px-4 py-2">View</Link>
      </div>
    </div>
  );
}

export default function TeamPage() {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["seekers"],
    queryFn:  () => matchApi.getSeekers().then((r) => r.data),
    enabled:  isAuthenticated,
  });

  const inviteMutation = useMutation({
    mutationFn: matchApi.inviteToTeam,
    onSuccess:  (res) => {
      toast.success(res.data.message);
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to send invite."),
  });

  const leaveMutation = useMutation({
    mutationFn: matchApi.leaveTeam,
    onSuccess:  () => {
      toast.success("You have left the team.");
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });

  const seekers   = data?.data      || [];
  const totalCount = data?.meta?.total || 0;

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <span className="text-3xl">🤝</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Team Creator</h1>
        <p className="text-gray-500 mb-6">Match with another room seeker, form a team, and hunt for a full apartment together. Split the rent. Share the journey.</p>
        <Link to="/register" className="btn-primary">Get Started Free</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100">
            ✦ Unique Feature
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🤝 Team Creator</h1>
        <p className="text-gray-500">
          Two strangers become flatmates. Match based on lifestyle, budget & location — then hunt for a flat together.
        </p>
      </div>

      {/* Active team banner */}
      {user?.teamPartner && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8 flex items-center justify-between">
          <div>
            <p className="font-semibold text-blue-900 mb-0.5">🎉 You're in a team!</p>
            <p className="text-sm text-blue-700">You and your partner can now search for full apartments together.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/listings?listingType=room" className="btn-primary text-sm px-4 py-2">Browse Together</Link>
            <button
              onClick={() => leaveMutation.mutate()}
              disabled={leaveMutation.isPending}
              className="text-sm text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl font-medium transition-colors"
            >
              Leave Team
            </button>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { step: "1", icon: "🔍", title: "Browse Seekers", desc: "We show compatible seekers ranked by your lifestyle match score." },
          { step: "2", icon: "🤝", title: "Team Up",        desc: "Send a team invite. Once accepted, you're officially a duo." },
          { step: "3", icon: "🏠", title: "Hunt Together",  desc: "Search for a full apartment you can both afford and love." },
        ].map(({ step, icon, title, desc }) => (
          <div key={step} className="card p-5 text-center">
            <div className="text-3xl mb-2">{icon}</div>
            <div className="w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center mx-auto mb-2">{step}</div>
            <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Seekers */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">Compatible Seekers</h2>
        {totalCount > 0 && <span className="text-sm text-gray-500">{totalCount} seekers found</span>}
      </div>

      {isError ? (
        <QueryError message="Could not load seekers." onRetry={refetch} />
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(6).fill(0).map((_, i) => <ListingCardSkeleton key={i} />)}
        </div>
      ) : seekers.length === 0 ? (
        <EmptyState
          title="No compatible seekers yet"
          description="Complete your profile with lifestyle preferences and budget to get better matches."
          action={<Link to="/profile" className="btn-primary">Complete Profile</Link>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {seekers.map((s) => (
            <SeekerCard
              key={s._id}
              seeker={s}
              onInvite={(id) => inviteMutation.mutate(id)}
              isPending={inviteMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
