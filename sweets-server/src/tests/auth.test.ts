import request from "supertest";
import app from "../app";
import { User } from "../models/user.model";

describe("Auth Tests", () => {
  it(`registers a user`, async () => {
    const res = await request(app)
      .post(`/api/auth/register`)
      .send({ username: `ankit`, password: `123456` });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty(`user`);
    expect(res.body.user).toHaveProperty(`username`, `ankit`);

    expect(res.body.user).not.toHaveProperty(`password`);
    const saved = await User.findOne({ username: `ankit` });
    expect(saved).not.toBeNull();
  });

  it(`rejects duplicate username`, async () => {
    await request(app)
      .post(`/api/auth/register`)
      .send({ username: `ishang`, password: `123456` });

    //cheking duplicate -
    const res = await request(app)
      .post(`/api/auth/register`)
      .send({ username: `ishang`, password: `123456` });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(`message`, `Username already taken`);
  });

  it(`login returns token`, async () => {
    await request(app)
      .post(`/api/auth/register`)
      .send({ username: `aryan`, password: `1233456` });

    const res = await request(app)
      .post(`/api/auth/login`)
      .send({ username: `aryan`, password: `1233456` });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(`token`);
    expect(typeof res.body.token).toBe(`string`);
  });

  it(`rejects invalid credentials`, async () => {
    const res = await request(app)
      .post(`/api/auth/login`)
      .send({ username: `noexist`, password: `x` });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty(`message`, `Invalid credentials`);
  });

  it(`rejects short password on register`, async () => {
    const res = await request(app)
      .post(`/api/auth/register`)
      .send({ username: `tiny`, password: `123` });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(`message`, `Validation failed`);
    expect(res.body.errors[0]).toHaveProperty(`message`);
  });

  it(`reject missing username on login`, async () => {
    const res = await request(app)
      .post(`/api/auth/login`)
      .send({ password: `123456` });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(`message`, `Validation failed`);
  });
});
