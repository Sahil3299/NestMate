import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import Button from "../Button";

function getAvatarSrc(apiBaseUrl, avatarPath) {
  if (!avatarPath) return "";
  if (typeof avatarPath !== "string") return "";
  if (avatarPath.startsWith("http://") || avatarPath.startsWith("https://")) return avatarPath;
  if (avatarPath.startsWith("/")) return `${apiBaseUrl}${avatarPath}`;
  return `${apiBaseUrl}/${avatarPath}`;
}

function getAvatarInitials(name = "") {
  const trimmed = String(name || "").trim();
  if (!trimmed) return "N";
  return trimmed.charAt(0).toUpperCase();
}

function getAvatarPresetClasses(presetId) {
  // Keep this in sync with AvatarSelector presets.
  const map = {
    "preset-1": "from-blue-400 to-blue-700",
    "preset-2": "from-sky-400 to-blue-600",
    "preset-3": "from-indigo-400 to-blue-600",
    "preset-4": "from-cyan-400 to-blue-600",
  };
  return map[presetId] || "from-blue-400 to-blue-700";
}

export default function ProfileHeader({ profile, onChatUid }) {
  const navigate = useNavigate();

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const avatarPath = profile?.avatarPath || profile?.avatarUrl || profile?.avatar || "";
  const avatarSrc = getAvatarSrc(apiBaseUrl, avatarPath);

  const initials = useMemo(() => getAvatarInitials(profile?.name), [profile?.name]);
  const presetClasses = useMemo(
    () => getAvatarPresetClasses(profile?.avatarPreset || "preset-1"),
    [profile?.avatarPreset]
  );

  const locationText = profile?.city ? `${profile.city}` : "Unknown city";

  const chatUid = onChatUid || profile?.uid;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="flex items-center justify-start">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={`${profile?.name || "User"} avatar`}
              className="w-24 h-24 rounded-full object-cover border border-gray-200 shadow-sm"
            />
          ) : (
            <div
              className={`w-24 h-24 rounded-full bg-gradient-to-br ${presetClasses} flex items-center justify-center text-white font-bold text-3xl shadow-sm`}
            >
              {initials}
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 truncate">{profile?.name}</h1>
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="truncate">{locationText}</span>
              </div>
              {profile?.matchPercent !== undefined ? (
                <div className="mt-3 inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                  <span className="text-sm font-semibold text-blue-700">
                    {profile.matchPercent}% Match
                  </span>
                </div>
              ) : null}
            </div>

            {chatUid ? (
              <Button
                variant="primary"
                size="lg"
                className="shrink-0"
                onClick={() => navigate(`/chat/${chatUid}`)}
              >
                Chat
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

