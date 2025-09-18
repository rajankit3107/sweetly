import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { getEnv } from "../utils/getEnv";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";

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

export async function login(username: string, password: string) {
  const user = await User.findOne({ username });

  if (!user) throw ApiError.unauthorized(`Invalid credentials`);

  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) throw ApiError.unauthorized(`Invalid credentials`);

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY } as SignOptions
  );
}
