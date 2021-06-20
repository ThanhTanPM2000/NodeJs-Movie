let server;
const mongoose = require("mongoose");
const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    await Genre.remove();
  });

  describe("GET /", () => {
    it("Should return all genres", async () => {
      await Genre.insertMany([{ name: "genre1" }, { name: "genre2" }]);

      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((x) => x.name === "genre2")).toBeTruthy();
    });
  });

  describe("Get /:id", () => {
    it("Should return a genre with an id", async () => {
      const genre = await Genre({ name: "genre1" });
      await genre.save();

      const res = await request(server).get(`/api/genres/${genre._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
      expect(res.body).toHaveProperty("_id", genre._id.toHexString());
    });

    it("Should return 404 with invalid Id is passed", async () => {
      const res = await request(server).get(`/api/genres/423432`);

      expect(res.status).toBe(404);
    });

    it("Should return 404 with no genre not found", async () => {
      const _id = mongoose.Types.ObjectId().toHexString();
      const res = await request(server).get(`/api/genres/${_id}`);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let token;
    let name;

    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genre1";
    });

    it("Should return status 401 when user not log in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("Should return status 400 when user input name less than 4 character", async () => {
      name = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("Should return status 400 when user input name more than 52 character", async () => {
      name = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("Should save genre in db with valid name passed", async () => {
      await exec();

      const genre = await Genre.find({ name: "genre1" });

      expect(genre).not.toBeNull();
    });

    it("Should return genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });

  describe("PUT /:id", () => {
    let _id;
    let name;

    const exec = async () => {
      return await request(server).put(`/api/genres/${_id}`).send({ name });
    };

    beforeEach(async () => {
      const genre = await Genre({ name: "genre1" });
      await genre.save();

      _id = genre._id;
      name = "Nguyen Thanh Tan";
    });

    it("Should return 404 with invalid Object id", async () => {
      _id = 1234;
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("Should return status 400 with data is invalid", async () => {
      name = "1234";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("Should return 404 with given id not found", async () => {
      _id = mongoose.Types.ObjectId().toHexString();

      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("Should return genre with updated date", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("name", "Nguyen Thanh Tan");
      expect(res.status).toBe(200);
    });
  });

  describe("DELETE /:id", () => {
    let _id;
    let token;

    const exec = async () => {
      return await request(server)
        .delete(`/api/genres/${_id}`)
        .set("x-auth-token", token);
    };

    beforeEach(async () => {
      const genre = await Genre({ name: "genre1" });
      await genre.save();

      _id = genre._id;
      const user = { _id, isAdmin: true };
      token = new User(user).generateAuthToken();
    });

    it("Should return 401 if token is null string", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("Should return 400 if not token invalid", async () => {
      token = "1234";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("Should return 403 if access denied", async () => {
      token = new User({ isAdmin: false }).generateAuthToken();
      const res = await exec();
      expect(res.status).toBe(403);
    });

    it("Should return 404 with id genre not found", async () => {
      _id = mongoose.Types.ObjectId().toHexString();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("Should return 200 if valid input", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });
});
