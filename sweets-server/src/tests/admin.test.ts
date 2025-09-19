import request from "supertest";
import app from "../app";
import { User } from "../models/user.model";
import { Sweet } from "../models/sweets.model";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

function tokenFor(id: string, username: string, role: string = "admin") {
  return jwt.sign({ id, username, role }, JWT_SECRET, { expiresIn: "1h" });
}

describe("Admin Routes", () => {
  let adminToken: string;
  let adminId: string;

  beforeEach(async () => {
    const admin = await User.create({
      username: "admin1",
      password: "x",
      role: "admin",
    });
    adminId = admin._id.toString();
    adminToken = tokenFor(adminId, "admin1", "admin");
  });

  it("creates a sweet", async () => {
    const res = await request(app)
      .post("/api/admin/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "jalebi", category: "Indian", price: 15, quantity: 10 });
    expect(res.status).toBe(201);
    expect(res.body.sweet).toHaveProperty("name", "jalebi");
  });

  it("restocks a sweet", async () => {
    const s = await Sweet.create({
      name: "rasgulla",
      category: "Indian",
      price: 25,
      quantity: 5,
    });
    const res = await request(app)
      .post(`/api/admin/sweets/${s._id}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantity: 5 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("quantity", 10);
  });
});
