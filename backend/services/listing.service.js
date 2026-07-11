const Listing = require('../models/Listing');
const AppError = require('../utils/AppError');

exports.createListing = async (ownerId, data, files) => {
  const photos = files ? files.map((f) => f.path) : [];

  let amenities = data.amenities || [];
  if (typeof amenities === 'string') {
    amenities = [amenities];
  } else if (Array.isArray(amenities)) {
    amenities = amenities.flat(Infinity).filter((a) => typeof a === 'string');
  }

  const listingData = {
    owner: ownerId,
    title: data.title,
    description: data.description,
    type: data.type || 'room',
    city: data.city,
    locality: data.locality,
    address: data.address,
    rent: data.rent,
    deposit: data.deposit || 0,
    availableFrom: data.availableFrom,
    roomType: data.roomType,
    genderPreference: data.genderPreference || 'Any',
    furnished: data.furnished || 'Not Furnished',
    amenities,
    photos,
    isBrokerageFree: data.isBrokerageFree !== undefined ? data.isBrokerageFree : true,
    preferredFlatmate: data.preferredFlatmate || {},
    status: 'active',
  };

  if (data.latitude && data.longitude) {
    listingData.location = {
      type: 'Point',
      coordinates: [parseFloat(data.longitude), parseFloat(data.latitude)],
    };
  }

  const listing = await Listing.create(listingData);
  return listing;
};

exports.getListings = async (query, user = null) => {
  const {
    city,
    minRent,
    maxRent,
    gender,
    roomType,
    type,
    amenities,
    isBrokerageFree,
    search,
    latitude,
    longitude,
    radiusKm,
    sort = '-createdAt',
    page = 1,
    limit = 12,
  } = query;

  const filter = {};

  if (city) filter.city = city.toLowerCase();
  if (type) filter.type = type;
  if (gender && gender !== 'Any') filter.genderPreference = gender;
  if (roomType && roomType !== 'Any') filter.roomType = roomType;
  if (isBrokerageFree !== undefined) filter.isBrokerageFree = isBrokerageFree === 'true';
  if (minRent || maxRent) {
    filter.rent = {};
    if (minRent) filter.rent.$gte = Number(minRent);
    if (maxRent) filter.rent.$lte = Number(maxRent);
  }
  if (amenities) {
    const amenityList = amenities.split(',');
    filter.amenities = { $all: amenityList };
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { locality: { $regex: search, $options: 'i' } },
    ];
  }

  if (latitude && longitude && radiusKm) {
    filter.location = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        $maxDistance: parseFloat(radiusKm) * 1000,
      },
    };
  }

  const sortOptions = {};
  if (sort.startsWith('-')) {
    sortOptions[sort.slice(1)] = -1;
  } else {
    sortOptions[sort] = 1;
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Listing.countDocuments(filter);
  const listings = await Listing.find(filter)
    .populate('owner', 'name profileImage city age occupation lifestyle')
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit));

  let results = listings;
  if (user) {
    const { computeScoreVsListing } = require('./compatibility.service');
    results = listings.map((l) => {
      const { score } = computeScoreVsListing(user, l);
      return { ...l.toObject(), matchScore: score };
    });
  } else {
    results = listings.map((l) => ({ ...l.toObject(), matchScore: 90 }));
  }

  return {
    listings: results,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  };
};

exports.getListingById = async (id, user = null) => {
  const listing = await Listing.findById(id).populate('owner', 'name profileImage bio city age occupation lifestyle');
  if (!listing) throw new AppError('Listing not found', 404);

  if (user) {
    const { computeScoreVsListing } = require('./compatibility.service');
    const { score } = computeScoreVsListing(user, listing);
    return { ...listing.toObject(), matchScore: score };
  }

  return { ...listing.toObject(), matchScore: 90 };
};

exports.getMyListings = async (ownerId) => {
  const listings = await Listing.find({ owner: ownerId }).sort({ createdAt: -1 });
  return listings;
};

exports.updateListing = async (id, ownerId, updates, files) => {
  const listing = await Listing.findOne({ _id: id, owner: ownerId });
  if (!listing) throw new AppError('Listing not found or unauthorized', 404);

  const allowed = [
    'title', 'description', 'type', 'rent', 'deposit', 'city', 'locality', 'address',
    'latitude', 'longitude', 'roomType', 'genderPreference', 'availableFrom',
    'furnished', 'amenities', 'isBrokerageFree', 'preferredFlatmate', 'status', 'availability',
  ];

  for (const key of allowed) {
    if (updates[key] !== undefined) {
      if (key === 'amenities') {
        let a = updates[key];
        if (typeof a === 'string') {
          listing[key] = [a];
        } else if (Array.isArray(a)) {
          listing[key] = a.flat(Infinity).filter((v) => typeof v === 'string');
        }
      } else {
        listing[key] = updates[key];
      }
    }
  }

  if (updates.latitude && updates.longitude) {
    listing.location = {
      type: 'Point',
      coordinates: [parseFloat(updates.longitude), parseFloat(updates.latitude)],
    };
  }

  if (files && files.length > 0) {
    listing.photos = files.map((f) => f.path);
  }

  await listing.save();
  return listing;
};

exports.deleteListing = async (id, ownerId) => {
  const listing = await Listing.findOne({ _id: id, owner: ownerId });
  if (!listing) throw new AppError('Listing not found or unauthorized', 404);

  await Listing.findByIdAndDelete(id);
};
