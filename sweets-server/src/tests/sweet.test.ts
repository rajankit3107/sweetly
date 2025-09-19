import app from "../app";
import { User } from "../models/user.model";
import { getEnv } from "../utils/getEnv";
import jwt from "jsonwebtoken";
import request from "supertest";

const JWT_SECRET = getEnv("JWT_SECRET");

function tokenFor(username: string, id: string, role: string = "user") {
  return jwt.sign({ id, username, role }, JWT_SECRET, { expiresIn: "1h" });
}

describe("Sweet Inventory Tests", () => {
  let userToken: string;
  let adminToken: string;
  let userId: string;
  let adminId: string;

  beforeEach(async () => {
    const user = await User.create({
      username: "u",
      password: "x",
      role: "user",
    });
    const admin = await User.create({
      username: "a",
      password: "x",
      role: "admin",
    });
    userId = user.id;
    adminId = admin.id;
    userToken = tokenFor("u", userId, "user");
    const adminToken = tokenFor("a", adminId, "admin");
  });

  it(`create a sweet(protected)`, async () => {
    const res = await request(app)
      .post(`/api/sweets`)
      .send({ name: `laddu`, catogery: "Indian", price: 10, quantity: 5 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty(`name`, `laddu`);
  });

  it(`list sweets`, async () => {});
});
