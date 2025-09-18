import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as authService from "../services/auth.services";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { username, passowrd, role } = req.body;
  const user = await authService.register(username, passowrd, role);
  return res
    .status(201)
    .json({ message: `User registered successfully`, user });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { username, passowrd } = req.body;
  const payload = await authService.login(username, passowrd);
  return res.status(200).json(payload);
});
