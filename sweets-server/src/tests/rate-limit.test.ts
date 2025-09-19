import request from "supertest";

// Enable rate limiter for this test file only
process.env.ENABLE_RATE_LIMIT = "true";

import app from "../app";

describe("Rate Limiting", () => {
  it("returns 429 after exceeding auth limit", async () => {
    for (let i = 0; i < 10; i++) {
      await request(app)
        .post(`/api/auth/login`)
        .send({ username: `user-${i}`, password: `wrong` });
    }

    const res = await request(app)
      .post(`/api/auth/login`)
      .send({ username: `user-10`, password: `wrong` });

    expect(res.status).toBe(429);
    expect(res.body).toHaveProperty("message");
  });
});
