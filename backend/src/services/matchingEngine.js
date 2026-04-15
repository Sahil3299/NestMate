// backend/src/services/matchingEngine.js
/**
 * Weighted Scoring Algorithm
 * Calculates a 0-100% match score between a seeker profile and a listing.
 *
 * Weight breakdown (total = 100):
 *   Budget compatibility   → 30 pts
 *   Location proximity     → 25 pts
 *   Lifestyle compatibility → 30 pts
 *   Gender preference      → 15 pts
 */

const { haversineKm } = require("../utils/geoDistance");

// ── Individual scorers ─────────────────────────────────────────────────────

/**
 * Budget scorer — range-based overlap
 * Full score if listing rent is within seeker's budget range.
 * Partial score if within 20% outside range.
 */
const scoreBudget = (seekerBudget, listingRent) => {
  const { min = 0, max = 999999 } = seekerBudget || {};
  if (listingRent >= min && listingRent <= max) return 30;

  // How far outside the range?
  const overshoot = listingRent > max ? listingRent - max : min - listingRent;
  const range     = max - min || max;
  const ratio     = overshoot / range;

  if (ratio <= 0.1) return 24; // 10% outside
  if (ratio <= 0.2) return 18; // 20% outside
  if (ratio <= 0.3) return 10; // 30% outside
  return 0;
};

/**
 * Location scorer — Haversine distance
 * Full score if within 2 km. Degrades linearly up to max radius.
 */
const scoreLocation = (seekerCoords, listingCoords, maxRadiusKm = 15) => {
  if (!seekerCoords?.lat || !listingCoords?.coordinates?.[0]) return 15; // unknown → neutral

  const [lng, lat] = listingCoords.coordinates;
  const distKm = haversineKm(seekerCoords.lat, seekerCoords.lng, lat, lng);

  if (distKm <= 2)               return 25;
  if (distKm <= maxRadiusKm / 2) return 18;
  if (distKm <= maxRadiusKm)     return 10;
  return 0;
};

/**
 * Lifestyle scorer — boolean flag overlap
 * Each matching flag contributes equally.
 */
const LIFESTYLE_KEYS = ["smoking", "pets", "vegetarian", "drinking", "earlyBird", "wfhFriendly"];

const scoreLifestyle = (seekerLifestyle, listingPrefs) => {
  if (!seekerLifestyle || !listingPrefs) return 15; // unknown → neutral

  let matches = 0;
  let total   = 0;

  LIFESTYLE_KEYS.forEach((key) => {
    const seekerVal  = seekerLifestyle[key];
    const listingVal = listingPrefs[key];
    if (seekerVal === undefined || listingVal === undefined) return;

    total++;
    if (seekerVal === listingVal) matches++;
  });

  if (total === 0) return 15;
  return Math.round((matches / total) * 30);
};

/**
 * Gender preference scorer
 */
const scoreGender = (seekerGender, listingGenderPref) => {
  if (!listingGenderPref || listingGenderPref === "any") return 15;
  if (seekerGender === listingGenderPref)                return 15;
  return 0;
};

// ── Main scorer ────────────────────────────────────────────────────────────

/**
 * calculateMatch(seeker, listing) → { score: number, breakdown: object }
 *
 * @param {Object} seeker  - User document (budget, lifestyle, gender, location)
 * @param {Object} listing - Listing document
 * @returns {{ score: number, breakdown: object }}
 */
const calculateMatch = (seeker, listing) => {
  const budgetScore    = scoreBudget(seeker.budget, listing.rent);
  const locationScore  = scoreLocation(
    seeker.preferredCoords,
    listing.location?.coordinates
  );
  const lifestyleScore = scoreLifestyle(seeker.lifestyle, listing.preferences);
  const genderScore    = scoreGender(seeker.gender, listing.preferences?.gender);

  const total = budgetScore + locationScore + lifestyleScore + genderScore;

  return {
    score: Math.min(100, Math.max(0, total)),
    breakdown: { budgetScore, locationScore, lifestyleScore, genderScore },
  };
};

/**
 * scoreListings(seeker, listings) → listings sorted by match score descending
 */
const scoreListings = (seeker, listings) => {
  return listings
    .map((listing) => {
      const plain = listing.toObject ? listing.toObject() : listing;
      const { score, breakdown } = calculateMatch(seeker, plain);
      return { ...plain, matchScore: score, matchBreakdown: breakdown };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
};

/**
 * scoreSeekers(hostProfile, seekerProfiles) → seekers sorted by compatibility
 * Used for "Team Creator" feature — matching two strangers.
 */
const scoreSeekers = (hostProfile, seekers) => {
  return seekers
    .map((seeker) => {
      const plain = seeker.toObject ? seeker.toObject() : seeker;
      // Treat host's own listing preferences as a proxy listing
      const proxyListing = {
        rent:        (hostProfile.budget?.min + hostProfile.budget?.max) / 2 || 10000,
        preferences: hostProfile.lifestyle,
        location:    { coordinates: { coordinates: hostProfile.preferredCoords ? [hostProfile.preferredCoords.lng, hostProfile.preferredCoords.lat] : [0, 0] } },
      };
      const { score } = calculateMatch(plain, proxyListing);
      return { ...plain, matchScore: score };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
};

module.exports = { calculateMatch, scoreListings, scoreSeekers };
