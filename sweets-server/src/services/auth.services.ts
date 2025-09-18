import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { getEnv } from "../utils/getEnv";
import bcrypt from "bcryptjs";

const JWT_SECRET = getEnv("JWT_SECRET");
const JWT_EXPIRY = getEnv("JWT_EXPIRY");

export async function register(
  username: string,
  password: string,
  role: string = "user"
) {
  const existingUser = await User.findOne({ username });
  if (existingUser) throw ApiError.badRequest(`Username already taken`);

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    password: hashedPassword,
    role,
  });

  return { id: user._id, username: user.username, role: user.role };
}
