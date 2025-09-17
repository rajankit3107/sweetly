import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function connectDB() {
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) throw new Error(`mongoUrl environment variable is not set`);

  await mongoose
    .connect(mongoUrl)
    .then(() => console.log(`Connected to database ✅`))
    .catch((err) => console.log(`Error connecting to database ❌`, err));
}

export default connectDB;
