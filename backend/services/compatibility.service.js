const { weights } = require('../config/compatibility');

const comparators = {
  food(a, b) {
    if (!a || !b) return 0.5; // neutral
    return a.toLowerCase() === b.toLowerCase() ? 1 : 0;
  },
  smoking(a, b) {
    if (a === undefined || b === undefined) return 0.5;
    const na = a === true ? 'smoker' : a === false ? 'non-smoker' : a;
    const nb = b === true ? 'smoker' : b === false ? 'non-smoker' : b;
    return na === nb ? 1 : 0;
  },
  drinking(a, b) {
    if (a === undefined || b === undefined) return 0.5;
    const na = a === true ? 'drinker' : a === false ? 'non-drinker' : a;
    const nb = b === true ? 'drinker' : b === false ? 'non-drinker' : b;
    return na === nb ? 1 : 0;
  },
  sleep(a, b) {
    if (!a || !b) return 0.5;
    return a.toLowerCase() === b.toLowerCase() ? 1 : 0;
  },
  cleanliness(a, b) {
    if (!a || !b) return 0.5;
    return a.toLowerCase() === b.toLowerCase() ? 1 : 0;
  },
  pets(a, b) {
    if (a === undefined || b === undefined) return 0.5;
    const na = a === true ? 'has-pets' : a === false ? 'no-pets' : a;
    const nb = b === true ? 'has-pets' : b === false ? 'no-pets' : b;
    return na === nb ? 1 : 0;
  },
  workFromHome(a, b) {
    if (a === undefined || b === undefined) return 0.5;
    return a === b ? 1 : 0;
  },
  occupation(a, b) {
    if (!a || !b) return 0.5;
    return a.toLowerCase() === b.toLowerCase() ? 1 : 0;
  },
};

function computeScore(userA, userB) {
  if (!userA || !userB) return { score: 0, breakdown: {} };

  let totalScore = 0;
  const breakdown = {};

  // 1. City Match (Weight: 10)
  const cityMatch = userA.city && userB.city && userA.city.toLowerCase() === userB.city.toLowerCase();
  breakdown.city = cityMatch ? 10 : 0;
  totalScore += breakdown.city;

  // 2. Gender/Preferences Match (Weight: 20)
  // Check if gender preference matches
  let genderOk = true;
  if (userA.gender && userB.genderPreference && userB.genderPreference !== 'Any') {
    genderOk = genderOk && (userB.genderPreference.toLowerCase() === userA.gender.toLowerCase());
  }
  if (userB.gender && userA.genderPreference && userA.genderPreference !== 'Any') {
    genderOk = genderOk && (userA.genderPreference.toLowerCase() === userB.gender.toLowerCase());
  }
  breakdown.gender = genderOk ? 20 : 0;
  totalScore += breakdown.gender;

  // 3. Budget Overlap (Weight: 30)
  let budgetOk = true;
  const aMin = userA.preferences?.budgetMin || 0;
  const aMax = userA.preferences?.budgetMax || 0;
  const bMin = userB.preferences?.budgetMin || 0;
  const bMax = userB.preferences?.budgetMax || 0;

  if (aMax > 0 && bMax > 0) {
    // Check if the budget ranges overlap
    budgetOk = (aMin <= bMax && bMin <= aMax);
  }
  breakdown.budget = budgetOk ? 30 : 0;
  totalScore += breakdown.budget;

  // 4. Lifestyle Match (Weight: 40)
  let lifestyleSum = 0;
  let lifestyleCount = 0;
  const lifestyleA = userA.lifestyle || {};
  const lifestyleB = userB.lifestyle || {};

  const lifestyleKeys = ['food', 'smoking', 'drinking', 'sleep', 'cleanliness', 'pets', 'workFromHome'];
  for (const key of lifestyleKeys) {
    const valA = lifestyleA[key];
    const valB = lifestyleB[key];
    if (valA !== undefined && valB !== undefined) {
      lifestyleSum += comparators[key](valA, valB);
      lifestyleCount++;
    }
  }

  const lifestyleScore = lifestyleCount > 0 ? Math.round((lifestyleSum / lifestyleCount) * 40) : 20;
  breakdown.lifestyle = lifestyleScore;
  totalScore += lifestyleScore;

  return {
    score: Math.min(Math.max(totalScore, 0), 100),
    breakdown,
  };
}

