const express = require("express");
const mongoose = require("mongoose");
const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");

const router = express.Router();

// ********* GET
router.get("/", async (req, res) => {
    const movies = await Movie.find().sort("name");
    res.send(movies);
});

router.get("/:id", async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        res.send(movie);
    } catch (ex) {
        console.log(ex.message);
        return res.status(404).send("The given movie ID not found");
    }
});

// ********* POST
router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const genre = await Genre.findById(req.body.genreId);
        if (!genre)
            return res.status(404).send("The given genreId is not found");

        let movie = new Movie({
            title: req.body.title,
            // genre: genre,
            genre: {
                _id: genre._id,
                name: genre.name,
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate,
        });

        movie = await movie.save();
        res.send(movie);
    } catch (ex) {
        for (const err in ex.errors) {
            console.log(ex.errors[err].message);
        }
    }
});

// ********* PUT
router.put("/:id", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const genre = await Genre.findById(req.body.genreId);
        if (!genre)
            return res.status(404).send("The given genreId is not found");

        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                genre: {
                    _id: genre._id,
                    name: genre.name,
                },
                numberInStock: req.body.numberInStock,
                dailyRentalRate: req.body.dailyRentalRate,
            },
            { new: true }
        );
        res.send(movie);
    } catch (ex) {
        console.log(ex.message);
        return res.status(404).send("The given movie ID not found");
    }
});

// ********* DELETE
router.delete("/:id", async (req, res) => {
    try {
        const movie = await Movie.findByIdAndRemove(req.params.id);
        res.send(movie);
    } catch (ex) {
        console.log(ex.message);
        return res.status(404).send("The given movie ID not found");
    }
});

module.exports = router;
