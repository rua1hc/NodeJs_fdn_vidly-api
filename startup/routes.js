const express = require("express");

const error = require("../middleware/error");

const movies = require("../routes/movies");
const genres = require("../routes/genres");
const customers = require("../routes/customers");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");
const home = require("../routes/home");

module.exports = function (app) {
    app.set("view engine", "pug");
    // app.set("views", "./views"); //default
    app.use(express.json());

    app.use("/api/movies", movies);
    app.use("/api/genres", genres);
    app.use("/api/customers", customers);
    app.use("/api/rentals", rentals);
    app.use("/api/users", users);
    app.use("/api/auth", auth);
    app.use("/", home);
    app.use(error);
};
