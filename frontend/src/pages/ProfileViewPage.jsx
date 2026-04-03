import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileDetails from "../components/profile/ProfileDetails";
import Card from "../components/Card";

export default function ProfileViewPage() {
  const { uid } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let active = true;
    async function loadProfile() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/api/profile/${uid}`);
        if (!active) return;
        setProfile(res.data.profile || null);
      } catch (err) {
        if (!active) return;
        setError(err?.response?.data?.error || err?.message || "Failed to load profile");
        setProfile(null);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadProfile();
    return () => {
      active = false;
    };
  }, [uid]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="flex items-center justify-center min-h-[320px]">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-primary-600 animate-spin mx-auto mb-4" />
              <p className="text-sm text-gray-600">Loading profile...</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Card className="space-y-3">
            <div className="text-lg font-semibold text-gray-900">Profile unavailable</div>
            <div className="text-sm text-gray-600">{error || "Unable to load profile."}</div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <ProfileHeader profile={profile} />
          <ProfileDetails profile={profile} />
        </div>
      </div>
    </div>
  );
}

