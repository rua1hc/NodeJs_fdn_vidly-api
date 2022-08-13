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

router.get("/me", auth, async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    // if (!user) return res.status(404).send("The given user ID not found");
    res.send(user);
});

router.get("/:id", async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("The given user ID not found");

    res.send(user);
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
    await user.save();

    // const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));
    const token = user.generateAuthToken();
    res.header("x-auth-token", token).send(
        _.pick(user, ["_id", "name", "email"])
    );
});

// ********* PUT
// router.put("/:id", async (req, res) => {});

// ********* DELETE
// router.delete("/:id", async (req, res) => {});

module.exports = router;
