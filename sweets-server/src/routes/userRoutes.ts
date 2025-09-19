import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validation.middleware";
import { purchaseSchema } from "../validators/sweet.validator";
import {
  listSweets,
  purchaseSweets,
  searchSweets,
} from "../controllers/user.sweetController";

const router = Router();

router.get("/sweets", listSweets);
router.get("/sweets/search", searchSweets);
router.post(
  "/sweets/:id/purchase",
  requireAuth,
  validateBody(purchaseSchema),
  purchaseSweets
);

export default router;
