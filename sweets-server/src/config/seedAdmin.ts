import { User } from "../models/user.model";
import { getEnv } from "../utils/getEnv";
import bcrypt from "bcryptjs";

const ADMIN_USERNAME = getEnv("ADMIN_USERNAME");
const ADMIN_PASSWORD = getEnv("ADMIN_PASSWORD");

export async function seedAdmin() {
  const ADMIN_USERNAME = getEnv("ADMIN_USERNAME");
  const ADMIN_PASSWORD = getEnv("ADMIN_PASSWORD");

  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    console.warn(
      `No ADMIN_USERNAME or ADMIN_PASSWORD set, skipping admin seed.`
    );
    return;
  }
  const existing = await User.findOne({ username: `anxit0731`, role: `admin` });

  if (existing) {
    console.log(`Admin user already exists`);
    return;
  }

  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await User.create({
    username: ADMIN_USERNAME,
    password: hashed,
    role: `admin`,
  });

  console.log(`Admin user "${ADMIN_USERNAME}" created.`);
}
