import express from "express";
import authRoutes from "./routes/authRoutes";
import { errorHandler } from "./middlewares/errorHandler.middleware";

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);

// health
app.get("/health", (_, res) => res.json({ ok: true }));

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
