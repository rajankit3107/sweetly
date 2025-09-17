import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";

dotenv.config();
const app = express();

const PORT = process.env.PORT ?? 3000;

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`hey there`);
});

connectDB();

app.listen(PORT, () => {
  console.log(`server is running on port${PORT}`);
});
