const request = require("supertest");
const app = require("../app");

describe("Home route", () => {
  it("should return welcome to the home API", async () => {
    const response = await request(app).get("/api/v1/");
    expect(response.text).toEqual("welcome to the home API");
  });
});
