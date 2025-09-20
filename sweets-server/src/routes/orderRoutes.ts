import { Router } from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
} from "../controllers/order.controller";
import { validateBody } from "../middlewares/validation.middleware";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "../validators/order.validator";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// User routes (require authentication)
router.post("/", requireAuth, validateBody(createOrderSchema), createOrder);
router.get("/my-orders", requireAuth, getUserOrders);
router.get("/:orderId", requireAuth, getOrderById);

// Admin routes (require admin authentication)
router.put(
  "/:orderId/status",
  requireAuth,
  validateBody(updateOrderStatusSchema),
  updateOrderStatus
);
router.get("/", requireAuth, getAllOrders);

export default router;
