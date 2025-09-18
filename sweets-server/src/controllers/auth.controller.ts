import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as authService from "../services/auth.services";
import { registerSchema } from "../validators/auth.validator";
import { ApiError } from "../utils/apiError";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const validation = registerSchema.safeParse(req.body);
  if (!validation.success) {
    throw ApiError.badRequest(`Invalid credentials`);
  }
  const { username, password, role } = req.body;
  const user = await authService.register(username, password, role);
  return res
    .status(201)
    .json({ message: `User registered successfully`, user });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const payload = await authService.login(username, password);
  return res.status(200).json(payload);
});
