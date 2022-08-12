const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");
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
        minlength: 5,
        maxlength: 255,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        maxlength: 1024,
    },
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
    return token;
};

const User = mongoose.model("User", userSchema);

// ********* HELPER
function validateUser(user) {
    const scheme = Joi.object({
        name: Joi.string().min(1).max(50).required(),
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string().min(8).max(255).required(),
    });
    return scheme.validate({
        name: user.name,
        email: user.email,
        password: user.password,
    });
}

module.exports.User = User;
module.exports.validate = validateUser;
