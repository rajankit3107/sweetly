import { NextFunction, Request, Response } from "express";
import * as sweetService from "../services/sweets.services";

export async function createSweet(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, category, price, quantity, description, imageUrl, imageAlt } =
      req.body;
    const sweet = await sweetService.createSweet({
      name,
      category,
      price,
      quantity,
      description,
      imageUrl,
      imageAlt,
    });

    return res.status(201).json({ sweet });
  } catch (error) {
    next(error);
  }
}

export async function updateSweet(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const updated = await sweetService.updateSweet(
      req.params.id,
      req.body as any
    );

    if (!updated) return res.status(404).json({ message: `Not Found` });

    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function deleteSweet(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const deleted = await sweetService.deleteSweet(req.params.id);
    if (!deleted) return res.status(404).json({ message: `Not Found` });
    res.json({ message: `sweet deleted successfully` });
  } catch (error) {
    next(error);
  }
}

export async function restockSweet(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const qty = Number(req.body.quantity);
    const sweet = await sweetService.restockSweet(req.params.id, qty);
    res.json(sweet);
  } catch (error) {
    next(error);
  }
}
