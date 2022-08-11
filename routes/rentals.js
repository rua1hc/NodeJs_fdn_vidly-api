const express = require("express");
const mongoose = require("mongoose");
const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");

const router = express.Router();

// ********* GET
router.get("/", async (req, res) => {
    const rentals = await Rental.find().sort("-dateOut");
    res.send(rentals);
});

// router.get("/:id", async (req, res) => {
//     try {
//         const movie = await Rental.findById(req.params.id);
//         res.send(movie);
//     } catch (ex) {
//         console.log(ex.message);
//         return res.status(404).send("The given movie ID not found");
//     }
// });

// ********* POST
router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const movie = await Movie.findById(req.body.movieId);
        if (!movie) return res.status(404).send("Invalid movieId");

        const customer = await Customer.findById(req.body.customerId);
        if (!customer) return res.status(404).send("Invalid customerId");

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
    }
});

// ********* PUT
// router.put("/:id", async (req, res) => {
//     const { error } = validate(req.body);
//     if (error) return res.status(400).send(error.details[0].message);

//     try {
//         const genre = await Genre.findById(req.body.genreId);
//         if (!genre)
//             return res.status(404).send("The given genreId is not found");

//         const movie = await Rental.findByIdAndUpdate(
//             req.params.id,
//             {
//                 title: req.body.title,
//                 genre: {
//                     _id: genre._id,
//                     name: genre.name,
//                 },
//                 numberInStock: req.body.numberInStock,
//                 dailyRentalRate: req.body.dailyRentalRate,
//             },
//             { new: true }
//         );
//         res.send(movie);
//     } catch (ex) {
//         console.log(ex.message);
//         return res.status(404).send("The given movie ID not found");
//     }
// });

// ********* DELETE
// router.delete("/:id", async (req, res) => {
//     try {
//         const movie = await Rental.findByIdAndRemove(req.params.id);
//         res.send(movie);
//     } catch (ex) {
//         console.log(ex.message);
//         return res.status(404).send("The given movie ID not found");
//     }
// });

module.exports = router;
