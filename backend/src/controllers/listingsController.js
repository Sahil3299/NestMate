const RoomListing = require("../models/RoomListing");
const Profile = require("../models/Profile");

function parseRequiredString(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

// Create a new room listing
async function createListing(req, res) {
  try {
    const {
      title,
      description,
      rent,
      securityDeposit,
      address,
      city,
      latitude,
      longitude,
      amenities,
      availableFrom,
      occupancy,
      roomType,
      images,
    } = req.body;

    // Validate required fields
    const titleStr = parseRequiredString(title);
    const descStr = parseRequiredString(description);
    const addressStr = parseRequiredString(address);
    const cityStr = parseRequiredString(city);

    if (!titleStr || !descStr || !addressStr || !cityStr) {
      return res.status(400).json({ error: "title, description, address, and city are required" });
    }

    const rentNum = Number(rent);
    const depositNum = Number(securityDeposit);
    const occupancyNum = Number(occupancy);
    const latNum = Number(latitude);
    const lonNum = Number(longitude);

    if (
      !Number.isFinite(rentNum) ||
      !Number.isFinite(depositNum) ||
      !Number.isFinite(occupancyNum) ||
      !Number.isFinite(latNum) ||
      !Number.isFinite(lonNum)
    ) {
      return res.status(400).json({ error: "Invalid numeric fields" });
    }

    if (rentNum < 0) {
      return res.status(400).json({ error: "Rent cannot be negative" });
    }

    if (!["single", "shared", "entire"].includes(roomType)) {
      return res.status(400).json({ error: "Invalid room type" });
    }

    const availDate = new Date(availableFrom);
    if (isNaN(availDate.getTime())) {
      return res.status(400).json({ error: "Invalid availableFrom date" });
    }

    // Verify poster profile exists
    const profile = await Profile.findOne({ uid: req.user.uid }).lean();
    if (!profile) {
      return res
        .status(400)
        .json({ error: "Complete your profile before posting listings" });
    }

    const amenitiesArr = Array.isArray(amenities)
      ? amenities.filter((a) => typeof a === "string")
      : [];
    const imagesArr = Array.isArray(images)
      ? images.filter((img) => typeof img === "string").slice(0, 10)
      : [];

    const listing = await RoomListing.create({
      title: titleStr,
      description: descStr,
      rent: rentNum,
      securityDeposit: depositNum,
      location: {
        type: "Point",
        coordinates: [lonNum, latNum],
        address: addressStr,
        city: cityStr.toLowerCase(),
      },
      amenities: amenitiesArr,
      images: imagesArr,
      availableFrom: availDate,
      occupancy: occupancyNum,
      roomType,
      postedBy: req.user.uid,
      posterProfile: profile._id,
    });

    const populated = await listing.populate("posterProfile", "name avatarPath");

    return res.status(201).json({ listing: populated });
  } catch (err) {
    console.error("Error creating listing:", err);
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: Object.values(err.errors).map((e) => e.message)[0] });
    }
    return res.status(500).json({ error: "Failed to create listing" });
  }
}

// Get a single listing by ID
async function getListing(req, res) {
  try {
    const { id } = req.params;

    const listing = await RoomListing.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("posterProfile", "name avatarPath avatarPreset");

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    return res.status(200).json({ listing });
  } catch (err) {
    console.error("Error fetching listing:", err);
    return res.status(500).json({ error: "Failed to fetch listing" });
  }
}

// Update a listing (only by poster)
async function updateListing(req, res) {
  try {
    const { id } = req.params;
    const { title, description, rent, securityDeposit, amenities, images, isActive } = req.body;

    const listing = await RoomListing.findById(id).lean();
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    if (listing.postedBy !== req.user.uid) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const updates = {};

    if (title !== undefined) {
      const titleStr = parseRequiredString(title);
      if (!titleStr) return res.status(400).json({ error: "Invalid title" });
      updates.title = titleStr;
    }

    if (description !== undefined) {
      const descStr = parseRequiredString(description);
      if (!descStr) return res.status(400).json({ error: "Invalid description" });
      updates.description = descStr;
    }

    if (rent !== undefined) {
      const rentNum = Number(rent);
      if (!Number.isFinite(rentNum) || rentNum < 0) {
        return res.status(400).json({ error: "Invalid rent" });
      }
      updates.rent = rentNum;
    }

    if (securityDeposit !== undefined) {
      const depositNum = Number(securityDeposit);
      if (!Number.isFinite(depositNum) || depositNum < 0) {
        return res.status(400).json({ error: "Invalid security deposit" });
      }
      updates.securityDeposit = depositNum;
    }

    if (amenities !== undefined) {
      if (Array.isArray(amenities)) {
        updates.amenities = amenities.filter((a) => typeof a === "string");
      }
    }

    if (images !== undefined) {
      if (Array.isArray(images)) {
        updates.images = images.filter((img) => typeof img === "string").slice(0, 10);
      }
    }

    if (isActive !== undefined) {
      updates.isActive = Boolean(isActive);
    }

    const updated = await RoomListing.findByIdAndUpdate(id, updates, {
      new: true,
    }).populate("posterProfile", "name avatarPath");

    return res.status(200).json({ listing: updated });
  } catch (err) {
    console.error("Error updating listing:", err);
    return res.status(500).json({ error: "Failed to update listing" });
  }
}

