import app from "../app";
import { Sweet } from "../models/sweets.model";
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
    adminToken = tokenFor("a", adminId, "admin");
  });

  it(`create a sweet(protected)`, async () => {
    const res = await request(app)
      .post(`/api/sweets`)
      .send({ name: `laddu`, catogery: "Indian", price: 10, quantity: 5 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty(`name`, `laddu`);
  });

  it(`list sweets`, async () => {
    await Sweet.create({
      name: `gulab jamun`,
      catogery: "Indian",
      price: 35,
      quantity: 30,
      description: `Indian dessert`,
    });
  });

  it(`searches sweets by name and price range`, async () => {
    await Sweet.create({
      name: `gulab jamun`,
      catogery: `Indian`,
      price: 35,
      quantity: 10,
    });

    await Sweet.create({
      name: `rasgulla`,
      catogery: `Indian`,
      price: 20,
      quantity: 10,
    });

    const res = await request(app)
      .get(`/api/sweets/search`)
      .query({ name: `g`, minPrice: 30, maxPrice: 60 });

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty(`name`, `gulab jamun`);
  });

  it("purchases a sweet decreasing quantity", async () => {
    const s = await Sweet.create({
      name: "noj",
      category: "cat",
      price: 5,
      quantity: 3,
    });
    const res = await request(app)
      .post(`/api/sweets/${s._id}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 2 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("quantity", 1);
  });

  it("prevents purchase if insufficient", async () => {
    const s = await Sweet.create({
      name: "zzz",
      category: "cat",
      price: 5,
      quantity: 1,
    });
    const res = await request(app)
      .post(`/api/sweets/${s._id}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 2 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "Insufficient quantity");
  });

  it("restocks only admin", async () => {
    const s = await Sweet.create({
      name: "rest",
      category: "cat",
      price: 5,
      quantity: 1,
    });
    // non-admin
    const res1 = await request(app)
      .post(`/api/sweets/${s._id}/restock`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 5 });
    expect(res1.status).toBe(403);

    // admin
    const res2 = await request(app)
      .post(`/api/sweets/${s._id}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantity: 5 });
    expect(res2.status).toBe(200);
    expect(res2.body).toHaveProperty("quantity", 6);
  });

  it("delete sweet only admin", async () => {
    const s = await Sweet.create({
      name: "del",
      category: "cat",
      price: 2,
      quantity: 2,
    });
    // non-admin attempt
    const r1 = await request(app)
      .delete(`/api/sweets/${s._id}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(r1.status).toBe(403);

    // admin delete
    const r2 = await request(app)
      .delete(`/api/sweets/${s._id}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(r2.status).toBe(200);
    expect(r2.body).toHaveProperty("message", "Deleted");
  });
});
