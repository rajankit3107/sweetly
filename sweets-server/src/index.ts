import dotenv from "dotenv";
import connectDB from "./config/db";
import app from "./app";
import { seedAdmin } from "./config/seedAdmin";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    await connectDB();
    await seedAdmin();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
}

main();
