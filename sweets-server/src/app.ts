import express from "express";

const app = express();

app.use(express.json());

// health
app.get("/health", (_, res) => res.json({ ok: true }));

export default app;
