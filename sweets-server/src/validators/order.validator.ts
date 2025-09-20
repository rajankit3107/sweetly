import { z } from "zod";

export const orderItemSchema = z.object({
  sweetId: z.string().min(1, "Sweet ID is required"),
  sweetName: z.string().min(1, "Sweet name is required"),
  price: z.number().min(0, "Price must be positive"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export const deliveryDetailsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  pincode: z.string().min(6, "Pincode must be at least 6 digits"),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
  totalAmount: z.number().min(0, "Total amount must be positive"),
  deliveryFee: z.number().min(0, "Delivery fee must be positive"),
  finalAmount: z.number().min(0, "Final amount must be positive"),
  deliveryDetails: deliveryDetailsSchema,
  paymentMethod: z.enum(["cod", "upi", "card"]),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "preparing",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ]),
  deliveryDate: z
    .string()
    .optional()
    .transform((str) => (str ? new Date(str) : undefined)),
});
