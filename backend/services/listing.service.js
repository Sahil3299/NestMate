const Room = require('../models/Room');
const Favorite = require('../models/Favorite');
const AppError = require('../utils/AppError');
const { deleteImage, extractPublicId } = require('../config/cloudinary');

exports.createListing = async (ownerId, data, files) => {
  const images = files ? files.map((f) => f.path) : [];
  const listing = await Room.create({
    owner: ownerId,
    ...data,
    images,
  });
  return listing;
};

exports.getListings = async (query) => {
  const {
    city,
    minRent,
    maxRent,
    gender,
    roomType,
    availability,
    search,
    sort = '-createdAt',
    page = 1,
    limit = 12,
  } = query;

  const filter = {};

  if (city) filter.city = city.toLowerCase();
  if (minRent || maxRent) {
    filter.rent = {};
    if (minRent) filter.rent.$gte = Number(minRent);
    if (maxRent) filter.rent.$lte = Number(maxRent);
  }
  if (gender && gender !== 'Any') filter.genderPreference = gender;
  if (roomType && roomType !== 'Any') filter.roomType = roomType;
  if (availability !== undefined) filter.availability = availability === 'true';
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { locality: { $regex: search, $options: 'i' } },
    ];
  }

  const sortOptions = {};
  if (sort.startsWith('-')) {
    sortOptions[sort.slice(1)] = -1;
  } else {
    sortOptions[sort] = 1;
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Room.countDocuments(filter);
  const listings = await Room.find(filter)
    .populate('owner', 'name email profileImage')
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit));

  return {
    listings,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  };
};

exports.getListingById = async (id) => {
  const listing = await Room.findById(id).populate('owner', 'name email profileImage phone bio occupation');
  if (!listing) throw new AppError('Listing not found', 404);
  return listing;
};

exports.getMyListings = async (ownerId) => {
  const listings = await Room.find({ owner: ownerId }).sort({ createdAt: -1 });
  return listings;
};

exports.updateListing = async (id, ownerId, updates, files) => {
  const listing = await Room.findOne({ _id: id, owner: ownerId });
  if (!listing) throw new AppError('Listing not found or unauthorized', 404);

  const allowed = [
    'title', 'description', 'rent', 'city', 'locality', 'address',
    'latitude', 'longitude', 'roomType', 'genderPreference',
    'availableFrom', 'furnished', 'amenities', 'availability',
  ];

  for (const key of allowed) {
    if (updates[key] !== undefined) {
      listing[key] = updates[key];
    }
  }

  if (files && files.length > 0) {
    for (const img of listing.images) {
      const publicId = extractPublicId(img);
      if (publicId) await deleteImage(publicId);
    }
    listing.images = files.map((f) => f.path);
  }

  await listing.save();
  return listing;
};

exports.deleteListing = async (id, ownerId) => {
  const listing = await Room.findOne({ _id: id, owner: ownerId });
  if (!listing) throw new AppError('Listing not found or unauthorized', 404);

  for (const img of listing.images) {
    const publicId = extractPublicId(img);
    if (publicId) await deleteImage(publicId);
  }

  await Favorite.deleteMany({ room: id });
  await Room.findByIdAndDelete(id);
};