function computeScoreVsListing(user, listing) {
  if (!user || !listing) return { score: 0, breakdown: {} };

  let totalScore = 0;
  const breakdown = {};

  // 1. City Match (Weight: 10)
  const cityMatch = user.city && listing.city && user.city.toLowerCase() === listing.city.toLowerCase();
  breakdown.city = cityMatch ? 10 : 0;
  totalScore += breakdown.city;

  // 2. Gender Preference Match (Weight: 20)
  let genderOk = true;
  if (listing.genderPreference && listing.genderPreference !== 'Any' && user.gender) {
    genderOk = (listing.genderPreference.toLowerCase() === user.gender.toLowerCase());
  }
  breakdown.gender = genderOk ? 20 : 0;
  totalScore += breakdown.gender;

  // 3. Budget Check (Weight: 30)
  let budgetOk = true;
  const budgetMin = user.preferences?.budgetMin || 0;
  const budgetMax = user.preferences?.budgetMax || 0;
  const rent = listing.rent || 0;

  if (budgetMax > 0) {
    if (rent >= budgetMin && rent <= budgetMax) {
      budgetOk = true;
    } else if (rent <= budgetMax * 1.2) {
      // within 20% margin
      breakdown.budget = 15;
      budgetOk = false;
    } else {
      breakdown.budget = 0;
      budgetOk = false;
    }
  }
  if (budgetOk) {
    breakdown.budget = 30;
  }
  totalScore += breakdown.budget;

  // 4. Lifestyle Match vs Listing's preferredFlatmate / owner lifestyle (Weight: 40)
  let lifestyleSum = 0;
  let lifestyleCount = 0;
  const userLifestyle = user.lifestyle || {};
  const pref = listing.preferredFlatmate || {};
  const ownerLifestyle = listing.owner?.lifestyle || {};

  // Compare food preference
  if (userLifestyle.food && (pref.foodPreference || ownerLifestyle.food)) {
    const targetFood = pref.foodPreference || ownerLifestyle.food;
    lifestyleSum += comparators.food(userLifestyle.food, targetFood);
    lifestyleCount++;
  }
  // Compare smoking
  if (userLifestyle.smoking !== undefined && (pref.smoking !== undefined || ownerLifestyle.smoking !== undefined)) {
    const targetSmoking = pref.smoking !== undefined ? pref.smoking : ownerLifestyle.smoking;
    lifestyleSum += comparators.smoking(userLifestyle.smoking, targetSmoking);
    lifestyleCount++;
  }
  // Compare drinking
  if (userLifestyle.drinking !== undefined && (pref.drinking !== undefined || ownerLifestyle.drinking !== undefined)) {
    const targetDrinking = pref.drinking !== undefined ? pref.drinking : ownerLifestyle.drinking;
    lifestyleSum += comparators.drinking(userLifestyle.drinking, targetDrinking);
    lifestyleCount++;
  }
  // Compare others if owner lifestyle is populated
  const otherKeys = ['sleep', 'cleanliness', 'pets', 'workFromHome'];
  for (const key of otherKeys) {
    if (userLifestyle[key] !== undefined && ownerLifestyle[key] !== undefined) {
      lifestyleSum += comparators[key](userLifestyle[key], ownerLifestyle[key]);
      lifestyleCount++;
    }
  }

  const lifestyleScore = lifestyleCount > 0 ? Math.round((lifestyleSum / lifestyleCount) * 40) : 20;
  breakdown.lifestyle = lifestyleScore;
  totalScore += lifestyleScore;

  return {
    score: Math.min(Math.max(totalScore, 0), 100),
    breakdown,
  };
}

module.exports = { computeScore, computeScoreVsListing };
