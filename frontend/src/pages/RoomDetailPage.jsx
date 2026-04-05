import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Users, Zap, Star, MessageCircle, ArrowLeft } from "lucide-react";
import { listingAPI, reviewAPI } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";
import Card from "../components/Card";
import ReviewCard from "../components/ReviewCard";
import Input from "../components/Input";

export default function RoomDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  // Review form states
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Load room details
  useEffect(() => {
    async function loadRoom() {
      setLoading(true);
      setError("");
      try {
        const res = await listingAPI.getOne(id);
        setListing(res.data.listing);

        // Load reviews
        const reviewRes = await reviewAPI.getForTarget("room", id);
        setReviews(reviewRes.data.reviews);
        setAvgRating(reviewRes.data.avgRating);
        setReviewCount(reviewRes.data.reviewCount);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load room details");
      } finally {
        setLoading(false);
      }
    }

    loadRoom();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);

    try {
      await reviewAPI.create({
        targetType: "room",
        targetId: id,
        rating: reviewRating,
        comment: reviewComment,
      });

      // Reload reviews
      const reviewRes = await reviewAPI.getForTarget("room", id);
      setReviews(reviewRes.data.reviews);
      setAvgRating(reviewRes.data.avgRating);
      setReviewCount(reviewRes.data.reviewCount);

      setReviewRating(5);
      setReviewComment("");
      setShowReviewForm(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await reviewAPI.delete(reviewId);
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));

      // Reload stats
      const reviewRes = await reviewAPI.getForTarget("room", id);
      setAvgRating(reviewRes.data.avgRating);
      setReviewCount(reviewRes.data.reviewCount);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete review");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg text-gray-600">Room not found</p>
          <Button onClick={() => navigate("/listings")} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
            Back to Listings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate("/listings")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Listings</span>
        </button>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Main Image */}
        {listing.images?.[0] && (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-96 object-cover rounded-lg mb-8 shadow-lg"
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Title & Price */}
            <Card className="mb-6 bg-white">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
              <p className="text-gray-600 mb-4">{listing.description}</p>

              <div className="flex items-center justify-between mb-6">
                <div className="text-4xl font-bold text-blue-600">${listing.rent}</div>
                <span className="text-gray-600">/month</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">Security Deposit</p>
                  <p className="text-2xl font-bold text-gray-900">${listing.securityDeposit}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">Room Type</p>
                  <p className="text-2xl font-bold text-gray-900 capitalize">{listing.roomType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">Max Occupancy</p>
                  <p className="text-2xl font-bold text-gray-900">{listing.occupancy} people</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">Available From</p>
                  <p className="text-2xl font-bold text-gray-900">{new Date(listing.availableFrom).toLocaleDateString()}</p>
                </div>
              </div>
            </Card>

            {/* Location */}
            <Card className="mb-6 bg-white">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={24} className="text-blue-600" />
                Location
              </h2>
              <p className="text-gray-600 mb-2">{listing.location.address}</p>
              <p className="text-gray-600">{listing.location.city}</p>
              <p className="text-xs text-gray-500 mt-2">
                Coordinates: {listing.location.coordinates[1]}, {listing.location.coordinates[0]}
              </p>
            </Card>

            {/* Amenities */}
            {listing.amenities?.length > 0 && (
              <Card className="mb-6 bg-white">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap size={24} className="text-blue-600" />
                  Amenities
                </h2>
                <div className="flex flex-wrap gap-2">
                  {listing.amenities.map((amenity) => (
                    <span key={amenity} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      {amenity}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Images Gallery */}
            {listing.images?.length > 1 && (
              <Card className="mb-6 bg-white">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Gallery</h2>
                <div className="grid grid-cols-3 gap-2">
                  {listing.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Gallery ${idx}`}
                      className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                    />
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div>
            {/* Contact Card */}
            <Card className="mb-6 bg-white sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Landlord</h3>
              <p className="text-sm text-gray-600 mb-4">
                Posted by {listing.posterProfile?.name || "Landlord"}
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2">
                <MessageCircle size={18} />
                Message Landlord
              </Button>
            </Card>

            {/* Rating Card */}
            <Card className="bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviews</h3>
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={
                          i < Math.round(avgRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{avgRating.toFixed(1)}</span>
                </div>
                <p className="text-sm text-gray-600">{reviewCount} reviews</p>
              </div>

              {user && (
                <Button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 mb-4"
                >
                  {showReviewForm ? "Cancel" : "Write Review"}
                </Button>
              )}

              {showReviewForm && user && (
                <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setReviewRating(val)}
                          className="p-1 hover:scale-110 transition"
                        >
                          <Star
                            size={24}
                            className={
                              val <= reviewRating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience..."
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submittingReview}
                    className={`w-full ${
                      submittingReview
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white`}
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <Card className="mt-8 bg-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Reviews</h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  canDelete={user?.uid === review.reviewerId}
                  onDelete={handleDeleteReview}
                />
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
