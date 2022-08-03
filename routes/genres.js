const express = require("express");
const Joi = require("joi");

const router = express.Router();

const genres = [
    { id: 1, title: "Action" },
    { id: 2, title: "Comedy" },
    { id: 3, title: "Romantic" },
];

// ********* GET
router.get("/", (req, res) => {
    res.send(genres);
});

router.get("/:id", (req, res) => {
    const genre = genres.find((g) => g.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send("The given genre ID not found");

    res.send(genre);
});

// ********* POST
router.post("/", (req, res) => {
    const { error } = validateGenre(req.body.title);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = {
        id: genres.length + 1,
        title: req.body.title,
    };
    genres.push(genre);
    res.send(genre);
});

// ********* PUT
router.put("/:id", (req, res) => {
    const genre = genres.find((g) => g.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send("The given genre ID not found");

    const { error } = validateGenre(req.body.title);
    if (error) return res.status(400).send(error.details[0].message);

    genre.title = req.body.title;
    res.send(genre);
});

// ********* DELETE
router.delete("/:id", (req, res) => {
    const genre = genres.find((g) => g.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send("The given genre ID not found");

    const index = genres.indexOf(genre);
    genres.splice(index, 1);
    res.send(genre);
});

// ********* HELPER
function validateGenre(genre) {
    const scheme = Joi.object({
        title: Joi.string().min(3).required(),
    });
    return scheme.validate({ title: genre });
}

module.exports = router;
