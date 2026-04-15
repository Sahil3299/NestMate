// frontend/src/validators/schemas.js
import { z } from "zod";

export const loginSchema = z.object({
  email:    z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name:     z.string().min(2, "Name must be at least 2 characters"),
  email:    z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/,  "Must contain a number"),
  role:     z.enum(["seeker", "host"]).default("seeker"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, "At least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/,  "Must contain a number"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path:    ["confirmPassword"],
});

export const profileSchema = z.object({
  name:        z.string().min(2).max(60).optional(),
  age:         z.coerce.number().min(18).max(80).optional(),
  gender:      z.enum(["male", "female", "other"]).optional(),
  occupation:  z.string().max(100).optional(),
  bio:         z.string().max(500).optional(),
  preferredCity: z.string().optional(),
  budget: z.object({
    min: z.coerce.number().min(0),
    max: z.coerce.number().min(0),
  }).optional(),
});

export const listingSchema = z.object({
  title:         z.string().min(5, "At least 5 characters").max(120),
  description:   z.string().min(20, "At least 20 characters").max(3000),
  listingType:   z.enum(["room", "flatmate", "pg"]),
  roomType:      z.enum(["Private Room", "Shared Room", "Full Apartment", "PG"]),
  furnishing:    z.enum(["Furnished", "Semi-furnished", "Unfurnished"]),
  rent:          z.coerce.number().min(1, "Rent is required"),
  deposit:       z.coerce.number().min(0).optional(),
  availableFrom: z.string().min(1, "Available date is required"),
  "location.address": z.string().min(3, "Address is required"),
  "location.area":    z.string().optional(),
  "location.city":    z.string().min(2, "City is required"),
  "location.pincode": z.string().optional(),
});

export const messageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(2000),
});
