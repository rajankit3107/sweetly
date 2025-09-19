import { Router } from "express";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validation.middleware";
import {
  createSweetSchema,
  restockSchema,
  updateSweetSchema,
} from "../validators/sweet.validator";
import {
  createSweet,
  deleteSweet,
  restockSweet,
  updateSweet,
} from "../controllers/admin.sweetcontroller";

const router = Router();

router.post(
  "/sweets",
  requireAuth,
  requireAdmin,
  validateBody(createSweetSchema),
  createSweet
);

router.put(
  "/sweets/:id",
  requireAuth,
  requireAdmin,
  validateBody(updateSweetSchema),
  updateSweet
);

router.delete("/sweets/:id", requireAuth, requireAdmin, deleteSweet);

router.post(
  "/sweets/:id/restock",
  requireAuth,
  requireAdmin,
  validateBody(restockSchema),
  restockSweet
);

export default router;
