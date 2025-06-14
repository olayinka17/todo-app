const request = require("supertest");
const app = require("../app");
const { connect } = require("./database");

describe("tasks API", () => {
  let conn;
  let token;
  beforeAll(async () => {
    conn = await connect();
  });
  beforeEach(async () => {
    const response = await request(app).post("/api/v1/users/signup").send({
      username: "daniel",
      email: "daniel@gmail.com",
      password: "daniel1234",
      confirmedPassword: "daniel1234",
    });
    token = response.body.token;
  });
  afterEach(async () => {
    await conn.cleanup();
  });
  afterAll(async () => {
    await conn.disconnect();
  });

  it("should return 201", async () => {
    const response = await request(app)
      .post("/api/v1/tasks")
      .set("authorization", `Bearer ${token}`)
      .send({
        title: "hores",
        content: "I really need to sweep.",
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("task");
  });

  it("should return 200", async () => {
    await request(app)
      .post("/api/v1/tasks")
      .set("authorization", `Bearer ${token}`)
      .send({
        title: "Chores",
        content: "I really need to sweep.",
      });
    const response = await request(app)
      .get("/api/v1/tasks")
      .set("authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("tasks");
  });

  it("should return 404 when task is not found", async () => {
    const response = await request(app)
      .patch("/api/v1/tasks/68474a18ca19357ad2f7549f")
      .set("authorization", `Bearer ${token}`)
      .send({
        status: "completed",
      });

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("status", "fail");
    expect(response.body).toHaveProperty(
      "message",
      "specified task with the id not found"
    );
  });

  it("should return 200", async () => {
    const newtask = await request(app)
      .post("/api/v1/tasks/")
      .set("authorization", `Bearer ${token}`)
      .send({
        title: "Chores",
        content: "I really need to sweep.",
        state: "completed",
      });

    const taskId = newtask.body.data.task._id;

    const response = await request(app)
      .delete(`/api/v1/tasks/${taskId}`)
      .set("authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("status", "success");
  });
});
