// backend/tests/unit/matchingEngine.test.js
const { calculateMatch, scoreListings } = require("../../src/services/matchingEngine");

const mockSeeker = {
  budget:    { min: 8000, max: 15000 },
  gender:    "female",
  lifestyle: { smoking: false, pets: false, vegetarian: true, drinking: false },
  preferredCoords: { lat: 18.5204, lng: 73.8567 },
};

const mockListing = {
  rent: 12000,
  preferences: {
    gender:     "female",
    smoking:    false,
    pets:       false,
    vegetarian: true,
    drinking:   false,
  },
  location: {
    coordinates: { type: "Point", coordinates: [73.8567, 18.5204] }, // same location
  },
};

describe("calculateMatch", () => {
  it("returns high score for perfect match", () => {
    const { score } = calculateMatch(mockSeeker, mockListing);
    expect(score).toBeGreaterThanOrEqual(85);
  });

  it("penalises rent outside budget", () => {
    const expensiveListing = { ...mockListing, rent: 30000 };
    const { score } = calculateMatch(mockSeeker, expensiveListing);
    expect(score).toBeLessThan(70);
  });

  it("penalises wrong gender preference", () => {
    const maleListing = { ...mockListing, preferences: { ...mockListing.preferences, gender: "male" } };
    const { score, breakdown } = calculateMatch(mockSeeker, maleListing);
    expect(breakdown.genderScore).toBe(0);
  });

  it("score is always 0-100", () => {
    const { score } = calculateMatch({}, {});
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("returns breakdown object with all keys", () => {
    const { breakdown } = calculateMatch(mockSeeker, mockListing);
    expect(breakdown).toHaveProperty("budgetScore");
    expect(breakdown).toHaveProperty("locationScore");
    expect(breakdown).toHaveProperty("lifestyleScore");
    expect(breakdown).toHaveProperty("genderScore");
  });
});

describe("scoreListings", () => {
  it("sorts listings by matchScore descending", () => {
    const listings = [
      { ...mockListing, rent: 30000 },
      { ...mockListing, rent: 12000 },
    ];
    const scored = scoreListings(mockSeeker, listings);
    expect(scored[0].matchScore).toBeGreaterThanOrEqual(scored[1].matchScore);
  });
});
