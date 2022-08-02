const express = require("express");
const Joi = require("joi");

const app = express();
app.use(express.json());

const genres = [
    { id: 1, title: "Action" },
    { id: 2, title: "Comedy" },
    { id: 3, title: "Romantic" },
];

// ********* GET
app.get("/api/genres", (req, res) => {
    res.send(genres);
});

app.get("/api/genres/:id", (req, res) => {
    const genre = genres.find((g) => g.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send("The given genre ID not found");

    res.send(genre);
});

// ********* POST
app.post("/api/genres", (req, res) => {
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
app.put("/api/genres/:id", (req, res) => {
    const genre = genres.find((g) => g.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send("The given genre ID not found");

    const { error } = validateGenre(req.body.title);
    if (error) return res.status(400).send(error.details[0].message);

    genre.title = req.body.title;
    res.send(genre);
});

// ********* DELETE
app.delete("/api/genres/:id", (req, res) => {
    const genre = genres.find((g) => g.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send("The given genre ID not found");

    const index = genres.indexOf(genre);
    genres.splice(index, 1);
    res.send(genre);
});

// ********* LISTEN
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

// ********* HELPER
function validateGenre(genre) {
    const scheme = Joi.object({
        title: Joi.string().min(3).required(),
    });
    return scheme.validate({ title: genre });
}
