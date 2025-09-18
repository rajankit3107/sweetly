import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/apiError";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Zod errors (paranoid - validate middleware returns its own response)
  if (err instanceof ZodError) {
    const errors = err.issues.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));
    return res
      .status(400)
      .json({ success: false, message: "Validation failed", errors });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || null,
    });
  }

  console.error("Unhandled error:", err);
  return res
    .status(500)
    .json({ success: false, message: "Internal Server Error" });
}
