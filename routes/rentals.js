const express = require("express");
const mongoose = require("mongoose");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const { Rental, validate } = require("../models/rental");
const auth = require("../middleware/auth");

const router = express.Router();

// ********* GET
router.get("/", async (req, res) => {
    const rentals = await Rental.find().sort("-dateOut");
    res.send(rentals);
});

router.get("/:id", async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).send("The given rental ID not found");

    res.send(rental);
});

// ********* POST
router.post("/", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send("Invalid movieId");

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send("Invalid customerId");

    if (movie.numberInStock === 0)
        return res.status(400).send("Movie not in stock");

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            // isGold: customer.isGold,
            phone: customer.phone,
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate,
        },
        // dateOut: Date.now,
    });

    try {
        const session = await mongoose.startSession();
        await session.withTransaction(async () => {
            movie.numberInStock--;
            await movie.save();

            await rental.save();
            res.send(rental);
        });
        session.endSession();
    } catch (ex) {
        for (const err in ex.errors) {
            console.log(ex.errors[err].message);
        }
        res.status(500).send("Something failed..");
    }
});

// ********* PUT
// router.put("/:id", async (req, res) => {});

// ********* DELETE
// router.delete("/:id", async (req, res) => {});

module.exports = router;
