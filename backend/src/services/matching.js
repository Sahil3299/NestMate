function normalizeCity(city) {
  return (city || "").trim().toLowerCase();
}

function budgetOverlap(a, b) {
  // Overlap rule you specified:
  // aMin <= bMax && bMin <= aMax
  return a.budgetMin <= b.budgetMax && b.budgetMin <= a.budgetMax;
}

function computeHabitsSimilarity(me, other) {
  const meHabits = me.habits || {};
  const otherHabits = other.habits || {};

  // Exact tag matches for simple, explainable scoring.
  const smoking = meHabits.smoking === otherHabits.smoking ? 1 : 0;
  const drinking = meHabits.drinking === otherHabits.drinking ? 1 : 0;
  const pets = meHabits.pets === otherHabits.pets ? 1 : 0;
  const sleep = meHabits.sleep === otherHabits.sleep ? 1 : 0;

  return smoking + drinking + pets + sleep; // 0..4
}

function computeScore(me, other) {
  const budgetMatch = budgetOverlap(me, other) ? 1 : 0;
  const locationMatch = normalizeCity(me.city) && normalizeCity(me.city) === normalizeCity(other.city) ? 1 : 0;
  const habitsSimilarity = computeHabitsSimilarity(me, other);

  // Budget (0..1) + Location (0..1) + Habits (0..4)
  const score = budgetMatch + locationMatch + habitsSimilarity; // 0..6
  const maxScore = 6;
  const matchPercent = Math.round((score / maxScore) * 100);

  return {
    score,
    matchPercent,
    budgetMatch,
    locationMatch,
    habitsSimilarity,
  };
}

module.exports = {
  normalizeCity,
  computeScore,
};

