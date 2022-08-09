const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
});

const Genre = mongoose.model("Genre", genreSchema);

// ********* HELPER
function validateGenre(genre) {
    const scheme = Joi.object({
        name: Joi.string().min(3).max(50).required(),
    });
    return scheme.validate({ name: genre });
}

module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;
module.exports.validate = validateGenre;
