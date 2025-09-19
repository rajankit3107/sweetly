import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import dotenv from "dotenv";

dotenv.config();

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri, {});
});

afterEach(async () => {
  const collections = await mongoose.connection.db?.collections();
  if (!collections) return;

  for (const coll of collections) {
    await coll.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});
