const express = require("express");
const validate = require("../middleware/validate");
const fawn = require("fawn");
const moment = require("moment");
const Joi = require("joi");
const auth = require("../middleware/auth");
const { Movie } = require("../models/movie");
const { Rental } = require("../models/rental");
const router = express.Router();

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const { customerId, movieId } = req.body;
  const rental = await Rental.LookUp(customerId, movieId);

  if (!rental) return res.status(404).send("Rental not found");

  if (rental.dateReturned)
    return res.status(400).send("Return already processed");

  rental.return();
  await rental.save();

  await Movie.updateOne(
    { _id: rental.movie._id },
    {
      $inc: { numberInStock: 1 },
    }
  );
  return res.send(rental);
});

function validateReturn(returned) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(returned);
}

module.exports = router;
