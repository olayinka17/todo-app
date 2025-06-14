const request = require("supertest");
const app = require("../app");
const { connect } = require("./database");
describe("user endpoints", () => {
  let conn;
  beforeAll(async () => {
    conn = await connect();
  });
  afterEach(async () => {
    await conn.cleanup();
  });
  afterAll(async () => {
    await conn.disconnect();
  });

  it("should return 201", async () => {
    const response = await request(app).post("/api/v1/users/signup").send({
      username: "ayinka",
      email: "ayinka@gmail.com",
      password: "icui4ceeu",
      confirmedPassword: "icui4ceeu",
    });
    //console.log(await User.find());
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("user");
  });

  it("should return 200", async () => {
    await request(app).post("/api/v1/users/signup").send({
      username: "yinka",
      email: "yinka@gmail.com",
      password: "yinka1234",
      confirmedPassword: "yinka1234",
    });
    const response = await request(app).post("/api/v1/users/login").send({
      email: "yinka@gmail.com",
      password: "yinka1234",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("user");
  });

  it("should return 200", async () => {
    await request(app).post("/api/v1/users/signup").send({
      username: "Fola",
      email: "fola@gmail.com",
      password: "fola1234",
      confirmedPassword: "fola1234",
    });

    await request(app).post("/api/v1/users/login").send({
      email: "fola@gmail.com",
      password: "fola1234",
    });

    const response = await request(app).get("/api/v1/users/logout");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("status", "success");
  });
});
