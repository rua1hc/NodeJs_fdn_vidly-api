const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

const Movie = mongoose.model(
    "Movie",
    new mongoose.Schema({
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 255,
        },
        genre: {
            // type: mongoose.Schema.Types.ObjectId,
            // ref: "genreSchema",
            type: genreSchema,
            required: true,
        },
        numberInStock: {
            type: Number,
            required: true,
            min: 0,
            max: 255,
        },
        dailyRentalRate: {
            type: Number,
            required: true,
            min: 0,
            max: 255,
        },
    })
);

// ********* HELPER
function validateMovie(movie) {
    const scheme = Joi.object({
        title: Joi.string().min(1).max(255).required(),
        genreId: Joi.string().required(),
        numberInStock: Joi.number().integer().min(0).max(255).required(),
        dailyRentalRate: Joi.number().min(0).max(255).required(),
    });
    return scheme.validate({
        title: movie.title,
        genreId: movie.genreId,
        numberInStock: movie.numberInStock,
        dailyRentalRate: movie.dailyRentalRate,
    });
}

module.exports.Movie = Movie;
module.exports.validate = validateMovie;
