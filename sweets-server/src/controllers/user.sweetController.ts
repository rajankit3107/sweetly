import { NextFunction, Request, Response } from "express";
import * as sweetService from "../services/sweets.services";
import { asyncHandler } from "../utils/asyncHandler";

export async function listSweets(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const sweets = await sweetService.listSweets();
    res.json(sweets);
  } catch (error) {
    next(error);
  }
}

export async function searchSweets(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const result = await sweetService.searchSweets({
      name: name as string,
      category: category as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function purchaseSweets(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const qty = Number(req.body.quantity) || 1;
    const sweet = await sweetService.purchaseSweet(req.params.id, qty);
    res.json(sweet);
  } catch (error) {
    next(error);
  }
}
