import { NextFunction, Request, Response } from "express";
import { getEnv } from "../utils/getEnv";
import { ApiError } from "../utils/apiError";
import jwt from "jsonwebtoken";

const JWT_SECRET = getEnv("JWT_SECRET");

export interface AuthRequest extends Request {
  user?: { id: string; username: string; role: string };
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith(`Bearer `)) {
    return next(ApiError.unauthorized(`Unauthorized`));
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      id: payload.id,
      username: payload.username,
      role: payload.role,
    };
    next();
  } catch (error) {
    return next(ApiError.unauthorized(`Invalid token`));
  }
}

export function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden, admin only" });
  next();
}
