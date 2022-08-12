const _ = require("lodash");
const bcrypt = require("bcrypt");
// const config = require("config");
// const jwt = require("jsonwebtoken");

const express = require("express");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const { User, validate } = require("../models/user");

const router = express.Router();

// ********* GET
router.get("/", async (req, res) => {
    const users = await User.find().sort("name");
    res.send(users);
});

router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.send(user);
    } catch (ex) {
        console.log(ex.message);
        return res.status(404).send("The given user ID not found");
    }
});

// ********* POST
router.post("/", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("Email already registered");

    user = new User(_.pick(req.body, ["name", "email", "password"]));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));
    const token = user.generateAuthToken();

    try {
        await user.save();
        res.header("x-auth-token", token).send(
            _.pick(user, ["_id", "name", "email"])
        );
    } catch (ex) {
        for (const err in ex.errors) {
            console.log(ex.errors[err].message);
        }
    }
});

// ********* PUT
// router.put("/:id", async (req, res) => {
//     const { error } = validate(req.body);
//     if (error) return res.status(400).send(error.details[0].message);

//     try {
//         const user = await User.findByIdAndUpdate(
//             req.params.id,
//             { name: req.body.name, password: req.body.password },
//             { new: true }
//         );
//         res.send(user);
//     } catch (ex) {
//         console.log(ex.message);
//         return res.status(404).send("The given user ID not found");
//     }
// });

// ********* DELETE
// router.delete("/:id", async (req, res) => {
//     try {
//         const user = await User.findByIdAndRemove(req.params.id);
//         res.send(user);
//     } catch (ex) {
//         console.log(ex.message);
//         return res.status(404).send("The given user ID not found");
//     }
// });

module.exports = router;
