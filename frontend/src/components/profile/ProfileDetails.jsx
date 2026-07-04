import React, { useMemo } from "react";
import { Check, Moon, Sun, Clock } from "lucide-react";
import TagPill from "../TagPill";
import Card from "../Card";

function sleepLabel(sleep) {
  if (sleep === "early") return "Early Riser";
  if (sleep === "late") return "Night Owl";
  return "Regular Schedule";
}

function sleepIcon(sleep) {
  if (sleep === "early") return Sun;
  if (sleep === "late") return Moon;
  return Clock;
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

  const SleepIcon = sleepIcon(habits?.sleep);

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="text-lg font-semibold text-[#0F172A]">Info</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
            <div className="text-sm text-[#64748B] font-medium">Budget</div>
            <div className="mt-2 text-base font-bold text-[#0F172A]">
              {budgetMin !== undefined && budgetMax !== undefined
                ? `$${Number(budgetMin).toLocaleString()} - $${Number(budgetMax).toLocaleString()}`
                : "Not set"}
            </div>
          </div>
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
            <div className="text-sm text-[#64748B] font-medium">City</div>
            <div className="mt-2 text-base font-bold text-[#0F172A]">{profile?.city || "Unknown"}</div>
          </div>
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
            <div className="text-sm text-[#64748B] font-medium">Preference</div>
            <div className="mt-2 text-base font-bold text-[#0F172A] flex items-center gap-2">
              <SleepIcon size={16} className="text-[#14B8A6]" />
              {sleepLabel(habits?.sleep)}
            </div>
          </div>
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="text-lg font-semibold text-[#0F172A]">Preferences</div>
        <div className="flex flex-wrap gap-3">
          {preferenceTags.map((t) => (<TagPill key={t} label={t} />))}
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="text-lg font-semibold text-[#0F172A]">Habits</div>
        <div className="flex flex-wrap gap-3">
          {habitTags.map((t) => (
            <span key={t} className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700">
              <Check className="w-4 h-4" />
              {t}
            </span>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="text-lg font-semibold text-[#0F172A]">Bio</div>
        <div className="text-base text-[#64748B] leading-relaxed">
          {profile?.bio ? profile.bio : <span className="text-[#94a3b8]">No bio yet.</span>}
        </div>
      </Card>
    </div>
  );
}
