const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");

describe("validateObjectId middleware", () => {
  let _id;
  let token;

  beforeEach(async () => {
    server = require("../../index");

    const genre = new Genre({ name: "genre1" });
    await genre.save();

    _id = genre._id;
    const user = { _id, isAdmin: true };
    token = new User(user).generateAuthToken();
  });
  afterEach(async () => {
    await server.close();
    await Genre.remove({});
  });

  const exec = () => {
    return request(server)
      .delete(`/api/genres/${_id}`)
      .set("x-auth-token", token);
  };

  it("Should return 404 with invalid Id", async () => {
    _id = 1234;
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("Should return 200 with valid data", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
