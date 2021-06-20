const express = require("express");
const genres = require("../routes/genres");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const returns = require("../routes/returns");
const auth = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/apis/genres", genres);
  app.use("/apis/customers", customers);
  app.use("/apis/movies", movies);
  app.use("/apis/rentals", rentals);
  app.use("/apis/users", users);
  app.use("/apis/auth", auth);
  app.use("/apis/returns", returns);
  app.use(error);
};
