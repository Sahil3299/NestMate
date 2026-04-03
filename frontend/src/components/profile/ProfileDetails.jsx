import React, { useMemo } from "react";
import { Check } from "lucide-react";
import TagPill from "../TagPill";
import Card from "../Card";

function sleepLabel(sleep) {
  if (sleep === "early") return "Early Riser";
  if (sleep === "late") return "Night Owl";
  return "Regular Schedule";
}

export default function ProfileDetails({ profile }) {
  const habits = profile?.habits || {};

  const budgetMin = profile?.budgetMin;
  const budgetMax = profile?.budgetMax;

  const preferenceTags = useMemo(() => {
    const tags = [];
    tags.push(sleepLabel(habits?.sleep));
    return tags;
  }, [habits?.sleep]);

  const habitTags = useMemo(() => {
    const tags = [];
    if (habits?.smoking !== undefined) tags.push(habits.smoking ? "Smoking" : "Non-smoker");
    if (habits?.drinking !== undefined) tags.push(habits.drinking ? "Drinking" : "Non-drinker");
    if (habits?.pets !== undefined) tags.push(habits.pets ? "Pets" : "No pets");
    return tags.slice(0, 4);
  }, [habits]);

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="text-lg font-semibold text-gray-900">Info</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-sm text-gray-500 font-medium">Budget</div>
            <div className="mt-2 text-base font-bold text-gray-900">
              {budgetMin !== undefined && budgetMax !== undefined
                ? `$${Number(budgetMin).toLocaleString()} - $${Number(budgetMax).toLocaleString()}`
                : "Not set"}
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-sm text-gray-500 font-medium">City</div>
            <div className="mt-2 text-base font-bold text-gray-900">{profile?.city || "Unknown"}</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-sm text-gray-500 font-medium">Preference</div>
            <div className="mt-2 text-base font-bold text-gray-900">
              {sleepLabel(habits?.sleep)}
            </div>
          </div>
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="text-lg font-semibold text-gray-900">Preferences</div>
        <div className="flex flex-wrap gap-3">
          {preferenceTags.map((t) => (
            <TagPill key={t} label={t} />
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="text-lg font-semibold text-gray-900">Habits</div>
        <div className="flex flex-wrap gap-3">
          {habitTags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
            >
              <Check className="w-4 h-4" />
              {t}
            </span>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="text-lg font-semibold text-gray-900">Bio</div>
        <div className="text-base text-gray-700 leading-relaxed">
          {profile?.bio ? profile.bio : <span className="text-gray-500">No bio yet.</span>}
        </div>
      </Card>
    </div>
  );
}

