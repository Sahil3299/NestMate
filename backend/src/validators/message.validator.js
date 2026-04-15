// backend/src/validators/message.validator.js
const { z } = require("zod");

exports.sendMessageSchema = z.object({
  body: z.object({
    receiverId: z.string().min(1, "Receiver is required"),
    content:    z.string().min(1, "Message cannot be empty").max(2000),
    listingId:  z.string().optional(),
  }),
});

// backend/src/validators/user.validator.js
exports.updateProfileSchema = z.object({
  body: z.object({
    name:        z.string().min(2).max(60).optional(),
    age:         z.coerce.number().min(18).max(80).optional(),
    gender:      z.enum(["male", "female", "other"]).optional(),
    occupation:  z.string().max(100).optional(),
    bio:         z.string().max(500).optional(),
    preferredCity:  z.string().optional(),
    preferredAreas: z.array(z.string()).optional(),
    budget: z.object({
      min: z.coerce.number().min(0),
      max: z.coerce.number().min(0),
    }).optional(),
    lifestyle: z.object({
      smoking:    z.boolean().optional(),
      pets:       z.boolean().optional(),
      vegetarian: z.boolean().optional(),
      drinking:   z.boolean().optional(),
      earlyBird:  z.boolean().optional(),
      wfhFriendly:z.boolean().optional(),
      guestFriendly: z.boolean().optional(),
    }).optional(),
    genderPreference: z.enum(["any", "male", "female"]).optional(),
    moveInDate: z.coerce.date().optional(),
  }),
});
