import { z } from "zod";

export const createSweetSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  price: z.number().min(0),
  quantity: z.number().int().min(0),
  description: z.string().optional(),
});

export const updateSweetSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  price: z.number().min(0).optional(),
  quantity: z.number().int().min(0).optional(),
  description: z.string().optional(),
});

export const purchaseSchema = z.object({
  quantity: z.number().int().min(1).optional().default(1),
});

export const restockSchema = z.object({
  quantity: z.number().int().min(1),
});
