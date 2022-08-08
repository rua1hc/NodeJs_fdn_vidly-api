const Joi = require("joi");
const mongoose = require("mongoose");

const Genre = mongoose.model(
    "Genre",
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 50,
        },
    })
);

// ********* HELPER
function validateGenre(genre) {
    const scheme = Joi.object({
        name: Joi.string().min(3).required(),
    });
    return scheme.validate({ name: genre });
}

module.exports.Genre = Genre;
module.exports.validate = validateGenre;
