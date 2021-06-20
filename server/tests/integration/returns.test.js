const { Rental } = require("../../models/rental");
const moment = require("moment");
const request = require("supertest");
const mongoose = require("mongoose");
const { User } = require("../../models/user");
const { Movie } = require("../../models/movie");

describe("/api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let token;

  beforeEach(async () => {
    server = require("../../index");

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    movie = new Movie({
      _id: movieId,
      title: "Star war",
      genre: {
        name: "Fantasy",
      },
      numberInStock: 2,
      dailyRentalRate: 2,
    });

    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "Nguyen Thanh Tan",
        phone: "123456",
      },
      movie: {
        _id: movieId,
        title: "Star war",
        dailyRentalRate: 2,
      },
    });

    await rental.save();
  });

  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  afterEach(async () => {
    await server.close();
    await Rental.remove({});
  });

  it("should return 401 if client is not logged in", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should return 400 if customerId is not provided", async () => {
    customerId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if movieId is not provided", async () => {
    movieId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 404 if no rental found for the customerId/movieId", async () => {
    await Rental.remove({});
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should return 400 if return already processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if we have a valid request", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it("should set a returnDate if input is valid", async () => {
    await exec();

    const rentalInDb = await Rental.findById(rental._id);
    const dif = new Date() - rentalInDb.dateReturned;
    expect(dif).toBeLessThan(5000);
  });

  it("should calculate the rental fee", async () => {
    rental.dateOut = moment().add(-7, "days").toDate();
    await rental.save();

    await exec();

    const rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb.rentalFee).toBe(14);
  });

  it("should increase the stock in db", async () => {
    await exec();

    const movieInDb = await Movie.findById(movieId);

    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });

  it("should return the rental if valid", async () => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);

    expect(res.body).toHaveProperty("dateOut");
    expect(res.body).toHaveProperty("dateReturned");
    expect(res.body).toHaveProperty("rentalFee");
    expect(res.body).toHaveProperty("customer");
    expect(res.body).toHaveProperty("movie");

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        "dateOut",
        "dateReturned",
        "rentalFee",
        "customer",
        "movie",
      ])
    );
  });
});
