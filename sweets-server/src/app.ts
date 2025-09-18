import express from "express";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);

// health
app.get("/health", (_, res) => res.json({ ok: true }));

export default app;
