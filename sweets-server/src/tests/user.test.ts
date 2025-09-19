import request from "supertest";
import app from "../app";
import { User } from "../models/user.model";
import { Sweet } from "../models/sweets.model";
import jwt from "jsonwebtoken";
import { getEnv } from "../utils/getEnv";

const JWT_SECRET = getEnv("JWT_SECRET");

function tokenFor(id: string, username: string, role: string = "user") {
  return jwt.sign({ id: id.toString(), username, role }, JWT_SECRET, {
    expiresIn: "1h",
  });
}

describe("User Routes", () => {
  let userToken: string;
  let userId: string;

  beforeEach(async () => {
    const user = await User.create({
      username: "john",
      password: "x",
      role: "user",
    });
    userId = user._id.toString();
    userToken = tokenFor(userId, "john", "user");
  });

  it("lists sweets", async () => {
    await Sweet.create({
      name: "barfi",
      category: "Indian",
      price: 20,
      quantity: 10,
    });
    const res = await request(app).get("/api/user/sweets");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("purchases a sweet", async () => {
    const s = await Sweet.create({
      name: "laddu",
      category: "Indian",
      price: 10,
      quantity: 5,
    });
    const res = await request(app)
      .post(`/api/user/sweets/${s._id}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 2 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("quantity", 3);
  });
});