// Delete a listing (only by poster)
async function deleteListing(req, res) {
  try {
    const { id } = req.params;

    const listing = await RoomListing.findById(id).lean();
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    if (listing.postedBy !== req.user.uid) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await RoomListing.findByIdAndDelete(id);

    return res.status(200).json({ message: "Listing deleted" });
  } catch (err) {
    console.error("Error deleting listing:", err);
    return res.status(500).json({ error: "Failed to delete listing" });
  }
}

// Get listings by user (my listings)
async function getUserListings(req, res) {
  try {
    const limitRaw = req.query.limit || 20;
    const skipRaw = req.query.skip || 0;

    const limit = Math.min(Math.max(Number(limitRaw), 1), 100);
    const skip = Math.max(Number(skipRaw), 0);

    const listings = await RoomListing.find({ postedBy: req.user.uid })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate("posterProfile", "name avatarPath")
      .lean();

    const total = await RoomListing.countDocuments({ postedBy: req.user.uid });

    return res.status(200).json({ listings, total, limit, skip });
  } catch (err) {
    console.error("Error fetching user listings:", err);
    return res.status(500).json({ error: "Failed to fetch listings" });
  }
}

// Advanced search with geospatial + filtering
async function searchListings(req, res) {
  try {
    const {
      city,
      minRent,
      maxRent,
      amenities,
      occupancy,
      roomType,
      latitude,
      longitude,
      maxDistance,
      limit: limitRaw,
      skip: skipRaw,
    } = req.query;

    const limit = Math.min(Math.max(Number(limitRaw || 20), 1), 100);
    const skip = Math.max(Number(skipRaw || 0), 0);

    const query = { isActive: true };

    // City filter
    if (city && typeof city === "string") {
      query["location.city"] = city.trim().toLowerCase();
    }

    // Rent range filter
    if (minRent !== undefined) {
      const minNum = Number(minRent);
      if (Number.isFinite(minNum)) {
        query.rent = { ...query.rent, $gte: minNum };
      }
    }
    if (maxRent !== undefined) {
      const maxNum = Number(maxRent);
      if (Number.isFinite(maxNum)) {
        query.rent = { ...query.rent, $lte: maxNum };
      }
    }

    // Amenities filter (match all)
    if (amenities && Array.isArray(amenities)) {
      query.amenities = { $all: amenities };
    }

    // Room type filter
    if (roomType && ["single", "shared", "entire"].includes(roomType)) {
      query.roomType = roomType;
    }

    // Occupancy filter
    if (occupancy !== undefined) {
      const occNum = Number(occupancy);
      if (Number.isFinite(occNum) && occNum > 0) {
        query.occupancy = { $gte: occNum };
      }
    }

    // Geospatial search
    if (latitude !== undefined && longitude !== undefined) {
      const lat = Number(latitude);
      const lon = Number(longitude);
      const dist = maxDistance ? Number(maxDistance) : 50000; // Default 50km

      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        query["location.coordinates"] = {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [lon, lat],
            },
            $maxDistance: dist,
          },
        };
      }
    }

    const listings = await RoomListing.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate("posterProfile", "name avatarPath")
      .lean();

    const total = await RoomListing.countDocuments(query);

    return res.status(200).json({ listings, total, limit, skip });
  } catch (err) {
    console.error("Error searching listings:", err);
    return res.status(500).json({ error: "Failed to search listings" });
  }
}

module.exports = {
  createListing,
  getListing,
  updateListing,
  deleteListing,
  getUserListings,
  searchListings,
};
