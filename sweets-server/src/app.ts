import express from "express";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import orderRoutes from "./routes/orderRoutes";
import cors from "cors";

const app = express();

app.use(express.json({ type: ["application/json", "text/plain", "*/json"] }));
app.use(
  cors({
    origin: "*",
  })
);

// Rate limiting (skip during tests unless explicitly enabled)
const enableRateLimit =
  process.env.NODE_ENV !== "test" || process.env.ENABLE_RATE_LIMIT === "true";
if (enableRateLimit) {
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 50,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests, please try again later." },
  });

  const authLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many auth attempts, please try again later." },
  });

  app.use("/api/", apiLimiter);
  app.use("/api/auth", authLimiter);
}
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);

// health
app.get("/health", (_, res) => res.json({ ok: true }));

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
