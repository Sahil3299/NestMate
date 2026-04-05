import { z } from "zod";

const listingValidationSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(150, "Title too long"),
  description: z.string().min(20, "Description must be at least 20 characters").max(3000, "Description too long"),
  rent: z.number().min(0, "Rent cannot be negative").max(999999, "Rent is too high"),
  securityDeposit: z.number().min(0, "Deposit cannot be negative").max(999999, "Deposit is too high"),
  occupancy: z.number().min(1, "Occupancy must be at least 1").max(20, "Occupancy too high"),
  roomType: z.enum(["single", "shared", "entire"], { errorMap: () => ({ message: "Select a valid room type" }) }),
  availableFrom: z.string().refine((date) => new Date(date) > new Date(), "Date must be in the future"),
  address: z.string().min(5, "Address must be at least 5 characters").max(200, "Address too long"),
  city: z.string().min(2, "City name too short").max(50, "City name too long"),
  latitude: z.number().min(-90).max(90, "Invalid latitude"),
  longitude: z.number().min(-180).max(180, "Invalid longitude"),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string()).max(10, "Maximum 10 images allowed").default([]),
});

export default listingValidationSchema;
