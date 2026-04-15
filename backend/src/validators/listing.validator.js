// backend/src/validators/listing.validator.js
const { z } = require("zod");

const coordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
}).optional();

exports.createListingSchema = z.object({
  body: z.object({
    title:       z.string().min(5, "Title must be at least 5 characters").max(120),
    description: z.string().min(20, "Description must be at least 20 characters").max(3000),
    listingType: z.enum(["room", "flatmate", "pg"]).default("room"),
    roomType:    z.enum(["Private Room", "Shared Room", "Full Apartment", "PG"]),
    furnishing:  z.enum(["Furnished", "Semi-furnished", "Unfurnished"]).default("Furnished"),
    rent:        z.coerce.number().min(1, "Rent must be greater than 0"),
    deposit:     z.coerce.number().min(0).default(0),
    availableFrom: z.coerce.date(),
    location: z.object({
      address:  z.string().min(3),
      area:     z.string().optional(),
      city:     z.string().min(2),
      state:    z.string().default("Maharashtra"),
      pincode:  z.string().optional(),
      coordinates: coordinatesSchema,
    }),
    preferences: z.object({
      gender:     z.enum(["any", "male", "female"]).default("any"),
      smoking:    z.coerce.boolean().default(false),
      pets:       z.coerce.boolean().default(false),
      vegetarian: z.coerce.boolean().default(false),
      drinking:   z.coerce.boolean().default(false),
      students:   z.coerce.boolean().default(true),
      working:    z.coerce.boolean().default(true),
    }).optional(),
    amenities: z.array(z.string()).optional(),
    tags:      z.array(z.string()).optional(),
  }),
});

exports.updateListingSchema = z.object({
  body: exports.createListingSchema.shape.body.partial(),
  params: z.object({ id: z.string().min(1) }),
});

exports.listingQuerySchema = z.object({
  query: z.object({
    city:        z.string().optional(),
    minRent:     z.coerce.number().optional(),
    maxRent:     z.coerce.number().optional(),
    listingType: z.enum(["room", "flatmate", "pg"]).optional(),
    roomType:    z.string().optional(),
    gender:      z.enum(["any", "male", "female"]).optional(),
    smoking:     z.enum(["true","false"]).optional(),
    pets:        z.enum(["true","false"]).optional(),
    vegetarian:  z.enum(["true","false"]).optional(),
    lat:         z.coerce.number().optional(),
    lng:         z.coerce.number().optional(),
    radius:      z.coerce.number().default(10), // km
    search:      z.string().optional(),
    page:        z.coerce.number().default(1),
    limit:       z.coerce.number().max(50).default(12),
    sort:        z.enum(["newest", "rent_asc", "rent_desc", "match"]).default("newest"),
  }),
});
