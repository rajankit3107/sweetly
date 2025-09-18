import z from "zod";

export const registerSchema = z.object({
  username: z.string().min(1, `username required`),
  password: z.string().min(6, `password must be atleast 6 characters`),
  role: z.enum(["user", "admin"]).optional(),
});

export const loginSchema = z.object({
  username: z.string().min(1, `username required`),
  password: z.string().min(1, `password required`),
});
