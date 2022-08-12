const Joi = require("joi");
const _ = require("lodash");
const bcrypt = require("bcrypt");
// const config = require("config");
// const jwt = require("jsonwebtoken");
const express = require("express");
const mongoose = require("mongoose");

const { User } = require("../models/user");

const router = express.Router();

// ********* GET
// router.get("/", async (req, res) => {
//     const users = await User.find().sort("name");
//     res.send(users);
// });

// router.get("/:id", async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);
//         res.send(user);
//     } catch (ex) {
//         console.log(ex.message);
//         return res.status(404).send("The given user ID not found");
//     }
// });

// ********* POST
router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password");

    const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
    );
    if (!validPassword)
        return res.status(400).send("Invalid email or password");

    // const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));
    const token = user.generateAuthToken();
    res.send(token);
});

// ********* HELPER
function validate(req) {
    const scheme = Joi.object({
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string().min(8).max(255).required(),
    });
    return scheme.validate({
        email: req.email,
        password: req.password,
    });
}

module.exports = router;
