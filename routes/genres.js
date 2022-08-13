const express = require("express");
const mongoose = require("mongoose");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
// const asyncMiddleware = require("../middleware/async");
const { Genre, validate } = require("../models/genre");

const router = express.Router();

// const genreSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         minlength: 2,
//         maxlength: 50,
//     },
// });

// const genres = [
//     { id: 1, name: "Action" },
//     { id: 2, name: "Comedy" },
//     { id: 3, name: "Romantic" },
// ];

// ********* GET
router.get("/", async (req, res) => {
    const genres = await Genre.find().sort("name");
    res.send(genres);
});
// router.get("/", async (req, res, next) => {
//     try {
//         const genres = await Genre.find().sort("name");
//         res.send(genres);
//     } catch (ex) {
//         next(ex);
//     }
// });

router.get("/:id", async (req, res) => {
    // const genre = genres.find((g) => g.id === parseInt(req.params.id));
    // if (!genre) return res.status(404).send("The given genre ID not found");
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send("The given genre ID not found");

    res.send(genre);
});

// ********* POST
router.post("/", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // const genre = {
    //     id: genres.length + 1,
    //     name: req.body.name,
    // };
    // genres.push(genre);
    // res.send(genre);

    let genre = new Genre({ name: req.body.name });
    // try {
    await genre.save();
    res.send(genre);
    // } catch (ex) {
    //     for (const err in ex.errors) {
    //         console.log(ex.errors[err].message);
    //     }
    // }
});

// ********* PUT
router.put("/:id", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // const genre = genres.find((g) => g.id === parseInt(req.params.id));
    // if (!genre) return res.status(404).send("The given genre ID not found");
    const genre = await Genre.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name },
        { new: true }
    );
    if (!genre) return res.status(404).send("The given genre ID not found");

    res.send(genre);

    // genre.name = req.body.name;
});

// ********* DELETE
router.delete("/:id", [auth, admin], async (req, res) => {
    // const genre = genres.find((g) => g.id === parseInt(req.params.id));
    // if (!genre) return res.status(404).send("The given genre ID not found");

    // const genre = await Genre.findByIdAndDelete(req.params.id);
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).send("The given genre ID not found");

    res.send(genre);

    // const index = genres.indexOf(genre);
    // genres.splice(index, 1);
});

module.exports = router;
