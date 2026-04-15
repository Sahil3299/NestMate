// backend/src/validators/auth.validator.js
const { z } = require("zod");

exports.registerSchema = z.object({
  body: z.object({
    name:     z.string().min(2, "Name must be at least 2 characters").max(60),
    email:    z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters")
               .regex(/[A-Z]/, "Must contain an uppercase letter")
               .regex(/[0-9]/, "Must contain a number"),
    role:     z.enum(["seeker", "host"]).default("seeker"),
  }),
});

exports.loginSchema = z.object({
  body: z.object({
    email:    z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});

exports.forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
  }),
});

exports.resetPasswordSchema = z.object({
  body: z.object({
    password: z.string().min(8, "Password must be at least 8 characters")
               .regex(/[A-Z]/, "Must contain an uppercase letter")
               .regex(/[0-9]/, "Must contain a number"),
  }),
  params: z.object({
    token: z.string().min(1),
  }),
});
