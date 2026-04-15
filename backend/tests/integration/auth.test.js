// backend/tests/integration/auth.test.js
const request  = require("supertest");
const mongoose = require("mongoose");
const app      = require("../../src/app");
const User     = require("../../src/models/User");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/nestmate_test");
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("POST /api/v1/auth/register", () => {
  it("registers a new user and returns accessToken", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      name:     "Test User",
      email:    "test@nestmate.in",
      password: "Password1",
      role:     "seeker",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.email).toBe("test@nestmate.in");
  });

  it("rejects duplicate email", async () => {
    const payload = { name: "A", email: "dup@nestmate.in", password: "Password1", role: "seeker" };
    await request(app).post("/api/v1/auth/register").send(payload);
    const res = await request(app).post("/api/v1/auth/register").send(payload);
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects weak password", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      name: "Weak", email: "weak@nestmate.in", password: "pass", role: "seeker",
    });
    expect(res.statusCode).toBe(400);
  });
});

describe("POST /api/v1/auth/login", () => {
  it("logs in with valid credentials", async () => {
    await request(app).post("/api/v1/auth/register").send({
      name: "Login User", email: "login@nestmate.in", password: "Password1", role: "seeker",
    });
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "login@nestmate.in", password: "Password1",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it("rejects wrong password", async () => {
    await request(app).post("/api/v1/auth/register").send({
      name: "X", email: "x@nestmate.in", password: "Password1", role: "seeker",
    });
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "x@nestmate.in", password: "wrongpass",
    });
    expect(res.statusCode).toBe(401);
  });
});
