const Joi = require("joi");
const mongoose = require("mongoose");

const Rental = mongoose.model(
    "Rental",
    new mongoose.Schema({
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 255,
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
function validateRental(movie) {
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

module.exports.Rental = Rental;
module.exports.validate = validateRental;
