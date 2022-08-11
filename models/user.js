const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 50,
    },
});

const User = mongoose.model("User", userSchema);

// ********* HELPER
function validateUser(user) {
    const scheme = Joi.object({
        name: Joi.string().min(1).max(50).required(),
        email: Joi.string().required(),
        password: Joi.string().min(8).max(50).required(),
    });
    return scheme.validate({ name: user });
}

module.exports.User = User;
module.exports.validate = validateUser;
