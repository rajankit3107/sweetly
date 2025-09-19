import mongoose from "mongoose";
import { Isweets, Sweet } from "../models/sweets.model";

export async function createSweet(data: Partial<Isweets>) {
  return Sweet.create(data);
}

export async function listSweets() {
  return Sweet.find().lean();
}

export async function getSweetById(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Sweet.findById(id);
}

export async function updateSweet(id: string, data: Partial<Isweets>) {
  return Sweet.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteSweet(id: string) {
  return Sweet.findByIdAndDelete(id);
}

export async function searchSweets(query: {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  const filter: any = {};
  if (query.name) filter.name = { $regex: query.name, $options: "i" };
  if (query.category) filter.category = query.category;
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    filter.price = {};
    if (query.minPrice !== undefined) filter.price.$gte = query.minPrice;
    if (query.maxPrice !== undefined) filter.price.$lte = query.maxPrice;
  }
  return Sweet.find(filter).lean();
}

export async function purchaseSweet(id: string, qty: number) {
  const sweet = await getSweetById(id);
  if (!sweet) {
    const err: any = new Error("Insufficient quantity");
    err.status = 400;
    throw err;
  }
  sweet.quantity -= qty;
  await sweet.save();
  return sweet;
}

export async function restockSweet(id: string, qty: number) {
  const sweet = await getSweetById(id);
  if (!sweet) {
    const err: any = new Error("Sweet not found");
    err.status = 404;
    throw err;
  }
  sweet.quantity += qty;
  await sweet.save();
  return sweet;
}
